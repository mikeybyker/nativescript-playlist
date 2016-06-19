export class Track {
  constructor(
    public title:string,
    public url:string,
    public artistName:string,
    public artistId:string // Lastfm do not have track mbid (id) - so using artist mbid
    ) { }
}