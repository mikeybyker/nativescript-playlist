import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'limit'
})

export class LimitPipe implements PipeTransform{
    transform(value, count){
        return value.slice(0, count);
    }
}