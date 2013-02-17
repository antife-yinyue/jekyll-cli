/*!
 * Show stdout/stderr realtime
 */

/*jshint node:true, asi:true */

'use strict';

var spawn = require('child_process').spawn

module.exports = function(command, args, options) {
  if (!Array.isArray(args)) {
    options = args
    args = null
  }
  options || (options = {})

  var comm = spawn(command, args, options)

  comm.stdout.setEncoding('utf8')
  comm.stdout.on('data', options.stdout || function(data) {
    process.stdout.write(data)
  })

  comm.stderr.setEncoding('utf8')
  comm.stderr.on('data', options.stderr || function(data) {
    process.stderr.write(data)
  })

  options.exit && comm.on('exit', options.exit)
}
