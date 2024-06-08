import axios from "axios";

type ShortestPathData = {
	readonly nodeNames: string[];
	readonly distance: number;
};

async function sendDataToEchoAPI(data: ShortestPathData): Promise<{ success: boolean; status: number; data: any }> {
	try {
		const response = await axios.post("https://echo.free.beeceptor.com/", data);
		return { success: true, status: response.status, data: response.data };
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return { success: false, status: error.response.status, data: data };
		} else {
			return { success: false, status: 0, data: data };
		}
	}
}

export default sendDataToEchoAPI;
