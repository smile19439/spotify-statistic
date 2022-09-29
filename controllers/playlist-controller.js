const axios = require('axios').default

const { User } = require('../models')
const { getSpotifyApiOptions, getPlaylistTracks } = require('../helpers/spotify-helper')

const playlistController = {
  getPlaylist: async (req, res, next) => {
    try {
      const { playlistId } = req.params

      const user = await User.findOne({
        where: { playlist: playlistId },
        raw: true,
        nest: true
      })

      if (!user) throw new Error('此點歌本不存在，請重新確認網址喔！')

      const tracks = await getPlaylistTracks(playlistId, user.accessToken)

      res.render('playlist', { user, tracks })
    }
    catch (err) {
      next(err)
    }
  },
  searchTrack: async (req, res, next) => {
    try {
      const { playlistId, q } = req.query
      const user = await User.findOne({
        playlistId,
        raw: true,
        nest: true
      })

      const requestOption = await getSpotifyApiOptions(`search?q=${encodeURI(q)}&type=track`, user.accessToken)
      const results = (await axios(requestOption)).data.tracks.items.map(item => ({
        id: item.id,
        name: item.name,
        artist: item.artists.reduce((acc, cur) => acc + `,${cur.name}`, '').slice(1),
        album: item.album.name,
        albumImage: item.album.images[1]?.url
      }))

      res.json(results)

    } catch (err) {
      next(err)
    }
  }
}

module.exports = playlistController
