(function(namespace) {
    
    var ENTER_KEY = 13;
    
    var app = can.Control({
        defaults: {
           	view: 'templates/app.ejs',
            app: new can.Observe({first_search: true}),
            places: new can.Observe.List(),
            place: new can.Observe(),
            position: new can.Observe(),
        }
    }, {
        init: function() {
            this.options.error = '';
            this.element.append(can.view(this.options.view, this.options));
            
            var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(-34.397, 150.644),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.places = new google.maps.places.PlacesService(document.getElementById("attributions"));
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    console.log('got location', position);
                    if (position.coords.accuracy <= 100) {
                        application.options.position.attr({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    }
                }, function() {console.log('failed to get location', arguments)}, {enableHighAccuracy: true});
    		}
        },
        
        "#search keyup": function(el, e) {
			var value = can.trim(el.val());
            if (e.keyCode === ENTER_KEY && value !== '') {
                //application.options.places.splice(0, application.options.places.length);
                this.searchGooglePlaces(value, function(isSuccess, places) {
                    if (!isSuccess) {
                        return;
                    }
                    // TODO sort by distance from application.latitude and application.longitude
                    for (var i = 0; i < places.length; ++i) {
                        application.options.places.push(new can.Observe(places[i]));
                    }

	                application.options.app.attr('first_search', false);
                });
			}
        },
        
        searchGooglePlaces: function(query, callback) {
            var handleResponse = function(results, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    console.log('failed', arguments);
                    application.options.error = status;
                    callback(false, status);
                } else {
                    console.log(results);
	                var data = [];
                    for (var place in results) {
                        if (results.hasOwnProperty(place)) { 
                            data.push({
                                open_now: results[place].opening_hours != null ? results[place].opening_hours.open_now : null,
                                hours: '',
                                name: results[place].name,
                                address: results[place].formatted_address || results[place].vicinity,
                                lat: results[place].geometry.location.lat(),
                                lng: results[place].geometry.location.lng(),
                            });
                        }
                    }
                    callback(true, data);
                }
            };
            if (application.options.position.attr('latitude') && application.options.position.attr('longitude')) {
                var location = new google.maps.LatLng(application.options.position.attr('latitude'), application.options.position.attr('longitude'));
                this.places.nearbySearch({name: query, location: location, radius: 500}, handleResponse);
            } else {
                this.places.textSearch({query: query}, handleResponse);
            }
        },
        
        searchYelp: function(query, callback) {
            $.ajax({
                crossDomain: true,
                async: false,
                dataType: 'jsonp',
                url: 'http://api.yelp.com/business_review_search?term=' + query + '&lat=' + application.latitude + '&long=' + application.longitude + '&radius=100&limit=10&ywsid=',
                success: function(data, status, xhr) {
                	console.log('yelp', data);
            	},
            });
                
        },

        searchAll: function(query, callback) {
        	var results;
        },
    });
    
    namespace.App = app;
})(this);