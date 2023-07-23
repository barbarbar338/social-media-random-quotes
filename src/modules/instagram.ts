import { Logger } from "@hammerhq/logger";
import axios from "axios";
import { IgApiClient } from "instagram-private-api";
import { config } from "../config";
import { IGeneratedResponse } from "../types";

export class Instagram {
	public readonly logger = new Logger("[InstagramModule]:");

	private ready = false;

	private readonly ig = new IgApiClient();

	public async authenticate() {
		this.logger.info("Authenticating...");

		try {
			this.ig.state.generateDevice(config.DEVICE_ID);

			await this.ig.account.login(
				config.INSTAGRAM_USERNAME,
				config.INSTAGRAM_PASSWORD,
			);

			this.ready = true;
		} catch (error) {
			this.logger.warning("Failed to authenticate, disabling module.");
			this.logger.warning(error);
		}

		if (this.ready) this.logger.success("Successfully authenticated.");
	}

	private async createMessage(quote: IGeneratedResponse) {
		const buffer = await axios.get(quote.image, {
			responseType: "arraybuffer",
		});

		return {
			text: quote.text,
			image: Buffer.from(buffer.data),
		};
	}

	public async run(quote: IGeneratedResponse) {
		if (!this.ready) return;

		this.logger.info("Posting...");

		const message = await this.createMessage(quote);

		try {
			const res = await this.ig.publish.photo({
				file: message.image,
				caption: message.text,
			});

			this.logger.success("Successfully posted!", res.upload_id);
		} catch (error) {
			this.logger.error("Failed to publish message.");
			this.logger.warning(error);
		}
	}
}
