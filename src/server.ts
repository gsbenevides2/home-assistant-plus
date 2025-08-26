import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import api from "./backend/api";
import { coolifyHealthChecker } from "./plugins/coolify-healtcheker";
import { logger } from "./plugins/logger";
import { getProjectInfo } from "./utils/getProjectInfo";
import { sendServerReadyMessage } from "./utils/sendServerReadyMessage";

const projectInfo = getProjectInfo();
console.log(`${projectInfo.title} v${projectInfo.version}`);

const port = Bun.env.PORT || 3000;
const app = new Elysia()
	.use(logger())
	.use(cors())
	.use(
		swagger({
			documentation: {
				info: projectInfo,
				tags: [
					{
						name: "Camera",
						description: "Get camera motion detection data",
					},
					{
						name: "Coolify",
						description: "Coolify Utils",
					},
					{
						name: "PC",
						description: "Control the PC",
					},
					{
						name: "Router",
						description: "Get the data of the router, and manage it",
					},
					{
						name: "Status Sensor",
						description: "Monitor platform status sensors",
					},
					{
						name: "Spotify",
						description: "Control Spotify media playback",
					},
					{
						name: "Train",
						description:
							"São Paulo Metropolitan Lines Status(CPTM/Metro/ViaQuatro/ViaMobilidade)",
					},
					{
						name: "Tuya Lights",
						description: "Control Tuya smart lights",
					},
					{
						name: "Twitch",
						description: "Get Twitch streamers information",
					},
				],
				components: {
					securitySchemes: {
						headerAuth: {
							type: "apiKey",
							in: "header",
							name: "Authorization",
							description: "Authentication token",
						},
					},
				},
			},
		}),
	)
	.use(coolifyHealthChecker)
	.use(api)

	.listen(port, sendServerReadyMessage);

export type App = typeof app;
