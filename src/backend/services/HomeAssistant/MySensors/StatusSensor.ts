import {
	BinarySensor,
	type BinarySensorAttributes,
	BinarySensorDeviceClass,
} from "../AbstractEntities/BinarySensor";
import { Entity } from "../AbstractEntities/Entity";

interface StatusSensorAttributes extends BinarySensorAttributes {
	status_url: string;
	problem_description?: string;
}

export interface StatusSensorData {
	name: string;
	status_url: string;
	problem_description?: string;
	hasProblem: boolean;
}

export class StatusSensor extends BinarySensor<StatusSensorAttributes> {
	constructor(name: string, attributes: StatusSensorAttributes) {
		const entityId = StatusSensor.nameToEntityId(name);
		super(entityId, entityId, {
			...attributes,
			device_class: BinarySensorDeviceClass.PROBLEM,
		});
	}

	private static entityIdStartsWith = "binary_sensor.status_plataform_";

	private static nameToEntityId(name: string) {
		return `${StatusSensor.entityIdStartsWith}${StatusSensor.nameNormalize(name)}`;
	}

	private static entityIdToName(entityId: string) {
		return StatusSensor.nameUnnormalize(
			entityId.replace(StatusSensor.entityIdStartsWith, ""),
		);
	}

	private static nameNormalize(name: string) {
		return name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
	}

	private static nameUnnormalize(name: string) {
		return name
			.replace(/_/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	static async getAllStatusEntities(): Promise<string[]> {
		const entities = await Entity.getAllEntities();
		return entities
			.filter((entity) =>
				entity.entity_id.startsWith(StatusSensor.entityIdStartsWith),
			)
			.map((entity) => StatusSensor.entityIdToName(entity.entity_id));
	}
}

export class StatusSensorInstance {
	private static instance: StatusSensorInstance = new StatusSensorInstance();
	private constructor() {}
	static getInstance() {
		return StatusSensorInstance.instance;
	}

	public sendData(sensorData: StatusSensorData) {
		const sensor = new StatusSensor(sensorData.name, {
			friendly_name: sensorData.name,
			status_url: sensorData.status_url,
			problem_description: sensorData.problem_description,
		});
		sensor.sendData(sensorData.hasProblem ? "on" : "off");
	}

	public async getData(name: string): Promise<StatusSensorData> {
		const sensor = new StatusSensor(name, {
			friendly_name: name,
			status_url: "",
		});
		const data = await sensor.getData();
		return {
			name,
			status_url: data.attributes.status_url,
			problem_description: data.attributes.problem_description,
			hasProblem: data.state === "on",
		};
	}

	public async getAllStatusData(): Promise<StatusSensorData[]> {
		const names = await StatusSensor.getAllStatusEntities();
		return Promise.all(names.map((name) => this.getData(name)));
	}

	public async getAllEntities(): Promise<string[]> {
		return await StatusSensor.getAllStatusEntities();
	}
}
