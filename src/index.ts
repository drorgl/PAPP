import { get_logger } from "./logger";
const log = get_logger("unhandled");

process.on("unhandledRejection", (error) => {
	log.error("unhandled rejection", error);
});

import * as appstarter from "./app";

(async () => {
	const app = await appstarter.GetApp();
	appstarter.StartApp(app);
})();
