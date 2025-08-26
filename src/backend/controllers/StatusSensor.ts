import Elysia, { StatusMap, t } from "elysia";
import {
	type StatusSensorData,
	StatusSensorInstance,
} from "../services/HomeAssistant/MySensors/StatusSensor";

export const StatusSensorController = new Elysia({
	prefix: "/status",
	detail: {
		tags: ["Status Sensor"],
		description: "Monitor platform status sensors",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/:name",
		async ({ params, status }) => {
			const { name } = params;
			try {
				const data = await StatusSensorInstance.getInstance().getData(name);
				return status(StatusMap["OK"], data);
			} catch {
				return status(StatusMap["Not Found"], {
					message: `Status sensor '${name}' not found`,
				});
			}
		},
		{
			detail: {
				summary: "Get status sensor data",
				description: "Get the status data for a specific platform sensor",
			},
			params: t.Object({
				name: t.String({
					title: "Sensor Name",
					description: "The name of the status sensor to retrieve",
					examples: ["GitHub", "Discord", "Vercel"],
				}),
			}),
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						name: t.String({
							title: "Sensor Name",
							description: "The name of the status sensor",
							examples: ["GitHub"],
						}),
						status_url: t.String({
							title: "Status URL",
							description: "The URL to check the platform status",
							examples: ["https://www.githubstatus.com/"],
						}),
						problem_description: t.Optional(
							t.String({
								title: "Problem Description",
								description: "Description of any current problems",
								examples: [
									"API rate limiting is currently experiencing delays",
								],
							}),
						),
						hasProblem: t.Boolean({
							title: "Has Problem",
							description: "Whether the platform currently has problems",
							examples: [false, true],
						}),
					},
					{
						title: "Status Sensor Data",
						description: "Platform status sensor information",
						examples: [
							{
								name: "GitHub",
								status_url: "https://www.githubstatus.com/",
								problem_description: undefined,
								hasProblem: false,
							},
						],
					},
				),
				[StatusMap["Not Found"]]: t.Object(
					{
						message: t.String({
							title: "Error Message",
							description: "Error message indicating the sensor was not found",
							examples: ["Status sensor 'GitHub' not found"],
						}),
					},
					{
						title: "Error Response",
						description: "Error when sensor is not found",
						examples: [
							{
								message: "Status sensor 'GitHub' not found",
							},
						],
					},
				),
			},
		},
	)
	.post(
		"/:name",
		async ({ params, body, status }) => {
			const { name } = params;
			try {
				const sensorData: StatusSensorData = {
					name,
					status_url: body.status_url,
					problem_description: body.problem_description,
					hasProblem: body.hasProblem,
				};
				StatusSensorInstance.getInstance().sendData(sensorData);
				return status(StatusMap["No Content"], undefined);
			} catch {
				return status(StatusMap["Internal Server Error"], {
					message: `Failed to update status sensor '${name}'`,
				});
			}
		},
		{
			detail: {
				summary: "Update status sensor data",
				description: "Update the status data for a specific platform sensor",
			},
			params: t.Object({
				name: t.String({
					title: "Sensor Name",
					description: "The name of the status sensor to update",
					examples: ["GitHub", "Discord", "Vercel"],
				}),
			}),
			body: t.Object({
				status_url: t.String({
					title: "Status URL",
					description: "The URL to check the platform status",
					examples: ["https://www.githubstatus.com/"],
				}),
				problem_description: t.Optional(
					t.String({
						title: "Problem Description",
						description: "Description of any current problems",
						examples: ["API rate limiting is currently experiencing delays"],
					}),
				),
				hasProblem: t.Boolean({
					title: "Has Problem",
					description: "Whether the platform currently has problems",
					examples: [false, true],
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Status sensor updated successfully",
				}),
				[StatusMap["Internal Server Error"]]: t.Object(
					{
						message: t.String({
							title: "Error Message",
							description: "Error message indicating the update failed",
							examples: ["Failed to update status sensor 'GitHub'"],
						}),
					},
					{
						title: "Error Response",
						description: "Error when update fails",
						examples: [
							{
								message: "Failed to update status sensor 'GitHub'",
							},
						],
					},
				),
			},
		},
	)
	.post(
		"/",
		async ({ body, status }) => {
			try {
				await Promise.all(
					body.map((sensorData) =>
						StatusSensorInstance.getInstance().sendData(sensorData),
					),
				);
				return status(StatusMap["No Content"], undefined);
			} catch {
				return status(StatusMap["Internal Server Error"], {
					message: "Failed to update one or more status sensors",
				});
			}
		},
		{
			detail: {
				summary: "Update multiple status sensors",
				description: "Update the status data for multiple platform sensors",
			},
			body: t.Array(
				t.Object({
					name: t.String({
						title: "Sensor Name",
						description: "The name of the status sensor",
						examples: ["GitHub", "Discord", "Vercel"],
					}),
					status_url: t.String({
						title: "Status URL",
						description: "The URL to check the platform status",
						examples: ["https://www.githubstatus.com/"],
					}),
					problem_description: t.Optional(
						t.String({
							title: "Problem Description",
							description: "Description of any current problems",
							examples: ["API rate limiting is currently experiencing delays"],
						}),
					),
					hasProblem: t.Boolean({
						title: "Has Problem",
						description: "Whether the platform currently has problems",
						examples: [false, true],
					}),
				}),
				{
					title: "Status Sensors Array",
					description: "Array of status sensor data to update",
					examples: [
						[
							{
								name: "GitHub",
								status_url: "https://www.githubstatus.com/",
								problem_description: undefined,
								hasProblem: false,
							},
							{
								name: "Discord",
								status_url: "https://discordstatus.com/",
								problem_description: "Voice connections experiencing issues",
								hasProblem: true,
							},
						],
					],
				},
			),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "All status sensors updated successfully",
				}),
				[StatusMap["Internal Server Error"]]: t.Object(
					{
						message: t.String({
							title: "Error Message",
							description: "Error message indicating the batch update failed",
							examples: ["Failed to update one or more status sensors"],
						}),
					},
					{
						title: "Error Response",
						description: "Error when batch update fails",
						examples: [
							{
								message: "Failed to update one or more status sensors",
							},
						],
					},
				),
			},
		},
	);
