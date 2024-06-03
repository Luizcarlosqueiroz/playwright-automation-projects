import { Page } from "@playwright/test";

import { Utils } from "./Utils";

import credentials from "../../fixtures/swag-labs/credentials.json";

export const LoginPage = class LoginPage {
	page: Page;
	utils: InstanceType<typeof Utils>;

	constructor(page) {
		this.page = page;
		this.utils = new Utils(page);
	}

	async login(username?: string, password?: string) {
		if (!username) {
			username = credentials.username.standard_user;
		}

		if (!password) {
			password = credentials.password;
		}

		await this.page.getByPlaceholder("Username").fill(username);

		await this.page.getByPlaceholder("Password").fill(password);

		await this.utils.clickButtonRole("Login");
	}
};
