const debug = require('debug')('video-voting-server');
const express = require('express');
const util = require('util');
const foodManager = require('./foodManager');
const votingDashboard = require('./votingDashboard');
const foodDashboard = require('./foodDashboard')
const loginDashboard = require('./foodUserSelectionDashboard')
const accountDashboard = require('./foodAccountDashboard')
const adminDashboard = require('./adminDashboard');
const leaderboardDashboard = require('./leaderboardDashboard');

const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    const serverIp = req.headers.host.split(':')[0];
    const clientIp = req.connection.remoteAddress;
    const content = await foodDashboard.showDashboard(serverIp, clientIp);
    res.send(content);
  });


router.route('/login')
  .get(async (req, res) => {
    const serverIp = req.headers.host.split(':')[0];
    const clientIp = req.connection.remoteAddress;
    const content = await loginDashboard.showDashboard(serverIp, clientIp);
    res.send(content);
  });

router.route('/account')
  .get(async (req, res) => {
    const serverIp = req.headers.host.split(':')[0];
    const clientIp = req.connection.remoteAddress;
    const attendeeName = req.query.attendeeName;
    const content = await accountDashboard.showDashboard(serverIp, clientIp, attendeeName);
    res.send(content);
  });

router.route('/setAttendeeData')
  .post(async (req, res) => {
    debug(`Setting attendee data!\n${util.inspect(req.body)}`);
    const { attendeeName, entreeData } = req.body;
    const result = foodManager.setAttendeeData(attendeeName, entreeData);
    if (result === true) {
      res.sendStatus(200);
      return;
    }
    res.sendStatus(503);
  });

module.exports = router;
