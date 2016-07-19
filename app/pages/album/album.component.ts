import {Component, ElementRef, OnInit, ViewChild}   from '@angular/core';
// import {ROUTER_DIRECTIVES, Router, RouteParams}     from '@angular/router-deprecated';
import {Router, ActivatedRoute}                     from '@angular/router';
import {Observable}                                 from 'rxjs/Rx';
import {Page}                                       from 'ui/page';
import {View}                                       from 'ui/core/view';
import {SwipeGestureEventData}                      from 'ui/gestures';

import {LastFmService}                              from '../../shared/services/lastfm.service';
import {PlaylistService}                            from '../../shared/services/playlist.service';
import {Artist}                                     from '../../shared/models/artist';
import {Album}                                      from '../../shared/models/album';
import {Track}                                      from '../../shared/models/track';
import {UIMessage}                                  from '../../shared/utils/ui-message';

import * as _                                       from 'lodash';
import 'rxjs/add/observable/forkJoin';
// Plugins
var snackbar = require('nativescript-snackbar');

@Component({
    selector: 'album',
    templateUrl: 'pages/album/album.html',
    styleUrls: ['pages/album/album-common.css', 'pages/album/album.css'],
    providers: [LastFmService]
})

export class AlbumPage implements OnInit {

    // artistName: string;
    mbid: string;
    album: Album;
    artist: Artist;
    playlist: Array<Track>;
    isLoading = false;
    listLoaded = false;
    albumTracks: Array<any>;
    maxAlbums: number = 12;

    sub: any;

    @ViewChild('container') container: ElementRef;

    constructor(private _lastFmService: LastFmService, private _router:Router, private route: ActivatedRoute, private page: Page, private playlistService: PlaylistService, private _message:UIMessage) {

    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.isLoading = true;


        this.sub = this.route.params.subscribe(params => {
            this.mbid = params['mbid'];
            if(!this.mbid){
                 this._message.showMessage('No id found...', {title:'No Search ID'});
                 return;
            }


            // CURE mbid = '69ee3720-a7cb-4402-b48d-a02c366f2bcf';
            // limit: this.maxAlbums > lastfm often going a bit weird - any limit, returning 3...leave out for now!
            this.loadData(this.mbid);
        });  





        // this.mbid = this._routeParams.get('mbid');
        // if(!this.mbid){
        //      this._message.showMessage('No id found...', {title:'No Search ID'});
        //      return;
        // }
        // this.loadData(this.mbid);
    }
    loadData(mbid){
        Observable.forkJoin(
            this.playlistService.getPlaylist(),
            this._lastFmService.getAlbumInfo(mbid, {})
        )
        .subscribe(data => {
            this.initData(data[0], data[1]);
            let container = <View>this.container.nativeElement;
            container.backgroundImage = this.album.images.mega;
        },
        error => {
            this._message.showMessage(error, {title:'Error Loading Album'});
        });
    }
    initData(playlist, album) {
        this.playlist = playlist;
        this.album = <Album>album;
        this.albumTracks = this.mergeList(this.playlist, this.album);
        this.isLoading = false;
        this.listLoaded = true;
    }

    mergeList(playlist, album) {
        let tracks = album.tracks.track;
        _.each(tracks, function (o) {
            // some - so that when any found, it'll quit the loop
            _.some(playlist, function (track:Track) {
                if (track.title === o.name) {
                    o.inPlaylist = true;
                    return;
                }
            });
        });

        return tracks;
    }
    public onSwipe(args: SwipeGestureEventData) {
        console.log(`Swipe Direction: ${args.direction}`);
        if(args.direction === 1){
          this._router.navigate(['/List']);
        }
    }
    addTrack(item) {
        let track = new Track(item.name, item.url, item.artist.name, item.artist.mbid);
        this.playlistService.addTrack(track)
            .subscribe(data => {
                // Snackbar better - non-interfering - but layout (nav-bar) hides it (at least in emulator...)
                snackbar.simple(`Added ${item.name} to your playlist!`);

                // Or show a message - which is more intrusive...
                // this._message.showMessage(`You added ${item.name} to your playlist!`, {title:'Track Added'})
                //     .then(()=> {
                //             console.log('Dialog closed!');
                //     });
                // Update the list to indicate the track has been selected...
                this.mergeList(this.playlist, this.album);
            },
            error => {
                this._message.showMessage(`Sorry, could not add ${item.name}: ${error}`, {title:'Error Adding Track'});
            });
    }
}