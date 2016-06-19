import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'trackduration'
})

export class TrackDurationPipe implements PipeTransform{

    getDuration(duration) {
        let mins = ~~(duration / 60),
            secs = duration % 60,
            pretty = '' + mins + ':' + (secs < 10 ? '0' : '');
        pretty += '' + secs;
        return pretty;
    }
    transform(value){
        return this.getDuration(value);
    }
}