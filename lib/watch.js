/*!
 * Watch the changes locally
 */

/*jshint node:true, asi:true, expr:true */

'use strict';

var join = require('path').join
var relative = require('path').relative
var url = require('url')
var http = require('http')
var send = require('send')
var watchr = require('watchr')
var spawn = require('./utils/spawn')
var then = require('./utils/then')
require('js-yaml')
require('colors')

module.exports = function(options) {
  new Watch(options)
}

function Watch(options) {
  var _this = this
  var cwd = process.cwd()
  var config = require(join(cwd, '_config.yml'))
  var dest = join(cwd, config.destination || '_site')

  _this.cwd = cwd
  _this.dest = dest
  _this.port = options.port || config.port || '4000'
  _this.drafts = options.drafts
  _this.openSite = options.open

  // start watching
  watchr.watch({
    path: cwd,
    ignorePaths: [dest, join(cwd, config.sass.sass_dir), join(cwd, 'node_modules')],
    ignoreHiddenFiles: true,
    listener: function(changeType, fullPath) {
      console.log(changeType.yellow + ' ' + relative(cwd, fullPath))

      clearTimeout(_this.timer)
      _this.timer = setTimeout(function() {
        _this.generate()
      }, 1000)
    },
    next: then(function() {
      _this.generate(true)
    })
  })
}

// generate static files
Watch.prototype.generate = function(startServer) {
  var _this = this
  var args = ['build']

  _this.drafts && args.push('--drafts')
  startServer || console.log('Regenerating...'.grey)

  spawn('jekyll', args, {
    cwd: _this.cwd,
    exit: function(code) {
      code === 0 && startServer && _this.server()
    }
  })
}

// start a web server
Watch.prototype.server = function() {
  var _this = this
  var uri = 'http://localhost:' + _this.port

  http.createServer(function(req, res) {
    send(req, url.parse(req.url).pathname).root(_this.dest).pipe(res)
  }).listen(_this.port)

  console.log('Your blog is running at %s/. Press Ctrl+C to stop.'.green, uri)

  // open the website
  _this.openSite && spawn('open', [uri])
}
