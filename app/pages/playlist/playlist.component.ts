import {Component, OnInit}                          from '@angular/core';
// import {Router}                                     from '@angular/router-deprecated';
import {Router}                                     from '@angular/router';
import {Page}                                       from 'ui/page';
import {View}                                       from 'ui/core/view';
import {SwipeGestureEventData, GestureEventData}    from 'ui/gestures';

import {PlaylistService}                            from '../../shared/services/playlist.service';
import {Track}                                      from '../../shared/models/track';
import {UIMessage}                                  from '../../shared/utils/ui-message';

import * as _                                       from 'lodash';
// Plugins
var socialShare = require('nativescript-social-share');
var snackbar = require('nativescript-snackbar');
require( 'nativescript-orientation' );

@Component({
    selector: 'playlist',
    providers: [],
    templateUrl: 'pages/playlist/playlist.html',
    styleUrls:['pages/playlist/playlist-common.css', 'pages/playlist/playlist.css']
})
export class PlaylistPage  implements OnInit {

    playlist:Array<Track>;
    max_tracks: number;
    isLoading = false;
    listLoaded = false;

    constructor(private page:Page, private _router:Router, private playlistService:PlaylistService, private _message:UIMessage){

    }

    ngOnInit(){
        this.isLoading = true;
        this.max_tracks = this.playlistService.getMaxTracks();
        this.playlistService
            .getPlaylist()
            .subscribe(data => {
                this.playlist = data;
            },
            error => {
                this._message.showMessage(error, {title:'Error!!!'});
            },
            () => {
                this.isLoading = false;
                this.listLoaded = true;
            });
    }

    public onSwipe(args: SwipeGestureEventData) {
        if (args.direction === 2 && this.playlist.length < this.max_tracks) {
            this._router.navigate(['/List']);
        }
    }

    /**
    * Delete a track but leave 3 seconds to undo
    */
    removeTrack(track:Track){
        let options = {
                snackText: 'Track Deleted',
                hideDelay: 3000,
                actionText: 'UNDO'
            },
            removed = this.spliceTrack(this.playlist, track);

        if(!removed){
            return;
        }
        snackbar.action(options)
            .then(args => {
                if (args.command === 'Action') {
                    // Do not delete : Put the track back in place
                    this.playlist.splice(removed.index, 0, removed.track);
                } else {
                    // Dismissal or timeout : Or trigger another snackbar (multi-delete)
                    console.log('delete ', removed.track);
                    this.deleteTrack(removed.track);
                }
            });
    }

    getTrackIndex(playlist: Array<Track>, track: Track) {
        return _.findIndex(playlist, function(o) { return o.url === track.url; });
    }

    spliceTrack(playlist: Array<Track>, track: Track) {
        let spliced,
            index = this.getTrackIndex(playlist, track);
        if(index === -1){
            return null;
        }
        spliced = playlist.splice(index, 1);
        return { track: spliced[0], index: index };
    }

    deleteTrack(track:Track){
        // console.log('deleteTrack ::: ', track.title);
        this.playlistService
            .removeTrack(track)
            .subscribe(data => {
                this.playlist = data;
            },
            error => {
                this._message.showMessage(`Sorry, could not remove ${track.title} - try again!`, {title:'Error Removing Track'});
            });
    }

    /**
    * Direct delete of a track : unused
    */
    deleteTrackWithMessage(track: Track) {
        // console.log('deleteTrack ::: ', track.title);
        this.playlistService
            .removeTrack(track)
            .subscribe(data => {
                this.playlist = data;
                this._message.showMessage(`You removed ${track.title} from your playlist!`, { title: 'Track Removed' })
                    .then(() => {
                        // console.log('Dialog closed!');
                    });
            },
            error => {
                this._message.showMessage(`Sorry, could not remove ${track.title} - try again!`, { title: 'Error Removing Track' });
            });
    }

    viewSearch(){
        console.log('HERE I AM');
        this._router.navigate(['/Search'])
        .catch(function(e){
            console.log('An ERROR! ', e);
        });
    }

    share(){
      let listString,
          list = [];
      for(let i=0, size = this.playlist.length; i<size;i++){
          list.push(this.playlist[i].artistName + ' - ' + this.playlist[i].title);
      }
      listString = list.join(',\n').trim();
      console.log('Share : ', listString);
      socialShare.shareText(listString);
    }
}