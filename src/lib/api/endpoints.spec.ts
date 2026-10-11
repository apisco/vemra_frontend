import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { ENDPOINTS } from "@/lib/api/endpoints";
import { API_CONFIG } from "@/config/api";

interface OpenApiDocument {
  paths: Record<string, Record<string, unknown>>;
}

const SPEC_PATH = fileURLToPath(
  new URL("../../../docs/openapi.json", import.meta.url),
);

const spec = JSON.parse(readFileSync(SPEC_PATH, "utf8")) as OpenApiDocument;

const SAMPLE_ID = "550e8400-e29b-41d4-a716-446655440000";

function specPathMatchers(): readonly { template: string; pattern: RegExp }[] {
  return Object.keys(spec.paths).map((template) => ({
    template,
    pattern: new RegExp(
      `^${template
        .split("/")
        .map((segment) =>
          segment.startsWith("{") && segment.endsWith("}")
            ? "[^/]+"
            : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        )
        .join("/")}$`,
    ),
  }));
}

const MATCHERS = specPathMatchers();

function collectEndpoints(): readonly { key: string; path: string }[] {
  const found: { key: string; path: string }[] = [];

  for (const [group, entries] of Object.entries(ENDPOINTS)) {
    for (const [name, value] of Object.entries(
      entries as Record<string, unknown>,
    )) {
      const key = `${group}.${name}`;
      if (typeof value === "string") {
        found.push({ key, path: value });
        continue;
      }
      if (typeof value === "function") {
        const resolver = value as (...args: string[]) => string;
        const args = Array.from({ length: resolver.length }, () => SAMPLE_ID);
        found.push({ key, path: resolver(...args) });
      }
    }
  }

  return found;
}

const endpoints = collectEndpoints();

describe("ENDPOINTS conformance with docs/openapi.json", () => {
  it("finds endpoints to check", () => {
    expect(endpoints.length).toBeGreaterThan(40);
  });

  it.each(endpoints.map(({ key, path }) => [key, path]))(
    "%s -> %s exists in the spec",
    (_key, path) => {
      const full = `${API_CONFIG.prefix}${path}`;
      const match = MATCHERS.find((matcher) => matcher.pattern.test(full));
      expect(
        match,
        `${path} (resolved to ${full}) is not a path in docs/openapi.json`,
      ).toBeDefined();
    },
  );

  it("never emits a double slash or an unresolved placeholder", () => {
    for (const { key, path } of endpoints) {
      expect(path, key).not.toContain("//");
      expect(path, key).not.toContain("{");
      expect(path, key).not.toContain("undefined");
    }
  });

  it("maps no endpoint onto a Super Admin ledger route", () => {
    for (const { key, path } of endpoints) {
      expect(path, `${key} must not use a Super Admin ledger route`).not.toMatch(
        /^\/ledger\//,
      );
    }
  });

  it("maps no endpoint onto a property-admin or super-admin write route", () => {
    for (const { key, path } of endpoints) {
      if (path.includes("/super-admin/property-admins/")) {
        continue;
      }
      expect(path, `${key} must not target an admin-only route`).not.toMatch(
        /^\/(super-admin|property-admin)\//,
      );
    }
  });
});
