var mutate = require('xtend/mutable')

module.exports = persist

function persist (opts) {
  opts = opts || {}

  var name = opts.name || 'choo-perist'
  var filter = opts.filter

  return function (state, bus) {
    var savedState = JSON.parse(window.localStorage.getItem(name))
    mutate(state, savedState)

    bus.on('*', function (eventName, data) {
      var savedState = filter ? filter(state) : state
      window.localStorage.setItem(name, JSON.stringify(savedState))
    })

    bus.on('clear', function () {
      window.localStorage.setItem(name, '{}')
      bus.emit('log:warn', 'Wiping localStorage')
    })
  }
}
