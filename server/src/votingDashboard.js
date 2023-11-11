const debug = require('debug')('video-voting-server');
const path = require('path');
const fs = require('fs');

function generateEntry(time, entry) {
  let html = '<div class="entryContainer">';
  html += `<p class="entryName"><b>${time}: ${entry.amount} oz.</b></p>`;
  html += '</div></br></br>';
  return html;
}

exports.showDashboard = async function showDashboard(serverIp, clientIp) {
  debug('Show Dashboard');
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
  scriptsContent = scriptsContent.split('/*CLIENT-ADDRESS*/').join(clientIp);
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);

  const dateTime = new Date((new Date()).getTime());
  const dateStr = dateTime.toLocaleDateString().split('/').join('-');
  const feedFileName = `feeding-${dateStr}.json`;
  const dataPath = path.join(global.appRoot, 'voting_data');
  const feedFilePath = path.join(dataPath, feedFileName);

  let entryContent = '';
  let entriesContent = {};
  if (fs.existsSync(feedFilePath)) {
    entriesContent = JSON.parse(fs.readFileSync(feedFilePath));
  }

  const allEntriesKeys = Object.keys(entriesContent);
  const numKeys = allEntriesKeys.length;
  const numEntiesToDisplay = Math.min(allEntriesKeys.length, 10);
  let amountFed = 0;
  for (let i = 0; i < numEntiesToDisplay; i += 1) {
    const feedingTime = allEntriesKeys[numKeys - 1 - i]; // Show in reverse...
    const feedingAmt = entriesContent[feedingTime];
    amountFed += entriesContent[feedingTime].amount;
    entryContent += generateEntry(feedingTime, feedingAmt);
  }

  const amountFedContent = `CURRENT AMOUNT FED TODAY: ${amountFed} oz.`;
  html = html.split('/*TODAYS-DATE*/').join(dateTime.toLocaleDateString());
  html = html.split('/*AMOUNT-FED*/').join(amountFedContent);
  html = html.split('/*ENTRIES-CONTENT*/').join(entryContent);

  return html;
};
