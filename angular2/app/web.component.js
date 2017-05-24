(function(app) {

  app.WebOther =ng.core
    .Component({
        selector:'app-other',
        templateUrl:'app/html/app.WebOther.html'
    })
    .Class({
        constructor:function(){
            
        }
    })


  app.WebComponent =ng.core
    .Component({
      selector: 'my-app',
      templateUrl: 'app/html/app.web.html',
      directives: [
        app.WebBan,
        app.WebOther,
        app.AppWho,
        app.AppReport,
        app.AppForm     
      ]
    })
    .Class({
      constructor: function() {
        // app.WebBan.infor = "希望在父组中定义子组建的属性值怎么就失败了？"
      }
    });

})(window.app || (window.app = {}));