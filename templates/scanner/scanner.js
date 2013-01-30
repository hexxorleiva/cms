
//	The usage of this particular selector is to be able to detect which exact page we are on.
//	Because jQuery mobile loads each external page into the DOM after the inital page
//	We need to be constantly need to be using the '.live' event handler.

$('#Events').live('pageinit', function() {
	$('#ct_promoter_selection').bind('change', function() {
		var ct_promoter = $(this).val();
		
		$.post('/scanner/ajax/ct-promoter-events', ct_promoter, function(json) {
			aql.json.handle(json, null, {
				success: function() {
					$('#ct_promoter_listings').text(json);
				},
				error: function() {
					$('#ct_promoter_listings').text(json);
				}
			});
		});
		console.log('the new ct_promoter is: ' + ct_promoter);
		
	});

});

$("div[data-role='page']").live('pagebeforeshow', function() {
	var current_page = $.mobile.activePage.attr('id');
	console.log('current page is: ' + current_page + ' and this is from the pageshow event.');

	$("footer[data-role='footer'] a#" + current_page).addClass('ui-btn-active ui-state-persist');

});