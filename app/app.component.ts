import {Component}                                  from '@angular/core';
import {RouteConfig}                                from '@angular/router-deprecated';
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS}  from 'nativescript-angular/router';
import {HTTP_PROVIDERS}                             from '@angular/http';
import {HomePage}                                   from './pages/home/home.component';
import {ListPage}                                   from './pages/list/list.component';
import {AlbumPage}                                  from './pages/album/album.component';
import {SearchPage}                                 from './pages/search/search.component';
import {PlaylistPage}                               from './pages/playlist/playlist.component';
import {UIMessage}                                  from './shared/utils/ui-message';

@Component({
    selector: 'main',
    directives: [NS_ROUTER_DIRECTIVES],
    providers: [HTTP_PROVIDERS, NS_ROUTER_PROVIDERS, UIMessage],
    template: '<page-router-outlet></page-router-outlet>'
})
@RouteConfig([
    {path: '/Home', component: HomePage, name: 'Home', useAsDefault: true },
    {path: '/List', component:ListPage, name:'List'},
    {path: '/Search', component:SearchPage, name:'Search'},
    {path: '/Album', component:AlbumPage, name:'Album'},
    {path: '/Playlist', component:PlaylistPage, name:'Playlist'}
])
export class AppComponent {}

// Run and watch:
// tns livesync android --emulator --watch

/*
    @todo
    layout! When landscape, it's not good.
    Layout - button positions (fab button?)
*/