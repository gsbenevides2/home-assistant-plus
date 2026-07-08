import { StatusMap } from "elysia";
import { getEnv } from "../../utils/getEnv";

const AUTH_SECRET = getEnv("AUTH_SECRET", false, "");
const IS_AUTH_ENABLED = AUTH_SECRET !== "";

export class AuthService {
	static isEnabled() {
		return IS_AUTH_ENABLED;
	}

	static async verify(secret: string) {
		if (!AuthService.isEnabled()) {
			return true;
		}
		return secret === AUTH_SECRET;
	}
}

export class UnauthorizedError extends Error {
	status: number = StatusMap.Unauthorized;
	message = "Unauthorized";
	constructor() {
		super();
		this.name = "Unauthorized";
	}

	toResponse() {
		return Response.json(
			{
				error: this.message,
			},
			{
				status: this.status,
			},
		);
	}
}
