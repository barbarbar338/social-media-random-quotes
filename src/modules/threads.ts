import { Logger } from "@hammerhq/logger";
import { ThreadsAPI } from "threads-api";
import { config } from "../config";
import { IGeneratedResponse } from "../types";

export class Threads {
	public readonly logger = new Logger("[ThreadsModule]:");

	private ready = false;

	private readonly threads = new ThreadsAPI({
		username: config.THREADS_USERNAME,
		password: config.THREADS_PASSWORD,
		deviceID: config.DEVICE_ID,
	});

	public async authenticate() {
		this.logger.info("Authenticating...");

		try {
			await this.threads.login();
			this.ready = true;
		} catch (error) {
			this.logger.error("Failed to authenticate, disabling module.");
			this.logger.warning(error);
		}

		if (this.ready) this.logger.success("Successfully authenticated.");
	}

	public async run(quote: IGeneratedResponse) {
		if (!this.ready) return;

		this.logger.info("Posting...");

		try {
			const res = await this.threads.publish({
				text: quote.text,
				attachment: {
					image: quote.image,
				},
			});
			this.logger.success("Successfully posted!", res);
		} catch (error) {
			this.logger.error("Failed to publish message.");
			this.logger.warning(error);
		}
	}
}
