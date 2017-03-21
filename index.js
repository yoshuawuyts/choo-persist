var mutate = require('xtend/mutable')

module.exports = persist

function persist (opts) {
  opts = opts || {}

  var name = opts.name || 'choo-persist'
  var filter = opts.filter

  return function (state, bus) {
    var savedState = null
    try {
      savedState = JSON.parse(window.localStorage.getItem(name))
    } catch (e) {
      savedState = {}
    }

    mutate(state, savedState)
    bus.on('*', listener)

    bus.on('clear', function () {
      bus.removeListener('*', listener)
      window.localStorage.removeItem(name)
      bus.emit('log:warn', 'Wiping localStorage ' + name)
    })

    function listener (eventName, data) {
      var savedState = filter ? filter(state) : state
      window.localStorage.setItem(name, JSON.stringify(savedState))
    }
  }
}
