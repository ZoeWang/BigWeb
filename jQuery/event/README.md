# jQuery事件处理机制能帮我们处理那些问题？
<ul>
  <li>解决浏览器事件兼容问题</li>
  <li>可以在一个事件类型上添加多个事件处理函数，可以一次添加多个事件类型的事件处理函数</li>
  <li>提供了常用事件的便捷方法</li>
  <li>支持自定义事件</li>
  <li>扩展了组合事件</li>
  <li>提供了统一的事件封装、绑定、执行、销毁机制</li>
</ul>

## 事件绑定接口
bind  unbind <br/>
delegate   undelegate <br/>
on   one  off <br/>
trigger   triggerHandler 

## jQuery的事件绑定有多个方法可以调用，以click事件来举例

```
$('#foo').click(function(){ })

$('#foo').bind('click',function(){ })

$("foo").delegate("td", "click", function() { });

$("foo").on("click", "td", function() { });
```
<p>推荐第四种</p>

# 源码分析

```
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

        // Handle event binding
        jQuery.fn[ name ] = function( data, fn ) {
            return arguments.length > 0 ?
                this.on( name, null, data, fn ) :
                this.trigger( name );
                
bind: function( types, data, fn ) {
    return this.on( types, null, data, fn );
},
unbind: function( types, fn ) {
    return this.off( types, null, fn );
},
delegate: function( selector, types, data, fn ) {
    return this.on( types, selector, data, fn );
},
undelegate: function( selector, types, fn ) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
}
```

# 事件委托
<p>给父元素绑定事件，子元素也能响应</p>

```
element.on('click','p',function(){})

jQuery.fn.on  
|
jQuery.event.add   --- 给选中元素注册事件处理程序
|
jQuery.event.dispatch   --- 分派（执行）事件处理函数
|
jQuery.event.fix   --- fix修正Event对象
|
jQuery.event.handlers   --- 组装事件处理器队列
|
执行事件处理函数
```
<p>jQuery并没有将事件处理函数直接绑定到DOM元素上，而是通过.data存储在缓存.cahce上，这里就是之前分析的贯穿整个体系的缓存系统了</p>

## on
```
.on( events [, selector ] [, data ], handler(eventObject) )

events：事件名

selector : 一个选择器字符串，用于过滤出被选中的元素中能触发事件的后代元素

data :当一个事件被触发时，要传递给事件处理函数的

handler:事件被触发时，执行的函数

var body = $('body')
body.on(‘click’,’p’,{“aa”:”sss"}function(){
    console.log(this)
})

jQuery.fn.one = function( types, selector, data, fn ) {
    return this.on( types, selector, data, fn, 1 );
};
jQuery.fn.bind = function( types, data, fn ) {
    return this.on( types, null, data, fn );
};

jQuery.fn.live = function( types, data, fn ) {
    jQuery( this.context ).on( types, this.selector, data, fn );
    return this;
};


jQuery.fn.delegate = function( selector, types, data, fn ) {
    return this.on( types, selector, data, fn );
};
```


