
//	The usage of this particular selector is to be able to detect which exact page we are on.
//	Because jQuery mobile loads each external page into the DOM after the inital page
//	We need to be constantly need to be using the '.live' event handler.

//	When the basic page is set-up, we will be passing the following variables in-between all
//	the different pages.

$('#Events').live('pageinit', function() {
	//	When the basic page is set-up, 
	var market_ide;

	//	When the page is initalized, hide all the promoter options for the user until they've
	//	picked a market. After they have picked a market, show the option to change promoters
	//	to carry over the variable of the market ide into the query for events.
	$('div#change_promoter_login').hide();

	//	Will check when the <select> for the markets is changed
	$('select#markets').live('change', function() {
		//	Show the promoters <select>
		$('div#change_promoter_login').show();
		market_ide = $(this).val();
		console.log('This market has been picked: ' + market_ide);
	});
	
	//	Once the user picks their promoter, do the following:
	//	1. Grab the ide value of that promoter from the list.
	//	2. Send it to the ajax page below.
	//	3. Ajax will return a json [object,Object] that will contain all of the information for the events
	//	4. Parse the [object,Object] as a link value
	$('select#ct_promoter_selection').bind('change', function() {
		var ct_promoter = $(this).val();
		
		var data = {
			'ct_promoter_ide' : ct_promoter,
			'market_ide' : market_ide
		}

		$.mobile.loading('show');

		$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
			aql.json.handle(json, null, {
				success: function() {
					var holder = [];
					var ct_event_id;

					$.each(json[0], function(key, val) {
						holder.push('<a class="ui-link" href="/?ct_promoter_ide=' + val.ct_event_id + '">' + val.name + '</a>' + ' ' + val.date + '<br />' + '<strong>Address</strong>: ' + 
						val.address1 + '<br />' + val.city + ', ' + val.state + ' ' + val.zip + '<br /><br />');
					});

					$('#ct_promoter_listings').append().html(holder.join(' '));
					$.mobile.loading('hide');
				},
				error: function() {
					$('#ct_promoter_listings').text(json[0]);
					$.mobile.loading('hide');
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