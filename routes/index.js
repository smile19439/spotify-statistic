const express = require('express')
const router = express.Router()
const passport = require('passport')

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

// home page
router.get('/', spotifyController.getHome)

module.exports = router
