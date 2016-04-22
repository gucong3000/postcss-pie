"use strict";
var postcss = require("postcss");

// 判断background属性的取值中有无css3语法的取值
function hasCSS3Value(value) {
    return /(?:text|contain|cover(?:(?:padding|border|content)-box))/.test(value) || /\//.test(value.replace(/\burl\([^)]\)/, ""));
}

module.exports = postcss.plugin("postcss-pie", function(opts) {

    return function(css) {
        opts = opts || {};
        opts.pieLoadPath = opts.pieLoadPath ? opts.pieLoadPath.replace(/\/?$/, "") : "http://css3pie.com/pie";
        opts.htcPath = opts.htcPath || (opts.pieLoadPath + "/PIE.htc");

        var hasPatch;
        var loadPath;

        css.walkRules(function(rule) {

            // 在css文件中寻找-pie-load-path配置
            if (!loadPath && /^(?:html|\:root)$/.test(rule.selectors[rule.selectors.length - 1])) {
                rule.walkDecls("-pie-load-path", function(decl) {
                    loadPath = decl.value;
                    if (loadPath) {
                        return false;
                    }
                });
            }

            if (rule.selectors[0] !== ":root") {
                var needPatch;
                var hasGradient;

                // 在css中寻找border-image、border-radius、box-shadow等PIE能够兼容的CSS3属性
                rule.walkDecls(/^(?:-pie(?:-\w+)+|border-image|border-radius|box-shadow|background-(?:size|origin|clip))$/, function() {
                    needPatch = true;
                    return false;
                });

                // 寻找pie不能直接获取到的css属性，给与“-pie”前缀以便pie可以访问
                rule.walkDecls(/^background\b/, function(decl) {
                    var isGradient = /(?:\bgradient\(|,)/.test(decl.value);

                    if(isGradient){
                        hasGradient = true;
                    }

                    if (hasGradient || (decl.prop === "background" && hasCSS3Value(decl.value))) {
                        needPatch = true;
                        rule.insertBefore(decl, {
                            prop: "-pie-" + decl.prop,
                            value: decl.value,
                        });
                    }
                });

                // 如果当前rule中找到可PIE兼容的项目,则添加behavior属性
                if (needPatch) {
                    hasPatch = true;
                    // 如果不需要兼容背景渐变,则在IE9下关闭behavior
                    if (!hasGradient) {
                        // IE9下重置behavior
                        rule.prepend({
                            prop: "behavior",
                            value: "none\\9\\0",
                        });
                    }
                    rule.prepend({
                        prop: "behavior",
                        value: "url(\"" + opts.htcPath + "\")",
                    });
                }
            }
        });
        if (hasPatch && !loadPath) {
            css.prepend({
                selector: "html"
            });
            css.first.append({
                prop: "-pie-load-path",
                value: "\"" + opts.pieLoadPath + "\""
            });
        }
    };
});