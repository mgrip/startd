const webpack = require('webpack')
const path = require('path')
const spawn = require('child_process').spawn

let server = null
const refresh = () => {
  if (server) server.kill()
  const serverPath = path.resolve(__dirname, 'startd-server.bundle.js')
  server = spawn('node', [serverPath], { stdio: 'inherit', env: process.env })
  console.log('Restarted the server')
}

const config = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            'babel-preset-es2015',
            'babel-preset-stage-1',
            'babel-preset-react'
          ],
          plugins: ['styled-jsx/babel']
        }
      }
    ]
  },
  devtool: 'eval'
}

const compiler = webpack([
  Object.assign({}, config, {
    entry: path.resolve(process.cwd(), './scripts/startd-server.js'),
    output: {
      path: path.resolve(__dirname),
      filename: 'startd-server.bundle.js'
    },
    target: 'node'
  }),
  Object.assign({}, config, {
    entry: path.resolve(process.cwd(), './scripts/startd-client.js'),
    output: {
      path: path.resolve(__dirname, '..', 'public'),
      filename: 'startd.bundle.js'
    }
  })
])

let production = false
process.argv.forEach(function(val, index, array) {
  if (val === '--prod') production = true
})

if (production) {
  compiler.run(err => {
    refresh()
  })
} else {
  compiler.watch({}, (err, stats) => {
    refresh()
  })
}
