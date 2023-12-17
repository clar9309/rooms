import { test, expect } from "@playwright/test";

test("checks the navigation flow of a user that is not logged in", async ({
  page,
}) => {
  await page.goto("/");
  //We expect heading on home when not logged in
  await expect(page.locator("h1")).toContainText(
    "Share and organize your daily life with Rooms"
  );

  //Click the signup
  await page.click("text=Create an account");

  //We expect to be routed to signup
  await expect(page).toHaveURL("/signup/");
  //Signup should have h1
  await expect(page.locator("h1")).toContainText("Create your account");

  //We route back to home
  await page.getByRole("link").click();
  await expect(page).toHaveURL("/");
  //Click login and expect to go to /login
  await page.click("text=Go to login");
  await expect(page).toHaveURL("/login/");
  await expect(page.locator("h1")).toContainText("Log into your account");

  //We try to route to a route that requires authentication
  await page.goto("/rooms/");

  //Verify if redirected back to /
  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText(
    "Share and organize your daily life with Rooms"
  );
});
