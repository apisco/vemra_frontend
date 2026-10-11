import { describe, expect, it } from "vitest";

import { API_CONFIG, apiUrl } from "@/config/api";
import { ENDPOINTS } from "@/lib/api/endpoints";

describe("apiUrl", () => {
  it("prefixes the configured root", () => {
    expect(apiUrl("/me")).toBe(`${API_CONFIG.root}/me`);
  });

  it("adds a leading slash when missing", () => {
    expect(apiUrl("me")).toBe(`${API_CONFIG.root}/me`);
  });

  it("percent-encodes query values", () => {
    expect(apiUrl("/properties", { q: "a b&c=d" })).toBe(
      `${API_CONFIG.root}/properties?q=a+b%26c%3Dd`,
    );
  });

  it("drops null, undefined and empty query values", () => {
    expect(
      apiUrl("/payments", {
        leaseId: null,
        status: undefined,
        reference: "",
        limit: 20,
      }),
    ).toBe(`${API_CONFIG.root}/payments?limit=20`);
  });

  it("omits the question mark when every value was dropped", () => {
    expect(apiUrl("/payments", { leaseId: null })).toBe(
      `${API_CONFIG.root}/payments`,
    );
  });

  it("serialises booleans and numbers", () => {
    expect(apiUrl("/x", { a: true, b: 0 })).toBe(
      `${API_CONFIG.root}/x?a=true&b=0`,
    );
  });
});

describe("ENDPOINTS path encoding", () => {
  it("percent-encodes interpolated ids", () => {
    expect(ENDPOINTS.tenant.lease("a b")).toBe("/leases/a%20b");
    expect(ENDPOINTS.tenant.lease("../admin")).toBe("/leases/..%2Fadmin");
    expect(ENDPOINTS.public.listing("a/b")).toBe("/properties/a%2Fb");
  });

  it("prevents path traversal through an id", () => {
    const path = ENDPOINTS.landlord.updateProperty("../../super-admin/settings");
    expect(path).not.toContain("/../");
    expect(path).toBe("/properties/..%2F..%2Fsuper-admin%2Fsettings");
  });

  it("prevents query and fragment injection through an id", () => {
    expect(ENDPOINTS.tenant.lease("x?y=1")).toBe("/leases/x%3Fy%3D1");
    expect(ENDPOINTS.tenant.lease("x#y")).toBe("/leases/x%23y");
  });

  it("encodes every segment of multi-parameter paths", () => {
    expect(ENDPOINTS.tenant.conversationMessages("a b")).toBe(
      "/messaging/a%20b/messages",
    );
    expect(ENDPOINTS.landlord.payoutAccountPrimary("a/b")).toBe(
      "/wallet/payout-accounts/a%2Fb/primary",
    );
  });

  it("leaves canonical UUIDs untouched", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(ENDPOINTS.tenant.lease(id)).toBe(`/leases/${id}`);
  });
});
