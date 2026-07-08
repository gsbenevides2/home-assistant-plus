import type { Elysia } from "elysia";

declare module "@elysiajs/swagger" {
	interface SwaggerOptions {
		documentation?: unknown;
	}

	type SwaggerPlugin = (app: Elysia) => Elysia;

	const swagger: (options?: SwaggerOptions) => SwaggerPlugin;

	export default swagger;
}
