const prompt = require('prompt');
// const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');

// Set prompt as green
// prompt.message = colors.green("Replace");

const LogError = (logger, msg) => logger.error(colors.red(`🗴 ${msg}`));
const LogSuccess = (logger, msg) => logger.info(colors.green(`✔ ${msg}`));
const LogInfo = (logger, msg) => logger.info(colors.white(`${msg}`));
const LogWarning = (logger, msg) => logger.info(colors.yellow(`${msg}`));

/*
 * Command function
 */

// path to created project directory
var projectPath, templatePath;

templatePath = path.join(__dirname, '..', 'templates/default');

module.exports = (args, options, logger) => {
  prompt.start();
  /*
   * Create a promise to use for prompt.get
   */
  const getprompt = (properties) => new Promise((resolve, reject) => {
    prompt.get(properties, (err, result) => resolve(result));
  });

  /*
   * Create a promise to use fs.mkdir
   */
  const mkdir = (projectPath, mode) => new Promise((resolve, reject) => {
    fs.mkdir(projectPath, mode, (err, result) => resolve(result));
  });

  // set up first prompt as a Promise
  new Promise(function (resolve, reject) {
    resolve(
      getprompt([
        // collect project name
        {
          name: 'dir',
          description: 'Enter target directory',
          default: './',
          required: true
        }])
    );
  }).then(
    (result) => {
      projectPath = prompt.history('dir').value + args.name;
      // No, exit. Yes. Create dir, run install.
      if (fs.existsSync(`${result.dir}`)) {
        LogInfo(logger, `Creating project directory ${projectPath}.`);
        if (fs.existsSync(projectPath)) {
          LogWarning(logger, `Directory ${projectPath} exists! Files will be overwritten!`);
        }
        return (
          // return a Promise
          getprompt([
            {
              name: 'continue',
              description: 'Continue?',
              default: 'Y',
              required: true
            }])
        );
      } else {
        LogError(logger, `${result.dir} does not exist`);
        process.exit(1);
      }
    },
    (err) => {
      LogError(logger, `\nExiting with error:\n${err}`);
      process.exit(1);
    }
  ).then(
    (result) => {
      if (result.continue != 'Y') {
        LogSuccess(logger, 'OK, exiting');
        process.exit(1);
      }
      return (
        // return a Promise
        mkdir(projectPath, 0755)
      );
      process.exit(1);
    }
  ).then(
    (result) => {
      console.log(projectPath);
      if (fs.existsSync(projectPath)) {
        LogInfo(logger, `Copying files to ${projectPath}`);
        process.exit(1);
        // 1. copy template files and create directories
        // 2. install npm packages
        // 3. evaluate - run `test`
      } else {
        LogError(logger, `Unable to create project directory ${projectPath}`);
        process.exit(1);
      }
    },
    (err) => {
      LogError(logger, `\nExiting with error:\n${err}`);
      process.exit(1);
    }
  );
};
