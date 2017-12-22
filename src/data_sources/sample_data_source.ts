import * as sample from "../../sample_data/sample";
const MongoInMemory = require("mongo-in-memory");
import mongodb = require("mongodb");
import { get_logger } from "../logger";
const config = require("../../config.json");
const log = get_logger("sample_data");

// in memory data store
export class SampleDataSource {
	private _started: boolean;
	private mongoServerInstance: any = null;
	constructor(private mongo_port: number) {
		this._started = false;
	}

	// gets a mongodb instance, initialize the memory database with data if it doesn't exists
	public async get_instance(): Promise<mongodb.Db> {
		if (!this._started) {
			await this.start();
			try {
				await this.initialize_in_memory_mongodb();
			} catch (e) {
				log.error("unable to insert sample into mongodb", e);
			}
		}

		return await this.get_db_instance();
	}

	// starts the in-memory mongodb server
	public async  start() {
		return new Promise<void>(async (resolve, reject) => {
			log.info("starting in-memory mongodb");

			this.mongoServerInstance = new MongoInMemory(this.mongo_port); // DEFAULT PORT is 27017

			this.mongoServerInstance.start((error: any, conf: any) => {

				if (error) {
					log.error("error starting in-memory mongodb", error);
					reject("error starting in-memory mongodb");
				} else {
					log.info("in-memory mongo started", conf.host, conf.port);
					this._started = true;
					resolve();
				}
			});
		});
	}

	// stops the in-memory mongodb server
	public async  stop(): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			log.info("stopping in-memory mongodb");
			this.mongoServerInstance.stop((error: any) => {
				if (error) {
					log.error("error stopping in-memory mongodb", error);
					reject();
				} else {
					log.info("in-memory mongodb stopped");
					resolve();
				}

			});
		});
	}

	// get a mongodb instance
	private get_db_instance(): Promise<mongodb.Db> {
		return new Promise<mongodb.Db>((resolve, reject) => {
			this.mongoServerInstance.getConnection("sample", (err: Error, conn: mongodb.Db) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(conn);
			});
		});
	}

	// initialize in-memory databse with data from csv files
	private async initialize_in_memory_mongodb() {
		const dbinst = await this.get_db_instance();

		log.info("loading stores");
		const stores = await sample.load_stores(__dirname + "/../../sample_data/stores.csv");
		log.debug("found", stores.length, "stores");
		const dbstores = await dbinst.createCollection("stores");
		await dbstores.insertMany(stores);

		log.info("loading products");
		const products = await sample.load_products(__dirname + "/../../sample_data/products.csv");
		log.debug("found", products.length, "products");
		const dbproducts = await dbinst.createCollection("products");
		await dbproducts.insertMany(products);
	}

}

// singleton
export let datasource = new SampleDataSource(config.in_memory_mongodb_port);
