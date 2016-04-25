# [postcss](https://github.com/postcss/postcss)-[pie](http://css3pie.com/)

让IE兼容最常用的几个CSS3特性

------

[English](README.md)

postcss-pie 由[PostCSS](https://github.com/postcss/postcss)与[PIE](http://css3pie.com/)驱动，让IE6-IE8兼容CSS3特性:
*   [border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)
*   [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)
*   [border-image](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-image)
*   [CSS3 Backgrounds](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Background_and_Borders/Using_CSS_multiple_backgrounds)
*   [Gradients](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Images/Using_CSS_gradients)

## Usage

1.   [下载PIE](http://css3pie.com/download-latest)，解压所有文件到HTML文档所在服务器的某个目录， 如`/path/to/pie_files/`
1.   配置你的postcss 
    ```JavaScript
    var postcss = require('postcss');
    var pie = require('postcss-pie');

    postcss([
        pie({
            // `PIE_IE9.js`与`PIE_IE678.js`在CDN服务器上的目录。不使用CDN的话，请删除pieLoadPath
            pieLoadPath: 'http://cdn.server/path/to/js-files/',

            // PIE.htc文件路径，必须使用`/`开头的绝对路径。注意文件应放在HTML文档所在服务器
            htcPath: '/path/to/pie_files/PIE.htc',
        });
    ]);
    ```

1.   [确保正确的Content-Type](http://css3pie.com/documentation/known-issues/#content-type)

    如果IE在请求PIE.htc文件时，HTTP响应头中的Content-Type不是"text/x-component"，会造成功能失效。
    在大部分服务器默认配置下，都不会出现这个问题。如果出现此问题，如Apache，请在.htaccess 文件中添加：

    ```
    AddType text/x-component .htc
    ```

[PIE的文档](http://css3pie.com/documentation/)