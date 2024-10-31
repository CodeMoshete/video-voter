/* eslint-disable prefer-destructuring */
const fs = require('fs');
const debug = require('debug')('video-voting-server');
const path = require('path');
const chalk = require('chalk');

const rootFolderPath = path.resolve(`${__dirname}/..`);
const dataPath = `${rootFolderPath}/food_data`;
const manifestFilePath = `${dataPath}/food_manifest.json`;

function loadFoodManifest() {
  debug(chalk.cyan(`Loading manifest file: ${manifestFilePath}`));
  return JSON.parse(fs.readFileSync(manifestFilePath));
}

function saveManifestJson(jsonObj) {
  fs.writeFileSync(manifestFilePath, JSON.stringify(jsonObj, null, 2));
  debug(chalk.cyan(`Saved manifest file to: ${manifestFilePath}`));
}

exports.setAttendeeData = function setAttendeeData(attendeeName, entreeData) {
  const foodManifest = loadFoodManifest();
  const manifestEntry = {
    name: attendeeName,
    entrees: entreeData
  };

  let foundExistingAttendee = false;
  for (let i = 0, count = foodManifest.attendees.length; i < count; i += 1) {
    const attendeeManifestData = foodManifest.attendees[i];
    // debug(`Compare ${attendeeManifestData.name} to ${attendeeName}`);
    if (attendeeManifestData.name === attendeeName) {
      // debug(`Found ${attendeeName}`);
      foundExistingAttendee = true;
      foodManifest.attendees[i] = manifestEntry;
      break;
    }
  }

  if (!foundExistingAttendee) {
    debug(`Adding new manifest entry for ${attendeeName}`);
    foodManifest.attendees.push(manifestEntry);
  }

  debug(`Manifest data:\n${JSON.stringify(foodManifest, null, 2)}`);
  saveManifestJson(foodManifest);
  return true;
};

exports.getAttendeeData = function getAttendeeData() {
  return JSON.parse(fs.readFileSync(manifestFilePath));
};
