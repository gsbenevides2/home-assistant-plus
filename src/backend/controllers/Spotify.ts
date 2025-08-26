import { Elysia, StatusMap, t } from "elysia";
import { MediaPlayerStates } from "../services/HomeAssistant/AbstractEntities/MediaPlayer";
import { Spotify } from "../services/HomeAssistant/MySensors/Spotify";

export const SpotifyController = new Elysia({
	prefix: "/spotify",
	detail: {
		tags: ["Spotify"],
		description: "Control Spotify media playback",
		security: [
			{
				headerAuth: [],
			},
		],
	},
})
	.get(
		"/accounts",
		async ({ status }) => {
			return status(StatusMap["OK"], {
				accounts: Spotify.accounts.map((account) => String(account)),
			});
		},
		{
			detail: {
				summary: "Get available Spotify accounts",
				description: "Returns list of available Spotify accounts for control",
			},
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						accounts: t.Array(t.String(), {
							title: "Spotify Accounts",
							description: "List of available Spotify accounts",
							examples: [["Guilherme"]],
						}),
					},
					{
						title: "Spotify Accounts Response",
						description: "Available Spotify accounts for media control",
						examples: [
							{
								accounts: ["Guilherme"],
							},
						],
					},
				),
			},
		},
	)
	.get(
		"/accounts/:account",
		async ({ status, params: { account } }) => {
			const sensorData = await Spotify.getSensor(account).getData();
			const activeStates = [
				MediaPlayerStates.PLAYING,
				MediaPlayerStates.BUFFERING,
				MediaPlayerStates.PAUSED,
			];
			if (!activeStates.includes(sensorData.state as MediaPlayerStates)) {
				const data = {
					active: false,
					state: sensorData.state,
					musicTitle: "",
					musicArtist: "",
					musicAlbum: "",
					musicTimePosition: 0,
					musicDuration: 0,
					musicVolume: 0,
					musicShuffle: false,
					musicRepeat: "off" as "off" | "all" | "one",
					deviceSource: "",
					musicPositionInAlbum: 0,
					musicId: "",
				};
				console.log(data);
				return status(StatusMap["OK"], data);
			}
			const data = {
				active: true,
				state: sensorData.state,
				musicTitle: sensorData.attributes.media_title,
				musicArtist: sensorData.attributes.media_artist,
				musicAlbum: sensorData.attributes.media_album_name,
				musicTimePosition: sensorData.attributes.media_position,
				musicDuration: sensorData.attributes.media_duration,
				musicVolume: sensorData.attributes.volume_level,
				musicShuffle: sensorData.attributes.shuffle,
				musicRepeat: sensorData.attributes.repeat as "off" | "all" | "one",
				deviceSource: sensorData.attributes.source,
				musicPositionInAlbum: Number(sensorData.attributes.media_track),
				musicId: sensorData.attributes.media_content_id,
			};

			return status(StatusMap["OK"], data);
		},
		{
			detail: {
				summary: "Get Playing Music on Spotify Account",
				description: "Returns data for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
			}),
			response: {
				[StatusMap["OK"]]: t.Object(
					{
						active: t.Boolean({
							title: "Active",
							description: "Whether the Spotify account is active",
							examples: [true],
						}),
						state: t.Enum(MediaPlayerStates, {
							title: "State",
							description: "The state of the Spotify account",
							examples: [
								MediaPlayerStates.PLAYING,
								MediaPlayerStates.PAUSED,
								MediaPlayerStates.OFF,
								MediaPlayerStates.ON,
								MediaPlayerStates.IDLE,
								MediaPlayerStates.STANDBY,
								MediaPlayerStates.BUFFERING,
							],
						}),
						musicTitle: t.String({
							title: "Music Title",
							description: "The title of the current song",
							examples: [
								"Seu Sangue / Infinitamente Mais / Emanuel / Há Um Rio / Adestra - Ao Vivo no Mineirão",
							],
						}),
						musicArtist: t.String({
							title: "Music Artist",
							description: "The artist of the current song",
							examples: ["Fernandinho"],
						}),
						musicAlbum: t.String({
							title: "Music Album",
							description: "The album of the current song",
							examples: ["Fernandinho (Ao Vivo no Mineirão)"],
						}),
						musicTimePosition: t.Number({
							title: "Music Time Position",
							description: "The time position of the current song in seconds",
							examples: [91],
						}),
						musicDuration: t.Number({
							title: "Music Duration",
							description: "The duration of the current song in seconds",
							examples: [430],
						}),
						musicVolume: t.Number({
							title: "Music Volume",
							description: "The volume of the current song (0-1)",
							minimum: 0,
							maximum: 1,
							examples: [0.94],
						}),
						musicShuffle: t.Boolean({
							title: "Music Shuffle",
							description: "Whether the current song is shuffled",
							examples: [false as const],
						}),
						musicRepeat: t.Union(
							[
								t.Literal("off", {
									title: "Off",
									description: "No repeat",
								}),
								t.Literal("all", {
									title: "All",
									description: "Repeat all songs of current list",
								}),
								t.Literal("one", {
									title: "One",
									description: "Repeat one song",
								}),
							],
							{
								title: "Music Repeat",
								description: "The repeat mode of the current song",
								examples: ["off", "all", "one"],
							},
						),
						deviceSource: t.String({
							title: "Device Source",
							description: "The source of the current song",
							examples: ["gsbenevides2-pc"],
						}),
						musicPositionInAlbum: t.Number({
							title: "Music Position in Album",
							description: "The position of the current song in the album",
							examples: [14],
						}),
						musicId: t.String({
							title: "Music ID",
							description: "The ID of the current song",
							examples: ["spotify:track:4i5EQkhAFZhWLmrGwZSsol"],
						}),
					},

					{
						title: "Spotify Account Data",
						description: "Data for the specified Spotify account",
						examples: [
							{
								active: true,
								state: "playing",
								musicTitle:
									"Seu Sangue / Infinitamente Mais / Emanuel / Há Um Rio / Adestra - Ao Vivo no Mineirão",
								musicArtist: "Fernandinho",
								musicAlbum: "Fernandinho (Ao Vivo no Mineirão)",
								musicTimePosition: 91,
								musicDuration: 430,
								musicVolume: 0.94,
								musicShuffle: false,
								musicRepeat: "off",
								deviceSource: "gsbenevides2-pc",
								musicPositionInAlbum: 14,
								musicId: "spotify:track:4i5EQkhAFZhWLmrGwZSsol",
							},
						],
					},
				),
			},
		},
	)
	.post(
		"/play/:account",
		async ({ status, params: { account } }) => {
			if (!Spotify.accounts.includes(account)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid account",
				});
			}
			await Spotify.play(account);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Play music on Spotify account",
				description:
					"Starts or resumes playback for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Playback started successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid account"],
						}),
					},
					{
						title: "Error Response",
						description: "Error message",
						examples: [{ error: "Invalid account" }],
					},
				),
			},
		},
	)
	.post(
		"/pause/:account",
		async ({ status, params: { account } }) => {
			if (!Spotify.accounts.includes(account)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid account",
				});
			}
			await Spotify.pause(account);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Pause music on Spotify account",
				description: "Pauses playback for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Playback paused successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid account"],
						}),
					},
					{
						title: "Error Response",
						description: "Error message",
						examples: [{ error: "Invalid account" }],
					},
				),
			},
		},
	)
	.post(
		"/next/:account",
		async ({ status, params: { account } }) => {
			if (!Spotify.accounts.includes(account)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid account",
				});
			}
			await Spotify.next(account);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Skip to next track",
				description:
					"Skips to the next track for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Skipped to next track successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid account"],
						}),
					},
					{
						title: "Error Response",
						description: "Error message",
						examples: [{ error: "Invalid account" }],
					},
				),
			},
		},
	)
	.post(
		"/previous/:account",
		async ({ status, params: { account } }) => {
			if (!Spotify.accounts.includes(account)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid account",
				});
			}
			await Spotify.previous(account);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Skip to previous track",
				description:
					"Skips to the previous track for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Skipped to previous track successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid account"],
						}),
					},
					{
						title: "Error Response",
						description: "Error message",
						examples: [{ error: "Invalid account" }],
					},
				),
			},
		},
	)
	.post(
		"/volume/:account/:volume",
		async ({ status, params: { account, volume } }) => {
			if (!Spotify.accounts.includes(account)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid account",
				});
			}

			await Spotify.setVolume(account, volume);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Set volume for Spotify account",
				description: "Sets the volume level for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
				volume: t.Number({
					title: "Volume",
					description: "Volume level (0-1)",
					examples: [0.5, 0.75],
					minimum: 0,
					maximum: 1,
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Volume set successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid account"],
						}),
					},
					{
						title: "Error Response",
						description: "Error message",
						examples: [{ error: "Invalid account" }],
					},
				),
			},
		},
	)
	.post(
		"/play-song/:account",
		async ({ status, params: { account }, body }) => {
			if (!Spotify.accounts.includes(account)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid account",
				});
			}
			await Spotify.playSong(account, body.uri);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Play specific song",
				description:
					"Plays a specific song by URI for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
			}),
			body: t.Object({
				uri: t.String({
					title: "Spotify URI",
					description: "The Spotify URI of the song to play",
					examples: ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"],
					pattern: "^spotify:track:[a-zA-Z0-9]+$",
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Song started playing successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid account"],
						}),
					},
					{
						title: "Error Response",
						description: "Error message",
						examples: [{ error: "Invalid account" }],
					},
				),
			},
		},
	)
	.post(
		"/play-album/:account",
		async ({ status, params: { account }, body }) => {
			if (!Spotify.accounts.includes(account)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid account",
				});
			}
			await Spotify.playAlbum(account, body.uri);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Play specific album",
				description:
					"Plays a specific album by URI for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
			}),
			body: t.Object({
				uri: t.String({
					title: "Spotify Album URI",
					description: "The Spotify URI of the album to play",
					examples: ["spotify:album:1A2GTWGtFfWp7KSQTwWOyo"],
					pattern: "^spotify:album:[a-zA-Z0-9]+$",
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Album started playing successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid account"],
						}),
					},
					{
						title: "Error Response",
						description: "Error message",
						examples: [{ error: "Invalid account" }],
					},
				),
			},
		},
	)
	.post(
		"/play-artist/:account",
		async ({ status, params: { account }, body }) => {
			if (!Spotify.accounts.includes(account)) {
				return status(StatusMap["Bad Request"], {
					error: "Invalid account",
				});
			}
			await Spotify.playArtist(account, body.uri);
			return status(StatusMap["No Content"], undefined);
		},
		{
			detail: {
				summary: "Play specific artist",
				description:
					"Plays music from a specific artist by URI for the specified Spotify account",
			},
			params: t.Object({
				account: t.Union(Spotify.typeboxAccounts, {
					title: "Account",
					description: "The Spotify account to control",
					examples: ["Guilherme"],
				}),
			}),
			body: t.Object({
				uri: t.String({
					title: "Spotify Artist URI",
					description: "The Spotify URI of the artist to play",
					examples: ["spotify:artist:3dBVyJ7JuOMt4GE9607Qin"],
					pattern: "^spotify:artist:[a-zA-Z0-9]+$",
				}),
			}),
			response: {
				[StatusMap["No Content"]]: t.Undefined({
					title: "Success",
					description: "Artist music started playing successfully",
				}),
				[StatusMap["Bad Request"]]: t.Object(
					{
						error: t.String({
							title: "Error",
							description: "Error message",
							examples: ["Invalid account"],
						}),
					},
					{
						title: "Error Response",
						description: "Error message",
						examples: [{ error: "Invalid account" }],
					},
				),
			},
		},
	)
	.as("scoped");
