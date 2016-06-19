import {Injectable}                     from '@angular/core';
import {Observable}                     from 'rxjs/Observable';
import {getString, setString, remove}   from 'application-settings';

import {Track}                          from '../models/track';
import * as _                           from 'lodash';

@Injectable()
export class PlaylistService {
    constructor () {}

    private key = 'sw.playlist.key';
    private max_tracks = 10;
    playlist:Array<Track>;

    loadPlaylist (): Observable<Array<Track>> {
        let saved = getString(this.key);
        if(saved){
            this.playlist = JSON.parse(saved);
        } else {
            this.playlist = [this.getDefault()];
            this.savePlaylist();
        }
        return Observable.of(this.playlist);
    }

    getPlaylist(): Observable<Array<Track>> {
        // If not loaded...etc... then...
        return Observable.of(this.playlist);
    }

    addTrack(track:Track): Observable<Array<Track>>{
        // console.log('addTrack ::: ', track, track.artistName, track.title);
        if(this.playlist.length === this.max_tracks){
            return this.handleError({ message: `Already have maximum (${this.max_tracks}) tracks!`});
        }
        this.playlist.push(track);
        return this.savePlaylist();
    }

    removeTrack(track:Track){
        // @todo : hardly ideal! First instance will be found, even if they click 2nd (same) instance
        // Either don't let them add 2 the same...Or change this
        let o,
            found = false;
        o = _.remove(this.playlist, function(n) {
            if(found){
                return false;
            }
            if(n.url === track.url){
                found = true;
                return true;
            }
            return false;
        });
        // console.log('removeTrack :::: ', o);
        return this.savePlaylist();
    }

    savePlaylist(){
        let s = JSON.stringify(this.playlist);
        setString(this.key, s);
        return Observable.of(this.playlist);
          // .do(data => console.log('savePlaylist ::: ', data));
    }

    setPlaylist (arr: Array<Track>): Observable<Array<Track>> {
        let s = JSON.stringify(arr);
        setString(this.key, s);
        return Observable.of(arr);
    }

    clearPlayList(){
      remove(this.key);
      return this.setPlaylist([this.getDefault()]);
    }

    getDefault(){
        return new Track('The Blood', 'http://www.last.fm/music/The+Cure/_/The+Blood', 'The Cure', '69ee3720-a7cb-4402-b48d-a02c366f2bcf');
    }

    getMaxTracks(){
        return this.max_tracks;
    }

    private handleError (error: any) {
        let errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}