/*!
 * Creates a new Jekyll site scaffold in PATH
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var fs = require('fs')
var join = require('path').join
var resolve = require('path').resolve
var format = require('util').format
var mkdirp = require('mkdirp')
var async = require('async')
var spawn = require('./utils/spawn')
var then = require('./utils/then')
require('colors')

module.exports = function(blogPath, options) {
  blogPath = resolve(process.cwd(), blogPath)

  if (fs.existsSync(blogPath)) {
    console.log(('The directory `%s` already exists.').yellow, blogPath)
    return false
  }

  var argsGroup = [
    ['_config.yml', 'index.html', '404.html', 'Gemfile', 'atom.xml', 'favicon.ico', blogPath],
    ['-r', '_layouts', blogPath],
    ['-r', '_includes', blogPath],
    ['gitignore', join(blogPath, '.gitignore')]
  ]
  var tasks = []
  var cwd = join(__dirname, '..', 'templates')

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

  mkdirp.sync(join(blogPath, '_layouts'))

  // copy templates
  async.parallel(tasks, then(function() {
    var tips = format('Your blog is successfully created in `%s`. Enjoy!'.green, blogPath)

    // install gems
    if (options.bundle) {
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

  // create a sample post
  spawn('jkl', ['post', 'Hello World'], {
    cwd: blogPath,
    stdout: false
  })
}
