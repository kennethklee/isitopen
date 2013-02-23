(function(namespace) {
    var place = can.Model({
      findAll : 'GET //maps.googleapis.com/maps/api/place/textsearch/json?query={query}&sensor=false&key=AIzaSyDIlYSvlPVDvD_PpxJZsSscDfHVP_Ns7Wc',
    }, {});
    
    namespace.Models = namespace.Models || {};
    namespace.Models.Place = place;
})(this);