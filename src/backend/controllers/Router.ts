import { Elysia, StatusMap, t } from "elysia";
import { MySensorsRouter } from "../services/HomeAssistant/MySensors/Router";

export const RouterController = new Elysia({
	prefix: "/router",
	detail: {
		tags: ["Router"],
		description: "Get the router data",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/",
		async ({ status }) => {
			const router = new MySensorsRouter();
			const data = await router.getRouterData();
			return status(StatusMap["OK"], data);
		},
		{
			detail: {
				summary: "Get the router data",
				description: "Get the router data",
				security: [
					{
						headerAuth: [],
					},
				],
			},
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						cpuUsed: t.String({
							title: "CPU Used",
							description: "The CPU used by the router",
							examples: ["8.0 %"],
						}),
						memoryUsed: t.String({
							title: "Memory Used",
							description: "The memory used by the router",
							examples: ["58.5411604211962 %"],
						}),
						totalClients: t.String({
							title: "Total Clients",
							description:
								"The total number of clients connected to the router",
							examples: ["4 clients"],
						}),
						dataFetching: t.Union(
							[
								t.Literal("Enabled", {
									title: "Enabled",
									description:
										"If is enabled, the home assistant will fetch the data from the router",
									examples: ["Enabled"],
								}),
								t.Literal("Disabled", {
									title: "Disabled",
									description:
										"If is disabled, the home assistant will not fetch the data from the router",
									examples: ["Disabled"],
								}),
							],
							{
								title: "Data Fetching",
								description:
									"If is enabled, the home assistant will fetch the data from the router",
								examples: ["Enabled", "Disabled"],
							},
						),

						guestWifi: t.Union(
							[
								t.Literal("Enabled", {
									title: "Enabled",
									description: "If is enabled, the guest wifi will be enabled",
									examples: ["Enabled"],
								}),
								t.Literal("Disabled", {
									title: "Disabled",
									description:
										"If is disabled, the guest wifi will be disabled",
									examples: ["Disabled"],
								}),
							],
							{
								title: "Guest Wifi",
								description: "If is enabled, the guest wifi will be enabled",
								examples: ["Enabled", "Disabled"],
							},
						),
						downloadSpeed: t.String({
							title: "Download Speed",
							description: "The download speed of the router",
							examples: ["344.23 Mbps"],
						}),
						uploadSpeed: t.String({
							title: "Upload Speed",
							description: "The upload speed of the router",
							examples: ["133.94 Mbps"],
						}),
						ping: t.String({
							title: "Ping",
							description: "The ping of the router",
							examples: ["16 ms"],
						}),
						mainWifiClients: t.String({
							title: "Main Wifi Clients",
							description: "The number of clients connected to the main wifi",
							examples: ["4 clients"],
						}),
						guestWifiClients: t.String({
							title: "Guest Wifi Clients",
							description: "The number of clients connected to the guest wifi",
							examples: ["4 clients"],
						}),
						mainWiredClients: t.String({
							title: "Main Wired Clients",
							description: "The number of clients connected to the main wired",
							examples: ["4 clients"],
						}),
					},
					{
						title: "Router Data",
						description: "The data of the router",
						examples: [
							{
								cpuUsed: "8.0 %",
								memoryUsed: "58.5411604211962 %",
								totalClients: "4 clients",
								dataFetching: "Enabled",
								guestWifi: "Disabled",
								downloadSpeed: "344.23 Mbps",
								uploadSpeed: "133.94 Mbps",
								ping: "16 ms",
								mainWifiClients: "4 clients",
								guestWifiClients: "4 clients",
								mainWiredClients: "4 clients",
							},
						],
					},
				),
			},
		},
	)
	.post(
		"/reboot",
		async ({ status }) => {
			const router = new MySensorsRouter();
			await router.reboot();
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Reboot the router",
				description: "Reboot the router",
			},
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "OK",
					description: "The router was rebooted",
				}),
			},
		},
	)
	.post(
		"/enable-data-fetching",
		async ({ status }) => {
			const router = new MySensorsRouter();
			await router.enableDataFetching();
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Enable the data fetching",
				description: "Enable the data fetching",
			},
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "OK",
					description: "The data fetching was enabled",
				}),
			},
		},
	)
	.post(
		"/disable-data-fetching",
		async ({ status }) => {
			const router = new MySensorsRouter();
			await router.disableDataFetching();
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Disable the data fetching",
				description: "Disable the data fetching",
			},
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "OK",
					description: "The data fetching was disabled",
				}),
			},
		},
	)
	.post(
		"/enable-guest-wifi",
		async ({ status }) => {
			const router = new MySensorsRouter();
			await router.enableGuestWifi();
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Enable the guest wifi",
				description: "Enable the guest wifi",
			},
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "OK",
					description: "The guest wifi was enabled",
				}),
			},
		},
	)
	.post(
		"/disable-guest-wifi",
		async ({ status }) => {
			const router = new MySensorsRouter();
			await router.disableGuestWifi();
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Disable the guest wifi",
				description: "Disable the guest wifi",
			},
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "OK",
					description: "The guest wifi was disabled",
				}),
			},
		},
	)
	.as("scoped");
