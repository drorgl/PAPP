import { expect } from "chai";
import "mocha";

import * as appstarter from "../src/app";
const agent = require("supertest-koa-agent");

describe("products", () => {
	it("returns all", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products").send();

		expect(res.body.value.length).to.eq(100);
	});

	it("filters by price", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$filter=price gt 190").send();
		expect(res.body.value.length).to.eq(11);
		res.body.value.every((rec: any) => {
			expect(rec).to.satisfy((i: any) => i.price > 190);
		});
	});
	it("filters by shipping", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$filter=shipping eq 'FEDEX'").send();
		expect(res.body.value.length).to.eq(26);
		res.body.value.every((rec: any) => {
			expect(rec).to.satisfy((i: any) => i.shipping === "FEDEX");
		});
	});
	it("filters by sku", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$filter=sku eq '483'").send();
		expect(res.body.value.length).to.eq(1);
		res.body.value.every((rec: any) => {
			expect(rec).to.satisfy((i: any) => i.sku === "483");
		});
	});
	it("filters by title", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$filter=title eq 'Xerox 198'").send();
		expect(res.body.value.length).to.eq(1);
		res.body.value.every((rec: any) => {
			expect(rec).to.satisfy((i: any) => i.title === "Xerox 198");
		});
	});
	it("filters by brand", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$filter=brand eq 'Nunavut'").send();
		expect(res.body.value.length).to.eq(79);
		res.body.value.every((rec: any) => {
			expect(rec).to.satisfy((i: any) => i.brand === "Nunavut");
		});
	});
	it("filters by store_id", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$filter=store_id eq '6'").send();
		expect(res.body.value.length).to.eq(7);
		res.body.value.every((rec: any) => {
			expect(rec).to.satisfy((i: any) => i.store_id === "6");
		});
	});

	it("order by price asc", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$orderby=price").send();
		expect(res.body.value[0].price).to.eq(1.76);
		expect(res.body.value[res.body.value.length - 1].price).to.eq(1637.53);
	});
	it("order by price desc", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$orderby=price desc").send();
		expect(res.body.value[0].price).to.eq(1637.53);
		expect(res.body.value[res.body.value.length - 1].price).to.eq(1.76);
	});

	it("top 10", async () => {
		const res: any = await agent(await appstarter.GetApp()).get("/api/products?$top=5").send();
		expect(res.body.value.length).to.eq(5);
	});
});
