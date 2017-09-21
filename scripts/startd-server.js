import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import App from '../src/App.js'
import { StaticRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import WebSocket from 'ws'

const store = createStore((state = {}) => state)

const server = express()
  .use(express.static('public'))
  .get('*', (req, res) => {
    res.status(200).send(`<!doctype html><html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="text/javascript" src="startd.bundle.js"></script>
      </head>
      <body>
        <div id="root">
          ${renderToString(
            <Provider store={store}>
              <StaticRouter location={req.url} context={{}}>
                <App />
              </StaticRouter>
            </Provider>
          )}
        </div>
      </body>
    </html>`)
  })
  .listen(process.env.PORT || 3000)

const ws = new WebSocket.Server({ server })

ws.on('connection', socket => {
  console.log('hi client connected')
  socket.on('disconnect', () => {
    console.log('client disconnect')
  })
})
