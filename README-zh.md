[postcss](https://github.com/postcss/postcss)-[pie](http://css3pie.com/)
======

[![NPM version](https://img.shields.io/npm/v/postcss-pie.svg?style=flat-square)](https://www.npmjs.com/package/postcss-pie)
[![Travis](https://img.shields.io/travis/gucong3000/postcss-pie.svg?&label=Linux)](https://travis-ci.org/gucong3000/postcss-pie)
[![AppVeyor](https://img.shields.io/appveyor/ci/gucong3000/postcss-pie.svg?&label=Windows)](https://ci.appveyor.com/project/gucong3000/postcss-pie)
[![Coverage Status](https://img.shields.io/coveralls/gucong3000/postcss-pie.svg)](https://coveralls.io/r/gucong3000/postcss-pie)

使IE能够显示一些最有用的CSS3的装饰特性。

------

[English](README.md)

postcss-pie 由[PostCSS](https://github.com/postcss/postcss)与[PIE](http://css3pie.com/)驱动，让IE6-IE9兼容这些CSS3特性:
* [border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)
* [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)
* [border-image](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-image)
* [CSS3 Backgrounds](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Background_and_Borders/Using_CSS_multiple_backgrounds)
* [Gradients](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Images/Using_CSS_gradients)

## Usage

[下载PIE](http://css3pie.com/download/)，解压所有文件，部署到web服务器的某个目录， 如`/pie/`
配置你的postcss

```JavaScript
var postcss = require('postcss');
var pie = require('postcss-pie');

postcss([
	pie({
		// 必须使用绝对地址，且必须与html同一个域名，不得跨域，不得使用CDN地址。
		htcPath: '/pie/PIE.htc',
		// PIE的其他文件所在目录的路径，必须是完整url，可以是cdn地址。
		pieLoadPath: 'http://server.com/pie/',
	});
]);
```

## [确保正确的Content-Type](http://css3pie.com/documentation/known-issues/#content-type)

如果IE在请求PIE.htc文件时，HTTP响应头中的Content-Type不是"text/x-component"，会造成功能失效。
详见[PIE相关文档](http://css3pie.com/documentation/known-issues/#content-type)

## [PIE的文档](http://css3pie.com/documentation/)
