import mongodb = require("mongodb");
import * as inmemorymongo from "./sample_data_source";

// exposes the datastore to all other components
export async function get_instance(): Promise<mongodb.Db> {
	return await inmemorymongo.datasource.get_instance();
}
