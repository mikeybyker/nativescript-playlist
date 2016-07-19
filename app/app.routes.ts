import {RouterConfig}                        from '@angular/router';
import {nsProvideRouter}                     from 'nativescript-angular/router'
import {HomePage}                            from './pages/home/home.component';
import {ListPage}                            from './pages/list/list.component';
import {AlbumPage}                           from './pages/album/album.component';
import {SearchPage}                          from './pages/search/search.component';
import {PlaylistPage}                        from './pages/playlist/playlist.component';

export const routes: RouterConfig = [
    { path: '',         component: HomePage },
    { path: 'List',     component: ListPage },
    { path: 'Search',   component: SearchPage },
    { path: 'Album',    component: AlbumPage },
    { path: 'Playlist', component: PlaylistPage }
];

export const APP_ROUTER_PROVIDERS = [
    nsProvideRouter(routes, {})
];