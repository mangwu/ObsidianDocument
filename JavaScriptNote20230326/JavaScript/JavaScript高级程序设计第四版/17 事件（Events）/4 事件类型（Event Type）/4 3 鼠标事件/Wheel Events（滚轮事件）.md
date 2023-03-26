# Wheel Events（滚轮事件）

- 参考[UIEvent 5.4 Wheel Events](https://www.w3.org/TR/uievents/#events-wheelevents)

# 1 滚轮事件

**滚轮定义**

- **滚轮**（**Wheels**）是可以在一个或多个空间维度上**滚动**（**rotated**）的设备，并且通常与指针设备关联，坐标系取决于环境配置
    - 用户的环境可以被配置为**沿y轴的垂直滚动**、**沿x轴的水平滚动**以及**沿z轴的缩放滚动**
    - **正常滑动鼠标中间滚轮**，就可以实现页面**沿y轴的垂直滚动**
    - **按住**键盘的`shift` 键的同时滑动鼠标中间滚轮，就可以实现页面**沿x轴的水平滚动**
    - **按住**按键的`ctrl` 键的同时滑动鼠标中间滚轮，就可以实现页面**沿z轴的缩放滚动**
        
        ```jsx
        const div = document.querySelector("div");
        
        div.addEventListener("wheel", (e) => {
          div.innerHTML = `<div class="text">wheelEvent.ctrlKey: <span>${e.ctrlKey}</span>, 
          wheelEvent.shiftKey: <span>${e.shiftKey}</span></div>`;
        });
        ```
        
        ![three scroll func.gif](Wheel%20Events%EF%BC%88%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6%EF%BC%89/three_scroll_func.gif)
        
        - 使用修饰键对应的事件属性就可以得知用户是否按住了键盘的`ctrl` 按键或`shift` 按键

**滚轮移动测量**

- 滚轮在三个方向上进行操作的页面**移动的距离**，使用`WheelEvent` 对象的`deltaX`，`deltaY`，`deltaZ` 属性以像素、行或页作为单位表示沿着各自轴的测量值
- 用户的环境设置可以被定制以不同的方式解释**滚轮设备**的实际**旋转/滚动**（**rotation/movement**）
    - 普通“凹陷”（dented）鼠标滚轮的一次移动可以产生162个像素的测量值（162只是一个示例值，实际值可以取决于用户代理的当前屏幕尺寸）
    - 但用户可以更改默认环境设置以加快鼠标滚轮的速度，从而增加这个数字
    - 此外，一些鼠标滚轮软件可以支持加速（滚轮旋转/滚动得越快，每次测量的增量越大），甚至可以支持**亚像素**（**sub-pixel**）滚动测量
    - 因此，开发者不能假设一个用户代理中给定的滚动量将在所有用户代理中产生相同的增量值（**delta value**）
- 当实际滚轮设备的**同一方向**上旋转/移动时，在`wheel`事件的多个分派事件对象之间的`deltaX`、`deltaY`和`deltaZ`属性值的符号（正或负）必须一致（相同）
    - 也就是说统一方向上的滚动，每次触发的`wheel` 事件对象的`deltaX/Y/Z` 应该是相同的测量值
- 如果用户代理将**页面滚动（scrol）**作为`wheel`事件的默认动作，则**增量（**dalta的属性值**）**的（正负）**符号**应由右手坐标系给出，其中正X、Y和Z轴分别指向文档的最右边、最下边和最远深度（远离用户）
    - 意思就是`daltaX/Y/Z` 属性的值的正负符号确定和文档位置坐标系正好相反
    - 通常而言，**顺时针滚动鼠标滚轮**（向下，向右或向远离用户）时，**增量值为正**，**逆时针滚动鼠标滚轮**（向上，向左或靠近用户）**时，增量值为负**

<aside>
ℹ️ 注意，**不同的用户代理**可以（取决于其环境和硬件配置）以**不同的方式**解释**实现滚动**需要的用户物理交互。例如，轨迹板边缘上从上到下的垂直滑动可以解释为滚轮动作，其目的是向下滚动页面或向上平移页面（即，分别产生正值或负值`deltaY`值）

</aside>

# 2 `WheelEvent` 接口

- `WheelEvent`接口提供与滚轮事件相关的特定上下文信息
- 要创建`WheelEvent`接口的实例，请使用`WheelEvent`构造函数，传递可选的`WheelEventInit`字典

## 2.1 *`WheelEvent`*

```jsx
[Exposed=Window]
interface WheelEvent : MouseEvent {
  constructor(DOMString type, optional WheelEventInit eventInitDict = {});
  // DeltaModeCode
  const unsigned long DOM_DELTA_PIXEL = 0x00;
  const unsigned long DOM_DELTA_LINE  = 0x01;
  const unsigned long DOM_DELTA_PAGE  = 0x02;

  readonly attribute double deltaX;
  readonly attribute double deltaY;
  readonly attribute double deltaZ;
  readonly attribute unsigned long deltaMode;
};
```

- [ ]  ***`DOM_DELTA_PIXEL` :*** `deltaMode` 属性的值之一，表示***增量（delta）的测量单位必须为像素，这是大多数操作系统和实现配置中最典型的情况***
- [ ]  ***`DOM_DELTA_LINE` ： 增量的测量单位必须是单独的文本行，许多表单控件都是这样***
- [ ]  ***`DOM_DELTA_PAGE` ：增量的测量单位必须是页面，定义为单个屏幕或标定页面（demarated page）***
- [ ]  ***`deltaX` ：***double类型，只读，在滚轮事件的默认操作是**滚动页面（scroll）**的用户代理中，`deltaX` 的值必须是在事件未取消的情况下沿x轴的滚动的测量值（以像素、行或页为单位）；除此之外，`detltaX` 是滚轮设备围绕x轴移动的特定于实现的测量（以像素、行或页为单位）；未初始化时属性值为0.0
- [ ]  ***`deltaY`***：double类型，只读，在滚轮事件的默认操作是**滚动页面（scroll）**的用户代理中，`deltaY` 的值必须是在事件未取消的情况下沿y轴的滚动的测量值（以像素、行或页为单位）；除此之外，`detltaY` 是滚轮设备围绕x轴移动的特定于实现的测量（以像素、行或页为单位）；未初始化时属性值为0.0
- [ ]  ***`deltaZ`***：double类型，只读，在滚轮事件的默认操作是**滚动页面（scroll）**的用户代理中，`deltaZ` 的值必须是在事件未取消的情况下沿z轴的滚动的测量值（以像素、行或页为单位）；除此之外，`detltaZ` 是滚轮设备围绕z轴移动的特定于实现的测量（以像素、行或页为单位）；未初始化时属性值为0.0
- [ ]  `***deltaMode`*** :无符号整型（unsigned long），只读，`deltaMode`属性表示增量值测量单位的指示，默认值为`DOM_DELTA_PIXEL`（像素），这个属性必须设置为`DOM_DELTA`常量之一，以指示增量值的测量单位，精确地测量取决于设备、操作系统和应用程序配置；未初始化时属性值为0.0

## 2.2 WheelEventInit

```jsx
dictionary WheelEventInit : MouseEventInit {
  double deltaX = 0.0;
  double deltaY = 0.0;
  double deltaZ = 0.0;
  unsigned long deltaMode = 0;
};
```

- `WheelEventInit` 字典继承于`MouseEventInit` ，定义了一些初始化`WheelEvent` 对象需要的属性
    - [ ]  `*deltaX`* : double类型，默认为0.0，赋值给`WheelEvent` 接口定义的`[deltaX](Wheel%20Events%EF%BC%88%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6%EF%BC%89.md)`属性
    - [ ]  *`deltaY`* : double类型，默认为0.0，赋值给`WheelEvent` 接口定义的`[deltaY](Wheel%20Events%EF%BC%88%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6%EF%BC%89.md)`属性
    - [ ]  *`deltaZ`* : double类型，默认为0.0，赋值给`WheelEvent` 接口定义的`[deltaZ](Wheel%20Events%EF%BC%88%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6%EF%BC%89.md)`属性
        - 该属性（以及deltaX和deltaY属性）的相对正值由**[右手坐标系](Wheel%20Events%EF%BC%88%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**给出，其中X、Y和Z轴分别指向文档的最右边、最下边和最远深度（远离用户），相对负值在各自相反的方向上
    - [ ]  `***deltaMode`*** ：无符号整型（unsigned long），只读，默认为0
        - 将`WheelEvent`对象上的`deltaMode`属性初始化为枚举值0、1或2，这些值表示滚动的像素数（`DOM_DELTA_PIXEL`）、滚动的行数（`DOM.DELTA_LINE`）或滚动的页面数（DOM_DELTA_PAGE）（如果滚轮旋转会导致滚动）

## 2.3 滚轮事件类型（Wheel Event Types）

### 2.3.1 wheel

**基本表（[UIEvent-wheel](https://www.w3.org/TR/uievents/#event-type-wheel)）**

| Type（类型） | Trusted Target（可信目标对象） | Interface（接口） | Sync/Async（同步/异步） |  |
| --- | --- | --- | --- | --- |
| wheel | Element | WheelEvent | Async |  |
| Bubbles（冒泡） | Cancelable（可取消默认行为） | DefaultAction（默认行为） | Composed（能否从Shadow DOM冒泡传递） | Context（trusted events 上下文，就是事件对象的相关属性信息） |
| 是 | 有多种情况下，见下面 | 滚动（或缩放）文档 | 能 | 见Wheel%20Events%EF%BC%88%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6%EF%BC%89.md |

| Context（trusted events 上下文，就是事件对象的相关属性信息） | 描述 |
| --- | --- |
| Event.target  | 最顶层的事件目标（topmost event target），最顶层的事件目标必须是渲染顺序中最高的元素，该元素能够成为事件目标。在图形用户界面（GUI）中，最顶层的事件目标就是用户指针设备下的元素。用户界面的命中测试工具（user interface’s hit testing facility）用于确定目标。有关命中测试和堆叠顺序(stacking order)的详细信息，请参阅https://www.notion.sow3.org/TR/uievents/#host-language。 |
| UIEvent.view | Window |
| UIEvent.detail | 0 |
| MouseEvent.screenX | 如果滚轮与定位设备（pointing device）相关联，则是基于屏幕上指针位置的值，否则为0 |
| MouseEvent.screenY | 如果滚轮与定位设备（pointing device）相关联，则是基于屏幕上指针位置的值，否则为0 |
| MouseEvent.clientX  | 如果滚轮与定位设备（pointing device）相关联，则该值基于视口中的指针位置，否则为0 |
| MouseEvent.clientY  | 如果滚轮与定位设备（pointing device）相关联，则该值基于视口中的指针位置，否则为0 |
| MouseEvent.altKey | 如果Alt修饰符处于活动状态，则为true，否则为false |
| MouseEvent.ctrlKey  | 如果Control修饰符处于活动状态，则为true，否则为false |
| MouseEvent.shiftKey | 如果Shift修改符处于活动状态，则为true，否则为false |
| MouseEvent.metaKey  | 如果Meta修饰符处于活动状态，则为true，否则为false |
| MouseEvent.button  | 如果滚轮与定位设备（pointing device）相关联，则值基于当前按下的按钮，否则为0 |
| MouseEvent.buttons  | 如果滚轮与定位设备（pointing device）相关联，则值基于当前所有按下的按钮，否则为0 |
| MouseEvent.relatedTarget  | 指示定位设备所指向的事件目标（如果有） |
| WheelEvent.deltaX  | 页面根据deltaMode 表示的单位沿x轴滚动的预期量；或滚轮绕x轴运动的具体实现值 |
| WheelEvent.deltaY | 页面根据deltaMode 表示的单位沿y轴滚动的预期量；或滚轮绕y轴运动的具体实现值 |
| WheelEvent.deltaZ | 页面根据deltaMode 表示的单位沿z轴滚动的预期量；或滚轮绕z轴运动的具体实现值 |
| WheelEvent.deltaMode  | deltaX、deltaY和deltaZ属性的单位指示符（像素、行或页） |
- 注意，`wheel` 事件是**异步的**

**定义**

- 当鼠标滚轮沿着任何轴旋转/滚动时，或当等效输入设备（如鼠标球、某些平板电脑或触摸板等）模拟了此类动作时，用户代理必须派发`wheel`事件
- 根据平台和输入设备，对角滚轮`deltas` （diagonal wheel deltas）具有多个非零轴的单个`wheel`事件交付，或者作为每个非零轴的单独`wheel`事件交付
- 滚轮事件类型的典型默认操作是按指示的增量滚动（或在某些情况下缩放）文档；如果取消此事件（调用`preventDefault()`），则浏览器实现不得滚动或缩放文档（或执行与此事件类型关联的任何其他特定于实现的默认操作）
- 在某些用户代理或某些输入设备中，滚轮的转动速度可能会影响增量值（`delta` ），速度越快，增量值越高

**注意（参考MDN和UIEvent规范）**

- 不要混淆[❓`**scroll**`](../../4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md) 中提到的`scroll` 事件
    - `wheel`事件的默认行为是浏览器实现的，因此`wheel` 事件不一定派发`scroll` 事件
    - 即使`wheel` 事件引发了浏览器页面的滚动行为，也不代表`wheel`事件中的`delta*` 值恰好反映文档内容的滚动方向，所以**不要依赖**`delta*` 值
    - 可以在`scroll` 事件中监听目标元素的`scrollLeft`和`scrollTop` 的变化以推断滚动方向
- `wheel` 事件的可取消性
    - 在`wheel` 事件中调用`preventDefault()` 可以阻止或以其它方式中断滚动
    - 为了获得最大的滚动性能，用户代理（浏览器）**可能**不会等待，以检查它（`wheel`事件）是否会被取消来处理与滚动关联的每个`wheel`事件（滚轮事件是**异步的**）
    - 在这种情况下，用户代理（浏览器）应该生成 `cancelable`属性值为`false`的`wheel` 事件对象，以表示`preventDefault` 不能用于阻止或中断滚动
    - 特别是，当用户代理观察到事件[没有非被动侦听器](https://dom.spec.whatwg.org/#observing-event-listeners)（no non-passive listeners）时，它应该只生成**不可取消**的`wheel`事件
        
        <aside>
        ℹ️ 在事件处理程序章节中提到过`addEventListener` 方法的第三个参数，它的字典定义有一个`passive` 属性，表示 `[listener` 是否永远不会调用`preventDefault()`](../../2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89.md) ，非被动监听器就是`passive` 设置为`false` 的监听处理程序，它表示事件可被取消；再理解上面的话，特意设置`passive` 属性为`true` ，那么实现只会生成不可取消的wheel事件
        
        </aside>
        

**例子**

```jsx
const box1 = document.querySelector(".box1");
const box2 = document.querySelector(".box2");

box1.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
  },
  { passive: true }
);

box2.addEventListener("wheel", (e) => {
  e.preventDefault();
});
```

![wheel event.gif](Wheel%20Events%EF%BC%88%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6%EF%BC%89/wheel_event.gif)

- 设置了`passive`为`true` 的`wheel` 事件监听程序会忽略程序中对`preventDefault()` 的调用，使得`wheel` 触发滚动的默认行为继续
- 第二个事件监听器没有设置`passive` （默认为`false` ），所以调用`preventDefault()` 能中断滚动的默认行为，但这**只**代表元素无法通过滚轮滚动方式滚动元素，滚动还可以直接点击拖拽判断的滚动条
    
    <aside>
    ℹ️ 注意，`scroll` 事件的Cancelable信息是不可取消，即无论怎么设置`passive` ，`scroll` 的事件对象的`preventDefault()` 都无效
    
    </aside>
    
- 需要知晓的是，`wheel` 事件会冒泡，也就是说`body` 元素会接收到`**content**`元素触发的`wheel` 事件，`currentTarget` 属性依次为`content` 元素，`box` 元素和`body` 元素，`target` 始终是`content` 元素，`relatedTarget`属性始终为`null`