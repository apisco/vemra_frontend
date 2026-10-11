import { describe, expect, it } from "vitest";

import { resolveNextPath } from "@/lib/supabase/paths";

describe("resolveNextPath", () => {
  const fallback = "/dashboard";

  it("returns the fallback when nothing was requested", () => {
    expect(resolveNextPath(null, fallback)).toBe(fallback);
    expect(resolveNextPath("", fallback)).toBe(fallback);
    expect(resolveNextPath("   ", fallback)).toBe(fallback);
  });

  it("keeps same-site absolute paths", () => {
    expect(resolveNextPath("/tenant", fallback)).toBe("/tenant");
    expect(resolveNextPath("/landlord/statement", fallback)).toBe(
      "/landlord/statement",
    );
    expect(resolveNextPath("/tenant?leaseId=1", fallback)).toBe(
      "/tenant?leaseId=1",
    );
  });

  it("rejects protocol-relative URLs that would leave the site", () => {
    expect(resolveNextPath("//evil.example.com", fallback)).toBe(fallback);
    expect(resolveNextPath("//evil.example.com/path", fallback)).toBe(fallback);
  });

  it("rejects absolute URLs pointing at another origin", () => {
    expect(resolveNextPath("https://evil.example.com", fallback)).toBe(fallback);
    expect(resolveNextPath("http://evil.example.com", fallback)).toBe(fallback);
    expect(resolveNextPath("javascript:alert(1)", fallback)).toBe(fallback);
    expect(resolveNextPath("data:text/html,<script>", fallback)).toBe(fallback);
  });

  it("rejects backslash tricks that some parsers treat as a scheme separator", () => {
    expect(resolveNextPath("/\\evil.example.com", fallback)).toBe(fallback);
    expect(resolveNextPath("\\\\evil.example.com", fallback)).toBe(fallback);
  });

  it("rejects paths containing control characters", () => {
    expect(resolveNextPath("/tenant\n/landlord", fallback)).toBe(fallback);
    expect(resolveNextPath("/tenant\r\nSet-Cookie: x=1", fallback)).toBe(
      fallback,
    );
    expect(resolveNextPath("/tenant\u0000", fallback)).toBe(fallback);
    expect(resolveNextPath("/tenant\u007f", fallback)).toBe(fallback);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(resolveNextPath("  /tenant  ", fallback)).toBe("/tenant");
    expect(resolveNextPath("  //evil.example.com  ", fallback)).toBe(fallback);
  });
});
