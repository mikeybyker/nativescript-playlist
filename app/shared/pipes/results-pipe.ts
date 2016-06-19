import {Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'results'
})
// Filtering out those without an mbid will sadly filter out some weirder correct results too...
// But saves showing mis-named artists - there's a lot!
export class ResultsPipe implements PipeTransform{
    transform(value, size){
        return value && value.filter((item) => item.mbid && item.images.hasOwnProperty(size));
    }
}