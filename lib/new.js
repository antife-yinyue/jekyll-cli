/*!
 * Create a new Jekyll application
 */

/*jshint node:true, asi:true */

'use strict';

var exists = require('fs').existsSync
var join = require('path').join
var resolve = require('path').resolve
var mkdirp = require('mkdirp')
var spawn = require('./spawn')
require('colors')

module.exports = newApp

function newApp(path) {
  path = resolve(process.cwd(), path)

  if (exists(path)) {
    console.log(('The directory `%s` already exists.').yellow, path)
    return false
  }

  mkdirp(join(path, '_layouts'), function(err) {
    if (err) {
      throw err
    }

    // copy files
    var argsGroup = [
      ['_config.yml', 'Gemfile', 'index.html', path],
      ['gitignore', join(path, '.gitignore')],
      ['layout.html', join(path, '_layouts/default.html')]
    ]
    argsGroup.forEach(function(args) {
      spawn('cp', args, { cwd: join(__dirname, '../templates') })
    })

    // install gems
    spawn('bundle', ['install'], {
      cwd: path,
      exit: function() {
        console.log('\nAPP successfully created. Enjoy!'.green)
      }
    })
  })

  mkdirp(join(path, '_posts'), function(err) {
    if (err) {
      throw err
    }
    spawn('j', ['post', 'Hello World'], {
      cwd: path,
      stdout: noop
    })
  })
}

function noop() {}
