# 4. 事件类型（Event Type）

Web浏览器中可以发生很多不同类型的事件，包括用户行为事件（如鼠标单击），文档事件（如文档可以被加载），以及浏览器状态事件（如浏览器正在滚动）。这些事件都可以用来触发响应动作，从而提高 Web 浏览器的用户体验。

[如前所说](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89.md)，所发生的事件的类型决定了事件对象会保存的信息，DOM3 Events定义了如下事件类型：

- [ ]  **用户界面事件（UIEvent）**：涉及与BOM交互的通用浏览器事件
- [ ]  **焦点事件（FocusEvent）**：在元素获得和失去焦点时触发
- [ ]  **鼠标事件（MouseEvent）**：使用鼠标在页面上执行某些操作时触发
- [ ]  **滚轮事件**（**WheelEvent**）：使用鼠标滚轮（或类似设备）时触发
- [ ]  **输入事件**（**InputEvent**）：向文档中输入文本时触发
- [ ]  **键盘事件**（**KeyboardEvent**）:使用键盘在页面上执行某些操作时触发
- [ ]  **合成事件**（**CompositionEvent**）:在使用某种IME（**Input Method Editor，输入法编辑器**）输入字符时触发

除了这些事件类型外，HTML5还定义了另一组事件，而浏览器通常在DOM和BOM上实现专有事件

这些专有事件基本上都是根据开发者需求而不是按规范增加的，因此不同浏览器的实现可能不同

DOM3 Events在DOM2 Events基础上重新定义了事件，并增加了新的事件类型，所有主流浏览器都支持DOM2 Events和DOM3 Events

关于事件类型的规范，可以通过[w3.org/tr](https://www.w3.org/TR/?title=event&tag=dom)进行搜索

关于大部分的基于`Event`接口的事件类型，可以查看[MDN-interfaces_based_on_event](https://developer.mozilla.org/en-US/docs/Web/API/Event#interfaces_based_on_event)

# 4.1 用户界面事件（UI Events）

- 用户界面事件或UI事件不一定跟用户操作有关，这类事件在DOM规范出现之前就已经以某种形式存在了，保留它们是为了向后兼容
- UI Events的设计主要有两个目标
    - 第一个目标是设计一个**事件系统（event system）**，该系统允许注册事件监听器，并通过DOM树结构描述事件流；
    - 第二个目标是提供现有浏览器中使用的当前事件系统的一个公共子集，这是为了促进现有脚本和内容的互操作性

## 4.1.1 UIEvent

- `UIEvent`  是用户界面事件（User Interface Event）定义的统一接口，w3c组织对用户界面事件的规范地址为[UI Events](https://w3c.github.io/uievents/)，其接口定义如下
    
    ```jsx
    [Exposed=Window]
    interface UIEvent : Event {
      constructor(DOMString type, optional UIEventInit eventInitDict = {});
      readonly attribute Window? view;
      readonly attribute long detail;
    };
    dictionary UIEventInit : EventInit {
      Window? view = null;
      long detail = 0;
    };
    ```
    
    - `UIEvent`接口表示简单的用户界面事件，它继承`Event` 接口
    - `UIEvent`有构造函数，之前使用`UIEvent.initUIEvent()` 方法创建用户界面事件，这个方法仅为兼容性保留了，更推荐使用构造函数
- `UIEvent` 接口派生了关于具体的用户操作的其他事件接口：`MouseEvent` ，`TouchEvent` ，`FocusEvent` 、`KeyboardEvent` 、`WheelEvent` 、`InputEvent` 、`CompositionEvent`

**属性**

- `UIEvent.detail` ，只读属性，返回一个数字，当值为非空时，根据具体的事件类型返回点击次数
    - 对于`click`和`dbclick` 事件，`UIEvent.detail` 返回当前点击数
    - 对于`mousedown` 和`mouseup` 事件，`UIEvent.detail` 是1加上当前点击数
    - 对于其他`UIEvent`对象，`UIEvent.detail` 一直是0
- `UIEvent.view` ，只读属性，返回一个`window` 对象的**[代理（WindowProxy）**对象](https://developer.mozilla.org/en-US/docs/Glossary/WindowProxy)，它是产生事件的窗口对象的代理
    - 在浏览器中如果是用户操作产生的事件，它就是浏览器窗口`window` ，如下
        
        ```jsx
        btn.addEventListener("click", function (e) {
            console.log(e.view === window); // true
          },
        );
        ```
        

**构造函数**

- `UIEvent()` 构造函数配合`new` 关键字能创建一个用户界面事件，并且可以传递一个可选参数`eventInitDict`，用于给`detail` 和`view` 属性进行初始化
    
    ```jsx
    const uievent = new UIEvent("dbclick", { detail: 0, view: window });
    ```
    

## 4.1.2 用户界面事件的继承

- `UIEvent` 本身继承于`Event` 这个统一的事件接口，而`UIEvent` 也并非具体的事件接口，而是对用户界面这一个事件的抽象
- 参考[w3c-UIEvents](https://w3c.github.io/uievents/#event-types-list) 规范，它的继承关系如下
    
    ![event-inheritance.svg](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/event-inheritance.svg)
    

## 4.1.3 UIEvent的事件类型

- 用户界面事件模块包含与用户界面和文档操作相关联的基本事件类型
- 在《JavaScript高级程序设计（第4版）》中，事件类型包括`DOMActivate` 、`load`、`unload` 、`abort` 、`error` 、`select` 、`resize` 、`scroll` 这些事件类型
- 而实际上，在最新（2023年2月12日）的[UIEvent规范](https://w3c.github.io/uievents/#events-uievent-types)中，用户界面事件类型只包含`load` ，`unload` ，`abort` ，`error` 和`select`

🚫`**DOMActivate**`

- 这个**事件类型已经被弃用**，当然《JavaScript高级程序设计（第4版）》也对此进行了说明，该事件类型在DOM3 Events中已被废弃
- `DOMActivate` 原本是元素被用户通过鼠标或键盘操作激活时出触发（比click和keydown更通用），为了兼容性有些浏览器仍然实现了这个事件类型，但是不要使用，它是一个非法事件类型，参考[event-type-DOMActivate](https://w3c.github.io/uievents/#event-type-DOMActivate)
- `DOMActivate` 事件类型的事件对象~~属于`MouseEvent` 接口定义~~（引用自MDN，实际上[event-type-DOMActivate](https://w3c.github.io/uievents/#event-type-DOMActivate)只说了该事件类型的事件对象由UIEvent直接定义）的， 当按钮，链接或其他能改变状态的元素被激活时，用户代理必须派发这个事件
    
    ```jsx
    <button>click me</button>
    <script>
      const btn = document.querySelector("button");
      btn.addEventListener("DOMActivate", (e) => {
        console.log(e instanceof MouseEvent, e.type, e);
      });
    </script>
    ```
    
    - 在谷歌浏览器上测试点击后打印`false` ， `'DOMActivate'` 和一个`UIEvent` 事件对象

❓`**resize**`

- `resize`事件类型的事件对象原本在DOM2中属于`UIEvent` 接口，但是在DOM3中被移除了，下面是UIEvent规范中关于[changes-DOMEvents2to3Changes-event-types](https://w3c.github.io/uievents/#changes-DOMEvents2to3Changes-event-types) 对此的解释
    
    > 关于事件类型已经做了许多澄清，现在一致性是根据事件类型显式定义的，而不仅仅是在事件类型使用的接口方面。
    > 
    > 
    > “MutationEvents”已经被弃用（参考[注意：MutaionObserver接口的引入是为了取代废弃的MutationEvent](../14%20DOM/3%20MutationObserver%E6%8E%A5%E5%8F%A3.md) ），本规范早期草案中对在此命名空间下的支持也被删除了。
    > 
    > 调整大小事件类型(**resize event type**)不再冒泡；**鼠标移动事件**（**mousemove event**）现在是可取消的，反映了现有的浏览器实现。
    > 
- 参考MDN的规范引用，`resize` 事件类型的事件对象解释已被移到[CSSOM-View](https://drafts.csswg.org/cssom-view/#event-summary) 的规范中，定义如下
    
    
    | Event（事件） | Interface（接口） | canbubble（冒泡） | cancelable（可被取消默认行为） | Interesting targets（关注目标） | Description（描述） |
    | --- | --- | --- | --- | --- | --- |
    | resize | Event（MDN描述为UIEvent是错误的说法） | false | false | Window，VisualViewport（CSSOM-View扩展了Window接口，其中有一个visualViewport属性） | 当视口（viewport）被调整大小时向窗口（Window）触发（resize）事件；当可视视口（Visual Viewport）被调整大小时或布局被缩放时，在VisualViewport触发(resize)事件 |
    - **备注：**这里visual viewport相关的描述被画上横线，因为这里参考的MDN的规范引用是一个**最新提案（drafts）**，在最正式的CSSOMView规范（cssom-view-1）中，[12.3. Event summary](https://www.w3.org/TR/cssom-view-1/#event-summary)只涉及`Window`相关的`resize` 事件
    - 在**未来**，画横线部分可能成为正式标准（提案通过后）
- `resize` 事件大多数时候只能在`window` 对象上注册事件处理函数，如果想要监听普通元素的大小调整，可以尝试使用**[ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)**
- 不同浏览器在决定何时触发`resize` 事件上存在重大差异，IE、Safari、Chrome、Opera会在窗口缩放超过1像素时触发`resize` 事件，然后随着用户缩放浏览器窗口不断触发，**火狐早期版本**则只会在用户停止缩放浏览器窗口时触发`resize` 事件，无论如何都应该避免这个事件处理程序执行过多的计算，否则可能执行过于频繁而导致浏览器响应明确变慢（使用防抖函数即可）
    
    ```jsx
    <p>Resize the browser window to fire the <code>resize</code> event.</p>
    <p>Window height: <span id="height"></span></p>
    <p>Window width: <span id="width"></span></p>
    <script>
      const heightOutput = document.querySelector("#height");
      const widthOutput = document.querySelector("#width");
    
      function reportWindowSize() {
        heightOutput.textContent = window.innerHeight;
        widthOutput.textContent = window.innerWidth;
        console.log(window.event);
      }
    
      window.onresize = reportWindowSize;
    </script>
    ```
    
    ![resize event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/resize_event.gif)
    

❓`**scroll**`

- 和`resize` 类似，`scroll` 事件类型的事件对象在DOM2中原本属于`UIEvent` 接口，为了保持事件类型定义的一致性，它被移出了UIEvent规范的事件类型中，而是在CSSOM-View的[scrilling-events](https://www.w3.org/TR/cssom-view-1/#scrolling-events)进行了明确说明，定义如下
    
    
    | Event（事件） | Interface（接口） | canbubble（冒泡） | cancelable（可被取消默认行为） | Interesting targets（关注目标） | Description（描述） |
    | --- | --- | --- | --- | --- | --- |
    | scroll | Event | false | false | Document，elements（这里应该包括Element及其后代接口），VisualViewport | 分别在滚动视口（viewport）和滚动元素时对Document或元素触发滚动事件；当可视视口（Visual Viewport）被滚动时，在VisualViewport触发(scroll)事件 |
    - 备注：[同上](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md)
- `scroll` 事件在**以前的混杂模式**下，通常是监听`window` 对象以发现页面中相应元素变化，但是目前在标准模式下，对`Document` 以及元素的添加`scoll` 类型的事件监听器是正确的做法，可以通过这些被监听元素的`scrollLeft` 和`scrollTop` 属性获取垂直与水平滚动的距离
    
    ```jsx
    <div id="scroll-box" style="overflow: scroll; height: 300px; width: 300px">
      <p style="height: 400px; width: 400px;font-size: 25px;text-align: center;line-height: 500px;">Scroll me!</p>
    </div>
    <p id="output"><span>scrollLeft:0</span><span>scrollTop:0</span></p>
    <script>
      const element = document.querySelector("div#scroll-box");
      const output = document.querySelector("p#output");
    
      element.addEventListener("scroll", (event) => {
        output.innerHTML = `<span>scrollLeft:${element.scrollLeft}</span><span>scrollTop:${element.scrollTop}</span>`;
      });
    </script>
    ```
    
    ![scroll event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/scroll_event.gif)
    

### 4.1.3.1 load事件（The Load Event）

**基本表（参照[w3c-uievent](https://w3c.github.io/uievents/#event-type-load)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |
| --- | --- | --- | --- |
| load | Window，Document，Element | 由用户界面产生就是UIEvent，否则为Event | Async |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 不 | 不 | 没有 | 1. Event.target：已加载资源的普通对象；2. UIEvent.view：Window对象；3. UIEvent.detail：0 |

**定义**

- 当**DOM实现**（**DOM implementation**）完成资源（如文档）和所有的依赖资源（dependent resources，如图像，样式表或脚本）后，用户代理必须派发这个`load` 事件
    - 如果加载依赖资源的资源（如<link>，<script>）仍然可以通过DOM访问，那么加载失败的依赖资源绝对不能阻止此事件的触发
    - 分派此事件的事件对象被要求**至少是Document节点**

**指定事件处理程序**

- `load` 事件是JavaScript中最常用的事件，它会在整个页面加载完成后触发，可以通过两种方式指定`load` 事件
    - 通过调用`window` 对象的`addEventListener` 为`load` 事件类型的事件添加监听器
    - 向<body>元素添加`onload`事件

**场景**

1. 最常见场景，为`window` 对象添加`load` 事件监听器，定义监控页面加载完成后执行的行为，其中传递的`event` 事件对象是一个`Event` ，且`target` 是`Document` 类型的对象
    
    ```jsx
    <div></div>
    <script>
      const div = document.querySelector("div");
      window.addEventListener("load", (e) => {
        div.textContent = "Loaded!";
        console.log(e, e.target === document, e.currentTarget === window);
      });
      document.addEventListener("load", (e) => {
        console.log(e, e.target, e.currentTarget, "document");
      });
    </script>
    ```
    
    - 打印一个Event对象，两个`true` 布尔值
    - `document` 添加的`load` 事件监听器没有效果
2. 指定load事件处理程序的方式为向<body>元素添加onload属性，如下
    
    ```jsx
    <body
        onload="alert(event.target+'|loaded');console.log(event.target === document, event.currentTarget === window)"
      ></body>
    ```
    
    - 提示框的内容为“[object HTMLDocument]|loaded”,也就是说`load`事件对象的`event.target` 总是`document` 对象
    - 后面两个判断打印都是`true` 布尔值，`currentTarget` 并非`body` ，还是`window` ，这是一种特殊情况
    - 一般而言，任何在`window` 上发生的事件，都可以通过给<body>元素上对应的属性赋值来指定，因为HTML中没有`window` 元素，这实际上是为了保证**向后兼容的一个策略，**但所有浏览器都支持这个特殊情况
    - 最好使用第一种方式

<aside>
ℹ️ 注意，根据DOM2 Events，load事件应该在document而非window上触发，可以为了向后兼容，所有浏览器都在window上实现了load事件；现在的[规范里](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md)，`document` 上监听`load` 事件反而没有效果

</aside>

1. 为一般资源元素添加`load` 事件处理程序
    - 图片，视频等依赖外部的资源加载完成后也会触发`load` 事件
    - DOM中的图片和非DOM中的图片在加载完成后都会触发`load` 事件
    - 可以像2中一样，直接在<img>元素上添加onload属性指定事件处理程序
    - 也可以像1中一样，使用JavaScript为图片指定`load` 事件处理程序
        
        ```jsx
        <img
          src="./firefox registerProtocolHandler().gif"
          alt=""
          srcset=""
          onload="var p = document.createElement('p');p.style.overflow='scroll';p.textContent=`${event.target.src} loaded`;body.appendChild(p)"
        />
        <img
          src="./gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png"
          alt=""
        />
        <script>
          const img = document.querySelector(
            "img[src='./gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png']"
          );
          img.addEventListener("load", (e) => {
            console.log(e);
            const p = document.createElement("p");
            p.textContent = `${e.target.src} loaded`;
            p.style.overflow = "scroll";
            document.body.appendChild(p);
          });
        </script>
        ```
        
        ![Untitled](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/Untitled.png)
        
        - 在脚本代码中还对加载好的`load` 事件进行了打印，它是一个`Event` 对象
    - 因为图片资源是“本地的”且<img>元素是早已确定好的，所以可以直接使用`load` 类型进行事件监听
        - 如果<img>元素和图片资源都不是在DOM中确定好的，需要等待图片资源下载完毕后创建<img>元素引入到DOM结构中
        - 就需要在外层包裹一层`window` 加载完成后的监听器，这样就能确保页面加载完成，<img>元素也能正常添加了，如下
            
            ```jsx
            window.addEventListener("load", () => {
              let image = document.createElement("img");
              image.addEventListener("load", (e) => {
                console.log(e.target.src);
              });
              document.body.appendChild(image);
              image.src = "https://www.w3.org/2008/site/images/favicon.ico";
            });
            ```
            
            - 还需要注意的是，下载图片并不一定要把<img>元素添加到文档后才开始，只要给这个元素设置src属性就会开始下载
    - 在DOM0加载图片资源的远古时期，客户端并不是使用<img>元素的`src`来指定图片地址的
        - 而是使用`Image` 对象先加载图片
        - 然后像使用<img>元素一样使用`Image` 对象，只是不能把`Image` 对象添加到DOM树中，添加事件监听器和设置`src` 都是可行的（目前`Image` 对象经过测试也可以添加到DOM树中）
            
            ```jsx
            window.addEventListener("load", () => {
              let image = new Image(36, 36);
              image.addEventListener("load", (e) => {
                console.log(e.target.src);
              });
              document.body.appendChild(image);
              image.src = "https://www.w3.org/2008/site/images/favicon.ico";
            });
            ```
            
            - 《JavaScript高级程序设计（第4版）》提示有些浏览器会把`Image` 对象实现为<img>元素
2. 为脚本链接元素添加`load` 事件监听程序
    - 脚本(<script>)和链接(<link>)元素以非标准的方式支持`load`事件
    - <script>元素会在JavaScript文件加载完成后触发`load`事件，从而可以动态检测
        - 与图片不同，要下载JavaScript文件必须**同时指定src属性并把<script>元素添加到文档**中
        - 因此指定事件处理程序和指定`src`属性的顺序在这里并不重要
            
            ```jsx
            <script>
              window.addEventListener("load", () => {
                let script = document.createElement("script");
                script.addEventListener("load", (e) => {
                  console.log(`${e.target.src} loaded!`);
                });
                document.body.appendChild(script);
                script.src = "./17.4.1.3.4 main.js";
              });
            </script>
            ```
            
            - IE8及更早版本不支持<script>元素触发load事件
    - IE和Opera（现代浏览器大多支持）支持<link>元素触发load事件，因而支持动态检测样式表是否加载完成，和<script>节点一样，指定`href`属性并把<link>节点添加到文档之前不会下载样式表
        
        ```jsx
        <script>
          window.addEventListener("load", () => {
            let link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.addEventListener("load", (e) => {
              console.log(`${e.target.src} loaded!`);
            });
            document.documentElement.firstElementChild.appendChild(link);
            link.href = "./17.4.1.3.4 style.css";
          });
        </script>
        ```
        
        - 需要指定link元素的type和rel样式表才会生效

### 4.1.3.2 unload事件（The unload Event）

**基本表（参照[w3c-uievent](https://w3c.github.io/uievents/#event-type-unload)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |
| --- | --- | --- | --- |
| unload | Window，Document，Element | 由用户界面产生就是UIEvent，否则为Event | Sync |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 不 | 不 | 没有 | 1. Event.target：已加载资源的普通对象；2. UIEvent.view：Window对象；3. UIEvent.detail：0 |
- 注意unload事件是同步的，而load事件是异步的

**定义**

- 当用户代理从环境中移除资源（如文档）或任何依赖资源（如图像，样式表，脚本）时，用户代理必须分派`unload` 事件
    - 并且DOM文档在分派`unload` 事件后必须被**卸载**（**unloaded**）
    - 和`load` 事件一样，分派此事件的事件对象被要求**至少是Document节点**

**避免使用**

- [MDN提示](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event#usage_notes)开发者应该**尽量避免使用这个事件**，因为这个事件不会可靠地触发

> 特别是在移动设备上，`unload` 事件并**不会可靠地**触发，例如，在以下场景中
> 
> 1. 移动用户访问您的页面
> 2. 然后用户切换到另外一个不同的程序（app）
> 3. 稍后，用户从应用管理器中关闭浏览器（`unload` 事件无法触发）
> 
> 除此之外，`unload` 事件与**后退/前进缓存（back/forward cache，bfcache）**不兼容，因此许多使用此事件的页面都假定在触发事件后页面将不存在
> 
> 为了解决这个问题，一些浏览器（比如火狐）在页面注册了`unload` 事件的情况下，不会使用后退/前进缓存，但是这样做会对性能造成影响；而Chrome的解决方案为，在用户导航离开时，不会触发页面的`unload` 事件
> 

**使用场景**

- `unload` 事件会在文档卸载完成后触发，它一般是从一个页面导航到另外一个页面时触发，可以**用来清理原页面的引用，以避免内存泄漏**
- 与`load` 事件类似，注册事件处理程序的方式也有两种
    1. 通过JavaScript方式，在`window` 对象上注册`unload` 事件
        
        ```jsx
        <script>
          window.addEventListener("unload", (e) => {
            console.log("Unloaded");
            alert("Hello, unloaded");
          });
        </script>
        ```
        
    2. 给<body>元素添加`onunload` 属性
        
        ```jsx
        <body onunload="console.log(event.type)">
        ```
        
- 无论使用哪种方式，都要注意事件处理程序中的代码不要再使用DOM结构，因为`unload` 事件在页面卸载完成后触发，所以不能使用页面加载后才有的对象，访问DOM或修改页面外观

<aside>
💡 注意，根据DOM2 Events，unload事件应该在document而非window上触发，可以为了向后兼容，所有浏览器都在window上实现了unload事件；现在的[规范里](https://w3c.github.io/uievents/#event-type-unload)，`*document` 上监听`unload` 事件反而没有效果*（无法验证）

</aside>

### 4.1.3.3 abort事件(The Abort Event)

**基本表(参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-abort))**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |
| --- | --- | --- | --- |
| abort | Window，Element | 由用户界面产生就是UIEvent，否则为Event | Sync |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 不 | 不 | 没有 | 1. Event.target：已加载资源的普通对象；2. UIEvent.view：Window对象；3. UIEvent.detail：0 |

**定义**

- 当资源的加载被**中止**（**aborted**）时，用户代理必须分派此事件，例如用户取消正在加载的资源进程
- 通常进行资源加载的元素是<object>类的元素，或者称为HTML嵌入对象元素，表示引入一个外部资源（《JavaScript高级程序设计（第4版）》所述，但是“不能。<object>元素不支持abort事件。”——chatgpt）

**场景**

根据MDN的搜索接过，可以注册`abort` 事件的对象类型有`HTMLMediaElement` ，`AbortSignal` 和`XMLHttpRequest` 而`HTMLObjectElement`

1. `HTMLMediaElement` 接口可以注册`abort` 事件，继承其的`HTMLVideoElement` 接口也就是<video>元素，它也可以注册`abort`事件；该事件会在网络中断或者当用户停止加载视频时被触发
    
    ```jsx
    <video controls width="250"></video>
    <script>
      const video = document.querySelector("video");
      const videoSrc =
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm";
    
      video.addEventListener("abort", () => {
        console.log(`Abort loading: ${videoSrc}`);
      });
      video.src = videoSrc;
    </script>
    ```
    
    - 经过多次网络测试，无法实现终止视频的网络请求以触发<video>元素的`abort` 事件
2. `AbortSignal` 接口主要用于对正在发生的网络请求作出取消操作
    - 它是一个可以监听 `abort` 事件，也可以实现跨域中断请求的 API ，用来取消对应请求，避免网络传输中产生资源浪费
    - 它和`AbortController` 是一对搭档，通常配合一起使用，`AbortController`可以用来控制`AbortSignal`发出中断信号，`AbortSignal`来接收中断信号并根据此进行响应
    - 通常都是先创建一个`AbortController` 对象，使用的`signal` 属性来间接创建一个`AbortSignal` 对象，然后使用`AbortController` 对象调用`abort()`方法，向 `AbortSignal.aborted`属性发出信号告知浏览器取消当前的网络请求
    - 在事件目标的**`EventTarget.addEventListener()`** 方法的第三个参数的`signal` 属性就是一个`AbortSignal` ，但调用`signal`对应的`AbortController` 的`abort()` 方法是为了从事件目标上**移除**事件处理程序
        
        ```jsx
        <button class="download">download</button>
        <button class="abort">Abort</button>
        <script>
          const controller = new AbortController();
          const signal = controller.signal;
        
          const url =
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm";
          const downloadBtn = document.querySelector(".download");
          const abortBtn = document.querySelector(".abort");
        
          downloadBtn.addEventListener("click", fetchVideo);
        
          abortBtn.addEventListener("click", () => {
            controller.abort();
            console.log("Download aborted");
          });
          signal.addEventListener("abort", (e) => {
            const p = document.createElement("p");
            console.log(e);
            p.textContent = "You have aborted downloading the video";
            document.body.appendChild(p);
          });
          function fetchVideo() {
            fetch(url, { signal })
              .then((response) => {
                console.log("Download complete", response);
              })
              .catch((err) => {
                console.error(`Download error: ${err.message}`);
              });
          }
        </script>
        ```
        
        ![AbortSignal abort event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/AbortSignal_abort_event.gif)
        
        - 同时会在控制台打印一个`Event` 对象和”Download aborted“
        - 如果网络请求速度太快可以在Devtools中模拟网速，如下
            
            ![devtools network moni.png](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/devtools_network_moni.png)
            
3. `XMLHttpRequest`对象可以注册abort事件，它本身就是就是与服务器进行网络请求交互的API，所以对网络资源请求的各种状态会有相关的事件注册实现，参考[XMLHttpRequest Standard](https://xhr.spec.whatwg.org/#interface-xmlhttprequest) ，相关事件处理器接口定义如下
    
    ```jsx
    [Exposed=(Window,DedicatedWorker,SharedWorker)]
    interface XMLHttpRequestEventTarget : EventTarget {
      // event handlers
      attribute EventHandler onloadstart;
      attribute EventHandler onprogress;
      attribute EventHandler onabort;
      attribute EventHandler onerror;
      attribute EventHandler onload;
      attribute EventHandler ontimeout;
      attribute EventHandler onloadend;
    };
    
    ...
    
    [Exposed=(Window,DedicatedWorker,SharedWorker)]
    interface XMLHttpRequest : XMLHttpRequestEventTarget {
      constructor();
    
    	undefined abort();
    }
    ```
    
    - 和`AbortSignal` 类似，`XMLHttpRequest` 对象也有一个`abort()` 方法用于终止网络请求
    - 不过`XMLHttpRequest` 对象是对自己的`send()` 方法发送的网络请求进行中止，而`AbortSignal` 必须绑定到相关的异步操作（如上面例子的`fetch`）中才能中止绑定的异步操作的网络请求
        
        ```jsx
        <div class="controls">
        <input
          class="xhr success"
          type="button"
          name="xhr"
          value="Click to start XHR (success)"
        />
        <input
          class="xhr error"
          type="button"
          name="xhr"
          value="Click to start XHR (error)"
        />
        <input
          class="xhr abort"
          type="button"
          name="xhr"
          value="Click to start XHR (abort)"
        />
        </div>
        
        <textarea readonly class="event-log"></textarea>
        <script>
        const xhrButtonSuccess = document.querySelector(".xhr.success");
        const xhrButtonError = document.querySelector(".xhr.error");
        const xhrButtonAbort = document.querySelector(".xhr.abort");
        const log = document.querySelector(".event-log");
        
        function handleEvent(e) {
          log.textContent = `${log.textContent}${e.type}: ${e.loaded} bytes transferred\n`;
        }
        
        function addListeners(xhr) {
          xhr.addEventListener("loadstart", handleEvent);
          xhr.addEventListener("load", handleEvent);
          xhr.addEventListener("loadend", handleEvent);
          xhr.addEventListener("progress", handleEvent);
          xhr.addEventListener("error", handleEvent);
          xhr.addEventListener("abort", handleEvent);
        }
        
        function runXHR(url) {
          log.textContent = "";
        
          const xhr = new XMLHttpRequest();
          addListeners(xhr);
          xhr.open("GET", url);
          xhr.send();
          return xhr;
        }
        
        xhrButtonSuccess.addEventListener("click", () => {
          runXHR("dgszyjnxcaipwzy.jpg");
        });
        
        xhrButtonError.addEventListener("click", () => {
          runXHR("https://somewhere.org/i-dont-exist");
        });
        
        xhrButtonAbort.addEventListener("click", () => {
          runXHR("dgszyjnxcaipwzy.jpg").abort();
        });
        </script>
        ```
        
        ![XHR abort event .gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/XHR_abort_event_.gif)
        
        - 这个例子很经典，它不仅让`XMLHttpRequest` 对象注册了`abort` 事件，还注册了和网络请求相关的`loadstart` ，`load` ，`loadend` ，`progress` 和`error` 事件，并进行了对三种常见的网络请求最终状态的事件触发情况进行了记录
            - 请求成功：按照`loadstart` 、`progress` 、`load` 、`loadend` 的顺序触发事件
            - 请求失败：按照`loadstart` 、`error` 、`loadend` 的顺序触发事件
            - 请求中断：按照`loadstart` 、`abort` 、`loadend` 的顺序触发事件
        - 注意`XMLHttpRequest` 相关的网络请求状态事件都是`ProgressEvent` 接口实现（继承于`Event`）

### 4.1.3.4 select事件（The Select Event）

**基本表(参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-select))**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |
| --- | --- | --- | --- |
| select | Element | 由用户界面产生就是UIEvent，否则为Event | Sync |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 冒泡 | 不 | 没有 | 1. Event.target：已加载资源的普通对象；2. UIEvent.view：Window对象；3. UIEvent.detail：0 |

**定义**

- 当用户选择某些文本后，用户代理必须分派此事件，此事件会在选择发生后分派
    - 如果想要访问用户选择的内容，内容作者将使用宿主语言的本机功能（**native capabilities**），例如HTML Editing API [[Editing](https://www.w3.org/TR/selection-api/#extensions-to-document-interface)]的`Document.getSelection()`方法，会返回一个有关被选择内容的**`[Selection](https://www.w3.org/TR/selection-api/#dom-selection)**`对象
        
        <aside>
        ℹ️ 注意，在DOM相关章节在介绍`Document` 接口时没有说过`getSelection()` 方法，因为它属于[Selection-API](https://www.w3.org/TR/selection-api/)规范，是对相关接口的扩展规范，而非DOM Standard，参考[w3/tr/selection-api/#extensions-to-document-interface](https://www.w3.org/TR/selection-api/#extensions-to-document-interface)
        
        </aside>
        
    - 选择事件可能不是对所有语言中的所有元素都适用，例如在HTML5中，选择事件事件只能在**表单输入和文本区域元素**上分派
    - 而有些实现认为可以在任何合适的上下文中分派选择事件，包括form控件之外的文本选择，或者SVG中的标记选择和图形选择
- 《JavaScript高级程序设计（第4版）》说明选择事件是在文本框（<input>或textarea）上当用户选择了一个或多个字符时触发的（狭义正确的）

**场景**

根据MDN搜索，select事件的可信目标对象为`HTMLInputElement` 和`HTMLTextAreaElement`（当然可能更宽泛），目前可被选择的DOM元素为<textarea>和<input>

```jsx
<input value="Try selecting some text in this element." />
<p id="log"></p>
<script>
  const log = document.getElementById("log");

  function logSelection(event) {
    const selection = event.target.value.substring(
      event.target.selectionStart,
      event.target.selectionEnd
    );
    log.textContent = `You selected: ${selection}`;
  }

  const input = document.querySelector("input");
  input.addEventListener("select", logSelection);

</script>
```

![input select event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/input_select_event.gif)

```jsx
<textarea rows="10" readonly>
Try selecting some text in this element. Your selection will be recorded.</textarea
  >
<p id="log"></p>
<script>
  const log = document.getElementById("log");

  function logSelection(event) {
    const selection = event.target.value.substring(
      event.target.selectionStart,
      event.target.selectionEnd
    );
    log.textContent = `You selected: ${selection}`;
  }

  const textarea = document.querySelector("textarea");
  textarea.addEventListener("select", logSelection);
</script>
```

![textarea select event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/textarea_select_event.gif)

### 4.1.3.5 error 事件（The Error Event）

**基本表(参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-error))**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |
| --- | --- | --- | --- |
| error | Window，Element | 由用户界面产生就是UIEvent，否则为Event | Async |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 不 | 不 | 没有 | 1. Event.target：已加载资源的普通对象；2. UIEvent.view：Window对象；3. UIEvent.detail：0 |
- 注意`error` 事件是异步的

**定义**

- 当资源加载失败，或者已经加载但是不能根据其语义进行解释（例如无效图像，脚本执行执行错误，或格式不正确的XML）时，用户代理必须分派`error` 事件

**场景**

- 《JavaScript高级程序设计（第4版）》对触发`error` 事件的场景介绍了如下4种
    1. 在window上JavaScript报错时
    2. 在<img>元素上无法加载指定图片时
    3. 在<object>元素上无法加载相应对象时
    4. 在窗套上当一个或多个窗格无法完成加载时
- 在MDN中搜索`error` 事件，可以注册`error` 事件的元素有
    1. `Window` 可以注册`error` 事件，当资源加载失败或无法使用时，在`window` 对象上触发`error` 事件，例如加载的脚本资源执行错误
        
        ```jsx
        <div class="controls">
          <button id="script-error" type="button">Generate script error</button>
          <img class="bad-img" />
        </div>
        
        <div class="event-log">
          <label for="eventLog">Event log:</label>
          <textarea
            readonly
            class="event-log-contents"
            rows="8"
            cols="30"
            id="eventLog"
          ></textarea>
        </div>
        <script>
          const log = document.querySelector(".event-log-contents");
        
          window.addEventListener("error", (event) => {
            log.textContent = `${log.textContent}${event.type}: ${event.message}\n`;
            console.log(event);
          });
        
          const scriptError = document.querySelector("#script-error");
          scriptError.addEventListener("click", () => {
            const badCode = "const s;";
            eval(badCode);
          });
        </script>
        ```
        
        - 使用`eval` 函数在<script>元素中执行错误的JavaScript代码以模拟script资源执行出错
        - 在点击按钮的同时，控制台会打印出一个`ErrorEvent` 对象
        
        ![window error event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/window_error_event.gif)
        
    2. 元素（Element）对象也可以注册`error` 事件，当一个元素加载资源失败或无法使用时就会触发；例如<img>元素上无法加载指定图片或加载了不可用
        
        ```jsx
        <div class="controls">
          <button id="img-error" type="button">Generate image error</button>
          <img class="bad-img" />
        </div>
        
        <div class="event-log">
          <label for="eventLog">Event log:</label>
          <textarea
            readonly
            class="event-log-contents"
            rows="8"
            cols="30"
            id="eventLog"
          ></textarea>
        </div>
        <script>
          const log = document.querySelector(".event-log-contents");
        
          const badImg = document.querySelector(".bad-img");
          badImg.addEventListener("error", (event) => {
            log.textContent += `${event.type}: Loading image\n`;
            console.log(event);
          });
        
          const imgError = document.querySelector("#img-error");
          imgError.addEventListener("click", () => {
            badImg.setAttribute("src", "i-dont-exist");
          });
        </script>
        ```
        
        - 加载一个不存在的图片会触发`error` 事件，但是这个`error` 事件是一个`Event`对象
        
        ![elements error event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/elements_error_event.gif)
        
    3. **`XMLHttpRequest`** 对象可以注册`error` 事件，就像在`abort` 事件中的例子一样，但网络请求遇到错误时就会触发，参考[abort-xmlhttprequest](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md) ，需要注意这里的`error` 事件是一个`ProgressEvent` 对象
    4. **`WebSocket`** 对象也可以注册`error` 事件，当与`WebSocket` 的连接由于错误而关闭时（例如某些数据无法发送）触发`error` 事件
        
        ```jsx
        <div class="controls">
          <button id="img-error" type="button">Generate webscoket error</button>
          <img class="bad-img" />
        </div>
        
        <div class="event-log">
          <label for="eventLog">Event log:</label>
          <textarea
            readonly
            class="event-log-contents"
            rows="8"
            cols="30"
            id="eventLog"
          ></textarea>
        </div>
        <script>
          const log = document.querySelector(".event-log-contents");
        
          const webscoketError = document.querySelector("button");
          webscoketError.addEventListener("click", () => {
            // Create WebSocket connection
            const socket = new WebSocket("ws://localhost:8080");
            // Listen for possible errors
            socket.addEventListener("error", (event) => {
              log.textContent = `${log.textContent}${event.type}:WebSocket connection to ${event.currentTarget.url} failed\n`;
              console.log(event);
            });
          });
        </script>
        ```
        
        - 点击按钮后新建`WebSocket` 对象连接一个无效的地址，在异步连接遇到错误后，就会触发`error` 错误
        
        ![websocket error event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/websocket_error_event.gif)
        

---

《JavaScript高级程序（第4版）》之后会介绍继承`UIEvent` 的一些有关用户界面操作的事件类型，但JavaScript中的事件类型远不只有UIEvent，它还包括与浏览器有关，与网络有关的一系列事件

![event-inheritance.svg](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/event-inheritance.svg)

参考UIEvent中的继承关系（如上）和MDN中基于Event接口[枚举的大部分事件](https://developer.mozilla.org/en-US/docs/Web/API/Event#interfaces_based_on_event)，整理了如图的事件接口图

![Event Inheritance Relationship.png](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/Event_Inheritance_Relationship.png)

- 不一定完整正确

# 4.2 焦点事件（Focus Events）

焦点事件在页面元素获得或失去焦点时触发，这些事件可以与`document.hasFocus()` 和`document.activeElement` 一起为开发者提供用户在页面导航中的焦点信息

## 4.2.1 `FocusEvent` 接口规范定义

- 参考[UIEvents-focuseevent](https://w3c.github.io/uievents/#events-focusevent) ，`FocusEvent` 的接口定义如下
    
    ```jsx
    [Exposed=Window]
    interface FocusEvent : UIEvent {
      constructor(DOMString type, optional FocusEventInit eventInitDict = {});
      readonly attribute EventTarget? relatedTarget;
    };
    dictionary FocusEventInit : UIEventInit {
      EventTarget? relatedTarget = null;
    };
    dictionary UIEventInit : EventInit {
      Window? view = null;
      long detail = 0;
    };
    dictionary EventInit {
      boolean bubbles = false;
      boolean cancelable = false;
      boolean composed = false;
    };
    ```
    
- [ ]  `FocusEvent.relatedTarget` ：只读属性，它是焦点事件第二个关联对象目标，其值取决于焦点事件的具体类型，如下
    
    
    | 事件名称 | target | relatedTarget |
    | --- | --- | --- |
    | blur | 失去焦点的事件目标（EventTarget） | 接收焦点的事件目标（EventTarget）（如果有的话） |
    | focus | 接收焦点的事件目标（EventTarget） | 失去焦点的事件目标（EventTarget）（如果有的话） |
    | focusin | 接收焦点的事件目标（EventTarget） | 失去焦点的事件目标（EventTarget）（如果有的话） |
    | focusout | 失去焦点的事件目标（EventTarget） | 接收焦点的事件目标（EventTarget）（如果有的话） |
    - 因为很多元素并不能成为焦点，所以`relatedTarget` 常常为`null` ，对于不能成为焦点的元素为其添加HTML属性`tabindex` 并指定它在焦点中的顺序即可让其可被聚焦
- [ ]  `FocusEvent()` ：焦点事件的构造函数，它会返回一个新创建的`FocusEvent` 对象，需要传递一个必选参数和一个可选参数，当焦点事件既有源又有目的（这里指焦点转移过程中的事件目标），可选参数中的`relatedTarget` 必须被指定为目的事件目标
    - `type` ：第一个参数，事件名称，字符串类型，大小写敏感，可传入`blur`，`focus`，`focusin`，`focusout`
    - `options` ：可选，一个`FocusEventInit` 对象，继承自`UIEventInit` ，而`UIEventInit` 又继承自`EventInit` ，所以除了`[bubbles`](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89.md) ，`[detail](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md)` 等属性外，还有`FocusEventInit` 本身定义的`relatedTarget` ，用于指定焦点事件的相关属性，默认为`null`

## 4.2.2 焦点事件类型（Focus Event Types）

- 《JavaScript高级程序设计（第4版）》对此每个焦点事件类型进行了简单的说明，还介绍了非法的焦点事件`DOMFocusIn`和`DOMFocusOut` ，DOM3 Events已经废弃了这两个焦点事件，转而使用`focusin`和`focusout`
- 参考[UIEvents-event-focus-types](https://w3c.github.io/uievents/#events-focus-types) ，下面对规范的焦点事件类型进行详细解释

### 4.2.2.1 `blur` 事件（The Blur Event）

**基本表(参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-blur))**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| blur | Window，Element | FocusEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 不 | 不 | 没有 | 能 | 1. Event.target：失去焦点的事件目标；2. UIEvent.view ：Window ；3.UIEvent.detail ：0；4.FocusEvent.relatedTarget ：接收焦点的事件目标 |

**定义**（参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-blur) 和《JavaScript高级程序设计（第4版））

- 当事件目标失去焦点时，用户代理必须分派此事件
    - 在分派此事件之前，必须从元素（失去焦点的事件目标）中取得焦点
    - 此类型类似于`focusout` ，但是触发时机在焦点转移之后，并且不会出现冒泡
- 切记 `blur`触发的事件目标是失去的焦点的元素，

**场景**

MDN介绍了关于失去焦点的两种应用，一种是对元素的（Element blur event），一种是对窗口的（Window blur Event）

1. Element blur event，一些元素可聚焦，一些不可聚焦的元素可以通过`tabindex` 属性设置为可聚焦
    
    ****可聚焦元素****
    
    - **链接**：`<a>`元素
    - **表单元素**：`<input>`， `<select>`，`<textarea>`， `<button>`
    - **窗口**：`<frame>`， `<iframe>`
    - **图像**：`<img>`
    - **音频/视频**：`<audio>`，`<video>`，`<embed>`
    - **对象**：`<object>`
    - **详细信息**：`<details>`
    
    > 另外，可以通过tabindex属性将元素设置为可聚焦，即使它们本身不具有可聚焦性质
    > 
    
    ```jsx
    // HTML
    <form id="form">
      <label
        >Some text:
        <input type="text" placeholder="text input" />
      </label>
      <label
        >Password:
        <input type="password" placeholder="password" />
      </label>
    </form>
    <a href="http://baidu.com">baidu</a>
    
    // JavaScript
    const form = document.getElementById("form");
    const text = document.querySelector("input[type='text']");
    form.addEventListener("focus", (event) => {
      **event.target.style.background = "pink";**
      console.log("form", "capture", "focus");
      }, true
    );
    form.addEventListener("focus", (event) => {
      console.log("form", "capture", "focus");
    });
    
    form.addEventListener(
      "blur",
      (event) => {
        **event.target.style.background = "";**
        console.log("form", "capture", "blur");
      },
      true
    );
    form.addEventListener("blur", (event) => {
      console.log("form", "bubbling", "blur");
    });
    
    text.addEventListener(
      "blur",
      (e) => {
        console.log("text", "captrue", "blur");
        setTimeout(() => {
          console.log("-----------------");
        }, 200);
      },
      true
    );
    text.addEventListener("blur", (e) => {
      console.log("text", "bubbling", "blur");
    });
    
    text.addEventListener(
      "focus",
      (e) => {
        console.log("text", "captrue", "focus");
      },
      true
    );
    text.addEventListener("focus", (e) => {
      console.log("text", "bubbling", "focus");
    });
    
    document.body.addEventListener("blur", (e) => {
      console.log(e.type, "body bubbling", e.type);
    });
    document.body.addEventListener(
      "blur",
      (e) => {
        console.log("body captrue", e.type);
      },
      true
    );
    
    document.body.addEventListener("focus", (e) => {
      console.log("body bubbling", e.type);
    });
    document.body.addEventListener(
      "focus",
      (e) => {
        console.log("body captrue", e.type);
      },
      true
    );
    
    const a = document.querySelector("a");
    a.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    a.addEventListener(
      "blur",
      (e) => {
        console.log("a", "captrue", "blur");
        setTimeout(() => {
          console.log("-----------------");
        }, 200);
      },
      true
    );
    a.addEventListener("blur", (e) => {
      console.log("a", "bubbling", "blur");
    });
    
    a.addEventListener(
      "focus",
      (e) => {
        console.log("a", "captrue", "focus");
      },
      true
    );
    a.addEventListener("focus", (e) => {
      console.log("a", "bubbling", "focus");
    });
    ```
    
    ![element focus blur event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/element_focus_blur_event.gif)
    
    - 根据上述的例子，可以对焦点事件和可被聚焦的元素得出一些**大致的结论：**
        - 焦点事件虽然**不能冒泡**，但是可以”**捕获**“，也就是说在**事件流的捕获阶段**，触发事件的事件目标的祖先节点仍然能捕捉到焦点事件
        - 利用事件的`target` 引用的始终是DOM结构中**触发事件的最深层的元素**这个特性，可以在**捕获阶段**对包裹表单控件的<form>元素注册`focus`和`blur` 事件以变化其中的表单控件出于焦点和离开焦点后的不同样式（如果在冒泡阶段注册就没有用处，因为焦点事件不会冒泡到form元素）
        - 焦点事件的捕获阶段的事件流顺序和一般的事件流顺序是一样的：`window` ⇒ `document` ⇒ `<html>` ⇒ `<body>` ⇒ … ⇒ `<form>` ⇒ `<input>`
        - 在捕获阶段事件流中除了`window` 外，其它所有事件目标的获得的事件都是`FocusEvent` ，~~并且`eventPhase` 属性值都是0（可能是因为不是完整事件流的原因吧~~,）（被画横线的文本为**错误理解**，浏览器窗口中的打印对象显示的属性都是**实时的**，在执行事件处理程序后，对象当然不在事件流中，所以都是0）
        - `window` 比较特殊，除了由于焦点元素被聚焦后产生的`FocusEvent` ，还有窗口自身的聚焦特性，根据浏览器实现不同，触发的事件的接口类型可能不同（谷歌中浏览器窗口被聚集触发的事件是`Event` ，而火狐中仍然是`FocusEvent`）,下面是`window`场景具体介绍
2. window blur event，窗口本身是可以被聚焦的，假设当前浏览器页面在`tab1` ，那么窗口的焦点就在`tab1` ，此时点击旁边的`tab2` 窗口，此时`tab1` 就会触发`blur` 事件，`tab2` 就会触发`focus` 事件
    - 这些焦点事件是单独的，与具体页面上的焦点无关
    - 但是如果当前窗口不是焦点，当窗口页面上的某个元素聚焦，也就当前窗口聚焦，`window` 会触发**自己的聚焦事件**，也会**捕获**到哪个元素触发的聚焦事件
    - 但是如果当前窗口已经是焦点，当前窗口页面上的焦点变化，**不会**触发window自己的焦点事件（因为此时window一直出于聚集状态），但是`window` 仍然会捕获页面内部元素的焦点事件
        
        ```jsx
        window.addEventListener("focus", (e) => {
          document.title = "🥰回来啦！";
        });
        window.addEventListener("blur", (e) => {
          document.title = "＞﹏＜不要离开。";
        });
        ```
        
        ![window focus blur event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/window_focus_blur_event.gif)
        
        - 注意谷歌浏览器这里的`blur` 和`focus` 事件是`Event` 接口类型的，火狐是`FocusEvent` 类型
        - `target` 引用的就是`window` ，对于谷歌浏览器而言不用关心`relatedTarget` （因为不存在），而火狐浏览器因为安全问题，这个值为`null`

### 4.2.2.2 `focus` 事件（The Focus Event）

**基本表(参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-focus))**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| focus | Window，Element | FocusEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 不 | 不 | 没有 | 能 | 1. Event.target：接收焦点的事件目标；2. UIEvent.view ：Window ；3.UIEvent.detail ：0；4.FocusEvent.relatedTarget ：失去焦点的目标（如果有的话） |

**定义**（参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-focus) 和《JavaScript高级程序设计（第4版））

- 当事件目标接收焦点时，用户代理必须分派此事件
    - 在分派此事件之前，必须将焦点放在事件目标上
    - 此类型类似于`focusin` ，但是触发时机在焦点转移之后，并且不会出现冒泡
- 切记`focus`触发的事件目标是获得的焦点的元素

**场景**

- 和`blur` 事件一样，二者是完全相反（opposite）的事件，但适用场景一样，适用于**可聚焦的页面元素**和`window` ，`focus` 事件对象的特性（事件流机制等）也和`blur` 类似，详情查看`blur`的[**场景**](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md)

### 4.2.2.3 `focusin` 事件（The Focusin Event）

**基本表(参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-focusin))**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| focusin | Window，Element | FocusEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 不 | 没有 | 能 | 1. Event.target：接收焦点的事件目标；2. UIEvent.view ：Window ；3.UIEvent.detail ：0；4.FocusEvent.relatedTarget ：失去焦点的目标（如果有的话） |

**定义**（参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-focusin) 和《JavaScript高级程序设计（第4版））

- 当事件目标**即将**接收焦点时，用户代理必须分派此事件
    - 此事件类型必须在事件目标被给予焦点前被分派
    - 此事件类型类似于`focus` ，但是触发时机在焦点转移之前（即将转移的时机），并且发生冒泡
- 切记`focusin` 触发的事件目标是即将获得焦点的元素

**场景**

- `focusin` 事件可以被window和element元素注册，但是适用场景不包括在`blur` 中提到的`window`独立的焦点事件，所以只对可被聚焦的元素有效，同时它可以冒泡，也就是说具有完整的事件流，故而DOM结构中的祖先节点在捕获阶段和冒泡阶段都能注册`forcusin` 事件，同时也包括`document` 和`window` 对象
    
    ```jsx
    // HTML
    <form id="form">
      <label
        >Some text:
        <input type="text" placeholder="text input" />
      </label>
      <label
        >Password:
        <input type="password" placeholder="password" />
      </label>
    </form>
    
    // JavaScript
    const form = document.getElementById("form");
    const text = document.querySelector("input[type='text']");
    const eventPhase = ["None", "Capture", "At_Target", "Bubbling"];
    const handler = (e, who) => {
      console.log(`${who} ${eventPhase[e.eventPhase]} ${e.type}`, e);
    };
    /**
     * @description 注册事件处理程序
     * @param {EventTarget} eventTarget
     * @param {function} handler
     * @param  {...any} args
     */
    function regesterHandler(eventTarget, handler, ...args) {
      eventTarget.addEventListener("focusin", (e) => handler(e, ...args));
      eventTarget.addEventListener("focusin", (e) => handler(e, ...args), true);
      eventTarget.addEventListener("focusout", (e) => handler(e, ...args));
      eventTarget.addEventListener("focusout", (e) => handler(e, ...args), true);
    }
    
    regesterHandler(text, handler, "text");
    regesterHandler(form, handler, "form");
    regesterHandler(document.body, handler, "body");
    regesterHandler(document.documentElement, handler, "documentElement");
    regesterHandler(document, handler, "document");
    regesterHandler(window, handler, "window");
    
    form.addEventListener("focusin", (e) => {
      e.target.style.backgroundColor = "red";
    });
    form.addEventListener("focusout", (e) => {
      e.target.style.backgroundColor = "";
    });
    ```
    
    ![element focusin focusout event.gif](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/element_focusin_focusout_event.gif)
    
    - 可以看到`focusin` 和`focusout` 事件和在[1. 事件流（Event Flow）](1%20%E4%BA%8B%E4%BB%B6%E6%B5%81%EF%BC%88Event%20Flow%EF%BC%89.md) 所述的事件传递机制是一样的
    - 事件流中每个事件处理器获得的事件对象都是`FocusEvent` 类型

### 4.2.2.4 `focusout` 事件（The Focusout Event）

**基本表(参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-focusout))**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| focusout | Window，Element | FocusEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 不 | 没有 | 能 | 1. Event.target：接收焦点的事件目标；2. UIEvent.view ：Window ；3.UIEvent.detail ：0；4.FocusEvent.relatedTarget ：失去焦点的目标（如果有的话） |

**定义**（参考[w3c-uievents](https://w3c.github.io/uievents/#event-type-focusout) 和《JavaScript高级程序设计（第4版））

- 当事件目标**即将**失去焦点时，用户代理必须分派此事件
    - 此事件类型必须在事件目标失去焦点前被分派
    - 此事件类型类似于`blur` ，但是触发时机在焦点转移之前（即将转移的时机），并且发生冒泡
- 切记`focusout` 触发的事件目标是即将失去焦点的元素

**场景**

- `focusout` 和`focusin` 是一对相反的元素，所以场景上二者也相似，都不包括在`blur` 中提到的`window`独立的焦点事件，所以只对可被聚焦的元素有效，同时它可以冒泡，也就是说具有完整的事件流，详情参考`focusin` 的[**场景**](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md)

## 4.2.3 焦点转移时的事件触发顺序（The ****Focus Event Order****）

- 参考uievent和《JavaScript高级程序设计（第四版》中对焦点事件发生顺序的描述，可以确定三种情况的焦点事件触发顺序:
    - 当前窗口页面没有任何焦点时，页面聚焦于一个元素后，其间的焦点事件触发顺序
    - 当前窗口有一个焦点时，页面不在聚焦任何元素后，期间的焦点事件触发顺序
    - 当前窗口有一个焦点时，页面聚焦到另一个元素后，期间的焦点事件触发顺序 （《JavaScript高级程序设计（第四版）考虑的）
1. 无焦点到聚焦于一个元素，期间触发的焦点事件顺序
    1. focusin，由即将聚焦的元素触发
    2. focus，由聚焦的元素触发
2. 有焦点到页面不存在焦点，期间触发的焦点事件顺序
    1. focusout，由即将失去焦点的元素触发
    2. blur，由失去焦点的元素触发
3. 有焦点到页面焦点聚焦到另一个元素，期间触发的焦点事件顺序
    1. focusout，由即将失去焦点的元素触发
    2. focusin，由即将获得焦点的元素触发
    3. blur，由失去焦点的元素触发
    4. focus，由获得焦点的元素触发
- ~~上述的三种情况任意组合就能得出复杂焦点转换的焦点事件触发顺序~~

<aside>
ℹ️ 注意：上述焦点事件触发顺序仅仅是规范定义的，浏览器的实际实现可能并非如此，**以具体的实现为准**

</aside>

---

- 实际上，虽然`UIEvent`规范和《JavaScript高级程序设计（第4版）》明确说明了`focusin`在`focus` 事件触发前触发，`focusout` 也在`blur` 触发前触发，但是**实际情况**是
    - 谷歌和火狐在实现焦点事件时，`focus` 和`focusin` 事件都在聚焦后触发，并且`focusin` 在`focus` 之后触发（与`focusin` 的[定义](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md) 不符合）
    - 同理，`blur`和`focusout` 事件都在失去焦点后触发，并且`focusout` 在`blur` 之后触发（与`focusout` 的[定义](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md)不符）
        
        ```jsx
        // HTML
        <form id="form">
          <label
            >Some text:
            <input type="text" placeholder="text input" />
          </label>
          <label
            >Password:
            <input type="password" placeholder="password" />
          </label>
        </form>
        // JavaScript
        text.addEventListener("focusin", (e) =>
          console.log(e.type, document.hasFocus())
        );
        text.addEventListener("focusout", (e) =>
          console.log(e.type, document.hasFocus())
        );
        text.addEventListener("focus", (e) => console.log(e.type, document.hasFocus()));
        text.addEventListener("blur", (e) => console.log(e.type, document.hasFocus()));
        
        password.addEventListener("focusin", (e) => console.log(e.type));
        password.addEventListener("focusout", (e) => console.log(e.type));
        password.addEventListener("focus", (e) => console.log(e.type));
        password.addEventListener("blur", (e) => console.log(e.type));
        ```
        
        - 点击Some text input，然后点击窗口外，再点击password input 最后点击some text input，打印如下
            
            ```jsx
            focus true
            focusin true
            blur false
            focusout false
            focus
            focusin
            blur
            focusout
            focus true
            focusin true
            ```
            
        - 从打印中可以看出，浏览器实际实现**没有规范那么复杂**（[focusin发生在blur前](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md)），聚焦事件`focus`和`focusin` 总是连续触发，而`blur` 和`focusout` 也总是连续触发，切换焦点时先触发失去焦点的事件，再触发聚焦事件

# 4.3 鼠标事件（The Mouse Event）

- 在《JavaScript高级程序设计（第4版）》中，鼠标事件和滚轮事件是一起描述的
    - 实际上，**鼠标事件比滚轮事件更抽象**，鼠标事件并单纯定义与鼠标相关的事件，因为鼠标是用户的主要**定位设备**，所以**mouse event** 实际上更像是所有**定位设备**的**定位事件**的抽象
    - 依据`UIEvent` 的继承关系，滚轮事件（wheel events）、拖拽事件（drag events）、**指针事件（pointer events）**都**继承**于鼠标事件（mouse event），其中指针事件是对现存的定点设备事件模型的扩展，滚轮和拖拽事件是鼠标事件更具体的交互模型构建

[4.3 鼠标事件](4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md)

# 4.4 键盘事件（The Keyboard Event）

《JavaScript高级程序设计（第4版）》中键盘事件和输入事件（Input Event）同时介绍