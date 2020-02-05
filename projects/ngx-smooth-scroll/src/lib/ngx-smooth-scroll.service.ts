/** Native Modules */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** Custom Modules */
import { NgxSmoothScroll } from './helpers/smooth-scroll.helper';

/** Types */
import { Coords, NgxSmoothScrollOption } from './@types';


@Injectable({
  providedIn: 'root'
})
export class NgxSmoothScrollService {

  public create(containerEl: HTMLElement, childSelector?: string): NgxSmoothScroll {
    return new NgxSmoothScroll(containerEl, childSelector);
  }

  public scrollTo(containerEl: HTMLElement, destination: Coords, options: NgxSmoothScrollOption): Observable<Coords> {
    return this.create(containerEl).scrollTo(destination, options);
  }

  public scrollToElement(containerEl: HTMLElement, childEl: HTMLElement, options?: NgxSmoothScrollOption): Observable<Coords> {
    return this.create(containerEl).scrollToElement(childEl, options);
  }

  public scrollToIndex(containerEl: HTMLElement, childSelector: string, index: number, options?: NgxSmoothScrollOption): Observable<Coords> {
    return this.create(containerEl, childSelector).scrollToIndex(index, options);
  }

}
