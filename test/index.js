function runTests (rdf) {
  require('./DatasetCore.test.js')(rdf)
}

if (global.rdf) {
  runTests(global.rdf)
}

module.exports = runTests
