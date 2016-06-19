import {Component, ElementRef, OnInit, ViewChild}                       from '@angular/core';
import {Router, OnActivate, ComponentInstruction, RouteParams}          from '@angular/router-deprecated';
import {View}                                                           from 'ui/core/view';
import {ListView}                                                       from 'ui/list-view';
import {Page}                                                           from 'ui/page';
import {SwipeGestureEventData}                                          from 'ui/gestures';
import {LastFmService}                                                  from '../../shared/services/lastfm.service';
import {Album}                                                          from '../../shared/models/album';
import {Artist}                                                         from '../../shared/models/artist';
import {UIMessage}                                                      from '../../shared/utils/ui-message';
import * as _                                                           from 'lodash';

@Component({
    selector: 'list',
    templateUrl: 'pages/list/list.html',
    styleUrls: ['pages/list/list-common.css', 'pages/list/list.css'],
    providers: [LastFmService]
})

export class ListPage implements OnInit, OnActivate  {    
    artistName: string;
    artist: Artist;
    // albums: ObservableArray<Album>; // pointless really...doesn't auto-update
    albums: Array<Album> = [];
    list:ListView;
    
    maxAlbums: number = 12;   
    SORT_PLAYCOUNT = 1;
    SORT_ALPHA = 2;
    sort_dir = true;
    currentSort = this.SORT_PLAYCOUNT;
    isLoading = false;
    listLoaded = false;
  
    constructor(private _lastFmService: LastFmService, private _router:Router, private _routeParams: RouteParams, private page:Page, private _message:UIMessage){      
    }
    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        console.log('routerOnActivate', nextInstruction, prevInstruction);
    }
    ngAfterViewInit() {
        // see: https://github.com/NativeScript/nativescript-angular/issues/188
        // No native view for List - so <ListView>this.albumlist.nativeElement won't work
        // and can't use to call refresh on the list after data update...
        // So just grab it as per below
        this.list = <ListView>this.page.getViewById('album-list');
        // console.log('REFRESH ', this.list.refresh); // hurrah!
    }

    ngOnInit() {    
        this.artistName = this._routeParams.get('name');
        if(!this.artistName){
            this.artistName = 'The Cure';
        } 
        this.isLoading = true;
        
        // CURE mbid = '69ee3720-a7cb-4402-b48d-a02c366f2bcf';
        // limit: this.maxAlbums > lastfm often going a bit weird - any limit, returning 3...leave out for now!
        this._lastFmService
            .getAllArtist(this.artistName, {}, {})
            .subscribe(data => {           
                this.initData(data[0], data[1]);
            },
            error => {                  
                this._message.showMessage(error, {title:'Error Loading Artist Data'});
            });
    }
    
    initData(artist, albums){
        if (artist.error || albums.error) {
            this._message.showMessage(artist.error ? artist.message : albums.message, {title:'Error Loading Data'});
            return;
        }
        this.artist = artist;
        this.albums = albums; 
        this.isLoading = false;
        this.listLoaded = true;
    }
    
    public onSwipe(args: SwipeGestureEventData) {
        // console.log(`Swipe Direction: ${args.direction}`);
        if(args.direction === 1){
            this._router.navigate(['Playlist']);
        }     
    }
    
    viewAlbum(album){
        if(album && album.mbid){
            this._router.navigate(['Album', {name: album.artist.name, mbid: album.mbid}]);
        }        
    }

    sortBy(sortOn){
        let order = this.sort_dir ? 'asc' : 'desc';
        if(sortOn === this.SORT_PLAYCOUNT){
            this.albums = _.orderBy(this.albums, 'playcount', order);
            this.currentSort = this.SORT_PLAYCOUNT;
        } else {
            this.albums = _.orderBy(this.albums, 'name', order);   
            this.currentSort = this.SORT_ALPHA;
        }
        this.sort_dir = !this.sort_dir;    
        if(this.list){
            this.list.refresh();
        }
    }
}