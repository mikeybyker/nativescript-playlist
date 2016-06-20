# NativeScript Playlist

An example [NativeScript](http://docs.nativescript.org/) iOS* and Android app for creating and sharing a playlist, using the [Last.fm](http://www.last.fm/) API as a data source.

#### Made With
  - [NativeScript with Angular](http://docs.nativescript.org/angular/) @0.1.6
  - [Angular 2](https://angular.io/) @2.0.0-rc.1

##### Note: Angular 2 is a release candidate - things can/will change...and they tend to break things. Take care with versions of Nativescript/NS angular too - they do not mix/match very well at the moment...
Also note the tns command likes to write to package.json

You'll need to install TypeScript... 
```javascript
npm install -g typescript
npm install -g typings
```

### Installation
Set up Nativescript - http://docs.nativescript.org/angular/start/quick-setup

###### TL;DR

```javascript
npm install -g nativescript
```

Install dependencies with
```javascript
tns install
```

That should set up each platform you intend to build for - for Windows, that can only be Android of course (Good old Apple!), and is the only platform this is tested on. If a platform needs adding separately:

```javascript
tns platform add android
and/or
tns platform add ios
```

##### Add your [Last.FM](http://www.last.fm/api) API Key to **config.txt** and rename to **config.ts**

### Run
```javascript
tns run android --emulator
```
or run and watch  - (suggest you run once before watching...)

```javascript
tns livesync android --emulator --watch
```

Or plug your phone in, and do the same commands without the --emulator flag.

### Version
0.1.0

Mike

*Although this has never been near iOS so no idea what will happen there :-)