import {nativeScriptBootstrap}          from 'nativescript-angular/application';
import {AppComponent}                   from './app.component';
import {setStatusBarColors}             from './shared/utils/status-bar-util';
import {PlaylistService}                from './shared/services/playlist.service';
import {LastFmService}                  from './shared/services/lastfm.service';
require('nativescript-orientation');

setStatusBarColors();
nativeScriptBootstrap(AppComponent, [PlaylistService, LastFmService]);