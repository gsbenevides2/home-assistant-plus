import { PCSensors } from "./MySensors/PC";

export async function setupAllButtons() {
	await PCSensors.setupButton();
}
