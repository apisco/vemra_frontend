import { expect, test } from "@playwright/test";

test.describe("auth and role boundaries", () => {
  test("an anonymous visitor hitting /tenant is sent to login with next preserved", async ({
    page,
  }) => {
    await page.goto("/tenant");

    await expect(page).toHaveURL(/\/login\?next=%2Ftenant/);
  });

  test("an anonymous visitor hitting a landlord route is sent to login", async ({
    page,
  }) => {
    await page.goto("/landlord/statement");

    await expect(page).toHaveURL(/\/login\?next=/);
    expect(page.url()).toContain("landlord");
  });

  test("an anonymous visitor hitting the dashboard dispatcher is sent to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login/);
  });

  test("the login page renders its form", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("button", { name: /log in|sign in/i }).first(),
    ).toBeVisible();
  });

  test("security headers are present on the home page", async ({ page }) => {
    const response = await page.goto("/");
    const headers = response?.headers() ?? {};

    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(headers["strict-transport-security"]).toContain("max-age=63072000");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });

  test("the design system is not reachable in a production build", async ({
    page,
  }) => {
    const response = await page.goto("/design-system");

    expect(response?.status()).toBe(404);
  });

  test("no page sends raw card fields to our API", async ({ page }) => {
    const suspicious: string[] = [];

    page.on("request", (request) => {
      const body = request.postData() ?? "";
      if (/cardNumber|\bcvc\b|\bexpiry\b/i.test(body)) {
        suspicious.push(`${request.method()} ${request.url()}`);
      }
    });

    await page.goto("/login");
    await page.goto("/");

    expect(suspicious).toEqual([]);
  });
});
