'use strict';
const assert = require('assert');
const fs = require('fs');
const postcss = require('postcss');
const sinon = require('sinon');
const pie = require('..');

let files = fs.readdirSync('./test/fixtures');

files = files.filter(function (filename) {
	return /\.css$/.test(filename) && !/-out\.css$/.test(filename);
});

function testFile (input, output, options) {
	let real;
	return postcss([
		pie(options),
	]).process(fs.readFileSync(input).toString(), {
		from: input,
	}).then(function (result) {
		if (output) {
			real = result.content;
			assert.equal(fs.readFileSync(output).toString(), real);
		}
	}).catch(ex => {
		if (real && output) {
			fs.writeFileSync(output, real);
		}
		throw ex;
	});
}

describe('fixtures', () => {

	files.forEach(function (filename) {

		const input = './test/fixtures/' + filename;
		const testName = filename.replace(/\.\w+$/, '');

		it(testName, () => {
			return testFile(input, input.replace(/\.\w+$/, '-out.css'));
		});

		it(testName + ' with behavior', () => {
			return testFile(input, input.replace(/\.\w+$/, '-behavior-out.css'), {
				pieLoadPath: 'http://css3pie.com/pie',
				htcPath: '/pie/PIE.htc',
			});
		});
	});
});

describe('options error', () => {

	function waitExitCode () {
		return new Promise(resolve => {
			const timer = setInterval(() => {
				if (process.exit.called) {
					clearInterval(timer);
					resolve(process.exit.lastCall.args[0]);
				}
			}, 20);
		});
	}

	beforeEach(() => {
		sinon.stub(process, 'exit');
		sinon.stub(console, 'error');
	});

	afterEach(() => {
		process.exit.restore();
		console.error.restore();
	});

	it('invalid htcPath', () => {
		const result = waitExitCode().then((exitCode) => {
			const message = console.error.lastCall.args[0].split(/\n\s+/)[0];
			assert.equal(message, 'invalid `options.htcPath`, Expect absolute path or URL.');
			assert.ok(exitCode);
		});
		pie({
			htcPath: 'invalid',
		});
		return result;
	});

	it('invalid pieLoadPath', () => {
		const result = waitExitCode().then((exitCode) => {
			const message = console.error.lastCall.args[0].split(/\n\s+/)[0];
			assert.equal(message, 'invalid `options.pieLoadPath`, Expect URL.');
			assert.ok(exitCode);
		});
		pie({
			pieLoadPath: 'invalid',
		});
		return result;
	});

	it('invalid htcPath `content-type`', function () {
		this.timeout(30000);
		const result = waitExitCode().then((exitCode) => {
			const message = console.error.lastCall.args[0];
			assert.ok(/Invalid `content-type`/i.test(message), message);
			assert.ok(exitCode);
		});
		pie({
			htcPath: '//github.com/lojjic/PIE',
		});
		return result;
	});

	it('pieLoadPath 404', function () {
		this.timeout(30000);
		const result = waitExitCode().then((exitCode) => {
			const message = console.error.lastCall.args[0];
			assert.ok(/Response code 404 \(Not Found\)/i.test(message), message);
			assert.ok(exitCode);
		});
		pie({
			pieLoadPath: '//github.com/lojjic/PIE',
		});
		return result;
	});

});
