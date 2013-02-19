/*!
 * Deploy to GitHub
 */

/*jshint node:true, asi:true */

'use strict';

var join = require('path').join
var series = require('async').series
var spawn = require('./utils/spawn')
require('js-yaml')
require('colors')

module.exports = function(msg) {
  var settings = require(join(process.cwd(), '_config.yml')).deploy

  if (!(settings && settings.repository && settings.branch)) {
    console.log('You should run `j git` first.'.yellow)
    return false
  }

  var argsGroup = [
    ['add', '*'],
    ['commit', '-m', msg || ':u7121:'],
    ['push', 'origin', settings.branch]
  ]
  var tasks = []

  argsGroup.forEach(function(args) {
    tasks.push(function(callback) {
      spawn('git', args, {
        cwd: process.cwd(),
        exit: function(code) {
          code === 0 && callback()
        }
      })
    })
  })

  // run tasks one by one
  series(tasks)
}
