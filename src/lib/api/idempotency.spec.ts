import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { API_HEADER_NAMES } from "@/config/api";
import { ApiError } from "@/lib/api/errors";
import { request } from "@/lib/api/http";

const KEY = "550e8400-e29b-41d4-a716-446655440000";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function headerOf(call: unknown, name: string): string | undefined {
  const init = (call as [string, RequestInit])[1];
  const headers = init.headers as Record<string, string>;
  return headers[name];
}

describe("idempotency key handling", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the key as an Idempotency-Key header", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: { ok: true } }));

    await request("/leases/x/pay", {
      method: "POST",
      idempotencyKey: KEY,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(headerOf(fetchMock.mock.calls[0], API_HEADER_NAMES.idempotencyKey)).toBe(
      KEY,
    );
  });

  it("omits the header when no key is given", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: null }));

    await request("/leases/x/pay", { method: "POST" });

    expect(
      headerOf(fetchMock.mock.calls[0], API_HEADER_NAMES.idempotencyKey),
    ).toBeUndefined();
  });

  it("does not retry a POST without a key", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: {} }, 503));

    await expect(
      request("/leases/x/pay", { method: "POST", retryAttempts: 2 }),
    ).rejects.toBeInstanceOf(ApiError);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a keyed POST and reuses the same key on every attempt", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: {} }, 503))
      .mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    await request("/leases/x/pay", {
      method: "POST",
      idempotencyKey: KEY,
      retryAttempts: 1,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const call of fetchMock.mock.calls) {
      expect(headerOf(call, API_HEADER_NAMES.idempotencyKey)).toBe(KEY);
    }
  });

  it("keeps one request id across retries of the same attempt", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ error: {} }, 503))
      .mockResolvedValueOnce(jsonResponse({ data: null }));

    await request("/leases/x/pay", {
      method: "POST",
      idempotencyKey: KEY,
      retryAttempts: 1,
    });

    const first = headerOf(fetchMock.mock.calls[0], API_HEADER_NAMES.requestId);
    const second = headerOf(fetchMock.mock.calls[1], API_HEADER_NAMES.requestId);
    expect(first).toBeDefined();
    expect(second).toBe(first);
  });

  it("never sends credentials with a request", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: null }));

    await request("/me");

    const init = (fetchMock.mock.calls[0] as [string, RequestInit])[1];
    expect(init.credentials).toBeUndefined();
  });

  it("surfaces the server requestId from the error envelope", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        jsonResponse(
          {
            error: { code: "FORBIDDEN", message: "No.", details: [] },
            requestId: "req_from_server",
          },
          403,
        ),
      ),
    );

    const error = await request("/withdrawals", { method: "POST" }).then(
      () => null,
      (cause: unknown) => cause,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).requestId).toBe("req_from_server");
    expect((error as ApiError).code).toBe("FORBIDDEN");
  });
});
