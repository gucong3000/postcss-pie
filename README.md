# [postcss](https://github.com/postcss/postcss)-[pie](http://css3pie.com/)

makes IE several of the most useful CSS3 decoration features

------

[简体中文](README-zh.md)


postcss-pie is a plugin for [PostCSS](https://github.com/postcss/postcss), use [PIE](http://css3pie.com/), to makes IE several of the most useful CSS3 decoration features. like:
*   [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)
*   [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
*   [border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image)
*   [CSS3 Backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Background_and_Borders/Using_CSS_multiple_backgrounds)
*   [Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients)

## Usage

1.   [Download the PIE distribution](http://css3pie.com/download-latest), and unzip it somewhere. sub path from the HTML document domain root. like: `/path/to/pie_files/`
1.   config postcss 
    ```JavaScript
    var postcss = require('postcss');
    var pie = require('postcss-pie');

    postcss([
        pie({
            // `PIE_IE9.js` and `PIE_IE678.js` path on CDN server. if you don't ues CDN, please delete `pieLoadPath`.
            pieLoadPath: 'http://cdn.server/path/to/js-files/',

            // file PIE.htc path. Must a absolute from the HTML document domain root
            htcPath: '/path/to/pie_files/PIE.htc',
        });
    ]);
    ```

1.   [Serving the correct Content-Type](http://css3pie.com/documentation/known-issues/#content-type)

    IE requires that HTC behaviors are served up with a content-type header of "text/x-component", otherwise it will simply ignore the behavior. Many web servers are preconfigured to serve the correct content-type, but others are not.
    If you have problems with the PIE behavior not being applied, check your server configuration and if possible update it to use the correct content-type. For Apache, you can do this in a .htaccess file:

    ```
    AddType text/x-component .htc
    ```

[documentation of PIE](http://css3pie.com/documentation/)