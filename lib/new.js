/*!
 * Create a new Jekyll application
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var exists = require('fs').existsSync
var resolve = require('path').resolve
var format = require('util').format
var mkdirp = require('mkdirp')
var parallel = require('async').parallel
var spawn = require('./utils/spawn')
var then = require('./utils/then')
require('colors')

module.exports = function(blogPath, option) {
  blogPath = resolve(process.cwd(), blogPath)

  if (exists(blogPath)) {
    console.log(('The directory `%s` already exists.').yellow, blogPath)
    return false
  }

  var argsGroup = [
    ['_config.yml', 'Gemfile', 'index.html', 'atom.xml', blogPath],
    ['-r', '_layouts', blogPath],
    ['gitignore', resolve(blogPath, '.gitignore')]
  ]
  var tasks = []
  var cwd = resolve(__dirname, '../templates')

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

  mkdirp(resolve(blogPath, '_layouts'), then(function() {
    // copy files
    parallel(tasks, then(function() {
      var tips = format('Your blog is successfully created in `%s`. Enjoy!'.green, blogPath)

      // install gems
      if (option.bundle) {
        spawn('bundle', ['install'], {
          cwd: blogPath,
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

  mkdirp(resolve(blogPath, '_posts'), then(function() {
    // create a sample file
    spawn('j', ['post', 'Hello World'], {
      cwd: blogPath,
      stdout: false
    })
  }))
}
