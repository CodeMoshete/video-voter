const debug = require('debug')('video-voting-server');
const express = require('express');
const util = require('util');
const votingManager = require('./votingManager');
const votingDashboard = require('./votingDashboard');
const adminDashboard = require('./adminDashboard');

const router = express.Router();

router.route('/logFeeding')
  .post(async (req, res) => {
    debug(`Logging Feeding!\n${util.inspect(req.body)}`);
    const { amount } = req.body;
    votingManager.logFeeding(amount);
    res.sendStatus(200);
  });

router.route('/removeEntry')
  .post(async (req, res) => {
    debug(`Removing voting entry!\n${util.inspect(req.body)}`);
    const { timestamp } = req.body;
    votingManager.removeEntry(timestamp);
    res.sendStatus(200);
  });

router.route('/')
  .get(async (req, res) => {
    const serverIp = req.headers.host.split(':')[0];
    const clientIp = req.connection.remoteAddress;
    const content = await votingDashboard.showDashboard(serverIp, clientIp);
    res.send(content);
  });

router.route('/admin')
  .get(async (req, res) => {
    const serverIp = req.headers.host.split(':')[0];
    const content = await adminDashboard.showDashboard(serverIp);
    res.send(content);
  });

module.exports = router;
