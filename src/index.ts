import { Logger } from "@hammerhq/logger";
import { ThreadsAPI } from "threads-api";
import { config } from "./config";
import { generateResponse } from "./utils";

const logger = new Logger("[ThreadsDailyQuotes]:");

async function main() {
	try {
		const threads = new ThreadsAPI({
			username: config.THREADS_USERNAME,
			password: config.THREADS_PASSWORD,
			deviceID: config.THREADS_DEVICE_ID,
		});

		const quote = await generateResponse();

		const res = await threads.publish({
			text: quote.content,
			attachment: {
				image: quote.image,
			},
		});

		logger.success("Successfully posted to threads!", res);
	} catch (err) {
		logger.error(err);
	}
}

main();
