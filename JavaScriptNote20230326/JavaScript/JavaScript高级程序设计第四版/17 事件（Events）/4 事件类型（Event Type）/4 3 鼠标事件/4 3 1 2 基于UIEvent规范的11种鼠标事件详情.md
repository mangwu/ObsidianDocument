# 4.3.1.2 基于UIEvent规范的11种鼠标事件详情

### 4.3.1.2.1 mousedown

**基本表（参考[mousedown-uievent](https://www.w3.org/TR/uievents/#event-键入mousedown)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| mousedown | Element | MouseEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 多样的（Varies）：1. 开始拖放（drag/drop）操作；2. 开始文本选择（text selection）；3. 开始滚动/平移交互（如果支持，可结合鼠标中键） | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 指示当前单击计数递增1。例如，如果mousedown 事件（鼠标按下）之前没有单击，则detail将包含值1 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 基于当前按下的（鼠标）按键表示的值，参考../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md  |
| MouseEvent.buttons  | 值基于当前按下的所有（鼠标）按键表示的值，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | null （没有次要事件目标） |

**定义**

- 当在元素上按下指针设备按键（可以是主按键，次按键，赋值按键）时，用户代理必须派发`mousedown`事件。

**注意**

- 许多浏览器使用`mousedown`事件实现各种上下文相关的**默认操作**
    - 如果取消（`preventDefault()`）此事件，则可以阻止这些默认操作
    - 其中一些默认操作可能包括：开始与图像或链接进行拖放交互，开始文本选择等
    - 此外，一些浏览器通过`mousedown` 开始提供了鼠标驱动的平移功能（mouse-driven panning feature），当在调度`mousedown`事件时按下鼠标中键时，该功能将被激活（就是鼠标中键在浏览器页面上的滚动页面功能）

**例子**

```jsx
const log = document.querySelector("ul");

const A = document.querySelector(".A");
const B = document.querySelector(".B");

function handler(e) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="type">${e.type}</span>
  <span class="target">${e.target.className}</span>
  <span class="currentTarget">${e.currentTarget.className}</span>
  <span class="base">${e.screenX}/${e.screenY}</span>
  <span class="base">${e.clientX}/${e.clientY}</span>
  <span class="base">${e.ctrlKey}</span>
  <span class="base">${e.button}</span>
  <span class="base">${e.buttons}</span>
  `;
  log.appendChild(li);
}

A.addEventListener("mousedown", handler);
B.addEventListener("mousedown", handler);
```

![mousedown event.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mousedown_event.gif)

- `mousedown` 事件可以冒泡，所以点击B元素触发的`mousedown` 事件会有两次记录，一次由B元素处理程序记录，一次又A元素的处理程序记录，但是仅派发了一次`mousedown` 事件，说明`mousedown` 只关注最顶层的事件目标
- 点击鼠标左键，事件对象的`button` 属性值为0，`buttons` 属性值为1，点击鼠标右键`button` 属性值为2，`buttons` 属性值为2，点击鼠标中键，`button` 属性值为1，`buttons` 属性值为4
- 如果同时点击鼠标的两个按键，会派发两个`mousedown` 事件，根据按键的点击顺序不同（尽可能同时），首次的会和上面事件对象一样，`button` 和`buttons` 表示单个鼠标按键值，第二次的`mousedown` 事件的`buttons` 值有可能是两个按键值的或值（间隔时间太长就按照两次独立`mousedown` 派发）

### 4.3.1.2.2 mouseup

**基本表（参考[mouseup-uievent](https://www.w3.org/TR/uievents/#event-type-mouseup)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| mouseup | Element | MouseEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 没有 | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 指示当前单击计数递增1 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 基于当前按过的（鼠标）按键表示的值，参考../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md  |
| MouseEvent.buttons  | 值基于当前按过的所有（鼠标）按键表示的值，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | null （没有次要事件目标） |

**定义**

- 当在元素上释放设备指针按键时，用户代理必须派发此事件

**注意**

- 在**一些实现环境**中，即使指针设备已经离开用户代理的边界，只要**最终释放按键位置**在想要触发`mouseup` 事件的元素上，例如，如果用户**在浏览器外**按下鼠标按钮的情况下开始拖动操作，**移动到元素**上然后释放，也可以触发`mouseup`事件。

**例子**

```jsx
const log = document.querySelector("ul");

const A = document.querySelector(".A");
const B = document.querySelector(".B");

function handler(e) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="type">${e.type}</span>
  <span class="target">${e.target.className}</span>
  <span class="currentTarget">${e.currentTarget.className}</span>
  <span class="base">${e.screenX}/${e.screenY}</span>
  <span class="base">${e.clientX}/${e.clientY}</span>
  <span class="base">${e.ctrlKey}</span>
  <span class="base">${e.button}</span>
  <span class="base">${e.buttons}</span>
  `;
  log.appendChild(li);
}

A.addEventListener("mouseup", (e) => {
  handler(e);
  e.preventDefault();
});
B.addEventListener("mouseup", (e) => {
  handler(e);
  e.preventDefault();
});
```

![mouseup event.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouseup_event.gif)

- `mouseup` 和`mousedown` 一样，释放按键时，事件目标是最底层的元素，然后向上冒泡
- 上面使用的浏览器是火狐浏览器，可以从外部点击后将鼠标指针移动到元素内部再释放可以触发`mouseup` 事件
- 谷歌浏览器试验只能在视口内进行按键点击拖放再释放以触发`mouseup` 事件
- 需要注意的是`mouseup` 事件对象的`button` 属性值和`mousedown` 一样，但是`buttons` 的属性值**不包括**本身释放的按键（但是会包括触发`mouseup` 事件时其他鼠标按键按下时的按键值）

### 4.3.1.2.3 click

**基本表（参考[mouseup-uievent](https://www.w3.org/TR/uievents/#event-type-mouseup)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| click | Element | PointerEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 很多（VARIES） | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 表示当前点击次数；当用户开始此操作时，属性值必须为1，并且每次单击都递增1。 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 基于当前按过的（鼠标）按键表示的值，参考../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md  |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | null （没有次要事件目标） |
| PointerEvent指定的属性 | 详情查看https://www.w3.org/TR/pointerevents3/#pointerevent-interface |

**定义**

- 当用户按下并释放主指针按键，或以模拟这种动作的方式激活指针时，必须在指针指示的**最顶部事件目标**上派发`click` 事件类型
- 鼠标按键的**致动方法**（**actution method**）取决于指针设备和环境配置，例如，它可能取决于屏幕位置或指针设备按键的按下和释放之间的延迟
- 单击事件只应为主指针按键触发（即，当`button`为0时，`buttons`为1）；辅助按键（如标准鼠标上的中键或右键）不得触发单击事件
- 单击事件前面可能是同一**元素（节点）**上的`mousedown`和`mouseup`事件，忽略其他节点类型（例如文本节点）之间的更改
    - 根据环境配置，如果在按下和释放指针设备按键之间发生一个或多个事件类型`mouseover`、`mousemove`和`mouseout`，也可以触发单击事件
    - 单击事件之后可能还会出现`dblclick`事件

**默认行为**

- 单击事件的默认行为很多，所以上表没有做列举，`click`事件类型的默认行为取决于事件的**事件目标**和`button` /`buttons`的值，单击事件类型的典型默认操作如下：
    - 如果事件目标具有关联的激活行为，则默认行为必须是执行该激活行为（参见[§ 3.5激活触发和行为](https://www.w3.org/TR/uievents/#event-流量激活)）
    - 如果事件目标是可聚焦的，则默认行为必须是给予该元素文档聚焦

**注意**

- 事件目标（元素）的激活行为可以自定义，所以`click` 事件的默认行为也可以激活元素的自定义行为
- 为了实现最大的可访问性，鼓励内容作者在定义自定义控件的激活行为时使用单击事件类型，而不是其他指针设备的事件类型
    - `mousedown`或`mouseup`事件类型更特定于设备
- 尽管`click`类型起源于指针设备（例如鼠标），但随后的实现增强将其扩展到了该关联之外（即点击事件类型被修正为`PointerEvent`），并且可以将其视为用于元素激活的与设备无关的事件类型。
- **用户代理生成的鼠标事件不会在文本节点上派发**

**例子**

- 在不同的元素之间触发`mousedown` 和`mouseup` 之后，也会触发`click` 事件，只不过事件目标是`mousedown` 事件目标和`mouseup` 事件目标的最近公共祖先元素
    
    ```jsx
    const log = document.querySelector("ul");
    
    const A = document.querySelector(".A");
    const B = document.querySelector(".B");
    
    function handler(e) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="type">${e.type}</span>
      <span class="target">${e.target.className}</span>
      <span class="currentTarget">${e.currentTarget.className}</span>
      <span class="base">${e.detail}</span>
      <span class="base">${e.screenX}/${e.screenY}</span>
      <span class="base">${e.clientX}/${e.clientY}</span>
      <span class="base">${e.ctrlKey}</span>
      <span class="base">${e.button}</span>
      <span class="base">${e.buttons}</span>
      `;
      log.appendChild(li);
    }
    A.addEventListener("click", (e) => {
      handler(e);
      e.preventDefault();
    });
    B.addEventListener("click", (e) => {
      handler(e);
      e.preventDefault();
    });
    ```
    
    ![mouse event click.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouse_event_click.gif)
    
    - 连续点击在一点间隔的情况下，`click` 事件的`detail` 属性值是有“**继承性”**的，一旦超过了这个间隔就会重置为1
    - `click` 的事件目标是最底层的元素，然后向上冒泡
    - `click` 事件只能由指针设备主按键（通常为鼠标左键）触发

### 4.3.1.2.4 contextmenu

**基本表（参考[uievent-contextmenu](https://www.w3.org/TR/uievents/#event-type-contextmenu)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| contextmenu | Element | PointerEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 如果支持，调用上下文菜单 | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 0 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 基于当前按下的（鼠标）按键表示的值，参考../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md  |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | null （没有次要事件目标） |
| PointerEvent指定的属性 | 详情查看https://www.w3.org/TR/pointerevents3/#pointerevent-interface |

**定义**

- 用户代理必须在调出上下文菜单之前派发此事件
- 当`contextmenu` 事件被鼠标右键触发时，必须在`mousedown`事件之后触发`contextmenu` 事件

**注意**

- 根据平台的不同，`contextmenu`事件可以在`mouseup`事件之前或之后触发

**例子**

- 可以通过调用事件对象的`preventDefault()` 来阻止默认行为（即阻止弹出上下文菜单）
    
    ```jsx
    const log = document.querySelector("ul");
    
    const A = document.querySelector(".A");
    const B = document.querySelector(".B");
    
    function handler(e) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="type">${e.type}</span>
      <span class="target">${e.target.className}</span>
      <span class="currentTarget">${e.currentTarget.className}</span>
      <span class="base">${e.detail}</span>
      <span class="base">${e.screenX}/${e.screenY}</span>
      <span class="base">${e.clientX}/${e.clientY}</span>
      <span class="base">${e.ctrlKey}</span>
      <span class="base">${e.button}</span>
      <span class="base">${e.buttons}</span>
      `;
      log.appendChild(li);
    }
    A.addEventListener("contextmenu", (e) => {
      handler(e);
      e.preventDefault();
    });
    B.addEventListener("contextmenu", (e) => {
      handler(e);
      e.preventDefault();
    });
    ```
    
    ![mouse event contextmenu.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouse_event_contextmenu.gif)
    
    - 第一条和`click` 不一样的是`detail` 一直是0
    - 第二条和`click` 事件不一样的是在不同的两个元素中按下鼠标右键，`contextmenu` 事件的事件目标是**最终释放鼠标按键所在位置**的元素
    - `contextmenu` 能冒泡，也可以通过`preventDefault()` 阻止弹出上下文菜单

### 4.3.1.2.5 dblclick

**基本表（参考[uievent-dblclick](https://www.w3.org/TR/uievents/#event-type-dblclick)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| dblclick | Element | MouseEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 没有 | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 表示当前点击次数 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 基于当前按下的（鼠标）按键表示的值，参考../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md  |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | null （没有次要事件目标） |

**定义**

- 当指针设备的主按键在元素上单击两次时，用户代理必须派发`dblclick`事件
- 双击的定义取决于环境配置，除此之外，`mousedown`、`mouseup`和`dblclick`之间的事件目标必须相同
- 如果同时发生单击和双击事件，则`dblclick`必须在`click`事件后分派，并且二则都必须在`mouseup` 事件后分派
- `dblclick` 事件只针对指针设备主按键触发，辅助按键不会触发`dblclick` 事件

**注意**

- 取消`click` 事件（也就是调用`preventDefault()`），不会对`dblclick` 事件的触发有任何影响
- 与单击事件类型一样，`dblclick`事件的**默认行为**因事件的**事件目标和`button`或`buttons`的值**而异
- 通常，`dblclick`事件的典型默认行为与`click`事件的**默认行为**相匹配，并具有以下附加行为：
    - 如果事件目标是可选的，则默认行为必须是选择部分或全部可选内容
    - 随后的点击可能会选择该内容的其他可选部分

**例子**

```jsx
const log = document.querySelector("ul");

const A = document.querySelector(".A");

function handler(e) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="type">${e.type}</span>
  <span class="target">${e.target.className}</span>
  <span class="currentTarget">${e.currentTarget.className}</span>
  <span class="base">${e.detail}</span>
  <span class="base">${e.screenX}/${e.screenY}</span>
  <span class="base">${e.clientX}/${e.clientY}</span>
  <span class="base">${e.ctrlKey}</span>
  <span class="base">${e.button}</span>
  <span class="base">${e.buttons}</span>
  `;
  log.appendChild(li);
}
A.addEventListener("click", (e) => {
  handler(e);
});
A.addEventListener("dblclick", (e) => {
  handler(e);
});
```

![mouseevent dblclick.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouseevent_dblclick.gif)

- 注意`detail` 的值，`dblclick` 事件不会额外增加一次点击次数，所以它和前面一个的`click` 事件的`detail` 值相同
- 实际上如果**连续不断地**进行点击操作，`dblclick` 事件难以触发，一般情况下`dblclick` 都是在两次“急促”的单击事件后触发的

### 4.3.1.2.6 auxclick

**基本表（参考[uievent-auxclick](https://www.w3.org/TR/uievents/#event-type-auxclick)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| auxclick | Element | PointerEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 多样的（Varies） | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 表示当前点击次数；当用户开始此操作时，属性值必须为1，并且每次单击都递增1。 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 基于当前按下的（鼠标）按键表示的值，参考../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md  |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | null （没有次要事件目标） |
| PointerEvent指定的属性 | 详情查看https://www.w3.org/TR/pointerevents3/#pointerevent-interface |
- 需要注意`click`，`contextmenu`，`auxclick` 事件类型的接口都是`PointerEvent` ，但是`dblclick` ，`mousedown`，`mouseup` 事件的接口却是`MouseEvent`

**定义**

- 当用户按下并释放**非主指针按键**，或以模拟此类动作的方式激活指针时（如通过点击键盘上的上下文菜单键），`auxclick`事件类型必须在指针指示的**最顶层事件目标**上被派发
    - 鼠标按钮的致动方法取决于指针设备和环境配置，例如，它可能取决于屏幕位置或指针设备按键的按下和释放之间的延迟
    - `auxclick`事件只应为非主指针按键触发（即，当`button`不为0，`buttons`大于1时）
    - 主按键（如标准鼠标上的左按键）不得触发`auxclick`事件。有关与主按键关联的相应事件，查看`[click](../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md)`事件
- `auxclick` 的事件目标确定和`click` **不同**，它前面的`mousedown` 、`mouseup` 事件应该在同一个元素（忽略如文本节点这样的其他节点类型）上
- 根据环境配置，如果在按下和释放指针设备按键之间发生一个或多个`mouseover`、`mousemove`和`mouseout` 事件，则可能会派发`auxclick`事件（由具体实现决定）

**注意**

- `auxclick`事件类型的**默认行为**取决于事件的事件目标和`button`或`buttons`的值。auxclick事件类型的典型默认操作如下：
    - 如果事件目标具有关联的激活行为，则**默认行为**必须是执行该激活行为（参见[§ 3.5激活触发和行为](https://www.w3.org/TR/uievents/#event-流量激活)）
- 如果触发`auxclick` 事件的按下的鼠标按键是次按键（鼠标右键），它也会触发`contextmenu` 事件，但是`auxclick` 事件在`contextmenu` 事件之前触发，并且二者相互独立，阻止`auxclick` 事件的默认行为并不会阻止上下文菜单的弹出

**例子**

```jsx
const log = document.querySelector("ul");

const A = document.querySelector(".A");

function handler(e) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="type">${e.type}</span>
  <span class="target">${e.target.className}</span>
  <span class="currentTarget">${e.currentTarget.className}</span>
  <span class="base">${e.detail}</span>
  <span class="base">${e.screenX}/${e.screenY}</span>
  <span class="base">${e.clientX}/${e.clientY}</span>
  <span class="base">${e.ctrlKey}</span>
  <span class="base">${e.button}</span>
  <span class="base">${e.buttons}</span>
  `;
  log.appendChild(li);
}
A.addEventListener("auxclick", (e) => {
  handler(e);
  e.preventDefault()
});
A.addEventListener("mousedown", (e) => {
  handler(e);
});
A.addEventListener("mouseup", (e) => {
  handler(e);
});
A.addEventListener("contextmenu", (e) => {
  handler(e);
});
```

![mouseevent auxclick.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouseevent_auxclick.gif)

- 这里先按了两下滚轮中键，可以看到`auxclick` 事件对象会记录`detail` （按键点击次数）和`button` ，但是记录的`buttons` 不包括中键表示的值本身（因为是在`mouseup` 后触发的）
- 之后按下了鼠标右键，发现`auxclick` 触发之后，A元素又派发了不记录`detail` 的`contextmenu` 事件
- 最后我们按下了鼠标左边的附加按键（一些鼠标没有，它的功能是对浏览器进行翻页），浏览器后退了，我们再进入页面可以看到也触发 了`auxclick` 事件，并且此次按键触发的`mousedown` 记录的`buttons` 值为8

---

<aside>
💡 注意：通过上面6个有关鼠标点击的事件，可以对`MouseEvent`接口有初步了解，它们有一些**共同的特性**：

1. 它们都关注**最顶层的事件目标**，由最顶层的事件目标派发事件然后冒泡
2. `screenX/Y` ,`clientX/Y` 和与键盘按键有关的按键修饰符属性的功能都相同
3. `relatedTarget` 不受鼠标点击事件的关注，`button` 属性都表示触发它们的按键值

但同时，它们的事件对象属性也会有一些**区别**：

1. `mousedown`，`mouseup` ，`dblclick` 是`MouseEvent` 接口定义的事件，而`click`，`auxclick`，`contextmenu` 是`PointerEvent` （继承于`MouseEvent`）接口定义的事件，所以后者的事件对象拥有与`PointerEvent` 相关的额外属性
1. 除了`mousedown` 的`buttons` 值会记录触发事件的鼠标按键值外，剩余得到5个都不会记录（所以单机一个鼠标按键是`buttons` 的值通常为0），这是因为`buttons` 记录的是鼠标事件触发时，鼠标按键的激活状态（`mouseup`事件触发时按键被释放了）
2. `contextmenu` 是比较特殊的鼠标点击事件，因为它的`detail` 值永远是0，其他5个鼠标点击事件的`detail` 值在一定时间间隔连续点击按键会递增
</aside>

### 4.3.1.2.7 mousemove

**基本表（参考[uievent-mousemove](https://www.w3.org/TR/uievents/#event-type-mousemove)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| mousemove | Element | MouseEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 没有 | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 0 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 0 |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | null （没有次要事件目标） |

**定义**

- 当指针设备在元素上移动时，用户代理必须派发`mousemove`事件
- 指针设备移动时的发生`mousemove`事件的**频率**是基于实现（浏览器）、设备（性能）和平台（操作系统）的；但遵循的基本原则是：指针设备的持续移动应该触发多个连续的`mousemove`事件，而不是为每个鼠标移动实例触发一次`mousemove`事件
- 对于触发`mousemove` 事件的最佳频率，规范鼓励浏览器实现以平衡响应性和性能的基础进行确定

**注意**

- 在**一些**实现环境中，例如浏览器，如果用户开始拖动操作（例如，按下鼠标按钮）并且指针设备已经离开用户代理的边界，且`mousemove`事件可以继续激发
- 此事件以前在DOM Level 2 Event 中被指定为**不可取消**，但已被更改以反映用户代理之间的现有互操作性

**例子**

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
document.body.addEventListener("mousemove", newHandler);
log.addEventListener("mousemove", newHandler);
```

![mouseevent mousemove.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouseevent_mousemove.gif)

- 为了让避免`mousemove` 事件触发频率过快导致记录过多，这里使用了防抖函数`debounce` 创建了一个移动一段距离只进行一次记录的事件处理程序
- 可以发现事件目标是**最顶层的元素**，并且`mousemove` 事件是**可以冒泡的**，但是`mousemove` **不会使用**`currentTarget` 属性引用当前执行处理程序的元素
- `mousemove` 的`button` 始终是0，之后的鼠标移动事件的`button` 属性也始终是0，因为 `button` 属性表示的是触发鼠标事件的按键值，而鼠标移动事件不是由鼠标按键点击触发的

### 4.3.1.2.8 mouseover

**基本表（参考[uievent-mouseover](https://w3c.github.io/uievents/#event-type-mouseover)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| mouseover | Element | MouseEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 没有 | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 0 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 0 |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | 指示指针设备正在离开的事件目标（如果有） |

**定义**

- 当指针设备移动到元素边界上或元素移动到主指针设备下方时，用户代理必须派发`mouseover`事件
- 此事件类型类似于`mouseenter`，但不同之处在于`mouseover`**会冒泡**，*并且当指针设备移动到其祖先元素是同一事件侦听器实例的事件目标的元素的边界时*，必须派发它（UIEvent规范）
    - 斜着的句子意思就是把鼠标指针从**最顶层元素**的位置移到**最顶层元素的祖先元素**时，会触发`mouseover` 事件（而不会触发`mouseover` 事件）

**例子**

```jsx
const A = document.querySelector(".A");
const B = document.querySelector(".B");
const log = document.querySelector(".log");

function handler(e) {
  const li = document.createElement("li");
  li.className = "log-li";
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

A.addEventListener("mouseover", handler);
B.addEventListener("mouseover", handler);
```

![mouseover event.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouseover_event.gif)

- `mouseover` 关注最顶层元素，所以在元素之间移动时一定会触发`mouseover` 事件，并且**顶层元素会冒泡到上层**，所以从A移到B记录了两次`mouseover` 事件对象，当前事件目标分别为B和A
- 从空白文档直接移到B只会触发一次`mouseover` 事件（与`mouseenter`）不同
- 注意`relatedTarget` 属性引用的是**即将离开的元素**

### 4.3.1.2.9 mouseout

**基本表（参考[uievent-mouseover](https://w3c.github.io/uievents/#event-type-mouseover)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| mouseout | Element | MouseEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 是 | 没有 | 能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 0 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 0 |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | 指示指针设备正在进入的事件目标（如果有） |

**定义**

- 当指针设备移出元素边界或元素移动到不再位于主指针设备下方时，用户代理必须派发此事件
- 此事件类型类似于`mouseleave`，但不同之处在于它会冒泡，并且当指针设备从一个元素移动到其一个派生元素（后代元素）的边界时，必须派发`mouseout` 事件（而`mouseleave`不会）
    - 因为`mouseout` 关注最顶层元素，所以移动到派生元素后顶层元素的变化会让原始元素触发`mouseout`
    - 但是`mouseleave` 关注指针所在位置的所有层元素的变化，指针仍然在元素元素上（只是顶层元素变了），所以不会触发`mouseleave`事件

**例子**

```jsx
const A = document.querySelector(".A");
const B = document.querySelector(".B");
const log = document.querySelector(".log");

function handler(e) {
  const li = document.createElement("li");
  li.className = "log-li";
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
  <span class="base">${e.relatedTarget.className}</span>
  `;
  log.appendChild(li);
}

// A.addEventListener("mouseover", handler);
A.addEventListener("mouseout", handler);

// B.addEventListener("mouseover", handler);
B.addEventListener("mouseout", handler);
```

![mouseout event.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouseout_event.gif)

- 从B直接移到body，`mouseout` 事件只会触发一次，因为`mouseout` 事件关注最顶层元素变化，又因为冒泡，所以记录了两次事件对象
- 注意`relatedTarget` 引用的都是即将进入（`mouseover`）的元素

### 4.3.1.2.10 mouseenter

**基本表（参考[uievent-mouseenter](https://www.w3.org/TR/uievents/#event-type-mouseenter)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| mouseenter | Element | MouseEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 不能 | 不能 | 没有 | 不能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 0 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 0 |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | 指示指针设备正在退出（exiting）的事件目标（如果有） |
- 注意基本表中标识`mouseenter` 事件**不能冒泡、不可取消默认行为，不能从Shadow DOM冒泡传递**

**定义**

- 当指针设备移动到元素或其派生元素（后代元素）之一的边界上时，用户代理必须派发此事件（与`mouseover` 的区别在于它限定了元素之间的移动方向，从元素到后代元素）
- 当元素或其子元素之一移动到主指针设备下方时，用户代理还必须触发此事件（还是限定了元素之间的移动方向）
- 此事件类型类似于`mouseover`，但不同之处在于它**不会冒泡**，*并且当指针设备从一个元素移动到它的一个祖先元素的边界时，它不能被触发（UIEvent）*
    - 可以这样理解UIEvent规范的这句话：从原始元素移动到子元素，会触发子元素的`mouseenter`事件，但从子元素移动到原始元素，**不会**触发原始元素的`mouseenter` 事件

**注意**

- 此事件类型与CSS:[hover preudo-class](https://www.w3.org/TR/CSS2/selector.html#dynamic-pseudo-classes)[CSS2伪类]有相似之处

**例子**

```jsx
const A = document.querySelector(".A");
const B = document.querySelector(".B");
const log = document.querySelector(".log");

function handler(e) {
  const li = document.createElement("li");
  li.className = "log-li";
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
  <span class="base">${e.relatedTarget.className}</span>
  `;
  log.appendChild(li);
}

A.addEventListener("mouseenter", handler);

B.addEventListener("mouseenter", handler);
```

![mouseenter event.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouseenter_event.gif)

- 将鼠标从B移到A不会触发`mouseenter`事件，将鼠标从body移到B，会触发两次`mouseenter` 事件
- 因为`mouseenter`关心的是**指针所在位置下的所有元素层变化**
    - 从B移到A，元素层只是减少了一个B元素，A元素仍然在元素层中，所以不会触发`mouseenter` （会触发`mouseover`事件）
    - 从body移到B，元素层增加了A和B元素，按照进入栈的原则，先触发A的`mouseenter` 事件，再触发B的`mouseenter` 事件（只会触发B的`mouseover` 事件，但会冒泡到A）
- `relatedTarget` 引用的是即将离开的元素，和`mouseover` 事件一样，它是原始鼠标指针所在位置最顶层元素

### 4.3.1.2.11 mouseleave

**基本表（参考[uievent-mouseleave](https://www.w3.org/TR/uievents/#event-type-mouseleave)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| mouseenter | Element | MouseEvent | Sync |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 不能 | 不能 | 没有 | 不能 | 见../4%203%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 0 |
| MouseEvent.screenX | 基于屏幕（坐标系）上指针位置（在水平方向）的值 |
| MouseEvent.screenY | 基于屏幕（坐标系）上指针位置（在垂直方向）的值 |
| MouseEvent.clientX  | 基于（视觉）视口中指针位置（在水平方向）的值 |
| MouseEvent.clientY  | 基于（视觉）视口中指针位置（在垂直方向）的值 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 0 |
| MouseEvent.buttons  | 值基于当前按下的所有按钮，如果未按下按钮，则为0 |
| MouseEvent.relatedTarget  | 指示指针设备正在进入的事件目标（如果有） |

**定义**

- 当指针设备移动到元素及其所有祖先元素的边界之外时，用户代理必须派发此事件（与`mouseover` 的区别在于它限定了元素之间的移动方向，从元素到祖先元素）
- 当元素或其祖先元素移动到不再位于主定点设备下方时，用户代理还必须派发此事件（还是限定了元素之间的移动方向）
- 此事件类型类似于`mouseout`，但不同之处在于`mouseleave`不会冒泡，并且*在指针设备离开元素的边界及其所有子元素的边界之前，不得派发`mouseleave` 事件*
    - 可以这样理解UIEvent规范的这句话：从原始元素移动到祖先元素，会触发原始元素的`mouseeleave`事件，但从祖先元素移动到原始元素，**不会**触发祖先元素的`mouseleave` 事件

**注意**

- 此事件类型与CSS:[hover preudo-class](https://www.w3.org/TR/CSS2/selector.html#dynamic-pseudo-classes)[CSS2伪类]有相似之处

**例子**

```jsx
const A = document.querySelector(".A");
const B = document.querySelector(".B");
const C = document.querySelector(".C");

const log = document.querySelector(".log");

function handler(e) {
  const li = document.createElement("li");
  li.className = "log-li";
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
  <span class="base">${e.relatedTarget.className}</span>
  `;
  log.appendChild(li);
}

A.addEventListener("mouseleave", handler);
B.addEventListener("mouseleave", handler);
C.addEventListener("mouseleave", handler);
```

![mouseleave event.gif](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85/mouseleave_event.gif)

- 从Body移到A，从A移动B，都不会触发`mouseleave` 事件，从C移到Body会触发两次`mouseleave` 事件
- 因为`mouseleave`关心的是**指针所在位置下的所有元素层变化**
    - 从Body移到A，从A移到B，元素层依次增加A元素和B元素，指针下没有元素“离开”，所以不会触发`mouseleave`
    - 从C移到Body，元素层失去了A和C两个元素，按照离开栈的原则，顺序触发C的`mouseleave` 事件和A的`mouseleave` 事件（对于`mouseout` 而言，只会触发C的`mouseout` 事件，并冒泡到A）
- `relatedTarget` 引用的是即将进入的元素，和`mouseout` 事件一样，它是鼠标指针即将移动到的位置的最顶层元素