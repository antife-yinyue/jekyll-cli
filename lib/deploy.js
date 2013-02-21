/*!
 * Deploy to GitHub
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var resolve = require('path').resolve
var series = require('async').series
var spawn = require('./utils/spawn')
require('js-yaml')
require('colors')

module.exports = function(msg) {
  var config = require(resolve(process.cwd(), '_config.yml')).deploy

  if (!(config && config.repository && config.branch)) {
    console.log('You should run `j git` first.'.yellow)
    return false
  }

  var argsGroup = [
    ['add', '*'],
    ['commit', '-m', msg || ':u7121:'],
    ['push', 'origin', config.branch]
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
