import bunyan = require("bunyan");
const config = require("../config.json");

export function get_logger(name: string): bunyan {
	const log = bunyan.createLogger({
		name,
		stream: process.stdout,
		level: config.log_level
	});
	return log;
}
