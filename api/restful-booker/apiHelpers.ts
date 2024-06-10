import { APIRequestContext, expect } from "@playwright/test";

export const ApiHelpers = class ApiHelpers {
	context: APIRequestContext;
	token: string;

	constructor(context: APIRequestContext, token: string) {
		this.context = context;
		this.token = token;
	}

	async deleteBooking(bookingid: Number) {
		const bookingResponse = await this.context.delete(
			`/booking/${bookingid}`,
			{
				headers: {
					Accept: "application/json",
					Cookie: `token=${this.token}`,
				},
			}
		);

		return bookingResponse.status();
	}

	async patchBooking(
		bookingid: Number,
		data: {
			firstname?: string;
			lastname?: string;
			totalprice?: number;
			depositpaid?: boolean;
			bookingdates?:
				| { checkin?: string; checkout?: string }
				| { checkin?: string; checkout?: string };
			additionalneeds?: string;
		}
	) {
		const bookingResponse = await this.context.patch(
			`/booking/${bookingid}`,
			{
				headers: {
					Accept: "application/json",
					Cookie: `token=${this.token}`,
				},
				data: data,
			}
		);

		return await bookingResponse.json();
	}

	async postBooking(data: {
		firstname: string;
		lastname: string;
		totalprice: number;
		depositpaid: boolean;
		bookingdates:
			| { checkin: string; checkout: string }
			| { checkin: string; checkout: string };
		additionalneeds: string;
	}) {
		const bookingResponse = await this.context.post("/booking", {
			headers: {
				Accept: "application/json",
				Authorization: this.token,
			},
			data: data,
		});

		expect(bookingResponse.ok()).toBeTruthy();

		return await bookingResponse.json();
	}

	async putBooking(
		bookingid: Number,
		data: {
			firstname: string;
			lastname: string;
			totalprice: number;
			depositpaid: boolean;
			bookingdates:
				| { checkin: string; checkout: string }
				| { checkin: string; checkout: string };
			additionalneeds: string;
		}
	) {
		const bookingResponse = await this.context.put(
			`/booking/${bookingid}`,
			{
				headers: {
					Accept: "application/json",
					Cookie: `token=${this.token}`,
				},
				data: data,
			}
		);

		return await bookingResponse.json();
	}
};
