# Pointer Events

参考[Pointer Events level 3](https://www.w3.org/TR/pointerevents3/)

本规范中的特性**扩展**（**extend**）或**修改**（**modify**）了指针事件（Pointer Events）中的特性，指针事件是W3C推荐标准，它描述了用于处理来自设备(包括鼠标、笔、触摸屏等)的**硬件不可知的（hardware agnostic，硬件层抽象）**的**指针输入（pointer input）**的事件和相关接口。为了与现有的基于鼠标的内容兼容，该规范还描述了为其他类型的指针设备触发鼠标事件（Mouse Events）的映射。

关于PointerEvents规范在不同浏览器和JavaScript环境下的支持程度，可以参考[caniuse](https://caniuse.com/) 网址

### **名词解释**

**用户代理/User agent** ：一种应用程序（Program），如浏览器或内容创作工具（content authoring tool），通常在客户端机器上运行，对用户方便的作用是**检索**（**retrieving**）、**解释**（**interpreting**）、**执行**（**executing**）、**呈现**（**presenting**）或**创建内容**（**creating content**）

**指针**（**pointer**）：一种**与硬件无关的（hardware agnostic）**输入设备（**抽象**）描述（比如鼠标，触摸笔，或触摸屏上的一个触摸点），指针可以指向一个具体表面（如屏幕）上的特定坐标(或一组坐标)

**直接操作**（***direct manipulation***）：某些用户代理（如触屏设备上的浏览器）实现了“直接操作”的定义（**metaphor，隐喻**），其中指针不仅与控件交互，而且还用于直接平移或缩放当前页面，提供了直接物理接触的**错觉**（**illusion**）。例如，使用触屏设备的用户通常能够使用手指或触控笔“**抓取（grab）**”页面，并通过移动指针来平移页面，或直接操作页面。这与普通台式机/笔记本电脑上的鼠标指针形成对比，后者通过滚动条完成平移，而不是通过“**拖动（dragging）**”页面。

**活动指针**（***active pointer***）：任何触点（touch contact）、触控笔/手写笔（pen/stylus）、鼠标光标或其他可以产生事件的指针。如果给定的指针(由唯一的`[pointerId](Pointer%20Events.md)`标识)有可能在文档中产生额外的事件，那么该指针仍然被认为是活动的，例如

- 连接到设备的鼠标始终处于活动状态
- 屏幕上的触碰被认为是活动的
- 如果触点或触控笔/手写笔被举起超出了数字化仪的范围，那么它就不再被认为是活动的

<aside>
ℹ️ 注意：在某些平台上，**活动指针集**（**set of active pointers**）包括设备的所有指针输入，包括任何不针对用户代理的指针(例如，那些针对其他应用程序的指针)

</aside>

**浏览器上下文**（**browsing contexts**）：浏览上下文是一系列文档的**编程表示**（**programmatic representation**），单个**导航项（navigable，**指一个tab页**）**中可以包含多个文档（如 内嵌的<iframe>页包含浏览器上下文）。每个浏览上下文都有一个对应的`[WindowProxy](https://developer.mozilla.org/en-US/docs/Glossary/WindowProxy)` （WindowProxy是Window对象的包装器）对象，以及以下内容:

- 一个**opener browsing context**：一个 [browsing context](https://html.spec.whatwg.org/multipage/document-sequences.html#browsing-context) 或 `null`, 初始化为`null`
- 一个**opener origin at creation：**一个 [origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) 或 `null`, 初始化为`null`
- 一个 **is popup：** 布尔值,  初始化为`false`
    
    <aside>
    📒 在这个规范中，***is popup***的唯一的强制影响是对相关`[BarProp](https://html.spec.whatwg.org/multipage/nav-history-apis.html#barprop)`对象的可见`getter`的影响。但是，用户代理也可能出于[用户界面](https://html.spec.whatwg.org/multipage/document-lifecycle.html#nav-traversal-ui)的考虑而使用它
    
    </aside>
    
- 一个**is auxiliary ：**布尔值,  初始化为`false`
- 一个**initial URL：** 一个 [URL](https://url.spec.whatwg.org/#concept-url) 或 `null`, 初始化为`null`
- 一个**creator base URL：**`null` 或者 一个返回 [URL](https://url.spec.whatwg.org/#concept-url) 的算法（algorithm） , 初始化为`null`
- 一个**virtual browsing context group ID** ：整型，初始化为 0。 跨源打开器策略报告（[cross-origin opener policy reporting](https://html.spec.whatwg.org/multipage/browsers.html#coop-struct-report-only-value)）使用它来跟踪可能发生的浏览上下文组切换，这种切换发生在执行**仅报告策略（report-only policy）**时

---

**活动窗口（active window）：**浏览器上下文的活动窗口是WindowProxy对象的[[[Winodow]]](https://html.spec.whatwg.org/multipage/nav-history-apis.html#concept-windowproxy-window)**内部槽值**（**internal slot value，**也就是Window对象）

**活动文档**（**active document**）：浏览器上下文的活动文档是活动窗口关联的`Document` 对象

**顶层通道**（**top-level traversable**）：浏览器上下文的顶层通道是对应活动文档的**节点导航（**[node navigable](https://html.spec.whatwg.org/multipage/document-sequences.html#node-navigable)**）的顶层通道**

**[is auxiliary](Pointer%20Events.md)**为true的浏览上下文称为**auxiliary browsing context，auxiliary browsing context**总是顶级浏览上下文（[top-level browsing contexts](https://html.spec.whatwg.org/multipage/document-sequences.html#top-level-browsing-context)）

**顶级浏览器上下文**（**top-level browsing context**）：顶级浏览器上下文的活动文档的节点导航是**可穿越导航（**[traversable navigable](https://html.spec.whatwg.org/multipage/document-sequences.html#traversable-navigable)）

浏览器上下文中的`Document`被指定为active document

浏览器上下文是呈现document对象给用户的环境

浏览器中的1个tab或一个窗口包含一个顶级浏览器上下文，如果该页面有iframe，则iframe中也会有自己的浏览器上下文，称为嵌套的浏览器上下文

**接触点几何形状（*contact geometry*）**：**数位板**（**digitizer**）上输入(最常见的是触摸)的**包围框（bounding box）**。这里的输入设备通常是指**指针输入分辨率（pointer input resolution）**比单个像素更粗的设备。有些设备根本不报告这些数据（如鼠标）

**活动按键状态**（***active buttons state***）：在指针事件对象的`buttons`属性具有非零值时，指针处于**活动按键状态**。对于鼠标而言，这种情况就是当鼠标设备至少有一个按键按下时。对于触摸屏而言，这种情况就是用户和屏幕（**digitizer**）有物理接触时。对于触控笔来说，这种情况就是笔与屏幕（**digitizer**）有物理接触，或者在悬停时至少按下一个按键时

**命中测试（*hit test*）**：用户代理为指针事件确定目标元素的过程。通常，这是通过考虑指针的位置以及屏幕媒体上文档中元素的可视布局来确定的。ChatGPT对此回答的更具体：

> 普通命中测试机制（normal hit test mechanisms）指的是浏览器在处理指针事件时使用的一种机制，用于确定事件发生的目标对象。通常情况下，浏览器会根据指针事件的**发生位置**和**DOM树结构**来自动确定事件的目标对象。
> 
> 
> 具体来说，在处理指针事件时，浏览器会通过一系列命中测试来确定事件的目标对象。命中测试是指浏览器检查事件发生位置是否与某个元素重叠的过程。浏览器会从事件发生位置开始，沿着元素的层级结构向上进行命中测试，直到找到一个命中的元素为止。
> 
> 命中测试通常会受到一些因素的影响，例如CSS的样式规则、元素的布局和排列顺序等。因此，在某些情况下，浏览器可能会根据不同的因素产生不同的命中结果。
> 

**节点文档（node document）：**每个节点都有一个关联的**节点文档**，在创建时设置，这就是一个`document` 对象（可以通过`Node` 定义的`ownerDocument` 属性访问）

指针的**活动文档**（**active document**）**：**对于每个正在**活动指针（[active pointer](Pointer%20Events.md)）**（如鼠标指针、触摸屏幕上的手指），最后一个与该指针相关的事件所涉及到的文档即为接收该事件的文档;换句话说，如果用户使用鼠标或触摸屏幕进行操作，那么文档会跟踪每个指针所在的位置，并在每次发生与指针相关的事件时，将该事件发送到与该指针相关的文档

**直接操作（*direct manipulation*）**：某些用户代理（如触屏设备上的浏览器）实现了“直接操作”的隐喻，其中指针不仅与控件交互，而且还用于直接平移或缩放当前页面，提供了直接物理接触的错觉。例如，触摸屏设备上的用户通常可以使用手指或触控笔来“抓住”页面，并通过移动指针来直接操作页面。与此相反，在普通台式机/笔记本电脑上使用鼠标指针时，平移是通过使用滚动条来完成的，而不是通过“拖动”页面。（这段话强调了在触摸屏设备上使用指针时的**直接性和物理感觉**。）

<aside>
💡 在某些情况下，触控板(比如笔记本电脑上的触控板)将允许用户通过“拖动”触控板来滚动。然而，这通常是通过触摸板生成“假”鼠标滚轮事件来实现的，所以这不能算作直接操作。

</aside>

# 1. 介绍

## 指针事件的由来

*鼠标事件越来越不能被作为**所有**的**指向输入设备**的事件*

目前，大多数[HTML，指[HTML-Standard](https://html.spec.whatwg.org/multipage/)规范]内容都是以**鼠标**输入进行**使用**或**设计**的。那些以自定义方式处理输入的事件处理程序通常编码为[UIEVENTS，指在[UIEVENTS](https://www.w3.org/TR/uievents/)规范对鼠标事件的定义]鼠标事件（Mouse Events）。然而，当今更新的计算设备包含了其他形式的输入，包括**触摸屏**、**触控笔**等。**事件类型被建议单独处理每种形式的输入**。但是，每当有新类型的输入设备需要支持时，这种方法会导致不必要的**逻辑重复（duplication of logic）**和**事件处理开销（event handling）**。当内容（content，指规范设计）只考虑一种设备类型时，通常会产生兼容性问题。此外，为了与现有的基于鼠标的内容兼容，大多数**[用户代理](Pointer%20Events.md)**为所有输入类型的设备触发鼠标事件（Mouse Events）。这使得鼠标事件（Mouse Events）是代表实际的鼠标设备，还是为了兼容另一种类型的输入设备也生成鼠标事件，变得**不确定**（**ambiguous**），这也使得很难同时对这两种设备类型进行编码（区分）

## 统一指向性输入设备的事件规范

为了减少对多种类型的输入设备进行编码的成本，也为了解决上述Mouse Events的**模糊性**（**ambiguity**）问题，本规范定义了一种**更抽象（more abstract）**的输入形式，称为**指针（pointer）**。指针可以是屏幕上由鼠标光标、触控笔、触摸(包括多点触摸)或其他**指向输入设备**所形成的任何**接触点（point of contact）**。这种模型使得编写网站和应用程序更容易，无论用户使用什么硬件都能很好地工作。对于需要特定于设备的处理的**场景**（**scenarios**），该规范还定义了用于检查触发事件的设备类型的属性。（本规范的）主要目标是提供一组事件和接口，以便更容易地描述跨设备指针输入，同时在需要增强体验时也允许特定于设备的处理。

另一个关键目标是使**多线程（multi-threaded）**用户代理能够处理平移和缩放的**直接操作（[direct manipulation](Pointer%20Events.md)）**行为（例如，在触摸屏上使用手指或触控笔），而不会阻塞脚本执行。

![**指针**（**pointer**）是一种**与硬件无关的（hardware agnostic）**输入设备（**抽象**）描述（比如鼠标，触摸笔，或触摸屏上的一个触摸点），指针可以指向一个具体表面（如屏幕）上的特定坐标(或一组坐标)](Pointer%20Events/pointer.png)

**指针**（**pointer**）是一种**与硬件无关的（hardware agnostic）**输入设备（**抽象**）描述（比如鼠标，触摸笔，或触摸屏上的一个触摸点），指针可以指向一个具体表面（如屏幕）上的特定坐标(或一组坐标)

<aside>
ℹ️ 注意

虽然该规范为各种指针输入定义了**统一的事件模型**，但该模型不包括其他形式的输入，如键盘或类似键盘的接口(例如，运行在**只触屏幕设备【touchscreen-only device，如智能手机】**上的屏幕阅读器【screen reader】或类似的辅助技术，它允许用户通过可聚焦的控件和元素进行顺序导航)。虽然用户代理也可以选择生成指针事件来响应这些接口，但本规范没有涉及这种场景。

在上面的第一个例子（键盘）中，鼓励开发者通过响应`focus`、`blur`和`click`等高层事件，为所有形式的输入提供等效功能。然而，当使用低层事件(如指针事件)时，鼓励开发者确保支持所有类型的输入。对于键盘和类似键盘的接口，这可能需要添加显式的键盘事件处理。详见[WCAG指南2.1键盘访问](https://www.w3.org/TR/WCAG/#keyboard-accessible)

</aside>

## 指针事件和鼠标事件具有相似性

处理一般指针输入的事件与鼠标事件非常相似：`pointerdown`、`pointermove`、`pointerup`、`pointermove`、`pointerup`等等。这样可以方便地将内容（规范设计）从鼠标事件迁移到指针事件。指针事件提供了鼠标事件中所有常见的属性：客户端坐标（`clientX/Y`）、目标元素（`target`）、按钮状态（`button`、`buttons`）等，此外还提供了其他形式输入的新属性：压力（`pressure`）、接触点几何位置（**contact geometry**）、倾斜度（**tilt**）等。因此，开发者可以轻松地编写指针事件代码，在不同的输入类型之间共享有意义的逻辑，并仅在必要时为特定类型的输入设备进行定制，以获得最佳体验。

## 指针事件不是所有设备事件的集成

虽然指针事件来源于各种各样的输入设备，但它们并不是由特定于设备的事件集定义的（虽然这些特定设备可以引发指针事件）。尽管出于兼容性考虑，本规范并不要求支持其他特定于设备的事件(例如鼠标事件、触摸事件等)。用户代理可以做到只支持指针事件，而不支持任何其他设备事件。为了兼容在**特定鼠标事件（mouse-specific events，**这里指UIEvents规范中定义的鼠标事件**）**写入的内容（规范设计），该规范提供了一个可选部分，描述如何基于来自鼠标以外设备的指针输入生成**兼容性鼠标事件（compatibility mouse events）**。

<aside>
ℹ️ 笔记

上面后面几段话的意思是：指针事件继承与鼠标事件，非鼠标设备的其它指针设置引发的指针事件，可以被转成**兼容性的鼠标事件**

对于同时支持**触摸事件**(在[[Touch - Events](https://w3c.github.io/touch-events/)]中定义)和**指针事件**的用户代理，本规范没有对这种用户代理的行为提供任何建议。有关这两个规范之间关系的更多信息，请参阅[Touch Events Community Group](https://www.w3.org/community/touchevents/) 

> 由于开发人员的关注点现在已经转向了指针事件规范，这个社区小组主要是作为看管者来维护并在必要时更新Touch Events Level 2组报告，以反映浏览器实现的现实情况。在这个小组报告中，目前没有任何新功能开发的计划。
> 
</aside>

# 2. 一些例子

下面是一些基本示例，演示了开发者如何使用该规范中的某些api。此外，在本文档的相关章节中提供了更具体的示例

## 2.1 例子1

- 特性检测和事件绑定
    
    ```jsx
    // 绑定到指针事件或传统的触摸/鼠标
    if (window.PointerEvent) {
      // 如果用户代理支持指针事件，就只监听指针事件
      target.addEventListner("pointerdown", (e) => {
        // 如果有必要，对不同的触摸、触控笔、鼠标等设备，应用基于e.pointerType的独立逻辑
        // ...
      });
      // ...监听其它指针事件
    } else {
      // 传统的触摸/鼠标事件处理程序
      target.addEventListener("touchstart", (e) => {
        // 为了兼容鼠标事件的click,调用preventDefault
        e.preventDefault();
      });
      // ..监听鼠标按下事件
      target.addEventListener("mousedown", (e) => {
        // ...
      });
    }
    
    // 用于键盘处理的附加事件监听器
    ```
    
    - 支持指针事件就用指针事件，不支持特定于设备的鼠标事件或触摸事件

## 2.2 例子2

- 检测来自用户的输入类型
    
    ```jsx
    window.addEventListener("pointerdown", detectInputType);
    
    function detectInputType(event) {
      switch (event.pointerType) {
        case "mouse":
          /* mouse input detected */
          break;
        case "pen":
          /* pen/stylus input detected */
          break;
        case "touch":
          /* touch input detected */
          break;
        default:
        /* pointerType is empty (could not be detected)
          or UA-specific custom type */
      }
    }
    ```
    
    - `mouse` ：鼠标设备
    - `pen` ：触控笔
    - `touch` ：触摸屏

## 2.3 例子3

- 调整元素的大小以匹配接触点的几何形状（**contact geometry**）
    
    ```jsx
    <style>
      div {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100px;
        height: 100px;
        background-color: antiquewhite;
      }
    </style>
    <body>
    	<div></div>
    </body>
    
    window.addEventListener("pointerdown", checkPointerSize);
    function checkPointerSize(e) {
      console.log(e);
      e.target.style.width = e.width + "px";
      e.target.style.height = e.height + "px";
    }
    ```
    
    - `PointerEvent`接口定义的`width` 和`height` 用于确定接触点的宽度和高度，如果输入硬件不能向浏览器报告接触几何，它们的值默认为1

## 2.4 例子4

- 从脚本触发**不受信任**（untrusted）的指针事件
    
    ```jsx
    const event1 = new PointerEvent("pointerover", {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 42,
      pointerType: "pen",
      clientX: 300,
      clientY: 300,
    });
    
    eventTarget.dispatchEvent(event1);
    
    let pointerEventInitDict =
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 42,
      pointerType: "pen",
      clientX: 300,
      clientY: 500,
    };
    const p1 = new PointerEvent("pointermove", pointerEventInitDict);
    pointerEventInitDict.clientX += 10;
    const p2 = new PointerEvent("pointermove", pointerEventInitDict);
    pointerEventInitDict.coalescedEvents = [p1, p2];
    const event2 = new PointerEvent("pointermove", pointerEventInitDict);
    eventTarget.dispatchEvent(event2);
    ```
    
    - 通过构造函数创建事件然后派发就属于触发不受信任的指针事件

# 3. 指针事件和接口（Pointer Events and interfaces）

## 3.1 `PointerEvent` interface

```jsx
dictionary PointerEventInit : MouseEventInit {
    long        pointerId = 0;
    double      width = 1;
    double      height = 1;
    float       pressure = 0;
    float       tangentialPressure = 0;
    long        tiltX;
    long        tiltY;
    long        twist = 0;
    double      altitudeAngle;
    double      azimuthAngle;
    DOMString   pointerType = "";
    boolean     isPrimary = false;
    sequence<PointerEvent> coalescedEvents = [];
    sequence<PointerEvent> predictedEvents = [];
};

[Exposed=Window]
interface PointerEvent : MouseEvent {
    constructor(DOMString type, optional PointerEventInit eventInitDict = {});
    readonly        attribute long        pointerId;
    readonly        attribute double      width;
    readonly        attribute double      height;
    readonly        attribute float       pressure;
    readonly        attribute float       tangentialPressure;
    readonly        attribute long        tiltX;
    readonly        attribute long        tiltY;
    readonly        attribute long        twist;
    readonly        attribute double      altitudeAngle;
    readonly        attribute double      azimuthAngle;
    readonly        attribute DOMString   pointerType;
    readonly        attribute boolean     isPrimary;
    [SecureContext] sequence<PointerEvent> getCoalescedEvents();
    sequence<PointerEvent> getPredictedEvents();
};
```

### `pointerId`

**类型**

四字节整型（long）数字

**定义**

引起指针事件的**唯一标识符（unique identifier）**。**用户代理**可以为**主鼠标指针**预留一个通用的`pointerId`值0或1。必须预留`pointerId`值-1，并用于指示由**指向设备以外**的其他设备生成的事件。对于任何其他指针，用户代理可以自由地实现不同的策略和方法来分配`pointerId`值。

**顶级浏览上下文**(由[HTML]定义)中的所有[**活动指针](Pointer%20Events.md)（active pointers）**必须是唯一的，并且标识符不能受到任何其他[顶级浏览上下文](Pointer%20Events.md)的影响(即一个**顶级浏览上下文不能**假定指针的`pointerId`在指针移动到浏览上下文之外并进入另一个顶级浏览上下文时是相同的)。

用户代理可以从以前的**活动指针**中回收`pointerId`的先前**退役值**（**retired values**），或者它可以总是为特定的指向设备**重用（reuse）**相同的`pointerId`（例如，在多用户协作应用程序中唯一地识别来自特定用户的特定触控笔/手写笔）。然而，在后一种情况下，为了最大限度地减少跨不同页面或域进行指纹识别和跟踪的机会，在页面/会话的生命周期内，必须只**显式地（explicity）**将`pointerId`与特定的指向设备相关联，并且在下一次在新会话中再次使用特定的指向设备时，必须选择一个新的随机化`pointerId`

<aside>
📒 注意

`pointerId`选择算法是特定于实现的。因此，开发者不能假设它的值会传达任何特定的含义，`pointerId`只是指针的标识符，该标识符与所有其他**活动指针**都是唯一的。例如，用户代理可以简单地将一个从0开始的数字按照活动指针变得活跃的顺序分配给所有活动指针——但这些值不能保证单调递增

</aside>

**例子**

```jsx
function getEle(selector) {
  return document.querySelector(selector);
}
const log = getEle(".log");
function handler(e) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="type">${e.type}</span>
  <span class="target">${e.target.className}</span>
  <span class="currentTarget">${e.currentTarget.className}</span>
  <span class="base">${e.pointerId}</span>
  <span class="base">${e.detail}</span>
  <span class="base">${e.screenX}/${e.screenY}</span>
  <span class="base">${e.clientX}/${e.clientY}</span>
  <span class="base">${e.button}</span>
  <span class="base">${e.buttons}</span>
  `;
  log.appendChild(li);
}

const click = getEle(".click");
click.addEventListener("pointerdown", handler);
```

![pointerId.png](Pointer%20Events/pointerId.png)

- 不同浏览器对`pointerId` 的赋值不同，在Windows系统PC上，鼠标设备点击触发的`pointerdown` 事件，火狐浏览器（下面）记录的`pointerId` 是0，而谷歌浏览器记录的是1

### `width`

**类型**

64位双精度浮点数（double）

**定义**

指针**接触点几何形状（[contact geometry](Pointer%20Events.md)）**的宽度(X轴上的大小)，以CSS像素为单位(参见[[CSS21](https://www.w3.org/TR/pointerevents3/#bib-css21)])。这个值可以在每个触发的指针事件上更新。对于通常缺乏**接触点几何形状**的输入(例如传统的鼠标)，以及硬件无法检测到实际几何形状输入的情况，用户代理必须返回默认值1

### `height`

**类型**

64位双精度浮点数（double）

**定义**

指针**接触点几何形状（[contact geometry](Pointer%20Events.md)）**的高度(Y轴上的大小)，以CSS像素为单位(参见[[CSS21](https://www.w3.org/TR/pointerevents3/#bib-css21)])。这个值可以在每个触发的指针事件上更新。对于通常缺乏**接触点几何形状**的输入(例如传统的鼠标)，以及硬件无法检测到实际几何形状输入的情况，用户代理必须返回默认值1

**例子（包含对width的解释）**

```jsx
function App() {
  const [data, setData] = useState([]);
  const handlePointerDown = (e) => {
    const { type, currentTarget, pointerId, width, height } = e;
    setData((state) => [
      ...state,
      {
        type,
        target: e.target.classList[0],
        currentTarget: currentTarget.classList[0],
        pointerId,
        width: width.toFixed(2),
        height: height.toFixed(2),
        date: new Date().getTime(),
      },
    ]);
  };
  return (
    <div className={"container"}>
      <Button
        className="click"
        type="primary"
        onPointerDown={handlePointerDown}
        size={"large"}
      >
        click me
      </Button>
      <Table
        className={"my-ant-table"}
        dataSource={data}
        size={"large"}
        rowKey={"date"}
        columns={columns}
        scroll={{ x: "100%" }}
        pagination={{ pageSize: 5 }}
        width={500}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
```

源代码：**[github](https://github.com/mangwu/javascript/tree/master/ProfessionalJavaScriptForWebDeveloper4/ch17%20-%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89/17.4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/17.4.3%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%EF%BC%88Mouse%20Events%EF%BC%89/17.4.3.4%20The%20Pointer%20Event/17.4.3.4.3%20PointerEvent%20interface/17.4.3.4.3.3%20width_height)**

![windows，PC，谷歌浏览器环境下的鼠标点击，每个`pointerId`都是1，鼠标设备的指针不存在**接触点几何形状，**所以`width`和`height`默认返回1](Pointer%20Events/pointer_event_-_width_heigth1.gif)

windows，PC，谷歌浏览器环境下的鼠标点击，每个`pointerId`都是1，鼠标设备的指针不存在**接触点几何形状，**所以`width`和`height`默认返回1

![这是谷歌浏览器**模拟**三星Galaxy S8+ 安卓智能手机的情况，可以发现触摸触发的指针事件的`pointerId` 是从2开始自增的，并且触摸是具有`width`和`height` 的，这里显示的是23px](Pointer%20Events/pointer_event_-_width_heigth2.gif)

这是谷歌浏览器**模拟**三星Galaxy S8+ 安卓智能手机的情况，可以发现触摸触发的指针事件的`pointerId` 是从2开始自增的，并且触摸是具有`width`和`height` 的，这里显示的是23px

![这是谷歌浏览器**模拟**iPhone XR 苹果智能手机的情况，同样`pointerId` 是从2开始自增的，中间一下增加2位是因为非对click me按键进行的点击也对`pointerId` 进行了自增，触摸的指针事件的`width` 和`height` 是`24.73…` ，这个数值和具体的设备有关系](Pointer%20Events/pointer_event_-_width_heigth3.gif)

这是谷歌浏览器**模拟**iPhone XR 苹果智能手机的情况，同样`pointerId` 是从2开始自增的，中间一下增加2位是因为非对click me按键进行的点击也对`pointerId` 进行了自增，触摸的指针事件的`width` 和`height` 是`24.73…` ，这个数值和具体的设备有关系

### ***`pressure`***

**类型**

32位单精度（float）浮点数

**定义**

表示指针输入的在[0,1]范围内的**标准化（normalized）**压力，其中0和1分别表示硬件能够检测到的最小和最大压力。对于不支持压力的硬件和平台，当处于**活动按键状态（*[active buttons state](Pointer%20Events.md)*）**时，该值必须为0.5，否则为0

**例子**

```jsx
function App() {
  const [data, setData] = useState([]);
  const handlePointerClick = (e) => {
    const { type, currentTarget, pointerId, pressure, buttons } = e;
    setData((state) => [
      ...state,
      {
        type,
        target: e.target.classList[0],
        currentTarget: currentTarget.classList[0],
        pointerId,
        pressure,
        buttons,
        date: new Date().getTime(),
      },
    ]);
  };
  return (
    <div className={"container"}>
      <Button
        className="click"
        type="primary"
        onPointerDown={handlePointerClick}
        onPointerUp={handlePointerClick}
        size={"large"}
      >
        click me
      </Button>
      <Table
        className={"my-ant-table"}
        dataSource={data}
        size={"large"}
        rowKey={"date"}
        columns={columns}
        scroll={{ x: "100%" }}
        pagination={{ pageSize: 5 }}
        width={500}
      />
    </div>
  );
}
```

源代码：**[github](https://github.com/mangwu/javascript/tree/master/ProfessionalJavaScriptForWebDeveloper4/ch17%20-%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89/17.4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/17.4.3%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%EF%BC%88Mouse%20Events%EF%BC%89/17.4.3.4%20The%20Pointer%20Event/17.4.3.4.3%20PointerEvent%20interface/17.4.3.4.3.4%20pressure)**

![windows PC下的谷歌浏览器，按钮监听`pointerdown`和`pointerup` 两个事件，因为是鼠标设备，不支持压力检测，所以需要根据**活动按键状态**给出默认值，在单击情况下，`pointerdown` 事件对象的`buttons` 是1，指针处于活动按键状态，所以`pressure` 的值为0.5，但是`pointerup` 事件对象的`buttons` 是0，指针不处于活动按键状态，所以`pressure` 的值为0](Pointer%20Events/pointer_event_-_pressure1.gif)

windows PC下的谷歌浏览器，按钮监听`pointerdown`和`pointerup` 两个事件，因为是鼠标设备，不支持压力检测，所以需要根据**活动按键状态**给出默认值，在单击情况下，`pointerdown` 事件对象的`buttons` 是1，指针处于活动按键状态，所以`pressure` 的值为0.5，但是`pointerup` 事件对象的`buttons` 是0，指针不处于活动按键状态，所以`pressure` 的值为0

![这是谷歌浏览器**模拟**iPhone XR 苹果智能手机的情况，因为是模拟，所以`pressure` 在指针处于**活动按键状态** 时事件对象给出了1，而指针处于非活动按键状态时，事件对象给出了0；除此之外，可以发现一次点击触发的`pointerdown` 和`pointerup` 对应的事件对象具有相同的`pointerId` 值](Pointer%20Events/pointer_event_-_pressure2.gif)

这是谷歌浏览器**模拟**iPhone XR 苹果智能手机的情况，因为是模拟，所以`pressure` 在指针处于**活动按键状态** 时事件对象给出了1，而指针处于非活动按键状态时，事件对象给出了0；除此之外，可以发现一次点击触发的`pointerdown` 和`pointerup` 对应的事件对象具有相同的`pointerId` 值

### ***`tangentialPressure`***

**类型**

32位单精度（float）浮点数

**定义**

表示指针输入的标准化**切向压力**(**tangential pressure**，也称为枪管压力，**barrel pressure**)，通常由附加控件(例如喷枪触控笔上的指轮，a finger wheel on an airbrush stylus)设置，范围为[-1,1]，其中0为控件的**中性**（**neutral**）位置。注意，某些硬件可能只支持[0,1]范围内的正值。对于不支持**切向压力**的硬件和平台，该值必须为0

**chatgpt**

> 指针事件接口中定义的切向压力(tangentialPressure)属性是指用户在**触摸屏幕时沿着表面滑动的压力**。切向压力通常与手指在屏幕上的滑动速度和方向有关，可以用来识别用户在屏幕上的旋转手势。
> 
> 
> 在移动设备和触摸屏幕中，切向压力可以作为一种重要的输入方式，用于捕捉用户的手势，从而实现更加自然的交互体验。切向压力可以帮助开发者更加精细地控制应用程序的行为，例如在绘图应用中，可以利用切向压力来调整笔刷的大小或者形状。
> 
> W3C组织发布的Pointer Events规范中，切向压力属性的取值范围是-1到1之间，表示用户在屏幕上滑动的速度和方向，0表示没有压力，（-）1表示最大压力。
> 
> 指针事件的切向压力(tangentialPressure)属性通常是**支持触控笔**的设备上才有的，这些设备包括：
> 
> 1. Windows Ink兼容设备：这些设备支持Windows Ink功能，包括Microsoft Surface系列设备、HP Spectre x360等。
> 2. iOS设备：苹果公司的iPad和iPhone支持Apple Pencil触控笔，可以捕捉到切向压力信息。
> 3. Android设备：许多Android平板电脑、智能手机和平板电脑都支持Stylus触控笔，可以通过这些设备获取切向压力属性的值。

**例子**

- 因为切向压力通常是**支持触控笔**的设备上才有，所以在PC和模拟智能手机的环境上，`tangentialPressure` 属性值都是0

### ***`tiltX`***

**类型**

四字节整型（long）数字

**定义**

表示**Y - Z平面**与**传感器**（**transducer**，例如触控笔/手写笔）轴和Y轴构成的平面之间的**平面角度**（**plane angle**，以度为单位，在[-90,90]范围内）。正的倾斜是向右，在X值增加的方向上。`tiltX`可以与`tiltY`一起使用，表示与**数字化仪传感器**（**digitizer，**这里指触摸屏幕）法线的倾斜度。对于不报告倾斜或角度的硬件和平台，该值必须为0。

![正向`tiltX`](Pointer%20Events/tiltX.png)

正向`tiltX`

**chatgpt**

> 指针事件接口中的tiltX和tiltY属性分别表示**设备在x和y轴方向上的倾斜角度**。具体来说，当使用支持倾斜的触控笔或其他指针设备时，可以通过这些属性获取到设备在水平和垂直方向上的倾斜程度。
> 
> 
> 倾斜角度的值可用于模拟3D效果、绘图应用程序和其他需要捕捉设备倾斜角度的应用程序。例如，在绘图应用程序中，可以使用倾斜角度来模拟各种画笔和绘画工具的倾斜效果，从而实现更精细的绘画效果；在游戏应用程序中，可以使用这些属性来控制游戏角色的方向和移动；在教育应用程序中，可以使用这些属性来模拟物理学中的倾斜和倾倒效果。
> 
> 需要注意的是，tiltX和tiltY属性并非所有设备和平台都支持，如果需要使用这些属性，开发者需要确保设备和平台支持它们。
> 

**例子**

- 因为`tiltX`通常是**支持触控笔**的设备上才有，所以在PC和模拟智能手机的环境上，`tiltX`属性值都是0

### ***`tiltY`***

**类型**

四字节整型（long）数字

**定义**

表示X **- Z平面**与**传感器**（**transducer**，例如触控笔/手写笔）轴和X轴构成的平面之间的**平面角度**（**plane angle**，以度为单位，在[-90,90]范围内）。正的倾斜是朝向用户，在Y值增加的方向上。`tiltX`可以与`tiltY`一起使用，表示与**数字化仪传感器**（**digitizer，**这里指触摸屏幕）法线的倾斜度。对于不报告倾斜或角度的硬件和平台，该值必须为0。

![正向`tiltY`](Pointer%20Events/tiltY.png)

正向`tiltY`

<aside>
💡 注意：tilt在英文中是倾斜的意思

</aside>

**例子**

- 因为`tiltY`通常是**支持触控笔**的设备上才有，所以在PC和模拟智能手机的环境上，`tiltY`属性值都是0

### `twist`

**类型**

四字节整型（long）数字

**定义**

表示**传感器**（**transducer，**例如触控笔/手写笔）绕其自身主轴的顺时针旋转角度（以度为单位，在[0，359]的范围内）。对于不支持`twist`的硬件和平台，该值必须为0。

<aside>
💡 注意：twist在英文中是旋转，转动的意思；一般情况下旋转从x轴正方向为0度开始

</aside>

**chatgpt**

> 在指针事件规范中，`twist`属性表示**指针绕其轴旋转的角度，**以度为单位。该属性通常由支持旋转输入的设备提供，如旋转笔或手写笔。
> 
> 
> 在使用支持旋转输入设备的应用程序中，`twist`属性可用于检测笔或手写笔绕其轴旋转的角度，以实现更精细的控制和操作。例如，在数字艺术应用程序中，`twist`属性可以用于控制笔触的方向和宽度，实现更自然的绘画效果。
> 

**例子**

- 因为`twist`通常是**支持触控笔**的设备上才有，所以在PC和模拟智能手机的环境上，`twist`属性值都是0

### ***`altitudeAngle`***

**类型**

64位双精度浮点数（double）

**定义**

表示**传感器**（**transducer，**例如触控笔/手写笔）的高度（弧度），范围为[0，π/2]——其中弧度0表示（笔）平行于触控表面（X-Y平面），弧度π/2表示（笔）垂直于触控表面（X-Y平面）。对于不报告或不支持倾斜(**tilt**)或角度(**angle**)的硬件和平台，该值必须为π/2。

<aside>
💡 注意：

此处为`altitudeAngle`定义的默认值为π/2，它将**传感器**（**transducer，**例如触控笔/手写笔）定位为垂直于表面。这与[Touch Event - level 2](https://w3c.github.io/touch-events/)规范对`altitudeAngle`属性的定义不同，后者的默认值为0。

altitude在英文中为海拔高度的意思，这里形容的是触控笔和触控表面之间的高度夹角，如下图所示

</aside>

![altitudeAngle.png](Pointer%20Events/altitudeAngle.png)

**chatgpt**

> Pointer Events规范中定义的`altitudeAngle`属性是指指针与表面垂直的夹角，也称为**俯仰角**。它通常用于描述输入设备（如触控笔）在与表面接触时的方向。`altitudeAngle`的值通常以**弧度**为单位给出，0表示指针与表面平行，π/2表示指针与表面垂直。
> 
> 
> `altitudeAngle`属性的使用场景通常涉及到绘图、手写笔记、签名等需要考虑笔尖方向的应用场景。例如，在使用手写笔记应用程序时，用户可以根据笔的倾斜角度来选择画笔的粗细，使得书写更加自然。
> 
> 不是所有的设备都支持altitudeAngle属性，**只有一些高端触控笔和一些支持触控笔的平板电脑才会提供这个属性**。常见的支持该属性的设备包括苹果iPad和Microsoft Surface系列设备等
> 

**例子**

- 在PC和模拟智能手机的环境上的例子，谷歌浏览器（111版本）的Pointer Event的事件对象**没有提供**`altitudeAngle` 属性，因为“**只有一些高端触控笔和一些支持触控笔的平板电脑才会提供这个属性**”

### ***`azimuthAngle`***

**类型**

64位双精度浮点数（double）

**定义**

表示**传感器**（**transducer，**例如笔/触笔）的方位角（以弧度为单位），范围为[0，2π]——其中0值表示：一个传感器，其**笔帽**指向X-Y平面上X值增加的方向（如果向下看，则指向“3点钟”方向），顺时针方向时，值逐渐增加（“6点钟”处值为的π/2，“9点钟”处值为π，“12点钟”处值为3π/2）。当**传感器**完全垂直于表面（**俯仰角，**也就是***`altitudeAngle`***为π/2）时，该值必须为0。对于不报告倾斜或角度的硬件和平台，该值必须为0。

<aside>
💡 注意：azimuth 在英文中是“方位”的意思，这个属性和`twist` 属性类似，只不过它以弧度为计量指标

</aside>

![azimuthAngle.png](Pointer%20Events/azimuthAngle.png)

**例子**

- 在PC和模拟智能手机的环境上的例子，谷歌浏览器（111版本）的Pointer Event的事件对象**没有提供*`azimuthAngle`***属性，因为“**只有一些高端触控笔和一些支持触控笔的平板电脑才会提供这个属性**”

### ***`pointerType`***

**类型**

DOMString（DOMString类型对应于所有可能的代码单元序列的集合。这样的序列通常被解释为UTF-16编码的字符串[[RFC2781](https://www.rfc-editor.org/rfc/rfc2781)]，尽管这不是必需的。）

**定义**

指示引发事件的**设备类型**（鼠标、触控笔、触摸等）。如果用户代理要为鼠标、笔/触笔或触摸输入设备触发指针事件，则`pointerType`的值必须符合下表：

| 指针设备类型（Pointer Device Type） |  pointerType 值（Value） |
| --- | --- |
| 鼠标（Mouse） | mouse |
| 触控笔/手写笔（Pen / stylus） | pen |
| 触摸触点（Touch contact） | touch |

如果用户代理无法检测到设备类型，则该值**必须为空字符串**。如果用户代理支持除上述类型之外的指针设备类型，则`pointerType`的值应以供应商为前缀，以避免不同类型设备的名称冲突。未来的规范可能会为其他设备类型提供额外的标准值。

<aside>
💡 注：有关如何使用`pointerType`的基本演示，请参见[示例2](Pointer%20Events.md)。还要注意，开发人员应该包括某种形式的默认处理，以涵盖可能已经实现了自己的自定义`pointerType`值的用户代理，以及`pointerType`只是一个空字符串的情况。

</aside>

**例子**

```jsx
function App() {
  const [data, setData] = useState([]);
  const handlePointerClick = (e) => {
    console.log(e);
    const { type, currentTarget, pointerId, pointerType, buttons } = e;
    setData((state) => [
      ...state,
      {
        type,
        target: e.target.classList[0],
        currentTarget: currentTarget.classList[0],
        pointerId,
        pointerType,
        buttons,
        date: new Date().getTime(),
      },
    ]);
  };
  return (
    <div className={"container"}>
      <Button
        className="click"
        type="primary"
        onPointerDown={handlePointerClick}
        onPointerUp={handlePointerClick}
        size={"large"}
      >
        click me
      </Button>
      <Table
        className={"my-ant-table"}
        dataSource={data}
        size={"large"}
        rowKey={"date"}
        columns={columns}
        scroll={{ x: "100%" }}
        pagination={{ pageSize: 5 }}
        width={500}
      />
    </div>
  );
}
```

- 完整代码**[github](https://github.com/mangwu/javascript/tree/master/ProfessionalJavaScriptForWebDeveloper4/ch17%20-%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89/17.4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/17.4.3%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%EF%BC%88Mouse%20Events%EF%BC%89/17.4.3.4%20The%20Pointer%20Event/17.4.3.4.3%20PointerEvent%20interface/17.4.3.4.3.11%20pointerType)**
- 在PC环境下，使用鼠标点击按钮，`pointerType` 值是“mouse”
- 模拟智能手机环境，`pointerType` 值是”touch”

### ***`isPrimary`***

**类型**

布尔值（boolean）

**定义**

指示指针是否表示此指针类型的**主指针（[primary pointer](Pointer%20Events.md)）**。

**chatgpt**

> 在计算机图形学中，指针事件中的 **`isPrimary`** 属性表示触发事件的指针设备是否是主要的设备。~~主要设备通常是指鼠标或触控板，而不是其他指针设备，如触摸屏、手写笔等。~~
> 
> 
> 这个属性在多指触控设备中非常有用，因为它可以帮助开发人员确定哪一个设备应该被认为是主要的输入设备。例如，在一个支持触摸屏和鼠标的应用程序中，当用户同时使用鼠标和触摸屏时，开发人员可以使用 **`isPrimary`** 属性来确定哪一个输入设备应该被优先处理。
> 
> 使用场景包括但不限于：
> 
> - 确定主要输入设备，以便正确处理输入事件
> - 处理多指触控设备的输入事件
> - 确定应该在哪个设备上显示光标或指示器
> - 根据触摸事件的 **`isPrimary`** 属性来实现不同的用户界面交互模式等。

> 非常抱歉，我的前一个回答有歧义。实际上，在计算机上，**主指针是指当前输入设备中的主要指针**，**可以是鼠标、触控板、触摸屏、手写笔等**。主指针通常是用户在使用计算机时最常用的输入设备之一，它的移动和操作可以控制光标或其他指针在屏幕上移动或执行其他操作。
> 
> 
> 在传统的桌面电脑上，鼠标通常是主指针，因为它是最常用的输入设备之一。在笔记本电脑上，触摸板通常是主指针。而在触摸屏设备上，主指针通常是指用户的手指。
> 
> 因此，主指针的具体含义取决于当前输入设备和操作环境。无论是哪种输入设备，主指针都是指当前输入设备中的主要指针。
> 

**例子**

- 在PC环境和模拟智能手机环境下，鼠标点击和触摸引发的指针事件对象的`isPrimary` 属性值都是`true`

---

### ***`getCoalescedEvents()`***

**类型**

方法：`[SecureContext] sequence<PointerEvent> getCoalescedEvents();`

**定义**

返回**合并事件（**[coalesced events](https://www.w3.org/TR/pointerevents3/#dfn-coalesced-events)**）**列表的方法

**chatgpt**

> getCoalescedEvents()是指针事件处理中常用的方法，它表示获取当前指针事件的所有关联事件。在用户进行指针操作时，可能会发生多个相关事件，比如鼠标移动、点击、滚动等。这些事件在处理过程中需要被一起处理才能完成整个操作。
> 
> 
> getCoalescedEvents()方法可以获取这些相关事件的信息，包括事件类型、坐标位置、时间戳等。使用这些信息，开发人员可以对指针事件进行更加细粒度的处理，比如实现更流畅的滑动效果、增加用户体验等。
> 
> getCoalescedEvents()方法的使用场景很广泛，特别是在需要对指针事件进行精细化处理的应用中，比如游戏、绘图、手写输入等。例如，在游戏中，玩家需要通过鼠标或手柄进行复杂的操作，而这些操作可能包含多个关联事件，使用getCoalescedEvents()方法可以更好地处理这些事件，提升游戏的交互体验。
> 
> Coalesced是英文单词，意思是“合并、联合、融合”。在指针事件中，getCoalescedEvents()方法获取的是多个相关事件的信息，并将它们合并成一个事件集合，以便于更加精细地处理和操作。因此，coalesced事件可以理解为“合并的事件”、“联合的事件”或“融合的事件”，它表示在一个操作中同时发生的多个事件的集合。
> 

**例子**

```jsx
const div = document.querySelector("div");

div.addEventListener("pointerdown", (e) => {
  console.log(e.getCoalescedEvents());
});
div.addEventListener("pointerup", (e) => {
  console.log(e.getCoalescedEvents(), e.getCoalescedEvents().length);
});
```

- 上述代码中`e.getCoalescedEvents()` 一直返回空数组（在PC，谷歌浏览器端），解释如下
    
    > 在这段代码中，**`e.getCoalescedEvents()`**方法返回一个包含所有指针事件的数组，**包括与指针关联的指针事件和已完成的指针事件**，但是该方法只在涉及多点触控（例如使用触摸屏或笔）时才有效。
    > 
    > 
    > 因此，在单点触控的情况下，**`e.getCoalescedEvents()`**将返回一个空数组，这就是你在控制台中看到的结果。
    > 
    > 如果你想测试该方法，请尝试在**支持多点触控的设备**上运行该代码，或者在模拟多点触控的浏览器工具中进行
    > 
    > 传统的电视、电脑显示器和键盘等就不支持多点触控。
    > 
    > 许多智能手机、平板电脑、笔记本电脑和一些显示器等设备都支持多点触控。其中，苹果的iPhone、iPad和MacBook系列设备都是较为著名的多点触控设备。此外，安卓手机、Windows操作系统的一些触摸屏笔记本电脑、微软的Surface系列设备、谷歌的Chromebook等也都支持多点触控。
    > 

### ***`getPredictedEvents()`***

**类型**

方法：`sequence<PointerEvent> getPredictedEvents();`

**定义**

返回**预测事件（**[predicted events](https://www.w3.org/TR/pointerevents3/#dfn-predicted-events)**）**列表的方法。

**ChatGpt Mar 14 Version**

> 在指针事件对象中，getPredictedEvents()方法用于获取与当前事件相关的预测事件。预测事件是由浏览器基于当前事件的历史数据和模型计算出的事件，用于提高应用程序的响应速度和流畅度。预测事件可以是具有偏移量的鼠标移动事件、缩放事件、滚动事件等等。
> 
> 
> 使用getPredictedEvents()方法可以获取预测事件的列表，开发人员可以将这些事件添加到事件队列中，以便更快地响应用户的输入。例如，如果用户正在移动鼠标，开发人员可以使用预测事件来实时更新应用程序的界面，而不必等待浏览器实际生成事件。
> 
> 使用场景包括但不限于：
> 
> - 实现更加流畅的交互体验。使用预测事件可以提高应用程序的响应速度和流畅度，给用户更好的交互体验。
> - 实现基于手势的交互。预测事件可以用于实现基于手势的交互，例如缩放、旋转、拖拽等等。
> - 实现更加智能的应用程序。预测事件可以用于开发更加智能的应用程序，例如根据用户的操作习惯来推断用户的意图，从而更好地响应用户的输入。

**例子**

- 指针事件的***`getPredictedEvents()`*** 方法在使用鼠标的普通电脑上**总是返回空数组**，**ChatGpt Mar 14 Version**提示支持该方法的设备如下
    
    > 目前支持 PointerEvent 接口的 getPredictedEvents() 方法的设备和平台主要包括：
    > 
    > 1. Microsoft Surface 设备（使用 Microsoft Edge 浏览器）
    > 2. 部分 Chromebook 设备（使用 Chrome 浏览器）
    > 3. 部分 Windows 10 设备（使用 Microsoft Edge 浏览器）
    > 
    > 需要注意的是，这个方法是一个实验性的 API，不是所有支持 PointerEvent 接口的设备和平台都一定支持这个方法，而且即使支持这个方法，也不能保证它总是返回非空的数组。
    > 

---

### `PointerEventInit`

`PointerEventInit`字典被`PointerEvent`接口的构造函数用来提供构建不受信任（合成的，synthetic）指针事件的机制。它继承自[[UIEVENTS](https://www.w3.org/TR/pointerevents3/#bib-uievents)]中定义的`MouseEventInit`字典。请参阅[示例代码4](Pointer%20Events.md)以演示如何触发不受信任的指针事件。

构造`PointerEvent`的过程（[event constructing steps](https://dom.spec.whatwg.org/#concept-event-constructor-ext)）中，会将`PointerEventInit`的`coalescedEvents`复制到一个[coalesced events列表](w3.org/TR/pointerevents3/#dfn-coalesced-events-list)中，并将`PointerEventInit`的`predictedEvents`复制到一个[predicted events列表](https://www.w3.org/TR/pointerevents3/#dfn-predicted-events-list)中。换句话说，构造PointerEvent时，会将PointerEventInit中的相关事件数据复制到相应的事件列表中。

<aside>
📒 注意

`PointerEvent`接口继承自UI Events中定义的`MouseEvent`接口。还要注意[CSSOM视图模块](https://www.w3.org/TR/cssom-view-1/)中提出的扩展，它将各种坐标属性从`long` 类型更改为`double` 类型，以允许分数坐标。对于那些已经为`PointerEvent`(而不是常规`MouseEvent`)实现了这个建议扩展的用户代理，当涉及到click、auxclick和上下文菜单事件时，会有额外的需求。

下面是****CSSOM View Module**** 第10章节对`MouseEvent` 的扩展

```jsx
partial interface MouseEvent {
  readonly attribute double screenX;
  readonly attribute double screenY;
  readonly attribute double pageX;
  readonly attribute double pageY;
  readonly attribute double clientX;
  readonly attribute double clientY;
  readonly attribute double x;
  readonly attribute double y;
  readonly attribute double offsetX;
  readonly attribute double offsetY;
};

partial dictionary MouseEventInit {
  double screenX = 0.0;
  double screenY = 0.0;
  double clientX = 0.0;
  double clientY = 0.0;
};
```

所谓的额外的需求，ChatGPT Mar 14 Version进行的回答

> 这段话中提到的额外要求是指对于已经实现了 `PointerEvent` 接口中的坐标属性使用 double 类型的用户代理，当处理 click、auxclick 和 contextmenu 事件时，需要按照如下规则进行处理：
> 
> 1. 对于 click 事件，如果发生在整数坐标位置上，则按照 MouseEvent 规范进行处理；如果发生在非整数坐标位置上，则按照 PointerEvent 规范进行处理。
> 2. 对于 auxclick 事件，如果发生在整数坐标位置上，则按照 MouseEvent 规范进行处理；如果发生在非整数坐标位置上，则按照 PointerEvent 规范进行处理。如果事件的 `button`属性值为 2（表示中键），则不会触发 MouseEvent，而是只会触发 PointerEvent。
> 3. 对于 contextmenu 事件，如果发生在整数坐标位置上，则按照 MouseEvent 规范进行处理；如果发生在非整数坐标位置上，则按照 PointerEvent 规范进行处理。但是，在任何情况下都不应该在这个事件上触发 MouseEvent。
- 关于第2点，可以在`MouseEvent`的解释中得到验证

1. `mousedown`，`mouseup` ，`dblclick` 是`MouseEvent` 接口定义的事件，而`click`，`auxclick`，`contextmenu` 是`PointerEvent` （继承于`MouseEvent`）接口定义的事件，所以后者的事件对象拥有与`PointerEvent` 相关的额外属性
</aside>

## 3.2 按键状态（Button states）

### 3.2.1 和弦按键交互（Chorded button interactions）

**ChatGPT Mar 14 Version 关于Chorded的解释**

> "Chorded button interactions"指的是一种**交互方式**，它基于一组按键的组合来完成某些操作。在这种交互方式中，一个按键的单击通常会产生一个预定义的操作，而多个按键的组合则会执行不同的、更复杂的操作。这些**组合按键通常被称为"和弦"**。
> 
> 
> 例如，如果你使用一种名为"chorded keyboard"的输入设备，你可以通过同时按下几个按键来输入不同的字符或执行特定的命令。比如，按下键盘上的"ctrl"键和"alt"键再按"delete"键可以强制关闭一个程序或重启计算机。
> 
> "Chorded button interactions"也可以应用于其他类型的设备或应用程序，例如游戏手柄或计算器等。这种交互方式可以提高效率，因为用户可以通过一个设备或界面完成多个操作，而不需要频繁地切换设备或界面。
> 

**Pointer Events Level 3规范**

一些指针设备，如鼠标或笔，支持多个按键。在[[UIEVENTS](https://www.w3.org/TR/uievents/)]鼠标事件模型中，每次按下按钮都会产生一个`mousedown`和`mouseup`事件。为了更好地抽象这种硬件差异并简化跨设备输入开发，指针事件**不会**在按下和弦按键时触发重叠的`pointerdown`和`pointerup` 事件(当指针设备上的另一个按钮已经按下时按下另一个按钮)。

相反，可以通过检查`button`和`buttons`属性的更改来检测**和弦按键（chorded button）**的按下。`button`和`buttons`属性继承自`MouseEvent`接口，但在语义和值上有所更改，下面会对此进行详细说明

对`button`和`buttons`属性的修改**仅应用于**指针事件。对于任何[兼容性鼠标事件](https://www.w3.org/TR/pointerevents3/#dfn-compatibility-mouse-events)（Compatibility mapping with mouse events），`button`和`buttons`的值必须跟随[[UIEVENTS](https://www.w3.org/TR/uievents/)]。

### 3.2.2 `button` 属性

为了识别任何指针事件中的**按键状态转换**(button state transitions，而不仅仅是`pointerdown`和`pointerup`)，`button`属性指示触发事件的设备按键的状态变化。

> 这句话的意思是，当发生指针事件时，事件对象会包含一个名为"button"的属性，这个属性会告诉你哪个设备按钮被按下或释放，从而触发了事件。换句话说，这个属性可以帮助你确定事件是由哪个设备按键引起的，而不仅仅是指针按下或释放。例如，如果你在触摸屏上按下了一个按钮，button属性可以告诉你是哪个按钮被按下了，从而让你能够正确地处理事件。
> 

| 设备按键变化（Device Button Changes） | button 属性值 |
| --- | --- |
| 自上次活动以来，按键和触控笔触点都没有改变 | -1 |
| 鼠标左键，触摸点（Touch contact），笔触点（Pen contact） | 0 |
| 鼠标中键 | 1 |
| 鼠标右键，笔身按钮（Pen barrel button） | 2 |
| 鼠标后退按键【X1 (back) Mouse】 | 3 |
| 鼠标前进按键【X2 (forward) Mouse】 | 4 |
| 触控笔的橡皮擦按钮（Pen eraser button） | 5 |

<aside>
📒 注意

在鼠标拖动期间，指针移动事件中的`button`属性值将与`mouseove`事件中的`button`属性值不同。例如，当按下右键移动鼠标时，`pointermove`事件的`button`值将为-1，而`mousemove`事件的`button`值将为2。

实际测试在谷歌浏览器中测试，`mousemove` 的值无论是否按住鼠标按键，`button` 都是0，下面是ChatGPT Mar 14 Version的解释

w3c组织发布的Pointer Events Level3中关于按键状态有这样一段话”During a mouse drag, the value of the button property in a pointermove event will be different from that in a mousemove event. For example, while moving the mouse with the right button pressed, the pointermove events will have the button value -1, but the mousemove events will have the button value 2.“，我认为这段话中的鼠标移动事件button值是2是错误的，你怎么看

根据W3C Pointer Events Level3的规范，在鼠标移动事件（mousemove）中，button属性的值对应于鼠标按下的按键。对于右键，其值应该为2。因此，如果鼠标右键被按下并移动，那么在mousemove事件中，button属性应该被设置为2。

在指针移动事件（pointermove）中，由于它可以响应多种输入设备（如触摸屏、笔等），因此button属性的值与鼠标移动事件可能不同。当使用鼠标拖动时，pointermove事件中的button属性值为-1，因为在这种情况下，指针不会有任何特定的按键与其相关联。

因此，从规范的角度来看，这段话是正确的。在鼠标移动事件中，button属性值应该为2，而不是-1。

可是在谷歌浏览器实际测试过程中，按着鼠标右键移动鼠标，触发的mousemove事件对象中的button值为0，这是为什么

在某些情况下，不同浏览器的实现可能会有所不同。根据W3C规范，在mousemove事件中，button属性的值应该对应于上一个mousedown事件中按下的鼠标按钮，而不是当前鼠标按钮的状态。因此，如果在上一个mousedown事件中按下了鼠标右键并移动了鼠标，那么在mousemove事件中，button属性的值应该是2（对应于右键）。

如果您在实际测试中看到不同的结果，那么这可能是由于浏览器的实现差异造成的。建议您在不同的浏览器和操作系统中进行测试，并注意不同事件的触发情况和属性值的变化。

</aside>

**例子**

- 参考`mousemove` 事件中的[例子](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85.md)

```jsx
const log = document.querySelector("ul");

function handler(e) {
  console.log(e);
  const li = document.createElement("li");
  li.className = "log-li"
  li.innerHTML = `<span class="type">${e.type}</span>
  <span class="target">${e.target.className}</span>
  <span class="currentTarget">${
    e.currentTarget && e.currentTarget.className
  }</span>
  <span class="base">${e.detail}</span>
  <span class="base">${e.screenX}/${e.screenY}</span>
  <span class="base">${e.clientX}/${e.clientY}</span>
  <span class="base">${e.ctrlKey}</span>
  <span class="base">${e.button}</span>
  <span class="base">${e.buttons}</span>
  `;
  log.appendChild(li);
}

function debounce(func, delay = 100) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
const newHandler = debounce(handler);
document.body.addEventListener("pointermove", newHandler);
log.addEventListener("pointermove", newHandler);
```

![pointer event pointermove.png](Pointer%20Events/pointer_event_pointermove.png)

### 3.2.3 `buttons` 属性

`buttons`属性以**位掩码**（**bitmask**，与MouseEvent中的相同，但使用了可能值的扩展集）的形式给出了设备按键的当前状态

| 设备按键变化（Device Button Changes） | buttons 属性值 |
| --- | --- |
| 自上次活动以来，按键和触控笔触点都没有改变 | 0 |
| 鼠标左键，触摸点（Touch contact），笔触点（Pen contact） | 1 |
| 鼠标中键 | 4 |
| 鼠标右键，笔身按钮（Pen barrel button） | 2 |
| 鼠标后退按键【X1 (back) Mouse】 | 8 |
| 鼠标前进按键【X2 (forward) Mouse】 | 16 |
| 触控笔的橡皮擦按钮（Pen eraser button） | 32 |

### 3.2.4 主指针（****The primary pointer****）

在**多指针**(例如多点触控，multi-touch)场景中，`isPrimary`属性用于在每种指针类型的**活动指针（[active pointers](Pointer%20Events.md)）**集中识别一个**主指针（master pointer）**。

- 在任何给定的时间，每种指针类型最多只能有一个主指针。
- 对于特定的指针类型，第一个成为活动的指针(例如，在多点触摸交互中，第一个触摸屏幕的手指)成为该指针类型的主指针。
- **只有主指针才能产生与鼠标兼容的鼠标事件**。在存在多个主指针的情况下，所有这些指针都会产生与鼠标兼容的鼠标事件
    
    > 在多点触控设备上，可能会存在多个主指针，如在同时使用多个手指进行操作时。在这种情况下，所有的主指针都会产生与鼠标兼容的鼠标事件，这意味着应用程序可以像处理鼠标事件一样处理这些事件。
    > 
    > 
    > 需要注意的是，多触控设备的主指针并非一成不变，随着用户的操作行为和手指位置的变化，主指针也会发生变化。因此，在编写多点触控应用程序时，需要及时检测主指针的变化，并相应地调整程序的行为。
    > 
    > ——ChatGPT
    > 

**注意**

<aside>
📒 如果开发人员只希望处理来自单个指针设备（例如鼠标或触摸屏）的输入事件，则可以忽略非主要指针的输入。需要注意的是，如果有多个主要指针（[multiple primary pointers](https://www.w3.org/TR/pointerevents3/#multiple-primary-pointers)，例如多个触摸点），则需要进行特殊处理，如下

当两个或多个指针设备类型同时被使用时，多个指针(每个`pointerType`对应一个指针)被认为是主指针。例如，同时移动的触摸点和鼠标光标将都会被认为是主指针的指针。

某些设备、操作系统和用户代理可能会忽略多个类型的指针输入的并非使用，以避免意外的交互。举个例子，支持触摸和笔输入的设备在使用笔输入时可能会忽略触摸输入，以允许用户在使用笔的同时将手放在触摸屏上（这个功能通常被称为“手掌拒绝”）。目前，开发者不可能抑制这种行为。

在某些情况下，用户代理可能触发指针事件，其中没有指针被标记为**主指针**。例如，当有多个特定类型的**活动指针**时（例如多点触摸交互），并且主指针被移除(例如，它离开屏幕)，可能会没有主指针。在某些平台上，主指针是使用设备上所有同一类型的**活动指针**确定的(包括那些针对用户代理以外的应用程序的指针)，如果第一个(主)指针在用户代理之外，而其他(非主)指针则针对用户代理内部，那么用户代理可能会为其他指针触发指针事件，`isPrimary`的值为`false`。

> 当我们使用触摸屏等设备进行操作时，可能会有多个手指或者指针同时触摸屏幕。在某些情况下，可能会出现主要的手指或者指针离开屏幕后，剩下的手指或指针没有了主要的指针。这时候，用户代理（如浏览器）会使用一个标志来标识当前的主要指针。然而，在某些情况下，如果主要指针离开了用户代理所在的区域，剩下的指针就无法被标记为主要指针了。在这种情况下，用户代理会触发一些指针事件，并将这些事件标记为**非主要指针事件**（也就是isPrimary为`false` 的事件），以便开发者能够处理这些事件。
> 

目前的操作系统和用户代理通常**没有**多鼠标输入的概念。当存在多个鼠标设备时(例如，在具有触控板和外部鼠标的笔记本电脑上)，所有鼠标设备通常被视为单个设备——任何设备上的移动都转换为单个鼠标指针的移动，并且不同鼠标设备上的按键按下之间没有区别。由于这个原因，通常只有一个鼠标指针，并且该指针将是主指针。

</aside>

**例子**

- 可以通过指针事件接口定义的`isPrimary` 属性判断当前指针事件是由主指针触发还是非主指针触发的
- 关于pointer event中主指针设计和PointerEvent和MouseEvent设计问题：
    
    [ChatGPT Mar 14 Version关于主指针的疑问与回答](Pointer%20Events/ChatGPT%20Mar%2014%20Version%E5%85%B3%E4%BA%8E%E4%B8%BB%E6%8C%87%E9%92%88%E7%9A%84%E7%96%91%E9%97%AE%E4%B8%8E%E5%9B%9E%E7%AD%94.md)
    
    在 Web 开发中，我们通常会使用鼠标来进行交互，例如单击、双击、拖拽等操作。Pointer Events Level 3 规范中，所谓“**与鼠标兼容的鼠标事件**”，是指那些能够与**鼠标事件**一一对应的指针事件。
    

### 3.2.5 使用`PointerEvent`接口触发事件

> Pointer Events Level 3 规范中的 4.1.3 节（就是本节）主要描述了如何使用 PointerEvent 接口来派发指针事件（pointer events），以及如何设置 PointerEvent 的属性和默认行为。该章节详细说明了在派发指针事件时，如何设置事件的各种属性，包括事件的类型、指针ID、位置、压力、倾斜度、旋转角度、按钮状态等，以及如何触发事件的默认行为和取消事件的传播等
> 
- 可以使用`PointerEvent` 接口**[触发](https://dom.spec.whatwg.org/#concept-event-fire)**一个名为`e`的**指针事件**，其中事件对象的属性按照`[PointerEvent](Pointer%20Events.md)`接口和其**默认行为（[Attribute and default actions](Pointer%20Events.md)）**的规定来设置
- 当接收到一个`PointerEvent`事件时，如果事件类型不是`gotpointercaptrue` 或`lostpointercapture` ，接下来就会执行“[process pending pointer capture steps](Pointer%20Events.md)”步骤，也就是“**处理待处理的指针捕获**”
    
    <aside>
    💡 `gotpointercaptrue` 和`lostpointercapture` 是指针事件定义的两个特殊事件，在后续章节会有解释
    
    </aside>
    
- 触发的指针事件的**目标对象**确定规则如下：
    1. 如果指针的**捕获目标覆盖（Pointer Capture Target Override）**已经被设置，那么事件的目标对象将被设置为**指针捕获目标覆盖（Pointer Capture Target Override）**对象。
        
        <aside>
        💡 Pointer Capture Target Override，**捕获目标覆盖**在后续章节会有解释，下面是chatGPT的回答
        
        > 捕获目标覆盖（Pointer Capture Target Override）是指一种**机制**，用于在指针事件的处理过程中，**覆盖默认的事件目标对象**。通常情况下，指针事件的目标对象是由浏览器根据事件的发生位置和DOM树结构来自动确定的。但是，在某些情况下，开发者可能希望自定义事件的目标对象，这时可以使用捕获目标覆盖机制来实现。
        > 
        > 
        > 例如，在一个拖动操作中，开发者可能希望始终将拖动的元素作为事件的目标对象，而不是当前鼠标光标所在的元素。这时，可以使用捕获目标覆盖机制，将拖动元素设置为事件的目标对象，从而实现自定义的事件处理逻辑。
        > 
        > 需要注意的是，设置捕获目标覆盖机制可能会影响事件的正常传递和处理，因此需要谨慎使用。同时，捕获目标覆盖机制只适用于支持Pointer Events规范的浏览器中。
        > 
        </aside>
        
    2. 否则，事件的目标对象将根据**普通命中测试（[nomarl hit test](Pointer%20Events.md)）**机制返回的对象进行设置（超出本规范的范围）
- 让*`targetDocument` （*声明的变量*）*为目标对象的[节点文档](Pointer%20Events.md)（`ownerDocument`）
    - 如果事件是`pointerdown`、`pointermove`或`pointerup`，则将事件对象的`pointerId`的[活动文档](Pointer%20Events.md)设置为`targetDocument`
- 如果事件是`pointerdown`，关联的设备是**直接操作设备**，目标对象是一个`Element` 元素，则根据**隐式指针捕获（**[implicit pointer capture](https://www.w3.org/TR/pointerevents3/#dfn-implicit-pointer-capture)**）**的描述，将该 **`pointerId`**的**指针捕获设置**（[**set pointer capture**](https://www.w3.org/TR/pointerevents3/#dfn-set-pointer-capture)）为目标元素。这句话中涉及四个概念，ChatGPT对此回答是：
    
    > 在Web开发中，**Pointer Capture（指针捕获）**是一种机制，用于将特定的指针（如鼠标指针或触摸指针）捕获到一个元素上，以便该元素可以继续接收该指针相关的事件，即使该指针移出了元素的范围。
    > 
    > 
    > 通常，当用户进行鼠标点击或触摸操作时，事件会首先分派到发生操作的元素上。但是，如果在事件的处理过程中，指针移出了元素的范围，那么元素将不再接收后续与该指针相关的事件。为了解决这个问题，Pointer Capture机制允许将指针捕获到元素上，即使该指针移出了元素的范围，元素仍然可以继续接收该指针相关的事件。
    > 
    > ---
    > 
    > 在该文中，"**direct manipulation device**" 指的是一种用户输入设备，用户可以直接通过该设备来操纵、操作应用程序的用户界面元素，例如触摸屏、鼠标等。这些设备的输入通常与操作界面元素的位置和方向直接相关，因此也被称为直接操作设备。与之相对的是间接操作设备，例如游戏手柄，它们的输入不直接与用户界面元素的位置和方向相关。在Web开发中，**`pointerdown`**
    >  事件通常会在直接操作设备上触发，例如在触摸屏上轻触或在鼠标上单击。
    > 
    > ---
    > 
    > "**set pointer capture**" 是一个操作，用于将指针事件捕获到一个指定的DOM元素上，从而使该元素成为该指针事件的目标。一旦指针事件被捕获，该元素将接收该指针事件的所有后续事件，直到指针被释放或指针捕获被显式释放。
    > 
    > 通过**设置指针捕获**，可以确保某个元素可以持续地响应与指针相关的事件，而不会受到其他元素的干扰。在一些情况下，例如拖放操作，设置指针捕获是非常有用的。在Web开发中，可以使用 **`setPointerCapture()`** 方法来设置指针捕获。
    > 
    > ---
    > 
    > 在该文中，"**implicit pointer capture**" 指的是一种自动化的指针事件捕获机制，该机制会自动将一些与元素相关的指针事件捕获到指定的DOM元素上，而无需通过 **`setPointerCapture()`** 方法手动设置指针捕获。
    > 
    > 根据隐式指针捕获机制的规则，当一个指针事件发生在一个元素上，而该元素已经捕获了另一个指针事件（例如 **`pointerdown`** 事件），则该元素将自动捕获所有与该指针相关的事件，直到该指针被释放或指针捕获被显式释放。这意味着开发人员无需编写任何代码来手动设置指针捕获，就可以确保元素可以持续地响应与指针相关的事件。
    > 
    > 需要注意的是，隐式指针捕获机制只在一些情况下适用，并不是所有情况下都会自动设置指针捕获。在该文中，描述了一些必要条件，满足这些条件时才会应用隐式指针捕获。
    > 
- 将事件触发到确定的目标。用户代理应该处理目标，就好像指针设备已经移动到它上面，以**确保事件排序（**这里指UIEvent中提到的[鼠标事件触发顺序](https://www.w3.org/TR/uievents/#events-mouseevent-event-order)**）**。

<aside>
💡 注意

说明使用**指针捕获目标覆盖（[pointer capture target override](Pointer%20Events.md)）**而不是正常的命中测试的结果作为**事件目标**可能会触发一些边界事件，如[[UIEVENTS](https://www.w3.org/TR/uievents)]所定义的。这与指针离开前一个目标并进入这个新的**捕获目标**是一样的。当释放捕获时，可能会发生相同的场景，因为此时指针正在离开捕获目标并进行命中测试目标操作

为了更好的理解这段话，ChatGPT做出了如下回答

> 边界事件具体指什么：
> 
> 
> 这些边界事件是指当指针从一个元素（命中测试目标）移动到另一个元素（**捕获目标**）时发生的事件。具体来说，以下两种边界事件可能会发生：
> 
> 1. Pointer Leave Event：当指针离开先前的目标元素并进入新的捕获目标元素时，将触发Pointer Leave事件。这个事件将派发给先前的目标元素，并且在捕获目标元素中不会派发。
> 2. Pointer Enter Event：当指针进入新的捕获目标元素时，将触发Pointer Enter事件。这个事件将派发给新的捕获目标元素，并且在先前的目标元素中不会派发。
> 
> **捕获目标**指什么
> 
> 捕获目标是指在**指针事件传播期间指针事件派发的最终目标元素**。具体来说，当指针事件（例如鼠标事件）发生时，该事件将首先派发到该事件的目标元素（也称为**命中测试目标**）。然后，事件将沿着DOM树向上冒泡，直到达到文档根节点。
> 
> 在这个传播期间，任何元素都可以选择通过调用setPointerCapture()方法来成为指针事件的捕获目标。一旦设置了捕获目标，该元素将成为所有后续指针事件的最终目标，而不是命中测试目标。这种捕获功能使开发人员可以更好地控制指针事件，并在需要时更轻松地实现复杂的交互操作，例如拖放和缩放等。
> 
</aside>

**3.2.5.1 属性和默认行为（*Attributes and default actions*）**

- `bubbles`和`cancelable`属性以及本规范中定义的事件类型的默认操作如下表所示。这些事件类型的详细信息在**指针事件类型**中提供：
    
    
    | 事件类型（Event Type） | 是否冒泡（Bubbles） | 是否能被取消（Cancelable） | 是否传递进ShadowRoot（composed） | 默认行为（Default Action） |
    | --- | --- | --- | --- | --- |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointerover | Yes | Yes | No | 没有 |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointerenter | No | No | Yes | 没有 |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointerdown | Yes | Yes | No | 多样：当指针是主指针时，就是mousedown事件的所有默认操作；取消此事件还可以防止后续触发兼容鼠标事件（https://www.w3.org/TR/pointerevents3/#dfn-compatibility-mouse-events） |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointermove | Yes | Yes | No | 多样：当指针是主指针时，mousedown 事件的所有默认动作 |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointerrawupdate | Yes | No | No | 没有 |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointerup | Yes | Yes | No | 多样：当指针是主指针时，mouseup的所有默认动作 |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointercancel | Yes | No | No | 没有 |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointerout | Yes | Yes | No | 没有 |
    | https://www.w3.org/TR/pointerevents3/#dfn-pointerleave | No | No | Yes | 没有 |
    | https://www.w3.org/TR/pointerevents3/#dfn-gotpointercapture | Yes | No | No | 没有 |
    | https://www.w3.org/TR/pointerevents3/#dfn-lostpointercapture | Yes | No | No | 没有 |
- 视口操作(平移和缩放)——通常是**直接操作交互**（**direct manipulation** interaction）的结果——而**不是**指针事件的默认操作，这意味着这些行为(例如，在触摸屏上移动手指导致的页面平移)**不能通过取消指针事件来抑制**。开发者必须使用`touch-action`来显式地**声明文档区域的直接操作行为**（[declare the direct manipulation behavior](https://www.w3.org/TR/pointerevents3/#dfn-direct-manipulation-behavior)）。移除对取消事件的依赖有助于用户代理的性能优化。
- 对于`pointerenter`和`pointerleave`事件，`composed`属性应该为`false`；对于上表中的所有其他指针事件，该（`compsed`）属性应该为`true`
- 对于上表中的所有指针事件，`detail` 属性应该为0

<aside>
💡 许多用户代理在`MouseEvents`中暴露`fromElement`和`toElement`的非标准属性以支持遗留内容。我们（W3C组织）鼓励这些用户代理将`PointerEvents`中那些(继承的)属性的值设置为`null`，从而让开发者转而使用标准化的替代对象(即`target`和`relatedTarget`)。

</aside>

- 类似于`MouseEvent`的`relatedTarget` ，在`pointerover`或`pointerenter` 事件的情况下，应该将`relatedTarget`初始化为指针刚刚离开其边界的元素；在`pointerout`或`pointerleave` 事件的情况下，应该将`relateedTarget` 初始化为指针正在进入其边界的元素。对于其他指针事件，该值默认为空。注意，当一个元素接收到**指针捕获**时，该指针的所有以下事件都被认为是在捕获元素的边界内。
- 对于`gotpointercapture`和`lostpointercapture` 事件，除了上表中定义的属性外，所有属性都应该与导致用户代理运行**处理待处理的指针捕获（*[Process pending pointer capture](Pointer%20Events.md)*）**并触发`gotpointercapture`和`lostpointercapture`事件的**Pointer Event（指针事件）**相同。

**3.2.5.2 处理待处理的指针捕获（*Process pending pointer capture*）**

- 当**隐式释放指针捕获**（[implicitly releasing pointer capture](https://www.w3.org/TR/pointerevents3/#dfn-implicitly-release-the-pointer-capture)）以及触发非`gotpointercapture`或`lostpointercapture`的指针事件时，用户代理必须运行以下步骤：
    1. 如果为该指针设置了**[指针捕获目标覆盖](Pointer%20Events.md)（**[pointer capture target override](https://www.w3.org/TR/pointerevents3/#dfn-pointer-capture-target-override)**）**，并且不等于**待处理的指针捕获目标覆盖（**[pending pointer capture target override](https://www.w3.org/TR/pointerevents3/#dfn-pending-pointer-capture-target-override)**）**，则在**[指针捕获目标覆盖](Pointer%20Events.md)的**节点上触发一个名为`lostpointercapture`的指针事件。
    2. 如果为该指针设置了**待处理的指针捕获目标覆盖（**[pending pointer capture target override](https://www.w3.org/TR/pointerevents3/#dfn-pending-pointer-capture-target-override)**）**，并且不等于**[指针捕获目标覆盖](Pointer%20Events.md)（**[pointer capture target override](https://www.w3.org/TR/pointerevents3/#dfn-pointer-capture-target-override)**）**，则在**待处理的指针捕获目标覆盖**中触发一个名为`gotpointercapture`的指针事件。
    3. 如果已设置，则将**[指针捕获目标覆盖](Pointer%20Events.md)（**[pointer capture target override](https://www.w3.org/TR/pointerevents3/#dfn-pointer-capture-target-override)**）**设置为**待处理的指针捕获目标覆盖（**[pending pointer capture target override](https://www.w3.org/TR/pointerevents3/#dfn-pending-pointer-capture-target-override)**）**。否则，清除**[指针捕获目标覆盖](Pointer%20Events.md)**。
- 关于ChatGPT回答：
    
    > 关于**隐式释放指针捕获**
    > 
    > 
    > **implicitly releasing pointer capture**指的是在JavaScript事件处理程序中，当使用指针事件（如鼠标事件）时，浏览器会**自动释放**先前的指针捕获，而无需显式调用`releasePointerCapture()`方法。
    > 
    > 指针捕获是一种机制，允许元素在指针事件期间继续接收事件，即使指针离开元素的边界。一旦元素捕获了指针，其他元素将无法捕获相同的指针，直到该元素显式释放指针捕获或浏览器自动释放指针捕获。
    > 
    > 当元素具有指针捕获时，如果指针从元素的边界外移动，浏览器会自动释放指针捕获，这称为**implicitly releasing pointer capture**。这可以确保其他元素能够捕获相同的指针事件，从而避免出现鼠标或触摸屏幕卡住的问题。
    > 
    > ---
    > 
    > 关于**待处理的指针捕获**
    > 
    > 待处理的指针捕获是指当元素捕获了指针事件，但该事件未完成处理时，**指针捕获目标被更改（**指针捕获目标覆盖**）**的情况
    > 
    > ---
    > 
    > 关于本节想要处理的问题
    > 
    > 这些步骤的目的是确保在元素捕获了指针事件并更改了指针捕获目标时，指针事件可以正确地被分派到新的目标，并且旧的目标能够收到一个事件来通知它已经丢失了指针捕获。这对于确保指针事件的正确处理非常重要，并且可以确保用户在使用鼠标或触摸屏幕时始终能够正常地与网页交互。
    > 

**3.2.5.2 禁止指针事件流（*Suppressing a pointer event stream*）**

- 当用户代理检测到指针不太可能继续产生事件时，必须**禁止指针事件流**。以下任何一个场景都满足这个条件(可能还有其他场景)：
    1. 用户代理打开了模态对话框或菜单
        
        在这种情况下，用户代理需要禁止指针事件流的传递，以确保用户能够正确地与模态对话框或菜单交互。否则，用户可能会在对话框或菜单外的区域进行不必要的交互和操作。
        
    2. 指针设备被物理断开连接，或者可悬停的指针设备（例如可悬停的笔/触控笔）已经离开数字板检测到的悬停范围
        
        在这种情况下，用户代理需要禁止指针事件流的传递，因为指针设备已经不再可用或者已经离开了可操作的范围。如果用户代理不禁止指针事件流的传递，可能会导致错误的交互和操作。
        
    3. 用户代理使用指针来操作页面视口（例如平移或缩放）
        
        在这种情况下，用户代理需要禁止指针事件流的传递，以确保用户能够正确地操作页面视口而不是页面上的其他元素。这可以通过使用“touch-action”CSS属性来实现，该属性指定了哪些操作应该由用户代理处理，而不是由页面元素处理。
        
        <aside>
        📒 用户代理可以通过多种指针类型(如触摸和笔)触发平移或缩放，因此开始平移或缩放操作可能会导致禁止各种指针，包括具有不同指针类型的指针。
        
        </aside>
        
    4. 在拖拽操作的初始化算法中（定义在**HTML的拖放处理模型[[drag and drop processing model](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)]**中），对于触发拖拽操作的指针，也需要禁止指针事件流的传递
        
        当用户在一个文本编辑器中选择一段文字并将其拖动到另一个位置时，用户代理需要禁止相关指针事件的传递，以确保用户能够正确地完成拖拽操作而不会意外选中其他文本或执行其他操作
        
    
    <aside>
    📒 注意
    
    用户代理可能**禁止指针事件流**的其他场景包括：
    
    - 当指针处于活动状态时，设备的屏幕方向发生了变化。
        - 设备的屏幕方向发生变化时，用户代理可能需要对当前指针事件流进行处理，以确保指针事件能够正确地响应用户的操作
    - 用户试图使用比设备支持的指针输入更多的同时指针输入进行交互。
        - 设备可能无法同时处理多个指针输入，因此用户代理可能需要禁止多余的指针事件流的传递，以确保设备能够正确处理指针输入
    - 用户代理将输入解释为意外的(例如，硬件支持手掌识别)。
        - 用户可能不小心触发了设备的指针输入，例如在使用触摸屏时不小心碰到了屏幕，用户代理可能需要将该输入解释为意外的，并禁止相关指针事件流的传递，以避免错误操作的发生
    
    用于检测这些场景的方法超出了本规范的范围。
    
    </aside>
    
- 用户代理必须执行以下步骤来**禁止指针事件流（*Suppressing a pointer event stream*）：**
    - 触发一个`pointercancel` （指针取消）事件
    - 触发一个`pointerout` 事件
    - 触发一个`pointeleave`事件
    - 如果指针当前被捕获，则**隐式释放指针捕获（[Implicity release the pointer capture](Pointer%20Events.md)）**

# 4. 指针事件类型（**Pointer Event types**）

下面是本规范中定义的事件类型。
在触发事件的是**主指针（Primary Pointer）**的情况下，这些事件(除了`gotpointercapture`和`lostpointercapture`)也可能触发**兼容性鼠标事件（compatibility mouse events）**。

## 4.1 - 4.12 14种指针类型

[14种指针类型](Pointer%20Events/14%E7%A7%8D%E6%8C%87%E9%92%88%E7%B1%BB%E5%9E%8B.md)