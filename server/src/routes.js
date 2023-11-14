const debug = require('debug')('video-voting-server');
const express = require('express');
const util = require('util');
const votingManager = require('./votingManager');
const votingDashboard = require('./votingDashboard');
const adminDashboard = require('./adminDashboard');

const router = express.Router();

router.route('/logVote')
  .post(async (req, res) => {
    debug(`Logging vote!\n${util.inspect(req.body)}`);
    const { userName, videoName, vote } = req.body;
    votingManager.logVote(userName, videoName, vote);
    res.sendStatus(200);
  });

router.route('/removeEntry')
  .post(async (req, res) => {
    debug(`Removing voting entry!\n${util.inspect(req.body)}`);
    const { timestamp } = req.body;
    votingManager.removeEntry(timestamp);
    res.sendStatus(200);
  });

router.route('/generateManifest')
  .get(async (req, res) => {
    debug('Generating manifest');
    votingManager.generateManifest();
    res.sendStatus(200);
  });

router.route('/getCurrentVideoName')
  .get((req, res) => {
    const currentVideo = votingManager.getCurrentVideoName();
    res.send(currentVideo);
  });

router.route('/setCurrentVideo')
  .get((req, res) => {
    const newVideo = req.query.video;
    votingManager.getCurrentVideoName(newVideo);
    res.sendStatus(200);
  });

router.route('/goToNextVideo')
  .get((req, res) => {
    debug('Queue up next video');
    votingManager.goToNextVideo();
    res.sendStatus(200);
  });

router.route('/goToPrevVideo')
  .get((req, res) => {
    debug('Queue up previous video');
    votingManager.goToPrevVideo();
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
