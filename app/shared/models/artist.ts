export class Artist {

    bio: any;
    image: Array<any>;
    images: any;
    mbid: string;
    name: string;
    ontour: string;
    similar: any;
    stats: any;
    streamable: string;
    tags: any;
    url: string;

    // Convert last.fm array for easier use
    getImages(image): any {
        // image is the array of images from last fm
        // small, medium, large, extralarge, mega
        // let [small, medium, large, extralarge, mega] = image;
        // return {
        //     small,
        //     medium,
        //     large,
        //     extralarge,
        //     mega,
        // }
        let o: any = {};
        image
            .filter(o => o['#text'])
            .forEach((element, index, array) => o[element.size] = element['#text']);
        return o;
    }

    createSimilarArtists(similar): Array<Artist> {
        if (!similar || !similar.artist) {
            return [];
        }
        return similar.artist.map((artist: any) => {
            return new Artist(artist);
        });
    }

    constructor(artist)
    {
        this.name = artist.name || ''; 
        this.mbid = artist.mbid || '';
        this.image = artist.image || [];
        this.url = artist.url || '';
        this.images = this.image.length ? this.getImages(this.image) : {};        
        this.bio = artist.bio || {};
        this.ontour = artist.ontour || '0';
        this.similar = artist.similar ? this.createSimilarArtists(artist.similar) : [];
        this.stats = artist.stats || {};
        this.streamable = artist.streamable || '0';
        this.tags = artist.tags || {};        
    }
}