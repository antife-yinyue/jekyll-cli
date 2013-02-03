#!/usr/bin/env node

/*jshint node:true, asi:true */

'use strict';

var jekyll = require('commander')
var join = require('path').join
var path = function(file) {
  return join(__dirname, '../lib', file)
}

jekyll
  .command('new <app>')
  .description('Create a new Jekyll application')
  .action(require(path('new')))

jekyll
  .command('post <title>')
  .description('Create a new Markdown file into _posts/')
  .action(require(path('post')))

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
