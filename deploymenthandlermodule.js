// Generated by CoffeeScript 2.5.1
(function() {
  var CLI, Spinner, allDeployments, cfg, cloud, deploymentEntry, deploymenthandlermodule, keyModule, log;

  deploymenthandlermodule = {
    name: "deploymenthandlermodule"
  };

  //###########################################################
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["deploymenthandlermodule"] != null) {
      console.log("[deploymenthandlermodule]: " + arg);
    }
  };

  //###########################################################
  //region modulesFromEnvironment
  CLI = require('clui');

  Spinner = CLI.Spinner;

  //###########################################################
  keyModule = null;

  cloud = null;

  cfg = null;

  //endregion

  //###########################################################
  allDeployments = [];

  //###########################################################
  deploymenthandlermodule.initialize = function() {
    log("deploymenthandlermodule.initialize");
    keyModule = allModules.keymodule;
    cloud = allModules.cloudservicemodule;
    cfg = allModules.configmodule;
  };

  //###########################################################
  //region classes
  deploymentEntry = class deploymentEntry {
    constructor(repo1) {
      this.repo = repo1;
      return;
    }

    async establishKeyPairs() {
      var pair;
      pair = (await keyModule.getKeyPairForRepo(this.repo));
      this.pub = pair.pub;
      return this.priv = pair.priv;
    }

    //###########################################################
    async addKey() {
      var err;
      log("addKey on " + this.repo);
      if (!this.pub || !this.priv) {
        await this.establishKeyPairs();
      }
      try {
        await cloud.addDeployKey(this.repo, this.pub, cfg.name);
      } catch (error) {
        err = error;
        log("error on cloud creating deploy key! " + this.repo);
      }
    }

    //#TODO figure out when the error was 404
    async removeKey() {
      var err;
      log("removeKey on " + this.repo);
      keyModule.removeKeyPairForRepo(this.repo);
      try {
        await cloud.removeDeployKey(this.repo, cfg.name);
      } catch (error) {
        err = error;
        log("error on cloud removing deploy key! " + this.repo);
        log(err);
      }
    }

    //#TODO figure out when the error was 404
    async addWebhook() {
      var err;
      log("addWebhook on " + this.repo);
      try {
        await cloud.addWebhook(this.repo, cfg.webhookURL, cfg.webhookSecret);
      } catch (error) {
        err = error;
        log("error on cloud creating webhook! " + this.repo);
      }
    }

    //#TODO figure out when the error was 404
    async removeWebhook() {
      var err;
      log("removeWebhook on " + this.repo);
      try {
        await cloud.removeWebhook(this.repo, cfg.webhookURL);
      } catch (error) {
        err = error;
        log("error on cloud removing webhook! " + this.repo);
        log(err);
      }
    }

  };

  //endregion

  //###########################################################
  //region exposedFunctions
  //#TODO figure out when the error was 404
  deploymenthandlermodule.addDeploymentFor = function(repo) {
    var deployment;
    // log "deploymenthandlermodule.addDeploymentFor"
    deployment = new deploymentEntry(repo);
    return allDeployments.push(deployment);
  };

  //###########################################################
  deploymenthandlermodule.prepareMissingDeployments = async function() {
    var deployment, i, len, promises, status;
    log("deploymenthandlermodule.prepareMissingDeployments");
    promises = [];
    for (i = 0, len = allDeployments.length; i < len; i++) {
      deployment = allDeployments[i];
      promises.push(deployment.addKey());
      promises.push(deployment.addWebhook());
    }
    status = new Spinner('Adding missing webhooks and keys...');
    try {
      status.start();
      return (await Promise.all(promises));
    } finally {
      status.stop();
    }
  };

  deploymenthandlermodule.removeDeployments = async function() {
    var deployment, i, len, promises, status;
    log("deploymenthandlermodule.removeDeployments");
    promises = [];
    for (i = 0, len = allDeployments.length; i < len; i++) {
      deployment = allDeployments[i];
      promises.push(deployment.removeKey());
      promises.push(deployment.removeWebhook());
    }
    status = new Spinner('Removing webhooks and keys...');
    try {
      status.start();
      return (await Promise.all(promises));
    } finally {
      status.stop();
    }
  };

  deploymenthandlermodule.refreshDeployments = async function() {
    log("deploymenthandlermodule.refreshDeployments");
    await deploymenthandlermodule.removeDeployments();
    return (await deploymenthandlermodule.prepareMissingDeployments());
  };

  //endregion exposed functions
  module.exports = deploymenthandlermodule;

}).call(this);
