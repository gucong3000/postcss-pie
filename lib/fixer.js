'use strict';
const checkBG = require('./check-bg');

function fixer (root, options) {
	let hasBehavior;

	root.walkRules(rule => {

		let needBehavior;
		let needIE9;
		let behavior;
		const pieProps = {};
		// 寻找pie不能直接获取到的css属性，给与“-pie”前缀以便pie可以访问
		rule.each(decl => {
			if (decl.type !== 'decl') {
				return;
			}

			if (/^-pie-/.test(decl.prop)) {
				// 记录已经加过前缀的属性
				pieProps[decl.prop.slice(5).toLowerCase()] = decl.value;
				needBehavior = true;
				return;
			} else if (pieProps[decl.prop.toLowerCase()]) {
				// 跳过已经加过前缀的属性
				return;
			} else if (/^behavior$/i.test(decl.prop)) {
				behavior = decl;
				return;
			}

			if (/^border-image$/i.test(decl.prop)) {
				// 发现了其他pie可以兼容，但IE8根本不认识的css属性
				needBehavior = true;
				needIE9 = true;
				return;
			}

			if (/^(?:border-image|border-radius|box-shadow|background-(?:size|origin|clip))$/i.test(decl.prop)) {
				// 发现了其他pie可以兼容，但IE8根本不认识的css属性
				needBehavior = true;
				return;
			}

			function addPrefix () {
				needBehavior = true;
				decl.cloneBefore({
					prop: '-pie-' + decl.prop,
				});
			}

			if (/^background(?:-image)?$/.test(decl.prop) && /\bgradient\(/.test(decl.value)) {
				// 发现<gradient>类型的取值
				needIE9 = true;
				addPrefix();
			} else if (checkBG(decl)) {
				addPrefix();
			}
		});

		// 如果当前rule中找到可PIE兼容的项目
		if (needBehavior && options.htcPath) {
			hasBehavior = true;
			if (behavior) {
				return;
			}
			// 添加behavior属性
			rule.append({
				prop: 'behavior',
				value: 'url("' + options.htcPath + '")',
			});

			// 如果不需要兼容背景渐变
			if (!needIE9 && !rule.selectors.some(selector => {
				return /^:root\b/i.test(selector);
			})) {
				// IE9下关闭behavior
				rule.append({
					prop: 'behavior',
					value: 'none\\9\\0',
				});
			}
		}
	});
	if (hasBehavior && options.pieLoadPath && !/-pie-load-path\b/i.test(root.first.toString())) {
		root.prepend({
			selector: 'html',
		});
		root.first.append({
			prop: '-pie-load-path',
			value: '"' + options.pieLoadPath + '"',
		});
	}
}

module.exports = fixer;
