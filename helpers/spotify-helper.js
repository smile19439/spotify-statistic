const axios = require('axios').default
const qs = require('qs')

const getSpotifyApiOptions = (path, token) => ({
  url: `https://api.spotify.com/v1/${path}`,
  headers: {
    'Authorization': 'Bearer ' + token
  }
})

const getPlaylistTracks = async (id, token, offset = 0) => {
  if (!id) return null

  const axiosOption = getSpotifyApiOptions(`playlists/${id}/tracks?offset=${offset}`, token)
  const results = (await axios(axiosOption)).data
  const total = results.total
  const tracks = results.items
    .map((item, i) => ({
      index: offset + i + 1,
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.reduce((acc, cur) => acc + `,${cur.name}`, '').slice(1),
      album: item.track.album.name,
      albumCover: item.track.album.images[1]?.url
    }))

  return { total, tracks }
}

const isTokenExpired = updateTime => {
  return Date.now() - Date.parse(updateTime) >= 3600000 //目前 Spotify token 期限為3600秒(3600000毫秒)
}

const getNewAccessToken = async refreshToken => {
  const axiosOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  }

  return (await axios(axiosOptions)).data.access_token
}

module.exports = {
  getSpotifyApiOptions,
  getPlaylistTracks,
  isTokenExpired,
  getNewAccessToken
}