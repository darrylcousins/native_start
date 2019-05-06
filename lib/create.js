const prompt = require('prompt');
// const shell = require('shelljs');
const fs = require('fs');
const colors = require('colors/safe');

// Set prompt as green
// prompt.message = colors.green("Replace");

const LogError = (logger, msg) => logger.error(colors.red(`🗴 ${msg}`));
const LogSuccess = (logger, msg) => logger.info(colors.green(`✔ ${msg}`));
const LogInfo = (logger, msg) => logger.info(colors.grey(`${msg}`));

/*
 * Command function
 */

module.exports = (args, options, logger) => {

  prompt.start();
  /*
   * Create a promise to use for prompt.get
   */
  const getprompt = (properties) => new Promise((resolve, reject) => {
    prompt.get(properties, (err, result) => resolve(result));
  });

  // set up first prompt as a Promise
  new Promise(function(resolve, reject) {
    resolve(
      getprompt([
        // collect project name
        {
          name: 'name',
          description: 'Name your project',
          required: true
        }])
    );
  }).then(
    (result) => {
      LogSuccess(logger, `${result.name} chosen.`);
      // ask for confirmation to create dir in cwd and create project
      return (
        getprompt([
        {
          name: 'dir',
          description: 'Enter target directory',
          default: './',
          required: true
        }])
      )
    },
    (err) => {
      logger.info(err);
    }
  ).then(
    (result) => {
      // No, exit. Yes. Create dir, run install.
      if (fs.existsSync(`${result.dir}`)) {
        LogSuccess(logger, `Creating directory ${prompt.history('name').value}.`);
        return (
          getprompt([
          {
            name: 'next',
            description: 'Enter next prompt',
            default: 'Y',
            required: true
          }])
        )
      } else {
        LogError(logger, `${result.dir} does not exist`);
        process.exit(1);
      }
    },
    (err) => {
      logger.info(err);
    }
  ).then(
    (result) => {
      console.log(result);
      console.log(prompt.history('dir'));
      LogInfo(logger, `${result.next} Cool, got here`);
      process.exit(1);
    }
  );

}
