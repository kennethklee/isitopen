(function() {

    var app = can.Control({
        defaults: {
            view: 'templates/app.mustache'
        }
    }, {
        init: function() {
            this.element.append(can.view(this.options.view, this.options));
        }
    });
    
    window.App = app;
})();