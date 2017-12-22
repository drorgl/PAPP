import { expect } from "chai";
import "mocha";

import * as appstarter from "../src/app";
const agent = require("supertest-koa-agent");


describe("statictics", () => {
	describe("for each store", () => {
		it("summary", async () => {
			const res: any = await agent(await appstarter.GetApp()).get("/api/stats").send();
			expect(res.body.value.length).to.eq(7);
			expect(res.body.value[0]).deep.eq(
				{
					_id: "1",
					name: "Amazon",
					url: "http://amazon.com",
					avg_price: 51.291666666666664,
					min_price: 3.69,
					max_price: 208.16,
					products_count: 24
				}
			);
		});
	});
});
