# Element类型

- Element类型是Web开发中最常用的类型，Element表示XML或HTML元素，对外暴露出访问元素标签名、子节点和属性的能力。Element类型的节点具有以下特征
    - [ ]  nodeType等于`Node.ELEMENET_NODE` (1)
    - [ ]  nodeName值为元素的标签名
    - [ ]  nodeValue值为null
    - [ ]  parentNode值为Document或Element对象
    - [ ]  子节点可以是Element、Text、Comment、ProcessingInstruction、CDATASection、EntityReference类型
- 可以通过`nodeName`或`tagName`属性来获取元素的标签名，这两个属性返回同样的值，同时需要注意的是，在HTML中，元素标签名**始终以全大写**表示；在XML（包括XHTML）中，标签名始终与源代码中大小写保持一致，如果不确定脚本是HTML文档还是XML文档，最好将标签名称统一转换为小写形式，便于比较
    
    ```jsx
    <div id="myDiv">div</div>
    <script>
      let div = document.getElementById("myDiv");
      console.log(div.tagName); // "DIV"
      console.log(div.tagName === div.nodeName); // true
    </script>
    ```
    
    - 使用`toLowerCase()` 将字符串转换为小写就是”div”，更方便比较

## 1.3.1 Element接口规范

- 和`Document`接口定义的对象类似，元素节点也有`Element`和`HTMLElement` 接口定义，其中`HTMLElement`继承`Element` ，`Element` 直接继承`Node` 接口，其中`HTMLElement` 接口规范属于HTML Standard内容，而`Element` 接口规范属于DOM Standard内容
- DOM Standard规范定义的[Element接口](https://dom.spec.whatwg.org/#interface-element)如下
    
    ```jsx
    [Exposed=Window]
    interface Element : Node {
      readonly attribute DOMString? namespaceURI;
      readonly attribute DOMString? prefix;
      readonly attribute DOMString localName;
      readonly attribute DOMString tagName;
    
      [CEReactions] attribute DOMString id;
      [CEReactions] attribute DOMString className;
      [SameObject, PutForwards=value] readonly attribute DOMTokenList classList;
      [CEReactions, Unscopable] attribute DOMString slot;
    
      boolean hasAttributes();
      [SameObject] readonly attribute NamedNodeMap attributes;
      sequence<DOMString> getAttributeNames();
      DOMString? getAttribute(DOMString qualifiedName);
      DOMString? getAttributeNS(DOMString? namespace, DOMString localName);
      [CEReactions] undefined setAttribute(DOMString qualifiedName, DOMString value);
      [CEReactions] undefined setAttributeNS(DOMString? namespace, DOMString qualifiedName, DOMString value);
      [CEReactions] undefined removeAttribute(DOMString qualifiedName);
      [CEReactions] undefined removeAttributeNS(DOMString? namespace, DOMString localName);
      [CEReactions] boolean toggleAttribute(DOMString qualifiedName, optional boolean force);
      boolean hasAttribute(DOMString qualifiedName);
      boolean hasAttributeNS(DOMString? namespace, DOMString localName);
    
      Attr? getAttributeNode(DOMString qualifiedName);
      Attr? getAttributeNodeNS(DOMString? namespace, DOMString localName);
      [CEReactions] Attr? setAttributeNode(Attr attr);
      [CEReactions] Attr? setAttributeNodeNS(Attr attr);
      [CEReactions] Attr removeAttributeNode(Attr attr);
    
      ShadowRoot attachShadow(ShadowRootInit init);
      readonly attribute ShadowRoot? shadowRoot;
    
      Element? closest(DOMString selectors);
      boolean matches(DOMString selectors);
      boolean webkitMatchesSelector(DOMString selectors); // legacy alias of .matches
    
      HTMLCollection getElementsByTagName(DOMString qualifiedName);
      HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
      HTMLCollection getElementsByClassName(DOMString classNames);
    
      [CEReactions] Element? insertAdjacentElement(DOMString where, Element element); // legacy
      undefined insertAdjacentText(DOMString where, DOMString data); // legacy
    };
    
    dictionary ShadowRootInit {
      required ShadowRootMode mode;
      boolean delegatesFocus = false;
      SlotAssignmentMode slotAssignment = "named";
    };
    ```
    
    - 如果`[putforward]`扩展属性出现在类型为接口类型的只读普通属性声明中，则表明对该属性的赋值将具有特定的行为。也就是说，赋值被“**转发(forwarded)**”到当前被赋值的属性所引用的对象上的属性上(由扩展属性参数指定)。就拿`classList` 属性举例，它是一个`DOMTokenList` 对象，对象上有属性`value` ，`value` 属性值是一个字符串，对`classList`的直接赋值（如`document.body.classList = "hello"`）会被转发到`classList` 的`value`属性上（即等价于`document.body.classList.value = "hello"`）
    - 如果`[Unscopable]`扩展属性出现在常规属性或常规操作上，则表明使用给定接口成员实现接口的对象不会在任何对象**环境记录**（**environment record**）中包括其属性名称，该对象环境记录将其作为其基本对象。这样做的结果是，与属性名匹配的裸标识符将无法解析到with语句中的属性。这是通过在接口原型对象的@@unscopables属性值中包含属性名来实现的。就拿`slot` 属性举例，执行`with(document.body) { console.log(tagName) }` ，因为`body` 是一个实现了Element接口的元素节点，所以它有`tagName` 属性，可以打印出”BODY”,但是执行`with(document.body) { console.log(slot) }` 就会抛出异常，提示没有定义`slot` 属性， 但是直接调用`document.body.slot` 是可行的，这就是[Unscopable]的作用
- HTML Standard规范定义的[HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement)接口如下
    
    ```jsx
    [Exposed=Window]
    interface HTMLElement : Element {
      [HTMLConstructor] constructor();
    
      // metadata attributes
      [CEReactions] attribute DOMString title;
      [CEReactions] attribute DOMString lang;
      [CEReactions] attribute boolean translate;
      [CEReactions] attribute DOMString dir;
    
      // user interaction
      [CEReactions] attribute (boolean or unrestricted double or DOMString)? hidden;
      [CEReactions] attribute boolean inert;
      undefined click();
      [CEReactions] attribute DOMString accessKey;
      readonly attribute DOMString accessKeyLabel;
      [CEReactions] attribute boolean draggable;
      [CEReactions] attribute boolean spellcheck;
      [CEReactions] attribute DOMString autocapitalize;
    
      [CEReactions] attribute [LegacyNullToEmptyString] DOMString innerText;
      [CEReactions] attribute [LegacyNullToEmptyString] DOMString outerText;
    
      ElementInternals attachInternals();
    };
    
    HTMLElement includes GlobalEventHandlers;
    HTMLElement includes ElementContentEditable;
    HTMLElement includes HTMLOrSVGElement;
    
    [Exposed=Window]
    interface HTMLUnknownElement : HTMLElement {
      // Note: intentionally no [HTMLConstructor]
    };
    ```
    
    - 为了支持自定义元素特性，所有HTML元素都有特殊的构造函数行为。这是通过`[HTMLConstructor]` IDL扩展属性指定的。它指示给定接口的接口对象在被调用时具有特定的行为：`[HTMLConstructor]`扩展属性不能接受任何参数，并且只能出现在构造函数操作中。它必须只在构造函数操作中出现一次，而且接口必须只包含单个带注释的构造函数操作，不能包含其他操作。带注释的构造函数操作必须声明为无参数。
    - 如果`[LegacyNullToEmptyString]`扩展属性出现在DOMString或USVString类型上，它会创建一个新的IDL类型，这样当ECMAScript null转换为IDL类型时，它的处理方式就会与默认的处理方式不同。它不会被字符串化为默认值"null"，而是被转换为空字符串。
    - `HTMLUnknownElement` 接口继承HTMLElement，它属于定制的内置元素，定制的内置元素允许扩展现有的HTML元素，这些元素具有用户代理提供的有用行为或api。因此，它们只能扩展本规范中定义的现有HTML元素，而不能扩展使用HTMLUnknownElement作为元素接口的遗留元素，如bgsound、blink、isindex、keygen、multicol、nextid或spacer。这种需求的一个原因是未来兼容性:如果定义了扩展当前未知元素(例如组合框)的自定义内置元素，这将阻止此规范在未来定义组合框元素，因为派生自定义内置元素的消费者将会依赖于他们的基本元素，而没有用户代理提供的有趣行为。

## 1.3.2 HTML元素

- 所有HTML元素都通过HTMLElement类型表示，包括其直接实例和间接实例，HTMLElement直接继承Element并增加了一些属性，它们是所有HTML元素上都有的标准属性：
    - [ ]  `id` ，元素在文档中的唯一标识符，默认为空字符串
    - [ ]  `title` ，包含元素的额外信息，通常以提示条形式展示（就是鼠标悬停时出现的白色提示框中的文本）
    - [ ]  `lang` ，元素内容的语言代码（很少用）
    - [ ]  `dir` ，语言的书写方向（”ltr“表示从左到右，”rtl”表示从右到左，同样很少使用）
    - [ ]  `className` ，相当于`class`属性，用于指定元素的CSS类（因为class时ECMAScript关键字，所以不能直接使用class这个名字）
- 所有这些都可以用来获取对应的属性值，也可以用来修改相应的值，如下
    
    ```jsx
    <p lang="ar_EG" dir="rtl" title="阿拉伯语言" id="myP" class="unkown">
        شسيسلشسلؤ
    </p>
    <script>
      const myP = document.getElementById("myP");
      console.log(myP.id, myP.className, myP.dir, myP.lang, myP.title); // myP unkown rtl ar_EG 阿拉伯语言
    </script>
    ```
    
    - `id`，`className` 等这些属性的修改通常和样式有关联
- 并非所有这些属性的修改都会对页面产生影响，比如把lang改成其它值而不是”ar_EG“对其它用户而是不可见的（假设没有针对lang属性应用的CSS样式）
- 所有HTML元素都是HTMLElement或其子类型的实例，下表列出了所有HTML元素及其对应的类型（斜体表示已经废弃的元素）
    
    [HTMLElement元素表格](Element%E7%B1%BB%E5%9E%8B/HTMLElement%E5%85%83%E7%B4%A0%E8%A1%A8%E6%A0%BC.md)
    

## 1.3.3 取得属性

- 每个元素都有零个或多个属性，通常用于为元素或其内容附加更多信息，与属性相关的DOM方法主要有三个,它们定义在`Element` 接口上：`getAttirbute()` ，`setAttribute()` 和`removeAttribute()` ，这些方法主要用于操作属性，包括在HTMLElement类型上定义的属性

### 1.3.3.1 getAttribute()

- 传递给`getAttribute()`属性名与它们实际的属性名是一样的，例如获取元素的`class`名称，传递“class”而不是”className”（className是作为对象属性时才那么拼写），如果给定的属性不存在，则`getAttribute()` 返回`null`
    
    ```jsx
    <p class="p" id="myP" lang="zh-CN" dir="ltr">你好</p>
    <script>
      const p = document.getElementById("myP");
      console.log(p.getAttribute("class")); // p
      console.log(p.getAttribute("id")); // myP
      console.log(p.getAttribute("lang")); // zh-CN
      console.log(p.getAttribute("dir")); // ltr
      console.log(p.getAttribute("title")); // null
    </script>
    ```
    
    - 虽然元素节点上有属性`titlte` ，但是在HTML中并没有赋值，所以给定的`title` 属性相当于不存在
- HTML中除了可以给节点定义**预留的属性值**，也可以**自定义属性并赋值**，`getAttribute()` 对获取自定义的属性的值也是有效果的，根据HTML5规范，自定义属性名应该使用**前缀**`data-`以方便验证，并且**属性名称不区分大小写，**id和ID是同一种属性
    
    ```jsx
    <p class="p" id="myP" lang="zh-CN" dir="ltr" data-special-attribute="hello">
      你好
    </p>
    console.log(p.getAttribute("DATA-special-attribute")); // hello
    ```
    
    - 可以发现HTML元素节点上定义的属性名称是不区分大小写的，使用DATA-special-attribute仍然可以获得属性值
- 根据HTML5规范好的自定义属性（即以`data-`前缀开头）可以通过节点的`dataset` 属性统一获取到，`dataset` 返回一个`DOMStringMap` 对象，键为自定义属性（去掉前缀和横杠，大写横杠后的第一个字母），值为对应自定义属性值
    
    ```jsx
    <p class="p" id="myP" lang="zh-CN" dir="ltr" data-special-attribute="hello">
      你好
    </p>
    console.log(p.dataset); // DOMStringMap {specialAttribute: 'hello'}
    ```
    
    - 如果没有按照HTML5规范定义自定义属性，那么dataset不会包含这个自定义属性，但是仍然可以通过`getAttribute()` 获取到自定义属性值
- 通过DOM对象访问的属性中有**两个返回的值**跟使用`getAttribute()` 取得的值不一样
    - `style` 属性，用于元素设定CSS样式，通过`getAttribute()` 获取到的是CSS字符串，但是通过`element.style` 属性获取到的是一个（`CSSStyleDeclaration`）对象
        
        ```jsx
        <p
          id="myP2"
          style="color: blue; text-align: center; background-color: antiquewhite"
        >
          Hello, world
        </p>
        console.log(p2.style);
        console.log(p2.getAttribute("style"));
        ```
        
        ![CSSStyleDeclaration.png](Element%E7%B1%BB%E5%9E%8B/CSSStyleDeclaration.png)
        
        - `CSSStyleDeclaration` 对象除了自定义的`style` 属性设定的CSS样式外，还包括浏览器支持的所有CSS样式预设
        - DOM对象的`style` 属性用于以编程方式读写元素样式，因此不会直接映射为元素中`style` 属性的字符串值
    - 事件处理程序（或者事件属性），事件属性有很多种，最常见的如`onclick`，在元素上**使用事件属性**时，属性的值是一段JavaScript代码；如果使用`getAttribute()` **访问事件属性**，则返回的是字符串形式的源代码；如果通过DOM对象的属性访问事件属性时返回的则是一个JavaScript函数（未指定属性则返回null），这是因为`onclick` 及其它事件属性是可以接收函数作为值的
        
        ```jsx
        <p onclick="alert('Hello, world')" id="myP3">你好，世界</p>
        
        console.log(p3.onclick, typeof p3.onclick);
        console.log(p3.getAttribute("onclick"));
        ```
        
        ![getAttribute('onclick').png](Element%E7%B1%BB%E5%9E%8B/getAttribute(onclick).png)
        
- 考虑到以上的差异，开发者在进行DOM编程时通常会放弃使用`getAttribute()` 而只使用对象属性，`getAttribute()` **主要用于取得自定义属性的值**

### 1.3.3.2 setAttribute()

- `setAttribute()` 接收两个参数， 要设置的属性名和属性的值
    - 如果属性已经存在，则`setAttribute()` 会以指定的值替换原来的值
    - 如果属性不存在，则`setAttribute()` 会以指定的值创建该属性
    - `setAttribute()` 适用于HTML属性，也适用于自定义属性
    - 此外`setAttribute()` 方法会规范为小写形式，因此“ID”会变成“id”
    
    ```jsx
    <p>设置属性</p>
    
    const p = document.querySelector("p");
    p.setAttribute("CLaSs", "my-p");
    p.setAttribute("LanG", "zh-CN");
    p.setAttribute("DaTa-my-attribute", "hello");
    console.log(p.dataset); // DOMStringMap { myAttribute : "hello" }
    ```
    
    ![setAttribute.png](Element%E7%B1%BB%E5%9E%8B/setAttribute.png)
    
- 因为元素属性也是DOM对象属性，所以直接给DOM对象的属性赋值也可以设置元素属性的值，这种方式只对`Element`和`HTMLElement` 接口定义过的元素节点属性有效，**对自定义属性无效，**但是同样可以通过`dataset` 属性增加自定义属性，只是增加的自定义属性一定是以`data-`前缀开头的，如下
    
    ```jsx
    p.align = "center";
    p.dataset.specailAttribute = "hello,world";
    ```
    
    ![dom-element-addAttribute.png](Element%E7%B1%BB%E5%9E%8B/dom-element-addAttribute.png)
    

### 1.3.3.3 removeAttribute()

- 用于删除元素中的属性，这样不单单是清除属性的值，而是会把整个属性完全从元素中去掉
    
    ```jsx
    <p class="myP" id="myP" data-my-attribute="hello">Hello</p>
    
    const p = document.getElementById("myP");
    p.removeAttribute("class");
    p.removeAttribute("id");
    p.removeAttribute("data-my-attribute");
    console.log(p.dataset);
    console.log(p.id, typeof p.id, p.id === "");
    console.log(p.className);
    ```
    
    ![removeAttribute.png](Element%E7%B1%BB%E5%9E%8B/removeAttribute.png)
    
    ![removeAttribute_p.png](Element%E7%B1%BB%E5%9E%8B/removeAttribute_p.png)
    
- `removeAttribute()` 方法用得并不多，但在序列化DOM元素时可以通过它控制要包含的属性

## 1.3.4 attributes属性

- `Element` 类型是唯一使用`attributes` 属性的DOM节点类型。attribute属性包含一个`NamedNodeMap`实例，是一个类似`NodeList` 的实时集合，DOM规范的[NamedNodeMap](https://dom.spec.whatwg.org/#namednodemap) 接口如下
    
    ```jsx
    [Exposed=Window,
     LegacyUnenumerableNamedProperties]
    interface NamedNodeMap {
      readonly attribute unsigned long length;
      getter Attr? item(unsigned long index);
      getter Attr? getNamedItem(DOMString qualifiedName);
      Attr? getNamedItemNS(DOMString? namespace, DOMString localName);
      [CEReactions] Attr? setNamedItem(Attr attr);
      [CEReactions] Attr? setNamedItemNS(Attr attr);
      [CEReactions] Attr removeNamedItem(DOMString qualifiedName);
      [CEReactions] Attr removeNamedItemNS(DOMString? namespace, DOMString localName);
    };
    ```
    
    - 元素节点的每个属性都表示为一个**Attr节点**，并保存在整个`NamdeNodeMap`对象上
    - [ ]  getNamedItem(*name*)，返回nodeName属性等于*name*的节点
    - [ ]  removeNamedItem(*name*)，删除nodeName属性等于*name*的节点
    - [ ]  setNamedItem(*node*)，向列表中添加*node*节点，以nodeName为索引
    - [ ]  item(*index*)，返回索引位置*index*处的节点
    - [ ]  后面加了NS的方法主要用于XML DOM对象，可以参考[DOM NamedNodeMap对象getNamedItemNS()方法](https://www.yiibai.com/dom/dom_namednodemap_getnameditemns.html)
- `attributes` 属性中的每个节点的`nodeName` 是对应属性的名字，`nodeValue`是属性的值，因为`Attr` 接口本身继承`Node` 接口，所以属性节点具有`nodeName`和`nodeValue` ，属性节点的`nodeType` 值就是`node.ATTRIBUTE_NODE` (2)
    
    ```jsx
    <p
      class="myP"
      id="myP"
      data-my-attribute="hello"
      style="color: blue; background-color: antiquewhite"
      align="center"
    >
      Hello
    </p>
    
    const p = document.getElementById("myP");
    console.log(p.attributes);
    console.log(
      p.attributes[0],
      typeof p.attributes[0],
      p.attributes[0] instanceof Attr
    );
    console.log(p.attributes["align"].nodeValue);
    let oldAttr = p.attributes.removeNamedItem("id");
    console.log(oldAttr, typeof oldAttr, oldAttr instanceof Attr);
    let newAttr = document.createAttribute("id");
    newAttr.nodeValue = "my-p";
    p.attributes.setNamedItem(newAttr);
    
    ```
    
    ![attributes.png](Element%E7%B1%BB%E5%9E%8B/attributes.png)
    
- 关于属性节点会在 [1.9 Attr类型](../1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89.md) 中介绍，上面`setNamedItem()` 方法很少用到，它接收一个属性节点，属性节点的创建使用了`Document` 接口定义的`createAttribute()` 方法，因为使用起来没有`getAttribute()` ，`setAttribute()` 方便，开发者一般不使用`attributes` 及其方法进行元素节点的属性设置和属性获取
- `attributes` 最有用的场景是需要**迭代元素上所有属性**的时候，这个时候往往要把DOM结构序列化为XML或HTML字符串，如下代码能将一个元素的所有属性迭代并序列化为`attribute1 = value1` 的形式，并返回
    
    ```jsx
    function outputAttributes(element) {
      let pairs = [];
      for (let i = 0, len = element.attributes.length; i < len; i++) {
        const attribute = element.attributes[i];
        pairs.push(`${attribute.nodeName}=${attribute.nodeValue}`);
      }
      return pairs.join(" ");
    }
    let pairstring = outputAttributes(p);
    p.textContent = pairstring;
    ```
    
    ![attributes_string.png](Element%E7%B1%BB%E5%9E%8B/attributes_string.png)
    
    - 注意`attributes` 中的类属性使用了名称`class` 而非`className`

## 1.3.5 创建元素

- 使用`document.createElement()` 方法创建新元素，它虽然是`Document` 定义的接口，但是常用于创建元素节点，这个方法接收一个参数，即要**创建元素的标签名称（nodeName）**
    - 在HTML中标签名是不分大小写的，所以传入大写和小写都可以创建对应的元素节点，但是在XML文档（包括XHTML）中是区分大小写的
    - 使用`createElement()` 方法创建新元素的同时也会将其`ownerDocument` 属性设置成`document` ，此时可以再为其添加属性，添加更多子元素
    - 在新元素上设置属性只会附加信息，因为这个元素节点还没有添加到文档树中，所以不会影响浏览器的显示，要把元素节点添加到文档树中可以使用之前在`Document` 类型中提到的`appendChild()` 、`insertBefore()` 、`replaceChild()` ；元素被添加到文档树后，浏览器会立即将其渲染出来，之后再对这个元素所在的任何修改都会在浏览器中反映出来
        
        ```jsx
        <fieldset>
          创建元素
          <label for="tag-name">输入元素标签名</label>
          <input type="text" name="tag-name" />
          <label for="node-value">输入元素文本内容</label>
          <input type="text" name="node-value" />
          <input type="submit" value="创建" />
        </fieldset>
        <p>创建的元素挂载到下面的content-div上</p>
        <div class="content"></div>
        
        const submit = document.querySelector("input[type='submit']");
        const tagNameInput = document.querySelector("input[name='tag-name']");
        const nodeValueInput = document.querySelector("input[name='node-value']");
        const content = document.querySelector(".content");
        submit.addEventListener("click", () => {
          if (tagNameInput && nodeValueInput) {
            const newEle = document.createElement(tagNameInput.value);
            tagNameInput.value = "";
            if (newEle) {
              newEle.textContent = nodeValueInput.value;
              content.appendChild(newEle);
              nodeValueInput.value = "";
            } else {
              alert("非法的标签");
            }
          } else {
            alert("请输入元素标签名和元素文本内容");
          }
        });
            
        ```
        
        ![createElement.gif](Element%E7%B1%BB%E5%9E%8B/createElement.gif)
        

## 1.3.6 元素后代（Element Children）

- 元素可以拥有任意多个子元素和后代元素，因为元素本身也可以是其它元素的子元素
- `childNodes` 属性包含元素所有的**子节点**，这些子节点可能是其它元素、文本节点、注释或处理指令，不同浏览器在识别这些节点时的表现有明显不同
- 在Document类型提到过[1.2.2 文档子节点（Document Children）](Document%E7%B1%BB%E5%9E%8B.md) ，本质上，元素的子节点和文档子节点是一样的，都是使用`Node` 接口定义的`childNodes` 属性获取节点的所有子节点，因为代码解析的问题，一个元素节点的后代可能包括开发者并不想要的**空格文本节点**，如下
    
    ```jsx
    <ul id="myList">
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
    </ul>
    
    const myList = document.getElementById("myList");
    console.log(myList.childNodes);
    ```
    
    ![node_list.png](Element%E7%B1%BB%E5%9E%8B/node_list.png)
    
    - 其中3个<li>元素，4个文本节点（<li>元素周围的空格）
    - 如果把元素之间的空格去掉，`myList` 的子节点就会只有3个<li>元素
        
        ```jsx
        <ul id="myList"><li>item 1</li><li>item 2</li><li>item 3</li></ul>
        ```
        
    - 但是这种写法在<li>元素很多的情况下代码结构会**比较难看**，所以在获取元素节点的所有后代元素节点时，会将`childNodes` 上的所有节点遍历一遍，只选取`nodeType` 值是1（元素节点）的节点
        
        ```jsx
        function getElementChildren(ele) {
          let res = [];
          for (let i = 0; i < ele.childNodes.length; i++) {
            if (ele.childNodes[i].nodeType === Node.ELEMENT_NODE)
              res.push(ele.childNodes[i]);
          }
          return res;
        }
        let eleChildren = getElementChildren(myList);
        console.log(eleChildren);
        ```
        
        ![elementChildren.png](Element%E7%B1%BB%E5%9E%8B/elementChildren.png)
        
    - 除此之外，如果在提前知道元素节点的后代节点的标签名称都是一致的情况下，可以使用`getElementsByTagName()` 方法，与在文档上调用是一样的，只不过限制了在了当前元素之内，只会返回当前元素的后代节点
        
        ```jsx
        console.log(myList.getElementsByTagName("li"));
        ```
        
        ![后代节点.png](Element%E7%B1%BB%E5%9E%8B/%25E5%2590%258E%25E4%25BB%25A3%25E8%258A%2582%25E7%2582%25B9.png)
        

---

- 以下为对《JavaScript高级程序设计（第4版）》的补充
- 实际上，DOM Standard规范中的**[ParentNode](https://dom.spec.whatwg.org/#parentnode)** 接口为元素节点、文档节点和文档片段节点都提供了一个`children` 属性，该属性返回一个`HTMLCollection` 对象，它**按顺序包含节点的直接后代元素节点**，节点定义如下
    
    ```jsx
    interface mixin ParentNode {
      [SameObject] readonly attribute HTMLCollection children;
      readonly attribute Element? firstElementChild;
      readonly attribute Element? lastElementChild;
      readonly attribute unsigned long childElementCount;
    
      [CEReactions, Unscopable] undefined prepend((Node or DOMString)... nodes);
      [CEReactions, Unscopable] undefined append((Node or DOMString)... nodes);
      [CEReactions, Unscopable] undefined replaceChildren((Node or DOMString)... nodes);
    
      Element? querySelector(DOMString selectors);
      [NewObject] NodeList querySelectorAll(DOMString selectors);
    };
    Document includes ParentNode;
    DocumentFragment includes ParentNode;
    Element includes ParentNode;
    ```
    
    - `mixins`是一种实现多重继承的方式，通过它可以给现有的类添加特性
    - `Document` 、`DocumentFragment` 、`Element` 接口都实现了`ParentNode` 接口，所以它们的对象可以使用`children`属性获取直接后代的元素节点，不用管文本节点了
    
    ```jsx
    console.log(myList.children);
    ```
    
    ![后代节点.png](Element%E7%B1%BB%E5%9E%8B/%25E5%2590%258E%25E4%25BB%25A3%25E8%258A%2582%25E7%2582%25B9.png)