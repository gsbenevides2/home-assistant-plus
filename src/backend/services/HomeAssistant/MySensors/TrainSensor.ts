import { numberToWords } from "../../../../utils/numbersToWords";
import type { EntityAttributes } from "../AbstractEntities/Entity";
import { Sensor } from "../AbstractEntities/Sensor";

export interface TrainSensorData {
	status: string;
	codigo: number;
	descricao?: string;
	situacao: string;
	cor: string;
}

interface TrainSensorAttributes extends EntityAttributes {
	icon: "mdi:train";
	status: string;
	codigo: string;
	cor: string;
	descricao: string;
}

class TrainSensor extends Sensor<string, TrainSensorAttributes> {
	constructor(lineCodeName: string, attributes: TrainSensorAttributes) {
		const entityId = `sensor.sp_train_${lineCodeName}`;
		const name = `sensor.sp_train_${lineCodeName}`;
		super(entityId, name, attributes);
	}
}

export class TrainSensorInstance {
	private static instance: TrainSensorInstance = new TrainSensorInstance();

	static getInstance() {
		return TrainSensorInstance.instance;
	}

	getAvailableLines() {
		return {
			codes: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15],
		};
	}

	private getSensor(lineCode: number) {
		const codeInWords = numberToWords(lineCode);
		if (!codeInWords) return;
		const sensor = new TrainSensor(codeInWords, {
			friendly_name: `Linha ${codeInWords}`,
			icon: `mdi:train`,
			status: "unknown",
			codigo: codeInWords,
			cor: "unknown",
			descricao: "unknown",
		});

		return sensor;
	}

	async updateSensor(lineData: TrainSensorData) {
		const sensor = this.getSensor(lineData.codigo);
		if (!sensor) return;
		return sensor.sendData(lineData.situacao, {
			friendly_name: `Linha ${lineData.codigo} - ${lineData.cor}`,
			icon: `mdi:train`,
			status: lineData.status,
			codigo: lineData.codigo.toString(),
			cor: lineData.cor,
			descricao: lineData.descricao || "",
		});
	}

	async getSensorData(lineCode: number): Promise<TrainSensorData | undefined> {
		const sensor = this.getSensor(lineCode);
		if (!sensor) return;
		const data = await sensor.getData();
		return {
			status: data.state,
			codigo: Number(data.attributes.codigo),
			descricao: data.attributes.descricao,
			situacao: data.state,
			cor: data.attributes.cor,
		};
	}
}
