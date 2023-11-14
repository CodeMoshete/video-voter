/* eslint-disable prefer-destructuring */
const fs = require('fs');
const debug = require('debug')('video-voting-server');
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');

const voteFileName = 'votes.json';
const rootFolderPath = path.resolve(`${__dirname}/..`);
const dataPath = `${rootFolderPath}/voting_data`;
const currentVideoFilePath = `${dataPath}/current_video.json`;
const manifestFilePath = `${dataPath}/manifest.json`;

function checkDataPathExists() {
  // Create the output directory if it doesn't already exist.
  if (!fs.existsSync(dataPath)) {
    debug(`Creating missing directory: ${dataPath}`);
    fs.mkdirSync(dataPath, { recursive: true });
  }
}

exports.logVote = function submitVote(userName, clipName, vote) {
  debug(`Log vote for ${clipName}: ${vote}`);
  const numericalAmount = parseFloat(vote);
  if (Number.isNaN(numericalAmount) || numericalAmount <= 0) {
    debug(chalk.red(`[ERROR]: Invalid vote detected: ${vote}.`));
    return;
  }

  checkDataPathExists();

  const feedFilePath = path.join(dataPath, voteFileName);
  let messagesContent = {};
  if (fs.existsSync(feedFilePath)) {
    messagesContent = JSON.parse(fs.readFileSync(feedFilePath));
  }

  if (messagesContent[clipName] === undefined) {
    messagesContent[clipName] = {
      votes: [],
      overallScore: 0
    };
  }

  const clipVoteData = messagesContent[clipName];
  let userVote;
  for (let i = 0, count = clipVoteData.votes.length; i < count; i += 1) {
    const voteEntry = clipVoteData.votes[i];
    if (voteEntry.userName === userName) {
      // Update a user's previous vote.
      userVote = voteEntry;
      userVote.vote = vote;
      break;
    }
  }

  if (userVote === undefined) {
    // This is the first time this user has voted.
    userVote = {
      userName,
      vote
    };
    clipVoteData.votes.push(userVote);
  }

  let overallScore = 0;
  const numVotes = clipVoteData.votes.length;
  for (let i = 0; i < numVotes; i += 1) {
    overallScore += clipVoteData.votes[i].vote;
  }
  overallScore /= numVotes;
  clipVoteData.overallScore = overallScore;
  debug(`New average score for ${clipName}: ${overallScore}`);

  fs.writeFileSync(feedFilePath, JSON.stringify(messagesContent, null, 2));
};

exports.getVideoManifest = function getVideoManifest() {
  checkDataPathExists();
  let manifestContent = [];
  if (fs.existsSync(manifestFilePath)) {
    manifestContent = JSON.parse(fs.readFileSync(manifestFilePath));
  }
  return manifestContent;
};

exports.generateManifest = async function generateManifest() {
  // https://docs.medal.tv/player.html
  // https://docs.medal.tv/api#generate-an-api-key
  const searchUrl = 'https://developers.medal.tv/v1/search?userId=SeabassMcGills&text=TG23&limit=100';
  const headers = {
    Authorization: 'pub_ZvKksrJkRA5NDy7wkjpTnCRPVwdzboY1'
  };

  const manifest = [];

  // Request clips from Medal.
  await axios.get(searchUrl, { headers })
    .then((response) => {
      // handle success
      // debug(JSON.stringify(response.data, null, 2));
      const rawClipsList = response.data.contentObjects;
      debug(`Successfully found ${rawClipsList.length} clips.`);
      for (let i = 0, count = rawClipsList.length; i < count; i += 1) {
        const clip = rawClipsList[i];
        const manifestEntry = {
          name: clip.contentTitle,
          embed: clip.embedIframeCode.replace("width='640' height='360'", "width='1024' height='576'"),
          link: clip.directClipUrl
        };
        manifest.push(manifestEntry);
      }

      // Sort the clips list alphabetically.
      manifest.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        debug(chalk.red(`INVALID MANIFEST ENTRY:\nA: ${JSON.stringify(a, null, 2)}\nB: ${JSON.stringify(b, null, 2)}`));
        return 0;
      });

      // Write the results manifest to file.
      checkDataPathExists();
      fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2), { recursive: true });
      debug(`Saved data for ${manifest.length} clips.`);
    })
    .catch((error) => {
      // handle error
      debug(error);
    });
};

exports.getCurrentVideoName = function getCurrentVideoName() {
  checkDataPathExists();
  if (fs.existsSync(currentVideoFilePath)) {
    const currentVideo = JSON.parse(fs.readFileSync(currentVideoFilePath)).name;
    return currentVideo;
  }
  return '';
};

exports.getVideoManifestEntryByName = function getVideoManifestEntryByName(name) {
  const videoManifest = this.getVideoManifest();
  const manifestLen = videoManifest.length;

  let nextVideo;
  for (let i = 0; i < manifestLen; i += 1) {
    if (videoManifest[i].name === name) {
      nextVideo = videoManifest[i];
      break;
    }
  }

  return nextVideo;
};

exports.setCurrentVideo = function setCurrentVideo(newVideoName) {
  debug(`Setting next video to "${newVideoName}"`);
  checkDataPathExists();
  const newVideoEntry = this.getVideoManifestEntryByName(newVideoName);
  fs.writeFileSync(currentVideoFilePath, JSON.stringify(newVideoEntry));
};

exports.goToNextVideo = function goToNextVideo() {
  const videoManifest = this.getVideoManifest();
  const manifestLen = videoManifest.length;
  const currentVideo = this.getCurrentVideoName();

  // If the current video hasn't been set yet.
  if (currentVideo === '' && manifestLen > 0) {
    this.setCurrentVideo(videoManifest[0].name);
    return;
  }

  // Set to next video in manifest or wrap around.
  let nextVideo;
  for (let i = 0; i < manifestLen; i += 1) {
    if (videoManifest[i].name === currentVideo) {
      if (i < manifestLen - 1) {
        nextVideo = videoManifest[i + 1];
        break;
      } else {
        nextVideo = videoManifest[0];
        break;
      }
    }
  }

  if (nextVideo !== undefined) {
    debug(chalk.magenta(`Setting new video to ${nextVideo.name}`));
    this.setCurrentVideo(nextVideo.name);
  } else {
    debug(chalk.red('ERROR: Next video is undefined!'));
  }
};

exports.goToPrevVideo = function goToPrevVideo() {
  const videoManifest = this.getVideoManifest();
  const manifestLen = videoManifest.length;
  const currentVideo = this.getCurrentVideoName();

  // If the current video hasn't been set yet.
  if (currentVideo === '' && manifestLen > 0) {
    this.setCurrentVideo(videoManifest[0].name);
    return;
  }

  // Set to next video in manifest or wrap around.
  let nextVideo;
  for (let i = 0; i < manifestLen; i += 1) {
    if (videoManifest[i].name === currentVideo) {
      if (i > 0) {
        nextVideo = videoManifest[i - 1];
        break;
      } else {
        nextVideo = videoManifest[manifestLen - 1];
        break;
      }
    }
  }

  if (nextVideo !== undefined) {
    debug(chalk.magenta(`Setting new video to ${nextVideo.name}`));
    this.setCurrentVideo(nextVideo.name);
  } else {
    debug(chalk.red('ERROR: Prev video is undefined!'));
  }
};
