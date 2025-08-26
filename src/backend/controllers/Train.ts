import Elysia, { StatusMap, t } from "elysia";
import {
	type TrainSensorData,
	TrainSensorInstance,
} from "../services/HomeAssistant/MySensors/TrainSensor";

export const TrainController = new Elysia({
	prefix: "/train",
	detail: {
		tags: ["Train"],
		description:
			"São Paulo Metropolitan Lines Status(CPTM/Metro/ViaQuatro/ViaMobilidade)",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/",
		async () => {
			const lines = TrainSensorInstance.getInstance().getAvailableLines().codes;
			const data = await Promise.all(
				lines.map((line) =>
					TrainSensorInstance.getInstance().getSensorData(line),
				),
			);

			const filteredData = data.filter(Boolean) as TrainSensorData[];
			return filteredData;
		},
		{
			detail: {
				summary: "Get the train status of all available lines",
				description: "Get the train status",
			},
			response: {
				200: t.Array(
					t.Object({
						codigo: t.Number({
							title: "Line code",
							description: "The line code",
							example: 1,
						}),
						status: t.String({
							title: "Status",
							description: "The status of the line",
							example: "OK",
						}),
						descricao: t.Optional(
							t.String({
								title: "Description",
								description: "The description of the line",
								example:
									"Devido a uma situação de emergência, a linha 1 está com velocidade reduzida.",
							}),
						),
						situacao: t.String({
							title: "Situation",
							description: "The situation of the line",
							example: "Velocidade Reduzida",
						}),
					}),

					{
						title: "List of train lines",
						description: "List of train lines",
						examples: [
							[
								{
									codigo: 1,
									status: "OK",
									descricao: "Linha 1",
									situacao: "OK",
									cor: "Azul",
								},
							],
						],
					},
				),
			},
		},
	)
	.get(
		"/:line",
		async ({ params, status }) => {
			const line = params.line;
			const lines = TrainSensorInstance.getInstance().getAvailableLines().codes;
			if (!lines.includes(line)) {
				return status(StatusMap["Not Found"], {
					message: `The line ${line} is not available`,
				});
			}
			const data = await TrainSensorInstance.getInstance().getSensorData(line);
			if (!data) {
				return status(StatusMap["Not Found"], {
					message: `The line ${line} is not available`,
				});
			}
			return status(StatusMap["OK"], data);
		},
		{
			detail: {
				summary: "Get the train status of specific line",
				description: "Get the train status of a specific line",
			},
			params: t.Object({
				line: t.Number({
					title: "Line",
					description: "The line code",
					examples: TrainSensorInstance.getInstance().getAvailableLines().codes,
				}),
			}),
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						codigo: t.Number({
							title: "Line code",
							description: "The line code",
							example: 1,
						}),
						status: t.String({
							title: "Status",
							description: "The status of the line",
							example: "OK",
						}),
						descricao: t.Optional(
							t.String({
								title: "Description",
								description: "The description of the line",
								example:
									"Devido a uma situação de emergência, a linha 1 está com velocidade reduzida.",
							}),
						),
						situacao: t.String({
							title: "Situation",
							description: "The situation of the line",
							example: "Velocidade Reduzida",
						}),
					},
					{
						title: "Train Line",
						description: "Train line",
						examples: [
							{
								codigo: 1,
								status: "OK",
								descricao: "Linha 1",
								situacao: "OK",
								cor: "Azul",
							},
						],
					},
				),
				[StatusMap["Not Found"]]: t.Object(
					{
						message: t.String({
							title: "Message",
							description: "The message of the error",
							example: "The line 1 is not available",
						}),
					},
					{
						title: "Error",
						description: "Error",
						examples: [
							{
								message: "The line 1 is not available",
							},
						],
					},
				),
			},
		},
	)
	.post(
		"/:line",
		async ({ params, body, status }) => {
			const line = params.line;
			const lines = TrainSensorInstance.getInstance().getAvailableLines().codes;
			if (!lines.includes(line)) {
				return status(StatusMap["Not Found"], {
					message: `The line ${line} is not available`,
				});
			}
			await TrainSensorInstance.getInstance().updateSensor({
				codigo: line,
				status: body.status,
				descricao: body.descricao,
				situacao: body.situacao,
				cor: body.cor,
			});
			return status(StatusMap["No Content"], undefined);
		},
		{
			body: t.Object({
				status: t.String({
					title: "Status",
					description: "The status of the line",
					example: "OK",
				}),
				descricao: t.Optional(
					t.String({
						title: "Description",
						description: "The description of the line",
						example: "Linha 1",
					}),
				),
				situacao: t.String({
					title: "Situation",
					description: "The situation of the line",
					example: "OK",
				}),

				cor: t.String({
					title: "Cor",
					description: "The cor of the line",
					example: "Azul",
				}),
			}),
			params: t.Object({
				line: t.Number({
					title: "Line",
					description: "The line code",
					examples: TrainSensorInstance.getInstance().getAvailableLines().codes,
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "No Content",
					description: "No content",
					example: undefined,
				}),
				[StatusMap["Not Found"]]: t.Object(
					{
						message: t.String({
							title: "Message",
							description: "The message of the error",
							example: "The line 1 is not available",
						}),
					},
					{
						title: "Error",
						description: "Error",
						examples: [
							{
								message: "The line 1 is not available",
							},
						],
					},
				),
			},
			detail: {
				summary: "Update the train status of a specific line",
				description: "Update the train status of a specific line",
			},
		},
	)
	.post(
		"/",
		async ({ body, status }) => {
			const lines = TrainSensorInstance.getInstance().getAvailableLines().codes;
			const hasAllLines = lines.every((line) =>
				body.find((b) => b.codigo === line),
			);
			if (!hasAllLines) {
				return status(StatusMap["Not Found"], {
					message: "The line is not available",
				});
			}
			await Promise.all(
				body.map((b) => TrainSensorInstance.getInstance().updateSensor(b)),
			);
			return status(StatusMap["No Content"], undefined);
		},
		{
			body: t.Array(
				t.Object({
					codigo: t.Number({
						title: "Line",
						description: "The line code",
						example: 1,
					}),
					status: t.String({
						title: "Status",
						description: "The status of the line",
						example: "OK",
					}),
					descricao: t.Optional(
						t.String({
							title: "Description",
							description: "The description of the line",
							example: "Linha 1",
						}),
					),
					situacao: t.String({
						title: "Situation",
						description: "The situation of the line",
						example: "OK",
					}),

					cor: t.String({
						title: "Cor",
						description: "The cor of the line",
					}),
				}),
			),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "No Content",
					description: "No content",
					example: undefined,
				}),
				[StatusMap["Not Found"]]: t.Object(
					{
						message: t.String({
							title: "Message",
							description: "The message of the error",
							example: "The line 1 is not available",
						}),
					},
					{
						title: "Error",
						description: "Error",
						examples: [
							{
								message: "The line 1 is not available",
							},
						],
					},
				),
			},
			detail: {
				summary: "Update the train status of all available lines",
				description: "Update the train status of all available lines",
			},
		},
	);
