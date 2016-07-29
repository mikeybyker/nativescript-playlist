import {Component, ElementRef, OnInit, ViewChild,
        ChangeDetectionStrategy, NgZone}                                        from "@angular/core";
import {Router}                                                                 from '@angular/router';
import {Observable}                                                             from "rxjs/Rx";
import {Page}                                                                   from "ui/page";
import {View }                                                                  from 'ui/core/view';
import {SearchBar}                                                              from 'ui/search-bar';
import {SwipeGestureEventData}                                                  from 'ui/gestures';

import {LastFmService}                                                          from '../../shared/services/lastfm.service';
import {PlaylistService}                                                        from '../../shared/services/playlist.service';
import {Artist}                                                                 from '../../shared/models/artist';
import {Album}                                                                  from '../../shared/models/album';
import {Track}                                                                  from '../../shared/models/track';
import {ResultsPipe}                                                            from '../../shared/pipes/results-pipe';
import {UIMessage}                                                              from '../../shared/utils/ui-message';

import * as _                                                                   from 'lodash';
import 'rxjs/add/observable/forkJoin';

// Views not updating on callbacks... (hopefully this will get sorted, but until then...)
// http://www.nativescriptsnacks.com/videos/2016/06/13/zoned-callbacks.html

@Component({
    selector: 'search',
    templateUrl: 'pages/search/search.html',
    styleUrls: ['pages/search/search-common.css', 'pages/search/search.css'],
    providers: [LastFmService],
    pipes:[ResultsPipe]
})

export class SearchPage {

    potentials:Array<Artist>;
    maxResults: number = 6;

    @ViewChild('searchBar') searchBar: ElementRef;

    isLoading = false;
    listLoaded = false;
    albumTracks: Array<any>;
    foo:string = 'Waiting...';

    constructor(private _lastFmService: LastFmService, private _router:Router, private page: Page, private _message:UIMessage, private zone:NgZone) {

    }

    ngAfterViewInit() {
        let sb = <SearchBar>this.searchBar.nativeElement;
        sb.on(SearchBar.submitEvent, (args: any) => { 
            let searchString = (<SearchBar>args.object).text;
            if(searchString){
                sb.dismissSoftInput();
                // this.doSearch(searchString.trim());
                // Skip round view update issues...
                this.zone.run(() => {
                    this.doSearch(searchString.trim());
                });
            }
        });
    }
        
    public onSwipe(args: SwipeGestureEventData) {
        if(args.direction === 1){
          this._router.navigate(['/playlist']);
        }     
    }

    doSearch(artist:string){
        this.isLoading = true;
        this._lastFmService.
            searchArtists(artist, { limit: this.maxResults })
            .subscribe(data => {
                // console.log('DONE doSearch ::: ', data);
                if (data.error || !data.length) {
                    this._message.showMessage(data.message || 'Nothing found...', {title:'No Results'});
                    this.potentials = [];
                    this.listLoaded = false;
                } else {
                    this.potentials = data;
                    this.listLoaded = true;
                }                
            },
            error => {
                this._message.showMessage(`Sorry, did not find anything ${error} - try again!`, {title:'Error Searching'});
            },
            ()=>{
               this.isLoading = false;
            });
    }

    // ngOnInit() {
    //     this.page.actionBarHidden = true;
    // }
    selectArtist(item) {
        console.log('Select: ', item);
        this._router.navigate(['/list', {name:item.name}]);       
    }
    // when using (submit)="search()" on the template...couldn't get the text out of it though!
    // search(o){
    //      console.log('Search for: ', o);
    // }

}