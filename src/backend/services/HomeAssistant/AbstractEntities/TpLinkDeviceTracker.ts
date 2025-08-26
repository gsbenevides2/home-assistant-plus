import { DeviceTracker } from "./DeviceTracker";
import type { EntityAttributes } from "./Entity";

export interface TpLinkDeviceTrackerAttributes extends EntityAttributes {
	source_type: "router";
	ip?: string;
	mac?: string;
	host_name?: string;
}

export class TpLinkDeviceTracker extends DeviceTracker<
	"unavailable" | "home" | "not_home",
	TpLinkDeviceTrackerAttributes
> {}
