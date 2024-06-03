import { Page } from "@playwright/test";

export const SearchPage = class SearchPage {
	page: Page;

	constructor(page) {
		this.page = page;
	}

	async openApp() {
		await this.page.goto("https://gh-users-search.netlify.app/", {
			timeout: 60000,
			waitUntil: "domcontentloaded",
		});
	}

	async searchUser(userName: string) {
		await this.page.locator("[data-testid='search-bar']").type(userName);

		await this.page.getByRole("button", { name: "Search" }).click();
	}
};
