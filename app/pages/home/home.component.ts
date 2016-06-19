import {Component, OnInit}                        from '@angular/core';
import {Router}                                   from '@angular/router-deprecated';
import {Page}                                     from 'ui/page';
import {View}                                     from 'ui/core/view';
import {SwipeGestureEventData}                    from 'ui/gestures';

import {PlaylistService}                          from '../../shared/services/playlist.service';
import {Track}                                    from '../../shared/models/track';
import {UIMessage}                                from '../../shared/utils/ui-message';
var application = require('application');

@Component({
    selector: 'my-app',
    providers: [],
    templateUrl: 'pages/home/home.html',
    styleUrls:['pages/home/home-common.css', 'pages/home/home.css']
})
export class HomePage implements OnInit{

    playlist:Array<Track>;
    dataLoaded:boolean = false;

    constructor(private page:Page, private _router:Router, private playlistService:PlaylistService, private _message:UIMessage){

    }

    public onSwipe(args: SwipeGestureEventData) {
        if(args.direction === 2){
            this._router.navigate(["Playlist"]);
        }
    }

    ngOnInit(){
        this.page.actionBarHidden = true;
        let l = this.page.getViewById('background');
        if(l){
            l.animate({scale:{x:1.2, y:1.2}, duration: 5000});
        }
        // To start again...
        // this.playlistService.clearPlayList();

        // Returns the enum DeviceOrientation value
        // console.log('getOrientation : ', application.getOrientation());

        this.playlistService
            .loadPlaylist()
            .delay(3000) // Give animation a chance to run...
            .subscribe(data => {
                this.playlist = data;
                this.dataLoaded = true;
                if(this.playlist.length === 0){
                    this.viewSearch();
                } else {
                    this.viewPlaylist();
                }
            },
            error => {
                this._message.showMessage(error, {title:'Error Loading Playlist'});
            });
    }

    viewPlaylist(){
        this._router.navigate(['Playlist']);
    }
    viewSearch(){
        this._router.navigate(['Search']);
    }
}