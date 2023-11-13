const debug = require('debug')('video-voting-server');
const path = require('path');
const fs = require('fs');

const votingManager = require('./votingManager');

exports.showDashboard = async function showDashboard(serverIp, clientIp) {
  debug(`Show Dashboard\nServer IP:${serverIp}`);
  const htmlPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-content.html');
  let html = fs.readFileSync(htmlPath).toString();

  const stylesPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-styles.css');
  const stylesContent = fs.readFileSync(stylesPath);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  const scriptsPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-scripts.js');
  let scriptsContent = fs.readFileSync(scriptsPath).toString();
  scriptsContent = scriptsContent.split('/*SERVER-ADDRESS*/').join(serverIp);
  scriptsContent = scriptsContent.split('/*CLIENT-NAME*/').join(clientIp);
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);

  // const currentVideoFileName = 'current_video.json';
  // const dataPath = path.join(global.appRoot, 'voting_data');
  // const currentVideoFilePath = path.join(dataPath, currentVideoFileName);

  const currentVideoFileName = votingManager.getCurrentVideoName();

  let currentVideoContent = '';
  if (currentVideoFileName !== undefined) {
    // Populate video title and voting buttons.
    currentVideoContent += '<span class="border2">Current video:</span><br>';
    currentVideoContent += `<span id="videoName" class="border3">${currentVideoFileName}</span><br></br></br>`;

    currentVideoContent += '  <div id="inputContainer" class="inputContainer">';
    currentVideoContent += '    <div>';
    currentVideoContent += '      <span class="border2">Your Vote:</span></br>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">1</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">2</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">3</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">4</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">5</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">6</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">7</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">8</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">9</button>';
    currentVideoContent += '      <button class="voteBtn" onclick="submitGuestbookEntry()">10</button>';
    currentVideoContent += '    </div>';
    currentVideoContent += '  </div>';
  } else {
    // Populate "Please Wait" text.
    currentVideoContent += '<span class="border2">Please Wait! Voting will begin soon!</span><br>';
  }

  html = html.split('/*CURRENT-VIDEO-CONTENT*/').join(currentVideoContent);

  return html;
};
