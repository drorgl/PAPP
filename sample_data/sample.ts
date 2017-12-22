import { IProduct } from "../src/models/product";
import { IStore } from "../src/models/store";

import * as parse from "csv-parse";
import fs = require("fs");

// load stores from csv file
export async function load_stores(filename: string): Promise<IStore[]> {
	return new Promise<IStore[]>((resolve, reject) => {
		const rs = fs.createReadStream(filename);
		rs.on("error", (error) => {
			reject("error loading file" + error.toString());
		});

		const parser = parse({ columns: true }, (err, data) => {
			resolve(data.map((row: any) => {
				return {
					_id: row.id,
					name: row.name,
					url: row.url
				};
			}));
		});
		rs.pipe(parser);
	});
}

// load products from csv file
export async function load_products(filename: string): Promise<IProduct[]> {
	return new Promise<IProduct[]>((resolve, reject) => {

		const rs = fs.createReadStream(filename);
		rs.on("error", (error) => {
			reject("error loading file" + error.toString());
		});

		const parser = parse({ columns: true }, (err, data) => {
			resolve(data.map((row: any) => {
				return {
					_id: row.id,
					price: parseFloat(row.price),
					shipping: row.shipping,
					sku: row.sku,
					title: row.title,
					brand: row.brand,
					store_id: row.store_id
				};
			}));
		});
		rs.pipe(parser);

	});
}
