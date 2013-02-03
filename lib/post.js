/*!
 * Create a new Markdown file into _posts/
 */

/*jshint node:true, asi:true */

'use strict';

var fs = require('fs')
var join = require('path').join
var format = require('util').format
var strftime = require('strftime')
var han = require('han')
require('js-yaml')
require('colors')

module.exports = function(title) {
  var filename = strftime('%Y-%m-%d-') + han.letter(title, '-') + '.md'
  var filepath = join(process.cwd(), '_posts', filename)

  if (fs.existsSync(filepath)) {
    console.log(('The file `%s` already exists.').yellow, filename)
    return false
  }

  var config = require(join(process.cwd(), '_config.yml'))
  var filedata = format(
    '---\nlayout: %s\ntitle: %s\ndate: %s\n---\n\n',
    config.default_layout || 'default',
    title,
    strftime(config.datetime_format)
  )
  fs.writeFile(filepath, filedata, 'utf8', function(err) {
    if (err) {
      throw err
    }
    console.log(('The file `%s` is successfully created.').green, filename)
  })
}
