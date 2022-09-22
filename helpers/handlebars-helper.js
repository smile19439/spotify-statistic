module.exports = {
  checkAvatar: avatar => avatar || '/images/default-avatar.png',
  ifCond: (a, b, options) => a === b ? options.fn(this) : options.inverse(this)
}