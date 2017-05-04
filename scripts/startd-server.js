import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import App from '../src/App.js'
import { StaticRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const store = createStore((state = {}) => state)

express()
  .use(express.static('public'))
  .get('*', (req, res) => {
    res.status(200).send(`<!doctype html><html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="text/javascript" src="startd.bundle.js"></script>
      </head>
      <body>
        ${renderToString(<Provider store={store}>
            <div id="root">
              <StaticRouter location={req.url} context={{}}>
                <App />
              </StaticRouter>
            </div>
          </Provider>)}
      </body>
    </html>`)
  })
  .listen(process.env.PORT || 3000)
