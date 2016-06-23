import {nativeScriptBootstrap}          from 'nativescript-angular/application';
import {AppComponent}                   from './app.component';
import {PlaylistService}                from './shared/services/playlist.service';
import {LastFmService}                  from './shared/services/lastfm.service';
require('nativescript-orientation');

nativeScriptBootstrap(AppComponent, [PlaylistService, LastFmService]);