# 2. 事件处理程序（Event Handler）

- 事件意味着用户或浏览器执行的某种动作
    - 比如单机（click），加载（load），鼠标悬停（mouseover）
- 为了响应事件而调用的函数被称为**事件处理程序**（**event handler**或**事件监听器，event listener**）
    - 事件处理程序的名字以”on”开头，因此click事件的处理程序叫做onclick
    - 而load事件的处理程序叫做onload
    - 有多种方式指定事件处理程序

# 2.1 HTML事件处理程序（HTML Event Handlers）

- 特定元素支持的每个事件都可以使用**事件处理程序**的名字**以HTML属性**的形式来指定
    - 属性值必须是能够执行JavaScript代码
    - 所有在HTML属性上可以使用的事件处理程序名称可以查看HTML规范[8.1.8.2 Event handlers on elements,objects, and objects](https://html.spec.whatwg.org/#event-handlers-on-elements,-document-objects,-and-window-objects)

## 2.1.0 关于HTML事件处理程序的HTML规范补充

- 所有的HTML事件处理程序属性都有接口定义，全局的事件处理程序接口的简略定义如下
    
    ```jsx
    interface mixin **GlobalEventHandlers** {
      attribute EventHandler onabort;
      attribute EventHandler onauxclick;
    	...
      attribute EventHandler onwebkittransitionend;
      attribute EventHandler onwheel;
    };
    ```
    
- 关于窗口处理程序接口的简略定义如下
    
    ```jsx
    interface mixin **WindowEventHandlers** {
      attribute EventHandler onafterprint;
      attribute EventHandler onbeforeprint;
    	...
    	attribute EventHandler onunhandledrejection;
      attribute EventHandler onunload;
    }
    ```
    
- 文档类型和元素类型继承了GlobalEventHandlers接口，窗口类型二者都继承了，HTML规范中定义如下
    
    ```jsx
    **Document includes GlobalEventHandlers;
    Window includes GlobalEventHandlers;
    HTMLElement includes GlobalEventHandlers;
    Window includes WindowEventHandlers;**
    ```
    
- EventHandler回调函数类型表示用于事件处理程序的回调。在Web IDL中表示如下
    
    ```jsx
    [LegacyTreatNonObjectAsNull]
    callback EventHandlerNonNull = any (Event event);
    typedef EventHandlerNonNull? EventHandler;
    ```
    
    - 回调函数是一个参数为事件对象的函数

## 2.1.1 点击事件

- 点击事件是用户交互最常用到的事件，这种交互事件可以通过`onclick` 属性指定JavaScript代码值来实现
    - 需要注意，属性的值是JavaScript代码，所以不能在未经转义的情况下使用HTML语法字符，比如和号(&)，双引号（`"`）、小于号(`<`)、大于号(`>`)
    - 为了避免使用HTML实体，可以使用单引号代替双引号
    
    ```jsx
    <input type="button" value="click me" onclick="console.log('Clicked')" />
    ```
    
    - 点击这个按钮后，控制台会输出一条信息
- 在HTML中定义的事件处理程序可以包含精确的动作指令，也可以调用在页面其他地方定义的脚步，如下
    
    ```jsx
    <script>
      function showMessage() {
        alert("Hello World!");
      }
    </script>
    <input type="button" value="click me" onclick="showMessage()" />
    ```
    
    - 单机按钮会调用`showMesage()` 函数
    - `showMessage` 不仅可以在单独的<script>元素中定义，也可以在外部文件中定义
    - **作为事件处理程序执行的代码可以访问全局作用域中的一切**

## 2.1.2 以HTML**属性**的形式来指定**事件处理程序的特殊之处**

- 直接在HTML属性中指定事件处理程序，首先会创建一个函数来封装属性的值
    - 这个新创建的函数有一个特殊的局部变量`event` ，其保存的就是`event` 对象
    - 有了这个对象，就不用开发者另外定义其他变量，也不用从包装函数的参数列表中去取了
    - 除此之外，在这个函数作用域中，`this` 值是事件的目标元素（`event.target`）
    
    ```jsx
    <input
      type="button"
      value="click me"
      onclick="console.log(event.type,this.value);"
    />
    ```
    
    - 点击这个按钮就会打印事件类型和按钮名称，如图
        
        ![HTML事件处理程序内置对象.png](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89/HTML%25E4%25BA%258B%25E4%25BB%25B6%25E5%25A4%2584%25E7%2590%2586%25E7%25A8%258B%25E5%25BA%258F%25E5%2586%2585%25E7%25BD%25AE%25E5%25AF%25B9%25E8%25B1%25A1.png)
        
- 这个动态创建的包装函数还有一个特别有意思的地方，就是**其作用域链被扩展了**
    - 这个函数中，**document**和**元素自身的成员**都可以被当成局部变量来访问
    - 这意味着事件处理程序可以方便地访问`document` 和自己的属性
    - 这就相当于函数默认使用了一些with语句进行包装，如下
        
        ```jsx
        function () {
        	with(document) {
        		with(this) {
        			// 属性值
        			console.log(body);  // document的属性
        			console.log(nodeName); // 元素自身的属性
        		}
        	}
        }
        ```
        
    - 一个有意思的地方是，如果元素是一个表单输入框，则作用域链中还会包含表单元素，这样事件处理程序的代码就不用引用表单元素，而是直接访问同一表单的其它元素了，如下
        
        ```jsx
        <form method="post">
          <input type="text" name="username" id="" value="" />
          <input
            type="button"
            value="Echo UserName"
            onclick="console.log(username.value);"
          />
        </form>
        ```
        
        - 这里点击按钮会显示文本框中包含的文本，直接引用`username` 是没有问题的，因为它是同一表单的其它元素

## 2.1.3 在HTML中指定事件处理程序的一些问题

### 2.1.3.1 时机问题

- 有可能HTML元素已经显示在页面上，用户都与其交互了，而事件处理程序代码还无法执行
    - 例如之前的`showMessage()` 函数在页面按钮中代码后面定义，那么当用户在`showMessage()` 函数被定义之前点击按钮就会发生错误
    - 为此大多数HTML事件处理程序会封装try/catch块中，以便在这种情况下静默失败
        
        ```jsx
        <input
          type="button"
          value="click me"
          onclick="try {
          showMessage()
        } catch (error) {
          console.log(error);
        } "
        />
        ```
        
        - `showMessage()` 函数还未加载完成时，点击按钮发生的JavaScript错误就会在浏览器收到前被提前拦截

### 2.1.3.2 作用域链扩展的兼容性问题

- 不同的浏览器对事件处理程序作用域链的扩展可能导致不同的结果，不同的JavaScript引擎中**标识符解析的规则存在差异**，因此访问无限定的对象成员可能导致错误

### 2.1.3.3 HTML与JavaScript强耦合

- 使用HTML指定事件处理程序的最关键的一个问题，就是HTML与JavaScript的强耦合
    - 强耦合意味着HTML和JavaScript结合在一起写
    - 如果需要修改事件处理程序，则必须在两个地方，即HTML和JavaScript中修改代码
    - 这也是很多开发者不使用HTML事件处理程序，而使用JavaScript指定事件处理程序的主要原因

# 2.2 DOM0 事件处理程序（DOM Level0 Event Handlers）

- 在JavaScript中指定事件处理程序的传统方式是把一个函数赋值给（DOM元素的）一个事件处理程序属性
    - 这也是第4代Web浏览器中开始支持的事件处理程序赋值方法
    - 直到现在所有浏览器都支持此方法，因为这种方式比较简单
    - 使用这种方式在JavaScript中指定事件处理程序，必须先取得要操作对象的引用
- 在[2.1.0 关于HTML事件处理程序的HTML规范补充](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89.md) 中已经提到过每个`HTMLElement` 都继承实现了**`GlobalEventHandlers`** 接口，所以DOM上每个元素引用都具有**`GlobalEventHandlers`** 定义的事件处理程序属性，例如`onclick` ，只要把这个属性赋值为一个函数，就实现了DOM0关于在JavaScript中指定事件处理程序的规范
    
    ```jsx
    let btn = document.querySelector("input");
    btn.onclick = function () {
      alert("Clicked");
    };
    ```
    
- 像这样使用DOM0方式为事件处理程序赋值时，所赋函数被视为元素的方法
    - 因此，事件处理程序会在元素的作用域中运行，即`this` 等于元素，可以通过`this` 访问元素的如何属性和方法（普通函数的运行时绑定机制导致的，如果使用箭头函数可能就不是这种情况了，因为箭头函数`this` 保持为封闭词法环境，具体可以看[this操作符](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6.md) ）
    - 以这种方式添加的事件处理程序是**注册在事件流的冒泡阶段**的
    - 通过将事件处理属性的值设置为`null` ，可以移除通过DOM0方式添加的事件处理程序
    - 下面是一个验证例子
        
        ```jsx
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>DOM0 事件处理程序</title>
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
            <div>Click Me</div>
            <div id="clear">clear onclick</div>
            <ul></ul>
            <script>
              const div = document.querySelector("div");
              const clear = document.querySelector("#clear");
              clear.onclick = function () {
                div.onclick = null;
                document.body.onclick = null;
                document.documentElement.onclick = null;
                document.onclick = null;
                window.onclick = null;
                div.removeEventListener("click", a, true);
                div.addEventListener("click", (e) => handler(e, "<div>", true), true);
                ul.appendChild(document.createElement("hr"));
              };
              const ul = document.querySelector("ul");
              const handler = (e, who, addHr = false) => {
                const li = document.createElement("li");
                li.textContent = `触发点击事件的目标对象：${who}`;
                ul.appendChild(li);
                if (addHr) {
                  ul.appendChild(document.createElement("hr"));
                }
              };
              div.onclick = function (e) {
                handler(e, this.nodeName);
              };
              document.body.onclick = function (e) {
                handler(e, this.nodeName);
              };
              document.documentElement.onclick = function (e) {
                handler(e, this.nodeName);
              };
              document.onclick = function (e) {
                handler(e.this, this.nodeName);
              };
              window.onclick = function (e) {
                handler(e, "window", true);
              };
              let a = (e) => handler(e, "<div>");
              div.addEventListener("click", a, true);
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
        </html>
        ```
        
        ![DOM0 Event Handlers.gif](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89/DOM0_Event_Handlers.gif)
        
        - 可以验证，使用`onclick` 是在注册冒泡阶段的事件处理程序
        - 清空`onclick` 相当于注销冒泡阶段的事件处理程序

<aside>
💡 注意：如果事件处理程序是在HTML中指定的，则onclick属性的值是一个包装相应HTML事件处理程序属性值的函数，这些事件处理函数程序也可以通过在JavaScript中将相应的属性设置为null来移除

```jsx
<input
  type="button"
  value="click me"
  onclick="console.log('Hello,world')"
/>
<input
  id="clear"
  type="button"
  value="clear onclick"
  onclick="clearClick()"
/>
<p></p>
<script>
  const p = document.querySelector("p");
  const input = document.querySelector("input");
  const clear = document.querySelector("#clear");
  p.textContent = input.onclick;
  function clearClick() {
    input.onclick = null;
    p.textContent = input.onclick;
    console.log(p.textContent);
  }
</script>
```

![DOM0 and HTMLEvent Handlers.gif](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89/DOM0_and_HTMLEvent_Handlers.gif)

- 也就是说DOM0 规范的事件处理程序和HTML中的事件处理程序属性指代的是同一个东西
</aside>

# 2.3 DOM2 事件处理程序（DOM Level2 Event Handlers）

- DOM2 Events为事件处理程序的赋值和移除定义了两个方法：
    - `addEventListener()`
    - `removeEventLisener()`
- 《JavaScript高级程序设计（第4版）》只是对它们进行了简单功能讲解，实际上现代开发中这两个方法非常重要，下面做详细解释

## 2.3.1 DOM规范-EventTarget

- `[EventTarget`](https://dom.spec.whatwg.org/#eventtarget) 接口是DOM中所有节点以及窗口添加事件监听器的基础
    - 一个`EventTarget` 对象表示一个事件发生时，可以将事件**分配**（**dispatched**）到的目标
    - 每个`EventTarget` 对象都有一个关联的事件监听器表（一个由零个或多个事件监听器组成的表），最初是一个空表
- `EventTarget` 接口上定义了在监听器表中添加一个关联的**事件监听器**（**事件处理程序**）的addEventListner()和移除一个关联的**事件监听器**（**事件处理程序**）方法，在DOM中的完整定义如下
    
    ```jsx
    [Exposed=*]
    interface EventTarget {
      constructor();
    
      undefined addEventListener(DOMString type, EventListener? callback, optional (AddEventListenerOptions or boolean) options = {});
      undefined removeEventListener(DOMString type, EventListener? callback, optional (EventListenerOptions or boolean) options = {});
      boolean dispatchEvent(Event event);
    };
    
    callback interface EventListener {
      undefined handleEvent(Event event);
    };
    
    dictionary EventListenerOptions {
      boolean capture = false;
    };
    
    dictionary AddEventListenerOptions : EventListenerOptions {
      boolean passive;
      boolean once = false;
      AbortSignal signal;
    };
    ```
    
    - `dispatchEvent(event)` 用于给事件目标主动派发一个事件，以触发事件监听器表中对应的事件处理程序
- DOM2 Events的核心思想就是**让每个节点作为有关自己的事件发生后的监听器**，所以每个节点都应该继承`EventTarget` ，这样就保证了每个事件一旦触发，节点自身就能监听到并调用关联的事件监听器，DOM规范中`Node` 节点继承`EventTarget` ，这样所有的节点都具有`EventTarget` 定义的方法
    
    ```jsx
    [Exposed=Window]
    **interface Node : EventTarget** { 
    	...
    }
    ```
    
    ```jsx
    Node.prototype.__proto__ === EventTarget.prototype; // true
    ```
    
- 除此之外BOM中的window对象也能作为自己事件发生后的监听器，所以窗口也应该继承`EventTarget` ，在HTML规范中的定义如下
    
    ```jsx
    [Global=Window,
     Exposed=Window,
     LegacyUnenumerableNamedProperties]
    interface Window : EventTarget {
    	...
    }
    Window includes GlobalEventHandlers;
    Window includes WindowEventHandlers;
    ```
    
    ```jsx
    window.__proto__.__proto__.__proto__ === EventTarget.prototype; // true
    Window.prototype.__proto__.__proto__ === EventTarget.prototype; // true
    ```
    
    - `Window` 接口有自己特有的事件，所以也包含`WindowEventHandlers` 接口（这一点在[HTML事件处理程序](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89.md)中解释过）

## 2.3.2 事件对象的方法

### 2.3.2.1 `EventTarget.prototype.addEventListener`

- `EventTarget` 接口的**`addEventListener()`** 方法设置一个函数（事件处理程序），当指定的事件被传递到目标（注册函数的节点，窗口等）时，该函数被调用
- 事件目标可以是一个文档上的元素`Element` 、`Document` 和`Window` ，也可以是如何支持事件的对象，比如`XMLHttpRequest`

**工作原理**

- `addEventListener()` 的工作原理是将一个函数，或实现了`[EventListener`](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89.md) 的对象 添加到调用它的`EventTarget` 上的指定事件类型的事件监听器列表中
- 如果要绑定的函数或对象已经在此目标的事件监听器列表中，则该函数或对象不会再被添加
    
    <aside>
    ℹ️ 备注：如果先前向事件监听器列表中添加过一个匿名函数，并且在之后的代码中调用`addEventListener`  来添加一个功能完全相同的匿名函数，那么之后这个匿名函数也会被添加到列表中；实际上，即使使用*完全相同*的代码来定义一个匿名函数，这两个函数仍然存在区别，在循环中也是如此。
    
    使用`addEventListener` 重复定义匿名函数会带来许多麻烦，下面的内存问题会进行解释
    
    </aside>
    
- 如果在另一个监听器内部将一个新的事件监听器添加到一个`EventTarget` 中（也就是在事件处理程序执行期间），则该事件不会触发新添加的监听器；但是，新的监听器可能在**事件流**的稍后阶段被触发，列如在冒泡阶段

**语法**

```jsx
addEventListener(type, listener);
addEventListener(type, listener, options);
addEventListener(type, listener, useCapture);
```

- `type` ：表示监听的事件类型，是一个大小写敏感的字符串，例如”click”
- `listener` ：监听回调函数，也可写成`callback` ，必须是实现了`[EventListener`](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89.md) 接口的对象或者是一个函数或是`null`，例如
    
    ```jsx
    // 实现EventListener接口的对象
    { 
    	handleEvent(event){
    		...
    	} 
    }
    // 或者直接把其中的handleEvent拿出来作为参数
    function handlerEvent(event) {
    	...
    }
    
    ```
    
    - 当监听的事件类型触发时，会接收到一个事件通知（实现了`Event`接口的对象），也就是`listener` 回调函数中的第一个参数
- `options` ：可选，一个有关`listener` 属性的可选参数对象，它可用于描述本次添加的监听器（事件处理程序）的行为，可选项如下
    - `capture` ，布尔值，可选，表示该类型的事件是否在DOM事件流的捕获阶段传播到`EventTarget` 时就触发`listener`，`true` 就是捕获阶段触发监听回调，而冒泡阶段不触发，`false` 正相反，默认情况下是`false`
    - `once` ，布尔值，可选，表示`listener` 在添加之后是否最多只调用一次（即只触发一次监听回调函数），`true` 就是再触发一次监听回调后，`listener` 就会被自动移除
    - `passive` ，布尔值，可选，表示`listener` 永远不会调用`preventDefault()` ，也就是说设置`passive` 为`true` 能让`event.preventDefault()` 在监听回调函数中被无效化，如果`listener` 内部确实调用了这个函数，客户端不仅忽略它还会抛出一个控制台警告
        
        <aside>
        ℹ️ 备注：`passive` 的值与`preventDefault()` 函数所阻止的**元素行为**密切相关，有些元素触发的事件的默认行为可以阻止，如`checkbox` 被点击选择，提交按钮的网络请求等，但是有些元素触发事件的默认行为最好不要阻止，最典型的就是元素滚动事件的默认滚动行为，如果阻止了会阻塞页面滚动能力，大大降低浏览器处理页面滚动的性能
        
        </aside>
        
    - `signal` ，一个**`AbortSignal`** 对象**，**在DOM规范中，`AbortSignal`继承自`EventTarget` ，它表示一个信号对象，允许通过`AbortController` 对象与DOM请求（如Fetch）进行通信并在需要时将其中止，在这里，`signal` 的`abort()` 方法被调用时，监听器会被移除；关于**`AbortSignal`** 将会在第24章被解释
- `useCapture` :可选，和`capture` 一样，因为是比较重要的功能，所以可以单独传入，表示该类型的事件是否在DOM事件流的捕获阶段传播到`EventTarget` 时就触发`listener`，`true` 就是捕获阶段触发监听回调，而冒泡阶段不触发，`false` 正相反，默认情况下是`false`
- 返回值：`undefined`

**用法**

- 给按钮添加click事件处理程序为例
    
    ```jsx
    <input type="button" value="click me" id="myBtn" />
    <script>
      const btn = document.getElementById("myBtn");
      btn.addEventListener(
        "click",
        function (e) {
          console.log(this.id);
        },
        false
      );
    </script>
    ```
    
    - 点击按钮后打印按钮的`id` 属性值
    - 注意这里使用的是匿名函数，不是函数变量，**也不是箭头函数**
    - 使用箭头函数会造成`this` 值指代不是目标对象，因为箭头函数**继承自箭头函数定义时的作用域**，这里就是`window` 对象，详情见[4.3 箭头函数（arrow functions）](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6.md)
- 使用DOM2方式的主要优势是可以为同一个元素的事件**添加多个事件处理程序**，并且只要该事件触发了，多个事件处理程序都会（按照添加顺序）执行
    
    ```jsx
    <input type="button" value="click me" id="myBtn" />
    <script>
      const btn = document.getElementById("myBtn");
      btn.addEventListener(
        "click",
        function (e) {
          console.log(this.id);
        },
        false
      );
      btn.addEventListener(
        "click",
        function (e) {
          console.log(e.type);
        },
        false
      );
    </script>
    ```
    
    - 点击按钮，点击事件触发两个事件处理程序，先添加的事件处理程序先执行，所以先打印`btn` 元素`id` 属性值，再打印事件对象的事件类型
- 可以在`options` 参数中设置多个`option` ，结合`passive` 和`once` ，能保证一旦事件触发，事件处理函数会被调用，然后监听器被移除
    
    ```jsx
    <input type="button" value="You have not clicked this button." id="once" />
    <input
      type="button"
      value="Click this button to reset the first button."
      id="reset"
    />
    <script>
      const once = document.querySelector("#once");
      const reset = document.querySelector("#reset");
    
      const initialText = once.value;
    
      const clickText = "You have clicked this button.";
    
      function eventListener() {
        this.value = clickText;
      }
    
      function addListener() {
        once.addEventListener("click", eventListener, {
          once: true,
          passive: true,
        });
        once.value = initialText;
      }
    
      reset.addEventListener("click", addListener);
    
      addListener();
    </script>
    ```
    
    ![addEventListenerOptions.gif](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89/addEventListenerOptions.gif)
    

`**this` 值问题**

- 关于`this` 值的问题，可以根据不同的场景书写不同的回调函数以修改`this` 值
    1. 通常而言，`this` 的值是触发事件的元素的引用，这种特性适用于在多个相似的元素中使用一个通用的事件监听器，此时传递给句柄的`event`参数的`currentTarget` 属性值和`this` 相同
    2. 如果传入的回调函数是一个箭头函数，那么`this` 就不是该元素的引用了，而是定义时所在的作用域，箭头函数适用于需要引用外部作用域数据时
    3. 如果想要自定义回调函数的`this` ，可以使用`bind()` 指定`this`值，这样可以解决因为函数调用位置不同导致的`this` 不明确的问题
        
        ```jsx
        <button>click me</button>
        <script>
          let nodeName = "global";
          const obj = {
            nodeName: "obj",
          };
          function handler(event) {
            console.log(this.nodeName);
          }
          const btn = document.querySelector("button");
          handler = handler.bind(obj);
          btn.addEventListener("click", handler);
        </script>
        // 点击按钮，打印"obj"
        ```
        
    4. 如果即想要设置`this` 为元素引用，又要使用定义事件处理程序所在的作用域的`this` ，可以将回调函数的`this` 作为参数传递给被包装的`this` 为所在作用域的函数，如下
        
        ```jsx
        <button>click me</button>
        <script>
          globalThis.nodeName = "global";
          function handler(event, that) {
            console.log(this.nodeName);
            console.log(that.nodeName);
          }
          function wrapperHandler(event) {
            let that = this;
            handler(event, that);
          }
          const btn = document.querySelector("button");
          btn.addEventListener("click", wrapperHandler);
        </script>
        ```
        
        - 点击按钮，打印”global”和”BUTTON”
        - `wrapperHandler` 作为`listener` ,其`this` 就是引用元素，使用`that` 变量保存后传递给`handler`
        - `handler` 定义在全局上下文中，直接调用，所以`handler`里的`this` 就是默认的全局对象

### 2.3.2.2 `EventTarget.prototype.reomveEventListener`

**定义**

- `EventTarget` 接口定义的`removeEventListener` 方法从目标中删除之前使用`EventTarget.addEventListener`注册到目标的**事件监听器（event listener）**
- 要删除的事件监听器是使用**事件类型（event type）**、事件监听器函数本身以及可能影响匹配过程的各种可选选项的组合来标识的
- 如果没有匹配到要删除的事件监听器，不会有任何效果
- 如果一个 `[EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)`上的[事件监听器](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC%E5%9B%9E%E8%B0%83)在另一监听器处理该事件时被移除，那么它将不能被事件触发。不过，它可以被重新绑定
- 还有一个移除事件监听器的方法：可以向`addEventListener()` 传入一个`AbortSignal` ，稍后再调用拥有该事件的控制器上的`abort()` 方法即可

**语法**

```jsx
removeEventListener(type, listener);
removeEventListener(type, listener, options);
removeEventListener(type, listener, useCapture);
```

- `type` ：表示需要移除的事件类型，是一个大小写敏感的字符串，例如”click”
- `listener` ：需要从目标事件移除的事件监听器函数
- `options` ：可选，一个指定事件监听器特征的可选对象，可选项只有`capture` ，指定需要移除的事件监听器函数是否为捕获监听器，如果未能指定此参数，默认值为`false`
- `useCapture` ：可选，一个布尔值，指定需要移除的事件监听器函数是否为捕获监听器，默认值为`false`
- 返回值：`undefined`

**用法**

- 如果同一个事件监听器分别为“事件捕获（`capture`为 `true`）”和“事件冒泡（`capture` 为 `false`）”注册了一次，这两个版本的监听器需要分别移除。移除捕获监听器不会影响非捕获版本的相同监听器，反之亦然
    
    ```jsx
    <button>click me</button>
    <button id="capture">remove capture</button>
    <button id="bubbling">remove bubbling</button>
    
    <ul></ul>
    <script>
      const btn = document.querySelector("button");
      const ul = document.querySelector("ul");
      let bubblingHandler = () => {
        const li = document.createElement("li");
        li.textContent = "click bubbling";
        ul.appendChild(li);
      };
      let captureHandler = () => {
        li.textContent = "click capture";
        ul.appendChild(li);
      };
      btn.addEventListener("click", bubblingHandler);
      btn.addEventListener("click", captureHandler, true);
      const bubbling = document.querySelector("#bubbling");
      const capture = document.querySelector("#capture");
      bubbling.addEventListener("click", () => {
        btn.removeEventListener("click", bubblingHandler);
      });
      capture.addEventListener("click", () => {
        btn.removeEventListener("click", captureHandler);
      });
    </script>
    ```
    
    ![DOM2 removeEventListener.gif](2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89/DOM2_removeEventListener.gif)
    
- 需要额外注意的是，在添加事件监听器时，根据第三个参数的不同可以添加多个相同的监听器，但是唯一需要区分的就是`capture/useCapture` 标记，`removeEventlistener` 要移除监听器必须和对应标志匹配
    
    ```jsx
    btn.addEventListener("click", bubblingHandler); // ①
    btn.addEventListener("click", bubblingHandler, false); // ②
    btn.addEventListener("click", bubblingHandler, {
      useCapture: false,
    	once: true,
    }); // ③
    btn.addEventListener("click", captureHandler, true); // ④
    btn.addEventListener("click", captureHandler, {
      useCapture: true,
    }); // ⑤
    
    btn.addEventListener("click", captureHandler, {
      useCapture: true,
      passive: true,
      once: true,
    }); // ⑥
    ```
    
    - 以上虽然调用了6次`addEventListener` ，但只成功添加了3个监听器
    - 对于冒泡阶段添加的事件处理程序而言，①②③中只有①生效，后续的两个因为匹配到在同一阶段的相同监听器而没有效果
    - 对于捕获阶段添加的事件处理程序而言，④⑤⑥中只有④⑤生效，⑥因为⑤已经的原因不会再添加
    - 所以对于`capture` 和`useCapture` 而言，在捕获阶段是不同的，在冒泡阶段是相同的，除此之外的其它选项不再区分考虑范围内
- 如果要对上面添加的三个监听器进行移除，使用三次`removeEventListener`即可，如下
    
    ```jsx
    btn.removeEventListener("click", bubblingHandler);
    btn.removeEventListener("click", captureHandler, true);
    btn.removeEventListener("click", captureHandler, { useCapture: true });
    ```
    

# 🚫2.4 IE事件处理程序（Internet Explorer Event Handlers）

- IE实现了与DOM类似的方法，即`attachEvent()`和`detachEvent()` ，这两个方法接收两个同样的参数，事件处理程序的名称和事件处理函数
    - `attachEvent()` 默认将事件处理程序添加到冒泡阶段
    - 第一个参数是事件处理程序的名称，例如”onclick”，而不是事件类型
- 在IE中使用`attachEvent()` 与使用DOM0方式的主要区别是事件处理程序的作用域
    - 使用DOM0方式时，事件处理程序中的`this` 值等于目标元素
    - 而使用`attachEvent()` ，事件处理程序是在全局作用域运行的，`this` 等于`window`
- 除此之外，`attachEvent()` 也能为同一个元素的同一个事件添加多个不同的事件处理器，不过与DOM0方法不同的是，这里的事件处理程序会以添加它们的顺序**反向触发**
- `detachEvent()` 的移除事件处理程序的匹配过程比`removeEventListener()` 简单，只需要考虑事件处理程序的名称和是否为同一个事件处理函数即可
- 理解上面的两个方法以及它们之间的差异**有助于编写跨浏览器代码**

# 2.5 跨浏览器事件处理程序（Cross-Browser Event Handlers）

- 为了以跨浏览器兼容的方式处理事件
    - 很多开发者会选择一个JavaScript库，其中抽象了不同浏览器的差异
    - 有些开发者也会编写自己的代码，以便使用最合适的事件处理手段
- 自己编写跨浏览器事件处理代码主要依赖[能力检测](../13%20%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%A3%80%E6%B5%8B%EF%BC%88Client%20Detection%EF%BC%89/1%20%E8%83%BD%E5%8A%9B%E6%A3%80%E6%B5%8B%EF%BC%88Capability%20Detection%EF%BC%89.md)，要确保事件处理代码有最大的兼容性，只需要让代码在冒泡阶段运行即可
- 编写跨浏览器事件处理程序
    1. 首先参考`EventTarget` 接口，创建一个`EventUtil` 对象，它应该拥有自定义添加和移除事件处理程序的方法，如下
        
        ```jsx
        const EventUtil = {
          addHandler: function () {},
          removeHandler: function () {},
        };
        ```
        
    2. 跨浏览器添加事件处理程序的方法称为`addHandler` ，它接收三个参数：目标元素、事件名，事件处理函数；默认添加到冒泡阶段，不设置其它选项
        
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
          removeHandler: function () {},
        };
        ```
        
    3. 跨浏览器移除事件处理程序的方法称为`removeHandler` ，它也接收三个参数，目标元素、事件名，事件处理函数，不管通过何种方式添加，默认移除冒泡阶段
        
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
        };
        ```
        
        - 两个方法都优先使用DOM2的方式
        - 否则如果是IE浏览器就用IE方式
        - 最后才考虑DOM0的方式
- 使用自定义的跨浏览器事件处理对象`EventUtil`
    
    ```jsx
    <button>click me</button>
    <button id="remove">remove click handler</button>
    
    const btn = document.querySelector("button");
    const handler = function () {
      console.log("Clicked");
    };
    const removeBtn = document.querySelector("#remove");
    EventUtil.addHandler(btn, "click", handler);
    
    const removeClick = function () {
      EventUtil.removeHandler(btn, "click", handler);
    };
    
    EventUtil.addHandler(removeBtn, "click", removeClick);
    ```