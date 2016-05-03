var fs = require('fs');

var test = require('tape');

var postcss = require('postcss');
var plugin = require('..');

function filename(name) {
  return 'test/' + name + '.css';
}

function read(name) {
  return fs.readFileSync(name, 'utf8');
}

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {};
  opts = opts || {};
  postcssOpts.from = filename('fixtures/' + name);
  var actual = postcss().use(plugin(opts)).process(read(postcssOpts.from), postcssOpts).css;

  var expected = read(filename('fixtures/' + name + '-out'));
  fs.writeFile(filename('fixtures/' + name + '-real'), actual);
  t.equal(actual.trim(), expected.trim(), msg || name);
}

test('add behavior', function(t) {
  compareFixtures(t, 'add-behavior', 'add behavior', {
    htcPath: '/PIE/build/PIE.htc',
    pieLoadPath: 'http://css3pie.com/pie',
  });
  t.end();
});

test('CSS3 Patterns Gallery', function(t) {
  compareFixtures(t, 'css3patterns', 'http://lea.verou.me/css3patterns/');
  t.end();
});

test('multiple background', function(t) {
  compareFixtures(t, 'multiple-bg', 'multiple background');
  t.end();
});

test('CSS3 background', function(t) {
  compareFixtures(t, 'css3background', 'CSS3 background');
  t.end();
});