#!/usr/bin/env node
var md2conflu = require('../')
var fs = require('fs')
var path = require('path')
var assert = require('assert')

var filename = process.argv[2]
assert(filename, 'should have filename')

fs.readFile(path.resolve(process.cwd(), filename), function(err, buf) {
    assert(!err, 'read file ' + filename + ' error!')
    console.log(md2conflu(buf + ''))
})
