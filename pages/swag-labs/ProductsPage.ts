import { Page } from "@playwright/test";

export const ProductsPage = class ProductsPage {
	page: Page;

	constructor(page) {
		this.page = page;
	}

	async getProductTitles() {
		return await this.page
			.locator(".inventory_item_name")
			.allTextContents();
	}

	async getProductsPrices() {
		const productPriceText = await this.page
			.locator(".inventory_item_price")
			.allTextContents();

		console.log(productPriceText);

		return productPriceText.map((priceText) => Number(priceText.slice(1)));
	}

	async goToCart() {
		await this.page.click("[id='shopping_cart_container']");
	}

	async orderBy(orderCriteria: string) {
		await this.page.selectOption(".product_sort_container", orderCriteria);
	}

	async resetProducts() {
		await this.page.goto("https://www.saucedemo.com/inventory.html", {
			waitUntil: "domcontentloaded",
		});

		await this.page.getByRole("button", { name: "Open Menu" }).click();

		await this.page.getByRole("link", { name: "Reset App State" }).click();
	}

	async addSingleProduct(product: string) {
		const productCard = this.page
			.locator(".inventory_item")
			.filter({ hasText: new RegExp(product) });

		await productCard.getByRole("button", { name: "Add to cart" }).click();

		const productPrice = await productCard
			.locator(".inventory_item_price")
			.textContent();

		return Number(productPrice?.slice(1));
	}

	async selectProducts(input: any): Promise<number> {
		let expectTotal = 0;

		if (typeof input === "string") {
			expectTotal += await this.addSingleProduct(input);
		} else if (Array.isArray(input)) {
			for (let i = 0; i < input.length; i++) {
				expectTotal += await this.addSingleProduct(input[i]);
			}
		}

		return expectTotal;
	}
};
