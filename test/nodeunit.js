var yaml = require("js-yaml"),
    fs = require("fs"),
    Compile = require("../src/compile.js").Compile,
    ReactiveTemplate = require("../src/compile.js").ReactiveTemplate,
    DOMSerializer = require("./DOMSerializer.js").DOMSerializer;

var testPath = "test/";
var tests = ['basic.yml', 'interpolation.yml', 'conditional.yml'];

tests.forEach(function(filename) {
  exports[filename] = function(test) {
    var testData = yaml.safeLoad(fs.readFileSync(testPath + filename).toString());
    test.expect(testData.tests.length);
    testData.tests.forEach(function(testCase) {
      var options = {document:  new DOMSerializer()};
      if (testCase.throws) {
        test.throws(function() {
          return (new ReactiveTemplate(Compile(testCase.template))).render(testCase.data || {}, options).toString()
        }, testCase.throws, testCase.name);
      } else {
        test.equal((new ReactiveTemplate(Compile(testCase.template))).render(testCase.data || {}, options).toString(), testCase.expected, testCase.name);
      }
    });
    test.done();
  };
});

