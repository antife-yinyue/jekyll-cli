/*!
 * Compile Sass stylesheets
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var resolve = require('path').resolve
var spawn = require('./utils/spawn')
require('js-yaml')

module.exports = function(option) {
  new Compile(option.watch)
}

function Compile(continuable) {
  this.config = require(resolve(process.cwd(), '_config.yml')).compile
  this[continuable ? 'run' : 'runOnce']()
}

Compile.prototype.run = function() {
  var watchr = require('watchr')
  var then = require('./utils/then')
  var _this = this

  watchr.watch({
    path: resolve(process.cwd(), '_sass'),
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
  var args = ['compile', '--sass-dir', '_sass']
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
