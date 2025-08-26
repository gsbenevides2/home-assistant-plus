import { Button } from "../AbstractEntities/Button";
import { Sensor } from "../AbstractEntities/Sensor";
import { Switch } from "../AbstractEntities/Switch";

export class MySensorsRouter {
	private cpuUsed = new Sensor(
		"sensor.tp_link_router_cpu_used",
		"sensor.tp_link_router_cpu_used",
		{
			friendly_name: "TP-Link Router CPU used",
		},
	);

	private memoryUsed = new Sensor(
		"sensor.tp_link_router_memory_used",
		"sensor.tp_link_router_memory_used",
		{
			friendly_name: "TP-Link Router Memory used",
		},
	);

	private totalClients = new Sensor(
		"sensor.tp_link_router_total_clients",
		"sensor.tp_link_router_total_clients",
		{
			friendly_name: "TP-Link Router Total Clients",
		},
	);

	private dataFetchingSwitch = new Switch(
		"switch.router_data_fetching",
		"switch.router_data_fetching",
		{
			icon: "mdi:connection",
			friendly_name: "Router data fetching",
		},
	);

	private guestWifiSwitch = new Switch(
		"switch.guest_wifi_2_4g",
		"switch.guest_wifi_2_4g",
		{
			icon: "mdi:wifi",
			friendly_name: "Guest WIFI 2.4G",
		},
	);

	private downloadSpeedSensor = new Sensor(
		"sensor.speedtest_baixar",
		"sensor.speedtest_baixar",
		{
			friendly_name: "Download Speed",
		},
	);

	private uploadSpeedSensor = new Sensor(
		"sensor.speedtest_carregar",
		"sensor.speedtest_carregar",
		{
			friendly_name: "Upload Speed",
		},
	);

	private pingSensor = new Sensor(
		"sensor.speedtest_ping",
		"sensor.speedtest_ping",
		{
			friendly_name: "Ping",
		},
	);

	private mainWifiClientsSensor = new Sensor(
		"sensor.tp_link_router_total_main_wifi_clients",
		"sensor.tp_link_router_total_main_wifi_clients",
		{
			friendly_name: "Total main wifi clients",
		},
	);

	private guestWifiClientsSensor = new Sensor(
		"sensor.tp_link_router_total_guest_wifi_clients",
		"sensor.tp_link_router_total_guest_wifi_clients",
		{
			friendly_name: "Total guest wifi clients",
		},
	);

	private mainWiredClientsSensor = new Sensor(
		"sensor.tp_link_router_total_wired_clients",
		"sensor.tp_link_router_total_wired_clients",
		{
			friendly_name: "Total wired clients",
		},
	);

	private rebootButton = new Button("button.reboot", "button.reboot");

	private async getCpuUsed() {
		const cpuUsed = await this.cpuUsed.getData();
		return `${cpuUsed.state} %`;
	}

	private async getMemoryUsed() {
		const memoryUsed = await this.memoryUsed.getData();
		return `${memoryUsed.state} %`;
	}

	private async getTotalClients() {
		const totalClients = await this.totalClients.getData();
		return `${totalClients.state} clients`;
	}

	private async getRouterDataFetching() {
		const dataFetching = await this.dataFetchingSwitch.getData();
		return dataFetching.state === "on" ? "Enabled" : "Disabled";
	}

	private async getGuestWifi() {
		const guestWifi = await this.guestWifiSwitch.getData();
		return guestWifi.state === "on" ? "Enabled" : "Disabled";
	}

	private async getDownloadSpeed() {
		const downloadSpeed = await this.downloadSpeedSensor.getData();
		return `${downloadSpeed.state} Mbps`;
	}

	private async getUploadSpeed() {
		const uploadSpeed = await this.uploadSpeedSensor.getData();
		return `${uploadSpeed.state} Mbps`;
	}

	private async getPing() {
		const ping = await this.pingSensor.getData();
		return `${ping.state} ms`;
	}

	private async getMainWifiClients() {
		const mainWifiClients = await this.mainWifiClientsSensor.getData();
		return `${mainWifiClients.state} clients`;
	}

	private async getGuestWifiClients() {
		const guestWifiClients = await this.guestWifiClientsSensor.getData();
		return `${guestWifiClients.state} clients`;
	}

	private async getMainWiredClients() {
		const mainWiredClients = await this.mainWiredClientsSensor.getData();
		return `${mainWiredClients.state} clients`;
	}

	async enableGuestWifi() {
		await this.guestWifiSwitch.turnOn();
	}

	async disableGuestWifi() {
		await this.guestWifiSwitch.turnOff();
	}

	async reboot() {
		await this.rebootButton.click();
	}

	async disableDataFetching() {
		await this.dataFetchingSwitch.turnOff();
	}

	async enableDataFetching() {
		await this.dataFetchingSwitch.turnOn();
	}

	async getRouterData() {
		const [
			cpuUsed,
			memoryUsed,
			totalClients,
			dataFetching,
			guestWifi,
			downloadSpeed,
			uploadSpeed,
			ping,
			mainWifiClients,
			guestWifiClients,
			mainWiredClients,
		] = await Promise.all([
			this.getCpuUsed(),
			this.getMemoryUsed(),
			this.getTotalClients(),
			this.getRouterDataFetching(),
			this.getGuestWifi(),
			this.getDownloadSpeed(),
			this.getUploadSpeed(),
			this.getPing(),
			this.getMainWifiClients(),
			this.getGuestWifiClients(),
			this.getMainWiredClients(),
		]);
		return {
			cpuUsed,
			memoryUsed,
			totalClients,
			dataFetching,
			guestWifi,
			downloadSpeed,
			uploadSpeed,
			ping,
			mainWifiClients,
			guestWifiClients,
			mainWiredClients,
		};
	}
}
