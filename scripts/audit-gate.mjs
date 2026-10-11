import { exec } from "node:child_process";

// `npm audit --audit-level=high` cannot ignore an individual advisory, so a single
// unfixable transitive finding would disable the gate for every future one. This
// wrapper keeps the gate failing on high/critical, minus an explicit allowlist that
// expires on its own and errors if an entry stops matching.

const ALLOWLIST = [
  {
    source: 1240992,
    advisory: "GHSA-vfj7-8cjw-p6xm",
    package: "braces",
    reason:
      "Stack-exhaustion DoS, range <=3.0.3 with 3.0.3 the newest published version, so no patched release exists. Reached only via eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch, which runs at lint time over our own file paths and is never bundled into the app. The only npm-suggested fix downgrades eslint-config-next to 14.2.35, incompatible with Next 16.",
    expires: "2027-04-01",
  },
];

const FAIL_ON = new Set(["high", "critical"]);

function runAudit() {
  return new Promise((resolve, reject) => {
    // A shell is needed because Node refuses to execFile a .cmd shim on Windows.
    // The command is a fixed string with no interpolation.
    exec("npm audit --json", { maxBuffer: 64 * 1024 * 1024 }, (error, stdout) => {
      // npm audit exits non-zero when it finds anything, so stdout is what matters.
      if (!stdout) return reject(error ?? new Error("npm audit produced no output"));
      try {
        resolve(JSON.parse(stdout));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

function collectAdvisories(report) {
  const found = new Map();
  for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      if (typeof via !== "object" || !FAIL_ON.has(via.severity)) continue;
      if (found.has(via.source)) continue;
      found.set(via.source, {
        source: via.source,
        package: via.name,
        title: via.title,
        url: via.url,
        severity: via.severity,
        range: via.range,
      });
    }
  }
  return found;
}

const today = new Date().toISOString().slice(0, 10);
const report = await runAudit();
const advisories = collectAdvisories(report);

const expired = ALLOWLIST.filter((entry) => entry.expires <= today);
const stale = ALLOWLIST.filter((entry) => !advisories.has(entry.source));
const allowed = new Set(
  ALLOWLIST.filter((entry) => entry.expires > today).map((entry) => entry.source),
);
const blocking = [...advisories.values()].filter((item) => !allowed.has(item.source));

for (const item of blocking) {
  console.error(`[${item.severity}] ${item.package} ${item.range} — ${item.title}`);
  console.error(`  ${item.url}`);
}

for (const entry of expired) {
  console.error(
    `Allowlist entry ${entry.advisory} (${entry.package}) expired on ${entry.expires}. Re-check whether a fix exists, then bump or remove it.`,
  );
}

for (const entry of stale) {
  console.error(
    `Allowlist entry ${entry.advisory} (${entry.package}) no longer matches any advisory. Remove it from scripts/audit-gate.mjs.`,
  );
}

if (blocking.length || expired.length || stale.length) {
  process.exit(1);
}

const waived = ALLOWLIST.length - stale.length;
console.log(
  `No unwaived high or critical advisories (${waived} waived, ${advisories.size} seen).`,
);
