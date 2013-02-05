(function() {

    var app = can.Control({
        defaults: {
            view: 'app'
        }
    }, {
        init: function() {
            console.log(this.element);
            this.element.append(can.view(this.options.view, this.options));
        }
    });
    
    window.App = app;
})();