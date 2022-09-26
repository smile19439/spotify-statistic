const axios = require('axios').default

const getSpotifyApiOptions = (path, token) => ({
  url: `https://api.spotify.com/v1/${path}`,
  headers: {
    'Authorization': 'Bearer ' + token
  }
})

const getPlaylistTracks = async (id, token) => {
  if (!id) return null
  return (await axios(getSpotifyApiOptions(`playlists/${id}/tracks`, token))).data.items
    .map((item, i) => ({
      index: i + 1,
      name: item.track.name,
      artist: item.track.artists.reduce((acc, cur) => acc + `,${cur.name}`, '').slice(1),
      album: item.track.album.name
    }))
}

module.exports = {
  getSpotifyApiOptions,
  getPlaylistTracks
}