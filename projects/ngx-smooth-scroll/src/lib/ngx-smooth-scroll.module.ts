/** Native Modules */
import { NgModule } from '@angular/core';

/** Directives */
import { NgxSmoothScrollWheelDirective } from './ngx-smooth-scroll-wheel.directive';
import { NgxSmoothScrollKeyboardDirective } from './ngx-smooth-scroll-keyboard.directive';


@NgModule({
  declarations: [
    NgxSmoothScrollWheelDirective,
    NgxSmoothScrollKeyboardDirective
  ],
  exports: [
    NgxSmoothScrollWheelDirective,
    NgxSmoothScrollKeyboardDirective
  ]
})
export class NgxSmoothScrollModule { }
