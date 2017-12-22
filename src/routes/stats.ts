import Koa = require("koa");
import Router = require("koa-router");
import { createFilter } from "odata-v4-mongodb";
import { get_instance } from "../data_sources/data_source";

import { get_logger } from "../logger";
const log = get_logger("routes_stats");

interface IStoreStats {
	store_id: string;
	number_of_products: number;
	price_range: number[];
	average_price: number;
}

export default function register_stats(router: Router) {
	log.info("registering stats routes");

	router.get("/api/stats", async (ctx: Koa.BaseContext) => {
		log.debug(ctx.method, "/api/stats", ctx.query, ctx.body);

		const dbinstance = await get_instance();
		const product_collection = dbinstance.collection("products");
		const store_collection = dbinstance.collection("stores");

		const stats = await product_collection.aggregate([{ $group: { _id: "$store_id", avg_price: { $avg: "$price" }, min_price: { $min: "$price" }, max_price: { $max: "$price" }, products_count: { $sum: 1 } } }]);
		const stats_data = await stats.toArray();

		const store_ids = stats_data.map((i) => i._id);

		const stores = await store_collection.find({ _id: { $in: store_ids } });
		const stores_data = await stores.toArray();

		// consolidate store and store statistics into one object
		const agg_stores = stores_data.map((store: any) => {
			return Object.assign(store, stats_data.find((i) => i._id === store._id));
		});

		ctx.body = {
			value: agg_stores
		};
	});
}
