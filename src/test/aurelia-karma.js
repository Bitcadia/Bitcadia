(function (global) {
  const karma = global.__karma__;
  const requirejs = global.requirejs;
  karma.loaded = function () {}; // make it async

  if (!karma || !requirejs) {
    return;
  }
  setTimeout(() => {
    require.config({
      "baseUrl": "base/scripts"
    });

    function requireTests() {
      const TEST_REGEXP = /\.(spec)\.js$/i;
      const allTestFiles = ['test/unit/setup'];

      Object.keys(global.__karma__.files).forEach(function (file) {
        if (TEST_REGEXP.test(file)) {
          allTestFiles.push(file.replace("/base/scripts/", "").slice(0, -3));
        }
      });

      global.require(allTestFiles, global.__karma__.start);
    }
    const sinon = global.sinon;
    define('sinon/sinon', () => sinon);
    require(["main"]).then(requireTests);
  }, 0)
})(window);
