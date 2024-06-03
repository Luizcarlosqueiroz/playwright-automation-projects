import { Page, expect } from "@playwright/test";

export const Checkout = class Checkout {
	page: Page;

	constructor(page) {
		this.page = page;
	}

	async fillInformationCheckout(
		firstName: string,
		lastName: string,
		postalCode: string
	) {
		await this.page.getByPlaceholder("First Name").fill(firstName);

		await this.page.getByPlaceholder("Last Name").fill(lastName);

		await this.page.getByPlaceholder("Zip/Postal Code").fill(postalCode);

		await this.page.getByRole("button", { name: "Continue" }).click();
	}

	async reviewYourCartAndCheckout(input: any) {
		const actualProducts = (
			await this.page.locator(".inventory_item_name").allTextContents()
		).sort();

		expect(actualProducts).toEqual(
			typeof input === "string" ? [input] : input.sort()
		);
	}
};
