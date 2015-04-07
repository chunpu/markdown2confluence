var convert = require('../')

$('#convert').click(function() {
	var markdown = $('#markdown').val()
	$('#markup').val(convert(markdown))
})
