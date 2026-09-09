import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Avatar photos are user-uploaded, so the host is unknown at build time and
    // cannot be added to `images.remotePatterns` yet. The sizes are fixed on the
    // element, so there is no layout-shift cost to a plain <img> in the meantime.
    // Scoped here rather than as an inline comment: `src/` is kept comment-free.
    files: ["src/components/ui/avatar.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
]);

export default eslintConfig;
