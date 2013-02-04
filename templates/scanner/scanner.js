
//	The usage of this particular selector is to be able to detect which exact page we are on.
//	Because jQuery mobile loads each external page into the DOM after the inital page
//	We need to be constantly need to be using the '.live' event handler.

//	When the basic page is set-up, we will be passing the following variables in-between all
//	the different pages.
var ct_event_ide;
var ct_promoter_ide;
var ct_contract_ide;

$('#Events').live('pageinit', function() {
	//	When the page is loaded initally, to grab the ct_promoter that is in the selector
	//	and then send that information to ajax page /scanner/ajax/ct-promoter-events.php
	//	and bring back all the information on all the events.
	ct_promoter_ide = $('select#ct_promoter_selection').val();

	var data = {
		'ct_promoter_ide' : ct_promoter_ide
	}

	$.mobile.loading('show');
	$('div#ct_promoter_listings_event').hide();

	$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
		aql.json.handle(json, null, {
			success: function() {
				var holder = [];
				var date;

				$('div#ct_promoter_listings_event').show();

				$.each(json[0], function(key, val) {
					//	Make a divider based on the date
					if(date != val.date) {
						date = val.date;
						console.log(date);
						holder.push('<li data-role="list-divider">' + date + '</li>');
					}
					holder.push('<li><a class="ui-link" href="/scanner/events/scan" ct_contract_ide="' + val.ct_contract_ide + '">' + '<h2>' + val.name + '</h2>' + 
					'<p class="listing-date">' + val.date + '</p>' + '</a>' + '</li>');
				});
				
				$('div#ct_promoter_listings_event ul#listings').append().html(holder.join(' '));
				$('div#ct_promoter_listings_event ul#listings').listview('refresh');

				$.mobile.loading('hide');
			},
			error: function() {
				$('div#ct_promoter_listings_event').show();
				$('#ct_promoter_listings_event ul').text(json[0]);
				$.mobile.loading('hide');
			}
		
		});
	});
	
	//	Will check when the <select> for the promoter has changed
	$('select#ct_promoter_selection').live('change', function() {
		//	When the page initalizes, hide any indication of the listings for the events
		//	and the option to choose markets.
		$('div#ct_promoter_listings_event').hide();

		ct_promoter_ide = $(this).val();

		var data = {
			'ct_promoter_ide' : ct_promoter_ide
		}

		$.mobile.loading('show');

		$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
			aql.json.handle(json, null, {
				success: function() {
					var holder = [];
					var date;

					$('div#ct_promoter_listings_event').show();

					$.each(json[0], function(key, val) {
					//	Make a divider based on the date
					if(date != val.date) {
						date = val.date;
						console.log(date);
						holder.push('<li data-role="list-divider">' + date + '</li>');
					}
					holder.push('<li><a class="ui-link" href="/scanner/events/scan" ct_contract_ide="' + val.ct_contract_ide + '">' + '<h2>' + val.name + '</h2>' + 
					'<p class="listing-date">' + val.date + '</p>' + '</a>' + '</li>');
				});
					
					$('div#ct_promoter_listings_event ul').append().html(holder.join(' '));
					$('div#ct_promoter_listings_event ul').listview('refresh');

					$.mobile.loading('hide');
				},
				error: function() {
					$('div#ct_promoter_listings_event').show();
					$('#ct_promoter_listings_event ul').text(json[0]);
					$.mobile.loading('hide');
				}
			
			});
		});

	});

	$("ul#listings a.ui-link-inherit").live('click', function() {
		ct_contract_ide = $(this).attr('ct_contract_ide');
		console.log('This is the contact_ide for the specific event that was clicked on: ' + ct_contract_ide);
	});


});

$('#Scan').live('pageinit', function() {
	console.log('live from the scan page.');
});

$('#GuestList').live('pageinit', function() {

	var data = {
		'ct_contract_ide' : ct_contract_ide
	}

	// Post data for the guest-list
	$.post('/scanner/ajax/guest-list', data, function(json) {
		aql.json.handle(json, null, {
				success: function() {
					console.log(json[0]);
					// var holder[];

					// $.each(json[0], function(key, val) {
					// 	holder.push('<li>' + '<a class="ui-link" href="/scanner/events/scan" ct_contract_ide="' + val.ct_contract_ide + '">' + '<h2>' + val.name + '</h2>' + 
					// 		'<p class="listing-date">' + val.date + '</p>' + '<p class="listing-address">' + val.address1 + '<br />' + 
					// 		val.city + ', ' + val.state + ' ' + val.zip + '</p></a>' + '</li>');
					// });					

					// $('div.middle').append().html(holder.join(' '));

				},
				error: function() {
					console.log('There was an error');
				}
			
		});				
	});
	console.log('live from the guestlist page.');
});

//	Will constantly look at the data-role page attribute and if the footer exists,
//	the footer nav-bar will select the correct button for the navigation.
$("div[data-role='page']").live('pagebeforeshow', function() {
	var current_page = $.mobile.activePage.attr('id');
	console.log('current page is: ' + current_page + ' and this is from the pageshow event.');

	$("footer[data-role='footer'] a#" + current_page).addClass('ui-btn-active ui-state-persist');

});