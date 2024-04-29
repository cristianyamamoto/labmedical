import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'birthdateToAge',
  standalone: true
})
export class BirthdateToAgePipe implements PipeTransform {
  transform(date: string | null): unknown {
    if(date){
      const splitDate = date.split("/");
      const year = splitDate[0];
      const month = splitDate[1];
      const day = splitDate[2];
      const today = new Date();
      const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference == 0 && today.getDate() < birthDate.getDate()) ) {
          age--;
      }
      return age;
    }
    return;
  }
}
