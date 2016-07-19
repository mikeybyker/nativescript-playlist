import {nativeScriptBootstrap}          from 'nativescript-angular/application';
import {APP_ROUTER_PROVIDERS}           from './app.routes';
import {AppComponent}                   from './app.component';
import {PlaylistService}                from './shared/services/playlist.service';
import {LastFmService}                  from './shared/services/lastfm.service';
require('nativescript-orientation');

nativeScriptBootstrap(AppComponent, [APP_ROUTER_PROVIDERS, PlaylistService, LastFmService]);