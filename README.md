# choo-persist [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Synchronize [choo][choo] state with `localStorage`

## Usage
```js
var persist = require('choo-persist')
var choo = require('choo')

var app = choo()
app.use(persist())

```

## API
### `instance = persist([opts])`
Create a new `indexedDB` database instance, and call the callback with the
plugin when done. Can take an optional first argument of options:
- __opts.name:__ default `'app'`; provide a name for the indexedDB database
- __opts.filter(state):__ modify the state that's about to be written to the
  IndexedDB database. Useful to strip values that cannot be serialized to
  IndexedDB.

```js
var xtend = require('xtend')
var opts = {
  filter: function (state) {
    state = xtend(state) // clone the object
    delete state.sadArrayFilledWithFunctions
    return state
  }
}
```

## Installation
```sh
$ npm install choo-persist
```

## Should I use this while developing.
No; state is persisted between page reloads which might put your page in very
odd states, with a very annoying way to clear. Consider using hot reloading for
development instead.

## How / when should I invalidate the database cache?
Ah, this is where good ol' data persistance comes into play - there's loads of
approaches on this, but yeah you should def find a way to migrate data between
incompatible models. Perhaps some day we'll have a good chapter on this in the
choo handbook. Until then: have fun I guess?

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/choo-persist.svg?style=flat-square
[3]: https://npmjs.org/package/choo-persist
[4]: https://img.shields.io/travis/yoshuawuyts/choo-persist/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/choo-persist
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/choo-persist/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/choo-persist
[8]: http://img.shields.io/npm/dm/choo-persist.svg?style=flat-square
[9]: https://npmjs.org/package/choo-persist
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[caniuse]: http://caniuse.com/#feat=indexeddb
[mdn]: https://developer.mozilla.org/en/docs/Web/API/IndexedDB_API
[choo]: https://github.com/yoshuawuyts/choo
