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
			this.logger.warning("Failed to authenticate, disabling module.");
		}

		if (this.ready) this.logger.success("Successfully authenticated.");
	}

	private createMessage = (quote: IGeneratedResponse) => ({
		text: quote.text,
		attachment: {
			image: quote.image,
		},
	});

	public async run(quote: IGeneratedResponse) {
		if (!this.ready) return;

		this.logger.info("Posting...");

		const message = this.createMessage(quote);

		try {
			const res = await this.threads.publish(message);
			this.logger.success("Successfully posted!", res);
		} catch (error) {
			this.logger.error("Failed to publish message.");
			this.logger.warning(error);
		}
	}
}
