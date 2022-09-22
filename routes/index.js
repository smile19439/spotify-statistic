const express = require('express')
const router = express.Router()
const passport = require('passport')

// middlewares
const { authenticated } = require('../middlewares/auth')

// routes
const user = require('./modules/user')

// controllers
const spotifyController = require('../controllers/spotify-controller')

// auth
router.get('/auth/spotify', passport.authenticate('spotify', {
  scope: [
    'user-top-read'
  ]
}))
router.get('/auth/spotify/callback', passport.authenticate('spotify', {
  failureFlash: true,
  failureRedirect: '/'
}),spotifyController.signIn)

// user
router.use('/user', authenticated, user)

// home page
router.get('/', spotifyController.getHome)

module.exports = router
