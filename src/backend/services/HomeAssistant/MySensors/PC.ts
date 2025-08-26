import axios from "axios";
import { getEnv } from "../../../../utils/getEnv";
import { TpLinkDeviceTracker } from "../AbstractEntities/TpLinkDeviceTracker";
import { MQTTHomeAssistantClient } from "../MQTT/Client";
import { WakeOnLan } from "./WakeOnLan";

export class PCSensors {
	private static network_status = new TpLinkDeviceTracker(
		"device_tracker.gsbenevides2_pc",
		"device_tracker.gsbenevides2_pc",
		{
			source_type: "router",
			friendly_name: "gsbenevides2-pc",
		},
	);

	public static async turnOff() {
		const { attributes } = await PCSensors.network_status.getData();
		const ip = attributes.ip;
		if (!ip) {
			return;
		}
		const url = new URL(`http://${ip}:8624`);
		const password = getEnv("TURN_OFF_PC_PASSWORD");
		url.searchParams.set("auth", password);
		axios.get(url.toString());
	}

	public static async turnOn() {
		await WakeOnLan.wakeUp("PC_Guilherme");
	}

	public static async isConnected() {
		const { state } = await PCSensors.network_status.getData();
		return state === "home";
	}

	public static async setupButton() {
		const mqttClient = MQTTHomeAssistantClient.getInstance();
		mqttClient.createButton("turn_off_pc", "Turn Off PC", "1.0.0", () => {
			PCSensors.turnOff();
		});
	}
}
