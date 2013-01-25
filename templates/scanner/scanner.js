$(document).ready(function() {

	$('#change_promoter_login select').change(function() {
		ct_promoter_ide = $(this).val();
		redirect_location = '/scanner/events/?ct_promoter_ide=' + ct_promoter_ide;		

		location.href = redirect_location;
	});

	if($.mobile.activePage) {
		console.log($.mobile.activePage);
	}

});