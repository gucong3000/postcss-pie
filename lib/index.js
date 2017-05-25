'use strict';
const postcss = require('postcss');
const optValidation = require('./opt-validation');
const fixer = require('./fixer');
module.exports = postcss.plugin('postcss-pie', function (options) {
	optValidation(options);
	return function (root) {
		return fixer(root, options || {});
	};
});
