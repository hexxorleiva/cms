
//	The usage of this particular selector is to be able to detect which exact page we are on.
//	Because jQuery mobile loads each external page into the DOM after the inital page
//	We need to be constantly need to be using the '.live' event handler.

//	When the basic page is set-up, we will be passing the following variables in-between all
//	the different pages.
var ct_event_ide;
var ct_promoter_ide;
var ct_contract_ide;
var next_day_event;
var previous_day_event;

$('#Events').live('pageinit', function() {
	//	When the page is loaded initally, grab the ct_promoter that is in the selector
	//	and then send that information to ajax page /scanner/ajax/ct-promoter-events.php
	//	and bring back all the information on all the events.
	ct_promoter_ide = $('select#ct_promoter_selection').val();

	var data = {
		'ct_promoter_ide' : ct_promoter_ide,
		'random' : Math.random()
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
			//	Make a divider based on the date
			if(date != val.date) {
				date = val.date;
				var date_div = $('.middle div#event_date');
				date_div.text(date);

				if (date_div.is(":hidden")) {
					date_div.show();
				}
			}

			if(next_day_event != val.next_day) {
				next_day_event = val.next_day;
				next_day_button(next_day_event);
			}

			if(previous_day_event != val.previous_day) {
				previous_day_event = val.previous_day;
				previous_day_button(previous_day_event);
			}

			if(val.ct_contract_ide == undefined) {
				holder.push('<li><h2>' + val.name + '</h2></li>');
				return;
			}

			//	Make a divider based on the market
			if(market != val.market) {
				market = val.market;
				holder.push('<li data-role="list-divider">' + market + '</li>');
			}

			//	Go through each event that is returned from the json response from the ajax page and format it to be displayed on the page
			holder.push('<li><a class="ui-link" data-ajax="false" href="/scanner/events/scan?ct_contract_ide=' + val.ct_contract_ide  + '" ct_contract_ide="' + val.ct_contract_ide + '">' + '<h2>' + val.name + '</h2>' + 
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
		if($('div#changing_days_nav div#nextday').is(":hidden")) {
			$('div#changing_days_nav div#nextday').show();
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

		var holder = [];
		//	Go through each event that is returned from the json response from the ajax page and format it to be displayed on the page
		holder.push('<li>This Promoter has No Upcoming Events</li>');
		$('div#ct_promoter_listings_event ul').append().html(holder.join(' '));
		$('div#ct_promoter_listings_event ul').listview('refresh');

		console.log('There was an issue trying to render out the information. This was the error : ' + json_result);

		$.mobile.loading('hide');
	}

	/**
	 * When switching promoters or loading the page for the first time
	 * hide all elements until the page gets a successful ajax response to 
	 * load the rest of the page.
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
	}

	/**
	 * Whenever the event date is passed from the ajax, change it so that the next/previous buttons
	 * contain that date. The ajax will then correctly display back the dates depending on which button
	 * was pressed.
	 *
	 * @param string event_date
	 *
	 */
	function next_day_button(event_date) {
		$("div#changing_days_nav div#nextday a").attr('event-date', function(i,val) {
			return val.replace($("div#changing_days_nav div#nextday a").attr('event-date'), event_date);
		});
	}

	function previous_day_button(event_date) {
		$("div#changing_days_nav div#previousday a").attr('event-date', function(i,val) {
			return val.replace($("div#changing_days_nav div#previousday a").attr('event-date'), event_date);
		});		
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

		//	Math random is added to keep the webapp from caching the page.
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
		var next_event_date = $(this).attr('event-date');

		$.mobile.loading('show');

		hide_daynav_listview();

		//	Passing the ct_promoter_ide and the date that is currently on the page.
		//	Because the variable that is being passed is 'next_day' the ajax will return
		//	the next events that are later than that date.
		var data = {
			'ct_promoter_ide' : ct_promoter_ide,
			'next_day_date' : next_event_date
		}

		$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
			aql.json.handle(json, null, {
				success: function() {

					load_event_information(json[0]);

					//	If we have reached the maximum elements in the array that contain all of the dates
					//	then we want the user to no longer be able to continue forward, so we hide the nextday
					//	button. Otherwise we bring it back.
					if($('div#changing_days_nav div#nextday a').attr('event-date') == '') {
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

					$.mobile.loading('hide');
				},
				error: function() {
					refresh_error();
				}
			});
		});		
	});

	$('div#changing_days_nav div#previousday a').live('tap', function()	{
		var previous_event_date = $(this).attr('event-date');

		$.mobile.loading('show');

		hide_daynav_listview();

		var data = {
			'ct_promoter_ide' : ct_promoter_ide,
			'previous_day_date' : previous_event_date
		}

		$.post('/scanner/ajax/ct-promoter-events', data, function(json) {
			aql.json.handle(json, null, {
				success: function() {

					load_event_information(json[0]);

					if ($('div#changing_days_nav div#previousday a').attr('event-date') == '') {
						$('div#changing_days_nav div#previousday').hide();
					} else {
						if ($('div#changing_days_nav div#previousday').is(":hidden")) {
							$('div#changing_days_nav div#previousday').show();
						}
					}

					if ($('div#changing_days_nav div#nextday').is(":hidden")) {
						$('div#changing_days_nav div#nextday').show();
					}

					if ($('div#ct_promoter_listings_event').is(":hidden")) {
						$('div#ct_promoter_listings_event').show();
					}

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
	console.log('live from the guestlist page.');
});

//	Will constantly look at the data-role page attribute and if the footer exists,
//	the footer nav-bar will select the correct button for the navigation.
$("div[data-role='page']").live('pagebeforeshow', function() {
	var current_page = $.mobile.activePage.attr('id');
	$("footer[data-role='footer'] a#" + current_page).addClass('ui-btn-active ui-state-persist');
});