/*jshint node:true, asi:true, expr:true */
'use strict';

module.exports = function(callback) {
  return function(err) {
    if (err) {
      throw err
    }

    callback && callback.apply(null, [].slice.call(arguments, 1))
  }
}
