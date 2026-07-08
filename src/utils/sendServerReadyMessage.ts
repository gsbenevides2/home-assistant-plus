export const sendServerReadyMessage = (
	server: ReturnType<typeof Bun.serve>,
) => {
	const url = new URL(server.url);
	console.log(`Server is ready 😀. Running on ${url.toString()}`);
	const swaggerUrl = new URL("/swagger", url.toString());
	console.log(
		`📖 Swagger documentation is available on ${swaggerUrl.toString()}`,
	);
};
