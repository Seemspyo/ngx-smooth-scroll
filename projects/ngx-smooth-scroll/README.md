<p align="center">
    <img width="160px" height="160px" style="text-align:center" src="https://user-images.githubusercontent.com/40263620/73897891-dd343000-48ca-11ea-9c02-9f2337f0f442.png">
    <h1 align="center">Agular Smooth Scroll</h1>
</p>

[![Demo](https://img.shields.io/badge/Demo-online-brightgreen)](https://playground.eunsatio.io/projects/ngx-smooth-scroll-demo/)
[![Version](https://img.shields.io/badge/version-1.0.5-blue)](https://github.com/Seemspyo/ngx-smooth-scroll/)
[![Angular](https://img.shields.io/badge/ng-^7.0.0-red)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-9cf)](https://github.com/Seemspyo/ngx-smooth-scroll/blob/master/projects/ngx-smooth-scroll/LICENSE)

Provide simple, configurable, cubic-bezier support smooth scroll for Angular 7+

---

## Contents
- [Demo](https://playground.eunsatio.io/projects/ngx-smooth-scroll-demo/)
- [Purpose](#purpose)
- [Installation](#installation)
- [Usage](https://github.com/Seemspyo/ngx-smooth-scroll#usage)
- [Documentation](https://github.com/Seemspyo/ngx-smooth-scroll#documentation)
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

<a name="issues">

## Issues
If you found any errors or suggestion to this library, please open an [issue](https://github.com/Seemspyo/ngx-smooth-scroll/issues).

<a name="author">

## Author
SeemsPyo(@eunsatio) [Github](https://github.com/Seemspyo), [Homepage](https://eunsatio.io)