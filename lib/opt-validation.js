'use strict';
const got = require('got');
const urlCache = {};
const reHtc = {
	test: RegExp.prototype.test.bind(/^text\/x-component$/i),
	expected: 'text/x-component',
};
const reJs = {
	test: RegExp.prototype.test.bind(/^\w+\/javascript$/i),
	expected: 'application/javascript',
};

function testRemotesFile (url, prop, type) {
	if (urlCache[url]) {
		return urlCache[url];
	}

	urlCache[url] = got(url).then(response => {
		let message;
		if (!type.test(response.headers['content-type'])) {
			message = [
				'Invalid `content-type`: `',
				response.headers['content-type'],
				'`, expected: `',
				type.expected,
			].join('');
		}
		return message;
	}).catch(ex => {
		return ex.message;
	}).then(message => {
		if (message) {
			throw [
				message,
				url,
				'`options.' + prop + '`',
			].join('\n\tat ');
		}
	});

	return urlCache[url];
}

function fixurl (url) {
	url = url && /^(https?:)?(\/\/[^\/]+\/.+)\/?$/.exec(url);
	if (url) {
		return (url[1] || 'https:') + url[2];
	}
}

function optValidation (options) {
	if (!options) {
		return Promise.resolve({});
	}

	let error;

	const task = [];
	function test (url, prop, type) {
		task.push(testRemotesFile(url, prop, type));
	}

	/* istanbul ignore else */
	if (options.pieLoadPath) {
		const pieLoadPath = fixurl(options.pieLoadPath);
		if (pieLoadPath) {
			options.pieLoadPath = pieLoadPath;
			test(pieLoadPath + '/PIE_IE678.js', 'pieLoadPath', reJs);
			test(pieLoadPath + '/PIE_IE9.js', 'pieLoadPath', reJs);
		} else {
			error = 'invalid `options.pieLoadPath`, Expect URL.';
		}
	}

	if (options.htcPath) {
		const htcPath = fixurl(options.htcPath);
		if (htcPath) {
			options.htcPath = htcPath;
			test(options.htcPath, 'htcPath', reHtc);
		} else if (!/^\//.test(options.htcPath)) {
			error = 'invalid `options.htcPath`, Expect absolute path or URL.';
		}
	}

	if (error) {
		return Promise.reject(error);
	} else {
		return Promise.all(task);
	}
}

function validation (options) {
	const stack = new Error().stack.split(/\r?\n\s+/g).slice(4);
	optValidation(options).catch(message => {
		console.error([message].concat(stack).join('\n\t'));
		process.exit(1);
	});

}
module.exports = validation;
