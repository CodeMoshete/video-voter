const debug = require('debug')('video-voting-server');
const path = require('path');
const fs = require('fs');

const foodManager = require('./foodManager');

function getMealsContent(attendeeName) {
  let optionsContent = '';
  const attendeeData = foodManager.getAttendeeData();
  debug(`AttendeeData:${JSON.stringify(attendeeData, null, 2)}`);
  for (let j = 0, mealCount = attendeeData.eventNames.length; j < mealCount; j += 1) {
    const eventName = attendeeData.eventNames[j];
    let eventContent = '';
    for (let i = 0, count = attendeeData.attendees.length; i < count; i += 1) {
      const { name } = attendeeData.attendees[i];
      if (name === attendeeName) {
        const { entrees } = attendeeData.attendees[i];
        for (let k = 0, entreeCount = entrees.length; k < entreeCount; k += 1) {
          const entree = entrees[k];
          debug(`Compare ${entree.eventIndex} to ${j}\n${JSON.stringify(entree, null, 2)}`);
          if (entree.eventIndex === j) {
            eventContent = entree.content;
          }
        }
      }
    }

    optionsContent += '<div class="meal-group">';
    optionsContent += `<label for="entree">${eventName}</label>`;
    optionsContent += `<input type="text" id="${eventName}" name="entree_breakfast"`;
    optionsContent += ` placeholder="Enter entrees here" value="${eventContent}">`;
    optionsContent += '</div>';
  }
  return optionsContent;
}

exports.showDashboard = async function showDashboard(serverIp, clientIp, attendeeName) {
  debug(`Show Dashboard\nServer IP:${serverIp}`);
  const htmlPath =
    path.join(global.appRoot, 'src', 'food_dashboard_content', 'food-account-content.html');
  let html = fs.readFileSync(htmlPath).toString();

  const stylesPath =
    path.join(global.appRoot, 'src', 'food_dashboard_content', 'food-dashboard-styles.css');
  let stylesContent = fs.readFileSync(stylesPath);
  stylesContent = stylesContent.toString().split('/*SERVER-ADDRESS*/').join(serverIp);
  html = html.split('/*STYLES-CONTENT*/').join(stylesContent);

  const scriptsPath =
    path.join(global.appRoot, 'src', 'food_dashboard_content', 'food-dashboard-scripts.js');
  let scriptsContent = fs.readFileSync(scriptsPath).toString();
  scriptsContent = scriptsContent.split('/*SERVER-ADDRESS*/').join(serverIp);
  scriptsContent = scriptsContent.split('/*CLIENT-NAME*/').join(clientIp);

  const attendeeData = foodManager.getAttendeeData();
  const { eventNames } = attendeeData;
  scriptsContent = scriptsContent.split('/*EVENT-NAMES*/').join(JSON.stringify(eventNames));

  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);
  html = html.split('/*NAME-CONTENT*/').join(attendeeName);
  html = html.split('/*MEALS-CONTENT*/').join(getMealsContent(attendeeName));
  return html;
};
