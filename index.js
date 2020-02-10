// Generated by CoffeeScript 2.5.1
(function() {
  var Modules, run;

  Modules = require("./allmodules.js");

  global.allModules = Modules;

  run = async function() {
    var m, n, promises;
    promises = (function() {
      var results;
      results = [];
      for (n in Modules) {
        m = Modules[n];
        results.push(m.initialize());
      }
      return results;
    })();
    await Promise.all(promises);
    Modules.startupmodule.cliStartup();
  };

  run();

}).call(this);
