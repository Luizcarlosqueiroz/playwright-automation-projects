import test, { expect } from "@playwright/test";

import { LoginPage } from "../../pages/swag-labs/LoginPage";
import { ProductsPage } from "../../pages/swag-labs/ProductsPage";
import { Checkout } from "../../pages/swag-labs/Checkout";
import { Utils } from "../../pages/swag-labs/Utils";

test.beforeEach(async ({ page }) => {
	const loginPage = new LoginPage(page);
	const utils = new Utils(page);

	await utils.openLoginPage();

	await loginPage.login();
});

test("can buy multiple items", async ({ page }) => {
	const checkout = new Checkout(page);
	const productsPage = new ProductsPage(page);
	const utils = new Utils(page);

	const productList = [
		"Sauce Labs Backpack",
		"Sauce Labs Bolt T-Shirt",
		"Sauce Labs Onesie",
	];

	const expectTotal = await productsPage.selectProducts(productList);

	await productsPage.goToCart();

	await utils.clickButtonRole("Checkout");

	await checkout.fillInformationCheckout("Testfn", "Testln", "A1B2C3");

	await checkout.reviewYourCartAndCheckout(productList);

	const subtotalText = String(
		await page.locator(".summary_subtotal_label").textContent()
	).replace("Item total: $", "");

	await expect(Number(subtotalText)).toEqual(Number(expectTotal));
});

test("can buy single item", async ({ page }) => {
	const checkout = new Checkout(page);
	const productsPage = new ProductsPage(page);
	const utils = new Utils(page);

	const productList = "Sauce Labs Fleece Jacket";

	const expectTotal = await productsPage.selectProducts(productList);

	await productsPage.goToCart();

	await utils.clickButtonRole("Checkout");

	await checkout.fillInformationCheckout("Testfn", "Testln", "D4E5F6");

	await checkout.reviewYourCartAndCheckout(productList);

	const subtotalText = String(
		await page.locator(".summary_subtotal_label").textContent()
	).replace("Item total: $", "");

	await expect(Number(subtotalText)).toEqual(Number(expectTotal));
});

test.afterEach(async ({ page }) => {
	const productsPage = new ProductsPage(page);

	await productsPage.resetProducts();
});
