var md2conflu = require('./')
var assert = require('assert')

var pairs = [
      ['# h1', 'h1. h1\n\n']
    , ['head1\n===', 'h1. head1\n\n']
    , ['###  h3', 'h3. h3\n\n']
]

test('basic', function() {
    pairs.forEach(function(arr, i) {
        expect(md2conflu(arr[0])).toBe(arr[1])
    })
})
