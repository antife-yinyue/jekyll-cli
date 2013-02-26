/*!
 * Create a new Markdown file to _posts/
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var fs = require('fs')
var resolve = require('path').resolve
var format = require('util').format
var strftime = require('strftime')
var han = require('han')
var then = require('./utils/then')
require('js-yaml')
require('colors')

module.exports = function(title) {
  var filename = strftime('%Y-%m-%d-') + han.letter(title, '-') + '.md'
  var filepath = resolve(process.cwd(), '_posts', filename)

  if (fs.existsSync(filepath)) {
    console.log(('The file `%s` already exists.').yellow, filename)
    return false
  }

  var config = require(resolve(process.cwd(), '_config.yml'))
  var filedata = format(
    '---\nlayout: post\ndate: %s\ntitle: %s\n---\n\n',
    strftime('%Y-%m-%d %H:%M:%S'), title
  )

  fs.writeFile(filepath, filedata, 'utf8', then(function() {
    console.log(('The file `%s` is successfully created.').green, filename)
  }))
}
