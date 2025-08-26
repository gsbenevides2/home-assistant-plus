import {
	BinarySensor,
	type BinarySensorAttributes,
} from "../AbstractEntities/BinarySensor";

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
		const normalizedName = StatusSensor.nameNormalize(name);
		const entityId = `binary_sensor.status_plataform_${normalizedName}`;
		const entityName = entityId.replace("binary_sensor.", "");
		super(entityId, entityName, attributes);
	}

	private static nameNormalize(name: string) {
		return name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
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
}
