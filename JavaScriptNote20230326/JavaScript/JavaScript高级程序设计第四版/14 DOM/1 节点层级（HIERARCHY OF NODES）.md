# 1. 节点层级（HIERARCHY OF NODES）

- 任何HTML或XML文档都可以用DOM表示为一个由**节点构成的层级结构（a hierarchy of nodes）**
    - 节点分为很多类型，每种类型对应着文档中不同的信息 和/或 **标记**(**markup**)，也有各自不同的**特性**(**characteristics**)、数据和方法
    - 不同类型之间的节点或存在某种关系，这些关系构成了**层级结构**（**hierarchy**），让标记可以表示为一个以特定节点为根的树形结构
- 以如下的HTML为例
    
    ```jsx
    <html>
      <head>
        <title>Sample Page</title>
      </head>
      <body>
        <p>Hello World!</p>
      </body>
    </html>
    ```
    
- 表示为层级结构，如图
    
    
    ![DOM 结构.png](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/DOM_%25E7%25BB%2593%25E6%259E%2584.png)
    
    - document节点表示每个文档的根节点，这里根节点的唯一子节点是<html>元素，称为**文档元素（documentElement）**
        - 文档元素是最外层的元素
        - 所有其它元素都在文档元素之内
        - 每个文档只能有一个文档元素
        - 在HTML页面中文档元素只能是<html>元素
        - 在XML文档中，没有预定义这样的元素，任何元素都可成为文档元素
    - HTML中的每段**标记**（**markup**）都可以表示为这个树形结构中的一个节点
        - 元素节点（attributes nodes）表示HTML元素
        - 属性节点（attributes nodes）表示属性
        - 文档类型节点（document type node）表示文档类型
        - 注释节点（comment nodes）表示注释
        - DOM中总共有**12**种节点类型，这些类型都继承一种基本类型
    

# 1.1 Node类型

- DOM Level 1 描述了名为`Node`的接口，这个接口是所有DOM节点类型都必须实现的
    - Node接口在JavaScript中被实现为Node类型，在除了IE之外的所有浏览器都可以直接访问这个类型
    - 在JavaScript中所有节点类型都继承Node类型，因此所有类型都共享相同的基本属性和方法
    
    ```jsx
    console.log(typeof Node); // "function"
    console.log(document instanceof Node); // true
    console.log(document.documentElement instanceof Node); // true
    ```
    
- 每个节点都有nodeType属性，表示该节点的类型，节点类型由定义在Node类型上 的12个数值常量表示
    - [ ]  Node.ELEMENET_NODE：1
    - [ ]  Node.ATTRIBUTE_NODE：2
    - [ ]  Node.TEXT_NODE：3
    - [ ]  Node.CDATA_SECTION_NODE：4
    - [ ]  Node.ENTITY_PEFERENCE_NODE：5
    - [ ]  Node.ENTITY_NODE：6
    - [ ]  Node.PROCESSING_INSTRUCTION_NODE：7
    - [ ]  Node.COMMENT_NODE：8
    - [ ]  Node.DOCUMENT_NODE：9
    - [ ]  Node.DOCUMENT_TYPE_NODE：10
    - [ ]  Node.DOCUMENT_FRAGMENT_NODE：11
    - [ ]  Node.NOTATION_NODE：12
- 节点类型可以通过与这些常量比较来确定
    
    ```jsx
    if(someNode.nodeType === Node.ELEMENT_NODE) {
    	alert("Node is an element");
    }
    ```
    
    - 浏览器并不支持所有节点类型
    - 开发者最常用到的是元素节点（ELEMENT_NODE）和文本节点（TEXT_NODE）

## 1.1.1 Node接口规范

- Node接口定义的属性和方法可以参考[HTML-DOM-Standard](https://dom.spec.whatwg.org/#interface-node)

```jsx
[Exposed=Window]
interface Node: EventTarget {
	const unsigned short ELEMENT_NODE = 1;
  const unsigned short ATTRIBUTE_NODE = 2;
  const unsigned short TEXT_NODE = 3;
  const unsigned short CDATA_SECTION_NODE = 4;
  const unsigned short ENTITY_REFERENCE_NODE = 5; // legacy
  const unsigned short ENTITY_NODE = 6; // legacy
  const unsigned short PROCESSING_INSTRUCTION_NODE = 7;
  const unsigned short COMMENT_NODE = 8;
  const unsigned short DOCUMENT_NODE = 9;
  const unsigned short DOCUMENT_TYPE_NODE = 10;
  const unsigned short DOCUMENT_FRAGMENT_NODE = 11;
  const unsigned short NOTATION_NODE = 12; // legacy

	readonly attribute unsigned short nodeType;
  readonly attribute DOMString nodeName;

	readonly attribute USVString baseURI;

  readonly attribute boolean isConnected;
  readonly attribute Document? ownerDocument;
  Node getRootNode(optional GetRootNodeOptions options = {});
  readonly attribute Node? parentNode;
  readonly attribute Element? parentElement;
  boolean hasChildNodes();
  [SameObject] readonly attribute NodeList childNodes;
  readonly attribute Node? firstChild;
  readonly attribute Node? lastChild;
  readonly attribute Node? previousSibling;
  readonly attribute Node? nextSibling;

  [CEReactions] attribute DOMString? nodeValue;
  [CEReactions] attribute DOMString? textContent;
  [CEReactions] undefined normalize();

  [CEReactions, NewObject] Node cloneNode(optional boolean deep = false);
  boolean isEqualNode(Node? otherNode);
  boolean isSameNode(Node? otherNode); // legacy alias of ===

  const unsigned short DOCUMENT_POSITION_DISCONNECTED = 0x01;
  const unsigned short DOCUMENT_POSITION_PRECEDING = 0x02;
  const unsigned short DOCUMENT_POSITION_FOLLOWING = 0x04;
  const unsigned short DOCUMENT_POSITION_CONTAINS = 0x08;
  const unsigned short DOCUMENT_POSITION_CONTAINED_BY = 0x10;
  const unsigned short DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;
  unsigned short compareDocumentPosition(Node other);
  boolean contains(Node? other);

  DOMString? lookupPrefix(DOMString? namespace);
  DOMString? lookupNamespaceURI(DOMString? prefix);
  boolean isDefaultNamespace(DOMString? namespace);

  [CEReactions] Node insertBefore(Node node, Node? child);
  [CEReactions] Node appendChild(Node node);
  [CEReactions] Node replaceChild(Node node, Node child);
  [CEReactions] Node removeChild(Node child);
}
dictionary GetRootNodeOptions {
  boolean composed = false;
};
```

- `[Exposed=Window]` 表示接口的实例只能在主线程中使用，不能在worker中使用
- `: EventTarget` 表示接口继承实现EventTarget的属性和方法（其中包括注册和移除时间处理程序的方法等）
- `USVString` 代表所有可用`unicode`**标量序列**的集合，关于DOMString，USVString，CSSDOMString以及BinaryString可以查看[9. JavaScript中的字符串（String）](../../JavaScript%E5%B0%8F%E8%AE%A1/9%20JavaScript%E4%B8%AD%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%88String%EF%BC%89.md)
- `Document?` `Node?` 等其中的问好表示返回值的类型可能不是Document或Node（可能节点没有对应属性值而是null）
- `[SameObject]` 该扩展属性在修饰只读属性时，表示在获取给定对象上的属性值时，必须总是返回相同的值
- 用`[CEReactions]` 修饰的扩展属性必须没有参数，不能出现在操作、属性（attribute）、setter，或deleter之外的地方。此外它不能出现在只读属性上，该属性确保**自定义元素反应**（**custom element reactions**）能被恰当触发，表明相关的算法需要补充额外的步骤，以便适当地跟踪和调用自定义元素反应
- `[NewObject]` 出现在常规或静态操作上，它表明在调用该操作时，必须始终返回对新创建对象的引用
- `dictionary` 是一个定义（匹配字典），用于定义固有的，有序的条目的有序MAP数据类型，其中键是字符串，值是定义中指定的特定类型

## 1.1.2 nodeName和nodeValue

- nodeName和nodeValue保存着有关节点的信息，这两个属性的值完全取决于节点类型（nodeType）
- 在使用着两个属性前，最好先检测节点类型，对元素节点而言，nodeName的值始终等于元素的标签名，而nodeValue始终为null；下表是nodeName和nodeValue对于不同的节点类型而言的值
    
    
    | nodeType | nodeName | nodeValue |
    | --- | --- | --- |
    | ATTRIBUTE_NODE,属性节点，如input元素节点的placeholder节点 | 对应的属性节点的限定名（qualified name），如placeholder节点就是“placeholder” | 对应属性节点的值，如placeholder节点就是对应input节点的placeholder属性（attribute）值 |
    | ELEMENT_NODE,元素节点 | 元素的标签名 | null |
    | TEXT_NODE，文本节点 | “#text” | 文本节点的文本值 |
    | CDATA_SECTION_NODE，CDATA片段，例如<!CDATA[[ … ]]>，它可以直接包含未经转义的文本，CDATA 片段不应该在 HTML 中被使用；它只在 XML 中有效 | “#cdata-section” | null |
    | PROCESSING_INSTRUCTION_NODE,XML文档的处理指令，如<?xml version="1.0"?> | ProcessingInstruction 接口定义了一个target字符串，ProcessingInstruction 类型节点返回关联的target字符串 | ProcessingInstruction 继承自CharacterData ，返回其上定义的data |
    | COMMENT_NODE,注释节点 | “#comment” | 对应的注释文本字符串 |
    | DOCUMENT_NODE,文档节点，即document对象 | “#document” | null |
    | DOCUMENT_TYPE_NODE，文档类型节点，例如<!DOCTYPE html>，document.childNodes[0] 可能是文档类型节点 | 对应的文档类型，如<!DOCTYPE html>对应的文档类型节点的节点名称就是“html” | null |
    | DOCUMENT_FRAGMENT_NODE，一个文档片段节点，它不是真实 DOM 树的一部分，可以使用DocumentFragment 创建一个文档片段节点 | ”#document-fragment“ | null |
    | 其他 | ？ | null |

## 1.1.3 节点关系（Node **Relationships**）

- 文档中所有的节点都与其他节点有关系，这些关系可以形容成家族关系，相当于把文档树比作**家谱**（**family tree**）
- 在HTML中
    - <body>元素是<html>元素的子元素，<html>元素是<body>元素的父元素
    - <head>元素是<body>元素的**同胞**元素(**sibling**)，因为它们有共同的父元素<html>
- 每个节点都有一个`childNodes`属性，其中包含一个NodeList的实例
    - NodeList是一个**类数组对象，**用于存储可以按位置存取的有序节点
    - 注意NodeList并不是Array的实例（不能使用map，reduce等数组实例方法），但可以使用中括号访问它的值，而且它也有length属性
    - NodeList对象的独特之处在于，它其实是一个对DOM结构的查询（**queries being**），因此DOM结构的变化会**自动地在NodeList中反映出来，**所以说NodeList是实时的活动对象，而不是第一次访问时所获得的内容的快照
    
    ```jsx
    <button>增加li元素</button>
    <ul></ul>
    <p>ul的ChildNodes: <pre></pre></p>
    
    const btn = document.querySelector("button");
    const ul = document.querySelector("ul");
    const k = ul.childNodes;
    btn.addEventListener("click", () => {
      const li = document.createElement("li");
      li.textContent = ul.childNodes.length;
      ul.appendChild(li);
      pre.textContent = [...k]
    });
    const pre = document.querySelector("pre");
    pre.textContent = [...k]
    ```
    
    ![childNodes.gif](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/childNodes.gif)
    
    - 可以通过中括号的方法访问NodeList中的元素，就像`childNodes[0]` 这样
    - 也可以使用item()方法，如`childNodes.item(1)` ，但是多数开发者都倾向使用中括号，因为它是一个类数组对象
    - 使用`Array.prototype.slice()` 或者`Array.from()` 可以将NodeList对象转化成数组
- 每个节点都有一个`parentNode`属性，指向其DOM树中的父元素
    - `childNodes` 属性中的每个节点都有相同的父元素，因此它们的`parentNode` 属性都指向同一个节点
    - 此外`childNodes` 列表中的每个节点都是同一列表中的其他节点的同胞节点
    - 使用`previousSibling`和`nextSibling` 可以在这个列表的节点间导航
    - 这个列表的第一个节点的`previousSibling` 属性是null，最后一个节点的`nextSibling` 属性也是`null`
    - 如下是使用上面的例子，每次点击后遍历`childNodes` 获取每个节点的`previousSibling`和`nextSibling` 属性，可以发现`childNodes`列表中的节点都是相邻的同胞节点
        
        ```jsx
        var alertInfo = () => {
          let str = "";
          for (const item of k) {
            str += `当前节点${item.textContent}:上一个节点(previousSibling)为${
              item.previousSibling && item.previousSibling.textContent
            },下一个节点(nextSibling)为${
              item.nextSibling && item.nextSibling.textContent
            }\n`;
          }
          alert(str);
        };
        btn.addEventListener("click", () => {
          const li = document.createElement("li");
          li.textContent = ul.childNodes.length;
          ul.appendChild(li);
          pre.textContent = [...k];
          alertInfo()
        });
        ```
        
        ![previousSiblingAndNextSibling.png](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/previousSiblingAndNextSibling.png)
        
        - 注意如果`childNodes`中只有一个节点，则它的`previousSibling`和`nextSibling` 属性都是`null`
- 父节点和它的第一个即最后一个子节点也有专门的属性：`firstChild` 和`lastChild` 分别指向childNodes中的第一个和最后一个节点，即`someNode.childNodes[0] === someNode.firstChild` 始终成立，并且`someNode.childNodes[someNode.childNodes.length - 1] === someNode.lastChild` 始终成立，如果没有子节点，那么`firstChild`和`lastChild` 都是`null`
    
    ```jsx
    document.childNodes[0] === document.firstChild; // true
    document.childNodes[document.childNodes.length - 1] === document.lastChild; // true
    ```
    
    - 上述节点之前的关系如图所示
    
    ![节点关系.png](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/%25E8%258A%2582%25E7%2582%25B9%25E5%2585%25B3%25E7%25B3%25BB.png)
    
- 利用这些关系，`childNodes` 属性的作用远远不止是必备属性那么简单了
    - 利用这些关系指针，机会可以访问到文档树的任何节点，而这种便利性就是`childNodes` 的最大亮点
    - 还有一个便利的方法是`hasChildNodes()` ，这个方法返回一个布尔值，说明节点当前是否有一个或多个子节点，相比于查询`childNodes.length` ，这个方法直接调用更方便
- 最后还有一个所有节点都**共享的关系，**`ownerDocument`  属性是一个指向代表整个文档的文档节点的指针
    - 所有节点都被创建它们（或自己所在）的文档所拥有
    - 因为一个节点不可能同时存在于两个或多个文档中，这个属性为迅速访问文档节点提供了便利，因为无需在文档结构逐层上溯了
        
        ```jsx
        someNode.ownerDocument === document; // true
        ```
        
    - 需要注意的是，`document.ownerDocument` 的值是`null` ，而不是`document`

<aside>
💡 注意，虽然所有节点类型都继承了Node，但并非所有节点都有子节点

</aside>

## 1.1.4 操作节点（**Manipulating Node**）

### 1.1.4.1 appendChild()

- 因为所有的节点关系都是只读的，所以DOM提供了一些操作节点的方法，最常用的就是`appendChild()`
- `appendChild()` 用于在节点的`childNodes` 列表末尾添加节点，添加的新节点会更新相关的关系指针，包括父节点和之前的最后一个子节点，`appendChild()` 方法返回新添加的节点
    
    ```jsx
    <body>
      <input type="text" /><button>添加段落</button>
    </body>
    
    const btn = document.querySelector("button");
    const input = document.querySelector("input");
    btn.addEventListener("click", () => {
      if (input.value) {
        const p = document.createElement("p");
        p.textContent = input.value;
        input.value = "";
        **const k = document.body.appendChild(p);
        console.log(k === p); // true
    		console.log(k === document.body.lastChild); // true**
      } else {
        alert("请输入文本");
      }
    });
    ```
    
    ![appendChild.gif](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/appendChild.gif)
    

### 1.1.4.2 insertBefore()

- 如果想把节点放到`childNodes`中的**特定位置**而不是末尾，可以使用`insertBefore()` 方法，这个方法接收两个参数，要插入的节点和参考节点，调用这个方法后，要插入的节点会变成参考节点的**前一个同胞节点，并被返回**，如果参考节点是`null`，则`insertBefore()` 和`appendChild()` 效果相同
    
    ```jsx
    <style>
      p.active {
        border: 1px solid salmon;
        background-color: rgb(243, 234, 222);
      }
    </style>
    <input type="text" /><button>添加段落</button>
    <div></div>
    
    let pre = null;
    const div = document.querySelector("div");
    const btn = document.querySelector("button");
    const input = document.querySelector("input");
    btn.addEventListener("click", () => {
      if (input.value) {
        const p = document.createElement("p");
        p.textContent = input.value;
        input.value = "";
        const k = div.insertBefore(p, pre);
        **console.log(k === p); // true
        console.log(k === div.lastChild); // 如果pre是null就是true**
      } else {
        alert("请输入文本");
      }
    });
    
    div.addEventListener("click", (e) => {
      if (pre) {
        pre.removeAttribute("class");
      }
      pre = e.target;
      pre.setAttribute("class", "active");
    });
    ```
    
    ![insertBefore.gif](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/insertBefore.gif)
    

### 1.1.4.3 replaceChild()

- `appendChild()`和`insertBefore()` 在插入节点时不会删除任何已有的节点，相对的`replaceChild()` 接收两个参数：要插入的节点和要替换的节点，要替换的节点会被返回并从文档树中完全移除，要插入的节点取而代之
- 使用`replaceChild()` 替换一个节点后，所有关系指针都会从被替换的节点复制过来，虽然被替换的节点从技术上说仍然被同一个文档所拥有，但**文档中已经没有它的位置**了
- 参数传递有误可能抛出的异常
    - `HierarchyRequestError` （DOMException）
        - `oldChild` 的父节点不是一个元素节点，文档节点或文档片段节点
        - `newChild` 是`oldChild` 的祖先，会导致节点死循环
        - `newChild` 不是一个文档片段节点，文档类型节点，元素节点，CharacterData节点
        - 调用`replaceChild()` 的节点是一个文本节点，且其父节点是`Document`
        - 调用`replaceChild()` 的节点是一个文档类型节点，且其父节点不是`Document` （doctype应该是document的直系后代）
        - 父节点是`Document` ，`newChild` 是一个文档片段节点且有超过一个的子元素节点或有文本节点
        - 替换后导致`Document` 拥有超过一个的元素节点作为子结点
        - 替换后导致一个元素节点在文本类型节点的前面
    - `NotFoundError` (DOMException)
        - `oldChild` 不是调用节点的子节点
    
    ```jsx
    <input type="text" /><button class="btn1">替换段落</button
    ><button class="btn2">替换第一个节点</button
    ><button class="btn3">替换最后一个节点</button>
    <div>
      <p>第一个段落</p>
      <p>第二个段落</p>
      <p>第三个段落</p>
      <p>第四个段落</p>
      <p>第五个段落</p>
      <p>第六个段落</p>
    </div>
    
    let pre = null;
    const div = document.querySelector("div");
    const btn1 = document.querySelector(".btn1");
    const input = document.querySelector("input");
    btn1.addEventListener("click", () => {
      if (input.value && pre) {
        const p = document.createElement("p");
        p.textContent = input.value;
        input.value = "";
        const k = div.replaceChild(p, pre);
        console.log(k === pre);
        // 替换选择节点
        replaceActiveNode(p);
      } else {
        alert("请输入文本并选择要替换的节点");
      }
    });
    const btn2 = document.querySelector(".btn2");
    btn2.addEventListener("click", () => {
      if (input.value) {
        const p = document.createElement("p");
        p.textContent = input.value;
        input.value = "";
        const k = div.replaceChild(p, div.children[0]);
        console.log(k);
        // 替换选择节点
        replaceActiveNode(p);
      } else {
        alert("请输入文本");
      }
    });
    
    const btn3 = document.querySelector(".btn3");
    btn3.addEventListener("click", () => {
      if (input.value) {
        const p = document.createElement("p");
        p.textContent = input.value;
        input.value = "";
        const k = div.replaceChild(p, div.children[div.children.length - 1]);
        console.log(k);
        // 替换选择节点
        replaceActiveNode(p);
      } else {
        alert("请输入文本");
      }
    });
    
    function replaceActiveNode(node) {
      if (pre) {
        pre.removeAttribute("class");
      }
      pre = node;
      pre.setAttribute("class", "active");
    }
    
    div.addEventListener("click", (e) => {
      replaceActiveNode(e.target);
    });
    ```
    
    ![replaceChild.gif](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/replaceChild.gif)
    

### 1.1.4.4 removeChild()

- 要移除节点可以使用`removeChild()` ，这个方法接收一个参数，即要移除的节点，被移除的节点会被返回
- 注意调用`removeChild()` 的节点是**要被移除节点的父节点**才能成功移除需要被移除的子结点
- 如果要移除节点本身，可以利用`parentNode` 属性获取父节点后移除节点本身，如下
    
    ```jsx
    let removedNode = someNode.parentNode.removeChild(someNode);
    console.log(removedNode ==== someNode); // true
    ```
    
- 可以利用`firstChild` 和`lastChild` 属性移除当前节点的第一个子节点和最后一个子节点
    
    ```jsx
    let formerFirstChild = someNode.removeChild(someNode.firstNode);
    let formerLastChild = someNode.removeChild(someNode.lastNode);
    ```
    
- 和`replaceChild()` 方法一样，通过`removeChild()` 被移除的节点从技术上说仍然被同一个文档所拥有，但文档中已经没有它的位置了
- 并非所有的节点类型都有子节点，如果在不支持子节点的节点上调用这些方法，则会抛出错误

## 1.1.5 其它方法

### 1.1.5.1 cloneNode()

- 所有节点类型还共享两个方法，第一个是`cloneNode()` ，会返回调用它的节点**一模一样**的节点
    - `cloneNode()` 方法接收一个布尔值参数，表示是否**深复制**
    - 在传入`true` 参数时，会进行深复制，即复制节点及其整个子DOM树
    - 如果传入`fasle` ，则只会复制调用改方法的节点，复制返回的节点属于文档所有，但尚未指定父节点，所以可以称为**孤儿节点**（**orphan**）
    - 可以通过appendChild()、insertBefore()或replaceChild()方法把孤儿节点添加到文档中

```jsx
<ul>
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ul>

const myList = document.querySelector("ul");
let deepList = myList.cloneNode(true);
alert(deepList.childNodes.length); // 7
let shallowList = myList.cloneNode(false);
alert(shallowList.childNodes.length); // 0
```

- `myList` 有三个列表项，每个列表项又各自包含文本
- 变量`shallowList` 保存着`myList` 的浅副本，因此没有子节点
- `deepList.childNodes.length` 的值会因IE8及更低版本和其它浏览器对空格的处理方式而不同，现代浏览器都会**为空格创建文本节点**，三个<li>元素节点和父节点以及节点之间有4个空白的地方，所以会创建4个文本节点，共7个子节点

<aside>
💡 注意：cloneNode()方法不会复制添加到DOM节点的JavaScript属性，比如时间处理程序。整个方法**只复制HTML属性**，以及可选地复制子节点。除此之外则一概不会复制，IE在很长一段时间内会复制事件处理程序，这是一个bug，所以推荐在复制之前先删除事件处理程序

</aside>

### 1.1.5.2 normalize()

- `normalize()` 方法唯一的任务就是**处理文档子树中的文本节点**
    - 由于解析器实现的差异或DOM操作等原因，可能会出现并**不包含文本的文本节点**，或者文本节点之间互为同胞关系
    - 在节点上调用`normalize()` 方法会检测这个节点的所有后代，从中搜索上述两种情形
    - 如果发现空文本节点，则将其删除，如果两个同胞节点是相邻的，则将其合成一个文本节点
- 同样是上面的`myList` ，通过`insertBefore()` 或`appendChild()` 为`myList` 增加子文本节点，可以造成两个文本节点互为同胞关系的情况，如下
    
    ```jsx
    <ul>
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
    </ul>
    <button class="btn1">在ul后增加文本</button>
    <button class="btn2">ul调用normalize</button>
    <h2>ul的子节点列表</h2>
    <pre></pre>
    
    const myList = document.querySelector("ul");
    const btn1 = document.querySelector(".btn1");
    const btn2 = document.querySelector(".btn2");
    const p = document.querySelector("pre");
    btn1.addEventListener("click", () => {
      myList.appendChild(document.createTextNode("文本节点"));
      updateP();
    });
    btn2.addEventListener("click", () => {
      myList.normalize();
      updateP();
    });
    updateP();
    function updateP() {
      let str = "";
      myList.childNodes.forEach((v) => {
        str += v.nodeName + "\n";
      });
      p.textContent = str;
    }
    ```
    
    ![normalize.gif](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/normalize.gif)
    
    - 可以看到调用`normalize()` 后，在最后新增的文本节点都合并成了一个文本节点

# 1.2 Document类型

[Document类型](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/Document%E7%B1%BB%E5%9E%8B.md)

# 1.3 Element类型

[Element类型](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/Element%E7%B1%BB%E5%9E%8B.md)

# 1.4 Text类型

- Text节点由Text类型表示，包含按字面解释的纯文本，也可能包含转义后的HTML字符，但不包含HTML代码，Text类型的节点具有如下特征
    - [ ]  nodeType等于`node.TEXT_NODE` (3)
    - [ ]  nodeName值为”#text”
    - [ ]  nodeValue值为节点中包含的文本
    - [ ]  parentNode的值为`Element`对象
    - [ ]  **不支持子节点**

## 1.4.1 Text接口规范

- DOM Standard规范中定义了 [Text](https://dom.spec.whatwg.org/#text) 接口，它继承于`[CharacterData`](https://dom.spec.whatwg.org/#characterdata) 接口，`CharacterData` 接口又继承于`Node`
    
    ```jsx
    [Exposed=Window]
    interface Text : CharacterData {
      constructor(optional DOMString data = "");
    
      [NewObject] Text splitText(unsigned long offset);
      readonly attribute DOMString wholeText;
    };
    ```
    
    - 这里定义的`splitText()` 方法用于拆分文本节点
- `CharacterData` 接口如下
    
    ```jsx
    [Exposed=Window]
    interface CharacterData : Node {
      attribute [LegacyNullToEmptyString] DOMString data;
      readonly attribute unsigned long length;
      DOMString substringData(unsigned long offset, unsigned long count);
      undefined appendData(DOMString data);
      undefined insertData(unsigned long offset, DOMString data);
      undefined deleteData(unsigned long offset, unsigned long count);
      undefined replaceData(unsigned long offset, unsigned long count, DOMString data);
    };
    ```
    
    - `appendData()` 、`insertData()` 、`replaceData()` 等方法是文本节点的重要方法
    - 除了Text节点外，ProcessingInstruction、Comment节点的实现接口也继承自`CharacterData` 接口

- `Text`节点中的包含的文本可以通过`nodeValue` 属性访问，也可以通过`data`属性访问，这两个属性包含相同的值，修改`nodeValue` 或`data` 的值会在另一个属性中反映出来，文本节点暴露的操作文本的方法：
    - [ ]  appendData(*text*)，向节点末尾添加文本*text*
    - [ ]  deleteData(*offset, count*)，从位置*offset*开始删除*count*个字符
    - [ ]  insertData(*offset, text*)，从位置*offset*插入*text*
    - [ ]  replaceData(*offset, count, text*)，用*text*替换从位置*offset*到*offset*+*count*的文本
    - [ ]  splitText(*offset*)，在位置*offset*将当前文本节点拆分为两个文本节点
    - [ ]  substringData(*offset, count*)，提取从位置*offset*到*offset+count*的文本
    
    除了这些方法外，还可以通过`length`属性获取文本节点中包含的字符数量，这个值等于`nodeValue.length`和`data.length`
    
- **默认情况**下，包含文本内容的每个元素最多只有一个文本节点，如下
    
    ```jsx
    <body>
    <!-- 没有内容，因此没有文本节点 -->
    <div></div>
    
    <!-- 有空格，因此有一个文本节点 -->
    <div> </div>
    
    <!-- 有内容，因此有一个文本节点 -->
    <div>Hello World!</div>
    <script>
      console.log(document.body.children[0].childNodes);
      console.log(document.body.children[1].childNodes);
      console.log(document.body.children[2].childNodes);
    </script>
    </body>
    ```
    
    ![TextNode.png](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/TextNode.png)
    
- 取得文本节点的引用后，可以通过`nodeValue` 和`data` 属性进行修改，修改文本节点时有一点需要注意，就是HTML或XML代码（取决于文档类型）会被转换成实体编码，即小于号、大于号或引号会被转义，如下
    
    ```jsx
    document.body.children[1].childNodes[0] =
          "Some <strong>other<strong> message";
    // 实际在HTML中输出为"Some &lt;strong&gt;other&lt;/strong&gt; message"
    ```
    
    - 这是将HTML字符串插入DOM文档进行编码的有效方式

## 1.4.2 创建文本节点

- `Document` 接口定义的`createTextNode()` 方法可以用于创建文本节点，它接收一个参数，即要插入节点的文本
    - 跟设置已有文本节点的值一样，这些要插入文本也会应用HTML和XML编码
    - 再创建新文本节点后，其`ownerDocument` 属性也会被设置为`document`
    - 再把这个节点添加到文档树之前，不会在浏览器中看到它
    - 一般而言，利用`appendChild()` 可以给元素节点增加子节点，这个子节点可以是文本节点
    - 一个元素只包含一个文本节点，不过也可以让元素包含多个文本子节点
    - 再将一个文本节点作为另一个文本节点的同胞插入后，两个文本节点的文本之间不会包含空格
    - 使用Node接口定义的`normalize()` 可以将两个或多个相邻的文本节点合并成一个文本节点
    
    ```jsx
    <p></p>
    
    const p = document.querySelector("p");
    const textNode = document.createTextNode("一个文本节点");
    p.appendChild(textNode);
    const anotherTextNode = document.createTextNode("另一个文本节点");
    p.appendChild(anotherTextNode);
    console.log(p.childNodes.length); // 2
    p.normalize();
    console.log(p.childNodes.length); // 1
    ```
    

## 1.4.3 规范化文本节点（**Normalizing Text Nodes**）

- DOM中的同胞文本节点会导致困惑，因为一个文本节点足以表示一个文本字符串
    - DOM文档中经常出现两个相邻文本节点
    - 有一个方法可以合并相邻的文本节点，这个方法就是Node接口定义的`normalize()`
    - 在包含两个或多个相邻文本节点的父节点上调用`normalize()` ，所以同胞文本节点会合并为一个文本节点，这个文本节点的`nodeValue` 等于之前所有同胞节点`nodeValue` 拼接到一起的字符串
- 浏览器在解析文档时，拥有不会创建同胞文本节点，同胞文本节点只会出现在DOM脚本生成的文本树中

## 1.4.4 拆分文本节点（**Splitting Text Nodes**）

- `Text` 接口定义了一个于`normalize()` 相反的方法——`splitText()`
    - 这个方法可以在指定的偏移位置拆分`nodeValue` ，将一个文本节点拆分为两个文本节点
    - 拆分之后，原来的文本节点包含开头到偏移位置前的文本，新文本节点包含剩下的文本
    - 这个方法返回新的文本节点，具有与原来文本节点相同的`parentNode`
    
    ```jsx
    <p>Hello, world</p>
    <script>
      let ele = document.querySelector("p");
      let textNode = ele.firstChild;
      let newNode = textNode.splitText(5);
      console.log(newNode === ele.lastChild); // true
      console.log(textNode === ele.firstChild); // true
      console.log(ele.childNodes.length); // 2
    </script>
    ```
    
- 拆分文本节点最常用于**从文本节点中提取数据的DOM解析技术**

# 1.5 Comment类型

- DOM中的注释通过Comment类型表示，Comment类型的节点有如下特征
    - [ ]  nodeType等于`node.COMMENT_NODE` （8）
    - [ ]  nodeName等于”#comment”
    - [ ]  nodeValue值为注释的内容
    - [ ]  parentNode值为Document或Element对象
    - [ ]  不支持子节点
- Comment类型于Text类型继承同一个基类（[CharacterData](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89.md)），因此除了`splitText()` 外拥有`CharacterData` 定义的所有方法，
    - [ ]  appendData(*text*)，向注释节点末尾添加文本*text*
    - [ ]  deleteData(*offset, count*)，从位置*offset*开始删除*count*个字符
    - [ ]  insertData(*offset, text*)，从位置*offset*插入*text*
    - [ ]  replaceData(*offset, count, text*)，用*text*替换从位置*offset*到*offset*+*count*的文本
    - [ ]  substringData(*offset, count*)，提取从位置*offset*到*offset+count*的文本
    
    除了这些方法外，还可以通过`length`属性获取注释节点中包含的字符数量，这个值等于`nodeValue.length`和`data.length`
    
- DOM Standard规范中定义的Comment接口如下
    
    ```jsx
    [Exposed=Window]
    interface Comment : CharacterData {
      constructor(optional DOMString data = "");
    };
    ```
    
- 需要注意的是，注释节点的`nodeValue` 或`data` 值是从`<!--` 开始到`-->` 结束中间的字符串，上面`CharacterData` 接口定义的所有操作也是对注释其中的内容进行操作的
    
    ```jsx
    <p>
      <!-- 注释节点 -->
    </p>
    
    const p = document.querySelector("p");
    console.log(p.childNodes);
    p.childNodes[1].data = "Hello, world";
    let newComment = new Comment("新注释1");
    let newComment2 = document.createComment("新注释2");
    p.appendChild(newComment);
    p.appendChild(newComment2);
    ```
    
    ![注释.png](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/%25E6%25B3%25A8%25E9%2587%258A.png)
    
    - 可以通过Document接口定义的`createComment()` 方法创建注释节点，也可以直接通过`Comment` 注释构造函数创建
    - 注释节点很少通过JavaScript创建和访问，因为注释几乎不涉及算法逻辑

<aside>
💡 注意：浏览器不承认结束的</html>标签之后的注释，如果要访问注释节点，则必须**确定它们是<html>元素的后代**

</aside>

# 1.6 CDATASection类型

- CDATASection类型表示XML中特有的CDATA区块，CDATASection类型继承Text类型，因此拥有包括`splitText()` 在内的所有字符串操作方法，DOM Standard规范的[CDATASection](https://dom.spec.whatwg.org/#interface-cdatasection) 接口如下
    
    ```jsx
    [Exposed=Window]
    interface CDATASection : Text {
    };
    ```
    
- CDATASection类型的节点具有如下特征
    - [ ]  nodeType等于`node.CDATA_SECTION_NODE` （4）
    - [ ]  nodeName值为“#cdata-section”
    - [ ]  nodeValue值为CDATA区块的内容
    - [ ]  parentNode值为Document或Element对象
    - [ ]  不支持子节点
- CDATA区块只在XML文档中有效，因此某些浏览器比较陈旧的版本会错误地将CDATA区块解析为Comment或Element
    
    ```jsx
    <div><![CDATA[This is some content.]]></div>
    
    const div = document.querySelector("div");
    console.log(div.childNodes[0].nodeType); // 8
    console.log(div.childNodes[0]); // <!-- [CDATA[This is some content.]] -->
    ```
    
    - 谷歌和获取都将<![CDATA[This is some content.]]>识别成了Comment类型节点
- 在真正地XML文档中，可以使用`document.createCDataSection()` 并传入节点内容来创建CDATA区块

# 1.7 DocumentType类型

- DocumentType类型的节点包含文档的文档类型（doctype）信息，它直接继承于`Node` 接口，在DOM Standard规范中[DocumentType](https://dom.spec.whatwg.org/#interface-documenttype)接口定义如下
    
    ```jsx
    [Exposed=Window]
    interface DocumentType : Node {
      readonly attribute DOMString name;
      readonly attribute DOMString publicId;
      readonly attribute DOMString systemId;
    };
    ```
    
- DocumentType类型节点具有如下特征
    - [ ]  nodeType等于`node.DOCUMENT_TYPE_NODE` （10）
    - [ ]  nodeName值为文档类型的名称，如<!DOCTYPE html>的文档类型名称就是`html`
    - [ ]  nodeValue值为null
    - [ ]  parentNode值为Document对象
    - [ ]  不支持子节点
- DocumentType对象在DOM Level 1 中不支持动态创建，只能在解析文档代码时创建
    - 对于支持这个类型的浏览器，DocumentType对象保存在`document.doctype`属性中
    - DOM Level 1 规定了DocumentType对象的三个属性：`name`、`entrities`、`notations`
    - 其中只有`name` 是有用的，它等于`nodeName` ，`entrities`和`notations`都被**舍弃**了
    - 根据最新的DOM文档接口定义，DocumentType对象还有`publicId`和`systemId` 两个属性，但是值为空字符串且是只读的

# 1.8 DocumentFragment类型

- DocumentFragment类型是唯一一个在标记中没有对应表示的类型，DOM将文档片段定义为“轻量级”文档，**能够包含和操作节点，却没有完整文档那样额外的消耗**，实际上，在JSX中，`React.Fragment` 就是`DocumentFragment` 类型，可以简写成没有标签名称的元素，`<></>`
- 在DOM Standard规范中，[DocumentFragment](https://dom.spec.whatwg.org/#interface-documentfragment) 接口直接继承于`Node` 接口，并且可以作为构造函数使用
    
    ```jsx
    [Exposed=Window]
    interface DocumentFragment : Node {
      constructor();
    };
    ```
    
- DocumentFragment节点具有如下特征
    - [ ]  nodeType等于`Node.DOCUMENT_FRAGMENT_NODE` (11)
    - [ ]  nodeName值为”#document-fragment”
    - [ ]  nodeValue值为null
    - [ ]  parentNode值为null
    - [ ]  子节点可以是Element、ProcessingInstruction、Comment、Text、CDATASection或EntityReference
- 不能直接把文档片段添加到文档，**文档片段的作用是充当其它要被添加到文档的节点的仓库**
- 既可以使用`DocumentFragment` 构造函数创建没有子节点的文档片段对象，也可以使用`Document` 接口定义的`createDocumentFragment()` 方法创建文档片段对象
    - 文档片段从Node类型继承了所有节点类型具备的可以执行DOM操作的方法，可以添加子节点，也可以作为节点被插入到文档树中
    - 与普通的元素节点相同的地方是：如果文档中的一个节点被添加到一个文档片段中，则该节点会从文档树中移除，不会再被浏览器渲染
    - 与普通元素节点不同的地方是：通过`appendChild()` ，`inserBefore()` 等方法将文档片段添加到文档树中，**文档片段本身永远不会被添加到文档树中，它的子节点会被一一添加到对应位置**
- 文档片段在现代Web应用程序开发中很有用处，它常常作为**临时保存**一系列节点的**”根节点“**，但添加到文档树中时不占用节点位置，这对一次性添加多个节点而只渲染一次有很大帮助，如下
    
    ```jsx
    <ul></ul>
    
    const ul = document.querySelector("ul");
    const fragment = new DocumentFragment();
    for (let i = 1; i <= 5; i++) {
      let li = document.createElement("li");
      li.textContent = `item ${i}`;
      fragment.appendChild(li);
    }
    ul.appendChild(fragment);
    console.log(ul.childNodes);
    
    ```
    
    ![fragment.png](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/fragment.png)
    
    - 这里调用五次`ul.appendChild(li)` 的效果和上面是一样的
    - 文档片段的子节点全部转移到ul元素了

# 1.9 Attr类型

- 元素数据在DOM中通过Attr类型表示。Attr类型构造函数和原型在所有浏览器中都可以直接访问。技术上讲，**属性是存在于元素`attributes`属性中的节点，**DOM Standard规范了属性节点 [Attr](https://dom.spec.whatwg.org/#dom-attr-value) 接口继承于Node
    
    ```jsx
    [Exposed=Window]
    interface Attr : Node {
      readonly attribute DOMString? namespaceURI;
      readonly attribute DOMString? prefix;
      readonly attribute DOMString localName;
      readonly attribute DOMString name;
      [CEReactions] attribute DOMString value;
    
      readonly attribute Element? ownerElement;
    
      readonly attribute boolean specified; // useless; always returns true
    };
    ```
    
    - `ownerElement` 表明了属性所在的元素节点
- Attr节点具有以下特征
    - [ ]  nodeType等于`node.ATTRIBUTE_NODE` (2)
    - [ ]  nodeName值为属性名
    - [ ]  nodeValue值为属性值
    - [ ]  parentNode值为`null`
    - [ ]  在HTML中不支持子节点
    - [ ]  在XML中子节点可以是Text或EntityReference
- 属性节点尽管是节点，却不被认为是DOM文档树的一部分。Attr节点很少直接被引用，通常开发者更喜欢使用`getAttribute()` 、`removeAttribute()` 和`setAttribute()` 方法操作属性
- Attr对象两个重要属性是[Attr](https://dom.spec.whatwg.org/#attr) 接口上定义的`name`和`value`，它们分别指属性名（和nodeName一样）和属性值（和nodeValue一样）。《JavaScript高级程序设计（第4版）》还指出了一个`specified` 属性，指出“specified是一个布尔值，表示属性使用的是默认值还是被指定的值”，但是最新的DOM Standard规范指出该属性**已被舍弃**，总是返回`true` ，仅为兼容性而留存
- 新增的`ownerElement` 属性返回属性节点所属的元素节点引用，如果属性不和任何一个元素节点有关系就返回`null`
- 可以使用`document.createAttribute()`方法创建新的Attr节点（可以是自定义属性），参数为属性名称，创建后可以通过`Element` 接口定义的`setAttributeNode` 为元素节点新设置属性
    
    ```jsx
    <p>Hello</p>
    
    const p = document.querySelector("p");
    let attr = document.createAttribute("align");
    attr.value = "center";
    p.setAttributeNode(attr);
    let customAttr = document.createAttribute("data-custom-attr");
    customAttr.value = "hello";
    p.setAttributeNode(customAttr);
    ```
    
    ![attr.png](1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/attr.png)
    
    - 其中`getAttributeNode()` 方法获取对应属性名称的Attr节点

<aside>
💡 注意：将属性作为节点来访问多数情况下并无必要。推荐使用getAttribute()、removeAttribute()和setAttribute()方法操作属性，而不是直接操作属性节点

</aside>