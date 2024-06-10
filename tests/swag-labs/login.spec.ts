import { expect, test } from "@playwright/test";

import { LoginPage } from "../../pages/swag-labs/LoginPage";
import { Utils } from "../../pages/swag-labs/Utils";

import credentials from "../../fixtures/swag-labs/credentials.json";

test("can login with regular user", async ({ page }) => {
	const loginPage = new LoginPage(page);
	const utils = new Utils(page);

	await utils.openLoginPage();

	await loginPage.login();

	await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

test("can not login with wrong password", async ({ page }) => {
	const loginPage = new LoginPage(page);
	const utils = new Utils(page);

	await utils.openLoginPage();

	await loginPage.login(
		credentials.username.standard_user,
		"Identity theft is not a joke, Jim!"
	);

	await expect(page.locator("[data-test='error']")).toHaveText(
		/Username and password do not match any user in this service/
	);
});

test("can not login with locked user", async ({ page }) => {
	const loginPage = new LoginPage(page);
	const utils = new Utils(page);

	await utils.openLoginPage();

	await loginPage.login(
		credentials.username.locked_out_user,
		credentials.password
	);

	await expect(page.locator("[data-test='error']")).toHaveText(
		/Sorry, this user has been locked out/
	);
});

test("verify username and password are required", async ({ page }) => {
	const utils = new Utils(page);

	await utils.openLoginPage();

	await utils.clickButtonRole("Login");

	await expect(page.locator("[data-test='error']")).toHaveText(
		/Username is required/
	);

	await page
		.getByPlaceholder("Username")
		.fill(credentials.username.standard_user);

	await utils.clickButtonRole("Login");

	await expect(page.locator("[data-test='error']")).toHaveText(
		/Password is required/
	);
});
