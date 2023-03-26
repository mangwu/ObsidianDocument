# Document类型

- Document类型是JavaScript中表示文档节点的类型，Node接口定义的`DOCUMENT_NODE` （9）就是Document类型
- 在浏览器中，文档对象`document` 就是Document类型，它是HTMLDocument的实例（HTMLDocument继承Document），表示整个HTML页面，document是window对象的属性，因此是一个全局对象，Document类型的节点有如下特征
    - [ ]  nodeType等于`Node.DOCUMENT_NODE` (9)
    - [ ]  nodeName值为”#document”
    - [ ]  nodeValue值为null
    - [ ]  parentNode值为null
    - [ ]  ownerDocument值为null
    - [ ]  子节点可以是DocumentType（最多一个），Element（最多一个）、ProcessingInstruction或Comment类型
- Document类型可以表示HTML页面或其它XML文档，但最常用的还是通过HTMLDocument的实例获取`document`对象，`document`对象可用于获取关于页面的信息以及操作其外观和底层结构

## 1.2.1 HTMLDocument接口规范

- `HTMLDocument` 是DOM的一个抽象接口，它提供了XML文档里没有出现的特殊属性和方法
    - 它的属性和方法包含在`Document` 接口页面中
    - `HTMLDocument` 对象继承了`Document`接口和`HTMLDocument` 接口，因此它有比`Document` 更多的属性，并且与`XMLDocument`不同的是，`HTMLDocument` 是具有外观的，并且要管理它后代的`HTMLElement`
- W3C DOM-Level-2规范了[HTMLDocument接口](https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
    
    ```jsx
    interface HTMLDocument : Document {
               attribute DOMString       title;
      readonly attribute DOMString       referrer;
      readonly attribute DOMString       domain;
      readonly attribute DOMString       URL;
               attribute HTMLElement     body;
      readonly attribute HTMLCollection  images;
      readonly attribute HTMLCollection  applets;
      readonly attribute HTMLCollection  links;
      readonly attribute HTMLCollection  forms;
      readonly attribute HTMLCollection  anchors;
               attribute DOMString       cookie;
                                            // raises(DOMException) on setting
    
      void               open();
      void               close();
      void               write(in DOMString text);
      void               writeln(in DOMString text);
      NodeList           getElementsByName(in DOMString elementName);
    };
    ```
    
    - 可以看出`HTMLDocument` 继承于`Document`接口，`document` 对象的是`HTMLDocument` 的直接实例
        
        ```jsx
        document.__proto__ === HTMLDocument.prototype; // true
        HTMLDocument.prototype instanceof Document; // true
        HTMLDocument.__proto__ === Document; // true
        ```
        
- DOM Standard规范了[Document的接口](https://dom.spec.whatwg.org/#document)
    
    ```jsx
    [Exposed=Window]
    interface Document : Node {
      constructor();
    
      [SameObject] readonly attribute DOMImplementation implementation;
      readonly attribute USVString URL;
      readonly attribute USVString documentURI;
      readonly attribute DOMString compatMode;
      readonly attribute DOMString characterSet;
      readonly attribute DOMString charset; // legacy alias of .characterSet
      readonly attribute DOMString inputEncoding; // legacy alias of .characterSet
      readonly attribute DOMString contentType;
    
      readonly attribute DocumentType? doctype;
      readonly attribute Element? documentElement;
      HTMLCollection getElementsByTagName(DOMString qualifiedName);
      HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
      HTMLCollection getElementsByClassName(DOMString classNames);
    
      [CEReactions, NewObject] Element createElement(DOMString localName, optional (DOMString or ElementCreationOptions) options = {});
      [CEReactions, NewObject] Element createElementNS(DOMString? namespace, DOMString qualifiedName, optional (DOMString or ElementCreationOptions) options = {});
      [NewObject] DocumentFragment createDocumentFragment();
      [NewObject] Text createTextNode(DOMString data);
      [NewObject] CDATASection createCDATASection(DOMString data);
      [NewObject] Comment createComment(DOMString data);
      [NewObject] ProcessingInstruction createProcessingInstruction(DOMString target, DOMString data);
    
      [CEReactions, NewObject] Node importNode(Node node, optional boolean deep = false);
      [CEReactions] Node adoptNode(Node node);
    
      [NewObject] Attr createAttribute(DOMString localName);
      [NewObject] Attr createAttributeNS(DOMString? namespace, DOMString qualifiedName);
    
      [NewObject] Event createEvent(DOMString interface); // legacy
    
      [NewObject] Range createRange();
    
      // NodeFilter.SHOW_ALL = 0xFFFFFFFF
      [NewObject] NodeIterator createNodeIterator(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null);
      [NewObject] TreeWalker createTreeWalker(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null);
    };
    
    [Exposed=Window]
    interface XMLDocument : Document {};
    
    dictionary ElementCreationOptions {
      DOMString is;
    };
    ```
    
    - `Document`接口定义了很多常用的方法和属性，它继承自`Node` ，所以`document` 本质上也可以看作一个节点，是一个文档节点
        
        ```jsx
        Document.__proto__ === Node; // true
        Node.__proto__ === EventTarget; // true
        ```
        
- `EventTarget` ，`Node` ，`Document` ，`HTMLDocument` 之间的原型关系图如下
    
    ![内置构造函数的继承关系.png](Document%E7%B1%BB%E5%9E%8B/%25E5%2586%2585%25E7%25BD%25AE%25E6%259E%2584%25E9%2580%25A0%25E5%2587%25BD%25E6%2595%25B0%25E7%259A%2584%25E7%25BB%25A7%25E6%2589%25BF%25E5%2585%25B3%25E7%25B3%25BB.png)
    
- 为了继承静态的方法和属性，`HTMLDocument` 等接口直接是要[[Prototype]]继承了对应的`Document` 构造函数对象

## 1.2.2 文档子节点（Document Children）

- `Document` 节点的子节点可以是DocumentType、Element、ProcessingInstruction或Comment，但是也提供了直接访问子结点的快捷方式（属性）
    - `documentElement` 属性始终指向HTML页面的<html>元素，虽然`document.childNodes`中 始终存在<html>元素，但是使用`documentElement` 属性可以更快速方便的访问元素
        
        ![documentElement.png](Document%E7%B1%BB%E5%9E%8B/documentElement.png)
        
    - `body` 属性始终指向HTML页面中的<body>元素，因为整个元素是开发者使用最多的元素，所以JavaScript代码中经常可以看到`document.body`
        
        ```jsx
        console.log(document.body === document.documentElement.lastChild); // true
        ```
        
        - 一般而言<html>元素的最后一个子节点就是<body>元素
    - `Document` 类型另一种可能的节点是`DocumentType` ，`DocumentType` 类型继承自`Node` ，它特指HTML中的**doctypes，**即HTML文档开头的文档类型说明，一般为<!doctype html>标签，在`document`对象上可以通过`doctype` 属性访问文档类型节点，它是文档中独立的部分
        
        ```jsx
        document.doctype === document.firstChild; // true
        ```
        
        - 一般而言文档节点的第一个子节点就是文档类型节点
- 严格来讲，出现在<html>元素外部的注释也是文档的子节点，它们的类型是Comment，不过由于浏览器的实现不同，这些注释不一定能被识别，或者表现可能不一样，如下
    
    ```jsx
    <!DOCTYPE html>
    <!-- 第一条注释 -->
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>文档注释</title>
      </head>
      <body>
        文档注释
      </body>
    </html>
    <!-- 第二条注释 -->
    ```
    
    - 整个文档节点的直接子节点有四个：文档类型节点、注释节点、html元素节点、注释节点，如下
        
        ![注释节点.png](Document%E7%B1%BB%E5%9E%8B/%25E6%25B3%25A8%25E9%2587%258A%25E8%258A%2582%25E7%2582%25B9.png)
        
- 一般而言，`appendChild()` ，`removeChild()` ，`replaceChild()` 操作节点的方法不会应用在`document` 对象上，这是因为文档类型（如果存在）是只读的，而且只能有一个Element类型的子节点（即<html>），也就是说，文档节点的结构相对固定，而在书写HTML文档时也会固定写上这些结构，没必要为文档节点添加其他节点类型

## 1.2.3 文档信息

- `document` 作为`HTMLDocument` 的实例，还有一些[标准`Document` 对象上没有的属性](../1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89.md) 这些属性提供了浏览器所加载网页的信息
    - `title`属性，包含<title>元素中的文本，通常显示在浏览器窗口或标签页的标题栏，通过这个属性可以**读写**页面的标题，修改后的标题也会反映在浏览器标题栏上，但是修改`title` 属性并不会改变<title>元素（即只是修改了title元素内的文本值）
        
        ```jsx
        <input type="text" /><button>点击修改标题</button>
        <script>
          const input = document.querySelector("input");
          const btn = document.querySelector("button");
          btn.addEventListener("click", () => {
            if (input.value) {
              document.title = input.value;
              input.value = "";
            } else {
              alert("请输入标题");
            }
          });
        </script>
        ```
        
        ![document.title.gif](Document%E7%B1%BB%E5%9E%8B/document.title.gif)
        
    - `URL` 属性，包含当前页面的完整URL（地址栏中的URL）
        
        ![document.URL.png](Document%E7%B1%BB%E5%9E%8B/document.URL.png)
        
    - `domain`属性，包含页面的域名，如果是本地文件就会返回空字符串，本地服务器就会返回”localhost”
        
        ![document.domain.png](Document%E7%B1%BB%E5%9E%8B/document.domain.png)
        
    - `referrer` 属性，包含链接到当前页面的那个页面的URL，如果当前页面没有来源，则`referrer` 属性返回空字符串
        
        ![referrer.png](Document%E7%B1%BB%E5%9E%8B/referrer.png)
        
- 实际上，上述的`URL`、`domain`、`referrer`所有的这些信息都可以在请求的HTTP头部信息中获取，只是在JavaScript中通过这几个属性暴露出来而已
    - URL跟域名是有关系的，如上面例子中的`dom.spec.whatwg.org`就是`document.URL` 字符串中的一部分
    - 在这些属性中，`domain` 是可以设置的，出于安全考虑，给`domain` 属性设置的值是有限制的，比如完整域名是`dom.spec.whatwg.org` ，可以将`domain` 设置成”spec.whatwg.org”，和”whatwg.org”，但不能给`domain` 属性设置成URL中不包含的值
        
        ![设置域名.png](Document%E7%B1%BB%E5%9E%8B/%25E8%25AE%25BE%25E7%25BD%25AE%25E5%259F%259F%25E5%2590%258D.png)
        
    - 除此之外，当页面中包含来自某个不同子域的窗格（<frame>）或内嵌窗格（<iframe>）时，设置`document.domain` 是有用的
        - 因为跨域通信存在安全隐患，所以不同子域的页面间无法通过JavaScript通信
        - 此时在每个页面上把`document.domain` 设置成相同的值，这些页面就可以访问对方的JavaScript对象了
        - 例如一个加载[https://developer.mozilla.org/](https://developer.mozilla.org/)的页面包含一个内嵌窗格，其中页面加载来之[https://interactive-examples.mdn.mozilla.org/pages/css/animation.html](https://interactive-examples.mdn.mozilla.net/pages/css/animation.html)，这两个页面的`document.domain` 中包含不同的字符串，内外部不能访问对方的JavaScript对象，如果把两个页面的`document.domain` 设置成`mozilla.org` ，那么就能通信了
    
    <aside>
    💡 注意：浏览器对`domain` 属性还有一个限制，即这个属性一旦放松就不能再收紧，比如把`document.domain` 设置成`mozilla.org` 之后，就不能再设置回`developer.mozilla.org` 了，回导致报错
    
    </aside>
    

## 1.2.4 定位元素（Locating Element）

- 定位元素就是获取某个或某组元素的引用，然后对它们执行一些操作
- `document` 对象上暴露了一些方法可以实现获取元素节点的操作

### 1.2.4.1 document.getElementById()

- `getElementById()` 接收一个参数，即要获取元素的id，如果找到了这个元素则返回其引用，如果没有找到就返回`null`
- 参数ID必须跟元素在页面中的id属性值完全匹配，包括大小写，例如
    
    ```jsx
    <div id="mydiv">定位元素</div>
    <script>
      const mydiv = document.getElementById("mydiv");
      console.log(mydiv)
    </script>
    ```
    
    ![定位元素.png](Document%E7%B1%BB%E5%9E%8B/%25E5%25AE%259A%25E4%25BD%258D%25E5%2585%2583%25E7%25B4%25A0.png)
    
- 如果页面中存在多个具有相同ID的元素，则`getElementById()` 会返回在文档中出现的第一个元素

### 1.2.4.2 document.getElementsByTagName()

- `getElementsByTagName()` 是另一个常用来获取元素引用的方法，这个方法接收一个参数，即要获取元素的标签名，返回包含零个或多个元素的`NodeList`
- 在HTML文档中，这个方法返回一个`HTMLCollection`对象，考虑到二者都是”实时“列表，`HTMLCollection` 和NodeList是相似的
    
    ```jsx
    <p name="p1">1</p>
    <p name="p2">2</p>
    <p name="p3">3</p>
    
    const ps = document.getElementsByTagName("p");
    console.log(ps);
    ```
    
    ![getElementByTagName.png](Document%E7%B1%BB%E5%9E%8B/getElementByTagName.png)
    
- 根据DOM-Standard的[HTMLCollection规范](https://dom.spec.whatwg.org/#interface-htmlcollection)，`HTMLCollection` 接口实现如下
    
    ```jsx
    [Exposed=Window, LegacyUnenumerableNamedProperties]
    interface HTMLCollection {
      readonly attribute unsigned long length;
      getter Element? item(unsigned long index);
      getter Element? namedItem(DOMString name);
    };
    ```
    
    - `[LegacyUnenumerableNamedProperties]`：在web IDL中，像`item`这样可以通过`index`属性来访问的`getter`方法称为`index properties`；像`nameItem`这样可以通过`name`属性访问的`getter`方法称之为`name properties`；`[LegacyUnenumerableNamedProperties]` 则表明这个接口中的`name properties`是不可枚举的，所以使用`Object.getOwnPropertyDescriptor`查看`nameItem`对应的集合时，`enumerable`的值是`false`
- 所以访问HTMLCollection对象中的节点元素有如下几种方式
    - 和`NodeList`对象一样，通过中括号或`item()` 方法从HTMLCollection取得特定的元素
        
        ![item(1).png](Document%E7%B1%BB%E5%9E%8B/item(1).png)
        
    - 因为HTMLCollection对象还有一个额外的方法`namedItem` ，可以通过标签的**`name` 属性**获取某一项的引用，所以可以直接通过句点语法或中括号属性名称的方式获取引用
        
        ![namedItem.png](Document%E7%B1%BB%E5%9E%8B/namedItem.png)
        
    
    ---
    
    - 在后台，数组索引会调用item()，而字符串索引会调用namedItem()
- 要获取文档的所有元素，可以给`getElementsByTagName()` 传入*，在JavaScript和CSS中，*被认为是匹配一切的字符
    
    ```jsx
    let allElements = document.getElementsByTagName("*");
    ```
    
    - 这条语句获取文档中的所有节点并**按它们在页面中的出现顺序**构成一个包含所有元素的`HTMLCollection` 对象返回
    - 因此第一项是<html>元素，第二项是<head>元素（不包括文档类型节点是一个继承`Node`的`DocumentType` 对象，而不是一个`Element`对象）
        
        ![allElements.png](Document%E7%B1%BB%E5%9E%8B/allElements.png)
        

<aside>
💡 注意：`document.getElementsByTagName()` 方法，虽然规范要求区分标签的大小写，但为了最大限度兼容原有HTML页面，实际上是不区分大小写的。如果是在XML页面（如XHTML）中使用，那么`document.getElementsByTagName()` 就是区分大小写的

</aside>

### 1.2.4.3 document.getElementsByName()

- 顾名思义，这个方法会返回具有给定`name` 属性的所有元素（一个NodeList对象），它常用于单选按钮，因为同一字段的单选按钮必须具有相同的`name` 属性才能确保把正确的值发送给服务器，如下
    
    ```jsx
    <fieldset>
      <legend>Which color do you perfer?</legend>
      <ul>
        <li>
          <input type="radio" name="color" id="red" value="red" />
          <label for="red">Red</label>
        </li>
        <li>
          <input type="radio" name="color" id="green" value="green" />
          <label for="green">Green</label>
        </li>
        <li>
          <input type="radio" name="color" id="blue" value="blue" />
          <label for="blue">Blue</label>
        </li>
      </ul>
    </fieldset>
    
    const radio = document.getElementsByName("color");
    console.log(radio);
    ```
    
    ![radio.png](Document%E7%B1%BB%E5%9E%8B/radio.png)
    
    ![radio2.png](Document%E7%B1%BB%E5%9E%8B/radio2.png)
    
    - 这里所有的单选按钮都有名为”color”的name属性，但它们的ID都不一样，这是因为ID是为了匹配<label>元素，而name相同是为了保证只将三个中的一个值发送给服务器，然后就可以通过name属性值来获取所有的但单选项节点元素
- 注意，在《JavaScript高级程序设计（第4版）》中原话：
    
    > 与getElementsByTagName()一样，getElementsByName()方法也返回HTMLCollection。
    > 
    - 经过测试并非如此，根据W3C的[DOM Level 2的HTMLDocument规范](../1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89.md)和[MDN-geElementsByName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName) 的提示，这个方法返回的应该**是一个`NodeList` 对象**，而不是HTMLCollection，只不过IE10浏览器和原始Edge浏览器会返回一个HTMLCollection对象

## 1.2.5 特殊集合（Special **Collections**）

- `document` 对象上还暴露（在HTMLDocument接口上定义）了几个特殊集合，这些集合也都是HTMLCollection的实例，它们是访问文档公共部分的快捷方式
    - [ ]  `document.anchors` 包含文档中所有带`name` 属性的<a>元素，anchor有锚的意思，因为<a>元素的`name` 属性已不被推荐使用，所以`document.anchors` 也被废弃了，仅为兼容性存在
    - [ ]  `document.applets` 包含文档中所有<applet>元素（因为<applet>元素已经不建议使用，所以这个集合已经被废弃）
    - [ ]  `document.forms` 包含文档中所有<form>元素（与document.getElementsByTagName(”form”)的返回结果相同）
    - [ ]  `document.images` 包含文档中所有<img>元素（与document.getElementsByTagName(”img”)的返回结果相同）
    - [ ]  `document.links` 包含文档中所有带`href` 属性的<a>元素
- 这些特殊集合始终存在于HTMLDocument对象上，而且与所有HTMLCollection对象一样，其内容也会实时更新以符合当前文档的内容
    
    ```jsx
    <img src="https://joeschmoe.io/api/v1/random" alt="" />
    <img
      src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      alt=""
    />
    <form action="">
      <fieldset>
        <legend>用户名密码</legend>
        <label for="username">用户名</label>
        <input type="text" name="username" />
        <label for="password">密码</label>
        <input type="password" name="password" />
      </fieldset>
    </form>
    <a href="http://baidu.com">百度</a>
    <a href="http://ant.design">antd</a>
    <a href="#你好">你好</a>
    <h2 name="你好">你好</h2>
    ```
    
    ![document collection.png](Document%E7%B1%BB%E5%9E%8B/document_collection.png)
    

## 1.2.6 DOM兼容性检测（DOM **Conformance Detection**）

- DOM有多个Level和多个部分，因此确定浏览器实现了DOM的哪些部分是很有必要的
- `document.implementation` 属性是一个对象，其中提供了与浏览器DOM实现相关的信息和能力
    - DOM Level 1在`document.implementation` 上只定义了一个方法，即`hasFeature()`
        - 这个方法接收两个参数：特性名称和DOM版本
        - 如果浏览器支持指定的特性和版本，则`hasFeature()` 方法返回true
- 根据现在的HTML Standard [DOMImplementation](https://dom.spec.whatwg.org/#domimplementation) 规范，`DOMImplementation` 接口实现如下
    
    ```jsx
    [Exposed=Window]
    interface DOMImplementation {
      [NewObject] DocumentType createDocumentType(DOMString qualifiedName, DOMString publicId, DOMString systemId);
      [NewObject] XMLDocument createDocument(DOMString? namespace, [LegacyNullToEmptyString] DOMString qualifiedName, optional DocumentType? doctype = null);
      [NewObject] Document createHTMLDocument(optional DOMString title);
    
      boolean hasFeature(); // useless; always returns true
    };
    ```
    
    - 从定义中可以看出`DOMImplementation` 接口的`**hasFeature()` 的功能已经被废弃**，《JavaScript高级程序设计（第4版）》中的~~表述是错误的~~，以下是HTML Standard [DOMImplementation](https://dom.spec.whatwg.org/#domimplementation)规范的原话
    
    > hasFeature()原本会报告用户代理是否声称支持给定的DOM特性，但经验证明，它远不如简单地检查所需对象、属性或方法是否存在那么可靠和细致。因此，这个方法不再使用，而是继续存在（只是返回true）以兼容以前的旧页面
    > 
- 但是DOM特性的版本仍然值得说明
    
    
    | 特性 | 支持的版本 | 说明 |
    | --- | --- | --- |
    | Core | 1.0、2.0、3.0 | 定义树形文档结构的基本DOM |
    | XML | 1.0、2.0、3.0 | Core的XML扩展、增加对CDATA区块、处理指令和实体的支持 |
    | HTML | 1.0、2.0 | XML的HTML扩展、增加了HTML特定的元素和实体 |
    | Views | 2.0 | 文档基于某些样式的实现格式 |
    | StyleSheets | 2.0 | 文档的相关样式表 |
    | CSS | 2.0 | Cascading Style Sheets Level 1 |
    | CSS2 | 2.0  | Cascading Style Sheets Level 2 |
    | Events | 2.0、3.0 | 通用DOM事件 |
    | UIEvents | 2.0、3.0 | 用户界面事件 |
    | TextEvents | 3.0 | 文本输入设备触发的事件 |
    | MouseEvents | 2.0、3.0 | 鼠标导致的事件（单机、悬停等） |
    | MutationEvents | 2.0、3.0 | DOM树变化时触发的事件 |
    | MutationNameEvents | 3.0 | DOM元素或元素属性被重命名时触发的事件 |
    | HTMLEvents | 2.0 | HTML4.01事件 |
    | Range | 2.0 | 在DOM树种操作一定范围的对象和方法 |
    | Traversal | 2.0 | 遍历DOM树的方法 |
    | LS | 3.0 | 文件与DOM树之间的同步加载与保存 |
    | LS-Async | 3.0 | 文件与DOM树之间的异步加载与保存 |
    | Validation | 3.0 | 修改DOM树并保证其继续有效的方法 |
    | XPath | 3.0 | 访问XML文档不同部分的语言 |

## 1.2.7 文档写入（**Document Writing**）

- `HTMLDocument` 接口还定义了**向网页输出流中写入内容**的方法，这个古老能力对应四个方法
    - `document.write()`
    - `document.writeln()`
    - `document.open()`
    - `document.close()`
- 其中write()和writeln()方法都接收一个字符串参数，可以将这个字符串写入网页中，`write()`只是简单的写入文本，而`writeln()` 还会在字符串末尾追加一个换行符(\n)，这两个方法可以用来在页面加载期间向页面中动态添加内容
    
    ```jsx
    <body>
      <p>
        The Current date and time is:
        <script>
          document.write("<strong>" + new Date().toString() + "</strong>");
        </script>
      </p>
    </body>
    ```
    
    ![document.write.png](Document%E7%B1%BB%E5%9E%8B/document.write.png)
    
    - 这个例子会在页面加载过程中输出当前日期和时间
    - 日期放在<strong>元素中，如同它们之前就包含在HTML页面中一样，这意味着会创建一个DOM元素，以后也可以访问
    - 通过write()和writln()输出的任何HTML都会以这种方式来处理（~~和JSX有类似之处~~）
- write()和writeln()经常用于动态包含外部资源，如JavaScript文件，包含JavaScript文件时，不能直接包含字符串”</script>”，因为这个字符串会被解释为脚本块的结尾，导致后续的代码不能执行，使用转义字符即可，如下
    
    ```jsx
    <script>
      document.write(
        '<script type="text/javascript" src="./14.1.2.6 script.js">' +
          "<\/script>"
      );
    </script>
    ```
    
    - 为了防止字符串"</script>"匹配到外层的<script>标签，加入了”\”进行转义
- 前面的例子都是在页面渲染期间通过document.write()向文档中输出内容的，如果在**页面加载完**之后再调用`document.write()`，则输出的内容会重写整个页面，如下
    
    ```jsx
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>重写页面</title>
      </head>
      <body>
        <p>页面会被重写</p>
        <script>
          window.addEventListener("load", () => {
            document.write("Hello, world!");
          });
        </script>
      </body>
    </html>
    ```
    
    ![write after onload.png](Document%E7%B1%BB%E5%9E%8B/write_after_onload.png)
    
    - 最终页面变成上图所示
- `document.open()`和`document.close()` 方法分别用于打开和关闭网页输出流，在调用write()和writeln()时，这两个方法都不是必需的

<aside>
💡 注意，严格的XHTML文档不支持文档写入。对于内容类型为application/xml+xhtml的页面，这些方法不起作用

</aside>