import { Elysia } from "elysia";
import { CameraController } from "./controllers/Camera";
import { PCController } from "./controllers/PC";
import { RouterController } from "./controllers/Router";
import { SpotifyController } from "./controllers/Spotify";
import { StatusSensorController } from "./controllers/StatusSensor";
import { TrainController } from "./controllers/Train";
import { TuyaLightController } from "./controllers/TuyaLight";
import { TwitchController } from "./controllers/Twitch";
import { AuthService, UnauthorizedError } from "./services/AuthService";

const api = new Elysia({
	prefix: "/api",
})
	.onBeforeHandle(async ({ headers }) => {
		const token = headers?.authorization;
		if (!token) {
			throw new UnauthorizedError();
		}
		const decoded = await AuthService.verify(token);
		if (!decoded) {
			throw new UnauthorizedError();
		}
	})
	.use(CameraController)
	//.use(FanSensorsController)
	//.use(PrinterController)
	.use(RouterController)
	.use(SpotifyController)
	.use(StatusSensorController)
	.use(TuyaLightController)
	.use(TwitchController)
	.use(TrainController)
	.use(PCController);

export default api;
