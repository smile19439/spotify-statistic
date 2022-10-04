const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:userId/statistics', userController.getStatistic)
router.get('/:userId/playlist', userController.getPlaylist)
router.post('/:userId/playlist', userController.postPlaylist)
router.delete('/:userId/playlist', userController.deletePlaylist)
router.delete('/:userId/playlist/:trackId', userController.deleteTrack)

module.exports = router