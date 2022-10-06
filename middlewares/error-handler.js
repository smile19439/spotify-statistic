module.exports = {
  generateErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      req.flash('err_msg', `${err.name}: ${err.message}`)
    } else {
      req.flash('err_msg', `${err}`)
    }
    res.redirect('back')
  }
}