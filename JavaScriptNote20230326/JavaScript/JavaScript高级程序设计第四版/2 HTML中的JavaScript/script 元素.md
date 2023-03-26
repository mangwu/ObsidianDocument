# <script>元素

# 1.<script>元素的属性(attribute)

- script元素主要的8个属性（不包括HTML全局属性）
    1. **`async`（HTML5）:** 可选，异步的意思，使用该属性表示：
        1. 立即开始下载**脚本**(**script**)，并尽快解析执行
        2. 不能阻止(**prevent**)其他的页面动作，如不能阻止其他脚本下载，或其他资源（样式表等）下载
        3. 只对外部脚本(**external script files**)有效（该属性对定义在HTML内部的脚本语句没有意义，因为无需下载）
    2. `charset`: 可选，已被**废弃**属性
        1. 值必须为'utf-8', 表示设置`src`属性的代码字符集
        2. 因为页面文档必须是UTF-8，所以**浏览器不会在意它的值**
        3. script会从页面文档中默认继承该属性
    3. `crossorigin`： 可选，用于配置相关请求的(CORS跨资源共享)设置，默认不会使用CORS
        1. `crossorigin="anonymous"`配置文件请求**不必设置凭据标志**（**no** **credentials flag set**），设置为空或者不设置属性值默认为`anonymous`
        2. `crossorigin="use-credentials"`设置凭据标志，意味着出站请求会包含凭据
        3. 在[通过cdn引入React使用了crossorigin](https://www.notion.so/React-b0fbbea6ce894eb4b48a42e6c3a20a1a)用于允许接收远程脚本报错
        
        [CORS settings attributes - HTML（超文本标记语言） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/crossorigin)
        
    4. **`defer`**: 布尔属性，可选：
        1. 表示脚本可以延迟到文档被**完全解析和显示之后（DOMContentLoaded事件之前）**再执行
        2. 只对外部脚本有效，模块脚本默认是defer
        3. IE7之前行内脚本也可以指定这个属性
    5. `integrity`: 可选：
        1. 用于对比接收到的资源和指定的加密签名以验证子资源完整性（SRI, Subresource Integrity）
        2. 如果接收到的资源的签名和属性指定的签名不匹配，页面报错，脚本不执行
        3. 该属性确保**内容分发网络(CDN, Content Delivery Network)**不会提供恶意内容
    6. `language`: **废弃**：
        1. 最初用来表示代码块中的脚本语言，如JavaScript ，JavaScript1.2
        2. 但是该属性未被标准化，且有了更为通用的type，大多数浏览器会忽略这个属性、
    7. **`src`**:  可选：
        1. 用来引用外部脚本的URI，可以代替直接在文档中嵌入脚本
        2. 指定了src的脚本不应该在元素标签内部再嵌入脚本
    8. **`type`**: 可选，代替language：
        1. 属性值类型为MIME类型（代表代码块脚本语言的内容类型）
        2. 默认值始终是“text/javascript"
        3. MIME类型包括"text/javascript", "text/ecmascript","application/javascript","application/ecmascript"
        4. 如果不是MIME类型，而是”module“，则代码会被当成ES6的模块，允许使用import和export
        5. 或者不是MIME类型，也不是"module"，该**元素包含的内容会被当作数据块而不会被浏览器执行**
    9. `nomodule`: 不常用属性，布尔值
        1. 设置脚本在支持ES6 module的浏览器中不执行
        2. 用于在不支持模块化的旧版本浏览器中提供回退脚本
    10. `nonce`： CSP(Content Security Policy)定义的属性
        1. CSP实质是白名单制度，用于告诉客户端那些外部资源可以加载执行
        2. CSP设置了一些[资源加载限制](http://www.ruanyifeng.com/blog/2016/09/csp.html)，其中一个就是script-src
        3. script-src设置了一些特殊值，其中一个就是nonce
        4. nonce的值用于在每次HTTP回应都会给出一个授权token，页面内嵌的脚本必须有这个token才会执行
            
            ```jsx
            // nonce值的例子如下，服务器发送网页的时候，告诉浏览器一个随机生成的token。
            Content-Security-Policy: script-src 'nonce-EDNnf03nceIOfn39fn3e9h3sdfa'
            ```
            
            ```jsx
            //页面内嵌脚本，必须有这个token才能执行。
            <script nonce=EDNnf03nceIOfn39fn3e9h3sdfa>
              // some code
            </script>
            ```
            
    11. **`[referrerpolicy](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script#attr-referrerpolicy)`**
        
        [- HTML（超文本标记语言） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script#attr-referrerpolicy)
        

# 2.使用<script>元素的方式

- 有两种使用<script>元素的方式：
    - 直接在<script>元素中嵌入JavaScript代码
    - 在网页中通过<script>引入外部代码

## 2.1 直接嵌入JavaScript代码

- 这种方法引入的JavaScript代码称为**行内JavaScript代码**
- 使用方式为直接把JavaScript放入<script>元素中即可
    
    ```jsx
    <script>
    	function sayHi() {
    		console.log("Hi!");
    	}
    <script>
    ```
    
- 行内JavaScript代码注意事项:
    1. 行内JavaScript从从上到下解释执行
        1. 上面的例子解释的是一个函数定义
        2. 该函数定义后被**保存在解释器环境**中
    2. <script>标签没有添加任何属性，所以
        1. 默认在<script>元素中的代码计算执行完成前，页面的其余内容不会被加载和显示
    3. 使用行内JavaScript代码注意不要出现”</script>”字符串，否则报错
        
        ```jsx
        <script>
        	function sayHi() {
        		console.log("</script>"); //浏览器报错
        	}
        <script>
        ```
        
        1. 浏览器解析行内JavaScript代码时看到字符串</script>会将其视为结束标签
            
            ![tianruo_2021-12-20-637756363422086851.png](script%20%E5%85%83%E7%B4%A0/tianruo_2021-12-20-637756363422086851.png)
            
        2. 避免这个问题使用转义字符”\”转义”/”即可
            
            ```jsx
            <script>
            	function sayHi() {
            		console.log("<\/script>"); //浏览器报错
            	}
            <script>
            ```
            

## 2.2 外部引入JavaScript文件

- 外部引入JavaScript文件的方式
    - 使用src属性指明文件URL
        
        ```jsx
        <script src="./example.js"><script>
        ```
        
- 外部引入JavaScript文件注意事项
    1. 文件本身只需包含需要放在<script>开始和结束标签中间的JavaScript代码
    2. 没有添加其他属性的情况下，解释只需外部JavaScript文件时，默认会阻塞页面（单线程），**阻塞时间包括下载文件时间**
    3. 在XHTML文档中，可以忽略结束标签，使用单标签元素模式
        
        ```html
        <script src="./example.js" />
        ```
        
        现代浏览器（谷歌等）无法解析上述语法
        
    4. 外部JavaScript文件的扩展名不一定为”.js”
        1. 浏览器不会检查包含JavaScript代码文件的文件扩展名
        2. 这就给**服务器端脚本语言动态生成JavaScript代码**，以及**在浏览器中编译JavaScript扩展语言**（如jsx，typescript）转译为JavaScript提供了可能
        3. 服务器会根据文件扩展来确定响应的正确MIME类型，确保不使用.js扩展的文件能返回正确的MIME类型，如**.jsx**使用`type="text/babel"` 
    5. 使用了src属性的<script>元素不应该再在元素中包含其他JavaScript代码

### 2.2.1外部引入是<script>元素的一大特性

- 外部引入文件的类型有以下两种：
    - 引入同域的JavaScript文件，可以是同域下的相对路径
    - 引入外部域的JavaScript文件，即src属性指明一个完整的外部域URL
- 引入外部域JavaScript文件是**强大**也备受**争议**的特性
    - 引入方式
        
        ```html
        <script src="http://www.somewhere.com/file.js"></script>
        ```
        
    - 浏览器通过script引入外部域文件过程
        1. 浏览器解析到script元素，解析到需要引入外部资源
        2. 浏览器向src属性指定的路径发生一个GET请求，以取得相应资源，假定是JavaScript文件
        3. GET请求不受浏览器同源策略的限制，但受页面HTTP/HTTPS协议的限制
        4. GET返回JavaScript文件后浏览器执行的该文件受同源策略限制
    - 引入的外部域代码会被当成页面一部分加载和解释
        - 这种方式触发了CDN(**Content Delivery Network** ，内容分发网络)的产生
        - 虽然很方便，但同时也产生了安全问题，因为外部JavaScript可能是**不安全**的
        - 确保外部域是自己所有或者该域是一个**可信的来源**
        - 使用[Integrity](script%20%E5%85%83%E7%B4%A0.md)标签可以防止安全问题

---

# 3.<script>的标签位置和执行顺序

## 3.1默认执行顺序

- 在HTML文档中的script元素会**按照顺序依次解释执行**
- 前提是没有使用defer和async属性

## 3.2标签位置

- 过去，<script>元素都被放在页面的<head>标签内
    
    ```html
    <!DOCTYPE html>
    <html>
    <head>
    	<meta charset="utf-8">
    	<title>
    		放在head中的script标签
    	</title>
    	<script type="text/javascript">
    		console.log("我是放在head标签中的脚本，在加载body之前先加载我")
    	</script>
    </head>
    <body>
    	<h2>
    		<a href="https://www.notion.so/mangwu/script-8482acc6dba14ca7948572a51bf60583#a724dbc46c3f4a2babc6db3fa6ccd9ff">标签位置</a>
    	</h2>
    </body>
    </html>
    ```
    
    1. 放入head元素中，方便统一处理CSS文件，JavaScript文件
    2. 缺点是把所有的JavaScript代码都下载解析和解释完成后才能开始渲染页面
        1. 页面在浏览器解析到body标签开始渲染
        2. JavaScript文件过大过多会导致渲染明显延迟，出现浏览器**窗口白屏**
- 现代Web引用程序将所有JavaScript引用放入body元素中的页面内容后面
    
    ```html
    <!DOCTYPE html>
    <html>
    <head>
    	<meta charset="utf-8">
    	<title>
    		script标签放入body中的最后位置
    	</title>
    </head>
    <body>
    	<h2>
    		<a href="https://www.notion.so/mangwu/script-8482acc6dba14ca7948572a51bf60583#e147fc725e824852b95c54ace2306e7c" target="_blank">标签位置</a>
    	</h2>
    	<script type="text/javascript">
    		console.log("我在body元素中的末尾位置！现代浏览器都这么干！")
    	</script>
    </body>
    </html>
    ```
    
    ⇒ 浏览器先渲染body中的内容，最后加载JavaScript，减少白屏时间
    

## 3.3 推迟执行脚本

### defer

- defer是HTML4.01提出的<script>元素的属性
    - 该属性表示脚本执行时不会改变页面结构
    - 即该脚本被延迟到整个页面都解析完毕后再运行
        - 立即下载
        - 但延迟执行
        - **只对外部脚本有效**
    
    ```html
    <!DOCTYPE html>
    <html>
    <head>
    	<meta charset="utf-8">
    	<title>推迟执行脚本</title>
    	**<script type="text/javascript" src="./deferscript.js" defer></script>**
    </head>
    <body>
    	<h2>
    		<a href="https://www.notion.so/mangwu/script-8482acc6dba14ca7948572a51bf60583#8db60d6d28f54e169b82efff250fd268">
    			推迟执行脚本
    		</a>
    	</h2>
    	<script type="text/javascript">console.log("我是正常脚本")</script>
    </body>
    </html>
    ```
    
    ⇒ 红色标记脚本为推迟执行脚本，在第二个脚本之后执行，先会打印“我是正常脚本”
    
- defer属性脚本特性
    - 在浏览器解析到结束的</html>之后才会执行推迟的脚本
    - HTML5规范要求，推迟的脚本之间的顺序仍然按照出现顺序执行
    - 所有推迟脚本都会在DOMContentLoaded事件之前执行
    - 以上的执行顺序**在实际运行中不是绝对**的，一个页面最好只包含一个这样的脚本
- 浏览器对defer属性的支持
    - HTML5明确规范defer只对外部脚本有效
    - 支持HTML5的浏览器会忽略行内脚本的defer属性
    - IE4~7都是旧行为（对行内脚本也有效）
    - 对于XHTML文档， 指定defer属性应该写成`defer="defer"`

## 3.4异步执行脚本

### async

- async是HTML5为<script>元素提出的属性：
    - 告诉浏览器立即下载脚本，但不阻塞其他资源的加载
    - 并且**不必**等脚本下载完毕和执行完后再加载页面
    - 也**不必**等到该异步脚本下载和执行完毕后再加载其他脚本
    
    ```html
    <!DOCTYPE html>
    <html>
    <head>
    	<meta charset="utf-8">
    	<title>异步加载脚本</title>
    	**<script type="text/javascript" async src="./example1.js"></script>
    	<script type="text/javascript" async src="./example2.js"></script>**
    
    </head>
    <body>
    	<h2>
    		<a href="https://www.notion.so/mangwu/script-8482acc6dba14ca7948572a51bf60583#9f89bab560674a7e90987c14649b25f6">异步加载脚本</a>
    	</h2>
    </body>
    </html>
    ```
    
- 异步加载脚本特性:
    - 只适用于外部脚本
    - **async的脚本不能保证按照出现顺序执行，**上面的例子，第二个脚本可能先于第一个执行
    - 异步脚本之间**不能有依赖关系**，否则会出错
        - 例如，如果a脚本依赖b脚本，而它们都是异步脚本
        - 如果a先执行，由于b未执行，a依赖的b的相关模块或变量有错误，可能得出错误结果或者直接报错
    - 异步脚本不应该在加载期间修改DOM
        - 因为异步脚本的执行后页面加载有可能同时进行
        - 如果在加载页面过程中使用异步脚本同时渲染DOM，会造成一些问题
    - 异步脚本**保证在页面的load事件前执行，但也可能在DOMContentLoaded之前或之后**
    - 对于XHTML文档，异步脚本的async属性应该写成`async="async"`

---

# 4.动态加载脚本

除了在HTML中使用script标签加载脚本，还可以通过DOM API动态加载指定脚本

- 动态加载脚本
    - 通过DOM API动态引入脚本到HTML文档
    1. 创建一个script元素
        
        ```html
        let script = document.createElement('script);
        ```
        
    2. 设置script元素属性
        
        ```html
        script.src = 'gibberish.js';
        ```
        
    3. 添加到head元素中
        
        ```html
        document.head.append(script);
        ```
        
- 动态加载脚本的特性:
    1. 动态加载的<script>元素默认是以异步方式加载的（async）
    2. 但是并不是所有的浏览器都支持async加载，可以在设置属性时关闭异步，使用同步方式
        
        ```html
        script.async = false;
        ```
        
    3. 动态加载的脚本对**浏览器预加载器**是不可见的
        - 动态加载的脚本的优先级在浏览器资源获取队列中很低
        - 低优先级的动态脚本可能影响网页应用程序的的性能（因为脚本加载和执行顺序会影响浏览器加载页面的整体时间）
        - 让预加载器预见会有动态脚本的加入可以使用**文档头部显式声明**
            
            ```html
            <link rel="preload" href="gibberish.js">
            ```
            

# 5.XHTML中的变化

## XHTML

- 描述
    - XHTML，全称Extensible HyperText Markup Language ，可扩展超文本标记语言
    - 它是将HTML作为XML应用**重新包装**的结果
    - 与HTML不同的是：
        - 在XHTML中使用JavaScript必须指定type属性且其值为text/javascript
        - HTML可以省略这个属性
    - XHTML已经退出历史舞台（有相关遗留代码）

## 在XHTML中使用JavaScript

- XHTML中编写代码的规则比HTML严格
    - HTML解析JavaScript语句有特殊的规则，对应不同的关键字，运算符等有相关的解释
    - 而XHTML对于运算符等可能无法解析，如”<”，会被识别成标签开始
    
    ```jsx
    <script type="text/javascript">
    	function compare(a, b) {
    		if (a < b) {
    			console.log("A is less than B");
    		} else if (a > b) {
    			console.log("A is greater than B");
    		} else {
    			console.log("A is equal to B");
    		}
    	}
    </script>
    ```
    
- 上面的例子在HTML中可以正常运行，在XHTML中无法正常运行
    - 因为XHTML会解析“<”号为一个标签的开始，且后面不能有空格，导致语法错误
- 避免XHTML的这种语法错误的方式：
    1. 使用HTML[转义字符](http://c.biancheng.net/view/5385.html)，将”*<*”等字符替换成HTML实体形式*&lt;*
        
        ```html
        <script type="text/javascript">
        	function compare(a, b) {
        		if (a **&lt;** b) {
        			console.log("A is less than B");
        		} else if (a **&gt;** b) {
        			console.log("A is greater than B");
        		} else {
        			console.log("A is equal to B");
        		}
        	}
        </script>
        ```
        
    2. 把所有的代码块放入一个CDATA块中。在XHTML和XML中，CDATA块表示文档中可以包含任意文本的区块，其内容不作为标签来解析，因此其中可以包含任意字符。‘
        
        ```html
        <script type="text/javascript">**<![CDATA[**
        	function compare(a, b) {
        		if (a < b) {
        			console.log("A is less than B");
        		} else if (a > b) {
        			console.log("A is greater than B");
        		} else {
        			console.log("A is equal to B");
        		}
        	}
        **]]>**</script>
        ```
        
        ⇒ 这种模式适用于兼容XHTML的浏览器
        
        ⇒ 在不支持CDATA块的非XHTML兼容浏览器中无效，会报错
        
    3. 使用注释解决不支持CDATA块的现代浏览器无效问题，同时兼容XHTML
        
        ```html
        <script type="text/javascript">
        **//<![CDATA[**
        	function compare(a, b) {
        		if (a < b) {
        			console.log("A is less than B");
        		}
        	}
        **//]]>**
        </script>
        ```
        
        ⇒ 对所有现代浏览器都有效，且可以通过XHTML验证
        

### 注意

- 在现代浏览器中几乎看不到XHTML，但是可以通过指定页面类型为”application/xhtml+xml”触发XHTML模式,但并不是所有浏览器都支持XHTML模式。

# 6.废弃的语法

1. 现在script元素的type属性默认使用”text/javascript”
    - 因为几乎所有的浏览器都将JavaScript作为默认编程语言
    - 所以最好**不用**指定type属性，如果指定错误反而会导致浏览器跳过该script元素
    - **除非**使用XHTML或者script标签要求的非JavaScript代码
2. 久远年代有一些不支持JavaScript的浏览器（Mosaic）
    - 这些浏览器无法解析script中的JavaScript代码，会将它们直接输出到页面上
    - 网景公司联合Mosaic出了一个解决方案以解决这种问题
        
        ```html
        <script><!--
        	console.log("Hi");
        //--></script>
        ```
        
        ⇒ 把脚本代码包含在一个HTML注释中
        
        ⇒ Mosaic会忽略JavaScript，而支持JavaScript的浏览器必须能识别这种模式并执行JavaScript
        
- 上述的语法已被**废弃**
    - 现代浏览器都支持JavaScript，Mosaic这种不支持JavaScript的已经死了
    - 且在XHTML模式下，这种格式会导致脚本被忽略，因为代码处于有效的XML注释中