## jQuery ready方法详解

### document.readyState
##### 判断文档是否加载完成。
firefox不支持。这个属性是只读的，传回值有以下的可能：

* 0-UNINITIALIZED：XML 对象被产生，但没有任何文件被加载。
* 1-LOADING：加载程序进行中，但文件尚未开始解析。
* 2-LOADED：部分的文件已经加载且进行解析，但对象模型尚未生效。
* 3-INTERACTIVE：仅对已加载的部分文件有效，在此情况下，对象模型是有效但只读的。
* 4-COMPLETED：文件已完全加载，代表加载成功。

### document.addEventListener
##### 用于向指定元素添加事件句柄。
Internet Explorer 8 及更早IE版本不支持 addEventListener() 方法，，Opera 7.0 及 Opera 更早版本也不支持。 但是，对于这些不支持该函数的浏览器，可以使用 attachEvent() 方法来添加事件句柄。

### jQuery.Deferred
##### deferred对象就是jQuery的回调函数解决方案
在英语中，defer的意思是"延迟"，所以deferred对象的含义就是"延迟"到未来某个点再执行。

### DOMContentLoaded
* DOMContentLoaded事件要在window.onload之前执行
* 当DOM树构建完成的时候就会执行DOMContentLoaded事件
* window.onload是在页面载入完成的时候，才执行，这其中包括图片等元素
* 目前已在HTML5中被标准化

### document.onreadystatechange
##### 当页面加载状态改变的时候执行
* document.onreadystatechange 只能在ie中使用
* document.onreadystatechange = subSomething;//当页面加载状态改变的时候执行这个方法.

### document.documentElement and document.body
##### 节点
* HTML里是document.body  --XHTML里是document.documentElement ,都指的是节点(OR元素)
* document.body.scrollTop属性在xhtml标准网页或者更简单的说是带<!DOCTYPE ..>标签的页面里得到的结果是0，如果不要此标签则一切正常。那么在xhtml页面怎么获得body的坐标呢?当然有办法-使用document.documentElement来取代document.body

### window.load
* 执行时机：必须等待页面中所有的内容加载完毕（包括图片）才执行
* 编写个数：一个
``` javascript
window.onload = function(){
    alert("haha");
};
window.onload = function(){
    alert("lala");
};
//结果只输出第二个
```

* 简化写法：无

### $(doucment).ready()
* 执行时机：页面中所有DOM结构绘制完毕后就执行，可能DOM元素关联的内容并没有加载完
* 编写个数：多个
``` javascript
$(document).ready(function(){
    alert("haha");
});
$(document).ready(function(){
    alert("lala");
});
//结果两个都会被输出
```

* 简化写法：
```
$(function(){
    //do something
});
```