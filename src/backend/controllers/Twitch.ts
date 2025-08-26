import { Elysia, StatusMap, t } from "elysia";
import { Twitch } from "../services/HomeAssistant/MySensors/Twitch";

export const TwitchController = new Elysia({
	prefix: "/twitch",
	detail: {
		tags: ["Twitch"],
		description: "Get Twitch streamers information",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/streamers",
		async ({ status }) => {
			const streamers = await Twitch.getStreamers();
			return status(StatusMap["OK"], {
				streamers,
			});
		},
		{
			detail: {
				summary: "Get available Twitch streamers",
				description: "Returns list of configured Twitch streamers",
			},
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						streamers: t.Array(
							t.Object({
								friendly_name: t.String({
									title: "Friendly Name",
									description: "Display name of the streamer",
									examples: ["StreamerName"],
								}),
								id: t.String({
									title: "Streamer ID",
									description: "Unique identifier for the streamer",
									examples: ["streamer_username"],
								}),
							}),
							{
								title: "Streamers Array",
								description: "List of available Twitch streamers",
							},
						),
					},
					{
						title: "Twitch Streamers Response",
						description: "List of all configured Twitch streamers",
						examples: [
							{
								streamers: [
									{
										friendly_name: "StreamerName",
										id: "streamer_username",
									},
								],
							},
						],
					},
				),
			},
		},
	)
	.get(
		"/streamer/:streamerId",
		async ({ status, params: { streamerId } }) => {
			try {
				const streamerStatus = await Twitch.getStreamerStatus(streamerId);
				return status(StatusMap["OK"], streamerStatus);
			} catch (_) {
				return status(StatusMap["Not Found"], {
					error: "Streamer not found",
				});
			}
		},
		{
			detail: {
				summary: "Get streamer status",
				description:
					"Returns detailed information about a specific Twitch streamer",
			},
			params: t.Object({
				streamerId: t.String({
					title: "Streamer ID",
					description: "The ID of the streamer to check",
					examples: ["streamer_username"],
				}),
			}),
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						status: t.Union(
							[
								t.Literal("streaming", {
									title: "Streaming",
									description: "Streamer is currently live",
									examples: ["streaming"],
								}),
								t.Literal("offline", {
									title: "Offline",
									description: "Streamer is not currently live",
									examples: ["offline"],
								}),
							],
							{
								title: "Streaming Status",
								description: "Current streaming status",
								examples: ["streaming", "offline"],
							},
						),
						attributes: t.Object({
							game: t.Union([t.String(), t.Null()], {
								title: "Game",
								description: "Game being played (if streaming)",
								examples: ["Just Chatting", "Valorant", null],
							}),
							title: t.Union([t.String(), t.Null()], {
								title: "Stream Title",
								description: "Current stream title",
								examples: ["Playing some games", null],
							}),
							started_at: t.Union([t.String(), t.Null()], {
								title: "Stream Start Time",
								description: "When the stream started (ISO format)",
								examples: ["2023-01-01T12:00:00Z", null],
							}),
							viewers: t.Union([t.Number(), t.Null()], {
								title: "Viewer Count",
								description: "Current number of viewers",
								examples: [1234, null],
								minimum: 0,
							}),
							followers: t.Union([t.Number(), t.Null()], {
								title: "Follower Count",
								description: "Total number of followers",
								examples: [50000, null],
								minimum: 0,
							}),
							subscribed: t.Union([t.Boolean(), t.Null()], {
								title: "Subscribed",
								description: "Whether you are subscribed to this streamer",
								examples: [true, false, null],
							}),
							subscription_is_gifted: t.Union([t.Boolean(), t.Null()], {
								title: "Gifted Subscription",
								description: "Whether the subscription is gifted",
								examples: [true, false, null],
							}),
							subscription_tier: t.Union([t.String(), t.Null()], {
								title: "Subscription Tier",
								description: "Subscription tier level",
								examples: ["1000", "2000", "3000", null],
							}),
							following: t.Union([t.Boolean(), t.Null()], {
								title: "Following",
								description: "Whether you are following this streamer",
								examples: [true, false, null],
							}),
							following_since: t.Union([t.String(), t.Null()], {
								title: "Following Since",
								description: "Date when you started following (ISO format)",
								examples: ["2023-01-01T12:00:00Z", null],
							}),
							entity_picture: t.Union([t.String(), t.Null()], {
								title: "Profile Picture",
								description: "URL to streamer's profile picture",
								examples: [
									"https://static-cdn.jtvnw.net/jtv_user_pictures/...",
									null,
								],
							}),
							options: t.Array(t.String(), {
								title: "Options",
								description: "Available options for this entity",
								examples: [[]],
							}),
							friendly_name: t.String({
								title: "Friendly Name",
								description: "Display name of the streamer",
								examples: ["StreamerName"],
							}),
						}),
					},
					{
						title: "Streamer Status",
						description: "Detailed status information for the Twitch streamer",
						examples: [
							{
								status: "streaming",
								attributes: {
									game: "Just Chatting",
									title: "Playing some games with viewers!",
									started_at: "2023-01-01T12:00:00Z",
									viewers: 1234,
									followers: 50000,
									subscribed: true,
									subscription_is_gifted: false,
									subscription_tier: "1000",
									following: true,
									following_since: "2023-01-01T12:00:00Z",
									entity_picture:
										"https://static-cdn.jtvnw.net/jtv_user_pictures/...",
									options: [],
									friendly_name: "StreamerName",
								},
							},
						],
					},
				),
				[StatusMap["Not Found"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Streamer not found"],
						}),
					},
					{
						title: "Error Response for Streamer Not Found",
						description: "Error message when the streamer is not found",
						examples: [{ error: "Streamer not found" }],
					},
				),
			},
		},
	)
	.as("scoped");
