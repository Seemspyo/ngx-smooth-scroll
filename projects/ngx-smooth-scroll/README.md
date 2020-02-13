<p align="center">
    <img width="160px" height="160px" style="text-align:center" src="https://user-images.githubusercontent.com/40263620/73897891-dd343000-48ca-11ea-9c02-9f2337f0f442.png">
    <h1 align="center">Agular Smooth Scroll</h1>
</p>

[![Demo](https://img.shields.io/badge/Demo-online-brightgreen)](https://playground.eunsatio.io/projects/ngx-smooth-scroll-demo/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/Seemspyo/ngx-smooth-scroll/)
[![Angular](https://img.shields.io/badge/ng-^7.0.0-red)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-9cf)](https://github.com/Seemspyo/ngx-smooth-scroll/blob/master/projects/ngx-smooth-scroll/LICENSE)

Provide simple, configurable, cubic-bezier support smooth scroll for Angular 7+

---

## Contents
- [Demo](https://playground.eunsatio.io/projects/ngx-smooth-scroll-demo/)
- [Purpose](#purpose)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Issues](#issues)
- [Author](#author)
- [Change Log](https://github.com/Seemspyo/ngx-smooth-scroll/blob/master/projects/ngx-smooth-scroll/CHANGELOG.md)

<a name="purpose">

## Purpose
Javascript Browser APIs has `scrollTo` and `scrollIntoView` method. Which allows us to manipulate browser native scroll behavior easily.
But some browser does not supports `behavior: 'smooth'` option. Thus, this methods doesn't have options for duration nor timing-function. And we have to seek for workaround to know when this behavior going to ends.
This package is configurable, compatible, easy to use, and uses `rxjs.Observable` to notify the subscribers when behavior ends.

<a name="installation">

## Installation

### NPM
```bash
npm install @eunsatio/ngx-smooth-scroll
```

<a name="usage">

## Usage

### Use with directive
Import `NgxSmoothScrollModule` into your module.

#### Basic usage(bind to wheel event)
```html
<div class="container" [ngxSmoothScroll]="options" childSelector=".content" smooth-wheel>
    <!---->
    <div class="content"></div>
    <!---->
</div>
```

#### Bind event to custom element
```html
<div class="control-section" #controlSection>
    <!-- The event will bind to this element -->
</div>

<div class="container" [ngxSmoothScroll]="options" childSelector=".content" [smooth-mouse]="controlSection">
    <!---->
    <div class="content"></div>
    <!---->
</div>
```

#### Different options for each event
```ts
public options: NgxSmoothScrollDirectiveOption = {
    duration: 500, // Global option
    wheel: {
        duration: 600, // This will override global option
        timingFunction: 'ease-out'
    },
    keydown: {
        timingFunction: 'ease-in'
    }
}
```
```html
<div class="container" [ngxSmoothScroll]="options" childSelector=".content" smooth-wheel smooth-keydown>
    <!---->
    <div class="content"></div>
    <!---->
</div>
```

### Use as service
Import and Inject `NgxSmoothScrollService`.

```ts
public scrollToTarget() {
    this.smoothScrollService.scrollToElement(this.containerElRef.nativeElement, this.targetElRef.nativeElement, {
        duration: 600,
        timingFunction: 'ease-in-out'
    });
}
```

### Use directly
Import `NgxSmoothScroll`.

```ts
ngAfterViewInit() {
    this.smoothScroll = new NgxSmoothScroll(this.containerElRef.nativeElement);
}

public scrollToTarget() {
    this.smoothScroll.scrollTo({ x: 0, y: 300 }, {
        duration: 800,
        timingFunction: '.13, 1.07, .51, 1.29'
    });
}
```

<a name="documentation">

## Documentation

### NgxSmoothScrollDirective(@Directive)

#### @Input
- **ngxSmoothScroll**: `NgxSmoothScrollDirectiveOption` `optional`

    Scroll option object. Can specify options for each event. See more at [here](#scroll-options).

- **childSelector**: `string` `optional`

    Child element selector.
    - **@default**: `'.ngx-smooth-scroll-content'`

- **skip**: `number` `optional`

    Amount of index to skip on each event.
    - **@default**: `0`

- **keyCode**: `{ forward: number[]; reverse: number[] }` `optional`

    Key code to define actions when `smooth-keydown` event enabled.
    - **@default**: `{ forward: [ 39, 40, 68, 83 ], reverse: [ 37, 38, 65, 87 ] }`

- **autoInterruption**: `boolean` `optional` `experimental`

    Whether cancel current scroll animation on another `smooth-*` event.
    - **@default**: `false`

- **autoDetect**: `boolean` `optional`

    Whether detect current index automatically. If `false`, detect index only once.
    - **@default**: `true`

- **autoDetectDirection**: `'mixed' | 'vertical' | 'horizontal'` `optional`

    Axis to detect current index. If set this to `vertical`, can reduce unnecessary calculation in `vertical` only scroll.
    - **@default**: `'mixed'`

- **detectOffsetX**: `number` `optional`

    X offset to detect current index. If `0`, the first child element whthin container left boundary will be deteceted.
    - **@default**: `0.5`

- **detectOffsetY**: `number` `optional`

    Y offset to detect current index. If `0`, the first child element whthin container top boundary will be deteceted.
    - **@default**: `0.5`

- **actionDirection**: `'mixed' | 'vertical' | 'horizontal'` `optional`

    Axis to detect direction for `smooth-mouse` and `smooth-touch`.
    - **@default**: `'mixed'`

- **actionMinDistance**: `number` `optional`

    Minimum distance(px) to trigger scroll animation for `smooth-mouse` and `smooth-touch`.
    - **@default**: `30`

- **smooth-wheel**: `boolean | any | any[]` `optional`

    Whether enable wheel event or binding element(s).
    - **@default**: `false`

- **smooth-keydown**: `boolean | any | any[]` `optional`

    Whether enable keydown event or binding element(s).
    - **@default**: `false`

- **smooth-mouse**: `boolean | any | any[]` `optional`

    Whether enable mouse event or binding element(s).
    - **@default**: `false`

- **smooth-touch**: `boolean | any | any[]` `optional`

    Whether enable touch event or binding element(s).
    - **@default**: `false`

#### @Output
- **beforeAnimate**: `NgxSmoothScrollBeforeAnimateEvent`

    Event triggers before scroll animation starts.
    - `currentIndex`: `number`, current child index
    - `targetIndex`: `number`, target child index

- **afterAnimate**: `NgxSmoothScrollAfterAnimateEvent`

    Event triggers after scroll animation ends(or interrupted).
    - `prevIndex`: `number`, previous child index
    - `currentIndex`: `number`, current child index(if interrupted, auto detected current index or equal to `prevIndex`)
    - `scrollCoords`: `{ x: number; y: number; }`, current scroll coordination.

#### Properties
- **containerEl**: native container element. `readonly`
- **children**: pure array of child elements. `readonly`
- **currentIndex**: `number`, current index. `readonly`

#### Methods
- **scrollTo**: `(destination, options) => Observable<{ x: number; y: number; }>`

    Scroll to given destination.
    - `destination`: `{ x?: number; y?: number; }`, destination coords, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`

- **scrollToElement**: `(el, options) => Observable<{ x: number; y: number; }>`

    Scroll to given element.
    - `el`: `ElementRef | HTMLElement`, target element, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`

- **scrollToIndex**: `(index, options) => Observable<{ x: number; y: number; }>`

    Scroll to given child index. `childSelector` must be set.
    - `index`: `number`, target index, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`

- **interrupt**: `() => boolean`

    Interrupt current scroll animation(since `requestAnimationFrame` behaves asynchronously, use `afterAnimate` or `Observable` to catch actual animation ends).
    - **@return**: `boolean`, whether interruption successful.


### NgxSmoothScroll(class)

#### Create instance
```ts
new NgxSmoothScroll(containerEl, childSelector);
```
- `containerEl`: `ElementRef | HTMLElement` `required`

    Container element.

- `childSelector`: `string` `optional`

    Child element selector.

#### Properties
- **containerEl**: `HTMLElement`, native container element. `readonly`
- **childSelector**: `string`, selector of child element, [see more](#scroll-options).
- **defaultOption**: `NgxSmoothScrollOption`, default option object. `readonly`

#### Methods
- **scrollTo**: `(destination, options) => Observable<{ x: number; y: number; }>`

    Scroll to given destination.
    - `destination`: `{ x?: number; y?: number; }`, destination coords, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`

- **scrollToElement**: `(el, options) => Observable<{ x: number; y: number; }>`

    Scroll to given element.
    - `el`: `ElementRef | HTMLElement`, target element, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`

- **scrollToIndex**: `(index, options) => Observable<{ x: number; y: number; }>`

    Scroll to given child index. `childSelector` must be set.
    - `index`: `number`, target index, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`

- **interrupt**: `() => boolean`

    Interrupt current scroll animation(since `requestAnimationFrame` behaves asynchronously, use `afterAnimate` or `Observable` to catch actual animation ends).
    - **@return**: `boolean`, whether interruption successful.

### NgxSmoothScrollService(@Injectable)

A simple wrapper for `NgxSmoothScroll`.

#### Methods
- **createInstance**: `(contaierEl, childSelector) => NgxSmoothScroll`

    Create `NgxSmoothScroll` instance.
    - `containerEl`: `ElementRef | HTMLElement`, container element, `required`
    - `childSelector`: `string`, child element selector, `optional`

- **scrollTo**: `(containerEl, destination, options) => Observable<{ x: number; y: number; }>`

    Create `NgxSmoothScroll` instance once and scroll to given destination.
    - `containerEl`: `ElementRef | HTMLElement`, container element, `required`
    - `destination`: `{ x?: number; y?: number; }`, destination coords, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`

- **scrollToElement**: `(containerEl, childEl, options) => Observable<{ x: number; y: number; }>`

    Create `NgxSmoothScroll` instance once and scroll to given element.
    - `containerEl`: `ElementRef | HTMLElement`, container element, `required`
    - `childEl`: `ElementRef | HTMLElement`, target element, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`

- **scrollToIndex**: `(containerEl, childSelector, index, options) => Observable<{ x: number; y: number; }>`

    Create `NgxSmoothScroll` instance once and scroll to given child index. `childSelector` must be set.
    - `containerEl`: `ElementRef | HTMLElement`, container element, `required`
    - `childSelector`: `string`, child element selector, `required`
    - `index`: `number`, target index, `required`
    - `options`: `NgxSmoothScrollOption`, scroll options, [see more](#scroll-options), `optional`


<a name="scroll-options">

### NgxSmoothScrollOption
- **duration**: `number`

    The scroll animation duration, `ms`.
    - **@default**: `600`

- **timingFunction**: `string`

    The scroll animation timing function, support **cubic-bezier**.
    - `linear`
    - `ease`
    - `ease-in`
    - `ease-out`
    - `ease-in-out`
    - `cubic bezier`: ex) '.13, 1.07, .51, 1.29', check more at [cubic-bezier.com](https://cubic-bezier.com/)
    - **@default**: `'ease'`

- **alignX**: `'start' | 'center' | 'end'`

    X axis alignment.
    - **@default**: `'start'`

- **alignY**: `'start' | 'center' | 'end'`

    Y axis alignment.
    - **@default**: `'start'`

- **stopOnArrival*: `boolean`

    Whether stop scroll animation on arrival.
    - **@default**: `false`

<a name="issues">

## Issues
If you found any errors or suggestion to this library, please open an [issue](https://github.com/Seemspyo/ngx-smooth-scroll/issues).

<a name="author">

## Author
SeemsPyo [Github](https://github.com/Seemspyo), [Homepage](https://eunsatio.io)