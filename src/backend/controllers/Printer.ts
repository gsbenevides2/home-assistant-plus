import { Elysia, StatusMap, t } from "elysia";
import { Printer } from "../services/HomeAssistant/MySensors/Printer";

export const PrinterController = new Elysia({
	prefix: "/printer",
	detail: {
		tags: ["Printer"],
		description: "Get printer status and information",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/status",
		async ({ status }) => {
			const printer = new Printer();
			const printerData = await printer.getAllPrinterStatus();
			return status(StatusMap["OK"], printerData);
		},
		{
			detail: {
				summary: "Get printer status and information",
				description:
					"Returns comprehensive printer status including connection, ink levels, and page counts",
				security: [
					{
						headerAuth: [],
					},
				],
			},
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						printerStatus: t.Union(
							[
								t.Literal("off"),
								t.Literal("ready"),
								t.Literal("scanning"),
								t.Literal("processing"),
								t.Literal("copying"),
								t.Literal("canceljob"),
								t.Literal("inpowersave"),
								t.Literal("unavailable"),
							],
							{
								title: "Printer Status",
								description: "Current printer operational status",
								examples: ["ready", "scanning", "off"],
							},
						),
						connectionStatus: t.Union(
							[
								t.Literal("unavailable"),
								t.Literal("home"),
								t.Literal("not_home"),
							],
							{
								title: "Connection Status",
								description: "Printer network connection status",
								examples: ["home", "not_home", "unavailable"],
							},
						),
						colorCMYLevel: t.String({
							title: "CMY Ink Level",
							description: "Cyan, Magenta, Yellow ink cartridge level",
							examples: ["75%", "unavailable"],
						}),
						colorBlackLevel: t.String({
							title: "Black Ink Level",
							description: "Black ink cartridge level",
							examples: ["45%", "unavailable"],
						}),
						pagesLevel: t.String({
							title: "Total Pages Printed",
							description: "Total number of pages printed by the printer",
							examples: ["1254 páginas", "unavailable"],
						}),
						scannerLevel: t.String({
							title: "Total Pages Scanned",
							description: "Total number of pages scanned by the scanner",
							examples: ["89 páginas", "unavailable"],
						}),
					},
					{
						title: "Printer Information",
						description: "Complete printer status and usage information",
						examples: [
							{
								printerStatus: "ready",
								connectionStatus: "home",
								colorCMYLevel: "75%",
								colorBlackLevel: "45%",
								pagesLevel: "1254 páginas",
								scannerLevel: "89 páginas",
							},
						],
					},
				),
			},
		},
	)
	.as("scoped");
