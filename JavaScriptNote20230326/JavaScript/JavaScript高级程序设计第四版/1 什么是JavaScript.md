# 1. 什么是JavaScript

> “1995年JavaScript问世，它的主要用途是代替Perl等服务器端语言处理**输入验证”**
> 

久远前的输入验证功能是在后端做的，前端只负责接受数据然后返回给后端，每一次验证都需要一次往返通信，这种局面使得浏览器响应缓慢，直到网景公司的Navigator浏览器面世，才通过内置JavaScript来处理输入验证。

# 1. JavaScript诞生历史

- 起因
    - 90年代，使用调制解调器的28.8kbit/s上网速度缓慢
    - 网页变得越来越大，表单验证在后端处理，每次验证都需要一次往返通信
    - **客户端脚本语言处理简单数据验证**提上日程
- 诞生
    - 95年，网景打算开发一个叫Mocha的脚本语言，内置在Netscape Navigator 2上，后来改名LiveScript
    - 计划在服务端也用Mocha，它的服务端版本叫做LiveWire
    
    ---
    
    - 计划赶不上变化，网景与Sun公司联合开发，共同完成LiveScript
    - Navigator2发布前，为了**迎合当时火热的Java**，它将LiveScript改名为JavaScript
    
    ---
    
    - JavaScript1.0很成功，网景在Navigator3发布JavaScript1.1版本
    - 同时(96年)，竞争对手微软决定向IE投入资源，IE内置了名为JScript的JavaScript实现
    
    ---
    
    - 两个版本的JavaScript：网景浏览器中的以及IE中的JScript实现有区别
    - 没有统一的规范，激发了业界标准化JavaScript的征程
    
    ---
    
    - 97年，JavaScript1.1作为提案交由ECMA（欧洲计算机制造商协会）进行标准化
    - TC39技术委员会（Technical Committee #39 (TC39)）被指派“**标准化**（**standardize**）一门**通用**（**general purpose**）、**跨平台**（**cross-platform**）、**厂商中立**（**vendor-neutral**）的**脚本语言**（**scripting language**）的**语法和语义（syntax and semantics）**”的任务（任务称为TC39-ECMAScript）
    - TC39在JavaScript1.1基础上**打造**（**hammer out**）出了**ECMA-262**：也就是ECMAScript这个新的脚本语言标准
        
        <aside>
        💡 注意：ECMA组织的标准牵扯到很多国家（不止欧洲），后来（1994年后）改名为ECMA国际（ECMA International）；ECMA International组织制定了很多标准，这些标准都是以ECMA-Number的形式命名，ECMA-262就是ECMA-262号标准，具体的就是ECMAScript遵照的标准（实际上这个ECMA-262标准就是ECMAScript语言规范）
        
        </aside>
        
    
    ---
    
    - 98年，ISO和IEC（国际电工委员会）将ECMAScript纳为标准
    - 此后，各家浏览器都依据ECMAScript实现自己版本的JavaScript，具体实现还有差别

# 2. JavaScript实现

- 浏览器对JavaScript的实现主要依据**ECMAScript，**但是不限于ECMA-262标准
- 各家浏览器都有自己的浏览器引擎用于运行JavaScript，引擎实现方式不一样，JavaScript的实现也就不一样，其核心都是ECMAScript，同时包含浏览器需要的DOM，和BOM：
    - 核心（Core）：ECMAScript
    - 文档对象模型：DOM
    - 浏览器对象模型：BOM

## 2.1 ECMAScript

- ECMAScript即，ECMA-262标准定义的语言，它不局限于Web浏览器，node.js也依据ECMA实现（实际上ECMAScript语言没有规范的输入和输出方法）
    - ECMA-262是JavaScript语言的基准，用于构建稳健的JavaScript实现
    - Web浏览器只是ECMAScript实现的一种**宿主环境（host environment）**
    - 宿主环境提供ECMAScript的基准实现和与环境交互的必须扩展，如DOM、BOM
- 其他宿主环境：Node.js（server-side端的JavaScript平台） 和 Adobe Flash(已被淘汰)

### 2.1.1 ECMAScript定义的对象

- ECMA-262标准描述了一门语言的基本规范：
    - 语法（Syntax）
    - 类型（Types）
    - 语句（Statements）
    - 关键字（Keywords）
    - 保留字（Reserved words）
    - 操作符（Operators）
    - 全局对象（Global objects）
- ECMAScript是对实现上述规范的一门语言的称呼。JavaScript、Adobe ActionScript同样实现了ECMAScript

### 2.1.2 ECMAScript版本

[ECMA-262 - Ecma International](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)

- ECMAScript版本就是**ECMA-262标准**的版本，以edition表示：
    1. 第1版：基于网景JavaScript1.1的版本，基本相同，**删除浏览器部份**，加上少量修改，支持Unicode标准，对象与平台无关
        - 网景公司的JavaScript 1.1 和 JavaScript 1.2不符合（conform）第一版ECMA-262标准
        - JavaScript 1.1 和 JavaScript 1.2 的一些内置对象在不同平台上有不同的实现（违反对象与平台无关原则）
    2. 第2版：基于第一版做了一些编校（editorial），迎合ISO/IEC-16262要求（没有任何特性上的修改），第2版一般不作为衡量符合性（conformance）的标准
    3. 第3版：标准更新，增加字符串处理、错误定义、数值输出、正则表达式、新控制语句、异常处理（try/catch）。第3版标志ECMAScript可以作为一门真正的语言
    4. 第4版：彻底修订，在第3版基础上几乎完全定义一门新语言；强类型变量、新语句、数据结构、真正的类和继承、操作数据的手段
        - 为了响应JavaScript在Web端的流行，开发者开始要求ECMAScript能满足全球Web开发的需求
        - ECMA TC39再次被召集，以决定这门语言的未来，结果它们几乎制定了一门新语言
    5. 第5版：**弃用了第4版**，由TC39的一个子委员会提出，是基于第3版的"ECMAScript 3.1",改动较少，在JavaScript引擎基础上做的一些增改。
        - ES5 2009年12.3发布
        - 厘清了ES3的**歧义**（**ambiguities**）
        - 增加新功能：原生解析和序列化JSON数据的JSON对象、方法继承和高级属性定义、严格模式
        - ES5修订版本 2011 6发布，订正ES5中的错误
    6. 第6版本：ES6、ES2015、ES Harmony（和谐版），2015 06发布，重要版本，包括了有史以来最重要的一批**增强**（**enhancements**）特性：
        - 类（classes）
        - 模块（modules）
        - 迭代器（iterators）
        - 生成器（generators）
        - 箭头函数（arrow functions）
        - 期约（promises）
        - 反射（reflection）
        - 代理（proxies）
        - 众多新的数据类型（a host of new data types）
    7. 第7版：ES7、ES2016，少量语法层面增强，如includes和指数操作符
    8. 第8版：ES8、ES2017，2017 06发布。增加异步函数（await/async）、SharedArrayBuffer、Atomics API，一些对象方法和字符串填充方法、支持对象字面量最后的逗号
    9. 第9版：ES9、ES2018，2018 06 发布。异步迭代、剩余、扩展属性、新的正则表达式特性、Promise finally()、模板字面量
    10. 第10版：ES10、ES2019，2019 06发布。增加一些属性和方法，固定sort()顺序、解决JSON字符串兼容问题、定义catch子句的可选绑定
    11. 第11版：ES11、ES2020，2020 06发布
    12. 第12版：ES12、ES2021，2021 06发布
    13. 第13版：ES13、ES2022，2022 06发布

### 2.1.3 ECMAScript符合性(Conformance)

- ECMAScript**符合性**(**Conformance**)即是对ECMA-262规范的实现程度，满足符合性的ECMAScript实现具有一些条件:
    - 支持ECMA-262中描述的所有“类型、值、对象、属性、函数、以及程序语法与语义”（必要条件）
    - 支持Unicode字符标准(必要条件)
    
    建议实现的条件：
    
    ---
    
    - 增加ECMA-262中未提及的的“额外的类型、值、对象、属性、函数”，即规范未给出的新对象或对象的新属性（根据宿主环境定义）
    - 支持ECMA-262中没有定义的“程序和正则表达式语法”，即允许修改扩展内置的正则表达式特性
- ECMAScript符合性实现起来容易，具有极大的灵活性，开发者权限大，这也照就了依托浏览器的JavaScript实现的多样性（谷歌内核，火狐内核，欧鹏内核的JavaScript实现细节各不相同）

### 2.1.4 浏览器对ECMAScript的支持

[webkit内核_浏览器内核发展编年史_weixin_39976499的博客-CSDN博客](https://blog.csdn.net/weixin_39976499/article/details/111138702)

- 浏览器中的JavaScript语言实现以ECMAScript为核心实现，即满足ECMAScript符合性，则该浏览器支持ECMAScript
    - 网景浏览器3发布包含的JavaScript 1.1 实现规范交由ECMA进行参考定义
        - 但是JavaScript 1.1 不符合ECMAScript 第一版的规范
        - 它不支持Unicode，对象与平台无关
    - 网景浏览器4初始发布的 JavaScript1.2在ECMAScript第一版规范前，也不符合ECMAScript规范
    - 网景浏览器4.06及之后的版本（~4.79），发布的JavaScript1.3支持ECMAScript第一版规范
    - 网景以Mozilla（因为Netscape浏览器内核名称为Mozilla）项目名义开发并开放浏览器内核源代码：
        - Mozilla项目的代码引擎被市场部重新命名为Gecko
        - Mozilla项目延迟发布，以及网景公司与IE竞争失败，Netscape Navigatior5并未发布
        - JavaScript 1.4只在Netscape Enterprise Server中作为服务器语言发布
    - 网景被美国在线收购后，发布的Netscape 6+（Mozilla 0.6.0+）符合ECMAScript第三版，且内核改为Gecko M18（Milesone 18）
        - 后来的Netscape 7基于Mozilla 1.4内核，且同时开始开发Firefox新浏览器
        - Netscape 8 基于Mozilla Firefox核心（Gecko）和IE核心（Trident）
        - Netscape 9 基于Mozilla Firefox2.0
        - 由于网景团队被解散，且Netscape浏览器占有率急速下降，Netscape无了
- IE浏览器对ECMAScript的支持
    - IE3的JScript1.0提供与JavaScript1.1相同的功能，同样不符合ECMAScript规范
    - IE4的JScript3.0（2.0版本发布在服务端），在ECMAScript规范之前发布，也不符合ECMAScript
    - IE5内置实现的JavaScript符合ECMAScript第一版
    - IE5.5~8符合ECMAScript第三版
    - IE9符合ECMAScript第五版（部分）
    - IE10~11符合ECMAScript第五版
    - 之后微软将edge作为IE12发布，edge12+支持ECMAScript第六版本，IE版本不再更新
    - 之后微软放弃edgeHTML内核，转而使用谷歌开源的Chromium内核(Blink)，浏览器命名仍然使用Microsoft Edge
- Opera浏览器从6+版本开始支持ECMAScript 第二版，其内核最初是Presto，后来使用苹果的Webkit，再改为谷歌的Blink内核（Opera和谷歌联合基于Webkit开发）
    - Opera 7.2+支持ECMAScript第三版本
    - Opera 15-28支持ECMAScript第五版本
    - Opera 29-35 支持ECMAScript第六版本（部分）
    - Opera 36+支持第六版本
    - Opera最新版本82（2021年12月12日）
- Safari 浏览器是基于Webkit内核的苹果系统浏览器，Webkit是苹果基于KHTML的开发内核，而KHTML框架来自于挪威（Opera原属国）
    - Safari1-2.0.x支持ECMAScript第三版本（部分）
    - Safari3.1-5.1支持ECMAScript第五版本（部分）
    - Safari6~8支持ECMAScript第五版本
    - Safari9+支持ECMAScript第六版本
- Chrome浏览器基于Webkit内核，后来联合Opera开发Blink内核
    - Chrome1~3支持ECMAScript第三版本
    - Chrome4~22支持ECMAScript第五版本（部分）
    - Chrome23+ 支持ECMAScript第五版本
    - Chrome42~48支持ECMAScript第六版本（部分）
    - Chrome49+支持ECMAScript第六版本
- Firefox浏览器基于Gecko内核，Mozilla 开源项目从一定程度使得火狐浏览器有自己的内核
    - Firefox1~2支持ECMAScript第三版本
    - Firefox3.0x~20支持ECMAScript第五版本（部分）
    - Firefox21~44支持ECMAScript第五版本
    - Firefox45+支持ECMAScript第六版本

## 2.2 DOM

- DOM全称**文档对象模型**(Document Object Model)
    - DOM是在浏览器（宿主环境）中实现ECMAScript并扩展的应用程序接口（API）
    - DOM用于在HTML中使用扩展的XML
    - DOM在浏览器环境中提供DOM API供开发者随心所欲控制网页的HTML内容和结构
- DOM的实现
    - DOM将整个页面抽象为一组分层节点
    - HTML页面的每个标签元素都是一个节点，其包含不同的数据
    - 如HTML
        
        ```html
        <html>
        	<head>
        		<title>Sample Page</title>
        	</head>
        	<body>
        		<p>Hello, World!</p>
        	</body>
        </html>
        ```
        
    - 其分层节点图示
        
        ```jsx
        html
        |
        |______head
        |        |
        |        |____title
        |               |
        |               |______SamplePage
        |_______body
        					|____p
        							 |___Hello, World!
        ```
        

### 2.2.1 DOM的标准必须统一

- 久远时代的**静态HTML**无需控制修改
- 但是IE4和网景Navigator4支持了不同形式的动态HTML(DHTML)
    - 开发者可以通过不刷新页面而修改页面外观和内容
    - DHTML使得用户交互成为可能
    - DOM作为控制HTML节点的API愈发重要
- 但是微软和网景实现动态HTML的方式不一样
    - 保持web跨平台的特性，必须标准化DOM
    - 万维网联盟（W3C， WorldWideWeb Consortium）开始了制定**DOM标准**的进程

### 2.2.2 DOM级别

- 98年，**DOM Level 1**成为W3C推荐标准
    - DOM Level1目标是**映射文档结构**，便于语言实现DOM API
        - 除了JavaScript能够访问DOM，其他语言也可实现自己的DOM API加以访问
        - 只是对于运行HTML的浏览器来说，DOM就是使用ECMAScript实现的，DOM已然成为JavaScript的一部分
    - DOM Level1由两部分组成
        - **DOM Core**：提供一种映射XML文档，从而方便访问操作HTML文档的任意部分
        - **DOM HTML**：提供映射扩展，增加特定于HTML的对象和方法
- **DOM Level2** 新增了很多功能用于扩展DOM API的功能
    - DOM视图：描述追踪文档**不同视图**的接口，如用户界面事件会更改HTML视图，提供追踪接口获取这种变化
    - DOM事件：描述事件及事件处理接口，如onclick,onkeydown等
    - DOM样式：描述处理元素CSS样式的接口，如document.body.width等
    - DOM遍历和范围：描述[遍历](https://www.cnblogs.com/tracylin/p/5220867.html)和操作DOM树的接口
- **DOM Level3** 进一步扩展DOM
    - 增加统一方式加载和保存文档 DOM Load and Save
    - 验证文档的方法 DOM Validation
    - 扩展DOM Core支持所有XML 1.0特性
- DOM Level发展
    - W3C不在按照Level来维护DOM，而是作为DOM Living Standard来维护
    - DOM4为DOM Living Standard的快照，新增内容
        - Mutation Events
        - Mutation Observers

### 2.2.3 其他DOM

- DOM是文档对象模型，广义上web的HTML文档只是DOM的一种
- 其它基于XML实现DOM的语言包括
    - SVG：可伸缩矢量图，Scalable Vector Graphics
    - MathML：数学标记语言，Mathematical Markup Language
    - SMIL：同步多媒体集成语言，Synchronized Multimedia Integration Language

### 2.2.4 浏览器对DOM的支持

- DOM并不是一开始就是JavaScript的一部分，浏览器需要自行对W3C提出的DOM标准进行实现,且DOM标准在浏览器实现它之前就发布了
    - IE5版本尝试支持DOM，直到5.5版本才真正支持DOM Level1中的大部分
    - 网景在6之前都不支持DOM，直到Mozilla把开发资源转到FireFox浏览器上才开始支持，FireFox3+支持全部DOM Level1，DOM Level2，部分Level3

## 2.3 BOM

- BOM: 浏览器对象模型(Browser Object Modal)
    - BOM API用于支持访问和操作浏览器窗口
    - 使用BOM开发者能操作HTML文档显示之外的部分
- 在HTML5出现之前，BOM没有标准规范
    - BOM与浏览器自身相关，不同的浏览器，其BOM实现自然不同
    - HTML5出现后规范了BOM API特性，BOM不统一的问题得以解决
- BOM的作用：主要针对浏览器窗口和子窗口（frame）,但是如何关于浏览器的扩展都会归在BOM范畴内
    - 弹出新浏览器窗口的能力
    - 移动缩放和关闭浏览器窗口的能力
    - navigator对象，提供关于浏览器的详尽信息
    - location对象，提供浏览器加载页面的详细信息
    - screen对象，提供关于用户分辨率的详细信息
    - performance对象，提供浏览器内存占用，导航行为，和时间统计的详细信息
    - 对cookie支持
    - 其他自定义对象，如XMLHTTPRequest和IE的ActiveXObject

# 3. JavaScript版本

- Mozilla是唯一仍在延续最初JavaScript版本编号的浏览器厂商
- Mozilla开发的火狐浏览器继承了网景的JavaScript最后版本1.3，由于1.4是服务器版本，故而使用1.5作为火狐实现的第一版本JavaScript
- Mozilla Foundation也在持续开发JavaScript，FireFox4发布了JavaScript1.8.5版本，但是之后决定的JavaScript2.0被取消了
- 因为JavaScript的发展依靠宿主环境，不同的宿主环境JavaScript实现不完全相同，JavaScript版本没有意义，只有作为标准的ECMAScript和DOM才由实际意义，现代浏览器依靠这两者阐明JavaScript实现程度

# 4. 总结

- JavaScript是一门用来与网页交互的脚本语言，包含以下三部分：
    - ECMAScript： 由ECMA-262定义并提供核心功能
    - 文档对象模型（DOM）：提供网页内容交互的方法和接口
    - 浏览器对象模型（BOM）：提供与浏览器交互的方法和接口
- JavaScript的三个部分得到了五大浏览器的不同程度的支持
    - Edge,FireFox,Chrome,Safari,Opera基本上都对ES5提供了完善的支持
    - 对ES6的支持也在不断提升
    - 浏览器对DOM Level3的支持日益规范
    - HTML5规范的BOM仍然因浏览器而定，但可以假定有很大部分的公共特性