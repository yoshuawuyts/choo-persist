const explain = require('explain-error')
const window = require('global/window')
const Idb = require('idb-wrapper')
const assert = require('assert')
const xtend = require('xtend')

module.exports = persist

// create a choo persistance plugin that stores stuff in indexedDB
// (obj?, fn(obj) -> null
function persist (opts, cb) {
  if (!cb) {
    cb = opts
    opts = {}
  }

  assert.equal(typeof opts, 'object', 'choo-persist: opts should be an object')
  assert.equal(typeof cb, 'function', 'choo-persist: cb should be an function')

  const name = opts.name || 'app'
  const filter = opts.filter || noop
  if (!window.indexedDB) return cb({})

  const db = new Idb({
    dbVersion: 1,
    storeName: name,
    keyPath: 'id',
    autoIncrement: false,
    onStoreReady: onStoreReady
  })

  function onStoreReady () {
    getState(db, function (err, state) {
      if (err) throw err
      cb({
        onStateChange: createStateChange(db, filter),
        wrapInitialState: function (appState) {
          return xtend(appState, state)
        }
      })
    })
  }
}

// persist stuff to the local database
// (obj) -> (obj, obj, obj, str, fn) -> null
function createStateChange (db, filter) {
  return function onStateChange (state, data, prev, caller, createSend) {
    if (filter) state = filter(state)
    setState(db, state, function (err) {
      if (err) {
        const send = createSend('choo-persist')
        send('error', err)
      }
    })
  }
}

// get the initial values from the database
// (obj, fn(err?, obj)) -> null
function getState (db, cb) {
  db.getAll(onSuccess, onError)

  function onSuccess (data) {
    var state = data[data.length - 1] || {}
    delete state.id
    delete state.location
    cb(null, state)
  }

  function onError (err) {
    const nwErr = explain(err, 'choo-persist: something went wrong accessing the database while starting up')
    cb(nwErr)
  }
}

// set values on the database
// (obj, obj, fn(err?, obj)) -> null
function setState (db, state, cb) {
  db.put(xtend(state), onSuccess, onError)

  function onSuccess () {
    cb()
  }

  function onError (err) {
    const newErr = explain(err, 'choo-persist: expected database write to be successful')
    cb(newErr)
  }
}

function noop () {}
