const passport = require('passport')
const spotifyStrategy = require('passport-spotify').Strategy
const axios = require('axios').default
const qs = require('qs')

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
      .then(user => done(null, user.toJSON()))
      .catch(err => done(err))
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)

    // 若spotify的token超過期限(3600秒 = 3600000毫秒)，需更新
    if (Date.now() - Date.parse(user.updatedAt) >= 3600000) {
      // 請求新token，並更新資料庫
      const requestOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken
        })
      }

      user.accessToken = (await axios(requestOptions)).data.access_token
      await user.save()
    }

    return done(null, user.toJSON())

  } catch (err) {
    done(err)
  }
})

module.exports = passport
