/*!
 * Start web server
 */

/*jshint node:true, asi:true */

'use strict';

var http = require('http')
var send = require('send')
var join = require('path').join
var relative = require('path').relative
var exec = require('child_process').exec
var watchr = require('watchr')
require('js-yaml')
// require('colors')

var cwd = process.cwd()

module.exports = function() {
  var config = require(join(cwd, '_config.yml'))
  var port = config.server_port || '4000'

  watchr.watch({
    path: cwd,
    ignorePaths: [join(cwd, '_site'), join(cwd, 'node_modules')],
    listener: function(changeType, fullPath) {
      console.log('%s has been %sd.', relative(cwd, fullPath), changeType)
      generate()
    },
    next: function(err) {
      if (err) {
        console.log('=== next ===')
        console.log(err)
      }

      generate(server(port))
    }
  })
}

function generate(next) {
  exec(
    'jekyll --safe --no-server --no-auto --redcarpet',
    { cwd: cwd },
    function(err, stdout) {
      if (err) {
        console.log('=== exec ===')
        throw err
      }

      console.log(stdout)

      next && next()
    }
  )
}

function server(port) {
  return function() {
    http.createServer(function(req, res) {
      send(req, req.url).root(join(cwd, '_site')).pipe(res)
    }).listen(port)

    console.log(
      'Your app is running at http://localhost:%s/. Press Ctrl+C to stop.',
      port
    )
  }
}
