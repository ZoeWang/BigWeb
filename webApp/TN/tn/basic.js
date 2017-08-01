seajs.use(['full-page'], function(fullPage) {


    /*!
     * jquery.drawDoughnutChart.js
     * Version: 0.3(Beta)
     * Inspired by Chart.js(http://www.chartjs.org/)
     *
     * Copyright 2013 hiro
     * https://github.com/githiro/drawDoughnutChart
     * Released under the MIT license.
     * 
     */
    ;(function($, undefined) {
      $.fn.drawDoughnutChart = function(data, options) {
        var $this = this,
          W = $this.width(),
          H = $this.height(),
          centerX = W/2,
          centerY = H/2,
          cos = Math.cos,
          sin = Math.sin,
          PI = Math.PI,
          settings = $.extend({
            segmentShowStroke : true,
            segmentStrokeColor : "rgba(228,247,243,0)",
            segmentStrokeWidth : 0,
            baseColor: "rgb(228,247,243)",
            baseOffset: 4,
            edgeOffset : 0,//offset from edge of $this
            percentageInnerCutout : 75,
            animation : true,
            animationSteps : 90,
            animationEasing : "easeInOutExpo",
            animateRotate : true,
            tipOffsetX: -8,
            tipOffsetY: -45,
            tipClass: "doughnutTip",
            summaryClass: "doughnutSummary",
            summaryTitle: "TOTAL:",
            summaryTitleClass: "doughnutSummaryTitle",
            summaryNumberClass: "doughnutSummaryNumber",
            beforeDraw: function() {  },
            afterDrawed : function() {  },
            onPathEnter : function(e,data) {  },
            onPathLeave : function(e,data) {  }
          }, options),
          animationOptions = {
            linear : function (t) {
              return t;
            },
            easeInOutExpo: function (t) {
              var v = t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
              return (v>1) ? 1 : v;
            }
          },
          requestAnimFrame = function() {
            return window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function(callback) {
                window.setTimeout(callback, 1000 / 60);
              };
          }();

        settings.beforeDraw.call($this);

        var $svg = $('<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>').appendTo($this),
            $paths = [],
            easingFunction = animationOptions[settings.animationEasing],
            doughnutRadius = Min([H / 2,W / 2]) - settings.edgeOffset,
            cutoutRadius = doughnutRadius * (settings.percentageInnerCutout / 100),
            segmentTotal = 0;

        //Draw base doughnut
        var baseDoughnutRadius = doughnutRadius + settings.baseOffset,
            baseCutoutRadius = cutoutRadius - settings.baseOffset;
        var drawBaseDoughnut = function() {
            //Calculate values for the path.
            //We needn't calculate startRadius, segmentAngle and endRadius, because base doughnut doesn't animate.
            var startRadius = -1.570,// -Math.PI/2
                segmentAngle = 6.2831,// 1 * ((99.9999/100) * (PI*2)),
                endRadius = 4.7131,// startRadius + segmentAngle
                startX = centerX + cos(startRadius) * baseDoughnutRadius,
                startY = centerY + sin(startRadius) * baseDoughnutRadius,
                endX2 = centerX + cos(startRadius) * baseCutoutRadius,
                endY2 = centerY + sin(startRadius) * baseCutoutRadius,
                endX = centerX + cos(endRadius) * baseDoughnutRadius,
                endY = centerY + sin(endRadius) * baseDoughnutRadius,
                startX2 = centerX + cos(endRadius) * baseCutoutRadius,
                startY2 = centerY + sin(endRadius) * baseCutoutRadius;
            var cmd = [
              'M', startX, startY,
              'A', baseDoughnutRadius, baseDoughnutRadius, 0, 1, 1, endX, endY,
              'L', startX2, startY2,
              'A', baseCutoutRadius, baseCutoutRadius, 0, 1, 0, endX2, endY2,//reverse
              'Z'
            ];
            $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
              .attr({
                "d": cmd.join(' '),
                "fill": settings.baseColor
              })
              .appendTo($svg);
        }();

        //Set up pie segments wrapper
        var $pathGroup = $(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
        $pathGroup.attr({opacity: 0}).appendTo($svg);

        //Set up tooltip
        /*var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('body').hide(),
            tipW = $tip.width(),
            tipH = $tip.height();*/

        //Set up center text area
        var summarySize = (cutoutRadius - (doughnutRadius - cutoutRadius)) * 2,
            $summary = $('<div class="' + settings.summaryClass + '" />')
                       .css({ 
                         width: summarySize + "px",
                         height: summarySize + "px",
                         "margin-left": -(summarySize / 2) + "px",
                         "margin-top": -(summarySize / 2) + "px"
                       });
        var $summaryTitle = $('<p class="' + settings.summaryTitleClass + '">' + settings.summaryTitle + '</p>');
        var $summaryNumber = $('<p class="' + settings.summaryNumberClass + '"></p>').css({opacity: 0});

        for (var i = 0, len = data.length; i < len; i++) {
          segmentTotal += data[i].value;
          $paths[i] = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
            .attr({
              "stroke-width": settings.segmentStrokeWidth,
              "stroke": settings.segmentStrokeColor,
              "fill": data[i].color,
              "data-order": i
            })
            .appendTo($pathGroup)
            .on("mouseenter", pathMouseEnter)
            .on("mouseleave", pathMouseLeave)
            .on("mousemove", pathMouseMove);
        }

        //Animation start
        animationLoop(drawPieSegments);

        function pathMouseEnter(e) {
          var order = $(this).data().order;
          $tip.text(data[order].title + ": " + data[order].value)
              .fadeIn(200);
          settings.onPathEnter.apply($(this),[e,data]);
        }
        function pathMouseLeave(e) {
          $tip.hide();
          settings.onPathLeave.apply($(this),[e,data]);
        }
        function pathMouseMove(e) {
          $tip.css({
            top: e.pageY + settings.tipOffsetY,
            left: e.pageX - $tip.width() / 2 + settings.tipOffsetX
          });
        }
        function drawPieSegments (animationDecimal) {
          var startRadius = -PI / 2,//-90 degree
              rotateAnimation = 1;
          if (settings.animation && settings.animateRotate) rotateAnimation = animationDecimal;//count up between0~1

          drawDoughnutText(animationDecimal, segmentTotal);

          $pathGroup.attr("opacity", animationDecimal);

          //draw each path
          for (var i = 0, len = data.length; i < len; i++) {
            var segmentAngle = rotateAnimation * ((data[i].value / segmentTotal) * (PI * 2)),
                endRadius = startRadius + segmentAngle,
                largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0,
                startX = centerX + cos(startRadius) * doughnutRadius,
                startY = centerY + sin(startRadius) * doughnutRadius,
                endX2 = centerX + cos(startRadius) * cutoutRadius,
                endY2 = centerY + sin(startRadius) * cutoutRadius,
                endX = centerX + cos(endRadius) * doughnutRadius,
                endY = centerY + sin(endRadius) * doughnutRadius,
                startX2 = centerX + cos(endRadius) * cutoutRadius,
                startY2 = centerY + sin(endRadius) * cutoutRadius;
            var cmd = [
              'M', startX, startY,//Move pointer
              'A', doughnutRadius, doughnutRadius, 0, largeArc, 1, endX, endY,//Draw outer arc path
              'L', startX2, startY2,//Draw line path(this line connects outer and innner arc paths)
              'A', cutoutRadius, cutoutRadius, 0, largeArc, 0, endX2, endY2,//Draw inner arc path
              'Z'//Cloth path
            ];
            $paths[i].attr("d", cmd.join(' '));
            startRadius += segmentAngle;
          }
        }

        function drawDoughnutText(animationDecimal, segmentTotal) {
          $summaryNumber
            .css({opacity: animationDecimal})
            .text((segmentTotal * animationDecimal).toFixed(1));
        }
        function animateFrame(cnt, drawData) {
          var easeAdjustedAnimationPercent =(settings.animation)? CapValue(easingFunction(cnt), null, 0) : 1;
          drawData(easeAdjustedAnimationPercent);
        }
        function animationLoop(drawData) {
          var animFrameAmount = (settings.animation)? 1 / CapValue(settings.animationSteps, Number.MAX_VALUE, 1) : 1,
              cnt =(settings.animation)? 0 : 1;
          requestAnimFrame(function() {
              cnt += animFrameAmount;
              animateFrame(cnt, drawData);
              if (cnt <= 1) {
                requestAnimFrame(arguments.callee);
              } else {
                settings.afterDrawed.call($this);
              }
          });
        }
        function Max(arr) {
          return Math.max.apply(null, arr);
        }
        function Min(arr) {
          return Math.min.apply(null, arr);
        }
        function isNumber(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        }
        function CapValue(valueToCap, maxValue, minValue) {
          if (isNumber(maxValue) && valueToCap > maxValue) return maxValue;
          if (isNumber(minValue) && valueToCap < minValue) return minValue;
          return valueToCap;
        }
        return $this;
      };
    })(jQuery);

    var config = {
        last_height: ['167px', '176px', '315px'],
        this_height: ['261px', '320px', '585px'],
        last_height_delay: ['0.3s', '0.3s', '0.3s'],
        this_height_delay: ['1.8s', '2.4s', '3.0s'],
        last_num_delay: ['0.9s', '0.9s', '0.9s'],
        this_num_delay: ['2.4s', '3.0s', '3.5s'],
        baseline_delay: ['0.3s', '0.3s', '0.3s'],
        circle_value: [0.25, 0.35, 0.50],
        circle_delay: [1300, 3700, 6100],
        circle_head_delay: ['0.5s', '2.9s', '5.3s'],
        circle_foot_delay: ['2.1s', '4.5s', '6.9s'],
        chart_value_delay: ['0.6s', '0.8s', '1s', '1.2s'],
        circle_color: ['rgb(0,126,192)', 'rgb(92,209,226)', 'rgb(0,173,130)']
    }
    $('.last-year > div').each(function(i){
        $(this).find('div').css('height', config.last_height[i]);
        $(this).find('span').css('-webkit-transition-delay', config.last_num_delay[i]);
        $(this).find('div').css('-webkit-transition-delay', config.last_height_delay[i]);
    });
    $('.this-year > div').each(function(i){
        $(this).find('div').css('height', config.this_height[i]);
        $(this).find('span').css('-webkit-transition-delay', config.this_num_delay[i]);
        $(this).find('div').css('-webkit-transition-delay', config.this_height_delay[i]);
    });


    function refreshNum(target, num, time){
        var param = 0;
        var interval = setInterval(function(){
            target.html(param + '% ');
            param++;
            if(param > num){
                clearInterval(interval);
            }
        }, time/num);
    }




    function startAnimation_1(){
        $('.income').addClass('income-animation');
        setTimeout(function(){
            $('.page').eq(1).find('.page-title').addClass('word-fade');
        }, 500); 
        $('.chart-value').each(function(i){
            $(this).css('-webkit-transition-delay', config.chart_value_delay[i]);
        });
    }
    function resetAnimation_1(){
        $('.page').eq(1).find('.page-title').removeClass('word-fade');

        $('.income').removeClass('income-animation');
    }

    function startAnimation_4(){
        setTimeout(function(){
            $('.page').eq(4).find('.page-title').addClass('word-fade');
        }, 500); 
        $('.circle').addClass('circle-animation');
        $('.one-circle').each(function(i){
            var self = $(this);

            var value = 360 * config.circle_value[i];
            self.find('.cover').css('-webkit-transform', 'rotate('+value+'deg)');
            self.find('.circle-head').css('-webkit-transition-delay', config.circle_head_delay[i]);
            self.find('.circle-foot').css('-webkit-transition-delay', config.circle_foot_delay[i]);
            self.find('.cover').css('-webkit-transition-delay', config.circle_delay[i]);
            self.css('-webkit-transition-delay', config.circle_delay[i]/1000.0 + 's');
            // refreshNum(self.find('strong'), config.circle_value[i] * 100, 800);
            setTimeout(function(){
                refreshNum(self.find('strong'), config.circle_value[i] * 100, 800);
            },1800 + i * 2400);
        });

        $(function(){
            $('.one').each(function(i){
                var circles = $(this);
                var times = setTimeout(function(){
                    circles.drawDoughnutChart([
                        { title: "", value : config.circle_value[i] * 100,  color:  config.circle_color[i] },
                        { title: "", value:  100 - config.circle_value[i] * 100,   color: 'rgb(228,247,243)' }
                    ]);
                }, config.circle_delay[i]);
            });
        });

    }
    function resetAnimation_4(){
        $('.circle').removeClass('circle-animation');
        $('.page').eq(4).find('.page-title').removeClass('word-fade');

        $('.one-circle').each(function(i){
            var self = $(this);
            self.find('.cover').css('-webkit-transform', 'rotate(0deg)');
            self.find('.circle-head').css('-webkit-transition-delay', 0);
            self.find('.circle-foot').css('-webkit-transition-delay', 0);
            self.find('.cover').css('-webkit-transition-delay', 0);
            self.css('-webkit-transition-delay', 0);
        });
        $('.wrapper-circle').find('strong').html('0%');
        $('svg').remove();
    }

    function startAnimation_2(){
        setTimeout(function(){
            $('.page').eq(2).find('.page-title').addClass('word-fade');
        }, 500);
        $('.point').addClass('point-animation');
    }
    function resetAnimation_2(){
        $('.page').eq(2).find('.page-title').removeClass('word-fade');

        $('.point').removeClass('point-animation');
    }


        var startAnimation_3 = function(){
            var count = 0;
            function redCircle(id,time){
                setTimeout(function(){
                    $('#'+id).addClass('circle-skip');
                },time);
            };
            setTimeout(function(){
                $('.page').eq(3).find('.page-title').addClass('word-fade'); 
                $('.dot-line').addClass('right-last');
                $('.dot1-circle').css('opacity','1').addClass('dot-blank');
                $('.distct-list li').eq(0).addClass('circle-skip');
            },500);
            setTimeout(function(){
                $('.dot2-circle').css('opacity','1').addClass('dot-blank');
                $('.distct-list li').eq(1).addClass('circle-skip');
            },1000);
            setTimeout(function(){
                $('.dot3-circle').css('opacity','1').addClass('dot-blank');
                $('.distct-list li').eq(2).addClass('circle-skip');
            },1500);
            setTimeout(function(){
                $('.dot4-circle').css('opacity','1').addClass('dot-blank');
                $('.distct-list li').eq(3).addClass('circle-skip');
                $('.map-desc .distct-desc').css('opacity','1').addClass('dot-blank');
            },2000);
            for(var i=1;i<51;i++) {
                var cirName = 'redb'+i;
                redCircle(cirName,1000+i*100);
            }
        }
        var resetAnimation_3 = function(){
            
            $('.page').eq(3).find('.page-title').removeClass('word-fade');

            $('#brCount').html('0');
            $('.red-branch').removeClass('circle-skip');
        }
        var personStopTime = new Array();
        var personStopInter = new Array();
        var startAnimation_5 = function(){
            var personItem = '<div class="person"></div>';
            var personAdd1 = 0;
            var personAdd2 = 0;
            var personAdd3 = 0;
            var personSt1 = setTimeout(function(){
                var prsChange = 0;
                $('#personList li').eq(0).css('opacity','1');
                personAdd1 = setInterval(function(){
                    if(prsChange == 3) {
                        clearInterval(personAdd1);
                    }else {
                        prsChange++;
                        $('#personList li').eq(0).prepend(personItem);
                    }
                },500);
                personStopInter[0] = personAdd1;
                $('.page').eq(5).find('.page-title').addClass('word-fade'); 
                countSkip('personCount1',280953);
            },500);
            var personSt2 = setTimeout(function(){
                var prsChange = 0;
                $('#personList li').eq(1).css('opacity','1');
                personAdd2 = setInterval(function(){
                    if(prsChange == 6) {
                        clearInterval(personAdd2);
                    }else {
                        prsChange++;
                        $('#personList li').eq(1).prepend(personItem);
                    }
                },500);
                personStopInter[1] = personAdd2;
                countSkip('personCount2',549228);
            },3000);
            var personSt3 = setTimeout(function(){
                var prsChange = 0;
                $('#personList li').eq(2).css('opacity','1');
                personAdd3 = setInterval(function(){
                    if(prsChange == 9) {
                        clearInterval(personAdd3);
                    }else {
                        prsChange++;
                        $('#personList li').eq(2).prepend(personItem);
                    }
                },500);
                personStopInter[2] = personAdd3;
                countSkip('personCount3',792938);
            },6500);
            if(personSt1>=0 || personSt2>=0 || personSt3 >=0) {
                personStopTime[0] = personSt1;
                personStopTime[1] = personSt2;
                personStopTime[2] = personSt3;
            }
            setTimeout(function(){
                $('#distDesc1').css('opacity','1');
            },11000);
        }
        var countSkip = function(id,num){
            var cntChange = 0;
            var upPlus = 0;
            var csk = setInterval(function(){
                upPlus = Math.floor(Math.random()*20000);
                if(cntChange >= num) {
                    $('#'+id).html(num);
                    clearInterval(csk);
                }else {
                    cntChange = cntChange + upPlus;
                    $('#'+id).html(cntChange);
                }
            },50);
        }
        var resetAnimation_5 = function(){
            for(var j=0;j<=2;j++) {
                clearInterval(personStopInter[j]);
            }
            for(var i=0;i<=2;i++) {
                clearTimeout(personStopTime[i]);
            }
            $('.page').eq(5).find('.page-title').removeClass('word-fade');
            $('#personList li').find('.person').remove();
            $('#personCount1').html('0');
            $('#personCount2').html('0');
            $('#personCount3').html('0');
        }
        var startAnimation_6 = function(){
            setTimeout(function(){
                $('#distDesc2').addClass('botdesc-up');
            },500);
        }
        var resetAnimation_6 = function(){
            $('#distDesc2').removeClass('botdesc-up');
        }
        var startAnimation_7 = function(){
            setTimeout(function(){
                $('#distDesc3').addClass('botdesc-up');
            },500);
        }
        var resetAnimation_7 = function(){
            $('#distDesc3').removeClass('botdesc-up');
        }
        var startAnimation_8 = function(){
            $('.arrow-up').hide();
            setTimeout(function(){
                $('#linkBtn').addClass('skipUp');
            },500);
        }
        var resetAnimation_8 = function(){
            $('.arrow-up').show();
            $('#linkBtn').removeClass('skipUp');
        }
        var startAnimation_0 = function(){
        }
        var resetAnimation_0 = function(){
        }



    var options = {
        grand: $('.wrap'),
        father: $('.pages'),
        children: $('.page'),
        during: '0.6s',
        basic: 1,
        whenScroll: function(self){
            var action_id = self.globals.index;
            var next_id = action_id + 1;
            var last_id = action_id - 1;
            eval('startAnimation_'+action_id+'();');

            if(next_id <= 8){
                eval('resetAnimation_'+next_id+'();');
                $('.page').eq(next_id).addClass('page-no-transition');
            }
            if(last_id > 0){
                eval('resetAnimation_'+last_id+'();');
                $('.page').eq(last_id).addClass('page-no-transition');

            }
            $('.page').eq(action_id).removeClass('page-no-transition');




            /*if(self.globals.index == 0){
                // startAnimation_0();
            }else{
                // resetAnimation_0();
            }
            if(self.globals.index == 1){
                startAnimation_1();
            }else{
                resetAnimation_1();
            }
            if(self.globals.index == 2){
                startAnimation_2()
            }else{
                resetAnimation_2()
            }
            if(self.globals.index == 3){
                startAnimation_3();
            }else{
                resetAnimation_3();
            }
            if(self.globals.index == 4){
                startAnimation_4();
            }else{
                resetAnimation_4()
            }
            if(self.globals.index == 5){
                startAnimation_5();
            }else{
                resetAnimation_5();
            }
            if(self.globals.index == 6){
                startAnimation_6();
            }else{
                resetAnimation_6();
            }
            if(self.globals.index == 7){
                startAnimation_7();
            }else{
                resetAnimation_7();
            }
            if(self.globals.index == 8){
                startAnimation_8();
                
            }else{
                resetAnimation_8();
            }*/
        }
    }
    var scrolls = fullPage.init(options);
});
