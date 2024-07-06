import { Page } from "@playwright/test";

export const MainPage = class MainPage {
	page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async open() {
		await this.page.goto("https://nearform.github.io/testing-playground/", {
			waitUntil: "domcontentloaded",
		});
	}

	async selectPlayground(name: string) {
		await this.page.getByRole("link", { name: name }).first().click();
	}
};
