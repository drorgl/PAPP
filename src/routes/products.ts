import Koa = require("koa");
import Router = require("koa-router");
import { createQuery } from "odata-v4-mongodb";
import { get_instance } from "../data_sources/data_source";

import { get_logger } from "../logger";
const log = get_logger("routes_products");

export default function register_products(router: Router) {
	log.info("registering products routes");

	router.get("/api/products", async (ctx: Koa.BaseContext) => {
		log.debug(ctx.method, "/api/products", ctx.query, ctx.body);
		try {
			const dbinstance = await get_instance();
			const products = dbinstance.collection("products");

			let data = null;

			// if there is a query string, use odata connector, otherwise return all values
			if (ctx.querystring !== "") {
				const query = createQuery(ctx.querystring);
				data = (Object.keys(query.query).length) ? products.find(query.query) : products.find();
				if (query.sort) {
					data = data.sort(query.sort);
				}
				if (query.limit) {
					data = data.limit(query.limit);
				}
			} else {
				data = products.find();
			}

			const records = await data.toArray();
			log.debug("serving", records.length, "records");

			ctx.body = {
				"@odata.context": ctx.protocol + "://" + ctx.get("host") + "/api/$metadata#products",
				"value": records
			};
		} catch (e) {
			log.error("unable to serve request /api/products", e);
		}

	});
}
