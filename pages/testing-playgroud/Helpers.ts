import { Locator, Page } from "@playwright/test";

export const Helpers = class Helpers {
	page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async getColumnElemenPosition(
		dynamicTableElement: Locator,
		targetColumn: string
	) {
		const headersValues = await dynamicTableElement
			.locator(".MuiTableCell-head")
			.allInnerTexts();

		return headersValues.indexOf(targetColumn);
	}

	async getRowValues(dynamicTableElement: Locator, targetRowValue: string) {
		const targetRow = await dynamicTableElement.locator(
			".MuiTableRow-root",
			{
				hasText: targetRowValue,
			}
		);

		return await targetRow.locator(".MuiTableCell-root").allInnerTexts();
	}

	async getTargetScenario() {
		return String(
			await this.page.getByTestId("target-scenario").textContent()
		)
			.replace(":", "")
			.split(" ");
	}

	async setSliderValue(
		sliderElement: Locator,
		percentage: number,
		maxPercantage?: number
	) {
		const sliderOffsetWidth = await sliderElement.evaluate((element) => {
			return element.getBoundingClientRect().width;
		});

		const sliderGoalWidth = (sliderOffsetWidth * percentage) / 100;

		await sliderElement.hover({ force: true, position: { x: 0, y: 0 } });

		await this.page.mouse.down();

		await sliderElement.hover({
			force: true,
			position: { x: sliderGoalWidth, y: 0 },
		});

		await this.page.mouse.up();

		if (maxPercantage) {
			const sliderMaxGoalWidth =
				(sliderOffsetWidth * maxPercantage) / 100;

			await sliderElement.hover({
				force: true,
				position: { x: sliderOffsetWidth - 100, y: 0 },
			});

			await this.page.mouse.down();

			await sliderElement.hover({
				force: true,
				position: { x: sliderMaxGoalWidth, y: 0 },
			});

			await this.page.mouse.up();
		}
	}
};
