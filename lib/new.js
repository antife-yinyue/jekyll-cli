/*!
 * Create a new Jekyll application
 */

/*jshint node:true, asi:true */

'use strict';

var exists = require('fs').existsSync
var join = require('path').join
var resolve = require('path').resolve
var exec = require('child_process').exec
var spawn = require('child_process').spawn
var mkdirp = require('mkdirp')
require('colors')

module.exports = function(path) {
  path = resolve(process.cwd(), path)

  if (exists(path)) {
    console.log(('The directory `%s` already exists.').yellow, path)
    return false
  }

  mkdirp(join(path, '_layouts'), function(err) {
    if (err) {
      throw err
    }

    var option = { cwd: join(__dirname, '../templates') }
    spawn('cp', ['_config.yml', 'Gemfile', 'index.html', path], option)
    spawn('cp', ['gitignore', join(path, '.gitignore')], option)
    spawn('cp', ['layout.html', join(path, '_layouts/default.html')], option)

    console.log('Installing gems...')
    exec('bundle install', { cwd: path }, function(error, stdout) {
      if (error) {
        throw error
      }
      console.log(stdout)
      console.log('APP successfully created. Enjoy!'.green)
    })
  })

  mkdirp(join(path, '_posts'), function(err) {
    if (err) {
      throw err
    }
    spawn('j', ['post', 'Hello World'], { cwd: path })
  })
}
