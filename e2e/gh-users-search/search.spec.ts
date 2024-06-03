import { test, expect } from "@playwright/test";

import { SearchPage } from "../../pages/gh-users-search/SearchPage";
import { GitHubProfilePage } from "../../pages/gh-users-search/GitHubProfilePage";

test("can search my user", async ({ page }) => {
	const userPage = new SearchPage(page);

	await userPage.openApp();

	await userPage.searchUser("Luizcarlosqueiroz");

	await expect(page.locator(".bio")).toHaveText(/QA Engineer/);
});

test("verify that personal information data is correct", async ({ page }) => {
	const gitHubProfilePage = new GitHubProfilePage(page);
	const userPage = new SearchPage(page);

	const userName = "Luizcarlosqueiroz";

	await gitHubProfilePage.openProfile(userName);

	const personalData = await gitHubProfilePage.getPersonalInfoData();

	await userPage.openApp();

	await userPage.searchUser(userName);

	await expect(page.locator("header h4")).toHaveText(personalData.name);

	await expect(page.locator(".bio")).toHaveText(personalData.bioText);

	if (personalData.companyName) {
		await expect(page.locator(".links p").first()).toHaveText(
			personalData.companyName,
			{ ignoreCase: true }
		);
	}

	if (personalData.location) {
		await expect(page.locator(".links p").last()).toHaveText(
			personalData.location,
			{ ignoreCase: true }
		);
	}

	if (personalData.website) {
		await expect(page.locator(".links a")).toHaveText(personalData.website);
	}
});

test("verify that numerical data is correct", async ({ page }) => {
	const gitHubProfilePage = new GitHubProfilePage(page);
	const userPage = new SearchPage(page);

	await gitHubProfilePage.openProfile("Luizcarlosqueiroz");

	const numericData = await gitHubProfilePage.getNumericData();

	await userPage.openApp();

	await userPage.searchUser("Luizcarlosqueiroz");

	await expect(page.locator(".item:has-text('followers') h3")).toHaveText(
		numericData.numberOfFollowers
	);

	await expect(page.locator(".item:has-text('following') h3")).toHaveText(
		numericData.numberOfFollowing
	);

	await expect(page.locator(".item:has-text('repos') h3")).toHaveText(
		numericData.numberOfPublicRepositories
	);
});
