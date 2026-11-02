const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

router.get('/channel', youtubeController.getChannel);
router.get('/videos', youtubeController.getVideos);

module.exports = router;
