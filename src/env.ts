import { Logger } from "@hammerhq/logger";
import { config } from "dotenv";
import { cleanEnv, str } from "envalid";

config();

const logger = new Logger("[ENV]:");

const randomDeviceID = `android-${(Math.random() * 1e24).toString(36)}`;

export const env = cleanEnv(process.env, {
	THREADS_USERNAME: str(),
	THREADS_PASSWORD: str(),
	INSTAGRAM_USERNAME: str(),
	INSTAGRAM_PASSWORD: str(),
	DISCORD_WEBHOOK_URL: str(),
	API_NINJA_KEY: str(),
	DEVICE_ID: str({
		default: randomDeviceID,
	}),
});

if (env.DEVICE_ID === randomDeviceID) {
	logger.warning(
		`Using random device ID, set DEVICE_ID env var to a unique value to avoid login issues. Current device ID: ${env.DEVICE_ID}`,
	);
}
