const express = require('express')
const router = express.Router()

const playlistController = require('../../controllers/playlist-controller')

router.get('/:playlistId', playlistController.getPlaylist)
router.post('/:playlistId', playlistController.postToPlaylist)

module.exports = router
