function ready(fn) {

    function completed2(){alert("我的load事件加载的,这是为了保证在不支持DOMContentLoaded的情况下仍在正常加载")};
    function completed(){

        //清除所有的事件监听
        if ( document.addEventListener ) {
            document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
            window.removeEventListener( "load", arguments.callee, false );
        } else {
            document.detachEvent( "onreadystatechange", arguments.callee );
            window.detachEvent( "onload", arguments.callee );
        }

        fn();//执行回调

    }


    if ( document.readyState === "complete" ) {
        // 监听时页面已加载完，直接执行，模拟事件触发形式异步执行
        setTimeout( completed );
        // DOMContentLoaded 事件绑定
    } else if ( document.addEventListener ) { //高级浏览器
        document.addEventListener( "DOMContentLoaded", completed, false );
        window.addEventListener( "load", completed2, false );

        // IE低版本
    } else {
        document.attachEvent( "onreadystatechange", function(e){
            if (document.readyState != 'loading'){
                completed(e);
            }
        } );
        window.attachEvent( "onload", completed );
    }



}

// 测试
ready(function(){
    alert("load")
})