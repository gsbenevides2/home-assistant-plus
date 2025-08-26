import { Elysia, StatusMap, t } from "elysia";
import { Camera } from "../services/HomeAssistant/MySensors/Camera";

type MotionDetectionAreas = (typeof Camera.motionDetectionsAreas)[number];

export const CameraController = new Elysia({
	prefix: "/camera",
	detail: {
		tags: ["Camera"],
		description: "Get the camera motion detection data",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/motion/:area",
		async ({ status, params: { area } }) => {
			if (
				!Camera.motionDetectionsAreas.includes(area as MotionDetectionAreas)
			) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid motion detection area",
				});
			}
			const isMotionDetected = await Camera.getMotionDetectionSensor(
				area as MotionDetectionAreas,
			);
			return status(StatusMap["OK"], {
				area,
				motionDetected: isMotionDetected,
			});
		},
		{
			detail: {
				summary: "Get motion detection status for a specific area",
				description:
					"Returns whether motion is currently detected in the specified area",
			},
			params: t.Object({
				area: t.String({
					title: "Motion Detection Area",
					description: "The area to check for motion detection",
					examples: ["frente"],
				}),
			}),
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						area: t.String({
							title: "Motion Detection Area",
							description: "The area that was checked",
							examples: ["frente"],
						}),
						motionDetected: t.Boolean({
							title: "Motion Detected",
							description:
								"Whether motion is currently detected in the specified area",
							examples: [true, false],
						}),
					},
					{
						title: "Motion Detection Status",
						description: "The motion detection status for the specified area",
						examples: [
							{
								area: "frente",
								motionDetected: true,
							},
						],
					},
				),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid motion detection area"],
						}),
					},
					{
						description: "Error message",
						examples: [
							{
								error: "Invalid motion detection area",
							},
						],
					},
				),
			},
		},
	)
	.as("scoped");
