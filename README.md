# startd 🚀

👋

startd is a collection of [toolboxes](https://youtu.be/G39lKaONAlA?t=1398) 🛠📦 to help you get your new react web app up and running fast

**Going from react component to fully functioning web app should be as easy as installing a local dependency**

## Getting started

_note: startd uses webpack+babel to compile your app. If your project doesn't already have a .babelrc file, you'll need to create one. check out the [docs](https://babeljs.io/docs/usage/babelrc/), or our example_

### yarn

```bash
yarn add startd-server
yarn run startd --path app.js
```

### npm

```bash
npm install --save startd-server
npx startd --path app.js
```

### How it works

_The core pieces of startd are <100 lines of code. If you want to really know how your application works, go take a look!_

🔎 [server](https://github.com/mgrip/startd/blob/master/packages/startd-server/src/server.js) | [client](https://github.com/mgrip/startd/blob/master/packages/startd-server/src/client.js)

Under the hood, startd uses [koa](https://github.com/koajs/koa) to launch a new server, and just renders your react component specified by the `--path` parameter as the root level component. It uses the concept of [universal javascript](https://cdb.reacttraining.com/universal-javascript-4761051b7ae9) to ensure your app rendered on the initial server response is the same as the code sent to the client. It uses webpack+babel to compile your application.

When running in development mode, startd additionally launches another server to dynamically serve any changed assets, that update as soon as you save a change to any file referenced from your app. This is driven by [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) which serves the assets, and [webpack-hot-client](https://github.com/webpack-contrib/webpack-hot-client) which sends updates to your browser as files change.

#

Contributions welcome!

### 👨‍🎤👩‍🔬👨‍🎨
