const express = require('express')
const router = express.Router()
const passport = require('passport')

// middlewares
const { authenticated } = require('../middlewares/auth')

// routes
const user = require('./modules/user')
const playlist = require('./modules/playlist')

// controllers
const spotifyController = require('../controllers/spotify-controller')

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
}), spotifyController.signIn)

// user
router.use('/user', authenticated, user)

// playlist (提供給其他人點歌，不需驗證登入)
router.use('/playlist', playlist)

// home page
router.get('/', spotifyController.getHome)

module.exports = router
