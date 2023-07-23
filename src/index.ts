import { Logger } from "@hammerhq/logger";
import { schedule } from "node-cron";
import { Instagram } from "./modules/instagram";
import { Threads } from "./modules/threads";
import { generateResponse } from "./utils";

const logger = new Logger("[DailyQuotes]:");

const modules = [new Threads(), new Instagram()];

async function main() {
	try {
		logger.info("Starting DailyQuotes...");

		const job = schedule("0 1 * * *", async () => {
			logger.info("Running cron job...");

			const quote = await generateResponse();

			logger.info("Generated quote:");
			logger.info(quote);

			for (const module of modules) {
				await module.authenticate();

				await module.run(quote);
			}

			logger.success("Cron job finished!");
		});

		job.start();

		logger.success("Cron job started!");
	} catch (err) {
		logger.error(err);
	}
}

main();
