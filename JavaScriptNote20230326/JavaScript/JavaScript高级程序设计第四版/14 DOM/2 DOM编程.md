# 2. DOM编程

操作DOM可以通过HTML实现，也可以通过JavaScript实现

由于浏览器的差异，DOM操作既可以很直观，也可能会在某些方便很复杂

# 2.1 动态脚本（**Dynamic Scripts**）

- <script>元素用于向网页中插入JavaScript代码
    - 可以是src属性包含的外部文件
    - 也可以是该元素内容的源代码
- **动态脚本就是在页面初始加载时不存在，之后又通过DOM包含的脚本**，与对应的HTML元素一样，有两种方式通过<script>动态为网页添加脚本
    - **引入外部文件**
    - **直接插入源代码**
- **动态外部加载文件**即可以直接通过HTML代码直接载入，也可以通过DOM编程创建这个节点，也可以将DOM编程创建script节点并添加到DOM树这个过程抽象为一个函数，方便在引入多个外部文件时多次调用
    
    ```html
    <!-- HTML src代码引入 -->
    <script src="./foo.js"></script>
    
    <!-- DOM 编程引入 -->
    <script>
      let script = document.createElement("script");
      script.src = "foo.js";
      document.documentElement.firstChild.appendChild(script);
    </script>
    
    <!-- DOM编程 抽象函数 -->
    <script>
      function loadScript(url) {
        let script = document.createElement("script");
        script.src = url;
        document.documentElement.firstChild.appendChild(script);
      }
      loadScript("./foo.js");
      loadScript("./foo.js");
    </script>
    ```
    
    - 把<script>元素添加到页面之前，是不会开始下载外部文件的
    - 但是什么时候脚本加载完毕，这个问题没有标准答案
- 另一个动态插入JavaScript的方式是**嵌入源代码**，这里的**嵌入源代码**并非在HTML的<script>标签内写入内容，而是通过DOM编程创建<script>节点然后**增加源代码文本节点**
    
    ```html
    <!-- 嵌入源代码 -->
    <script>
      let script = document.createElement("script");
      script.appendChild(
        document.createTextNode("function sayHi() {alert('Hi')}")
      );
      document.documentElement.firstChild.appendChild(script);
    </script>
    ```
    
    - 这样的代码（指创建文本节点然后添加到script子节点中）可以在Safari、Firefox、Opera和Chrome及其更高版本中运行
    - 旧版本的IE浏览器对<script>元素做了特殊处理，不允许常规DOM访问子节点，但<script>元素上有一个text属性，可以用来添加JavaScript代码，所以就可以在旧IE浏览器下，**嵌入源代码**就要写成如下这样
        
        ```html
        <!-- 嵌入源代码 -->
        <script>
          let script = document.createElement("script");
          script.text = "function sayHi() {alert('Hi')}";
          document.documentElement.firstChild.appendChild(script);
        </script>
        ```
        
    - 但是Safari 3之前的版本并不支持这个text属性，所以需要利用**功能检测**完成对浏览器兼容，如下
        
        ```html
        <!-- 嵌入源代码 -->
        <script>
          let script = document.createElement("script");
          let code = "function sayHi() {alert('Hi')}";
        	try {
        	  script.appendChild(document.createTextNode(code));
        	} catch(ex) {
        		script.text = code;
        	}
          document.documentElement.firstChild.appendChild(script);
        </script>
        ```
        
    - 最后，当有多段源代码需要嵌入到网页中时，就需要抽象成一个函数了，如下
        
        ```html
        <!-- 嵌入源代码，抽象成函数 -->
        <script>
          function loadScriptString(code) {
            let s = document.createElement("script");
            // 浏览器兼容性，IE旧版本不支持给script新增子文本节点
            try {
              s.appendChild(document.createTextNode(code));
            } catch (error) {
              s.text = code;
            }
            document.documentElement.firstChild.appendChild(s);
          }
          loadScriptString("function sayHi() {alert('Hi')};sayHi()");
        </script>
        ```
        
    - 以上面这种方式加载的代码会在全局作用域中执行，并在调用返回后立即生效，基本上这就相当于在全局作用域中把源代码传给`eval()` 方法

<aside>
💡 注意：**通过innerHTML属性创建的<script>元素永远不会执行**，浏览器会尽责地创建<script>元素，以及其中地脚本文本，但解析器会给这个<script>元素打上永不执行的标签，只要使用innerHtml创建的<script>元素以后也没有办法强制执行

</aside>

# 2.2 动态样式

- CSS样式样式在HTML页面中可以通过两个元素加载
    - **<link>元素用于包含CSS外部文件**
    - **<style>元素用于添加嵌入样式**
- 与动态脚本类似，动态样式也是在页面初始加载时并不存在，而是在之后才添加到页面中的

## 2.2.1 <link>

- link元素很容易使用DOM编程创建出来
    - 它具有`rel` 属性，表示引入的文件用途，对于样式文件而言就是”stylesheet”
    - 它具有`type` 属性，表示文件类型，对于**常规**样式文件而言就是”text/css”（还有less这样的样式文件）
    - 最后一个就是`href` 属性，它和<script>的`src` 属性一样，表示样式文件的地址
    
    ```html
    <script>
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "./style.css";
      let head = document.getElementsByTagName("head")[0];
      head.appendChild(link);
    </script>
    ```
    
- 注意为了保证所有浏览器都能正常运行，需要将创建的<link>元素添加到<head>元素而不是<body>元素
- 如果有多个样式文件需要通过DOM编程进行引入，可以将这个构成抽象成一个方法进行使用
    
    ```html
    <script>
      function loadStyle(url) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        let head = document.getElementsByTagName("head")[0];
        head.appendChild(link);
      }
      loadStyle("./style2.css")
    </script>
    ```
    
- 通过外部文件加载样式是一个**异步过程**，因此样式的加载和执行的JavaScript代码并没有先后顺序，一般来说也没有必要知道知道样式什么时候加载完成

## 2.2.2 <style>

- 另一种定义样式的方式是使用<script>元素包含嵌入的CSS规则
- HTML代码嵌入CSS规则是通过<style>元素实现的，如下
    
    ```html
    <style type="text/css">
      .special-p {
        color: blueviolet;
        text-align: center;
      }
    </style>
    ```
    
- 逻辑上，使用DOM代码实现上面同样功能的CSS规则就是创建一个<style>元素，设置这个元素的子节点是具有同样CSS规则的文本节点，然后插入到<head>节点
    
    ```html
    <script>
      let style = document.createElement("style");
      style.type = "text/css";
      style.appendChild(
        document.createTextNode(
          ".special-p {color: blueviolet;text-align: center;}"
        )
      );
      let h = document.querySelector("head");
      h.appendChild(style);
    </script>
    ```
    
- 考虑到浏览器兼容性，IE旧版本浏览器对<style>节点会施加限制，不允许访问子节点（和<script>元素限制一样），为此IE给出的解决方案是访问`styleSheet` 属性对象上的`cssText` 属性，所以需要利用**功能检测**完成对浏览器兼容
    
    ```html
    <!-- DOM编程 保证浏览器兼容性 实现包含CSS规则 -->
    <script>
      let style = document.createElement("style");
      style.type = "text/css";
      let css = ".special-p {color: blueviolet;text-align: center;}";
      try {
        style.appendChild(document.createTextNode(css));
      } catch (error) {
        style.styleSheet.cssText = css;
      }
      document.querySelector("head").appendChild(style);
    </script>
    ```
    
    <aside>
    💡 注意：《JavaScript高级程序设计（第4版）》中的”`styleSheet` 属性对象上的`cssText` 属性“已经**过时废弃**，现代浏览器不再拥有`styleSheet` 这个属性，但对于旧版本的IE而言使用`styleSheet` 可能不错；CSSOM 标准规范和HTML 标准规范了<style>标签应该实现的接口（基于`HTMLStyleElement` 接口 实现`LinkStyle` 接口），详情查看[HTML-Standard-HTMLStyleElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlstyleelement) 、 [CSSOM-Standard-LinkStyle](https://drafts.csswg.org/cssom/#the-linkstyle-interface) 和[CSSOM-Standard-CSSStyleSheet](https://drafts.csswg.org/cssom/#cssstylesheet)
    
    </aside>
    
- 与动态添加脚本源代码类似，如果要添加多项CSS规则，就需要将上述过程抽象成一个函数，如下
    
    ```html
    <!-- DOM编程 保证浏览器兼容性 实现包含CSS规则 抽象成一个函数-->
    <script>
      function loadStyleString(css) {
        let style = document.createElement("style");
        style.type = "text/css";
        try {
          style.appendChild(document.createTextNode(css));
        } catch (error) {
          style.styleSheet.cssText = css;
        }
        document.querySelector("head").appendChild(style);
      }
      loadStyleString(".special-p {background-color: chartreuse}");
    </script>
    ```
    

## 2.3 操作表格

- 表格是是HTML最复杂的结构之一，通过DOM编程创建<table>元素，通常涉及大量标签，包括表行(<tr>)、表元（<td>）、表题（<caption>）等，因此通过DOM编程创建和修改表格要写很多代码
- 对于HTML代码而言，创建HTML表格如下
    
    ```html
    <table border="1" width="100%">
      <caption>
        example table
      </caption>
      <tbody>
        <tr>
          <td>Cell 1,1</td>
          <td>Cell 1,2</td>
        </tr>
        <tr>
          <td>Cell 2,1</td>
          <td>Cell 2,2</td>
        </tr>
      </tbody>
    </table>
    ```
    
- 以DOM编程方式重建这个表格的代码
    
    ```html
    <script>
      const table = document.createElement("table");
      table.style.width = "100%";
      table.border = "1"
    
      const caption = document.createElement("caption");
      caption.appendChild(document.createTextNode("Example table"));
    
      const tbody = document.createElement("tbody");
      const tr1 = document.createElement("tr");
      const tr2 = document.createElement("tr");
      for (let i = 0; i < 4; i++) {
        const td = document.createElement("td");
        td.appendChild(
          document.createTextNode(
            `Cell ${Math.floor(i / 2) + 1},${(i % 2) + 1}`
          )
        );
        if (i < 2) tr1.appendChild(td);
        if (i >= 2) tr2.appendChild(td);
      }
      tbody.appendChild(tr1);
      tbody.appendChild(tr2);
    
      table.appendChild(caption);
      table.appendChild(tbody);
    
      document.body.appendChild(table);
    </script>
    ```
    
- 以上代码相当繁琐也不好理解，为了方便创建表格，HTML DOM给<table>、<tbody>、<tr>元素添加了一些属性和方法
    
    <table>元素添加了以下属性和方法
    
    - [ ]  caption，指向<caption>元素的指针（如果存在）
    - [ ]  tBodies，包含<tbody>元素的HTMLCollection
    - [ ]  tFoot，指向<tfoot>元素的指针（如果存在）
    - [ ]  tHead，指向<thead>元素的指针（如果存在）
    - [ ]  rows，包含表示所有行的HTMLCollection
    - [ ]  createTHead()，创建<thead>元素，放到表格中，返回引用
    - [ ]  createTFoot()，创建<tfoot>元素，放到表格中，返回引用
    - [ ]  deleteTHead()，删除<thead>元素
    - [ ]  deleteTFoot()，删除<tfoot>元素
    - [ ]  deleteCaption()，删除<caption>元素
    - [ ]  deleteRow(pos)，删除给定位置的行
    - [ ]  insertRow(pos)，在行集合中给定位置插入一行
    
    <tbody>元素添加了以下属性和方法
    
    - [ ]  rows，包含<tbody>元素中的所有行HTMLCollection
    - [ ]  deleteRow(pos)，删除给定位置的行
    - [ ]  insertRow(pos)，在行集合中给定位置插入一行，返回该行的引用
    
    <tr>元素添加了以下属性和方法
    
    - [ ]  cells，包含<tr>元素所有表元的HTMLCollection
    - [ ]  deleteCell(pos)，删除给定位置的表元
    - [ ]  insertCell(pos)，在表元集合给定位置插入一个表元，返回该表元的引用
- 有了上述的方法和属性，就更方便创建表格了，如下
    
    ```html
    <!-- DOM编程 创建表格 -->
    <script>
      const t = document.createElement("table");
      t.style.width = "100%";
      t.border = "1";
    
      const c = t.createCaption();
      c.appendChild(document.createTextNode("Example table"));
    
      const tb = t.createTBody();
    
      function insertRow(...tdText) {
        const tr = tb.insertRow(tb.rows.length);
        for (let text of tdText) {
          const td = tr.insertCell(tr.cells.length);
          td.appendChild(document.createTextNode(text));
        }
      }
      insertRow("cell 1,1", "cell 1,2");
      insertRow("cell 2,1", "cell 2,2");
    
      document.body.appendChild(t);
    </script>
    ```
    
    <aside>
    💡 注意：这里编写的代码和《JavaScript高级程序设计（第4版）》的不同，大体是抽象出了一个插入行的方法，将在行中插入表元的过程抽象出来了，方便后面插入跟多行时使用
    
    </aside>
    
- 关于Table相关的标准可以查看HTML Standard规范的 [HTMLTableElement](https://html.spec.whatwg.org/multipage/tables.html#the-table-element) 接口

## 2.4 使用NodeList

- NodeList，NamedNodeMap，HTMLCollection这三个接口对象是相似的，只要理解了NodeList就能理解这三者，这也是理解DOM编程的关键
    - 这三个集合类型都是**实时的**，意味着文档结构的变化会实时地在它们身上反映出来，因为它们地值始终代表最新的状态
    - 实际上NodeList就是基于DOM文件的**实时查询**，可以通过以下代码证明
        
        ```html
        <body>
          <p>实时更新特性</p>
          <script>
            // 实时更新
            let children = document.body.childNodes;
            for (let i = 0; i < children.length; i++) {
              let p = document.createElement("p");
              p.textContent = i;
              document.body.appendChild(p);
            }
          </script>
        </body>
        ```
        
        - 在打开拥有如上HTML代码的页面后，页面会一直处于正在加载状态，因为NodeList的实时更新，<script>元素下的JavaScript代码陷入死循环，而页面需要加载完全HTML代码才能进行元素渲染，所以会一直处于加载状态
- 任何时候要迭代NodeList（NamedNodeMap，HTMLCollection也是同理），最好再初始化一个变量**保存当时查询时的长度**，然后用循环变量与整个变量进行比较，就能避免死循环
- 一般来说，最好限制操作NodeList的次数，因为**每次查询都会搜索整个文档**，所以最好把查询到的NodeList缓存起来