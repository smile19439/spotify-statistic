const passport = require('passport')
const spotifyStrategy = require('passport-spotify').Strategy

const { User } = require('../models')

const { isTokenExpired, getNewAccessToken } = require('../helpers/spotify-helper')

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
    const avatar = profile.photos[1]?.url || null

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

    // 若spotify的token超過期限，需更新
    if (isTokenExpired(user.updatedAt)) {
      // 請求新token，並更新資料庫
      user.accessToken = await getNewAccessToken(user.refreshToken)
      await user.save()
    }

    return done(null, user.toJSON())

  } catch (err) {
    done(err)
  }
})

module.exports = passport
