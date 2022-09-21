const passport = require('passport')
const spotifyStrategy = require('passport-spotify').Strategy
const spotifyWebApi = require('spotify-web-api-js')
const spotifyApi = new spotifyWebApi()
const request = require('request')

const { User } = require('../models')

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, DOMAIN_NAME } = process.env

passport.use(new spotifyStrategy(
  {
    clientID: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    callbackURL: `http://${DOMAIN_NAME}/auth/spotify/callback`
  },
  (accessToken, refreshToken, expires_in, profile, done) => {
    const spotifyId = profile.id
    const name = profile.displayName
    const avatar = profile.photos[1]?.url

    spotifyApi.setAccessToken(accessToken)

    User.findOne({
      where: { spotifyId }
    })
      .then(user => {
        if (!user) {
          return User.create({
            name,
            avatar,
            spotifyId,
            accessToken,
            refreshToken
          })
        }

        return user.update({
          name,
          avatar,
          accessToken,
          refreshToken
        })
      })
      .then(user => done(null, user))
      .catch(err => done(err))
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      // 若spotify的token超過期限(3600秒)，需更新
      if (Date.now() - Date.parse(user.updatedAt) >= 3600) {
        const requestOptions = {
          url: 'https://accounts.spotify.com/api/token',
          headers: {
            'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
          },
          form: {
            grant_type: 'refresh_token',
            refresh_token: user.refreshToken
          },
          json: true
        }

        // 請求新token
        request.post(requestOptions, (err, res, body) => {
          if (!err && res.statusCode === 200) {
            const accessToken = body.access_token

            spotifyApi.setAccessToken(accessToken)
            // 更新資料庫
            user.update({
              accessToken
            })
              .then(user => done(null, user))
              .catch(err => done(err))
          }
        })
      } else {
        return done(null, user)
      }
    })
    .catch(err => done(err))
})

module.exports = passport
