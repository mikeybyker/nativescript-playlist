import {nativeScriptBootstrap}          from 'nativescript-angular/application';
import {APP_ROUTER_PROVIDERS}           from './app.routes';
import {AppComponent}                   from './app.component';
import {PlaylistService}                from './shared/services/playlist.service';
import {LastFmService}                  from './shared/services/lastfm.service';
// See: https://github.com/NativeScript/nativescript-angular/issues/345
import {HTTP_PROVIDERS}                 from '@angular/http';
import {NS_HTTP_PROVIDERS}              from 'nativescript-angular/http';
require('nativescript-orientation');

// See: https://github.com/NativeScript/nativescript-angular/issues/345 and
// https://github.com/NativeScript/nativescript-angular/wiki/Http
nativeScriptBootstrap(AppComponent, [APP_ROUTER_PROVIDERS, NS_HTTP_PROVIDERS, PlaylistService, LastFmService]);