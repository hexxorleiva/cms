
//	The usage of this particular selector is to be able to detect which exact page we are on.
//	Because jQuery mobile loads each external page into the DOM after the inital page
//	We need to be constantly need to be using the '.live' event handler.

//	When the basic page is set-up, we will be passing the following variables in-between all
//	the different pages.
var ct_event_ide;
var ct_promoter_ide;
var ct_contract_ide;

$('#Events').live('pageinit', function() {
	//	When the page is loaded initally, grab the ct_promoter that is in the selector
	//	and then send that information to ajax page /scanner/ajax/ct-promoter-events.php
	//	and bring back all the information on all the events.
	ct_promoter_ide = $('select#ct_promoter_selection').val();

	//	Variable set-up to grab upon the inital grabbing of events, to place a limit on how many times into
	//	the future or the past we can go using the "next day" and "previous day" buttons.
	var num_of_event_days;

	var data = {
		'ct_promoter_ide' : ct_promoter_ide
	}

	$.mobile.loading('show');

	/**
	 * Creates loop that then loads all of the event information
	 * supplied by the json object returned from the ajax page.
	 *
	 * @param object json
	 *
	 */
	function load_event_information(json_result) {
		var holder = [];
		var date;
		var market;
		$.each(json_result, function(key, val) {
			//	global variable num_of_event_days equals the maximum number of event days possible.
			num_of_event_days = val.num_of_event_days;

			console.log('successfully loaded from the ajax, here is the result : ' + val.date);
			//	Make a divider based on the date
			if(date != val.date) {
				date = val.date;
				var date_div = $('.middle div#event_date');
				console.log(date);
				date_div.text(date);
				if (date_div.is(":hidden")) {
					date_div.show();
				}
			}

			//	Make a divider based on the market
			if(market != val.market) {
				market = val.market;
				console.log('Got the market : ' + market);
				holder.push('<li data-role="list-divider">' + market + '</li>');
			}

			//	Go through each event that is returned from the json response from the ajax page and format it to be displayed on the page
			holder.push('<li><a class="ui-link" href="/scanner/events/scan" ct_contract_ide="' + val.ct_contract_ide + '">' + '<h2>' + val.name + '</h2>' + 
			'</a>' + '</li>');
		});
		
		$('div#ct_promoter_listings_event ul').append().html(holder.join(' '));
		$('div#ct_promoter_listings_event ul').listview('refresh');
	}

	/**
	 * Shows the listview, and the next day button. Populates the listview with the
	 * status="OK" json response from the PHP ajax page which includes the basic event
	 * information and also grabs the total number of unique dates that have an event
	 * in the future. This is to then determine how many times the 'nextday' button
	 * can click and where the limit is.
	 *
	 * @param object json
	 *
	 */
	function refresh_front_page(json_result) {

		if ($('div#ct_promoter_listings_event').is(":hidden")) {
			$('div#ct_promoter_listings_event').show();
		}

		if ($('div#changing_days_nav div#nextday').is(":hidden")) {
			$('div#changing_days_nav div#nextday').show();
		}

		if ($('div#changing_days_nav div#previousday').is(":visible")) {
			$('div#changing_days_nav div#previousday').hide();
		}

		load_event_information(json_result);

		//	If the promoter only has one day's worth of events, immediately hide the "nextday" button
		//	to prevent any issues, otherwise use to hide the next day button once you've reached the maximum
		//	number of events.
		if(num_of_event_days == $('div#changing_days_nav div#nextday a').attr('value')) {
			$('div#changing_days_nav div#nextday').hide();
		} else {
			if($('div#changing_days_nav div#nextday').is(":hidden")) {
				$('div#changing_days_nav div#nextday').show();
			}
		}

		$.mobile.loading('hide');

	}

	/**
	 * If there is ever an issue loading the front page, hide
	 * the 'next/previous' day navigation buttons
	 *
	 * @param object json
	 *
	 */
	function refresh_error(json_result) {
		if ($('div#changing_days_nav div#nextday').is(":visible")) {
			$('div#changing_days_nav div#nextday').hide();
		}

		if ($('div#changing_days_nav div#previousday').is(":visible")) {
			$('div#changing_days_nav div#previousday').hide();
		}

		if ($('div#ct_promoter_listings_event').is(":hidden")) {
			$('div#ct_promoter_listings_event').show();
		}

		$('#ct_promoter_listings_event ul').text(json_result);

		console.log('There was an issue trying to render out the information. This was the error : ' + json_result);

		$.mobile.loading('hide');
	}

	/**
	 * When switching promoters or loading the page for the first time
	 * hide all elements until the page gets an ajax response to 
	 * load the rest of the page.
	 *
	 */
	function hide_daynav_listview() {

		if ($('.middle div#event_date').is(":visible")) {
			$('.middle div#event_date').hide();
		}

		if ($('div#ct_promoter_listings_event').is(":visible")) {
			$('div#ct_promoter_listings_event').hide();
		}

		if ($('div#changing_days_nav div#nextday').is(":visible")) {
			$('div#changing_days_nav div#nextday').hide();
		}

		if ($('div#changing_days_nav div#previousday').is(":visible")) {
			$('div#changing_days_nav div#previousday').hide();
		}
	}

	/**
	 * When switching promoters, if any of the buttons are visible
	 * hide them to indicate that there is a change for the user.
	 *
	 */
	function changing_promoters() {

		$.mobile.loading('show');
		
		hide_daynav_listview();

		$('div#changing_days_nav div#nextday a').attr('value', function(i,val) {
			return val.replace($('div#changing_days_nav div#nextday a').attr('value'), 1);
		});

		$('div#changing_days_nav div#previousday a').attr('value', function(i,val) {
			return val.replace($('div#changing_days_nav div#previousday a').attr('value'), 0);
		});
	}

	/**
	 * Adds and subtracts the values within the previous/next day buttons that are
	 * passed into the index value of the $ct_event_unique_dates array that contains
	 * all possible dates within it. The $ct_event_unique_dates is located on the ajax
	 * page that is getting the information.
	 *
	 * @param string date_nav_button
	 * @param int nav_counter
	 *
	 */
	function date_nav_buttons(date_nav_button, nav_counter) {
		if(date_nav_button == 'nextday') {

			$("div#changing_days_nav div#" + date_nav_button + " a").attr('value', function(i,val) {
				return val.replace($("div#changing_days_nav div#" + date_nav_button + " a").attr('value'), nav_counter);
			});

			nav_counter = nav_counter - 1;

			$("div#changing_days_nav div#previousday a").attr('value', function(i,val) {
				return val.replace($("div#changing_days_nav div#previousday a").attr('value'), nav_counter);
			});

		} else if(date_nav_button == 'previousday') {

			$("div#changing_days_nav div#" + date_nav_button + " a").attr('value', function(i,val) {
				return val.replace($("div#changing_days_nav div#" + date_nav_button + " a").attr('value'), nav_counter);
			});

			nav_counter = nav_counter + 1;

			$("div#changing_days_nav div#nextday a").attr('value', function(i,val) {
				return val.replace($("div#changing_days_nav div#nextday a").attr('value'), nav_counter);
			});
		}
	}

	//	We are hiding all the elements that are automatically loaded into the php page due to how jQuery mobile automatically renders all of the page
	//	with added classes, instead of having to re-add these classes later on, we can get jQuery to format all of the links, listviews for us at first
	//	and before the page completely loads, to hide these elements to be visible to the user later on when need-be.
	//	Below is hiding the list-view and the "search events" bar.
	hide_daynav_listview();

	$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
		aql.json.handle(json, null, {
			success: function() {
				refresh_front_page(json[0]);
			},
			error: function() {
				refresh_error(json[0]);
			}
		
		});
	});
	
	//	Will check when the <select> for the promoter has changed
	$('select#ct_promoter_selection').live('change', function() {

		changing_promoters();

		ct_promoter_ide = $(this).val();

		var data = {
			'ct_promoter_ide' : ct_promoter_ide,
			'random' : Math.random()
		}

		$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
			aql.json.handle(json, null, {
				success: function() {
					refresh_front_page(json[0]);
				},
				error: function() {
					refresh_error(json[0]);
				}
			
			});
		});

	});

	//	Once the link is clicked to go into the 'Scan' page, it will set the global
	//	variable ct_contract_ide and be available to all the other pages that will
	//	need it.
	$("ul#listings a.ui-link-inherit").live('click', function() {
		ct_contract_ide = $(this).attr('ct_contract_ide');
		console.log('This is the contact_ide for the specific event that was clicked on: ' + ct_contract_ide);
	});


	/**
	 *
	 *	Next Day / Previous Day Buttons for the Front Page
	 *
	 */


	//	Section for the "Next Day" button
	$('div#changing_days_nav div#nextday a').live('tap', function()	{

		//	Used to grab the value that the "nextday" button currently has and 
		//	turns it into an integer with the *1 to the value.
		var nextday_counter = $(this).attr('value')*1;

		//	+1 to the index value to move where in the array we are in the ajax page along the
		//	array that contains all the unique dates.
		nextday_counter = nextday_counter + 1;

		console.log('The nextday_counter after +1 = ' + nextday_counter);

		$.mobile.loading('show');

		hide_daynav_listview();

		var data = {
			'ct_promoter_ide' : ct_promoter_ide,
			'next_day' : nextday_counter
		}

		$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
			aql.json.handle(json, null, {
				success: function() {
					//	Use this function to increment or decrement the index value that is being passed
					//	into the ajax page that will be determining the position in the array that
					//	will showcase the date. 
					date_nav_buttons('nextday', nextday_counter);

					//	If we have reached the maximum elements in the array that contain all of the dates
					//	then we want the user to no longer be able to continue forward, so we hide the nextday
					//	button. Otherwise we bring it back.
					if((num_of_event_days - 1) == $('div#changing_days_nav div#nextday a').attr('value')) {
						$('div#changing_days_nav div#nextday').hide();
					} else {
						if($('div#changing_days_nav div#nextday').is(":hidden")) {
							$('div#changing_days_nav div#nextday').show();
						}
					}

					if ($('div#ct_promoter_listings_event').is(":hidden")) {
						$('div#ct_promoter_listings_event').show();
					}

					if ($('div#changing_days_nav div#previousday').is(":hidden")) {
						$('div#changing_days_nav div#previousday').show();
					}

					load_event_information(json[0]);

					$.mobile.loading('hide');
				},
				error: function() {
					refresh_error();
				}
			});
		});		
	});

	$('div#changing_days_nav div#previousday a').live('tap', function()	{
		var previousday_counter = $(this).attr('value')*1;
		
		//	-1 to the index value to move where in the array we are in the ajax page along the
		//	array that contains all the unique dates.
		previousday_counter = previousday_counter - 1;

		console.log('The previousday_counter after 1 has been added ' + previousday_counter);

		$.mobile.loading('show');

		hide_daynav_listview();

		var data = {
			'ct_promoter_ide' : ct_promoter_ide,
			'next_day' : previousday_counter
		}

		$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
			aql.json.handle(json, null, {
				success: function() {
					//	Use this function to increment or decrement the index value that is being passed
					//	into the ajax page that will be determining the position in the array that
					//	will showcase the date. 
					date_nav_buttons('previousday', previousday_counter);

					//	If we have reached the maximum elements in the array that contain all of the dates
					//	then we want the user to no longer be able to continue forward, so we hide the nextday
					//	button. Otherwise we bring it back.
					if($('div#changing_days_nav div#previousday a').attr('value') == 0) {
						$('div#changing_days_nav div#previousday').hide();
					} else {
						if($('div#changing_days_nav div#previousday').is(":hidden")) {
							$('div#changing_days_nav div#previousday').show();
						}
					}

					if ($('div#changing_days_nav div#nextday').is(":hidden")) {
						$('div#changing_days_nav div#nextday').show();
					}

					if ($('div#ct_promoter_listings_event').is(":hidden")) {
						$('div#ct_promoter_listings_event').show();
					}

					load_event_information(json[0]);

					$.mobile.loading('hide');
				},
				error: function() {
					refresh_error();
				}
			});
		});
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