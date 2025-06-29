const debug = require('debug')('video-voting-server');
const path = require('path');
const fs = require('fs');

const foodManager = require('./foodManager');

function getOptionsContent() {
  let optionsContent = '';
  const attendeeData = foodManager.getAttendeeData();
  for (let i = 0, count = attendeeData.attendees.length; i < count; i += 1) {
    optionsContent += `<option value="">${attendeeData.attendees[i].name}</option>`;
  }
  return optionsContent;
}

exports.showDashboard = async function showDashboard(serverIp, clientIp) {
  debug(`Show Dashboard\nServer IP:${serverIp}`);
  const htmlPath =
    path.join(global.appRoot, 'src', 'food_dashboard_content', 'food-user-selection.html');
  let html = fs.readFileSync(htmlPath).toString();

  const stylesPath =
    path.join(global.appRoot, 'src', 'food_dashboard_content', 'food-dashboard-styles-summer.css');
  let stylesContent = fs.readFileSync(stylesPath);
  stylesContent = stylesContent.toString().split('/*SERVER-ADDRESS*/').join(serverIp);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  const scriptsPath =
    path.join(global.appRoot, 'src', 'food_dashboard_content', 'food-dashboard-scripts.js');
  let scriptsContent = fs.readFileSync(scriptsPath).toString();
  scriptsContent = scriptsContent.split('/*SERVER-ADDRESS*/').join(serverIp);
  scriptsContent = scriptsContent.split('/*CLIENT-NAME*/').join(clientIp);
  const attendeeData = foodManager.getAttendeeData();
  const eventNames = attendeeData.eventNames;
  scriptsContent = scriptsContent.split('/*EVENT-NAMES*/').join(JSON.stringify(eventNames));
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);
  html = html.split('/*OPTIONS-CONTENT*/').join(getOptionsContent());
  return html;
};
