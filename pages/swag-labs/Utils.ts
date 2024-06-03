import { Page } from "@playwright/test";

export const Utils = class Utils {
	page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async openLoginPage() {
		await this.page.goto("https://www.saucedemo.com/", {
			waitUntil: "domcontentloaded",
		});
	}

	async clickButtonRole(name: string) {
		await this.page.getByRole("button", { name: name }).click();
	}
};
