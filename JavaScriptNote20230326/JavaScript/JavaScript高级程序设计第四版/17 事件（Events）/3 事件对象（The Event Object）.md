# 3. 事件对象（The Event Object）

- 在DOM中发生事件时，所有相关信息都会被收集并存储在一个名为`event` 的对象中
- 这个对象包含触发事件的一些基本信息以及与特定事件相关的任何其它数据
- 事件对象会作为事件处理程序的参数用于实现根据事件信息进行自适应反馈的功能
- 所有浏览器都支持这个`event`对象

# 3.1 DOM事件对象（The DOM Event Object）

《JavaScript高级程序设计（第4版）》中对于DOM事件对象比较简略，值只介绍了基本用法和一些基本的属性和方法以及它们的使用方式，并且有些不全面且跟最新的标准有出入

这里的布局介绍参考[DOM规范](https://dom.spec.whatwg.org/#interface-event) 和[MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/Event) 重写

## 3.1.1 MDN文档关于`Event` 的解释

**定义**

- `Event` 接口是对DOM中生成的事件的描述

**事件生成**

- 事件可以由用户操作触发（**triggered**），例如鼠标点击按钮，敲击键盘等
- 事件也可以由表示异步任务进程的API生成，例如网络请求，脚本加载等
- 事件还可以通过编程方式触发，比如调用元素的`HTMLElement.click()` 或者自定义事件，然后适用`EventTarget.dispatchEvent()` 派发到指定目标

**事件类型**

- DOM中有许多类型的事件，一个`Event` 并不能完全描述所有的事件，所以`Event` 本身抽象成包含所有事件共有的属性和方法的接口，而许多其它类型的事件都基于`Event` 这个**主事件接口**（**main Event interface**）
- 所有基于`Event` 接口的其它事件类型可以参考MDN-**[Interfaces based on Event](https://developer.mozilla.org/en-US/docs/Web/API/Event#interfaces_based_on_event)**

**事件监听**

- 可以为许多DOM元素设置对应事件的监听程序，关于事件的监听可以查看[2. 事件处理程序（Event Handler）](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89.md)

## 3.1.2 DOM规范中的Event接口

```jsx
[Exposed=*]
interface Event {
  constructor(DOMString type, optional EventInit eventInitDict = {});

  readonly attribute DOMString type;
  readonly attribute EventTarget? target;
  readonly attribute EventTarget? srcElement; // legacy
  readonly attribute EventTarget? currentTarget;
  sequence<EventTarget> composedPath();

  const unsigned short NONE = 0;
  const unsigned short CAPTURING_PHASE = 1;
  const unsigned short AT_TARGET = 2;
  const unsigned short BUBBLING_PHASE = 3;
  readonly attribute unsigned short eventPhase;

  undefined stopPropagation();
           attribute boolean cancelBubble; // legacy alias of .stopPropagation()
  undefined stopImmediatePropagation();

  readonly attribute boolean bubbles;
  readonly attribute boolean cancelable;
           attribute boolean returnValue;  // legacy
  undefined preventDefault();
  readonly attribute boolean defaultPrevented;
  readonly attribute boolean composed;

  [LegacyUnforgeable] readonly attribute boolean isTrusted;
  readonly attribute DOMHighResTimeStamp timeStamp;

  undefined initEvent(DOMString type, optional boolean bubbles = false, optional boolean cancelable = false); // legacy
};

dictionary EventInit {
  boolean bubbles = false;
  boolean cancelable = false;
  boolean composed = false;
};
```

- 我们按照DOM规范中的Event接口的定义来依次介绍`Event` 的属性和方法，简介的属性参考说明如下表
    
    
    | 属性/方法 | 类型/返回值 | 说明 |
    | --- | --- | --- |
    | type | 字符串 | 被触发的事件类型 |
    | target | EventTarget（通常就是元素） | 事件目标 |
    | srcElement | EventTarget | 该特性是非标准的，它是target 属性的别名，只对老版本的IE浏览器有效 |
    | currentTarget | EventTarget | 当前事件处理程序所在的元素 |
    | composedPath() | 返回一个EventTarget组成的数组 | 返回事件的路径，该路径是会被调用的监听器所在的元素节点组成的数组 |
    | eventPhase | 整数 | 表示调用事件处理程序的阶段，1代表捕获阶段、2代表到达目标、3代表冒泡阶段 |
    | stopPropagation() | 该函数不返回值 | 用于取消所有后续事件捕获或事件冒泡，只有bubbles为true 时才可以调用这个方法 |
    | cancelBubble | 布尔值 | stopPropagation的曾用名，在从事件处理程序返回之前将其值设置为true 可以阻止事件的传播，仅为兼容性保存，不要使用 |
    | stopImmediatePropagation() | 该函数不返回值 | 用于取消所有后续事件捕获或事件冒泡，并阻止调用任何后续事件处理程序（DOM3 Events新增） |
    | bubbles | 布尔值 | 表示事件是否冒泡 |
    | cancelable | 布尔值 | 表示是否可以取消事件的默认行为 |
    | returnValue | 布尔值 | 表示该事件的默认操作是否已被阻止，默认情况为true ，即允许进行默认操作，仅为兼容性保存，不要使用 |
    | preventDefault() | 该函数不返回值 | 用于取消事件的默认行为，只有cancelable 为true 时才可以调用这个方法 |
    | defaultPrevented | 布尔值 | true 表示已经调用preventDefault() 方法（DOM3 Events 中新增） |
    | composed | 布尔值 | 表示该事件是否可以从Shadow DOM传递到一般的DOM |
    | isTrusted | 布尔值 | 当事件是由用户行为产生的，这个属性的值就是true ，当事件是由脚本创建、修改、派发的时候，属性为false  |
    | timeStamp | DOMHighResTimeStamp（高精度时间戳） | 表示事件触发时的时间戳，精度在0.005ms |
    | initEvent() | 该函数不返回值 | 用于初始化使用document.createEvent() 创建的事件对象，仅为兼容性保存，不要使用 |

## 3.1.3 Event()

- `Event()` 是一个构造函数，用来构建一个`Event` 对象，
    - 适用Event()创建的事件对象称为**合成事件**（**synthetic event**）
    - 合成事件与浏览器触发的事件相反，它可以由脚本**派发**（**dispatched**）

**语法**

```jsx
new Event(type)
new Event(type, options)
```

- 它接收两个参数
    - 第一个参数是一个`DOMString`，表示被触发的事件类型
    - 第二个参数是一个可选的`EventInit` 类型，用来设置一些初始化属性
        - `bubbles` ：事件是否冒泡，默认为`false`
        - `cancelable` ：事件是否可被取消默认行为，默认为`false`
        - `composed` ： 事件是否会在Shadow DOM根节点之外触发监听器，默认为`false`
- 返回值：一个`Event` 对象

**例子**

- 使用事件目标（EventTarget）的`dipathEvent()` 可以派发通过`Event()` 创建的事件对象，其中`bubbles` ，`cancelable` 和`composed` 的指定，会让创建的事件有不同的行为
    
    ```jsx
    const a1 = document.querySelector("#a1");
    const a2 = document.querySelector("#a2");
    const a3 = document.querySelector("#a3");
    const a4 = document.querySelector("#a4");
    
    const ul = document.querySelector("ul");
    
    const handler = (e, who) => {
      const li = document.createElement("li");
      li.textContent = `currentTarget：${
        (e.currentTarget && e.currentTarget.nodeName) || who
      }；eventPhase: ${e.eventPhase};cancelable:${e.cancelable}`;
      ul.appendChild(li);
      if (who === "window") {
        cur++;
        if (cur % 2 == 0) {
          ul.appendChild(document.createElement("hr"));
        }
      }
    };
    
    document.addEventListener("click", (e) => handler(e, "document"));
    document.addEventListener("click", (e) => handler(e, "document"), true);
    
    a1.addEventListener("click", (e) => {
      handler(e, "a1_true");
    });
    
    a2.addEventListener("click", (e) => {
      handler(e, "a2_true");
    });
    
    a3.addEventListener("click", (e) => {
      e.cancelable = false;
      handler(e, "a3_true");
      e.preventDefault();
    });
    
    a4.addEventListener("click", (e) => {
      handler(e, "a4_true");
    });
    
    const newE1 = new Event("click", {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    a1.dispatchEvent(newE1);
    
    const newE2 = new Event("click", {
      bubbles: false,
      cancelable: true,
      composed: true,
    });
    a2.dispatchEvent(newE2);
    const newE3 = new Event("click", {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
    a3.dispatchEvent(newE3);
    const newE4 = new Event("click", {
      bubbles: false,
      cancelable: false,
      composed: true,
    });
    a4.dispatchEvent(newE4);
    ```
    
    ![Event().png](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89/Event().png)
    

## 3.1.4 目标对象和当前目标对象（target and currentTarget）

- `target` 指向事件触发时（**was dispatched**）所在的元素，它时最初引发事件的元素
- `currentTarget` 指向事件处理程序当前正在处理事件的元素
    - `currentTarget` 是`target` 或者是`target` 的父元素
    - 根据事件流的机制，`currentTarget` 就是（使用普通函数不改变`this` 的情况下）事件处理程序中的`this`
- 当事件冒泡时，`target` 的值不会变化，而`currentTarget` 会随着事件冒泡而变化，指向当前处理事件的元素
- 下面是一个DOM事件流里，`target`和`currentTarget` 指代值的变化例子
    
    ```jsx
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DOM 事件流</title>
        <style>
          div {
            margin-top: 20px;
            margin-left: 30px;
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
            border: 1px solid gray;
            border-radius: 5px;
            cursor: pointer;
          }
          ul {
            margin-top: 30px;
            margin-left: 30px;
          }
        </style>
      </head>
      <body>
        <div id="clickme">Click Me</div>
        <ul></ul>
        <script>
          const div = document.querySelector("div");
          const ul = document.querySelector("ul");
          let cur = 0;
          const handler = (e, who) => {
            const li = document.createElement("li");
            li.textContent = `currentTarget：${
              e.currentTarget.nodeName || who
            }；target: ${e.target.nodeName + "_" + e.target.id}`;
            ul.appendChild(li);
            if (who === "window") {
              cur++;
              if (cur % 2 == 0) {
                ul.appendChild(document.createElement("hr"));
              }
            }
          };
          div.addEventListener("click", (e) => handler(e, "<div>"));
          document.body.addEventListener("click", (e) => handler(e, "<body>"));
          document.documentElement.addEventListener("click", (e) =>
            handler(e, "<html>")
          );
          document.addEventListener("click", (e) => handler(e, "document"));
          window.addEventListener("click", (e) => handler(e, "window"));
    
          div.addEventListener("click", (e) => handler(e, "<div>"), true);
          document.body.addEventListener(
            "click",
            (e) => handler(e, "<body>"),
            true
          );
          document.documentElement.addEventListener(
            "click",
            (e) => handler(e, "<html>"),
            true
          );
          document.addEventListener("click", (e) => handler(e, "document"), true);
          window.addEventListener("click", (e) => handler(e, "window"), true);
        </script>
      </body>
    </html
    ```
    
    ![target and currentTarget.gif](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89/target_and_currentTarget.gif)
    
    - 可以观察到`target` 一直没有变化，始终是事件流中引发事件的那个元素
    - 而`currentTarget` 引用随着事件流一直变化的`this` ，即当前事件处理程序所在的元素

## 3.1.5 composedPath()和composed

- 把二者组合在一起讲解，是因为它们与Shadow DOM有关系，都是关于冒泡阶段Shadow DOM节点传递到DOM节点的
    - `composed` 表示事件是否可以从Shadow DOM传递到一般的DOM
    - `composedPath()` 受到`composed` 和`ShadowRoot.mode` 的影响，会返回一个事件触发后应该调用的监听器所在的元素节点按顺序构成的数组，也就是事件传播路径

### 3.1.5.1 `composed`

**定义**

- `composed`表示该事件是否可以从Shadow DOM传递到一般的DOM，或者说`composed` 属性表示事件是否跨框架冒泡，即框架之间的事件是否可以冒泡到 `window` 。
    
    <aside>
    ℹ️ 备注：思考一下<input>，<video>，<audio>这些DOM节点为啥能渲染出复杂的场景，因为这些标签内部有底层渲染，即它们内部有Shadow DOM
    
    - 关于Shadow DOM，详细地会在第20章介绍，它直译就是影子DOM的意思，实际上，它是DOM中的DOM
    - 在谷歌浏览器中控制台中可以将这些标签的Shadow DOM显示出来，如下
        
        ![open shodow dom1.png](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89/open_shodow_dom1.png)
        
        ![open shodow dom2.png](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89/open_shodow_dom2.png)
        
        ![Shadow DOM inner.png](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89/Shadow_DOM_inner.png)
        
    </aside>
    

**composed的值**

- `composed` 在所有UA调度（UA-dispatched）的UI事件中都是`true` ，例如点击(click)，触摸(touch)，鼠标悬停(mouseover)，复制(copy)，粘贴(pasted)等；
- 除此之外，许多其它类型的事件的`composed` 都是`false` ，即不支持事件在Shadow DOM到DOM传递，例如没有特意设置`composed` 选项为`true` 的合成事件

**特性**

- 只有当事件对象的`bubbles` 属性为`true`时，这种`composed` 在Shadow DOM到DOM的传播（冒泡）才有意义；而捕获阶段的**组合事件**（**composed event，表示composed为`true` 的事件**）在传递到**Shadow DOM root（**就是Shadow DOM的根节点**）**节点时，**不会进一步**向Shadow DOM内的Shadow Tree传递，其表现是在**Shadow DOM Host（整个Shodow DOM节点）**上处理，就像它们处于`AT_TARGET` （事件流的到达目标对象阶段）阶段
- 如果对上一段话中的捕获和冒泡阶段的事件composed 事件的行为不理解，可以使用事件对象的`composedPath()` 方法查看事件从Shadow Root到DOM root所遵循的路径

**例子**

```jsx
<div>
  hello, world
  <div id="root"></div>
</div>
const root = document.querySelector("#root");

const shadowRoot = root.attachShadow({ mode: "open" });

const tempate = `<div>mangwu</div><span><button>happy</button></span>`;

shadowRoot.innerHTML = tempate;
const btn = shadowRoot.querySelector("button");
const handle = (e) => {
  console.log(e.currentTarget.nodeName || "window");
};
btn.addEventListener("click", handle);
btn.addEventListener("click", handle, true);

const span = shadowRoot.querySelector("span");
span.addEventListener("click", handle);
span.addEventListener("click", handle, true);

shadowRoot.addEventListener("click", handle);
shadowRoot.addEventListener("click", handle, true);

root.addEventListener("click", handle);
root.addEventListener("click", handle, true);

const div = document.querySelector("div");
div.addEventListener("click", handle);
div.addEventListener("click", handle, true);

document.body.addEventListener("click", handle);
document.body.addEventListener("click", handle, true);

document.documentElement.addEventListener("click", handle);
document.documentElement.addEventListener("click", handle, true);

document.addEventListener("click", handle);
document.addEventListener("click", handle, true);

window.addEventListener("click", handle);
window.addEventListener("click", handle, true);

btn.dispatchEvent(new Event("click", { composed: false, bubbles: true }));
console.log("--------------");
btn.dispatchEvent(new Event("click", { composed: false, bubbles: false }));
console.log("--------------");

btn.dispatchEvent(new Event("click", { composed: true, bubbles: true }));
console.log("--------------");
btn.dispatchEvent(new Event("click", { composed: true, bubbles: false }));
console.log("--------------");
```

- 在一个Shadow DOM节点中派发了四种事件
    1. `composed` 为`false` ，所以不允许事件在Shadow DOM到DOM传递，`bubbles` 为`true` ，允许冒泡，所以事件只会在Shadow Host内部传递，不会传递到外部，打印如下
        
        ```jsx
        #document-fragment
        SPAN
        BUTTON
        BUTTON
        SPAN
        #document-fragment
        ```
        
        - 注意没有传递到`div#root`
    2. `composed` 为`false` ，所以不允许事件在Shadow DOM到DOM传递，`bubbles` 为`false` ，不允许冒泡，所以事件不仅只会在Shadow Host内部传递，而且经过捕获阶段到达触发节点不会再冒泡，打印如下
        
        ```jsx
        #document-fragment
        SPAN
        BUTTON
        BUTTON
        ```
        
    3. `composed` 为`true` ，所以允许事件在Shadow DOM到DOM传递，`bubbles` 为`true` ，允许冒泡，也就是说和正常的点击事件的捕获和冒泡阶段一样，打印如下
        
        ```jsx
        window
        #document
        HTML
        BODY
        DIV
        DIV
        #document-fragment
        SPAN
        BUTTON
        BUTTON
        SPAN
        #document-fragment
        DIV
        DIV
        BODY
        HTML
        #document
        window
        ```
        
    4. `composed` 为`true` ，所以允许事件在Shadow DOM到DOM传递，`bubbles` 为`false`，不允许冒泡，也就是说事件只会在捕获阶段和到达目标阶段触发事件处理程序，且Shadow DOM和DOM之间能传递事件
        
        ```jsx
        window
        #document
        HTML
        BODY
        DIV
        DIV
        #document-fragment
        SPAN
        BUTTON
        BUTTON
        DIV // 特殊打印
        ```
        
        - 这里有一个特殊的打印:最后一个`DIV` 是作为Shadow DOM挂载节点的`div#root`

### 3.1.5.2 `composedPath()`

- `composedPath()` 方法用于获取事件目标的事件流传递过程中，**冒泡阶段**中所经过的所有祖先元素，返回值为一个**节点序列（Node Sequence）**。
- 如果Shadow Root被创建时的模式是关闭的，那么composedPath就不包括Shadow Root内部的节点，创建一个关闭的内部节点如下
    
    ```jsx
    const shadowRoot = root.attachShadow({ mode: "closed" });
    ```
    
- 上面的例子中，四个事件的调用`composedPath()` 得到的路径分别是
    1. `composed` 为`false` ，所以不允许事件在Shadow DOM到DOM传递，`bubbles` 为`true` ，允许冒泡，所以事件只会在Shadow Host内部传递，不会传递到外部
        
        ```jsx
        [button, span, document-fragment]
        ```
        
        - `composedPath()` 返回的节点序列按照冒泡阶段的顺序排列
    2. `composed` 为`false` ，所以不允许事件在Shadow DOM到DOM传递，`bubbles` 为`false` ，不允许冒泡，所以事件不仅只会在Shadow Host内部传递，而且经过捕获阶段到达触发节点不会再冒泡
        
        ```jsx
        [button, span, document-fragment]
        ```
        
        - 注意这里虽然事件**不能冒泡**了，但捕获阶段仍然经过这些节点，又因为需要按照冒泡顺序排列，所以和第一个`composedPath()` 返回一致
    3. `composed` 为`true` ，所以允许事件在Shadow DOM到DOM传递，`bubbles` 为`true` ，允许冒泡，也就是说和正常的点击事件的捕获和冒泡阶段一样
        
        ```jsx
        [button, span, document-fragment, div#root, div, body, html, document, Window]
        ```
        
        - 正常的冒泡顺序
    4. `composed` 为`true` ，所以允许事件在Shadow DOM到DOM传递，`bubbles` 为`false`，不允许冒泡，也就是说事件只会在捕获阶段和到达目标阶段触发事件处理程序，且Shadow DOM和DOM之间能传递事件
        
        ```jsx
        [button, span, document-fragment, div#root, div, body, html, document, Window]
        ```
        
        - 注意这里虽然事件**不能冒泡**了，但捕获阶段仍然经过这些节点，又因为需要按照冒泡顺序排列，所以和第三个`composedPath()` 返回一致

## 3.1.6 `eventPhase`

- 表示事件在当前事件流中的阶段，事件流有3个阶段，但是它的值有4个
    - `Event.NONE` ：0，事件还未被触发，如新创建还未派发的事件
    - `Event.CAPTURING_PHASE` ，1，捕获阶段
    - `Event.AT_TARGET` ，2，到达目标对象
    - `Event.BUBBLING_PHASE` ，3，冒泡阶段
- 略微修改一下[事件流](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89.md)里的例子，让事件处理程序记录`eventPhase` ，主动派发一个点击事件如下
    
    ```jsx
    const clickE = new Event("click", { bubbles: true });
    handler(clickE, "未触发事件");
    div.dispatchEvent(clickE);
    ```
    
    ![eventPhase.png](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89/eventPhase.png)
    
    - 可以发现未触发的事件默认事件阶段值为0
    - DOM事件流的机制进一步被验证：先捕获阶段→到达节点→冒泡阶段

## 3.1.7 `stopPropagation()`，`stopImmediatePropagation()` 和**`preventDefault()`**

- `stopPropagation()` 和`stopImmediatePropagation()` 类似，都用来阻止事件在事件流中的**传播**（**Propagation**）
- 而**`preventDefault()`**与上述二者的针对点不一样，它不会阻止事件的传播，但是它会**阻止事件传播导致的默认行为**（例如点击<a>标签的默认行为是打开一个页面）

**以下为自己的分析**

- 为了更好的说明这三个方法的区别，可以分两个维度进行分析，其中一个维度又有两点需要说明
    - **默认行为维度**：`stopPropagation()` 和`stopImmediatePropagation()` 都不会阻止默认行为，即使它们能阻止事件在事件流的传播，而**`preventDefault(**)` 能阻止默认行为
    - **事件监听器维度**：**`preventDefault()`** 能阻止默认行为，但是无法阻止事件传播的监听器执行的自定义行为，`stopPropagation()` 和`stopImmediatePropagation()` 能立即阻止事件在事件流上的传播，从而阻塞后续的监听器行为，二者唯一的区别在于阻塞的力度
        - `stopPropagation()` 只会阻止当前事件在事件流之后的传播
        - 但是`stopImmediatePropagation()` 能阻止一个元素的所有**同类型**事件在事件流之后的传播，即如果一个元素注册了多个同类型的事件处理程序，只要其中一个使用了`stopImmediatePropagation()` ，那么这多个同类型的事件处理程序都不会执行了

**例子**

```jsx

<a
  id="stop"
  href="https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation"
  target="_blank"
  >stopPropagation</a
>
<br />
<a
  id="stopImmediate"
  href="https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation"
  target="_blank"
  >stopImmediatePropagation</a
>
<br />
<a
  id="default"
  href="https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation"
  target="_blank"
  >preventDefault</a
>
<ul></ul>
const stop = document.querySelector("#stop");
const stopImmediate = document.querySelector("#stopImmediate");
const defaultP = document.querySelector("#default");

const ul = document.querySelector("ul");
const handler = (e, who) => {
  const li = document.createElement("li");
  li.textContent = `currentTarget：${who};eventPhase: ${e.eventPhase}`;
  ul.appendChild(li);
};

document.body.addEventListener("click", (e) => handler(e, "<body>"), true);
document.body.addEventListener("click", (e) => handler(e, "<body>"));
stop.addEventListener("click", (e) => {
  // 记录
  handler(e, "a#stop_1");
});
stop.addEventListener("click", (e) => {
  // 记录
  e.stopPropagation();
  handler(e, "a#stop_2");
});
stop.addEventListener("click", (e) => {
  // 记录
  handler(e, "a#stop_3");
});
stopImmediate.addEventListener("click", (e) => {
  // 记录
  handler(e, "a#stopI_1");
});
stopImmediate.addEventListener("click", (e) => {
  // 记录
  e.stopImmediatePropagation();
  handler(e, "a#stopI_2");
});
stopImmediate.addEventListener("click", (e) => {
  // 记录
  handler(e, "a#stopI_3");
});
defaultP.addEventListener("click", (e) => {
  // 记录
  handler(e, "a#default_1");
});

defaultP.addEventListener("click", (e) => {
  // 记录
  e.preventDefault();
  handler(e, "a#default_2");
});
defaultP.addEventListener("click", (e) => {
  // 记录
  e.preventDefault();
  handler(e, "a#default_3");
});
```

![stopProgation and prventDefault.gif](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89/stopProgation_and_prventDefault.gif)

- `preventDefault()` 记录正常的事件流，只是阻止了点击<a>标签打开
- `stopPropagation()` 不会阻止所在事件流中同一阶段节点的其他监听器的执行，但是会阻止事件传播导致后续冒泡阶段的所有事件监听器不会执行
- `stopImmediatePropagation()` **不仅**会阻止事件传播导致后续冒泡阶段的所有事件监听器不会执行，而且还会阻止所在事件流中同一阶段节点的其他监听器的执行（同一阶段节点已执行的不受影响，同一阶段节点的监听器执行顺序按照注册顺序执行）

## 3.1.8 `isTrusted`

- `isTrusted` 属性与事件流无关，根据[DOM规范](https://dom.spec.whatwg.org/#ref-for-dom-event-istrusted%E2%91%A0)，这个布尔值只有在确认事件**是由用户代理（user agent）派发**的就是`true` ，其它情况都是`false`
    - 所谓的由用户代理派发，MDN的解释是浏览器自发生成或者用户操作生成的事件都是用户代理派发的
    - 而通过脚本代码或者说`EventTarget.dispatchEvent()` 派发的事件的`isTrusted` 都是`false`
- 例子
    
    ```jsx
    <button>clickme</button>
    <ul></ul>
    <script>
      const event = new Event("click");
      const btn = document.querySelector("button");
      const ul = document.querySelector("ul");
      function handler(e) {
        const li = document.createElement("li");
        li.textContent = `isTrusted:${e.isTrusted}`;
        ul.appendChild(li);
      }
      btn.addEventListener("click", handler);
      btn.dispatchEvent(event);
    </script>
    ```
    
    ![Event.isTrusted.png](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89/Event.isTrusted.png)
    

---

<aside>
💡 注意：event对象只在事件处理程序执行期间存在，一旦执行完毕，就会被销毁

</aside>

# 🚫3.2 IE事件对象（Internet Explorer Event Handlers）

- 与DOM事件不同，IE事件对象可以基于事件处理程序**被指定的方式**以不同的方式来访问
    - 所谓的被指定的方式就是[2. 事件处理程序（Event Handler）](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89.md) 中讨论的HTML、DOM0、DOM2中指定事件处理程序的方式
    - [3.1 DOM事件对象（The DOM Event Object）](3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89.md) 中，在DOM合规的浏览器中，event 对象是传给事件处理程序的唯一参数
    - 而对于IE事件对象而言，如果事件处理程序的指定方式不同，`event` 对象的访问方式也不同
1. 如果事件处理程序是使用DOM0方式指定的，则`event` 对象只是window对象的一个属性
    
    ```jsx
    const btn = document.getElementById("myBtn");
    btn.onclick = function () {
    	let event = window.event;
    	console.log(event.type); // "click"
    }
    ```
    
    - 实际上无论是不是IE浏览器，上述的代码都成立，~~对于使用`onclick` 进行事件处理程序的`event` 而言，它~~就是挂载到`window` 上的
    - 这里是想说明**IE在DOM0中并不是通过将`event` 对象传给事件处理程序作为唯一参数获取event对象的**
2. 如果事件处理程序是使用IE的DOM2方式指定的（即使用attachEvent）,event对象仍然是window对象的属性，只是处于方便也将其作为参数传入
    
    ```jsx
    const btn = document.getElementById("myBtn");
    btn.attachEvent("onclick", function (event) {
    	console.log(event.type); // "click"
    });
    ```
    
    - 实际上使用`addEventListener` ，`event` 对象也会是window对象的属性（因为兼容性），如下
        
        ```jsx
        btn.addEventListener("click", function () {
          let e = window.event;
          console.log(e.type); // "click"
        });
        ```
        
3. 如果是使用HTML属性方式指定的事件处理程序，则`event` 对象同样可以通过变量`event` 访问（与DOM模型一样）
    
    ```jsx
    <button id="myBtn" onclick="console.log(event.type)">按钮</button>
    ```
    
    - 在非IE浏览器上，HTML属性方式指定的事件处理程序也使用`event` 变量作为默认的事件处理程序的参数

---

- IE事件对象也包含与导致其创建的特定事件相关的属性和方法，其中很多都与相关的DOM属性和方法对应；和DOM事件一样，基于触发的事件类型不同，`event` 对象中包含的属性和方法也不一样，不过所有IE事件对象都会包含下表中所列的公共属性和方法，在DOM标准中，这些属性都是**非法属性**
    
    
    | 属性/方法 | 类型/返回值 | DOM对应属性或方法 | 说明 |
    | --- | --- | --- | --- |
    | srcElement | EventTarget | target | 该特性是非标准的，它是target 属性的别名，只对老版本的IE浏览器有效 |
    | cancelBubble | 布尔值 | stopPropagation | stopPropagation的曾用名，在从事件处理程序返回之前将其值设置为true 可以阻止事件的传播，仅为兼容性保存，不要使用 |
    | returnValue | 布尔值 | preventDefault | 表示该事件的默认操作是否已被阻止，默认情况为true ，即允许进行默认操作，仅为兼容性保存，不要使用 |
- `srcElement` 相当于DOM事件对象中的`target` ，它的值不总是等于`this` ，在IE浏览器中可能没有`target` 这个属性
- `returnValue` 相当于`preventDefault()` ，只不过使用时需要给这个属性赋值，如下
    
    ```jsx
    const link = document.getElementById("myLink");
    link.onclick = function() {
    	window.event.returnValue = false;
    }
    ```
    
    - 赋值为`false` 会阻止默认行为，`returnValue` 默认值为`true`
- `cancelBubble` 属性和DOM `stopPropagation()` 方法用途一样，都可以阻止事件冒泡，因为IE8及其更早版本不支持捕获阶段，所以只会取消冒泡，故而得名
    
    ```jsx
    <button>click me</button>
    <script>
      const btn = document.querySelector("button");
      btn.onclick = function () {
        window.event.cancelBubble = true;
      };
      document.body.onclick = function () {
        console.log("Body Clicked");
      };
    </script>
    ```
    
    - 赋值为`false` 会阻止事件的传播，可以阻止事件冒泡到`document.body` ，所以不会有"Body Clicked"的打印
- 注意上述的例子实际上**在现代浏览器上也是有效的**，虽然IE当初使用的属性都被当成了**非法属性**，但是为了兼容性，大部分浏览器都实现了它们

# 3.3 跨浏览器事件对象（The Cross-Brower Event Object）

- 虽然DOM事件和IE的事件对象并不相同，但它们有足够的相似性可以实现跨浏览器方案，DOM事件对象中包含IE事件对象的所有信息和能力，只是形式不同，这些共性可让两种事件模型之间的映射成为可能
- 在跨浏览器事件处理程序中我们写除了`EventUtil`对象用于为事件目标添加监听器，现在我们需要对它进行扩展，添加一些实现事件对象的方法或属性
    
    ```jsx
    const EventUtil = {
      addHandler: function (ele, type, handler) {
        if (ele.addEventListener) {
          ele.addEventListener(type, handler, false);
        } else if (ele.attachEvent) {
          ele.attachEvent("on" + type, handler);
        } else {
          ele["on" + type] = handler;
        }
      },
      removeHandler: function (ele, type, handler) {
        if (ele.addEventListener) {
          ele.removeEventListener(type, handler, false);
        } else if (ele.attachEvent) {
          ele.detachEvent("on" + type, handler);
        } else {
          ele["on" + type] = null;
        }
      },
      getEvent: function (event) {
        return event ? event : window.event;
      },
      getTarget: function (event) {
        return event.target || event.srcElement;
      },
      preventDefault: function (event) {
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
      },
      stopPropagation: function (event) {
        if (event.stopPropagation) {
          event.stopPropagation();
        } else {
          event.cancelBubble = true;
        }
      },
    };
    ```
    
    - 新增四个方法，都是使用能力检查的方式进行兼容性处理

`getEvent()`

- 返回`event` 对象的引用
- IE中在通过DOM0的方式指定事件处理程序时，事件对象不通过参数传递，所以需要使用`getEvent()` 进行兼容，如下
    
    ```jsx
    btn.onclick = function(event) {
      event = EventUtil.getEvent(event);
    }
    ```
    

`getTarget()` 

- 第二个方法是`getTarget()` ,它返回事件目标，因为IE浏览器的事件对象中可能不存在`target` 属性，所以可以先判断传入的事件对象的`target` 属性，没有就返回`srcElement` 属性，如下使用
    
    ```jsx
    btn.onclick = function (event) {
      event = EventUtil.getEvent(event);
      **let target = EventUtil.getTarget(event);**
    };
    ```
    

`preventDefault()`

- 阻止事件的默认行为的方法，传入`event` ，如果事件对象有`preventDefault()` 方法就执行，否则就使用`returnValue` ，如下
    
    ```jsx
    **btn.onclick = function (event) {
      event = EventUtil.getEvent(event);
      EventUtil.preventDefault(event);
    };**
    ```
    

`stopPropagation()`

- 和`preventDefault()` 类似，同样先检测用于停止事件流的DOM方法，如果没有再使用`cancelBubble` 属性，如下使用方式
    
    ```jsx
    btn.onclick = function (event) {
      event = EventUtil.getEvent(event);
      EventUtil.stopPropagation(event);
    };
    ```
    
- 但是这个方法具有不确定性，因为`stopPropagation()` 阻止事件流，即停止事件冒泡也停止事件捕获，但是`cancelBubble` 只会停止事件冒泡