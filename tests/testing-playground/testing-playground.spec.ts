import { test, expect } from "@playwright/test";
import { MainPage } from "../../pages/testing-playgroud/MainPage";
import { Helpers } from "../../pages/testing-playgroud/Helpers";
import path from "path";

test.beforeEach(async ({ page }) => {
	const mainPage = new MainPage(page);

	await mainPage.open();
});

test("Drag and Drop", { tag: "@medium" }, async ({ page }) => {
	const mainPage = new MainPage(page);

	await mainPage.selectPlayground("Drag and Drop");

	const times = 3;

	for (let i = 0; i < times; i++) {
		await page
			.getByTestId("draggable-box")
			.dragTo(page.locator(".MuiGrid-item "));
	}

	expect(page.getByTestId("total-drops")).toContainText(
		`Total Drops: ${times}`,
		{ timeout: 1000 }
	);
});

test("Drag and Drop Conditional", { tag: "@hard" }, async ({ page }) => {
	await page.goto(
		"https://nearform.github.io/testing-playground/#/drag-and-drop-hard",
		{
			waitUntil: "domcontentloaded",
		}
	);

	const elementToDragList = await page.locator("//*[@draggable]").all();

	for (let i = 0; i < 5; i++) {
		const elementToDrag = elementToDragList[i];

		const format = await elementToDrag.evaluate((el) => {
			const borderRadius = window
				.getComputedStyle(el)
				.getPropertyValue("border-radius");

			return borderRadius == "50%" ? "circle" : "square";
		});

		await elementToDrag.dragTo(page.getByTestId(`drop-${format}`));
	}

	expect(page.getByTestId("total-count")).toContainText(/Total Correct: 5/);
});

test("Dynamic Table", { tag: "@hard" }, async ({ page }) => {
	const mainPage = new MainPage(page);
	const helpers = new Helpers(page);

	await mainPage.selectPlayground("Dynamic Table");

	const targetScenario = await helpers.getTargetScenario();

	const dynamicTableElement = await page.getByTestId("dynamic-table");

	const targetColumnPosition = await helpers.getColumnElemenPosition(
		dynamicTableElement,
		targetScenario[1]
	);

	const targetRowValues = await helpers.getRowValues(
		dynamicTableElement,
		targetScenario[0]
	);

	expect(targetRowValues[targetColumnPosition]).toEqual(targetScenario[2]);
});

test("File Download", { tag: "@medium" }, async ({ page }) => {
	const mainPage = new MainPage(page);

	await mainPage.selectPlayground("File Download");

	const downloadPromise = page.waitForEvent("download");

	await page.getByText("Download File").click();

	const download = await downloadPromise;

	expect(await download.suggestedFilename()).toEqual("file.txt");
});

test("File Upload", { tag: "@medium" }, async ({ page }) => {
	const mainPage = new MainPage(page);

	await mainPage.selectPlayground("File Upload");

	const filePath = path.join(__dirname, "/dependencies/sampleFile.txt");

	await page.getByTestId("select-file").setInputFiles(filePath);

	expect(page.getByTestId("selected-file-name")).toContainText(
		/sampleFile.txt/
	);

	await page.getByRole("button", { name: "Upload" }).click();

	await expect(page.getByTestId("upload-message")).toContainText(
		/uploaded successfully!/,
		{ timeout: 10000 }
	);
});

test("Notification", { tag: "@medium" }, async ({ page }) => {
	const mainPage = new MainPage(page);

	await mainPage.selectPlayground("Notification");

	await test.step("Test Success Notification", async () => {
		await page.getByRole("button", { name: "Success" }).click();

		await expect(page.getByTestId("message-success")).toContainText(
			/This is a successful notification message/
		);

		await page.waitForTimeout(6000);
	});

	await test.step("Test Info Notification", async () => {
		await page.getByRole("button", { name: "Info" }).click();

		await expect(page.getByTestId("message-info")).toContainText(
			/This is an info notification message/
		);

		await page.waitForTimeout(6000);
	});

	await test.step("Test Warning Notification", async () => {
		await page.getByRole("button", { name: "Warning" }).click();

		await expect(page.getByTestId("message-warning")).toContainText(
			/This is a warning notification message/
		);

		await page.waitForTimeout(6000);
	});

	await test.step("Test Error Notification", async () => {
		await page.getByRole("button", { name: "Error" }).click();

		await expect(page.getByTestId("message-error")).toContainText(
			/This is an error notification message/
		);
	});
});

test("Sliders", { tag: "@medium" }, async ({ page }) => {
	const mainPage = new MainPage(page);
	const helpers = new Helpers(page);

	await mainPage.selectPlayground("Sliders");

	await test.step("Test Basic Slider", async () => {
		const basicSliderElement = await page.getByTestId("basic-slider");

		await helpers.setSliderValue(basicSliderElement, 70);

		expect(
			await basicSliderElement.getByRole("slider").getAttribute("value")
		).toEqual("70");
	});

	await test.step("Test Slider with Range", async () => {
		const rangeSliderElement = await page.getByTestId("range-slider");

		await helpers.setSliderValue(rangeSliderElement, 19, 90);

		expect(
			await rangeSliderElement
				.getByRole("slider")
				.first()
				.getAttribute("value")
		).toEqual("20");

		expect(
			await rangeSliderElement
				.getByRole("slider")
				.last()
				.getAttribute("value")
		).toEqual("90");
	});

	await test.step("Test Slider with input", async () => {
		await page.getByLabel("Value").fill("50", { force: true });

		expect(
			await page
				.getByTestId("input-slider")
				.getByRole("slider")
				.last()
				.getAttribute("value")
		).toEqual("50");
	});
});
