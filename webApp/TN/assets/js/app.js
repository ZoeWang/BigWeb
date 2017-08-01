// income
function histogram(){//highcharts 柱状图
    $('#income').highcharts({
        chart: {
            type: 'column'  //柱状图
        },
        title: {
            text: ''    //图标标题
        },
        xAxis: {    //图标横坐标
            categories: ['13Q1 VS 14Q1', '13Q2 VS 13Q2', '13Q3 VS 14Q3']    
        },
        yAxis: {    //图标纵坐标
            min: 0,
            title: {
                text: ''
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -70,
            verticalAlign: 'top',
            y: 20,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.x +'</b><br>'+
                    this.series.name +': '+ this.y +'<br>'+
                    'Total: '+ this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                }
            }
        },
        series: [{  //刻度值
            name: '2014',
            data: [5, 3, 4]
        }, {
            name: '2013',
            data: [2, 2, 3]
        }],
        credits: {  //图表右下角水印
            text: 'Hifang.com',
            href: 'http://www.baidu.com'
        }
    });
}

function startAnimation_1(){ //income 加动画
    setTimeout(function(){
        $('.section').eq(1).find('.page-title').addClass('word-fade'); //标题逐渐显示 word-fade css3 动画
    }, 500); 
}
function resetAnimation_1(){
    $('.section').eq(1).find('.page-title').removeClass('word-fade');   //去掉标题动画
}




// point
function startAnimation_2(){
    setTimeout(function(){
        $('.section').eq(2).find('.page-title').addClass('word-fade');  //标题逐渐显示 word-fade css3 动画
    }, 500);
    $('.point').addClass('point-animation');  //suk 曲线点旋转动画
}
function resetAnimation_2(){
    $('.section').eq(2).find('.page-title').removeClass('word-fade'); //去掉标题动画

    $('.point').removeClass('point-animation'); //去掉suk 曲线点旋转动画
}


// map
 var startAnimation_3 = function(){
    var count = 0;
    function redCircle(id,time){  //添加地图上的点 的动画及出现时间
        setTimeout(function(){
            $('#'+id).addClass('circle-skip');
        },time);
    };
    setTimeout(function(){
        $('.section').eq(3).find('.page-title').addClass('word-fade'); //标题逐渐显示 word-fade css3 动画
    },500);
    
    for(var i=1;i<20;i++) {
        var cirName = 'redb'+i;
        redCircle(cirName,1000+i*100); //地图上的点循环的出现
    }
}
var resetAnimation_3 = function(){
    
    $('.section').eq(3).find('.page-title').removeClass('word-fade'); //去掉标题动画
    $('.red-branch').removeClass('circle-skip'); //去掉地图上的点的动画
}

// circle
function circle(){  //调用circles.js
    var colors = [
        ['#D3B6C6', '#4B253A'], ['#FCE6A4', '#EFB917'], ['#BEE3F7', '#45AEEA']
    ];

    for (var i = 1; i <= 3; i++) {
        var child = document.getElementById('circles-' + i),
            percentage = 31.42 + (i * 9.84);
            
        Circles.create({
            id:         child.id,
            percentage: percentage,
            radius:     60,
            width:      15,
            number:     percentage,
            text:       '%',
            colors:     colors[i - 1]
        });
    } 
}

function startAnimation_4(){
    setTimeout(function(){
        $('.section').eq(4).find('.page-title').addClass('word-fade'); //标题逐渐显示 word-fade css3 动画
    }, 500); 
}
function resetAnimation_4(){
    $('.section').eq(4).find('.page-title').removeClass('word-fade'); //去掉标题动画

}
        
// person
var personStopTime = new Array();
var personStopInter = new Array();
var startAnimation_5 = function(){
    var personItem = '<div class="person"></div>';
    var personAdd1 = 0;
    var personAdd2 = 0;
    var personAdd3 = 0;
    var personSt1 = setTimeout(function(){  //第一行添加小人图标
        var prsChange = 0;
        $('#personList li').eq(0).css('opacity','1');
        personAdd1 = setInterval(function(){    //每0.5秒循环一次
            if(prsChange == 3) {
                clearInterval(personAdd1);
            }else {
                prsChange++;
                $('#personList li').eq(0).prepend(personItem);
            }
        },500);
        personStopInter[0] = personAdd1;
        $('.section').eq(5).find('.page-title').addClass('word-fade'); //标题逐渐显示 word-fade css3 动画
        countSkip('personCount1',280953);   //图标后面的数字计算
    },500);
    var personSt2 = setTimeout(function(){ //第二行添加小人图标
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
        countSkip('personCount2',549228); //图标后面的数字计算
    },3000);
    var personSt3 = setTimeout(function(){ //第三行添加小人图标
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
        countSkip('personCount3',792938); //图标后面的数字计算
    },6500);
    if(personSt1>=0 || personSt2>=0 || personSt3 >=0) {
        personStopTime[0] = personSt1;
        personStopTime[1] = personSt2;
        personStopTime[2] = personSt3;

        console.log(personSt1,personSt2,personSt3);
    }
    setTimeout(function(){
        $('#distDesc1').css('opacity','1'); //下面文字显示动画效果
    },11000);
}
var countSkip = function(id,num){  //计算小人图标后面的数字
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
    $('.section').eq(5).find('.page-title').removeClass('word-fade');   //去掉标题动画
    $('#personList li').find('.person').remove(); //删除小人图标
    $('#personCount1').html('0');   //小人图标 后面的数字清零
    $('#personCount2').html('0');   //小人图标 后面的数字清零
    $('#personCount3').html('0');   //小人图标 后面的数字清零
}

var startAnimation_6 = function(){
    setTimeout(function(){ 
        $('#distDesc2').addClass('botdesc-up'); //添加下面文字的动画 css3 botdesc-up
    },500);
}
var resetAnimation_6 = function(){
    $('#distDesc2').removeClass('botdesc-up'); //去掉下面文字的动画
}
var startAnimation_7 = function(){
    setTimeout(function(){
        $('#distDesc3').addClass('botdesc-up'); //添加下面文字的动画 css3 botdesc-up
    },500);
}
var resetAnimation_7 = function(){
    $('#distDesc3').removeClass('botdesc-up');  //去掉下面文字的动画
}
var startAnimation_8 = function(){
    $('.arrow-up').hide(); //隐藏向上滑动图标
    setTimeout(function(){
        $('#linkBtn').addClass('skipUp'); //连接按钮添加动画效果 css3
    },500);
}
var resetAnimation_8 = function(){
    $('.arrow-up').show(); //显示向上滑动图标
    $('#linkBtn').removeClass('skipUp'); //连接按钮去掉动画效果
}

$(document).ready(function() {
    $.fn.fullpage({ //调用fullpage 全屏滚动插件
        slidesColor: ['#152E34', '#fff', '#fff', '#fff', '#fff','#fff','#fff','#fff', '#fff'],  //每一屏所对应的颜色
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7', 'page8', 'page9'], //每一屏所对应的名称
        afterLoad: function(anchorLink, index){ //加载页面时返回函数
            if(index == 2){
                histogram();
                startAnimation_1();
            }
            if(index == 3){
                startAnimation_2();
            }
            if(index == 4){
                startAnimation_3();
            }
            if(index == 5){
                circle();
                startAnimation_4();
            }
            if(index == 6){
                startAnimation_5();
            }
            if(index == 7){
                startAnimation_6();
            }
            if(index == 8){
                startAnimation_7();
            }
            if(index == 9){
                startAnimation_8();
            }
        },
        onLeave: function(index, direction){ //离开页面时返回函数
            if(index == '2'){
                resetAnimation_1();
            }
            if(index == '3'){
                resetAnimation_2();
            }
            if(index == '4'){
                resetAnimation_3();
            }
            if(index == 5){
                resetAnimation_4();
            }
            if(index == 6){
                resetAnimation_5();
            }
            if(index == 7){
                resetAnimation_6();
            }
            if(index == 8){
                resetAnimation_7();
            }
            if(index == 9){
                resetAnimation_8();
            }
        }

    });

 
});



