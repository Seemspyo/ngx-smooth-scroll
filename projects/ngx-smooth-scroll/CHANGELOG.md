### 1.0.0
- **@Deprecated**: `NgxSmoothScrollWheelDirective`
- **@Deprecated**: `NgxSmoothScrollKeyboardDirective`
- **Change**: `child-selector` -> `childSelector`

Check new feature at [Documentaion](https://github.com/Seemspyo/ngx-smooth-scroll)

#### 0.3.1-beta fix wrong documentation
- **childSelector**: not `childSelector` should use `child-selector`

#### 0.3.0-beta Add methods & properties to each directive
- `NgxSmoothScrollWheelDirective.containerEl`: HTMLElement, container element.
- `NgxSmoothScrollWheelDirective.children`: HTMLElement[], pure array of child elements.

- `NgxSmoothScrollWheelDirective.scrollTo`: (destination, options) => Observable<{ x: number; y: number; }>

    Scroll to given destination.
    - `destination`: object, `{ x: number; y: number; }`, `required`
    - `options`: NgxSmoothScrollOption, see more [here](https://github.com/Seemspyo/ngx-smooth-scroll#scroll-option)

- `NgxSmoothScrollWheelDirective.scrollToChild`: (childEl, options) => Observable<{ x: number; y: number; }>

    Scroll to  given child element
    - `childEl`: HTMLElement, `required`
    - `options`: NgxSmoothScrollOption, see more [here](https://github.com/Seemspyo/ngx-smooth-scroll#scroll-option)

- `NgxSmoothScrollWheelDirective.scrollToIndex`: (index, options) => Observable<{ x: number; y: number; }>

    Scroll to given child index. childSelector must be set.
    - `index`: number, index of child element, `required`
    - `options`: NgxSmoothScrollOption, see more [here](https://github.com/Seemspyo/ngx-smooth-scroll#scroll-option)

- `NgxSmoothScrollKeyboardDirective.containerEl`: HTMLElement, container element.
- `NgxSmoothScrollKeyboardDirective.children`: HTMLElement[], pure array of child elements.

- `NgxSmoothScrollKeyboardDirective.scrollTo`: (destination, options) => Observable<{ x: number; y: number; }>

    Scroll to given destination.
    - `destination`: object, `{ x: number; y: number; }`, `required`
    - `options`: NgxSmoothScrollOption, see more [here](https://github.com/Seemspyo/ngx-smooth-scroll#scroll-option)

- `NgxSmoothScrollKeyboardDirective.scrollToChild`: (childEl, options) => Observable<{ x: number; y: number; }>

    Scroll to  given child element
    - `childEl`: HTMLElement, `required`
    - `options`: NgxSmoothScrollOption, see more [here](https://github.com/Seemspyo/ngx-smooth-scroll#scroll-option)

- `NgxSmoothScrollKeyboardDirective.scrollToIndex`: (index, options) => Observable<{ x: number; y: number; }>

    Scroll to given child index. childSelector must be set.
    - `index`: number, index of child element, `required`
    - `options`: NgxSmoothScrollOption, see more [here](https://github.com/Seemspyo/ngx-smooth-scroll#scroll-option)

#### 0.2.3-beta fix interrupt method
#### 0.2.2-beta hot fix for child selector
#### 0.2.1-beta Add directives to exports
#### 0.2.0-beta Add interrupt method to directives & Fix bug
- `NgxSmoothScrollWheelDirective.interrupt`: () => boolean
    - **@return**: boolean, whether behavior interrupted successfully.
- `NgxSmoothScrollKeyboardDirective.interrupt`: () => boolean
    - **@return**: boolean, whether behavior interrupted successfully.
- Fix bug: `NgxSmoothScroll.interrupt` not worked propery.
#### 0.1.2-beta Update README
#### 0.1.1-beta Update README