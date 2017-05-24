# AngularJS 2.0
One framework.Mobile and desktop.
移动端与桌面端，一个框架即可。

### Fast 快
Angular computes updates based on changes to data, not DOM, for fast updates that scale to the largest data sets with minimal memory overhead.
Angular 能用极少量的内存消耗来快速更新规模庞大的数据，因为估算更新是基于数据的变化而不是DOM。

### Mobile 移动端
With Angular Universal for server-side rendering and Web Workers for smooth scrolling and transitions, Angular 2 solves the core challenges in mobile web performance.
随着Angular 普遍适用于服务器端的渲染和浏览器的平滑滚动与过渡变化，解决了移动端性能上的巨大挑战。

### Flexible 灵活
Supports several languages including plain JavaScript, TypeScript, and Dart. Also supports both object-style data structure with POJO data-binding and functional reactive style with unidirectional data flow and support for observables and immutable data structures.
支持几种语言包括JavaScript, TypeScript, 和 Dart。同时支持POJO绑定的对象类型数据结构，单向流的功能反应类型数据结构，可视化的和不可变的数据结构。

## FEATURES & BENEFITS 特征和效益
Powerful Features for Developing Apps
开发应用的强大特征

### SPEED & PERFORMANCE 速度和性能
Angular 2 is dramatically faster than Angular 1 with support for fast initial loads through server-side pre-rendering, offline compile for fast startup, and ultrafast change detection and view caching for smooth virtual scrolling and snappy view transitions.
通过服务器渲染来更新加载，离线快速启动，实时监测。
Angular应用是在DOM和JS对象的数据绑定的基础上构建的，速度很大程度上取决于我们底层使用的更新监测机制。监测页面数据变化，通过服务器更新加载。

###  SIMPLE & EXPRESSIVE 简单和表现力
Make your intention clear using natural, easy-to-write syntax. Reduce complexity for your team: new, structure-rich templates are readable and easy to understand at a glance.

### CROSS PLATFORM 跨平台
Learning Angular 2 gives you the tools you need to build apps for desktop, mobile web, Android, and iOS. Angular Universal provides for server-side rendering for fast initial views on mobile web. Ionic and NativeScript let you build hybrid and native UI mobile apps. Web worker support keeps your app UI fully responsive no matter how heavy the load.

### SEAMLESS UPGRADE FROM ANGULAR 1 无缝升级
Upgrade your Angular 1 application at your own pace by mixing in Angular 2 components, directives, pipes, services and more by using the ngUpgrade APIs.

### FLEXIBLE DEVELOPMENT 灵活发展
The choice of language is up to you. In addition to full support for ES5, TypeScript, and Dart, Angular 2 works equally well with ES2015 and other languages that compile to JavaScript.

### COMPREHENSIVE ROUTING 综合路由
Design sophisticated views: map URL paths to application components, and use advanced features like nested and sibling routes. Angular 2 supports card stack navigation, animated transitions, and lazy loading for mobile users. If you already use routing from a prior version of Angular, you can easily migrate to Angular 2 routing.

### DEPENDENCY INJECTION 依赖注入
Angular 2 ships with powerful, yet simple-to-use dependency injection, allowing you to maintain modular applications without writing tedious glue code. Dependency injection helps you write tests by making it easy to inject test doubles.
依赖注入依然是 Angular 区别于客户端框架的关键所在，它帮你消除了很多应用中的连接性代码，并且使默认的可测试性变成了现实。
更加简化的依赖注入，移除了配置阶段，使用声明式的ES6+标注取代命令式的代码来简化语法。通过依赖注入和ES6模块化的模块加载的集成而获得更加强大的功能。

### LEGACY BROWSER SUPPORT 传统浏览器的支持
[Under development] Tap directly into low-level animation support on mobile and desktop environments with easy-to-use Angular events. You can use CSS, JavaScript, and the Web Animations API to intelligently handle changes to animations in response to user events. Plan complex animation flows by sequencing the behavior of an entire website on a timeline.

### INTERNATIONALIZATION (I18N) & ACCESSIBILITY 国际化和易接近
[Under development] Reach all your users. Use the familiar ICU message format in Angular interpolation syntax ({{ }}), including pluralization and gender rules. Automate message extraction, pseudo-localization, and translation updates. Generate static applications for each locale. Easily promote accessibility via screen readers and assistive devices by automatically generating appropriate ARIA attributes.

### 快速跑起一个Angular2.0应用
#### 1.环境搭建
在Angular2中，因为其是基于ES6来开发的，所以会有很多第三方依赖。由于很多浏览器还不支持ES6，所以Angular2引入了很多polyfill或者shim, 导致我们引入了第三方依赖加一些垫片来抹平当前浏览器与ES6的差异：
```
{
  "name": "angular2-quickstart",
  "version": "1.0.0",
  "scripts": {
    "start": "npm run lite",
    "lite": "lite-server"
  },
  "license": "ISC",
  "dependencies": {
    "angular2": "2.0.0-beta.3",
    "es6-promise": "^3.0.2",
    "es6-shim": "^0.33.3",
    "reflect-metadata": "0.1.2",
    "rxjs": "5.0.0-beta.0",
    "zone.js": "0.5.11"
  },
  "devDependencies": {
    "concurrently": "^1.0.0",
    "lite-server": "^2.0.1"
  }
}

```

#### 2.为应用编写根组件
创建app文件夹，添加app.component.js<br>
从技术上讲，组件是一类控制视图模板的类，我们将写大量的他们。现在添加一个文件名为app.component.js,创建一个可视化组件AppComponent,核心命名空间ng.core,链接Component和Class方法。我们把所有的东西添加到 app 这个全局对象之中。里面每一个文件都用LIFE形式（“立即调用函数表达”），以防污染这个全局的命名空间。
```
(function(app) {

  app.AppComponent =

    ng.core.Component({
      selector: 'my-app',
      template: '<h1>My First Angular 2 App</h1>'
    })

    .Class({
      constructor: function() {}
    });

})(window.app || (window.app = {}));
```
* 如果 app 不存在，就要将它初始化为空对象。
* app.conponent.js 文件输出为 AppComponent
* 它是一个集合库模块。每个库本身都是一个模块，由几个相关的功能模块组成。当我们需要有angular的东西时，我们就用这个对象。
* ng.core.Component() 告诉angular这个类定义的对象是一个angular组件。
* selector：选择器
* template：模版

#### 3.引导它来控制页面
在app文件夹中添加文件，main.js
```
(function(app) {
  document.addEventListener('DOMContentLoaded', function() {
    ng.platform.browser.bootstrap(app.AppComponent);
  });
})(window.app || (window.app = {}));
```
模块依赖于其他模块。当我们需要另一个模块提供的东西，会从它程序对象中引入。例如当一个模块需要从app.appcomponent引用appcomponent这样：
```
ng.platform.browser.bootstrap(app.AppComponent);
```

#### 4.编写主页
创建index.html文件
```
<html>
  <head>
    <title>Angular 2 QuickStart</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- 1. Load libraries -->
    <!-- IE required polyfill -->
    <script src="node_modules/es6-shim/es6-shim.min.js"></script>

    <script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
    <script src="node_modules/rxjs/bundles/Rx.umd.js"></script>
    <script src="node_modules/angular2/bundles/angular2-all.umd.js"></script>

    <!-- 2. Load our 'modules' -->
    <script src='app/app.component.js'></script>
    <script src='app/main.js'></script>

  </head>

  <!-- 3. Display the application -->
  <body>
    <my-app>Loading...</my-app>
  </body>

</html>
```
* 1.加载所需要的javascript库
* 2.加载所需要的javascript文件（要注意顺序：例如main.js需要app.component.js，那么app.component.js需要在前面。
* 3.应用的所在的标签

#### 5.跑起来
```
npm start
```
