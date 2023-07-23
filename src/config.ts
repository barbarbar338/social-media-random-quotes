import { birthdays } from "./birthdays";
import { env } from "./env";

export const config = {
	repoURL: "https://gitea.338.rocks/barbarbar338/threads-daily-random-quote",
	randomQuoteAPI: "https://api.quotable.io/quotes",
	bannerAPI: `https://banner.338.rocks/banner?text=%{text}&extension=jpeg`,
	...env,
	birthdays,
	avatarURL:
		"https://worker.338.rocks/storage/uploads/images/456053332516143104.png",
};
