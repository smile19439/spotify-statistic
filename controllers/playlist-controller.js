const axios = require('axios').default

const { User } = require('../models')
const { getSpotifyApiOptions, getPlaylistTracks } = require('../helpers/spotify-helper')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const playlistController = {
  getPlaylist: async (req, res, next) => {
    try {
      const { playlistId } = req.params
      const { page } = req.query

      if (page && (page < 1 || Number(page) !== Math.floor(page))) throw new Error('請勿輸入非正常頁數數字！')

      const user = await User.findOne({
        where: { playlist: playlistId },
        raw: true,
        nest: true
      })

      if (!user) throw new Error('此點歌本不存在，請重新確認網址喔！')

      const offset = getOffset(100, page)
      const { total, tracks } = await getPlaylistTracks(playlistId, user.accessToken, offset)
      const pagination = getPagination(total, 100, page)

      res.render('playlist', { user, tracks, pagination })
    }
    catch (err) {
      next(err)
    }
  },
  postToPlaylist: async (req, res, next) => {
    try {
      const { playlistId } = req.params
      const { track } = req.body

      if (!track) throw new Error('未勾選歌曲！')

      let uris
      // 使用者勾選單項會傳入string
      if (typeof track === 'string') {
        uris = `spotify:track:${track}`
      } else {
        uris = track.reduce((acc, cur) => acc += `,spotify:track:${cur}`, '').slice(1)
      }

      const user = await User.findOne({
        where: { playlist: playlistId },
        raw: true,
        nest: true
      })

      // 將歌曲加入spotify播放清單
      const axiosOption = getSpotifyApiOptions(`playlists/${playlistId}/tracks?uris=${uris}`, user.accessToken)
      axiosOption.method = 'post'

      await axios(axiosOption)

      req.flash('success_msg', '成功加入歌單！')
      res.redirect(`/playlist/${playlistId}`)

    } catch (err) {
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

      const axiosOption = await getSpotifyApiOptions(`search?q=${encodeURI(q)}&type=track`, user.accessToken)
      const results = (await axios(axiosOption)).data.tracks.items.map(item => ({
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
