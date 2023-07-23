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
	DEVICE_ID: str({
		default: randomDeviceID,
	}),
});

if (env.DEVICE_ID === randomDeviceID) {
	logger.warning(
		"Using random device ID, set THREADS_DEVICE_ID env var to a unique value to avoid login issues.",
	);
}
