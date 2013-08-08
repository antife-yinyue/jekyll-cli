/*!
 * Deploy to GitHub
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var join = require('path').join
var async = require('async')
var spawn = require('./utils/spawn')
require('js-yaml')
require('colors')

module.exports = function(options) {
  var cwd = process.cwd()
  var config = require(join(cwd, '_config.yml')).deploy

  if (!(config && config.repository && config.branch)) {
    console.log('You should run `jkl git` first.'.yellow)
    return false
  }

  var argsGroup = [
    ['add', '*'],
    ['commit', '-m', options.M],
    ['push', 'origin', config.branch]
  ]
  var tasks = []

  argsGroup.forEach(function(args) {
    tasks.push(function(callback) {
      spawn('git', args, {
        cwd: cwd,
        exit: function(code) {
          code === 0 && callback()
        }
      })
    })
  })

  // run tasks one by one
  async.series(tasks)
}
