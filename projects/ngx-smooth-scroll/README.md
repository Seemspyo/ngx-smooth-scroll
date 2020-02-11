<p align="center">
    <img width="160px" height="160px" style="text-align:center" src="https://user-images.githubusercontent.com/40263620/73897891-dd343000-48ca-11ea-9c02-9f2337f0f442.png">
    <h1 align="center">Agular Smooth Scroll</h1>
</p>

[![Demo](https://img.shields.io/badge/Demo-online-brightgreen)](https://playground.eunsatio.io/projects/ngx-smooth-scroll-demo/)
[![Angular](https://img.shields.io/badge/ng-^7.0.0-red)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-9cf)](https://github.com/Seemspyo/ngx-smooth-scroll/blob/master/projects/ngx-smooth-scroll/LICENSE)

Simple, configurable, cubic-bezier support smooth scroll for Angular 7+

---

## Contents
- [Demo](https://playground.eunsatio.io/projects/ngx-smooth-scroll-demo/)
- [Purpose](#purpose)
- [Features](#feature)
- [Installation](#installation)
- [Direct usage](#direct-usage)
- [Use with directive](#use-with-directive)
- [Scroll options](#scroll-option)
- [Documentation](#documentation)
- [Issues](#issues)
- [Author](#author)
- [Change Log](https://github.com/Seemspyo/ngx-smooth-scroll/blob/master/projects/ngx-smooth-scroll/CHANGELOG.md)

<a name="purpose">

## Purpose
Javascript Browser APIs has `scrollTo` and `scrollIntoView` method. Which allows us to manipulate browser native scroll behavior easily.
But some browser does not supports `behavior: smooth` option. Thus, this methods doesn't have options for duration nor timing-function. And we have to seek for workaround to know when this behavior ends.
This package is configurable, compatible, easy to use, and uses `Observable` to notify the subscribers when behavior ends.

<a name="feature">

## Features
- Easy to use
- Easy to configure
- Supports cubic-bezier timing function
- Uses `window.requestAnimationFrame` method for smooth scrolling(compatibility).

<a name="installation">

## Installation

**NPM**
```bash
npm install @eunsatio/ngx-smooth-scroll
```

<a name="direct-usage">

## Direct usage
Import `NgxSmoothScrollService` or `NgxSmoothScroll`

**NgxSmoothScrollService**

```ts
import { NgxSmoothScrollService } from '@eunsatio/ngx-smooth-scroll';
/** ... */
    constructor(
        private smoothScroll: NgxSmoothScrollService
    ) {}

    @ViewChild('container', { static: false }) containerElRef: ElementRef;
    @ViewChild('target', { static: false }) targetElRef: ElementRef;

    public scrollToTarget() {
        this.smoothScroll.scrollToElement(this.containerElRef.nativeElement, this.targetElRef.nativeElement, {
            duration: 600,
            timingFunction: 'ease-in-out'
        });
    }
/** ... */
```

**NgxSmoothScroll**

```ts
import { NgxSmoothScroll } from '@eunsatio/ngx-smooth-scroll';
/** ... */
    @ViewChild('container', { static: false }) containerElRef: ElementRef;
    @ViewChild('target', { static: false }) targetElRef: ElementRef;

    ngAfterViewInit() {
        this.smoothScroll = new NgxSmoothScroll(this.containerElRef.nativeElement);
    }

    public scrollToTarget() {
        this.smoothScroll.scrollToElement(this.targetElRef.nativeElement, {
            duration: 600,
            timingFunction: '.13, 1.07, .51, 1.29'
        });
    }
```

<a name="use-with-directive">

## Use with directive
Import `NgxSmoothScrollModule` into your module

### Concept of design
`NgxSmoothScrollWheelDirective` and  `NgxSmoothScrollKeyboardDirective` are deisgned for helping full-container-size scrolling while native scroll behaviors remain intact.

If you want to force full-container-size scrolling, I recommend looking for other packages with container style `overflow: hidden`. Since preventing native touch event and scrollbar actions are bad for user experiences.

***NgxSmoothScrollWheelDirective***

```html
<div class="container" ngxSmoothScrollWheel
    [options]="smoothScrollOption"
    childSelector=".content"
>
    <!---->
    <div class="content"></div>
    <!---->
</div>
```

***NgxSmoothScrollKeyboardDirective***

```html
<div class="container" ngxSmoothScrollKeyboard
    [options]="smoothScrollOption"
    [keyCode]="keyCodeMap"
    childSelector=".content"
>
    <!---->
    <div class="content"></div>
    <!---->
</div>
```

<a name="scroll-option">

### NgxSmoothScrollOption
- **duration**: number

    Scroll duration, ms, default `600`

- **timingFunction**: string

    Scroll timing function, support cubic-bezier, default `ease`
    - `linear`
    - `ease`
    - `ease-in`
    - `ease-out`
    - `ease-in-out`
    - `cubic bezier`: ex) '.13, 1.07, .51, 1.29', check more at [cubic-bezier.com](https://cubic-bezier.com/)

- **alignX**: 'start' | 'center' | 'end'

    X axis align, default `start`

- **alignY**: 'start' | 'center' | 'end'

    Y axis align, default `start`

<a name="documentation">

## Documentation

### NgxSmoothScroll(class)

#### Create instance
```ts
new NgxSmoothScroll(containerEl, childSelector);
```
- **containerEl**: HTMLElement `required`

    Container element.

- **childSelector**: string

    Selector of child element.

#### Property
- **childSelector**: Selector of child element.

#### Method
- **scrollTo**: (destination, options) => Observable<{ x: number; y: number; }>

    Scroll to given destination.
    - `destination`: object, `{ x: number; y: number; }`, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **scrollToElement**: (childEl, options) => Observable<{ x: number; y: number; }>

    Scroll to  given child element
    - `childEl`: HTMLElement, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **scrollToIndex**: (index, options) => Observable<{ x: number; y: number; }>

    Scroll to given child index. childSelector must be set.
    - `index`: number, index of child element, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **interrupt**: () => boolean

    Interrupt current scroll animation and stop immediately.
    - **@return**: boolean, whether behavior interrupted successfully.

### NgxSmoothScrollService(@Injectable)

#### Method
- **createInstance**: (containerEl, childSelector) => NgxSmoothScroll

    Create NgxSmoothScroll instance.
    - `containerEl`: HTMLElement, `required`
    - `childSelector`: string, selector of child element

- **scrollTo**: (containerEl, destination, options) => Observable<{ x: number; y: number; }>

    Scroll to given destination.
    - `containerEl`: HTMLElement, `required`
    - `destination`: object, `{ x: number; y: number; }`, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **scrollToElement**: (containerEl, childEl, options) => Observable<{ x: number; y: number; }>

    Scroll to  given child element
    - `containerEl`: HTMLElement, `required`
    - `childEl`: HTMLElement, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **scrollToIndex**: (containerEl, childSelector, index, options) => Observable<{ x: number; y: number; }>

    Scroll to given child index. childSelector must be set.
    - `containerEl`: HTMLElement, `required`
    - `childSelector`: string, selector of child element, `required`
    - `index`: number, index of child element, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

### NgxSmoothScrollWheelDirective(@Directive)

#### Usage
```html
<div class="container" ngxSmoothScrollWheel
    [options]="smoothScrollOption"
    childSelector=".content"
>
    <!---->
    <div class="content"></div>
    <!---->
</div>
```

#### Property
- **containerEl**: Container Element.
- **children**: Pure array of child element. **NOT** NodeList nor HTMLCollection.

#### @Input
- **childSelector**: string

    Selector of child elements.

- **enable**: boolean

    Whether enable wheel event binding, default `true`

- **skip**: number

    Number of index to skip, default `0`

- **direction**: 'horizontal' | 'vertical'

    Scroll direction, default `vertical`

- **options**: NgxSmoothScrollOption

    Option for smooth scroll, see more [here](#scroll-option)

#### @Output
- **beforeAnimate**: NgxSmoothScrollBeforeAnimateEvent

    Event triggers before animation started.
    - `currentIndex`: number, current child index(auto-detected by container current view)
    - `targetIndex`: number, child index to scroll into
- **afterAnimate**: NgxSmoothScrollAfterAnimateEvent

    Event triggers after animation ends.
    - `prevIndex`: number, previous child index
    - `currentIndex`: number, current child index
    - `scrollCoords`: current scroll coordination of container({ x: number; y: number; })

#### Method
- **scrollTo**: (destination, options) => Observable<{ x: number; y: number; }>

    Scroll to given destination.
    - `destination`: object, `{ x: number; y: number; }`, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **scrollToChild**: (childEl, options) => Observable<{ x: number; y: number; }>

    Scroll to  given child element
    - `childEl`: HTMLElement, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **scrollToIndex**: (index, options) => Observable<{ x: number; y: number; }>

    Scroll to given child index. childSelector must be set.
    - `index`: number, index of child element, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **interrupt**: () => boolean

    Interrupt current scroll animation and stop immediately.
    - **@return**: boolean, whether behavior interrupted successfully.

### NgxSmoothScrollKeyboardDirective(@Directive)

#### Usage
```html
<div class="container" ngxSmoothScrollKeyboard
    [options]="smoothScrollOption"
    childSelector=".content"
>
    <!---->
    <div class="content"></div>
    <!---->
</div>
```

#### Property
- **containerEl**: Container Element.
- **children**: Pure array of child element. **NOT** NodeList nor HTMLCollection.

#### @Input
- **childSelector**: string

    Selector of child elements.

- **enable**: boolean

    Whether enable wheel event binding, default `true`

- **keyCode**: Map<'normal' | 'reverse', number[]>

    Map of key codes, default `'normal': [40, 39, 83, 68], 'reverse': [38, 37, 87, 65]`
    - **normal**: down, right
    - **reverse**: up, left

- **skip**: number

    Number of index to skip, default `0`

- **direction**: 'horizontal' | 'vertical'

    Scroll direction, default `vertical`;

- **options**: NgxSmoothScrollOption

    Option for smooth scroll, see more [here](#scroll-option)

#### @Output
- **beforeAnimate**: NgxSmoothScrollBeforeAnimateEvent

    Event triggers before animation started.
    - `currentIndex`: number, current child index(auto-detected by container current view)
    - `targetIndex`: number, child index to scroll into

- **afterAnimate**: NgxSmoothScrollAfterAnimateEvent

    Event triggers after animation ends.
    - `prevIndex`: number, previous child index
    - `currentIndex`: number, current child index
    - `scrollCoords`: current scroll coordination of container({ x: number; y: number; })

#### Method
- **scrollTo**: (destination, options) => Observable<{ x: number; y: number; }>

    Scroll to given destination.
    - `destination`: object, `{ x: number; y: number; }`, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **scrollToChild**: (childEl, options) => Observable<{ x: number; y: number; }>

    Scroll to  given child element
    - `childEl`: HTMLElement, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **scrollToIndex**: (index, options) => Observable<{ x: number; y: number; }>

    Scroll to given child index. childSelector must be set.
    - `index`: number, index of child element, `required`
    - `options`: NgxSmoothScrollOption, see more [here](#scroll-option)

- **interrupt**: () => boolean

    Interrupt current scroll animation and stop immediately.
    - **@return**: boolean, whether behavior interrupted successfully.

<a name="issues">

## Issues
If you find any errors or suggestion to this library, please open an [issue](https://github.com/Seemspyo/ngx-smooth-scroll/issues).

<a name="author">

## Author
SeemsPyo [Github](https://github.com/Seemspyo), [Homepage](https://eunsatio.io)