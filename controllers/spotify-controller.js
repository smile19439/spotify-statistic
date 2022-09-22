const axios = require('axios').default

const { User } = require('../models')

const spotifyController = {
  getHome: (req, res, next) => {
    res.render('home')
  },
  signIn: (req, res) => {
    res.redirect(`/user/${req.user.spotifyId}/statistics?time_range=short_term`)
  },
  getStatistic: async (req, res, next) => {
    try {
      const { userId } = req.params
      const { time_range } = req.query

      const user = await User.findOne({
        where: { spotifyId: userId },
        raw: true,
        nest: true
      })

      const requestOptions = {
        url: `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${time_range}`,
        headers: {
          'Authorization': 'Bearer ' + user.accessToken
        }
      }
      const topTracks = (await axios(requestOptions)).data.items
        .map((track, i) => ({
          index: i + 1,
          name: track.name,
          artist: track.artists.reduce((acc, cur) => acc + `,${cur.name}`, '').slice(1),
          album: track.album.name
        }))

      res.render('statistics', { user, topTracks, time_range })

    } catch (err) {
      next(err)
    }
  }
}

module.exports = spotifyController