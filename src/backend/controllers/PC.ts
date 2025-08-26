import { Elysia, StatusMap, t } from "elysia";
import { PCSensors } from "../services/HomeAssistant/MySensors/PC";

export const PCController = new Elysia({
	prefix: "/pc",
	detail: {
		tags: ["PC"],
		description: "Control the PC",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/status",
		async () => {
			return {
				isConnected: await PCSensors.isConnected(),
			};
		},
		{
			detail: {
				summary: "Get the PC status",
				description: "Get the PC status",
			},
			response: {
				200: t.Object(
					{
						isConnected: t.Boolean(),
					},
					{
						description: "PC status",
						example: {
							isConnected: true,
						},
					},
				),
			},
		},
	)
	.post(
		"/turn-off",
		async ({ status }) => {
			await PCSensors.turnOff();
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Turn off the PC",
				description: "Turn off the PC",
			},
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					description: "PC turned off",
				}),
			},
		},
	)
	.post(
		"/turn-on",
		async ({ status }) => {
			await PCSensors.turnOn();
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Turn on the PC",
				description: "Turn on the PC",
			},
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					description: "PC turned on",
				}),
			},
		},
	);
