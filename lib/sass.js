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
  var config = require(resolve(process.cwd(), '_config.yml'))

  this.cssDir = config.css_dir || 'stylesheet'
  this.outputStyle = config.output_style || 'expanded'

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
  spawn('compass', [
    'compile',
    '--no-line-comments',
    '--sass-dir', '_sass',
    '--css-dir', this.cssDir,
    '-s', this.outputStyle
  ],
  {
    cwd: process.cwd()
  })
}
