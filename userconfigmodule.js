// Generated by CoffeeScript 2.5.1
(function() {
  var CLI, Spinner, allServices, cfg, chalk, cloud, crypt, decryptAllServices, encryptAllServices, ensureConfigPathsExist, fileWrite, fs, getDefaultUserConfig, inquireServiceProperties, log, olog, ostr, pathHandler, printError, recipeExists, saveIndexesForServices, selectServiceDecision, serviceExists, thingyRecipes, topLevelDecision, user, userAction, userConfigIsAcceptable, userPwd, userconfigmodule;

  userconfigmodule = {
    name: "userconfigmodule"
  };

  //region modulesFromEnvironment
  //region node_modules
  fs = require("fs-extra");

  CLI = require('clui');

  Spinner = CLI.Spinner;

  chalk = require("chalk");

  //endregion

  //region localModules
  cfg = null;

  user = null;

  cloud = null;

  crypt = null;

  userAction = null;

  pathHandler = null;

  //endregion
  //endregion

  //region logPrintFunctions
  log = function(arg) {
    if (allModules.debugmodule.modulesToDebug["userconfigmodule"] != null) {
      console.log("[userconfigmodule]: " + arg);
    }
  };

  olog = function(o) {
    return log("\n" + ostr(o));
  };

  ostr = function(o) {
    return JSON.stringify(o, null, 4);
  };

  printError = function(arg) {
    return console.log(chalk.red(arg));
  };

  //endregion
  //#############################################################################
  userconfigmodule.initialize = function() {
    log("userconfigmodule.initialize");
    cfg = allModules.configmodule;
    user = allModules.userinquirermodule;
    cloud = allModules.cloudservicemodule;
    crypt = allModules.encryptionmodule;
    userAction = allModules.useractionmodule;
    pathHandler = allModules.pathhandlermodule;
  };

  
  //region internalProperties
  thingyRecipes = null;

  allServices = null;

  userPwd = "";

  //endregion

  //region internalFunctions
  getDefaultUserConfig = function() {
    log("getDefaultUserConfig");
    return {
      developerName: "",
      defaultThingyRoot: "~/thingies",
      recipesPath: "~/.config/thingyBubble/recipes",
      temporaryFiles: "~/.config/thingyBubble/temporaryFiles",
      thingyCloudServices: null,
      thingyRecipes: {}
    };
  };

  ensureConfigPathsExist = async function() {
    log("ensureConfigPathsExist");
    if (!cfg.userConfig.defaultThingyRoot) {
      cfg.userConfig.defaultThingyRoot = "~/thingies";
    }
    await pathHandler.ensureDirectoryExists(cfg.userConfig.defaultThingyRoot);
    if (!cfg.userConfig.temporaryFiles) {
      cfg.userConfig.temporaryFiles = "~/.config/thingyBubble/temporaryFiles";
    }
    await pathHandler.ensureDirectoryExists(cfg.userConfig.temporaryFiles);
    if (!cfg.userConfig.recipesPath) {
      cfg.userConfig.recipesPath = "~/.config/thingyBubble/recipes";
    }
    await pathHandler.ensureDirectoryExists(cfg.userConfig.recipesPath);
  };

  saveIndexesForServices = function() {
    var i, j, len, s;
    log("saveIndexesForServices");
    for (i = j = 0, len = allServices.length; j < len; i = ++j) {
      s = allServices[i];
      //# TODO check if this is really reasonable to save the Indices
      s.index = i;
    }
  };

  //region checkUserConfigSupport
  userConfigIsAcceptable = function() {
    var masterService;
    log("userConfigIsAcceptable");
    masterService = allServices[0];
    if (masterService == null) {
      return false;
    }
    if (!masterService.isAccessible) {
      return false;
    }
    if (!recipeExists()) {
      return false;
    }
    return true;
  };

  serviceExists = function() {
    log("serviceExists");
    if (allServices[0] != null) {
      return true;
    }
    return false;
  };

  recipeExists = function() {
    var entriesNr;
    log("recipeExists");
    entriesNr = Object.entries(thingyRecipes).length;
    if (entriesNr === 0) {
      return false;
    }
    return true;
  };

  //endregion
  fileWrite = async function() {
    log("fileWrite");
    encryptAllServices();
    cfg.userConfig.thingyRecipes = thingyRecipes;
    await fs.writeFile(pathHandler.userConfigPath, ostr(cfg.userConfig));
  };

  //region userInteraction
  topLevelDecision = async function() {
    var actionChoices;
    log("topLevelDecision");
    actionChoices = [];
    //region addUserActionChoices §
    if (serviceExists()) {
      userAction.addServiceChoices(actionChoices);
    } else {
      userAction.addNewServiceChoice(actionChoices);
    }
    actionChoices.push("separator");
    if (recipeExists()) {
      userAction.addRecipeChoices(actionChoices);
    } else {
      userAction.addImportRecipeChoice(actionChoices);
    }
    actionChoices.push("separator");
    userAction.addEditDeveloperNameChoice(actionChoices);
    userAction.addPathEditChoices(actionChoices);
    actionChoices.push("separator");
    userAction.addChangePasswordAction(actionChoices);
    actionChoices.push("separator");
    if (userConfigIsAcceptable()) {
      userAction.addSkipChoice(actionChoices);
    }
    //endregion
    return (await user.inquireNextAction(actionChoices));
  };

  selectServiceDecision = async function() {
    var i, selectableOptions, service;
    log("selectServiceDecision");
    selectableOptions = (function() {
      var j, len, results;
      results = [];
      for (i = j = 0, len = allServices.length; j < len; i = ++j) {
        service = allServices[i];
        results.push(getHumanReadableIdentifier(service, i));
      }
      return results;
    })();
    return (await user.inquireCloudServiceSelect(selectableOptions));
  };

  inquireServiceProperties = async function(service) {
    var content, label, properties, results;
    log("inquireServiceProperties");
    properties = cloud.getUserAdjustableStringProperties(service);
    results = [];
    for (label in properties) {
      content = properties[label];
      results.push(service[label] = (await user.inquireString(label, content)));
    }
    return results;
  };

  //endregion

  //region encryption
  encryptAllServices = function() {
    var content, gibbrish, password;
    log("encryptAllServices");
    content = JSON.stringify(allServices);
    password = pathHandler.homedir + userPwd;
    gibbrish = crypt.encrypt(content, password);
    return cfg.userConfig.thingyCloudServices = gibbrish;
  };

  decryptAllServices = async function() {
    var content, decrypted, err, gibbrish, password, results;
    log("decryptAllServices");
    if (!cfg.userConfig.thingyCloudServices) {
      userPwd = (await user.inquirePassword("Create new password:"));
      allServices = [];
      encryptAllServices();
      return;
    }
    decrypted = false;
    gibbrish = cfg.userConfig.thingyCloudServices;
    password = pathHandler.homedir;
    try {
      content = crypt.decrypt(gibbrish, password);
      allServices = JSON.parse(content);
      decrypted = true;
    } catch (error) {
      err = error;
    }
    results = [];
    while (!decrypted) {
      userPwd = (await user.inquirePassword("Password:"));
      password = pathHandler.homedir + userPwd;
      try {
        content = crypt.decrypt(gibbrish, password);
        allServices = JSON.parse(content);
        results.push(decrypted = true);
      } catch (error) {
        err = error;
        results.push(printError("Wrong password!"));
      }
    }
    return results;
  };

  //endregion
  //endregion

  //region exposed
  userconfigmodule.checkProcess = async function(configure) {
    var promises, service, status, statusMessage;
    log("userconfigmodule.checkProcess");
    await decryptAllServices();
    thingyRecipes = cfg.userConfig.thingyRecipes;
    await ensureConfigPathsExist();
    pathHandler.prepareTemporaryFilesPath();
    pathHandler.prepareRecipesPath();
    //region checkCloudServices §
    promises = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = allServices.length; j < len; j++) {
        service = allServices[j];
        results.push(cloud.check(service));
      }
      return results;
    })();
    statusMessage = 'Checking access to cloudServices... ';
    status = new Spinner(statusMessage);
    status.start();
    try {
      await Promise.all(promises);
    } finally {
      status.stop();
    }
    //endregion
    await fileWrite();
    if (userConfigIsAcceptable() && !configure) {
      return;
    } else {
      await userconfigmodule.userConfigurationProcess();
    }
  };

  userconfigmodule.userConfigurationProcess = async function() {
    var action, err;
    log("userconfigmodule.userConfigurationProcess");
    if (cfg.userConfig == null) {
      cfg.userConfig = getDefaultUserConfig();
      await decryptAllServices();
      thingyRecipes = cfg.userConfig.thingyRecipes;
      await fileWrite();
    }
    while (true) {
      action = (await topLevelDecision());
      try {
        await userAction.doAction(action);
      } catch (error) {
        err = error;
        if (!err) {
          return;
        }
        log(err);
      }
    }
  };

  //region userConfigManipulations
  userconfigmodule.changePasswordProcess = async function() {
    var current, firstPassword, secondPassword;
    log("userconfigmodule.changePasswordProcess");
    current = cfg.userConfig.developerName;
    firstPassword = (await user.inquirePassword("new password"));
    secondPassword = (await user.inquirePassword("retype password"));
    if (firstPassword === secondPassword) {
      userPwd = firstPassword;
      await fileWrite();
    } else {
      printError("Passwords did not match!");
    }
  };

  userconfigmodule.editDeveloperName = async function() {
    var current, post;
    log("userconfigmodule.editDeveloperName");
    current = cfg.userConfig.developerName;
    post = (await user.inquireString("developerName", current));
    if (post === current) {
      return;
    }
    cfg.userConfig.developerName = post;
    await fileWrite();
  };

  //region serviceManipulation
  userconfigmodule.addCloudService = async function(service) {
    log("userconfigmodule.addCloudService");
    allServices.push(service);
    saveIndexesForServices();
    await inquireServiceProperties(service);
    await cloud.check(service);
    return (await fileWrite());
  };

  userconfigmodule.selectMasterCloudService = async function(index) {
    var service;
    log("userconfigmodule.selectMasterCloudService");
    service = allServices[index];
    allServices.splice(index, 1);
    allServices.unshift(service);
    saveIndexesForServices();
    return (await fileWrite());
  };

  userconfigmodule.editCloudService = async function(index) {
    var service;
    log("userconfigmodule.editCloudService");
    service = allServices[index];
    await inquireServiceProperties(service);
    await cloud.check(service);
    return (await fileWrite());
  };

  userconfigmodule.removeCloudService = async function(index) {
    log("userconfigmodule.removeCloudService");
    allServices.splice(index, 1);
    saveIndexesForServices();
    return (await fileWrite());
  };

  //endregion

  //region recipeManipulation
  userconfigmodule.addThingyRecipe = async function(type) {
    log("userconfigmodule.addThingyRecipe");
    thingyRecipes[type] = true;
    return (await fileWrite());
  };

  userconfigmodule.removeThingyRecipe = async function(type) {
    log("userconfigmodule.removeThingyRecipe");
    delete thingyRecipes[type];
    return (await fileWrite());
  };

  //endregion

  //region pathManipulation
  userconfigmodule.editRecipesPath = async function() {
    var current, post;
    log("userconfigmodule.editRecipesPath");
    current = cfg.userConfig.recipesPath;
    post = (await user.inquireString("recipesPath", current));
    if (post === current) {
      return;
    }
    cfg.userConfig.recipesPath = post;
    await fileWrite();
    await ensureConfigPathsExist();
  };

  userconfigmodule.editDefaultThingyRootPath = async function() {
    var current, post;
    log("userconfigmodule.editDefaultThingyRootPath");
    current = cfg.userConfig.defaultThingyRoot;
    post = (await user.inquireString("defaultThingyRoot", current));
    if (post === current) {
      return;
    }
    cfg.userConfig.defaultThingyRoot = post;
    await fileWrite();
    await ensureConfigPathsExist();
  };

  userconfigmodule.editTemporaryFilesPath = async function() {
    var current, post;
    log("userconfigmodule.editTemporaryFilesPath");
    current = cfg.userConfig.temporaryFiles;
    post = (await user.inquireString("temporaryFiles", current));
    if (post === current) {
      return;
    }
    cfg.userConfig.temporaryFiles = post;
    pathHandler.prepareTemporaryFilesPath();
    await fileWrite();
    await ensureConfigPathsExist();
  };

  //endregion
  //endregion

  //region exposedData
  userconfigmodule.getMasterService = function() {
    return allServices[0];
  };

  userconfigmodule.getAllServices = function() {
    return allServices;
  };

  userconfigmodule.getService = function(index) {
    return allServices[index];
  };

  userconfigmodule.getThingyRecipes = function() {
    return thingyRecipes;
  };

  //endregion
  //endregion
  module.exports = userconfigmodule;

}).call(this);