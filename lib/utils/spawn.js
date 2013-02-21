/*jshint node:true, asi:true, expr:true */
'use strict';

var spawn = require('child_process').spawn

module.exports = function(command, args, options) {
  if (!Array.isArray(args)) {
    options = args
    args = null
  }
  options || (options = {})

  var comm = spawn(command, args, options)
  var puts = ['stdout', 'stderr']

  puts.forEach(function(s) {
    if (options[s] !== false) {
      comm[s].setEncoding('utf8')
      comm[s].on('data', function(data) {
        process[s].write(data)
      })
    }
  })

  options.exit && comm.on('exit', options.exit)
}
