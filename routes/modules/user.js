const express = require('express')
const router = express.Router()

const spotifyController = require('../../controllers/spotify-controller')

router.get('/:userId/statistics', spotifyController.getStatistic)
router.get('/:userId/playlist', spotifyController.getPlaylist)
router.post('/:userId/playlist', spotifyController.postPlaylist)

module.exports = router