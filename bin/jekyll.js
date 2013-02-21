#!/usr/bin/env node

/*jshint node:true, asi:true, expr:true */

'use strict';

var jekyll = require('commander')
var join = require('path').join
var path = function(file) {
  return join(__dirname, '../lib', file)
}

jekyll
  .command('new <path>')
  .description('Create a new Jekyll application')
  .option('--no-bundle', 'Don\'t run bundle install')
  .action(require(path('new')))

jekyll
  .command('post <title>')
  .description('Create a new Markdown file to _posts/')
  .action(require(path('post')))

jekyll
  .command('watch')
  .description('Watch the changes')
  .action(require(path('watch')))

jekyll
  .command('git')
  .description('Setup git repository')
  .action(require(path('git')))

jekyll
  .command('deploy [message]')
  .description('Deploy to GitHub')
  .action(require(path('deploy')))

jekyll.usage('<command>').parse(process.argv)

if (!jekyll.args.length) {
  jekyll.help()
}
