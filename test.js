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


test('header 1', function() {
    expect(md2conflu('# Hello')).toBe('h1. Hello\n\n')
})

test('heading 2', function() {
    expect(md2conflu('## Hello')).toBe('h2. Hello\n\n')
})

test('heading 3', function() {
    expect(md2conflu('### Hello')).toBe('h3. Hello\n\n')
})

test('heading 4', function() {
    expect(md2conflu('#### Hello')).toBe('h4. Hello\n\n')
})

describe('unordered list', function() {
    test('basic', function() {
        var list = ''.concat(
            '- this\n',
            '- is\n',
            '- a\n',
            '- list\n'
        )
        var confluence_list = list.replace(/-/g, '*') + '\n'
        expect(md2conflu(list)).toBe(confluence_list)
    })
    test('nested', function() {
        var markdownList = ''.concat(
            '- this\n',
            '- is\n',
            '  - nested\n',
            '    - deep nested\n',
            '- a\n',
            '  - nested\n',
            '- list\n'
        )
        var confluence_list = ''.concat(
            '* this\n',
            '* is\n',
            '** nested\n',
            '*** deep nested\n',
            '* a\n',
            '** nested\n',
            '* list\n\n'
        )
        expect(md2conflu(markdownList)).toBe(confluence_list)
    })
})

describe('ordered list', function() {
    test('basic', function() {
        var list = ''.concat(
            '1. this\n',
            '1. is\n',
            '1. a\n',
            '1. list\n'
        )
        var confluence_list = list.replace(/1\./g, '#') + '\n'
        expect(md2conflu(list)).toBe(confluence_list)
    })
    test('nested', function() {
        var markdownList = ''.concat(
            '1. this\n',
            '1. is\n',
            '  1. nested\n',
            '    1. deep nested\n',
            '1. a\n',
            '  1. nested\n',
            '1. list\n'
        )
        var confluence_list = ''.concat(
            '# this\n',
            '# is\n',
            '## nested\n',
            '### deep nested\n',
            '# a\n',
            '## nested\n',
            '# list\n\n'
        )
        expect(md2conflu(markdownList)).toBe(confluence_list)
    })
    test('nested mixed', function() {
        var markdownList = ''.concat(
            '1. this\n',
            '1. is\n',
            '  - nested\n',
            '    - deep nested\n',
            '1. a\n',
            '  - nested\n',
            '1. list\n'
        )
        var confluence_list = ''.concat(
            '# this\n',
            '# is\n',
            '#* nested\n',
            '#** deep nested\n',
            '# a\n',
            '#* nested\n',
            '# list\n\n'
        )
        expect(md2conflu(markdownList)).toBe(confluence_list)
    })
})

test('strong text', function() {
    expect(md2conflu('**strong**')).toBe('*strong*\n\n')
})

test('italics text', function() {
    expect(md2conflu('*some text here*')).toBe('_some text here_\n\n')
})

test('inline code', function() {
    expect(md2conflu('`hello world`')).toBe('{{hello world}}\n\n')
})

test('block of code', function() {
    code = '    this is code\n'
    expect(md2conflu(code)).toBe('{code:language=none|borderStyle=solid|theme=RDark|linenumbers=true|collapse=false}\nthis is code\n{code}\n\n')
})

test('strikethrough', function() {
    expect(md2conflu('~~strikethrough text~~')).toBe('-strikethrough text-\n\n')
})

test('quote', function() {
    expect(md2conflu('> this is a quote')).toBe('{quote}this is a quote\n\n{quote}')
})

describe('hyperlink', function() {
    test('with no text or title', function () {
        expect(md2conflu('[](http://github.com)')).toBe('[http://github.com]\n\n')
        expect(md2conflu('http://github.com')).toBe('[http://github.com|http://github.com]\n\n')
    })
    test('with text', function () {
        expect(md2conflu('[github](http://github.com)')).toBe('[github|http://github.com]\n\n')
    })
    test('with title', function () {
        expect(md2conflu('[](http://github.com "Github")')).toBe('[http://github.com|Github]\n\n')
    })
    test('with text and title', function () {
        expect(md2conflu('[github](http://github.com "Github")')).toBe('[github|http://github.com|Github]\n\n')
    })
})

describe('image link', function () {
    test('without alt', function() {
        expect(md2conflu('![](http://github.com/logo.png)')).toBe('!http://github.com/logo.png!\n\n')
    })
    test('with alt', function() {
        expect(md2conflu('![logo](http://github.com/logo.png)')).toBe('!http://github.com/logo.png|alt=logo!\n\n')
    })
});

describe('horizontal rule', function() {
    test('* * *', function() {
        expect(md2conflu('* * *')).toBe('----')
    })
    test('***', function() {
        expect(md2conflu('***')).toBe('----')
    })
    test('*****', function() {
        expect(md2conflu('*****')).toBe('----')
    })
    test('---------------------------------------', function() {
        expect(md2conflu('---------------------------------------')).toBe('----')
    })
})
