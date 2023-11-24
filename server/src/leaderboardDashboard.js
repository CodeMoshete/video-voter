/* eslint-disable linebreak-style */
const debug = require('debug')('video-voting-server');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const votingManager = require('./votingManager');

exports.showDashboard = async function showDashboard(serverIp) {
  debug(`Show Dashboard\nServer IP:${serverIp}`);
  const htmlPath =
    path.join(global.appRoot, 'src', 'leaderboard_dashboard_content', 'leaderboard-dashboard-content.html');
  let html = fs.readFileSync(htmlPath).toString();

  const stylesPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-styles.css');
  let stylesContent = fs.readFileSync(stylesPath);
  stylesContent = stylesContent.toString().split('/*SERVER-ADDRESS*/').join(serverIp);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  let currentVideoContent = '';
  const votes = votingManager.getVotes();
  const videoNames = Object.keys(votes);
  const leaderboard = [];
  for (let i = 0, count = videoNames.length; i < count; i += 1) {
    const videoVotes = votes[videoNames[i]];
    leaderboard.push({
      name: videoNames[i],
      score: videoVotes.overallScore
    });
  }

  // Sort the clips list alphabetically.
  leaderboard.sort((a, b) => {
    if (a.score && b.score) {
      if (a.score > b.score) {
        return -1;
      }
      if (a.score < b.score) {
        return 1;
      }
      return 0;
      // return a.score.localeCompare(b.score);
    }
    debug(chalk.red(`INVALID VOTING ENTRY:\nA: ${JSON.stringify(a, null, 2)}\nB: ${JSON.stringify(b, null, 2)}`));
    return 0;
  });

  for (let i = 0, count = leaderboard.length; i < count; i += 1) {
    currentVideoContent += '  <div id="inputContainer" class="inputContainer">';
    currentVideoContent += '    <div>';
    currentVideoContent += `      <span class="border2">${i + 1}. ${leaderboard[i].name}</span></br>`;
    currentVideoContent += `      <span class="border3">Overall Score: ${leaderboard[i].score}</span></br>`;
    currentVideoContent += '    </div>';
    currentVideoContent += '  </div></br></br>';
  }

  html = html.split('/*LEADERBOARD-CONTENT*/').join(currentVideoContent);

  return html;
};
