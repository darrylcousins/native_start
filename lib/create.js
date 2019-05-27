const prompt = require('prompt');
// const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const process = require('process');
const os = require('os');
const shell = require('shelljs');
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
var projectPath, templatePath, variables;

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
          description: 'Choose target directory',
          default: process.cwd(),
          required: true
        }])
    );
  }).then(
    (result) => {
      projectPath = path.join(prompt.history('dir').value, args.name);
      // No, exit. Yes. Create dir, run install.
      if (fs.existsSync(`${result.dir}`)) {
        LogWarning(logger, `Creating project directory ${projectPath}.`);
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
      if (fs.existsSync(projectPath)) {
        // 1. copy template files and create directories
        shell.cp('-R', `${templatePath}/*`, projectPath);
        LogSuccess(logger, 'Files copied');
        // 2. variables
        variables = require(`${templatePath}/_variables`);
        // Remove variables file from the current directory
        if (fs.existsSync(`${projectPath}/_variables.js`)) {
          shell.rm(`${projectPath}/_variables.js`);
        }
        // Remove existing node_modules directory
        if (fs.existsSync(`${projectPath}/node_modules`)) {
          shell.rmdir(`${projectPath}/node_modules`);
        }
        return (
          // return a Promise
          getprompt(variables)
        );
      } else {
        LogError(logger, `Unable to create project directory ${projectPath}`);
        process.exit(1);
      }
    },
    (err) => {
      LogError(logger, `Exiting with error:\n${err}`);
      process.exit(1);
    }
  ).then(
    (result) => {
      console.log(result);
      // 2b. Replace variables in files
      // Remove MIT License file if another is selected
      if (result.license !== 'MIT') {
        shell.rm(`${projectPath}/LICENSE`);
      }
      // replace string variables
      //shell.ls('-Rl', projectPath).forEach(entry => {
      shell.ls('-l', projectPath).forEach(entry => {
        if (entry.isFile()) {
          // Replace '[VARIABLE]` with the corresponding variable value from the prompt
          variables.forEach(variable => {
            shell.sed(
              '-i',
              `\\[${variable.name.toUpperCase()}\\]`,
              result[variable.name],
              path.join(projectPath, entry.name)
            );
          });
          // Insert current year in files
          shell.sed('-i', '\\[YEAR\\]', new Date().getFullYear(), entry.name);
        }
      });
      // 3. install npm packages
      process.chdir(projectPath);
      if (shell.exec('yarn install').code !== 0) {
          shell.echo('Error: Install commit failed');
          shell.exit(1);
      }
      // 4a. add babel eslint
      if (shell.exec('yarn add -D babel-eslint').code !== 0) {
          shell.echo('Error: Eslint init failed');
          shell.exit(1);
      }
      // 5. evaluate - run `test`
      if (shell.exec('npm test').code !== 0) {
          shell.echo('Error: Running tests failed');
          shell.exit(1);
      }
      process.exit(1);
    },
    (err) => {
      LogError(logger, `Exiting with error:\n${err}`);
      process.exit(1);
    }
  );
};
