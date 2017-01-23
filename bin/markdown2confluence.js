#!/usr/bin/env node
var md2conflu = require('../')
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var stdin = require('get-stdin')

var filename = process.argv[2]

if (filename != null) {
  assert(filename, 'should have filename')
  fs.readFile(path.resolve(process.cwd(), filename), function(err, buf) {
    assert(!err, 'read file ' + filename + ' error!')
    console.log(md2conflu(buf + ''))
  })
} else {
  stdin(function (str) {
    console.log(md2conflu(str))
  })
}
