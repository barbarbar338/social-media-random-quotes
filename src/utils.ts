import axios from "axios";
import { generate } from "generate-progressbar";
import sharp from "sharp";
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

	const image = await getImage(quote.content);

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
		content: `${text}\n\n${progress}\n\n⭐ This project is open sourced here: https://gitea.338.rocks/barbarbar338/threads-daily-random-quote`,
		image,
	};
};

// * Threads wants a JPG image, so we have to convert it. I will add an option to banner API to return a JPG image.
// TODO: add option to banner API to return a JPG image
export const getImage = async (text: string) => {
	const imageURL = `https://banner.338.rocks/banner?text=${encodeURIComponent(
		text,
	)}`;

	const { data } = await axios.get(imageURL, {
		responseType: "arraybuffer",
	});

	const buffer = Buffer.from(data, "binary");

	const res = await sharp(buffer)
		.resize(1280, 720)
		.toFormat("jpg")
		.toBuffer();

	return res;
};
