const axios = require('axios').default

const getSpotifyApiOptions = (path, token) => ({
  url: `https://api.spotify.com/v1/${path}`,
  headers: {
    'Authorization': 'Bearer ' + token
  }
})

const getPlaylistTracks = async (id, token, offset = 0) => {
  if (!id) return null

  const requestOption = getSpotifyApiOptions(`playlists/${id}/tracks?offset=${offset}`, token)
  const results = (await axios(requestOption)).data
  const total = results.total
  const tracks = results.items
    .map((item, i) => ({
      index: offset + i + 1,
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.reduce((acc, cur) => acc + `,${cur.name}`, '').slice(1),
      album: item.track.album.name
    }))

  return { total, tracks }
}

module.exports = {
  getSpotifyApiOptions,
  getPlaylistTracks
}