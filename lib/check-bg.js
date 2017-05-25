'use strict';
// 检查background子属性中是否含有IE不认识的值
const bgSubKeyWord = {
	color: /\b(?:rgba|hsla?)\(/i,
	repeat: /\b(?:round|space?)\b/i,
	attachment: /\blocal\b/i,
};

// 检查background属性中是否有IE不认识的关键字
const bgKeyWord = [
	// border-box | padding-box | content-box
	/\b(?:border|padding|content)-box\b/,
	// auto | cover | contain | text
	/\b(auto|cover|contain|text)\b/,
	// 长度值
	/\/\s*(?:\d*\.)?\d+(?:[a-z]+?|%)\b/,
].concat(Object.keys(bgSubKeyWord).map(function (prop) {
	return bgSubKeyWord[prop];
}));

function getClearValue (value) {
	return value.replace(/\b(?:url|(?:rgb|hsl)a?)\([^()]+\)/i, '');
}

function hasMultipleBg (value) {
	return /,/.test(value);
}

function hasBgKeyWord (decl) {
	const prop = /^background(?:-(\w+))?$/i.exec(decl.prop);
	if (!prop) {
		return;
	}

	if (prop[1]) {
		const regexp = bgSubKeyWord[prop[1].toLowerCase()];
		return (regexp && regexp.test(decl.value)) || hasMultipleBg(getClearValue(decl.value));
	} else {
		const value = getClearValue(decl.value);
		return bgKeyWord.some(function (regexp) {
			return regexp.test(value);
		}) || hasMultipleBg(value);
	}
}

module.exports = hasBgKeyWord;
