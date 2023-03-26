# 1. DOM 演进

- **DOM2和DOM 3 Core的演进**
    - DOM2和DOM3 Core模块的目标是扩展DOM API，满足**XML**的所有需求并提供更好的错误处理和特性检测
        - 这意味着需要支持XML命名空间的概念
    - DOM2 Core没有新增任何类型，仅仅在DOM1 Core基础上增加了一些方法和属性
- DOM View和HTML模块
    - 它们也丰富了DOM接口，定义了新的属性和方法
    - 这两个模块很小，因此本章在讨论JavaScript对象的基本变化将它们与Core模块放在一起讨论

<aside>
💡 注意：《JavaScript高级程序设计（第4版）》只讨论已被实现的DOM API（过去的语境），所以下面提到的API并非全部的DOM API，可能有一些新的已被实现的更好DOM API

</aside>

# 1.0 XML和XHTML

- 对XML和XHTML的补充

[XML和XHTML](1%20DOM%20%E6%BC%94%E8%BF%9B/XML%E5%92%8CXHTML.md)

# 1.1 XML命名空间

- XML命名空间可以实现在一个格式规范的文档中混用不同的XML语言，而不必担心元素命名冲突
    - 严格来讲，XML命名空间在XHTML中才支持，HTML并不支持
    - 关于命名空间，可以查看[14. **XML 命名空间提供避免元素命名冲突的方法**](1%20DOM%20%E6%BC%94%E8%BF%9B/XML%E5%92%8CXHTML/XML%E6%95%99%E7%A8%8B%E9%98%85%E8%AF%BB%E5%BF%83%E5%BE%97.md) ，需要记得**XML 命名空间提供避免元素命名冲突的方法**
- 对于XHTML而言，其命名空间大体上默认应该是"[http://www.w3.org/1999/xhtml](http://www.w3.org/1999/xhtml)"，如果使用**默认命名空间**的方式，如下
    
    ```html
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Exmaple XHTML Page</title>
      </head>
      <body>
        Hello, world!
      </body>
    </html>
    ```
    
    - 对于这个例子而言，所有元素默认属于XHTML命名空间
    - `xmlns` 属性就是xml namespace的意思，在元素上直接使用它并设置值是一种设置**默认命名空间**的方式
- 为了避免不同XML文档混淆，可以给XHMTL命名空间定义一个前缀，这个前缀可以自定义名称， 但对于XHTML而言，这个前缀一般就是`xhtml` ，格式就是每个XHTML中的元素和属性都要在前面加上`xhtml:` 这个命名空间前缀，如下
    
    ```html
    <xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <xhtml:head>
        <xhtml:title> Example XHTML Page </xhtml:title>
      </xhtml:head>
      <xhtml:body xhtml:class="home">
        Hello world!
      </xhtml:body>
    </xhtml:html>
    ```
    
    - 在使用`xhtml`前缀前，需要使用`xmlns` 属性定义前缀名称和
    - 需要注意，XML 命名空间属性被放置于元素的**开始标签**之中，当命名空间被定义在元素的开始标签中时，所有带有**相同前缀的子元素**都会与同一个命名空间相关联
    - 这里`class`属性也被加上了`xhtml`前缀
- 如果文档只有一种XML语言时，那么命名空间前缀其实是多余的，使用默认命名空间即可，只有一个文档有混合使用多个XML语言时才有必要，如下是使用了XHTML和SVG两种XML语言的文档
    
    ```html
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Exmaple XHTML Page</title>
      </head>
      <body>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 100 100"
          style="width: 100%; height: 100%"
        >
          <rect x="0" y="0" width="100" height="100" style="fill: red" />
        </svg>
      </body>
    </html>
    ```
    
    - 通过给`svg`元素设置自己的命名空间，将其标识为当前文档的外来元素，这样一来<svg>元素及其属性，包括它的所有后代节点都会被认为属于”http://www.w3.org/2000/svg“命名空间
    - 虽然这个文档从技术角度仍然是XHTML文档，但是由于使用了命名空间，其中包含的SVG代码也是有效的，浏览器打开文件后的渲染如下
        
        ![mix_namspace.png](1%20DOM%20%E6%BC%94%E8%BF%9B/mix_namspace.png)
        
- 介绍命名空间是为了说明XML文档中的节点有可能属于不同的语言，那么在进行文档交互时就有可能出现问题
    - 创建一个新元素，这个元素属于哪个命名空间？
    - 查询特定标签名称时，结果应该包含哪个命名空间下的元素？
    - DOM 2 Core为解决这些问题，给DOM1方法提供了特定于命名空间的版本

## 1.1.1 Node的变化

- 在DOM2中，~~Node类型包含以下特定于命名空间的属性~~
    - [ ]  `localName`，不包含命名空间前缀的节点名称
    - [ ]  `namespaceURI`，节点的命名空间URL，如果未指定则为`null`
    - [ ]  `prefix` ，命名空间前缀，如果未指定就是`null`
    
    ---
    
    《JavaScript高级程序设计（第4版）》说这些属性是Node类型包含的，实际上[最新的DOM规范](https://dom.spec.whatwg.org/#dom-element-localname)中，这三者都是`Element` 接口的属性
    
    ```jsx
    interface Element : Node {
      ...
    	readonly attribute DOMString? namespaceURI;
      readonly attribute DOMString? prefix;
      readonly attribute DOMString localName;
    	readonly attribute DOMString tagName;
      ...
    }
    ```
    
- 在节点使用命名空间前缀的情况下，`nodeName`等于`prefix+ ":" + localName` ，如下面这个例子
    
    ```html
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Exmaple XHTML Page</title>
      </head>
      <body>
        <s:svg
          xmlns:s="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 100 100"
          style="width: 100%; height: 100%"
        >
          <s:rect x="0" y="0" width="100" height="100" style="fill: red" />
        </s:svg>
      </body>
      <script>
        const svgs = document.getElementsByTagNameNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        const rects = document.getElementsByTagNameNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        const html = document.documentElement;
        console.log(
          svgs[0].prefix,
          svgs[0].localName,
          svgs[0].namespaceURI,
          svgs[0].nodeName,
          svgs[0].tagName
        );
        console.log(
          rects[0].prefix,
          rects[0].localName,
          rects[0].namespaceURI,
          rects[0].nodeName,
          rects[0].tagName
        );
        console.log(
          html.prefix,
          html.localName,
          html.namespaceURI,
          html.nodeName,
          html.tagName
        );
      </script>
    </html>
    ```
    
    ![namespace.png](1%20DOM%20%E6%BC%94%E8%BF%9B/namespace.png)
    
    - `<html>`元素 的`localName` 和`tagName` 都是”html”，`namespaceURI` 是"http://www.w3.org/1999/xhtml"，使用默认命名空间，没有定义前缀，所以`prefix` 为`null`
    - 对于`<s:svg>` 元素，`localName` 是”svg”（不带前缀的标签名称），`tagName` 是”s:svg”（完整的标签名称），`nodeName` 值和`tageName` 一样，`namespaceURI` 是”http://www.w3.org/2000/svg”，使用`xmlns` 属性定义了命名空间前缀为`s` ，所以`prefix` 就是”s”
- DOM3进一步增加了与命名空间有关的方法，它们定义在`Node` 接口中
    - [ ]  `isDefaultNamespace(namespaceURI)`,返回布尔值，表示`namespaceURI` 是否为节点的默认命名空间
    - [ ]  `lookupNamespace(prefix)` ，返回给定`prefix` 的命名空间`URI`
    - [ ]  `lookupPrefix(namespaceURI)` ，返回给定`namespaceURI` 的命名空间的前缀
- 前面的例子可以执行以下代码以验证这些方法
    
    ```jsx
    console.log(
    	document.body.isDefaultNamespace("http://www.w3.org/1999/xhtml")
    ); // true
    console.log(svgs[0].lookupPrefix("http://www.w3.org/2000/svg")); // s
    console.log(rects[0].lookupNamespaceURI("s")); // http://www.w3.org/2000/svg
    ```
    
    - 这些方法主要用于通过元素查询前面和命名空间URI，以确定元素与文档的关系

## 1.1.2 Document变化

- DOM2在Document类型上新增了如下命名空间特定的方法，这些方法就是之前介绍过的元素获取、增加、创建等的“命名空间版本”，后面加上了NS，表示`namespace`
    - [ ]  `createElementNS(namespaceURI, tagName)` ，以给定的标签名称创建指定命名空间`namespaceURI`的一个新元素
    - [ ]  `createAttributeNS(namespaceURI, attributeName)` ,以给定属性名创建指定命名空间`namespaceURI` 的`一个新属性`
    - [ ]  `getElementsByTagNameNS(namespaceURI,tagName)` ，返回指定命名空间`namespaceURI` 中所有标签名称为`tagName` 的元素的~~`NodeList`~~  `HTMLCollection` 对象
- 使用这些方法都需要传入相应的命名空间URI，如下
    
    ```jsx
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Exmaple XHTML Page</title>
      </head>
      <body></body>
      <script>
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");
        const myAttr = document.createAttributeNS(
          "http://www.w3.org/2000/svg",
          "myAttr"
        );
        myAttr.value = "hello world";
        svg.setAttributeNS("http://www.w3.org/2000/svg", "viewBox", "0 0 100 100");
        svg.style = "width: 100%; height: 100%;";
        svg.setAttributeNodeNS(myAttr);
        document.body.appendChild(svg);
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", 0);
        rect.setAttribute("y", 0);
        rect.setAttribute("width", "100");
        rect.setAttribute("height", "100");
        rect.style = "fill: black";
        svg.appendChild(rect);
        const svgs = document.getElementsByTagNameNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        console.log(svgs[0] === svg);
      </script>
    </html>
    ```
    
    - `svg` 和`rect` 元素都是通过`createElementNS` 方法临时创建的，它们拥有相同的命名空间"http://www.w3.org/2000/svg"
    - 这里使用了`createAttributeNS`方法为`svg` 元素创建一个自定义的属性节点，并使用`setAttributeNodeNS` 添加到`svg` 元素上
    - 需要注意，`xmlns` 、`version` 属性可以直接通过`setAttribute` 进行设置，而`viewBox` 属性需要通过`setAttributeNS` 进行设置，而`style` 属性可以直接访问赋值
    - `getElementsByTagNameNS` 最后获取到了包含`svg` 元素 `HTMLCollection`

## 1.1.3 Element的变化

- DOM2 Core对`Element` 类型的更新主要集中在对属性的操作上，DOM规范中[Element接口](https://dom.spec.whatwg.org/#element)关于命名空间的定义如下
    
    ```jsx
    [Exposed=Window]
    interface Element : Node {
    	...
    	DOMString? getAttributeNS(DOMString? namespace, DOMString localName);
    	[CEReactions] undefined setAttributeNS(DOMString? namespace, DOMString qualifiedName, DOMString value);
    	[CEReactions] undefined removeAttributeNS(DOMString? namespace, DOMString localName);
    	boolean hasAttributeNS(DOMString? namespace, DOMString localName);
    	
    	Attr? getAttributeNodeNS(DOMString? namespace, DOMString localName);
    	[CEReactions] Attr? setAttributeNodeNS(Attr attr);
    	...
    }
    ```
    
    - [ ]  `getAttributeNS(namespaceURI, localName)` ，获取指定命名空间的`namespaceURI` 中名为`localName` 的属性
    - [ ]  `getAttributeNodeNS(namespaceURI, localName)` ，取得指定命名空间`namespaceURI` 中名为`localName` （不包含前缀）的属性
    - [ ]  `getElementsByTagNameNS(namespaceURI, tagName)` ，取得指定命名空间`namespaceURI` 中名为`tagName` （包含前缀）的属性
    - [ ]  `hasAttributeNS(namespaceURI, localName)` ，返回布尔值，表示元素中是否有命名空间`namespaceURI` 中名为`localName` 的属性
    - [ ]  `removeAttributeNS(namespaceURI, localName)` ，删除指定命名空间`namespaceURI` 中名为`localName` 的属性
    - [ ]  `setAttributeNS(namespaceURI, qualifiedName, value)` ，设置指定命名空间`namespaceURI` 中名为`qualifiedName` 的属性为`value`
    - [ ]  `setAttributeNodeNS(attNode)` ，为元素设置（添加）包含命名空间信息的属性节点`attNode`
- 这些方法与DOM1中对于的方法行为相同，除`setAttributeNodeNS()` 之外都只是多了一个命名空间参数

## 1.1.4 NamedNodeMap变化

- 之前介绍过的`[Element`](https://dom.spec.whatwg.org/#element) 接口定义的`attributes` 属性类型就是`NamedNodeMap` ，因为属性节点也可以有命名空间，所以`NamedNodeMap` 上定义的方法也有对应的命名空间方法
    
    ```jsx
    [Exposed=Window,
     LegacyUnenumerableNamedProperties]
    interface NamedNodeMap {
    	...
      Attr? getNamedItemNS(DOMString? namespace, DOMString localName);
      [CEReactions] Attr? setNamedItemNS(Attr attr);
      [CEReactions] Attr removeNamedItemNS(DOMString? namespace, DOMString localName);
    	...
    };
    ```
    
    - [ ]  `getNamedItemNS(namespaceURI, localName)` ，取得指定命名空间`namespaceURI` 中名为`localName` 的项
    - [ ]  `removeNamedItemNS(namespaceURI, localName)` ，删除指定命名空间`namespaceURI` 中名为`localName` 的项
    - [ ]  `setNamedItemNS(node)` ，为元素设置（添加）包含命名空间信息的节点
- 这些方法很少使用，因为通常都是使用元素来访问属性

# 1.2 其它变化

- 除了命名空间相关的变化，DOM2 Core还对DOM的其它部分做了一些更新
    - 这些变化与XML命名空间无关
    - 主要关注DOM API的完整性和可靠性

## 🚫1.2.1 DocumentType变化

- `DocumentType` 新增了3个属性：`publicId`, `SystemId`和`internalSubset` ,最新DOM规范的IDL定义如下
    
    ```jsx
    [Exposed=Window]
    interface DocumentType : Node {
      readonly attribute DOMString name;
      readonly attribute DOMString publicId;
      readonly attribute DOMString systemId;
    };
    ```
    
    - `DocumentType` 上的其它属性通过基础`Node` 和混入其它接口获得
    - [ ]  `publicId` ，`systemId` 属性表示文档类型声明中有效但无法使用DOM1 API访问的数据
    - [ ]  `internalSubset` 属性用于访问文档类型声明中可能包含的额外定义，这种额外定义常在XML文档中看到，HTML文档几乎不涉及
- 对于支持DOM2的浏览器，打开如下代码构成的HTML文档
    
    ```html
    <!DOCTYPE html PUBLIC "-// W3C// DTD HTML 4.01// EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html>
      <head>
        <title>Example</title>
      </head>
      <body>
        Hello world
      </body>
      <script>
        console.log(document.doctype.publicId);
        console.log(document.doctype.systemId);
        console.log(document.doctype.internalSubset);
      </script>
    </html>
    ```
    
    ![DocumentTypeDOM2.png](1%20DOM%20%E6%BC%94%E8%BF%9B/DocumentTypeDOM2.png)
    
- `publicID`就是在DTD的PUBLIC后定义的字符串
- `systemId` 就是在DTD后加上的规范标准文件URI
- `internalSubset` 实际上是哦那个与访问文档类型声明中可能包含的额外定义，如
    
    ```jsx
    <!DOCTYPE html PUBLIC "-// W3C// DTD XHTML 1.0 Strict// EN"
    "[http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd](http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)"
    [<!ELEMENT name (#PCDATA)>] >
    ```
    
    - “[<!ELEMENT name (#PCDATA)>]”就应该是`internalSubset`
    - 因为上面文件作为一个HTML而言，并不支持`internalSubset` 故而没有书写

---

**补充**

- 《JavaScript高级程序设计（第4版）》虽然是2019年的新书，但实际上这个部分介绍的`DocumentType` 类型的变化在DOM2新增的3个属性都没有意义了
    - [ ]  `publicId` ，`systemId` 属性对于HTML文档而言就是两个空字符串，没有意义，MDN已经删除了对二者的具体解释
    - [ ]  `internalSubset` 应该是曾经存在过的一个属性，对于HTML文档而言，MDN没有相关的属性，DOM规范的`DocumentType` 接口定义中也没有这个`internalSubset`
- 所以这三个属性不用管，现代HTML文档的DTD都是如下格式，表示最新的html规范
    
    ```html
    <!DOCTYPE html>
    ```
    

## 1.2.2 Document的变化

### 1.2.2.1 importNode()

- Document类型在DOM 2 Core中的更新唯一跟命名空间无关的方法是`importNode()` ，DOM规范的`[Document`](https://dom.spec.whatwg.org/#document) 接口定义如下
    
    ```jsx
    [Exposed=Window]
    interface Document : Node { 
    	...
    	[CEReactions, NewObject] Node importNode(Node node, optional boolean deep = false);
    	...
    }
    ```
    
    - [ ]  `importNode(node[, deep])` ：这个方法目的是从其它文档获取一个节点并导入到新文档，以便其插入新文档
        - 每个节点都会有一个`ownerDocument` 属性，表示所属文档
        - 如果调用`appendChild()` 方法时传入节点的`ownerDocument` 不是指向当前文档则会发生错误
        - 而调用`importNode()` 导入其它文档的节点会返回一个新节点，这个新节点的`ownerDocument`属性时正确的
- 在具体使用时，可以把它看作是应用于外部文档节点的`cloneNode()` 方法
    - 接收第一个参数就是要复制的外部文档节点
    - 第二个参数可选，布尔值，表示是否进行深度复制，即是否复制子树
    - 返回结果是一个适合在当前文档中使用的**新节点**，其`ownerDocument` 就是当前节点
- 这个方法在HTML中使用的不多，在XML文档中使用会更多一点，不过还是可以通过`iframe`举出如下例子
    
    ```jsx
    <!-- min namespace.xhtml -->
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>iframe</title>
      </head>
      <body>
        <iframe
          border="1"
          src="./mix namespace.xhtml"
          width="200"
          height="300"
        ></iframe>
        <h2>Hello mangwu</h2>
      </body>
    </html>
    ```
    
    ```html
    <!-- min namespace.xhtml -->
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Exmaple XHTML Page</title>
      </head>
      <body>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 100 100"
          style="width: 100%; height: 100%"
        >
          <rect x="0" y="0" width="100" height="100" style="fill: red" />
        </svg>
      </body>
      <script>
        const svgs = document.getElementsByTagNameNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        console.log(svgs[0].ownerDocument === document.body.ownerDocument); // true
        const h2 = window.parent.document.querySelector("h2");
        console.log(h2, h2 instanceof Node, document.body instanceof Node); // <h2>Hello mangwu</h2>  false true
        console.log(h2.ownerDocument === document.body.ownerDocument); // false
        let newNode = document.importNode(h2, true);
        console.log(newNode.ownerDocument === document.body.ownerDocument); // true
        console.log(newNode); // <h2>Hello mangwu</h2>
        document.body.appendChild(newNode);
      </script>
    </html>
    ```
    
    ![import.png](1%20DOM%20%E6%BC%94%E8%BF%9B/import.png)
    

### 1.2.2.2 defaultView

- DOM2 View给Document类型增加了一个新属性，`defaultView` ，是一个指向拥有当前文档的窗口（或窗格<iframe>）的指针
    - DOM2View规范并没有明确视图何时可用，因此这是添加的唯一一个属性
    - `defaultView` 属性得到了除IE8及更早版本之外所有浏览器的支持
    - IE8及更早版本支持等价的`parentWindow` 属性，Opera也支持这个属性，考虑兼容性，使用如下代码即可获得当前文档的窗口引用
        
        ```jsx
        let parentWindow = document.defaultView || document.parentWindow;
        ```
        

---

**补充**

- 最新的DOM规范中并没有关于`defaultView` 的解释，反而在最新的[HTML规范](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-document-defaultview-dev)中对`defaultView` 有说明
- MDN表示它就是`document` 对象中一个对`window` 对象进行引用的只读属性，有可能为`null`

### 1.2.2.3 implementation

- DOM2 Core还在`Document` 接口上定义了一个`implementation` 属性，这个属性是`DOMImplementation` 类型，最新的[DOM规范](https://dom.spec.whatwg.org/#document) 的`Document` 接口对此有如下IDL定义
    
    ```jsx
    [Exposed=Window]
    interface Document : Node {
      ...
      [SameObject] readonly attribute DOMImplementation implementation;
    	...
    }
    
    [Exposed=Window]
    interface DOMImplementation {
      [NewObject] DocumentType createDocumentType(DOMString qualifiedName, DOMString publicId, DOMString systemId);
      [NewObject] XMLDocument createDocument(DOMString? namespace, [LegacyNullToEmptyString] DOMString qualifiedName, optional DocumentType? doctype = null);
      [NewObject] Document createHTMLDocument(optional DOMString title);
    
      boolean hasFeature(); // useless; always returns true
    };
    ```
    
- 实际上这个属性在第14章节[1.2.6 DOM兼容性检测（DOM **Conformance Detection**）](../14%20DOM/1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/Document%E7%B1%BB%E5%9E%8B.md) 中的**DOM兼容性检测（DOM Conformance Detection）**提到过的，为了解释`hasFeature()` 方法（只会返回`true`）而展示出了整个`DOMImplementation` 接口
- 实际上`DOMImplementation` 接口的两个方法`createDocumentType()`和`createDocument()` 是在DOM2 Core添加上的
    - [ ]  `createDocumentType(qualifiedName, publicId, systemId)` :用于创建`DocumentType` 类型的新节点，后面的两个参数`publicId`和`systemId` 就是[🚫1.2.1 DocumentType变化](1%20DOM%20%E6%BC%94%E8%BF%9B.md) 中提到DOM2 Core对`DocumentType` 接口新增的属性，当前的DOM规范无需使用，使用`createDocumentType` 方法时填入空字符串即可，对于HTML文档而言，`DocumentType` 的指定名称就是”html”，如下
        
        ```jsx
        <script>
          console.log(document.implementation.createDocumentType("html", "", ""));
        </script>
        // 打印结果
        // <!DOCTYPE html>
        ```
        
        - 已有文档类型不可更改，所以`createDocumentType` 只有在创建新文档时才有用
    - [ ]  `createDocument(namespace, qualifiedName[,doctype])` ：用于创建新文档，及一个`Document` 对象，它需要的参数分别为文档元素的命名空间URI，文档元素的标签名和文档类型，文档类型就是DTD，可以使用`createDocumentType` 创建，对于HTML的一般文档而言，不需要与XML有关的命名空间，而标签名称就是一个代号，通常填入”root”，表示所有节点的根，如下
        
        ```jsx
        console.log(document.implementation.createDocument("", "root", null));
        ```
        
        ![createDocument.png](1%20DOM%20%E6%BC%94%E8%BF%9B/createDocument.png)
        
        - 实际上在Document的IDL定义中，拥有contructor构造方法，所以可以直接通过`new` 关键字创建，如下
            
            ![new Document.png](1%20DOM%20%E6%BC%94%E8%BF%9B/new_Document.png)
            
- 除此之外，DOM2 HTML模块也为`document.implamentation` 对象添加了`createHTMLDocument()` 方法
    - [ ]  `createHTMLDocument([title])`  ，这个方法可以创建一个完整的HTML文档，包含<html>，<head>，<title>，<body>元素且只接收一个可选的参数，即新创建文档的标题（放入<title>元素中），返回一个新的HTML文档
        
        ```jsx
        const htmldoc = document.implementation.createHTMLDocument("hello");
        console.log(htmldoc, htmldoc instanceof HTMLDocument); // #document true
        console.log(htmldoc.title); // hello
        ```
        
        - `createHTMLDocument` 创建的是`HTMLDocument` 实例，所以包含该类型的所有相关方法和属性，包括`title`和`body`属性

## 1.2.3 Node的变化

### 1.2.3.1 比较节点

- DOM3新增了两个用于比较节点的方法，这两个方法在DOM规范的[`Node`](https://dom.spec.whatwg.org/#node)接口中定义如下
    
    ```jsx
    [Exposed=Window]
    interface Node : EventTarget { 
    	...
    	boolean isEqualNode(Node? otherNode);
      boolean isSameNode(Node? otherNode); // legacy alias of ===
    	...
    }
    ```
    
    - [ ]  `isEqualNode(otherNode)` , `isSameNode(otherNode)` ：二者都接收一个节点参数，如果这两个节点与参考节点相同或相等就返回`true`
        - 节点**相同**（**same**），意味着引用同一个对象
        - 节点**相等**（**equal**），意味着节点类型相同，拥有相同的属性(`nodeName`，`nodeValue`等)，而且`attributes`和`childNodes`也相等
        - DOM规范中也给出了提示：`isSameNode` 就是比较Node节点是的 `===`的别名
- 对于`isEqualNode` 而言，节点相等不意味着两个节点指向同一个引用，保证它们具有相同的属性即可，如下
    
    ```jsx
    <body>
        <p>Hello, <span class="special">mangwu</span></p>
        <script>
          const p = document.querySelector("p");
          const copyP = p.cloneNode(true);
          console.log(p,copyP);
          console.log(p.isSameNode(copyP)); // false
          console.log(p.isEqualNode(p)); // true
          console.log(p.isEqualNode(copyP)); // true
        </script>
      </body>
    ```
    

### 🚫1.2.3.2 setUserData()

- DOM3也增加了给DOM节点附加额外数据的方法`setUserData()` ,在[DOM-Level-3-Core](https://www.w3.org/TR/DOM-Level-3-Core/core.html) 规范的[Node](https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247) 节点有如下定义
    
    ```jsx
    interface Node { 
    	...
    	// Introduced in DOM Level 3:
      DOMUserData        setUserData(in DOMString key, 
                                     in DOMUserData data, 
                                     in UserDataHandler handler);
    	// Introduced in DOM Level 3:
      DOMUserData        getUserData(in DOMString key);
    	...
    }
    ```
    
    - [ ]  `setUserData(key, data, handler)` ：接收三个参数，键，值和处理函数，用于给节点追加数据，传入的处理函数会在包含数据的节点被复制、删除、重命名、或导入其它文档的时候执行，处理函数接收5个参数
        - 表示操作类型的数字：1表示复制，2表示导入，3表示删除，4表示重命名
        - 数据的键
        - 数据的值
        - 源节点：删除节点时，源节点是`null`
        - 目标节点：除了复制外，目标节点都是`null`
    - [ ]  `getUserData(key)` ，在源节点上调用这个方法就可以获得附加到源节点上的数据
- 在复制节点时，如果想要同步复制源节点的附加额外数据，可以利用`handler` 进行处理，如下
    
    ```jsx
    const div = document.createElement("div");
    const handler = function (operation, key, value, src, dest) {
      if (operation === 1) {
        dest.setUserData(key, value, handler);
      }
    };
    div.setUserData("name", "mangwu", handler);
    let newDiv = div.cloneNode(true);
    console.log(newDiv.getUserData("name")); // mangwu
    ```
    

---

**补充**

- 上述方法（setUserData和getUserData）已经在目前（2023年1月18日）的DOM规范的Node节点中不再定义，并且MDN也没有相关解释
- 在现代浏览器中，元素节点不存在这两个方法，也就是说《JavaScript高级程序设计（第4版）》关于这两个方法的介绍是过去的，现在已经不是标准的一部分

## 1.2.4 内嵌窗格的变化（iframe）

- DOM2 HTML给`HTMLIFrameElement` （即<iframe>，内嵌窗格）类型新增了一个属性，叫`contentDocument` ，这个属性包含代表子内嵌窗格中内容的`document` 对象的指针，在HTML规范中的`[HTMLIFrameElement](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` 接口定义如下
    
    ```jsx
    [Exposed=Window]
    interface HTMLIFrameElement : HTMLElement {
      [HTMLConstructor] constructor();
    
      [CEReactions] attribute USVString src;
      [CEReactions] attribute DOMString srcdoc;
      [CEReactions] attribute DOMString name;
      [SameObject, PutForwards=value] readonly attribute DOMTokenList sandbox;
      [CEReactions] attribute DOMString allow;
      [CEReactions] attribute boolean allowFullscreen;
      [CEReactions] attribute DOMString width;
      [CEReactions] attribute DOMString height;
      [CEReactions] attribute DOMString referrerPolicy;
      [CEReactions] attribute DOMString loading;
      **readonly attribute Document? contentDocument;**
      **readonly attribute WindowProxy? contentWindow;**
      Document? getSVGDocument();
    
      // also has obsolete members
    };
    ```
    
    - [ ]  `contentDocument` 属性是一个`Document` 实例，拥有所有文档属性和方法，因此可以像使用其它HTML文档一样使用它
    - [ ]  `contentWindow` 属性是一个`WindowProxy` 实例，即`window` 代理对象，它通过代理引用窗格的`window`对象，这个对象上也有一个`document` 属性
    
    ```jsx
    <body>
        <iframe
          border="1"
          src="./16.1.2.3 Node.html"
          width="200"
          height="300"
        ></iframe>
        <h2>Hello mangwu</h2>
      </body>
      <script>
        const frame = document.querySelector("iframe");
        console.log(frame.contentDocument, frame.contentDocument === document); // #document false
        console.log(
          frame.contentWindow,
          frame.contentWindow.document === frame.contentDocument
        ); // Window {...} true
      </script>
    ```
    

<aside>
💡 注意：跨源访问子内嵌窗格的`document` 对象会受到安全限制，如果内嵌窗格中加载了不同域名（或子域名）的页面，或者该页面使用了不同协议，则访问其`document` 对象会抛出错误

</aside>