import axios from "axios";
import { generate } from "generate-progressbar";
import { config } from "./config";
import { IQuote } from "./types";

// TODO: create logger

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
	const {
		data: [quote],
	} = await axios.get<IQuote[]>("https://api.quotable.io/quotes/random");

	const image = `https://banner.338.rocks/banner?text=${encodeURIComponent(
		quote.content,
	)}&extension=jpeg`;

	const text =
		`"${quote.content}"\n` +
		`~ ${quote.author}\n\n` +
		`📦 Fetched from https://api.quotable.io/quotes/${quote._id}`;

	return {
		image,
		text,
	};
};

export const generateResponse = async () => {
	const progress = generateProgressString();
	const { text, image } = await getRandomQuote();

	return {
		content: `${text}\n\n${progress}\n\n⭐ This project is open sourced here: ${config.repoUrl}`,
		image,
	};
};
