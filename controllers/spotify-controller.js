const spotifyController = {
  getHome: (req, res, next) => {
    res.render('home')
  },
  signIn: (req, res) => {
    res.redirect(`/user/${req.user.spotifyId}/statistics/short_term`)
  }
}

module.exports = spotifyController