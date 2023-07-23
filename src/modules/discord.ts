import { Logger } from "@hammerhq/logger";
import { EmbedBuilder, WebhookClient } from "discord.js";
import { config } from "../config";
import { IGeneratedResponse } from "../types";

export class Discord {
	public readonly logger = new Logger("[DiscordModule]:");

	private ready = false;

	private readonly webhook = new WebhookClient({
		url: config.DISCORD_WEBHOOK_URL,
	});

	public async authenticate() {
		this.logger.info("Authenticating...");

		this.ready = true;

		this.logger.success("Successfully authenticated.");
	}

	public async run(quote: IGeneratedResponse) {
		if (!this.ready) return;

		this.logger.info("Posting...");

		try {
			const embed = new EmbedBuilder()
				.setAuthor({
					name: "Daily Quote",
					iconURL: config.avatarURL,
					url: config.repoURL,
				})
				.setColor("Blurple")
				.setDescription(quote.text)
				.setTimestamp()
				.setImage(quote.image)
				.setThumbnail(config.avatarURL);

			const res = await this.webhook.send({
				embeds: [embed],
				avatarURL: config.avatarURL,
				username: "Daily Quote",
			});

			this.logger.success("Successfully posted!", res.id);
		} catch (error) {
			this.logger.error("Failed to publish message.");
			this.logger.warning(error);
		}
	}
}
