import { Logger } from "@hammerhq/logger";
import axios from "axios";
import { generate } from "generate-progressbar";
import { config } from "./config";
import { IQuote } from "./types";

const logger = new Logger("[Utils]:");

export const calculateDaysLeftUntilNextYear = () => {
	const now = new Date();
	const nextYear = new Date(now.getFullYear() + 1, 0, 1);
	return Math.ceil(
		(nextYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
	);
};

export const generateProgressString = () => {
	const daysLeft = calculateDaysLeftUntilNextYear();
	const percentage = 100 - (daysLeft / 365) * 100;
	const bar = generate(25, percentage);

	return (
		`📈 ${percentage.toFixed(2)}% ${bar}\n` +
		`📆 Today is ${new Date().toLocaleString("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
		})}\n` +
		`⏰ ${daysLeft} days left until new year!`
	);
};

export const getRandomQuote = async () => {
	let quote: IQuote = {
		_id: "37aUWcuNWjSh",
		author: "Frank Lloyd Wright",
		content:
			"The thing always happens that you really believe in; and the belief in a thing makes it happen. (Cannot fetch a new quote from API, using default quote instead.)",
	};

	try {
		const { data } = await axios.get<IQuote[]>(
			`${config.randomQuoteAPI}/random`,
		);

		quote = data[0];
	} catch (error) {
		logger.error("Failed to fetch random quote from API.");
		logger.warning(error);
	}

	const image = config.bannerAPI.replace(
		"%{text}",
		encodeURIComponent(quote.content),
	);

	const text =
		`"${quote.content}"\n` +
		`~ ${quote.author}\n\n` +
		`📦 Fetched from ${config.randomQuoteAPI}/${quote._id}`;

	return {
		image,
		text,
	};
};

export const generateResponse = async () => {
	const progress = generateProgressString();
	const { text, image } = await getRandomQuote();

	return {
		content: `${text}\n\n${progress}\n\n⭐ This project is open sourced here: ${config.repoURL}`,
		image,
	};
};
