[postcss](https://github.com/postcss/postcss)-[pie](http://css3pie.com/)
======

[![Greenkeeper badge](https://badges.greenkeeper.io/gucong3000/postcss-pie.svg)](https://greenkeeper.io/)

[![NPM version](https://img.shields.io/npm/v/postcss-pie.svg?style=flat-square)](https://www.npmjs.com/package/postcss-pie)
[![Travis](https://img.shields.io/travis/gucong3000/postcss-pie.svg?&label=Linux)](https://travis-ci.org/gucong3000/postcss-pie)
[![AppVeyor](https://img.shields.io/appveyor/ci/gucong3000/postcss-pie.svg?&label=Windows)](https://ci.appveyor.com/project/gucong3000/postcss-pie)
[![Coverage Status](https://img.shields.io/coveralls/gucong3000/postcss-pie.svg)](https://coveralls.io/r/gucong3000/postcss-pie)

makes IE capable of rendering several of the most useful CSS3 decoration features.

------

[简体中文](README-zh.md)

postcss-pie is a plugin for [PostCSS](https://github.com/postcss/postcss), use [PIE](http://css3pie.com/), to makes IE6-IE9 several of the most useful CSS3 decoration features. like:
* [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)
* [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
* [border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image)
* [CSS3 Backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Background_and_Borders/Using_CSS_multiple_backgrounds)
* [Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients)

## Usage

[Download PIE](http://css3pie.com/download/), Unpack all the files and deploy them to a directory of the web server, such as `/pie/`
Configure your postcss

```JavaScript
var postcss = require('postcss');
var pie = require('postcss-pie');

postcss([
	pie({
		// You must use absolute address and must have the same domain name as HTML. You must not cross domain or use CDN address.
		htcPath: '/pie/PIE.htc',
		// The path to the directory where other files of PIE is, must be full URL, and can be CDN addresses.
		pieLoadPath: 'http://server.com/pie/',
	});
]);
```

## [Serving the correct Content-Type](http://css3pie.com/documentation/known-issues/#content-type)

IE requires that HTC behaviors are served up with a content-type header of "text/x-component", otherwise it will simply ignore the behavior.
See [PIE related documents](http://css3pie.com/documentation/known-issues/#content-type)

## [PIE documentation](http://css3pie.com/documentation/)
