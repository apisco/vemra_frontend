import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});

const cookieGet = vi.fn<(name: string) => { value: string } | undefined>();
const apiGetDataOptional = vi.fn();

vi.mock("server-only", () => ({}));

vi.mock("next/navigation", () => ({
  redirect: (path: string) => redirectMock(path),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

vi.mock("@/lib/api/server", () => ({
  apiGetDataOptional: (path: string) => apiGetDataOptional(path),
}));

const { requireRole, homePathFor, getSession } = await import(
  "@/lib/api/resources/auth"
);

interface AccountOverrides {
  roles?: readonly string[];
}

function account({ roles = ["TENANT"] }: AccountOverrides = {}) {
  return {
    userId: "u1",
    email: "a@example.com",
    emailVerified: true,
    displayName: "Ada Lovelace",
    phone: null,
    handle: null,
    roles,
    accountStatus: "ACTIVE",
    onboarding: {
      nextStep: "COMPLETE",
      kycStatus: "APPROVED",
      attemptsRemaining: null,
      applicantMessage: null,
    },
  };
}

async function expectRedirect(
  run: () => Promise<unknown>,
  target: string,
): Promise<void> {
  await expect(run()).rejects.toThrow(`REDIRECT:${target}`);
  expect(redirectMock).toHaveBeenCalledWith(target);
}

describe("homePathFor", () => {
  it("maps the first role to its dashboard", () => {
    expect(homePathFor(["TENANT"])).toBe("/tenant");
    expect(homePathFor(["LANDLORD"])).toBe("/landlord");
    expect(homePathFor(["LANDLORD", "TENANT"])).toBe("/landlord");
  });

  it("falls back to login when the user holds no supported role", () => {
    expect(homePathFor([])).toBe("/login");
  });
});

describe("requireRole", () => {
  beforeEach(() => {
    vi.resetModules();
    redirectMock.mockClear();
    cookieGet.mockReset();
    cookieGet.mockReturnValue(undefined);
    apiGetDataOptional.mockReset();
  });

  it("returns the session when the user holds the role", async () => {
    apiGetDataOptional.mockResolvedValue(account({ roles: ["TENANT"] }));

    const session = await requireRole("TENANT");

    expect(session.user.roles).toEqual(["TENANT"]);
    expect(session.activeRole).toBe("TENANT");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("redirects a tenant away from a landlord-only route", async () => {
    apiGetDataOptional.mockResolvedValue(account({ roles: ["TENANT"] }));

    await expectRedirect(() => requireRole("LANDLORD"), "/tenant");
  });

  it("redirects a landlord away from a tenant-only route", async () => {
    apiGetDataOptional.mockResolvedValue(account({ roles: ["LANDLORD"] }));

    await expectRedirect(() => requireRole("TENANT"), "/landlord");
  });

  it("redirects to login when there is no session", async () => {
    apiGetDataOptional.mockResolvedValue(null);

    await expectRedirect(() => requireRole("TENANT"), "/login");
  });

  it("preserves the requested path when sending an anonymous user to login", async () => {
    apiGetDataOptional.mockResolvedValue(null);

    await expectRedirect(
      () => requireRole("LANDLORD", "/landlord/statement"),
      "/login?next=%2Flandlord%2Fstatement",
    );
  });

  it("allows either role for a dual-role account", async () => {
    apiGetDataOptional.mockResolvedValue(
      account({ roles: ["TENANT", "LANDLORD"] }),
    );

    const asTenant = await requireRole("TENANT");
    expect(asTenant.activeRole).toBe("TENANT");

    const asLandlord = await requireRole("LANDLORD");
    expect(asLandlord.activeRole).toBe("LANDLORD");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("ignores roles this app does not handle", async () => {
    apiGetDataOptional.mockResolvedValue(
      account({ roles: ["SUPER_ADMIN", "SUPPORT", "PROPERTY_ADMIN"] }),
    );

    await expectRedirect(() => requireRole("TENANT"), "/login");
  });
});

describe("active role cookie", () => {
  beforeEach(() => {
    vi.resetModules();
    redirectMock.mockClear();
    cookieGet.mockReset();
    apiGetDataOptional.mockReset();
  });

  it("honours a cookie the account actually holds", async () => {
    cookieGet.mockReturnValue({ value: "LANDLORD" });
    apiGetDataOptional.mockResolvedValue(
      account({ roles: ["TENANT", "LANDLORD"] }),
    );

    const session = await getSession();
    expect(session?.activeRole).toBe("LANDLORD");
  });

  it("ignores a cookie the account does not hold", async () => {
    cookieGet.mockReturnValue({ value: "LANDLORD" });
    apiGetDataOptional.mockResolvedValue(account({ roles: ["TENANT"] }));

    const session = await getSession();
    expect(session?.activeRole).toBe("TENANT");
  });

  it("ignores a forged cookie value", async () => {
    cookieGet.mockReturnValue({ value: "SUPER_ADMIN" });
    apiGetDataOptional.mockResolvedValue(account({ roles: ["TENANT"] }));

    const session = await getSession();
    expect(session?.activeRole).toBe("TENANT");
  });
});
