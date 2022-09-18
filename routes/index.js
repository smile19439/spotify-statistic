const express = require('express')
const router = express.Router()

const spotifyController = require('../controllers/spotify-controller')

router.get('/', spotifyController.getHome)

module.exports = router
