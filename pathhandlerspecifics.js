// Generated by CoffeeScript 2.5.1
(function() {
  var log, olog, ostr, pathhandlerspecifics, print;

  pathhandlerspecifics = {
    name: "pathhandlerspecifics"
  };

  //###########################################################
  //region logPrintFunctions
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["pathhandlerspecifics"] != null) {
      console.log("[pathhandlerspecifics]: " + arg);
    }
  };

  olog = function(o) {
    return log("\n" + ostr(o));
  };

  ostr = function(o) {
    return JSON.stringify(o, null, 4);
  };

  print = function(arg) {
    return console.log(arg);
  };

  //endregion

  //###########################################################
  //region exposed
  //region exposedProperties
  pathhandlerspecifics.keysDirectory = "I'm here";

  pathhandlerspecifics.configPath = "xD";

  //endregion
  pathhandlerspecifics.experiment = function() {
    log("pathhandlerspecifics.experiment");
    print("this.name");
    print(this.name);
    print("this.homedir");
    print(this.homedir);
    print("pathhandlerspecifics.homedir");
    print(pathhandlerspecifics.homedir);
    print("this.keysDirectory");
    print(this.keysDirectory);
    print("pathhandlerspecifics.keysDirectory");
    print(pathhandlerspecifics.keysDirectory);
  };

  //endregion
  module.exports = pathhandlerspecifics;

}).call(this);
