import { Elysia, StatusMap, t } from "elysia";
import {
	type AvailableLightsNames,
	availableLightsNames,
	TuyaLight,
} from "../services/HomeAssistant/MySensors/TuyaLight";

export const TuyaLightController = new Elysia({
	prefix: "/lights",
	detail: {
		tags: ["Tuya Lights"],
		description: "Control Tuya smart lights",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/available",
		async ({ status }) => {
			return status(StatusMap["OK"], {
				lights: Array.from<string>(availableLightsNames),
			});
		},
		{
			detail: {
				summary: "Get available lights",
				description: "Returns list of available lights for control",
				security: [
					{
						headerAuth: [],
					},
				],
			},
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						lights: t.Array(t.String(), {
							title: "Available Lights",
							description: "List of available lights",
							examples: [["Quarto Gui", "Quarto Ana"]],
						}),
					},
					{
						title: "Available Lights Response",
						description: "List of all controllable lights",
						examples: [
							{
								lights: ["Quarto Gui", "Quarto Ana"],
							},
						],
					},
				),
			},
		},
	)
	.get(
		"/status/:lightName",
		async ({ status, params: { lightName } }) => {
			if (!availableLightsNames.includes(lightName as AvailableLightsNames)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid light name",
				});
			}
			const [lightState, brightness] = await Promise.all([
				TuyaLight.getLightState(lightName as AvailableLightsNames),
				TuyaLight.getLightBrightness(lightName as AvailableLightsNames),
			]);
			console.log(lightState, brightness);
			return status(StatusMap["OK"], {
				lightName,
				state: lightState,
				brightness,
			});
		},
		{
			detail: {
				summary: "Get light status",
				description:
					"Returns the current state and brightness of the specified light",
				security: [
					{
						headerAuth: [],
					},
				],
			},
			params: t.Object({
				lightName: t.String({
					title: "Light Name",
					description: "The name of the light to check",
					examples: ["Quarto Gui", "Quarto Ana"],
				}),
			}),
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						lightName: t.String({
							title: "Light Name",
							description: "The name of the light",
							examples: ["Quarto Gui"],
						}),
						state: t.Union(
							[
								t.Literal("on", {
									title: "On",
									description: "Light is turned on",
									examples: ["on"],
								}),
								t.Literal("off", {
									title: "Off",
									description: "Light is turned off",
									examples: ["off"],
								}),
								t.Literal("unavailable", {
									title: "Unavailable",
									description: "Light is unavailable",
									examples: ["unavailable"],
								}),
							],
							{
								title: "Light State",
								description: "Current state of the light",
								examples: ["on", "off", "unavailable"],
							},
						),
						brightness: t.Union([t.Number(), t.Null()], {
							title: "Brightness",
							description: "Current brightness level (0-100)",
							examples: [75, 100, 25, null],
							minimum: 0,
							maximum: 100,
						}),
					},
					{
						title: "Light Status",
						description: "Current status and brightness of the light",
						examples: [
							{
								lightName: "Quarto Gui",
								state: "on",
								brightness: 75,
							},
						],
					},
				),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid light name"],
						}),
					},
					{
						title: "Error Response for Invalid Light Name",
						description: "Error message when the light name is invalid",
						examples: [{ error: "Invalid light name" }],
					},
				),
			},
		},
	)
	.post(
		"/control/:lightName/:state",
		async ({ status, params: { lightName, state } }) => {
			if (!availableLightsNames.includes(lightName as AvailableLightsNames)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid light name",
				});
			}
			if (state !== "on" && state !== "off") {
				return status(StatusMap["Bad Request"], {
					error: "State must be 'on' or 'off'",
				});
			}
			await TuyaLight.setLightState(lightName as AvailableLightsNames, state);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Turn light on or off",
				description: "Controls the on/off state of the specified light",
				security: [
					{
						headerAuth: [],
					},
				],
			},
			params: t.Object({
				lightName: t.String({
					title: "Light Name",
					description: "The name of the light to control",
					examples: ["Quarto Gui", "Quarto Ana"],
				}),
				state: t.Union([t.Literal("on"), t.Literal("off")], {
					title: "Light State",
					description: "The desired state for the light",
					examples: ["on", "off"],
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Light state changed successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object({
					error: t.String({
						title: "Error",
						description: "Error message",
						examples: ["Invalid light name", "State must be 'on' or 'off'"],
					}),
				}),
			},
		},
	)
	.post(
		"/brightness/:lightName/:brightness",
		async ({ status, params: { lightName, brightness } }) => {
			if (!availableLightsNames.includes(lightName as AvailableLightsNames)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid light name",
				});
			}

			await TuyaLight.setLightBrightness(
				lightName as AvailableLightsNames,
				brightness,
			);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Set light brightness",
				description: "Sets the brightness level of the specified light",
				security: [
					{
						headerAuth: [],
					},
				],
			},
			params: t.Object({
				lightName: t.String({
					title: "Light Name",
					description: "The name of the light to control",
					examples: ["Quarto Gui", "Quarto Ana"],
				}),
				brightness: t.Number({
					title: "Brightness",
					description: "Brightness level (0-100)",
					examples: [50, 75, 100],
					minimum: 0,
					maximum: 100,
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Light brightness set successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid light name"],
						}),
					},
					{
						title: "Error Response for Invalid Light Name",
						description: "Error message when the light name is invalid",
						examples: [{ error: "Invalid light name" }],
					},
				),
			},
		},
	)
	.as("scoped");
