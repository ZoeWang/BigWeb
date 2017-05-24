# JavasScript设计模式
##  一、模块方法模式
###  定义：
模块方法模式是一种需要使用继承就可以实现的模式。
由2部分组成，第一部分是抽象父类，第二部分是具体的实现子类。
通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有的方法的执行顺序。子类通过继承这个抽象的类，也继承了整个算法结构，并且可以选择重写父类的方法。

###  例子：Coffer or Tea
####  1.泡一杯咖啡
首先我们泡一杯咖啡，基本步骤是：
* 把开水煮沸
* 用沸水冲泡咖啡
* 把咖啡倒入杯子
* 加糖和牛奶
```
var Coffee = function(){};

Coffee.prototype.boilWater = function(){
    console.log('把水煮沸');
}
Coffee.prototype.brewCoffee = function(){
    console.log('冲泡咖啡');
}
Coffee.prototype.pourInCup = function(){
    console.log('把咖啡倒入杯子');
}
Coffee.prototype.addSomething = function(){
    console.log('加糖和牛奶');
}

Coffee.prototype.init = function(){
    this.boilWater();
    this.brewCoffee();
    this.pourInCup();
    this.addSomething();
}

var coffee = new Coffee();
coffee.init();
```

####  2.泡一杯茶
和泡咖啡的步骤相差不大
* 把水煮沸
* 用沸水冲泡茶叶
* 把茶倒入杯子
* 加柠檬
```
var Tea = function(){};

Tea.prototype.boilWater = function(){
    console.log('把水煮沸');
}
Tea.prototype.brewTea = function(){
    console.log('冲泡茶叶');
}
Tea.prototype.pourInCup = function(){
    console.log('把茶倒入杯子');
}
Tea.prototype.addSomething = function(){
    console.log('加柠檬');
}

Tea.prototype.init = function(){
    this.boilWater();
    this.brewTea();
    this.pourInCup();
    this.addSomething();
}

var tea = new Tea();
tea.init();                                                      
```
####  3.分离出共同点
不管是泡咖啡还是泡茶都要经历以下几个步骤：
* 把水煮沸
* 用沸水冲泡原料
* 把成品倒入杯子
* 加配料
<p>所以，不管是泡什么原料，我们都可以给它一个新的方法名称，例如：brew( ) 。<br>
同理，不管是加什么配料，我们也可以给他一个新的方法名称，例如：add( ) 。<br>
因此，不管是泡什么东西，我们就可以给他一个新的父类名称，例如：Beverage( )。</p>
```
var Drunk = function(){};

Drunk.prototype.boil = function(){
    console.log('把水煮沸');
}
Drunk.prototype.brew = function(){
    throw new Error('子类必须重写brew方法');
}
Drunk.prototype.pour = function(){
    throw new Error('子类必须重写pour方法');
}
Drunk.prototype.add = function(){
    throw new Error('子类必须重写add方法');
}

Drunk.prototype.init = function(){
    this.boil();
    this.brew();
    this.pour();
    this.add();
}                                                    
```

####  4.创建coffee和tea子类
现在创建一个Drunk类的对象对我们来说没有意义，因为饮品有非常多种，在这里Drunk只是一个抽血的存在。接下来我们要创建咖啡喝茶类，让他们继承饮品Drunk类。
```
var Coffee = function(){};
Coffee.prototype = new Drunk();
//接下来需要重写抽象父类的一些方法，只有把水煮沸boil这个行为可以直接使用父类中boil的方法，其他方法都需要在Coffee子类中重写。
Coffee.prototype.brew = function(){
    console.log('用沸水冲泡咖啡');
}
Coffee.prototype.pour = function(){
    console.log('把咖啡倒入杯子');
}
Coffee.prototype.add = function(){
    console.log('加糖和牛奶');
}

var coffee = new Coffee();
coffee.init();
//我们的coffee已经完成，当调用coffee对象的init方法时，由于coffee对象和Coffee构造函数的原型prototype上都没有对应的init方法，所以该请求会顺着原型链，被委托给Coffee的父类Drunk原型上的init方法。
```
接下来照葫芦画瓢，来创建一下tea类
```
var Tea= function(){};
Tea.prototype = new Drunk();

Tea.prototype.brew = function(){
    console.log('用沸水冲泡茶叶');
}
Tea.prototype.pour = function(){
    console.log('把茶倒入杯子');
}
Tea.prototype.add = function(){
    console.log('加柠檬');
}

var tea = new Tea();
tea.init();
```

#### 5.总结
在上面栗子中，Drunk.prototype.init，就是所谓的模版方法。
因为方法中封装了子类的算法框架，它作为一个算法的模版，指导子类以何种顺序去执行哪些方法。在Drunk.prototype.init方法中，算法内的每一个步骤都是清楚展现在我们眼前的。


##二、职责链模式

### 定义：
使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理为止。
链中受到请求的对象要么亲自处理它，要么转发给下一个候选者。提交方并不明确有多少个对象会处理它，任一候选者都可以响应相对应的请求，可以再运行时刻决定哪些候选者参与到链中。

### 例子：
一个售卖手机的电商网站，之前有用户分别交纳500元订金和200元定金预订，现在已经可以正式购买了。
支付过定金的用户肯定有优先购买权还有优惠券补贴，支付500定金的发放100元优惠券，支付200定金的发放50优惠券。没有支付过定金的用户按正常购买。
假设订单页面是PHP吐出的模版，在页面加载之处，PHP会传递给页面几个字段：
* orderType：表示订单类型。code值为1的时候表示支付500元定金的用户，2表示支付200元定金，3表示普通用户。
* pay：表示用户是否已支付定金，code值为true的时候表示已经支付，false的时候虽然下了订单，但没有支付，降级为普通用户。
* stock：表示当前产品的存库数量，已经支付过定金的用户将不受限制。

#### 1.一般般的写法
```
var order = function(orderType,pay,stock){
    if(orderType == 1 ){
        if( pay === true ){
            console.log('500元定金预购，得到100元优惠券');
        }else{
            if( stock > 0 ){
                console.log('普通用户购买，无优惠券');
            }else{
                console.log('手机库存不足');
            }
        }
    }
    else if(orderType == 2 ){
        if( pay === true ){
            console.log('200元定金预购，得到50元优惠券');
        }else{
            if( stock > 0 ){
                console.log('普通用户购买，无优惠券');
            }else{
                console.log('手机库存不足');
            }
        }
    }
    else if(orderType == 3 ){
        if( stock > 0 ){
            console.log('普通用户购买，无优惠券');
        }else{
            console.log('手机库存不足');
        }
    }
}

order(1,true,500);
order(1,false,500);
order(2,true,500);
order(3,true,500);
order(3,true,0);
```
以上代码中order函数非常巨大，而且需要经常进行修改。虽然能正常运行，但不利于后期维护。

#### 2.用职责链模式重构代码
先把500元订单、200元订单以及普通购买分成3个函数。让500元订单函数处理，如果该函数不符合处理条件，则把请求传递到200元订单函数。如果200元订单函数不能处理，则把请求传递给普通购买函数处理。
```
var order500 = function(orderType,pay,stock){
    if(orderType===1 && pay==true){
        console.log('500元定金预购，得100元优惠券');
    }else{
        order200(orderType,pay,stock);
    }
}

var order200 = function(orderType,pay,stock){
    if(orderType===2 && pay==true){
        console.log('200元定金预购，得50元优惠券');
    }else{
        orderNormal(orderType,pay,stock);
    }
}

var orderNormal = function(orderType,pay,stock){
    if(stock>0){
        console.log('普通用户购买，没有优惠');
    }else{
        console.log('手机存库不足');
    }
}

order500(1,true,500);
order500(1,false,500);
order500(2,true,500);
order500(3,true,500);
order500(3,true,0);

```

## 三、建造者模式

### 定义：
将一个复杂的对象构建与他的表象分离，使得同样的构建过程可以创建不同的表示。
建造者模式通常包括下面几个角色：
* Builder：给出一个抽象借口，以规范产品对象的各个组成成分的构建。这个借口规定要实现复杂对象的哪些部分的建造。这个结构规定要实现复杂对象的哪些部分的创建，并不设计具体对象部件的建造。
* ConcreteBuilder：实现builder接口，针对不同的商业逻辑，具体化复杂对象的各部分的创建。在创建过程中完成后，提供产品实例。
* Director：调用具体建造者来创建复杂对象的各个部分，不涉及具体产品的信息，只负责保证对象各部分完整创建或按某种顺序来创建。
* Product：要创建的复杂对象。

###例子：
例如一个客户要做一个好大上的网页，网页就是要创建的对象。然后老板说没问题抱在我身上，老板就是director。老板就啪一声扔给了程序员，程序员就是builder。程序员做的网站中，要弄html框架，要弄css样式，要弄js行为，最后实现用户提出的高大上需求，完成了打成一个包，好让老板提着走，这个包就是concretebuilder。
#### 1.客户说要一个高大上的网页
提出要创建复杂对象的一个需求
```
var Web = function(){
    this.html ='高大上',
    this.css='高大上',
    this.js='高大上';
}
```

#### 2.老板说没问题。翻滚吧！程序员！
程序员首先搭建html，搭建css，搭建js，然后把html，css，js写得高大上。
```
var Builder = function(){
    this.makehtml = function(){
        console.log('构建html文件');
    }
    this.makecss = function(){
        console.log('构建css文件');
    }
    this.makejs = function(){
        console.log('构建js文件');
    }
    this.getResult = function(){
        var web = new Web();
        web.html = '这个是高大上的html';
        web.css = '这个是高大上的css';
        web.js = '这个是高大上的js';
        return web;
    }
}
```

#### 3.老板就指指点点说，先弄这个，再弄这个
```
var Director = function(){
    this.getWeb = function(builder){
        builder.makehtml();
        builder.makecss();
        builder.makejs();
    }
}
```

####4.客户呼唤老板交稿
```
var builder = new Builder();
var director = new Director();
director.getWeb(builder);
var hightWeb = builder.getResult();
console.log(hightWeb); 
```

## 四、策略模式

### 定义：
定义了一些列的算法，把它门一个个封装起来，并使他们可以相互互换，算法的变化不会影响使用算法的客户。
###例子：
用策略模式创建一个表单验证的功能。
以下是表单结构：
```
<form  id="registerForm" action="http://xxx.com/register" style="padding:50px;">
    <label for="userName" >userName</label>
    <div>
      <input type="text" id="userName" placeholder="userName" name="userName">
    </div>

    <label for="password" name="password" >Password</label>
    <div>
      <input type="password" id="password" name="password" placeholder="Password">
    </div>

    <label for="phoneNumber" name="phoneNumber">phoneNumber</label>
    <div>
     <input type="text" id="phoneNumber" name="phoneNumber" placeholder="phoneNumber">
    </div>

    <div>
      <button type="submit">提交</button>
    </div>
</form>
```

#### 1.封装策略类
我们创建一个策略对象strategies，并把算法类型都在里面分别封装起来。
```
var strategies = {
    isNonEmpty:function(value,errorMsg){                  //不为空
        if (value==='') { 
            return errorMsg;
        }
    },
    minLength:function(value,length,errorMsg){            //限制最小长度
        if (value.length<length) {
            return errorMsg;
        }
    },
    isMobile:function(value,errorMsg){                   //手机号码格式
        console.log(this);
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }

};
```

#### 2.封装验证类
* add方法接收到registerForm.userName,[{strategy:'minLength:6'},{errorMsg:'用户名长度不能少于6位'}];
* strategyAry就把'minLength:6'通过冒号区分了策略和参数
* strategy通过shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
* 这样stragety就等于'minLength'
* strategyAry就等于'6'
* strategyAry通过unshift() 方法可向数组的开头添加了'dom.value',
* strategyAry就等于｛'value','6'}
* strategyAry通过push()方法添加上了'errorMsg',
* strategyAry就等于了{'value','6','errorMsg'}
```
var Validator = function(){
    this.cache = [];                                     //保存验证规则
};

Validator.prototype.add = function(dom,rules){

    var self = this;

    for(var i = 0, rule; rule = rules[i++];){
        (function(rule){
            var strategyAry = rule.strategy.split(':');  //把strategy和参数分开
            var errorMsg = rule.errorMsg;

            self.cache.push(function(){                 //把校验的步骤用空函数包装起来，并放入cache
                var strategy = strategyAry.shift();     //取出用户挑选的strategy
                strategyAry.unshift(dom.value);         //把input的value 添加进参数列表
                strategyAry.push(errorMsg);             //把errorMsg     添加进参数列表
                return strategies[strategy].apply(dom,strategyAry);
            });
        })(rule)
    }
};

Validator.prototype.start=function(){                   
    for(var i=0, validatorFunc;validatorFunc=this.cache[i++];){
        var errorMsg = validatorFunc();                  //开始校验，并取得校验后的返回信息
        if (errorMsg) {                                  //如果有确切的返回值，说明没有验证通过
            return errorMsg;
        };
    }
}
```

#### 3.客户调用代码
先创建一个validator对象，然后通过validator.add方法，往validator对象添加一些校验规则。validator.add方法接受3个参数。
registerForm.password 为参与验证的输入框。minLength:6 是一个以冒号隔开的字符串。冒号前的minlength代表客户挑选的strategy对象，冒号后面的6表示校验需要的必要参数。第三个参数就是返回的错误信息。
往vlidator对象添加完一系列的校验规则之后，会调用validator。start返回一个确切的errormsg字符串当作返回值，说明这次校验没有通过。
然后呢，让registerform.onsubmit方法返回false来阻止表单的提交。
```
var registerForm = document.getElementById('registerForm');

var validataFunc = function(){
    var validator = new Validator();                   

    validator.add(registerForm.userName,[{     //添加校验规则
        strategy:'isNonEmpty',
        errorMsg:'用户名不能为空'
    },{
        strategy:'minLength:6',
        errorMsg:'用户名长度不能小于6位'
    }]);

    validator.add(registerForm.password,[{
        strategy:'minLength:6',
        errorMsg:'密码长度不得能少于6位'
    }]);

    validator.add(registerForm.phoneNumber,[{
        strategy:'isMobile',
        errorMsg:'手机号码格式不正确'
    }]);

    var errorMsg = validator.start();           //获得校验结果
    return errorMsg;                            //返回校验结果
}

registerForm.onsubmit = function(){             //如果errormsg有确切返回值，说明验证没有通过
    var errorMsg = validataFunc();

    if (errorMsg) {
        alert(errorMsg);
        return false;
    };
};

```
使用策略模式重构代码之后，我们仅仅通过配置的方法就可以完成一个表单的校验，
这些校验规则也可以服用在程序的任何地方，还能作为插件的形式，方便地被移植到其它项目中。
在修改校验规则的时候，只需要编写或改动少量的代码。

#### 4.总结
策略模式是一种可常用且有效的设计模式，从案例中我们可以总结出策略模式的一些优点：
* 策略模式利用组合，委托和多态，有效地避免了多重条件语句。
* 策略模式提供了对开放－封闭原则的支持，将算法封装在独立的strategy中，使得它们易与切换，易于理解，易于扩展。
* 策略模式中的算法也可以复用在系统的其它地方，从而避免许多复制粘贴
* 策略模式中利用组合和委托来让context拥有算法的能力，这也是继承的的一种更轻便的替代方案。


## 五、发布－订阅模式

### 定义：
发布－订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生变化时，所依赖于它的对象都将得到通知。
在javascript开发中，我们一般用事件模型来替代传统的发布－订阅模式。

```
define(function(require, exports, module) {
    var observer = {};                             // 创建一个储存仓库

    var util = {
        // 订阅方法
        subscribe: function (name, func) {
            if (!observer[name]) {        // 在储存仓库内添加一个事件仓库
                observer[name] = [];
            }
            observer[name].push(func);
        },


        // 发布方法
        publish: function (name, arg) {
            if (!observer[name]){                   // 判断是否有本仓库
                return false;
            }
            observer[name].forEach(function (item) {       // 遍历执行
                item(arg);
            });
        }

    }

    module.exports = util;
});

```

## 六、适配器模式

### 定义：
在程序开发中有许多这样的场景：当我们试图调用模块或者对象的某个接口时，却发现这个接口的格式并不符合目前的需求。我们可以修改原来的接口实现，单如果原来的模块很复杂，或者我们拿到的模块时一段别人编写后压缩过的代码，修改接口就不太现实了。第二种方法就是创建一个适配器，将原有接口转换为客户希望的另一个接口，客户只需要和适配器打交道。<br>
适配器模式(Adapter) 是将一个类（对象）的接口（方法或属性）转化成客户希望的另外一个接口（方法或属性），使得原本由于接口不兼容而不能一起工作的那些类（对象）可以一起工作。
### 例子：地图渲染
#### 1.接口相同
当我们向googleMap和baiduMap都发出“显示”请求时，分别以各自的方式在页面中展现了地图：
```
var googleMap={
  show:function(){
    console.log('开始渲染谷歌地图');
  }
};

var baiduMap={
  show:function(){
    console.log('开始渲染百度地图');
  }
};

var renderMap = function(map){
  if(map.show instanceof Function){
    map.show();
  }
};

renderMap(googleMap);
renderMap(baiduMap);

```

#### 2.接口不相同
由于第三方的接口方法并不在我们的控制范围之内，假如baiduMap提供显示地图的方法不叫show而叫display的话。baiduMap这个对象源于第三方，正常情况下我们都不应该去改动它。此时我们可以通过增加baiduMapAdapter来解决问题：
```
var googleMap={
  show:function(){
    console.log('开始渲染谷歌地图');
  }
};

var baiduMap={
  display:function(){
    console.log('开始渲染百度地图');
  }
};

var baiduMapAdapter = {
  show:function(){
    return baiduMap.display();
  }
}

var renderMap = function(map){
  if(map.show instanceof Function){
    map.show();
  }
};

renderMap(googleMap);
renderMap(baiduMap);
```

### 例子2：地图数据
#### 1.创建原始的结构类型
假如我们正在编写一个渲染广东省地图的页面。目前从第三方资源里获得广东省的所有城市以及它们所对应的ID，并且成功渲染到页面。
```
var getGuangdongCity = function(){
  var guangdongCity = [
    {
      name:'shenzhen',
      id:11,
    },
    {
      name:'guangzhou',
      id:12,
    }
  ];

  return guangdongCity;
};

var render = function(fn){
  console.log('开始渲染广东省地图');
  document.write(JSON.stringify(fn()));
}

render(getGuangdongCity);

```
然后我们发现这些数据不太可靠，里面还缺少很多城市。于是我们又在网上找了另外一些数据资源，这次的数据更加全面，单遗憾的是，数据结构和正在运行的项目并不一致。

#### 2.遇到新的数据类型
```
var guangdongCity = {
  shenzhen:11,
  guangzhou:12,
  zhunhai:13
};
```
除了大动干戈地改写渲染页面的前端代码之外，另一种更轻便的解决方式就是新增一个数据格式转换的适配器。

#### 3.新增数据转换适配器
```
var getGuangdongCity = function(){
  var guangdongCity = [
    {
      name:'shenzhen',
      id:'11',
    },{
      name:'guangzhou',
      id:'12,'
    }
  ];
  return guangdongCity;
};

var render = function(fn){
  console.log('开始渲染广东省地图');
  document.write(JSON.stringify(fn()));
};

var addressAdapter = function(oldAddressfn){

  var address = {},
      oldAddress = oldAddressfn();

  for(var i = 0,c; c = oldAddress[i++];){
    address[c.name]=c.id;
  }

  return function(){
    return address;
  }
}

render(addressAdapter(getGuangdongCity));

```

### 小结
适配器模式主要用于解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎么实现的，也不考虑如何演化。适配器模式不需要改变已有的接口，就能过使他们协调作用。

## 七、享元模式

### 定义：
享元模式是一种用于性能优化的模式。运行共享技术避免大量拥有相同内容的小类的开销(如耗费内存)，使大家共享一个类(元类)。
##### 内部状态与外部状态
享元模式要求将对象的属性划分为内部状态和外部状态（状态这里通常指属性）
* 内部状态存储于对象内部
* 内部状态可以被一些对象共享
* 内部状态独立于具体的场景，通常不会改变
* 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

### 例子：汽车登记事例
#### 1.一般般的
数据量小到没多大的影响，数据量大的时候对计算机内存会产生压力。
```
var Car =function(make,model,year,owner,tag,renewDate){
   this.make=make;
   this.model=model;
   this.year=year;
   this.owner=owner;
   this.tag=tag;
   this.renewDate=renewDate;
}

Car.prototype = {
   getMake:function(){
       returnthis.make;
   },
   getModel:function(){
       returnthis.model;
   },
   getYear:function(){
       returnthis.year;
   },
   transferOwner:function(owner,tag,renewDate){
       this.owner=owner;
       this.tag=tag;
       this.renewDate=renewDate;
   },
   renewRegistration:function(renewDate){
       this.renewDate=renewDate;
   }

```
接着我们使用享元模式优化一下。

#### 2.包含核心数据的Car类
```
var Car=function(make,model,year){
   this.make=make;
   this.model=model;
   this.year=year;
}
Car.prototype={
   getMake:function(){
       returnthis.make;
   },
   getModel:function(){
       returnthis.model;
   },
   getYear:function(){
       returnthis.year;
   }
}

```

#### 3.中间对象，用于实例化Car类
```
var CarFactory=(function(){
   var createdCars = {};

   return {
       createCar:function(make,model,year){
           var car=createdCars[make+"-"+model+"-"+year];
           console.log(createdCars)
           return car ? car : createdCars[make +'-'+ model +'-'+ year] =(new Car(make,model,year));

       }
   }
})();

```

#### 4.数据工厂，用来处理Car的实例化和整合附加数据
```
var CarRecordManager = (function() {

   var carRecordDatabase = {};
   return {

       addCarRecord:function(make,model,year,owner,tag,renewDate){
           var car = CarFactory.createCar(make, model, year);
           carRecordDatabase[tag]={
               owner:owner,
               tag:tag,
               renewDate:renewDate,
               car:car
           }
       },

       transferOwnership:function(tag, newOwner, newTag, newRenewDate){
           var record=carRecordDatabase[tag];
           record.owner = newOwner;
           record.tag = newTag;
           record.renewDate = newRenewDate;
       },

       renewRegistration:function(tag,newRenewDate){
           carRecordDatabase[tag].renewDate=newRenewDate;
       },

       getCarInfo:function(tag){
           return carRecordDatabase[tag];
       }
   }

})();

CarRecordManager.addCarRecord("奔驰","car","2016","曹江涛","888","2016-2018");
CarRecordManager.addCarRecord("奔驰","car","2015","范明非","19888","2016-2019");
CarRecordManager.addCarRecord("奔驰","car","2015","朱华宇","19888","2016-2019");

console.log(CarRecordManager.getCarInfo("888"));
console.log(CarRecordManager.getCarInfo("19888"));

```

## 八、单例模式
保证一个类仅有一个实例，并提供一个访问它的全局访问点。
##### 全局变量不是单例模式，但在javascript开发中，我们经常会把全局变量当成单例模式来使用。例如：
```
var a = {};
```
对象 a 确实是独一无二的，如果 a 变量声明在全局的作用域下， 这样就满足了单例的两个条件。但是全局变量存在很多问题，它很容易造成命名空间污染。以下两种方式可以相对降低全局变量带来的命名污染。

* 1.使用命名空间
```
var namespace1 = {
  a:function(){
    alert(1);
  },
  b:function(){
    alert(2);
  }
};
```
把a和b都定义为namespace1的属性，这样可以减少变量和全局作用域打交道的机会。

* 2.使用闭包封装私有变量
```
var user = (function(){

    var _name = 'sven',
        _age = 29;

    return {
      getUserInfo:function(){
        return _name + '_' + _age;
      }
    }

  })();

```
这种方法吧一些变量封装在闭包的内部，只暴露一些接口跟外界通讯。我们用下划线来约定私有变量_name和_age,它们呗封装在闭包产生的作用域中，外部是访问不到这两个变量的，这就避免了对全局的命名污染。

##### 惰性单例：在需要的时候才创建对象实例。后加载，先写了，在用的时候再加载。

### 例子：弹窗
当我们点击登录按钮时候，会出现一个登录浮窗。
#### 1.页面加载完成的时候创建
```
<button id="loginBtn">登录</button>

<script>

  var loginLayer = (function(){
      var div = document.createElement('div');
      div.innerHTML = '我是登录浮窗';
      div.style.display = 'none';
      document.body.appendChild(div);
      return div;
    })();

    document.getElementById('loginBtn').onclick = function(){
      loginLayer.style.display = 'block';
    };

</script>

```
或许，用户根本不需要登录操作，这样登录浮窗总是一开始就被创建好，那么很有可能将白白浪费一些DOM节点。

#### 2.触发事件的时候创建
```
<button id="loginBtn">登录</button>

<script>

  var createLoginLayer = function(){
      var div = document.createElement('div');
      div.innerHTML = '我是登录浮窗';
      div.style.display = 'none';
      document.body.appendChild(div);
      return div;
    };

    document.getElementById('loginBtn').onclick = function(){
      var loginLayer = createLoginLayer();
      loginLayer.style.display = 'block';
    };

</script>

```
虽然达到了惰性的目的，但是失去了单例的效果。当我们每次点击登录按钮时候，都会创建一个新的登录浮窗。虽然我们可以在点击浮窗上添加关闭按钮把这个浮窗从页面删除掉，但这样频繁的创建和删除节点明显是不合理的，也是不必要的。

#### 3.判断是否已经创建过
```
<button id="loginBtn">登录</button>

<script>

  var createLoginLayer = (function(){
      var div;
      return function(){
        if(!div){
          div = document.createElement('div');
          div.innerHTML = '我是登录浮窗';
          div.style.display = 'none';
          document.body.appendChild(div);
        }

        return div;

      }
  })();

  document.getElementById('loginBtn').onclick = function(){
      var loginLayer = createLoginLayer();
      loginLayer.style.display = 'block';
  };

</script>

```

## 九、构造函数模式

### 定义：
构造函数用于创建特定类型的对象—不仅声明了使用的对象，构造函数还可以接受参数，以便第一次创建对象的时候设置对象的成员值。你可以自定义自己的构造函数，然后在里面声明自定义对象的属性或方法。

### 作用：
1. 用于创建特定类型的对象
2. 第一次声明的时候给对象赋值
3. 自己声明构造函数，赋予属性和方法
### 注意：
* 声明函数的时候处理业务逻辑
* 区分和单例的区别，配合单例实现初始化
* 构造函数大写字母开头
* 注意new的成本

### 实例：
``` javascript
   function User(id, name, old) {
        this.id = id;
        this.name = name;
        this.old = old;
        this.loginStatus = false;
    }
```

## 十、原型模式

### 定义：
原型模式（prototype）是指用原型实例指向创建对象的种类，并且通过拷贝这些原型来创建新的对象。

### 作用：
原型对象本身就是有效利用了每个构造器创建的对象。

### 注意：
1. 注意的依然是深拷贝和浅拷贝的问题，免得出现引用问题。
2. 现有的文献里查看原型模式的定义，没有针对javascript的，你可能发现很多讲解的都是关于类的，但是现实情况是基于原型继承的javascript完全避免了类（class）的概念。

### 实例：
``` javascript
    User.prototype = {
        checkPassword: function (passwd) {
            if(passwd == 123) {
                this.loginStatus = true;
            } else {
                this.loginStatus = false;
            }
        },
        login: function (passwd) {
            this.checkPassword(passwd);
        },
        logout: function () {
            this.loginStatus = false;
        },
        changeName: function (name) {
            this.name = name;
        }
    }
```

## 十一、工厂模式

### 定义：
* 提供一个创建一系列相关或相互依赖对象的接口，而无需指定他们具体的类。
* 工厂就是把成员对象的创建工作转交给一个外部对象，好处在于消除对象之间的相互影响。通过使用工厂方法而不是new关键字及具体类，可以把所有实例化的代码都集中在一个位置，有助于创建模块化的代码，这是工厂模式的目的和优势。
### 作用：
1. 对象的构建十分复杂。
2. 需要依赖具体的环境创建不同实例。
3. 处理大量具有相同属性的小对象。
### 分类：
1. 简单工厂模式
2. 抽象工厂模式：先设计一个抽象类，这个类不能被实例化，只能用来派生子类，最后通过对子类的扩展实现工厂方法。
### 例子：
``` javascript
        var XMLHttpFactory = function() {};　　　　　　
        //这是一个简单工厂模式        　　
        XMLHttpFactory.createXMLHttp = function() {　　　　
                var XMLHttp = null;　　　　
                if (window.XMLHttpRequest) {　　　　　　
                    XMLHttp = new XMLHttpRequest()　　　　
                }
                elseif(window.ActiveXObject) {　　　　　　
                    XMLHttp = new ActiveXObject("Microsoft.XMLHTTP")　　　　
                }　　
                return XMLHttp;　　
            }　　
            //XMLHttpFactory.createXMLHttp()这个方法根据当前环境的具体情况返回一个XHR对象。        　　
        var AjaxHander = function() {　　　　
            var XMLHttp = XMLHttpFactory.createXMLHttp();　　　　...　　
        }
```
``` javascript
        var XMLHttpFactory = function() {};　
         //这是一个抽象工厂模式
        　　
        XMLHttpFactory.prototype = {　　
         //如果真的要调用这个方法会抛出一个错误，它不能被实例化，只能用来派生子类               　　
                createFactory: function() {　　
                    thrownew Error('This is an abstract class');　　
                }　　
            }　　
//派生子类，文章开始处有基础介绍那有讲解继承的模式，不明白可以去参考原理         　　
        var XHRHandler = function() {　　
            XMLHttpFactory.call(this);　　
        };　　
        XHRHandler.prototype = new XMLHttpFactory();　　
        XHRHandler.prototype.constructor = XHRHandler;　　 //重新定义createFactory 方法
        　　
        XHRHandler.prototype.createFactory = function() {　　
            var XMLHttp = null;　　
            if (window.XMLHttpRequest) {　　
                XMLHttp = new XMLHttpRequest()　　
            }
            elseif(window.ActiveXObject) {　　
                XMLHttp = new ActiveXObject("Microsoft.XMLHTTP")　　
            }　　
            return XMLHttp;　　
        }
```

### 相关链接：
* [Darren_聂微东 - 关注前端技术
](http://www.cnblogs.com/Darren_code/archive/2011/08/31/JavascripDesignPatterns.html)
* [听飞狐聊JavaScript设计模式系列](http://www.60sky.com/2015/11/20/fox/js7/)

## 十二、外观模式

### 定义：
外观模式（Facade）为子系统中的一组接口提供了一个一致的界面，此模式定义了一个高层接口，这个接口使得这一子系统更容易使用。外观模式不仅简化类中的接口，而且对接口与调用者也进行了解耦。外观模式经常被认为开发者必备，它可以将一些复杂操作封装起来，并创建一个简单的接口用于调用。
### 作用：
1. 在设计初期，应要有意识的将不同两个层分离，比如经典的三层结构
2. 在开发阶段，子系统往往因为不断的重构演化变得越来越复杂，增加外观F可以提供一个简单的接口，减少他们之间的依赖
3. 在维护一个遗留的大型系统时，为系统开发一个外观Façade类，为设计粗糙和高度复杂的遗留代码提供比较清晰的接口，让系统和Façade对象交互。
### 注意：
外观模式被开发者连续使用时会产生一定的性能问题，因为在每次调用时都要检测功能的可用性
### 例子：
``` javascript
        function stop(e) {
            e.stopPropagation()
            e.preventDefault()
        }
        Function addEvent(el, type, fn) {
            If(el.addEventListener) {
                el.addEventListener(type, fn, false)
            } else if (el.attachEvent) {
                el.attachEvent(‘on’ + type, fn)
            } else {
                el[‘on’ + type] = fn
            }
        }
```

### 相关链接：
* [汤姆大叔的博客](http://www.cnblogs.com/TomXu/archive/2012/02/28/2353448.html)
* [Snandy](http://www.cnblogs.com/snandy/archive/2012/12/18/2809768.html)

## 十三、迭代器模式

### 定义：
迭代器模式提供一种方法顺序访问一个聚合对象中各个元素，而又不需要暴露该方法中的内部表示。
### 作用：
1. 为遍历不同的集合结构提供一个统一的接口，从而支持同样的算法在不同的几何结构上进行操作。
2. 对于集合内部结果常常变化各异，我们不想暴露其内部结构的话，但又想让客户代码透明访问其中的内容，这种情况下我们可以使用迭代器模式。
### 例子：
``` javascript
var qianduan = ["xiufang", "mingfei", "huayu","junyan"];
var caolaoshi = (function() {
    var length = qianduan.length,
        index = 0;
    return {
        hasNext: function() {
            return index < length;
        },
        next: function() {
            var data = qianduan[index];
            index = index + 2;
            return data;
        }
    };
})();
while (caolaoshi.hasNext()) {
    console.log(caolaoshi.next());
}
```

## 十四、命令模式

### 定义：
命令模式中的命令指的是一个执行某些特定事件的指令。
有时候需要向某些对象发送请求，但是并不知道请求的接受者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接受者能够消除彼此之间的耦合关系。
### 作用：
1.  将函数的封装、请求、调用结合为一体。
2. 调用具体的函数解耦命令对象与接收对象。
3. 提高程序模块化的灵活性。
### 注意：
不需要接口一致，直接调用函数即可，以免造成浪费。
### 例子：
```javascript
  var qianduan={};
  qianduan.xiufang=function(lb_num){
    alert('秀芳收到了曹老师指派的'+lb_num+'个任务');
  }
  qianduan.mingfei=function(lb_num){
    alert('明非收到了曹老师指派的'+lb_num+'个任务');
  }
  qianduan.huayu=function(lb_num){
    alert('华宇收到了曹老师指派的'+lb_num+'个任务');
  }
  qianduan.junyan=function(lb_num){
    alert('君岩收到了曹老师指派的'+lb_num+'个任务');
  }
  qianduan.caolaoshi=function(commond){
      qianduan[commond.xiaobing](commond.num);
  }
  qianduan.caolaoshi({
    xiaobing:'junyan',
    num:'5'
  })
```

## 十五、代理模式

### 定义：
代理模式是为一个对象提供一个代用品或者占位符，以便控制对它的访问。
代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问。
客户实际是访问的是替身对象，替身对象对请求作出一些处理之后，再把请求转交给本体对象。
### 结构：
代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象
### 其他代理模式：
1、远程代理（一个对象将不同空间的对象进行局部代理）。
2、虚拟代理（根据需要创建开销很大的对象如渲染网页暂时用占位代替真图）
3、安全代理（控制真是对象的访问权限）
4、智能指引（调用对象代理处理另外一些事情如垃圾回收机制）
^(*￣(oo)￣)^  不能滥用代理，有的时候仅仅给代码增加复杂度
### 相关资料：
* [汤姆大叔的博客](http://www.cnblogs.com/TomXu/archive/2012/02/29/2354979.html.png)
### 实例：
* 普通加载图片
``` javascript
var myImage = (function(){
  //创建一个文本对象
  var imgNode = document.creatElement( 'img' );
  //网页面中创建一个标签
  document.body.appendChild( imgNode );
  return {
    setSrc: function(src){
    //提供一个对外的setSrc接口，可以给img标签设置src属性
      imgNode.src = src;
    }
  }
})
```

## 十六、装饰着模式

### 定义：
* 装饰者模式可以动态地 给某个对象添加一些额外的职责,而不会影响从这个类中派生的其他对象。
* 装饰者模式能够在不改变对象自身的基础上,在程序运行期间给对象动态地添加职责。跟继承相比,装饰者是一种更轻便灵活的做法,这是一种“即用即付”的方式,比如天冷了就多穿一件外套,需要飞行时就在头上插一支竹蜻蜓,遇到一堆丧尸的时候就启动群攻技能。

#### 模拟传统面向对象语言的装饰者模式
``` javascript
  //首先是原始的飞机类：
  var Plane = function(){}
  Plane.prototype.fire = function(){
    console.log('发射普通子弹')
  }
  var MissileDecorator = function(plane){
    this.plane = plane;
  }
  MissileDecorator.prototype.fire = function(){
    this.plane.fire()；
    console.log('发射导弹')；
  }
  var AtomDecorator = function(plane){
    this.plane = plane
  }
  AtomDecorator.prototype.fire = function(){
    this.plane.fire();
    console.log('发射原子弹')；
  }
  var plane = new Plane();
  plane = new MissileDecorator(plane);
  plane = new AtomDecorator(plane);
  plane.fire();
```
* 假设我们在编写一个飞机大战的游戏,随着经验值的增加,我们操作的飞机对象可以升级成 更厉害的飞机,一开始这些飞机只能发射普通的子弹,升到第二级时可以发射导弹,升到第三级 时可以发射原子弹。
* 导弹类和原子弹类的构造函数都接受参数 plane 对象,并且保存好这个参数,在它们的 fire方法中,除了执行自身的操作之外,还调用 plane 对象的 fire 方法。
####模拟传统面向对象语言的装饰者模式
* 这种给对象动态增加职责的方式,并没有真正地改动对象自身,而是将对象放入另一个对象 之中,这些对象以一条链的方式进行引用,形成一个聚合对象。这些对象都拥有相同的接口(fire 方法),当请求达到链中的某个对象时,这个对象会执行自身的操作,随后把请求转发给链中的 下一个对象。
* 因为装饰者对象和它所装饰的对象拥有一致的接口,所以它们对使用该对象的客户来说是透 明的,被装饰的对象也并不需要了解它曾经被装饰过,这种透明性使得我们可以递归地嵌套任意 多个装饰者对象
###装饰者也是包装器
* 在《设计模式》成书之前,GoF 原想把装 饰者(decorator)模式称为包装器(wrapper) 模式。
* 从功能上而言,decorator 能很好地描述这 个模式,但从结构上看,wrapper 的说法更加 贴切。装饰者模式将一个对象嵌入另一个对象 之中,实际上相当于这个对象被另一个对象包 装起来,形成一条包装链。请求随着这条链依 次传递到所有的对象,每个对象都有处理这条 请求的机会

####回到JavaScript的装饰者
JavaScript 语言动态改变对象相当容易,我们可以直接改写对象或者对象的某个方法,并不 需要使用“类”来实现装饰者模式
``` javascript
  //首先是原始的飞机类：
  var Plane = {
    fire : function(){
      console.log('发射普通子弹')
    }
  }
  var MissileDecorator = function(){
    console.log('发射导弹')；
  }
  var AtomDecorator = function(){
    console.log('发射原子弹')；
  }
  var fire1 = plane.fire;
  plane.fire = function(){
    fire1();
    missileDecorator();
  }
  var fire2 = plane.fire;
  plane.fire = function(){
    fire2();
    AtomDecorator();
  }
  plane.fire();
```

###装饰函数
保存原引用的方式就可以改写某个函数
```
var a = function(){
    alert(1);
  }
var _a = a;
a=function(){
    _a();
    alert(a);
  }
a();
```
这是实际开发中很常见的一种做法,比如我们想给 window 绑定 onload 事件,但是又不确定 这个事件是不是已经被其他人绑定过,为了避免覆盖掉之前的 window.onload 函数中的行为,我 们一般都会先保存好原先的 window.onload,把它放入新的 window.onload 里执行:
```
window.onload = function(){
  alert ('onload1');
}
var _onload = window.onload || function(){};

window.onload = function(){
  _onload();
  alert ('onload2');
}
```

###装饰函数的问题
* 这样的代码当然是符合开放封闭原则的,我们在增加新功能的时候,确实没有修改原来的 window.onload 代码,但是这种方式存在以下两个问题
* 必须维护_onload 这个中间变量,虽然看起来并不起眼,但如果函数的装饰链较长,或者 需要装饰的函数变多,这些中间变量的数量也会越来越多。
* 其实还遇到了 this 被劫持的问题,在 window.onload 的例子中没有这个烦恼,是因为调用 普通函数_onload 时,this 也指向 window,跟调用 window.onload 时一样(函数作为对象的 方法被调用时,this 指向该对象,所以此处 this 也只指向 window)。现在把 window.onload 换成 document.getElementById,代码如下:

>This 劫持问题
```
var _getElementById = document.getElementById;

  document.getElementById = function( id ){
    alert (1);
    return _getElementById( id ); // (1)
  }
  var button = document.getElementById( 'document' );
// 执行这段代码,我们看到在弹出 alert(1)之后,紧接着控制台抛出了异常:
// 输出: Uncaught TypeError: Illegal invocation
```
异常发生在(1) 处的_getElementById( id )这句代码上,此时_getElementById 是一个全局函数, 当调用一个全局函数时,this 是指向 window 的,而 document.getElementById 方法的内部实现需要 使用 this 引用,this 在这个方法内预期是指向 document,而不是 window, 这是错误发生的原因, 所以使用现在的方式给函数增加功能并不保险。
```
var _getElementById = document.getElementById;
  document.getElementById = function(){
    alert (1);
    return _getElementById.apply( document, arguments );
  }
  var button = document.getElementById( 'button' );
```
但这样做显然很不方便

####用AOP装饰函数
首先给出 Function.prototype.before 方法和 Function.prototype.after 方法:
```
Function.prototype.before = function( beforefn ){
    var _self = this; // 保存原函数的引用
    return function(){ // 返回包含了原函数和新函数的"代理"函数
      beforefn.apply( this, arguments ); // 执行新函数,且保证 this 不被劫持,新函数接受的参数 // 也会被原封不动地传入原函数,新函数在原函数之前执行
      return _self.apply( this, arguments ); // 执行原函数并返回原函数的执行结果, 2 // 并且保证 this 不被劫持
    }
  }
Function.prototype.after = function( afterfn ){
  var _self = this;
  return function(){
    var ret = _self.apply( this, arguments );
    afterfn.apply( this, arguments );
    return ret;
  }
};
```

####用AOP装饰函数说明
* Function.prototype.before 接受一个函数当作参数,这个函数即为新添加的函数,它装载了 新添加的功能代码。
* 接下来把当前的 this 保存起来,这个 this 指向原函数,然后返回一个“代理”函数,这个“代理”函数只是结构上像代理而已,并不承担代理的职责(比如控制对象的访问等)。它的工作 是把请求分别转发给新添加的函数和原函数,且负责保证它们的执行顺序,让新添加的函数在原函数之前执行(前置装饰),这样就实现了动态装饰的效果。
* 我们注意到,通过 Function.prototype.apply 来动态传入正确的 this,保证了函数在被装饰之后,this 不会被劫持。
* Function.prototype.after 的原理跟 Function.prototype.before 一模一样,唯一不同的地方在于让新添加的函数在原函数执行之后再执行。
```
Function.prototype.before = function( beforefn ){
  var _self = this;
  return function(){
    beforefn.apply(this,arguments);
    return _self.apply( this, arguments );
  }
}

document.getElementById = document.getElementById.before(function(){
  alert ('before');
});

var button = document.getElementById( 'doc2' );
```

####应用AOP
再回到 window.onload 的例子,看看用 Function.prototype.before 来增加新的 window.onload 事件是多么简单:
```
 window.onload = function(){
    alert ('AOP1');
  }
  window.onload = ( window.onload || function(){} ).after(function(){
    alert ('AOP2');
  }).after(function(){
    alert ('AOP3');
  }).after(function(){
    alert ('AOP4');
  });
```

####应用AOP实现的另一种方法
值得提到的是,上面的 AOP 实现是在 Function.prototype 上添加 before 和 after 方法,但许 多人不喜欢这种污染原型的方式,那么我们可以做一些变通,把原函数和新函数都作为参数传入 before 或者 after 方法
```
var before = function(fn, beforefn){
    return function(){
      beforefn.apply(this, arguments);
      return fn.apply(this, arguments);
    }
  }
  var a = before(
    function(){alert('new 3')},
    function(){alert('new 2')}
  );
  a = before(a, function(){alert('new 1');});
a();
```

###实例
####AOP 的应用实例-插件式的表单验证
在一个 Web 项目中,可能存在非常多的表单,如 注册、登录、修改用户信息等。在表单数据提交给后台之前,常常要做一些校验,比如登录的时 候需要验证用户名和密码是否为空,代码如下:
```
`<input id="username" type="text"/>`
`<input id="password" type="password"/>`
`<input id="submitBtn" type="button" value="提交">`
```
JS验证
```
var username = document.getElementById( 'username' ),
  password = document.getElementById( 'password' ),
  submitBtn = document.getElementById( 'submitBtn' );
  var formSubmit = function(){
    if ( username.value === '' ){
      return alert ( '用户名不能为空' ); }
    if ( password.value === '' ){
      return alert ( '密码不能为空' );
    }
    var param = {
      username: username.value,
      password: password.value
    }
ajax(‘xxxxxxx.php’,param);
  }
  submitBtn.onclick = function(){
    formSubmit();
  }
```
formSubmit 函数在此处承担了两个职责,除了提交 ajax 请求之外,还要验证用户输入的合法性。这种代码一来会造成函数臃肿,职责混乱,二来谈不上任何可复用性。
* 本节的目的是分离校验输入和提交 ajax 请求的代码,我们把校验输入的逻辑放到 validata
函数中,并且约定当 validata 函数返回 false 的时候,表示校验未通过,代码如下:
```
var validata2 = function(){
  if ( username.value === '' ){
    alert ( '用户名不能为空' );
    return false;
  }
  if ( password.value === '' ){
    alert ( '密码不能为空' );
    return false;
  }
}
var formSubmit2 = function(){
  if ( validata2() === false ){ //校验未通过
    return;
  }
  var param = {
    username: username.value,
    password: password.value
  }
  ajax(‘xxxxx’, param)  // ajax 具体实现略
}
submitBtn2.onclick = function(){
  formSubmit2();
}
```
现在的代码已经有了一些改进，我们把校验的逻辑都放到了validata 函数中，但 formSubmit 函数的内部还要计算validata函数的返回值，因为返回值的结果表明了是否通过校验。
进一步优化这段代码，使validata和formSubmit完全分离开来。首先要改写Function.prototype.before,如果 beforefn 的执行结果返回 false,表示不再执行后面的原函数,代码如下:
```
Function.prototype.beforeLogin = function( beforefn ){
    var __self = this;
    return function(){
      if ( beforefn.apply( this, arguments ) === false ){
      // beforefn 返回 false 的情况直接 return,不再执行后面的原函数
        return;
      }
    return __self.apply( this, arguments );
    }
  }
var validata3 = function(){
  if ( username.value === '' ){
    alert ( '用户名不能为空' );
    return false;
  }
  if ( password.value === '' ){
    alert ( '密码不能为空' );
    return false;
  }
}
var  formSubmit3 = function(){
  var param = {
    username: username.value,
    password: password.value
  }
  ajax(‘xxxxxxxx.php’, param) // ajax 具体实现略
}

formSubmit3 = formSubmit3.beforeLogin( validata3 );

submitBtn3.onclick = function(){
  formSubmit3();
}
```
#### 注意-提示
在这段代码中,校验输入和提交表单的代码完全分离开来,它们不再有任何耦合关系, formSubmit = formSubmit.before( validata )这句代码,如同把校验规则动态接在 formSubmit 函数 之前,validata 成为一个即插即用的函数,它甚至可以被写成配置文件的形式,这有利于我们分 开维护这两个函数。再利用策略模式稍加改造,我们就可以把这些校验规则都写成插件的形式, 用在不同的项目当中。
值得注意的是,因为函数通过 Function.prototype.before 或者 Function.prototype.after 被装 饰之后,返回的实际上是一个新的函数,如果在原函数上保存了一些属性,那么这些属性会丢失。 代码如下:
```
var func = function(){
    alert( 1 );
  }
  func.a = 'aaa';

  func = func.after( function(){
    alert( 2 );
  });
alert( func.a );
```
另外,这种装饰方式也叠加了函数的作用域,如果装饰的链条过长,性能上也会受到一些 影响。
### 小结
>装饰者模式和代理模式的结构看起来非常相像,这两种模式都描述了怎样为对象提供 一定程度上的间接引用,它们的实现部分都保留了对另外一个对象的引用,并且向那个对象发送 请求

* 代理模式和装饰者模式最重要的区别在于它们的意图和设计目的。代理模式的目的是,当直 接访问本体不方便或者不符合需要时,为这个本体提供一个替代者。本体定义了关键功能,而代 理提供或拒绝对它的访问,或者在访问本体之前做一些额外的事情。装饰者模式的作用就是为对 象动态加入行为。换句话说,代理模式强调一种关系(Proxy 与它的实体之间的关系),这种关系 可以静态的表达,也就是说,这种关系在一开始就可以被确定。而装饰者模式用于一开始不能确 定对象的全部功能时。代理模式通常只有一层代理本体的引用,而装饰者模式经常会形成一条 长长的装饰链。
* 在虚拟代理实现图片预加载的例子中,本体负责设置 img 节点的 src,代理则提供了预加载 的功能,这看起来也是“加入行为”的一种方式,但这种加入行为的方式和装饰者模式的偏重点 是不一样的。装饰者模式是实实在在的为对象增加新的职责和行为,而代理做的事情还是跟本体 一样,最终都是设置 src。但代理可以加入一些“聪明”的功能,比如在图片真正加载好之前,先使用一张占位的 loading 图片反馈给客户。
* 这种模式在实际开发中非常 有用,它在框架开发中也十分有用。作为框架作者,我们希望框架里的函 数提供的是一些稳定而方便移植的功能,那些个性化的功能可以在框架之外动态装饰上去,这可 以避免为了让框架拥有更多的功能,而去使用一些 if、else 语句预测用户的实际需要。
