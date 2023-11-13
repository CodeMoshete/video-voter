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

// function generateEntry(timestamp, amount) {
//   let html = '<div class="entryContainer">';
//   html += `<p class="entryName"><b>${timestamp}</b></p>`;
//   html += `<p class="entryText">${amount}</p>`;
//   html +=
//     '<button class="submitBtn" onclick="deleteEntry(' +
//     `'${timestamp}')">Delete</button>`;
//   html += '</div></br></br>';
//   return html;
// }

// function getContent(contentPath) {
//   let entriesHtml = '';
//   if (fs.existsSync(contentPath)) {
//     const entriesContent = JSON.parse(fs.readFileSync(contentPath));
//     const allEntriesKeys = Object.keys(entriesContent);
//     for (let i = 0, count = allEntriesKeys.length; i < count; i += 1) {
//       const timestampKey = allEntriesKeys[count - 1 - i];
//       entriesHtml += generateEntry(
//         timestampKey, entriesContent[timestampKey].amount
//       );
//     }
//   }
//   return entriesHtml;
// }

exports.showDashboard = async function showDashboard(serverIp) {
  debug('Show Dashboard');
  const htmlPath =
    path.join(global.appRoot, 'src', contentDir, 'admin-dashboard-content.html');
  let html = fs.readFileSync(htmlPath).toString();

  const stylesPath =
    path.join(global.appRoot, 'src', 'dashboard_content', 'dashboard-styles.css');
  const stylesContent = fs.readFileSync(stylesPath);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  const scriptsPath =
    path.join(global.appRoot, 'src', contentDir, 'admin-dashboard-scripts.js');
  let scriptsContent = fs.readFileSync(scriptsPath).toString();
  scriptsContent = scriptsContent.split('/*SERVER-ADDRESS*/').join(serverIp);
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);

  // const dateTime = new Date((new Date()).getTime());
  // const dateStr = dateTime.toLocaleDateString().split('/').join('-');
  // const feedFileName = `feeding-${dateStr}.json`;
  // const todaysFeedingsPath = path.join(global.appRoot, 'voting_data', feedFileName);
  // html = html.replace('/*ENTRIES-CONTENT*/', getContent(todaysFeedingsPath));

  let currentVideoName = votingManager.getCurrentVideoName();
  const videoManifest = votingManager.getVideoManifest();
  if (videoManifest.length === 0) {
    return 'ERROR: Video manifest is empty!';
  }

  if (currentVideoName === '') {
    currentVideoName = videoManifest[0].name;
    votingManager.setCurrentVideo(currentVideoName);
  }

  const currentVideoMetadata = votingManager.getVideoManifestEntryByName(currentVideoName);

  html = html.split('/*TITLE-CONTENT*/').join(currentVideoMetadata.name);

  const videoContent = currentVideoMetadata.embed;
  html = html.split('/*VIDEO-CONTENT*/').join(videoContent);

  return html;
};
