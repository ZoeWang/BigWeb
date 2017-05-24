#XSS
####什么是跨站脚本攻击？
XXS，全称跨站脚（Cross Site Scripting），一种注入式的攻击方式。攻击者在页面植入恶意代码， 访问者访问页面，浏览器就会执行攻击者所植入的恶意代码。从而达到攻击访问者的目的，访问者会被进行身份的窃取、调离等等。
XSS的成因？
对用户输入没有严格控制而直接输出到页面
对非预期输入的信任
XSS的危害？
盗取各种用户账号，如机器登录账号、用户网银账号、各类管理员账号
窃取数据
非法转账
挂马

Payload（有效荷载）
```
<img src =0 onerror=alert(5)>
```
PoC?
用于验证漏洞是否存在
Exp?
利用漏洞

####XSS分类
存储型
例如：留言板功能。提交留言，存储到数据库。渲染到页面，读取数据。
攻击者可以提交恶意代码上传到数据库并渲染到页面。
反射型
例如：http://www.xx.com/search.html?key_pro=”><scritp>confirm(1501)</script>
内容直接读取并且反射在页面上
DOM型
DOM型也属于反射型的一种，不过比较特殊，所以一般也当做独立的一种
MXSS突变型XSS
UXSS通用性XSS
FlashXSS
UTF-7XSS
MHTMLXSS
CSSXSS
VBScriptXSS

####XSS盲打
XSS盲打是指攻击者对数据提交后展现的后台未知情况下的一种XSS攻击方式

####XSS蠕虫
Samy蠕虫
2015.10.14，samy worm 成为第一大使用跨站脚本进行传播感染的蠕虫。一夜之间，蠕虫在世界最流行的社交网站myspace.com上，更改超过一百万个人用户个人资料页面。

####谷歌XSS闯关游戏
https://xss-game.appspot.com
答案：http://www.freebuf.com/articles/web/36072.html
#####Level 1:hello,world of XSS
首先在输入框输入一个无害的字符串111，测试我们的输入是否被嵌入到页面。
审查元素看到，输入字符111在b的2个标签之间。
插入</b>111<b>闭合2个标签，也可以不闭合b标签以为标签里面允许插入。
然后把111替换成js代码插入，
例如：
```
<srcipt>alert(/xss/)</script>
```
也可以是：
```
<img src =0 onerror=alert(0)>
```
还可以使：
```
<svg/onload=alert(0)>
```
#####Level 2:Persistence is key 是一个存储型的XSS
首先首先在输入框输入一个无害的字符串111，测试我们的输入是否被嵌入到页面。
审查元素看到，输入字符111在blockquote的2个标签之间。
然后把111替换成js代码插入，
例如：
```
 <img src =0 onerror=alert(0)>
```
#####Level 3：That sinking feeling
第三关看到url结尾处有#1，可以判断是一个DOM型XSS。
首先尝试交互切换标签，发现#1的1会变成2和3，
所以推测通过控制#1，#2，#3来控制tab类的图片切换。
审查元素查看源代码可以发现有这样的一段js代码：
```
Window.onload= function(){
    chooseTab(self.location.hash.substr(1) || ”1”);
}
```
意思是当窗口载入的时候执行这个代码，调用chooseTab函数，根据self.location.hash的值来进行传递，没有默认是1。
然后看一下调用的chooseTab函数：
```
Function chooseTab(num){
//传进一个参数，就是#后面那个默认的1
    Var html = “Image” + parseInt(num) + “<br>”;
    //把参数转换成整数型，再加入image赋值到html变量中。
    Html +=”<img src = ‘/static/level3/cloud”+num+”.jpg’/>”;
    //可以看到num没有做任何过滤就拼接到img的src里面去了
    $(‘#tabContent’).html(html);
    Window.location.hash=num;
    Var tabs=document.querSelectorAll(‘.tab’);
    For(var i = 0;i<tabs.length;i++{
        If(tabs[i].id ==”tab” + parseInt(num){
            Tabs[i].className = “tab active”;
        }else{
        Tabs[i].className = “tab”;
        }
    }
    Top.postMessage(self.location.toString(),”*”);
}
```
问题就处于
```
Html +=”<img src = ‘/static/level3/cloud”+num+”.jpg’/>
```
这个代码中，num没有做任何过滤就拼接到img的src里面去了。
正如我们传入的值是#1，就会构成<img src =’/static/level3/cloud1.jpg’/>这一个情况。
首先我们应该闭合两边的单引号，在中间输入代码，例如：
```
<img src =’/static/level3/cloud  ‘payload’  .jpg’/>
```
发现后面如果只是存在’.jpg’这样是不合理的，所以我们可以为他添加一个属性，例如
```
<img src =’/static/level3/cloud  ‘payload’  .jpg’/>
```
然后我们看到是img标签前面加载的图片是错误的，所以payload可以为oneeror，例如：
```
<img src =’/static/level3/cloud  ‘onerror=alert(0) a=’  .jpg’/>
```
当然也可以加载是正确的，例如：
```
<img src =’/static/level3/cloud  1.jpg‘onload=alert(0) a=’  .jpg’/>
```
还可以使用script标签：
```
’><script>alert(0);</scritp>
```
因为是一个DOM插入所以查看源代码是看不到效果的，可以通过审查元素看到。

#####Level 4:Context matters
我么可以看到有一个输入框3，和一个url网址https://xss-game.appspot.com/level4/frame
点击提交，url发生变化为https://xss-game.appspot.com/level4/frame?timer=3
我们查看发生变化后的源代码，这样就可以看到他的js代码，和下面其他代码。
然后我们查看一下那几个地方有输入框的3，发现
```
<img src=”/static/loading.gif”  onload=”startTimer(3);”/>
```
<div id=”message”>Your time will execute in 3 seconds.</div>
接着我们改一下参数把url里面的3改成111，确定代码部分都发生了变化。
首先我们尝试<div>标签里插入一个完整的标签闭合
```
<img src=0 onerror=alert(0)>
```
测试后发现尖括号被转译了，所以我们测试下一个暂不进行深入。
所以我们查看一下startTime函数：
```
Function startTimer(){
    Seconds = parseInt(seconds)||3;
    setTimeout(function(){
        window.confirm(“time is up”);
        window.history.back();
    },seconds = 1000);
}
```
可以很遗憾的发现进行了一个整形的转换，代表着尖括号、引号之类的都插不进去，只能插入整数。
老样子来闭合一下img的onload=“startTime(‘111’)的引号和括号。
```
<img src=”/static/loading.gif”  onload=”startTimer(‘  111’);alert(‘0  ’);”/>,
```
提取
```
payload：111’);alert(‘0 
```
然后把分号和括号转译，
打开：
```
http://evilcos.me/lab/xssor/
```
转译 ‘和;为
```
%27)%3balert(%270
```

Level 5：Breaking protocol
在输入框中输入字符，点击，发现字符出现在url尾部，与level1同理。
输入或把url变化部分改为：javascript:alert(0)

#####Level 6：Follow the rabbit
http://www.freebuf.com/articles/web/36072.html

####XSS的一些基本转义
html_escape
javascript_string_escape
url_escape
css_string_escape
推荐：《给开发者的终极XSS防护备忘录》

####设置字符编码和content-type
字符编码：避免如utf-7 XSS等问题
Content-type：避免如json的XSS等问题

####HTTP响应头的一些XSS防护指令
X-XSS-Protection:1;mode=block  该响应头会开启浏览器的防XSS过滤器
X-Frame-Options:deny    改响应头会精致页面被加载到框架。
X-Content-Type-Options:nosniff    改响应头会纸质浏览器做MIMEtype
Content-Security-Policy:default-src’self’    允许我们定义从URLS或内容中加载和执行对象的策略
SetCookie:key=value;HttpOnly    通过HttpOnly标签的设置将限制JavaScript访问你的cookie
Content-Type:type:/subtype;charset=utf-8    始终设置响应内容类型和字符集，例如：返回json格式应该使用application/json，纯文本使用text/plain,HTML使用text/html等等，字符集为utf-8。

####PHP的XSS防护
Echo htmlespecialchars($string,ENT_QUOTES | ENT_XHTML,’UTF-8’);

####JAVA的XSS防护
使用WASP java Encoder
Coverity Security Library（CSL）
Cov:htmlEscape(string)：执行HTML编码
Cov:jsStringEscape(string)：执行JavaScript字符串编码
Cov:asURL(string)：执行CSS字符串编码
Cov:asNumber(string)：检查输入额字符串是一个数值，默认值为0
Cov:asCssColor(string)：允许将颜色字符串指定为文本或者十六进制并且防止注入
Cov:uriEncode(name)：执行URL编码

####OWASP ESAPI
ESAPI.encoder().encodeForHTML()  转义HTML

百度前端防火墙
