import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: string): any {
    if (!value) return null;
    if (!args) return value;

    const searchString = args.toLowerCase(); // Convert args to lowercase
    return value.filter(function(item: any){
      return JSON.stringify(item).toLowerCase().includes(searchString);
    });
  }
}
