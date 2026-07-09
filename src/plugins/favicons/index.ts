import { Elysia } from "elysia";

const ICON_PATH = "assets/icons" as const;

const manifestHeaders = {
	"Content-Type": "application/manifest+json",
};

const maskHeaders = {
	"Content-Type": "image/svg+xml",
};

export function favicons() {
	return new Elysia({ name: "favicons" })
		.get("/favicon.ico", () => Bun.file(`${ICON_PATH}/favicon.ico`))
		.get("/favicon.svg", () => Bun.file(`${ICON_PATH}/favicon.svg`))
		.get("/favicon-32x32.png", () =>
			Bun.file(`${ICON_PATH}/favicon-32x32.png`),
		)
		.get("/favicon-16x16.png", () =>
			Bun.file(`${ICON_PATH}/favicon-16x16.png`),
		)
		.get("/apple-touch-icon.png", () =>
			Bun.file(`${ICON_PATH}/apple-touch-icon.png`),
		)
		.get("/android-chrome-192x192.png", () =>
			Bun.file(`${ICON_PATH}/android-chrome-192x192.png`),
		)
		.get("/android-chrome-512x512.png", () =>
			Bun.file(`${ICON_PATH}/android-chrome-512x512.png`),
		)
		.get("/safari-pinned-tab.svg", () =>
			new Response(Bun.file(`${ICON_PATH}/safari-pinned-tab.svg`), {
				headers: maskHeaders,
			}),
		)
		.get("/site.webmanifest", () =>
			new Response(Bun.file(`${ICON_PATH}/site.webmanifest`), {
				headers: manifestHeaders,
			}),
		);
}
