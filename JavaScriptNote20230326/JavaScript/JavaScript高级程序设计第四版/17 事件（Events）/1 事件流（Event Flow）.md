# 1. 事件流（Event Flow）

- 在开发第四代Web浏览器时（IE4和NetscapeCommunicator 4）,开发团队碰到了一个有意思的问题
    - 页面哪个部分拥有特定的事件？
    - 根据已经学到的DOM结构，元素要么互为父子关系，要么邻接关系
    - 所以在浏览器视口中触发某一个元素的事件时，实际上也时在该元素的父节点上触发了事件
    - 这就像在这一张纸上画几个同心圆，把手指放在圆心上，则手指不仅是在一个圆圈里，而是在所有的圆圈里
- 两家浏览器的开发团队看待这个问题就是以上述的理解，对于浏览器事件来说，当你点击一个按钮时，实际上不关点击了这个按钮，还点击了它的容器以及整个页面
- **事件流描述了页面接收事件的顺序**
    - IE4和Netscape开发团队提出了几乎完全相反的事件流方案（本质上只是描述页面接收事件的顺序正好相反）
    - IE支持**事件冒泡流（Event bubbling flow）**，而NetscapeCommunicator 将支持**事件捕获流**（**event capturing flow**）

# 1.1 事件冒泡（Event Bubbling）

- IE事件流被称为**事件冒泡**（**Event Bubbling**），这是因为事件被定义为从最基本的元素（文档树中最深的节点）开始触发，然后向上传播至没有那么具体的元素（文档）
- 称为冒泡的原因在于，一个基本元素触发事件后，整个事件会按照从子到父节点的顺序一层层向上触发每层父节点的事件，这种事件传递的方式就像气泡一样上升，比如
    
    ```jsx
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>事件冒泡</title>
      </head>
      <body>
        <div id="myDiv">Click Me</div>
      </body>
    </html>
    ```
    
    - 在页面中点击<div>元素后，click事件会在如下节点上依次触发
        1. <div>
        2. <body>
        3. <html>
        4. document
    - 也就是说，最新被点击的元素触发click事件，然后click事件沿着DOM树一路向上，在经过的每个节点上依次触发，直到`document`对象，如下图
        
        ![冒泡事件.png](1%20%E4%BA%8B%E4%BB%B6%E6%B5%81%EF%BC%88Event%20Flow%EF%BC%89/%25E5%2586%2592%25E6%25B3%25A1%25E4%25BA%258B%25E4%25BB%25B6.png)
        
- 所有现代浏览器都支持事件冒泡，只是在实现上会有一些变化
    - IE5.5及早期版本会跳过<html>元素，直接从<body>冒泡到document
    - 现代浏览器中的事件会一直冒泡到`window`对象

---

**例子补充**

- 上述举例只是显示了事件冒泡这种事件流关于页面元素接收事件的顺序的机制，下面是一个更加能验证这个的例子
    
    ```jsx
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>冒泡机制验证</title>
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
        <ul></ul>
        <script>
          const div = document.querySelector("div");
          const ul = document.querySelector("ul");
          const handler = (e, who) => {
            const li = document.createElement("li");
            li.textContent = `触发点击事件的目标对象：${who}`;
            ul.appendChild(li);
            if (who === "window") {
              ul.appendChild(document.createElement("hr"));
            }
          };
          div.addEventListener("click", (e) => handler(e, "<div>"));
          document.body.addEventListener("click", (e) => handler(e, "<body>"));
          document.documentElement.addEventListener("click", (e) =>
            handler(e, "<html>")
          );
          document.addEventListener("click", (e) => handler(e, "document"));
          window.addEventListener("click", (e) => handler(e, "window"));
        </script>
      </body>
    </html>
    ```
    
    ![clickBublingEvent.gif](1%20%E4%BA%8B%E4%BB%B6%E6%B5%81%EF%BC%88Event%20Flow%EF%BC%89/clickBublingEvent.gif)
    
    - 这里用户点击了三次，每次点击实际上都触发了点击事件但是实际冒泡的层数不一样
        - 第一次点击<div>元素，它是最深层的节点，开始冒泡，如上述，按照顺序冒泡到body，html，document，window，所以进行了**五次处理器执行**（新增五条记录）
        - 第二次点击<ul>元素，它也是最深层的节点，开始冒泡，因为<ul>本身没有添加监听器监听点击，所以没有添加<ul>的记录，但是不代表这个点击事件不会冒泡，它继续向上冒泡到body，html，document，window，所以进行了**四次处理器执行**（新增四条记录）
        - 第三次点击是**在下方空白处**，根据新增的三条记录可以，点击事件分别冒泡到了html，document，window，为什么没出现body
            - 在文档是标准模式下，body的区域靠内容支撑，所以在不设置额外样式的情况下，它的高度就是div和ul二者构成的高度，下方空白处不属于body，所以没有触发（这样侧面说明标准模式下`document.body.clientHeight` 的值不属于特例）
            - 但是在标准模式下，html的区域也应该靠内容支撑，但是仍然触发了html的点击事件，这是因为**它是特例**，`document.documentElement.clientHeight` 就是视口高度（<html>在浏览器中的实际高度并非如此）
            - 在混杂模式下，这一次点击的body记录不会消失（如果点击的空白处在浏览器视口边上，body也不会出现，因为body默认样式为`margin: 8px` ，外边距不算元素内容，不会触发点击事件），因为body元素和html元素在混杂模式下默认都是视口高宽（只是body多了默认外边距）

# 1.2 事件捕获（Event Capturing）

- Netscape Communicator团队提出了另一种名为**事件捕获（Event Capturing）**的事件流
    - 事件捕获的意思是在最不具体的节点应该最先收到事件，而最具体的节点应该最后收到事件
    - 事件捕获实际上是为了在事件到达最终目标前**拦截事件**
- 在事件冒泡中的第一个简单例子，点击div元素后的事件捕获，按照以下顺序触发元素的点击事件：
    1. document
    2. <html>
    3. <body>
    4. <div>
    
    ---
    
    - 事件捕获中，点击事件首先由document元素捕获，然后沿着DOM树依次向下传递，直到到达目标元素<div>,过程图如下
        
        ![事件捕获.png](1%20%E4%BA%8B%E4%BB%B6%E6%B5%81%EF%BC%88Event%20Flow%EF%BC%89/%25E4%25BA%258B%25E4%25BB%25B6%25E6%258D%2595%25E8%258E%25B7.png)
        
- 验证事件捕获这种事件流关于页面元素接收事件的顺序的机制的例子如下（参考事件冒泡验证用的例子）
    
    ```jsx
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>冒泡机制验证</title>
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
        <ul></ul>
        <script>
          const div = document.querySelector("div");
          const ul = document.querySelector("ul");
          const handler = (e, who) => {
            const li = document.createElement("li");
            li.textContent = `触发点击事件的目标对象：${who}`;
            ul.appendChild(li);
            if (e.target.nodeName.toLocaleLowerCase().includes(who)) {
              ul.appendChild(document.createElement("hr"));
            }
          };
          div.addEventListener("click", (e) => handler(e, "div"), true);
          document.body.addEventListener(
            "click",
            (e) => handler(e, "body"),
            true
          );
          document.documentElement.addEventListener(
            "click",
            (e) => handler(e, "html"),
            true
          );
          document.addEventListener("click", (e) => handler(e, "document"), true);
          window.addEventListener("click", (e) => handler(e, "window"), true);
        </script>
      </body>
    </html>
    ```
    
    ![clickCaptrueEvent.gif](1%20%E4%BA%8B%E4%BB%B6%E6%B5%81%EF%BC%88Event%20Flow%EF%BC%89/clickCaptrueEvent.gif)
    
    - 这三次点击和事件冒泡中的点击一样，所以每次点击增加的事件触发的记录也是一样的，唯一的区别是每次点击最开始都是window触发，然后一层层向下传递点击事件，直到最深节点触发点击事件
    - `addEventListener` 函数在第三个参数中填入`true` 就能让事件流机制变成事件捕获
- 虽然事件捕获是Netscape Communicator唯一的事件流模型，但是事件捕获得到了所有现代浏览器的支持
    - 实际上所有浏览器都是从window对象开始捕获事件，而DOM2 Events规范规定从document开始
    - 由于旧版本浏览器不支持，因此几乎不会使用事件捕获，即使是支持事件捕获的现代浏览器，也推荐使用事件冒泡，事件捕获只在特殊情况下使用

# 1.3 DOM 事件流（DOM Event Flow）

- DOM2 Events规范规定事件流分为三个阶段
    - **事件捕获阶段**（**event capturing phase**）：最先发生，为提前拦截事件提供可能
    - **到达目标**（**at the target**）：实际的目前元素接收到事件
    - **事件冒泡阶段**（**event bubbling phase**）：最迟要在这个阶段响应事件
- 仍然以最简单的那个HTML为例子，点击<div>元素会有如图所示的顺序触发事件
    
    ![DOM事件流.png](1%20%E4%BA%8B%E4%BB%B6%E6%B5%81%EF%BC%88Event%20Flow%EF%BC%89/DOM%25E4%25BA%258B%25E4%25BB%25B6%25E6%25B5%2581.png)
    
    - 在DOM事件流中，实际的目标（<div>元素）在捕获阶段不会接收到事件，因为捕获阶段从document到<html>再到<body>就结束了
    - 下一阶段，即会在<div>元素上触发事件的“到达目标”阶段，通常**在事件处理时被认为是冒泡阶段的一部分**
    - 冒泡阶段开始，事件反向传递至文档
- 大多数支持DOM事件流的浏览器实现了一个小小的扩展
    - 虽然DOM2 Events规范**明确捕获阶段不命中事件目标，但现代浏览器都会在捕获阶段在事件目标上触发事件**
    - 最终结果是在事件目标上有**两个机会**来处理事件
    - 所有现代浏览器都支持DOM事件流，只有IE8及更早的版本不支持

---

- 下面是一个例子补充，说明捕获阶段和冒泡阶段都会触发事件（两次机会处理事件）
    
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
        <div>Click Me</div>
        <ul></ul>
        <script>
          const div = document.querySelector("div");
          const ul = document.querySelector("ul");
          let cur = 0;
          const handler = (e, who) => {
            const li = document.createElement("li");
            li.textContent = `触发点击事件的目标对象：${who}`;
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
    </html>
    ```
    
    ![DOM Event Flow.gif](1%20%E4%BA%8B%E4%BB%B6%E6%B5%81%EF%BC%88Event%20Flow%EF%BC%89/DOM_Event_Flow.gif)
    
    - 这个例子是事件冒泡和事件捕获两个补充例子的结合
    - 通过记录的触发事件顺序可以验证**DOM事件流**的正确性
    - 同时也验证了规范**明确捕获阶段不命中事件目标，但现代浏览器都会在捕获阶段在事件目标上触发事件**