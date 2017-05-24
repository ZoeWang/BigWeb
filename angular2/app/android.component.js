(function(app) {

  app.AndroidComponent =ng.core
    .Component({
      selector: 'my-app',
      templateUrl: 'app/html/app.Android.html',
      directives: [
        // app.WebBan,
        // app.AndroidOther,
        app.AppWho,
        app.AppReport,
        app.AppForm
      ]
    })
    .Class({
      constructor: function() {

      }
    });

})(window.app || (window.app = {}));