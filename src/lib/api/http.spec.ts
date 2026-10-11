import { describe, expect, it } from "vitest";

import { readErrorEnvelope } from "@/lib/api/http";

describe("readErrorEnvelope", () => {
  it("reads the spec's error envelope", () => {
    const envelope = readErrorEnvelope({
      error: {
        code: "VALIDATION_ERROR",
        message: "The request body is invalid.",
        details: [
          { field: "body.email", reason: "Must be a valid email address." },
          { field: "body.amountMinor", reason: "Must be greater than zero." },
        ],
      },
      requestId: "req_01HF8K2",
    });

    expect(envelope.code).toBe("VALIDATION_ERROR");
    expect(envelope.message).toBe("The request body is invalid.");
    expect(envelope.requestId).toBe("req_01HF8K2");
    expect(envelope.fieldErrors).toEqual({
      email: "Must be a valid email address.",
      amountMinor: "Must be greater than zero.",
    });
  });

  it("reads each documented error code", () => {
    for (const code of [
      "UNAUTHENTICATED",
      "FORBIDDEN",
      "NOT_FOUND",
      "CONFLICT",
      "RATE_LIMITED",
      "FEATURE_NOT_ENABLED",
    ]) {
      const envelope = readErrorEnvelope({
        error: { code, message: "x", details: [] },
        requestId: "req_1",
      });
      expect(envelope.code).toBe(code);
    }
  });

  it("strips the location prefix from detail field names", () => {
    const envelope = readErrorEnvelope({
      error: {
        code: "VALIDATION_ERROR",
        message: "bad",
        details: [{ field: "query.page", reason: "Must be an integer." }],
      },
      requestId: "r",
    });

    expect(envelope.fieldErrors).toEqual({ page: "Must be an integer." });
  });

  it("returns an empty envelope for unusable payloads", () => {
    for (const payload of [null, undefined, 42, [], ""]) {
      const envelope = readErrorEnvelope(payload);
      expect(envelope.code).toBeNull();
      expect(envelope.fieldErrors).toBeNull();
    }
  });

  it("treats a plain string body as the message", () => {
    expect(readErrorEnvelope("Bad Gateway").message).toBe("Bad Gateway");
    expect(readErrorEnvelope("   ").message).toBeNull();
  });

  it("ignores details entries that are not {field, reason} pairs", () => {
    const envelope = readErrorEnvelope({
      error: {
        code: "VALIDATION_ERROR",
        message: "bad",
        details: [null, "nope", { field: 1, reason: 2 }, { field: "a" }],
      },
      requestId: "r",
    });

    expect(envelope.fieldErrors).toBeNull();
  });

  it("falls back to a top-level error object without the error wrapper", () => {
    const envelope = readErrorEnvelope({
      code: "NOT_FOUND",
      message: "No such lease.",
      requestId: "req_9",
    });

    expect(envelope.code).toBe("NOT_FOUND");
    expect(envelope.message).toBe("No such lease.");
    expect(envelope.requestId).toBe("req_9");
  });
});
