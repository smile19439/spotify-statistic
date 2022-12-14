const express = require('express')
const router = express.Router()
const passport = require('passport')

// middlewares
const { authenticated } = require('../middlewares/auth')
const { generateErrorHandler } = require('../middlewares/error-handler')

// routes
const user = require('./modules/user')
const playlist = require('./modules/playlist')

// controllers
const userController = require('../controllers/user-controller')
const playlistController = require('../controllers/playlist-controller')

// auth
router.get('/auth/spotify', passport.authenticate('spotify', {
  scope: [
    'user-top-read',
    'playlist-modify-private',
    'playlist-modify-public'
  ]
}))
router.get('/auth/spotify/callback', passport.authenticate('spotify', {
  failureFlash: true,
  failureRedirect: '/'
}), userController.signIn)

router.get('/logout', userController.logout)

// user
router.use('/user', authenticated, user)

// playlist (提供給其他人點歌，不需驗證登入)
router.use('/playlist', playlist)

// playlist頁面搜尋請求，不需驗證
router.get('/search', playlistController.searchTrack)

// home page
router.get('/', userController.getHome)

// err handler
router.use('/', generateErrorHandler)

module.exports = router
