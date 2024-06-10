import test, { APIRequestContext, expect, request } from "@playwright/test";
import { ApiHelpers } from "../../api/restful-booker/apiHelpers";

let token: string;
let context: APIRequestContext;

test.beforeEach(async () => {
	context = await request.newContext({
		baseURL: "https://restful-booker.herokuapp.com/",
	});

	const tokenResponse = await context.post("/auth", {
		headers: {
			Accept: "application/json",
		},
		data: {
			username: "admin",
			password: "password123",
		},
	});

	const tokenData = await tokenResponse.json();
	token = tokenData.token;
});

test("can create booking", async () => {
	const apiHelpers = new ApiHelpers(context, token);

	const bookingData = {
		firstname: "Testfn",
		lastname: "Testln",
		totalprice: 100,
		depositpaid: true,
		bookingdates: {
			checkin: "2024-01-01",
			checkout: "2024-01-02",
		},
		additionalneeds: "Breakfast",
	};

	const booking = (await apiHelpers.postBooking(bookingData)).booking;

	expect(booking).toMatchObject(bookingData);
});

test("can delete a booking", async () => {
	const apiHelpers = new ApiHelpers(context, token);

	const bookingData = {
		firstname: "Testfn",
		lastname: "Testln",
		totalprice: 100,
		depositpaid: true,
		bookingdates: {
			checkin: "2024-01-01",
			checkout: "2024-01-02",
		},
		additionalneeds: "Breakfast",
	};

	const bookingEntry = await apiHelpers.postBooking(bookingData);

	const responseStatus = await apiHelpers.deleteBooking(
		bookingEntry.bookingid
	);

	expect(responseStatus).toBe(201);
});

test("can edit a single information of a booking", async () => {
	const apiHelpers = new ApiHelpers(context, token);

	const bookingData = {
		firstname: "Testfn",
		lastname: "Testln",
		totalprice: 100,
		depositpaid: true,
		bookingdates: {
			checkin: "2024-01-01",
			checkout: "2024-01-02",
		},
		additionalneeds: "Breakfast",
	};

	const bookingEntry = await apiHelpers.postBooking(bookingData);

	const dataEdit = {
		depositpaid: false,
	};

	const bookingEntryEdited = await apiHelpers.patchBooking(
		bookingEntry.bookingid,
		dataEdit
	);

	expect(Boolean(bookingEntryEdited.depositpaid)).toBe(false);
});

test("can edit the entire booking", async () => {
	const apiHelpers = new ApiHelpers(context, token);

	const bookingData = {
		firstname: "Testfn",
		lastname: "Testln",
		totalprice: 100,
		depositpaid: true,
		bookingdates: {
			checkin: "2024-01-01",
			checkout: "2024-01-02",
		},
		additionalneeds: "Breakfast",
	};

	const bookingEntry = await apiHelpers.postBooking(bookingData);

	const bookingDataEdited = {
		firstname: "Newfn",
		lastname: "Newln",
		totalprice: 999,
		depositpaid: false,
		bookingdates: {
			checkin: "2020-01-01",
			checkout: "2020-01-02",
		},
		additionalneeds: "Lunch",
	};

	const bookingEntryEdited = await apiHelpers.putBooking(
		bookingEntry.bookingid,
		bookingDataEdited
	);

	expect(String(bookingEntryEdited.firstname)).toBe(
		bookingDataEdited.firstname
	);
	expect(String(bookingEntryEdited.lastname)).toBe(
		bookingDataEdited.lastname
	);
	expect(Number(bookingEntryEdited.totalprice)).toBe(
		bookingDataEdited.totalprice
	);
	expect(Boolean(bookingEntryEdited.depositpaid)).toBe(
		bookingDataEdited.depositpaid
	);
	expect(String(bookingEntryEdited.bookingdates.checkin)).toBe(
		bookingDataEdited.bookingdates.checkin
	);
	expect(String(bookingEntryEdited.bookingdates.checkout)).toBe(
		bookingDataEdited.bookingdates.checkout
	);
	expect(String(bookingEntryEdited.additionalneeds)).toBe(
		bookingDataEdited.additionalneeds
	);
});

test("can get booking ids", async () => {
	const bookingsListResponse = await context.get("/booking", {
		headers: {
			Accept: "application/json",
			Authorization: token,
		},
	});

	const bookingsListResponsejson = await bookingsListResponse.json();

	const hasEntries = Object.keys(bookingsListResponsejson).length > 0;

	expect(hasEntries).toBe(true);
});

test("can not add booking with missing data", async () => {
	const entryData = {
		firstname: "Testfn",
		totalprice: 200,
		depositpaid: false,
		bookingdates: {
			checkin: "2024-01-01",
			checkout: "2024-01-02",
		},
		additionalneeds: "Lunch",
	};

	let bookingResponse = await context.post("/booking", {
		headers: {
			Accept: "application/json",
			Authorization: token,
		},
		data: entryData,
	});

	const responseStatus = await bookingResponse.status();
	const responseText = await bookingResponse.text();

	// expect(responseStatus).toBe(400);
	expect(responseStatus).toBe(500);
	// expect(responseText).toContain("lastname is required");
	expect(responseText).toContain("Internal Server Error");
});

test("can not delete invalid booking", async () => {
	const apiHelpers = new ApiHelpers(context, token);

	const responseStatus = await apiHelpers.deleteBooking(99999);

	// expect(responseStatus).toBe(404);
	expect(responseStatus).toBe(405);
});

test("can not edit the booking with missing data", async () => {
	const apiHelpers = new ApiHelpers(context, token);

	const bookingData = {
		firstname: "Testfn",
		lastname: "Testln",
		totalprice: 100,
		depositpaid: true,
		bookingdates: {
			checkin: "2024-01-01",
			checkout: "2024-01-02",
		},
		additionalneeds: "Breakfast",
	};

	const bookingEntry = await apiHelpers.postBooking(bookingData);

	const bookingMissingData = {
		firstname: "Newfn",
		lastname: "Newln",
		totalprice: 999,
		additionalneeds: "Lunch",
	};

	const bookingResponse = await context.put(
		`/booking/${bookingEntry.bookingid}`,
		{
			headers: {
				Accept: "application/json",
				Cookie: `token=${token}`,
			},
			data: bookingMissingData,
		}
	);

	expect(bookingResponse.status()).toBe(400);
});

test("should handle concurrent bookings", async () => {
	const apiHelpers = new ApiHelpers(context, token);

	const bookingData = {
		firstname: "Testfn",
		lastname: "Testln",
		totalprice: 100,
		depositpaid: true,
		bookingdates: {
			checkin: "2024-01-01",
			checkout: "2024-01-02",
		},
		additionalneeds: "Breakfast",
	};

	const [response1, response2] = await Promise.all([
		apiHelpers.postBooking(bookingData),
		apiHelpers.postBooking(bookingData),
	]);

	expect(response1.booking.firstname).toBe("Testfn");
	expect(response2.booking.firstname).toBe("Testfn");
});
