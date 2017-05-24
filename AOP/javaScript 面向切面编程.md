# 面向切面的概念解读
<p>Aspect Oriented Programming(AOP)，面向切面编程，是一个比较热门的话题。AOP主要实现的目的是针对业务处理过程中的切面进行提取，它所面对的是处理过程中的某个步骤或阶段，以获得逻辑过程中各部分之间低耦合性的隔离效果。
</p>
<p>用刀切面包或用锯子锯木头，暴露在我们面前的横断面即为切面。面向切面编程有自身的很多优点，可以对已有的代码，进行无切入式的干扰。AOP的主要目的，是对业务过程中的切面进行提取。它所面对的，是处理过程中业务的某个步骤或阶段。即往已经存在的业务逻辑中穿插了一些代码。我们有干扰代码时，可以对业务逻辑进行干预，无干扰代码时，不会影响到原来任何的业务逻辑。</p>

# 相关技术要点回顾

<p>JavaScript的prototype </p>
<p>JavaScript的prototype返回对象类型原型的引用，使我们有能力向对象添加属性和方法。</p>
```
<script>
<script type="text/javascript">
function employee(name,job,born)
{
this.name=name;
this.job=job;
this.born=born;
}

var bill=new employee("Bill Gates","Engineer",1985);
employee.prototype.salary=null;
bill.salary=20000;

document.write(bill.salary);
</script>
```
<p>JavaScript的apply</p>
<p>apply方法能劫持另外一个对象的方法，继承另外一个对象的属性</p>
<p>Function.apply(obj,args)方法接收两个参数</p>
<p>obj：这个对象将代替Function类里this对象</p>
<p>args：这个是数组，它将作为参数传给Function（args-->arguments）</p>

<p>apply 示例代码如下：</p>

```
<script type="text/javascript">
function Person(name,age){   //定义一个类，人类  
    this.name=name;     //名字
    this.age=age;       //年龄
    this.sayhello=function(){alert("hello")};
}
function Print(){            //显示类的属性
    this.funcName="Print";
    this.show=function(){
        var msg=[];
        for(var key in this){
            if(typeof(this[key])!="function"){
                msg.push([key,":",this[key]].join(""));
            }
        }
        alert(msg.join(" "));
    };
} 
function Student(name,age,grade,school){    //学生类 
    Person.apply(this,arguments);
    Print.apply(this,arguments);
    this.grade=grade;                //年级 
    this.school=school;                 //学校 
} 
var p1=new Person("jake",10);
p1.sayhello();
var s1=new Student("tom",13,6,"清华小学");
s1.show();
s1.sayhello();
alert(s1.funcName);
</script>
```

# JS 面向切面代码实战
<p>1、创建HTML文件</p>
<p>2、创建js文件aop.js</p>
<p>3、在HTML文件中引入aop.js</p>
<p>4、在aop.js中编写代码</p>

```
function test()
{
　　alert(2);
}

window.onload = function() { test(); }
```
<p>实现的目的现在需要统计一下当前页面所有的函数运行谁耗时最长，然后做相应的性能优化</p>

## 通用的做法：
```
function test()
{
　　var start = new Date();

　　alert(2);

　　var end= new Date();
　　//console.log(end - start);
}
```
<p>插入污染变量，埋点，输出或返回！</p>

## AOP的做法
```
function test() { alert(2);} //原来的业务逻辑函数

Function.prototype.before = function(fn){
　　//干扰代码
}
Function.prototype.after = function(fn){
　　//干扰代码
}

test.before(function(){
　　//想执行的具体内容
});
test.after(function(){
　　//想执行的具体内容
});
```
### 如何做到先执行before，再执行test？
```
function test() { alert(2);}

Function.prototype.before = function(fn)
{
　　//问：如何做到before在test之前执行？答：先执行fn，然后当前的函数再执行
　　//问：如何拿到当前的test？答：使用this就行了
　　var __self = this; //把this先保留下来，以便以后使用
　　fn();//执行自己
　　__self.apply(this,arguments);//再执行test
}

test.before(function(){
　　//想执行的具体内容
　　alter(1);
});
```

### 如何做到先执行test，再执行after？
```
function test() { alert(2);}

Function.prototype.after = function(fn){
//如何做到在函数执行之后再执行？答：先执行this函数本身，再执行回调
    var __self = this;
    __self.apply(this,arguments);//先执行test
    fn();//再执行自己
};

test.after(function(){
　　//想执行的具体内容
　　alter(3);
});
```

### test中有返回值的处理
```
function test() {
　　alert(2);
　　return “我要返回！！”;
}
Function.prototype.before = function(fn)
{
　　var __self = this; //把this先保留下来，以便以后使用
　　fn();//执行自己
　　return __self.apply(this,arguments);//加return进行test值返回
}
test.before(function(){ alter(1);});
```

### 整理后代码结果

```
function test() { alert(2);}

Function.prototype.before = function(fn)
{　　var __self = this; //把this先保留下来，以便以后使用
　　fn();//执行自己
　　__self.apply(this,arguments);//再执行test
}

Function.prototype.after = function(fn)
{　　var __self = this;
　　__self.apply(this,arguments);//先执行test
　　fn();//再执行自己
};
test.before(function(){　alter(1); 　});
test.after(function(){　alter(3); 　});
```
<p>默认函数被执行了两次，怎么办？</p>

### 以test作为中转，将before的回调和before一起送到after去也可以将after和test一起送到before去

```
function test() { alert(2);}

Function.prototype.before = function(fn){
    var __self = this;
    //增加回调，挂载self，并改写before的fn
    return function(){
        fn.apply(this,arguments);
        __self.apply(this,arguments);
    };
}; 

test.before(function(){　alter(1); 　})();
```

### before中this指针的变化

```
function test() { alert(2);}

Function.prototype.before = function(fn)
{　　var __self = this; //把this先保留下来，以便以后使用
　　return function(){
　　　　//此时this的指向已经发生了改变，被returne出去了，变成了window
　　　　//console.log(this);
　　　　fn.apply(this,arguments);//执行自己
　　　　__self.apply(this,arguments);//再执行test
　　}
}

test.before(function(){　alter(1); 　})();
```
### 保留this指针

```
function test() { alert(2);}

Function.prototype.before = function(fn)
{　　var __self = this; //把this先保留下来，以便以后使用
　　return function(){
　　　　//保留this指针
　　　　fn,apply(__self,arguments);//执行自己
　　　　__self.apply(__self,arguments);//再执行test
　　}
}

test.before(function(){　alter(1); 　})();
```

### 相应改写after,用原型链执行

```
function test() { alert(2);}

Function.prototype.after = function(fn){ //这里的fn为before返回回来的结果
    var __self = this;
    return function(){
        __self.apply(__self,arguments);
        fn.apply(this,arguments);
    };
};
test.before(function(){
    alert(1);
}).after(function(){   
  // 当前this 指向 before 返回的function 不在指向 test 即__self 指向window 本身 undefined
    alert(3);
})();
```
<p>//挂载self=>test，执行before回调，执行self，after自己执行回调</p>

### 终止挂载

```
function test() { alert(2);}

Function.prototype.before = function(fn)
{　　var __self = this; //把this先保留下来，以便以后使用
　　return function(){
　　　　if(fn(__self,arguments)==false){ return false; };
　　　　__self.apply(__self,arguments);//再执行test
　　}
}
test.before(function(){
    alert(1);
    return false;
}).after(function(){
    alert(3);
})();
```
<p>//挂载self=>test，执行before回调，执行self，after自己执行回调</p>

```
function test() { alert(2); }

Function.prototype.after = function(fn){
    var __self = this;
    return function(){
        if(__self.apply(__self,arguments) == false)
	{ return false; };
        fn.apply(this,arguments);
    };
};
```

### 业务返回值的处理

```
function test() { alert(2); return “我要返回！！”;}

Function.prototype.before = function(fn){
    var __self = this;
    return function(){
        if(fn.apply(__self,arguments) == false)
        { return false; }
        return __self.apply(__self,arguments);
    };
};

Function.prototype.after = function(fn){
    var __self = this;
    return function(){
        var result = __self.apply(__self,arguments);
        if(result == false)
        { return false; }
        fn.apply(this,arguments);
        return result;
    };
};
```




