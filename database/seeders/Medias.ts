import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Media from 'App/Models/Media'


export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method


        // video/mp4
        await Media.createMany([
            {
                name: 'Inception',
                slug: 'inception',
                description: 'A mind-bending science fiction movie',
                status: 'published',
                mimeType: 'video/mp4',
                fileName: 'inception.mp4',
                fileExtension: 'mp4',
                object: {
                    "resolution": "1080p",
                    "codec": "H.264",
                    "format": "MP4"
                },
                url: 'https://storage.googleapis.com/muxdemofiles/mux.mp4',
                playbackId: 'EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs',
            },
            {
                name: 'The Matrix',
                slug: 'the-matrix',
                description: 'A classic cyberpunk action film',
                status: 'published',
                mimeType: 'video/mp4',
                fileName: 'the-matrix.mp4',
                fileExtension: 'mp4',
                object: {
                    "resolution": "1080p",
                    "codec": "H.264",
                    "format": "MP4"
                },
                url: 'https://storage.googleapis.com/muxdemofiles/mux.mp4',
                playbackId: 'Ojz11wN2KWh7mz2Mgc2nvatL9KwYHP3M',
            }
        ])

        // image/jpeg
        await Media.createMany([
            {
                name: 'Inception',
                slug: 'inception',
                description: 'A mind-bending science fiction movie',
                status: 'published',
                mimeType: 'image/jpeg',
                fileName: 'inception.jpg',
                fileExtension: 'jpg',
                object: {
                    "resolution": "1080p",
                    "codec": "H.264",
                    "format": "jpg"
                },
                url: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3VT-Ynisr-nRV7R65rC8iZ4jyJKgLHU7wvROHYTnc1X7zg_4i',
            },
            {
                name: 'The Matrix',
                slug: 'the-matrix',
                description: 'A classic cyberpunk action film',
                status: 'published',
                mimeType: 'image/jpeg',
                fileName: 'the-matrix.jpg',
                fileExtension: 'jpg',
                object: {
                    "resolution": "1080p",
                    "codec": "H.264",
                    "format": "jpg"
                },
                url: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS4jfQQt_0vCA4XSwGiWkffC32Tv2oajdWhaYHHVYylYGJ3v17Q',
            }
        ])
    }
}
