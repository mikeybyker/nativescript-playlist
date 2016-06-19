import {Http, Response, Headers, URLSearchParams}   from '@angular/http';
import {Injectable}                                 from '@angular/core';
import {Observable}                                 from "rxjs/Rx";

import {Artist}                                     from '../models/artist';
import {Album}                                      from '../models/album';
import {Config}                                     from '../config';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class LastFmService {

    constructor(public http: Http) {

    }
    /**
    * (Hopefully) URLSearchParams will change in next beta etc. to allow passing in object
    * Currently setAll will not accept this, and all it does is the same thing - loop over.
    * !! Watch out for Object.assign
    */
    private createParams(options: any = {}, requestParams: any = {}): URLSearchParams {
        // let combined = {...options, method: 'artist.getTopAlbums', artist: artistName }; // not part of es6... :-|
        let combined: any = Object.assign({ format: Config.format, api_key: Config.api_key }, options, requestParams),
            params: URLSearchParams = new URLSearchParams();
        for (let key in combined) {
            params.set(key, combined[key]);
        }
        return params;
    }
    private handleError(error: Response) {
        console.error('handleError ::: ', error);
        return Observable.throw(error.json().message || 'Server Error');
    }

    /**
    * Observable.forkJoin : along the lines of $q.all... Remember to import it!
    */
    getAllArtist(artist: string = 'The Cure', options: any = {}, optionsAlbums: any = {}) {
        return Observable.forkJoin(
            this.getArtistInfo(artist, options),
            this.getTopAlbums(artist, optionsAlbums)
        );
    }
    getArtistInfo(artistName: string = 'The Cure', options: any = {}) {
        let params: any = this.createParams(options, { method: 'artist.getInfo', artist: artistName });
        return this.http.get(Config.apiEndpoint, { search: params })
            .map(res => res.json())
            // .do(data => console.log('getArtistInfo ::: ', data))
            .map(data => {
                if (!data.artist) {
                    return data;
                }
                return new Artist(data.artist);
            })
            .catch(this.handleError);
    }

    getTopAlbums(artistName: string = 'The Cure', options: any = {}) {
        let params: any = this.createParams(options, { method: 'artist.getTopAlbums', artist: artistName });
        return this.http.get(Config.apiEndpoint, { search: params })
            .map(res => res.json())
            // .do(data => console.log('getTopAlbums ::: ', data))
            .map(data => {
                if (!data.topalbums || !data.topalbums.album) {
                    return data;
                }
                let albums: Array<Album> = [];
                data.topalbums.album.forEach(album => {
                    if(album.mbid){ // necc?
                       albums.push(new Album(album));
                    }

                });
                return albums;
            })
            .catch(this.handleError);
    }

    getAlbumInfo(mbid: String, options:any = {}) {
        let params: any = this.createParams(options, { method: 'album.getInfo', mbid: mbid });
        return this.http.get(Config.apiEndpoint, { search: params })
                .map(res => res.json())
                // .do(data => console.log(data))
                .map(data => {
                    if (!data.album) {
                        return data;
                    }
                    return new Album(data.album);
                })
                .catch(this.handleError);
    }

    checkCanShow(results:any):boolean {
        if (!results || !results.artistmatches) {
            return false;
        }
        // Having at least one potential to show from the results is nice...
        function hasImage(element, index, array):boolean {
            return !!element['#text'];
        }
        return results.artistmatches.artist.some((element, index, array) => element.mbid && element.image.some(hasImage));
    }

    searchArtists(artist:string, options:any = {}){
        let results: Array<Artist>,
            artists: Array<any>,
            params: any = this.createParams(options, { method: 'artist.search', artist: artist });
        return this.http.get(Config.apiEndpoint, { search: params })
            .map(res => res.json())
            .do(data => console.log(data))
            .map(data => {
                if (!data.results) {
                    return data;
                }
                results = [];
                if (this.checkCanShow(data.results)) {
                    artists = data.results.artistmatches.artist;
                    artists.forEach((artist) => {
                        results.push(new Artist(artist));
                    });
                }
                return results;
            })
            .catch(this.handleError);
    }
}