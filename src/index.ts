import { Logger } from "@hammerhq/logger";
import { ThreadsAPI } from "threads-api";
import { env } from "./env";
import { generateResponse } from "./utils";

const logger = new Logger("[ThreadsDailyQuotes]:");

async function main() {
	try {
		const threads = new ThreadsAPI({
			username: env.THREADS_USERNAME,
			password: env.THREADS_PASSWORD,
			deviceID: env.THREADS_DEVICE_ID,
		});

		const quote = await generateResponse();

		const res = await threads.publish({
			text: quote.content,
			attachment: {
				image: {
					type: "image/jpg",
					data: quote.image,
				},
			},
		});

		logger.success("Successfully posted to threads!", res);
	} catch (err) {
		logger.error(err);
	}
}

main();
