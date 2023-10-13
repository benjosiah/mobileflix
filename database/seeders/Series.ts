import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
// import Factory from '@ioc:Adonis/Lucid/Factory'
// import Series from 'App/Models/Series'
import {MoviesFactory, SeasonFactory, SeriesFactory} from 'Database/factories'
// import MovieClip from 'App/Models/MovieClip'

export default class extends BaseSeeder {
	public async run() {
		const video_clip = {
			"videoId": "vi3BpCrasH35ZmTYgY2UJexh",
			"createdAt": "2023-09-05T10:16:03.000Z",
			"title": "Let's talk about Zuko and Azula's final fight... 🔥 _ Avatar #Shorts.mp4",
			"description": "",
			"publishedAt": "2023-09-05T10:16:03.000Z",
			"updatedAt": "2023-09-05T10:16:03.000Z",
			"tags": [],
			"metadata": [],
			"source": {
				"uri": "/videos/vi3BpCrasH35ZmTYgY2UJexh/source",
				"type": "upload"
			},
			"assets": {
				"hls": "https://vod.api.video/vod/vi3BpCrasH35ZmTYgY2UJexh/hls/manifest.m3u8",
				"iframe": "<iframe src=\"https://embed.api.video/vod/vi3BpCrasH35ZmTYgY2UJexh\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"></iframe>",
				"player": "https://embed.api.video/vod/vi3BpCrasH35ZmTYgY2UJexh",
				"thumbnail": "https://vod.api.video/vod/vi3BpCrasH35ZmTYgY2UJexh/thumbnail.jpg",
				"mp4": "https://vod.api.video/vod/vi3BpCrasH35ZmTYgY2UJexh/mp4/source.mp4"
			},
			"_public": true,
			"panoramic": false,
			"mp4Support": true
		}

		const video_object = {
			"videoId": "vi5196Q5a9nfKrmPdJClbtUk",
			"createdAt": "2023-09-05T10:13:06.000Z",
			"title": "Aang vs. Ozai 🔥 FULL UNCUT FINAL BATTLE _ Avatar.mp4",
			"description": "",
			"publishedAt": "2023-09-05T10:13:06.000Z",
			"updatedAt": "2023-09-05T10:13:06.000Z",
			"tags": [],
			"metadata": [],
			"source": {
				"uri": "/videos/vi5196Q5a9nfKrmPdJClbtUk/source",
				"type": "upload"
			},
			"assets": {
				"hls": "https://vod.api.video/vod/vi5196Q5a9nfKrmPdJClbtUk/hls/manifest.m3u8",
				"iframe": "<iframe src=\"https://embed.api.video/vod/vi5196Q5a9nfKrmPdJClbtUk\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"></iframe>",
				"player": "https://embed.api.video/vod/vi5196Q5a9nfKrmPdJClbtUk",
				"thumbnail": "https://vod.api.video/vod/vi5196Q5a9nfKrmPdJClbtUk/thumbnail.jpg",
				"mp4": "https://vod.api.video/vod/vi5196Q5a9nfKrmPdJClbtUk/mp4/source.mp4"
			},
			"_public": true,
			"panoramic": false,
			"mp4Support": true
		}
		const series = await SeriesFactory
			.createMany(4)

		for (let show of series) {
			let x = 0
			while (x < 2) {
				const season = await SeasonFactory.merge({
					season_number: x + 1,
					series_id: show.id
				}).create()
				let q = 0
				while (q < 2) {
					MoviesFactory.merge({
						video_object: JSON.stringify(video_object),
						is_series: true,
						episode: q + 1,
						season_id: season.id
					}).with('clips', 2, (clip) => {
						clip.merge({
							video_object: JSON.stringify(video_clip)
						})
					})
						.create()

					q = q + 1
				}

				x = x + 1

			}


		}

	}

}
