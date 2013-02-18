/*!
 * Deploy to GitHub
 */

/*jshint node:true, asi:true */

'use strict';

var join = require('path').join
var series = require('async').series
var spawn = require('./utils/spawn')
var then = require('./utils/then')
require('js-yaml')
require('colors')

module.exports = function(msg) {
  var config = require(join(process.cwd(), '_config.yml'))

  if (!(config.deploy && config.deploy.repository && config.deploy.branch)) {
    console.log('You should run `j git` first.'.yellow)
    return false
  }

  var argsGroup = [
    ['add', '*'],
    ['commit', '-m', msg || ':u7121:'],
    ['push', 'origin', config.deploy.branch]
  ]
  var tasks = []

  argsGroup.forEach(function(args) {
    tasks.push(function(callback) {
      spawn('git', args, {
        cwd: process.cwd(),
        exit: function() {
          callback()
        }
      })
    })
  })

  series(tasks, then())
}
