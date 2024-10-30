const debug = require('debug')('video-voting-server');
const path = require('path');
const fs = require('fs');

const foodManager = require('./foodManager');

function getTablesContent() {
  const foodData = foodManager.getAttendeeData();
  const eventNames = foodData.eventNames;
  const attendees = foodData.attendees;
  let tableContent = '';
  for (let i = 0, count = eventNames.length; i < count; i += 1) {
    const eventName = eventNames[i];
    tableContent += '<div class="meal-table">';
    tableContent += `<h2>${eventName}</h2>`;
    tableContent += '<table><thread><tr><th>Attendee Name</th><th>Entree</th></tr></thread>';
    
    const attendeeCount = attendees.length;
    if (attendeeCount > 0) {
      tableContent += '<tbody>';
    }

    for (let j = 0; j < attendeeCount; j += 1) {
      const attendee = attendees[j];
      const entrees = attendee.entrees;
      let hasEntreeForMeal = false;
      for (let k = 0, entreeCount = entrees.length; k < entreeCount; k += 1) {
        const entree = entrees[k];
        if (entree.eventIndex === i) {
          hasEntreeForMeal = true;
          tableContent += '<tr>'
          tableContent += `<td>${attendee.name}</td>`;
          tableContent += `<td>${entree.content}</td>`;
          tableContent += '</tr>'
        }
      }
    }

    if (attendeeCount > 0) {
      tableContent += '</tbody>';
    }
    tableContent += '</table></div>';
  }

  return tableContent;
}

exports.showDashboard = async function showDashboard(serverIp, clientIp) {
  debug(`Show Dashboard\nServer IP:${serverIp}`);
  const htmlPath =
    path.join(global.appRoot, 'src', 'food_dashboard_content', 'food-dashboard-content.html');
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
  const eventNames = attendeeData.eventNames;
  scriptsContent = scriptsContent.split('/*EVENT-NAMES*/').join(JSON.stringify(eventNames));
  html = html.split('/*SCRIPTS-CONTENT*/').join(scriptsContent);
  html = html.split('/*TABLES-CONTENT*/').join(getTablesContent());
  return html;
};
