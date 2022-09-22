const express = require('express')
const router = express.Router()

const spotifyController = require('../../controllers/spotify-controller')

router.get('/:userId/statistics', spotifyController.getStatistic)

module.exports = router