# React.js学习笔记之组件属性与状态

@(前端技术)
> 组件本质上是状态机，输入确定，输出一定确定

组件把状态与结果一一对应起来，组件中有state与prop（状态与属性）。
* 属性是由父组件传递给子组件的
* 状态是子组件内部维护的数据，当状态发生变化的同时，组件也会进行更新。当状态发生转换时会触发不同的钩子函数，从而让开发者有机会做出相应.
## statics
statics 对象允许你定义静态的方法，这些静态的方法可以在组件类上调用。
``` javascript
var MyComponent = React.createClass({
  statics: {
    customMethod: function(foo) {
      return foo === 'bar';
    }
  },
  render: function() {
  }
});

MyComponent.customMethod('bar');  // true
```
在这个块儿里面定义的方法都是静态的，意味着你可以在任何组件实例创建之前调用它们，这些方法不能获取组件的 props 和 state。如果你想在静态方法中检查 props 的值，在调用处把 props 作为参数传入到静态方法。
## props
this.props 表示一旦定义，就不再改变的特性
### 属性的用法
#### 1.键值对
`键 ：值`
值可以有多种形式
* 字符串："XiaoWang"
* 求值表达式 {123}、{"XiaoWang"}
* 数组{[1,2,3]}
* 变量{variable}
* 函数求值表达式{function}（不推荐，如果需要函数可以单独把函数提取出来然后单独调用函数）
``` javascript
var HelloWorld =React.createClass({
	rencer:function () {
		return <p>Hello,{this.props.name ? this.props.name : "World"}</p>;
	},
});
var HelloUniverse = React.createClass({
	getInitialState:function () {
		return {name: ''};
	},
	handleChange: function (event) {
		this.setState({name: event.target.value});
	},
	render: function () {
		return <div>
		<HelloWorld name={this.state.name}></HelloWorld>
		<br/>
		<input type="text" onChange={this.handleChange} />
		</div>
	},
});
ReactDom.render(<HelloUniverse />,document.body);
```
#### 2.展开语法{...props}
React会自动把对象中的属性和值当做属性的赋值
``` javascript
var HelloWorld =React.createClass({
	rencer:function () {
		return <p>Hello,{this.props.name1 + ' 'this.props.name2}</p>;
	},
});
var HelloUniverse = React.createClass({
	getInitialState:function () {
		return {
			name: 'Tim',
			name2:'John',
		};
	},
	handleChange: function (event) {
		this.setState({name: event.target.value});
	},
	render: function () {
		return <div>
		<HelloWorld name={...this.state}></HelloWorld>
		<br/>
		<input type="text" onChange={this.handleChange} />
		</div>
	},
});
ReactDom.render(<HelloUniverse />,document.body);
```
#### 3.setProps
``` javascript
var HelloWorld =React.createClass({
	rencer:function () {
		return <p>Hello,{this.props.name ? this.props.name : "World"}</p>;
	},
});
var instance = React.render(<HelloWorld />,document.body);
instance.setProps({name:'Tim'});
```
` setProps(object nextProps[, function callback])`
可以设置组件的属性。这个方法已经过时了（与replaceProps等一样），不久将被删除。这个方法不支持ES6类组件React.Component扩展。
### propTypes
组件的属性可以接受任意值，字符串、对象、函数等等都可以。有时，我们需要一种机制，验证别人使用组件时，提供的参数是否符合要求。
* 组件类的PropTypes属性，就是用来验证组件实例的属性是否符合要求

``` javascript
var MyTitle = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },
  render: function() {
     return <h1> {this.props.title} </h1>;
   }
});
```
### getDefaultProps
getDefaultProps 方法可以用来设置组件属性的默认值。
``` javascript
var MyTitle = React.createClass({
  getDefaultProps : function () {
    return {
      title : 'Hello World'
    };
  },

  render: function() {
     return <h1> {this.props.title} </h1>;
   }
});
ReactDOM.render(<MyTitle />,document.body);
```
### this.props.children
this.props 对象的属性与组件的属性一一对应，但是有一个例外，就是 this.props.children 属性。它表示组件的所有子节点
``` javascript
var NotesList = React.createClass({
  render: function() {
    return (
      <ol>
      {
        React.Children.map(this.props.children, function (child) {
          return <li>{child}</li>;
        })
      }
      </ol>
    );
  }
});
ReactDOM.render(
  <NotesList>
    <span>hello</span>
    <span>world</span>
  </NotesList>,
  document.body
);
```
上面代码的 NoteList 组件有两个 span 子节点，它们都可以通过 this.props.children 读取。
这里需要注意， this.props.children 的值有三种可能：
1. 如果当前组件没有子节点，它就是 undefined；
2. 如果有一个子节点，数据类型是 object；
3. 如果有多个子节点，数据类型就是 array

React 提供一个工具方法 React.Children 来处理 this.props.children 。我们可以用 React.Children.map 来遍历子节点，而不用担心 this.props.children 的数据类型是 undefined 还是 object。
1.React.Children.map
`object React.Children.map(object children, function fn [, object context])`
在每一个直接子级（包含在 children 参数中的）上调用 fn 函数，此函数中的 this 指向 上下文。如果 children 是一个内嵌的对象或者数组，它将被遍历：不会传入容器对象到 fn 中。如果 children 参数是 null 或者 undefined，那么返回 null 或者 undefined 而不是一个空对象。
2.React.Children.forEach
`React.Children.forEach(object children, function fn [, object context])`
类似于 React.Children.map()，但是不返回对象。
3.React.Children.count
`number React.Children.count(object children)`
返回 children 当中的组件总数，和传递给 map 或者 forEach 的回调函数的调用次数一致。
4.React.Children.only
`object React.Children.only(object children)`
返回 children 中仅有的子级。否则抛出异常。
## state
> 组件在运行时需要修改的数据就是状态

组件免不了要与用户互动，React 的一大创新，就是将组件看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI
> this.state 是会随着用户互动而产生变化的特性。

###state工作原理
常用的通知 React 数据变化的方法是调用 setState(data, callback)。这个方法会合并（merge） data 到 this.state，并重新渲染组件。渲染完成后，调用可选的 callback 回调。大部分情况下不需要提供 callback，因为 React 会负责把界面更新到最新状态。
``` javascript
var LikeButton = React.createClass({
  getInitialState: function() {
    return {liked: false};
  },
  handleClick: function(event) {
    this.setState({liked: !this.state.liked});
  },
  render: function() {
    var text = this.state.liked ? 'like' : 'haven\'t liked';
    return (
      <p onClick={this.handleClick}>
        You {text} this. Click to toggle.
      </p>
    );
  }
});

ReactDOM.render(
  <LikeButton />,
  document.getElementById('example')
);
```
#### getInitialState
`object getInitialState()`
getInitialState 方法用于定义初始状态，也就是一个对象，这个对象可以通过 this.state 属性读取。在组件挂载之前调用一次。返回值将会作为 this.state 的初始值。
#### setState
`setState(object nextState[, function callback])`
合并 nextState 和当前 state。这是在事件处理函数中和请求回调函数中触发 UI 更新的主要方法。另外，也支持可选的回调函数，该函数在 setState 执行完毕并且组件重新渲染完成之后调用。this.setState 方法用于修改状态值，每次修改以后，自动调用 this.render 方法，再次渲染组件。
> 注意：
> 1. 绝对不要直接改变 this.state，因为在之后调用 setState() 可能会替换掉你做的更改。把 this.state 当做不可变的。
> 2. setState ( )  不会立刻改变 this.state，而是创建一个即将处理的 state 转变。在调用该方法之后获取 this.state 的值可能会得到现有的值，而不是最新设置的值。
> 3. 不保证 setState ( ) 调用的同步性，为了提升性能，可能会批量执行 state 转变和 DOM 渲染。
> 4. setState ( )  将总是触发一次重绘，除非在 shouldComponentUpdate ( ) 中实现了条件渲染逻辑。如果使用可变的对象，但是又不能在shouldComponentUpdate ( )  中实现这种逻辑，仅在新 state 和之前的 state 存在差异的时候调用 setState ( )  可以避免不必要的重新渲染。
#### replaceState
`replaceState(object nextState[, function callback])`
类似于 setState()，但是删除之前所有已存在的 state 键，这些键都不在 nextState 中。
> 注意：这个方法在ES6类组件扩展不可用，它可能会在未来某个React版本中删除
### 哪些组件应该有 State？
大部分组件的工作应该是从 props 里取数据并渲染出来。但是，有时需要对用户输入、服务器请求或者时间变化等作出响应，这时才需要使用 State。
尝试把尽可能多的组件无状态化。这样做能隔离 state，把它放到最合理的地方，也能减少冗余，同时易于解释程序运作过程。
> 常用的模式是创建多个只负责渲染数据的无状态（stateless）组件，在它们的上层创建一个有状态（stateful）组件并把它的状态通过 props 传给子级。这个有状态的组件封装了所有用户的交互逻辑，而这些无状态组件则负责声明式地渲染数据。
### 哪些应该作为 State？
State 应该包括那些可能被组件的事件处理器改变并触发用户界面更新的数据。 真实的应用中这种数据一般都很小且能被 JSON 序列化。当创建一个状态化的组件时，想象一下表示它的状态最少需要哪些数据，并只把这些数据存入 this.state。在 render() 里再根据 state 来计算你需要的其它数据。你会发现以这种方式思考和开发程序最终往往是正确的，因为如果在 state 里添加冗余数据或计算所得数据，需要你经常手动保持数据同步，不能让 React 来帮你处理。
### 哪些不应该作为 State？
this.state 应该仅包括能表示用户界面状态所需的最少数据。因此，它不应该包括：
* 计算所得数据： 不要担心根据 state 来预先计算数据 —— 把所有的计算都放到 render() 里更容易保证用户界面和数据的一致性。例如，在 state 里有一个数组（listItems），我们要把数组长度渲染成字符串， 直接在 render() 里使用 this.state.listItems.length + ' list items' 比把它放到 state 里好的多。
* React 组件： 在 render() 里使用当前 props 和 state 来创建它。
* 基于 props 的重复数据： 尽可能使用 props 来作为惟一数据来源。把 props 保存到 state 的一个有效的场景是需要知道它以前值的时候，因为未来的 props 可能会变化。

## 属性和状态的对比
### 相似点
####1. 都是纯JS对象
纯JS对象就是JS中的原生对象。是使用 { } 来创建的对象
####2. 都会触发render更新
状态和属性的变化都会触发render更新，属性和状态的改变都会触发整个生命周期流程，从处理属性到是否应该更新，到进行对比，到最后的render真正执行，会触发很多函数，我们可以在不同的函数中进行不同的对应操作。
####3. 都具有确定性
给定相同的属性和相同的状态，组件生成的都是相同的代码
### 对比
| Item      |    属性 | 状态  |
| :-------- | :-------:| :-------: |
| 能否从父组件获取初始值？ | o |  x   |
| 能否由父组件修改？ | o |  x   |
| 能否在组件内部设置默认值？ | o |  o   |
| 能否在组件内部修改？ | x |  o   |
| 能否设置子组件的初始值？ | o |  x   |
| 能否修改子组件的值？ | o |  x   |
* 状态只与组件本身相关，由自己本身维护。与父组件与子组件无关
* 组件不能修改自己的属性，但可以从父组件获取属性，父组件也能修改其属性，组件也可以修改子组件的属性
## 实例
关于属性与状态的实例代码传送门：[React简易小demo](https://github.com/Xiaoxianrou/Blog/tree/master/2016.02/React-Demo/demo1)
## 小结
本文主要介绍了组件的属性与状态。组件化是React的主要思想，也是其核心所在。组件化也是前端未来的发展趋势，React算是引领了这一潮流吧。关于属性与状态的更多用法在生命周期与协同使用中还会介绍。
### PS
被官微转发了有点小意外。声明下，目前在网上找不到一个比较完整的文字react学习文章，博主决定利用业余时间总结下。本博文原创内容不多，大部分都是对文档与网上文章的自己学习总结。
### 特别感谢
* [极客学院React.js系列课程](http://www.jikexueyuan.com/course/reactjs/)
* [React 入门实例教程 by 阮一峰](http://www.ruanyifeng.com/blog/2015/03/react.html)
* [React.js官方文档](http://facebook.github.io/react/index.html)
