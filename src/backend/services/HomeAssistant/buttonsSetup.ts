import { TurnOffPc } from "./MySensors/TurnOffPc";

export async function setupAllButtons() {
	await TurnOffPc.getInstance().setupButton();
}
