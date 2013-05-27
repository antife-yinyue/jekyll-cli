/*!
 * Compile Sass stylesheets
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var join = require('path').join
var spawn = require('./utils/spawn')
require('js-yaml')

module.exports = function(options) {
  new Compile(options.watch)
}

function Compile(continuable) {
  this.config = require(join(process.cwd(), '_config.yml')).sass
  this[continuable ? 'run' : 'runOnce']()
}

Compile.prototype.run = function() {
  var watchr = require('watchr')
  var then = require('./utils/then')
  var _this = this

  watchr.watch({
    path: join(process.cwd(), _this.config.sass_dir),
    ignoreHiddenFiles: true,
    listener: function() {
      _this.runOnce()
    },
    next: then(function() {
      console.log('Start watching...')
    })
  })
}

Compile.prototype.runOnce = function() {
  var args = ['compile']
  var config = this.config
  var option

  for (var key in config) {
    option = '--' + key.replace(/_/g, '-')

    if (config[key] === true) {
      args.push(option)
    }
    else {
      args.push(option, config[key])
    }
  }

  spawn('compass', args, { cwd: process.cwd() })
}
