# 3. HTML5

- 在HTML5之前，HTML（超文本标记语言——HyperText Markup Language）仅作为一个**纯标记语言**，不会包含关于JavaScript相同的事情，这些事情都交给DOM规范去定义
- HTML5代表着与以前的HTML截然不同的方向，HTML5规范包含了与标记相关的大量JavaScript API定义，其中有的API与DOM重合，定义了浏览器应该提供的DOM扩展
    
    <aside>
    💡 HTML5覆盖的范围极其广泛，本节仅讨论其影响DOM节点的部分
    
    </aside>
    
- HTML5是之前HTML版本的继承者，在之前版本HTML 4.01的基础上引入了新的元素和功能，并改进或删除了一些现有的功能
    - HTML5最新标准可以查看**[w3c**-**HTML5**](http://www.w3.org/TR/html5/) ，w3c为它做了一个单独的域名网站（[html.spec.whatwg.org](http://html.spec.whatwg.org/)）而不是w3c的域名
    - MDN解释：直到2019年，W3C发布了一个与HTML5竞争的带有版本号的（HTML）标准。自2019年5月28日起，**WHATWG使用标准**（**WHATWG Living Standard**）被W3C宣布为唯一的HTML版本。
        - WHATWG是苹果（Apple），谷歌（Google），谋智（Mozilla），微软（Microsoft）组成的一个组织，该组织全名称为**Web Hypertext Application Technology Working Group ——**网页超文本应用技术工作小组，起初是一个以推动网络[HTML 5](https://baike.baidu.com/item/HTML%205/8762673?fromModule=lemma_inlink)标准为目的而成立的组织
        - 现在在w3.org标准组织网站搜索HTML，可以看大最新的标准版本是[HTML5.3](https://www.w3.org/TR/2021/NOTE-html53-20210128/) ，它目前就是上面所说的[html.spec.whatwg.org](http://html.spec.whatwg.org/)

# 3.1 CSS类扩展（Class-Related Additions）

- 自HTML4被广泛采用以来，Web开发中一个主要变化是class属性用的越来越多，其用处是为元素**添加样式以及语义信息**
- JavaScript关于CSS类的**交互**也就越来越多，包括动态修改类名（className），以及根据给定的一个或一组类名查询元素（Selector API）等
- HTML5为了适应开发者对class属性的使用，增加了一些特性以方便使用CSS类型

## 3.1.1 getElementsByClassName()

- `getElementsByClassName()` 方法基于原有DOM特性实现该功能的JavaScript库，提供了性能高好的原生实现
    - 接受一个参数，即包含一个或多个类名的字符串，返回类名中包含相应类的元素的`[HTMLCollection](https://dom.spec.whatwg.org/#htmlcollection)` （《JavaScript高级程序设计（第4版）》上写的`NodeList` ，实际上应该是HTMLCollection）
    - 多个类名的顺序是无关紧要的，它们之间用空格分隔，查询的元素节点的类名称能匹配所有类名
    - 这个方法在`Node` 接口中定义，所以Document，Element类型都实现了，它只会返回以调用它的对象为根元素的子树中所匹配的元素
    - IE9版本及以上，以及所有现代浏览器都支持`getElementsByClassName()`方法
    
    ```jsx
    <body>
      <div class="a b c d">
        <p class="a b c">abc</p>
        <p class="a b d">abd</p>
        <p class="c b d">bcd</p>
        <p class="a c d">acd</p>
      </div>
      <div class="c d b">
        cdb
        <span class="b a d"> bad </span>
        <p class="a c d">acd</p>
      </div>
      <script>
        const ads = document.getElementsByClassName("a d");
        console.log(ads);
        const abcd = document.getElementsByClassName("a b c d")[0];
        const bcs = abcd.getElementsByClassName("b c");
        console.log(bcs);
      </script>
    </body>
    ```
    
    ![getElementsByClassName.png](3%20HTML5/getElementsByClassName.png)
    

## 3.1.2 classList属性

- 一个元素节点可以有多个类名称，在HTML中，类名使用至少一个空格分隔开，所以没有`classList`属性前，可以操作`className` 属性值获取每个类名，然后进行增删改查，比如
    
    ```jsx
    <div class="a b c"></div>
    <script>
      const div = document.querySelector("div");
      const classNames = div.className.split(/\s+/);
      // 找到想要修改的类名
      let idx = classNames.indexOf("b");
      if (idx !== -1) classNames.splice(idx, 1, "d"); // 修改成想要的类名
      div.className = classNames.join(" "); // 最后div类名变成乐a d c
    </script>
    ```
    
- 删除类名、增加类名也会有类似的先分隔获取所有类名，操作后重新合并的算法，很多JavaScript库为这些操作实现乐便利的方法
- HTML5通过给所有元素增加`classList`属性为这些操作提供了更简单也更安全的实现方式，`classList` 定义在`Node` 接口，它本身并不是一个数组，而是一个`[DOMTokenList`](https://dom.spec.whatwg.org/#domtokenlist) 类型，其接口定义如下
    
    ```jsx
    [Exposed=Window]
    interface DOMTokenList {
      readonly attribute unsigned long length;
      getter DOMString? item(unsigned long index);
      boolean contains(DOMString token);
      [CEReactions] undefined add(DOMString... tokens);
      [CEReactions] undefined remove(DOMString... tokens);
      [CEReactions] boolean toggle(DOMString token, optional boolean force);
      [CEReactions] boolean replace(DOMString token, DOMString newToken);
      boolean supports(DOMString token);
      [CEReactions] stringifier attribute DOMString value;
      iterable<DOMString>;
    };
    ```
    
    - [ ]  `length` ：表示包含多少项，在`classList` 属性中就是节点的类名个数
    - [ ]  `item(index)` ：`getter` 方法，传入索引数字获取对应的类名，也可以使用中括号语法，类名的顺序就是`className` 字符串以空格分割后的顺序
    - [ ]  `add(value)` ：向类名列表中添加指定的字符串值`value` ，会加在列表最后（也就是`className`字符串最后），如果列表中存在同名类名，就不会做任何事情
    - [ ]  `contains(value)` ：返回布尔值，表示给定的`value` 是否存在
    - [ ]  `remove(value)` ：从类名列表中删除指定的字符串值`value` ，如果没有就不会做任何事情
    - [ ]  `toggle(token[, force])` ：如果`force` 为`false` 或者没有传递，那么会进行“**切换（toggle）**”操作，即类名列表中已经存在指定的`token` 就删除之并返回`false`，不存在，则添加之并返回`true`；如果`force` 为`true` ，则会进行强制添加（有重复就不添加）操作并返回`true`
    - [ ]  `repalce(token, newToken)` ：使用`newToken`替换已存在的`token` ，如果`token` 在类列表中已存在，会成功替换并返回`true` ，否则不能成功替换，不进行其他操作，返回`false`
    - [ ]  `value` ：等于节点的`className`
- IE10及以上版本（部分）和其他主流浏览器（完全）实现了`classList`属性
    
    ```jsx
    <body>
      <p class="a b c d"></p>
      <script>
        const p = document.querySelector("p");
        console.log(p.classList.toggle("a")); // 删除之，返回false
        console.log(p.classList.toggle("e")); // 添加之，返回true
    
        console.log(p.classList.toggle("b", true)); // 强制重复添加，返回true
        console.log(p.classList.toggle("f", true)); // 强制添加，返回true
    
        console.log(p.classList.contains("c")); // true
        console.log(p.classList.replace("c", "a")); // true
      </script>
    </body>
    // 最终p节点的类名称为"b a d e f"
    ```
    

# 3.2 焦点管理（Focus Management）

- HTML5增加了辅助DOM焦点管理的功能，它就是`activeElement` ，MDN提示它定义在`[DocumentOrShadowRoot`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/activeElement) 接口中，用来返回当前在DOM或者shadow DOM树中处于聚焦状态的元素节点
    - 页面加载时，可以通过用户输入（按Tab键或代码中使用focus()方法）让某个元素自动获得焦点
- 在DOM规范中，确实有一个**混入**（**mixin**）接口****`[DocumentOrShadowRoot](https://dom.spec.whatwg.org/#documentorshadowroot)`** ,它的定义如下
    
    ```jsx
    interface mixin DocumentOrShadowRoot {
    };
    Document includes DocumentOrShadowRoot;
    ShadowRoot includes DocumentOrShadowRoot;
    ```
    
    - `Document`和`ShadowRoot` 共享`DocumentOrShadowRoot` 定义的属性和方法，但是HTML规范并未给出具体的属性和方法
    - `Document` 接口和`ShadowRoot` 接口的IDL都没有直接定义`activeElement` ，说明二者的`avitveElement` 属性确实是混入的
- 在最新的HTML规范中，对[`documentOrShadowRoot.activeElement`](https://html.spec.whatwg.org/multipage/interaction.html#dom-documentorshadowroot-activeelement-dev) 有一个标准解释，并定义了具体的[DocumentOrShadowRoot](https://html.spec.whatwg.org/#documentorshadowroot) 接口，如下
    
    ```jsx
    partial interface mixin DocumentOrShadowRoot {
      readonly attribute Element? activeElement;
    };
    ```
    
- 默认情况下，`document.activeElement` 在页面刚加载完之后会设置为`document.body` ，而在页面完全加载之前，`document.activeElement` 的值为`null`
- 可以通过`document.hasFocus()` 方法判断文档是否拥有焦点，`hasFocus` 仅在`Document` 类型中存在，但在DOM规范的[Document接口](https://dom.spec.whatwg.org/#document) 的IDL没有进行定义，而在HTML规范的****[Focus management APIs](https://html.spec.whatwg.org/multipage/interaction.html#focus-management-apis)** 和[document](https://html.spec.whatwg.org/#document) object 进行了说明
    - 确定文档是否具有焦点，就可以帮助确定用户是否在操作页面
    - `hasFocus()` 可以查询文档是否获得了焦点，`activeElement` 用于确定哪个元素拥有焦点
    - 这两个接口对于保证Web应用程序的无障碍使用非常重要，无障碍地一个重要方面就是焦点管理，而能够确定哪个元素当前拥有焦点是一个很大的进步

```jsx
<body>
  <input type="text" />
  <script>
    console.log(document.hasFocus());
    const input = document.querySelector("input");
    input.focus();
    if (document.hasFocus()) {
      console.log(document.activeElement);
    }
  </script>
</body>
// 打印结果
// true
// <input type="text">
```

# 3.3 HTMLDocument扩展

- HTML5扩展了`HTMLDocument`类型，增加了更多功能，与其他HTML5定义的DOM扩展一样，在成为标准前事实上大部分浏览器都实现了这些专有扩展

## 3.3.1 readyState属性

- `readyState` 属性是IE4最早添加到`document` 对象上的属性，后来其他浏览器也参照这个支持这个属性，最终HTML5将这个属性写入了标准
- `readyState` 属性在HTML规范的[Document接口](https://html.spec.whatwg.org/#document) 中定义，它是一个[DocumentReadyState](https://html.spec.whatwg.org/#documentreadystate) 枚举类型，定义如下
    
    ```jsx
    enum DocumentReadyState { "loading", "interactive", "complete" };
    ```
    
    - [ ]  `loading` ：表示文档正在加载
    - [ ]  `complete` ：表示文档加载完成
    - [ ]  `interactive` ：表示解析完成（**finished parsing**）但仍在加载**子资源**（**subresources**）
- 实际开发中，最好把`document.readyState` 当成一个指示器，以判断文档是否加载完毕
    - 在这个属性得到广泛支持前，通常依赖`onload` 事件处理程序设置一个标记，表示文档加载完毕
    - 但是有了这个`readyState` 就可以随时查询文档加载状态

```jsx
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>readyState</title>
  <script src="15.3.3.1 readyState.js"></script>
</head>
<body>
  <p>readyState</p>
</body>
```

```jsx
let interval = setInterval(() => {
  console.log(document.readyState);
});
setTimeout(() => {
  clearInterval(interval);
}, 500);
```

- 打印结果会因为浏览器加载文档和外部引用而有变化，三种状态都可能打印出来，如下
    
    ![readyState.png](3%20HTML5/readyState.png)
    

## 3.3.2 compatMode属性

- 自从IE6提供了以**标准或混杂模式**渲染页面的能力之后，检测页面渲染模式成为了一个必要的需求；文档模式相关的查看第二章的[3.文档模式](../2%20HTML%E4%B8%AD%E7%9A%84JavaScript.md)
    - 标准模式（standard mode）
    - 混杂模式（quirks mode）
    - 准标准模式（almost standard mode）
- IE为`document`添加了`compatMode` 属性，这个属性唯一的任务是指示浏览器当前处于什么**渲染模式**，它在HTML规范中没有相关的，反而在DOM规范的[Document接口](https://dom.spec.whatwg.org/#ref-for-dom-document-compatmode%E2%91%A0)的IDL上定义了该属性
    - 文档模式是标准模式和准标准模式，`compatMode` 值是”BackCompat”，文档模式是混杂模式，`compatMode` 值是“CSS1Compat”
        
        ```jsx
        <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>compatMode</title>
          </head>
          <body>
            <p>准标准模式</p>
            <script>
              console.log(document.compatMode); // CSS1Compat
            </script>
          </body>
        </html>
        ```
        
        ```jsx
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>compatMode</title>
          </head>
          <body>
            <p>标准模式</p>
            <script>
              console.log(document.compatMode); // CSS1Compat
            </script>
          </body>
        </html>
        ```
        
        ```jsx
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>compatMode</title>
          </head>
          <body>
            <p>混杂模式</p>
            <script>
              console.log(document.compatMode); // BackCompat
            </script>
          </body>
        </html>
        ```
        

## 3.3.3 head属性

- 作为对`document.body` （指向文档的<body>元素）的补充，HTML5新增了`document.head` 属性，指向文档的<head>元素，`head` 属性在HTML规范中的[Document](https://html.spec.whatwg.org/#document) 的IDL定义了
    
    ```jsx
    console.log(document.head);
    // 打印出head元素
    ```
    

## 3.4 字符集属性（Character Set Properties）

- HTML5增加了几个与文档字符集有关的新属性，其中一个就是`characterSet` 属性，表示文档实际使用的字符串，也可以用来指定新字符集
    - `characterSet` 的默认值是~~“UTF-16”~~（《JavaScript高级程序设计（第4版）》原话）
    - 可以通过<meta>元素，响应头，修改`characterSet`属性来设置字符集
    - DOM规范在[Document](https://dom.spec.whatwg.org/#document)接口中定义了`characterSet` 属性
    
    ```jsx
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>字符集</title>
      </head>
      <body>
        <script>
          console.log(document.characterSet, document.charset); // UTF-8 UTF-8
        </script>
      </body>
    </html>
    ```
    
- 通过上面的例子可以发现，`characterSet` 拥有非法别名`document.charset` ，且默认值为”UTF-8“
    - 关于字符集可以查看[10. Unicode标准中文翻译](../../JavaScript%E5%B0%8F%E8%AE%A1/10%20Unicode%E6%A0%87%E5%87%86%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.md)
    - 关于`document.characterSet` ，参考DOM规范，它返回编码格式

## 3.5 自定义数据属性

- HTML5允许给元素指定非标准的属性，但要使用前缀`data-`以便告诉浏览器，这些属性既**不**包含与**渲染有关的信息**，也**不**包含元素的**语义信息**
    
    ```jsx
    <div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
    ```
    
- 定义了自定义属性后，可以通过元素的`dataset` 属性来访问
    - `dataset`属性定义在 HTMLOrSVGElement ****混入接口上，而HTMLElement包含实现了HTMLOrSVGElement ，HTML规范上的[HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement)接口和[HTMLOrSVGElement](https://html.spec.whatwg.org/multipage/dom.html#htmlorsvgelement) 接口
        
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
        **HTMLElement includes HTMLOrSVGElement;**
        
        [Exposed=Window]
        interface HTMLUnknownElement : HTMLElement {
          // Note: intentionally no [HTMLConstructor]
        };
        
        interface mixin HTMLOrSVGElement {
          [SameObject] readonly attribute DOMStringMap **dataset**;
          attribute DOMString nonce; // intentionally no [CEReactions]
        
          [CEReactions] attribute boolean autofocus;
          [CEReactions] attribute long tabIndex;
          undefined focus(optional FocusOptions options = {});
          undefined blur();
        };
        ```
        
    - `dataset`属性是一个`DOMStringMap`的实例，在HTML规范中，这个[DOMStringMap](https://html.spec.whatwg.org/multipage/dom.html#domstringmap)接口定义如下
        
        ```jsx
        [Exposed=Window,
         LegacyOverrideBuiltIns]
        interface DOMStringMap {
          getter DOMString (DOMString name);
          [CEReactions] setter undefined (DOMString name, DOMString value);
          [CEReactions] deleter undefined (DOMString name);
        };
        ```
        
        - [ ]  `getter` 方法：根据元素的自定义属性键获取对应属性值
        - [ ]  `setter` 方法：设置自定义属性的键值
        - [ ]  `deleter` 方法：删除元素的自定义属性键
        
        对于HTML来说，元素的自定义属性键就是data-后面的字符串
        
        ```jsx
        <body>
          <div data-my-attribute="hello" data-attribute2="world">自定义属性</div>
          <script>
            const div = document.querySelector("div");
            console.log(div.dataset); // DOMStringMap
            console.log(div.dataset.myAttribute); // hello
            div.dataset.attribute2 = "mangwu";
            console.log(div.dataset.attribute2); // mangwu
            delete div.dataset.myAttribute;
            console.log(div.dataset); // DOMStringMap
          </script>
        </body>
        ```
        
        - DOMStringMap是**实时**的，它最终只有一个**`attribute2`** 属性，值为”mangwu”
- 自定义数据属性非常适合需要给元素附加某些数据的场景，比如**链接追踪**和在聚合应用程序中标识页面的不同部分，另外，单应用程序框架也非常多地使用了自定义数据属性

## 3.6 插入标记（Markup Insertion）

- DOM虽然已经为操作节点提供了很多API，但向文档中一次性插入大量HTML时还是比较麻烦的
    - 直接插入一个HTML字符串要比一个个创建节点再插入要方便的多
    - HTML5已经通过以下DOM扩展将这种能力标准化了

### 3.6.1 innerHTML属性

- `innerHTML`属性 会返回元素所有后代的HTML字符串，包括元素、注释和文本节点
    - 写入`innerHTML` 时，会根据提供的字符串值以新的DOM子树替代元素中原来包含的所有节点
    - [DOM Parsing and Serialization](https://w3c.github.io/DOM-Parsing/#dom-innerhtml-innerhtml) 规范定义了[InnerHTML](https://w3c.github.io/DOM-Parsing/#dom-innerhtml-innerhtml)混入接口，Element 接口包含了InnerHTML接口，如下
        
        ```jsx
        interface mixin InnerHTML {
          [CEReactions] attribute [LegacyNullToEmptyString] DOMString innerHTML;
        };
        
        **Element includes InnerHTML;**
        ShadowRoot includes InnerHTML;
        ```
        
    - `innerHTML` 属性返回的文本内容会因浏览器实现而不同
        - IE和Opera会把所有元素标签转换为大写
        - Safari、Chrome和Firefox则会按照文档源代码的格式返回，包含空格和缩进
        - 不要指望不同的浏览器的innerHTML会返回完全一样的值
    - 在写入模式下，赋给`innerHTML` 属性的值会被解析为DOM子树，并替代元素之前的所有节点
        - 所赋的值默认以HTML格式识别，其中的所有标签都会以浏览器处理HTML的方式转换为元素
        - 如果赋值中不包含任何HTML标签，则直接生成一个文本节点
    - 如果给`innerHTML`设置包含HTML（标签）的字符串时，它在实际渲染时会进行转义处理识别
    
    ```jsx
    <body>
      <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        const ul = document.querySelector("ul");
        console.log(ul.innerHTML);
        ul.innerHTML = "<li>item4</li>"
        console.log(ul.innerHTML);
      </script>
    </body>
    ```
    
    ![innerHTML.png](3%20HTML5/innerHTML.png)
    
    - 可以看到如上的`innerHTML` 直接打印出来是有换行，空格的

### 3.6.2 旧IE中的innerHTML

- 在所有现代浏览器中，通过innerHTML插入的<script>标签是不会执行的的
- 而在IE8及之前的版本中，只要这样插入<script>元素指定了defer属性，且<script>之前是“受控元素”（scoped element），那就是可以执行的
    - <script>，<style>元素和注释元素都是“非受控元素（NoScope Element）”，也就是在页面上看不到它们
    - IE会把`innerHTML`中从非受控元素开始的内容都删掉
    
    ```jsx
    <body>
      <script>
        document.body.innerHTML = "<script defer>console.log('hi!')<\/script>";
      </script>
    </body>
    ```
    
    - 如果想要旧版本IE中执行临时插入的script，只需要在前面添加受控元素就行，如下
    
    ```jsx
    document.body.innerHTML = "_<script>console.log('hi!')<\/script>";
    document.body.innerHTML = "<div>&nbsp;</div><script>console.log('hi!')<\/script>";
    document.body.innerHTML =
            "<input type='hidden'><script>console.log('hi!')<\/script>";
    ```
    
    - 第三行会是最好的方案，因为不会有受控元素内容显示
- 在IE中，通过innerHTML插入<style>也会有类似的问题，因为在IE8中<style>也被认为是非受控元素；现代浏览器中通过innerHTML可以成功设置样式
    
    ```jsx
    document.body.innerHTML =
      "<style>body { background-color: red; }<\/style>";
    document.body.innerHTML =
      "<input type='hidden'><style>body { background-color: red; }<\/style>";
    ```
    
    - 在现代浏览器中两个语句的style都会生效，但是在IE8及以下版本只有第二个会生效

<aside>
💡 注意：Firefox在内容类型为application/xhtml+xml的XHTML文档中对innerHTML更加严格。在XHTML文档中使用innerHTML，必须使用格式良好的XHTML代码。否则，在Firefox会静默失败

</aside>

### 3.6.3 outerHTML属性

- 读取outerHTML属性时，会返回调用它的元素（及所有后代元素）的HTML字符串
    - 在写入outerHTML属性时，调用它的元素会被传入的HTML字符串经解释后生成的DOM子树取代
    
    ```jsx
    <body>
      <div class="content">
        <p>This is a <strong>paragraph</strong> with a list following it.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
      <script>
        const div = document.querySelector("DIV");
        console.log(div.innerHTML);
        console.log(div.outerHTML);
      </script>
    </body>
    ```
    
    ![outerHTML.png](3%20HTML5/outerHTML.png)
    
    - `outerHTML` 属性的返回值与`innerHTML`的区别在于它包含调用元素节点自身
- 修改`outerHTML`属性会连带元素节点被修改，如下
    
    ```jsx
    <body>
      <div>
        <p>Hello, world!</p>
      </div>
      <script>
        const div = document.querySelector("div");
        div.outerHTML = "<p>Hello, mangwu</p>";
      </script>
    </body>
    ```
    
    <div>节点的outerHTML被修改为一个p节点，如下
    
    ![outerHTML2.png](3%20HTML5/outerHTML2.png)
    

### 3.6.4 insertAdjacentHTML()与insertAdjacentText()

- 关于插入标签的最后两个新增方法是insertAdjacentHTML()和insertAdjacentText()
    - 这两个方法最早源于IE
    - 它们都接收两个参数：要插入标记的位置和要插入的HTML或文本
    - 第一个参数（不区分大小写）必须是下列值其中一个
        - [ ]  “beforebegin”, 插入当前元素前面，作为前一个同胞节点
        - [ ]  “afterbegin”，插入当前元素内部，作为新的子节点或放在第一个子节点前面
        - [ ]  “beforeend”，插入当前元素内部，作为新的子节点或放在最后一个子节点后面
        - [ ]  “afterend”，插入当前元素后面，作为下一个同胞节点
    - 第二个参数会作为HTML字符串解析（与innerHTML和outerHTML相同），或作为纯文本解析（与innerText和outerText相同），如果是HTML，则会在解析出错时抛出错误。
- [Element](https://dom.spec.whatwg.org/#element) 接口扩展了这两个接口，`insertAdjacentHTML`在[DOM-Paring](https://w3c.github.io/DOM-Parsing/#dom-element-insertadjacenthtml) 规范中定义了，`insertAdjacentText` 在[DOM](https://dom.spec.whatwg.org/#dom-element-insertadjacenttext)规范中有提及
    
    ```jsx
    <body>
        <div class="content">
          <div class="sss">sss</div>
          <div class="kkk">kkk</div>
          <div class="mmm">mmm</div>
        </div>
        <script>
          const content = document.querySelector(".content");
          // 作为前一个同胞节点插入
          content.insertAdjacentHTML("beforebegin", "<p>Hello world!</p>");
          content.insertAdjacentText("beforebegin", "Hello world!");
    
          // 作为第一个子节点插入
          content.insertAdjacentHTML("afterbegin", "<p>Hello world!2</p>");
          content.insertAdjacentText("afterbegin", "Hello world!2");
    
          // 作为最后一个子节点插入
          content.insertAdjacentHTML("beforeend", "<p>Hello world!3</p>");
          content.insertAdjacentText("beforeend", "Hello world!3");
    
          // 作为下一个同胞节点插入
          content.insertAdjacentHTML("afterend", "<p>Hello world!4</p>");
          content.insertAdjacentText("afterend", "Hello world!4");
    
        </script>
      </body>
    ```
    
    ![insert.png](3%20HTML5/insert.png)
    

<aside>
💡 注意，在DOM规则中还定义了一个**[insertAdjacentElement](https://dom.spec.whatwg.org/#dom-element-insertadjacentelement)** 方法，用于给节点插入元素节点，第一个参数和上面两个方法的第一个参数值一样，但是第二个参数应该是一个元素节点，而不是HTML格式文本或文本字符串；《JavaScript高级程序设计（第4版）》没有介绍它的原因是它是**非法（legacy）**的（实际上insertAdjacentText也是非法的方法）

</aside>

### 3.6.5 内存与性能问题（Memory and Performance Issues）

- 使用本节[3.6 插入标记（Markup Insertion）](3%20HTML5.md) 介绍的方法和属性替换节点可能在浏览器（特别是IE）中可能导致内存问题
    - 如果被移除子树元素中之前有关联的事件处理程序或其它JavaScript对象（作为元素的属性），那么它们之间的绑定关系会滞留在内存中（内存泄漏）
    - 并且频繁使用插入标记的属性和方法，页面占用的内存就会持续攀升，在手动使用`innerHTML` 、`outerHTML` 、`insertAdjacentHTML()` 之前，最好手动删除要被替换的元素上关联的事件处理程序和JavaScript对象
- 一般而言，插入大量新HTML使用innerHTML比使用多次DOM操作创建节点再插入来的更便捷
    - 因为HTML**解析器**（**parser**）会解析设置给innerHTML（或outerHTML）的值
    - 解析器在浏览器中是底层代码（通常是C++代码），比JavaScript快得多
- 不过HTML解析器的构建和解构（creation and destruction）也不是没有代价，因此最好限制使用`innerHTML`和`outerHTML` ,如下代码创建一些列表项就是返例
    
    ```jsx
    <body>
      <ul></ul>
      <script>
        const values = ["hello", "message", "mangwu", "hms", "AliOs", "afraid"];
        const ul = document.querySelector("ul");
        for (const value of values) {
          ul.innerHTML += `<li>${value}</li>`;
        }
      </script>
    </body>
    ```
    
    - 这段代码效率低下，因为每次迭代都要设置一次innerHTML
    - 不仅如此，每次循环还要先读取`innerHTML` ，多次使用HTML解析器的构建和解构，代价会增加
- 解决方案为先通过循环构建一个独立的字符串，最后一次性把生成的字符串赋值给`innerHTML` ，如下
    
    ```jsx
    let itemsHTML = "";
    for (const value of values) {
      itemsHTML += `<li>${value}</li>`;
    }
    ul.innerHTML = itemsHTML;
    ```
    

### 3.6.6 跨站点脚本（**Cross-Site Scripting Considerations**）

- 尽管`innerHTML`不会执行自己创建的<script>标签，但仍然向恶意用户暴露了很大的攻击面，因为通过它可以毫不费力地创建并执行`onclick`之类的属性
- 如果页面要使用用户提供的信息，不建议使用`innerHTML`
    - 与使用innerHTML获得的方便相比，防止XSS攻击更让人头疼
    - 此时一定要隔离要插入的数据，在插入页面前必须毫不犹豫地使用相同的库对它们进行转义

### 3.6.7 scrollIntoView()

- DOM规范中没有涉及的一个问题是如何滚动页面中的某个区域
    - 不同浏览器实现了不同的控制滚动的方式
    - 在所有这些专有方法中，HTML5选择了标准化`scrollIntoView()`
- `scrollIntoView` 方法定义在[CSSOM View Module](https://w3c.github.io/csswg-drafts/cssom-view/#dom-element-scrollintoview) 标准中，`scrollIntoView`方法定义在[Element的扩展接口](https://w3c.github.io/csswg-drafts/cssom-view/#extension-to-the-element-interface)中，在有详细的介绍
    
    ```jsx
    enum ScrollBehavior { "auto", "smooth" };
    
    dictionary ScrollOptions {
        ScrollBehavior behavior = "auto";
    };
    
    enum ScrollLogicalPosition { "start", "center", "end", "nearest" };
    dictionary ScrollIntoViewOptions : ScrollOptions {
      ScrollLogicalPosition block = "start";
      ScrollLogicalPosition inline = "nearest";
    };
    
    dictionary CheckVisibilityOptions {
        boolean checkOpacity = false;
        boolean checkVisibilityCSS = false;
    };
    partial interface Element {
      DOMRectList getClientRects();
      [NewObject] DOMRect getBoundingClientRect();
    
      boolean checkVisibility(optional CheckVisibilityOptions options = {});
    
      **undefined scrollIntoView(optional (boolean or ScrollIntoViewOptions) arg = {});**
      undefined scroll(optional ScrollToOptions options = {});
      undefined scroll(unrestricted double x, unrestricted double y);
      undefined scrollTo(optional ScrollToOptions options = {});
      undefined scrollTo(unrestricted double x, unrestricted double y);
      undefined scrollBy(optional ScrollToOptions options = {});
      undefined scrollBy(unrestricted double x, unrestricted double y);
      attribute unrestricted double scrollTop;
      attribute unrestricted double scrollLeft;
      readonly attribute long scrollWidth;
      readonly attribute long scrollHeight;
      readonly attribute long clientTop;
      readonly attribute long clientLeft;
      readonly attribute long clientWidth;
      readonly attribute long clientHeight;
    };
    ```
    
    - [ ]  `alignToTop` 是一个布尔值，布尔值作为第一个参数有如下含义
        - `true` ：窗口滚动后元素的顶部与视口顶部对齐
        - `false` ：窗口滚动后元素的底部与视口底部对齐
    - [ ]  `scrollIntoViewOptions` 是一个选项对象，属性和属性值有如下选择
        - `behavior` ：定义过渡动画，可取值为”smooth”，”auto”，默认为”auto”
        - `block` ：定义垂直方向的对齐，可取的值为“start‘、”center”、”end”和”nearest”，默认为”start”
        - `inline` ：定义水平方向的对齐，可取的值为”start“、”center”、”end”和”nearest”，默认为”nearset”
    - [ ]  不传递参数等同于`alignToTop` 为`true`
- 这个方法用的很少，MDN甚至都没有可视化的例子，总的来说，它就是用来设置父级容器中的子元素出现在视口时的行为（对齐方式，动画等）,下面是一个例子
    
    ```jsx
    <input type="submit" value="提交" />
    
    <p></p>
    	<div class="wrapper">
    	  <div class="special">JavaScript</div>
    	</div>
    <p></p>
    ```
    
    ```jsx
    let el = document.querySelector(".special");
    const submit = document.querySelector("input[type='submit']");
    
    // arg是页面选择的传递的参数，可以查看具体代码
    submit.addEventListener("click", () => {
      if (arg.type === "arg1") {
        el.scrollIntoView(arg.value1);
      } else {
        el.scrollIntoView(arg.value2);
      }
    });
    ```
    
     完整代码查看[github](https://github.com/mangwu/javascript/blob/master/ProfessionalJavaScriptForWebDeveloper4/ch15%20-%20DOM%20Extensions/15.3%20HTML5/15.3.6%20Insertion%20Markup/15.3.6.6%20scrollIntoView.html)
    
    ![scrollIntoView.gif](3%20HTML5/scrollIntoView.gif)
    
    - 不同的参数有不同的效果
-