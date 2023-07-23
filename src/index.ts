import { Logger } from "@hammerhq/logger";
import { Threads } from "./modules/threads";
import { generateResponse } from "./utils";

const logger = new Logger("[DailyQuotes]:");

const modules = [new Threads()];

async function main() {
	try {
		logger.info("Starting DailyQuotes...");

		const quote = await generateResponse();

		for (const module of modules) {
			await module.authenticate();

			await module.run(quote);
		}

		logger.success("Successfully posted all quotes!");
	} catch (err) {
		logger.error(err);
	}
}

main();
