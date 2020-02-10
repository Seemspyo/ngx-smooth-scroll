/** Native Modules */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** Custom Modules */
import { NgxSmoothScroll } from './core/smooth-scroll.core';

/** Types */
import { Coords, NgxSmoothScrollOption } from './@types';


@Injectable({
  providedIn: 'root'
})
export class NgxSmoothScrollService {

  public createInstance(containerEl: HTMLElement, childSelector?: string): NgxSmoothScroll {
    return new NgxSmoothScroll(containerEl, childSelector);
  }

  public scrollTo(containerEl: HTMLElement, destination: Coords, options: NgxSmoothScrollOption): Observable<Coords> {
    return this.createInstance(containerEl).scrollTo(destination, options);
  }

  public scrollToElement(containerEl: HTMLElement, childEl: HTMLElement, options?: NgxSmoothScrollOption): Observable<Coords> {
    return this.createInstance(containerEl).scrollToElement(childEl, options);
  }

  public scrollToIndex(containerEl: HTMLElement, childSelector: string, index: number, options?: NgxSmoothScrollOption): Observable<Coords> {
    return this.createInstance(containerEl, childSelector).scrollToIndex(index, options);
  }

}
