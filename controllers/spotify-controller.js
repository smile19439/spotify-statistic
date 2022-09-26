const axios = require('axios').default

// models
const { User } = require('../models')

// helpers
const { getSpotifyApiOptions, getPlaylistTracks } = require('../helpers/spotify-helper')

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

      const requestOptions = getSpotifyApiOptions(`me/top/tracks?limit=10&time_range=${time_range}`, user.accessToken)
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
  },
  getPlaylist: async (req, res, next) => {
    try {
      const { userId } = req.params

      if (userId !== req.user.spotifyId) throw new Error('只能管理自己的點歌本喔！')

      // 取得使用者在spotify的播放清單
      const requestOptions = getSpotifyApiOptions(`users/${req.user.spotifyId}/playlists`, req.user.accessToken)
      const playlists = (await axios(requestOptions)).data.items
        .map(playlist => ({
          id: playlist.id,
          name: playlist.name,
        }))

      // 檢查資料庫的playlist是否仍存在於spotify
      if (!playlists.some(playlist => playlist.id === req.user.playlist)) {
        req.user.playlist = null
        await User.update(
          { playlist: null },
          { where: { spotifyId: userId } }
        )
      }

      // 取得點歌本歌曲內容
      const tracks = await getPlaylistTracks(req.user.playlist, req.user.accessToken)

      res.render('playlist', { playlists, tracks })

    } catch (err) {
      next(err)
    }
  },
  postPlaylist: async (req, res, next) => {
    try {
      const { userId } = req.params
      const { playlist, name } = req.body

      if (userId !== req.user.spotifyId) throw new Error('只能建立自己的點歌本喔！')

      if (!playlist) {
        // 在spotify建立新播放清單
        const requestOptions = getSpotifyApiOptions(`users/${userId}/playlists`, req.user.accessToken)
        requestOptions.method = 'post'
        requestOptions.data = { name }

        const newPlaylist = (await axios(requestOptions)).data

        await User.update(
          { playlist: newPlaylist.id },
          { where: { spotifyId: userId } }
        )

      } else {
        await User.update(
          { playlist },
          { where: { spotifyId: userId } }
        )
      }

      res.redirect(`/user/${req.user.spotifyId}/playlist`)

    } catch (err) {
      next(err)
    }
  }
}

module.exports = spotifyController