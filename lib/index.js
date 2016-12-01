"use strict";
var postcss = require("postcss");

module.exports = postcss.plugin("postcss-pie", function(options) {

	return function(css, result) {
		function testRemotesJs(url) {
			require("request")
				.get(url)
				.on("error", function(err) {
					result.warn("options.pieLoadPath", err);
				});
		}
		if (options) {

			if (options.htcPath && !/^\/.*/.test(options.htcPath)) {
				options.htcPath = null;
				result.warn("options.htcPath: the URL has to either be absolute from the domain root");
			}
			if (options.pieLoadPath) {
				var pieLoadPath = options.pieLoadPath.replace(/\/?$/, "/PIE_IE");
				testRemotesJs(pieLoadPath + "678.js");
				testRemotesJs(pieLoadPath + "9.js");
			}
		}
		var opts = options || {};

		var hasBehavior;

		css.walkRules(function(rule) {

			var needBehavior;
			var hasGradient;
			// 寻找pie不能直接获取到的css属性，给与“-pie”前缀以便pie可以访问
			rule.walkDecls(function(decl) {

				var needPrefix;

				if (/^background(?:-image)?$/.test(decl.prop) && /\bgradient\(/.test(decl.value)) {
					// 发现颜色渐变背景
					hasGradient = true;
					needPrefix = true;
				} else if (decl.prop === "background" && /\b(?:\/|text|contain|cover(?:(?:padding|border|content)-box))\b/.test(decl.value.replace(/\burl\([^())]+\)/, ""))) {
					// background 属性中含有css3的属性值
					needPrefix = true;
				} else if (/^background(?:-(?:color|image|repeat|attachment|position))?$/.test(decl.prop) && /,/.test(decl.value)) {
					// background或者color|image|repeat|attachment|position中有多背景图
					needPrefix = true;
				} else if (!needBehavior && /(?:border-image|border-radius|box-shadow|background-(?:size|origin|clip))/.test(decl.prop)) {
					// 发现了其他pie可以兼容，但IE8根本不认识的css属性
					needBehavior = true;
				}

				if (needPrefix) {
					needBehavior = true;
					rule.insertBefore(decl, {
						prop: "-pie-" + decl.prop,
						value: decl.value,
					});
				}
			});

			// 如果当前rule中找到可PIE兼容的项目
			if (needBehavior && opts.htcPath) {
				hasBehavior = true;
				// 如果不需要兼容背景渐变
				if (!hasGradient && !rule.selectors.some(function(selector) {
					return /^:root\b/.test(selector);
				})) {
					// IE9下关闭behavior
					rule.prepend({
						prop: "behavior",
						value: "none\\9\\0",
					});
				}
				// 添加behavior属性
				rule.prepend({
					prop: "behavior",
					value: "url(\"" + opts.htcPath + "\")",
				});
			}
		});
		if (hasBehavior && opts.pieLoadPath) {
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
