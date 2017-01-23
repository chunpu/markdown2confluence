var convert = require('../')
var demoMarkdown = require('raw-loader!../demo.md')

$('#convert').click(function() {
	var markdown = $('#markdown').val()
	$('#markup').val(convert(markdown))
})

$(init)

function init() {
	$('#markdown').val(demoMarkdown)
	$('#convert').trigger('click')
}
