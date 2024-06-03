import { Page } from "@playwright/test";

export const GitHubProfilePage = class GitHubProfilePage {
	page: Page;

	constructor(page) {
		this.page = page;
	}

	async openProfile(userName: string) {
		await this.page.goto(`https://github.com/${userName}/`, {
			timeout: 60000,
			waitUntil: "domcontentloaded",
		});
	}

	async getNumericData() {
		const numberOfFollowers = (await this.page
			.locator("a[href*='tab=followers'] span")
			.textContent()) as string;

		const numberOfFollowing = (await this.page
			.locator("a[href*='tab=following'] span")
			.textContent()) as string;

		const numberOfPublicRepositories = (await this.page
			.locator("[data-tab-item='repositories'] span:visible")
			.getAttribute("title")) as string;

		return {
			numberOfFollowers: numberOfFollowers,
			numberOfFollowing: numberOfFollowing,
			numberOfPublicRepositories: numberOfPublicRepositories,
		};
	}

	async getPersonalInfoData() {
		const name = (await this.page
			.locator(".p-name")
			.textContent()) as string;

		const bioText = (await this.page
			.locator(".user-profile-bio")
			.getAttribute("data-bio-text")) as string;

		const companyNameLocator = this.page.locator(".p-org div");

		const companyName =
			(await companyNameLocator.count()) > 0
				? await companyNameLocator.textContent()
				: null;

		const locationLocator = this.page.locator(
			"[itemprop='homeLocation'] span"
		);

		const location =
			(await locationLocator.count()) > 0
				? await locationLocator.textContent()
				: null;

		const websiteLocator = this.page.locator(
			"[data-test-selector='profile-website-url'] a"
		);

		const website =
			(await websiteLocator.count()) > 0
				? await websiteLocator.textContent()
				: null;

		return {
			name: name,
			bioText: bioText,
			companyName: companyName,
			location: location,
			website: website,
		};
	}
};
