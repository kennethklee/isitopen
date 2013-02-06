(function(namespace) {
    
    var ENTER_KEY = 13;
    
    var app = can.Control({
        defaults: {
           	view: 'templates/app.ejs',
            app: new can.Observe({first_search: true}),
            places: new can.Observe.List(),
            place: new can.Observe(),
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
        },
        
        "#search keyup": function(el, e) {
			var value = can.trim(el.val());
            if (e.keyCode === ENTER_KEY && value !== '') {
                this.places.textSearch({query: value}, function(results, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        application.options.error = status;
                        return;
                    } else {
                        application.options.error = '';
                    }
                    
                    //application.options.places = new can.Observe.List(results);
                    
                    var foundPlace = false;
                    for (var place in results) {
                        if (results.hasOwnProperty(place)) { 
                            //console.log(results[place]);
                            if (results[place].opening_hours && results[place].opening_hours.open_now) {
                                console.log(results[place]);
                                application.options.place.attr({
                                   open_now: results[place].opening_hours.open_now,
                                   name: results[place].name,
                                   address: results[place].formatted_address,
                                   lat: results[place].geometry.location.lat(),
                                   lng: results[place].geometry.location.lng(),
                                });
                                foundPlace = true;
                                break;
                            }
                        }
                    }
                    
                    if (!foundPlace) {
                        application.options.place.attr({
                       		open_now: false,
                            name: value,
                            address: ''
                    	});
                    }

	                application.options.app.attr('first_search', false);
                });
			}
            // https://maps.googleapis.com/maps/api/place/textsearch/json?query=kfc%20near%2056%20holmbush%20cres,%20toronto&sensor=false&key=AIzaSyDIlYSvlPVDvD_PpxJZsSscDfHVP_Ns7Wc
        },
        
        
    });
    
    namespace.App = app;
})(this);