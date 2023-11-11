const fs = require('fs');
const debug = require('debug')('video-voting-server');
const path = require('path');
const chalk = require('chalk');

exports.logFeeding = function logFeeding(feedingAmount) {
  debug(`Log feeding for ${feedingAmount} oz`);
  const numericalAmount = parseFloat(feedingAmount);
  if (numericalAmount.isNaN() || numericalAmount <= 0) {
    debug(chalk.red(`[ERROR]: Invalid entry detected: ${feedingAmount}.`));
    return;
  }

  const dateTime = new Date((new Date()).getTime());
  const dateStr = dateTime.toLocaleDateString().split('/').join('-');
  const feedFileName = `feeding-${dateStr}.json`;
  const dataPath = path.join(global.appRoot, 'voting_data');
  const feedFilePath = path.join(dataPath, feedFileName);
  let messagesContent = {};
  if (fs.existsSync(feedFilePath)) {
    messagesContent = JSON.parse(fs.readFileSync(feedFilePath));
  }
  messagesContent[dateTime.toLocaleTimeString()] = { amount: numericalAmount };

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
  }

  fs.writeFileSync(feedFilePath, JSON.stringify(messagesContent, null, 2));
};

exports.removeEntry = function approveEntry(timestamp) {
  const dateTime = new Date((new Date()).getTime());
  const dateStr = dateTime.toLocaleDateString().split('/').join('-');
  const feedFileName = `feeding-${dateStr}.json`;
  const dataPath = path.join(global.appRoot, 'voting_data');
  const feedFilePath = path.join(dataPath, feedFileName);

  let feedingContent = {};
  if (fs.existsSync(feedFilePath)) {
    feedingContent = JSON.parse(fs.readFileSync(feedFilePath));
    delete feedingContent[timestamp];
    fs.writeFileSync(feedFilePath, JSON.stringify(feedingContent, null, 2));
  }
};
