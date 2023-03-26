# 4. 专有扩展（Proprietary Extensions）

- 浏览器厂商都应该遵循标准实现各自的浏览器功能，但是标准并非圭臬，它也有事实上的不足，为了弥补功能缺失，浏览器有为DOM添加**专有扩展的历史**
- 专有扩展表面上是一件坏事（兼容性问题），但专有扩展为开发者提供更多重要功能，且一些好的专有扩展未来会被标准化，例如进入HTML5
- 有些专有扩展已被纳入标准，有些较新的可能没有，《JavaScript高级程序设计（第4版）》会标注部分浏览器专有和已纳入标准的专有扩展（要进行标准查询对照）

# 4.1 children属性

- 在[实际上，DOM Standard规范中的**[ParentNode](https://dom.spec.whatwg.org/#parentnode)** 接口为元素节点、文档节点和文档片段节点都提供了一个`children` 属性，该属性返回一个`HTMLCollection` 对象，它**按顺序包含节点的直接后代元素节点**，节点定义如下](../14%20DOM/1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/Element%E7%B1%BB%E5%9E%8B.md) 中，提到过`ParentNode` 混入接口定义的`children` 属性
- IE9之前的版本和其它浏览器处理空白文本节点上的差异导致了`children` 属性的出现，它是一个`HTMLCollection`，只包含元素的Element类型的子节点
    - 如果元素的子节点全部是元素类型，那么`children` 和`childNodes` 包含的节点应该是一样的

# 4.2 contains()方法

- DOM规范指出，`contains()` 方法定义在`Node` 接口中，需要传入一个目标节点，判断该节点是否是调用方法的节点（调用者）的后代节点，如果目标节点是调用者的后代节点，则返回`true` ，否则返回`false`
    
    ```jsx
    <div class="my-div">
      <span class="my-span">Hello, world</span>
    </div>
    <script>
      const div = document.querySelector("div");
      console.log(div.contains(div.attributes[0])); // false
      console.log(div.contains(div)); // true
      const span = document.querySelector("span");
      console.log(div.contains(span)); // true
      console.log(div.contains(span.attributes[0])); //  false
      console.log(span.contains(span.firstChild)); // true
    </script>
    ```
    
    - 可以看出`contains()` 方法判断的是元素节点和文本节点，属性节点并不能算作后代节点
    - 调用者和参数是相同节点也会返回`true`
- `contains()` 方法示范了一种包含的节点关系，在DOM Level 3引入的一个DOM 规范方法`compareDocumentPosition()` 也可以确定节点间的关系，它定义在`Node` 接口上，需要传入另一个节点，并返回表示两个节点关系的**位掩码**，每个位掩码代表一种节点关系，而每个节点关系作为一个**属性**被定义在了`Node` 接口中，属性值就是对应的位掩码
    
    
    | 掩码（使用16进制表示） | 节点关系 | Node对应的属性 |
    | --- | --- | --- |
    | 0x1 | 断开（传入的节点不在文档中） | https://dom.spec.whatwg.org/#dom-node-document_position_disconnected |
    | 0x2 | 领先（传入的节点在DOM树中位于参考点之前） | https://dom.spec.whatwg.org/#dom-node-document_position_preceding |
    | 0x4 | 随后（传入节点在DOM树中位于参考节点之后） | https://dom.spec.whatwg.org/#dom-node-document_position_following |
    | 0x8 | 包含（传入节点是参考节点的祖先） | https://dom.spec.whatwg.org/#dom-node-document_position_contains |
    | 0x10（十进制的16） | 被包含（传入节点是参考节点的后代） | https://dom.spec.whatwg.org/#dom-node-document_position_contained_by |
    | 0x20（十进制的32） | 结果依赖于特定的浏览器的实现行为，并且不能保证可移植 | https://dom.spec.whatwg.org/#dom-node-document_position_implementation_specific |
    - `compareDocumentPosition()` 方法的结果可以按照位与来确定参考节点与传入节点的关系
    
    ```jsx
    <body>
        <div class="my-div">
          <span class="my-span">Hello, world</span>
        </div>
        <ul></ul>
        <script>
          const div = document.querySelector("div");
          console.log(div.compareDocumentPosition(document.body)); // 10
          console.log(div.compareDocumentPosition(document.head)); // 2
          console.log(div.compareDocumentPosition(div.attributes[0])); // 20
          console.log(div.compareDocumentPosition(div)); // 0
          const span = document.querySelector("span");
          console.log(div.compareDocumentPosition(span)); // 20
          console.log(div.compareDocumentPosition(span.attributes[0])); // 20
          console.log(span.compareDocumentPosition(span.firstChild)); // 20
          const ul = document.querySelector("ul");
          const li = document.createElement("li");
          console.log(div.compareDocumentPosition(ul)); // 4
          console.log(div.compareDocumentPosition(li)); // 37
        </script>
      </body>
    ```
    
    - 从打印可以看出，参考节点如果包含传入节点，那么一定存在一个随后关系（传入节点在参考节点之后），值一般为20（0x10 + 0x4）
    - 参考节点如果被传入节点包含，那么一定存在一个领先关系（传入节点在参考节点之前），值一般为10（0x8 + 0x2）
    - 对于属性节点而言，可以向将其转化为所在节点的位置，再进行判断，但需要注意属性节点不能包含其它节点，可以被包含
    - 如果参考节点和传入节点是同一个节点，直接返回0
    - 对于两个根节点不相同的节点，如上面的最后一行JavaScript代码，掩码应该包含`[DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC](https://dom.spec.whatwg.org/#dom-node-document_position_implementation_specific)` ，同时传入节点不在文档中，所以包括关系`[DOCUMENT_POSITION_DISCONNECTED](https://dom.spec.whatwg.org/#dom-node-document_position_disconnected)` （断开），最后浏览器会判断这个断开节点是在参考节点之后的，有节点关系`[DOCUMENT_POSITION_FOLLOWING](https://dom.spec.whatwg.org/#dom-node-document_position_following)`
- IE9及之后版本和现代浏览器都支持`contains()` 和`compareDocumentPosition()`

# 4.3 插入标记（**Markup** Insertion）

- HTML5将IE发明的`innerHTML`和`outerHTML`纳入标准（在[DOM-Parsing](https://w3c.github.io/DOM-Parsing) 规范中有详细定义，它们都直接或间接定义在`Element` 接口上）
- 但是还有两个属性~~没有入选~~，剩下的两个属性是`innerText`和`outerText` （在[HTML规范](https://html.spec.whatwg.org/#dom-innertext)中，二者已被标准化为`HTMLElement` 接口上的属性）

## 4.3.1 innerText

- `innerText`属性 对于元素中包含的所有文本内容，无论文本在子树中的哪个层级
    - 在用于读取值时，`innerText` 会按照深度优先的顺序将~~子树中所有文本节点的值拼接起来~~(对`textContent` 来说更准确，而`innerText` 更关心最终的渲染文本内容)
    - 在用于写入值时，`innerText` 会移除所有后代并插入一个包含该节点的文本节点
    
    ```jsx
    <body>
      <div id="content">
        <p>This is a <strong>paragraph</strong> with a list following it.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
      <script>
        const content = document.querySelector("#content");
        console.log(content.innerText);
        let innerTexts = [];
        const dfs = (element) => {
          for (const child of element.childNodes) {
            // 子节点
            if (child.nodeType === Node.ELEMENT_NODE) {
              dfs(child);
            }
            // 文本节点
            innerTexts.push(child.nodeValue);
          }
        };
        dfs(content);
        console.log(innerTexts.join(""));
        content.innerText = "Hello, world!";
      </script>
    </body>
    ```
    
    ![innerText.png](4%20%E4%B8%93%E6%9C%89%E6%89%A9%E5%B1%95%EF%BC%88Proprietary%20Extensions%EF%BC%89/innerText.png)
    
    - 可以看出，不同浏览器对待空格的方式不同，因此格式化之后的字符串可能包含也可能不包含元素HTML代码中的**缩进**
    - 直接给`innerText` 赋值后，元素节点包含的所有后代节点都会被移除，完全改变了DOM子树，仅留有设置的一个文本节点
- 设置`innerText` 也会在编码出现在字符串中的HTML语法字符（大小号，引号，和与符号），即对HTML特殊语法字符进行**转义**
    
    ```jsx
    content.innerText = "Hello & welcome, <b>\"reader\"!</b>"
    
    => 
    "Hello &amp; welcome, &lt;b&gt;&quot;reader&quot;!&lt;/b&gt;"
    ```
    
    - 在浏览器显示中自然还是源文本，因为浏览器会对转义后的字符进行解析
- `innerText` 一个很有用的地方是，它保证字符串一定构成一个文本节点，所以会对HTML编码格式的字符串进行转义，这样就能使用它去除HTML标签，通过将`innerText` 设置为`innerText` 就能去除所有标签而只剩下文本，如下
    
    ```jsx
    conten.innerText = content.innerText
    ```
    

<aside>
💡 注意：火狐浏览器45（2016.03）以前的版本中只支持textContent属性，与innerHTML的区别是返回的文本中中也会返回行内样式或脚本代码。innerHTML目前已经得到所有浏览器的支持，应该作为取得和设置文本内容的首选方案使用

</aside>

---

- 补充，关于`textContent`与`innerHTML` 的区别（谷歌浏览器测试）：
    - `innerHTML` 定义在`HTMLElement` 接口上，**只有**元素节点能使用，而`textContent` 定义在`Node`接口上，所有节点都能使用
    - `innerHTML` **会意识到文本最终的渲染呈现（最主要的区别）**，会以此为准返回文本，而`textContent` 就和上面的`dfs()` 类似，不在意文本的最终渲染呈现，直接拼接返回所有后代节点中的文本节点值
    - 因为`innerHTML` 只能被元素节点使用，所以它也仅关心元素节点在浏览器中的渲染，而`textContent` 还可以属性节点，文本节点，不同节点使用时的含义可能有区别，对于属性节点而言，`textContent` 获取到的就是属性值（`data`或`nodeValue`），对于元素节点而言，`textContent` 就是元素节点中包含的所有文本节点的拼接，对于文本节点而言，`textContent` 就是文本内容
    
    ---
    
    MDN上关于二者的区别有一个经典的例子，如下
    
    ```jsx
    	<h3>Source element:</h3>
      <p id="source">
        <style>
          #source {
            color: red;
          }
        </style>
        Take a look at<br />how this text<br />is interpreted below.
        <span style="display: none">HIDDEN TEXT</span>
      </p>
      <h3>Result of textContent:</h3>
      <textarea id="textContentOutput" rows="10" cols="30" readonly>...</textarea>
      <h3>Result of innerText:</h3>
      <textarea id="innerTextOutput" rows="10" cols="30" readonly>...</textarea>
    ```
    
    ```jsx
    const source = document.getElementById("source");
    const textContentOutput = document.getElementById("textContentOutput");
    const innerTextOutput = document.getElementById("innerTextOutput");
    
    textContentOutput.innerHTML = source.textContent;
    innerTextOutput.innerHTML = source.innerText;
    ```
    
    ![innerTextAndTextContent.png](4%20%E4%B8%93%E6%9C%89%E6%89%A9%E5%B1%95%EF%BC%88Proprietary%20Extensions%EF%BC%89/innerTextAndTextContent.png)
    
    - 可以发现`innerText` 的值和渲染的文本一致，而`textContent` 会把用于设置样式的`style` 节点的内容和被隐藏的元素节点的内容一并拼接，并且对于`<br />` 节点的换行没有进行处理

## 4.3.2 outerText属性

- `outerText`和`innerText` 是类似的，只不过作用范围包含调用它的节点
    - 读取渲染文本值时`outerText`和`innerText` 返回的值一样
    - 在写入文本值时，`outerText` 不止会移除所有的后代节点，还会替换整个元素
- 本质上使用`outerText` 相当于在用新的文本节点替换`outerText` 所在的元素节点
    - 虽然元素将在文档中被替换，设置了 `outerText`属性的变量仍将保持对原始元素的引用
    - 但是原始元素的引用会与文档脱离关系
    
    ```jsx
    <p id="source">
      <style>
        #source {
          color: red;
        }
      </style>
      Take a look at<br />how this text<br />is interpreted below.
      <span style="display: none">HIDDEN TEXT</span>
    </p>
    <script>
      const p = document.querySelector("p");
      console.log(p.outerText);
      p.outerText = "Hello, world";
      console.log(p);
    </script>
    // 打印
    Take a look at
    how this text
    is interpreted below.
    <p id="source">...</p>
    ```
    
    - 文档最终没有<p>节点，包含一个Hello, world文本节点
- `outerHTML` 在所有现代浏览器中都实现了（《JavaScript高级程序设计（第4版）》这里说`outerText` 是一个非标准属性，火狐浏览器未支持是**过去的语境**，在现在看来是错误的））

# 4.4 滚动

- 滚动是HTML5之前DOM标准没有涉及的领域。虽然HTML5把`scrollIntoView()` 标准化了，但不同的浏览器中仍然有其它专有方法
    - `scrollIntoViewIfNeeded()` 作为`HTMLElement` 类型的扩展可以在所有元素节点上调用
    - 除了火狐浏览器外，主流浏览器都实现了`scrollIntoViewIfNeeded()` 这个方法
    - 因为它不是标准，所以不要使用它，它的功能和`scrollIntoView()` 类似