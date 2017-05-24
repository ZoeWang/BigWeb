(function(app) {

  app.WebBan = ng.core
    .Component({
        selector:'app-ban',
        styles:[`
            .btn-red{cursor: pointer;}
          `],
        properties:["h1","infor","text1","text2"],//怎么感觉可有可无呢？
        templateUrl:'app/html/app.WebBan.html'
    })
    .Class({
      constructor: function() {
        this.infor="极客学院－IT职业在线教育第一品牌 | 千万级美元B轮融资";
        this.h1="成为年薪20万的HTML/Web工程师";
        this.text1="4个月达成目标";
        this.text2="75%转行成功率";
      },
      videoA:function(){
        $("#vMask").css('display','block');
        var videoA = document.getElementById("videoA");
        videoA.play();
      },
      closeVideo:function(){
        var videoA = document.getElementById("videoA");
        videoA.pause();
        $("#vMask").css('display','none');
      },
      alertHaha:function(){
        var aa = "怎么把var改为let就报错啦，不是说好了可以用es6吗？";
        alert(aa);
      }
    });

})(window.app || (window.app = {}));