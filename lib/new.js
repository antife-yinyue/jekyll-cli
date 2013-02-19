/*!
 * Create a new Jekyll application
 */

/*jshint node:true, asi:true */

'use strict';

var exists = require('fs').existsSync
var join = require('path').join
var resolve = require('path').resolve
var mkdirp = require('mkdirp')
var parallel = require('async').parallel
var spawn = require('./utils/spawn')
var then = require('./utils/then')
require('colors')

module.exports = function(path, options) {
  path = resolve(process.cwd(), path)

  if (exists(path)) {
    console.log(('The directory `%s` already exists.').yellow, path)
    return false
  }

  var argsGroup = [
    ['_config.yml', 'Gemfile', 'index.html', path],
    ['gitignore', join(path, '.gitignore')],
    ['layout.html', join(path, '_layouts/default.html')]
  ]
  var tasks = []
  var cwd = join(__dirname, '../templates')

  argsGroup.forEach(function(args) {
    tasks.push(function(callback) {
      spawn('cp', args, {
        cwd: cwd,
        exit: function(code) {
          code === 0 && callback()
        }
      })
    })
  })

  mkdirp(join(path, '_layouts'), then(function() {
    // copy files
    parallel(tasks, then(function() {
      var tips = 'APP successfully created. Enjoy!'.green

      // install gems
      if (options.bundle) {
        spawn('bundle', ['install'], {
          cwd: path,
          exit: function(code) {
            code === 0 && console.log('\n' + tips)
          }
        })
      }
      else {
        console.log(tips)
      }
    }))
  }))

  mkdirp(join(path, '_posts'), then(function() {
    // create a sample file
    spawn('j', ['post', 'Hello World'], {
      cwd: path,
      stdout: false
    })
  }))
}
