import {Component}                                  from '@angular/core';
import {ROUTER_DIRECTIVES}                          from '@angular/router';
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS}  from 'nativescript-angular/router';
// See: https://github.com/NativeScript/nativescript-angular/issues/345
// import {HTTP_PROVIDERS}                             from '@angular/http';
import {UIMessage}                                  from './shared/utils/ui-message';

@Component({
    selector: 'main',
    directives: [NS_ROUTER_DIRECTIVES],
    providers: [UIMessage], // See: https://github.com/NativeScript/nativescript-angular/issues/345
    // providers: [HTTP_PROVIDERS, UIMessage],
    // providers: [HTTP_PROVIDERS, NS_ROUTER_PROVIDERS, UIMessage], // NS_ROUTER_PROVIDERS as a provider made the 'already navigating' issue!
    template: '<page-router-outlet></page-router-outlet>'
})

export class AppComponent {}

// Run
// tns run android --emulator
// Run and watch:
// tns livesync android --emulator --watch

/*
    @todo
    layout! When landscape, it's not good.
    Layout - button positions (fab button?)
*/