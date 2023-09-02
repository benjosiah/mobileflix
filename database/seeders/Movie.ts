import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { MoviesFactory } from 'Database/factories'
// import MovieClip from 'App/Models/MovieClip'

export default class extends BaseSeeder {
  public async run () {
    const video_clip = {
      "videoId": "vi7g7xqPZUni7I0kzxPtzxua",
      "createdAt": "2023-09-02T16:47:14.000Z",
      "title": "Let's talk about Zuko and Azula's final fight... 🔥 _ Avatar #Shorts.mp4",
      "description": "",
      "publishedAt": "2023-09-02T16:47:14.000Z",
      "updatedAt": "2023-09-02T16:47:14.000Z",
      "tags": [],
      "metadata": [],
      "source": {
        "uri": "/videos/vi7g7xqPZUni7I0kzxPtzxua/source",
        "type": "upload"
      },
      "assets": {
        "hls": "https://vod.api.video/vod/vi7g7xqPZUni7I0kzxPtzxua/hls/manifest.m3u8",
        "iframe": "<iframe src=\"https://embed.api.video/vod/vi7g7xqPZUni7I0kzxPtzxua\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"></iframe>",
        "player": "https://embed.api.video/vod/vi7g7xqPZUni7I0kzxPtzxua",
        "thumbnail": "https://vod.api.video/vod/vi7g7xqPZUni7I0kzxPtzxua/thumbnail.jpg",
        "mp4": "https://vod.api.video/vod/vi7g7xqPZUni7I0kzxPtzxua/mp4/source.mp4"
      },
      "_public": true,
      "panoramic": false,
      "mp4Support": true
    }

const video_object = {
	"videoId": "vi22CnCzzkXSAJF80puMpasw",
	"createdAt": "2023-09-02T16:26:59.000Z",
	"title": "Aang vs. Ozai 🔥 FULL UNCUT FINAL BATTLE _ Avatar.mp4",
	"description": "",
	"publishedAt": "2023-09-02T16:26:59.000Z",
	"updatedAt": "2023-09-02T16:26:59.000Z",
	"tags": [],
	"metadata": [],
	"source": {
		"uri": "/videos/vi22CnCzzkXSAJF80puMpasw/source",
		"type": "upload"
	},
	"assets": {
		"hls": "https://vod.api.video/vod/vi22CnCzzkXSAJF80puMpasw/hls/manifest.m3u8",
		"iframe": "<iframe src=\"https://embed.api.video/vod/vi22CnCzzkXSAJF80puMpasw\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"></iframe>",
		"player": "https://embed.api.video/vod/vi22CnCzzkXSAJF80puMpasw",
		"thumbnail": "https://vod.api.video/vod/vi22CnCzzkXSAJF80puMpasw/thumbnail.jpg",
		"mp4": "https://vod.api.video/vod/vi22CnCzzkXSAJF80puMpasw/mp4/source.mp4"
	},
	"_public": true,
	"panoramic": false,
	"mp4Support": true
}
    await MoviesFactory
    .with('clips', 2, (clips)=>{
      clips.merge({
        vidio_object: JSON.stringify(video_clip)
      })
    })
    .merge({
      vidio_object: JSON.stringify(video_object)
    })
    .createMany(10)
  }

  
}
