// Generated by CoffeeScript 2.4.1
(function() {
  var c, cliArguments, log, prepareProcess, startupmodule;

  startupmodule = {
    name: "startupmodule"
  };

  //region node_modules
  c = require("chalk");

  //endregion

  //log Switch
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["startupmodule"] != null) {
      console.log("[startupmodule]: " + arg);
    }
  };

  //region internal variables
  prepareProcess = null;

  cliArguments = null;

  //endregion

  //#initialization function  -> is automatically being called!  ONLY RELY ON DOM AND VARIABLES!! NO PLUGINS NO OHTER INITIALIZATIONS!!
  startupmodule.initialize = function() {
    log("startupmodule.initialize");
    prepareProcess = allModules.prepareprocessmodule;
    return cliArguments = allModules.cliargumentsmodule;
  };

  //region internal functions

  //endregion

  //region exposed functions
  startupmodule.cliStartup = async function() {
    var done, e, err;
    log("startupmodule.cliStartup");
    try {
      e = cliArguments.extractArguments();
      // console.log(chalk.yellow("caught arguments are: " + args._))
      done = (await prepareProcess.execute(e.keysDirectory, e.machineConfig, e.mode));
      if (done) {
        return console.log(c.green('All done!\n'));
      }
    } catch (error) {
      err = error;
      console.log(c.red('Error!'));
      console.log(err);
      return console.log("\n");
    }
  };

  //endregion exposed functions
  module.exports = startupmodule;

}).call(this);
