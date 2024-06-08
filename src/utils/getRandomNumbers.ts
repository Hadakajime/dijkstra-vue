import axios from "axios";

export async function getRandomNumbers(): Promise<{ fromNode: string; toNode: string }> {
	try {
		const response1 = await axios.get("https://corsproxy.io/?https://2g.be/twitch/randomnumber.php?defstart=5&defend=26");
		const response2 = await axios.get("https://corsproxy.io/?https://2g.be/twitch/randomnumber.php?defstart=5&defend=26");

		const number1 = response1.data;
		const number2 = response2.data;
		const convertedNumber1 = convertToLetter(number1);
		const convertedNumber2 = convertToLetter(number2);
		return {
			fromNode: convertedNumber1,
			toNode: convertedNumber2,
		};
	} catch (error) {
		console.error("Error fetching random numbers:", error);
		throw error;
	}
}

function convertToLetter(number: number): string {
	return String.fromCharCode(65 + ((number - 1) % 9));
}
