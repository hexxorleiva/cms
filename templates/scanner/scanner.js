
//	The usage of this particular selector is to be able to detect which exact page we are on.
//	Because jQuery mobile loads each external page into the DOM after the inital page
//	We need to be constantly need to be using the '.live' event handler.

$("div[data-role='page']").live('pagebeforeshow', function() {
	var current_page = $.mobile.activePage.attr('id');
	console.log('current page is: ' + current_page + ' and this is from the pageshow event.');

	$("footer[data-role='footer'] a#" + current_page).addClass('ui-btn-active ui-state-persist');

});

$("div[data-role='page']").live('pagebeforehide', function() {
	var current_page = $.mobile.activePage.attr('id');
	if($("footer[data-role='footer'] a#" + current_page).hasClass('ui-btn-active ui-state-persist')) {
		$("footer[data-role='footer'] a#" + current_page).removeClass('ui-btn-active ui-state-persist');
		console.log('removed footer from ' + current_page);
	} else {
		console.log('pagebeforehide, did not remove class.');
	}
});

$('#Events').live('pageinit', function() {
	$('#ct_promoter_selection').bind('change', function() {
		console.log('there has been a change in the selection of the ct_promoter.');
	});

});