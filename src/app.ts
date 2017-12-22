import Koa = require("koa");
import koajson = require("koa-json");
import Router = require("koa-router");
const config = require("../config.json");
import { SampleDataSource } from "./data_sources/sample_data_source";
import { get_logger } from "./logger";
import register_products from "./routes/products";
import register_stats from "./routes/stats";
const log = get_logger("app");

export async function GetApp(): Promise<Koa> {
	return new Promise<Koa>((resolve, reject) => {
		log.info("starting...");
		const app = new Koa();
		const router = new Router();

		register_products(router);

		register_stats(router);

		app.use(koajson());

		app.use(router.routes());
		app.use(router.allowedMethods());

		app.on("error", (err) => {
			log.error("server error", err);
		});
		resolve(app);
	});
}

export async function StartApp(app: Koa) {
	app.listen(config.http_server_port, () => {
		log.info("started on port", config.http_server_port);
	});
}
