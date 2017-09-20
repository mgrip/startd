#!/usr/bin/env node
const ncp = require('ncp').ncp
const path = require('path')
const dependencies = require('./package.json').dependencies
const spawn = require('child_process').spawn
const fs = require('fs')
const chalk = require('chalk')
const { update: updateMode, _: [projectName] } = require('minimist')(
  process.argv.slice(2)
)

const title = log => '\n' + chalk.blueBright(log) + '\n'
const info = chalk.dim.yellow
const error = chalk.redBright.bold

console.log(title('Lets get startd! 🚀'))

if (!updateMode && !projectName) {
  console.log(error('You must specifiy a project name!'))
  return
}

if (updateMode) {
  console.log(title('Updating startd scripts for existing project...'))
  if (!fs.existsSync('./scripts')) {
    console.log(
      error('Startd projects must contain a /scripts directory to be updated')
    )
    return
  }
  ncp(
    path.resolve(__dirname, 'scripts'),
    path.resolve(process.cwd(), 'scripts'),
    function(err) {
      if (err) {
        return console.error(err)
      }
      console.log(info('Done!'))
    }
  )
  return
}

console.log(title('Creating new project ' + chalk.bgWhite.black(projectName)))

if (!fs.existsSync('./' + projectName)) {
  fs.mkdirSync('./' + projectName)
}
console.log(info('Copying project template...'))
ncp(
  path.resolve(__dirname, 'src'),
  path.resolve(process.cwd(), projectName, 'src'),
  function(err) {
    if (err) {
      return console.error(err)
    }
    console.log(info('Done!'))
    console.log(info('Copying startd scripts...'))
    ncp(
      path.resolve(__dirname, 'scripts'),
      path.resolve(process.cwd(), projectName, 'scripts'),
      function(err) {
        if (err) {
          return console.error(err)
        }
        console.log(info('Done!'))
        process.chdir(projectName)
        console.log(info('Creating package.json file...'))
        fs.writeFile(
          './package.json',
          JSON.stringify({
            dependencies: dependencies,
            scripts: {
              start: 'node ./scripts/startd.js'
            }
          }),
          'utf8',
          () => {
            console.log(info('Done!'))
            console.log(info('Installing dependencies...'))
            const npm = spawn('npm', ['install'])
            npm.on('close', () => {
              console.log(info('Done!'))
            })
          }
        )
      }
    )
  }
)
