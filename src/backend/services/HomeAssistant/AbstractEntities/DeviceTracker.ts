import { Entity, type EntityAttributes, SensorType } from "./Entity";

export class DeviceTracker<
	States extends string,
	Attributes extends EntityAttributes,
> extends Entity<States, Attributes> {
	constructor(entity_id: string, unique_id: string, attributes: Attributes) {
		super(SensorType.DEVICE_TRACKER, entity_id, unique_id, attributes);
	}
}
