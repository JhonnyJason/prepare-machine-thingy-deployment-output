// Generated by CoffeeScript 2.5.1
(function() {
  var cfg, deploymentHandler, digestConfigFile, fs, github, log, pathHandler, prepareprocessmodule;

  prepareprocessmodule = {
    name: "prepareprocessmodule"
  };

  //###########################################################
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["prepareprocessmodule"] != null) {
      console.log("[prepareprocessmodule]: " + arg);
    }
  };

  //###########################################################
  //region modulesFromEnvironment
  //###########################################################
  fs = require("fs");

  //###########################################################
  //region localModules
  cfg = null;

  github = null;

  deploymentHandler = null;

  pathHandler = null;

  //endregion
  //endregion

  //###########################################################
  prepareprocessmodule.initialize = function() {
    log("prepareprocessmodule.initialize");
    cfg = allModules.configmodule;
    github = allModules.githubhandlermodule;
    deploymentHandler = allModules.deploymenthandlermodule;
    pathHandler = allModules.pathhandlermodule;
  };

  //###########################################################
  //region internalFunctions
  digestConfigFile = function() {
    var config, i, len, ref, requirePath, results, thingy;
    log("digestRepoListFile");
    requirePath = pathHandler.getConfigRequirePath();
    config = require(requirePath);
    cfg.ipAddress = config.ipAddress;
    cfg.name = config.name;
    cfg.webhookSecret = config.webhookSecret;
    cfg.webhookPort = config.webhookPort;
    cfg.generateURL();
    ref = config.thingies;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      thingy = ref[i];
      results.push(deploymentHandler.addDeploymentFor(thingy.repository));
    }
    return results;
  };

  //endregion

  //###########################################################
  //region exposedFunctions
  prepareprocessmodule.execute = async function(keysDirectory, configPath, mode) {
    log("prepareprocessmodule.execute");
    await cfg.checkUserConfig();
    await pathHandler.setKeysDirectory(keysDirectory);
    await pathHandler.setConfigFilePath(configPath);
    await digestConfigFile();
    switch (mode) {
      case "prepare":
        await deploymentHandler.prepareMissingDeployments();
        break;
      case "refresh":
        await deploymentHandler.refreshDeployments();
        break;
      case "remove":
        await deploymentHandler.removeDeployments();
    }
  };

  //endregion
  module.exports = prepareprocessmodule;

}).call(this);
