var marked = require('marked')
var _ = require('min-util')
var qs = require('min-qs')
var inlineLexer = marked.inlineLexer

module.exports = exports = markdown2confluence

// https://roundcorner.atlassian.net/secure/WikiRendererHelpAction.jspa?section=all
// https://confluence.atlassian.com/display/DOC/Confluence+Wiki+Markup
// http://blogs.atlassian.com/2011/11/why-we-removed-wiki-markup-editor-in-confluence-4/

var MAX_CODE_LINE = 20

function Renderer() {}

function escape(text) {
	return text.replace(/\{/g, ' &#123; ').replace(/\}/g, ' &#125; ').replace(/\[/g, '\[').replace(/\]/g, '\]');
}

var rawRenderer = marked.Renderer
var langArr = 'actionscript3 bash csharp coldfusion cpp css delphi diff erlang groovy java javafx javascript perl php none powershell python ruby scala sql vb html/xml'.split(/\s+/)
var langMap = {
	shell: 'bash', 
	html: 'html', 
	xml: 'xml'
}
for (var i = 0, x; x = langArr[i++];) {
	langMap[x] = x
}

_.extend(Renderer.prototype, rawRenderer.prototype, {
	  paragraph: function(text) {
		return text + '\n\n'
	}
	, html: function(html) {
		return html
	}
	, heading: function(text, level, raw) {
		return 'h' + level + '. ' + text + '\n\n'
	}
	, strong: function(text) {
		return '*' + escape(text) + '*'
	}
	, em: function(text) {
		return '_' + escape(text) + '_'
	}
	, del: function(text) {
		return '-' + escape(text) + '-'
	}
	, codespan: function(text) {
		return '{{' + escape(text) + '}}'
	}
	, blockquote: function(quote) {
		return '{quote}' + escape(quote) + '{quote}'
	}
	, br: function() {
		return '\n'
	}
	, hr: function() {
		return '----'
	}
	, link: function(href, title, text) {
		var arr = [href]
		if (text) {
			arr.unshift(text)
		}
		return '[' + arr.join('|') + ']'
	}
	, list: function(body, ordered) {
		var arr = _.filter(_.trim(body).split('\n'), function(line) {
			return line
		})
		var type = ordered ? '#' : '*'
		return _.map(arr, function(line) {
			return type + ' ' + line
		}).join('\n') + '\n\n'

	}
	, listitem: function(body, ordered) {
		return escape(body) + '\n'
	}
	, image: function(href, title, text) {
		return '!' + href + '!'
	}
	, table: function(header, body) {
		return header + body + '\n'
	}
	, tablerow: function(content, flags) {
		return content + '\n'
	}
	, tablecell: function(content, flags) {
		var type = flags.header ? '||' : '|'
		return type + escape(content)
	}
	, code: function(code, lang) {
		// {code:language=java|borderStyle=solid|theme=RDark|linenumbers=true|collapse=true}
		if(lang) {
			lang = lang.toLowerCase()
		}
		lang = langMap[lang] || 'none'
		var param = {
			language: lang,
			borderStyle: 'solid',
			theme: 'RDark', // dark is good
			linenumbers: true,
			collapse: false
		}
		var lineCount = _.split(code, '\n').length
		if (lineCount > MAX_CODE_LINE) {
			// code is too long
			param.collapse = true
		}
		param = qs.stringify(param, '|', '=')
		return '{code:' + param + '}\n' + code + '\n{code}\n\n'
	}
})

var renderer = new Renderer()

function markdown2confluence(markdown) {
	return marked(markdown, {renderer: renderer})
}
