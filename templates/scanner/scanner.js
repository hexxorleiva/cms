	// $(document).on('pagechange', function() {
	// 	$('#change_promoter_login select').change(function() {
	// 		ct_promoter_ide = $(this).val();
	// 		redirect_location = '/scanner/events/?ct_promoter_ide=' + ct_promoter_ide;		

	// 		location.href = redirect_location;
	// 	});
	// });

$(document).delegate("#Events", "pageinit", function() {
	console.log('Page with the #events id has been triggered through the pageinit event. This means if the first page is #Events, all functions below will trigger. It will not trigger if you return to the #events page.');
});

$(document).on('pagechange', function(event) {
	var current_page = $("div[data-role='page']").attr('id');
	console.log($.mobile.activePage);
	console.log('This page has been loaded ' + current_page);
});