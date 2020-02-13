/** Native Modules */
import { NgModule } from '@angular/core';

/** Directives */
import { NgxSmoothScrollDirective } from './ngx-smooth-scroll.directive';


@NgModule({
  declarations: [
    NgxSmoothScrollDirective
  ],
  exports: [
    NgxSmoothScrollDirective
  ]
})
export class NgxSmoothScrollModule { }
