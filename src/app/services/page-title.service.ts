import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  @Output() title: EventEmitter<any> = new EventEmitter();

  constructor() { }

  changeTitle(pageTitle: string){
    if (pageTitle){
      this.title.emit(pageTitle);
    } else {
      this.title.emit('');
    }
  }

}
