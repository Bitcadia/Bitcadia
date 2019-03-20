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
    window["define"]("text", () => {
      return {
        load: (module, require, onload) => {
          return require([module]).then(onload);
        }
      };
    });
    /*     const originalDefine = global.define;
        global.define = function (name, deps, m) {
          var aliasName = requirejs.contexts._.config.map["*"][name];
          originalDefine(name, deps, m);
          aliasName && originalDefine(aliasName, [name], (m) => m);
        };
        global.define.amd = originalDefine.amd; */
    require(["process"], (process) => {
      global["global"] = global;
      global["process"] = process;
    }).then(requireTests);
  }, 0)
})(window);
