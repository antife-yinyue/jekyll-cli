/*!
 * Deploy to GitHub
 */

/*jshint node:true, asi:true */

'use strict';

var join = require('path').join
var exec = require('child_process').exec
require('js-yaml')
require('colors')

module.exports = function(msg) {
  var config = require(join(process.cwd(), '_config.yml'))
  var option = { cwd: process.cwd() }

  if (!(config.deploy && config.deploy.repository && config.deploy.branch)) {
    console.log('You should run `j git` first.'.yellow)
    return false
  }

  exec('git add .', option, cb)
  exec('git commit -m "' + (msg || 'no message') + '"', option, cb)
  exec('git push origin ' + config.deploy.branch, option, cb)
}

function cb(err, stdout) {
  if (err) {
    throw err
  }
  stdout && console.log(stdout)
}
