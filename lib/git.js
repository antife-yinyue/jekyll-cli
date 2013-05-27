/*!
 * Setup git repository
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var fs = require('fs')
var join = require('path').join
var format = require('util').format
var commander = require('commander')
var async = require('async')
var spawn = require('./utils/spawn')
var then = require('./utils/then')
require('js-yaml')

module.exports = function() {
  commander.prompt('Repository read/write url: ', function(url) {
    url = url.trim()
    var i = url.lastIndexOf('/')
    var user = url.indexOf('git@') === 0 ?
      url.slice(url.indexOf(':') + 1, i) :
        url.slice(url.indexOf('/', 8) + 1, i)
    var repo = url.slice(i + 1, url.lastIndexOf('.git'))
    var branch = repo.toLowerCase().indexOf(user.toLowerCase() + '.github.') === 0 ? 'master' : 'gh-pages'

    spawn('rm', ['-rf', '.git'], {
      cwd: process.cwd(),
      exit: function() {
        new Setup(url, branch)
      }
    })

    process.stdin.destroy()
  })
}


function Setup(url, branch) {
  this.url = url
  this.branch = branch
  this.init()
}

// initialize empty Git repository
Setup.prototype.init = function() {
  var _this = this
  var argsGroup = [
    ['init'],
    ['checkout', '-b', _this.branch],
    ['remote', 'add', 'origin', _this.url]
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

  async.series(tasks, then(function() {
    _this.save()
  }))
}

// save configuration to `_config.yml`
Setup.prototype.save = function() {
  var _this = this
  var url = _this.url
  var branch = _this.branch
  var configFile = join(process.cwd(), '_config.yml')
  var config = format('\ndeploy:\n  repository: %s\n  branch: %s\n', url, branch)

  _this.config = config.trim()

  if (require(configFile).deploy === undefined) {
    // add
    fs.appendFile(configFile, config, then(function() {
      _this.log()
    }))
  }
  else {
    // replace
    fs.readFile(configFile, 'utf8', then(function(data) {
      data = data.replace(/(\n {2}repository:).*/, '$1 ' + url)
                 .replace(/(\n {2}branch:).*/, '$1 ' + branch)

      fs.writeFile(configFile, data, then(function() {
        _this.log()
      }))
    }))
  }
}

Setup.prototype.log = function() {
  console.log(
    [
      '',
      'The configuration below is in `_config.yml` now. '.yellow,
      'Don\'t change them, unless you know what you do.'.yellow,
      '```',
      this.config,
      '```'
    ].join('\n')
  )
}
