import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
// import Factory from '@ioc:Adonis/Lucid/Factory'
// import Series from 'App/Models/Series'
import { SeriesFactory, SeasonFactory, MoviesFactory } from 'Database/factories'
// import MovieClip from 'App/Models/MovieClip'

export default class extends BaseSeeder {
  public async run () {
    const video_clip = {
      "videoId": "vi7iwqjRJlehgppZifR07Giq",
      "createdAt": "2023-08-31T22:03:58.000Z",
      "title": "Let's talk about Zuko and Azula's final fight... 🔥 _ Avatar #Shorts.mp4",
      "description": "",
      "publishedAt": "2023-08-31T22:03:58.000Z",
      "updatedAt": "2023-08-31T22:03:58.000Z",
      "tags": [],
      "metadata": [],
      "source": {
        "uri": "/videos/vi7iwqjRJlehgppZifR07Giq/source",
        "type": "upload"
      },
      "assets": {
        "hls": "https://vod.api.video/vod/vi7iwqjRJlehgppZifR07Giq/hls/manifest.m3u8",
        "iframe": "<iframe src=\"https://embed.api.video/vod/vi7iwqjRJlehgppZifR07Giq\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"></iframe>",
        "player": "https://embed.api.video/vod/vi7iwqjRJlehgppZifR07Giq",
        "thumbnail": "https://vod.api.video/vod/vi7iwqjRJlehgppZifR07Giq/thumbnail.jpg",
        "mp4": "https://vod.api.video/vod/vi7iwqjRJlehgppZifR07Giq/mp4/source.mp4"
      },
      "_public": true,
      "panoramic": false,
      "mp4Support": true
    }

const video_object = {
	"videoId": "vifJznmc2B5Sn4EuGWjQFyT",
	"createdAt": "2023-08-31T21:34:46.000Z",
	"title": "Aang vs. Ozai 🔥 FULL UNCUT FINAL BATTLE _ Avatar.mp4",
	"description": "",
	"publishedAt": "2023-08-31T21:34:46.000Z",
	"updatedAt": "2023-08-31T21:34:46.000Z",
	"tags": [],
	"metadata": [],
	"source": {
		"uri": "/videos/vifJznmc2B5Sn4EuGWjQFyT/source",
		"type": "upload"
	},
	"assets": {
		"hls": "https://vod.api.video/vod/vifJznmc2B5Sn4EuGWjQFyT/hls/manifest.m3u8",
		"iframe": "<iframe src=\"https://embed.api.video/vod/vifJznmc2B5Sn4EuGWjQFyT\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"></iframe>",
		"player": "https://embed.api.video/vod/vifJznmc2B5Sn4EuGWjQFyT",
		"thumbnail": "https://vod.api.video/vod/vifJznmc2B5Sn4EuGWjQFyT/thumbnail.jpg",
		"mp4": "https://vod.api.video/vod/vifJznmc2B5Sn4EuGWjQFyT/mp4/source.mp4"
	},
	"_public": true,
	"panoramic": false,
	"mp4Support": true
}
     const series = await SeriesFactory
    .createMany(10)
  
    for(let show of series ){
      let x = 0
      while(x<3){
        const season = await SeasonFactory.merge({
          season_number: x+1 ,
          series_id: show.id
        }).create()
        let q = 0
        while(q<5){
            MoviesFactory.merge({
              vidio_object: JSON.stringify(video_object),
              is_series: true,
              episode: q+1,
              season_id: season.id
            }).with('clips', 2, (clip)=>{
              clip.merge({
                vidio_object: JSON.stringify(video_clip)
              })
            })
            .create()
  
            q=q+1
        }

        x=x+1

      }

 
    }

  }

}
