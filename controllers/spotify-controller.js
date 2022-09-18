const spotifyController = {
  getHome: (req, res, next) => {
    res.render('home')
  }
}

module.exports = spotifyController