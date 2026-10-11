import { describe, expect, it } from "vitest";

import { isUuid, readUuidParam } from "@/lib/validation";

describe("isUuid", () => {
  it("accepts canonical v4 UUIDs", () => {
    expect(isUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
  });

  it("is case insensitive", () => {
    expect(isUuid("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
  });

  it("rejects malformed values", () => {
    expect(isUuid("")).toBe(false);
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid("550e8400e29b41d4a716446655440000")).toBe(false);
    expect(isUuid("550e8400-e29b-41d4-a716-44665544000")).toBe(false);
    expect(isUuid("550e8400-e29b-41d4-a716-4466554400000")).toBe(false);
    expect(isUuid("550e8400-e29b-41d4-a716-44665544000g")).toBe(false);
  });

  it("rejects the nil UUID and invalid variants", () => {
    expect(isUuid("00000000-0000-0000-0000-000000000000")).toBe(false);
    expect(isUuid("550e8400-e29b-01d4-a716-446655440000")).toBe(false);
    expect(isUuid("550e8400-e29b-41d4-c716-446655440000")).toBe(false);
  });

  it("rejects path traversal and injection attempts", () => {
    expect(isUuid("../../etc/passwd")).toBe(false);
    expect(isUuid("550e8400-e29b-41d4-a716-446655440000/../admin")).toBe(false);
    expect(isUuid("550e8400-e29b-41d4-a716-446655440000?x=1")).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isUuid(null)).toBe(false);
    expect(isUuid(undefined)).toBe(false);
    expect(isUuid(42)).toBe(false);
    expect(isUuid({})).toBe(false);
  });
});

describe("readUuidParam", () => {
  const id = "550e8400-e29b-41d4-a716-446655440000";

  it("reads a single value", () => {
    expect(readUuidParam(id)).toBe(id);
  });

  it("reads the first entry of a repeated query parameter", () => {
    expect(readUuidParam([id, "other"])).toBe(id);
  });

  it("returns null for invalid or missing values", () => {
    expect(readUuidParam(undefined)).toBeNull();
    expect(readUuidParam("nope")).toBeNull();
    expect(readUuidParam([])).toBeNull();
    expect(readUuidParam(["nope", id])).toBeNull();
  });
});
