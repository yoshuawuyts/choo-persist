const html = require('choo/html')
const persist = require('./')
const choo = require('choo')

const app = choo()

app.model({
  state: {
    count: 0
  },
  reducers: {
    increment: (action, state) => ({ count: state.count + 1 })
  }
})

app.router(['/', (state, prev, send) => html`
  <main>
    <h1>${state.count}</h1>
    <button onclick=${() => send('increment')}>+1</button>
  </main>
`])

/* register router, views, models */

persist((persist) => {
  app.use(persist)
  const tree = app.start()
  document.body.appendChild(tree)
})
