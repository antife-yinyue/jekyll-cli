/*!
 * Setup git repository
 */

/*jshint node:true, asi:true */

'use strict';

var fs = require('fs')
var join = require('path').join
var format = require('util').format
var exec = require('child_process').exec
require('js-yaml')

module.exports = function() {
  require('commander').prompt('Repository read/write url: ', function(url) {
    url = url.trim()
    var i = url.lastIndexOf('/')
    var user = url.indexOf('git@') === 0 ?
      url.slice(url.indexOf(':') + 1, i) :
        url.slice(url.indexOf('/', 8) + 1, i)
    var repo = url.slice(i + 1, url.lastIndexOf('.git'))
    var branch = user.toLowerCase() + '.github.com' === repo.toLowerCase() ? 'master' : 'gh-pages'

    var option = { cwd: process.cwd() }
    exec('git init', option, fn)
    exec('git checkout -b ' + branch, option, fn)
    exec('git remote add origin ' + url, option, fn)

    // Save settings in `_config.yml`
    var yamlFile = join(process.cwd(), '_config.yml')
    var settings = format('\ndeploy:\n  repository: %s\n  branch: %s\n', url, branch)
    if (require(yamlFile).deploy === undefined) {
      fs.appendFile(yamlFile, settings, cb(settings))
    }
    else {
      fs.readFile(yamlFile, 'utf8', function(err, data) {
        if (err) {
          throw err
        }
        data = data.replace(/(\n {2}repository:).*/, '$1 ' + url)
                   .replace(/(\n {2}branch:).*/, '$1 ' + branch)

        fs.writeFile(yamlFile, data, cb(settings))
      })
    }

    process.stdin.destroy()
  })
}


function fn(err, stdout) {
  if (err) {
    throw err
  }
  stdout && console.log(stdout)
}

function cb(settings) {
  return function(err) {
    if (err) {
      throw err
    }
    console.log('Setup successfully.\n'.green)
    console.log('The settings below is in `_config.yml` now. '.yellow)
    console.log('Don\'t change them, unless you know what you do.'.yellow)
    console.log('```')
    console.log(settings.trim())
    console.log('```')
  }
}
