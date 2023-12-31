import { Logger } from "@hammerhq/logger";
import axios from "axios";
import { generate } from "generate-progressbar";
import { config } from "./config";
import { IGeneratedResponse, IQuote } from "./types";

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

	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth();

	return (
		`📈 ${percentage.toFixed(2)}% ${bar}\n` +
		`📆 Today is ${today.toLocaleString("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
		})}\n` +
		`⏰ ${daysLeft} days left until new year!` +
		(day == 1 && month == 0 ? "\n🎉 Happy new years!" : "")
	);
};

export const getRandomQuote = async () => {
	let quote: IQuote = {
		content: "No man is free who is not master of himself.",
		author: "Epictetus",
	};

	try {
		const { data } = await axios.get<IQuote>(config.randomQuoteAPI);

		quote = data;
	} catch (error) {
		logger.error("Failed to fetch random quote from API.");
		logger.warning(error);
	}

	console.log(quote);

	const image = config.bannerAPI.replace(
		"%{text}",
		encodeURIComponent(quote.content),
	);

	const text =
		`"${quote.content}"\n` +
		`~ ${quote.author}\n\n` +
		`📦 Fetched from ${config.randomQuoteAPI}`;

	return { text, image };
};

export const generateResponse = async (): Promise<IGeneratedResponse> => {
	const progress = generateProgressString();
	const quote = await getRandomQuote();

	let res = `${quote.text}\n\n${progress}`;

	const today = new Date();

	const month = today.getMonth();
	const day = today.getDate();

	const birthdays = config.birthdays[month + 1][day];
	if (birthdays) {
		res += `\n\n🎂 Happy birthday to ${birthdays.join(", ")}!`;
	}

	return {
		text: `${res}\n\n⭐ This project is open sourced here: ${config.repoURL}`,
		image: quote.image,
	};
};
