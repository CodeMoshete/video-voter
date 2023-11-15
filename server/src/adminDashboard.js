/* eslint-disable prefer-destructuring */
const debug = require('debug')('video-voting-server');
const path = require('path');
const fs = require('fs');
const votingManager = require('./votingManager');

const contentDir = 'admin_dashboard_content';

// https://docs.medal.tv/player.html
// https://docs.medal.tv/api#generate-an-api-key
// const searchUrl = 'https://developers.medal.tv/v1/search?userId=SeabassMcGills&text=TG23&limit=100';
// const medalApiKey = 'pub_ZvKksrJkRA5NDy7wkjpTnCRPVwdzboY1';
// const searchTerm = 'TG23';

exports.showDashboard = async function showDashboard(serverIp) {
  debug('Show Dashboard');
  const htmlPath =
    path.join(global.appRoot, 'src', contentDir, 'admin-dashboard-content.html');
  let html = fs.readFileSync(htmlPath).toString();

  const stylesPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-styles.css');
  let stylesContent = fs.readFileSync(stylesPath);
  stylesContent = stylesContent.toString().split('/*SERVER-ADDRESS*/').join(serverIp);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  const scriptsPath =
    path.join(global.appRoot, 'src', contentDir, 'admin-dashboard-scripts.js');
  let scriptsContent = fs.readFileSync(scriptsPath).toString();
  scriptsContent = scriptsContent.split('/*SERVER-ADDRESS*/').join(serverIp);
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);

  let currentVideoName = votingManager.getCurrentVideoName();
  const videoManifest = votingManager.getVideoManifest();
  if (videoManifest.length === 0) {
    return 'ERROR: Video manifest is empty!';
  }

  if (currentVideoName === '' || currentVideoName === undefined) {
    currentVideoName = videoManifest[0].name;
    votingManager.setCurrentVideo(currentVideoName);
  }

  debug(`Getting video named ${currentVideoName}`);
  const currentVideoMetadata = votingManager.getVideoManifestEntryByName(currentVideoName);

  html = html.split('/*TITLE-CONTENT*/').join(currentVideoMetadata.name);

  const videoContent = currentVideoMetadata.embed;
  html = html.split('/*VIDEO-CONTENT*/').join(videoContent);

  return html;
};
