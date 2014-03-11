/*!
 * Create a new post
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var fs = require('fs')
var join = require('path').join
var strftime = require('strftime')
var then = require('./utils/then')
require('colors')

module.exports = function(title, options) {
  var postDir = options.drafts ? '_drafts' : '_posts'
  var pinyinTitle =  options.pinyin ? require('han').letter(title, '-') : title
  var fileName = strftime('%F-') + pinyinTitle + '.' + options.ext
  var filePath = join(postDir, fileName)

  if (fs.existsSync(filePath)) {
    console.log(('The file `%s` already exists.').yellow, filePath)
    return false
  }

  !fs.existsSync(postDir) && fs.mkdirSync(postDir)

  var fileData = require('util').format(
    '---\nlayout: post\ndate: %s\ntitle: %s\n---\n\n',
    strftime('%F %T %z'),
    title
  )

  fs.writeFile(filePath, fileData, 'utf8', then(function() {
    console.log(('The file `%s` is successfully created.').green, filePath)
  }))
}
