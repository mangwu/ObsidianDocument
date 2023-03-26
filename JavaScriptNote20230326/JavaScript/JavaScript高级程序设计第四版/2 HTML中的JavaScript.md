# 2. HTML中的JavaScript

> JavaScript引入网页中时，要解决网页主导语言HTML和JavaScript之间的关系问题(**coexist** 共存关系)。网景公司在保证JavaScript不会影响到HTML在浏览器中渲染的情况下，达成了向网页中引入**通用**（**universal**）**脚本能力**（**scripting support**）的共识，并**正式**（**formalized**）成为HTML规范的一部分
> 

# 1.<script>元素(The <script> Element)

- 将JavaScript插入HTML的主要方法就是使用`<script>`元素
    - 由网景公司创造
    - 最早在Netscape Navigatior2实现
    - 后来被正式加入到HTML规范

[<script>元素](2%20HTML%E4%B8%AD%E7%9A%84JavaScript/script%20%E5%85%83%E7%B4%A0.md)

# 2.行内代码与外部文件（Inline Code and External File）

## 推荐使用

- 直接在HTML中嵌入JavaScript代码是不被推荐的
- 通常的最佳实践是将JavaScript代码放在外部文件中再被引入（并非强制要求）

## 外部文件引入优点

1. **可维护性**
    1. JavaScript分散到多个HTML页面中或再HTML中的不同位置，维护起来困难
    2. 使用一个目录保存所有JavaScript文件，易于维护，且可以独立于HTML页面来编辑JavaScript代码
2. **缓存**
    1. 浏览器会根据特定的设置**缓存所有的外部链接的JavaScript文件**
    2. 不同页面使用相同的JavaScript文件，只需下载一次，节省开支，页面加载更快
3. **适用未来**
    1. 外部文件的JavaScript不必思考XHTML模式
    2. 包含外部JavaScript文件的语法在HTML和XHTML中是一样的

## 模块化JavaScript文件

- 以**轻量、独立JavaScript组件形式**向客户端送达脚本更具优势
    1. 浏览请求外部文件考虑文件占用的带宽
    2. 在支持SPDY/HTTP2协议的现代浏览器中，细分大的JavaScript文件成小组件，有助于**提高浏览器加载性能**
- 关于SPDY/HTTP2协议
    
    [HTTPS、SPDY和HTTP/2的性能比较](https://www.cnblogs.com/bluestorm/p/7382091.html)
    
- 例子：对于使用轻量，独立JavaScript组件形式的脚本
    1. 加载第一个页面中的脚本.
        
        ```html
        <script src="a.js"></scirpt>
        <script src="component1.js"></scirpt>
        <script src="component2.js"></scirpt>
        <script src="component3.js"></scirpt>
        ```
        
        - 初次请求，浏览器从同一服务器获取外部脚本，逐个加载缓存
        - 从浏览器角度看，这和请求一个完整的大JavaScript文件延迟差不多
    2. 加载第二个页面中的脚本
        
        ```html
        <script src="b.js"></scirpt>
        **<script src="component3.js"></scirpt>**
        <script src="component4.js"></scirpt>
        <script src="component5.js"></scirpt>
        ```
        
        - 第二个页面请求，component3是被分割出来的一个轻量独立JavaScript文件
        - 由于初次请求时已经缓存了component3，所以加载的速度变快了
    - 例子前提是支持SPDY/HTTP2

# 3.文档模式

## 定义

- 文档模式来源于IE5.5
    - 使用**doctype**来切换HTML的文档模式
        
        ```html
        <!-- 在HTML文档最前面声明相关文档模式 -->
        **<!DOCTYPE html>**
        <!-- 现代HTML文档开头一般都是上面的文档模式，表示**HTML5**-->
        ```
        
    - 文档模式有两种：
        - 混杂模式（quirks mode）
        - 标准模式（standard mode）
- 混杂模式：让IE像IE5一样支持一些非标准特性
- 标准模式：让IE具有兼容标准的行为（HTML标准）

## 文档模式区别

- 不同的文档模式的区别主要体现在**CSS渲染的内容**方面
    - 如在标准模式下，一个块元素div包含的内容只有图片时，图片底部都有**3像素**的空白
        
        ![Untitled](2%20HTML%E4%B8%AD%E7%9A%84JavaScript/Untitled.png)
        
    - 而在混杂模式下，标准浏览器（谷歌）中div距图片底部没有空白
        
        ![Untitled](2%20HTML%E4%B8%AD%E7%9A%84JavaScript/Untitled%201.png)
        
- 除了对CSS的影响，对JavaScript也会有一些关联影响（如上述例子中标准模式下获取到div元素的高度为103px而非100px），称之为**副作用**

## 准文档模式（almost standard mode）

- 准文档模式的出现
    - IE支持文档模式切换后，其他浏览器普通跟随实现
    - 其中又出现了第三种文档模式：almost standard mode（准文档模式）
- 描述：
    - 这种模式支持大部分HTML标准特性，但是没有标准那么严格
    - 主要的区别在于如何对待图片元素周围的空白（上面的例子）

## 不同模式的声明方式

### A.混杂模式

- 省略文档开头的doctype声明作为开关
    - 这种约定并不合理，因为不同浏览器都定义了自己的混杂模式，没有一致性可言

### B.标准模式

- 包括严格的HTML4.01，严格的XHTML1.0和正式的HTML5
    
    ```html
    <!-- HTML 4.01 Strict -->
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
    
    **<!-- XHTML 1.0 Strict -->**
    <!DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    
    <!-- HTML5 -->
    <!DOCTYPE html>
    ```
    
    ⇒ 现代开发使用HTML5即，正式的HTML5文档模式（标准模式）
    

### C.准标准模式

- 包括过渡性文档类型（Transitional）
    - 过渡HTML4.01
    - 过渡XHTML1
- 和框架集文档类型（Frameset）
    - 框架HTML4.01
    - 框架XHTML1.0
    
    ```html
    <!-- HTML 4.01 Transitional -->
    <!DOCTYPE HTML PUBLIC
    "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
    <!-- HTML 4.01 Frameset -->
    <!DOCTYPE HTML PUBLIC
    "-//W3C//DTD HTML 4.01 Frameset//EN"
    "http://www.w3.org/TR/html4/frameset.dtd">
    <!-- XHTML 1.0 Transitional -->
    <!DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <!-- XHTML 1.0 Frameset -->
    <!DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.0 Frameset//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
    ```
    

⇒ 准标准模式和标准模式非常接近，**很少需要区分**

⇒ 文档模式的检测也不会区分它们，所以**标准模式在广义上可以指除了混杂模式以外的文档模式**

# 4.<noscript>元素

- 定义
    - 早期有些浏览器不支持JavaScript，noscript元素是一个优雅降级的处理方案
    - <noscript>元素用于给不支持JavaScript的浏览器提供替代内容
- 使用方式
    - noscript元素可以包含任意的可以出现在body元素中的HTML元素（script元素除外）
    - 浏览器渲染noscript中的内容的情况（否则浏览器不会渲染noscript中的内容）
        - 浏览器不支持JavaScript
        - 浏览器对脚本的支持被关闭
- 例子
    
    ```html
    <!DOCTYPE html>
    <html>
    	<head>
    		<title>Exmaple HTML Page</title>
    		<script defer src="example.js"></script>
    	</head>
    	<body>
    		<noscript>
    			<p>This page requires a JavaScript-enable brower.</p>
    		</noscript>
    	</body>
    </html>
    ```
    
    ⇒ 这个例子是在脚本不可用时显示一段话
    
    ⇒ 但是对于支持JavaScript的浏览器，用户不会看到这段话
    

# 总结

- JavaScript的引入
    - JavaScript是通过<script>元素插入到HTML页面的
    - 这个元素可以把JavaScript代码嵌入到HTML页面中混合一起
    - 也可以通过属性外部引入包含JavaScript的文件
- 关于通过script引入JavaScript的特性
    1. 要包含外部JavaScript文件，必须将src属性设置为要包含文件的URL，文件可以跟网页在同一台服务器上，也可以位于不同的域
    2. 所有<script>元素会依照它们在网页上出现的顺序被解释执行。在不使用defer和async属性的情况下，包含在script元素中的代码必须严格按次序解释
    3. 对不推迟执行的脚本，浏览器必须解释完位于<script>元素中的代码，然后才能继续渲染页面的剩余部分。为此通常将<script>元素放在页面末尾，介于主内容之后及</bdoy>标签之前
    4. 可以使用defer属性把脚本推迟到文档渲染完毕后再执行，推迟的脚本原则上按照它们被列出的次序执行
    5. 可以使用async属性表示脚本不需要等待其他脚本，同时也不阻塞文档渲染，即异步加载。异步脚本不能保证按照它们再页面中出现的次序执行
    6. 通过使用<noscript>元素，可以指定再浏览器不支持JavaScript脚本时显示内容。如果浏览器支持并启用脚本，则<noscript>中的任何内容都不会被渲染