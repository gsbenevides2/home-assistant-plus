import { Elysia, StatusMap, t } from "elysia";
import {
	FanSensors,
	type FanSensorsRooms,
	type Velocities,
} from "../services/HomeAssistant/MySensors/FanSensors";

export const FanSensorsController = new Elysia({
	prefix: "/fan",
	detail: {
		tags: ["Fan Sensors"],
		description: "Control and get fan data",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/status/:room",
		async ({ status, params: { room } }) => {
			if (!FanSensors.rooms.includes(room as FanSensorsRooms)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid room",
				});
			}
			const fanStatus = await FanSensors.getFanRoom(room as FanSensorsRooms);
			return status(StatusMap["OK"], {
				room,
				velocity: fanStatus,
			});
		},
		{
			detail: {
				summary: "Get fan status for a specific room",
				description: "Returns the current fan velocity for the specified room",
				security: [
					{
						headerAuth: [],
					},
				],
			},
			params: t.Object({
				room: t.String({
					title: "Room",
					description: "The room to check fan status",
					examples: ["Quarto Gui"],
				}),
			}),
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						room: t.String({
							title: "Room",
							description: "The room that was checked",
							examples: ["Quarto Gui"],
						}),
						velocity: t.Union(
							[
								t.Literal("alta"),
								t.Literal("media"),
								t.Literal("baixa"),
								t.Literal("desligado"),
								t.Literal("off"),
							],
							{
								title: "Fan Velocity",
								description: "Current fan velocity setting",
								examples: ["alta", "media", "baixa", "desligado", "off"],
							},
						),
					},
					{
						title: "Fan Status",
						description: "The fan status for the specified room",
						examples: [
							{
								room: "Quarto Gui",
								velocity: "alta",
							},
						],
					},
				),
				[StatusMap["Bad Request"]]: t.Object({
					error: t.String({
						title: "Error",
						description: "Error message",
						examples: ["Invalid room"],
					}),
				}),
			},
		},
	)
	.post(
		"/control/:room/:velocity",
		async ({ status, params: { room, velocity } }) => {
			if (!FanSensors.rooms.includes(room as FanSensorsRooms)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid room",
				});
			}
			if (!FanSensors.velocities.includes(velocity as Velocities)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid velocity",
				});
			}
			await FanSensors.setFanRoom(
				room as FanSensorsRooms,
				velocity as Velocities,
			);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Set fan velocity for a specific room",
				description: "Sets the fan velocity for the specified room",
				security: [
					{
						headerAuth: [],
					},
				],
			},
			params: t.Object({
				room: t.String({
					title: "Room",
					description: "The room to control the fan",
					examples: ["Quarto Gui"],
				}),
				velocity: t.Union(
					[
						t.Literal("alta"),
						t.Literal("media"),
						t.Literal("baixa"),
						t.Literal("desligado"),
					],
					{
						title: "Velocity",
						description: "The velocity to set for the fan",
						examples: ["alta", "media", "baixa", "desligado"],
					},
				),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Fan velocity was set successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object({
					error: t.String({
						title: "Error",
						description: "Error message",
						examples: ["Invalid room", "Invalid velocity"],
					}),
				}),
			},
		},
	)
	.as("scoped");
