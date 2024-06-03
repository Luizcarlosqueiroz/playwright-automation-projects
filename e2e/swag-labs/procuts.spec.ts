import test, { expect } from "@playwright/test";

import { LoginPage } from "../../pages/swag-labs/LoginPage";
import { ProductsPage } from "../../pages/swag-labs/ProductsPage";
import { Utils } from "../../pages/swag-labs/Utils";

test.beforeEach(async ({ page }) => {
	const loginPage = new LoginPage(page);
	const utils = new Utils(page);

	await utils.openLoginPage();

	await loginPage.login();
});

test("can order product in alphabetical order", async ({ page }) => {
	const productsPage = new ProductsPage(page);

	await productsPage.orderBy("Name (A to Z)");
	const productTitlesAZ = await productsPage.getProductTitles();

	const isAlphabeticallyOrderedAZ = productTitlesAZ.every(
		(text, i) => i === 0 || text.localeCompare(productTitlesAZ[i - 1]) >= 0
	);

	expect(isAlphabeticallyOrderedAZ).toBe(true);

	await productsPage.orderBy("Name (Z to A)");

	const productTitlesZA = await productsPage.getProductTitles();

	const isAlphabeticallyOrderedZA = productTitlesZA.every(
		(title, i) =>
			i === 0 || title.localeCompare(productTitlesZA[i - 1]) <= 0
	);

	expect(isAlphabeticallyOrderedZA).toBe(true);
});

test("can order products in price oreder", async ({ page }) => {
	const productsPage = new ProductsPage(page);

	await productsPage.orderBy("Price (low to high)");

	const productPricesLH = await productsPage.getProductsPrices();

	const isNumericallyOrderedLH = productPricesLH.every(
		(price, i) => i === 0 || price >= productPricesLH[i - 1]
	);

	expect(isNumericallyOrderedLH).toBe(true);

	await productsPage.orderBy("Price (high to low)");

	const productPricesHL = await productsPage.getProductsPrices();

	const isNumericallyOrderedHL = productPricesHL.every(
		(price, i) => i === 0 || price <= productPricesHL[i - 1]
	);

	expect(isNumericallyOrderedHL).toBe(true);
});
