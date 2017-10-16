const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');

const USAGE = `
This script saves your Wikitude key to the necessary files in this project

Usage:
  node scripts/install-wikitude-key.js changeme

  WIKITUDE_KEY=changeme node scripts/install-wikitude-key.js

  echo changeme > wikitude.key && node scripts/install-wikitude-key.js
`;

const FILES = [
  'plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js',
  'platforms/android/platform_www/plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js',
  'platforms/ios/platform_www/plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js'
];

const PLACEHOLDER = 'ENTER-YOUR-KEY-HERE';

const args = require('yargs').argv;
const root = path.resolve(path.join(__dirname, '..'));

if (args.help) {
  return console.log(USAGE);
}

Promise
  .resolve()
  .then(installWikitudeKey)
  .catch(err => console.warn(chalk.red(err)));

async function installWikitudeKey() {

  const [ key, fileData ] = await Promise.all([
    await getWikitudeKey(),
    await readFiles().catch(err => {
      console.warn(chalk.yellow('Could not read Wikitude plugin files to insert the key; are you sure you ran `ionic cordova prepare`?'));
      throw err;
    })
  ]);

  for (let file in fileData) {

    const contents = fileData[file];

    if (contents.indexOf(key) >= 0) {
      console.log(`${chalk.magenta(path.relative(root, file))} ${chalk.green('already contains the key')}`);
    } else if (contents.indexOf(PLACEHOLDER) < 0) {
      throw new Error(`File "${path.relative(root, file)}" does not contain the expected placeholder text "${PLACEHOLDER}"`);
    } else {
      await fs.writeFile(file, contents.replace(PLACEHOLDER, key), 'utf8');
      console.log(`${chalk.magenta(path.relative(root, file))} ${chalk.green('key installed')}`);
    }
  };

  console.log(chalk.green('All good!'));
}

async function getWikitudeKey() {

  const key = args._[0] || process.env.WIKITUDE_KEY || await getWikitudeKeyFromFile();
  if (!key || !key.length) {
    throw new Error('A wikitude key must be given as the first argument, in the $WIKITUDE_KEY environment variable or in the wikitude.key file');
  }

  return key;
}

async function getWikitudeKeyFromFile() {
  return fs.readFile(path.join(root, 'wikitude.key'), 'utf8').catch(err => {
    if (err.code == 'ENOENT') {
      return;
    } else {
      throw err;
    }
  }).then(key => key.split(/\n/)[0].trim());
}

async function readFiles() {

  const fileContents = await Promise.all(FILES.map(file => {
    return fs.readFile(path.join(root, file), 'utf8');
  }));

  return _.reduce(FILES, (memo, file, i) => {
    memo[path.join(root, file)] = fileContents[i];
    return memo;
  }, {});
}
