# React.js学习笔记之JSX解读

@(前端技术)


## Why React?
不多说，Facebook大腿很粗

## 什么是JSX
JSX是React的核心组成部分，它使用XML标记的方式去直接声明界面，界面组件之间可以互相嵌套。
> JSX=JavaScriptXML

JSX可以理解为在JS中编写与XML类似的语言（与XML有本质上的不同），它的目的不是要在浏览器或者引擎中实现，也不是把其加入ECMAScript标准。它的目的是通过各种编译器将这些标记编译成标准的JS语言。

JSX是：
* 基于ECMAScript的一种新特性（并不是一种新语言）
* 一种定义带属性树结构（DOM结构）的语法

JSX不是：
* XML或者HTML
* 一种限制 （你不需要为了 React 使用 JSX，可以直接使用纯粹的 JS。但更建议使用 JSX , 因为它能定义简洁且我们熟知的包含属性的树状结构语法。）

JSX的特点：
1. 类XML语法容易接受，结构清晰
2. 增强JS语义
3. 抽象程度高，屏蔽DOM操作，跨平台
4. 代码模块化

``` javascript
// 用JSX来表达组件
var dropdown =
  <Dropdown>
    A dropdown list
    <Menu>
      <MenuItem>Do Something</MenuItem>
      <MenuItem>Do Something Fun!</MenuItem>
      <MenuItem>Do Something Else</MenuItem>
    </Menu>
  </Dropdown>;
render(dropdown);
```

## JSX语法
JSX本身就和XML语法类似，可以定义属性以及子元素。唯一特殊的是可以用大括号来加入JavaScript表达式，例如
``` javascript
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
ReactDOM.render(<HelloMessage name="xiaowang" />, mountNode);
```

### 一、元素名
自定义出的组件标签名，React 的 JSX 里约定分别使用首字母大、小写来区分本地组件的类和 HTML 标签。render渲染时，会把大写的组件名定义为自定义组件，把小写的组件名定义为HTML自带的标签名进行渲染。
> var HelloMessage =

JSX的标签与函数名都是使用的驼峰命名。

#### htmlFor和className
for和class为js的保留字，在书写for与class时需要修改为htmlFor何className，注意都是使用的驼峰命名。

### 二、子节点
组件与组件之间就像标签与标签之间可以有嵌套关系，与HTML不同的是可以在子节点中使用求值表达式。目前， 一个 component 的 render，只能返回一个节点。如果你需要返回一堆 div ， 那你必须将你的组件用 一个div 或 span 或任何其他的组件包裹。
> 切记，JSX 会被编译成常规的 JS； 因此返回两个函数也就没什么意义了，同样地，千万不要在三元操作符中放入超过一个子节点。

#### 节点属性：
使用标签的时候指定属性和属性值传入标签内部，使标签内部可以使用属性值。

#### 注意：
如果往原生 HTML 元素里传入 HTML 规范里不存在的属性，React 不会显示它们。如果需要使用自定义属性，要加 data- 前缀。
``` html
<div data-custom-attribute="foo" />
```
然而任意属性支持自定义元素
``` html
<x-my-component custom-attribute="foo" />
```

### 三、求值表达式
要使用 JavaScript 表达式作为属性值，只需把这个表达式用一对大括号 ( {  } ) 包起来，不要用引号 ( "  " )。
求值表达式本身与JSX没有多大关系，是JS中的特性。它是会返回值的表达式，与语句有本质上的不同，在编写JSX时，在 {     } 中不能使用语句（if语句、for语句等等）。我们不能直接使用语句，但可以把语句包裹在函数求值表达式中运用。建议把函数表达式独立出来，在 {  } 调用。

#### 条件判断的写法
你没法在JSX中使用 if-else 语句，因为 JSX 只是函数调用和对象创建的语法糖。在 { } 中使用，是不合法的JS代码，不过可以采用三元操作表达式
``` javascript
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name ？ this.props.name : "World"}</div>;
  }
});
ReactDOM.render(<HelloMessage name="xiaowang" />, document.body);
```
可以使用比较运算符“ || ”来书写，如果左边的值为真，则直接返回左边的值，否则返回右边的值，与if的效果相同。
``` javascript
var HelloMessage = React.createClass({
  render: function() {
	  return <div>Hello {this.props.name || "World"}</div>;
  }
});
ReactDOM.render(<HelloMessage name="xiaowang" />, document.body);
```
也可以使用变量来书写
``` javascript
var HelloMessage = React.createClass({
  getName : function() {
	  if (this.props.name)
		  return this.props.name
	  else
		  return "world"
  }
  render: function() {
	  var name = this.getName();
	  return <div>Hello {name}</div>;
  }
});
ReactDOM.render(<HelloMessage name="xiaowang" />, document.body);
```
其中可以把变量去掉，直接在 { } 中调用函数
``` javascript
  render: function() {
	  return <div>Hello {this.getName()}</div>;
  }
```

#### 函数表达式
（ ）有强制运算的作用
``` javascript
var HelloMessage = React.createClass({
  render: function() {
	  return <div>Hello {
		  （function(obj){
			  if(obj.props.name)
				  return obj.props.name
			  else
				  return "World"
			  }(this))
	  }</div>;
  }
});
ReactDOM.render(<HelloMessage name="xiaowang" />, document.body);
```
外括号“  ）”放在外面和里面都可以执行。唯一的区别是括号执行完毕拿到的是函数的引用，然后再调用；括号放在外面的时候拿到的事返回值。需传入（this）。



### 四、注释
JSX 里添加注释很容易；它们只是 JS 表达式而已。你只需要在一个标签的子节点内(非最外层)小心地用 { } 包围要注释的部分。
``` html
var content = (
  <Nav>
    {/* 一般注释, 用 {} 包围 */}
    <Person
      /* 多
         行
         注释 */
      name={window.isLoggedIn ? window.name : ''} // 行尾注释
    />
  </Nav>
);
```

### 五、样式
尽管在大部分场景下我们应该将样式写在独立的CSS文件中，但是有时对于某个特定组件而言，其样式相当简单而且独立，那么也可以将其直接定义在JSX中。在JSX中使用样式和真实的样式也很类似，通过style属性来定义，但和真实DOM不同的是，属性值不能是字符串而必须为对象，需要注意的是属性名同样需要驼峰命名法。例如：
``` html
<div style={{color: '#ff0000', fontSize: '14px'}}>Hello World.</div>
```
``` javascript
var style = {
	color : "red",
	border : "1px solid #000"
}
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
ReactDOM.render(<div style={style}><HelloMessage name="xiaowang" /></div>, document.body);
```

## Babel进行JSX编译
> JSX是一种新的语法，浏览器并不能直接运行

React官方博客发布了一篇文章，声明其自身用于JSX语法解析的编译器JSTransform已经过期，不再维护，React JS和React Native已经全部采用第三方Babel的JSX编译器实现。原因是两者在功能上已经完全重复，而Babel作为专门的JavaScript语法编译工具，提供了更为强大的功能。
推荐使用Webpack进行React开发，首先通过npm安装Babel：
> npm install —save-dev babel-loader

在webpack.config.js里进行配置
``` javascript
module: {
  loaders: [
    { test: /\.jsx?$/, loaders: ['babel-loader']}
  ]
}
```

## 小结
本文主要介绍了声明组件的语法JSX。看似有点神秘的JSX背后的原理非常简单：只是一种用于创建组件的XML语法。让代码直观易懂是软件项目质量的重要保证之一，这意味着代码更加容易理解和维护，出现Bug时更容易调试和修复。因此React这种采用JSX语法，以声明式的方法来直观的定义用户界面的方式，正是其最大的价值。
### 特别感谢
* [极客学院React.js系列课程](http://www.jikexueyuan.com/course/reactjs/)
* [React 入门实例教程 by 阮一峰](http://www.ruanyifeng.com/blog/2015/03/react.html)
* [深入浅出React（三）：理解JSX和组件](http://www.infoq.com/cn/articles/react-jsx-and-component?utm_source=tuicool)
* [React.js官方文档](http://facebook.github.io/react/index.html)
