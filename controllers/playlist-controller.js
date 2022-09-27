const { User } = require('../models')
const { getPlaylistTracks } = require('../helpers/spotify-helper')

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
  }
}

module.exports = playlistController
