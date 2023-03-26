# The Drag Event（拖拽事件）

参考[HTML Standard](https://html.spec.whatwg.org/multipage/dnd.html#dnd)，MDN和[cloud-tencent-blog](https://cloud.tencent.com/developer/article/2061469)

英文与中文对照

**drag：拖拽，拖动**

**drag-and-drop：拖放**

**drop：放（置）**

**accept a drop：成为拖拽的终点**

**drop operation：卸置操作**

**drag operation：拖动操作**

# 1. 拖放（Drag and drop）

**MDN定义**

- `DragEvent`接口是一个表示拖拽交互的**DOM**事件；用户通过将指针设备（例如鼠标）放置在触摸表面上，然后将指针拖动到新位置（例如另一个DOM元素）来启动拖动；应用程序可以按应用程序特定的方式自由解释拖放交互

**HTML Standard介绍**

- 基于事件的**拖放机制**（**drag-and-drop mechanism**）：在带有指针设备（鼠标）的视觉媒体（PC等）上，**拖动操作**（**drag**）可以是`mousedown`事件的默认操作，随后是一系列`mousemove`事件，并且可以通过释放鼠标来触发**拖放操作**（**drop**）
- 当使用指针设备以外的输入模式时，用户可能必须明确表示它们有拖放操作的功能，并分别说明它们希望拖动什么和将其放置在何处
- 然而，实现拖放操作时，必须有一个起点（例如，鼠标被单击的位置，或被拖动选择的文本或元素），可以有任意数量的中间步骤（鼠标在拖动过程中**移动到[mosueover 事件]**的元素，或用户为选取的元素在浏览中切换各种可能的放置点[**drop points**]），并且必须有一个终点（在其上释放鼠标按键拖动的元素，或最终选择的元素），或被取消。终点必须是**拖放**（**drop**）发生之前作为可能拖放点选择的最后一个元素（因此，如果拖拽操作没有取消，中间步骤中必须至少有一个元素）

# 2. 介绍

- 若要使元素**可拖动（draggable）**，需要为该元素指定`**draggable**`属性，并为 `dragstart` 事件 设置一个事件侦听器，用于存储正在拖动的数据
- 事件处理程序通常需要检查它是否正在拖动**被选择的文本**（**text selection**），然后需要将数据存储到 `DataTransfer`对象中并设置允许的效果（复制、移动、链接或某种组合）
- 例子
    
    ```jsx
    // HTML
    <p>What fruits do you like?</p>
    <ol>
      <li draggable="true" data-value="fruit-apple">Apples</li>
      <li draggable="true" data-value="fruit-orange">Oranges</li>
      <li draggable="true" data-value="fruit-pear">Pears</li>
    </ol>
    
    // JavaScript
    const internalDNDType = "text"; // 指定数据类型
    const ol = document.querySelector("ol");
    
    ol.addEventListener("dragstart", (e) => {
      if (e.target instanceof HTMLLIElement) {
        // 获取元素的data-value数据
        e.dataTransfer.setData(internalDNDType, e.target.dataset.value);
        e.dataTransfer.effectAllowed = "move"; // 只允许移动
      } else {
        e.preventDefault();
      }
    });
    
    ```
    
- 如果要让**元素成为拖拽的终点**（**accept a drop**），终点元素必须监听如下事件：
    1. `dragenter` 事件处理程序通过取消事件来报告**终点目标（drop target）**是否可能愿意成为拖拽的终点
    2. `dragover` 事件处理程序指定向用户显示的反馈，它通过设置与事件关联的`DataTransfer`的`dropEffect` 属性来实现；此事件也需要被取消
    3. `drop` 事件处理程序有最后一次机会让目标元素接受或拒绝成为**拖拽终点（accept or reject the drop）；**如果接受，则事件处理程序必须在目标上执行**卸置操作（drop operation）；**同样需要取消此事件，以便可以使用 `dropEffect` 属性的值，否则，**卸置操作（drop operation）**将被拒绝
    
    ```jsx
    ol.addEventListener("dragenter", (e) => {
      const items = e.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "string" && item.type === internalDNDType) {
          e.preventDefault();
          return;
        }
      }
    });
    ol.addEventListener("dragover", (e) => {
      e.dataTransfer.dropEffect = "move";
      e.preventDefault();
    });
    ol.addEventListener("drop", (e) => {
      const li = document.createElement("li");
      const data = e.dataTransfer.getData(internalDNDType);
      if (data === "fruit-apple") {
        li.textContent = "Apples";
      } else if (data === "fruit-orange") {
        li.textContent = "Oranges";
      } else if (data === "fruit-pear") {
        li.textContent = "Pears";
      } else {
        li.textContent = "Unknown Fruit";
      }
      e.currentTarget.appendChild(li);
    });
    ```
    
    - 目前的代码实现了对原始三个`<li>` 原始的复制然后添加到列表中，如下
        
        ![drop-introduce.gif](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/drop-introduce.gif)
        
- 要从显示中删除原始元素（拖动的元素），可以使用`dragend`事件，将对应的目标元素移除
    
    ```jsx
    ol.addEventListener("dragend", (e) => {
      if (e.dataTransfer.dropEffect == "move") {
        e.target.parentNode.removeChild(e.target);
      }
    });
    ```
    
    ![dragend-introduce.gif](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/dragend-introduce.gif)
    

**补充**

- 上述例子是HTML规范提出的例子，它简要说明了实现元素变动的三个步骤：
    1. 对被拖拽元素添加**`draggable`**属性，并添加`dragstart` 事件处理程序（设置数据，允许移动等）
    2. 对可能成拖拽终点的元素添加`dragover`和`dragenter` 事件监听器，当鼠标指针进入这些元素时，前者可用于显示反馈（如改变背景颜色等），后者用于判断进入的元素能否成为拖拽终点
    3. 对最终成为**拖拽终点**（**accept a drop**）的元素添加`drop` 监听器（获取数据，元素移动的）
- 上面的例子没有实现事实上的移动，而是在列表最后添加一个<li>元素最后删除原始元素，下面是更完整的例子
    
    ```jsx
    const internalDNDType = "text"; // 指定数据类型
    const ol = document.querySelector("ol");
    const div = document.querySelector("div");
    ol.addEventListener("dragstart", (e) => {
      if (e.target instanceof HTMLLIElement) {
        // 获取元素的data-value数据
        e.target.style.color = "red";
        let data = 0;
        for (let i = 0; i < ol.children.length; i++) {
          if (ol.children[i] === e.target) {
            data = i;
            break;
          }
        }
        e.dataTransfer.setData(internalDNDType, data);
        e.dataTransfer.effectAllowed = "move"; // 只允许移动
      } else {
        e.preventDefault();
      }
    });
    ol.addEventListener("dragenter", (e) => {
      const items = e.dataTransfer.items;
      e.target.style.border = "1px solid gray";
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "string" && item.type === internalDNDType) {
          e.preventDefault();
          return;
        }
      }
    });
    ol.addEventListener("dragover", (e) => {
      e.dataTransfer.dropEffect = "move";
      e.preventDefault();
    });
    ol.addEventListener("dragleave", (e) => {
      e.target.style.border = "";
    });
    const children = ol.children;
    for (const child of children) {
      child.addEventListener("drop", (e) => {
        const index = e.dataTransfer.getData(internalDNDType);
        let data = 0;
        for (let i = 0; i < children.length; i++) {
          if (children[i] === child) {
            data = i;
            break;
          }
        }
        const node1 = children[data + 1];
        const node2 = children[index];
    
        const parentNode = node2.parentNode;
        parentNode.insertBefore(e.target, node2);
        parentNode.insertBefore(node2, node1);
        e.target.style.border = "";
        const record = document.createElement("div");
        record.textContent = `${e.target.dataset.value} ↔ ${node2.dataset.value}`;
        div.appendChild(record);
      });
    }
    
    ol.addEventListener("dragend", (e) => {
      if (e.dataTransfer.dropEffect == "move") {
        // console.log(e.target); // 被拖曳的原始元素
        e.target.style.color = "black";
      }
    });
    ```
    
    ![drag and drop-introduce.gif](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/drag_and_drop-introduce.gif)
    

# 3. 拖动数据仓库（The Drag data store）

- 构成**拖放操作**（drag-and-drop operation）的基础数据，称为**拖动数据仓库（drag data store）**，由以下信息组成：
    - **拖动数据仓库项列表（darg data store item list）**，是表示拖动保存的每项数据的列表，每个项包含以下信息：
        
        **拖动数据项类型（The drag item kind），**数据类型包括
        
        **文本（Text）：**
        
        也就是字符串文本
        
        **文件（File）：**
        
        带有文件名称的**二进制数据**
        
        **拖动数据项类型字符串（The drag data item type string）**
        
        表示拖动数据的**类型或格式**的Unicode字符串，通常由**[MIME](https://mimesniff.spec.whatwg.org/#mime-type)**类型给出。由于遗留原因，这条信息的值可能并非**MIME**类型的字符串
        
        拖动API不强制使用MIME类型，也可以使用其他值；然而，在所有情况下，API都将值转换为**[ASCII小写](https://infra.spec.whatwg.org/#ascii-lowercase)**
        
        每个**[数据类型字符串](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**有一个*文本（text）*项目的限制
        
        **实际数据（The actual data）**
        
        一个Unicode或二进制字符串，在某些情况下带有文件名（本身是一个Unicode字符串），具体取决于每项数据的**[拖动数据项类型](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**
        
        ---
        
        **拖动数据仓库项列表（darg data store item list）**按照数据项添加到列表的顺序排序；最近添加的是最后一个
        
    - 用于在拖动期间生成UI反馈的信息
        - 用户代理定义的默认反馈信息，称为**拖动数据仓库默认反馈（drag data store default feedback）**
        - 可选信息：**位图（bitmap image）**和该图像中的点的坐标，称为**拖动数据仓库位图（drag data store bitmap）**和**拖动数据仓库热点坐标（drag data store hot spot coordinate）**
    - **拖动数据仓库模式（drag data store mode）,**模式是下面其中之一
        
        **读/写模式（Read/write mode）**
        
        用于`dragstart`事件；可以将新数据添加到[拖动数据仓库](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)中
        
        **只读模式（Read-only mode）**
        
        用于`drop`事件；可以读取表示拖动数据的[项目列表](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)，包括数据；无法添加新数据
        
        **受保护模式（Protected mode）**
        
        用于所有其他事件（不包括`dragstart`和`drop` 的其他拖拽事件）；可以枚举包含每项拖动数据的**拖动数据仓库列表**中的**格式（format）**和**类型（kind）**，但数据本身不可用，不能添加新数据
        
    - **拖动数据仓库允许的效果状态（drag data store allowed effects state）**，它是一个字符串
- 当创建了一个**拖动数据仓库（[drag data store](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**后，必须对其进行初始化，因为**拖动数据仓库项列表（darg data store item list）**为空，没有**拖动数据仓库默认反馈（drag data store default feedback）**，没有**拖动数据仓库位图（drag data store bitmap）**和**拖动数据仓库热点坐标（drag data store hot spot coordinate）**，**拖动数据仓库模式（drag data store mode）**为**受保护模式（Protected mode）**，且**拖动数据仓库允许的效果状态（drag data store allowed effects state）**为字符串“**uninitialized**”

# 3. DataTransfer 接口

`DataTransfer`对象用于描述构成**拖放操作**（**drag-and-drop operation**）基础的**拖动数据仓库（[drag data store](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**

```jsx
[Exposed=Window]
interface DataTransfer {
  constructor();

  attribute DOMString dropEffect;
  attribute DOMString effectAllowed;

  [SameObject] readonly attribute DataTransferItemList items;

  undefined setDragImage(Element image, long x, long y);

  /* old interface */
  readonly attribute FrozenArray<DOMString> types;
  DOMString getData(DOMString format);
  undefined setData(DOMString format, DOMString data);
  undefined clearData(optional DOMString format);
  [SameObject] readonly attribute FileList files;
};
```

- [ ]  `constructor()`
    
    **dateTransfer = new DataTransfer()**
    
    创建一个拥有空的拖动数据仓库的`DataTransfer`对象
    
- [ ]  `dropEffect`
    
    **dataTransfer.dropEffect [= value]**
    
    返回当前被选（元素）的可操作类型。如果操作类型不是`effectAllowed`属性所允许的类型之一，则操作将失败（*上面[例子](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)在drop事件处理程序中使用过*）
    
    该属性能被设置修改，以更改可选操作
    
    可能的值为”none”,”copy”，“link”，“move”
    
- [ ]  `effectAllowed`
    
    **dropTransfer.effectAllowed [= value]**
    
    返回允许的操作类型，也就是**拖动数据仓库允许的效果状态（drag data store allowed effects state）**
    
    该属性能被设置修改（在`dragstart`事件期间），以更改允许的操作
    
    可能的值为“none”，“copy”，“copyLink”，“copyMove”，”link“，”linkMove“，”move“，”all“，和”uninitialized”（创建的默认值）
    
- [ ]  `items`
    
    **dataTransfer.items**
    
    返回带有拖动数据的`DataTransferItemList`对象，也就是**拖动数据仓库项列表（darg data store item list）**
    
- [ ]  `setDragImage()`
    
    **dataTransfer.setDragImage(element, x, y)**
    
    使用给定元素更新拖动反馈，替换之前指定的任何反馈；`element` 就是**拖动数据仓库位图（drag data store bitmap），**`(x, y)` 就是**拖动数据仓库热点坐标（drag data store hot spot coordinate）**
    

下面是老接口（也有效）

- [ ]  `types`
    
    **dataTransfer.types**
    
    返回一个**冻结数组（frozen array）**，列出在`dragstart`事件中设置的（数据）[格式](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)。此外，如果正在拖动任何文件，那么其中一种类型将是字符串“Files”
    
- [ ]  `getData`
    
    **dataTransfer.getData(format)**
    
    返回指定（[格式](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）的数据；如果没有这样的数据，则返回空字符串
    
- [ ]  `setData`
    
    **dataTransfer.setData(format, data)**
    
    添加指定（[格式](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）的数据
    
- [ ]  `clearData`
    
    **dataTransfer.clearData([ format ])**
    
    删除指定[格式](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)的数据；如果忽略参数，则删除所有数据
    
- [ ]  `files`
    
    返回正在拖动的文件的`[FileList`](https://w3c.github.io/FileAPI/#filelist-section) （如果有）
    

## 3.1 接口、对象、属性介绍

作为**拖放事件**的一部分，创建的`DataTransfer`对象**仅**在触发这些事件时有效

`DataTransfer`对象在有效时与**拖动数据仓库（**[The Drag data store](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）**相关联

`**types**`

- `DataTransfer`对象有一个关联的[类型数组](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)（types array），它是FrozenArray＜DOMString＞类型，最初为空。当`DataTransfer`对象的**拖动数据仓库项列表（darg data store item list）**的内容发生更改时，或者当`DataTransfer`**不再**与拖动数据仓库关联时，请运行以下步骤：
    1. 将列表（***L***）变成空序列
    2. 如果`DataTransfer` 对象仍然与数据仓库关联，则
        1. 对于`DataTransfer`对象的拖动数据存储项列表中类型为文本的每个项，向列表（***L***）添加一个由（数据）项的**类型字符串（[item’s type string](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**组成的条目
        2. 如果`DataTransfer`对象的**拖动数据仓库项列表**中有任何**类型（[kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**为*File*的项，则向列表（***L***）添加一个由字符串“Files”组成的条目（此值可以与其他值区分开来，因为它不是小写的）
    3. 将`DataTransfer`对象的[类型数组](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)（types array）设置为从列表（***L***）**创建冻结数组（[creating a frozen array](https://webidl.spec.whatwg.org/#dfn-create-frozen-array)）**的结果

`**constructor()**`

- 调用`DataTransfer()`构造函数时，必须返回一个新创建的`DataTransfer`对象，其**初始化**如下：
    1. 将拖动数据仓库（**[drag data store](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）的项列表（[item list](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）设置为空列表
    2. 将**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**设置为读/写模式（**[Read/write mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）
    3. 将`[dropEffect](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)`和`[effectAllowed](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)` 设置为”none”

`**dropEffect**`

- `[dropEffect](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)`属性控制在**拖放操作期间**提供给用户的**拖放反馈（drag-and-drop feedback）**
    - 创建`DataTransfer`对象后，`[dropEffect](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)`属性设置为一个字符串值（”none”）
    - 获取（getting）属性值时，必须返回其当前值；设置（setting）属性值时，如果新值是“none”、“copy”、“link”或“move”中的一个，则属性的当前值必须设置为新值，其他非可选字符串值会被忽略

`**effectAllowed**`

- `[effectAllowed](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)` 属性在**拖放处理模型（drag-and-drop processing model）**中用于在`dragenter`和`dragover`事件期间初始化`[dropEffect](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)`属性
    - 创建`DataTransfer`对象后，`effectAllowed`属性设置为一个字符串值（“none”）
    - 获取（getting）属性值时，必须返回其当前值；设置（setting）属性值时，如果**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**设置为读/写模式（**[Read/write mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**），并且新值是“none”、“copy”、“copyLink”，”copyMove”, “link”,”linkMove”，“move”，“all”或“uninitialized”中的一个,则属性的当前值必须设置为新值，其他非可选字符串值会被忽略

`**items**`

- `items`属性必须返回与`DataTransfer`对象关联的`DataTransferItemList`对象（`DataTransferItemList` 接口在下一章解释）

`**setDragImage(image, x, y)**`

- `setDragImage(image，x，y)`方法必须运行以下步骤：
    1. 如果`DataTransfer`对象不再与拖动数据仓库关联，直接返回，什么都不会发生
    2. 如果**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**设置为读/写模式（**[Read/write mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**），直接返回，什么都不会发生
    3. 如果image是`img`元素，则将**拖动数据仓库位图（drag data store bitmap）**设置为元素图像（按其固有大小）；否则，将**拖动数据仓库位图（drag data store bitmap）**设置为由给定元素生成的图像（当前执行此操作的确切机制未确定）
    4. 将**拖动数据仓库热点坐标（drag data store hot spot coordinate）**设置为给定的x，y坐标

`**getData(format)**`

- `getData(format)`方法必须运行以下步骤：
    1. 如果`DataTransfer`对象不再与拖动数据仓库关联，则返回空字符串
    2. 如果**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**是**受保护模式**，则返回空字符串
    3. 让`format`作为第一个参数，转换为ASCII小写
    4. 声明`convert-to-URL` 变量，为false
    5. 如果`format`等于“text”，请将其更改为“text/plain”
    6. 如果`format`等于“url”，请将其更改为“text/uri-list”，并将`convert-to-URL` 变量修改为true
    7. 如果**拖动数据仓库项列表**中没有**类型**（**[kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）为*文本（text）*且**类型字符串（[type string](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**等于`format`的项，则返回空字符串
    8. 让`*result*`是**拖动数据仓库项列表**中对应项的数据，这一项的**类型**（**[kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）为***纯Unicode字符串（Plain Unicode string）***，其**类型字符串（[type string](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**等于`format`
    9. 如果`convert-to-URL`为true，则根据text/uri列表数据分析结果，然后将结果设置为列表中的第一个URL（如果有），否则设置为空字符串
    10. 返回`result`

`**setData(format, data)**`

- `setData(format，data)`方法必须运行以下步骤：
    1. 如果`DataTransfer`对象不再与拖动数据仓库关联，直接返回，什么都不会发生
    2. 如果**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**不是读/写模式（**[Read/write mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**），直接返回，什么都不会发生
    3. 让`format`作为第一个参数，转换为ASCII小写
    4. 如果`format`等于“text”，请将其更改为“text/plain”
        
        如果`format`等于“url”，请将其更改为“text/uri-list”
        
    5. 删除**拖动数据仓库项列表**中的一个项，该项的**类型**（**[kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）为*文本（text）*，**类型字符串（[type string](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**等于`format`（如果有）
    6. 向**拖动数据仓库项列表**中添加一个项，该项的**类型**（**[kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）为*文本（text）*，**类型字符串（[type string](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**等于`format`，其数据为该方法的第二个参数`data`给定的字符串

**`clearData(format)`**

- `clearData(format)`方法必须运行以下步骤：
    1. 如果`DataTransfer`对象不再与拖动数据仓库关联，直接返回，什么都不会发生
    2. 如果**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**不是读/写模式（**[Read/write mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**），直接返回，什么都不会发生
    3. 如果该方法是在没有参数的情况下调用的，请删除**拖动数据仓库项列表**中类型为***纯Unicode字符串（Plain Unicode string）***的每个项，然后返回
    4. 让`format`作为第一个参数，转换为ASCII小写
    5. 如果`format`等于“text”，请将其更改为“text/plain”
        
        如果`format`等于“url”，请将其更改为“text/uri-list”
        
    6. 删除**拖动数据仓库项列表**中的项，该项的**类型**（**[kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）为*文本（text）*，**类型字符串（[type string](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**等于`format`（如果有）。

<aside>
💡 注意：`clearData()`方法不影响拖动中是否包含任何文件，因此在调用clearData（（）之后，types属性的列表可能仍然不为空（如果拖动中包含任何文件的话，它仍然包含“files”字符串）。

</aside>

`**files**`

- `files`属性必须返回一个**实时**的[FileList](https://w3c.github.io/FileAPI/#filelist-section)序列，该序列由通过以下步骤找到的文件的`File`对象组成。此外，对于给定的[FileList](https://w3c.github.io/FileAPI/#filelist-section)对象和给定的基础文件，每次都必须使用相同的`file`对象
    1. 从空列表`*L*`开始
    2. 如果`DataTransfer`对象不再与拖动数据仓库关联，则`FileList`为空，返回空列表`*L*`
    3. 如果**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**是**受保护模式**，则返回空列表`*L*`
    4. 对于**拖动数据仓库项列表**中**类型**（**[kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）为*文件（File）*的每个项，将该项的数据（文件，尤其是其名称和内容，以及其[类型](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）添加到列表`*L*`中
    5. 通过这些步骤找到的文件是列表`*L*`中的文件，返回列表`*L*`

## 3.2 DragTransferItemList 接口

每个`DataTransfer`对象都与一个`DataTransferItemList`对象（`items` 属性）相关联

```jsx
[Exposed=Window]
interface DataTransferItemList {
  readonly attribute unsigned long length;
  getter DataTransferItem (unsigned long index);
  DataTransferItem? add(DOMString data, DOMString type);
  DataTransferItem? add(File data);
  undefined remove(unsigned long index);
  undefined clear();
};
```

- [ ]  `length`
    
    **items.length**
    
    返回**拖动数据仓库**中的数据项数目
    
- [ ]  `getter DataTransferItem()`
    
    **items[index]**
    
    返回表示**拖动数据仓库**的`DataTransferItem`对象（[项列表](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）索引项为`index`的实体（数据项）
    
- [ ]  `remove()`
    
    **items.remove(index)**
    
    删除**拖动数据仓库**的`DataTransferItem`对象（[项列表](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）索引项为`index`的实体（数据项）
    
- [ ]  `clear()`
    
    **items.clear()**
    
    删除**拖动数据仓库**的`DataTransferItem`对象（[项列表](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）的所有实体（数据项）
    
- [ ]  `add()`
    
    **items.add(data)**
    
    **items.add(data, type)**
    
    将给定数据作为一个新实体（数据项）添加到**拖动数据仓库**中；如果数据是文件（`File`），直接提供即可，如果数据是纯文本（plain text），则还必须提供**类型字符串（[type string](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**
    

### 3.2.1 接口解释

- `DataTransferItemList`对象对应的`DataTransfer`对象与**拖动数据仓库**相关联时，`DataTransferItemsList`对象的*模式（mode）*与**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**相同
- 当`DataTransferItemList`对象对应的`DataTransfer`对象与**拖动数据仓库**不关联时，`DataTransferItemsList`对象的模式为禁用模式（disabled mode）
- 本节中引用的**拖动数据仓库**（仅在`DataTransferItemList`对象未处于禁用模式时使用）是`DataTransferItemsList`对象对应的`DataTransfer`对象与拖动数据仓库相关联是的（拖动数据仓库）

## 3.3 DataTransferItem 接口

每个`DataTransferItem`对象都与一个`DataTransfer`对象相关联

```jsx
[Exposed=Window]
interface DataTransferItem {
  readonly attribute DOMString kind;
  readonly attribute DOMString type;
  undefined getAsString(FunctionStringCallback? _callback);
  File? getAsFile();
};

callback FunctionStringCallback = undefined (DOMString data);
```

- [ ]  `kind`
    
    **item.kind**
    
    返回**拖动数据项类型**（[the drag data item kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)），值为“string”、“file”之一
    
- [ ]  `type`
    
    **item.type**
    
    返回**拖动数据项类型字符串（[type string](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**
    
- [ ]  `getAsString()`
    
    **item.getAsString(callback)**
    
    如果**拖动数据项类型**（[the drag data item kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）为文本，则使用字符串数据作为参数调用回调
    
- [ ]  `getAsFile()`
    
    **file = item.getAsFile()**
    
    如果**拖动数据项类型**（[the drag data item kind](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）为*File*，则返回File对象
    

# 4. DragEvent 接口

拖放处理模型（drag-and-drop processing model）涉及多个事件；它们都使用`DragEvent`接口

```jsx
[Exposed=Window]
interface DragEvent : MouseEvent {
  constructor(DOMString type, optional DragEventInit eventInitDict = {});

  readonly attribute DataTransfer? dataTransfer;
};

dictionary DragEventInit : MouseEventInit {
  DataTransfer? dataTransfer = null;
};
```

- `DragEvent` 接口继承于`MouseEvent` 接口，它拥有客户端坐标，页面坐标等属性，只多了一个`dataTransfer` 属性用于承载**拖动数据仓库**
- [ ]  `dataTransfer`
    
    **event.dataTransfer**
    
    返回拖动事件的`DataTransfer`对象
    
- [ ]  `constructor()`
    
    尽管为了与其他事件接口保持一致，`DragEvent`接口具有构造函数，但它并不是特别有用；特别是，**无法**从脚本中创建有用的`DataTransfer`对象，因为`DataTransfer`对象具有在拖放过程中由浏览器协调的**处理和安全模型（***processing and security model***）**
    

## 4.1 接口解释

`DragEvent`接口的`dataTransfer`属性必须返回其**初始化之后**的值，它表示事件的**上下文信息**

在触发不同的拖放事件时，`dataTransfer` 属性引用的`DataTransfer` 对象和**拖动数据仓库**的关系如下

- 如果事件类型是`dragstart` ，设置**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**是读/写模式（**[Read/write mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）
    
    如果事件类型是`drop` ，设置**拖动数据仓库模式（[drag data store mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**是只读模式（[Read-only mode](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）
    
- `dataTransfer`是与给定的**拖动数据仓库**关联的**新创建**的`DataTransfer`对象
- `effectAllowed` 的属性会被设置为**拖动数据仓库**的**拖动数据仓库允许的效果状态（drag data store allowed effects state）**
- 只能在`dragstart` 事件中改变`effectAllowed` 的值
- 如果事件类型是`dragstart` ，`drag` ，`dragleave` ，`dataTransfer`的`dropEffect` 会被设置为”none”
    
    如果事件类型是`drop`或`dragend` ，则`dropEffect` 属性会被设置成与**当前拖动操作（current drag operation）**相对应的值（也就是"`none`", "`copy`", "`link`", "`move`"中的一种）
    
    其他事件类型（例如`dragenter` ，`dragover`），`dropEffect` 属性的值基于拖动源和`dataTransfer`的`effectAllowed` 属性值，如下表
    
    | https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed | https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect |
    | --- | --- |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-none" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copy" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copylink" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy", or, The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md, "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copymove" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy", or, The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md, "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy", or, The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md, either "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link" or "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-link" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-linkmove" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link", or, The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md, "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-move" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized" 当拖动的对象是从文本控件中选择的对象时 | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move", or, The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md, either "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy" or "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized" 当拖动的是一个选择对象时 | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy", or, The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md, either "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link" or "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move" |
    | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized" 当被拖动的是带有href属性的a元素时 | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link", or, The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md, either "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy" or "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move" |
    | 其它情况 | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy", or, The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md, either "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link" or "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move" |
    
    上表中表明了**可能合适的替代方案**（**possibly appropriate alternatives**）的地方，如果平台约定中包含其它可选的`effect` 值，则用户代理可以使用列出的替代值
    
    例如，Windows平台的约定是，按住“alt”键拖动表示链接数据（linking for data）的行为，而不是移动或复制数据。因此，在Windows系统上，如果根据上表，当按下“alt”键时，“link”是一个选项，用户代理可以选择该选项，而不是“copy”或“move”。
    

# 5. （拖放）过程模型

当用户试图开始**拖动操作**时，用户代理必须运行以下步骤。即使拖拽实际上是在另一个文档或应用程序中开始的，并且用户代理直到拖拽与用户代理权限下的文档相交时才意识到拖拽正在发生，用户代理也必须像运行这些步骤一样进行操作

1. 确定正在被拖动的内容，如下所示：
    
    如果对选定对象调用了拖动操作，则拖动的就是选定对象（可以查看[4.1.3.4 select事件（The Select Event）](../../4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md) 中关于`Selection` 对象的解释）
    
    ![Selection2.png](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/Selection2.png)
    
    否则，如果在`Document`上调用了拖动操作，那么拖动对象就是从用户试图拖动的节点开始的**祖先链**上的第一个元素，这个元素的IDL属性`draggable`设置为`true`；如果**没有**这样的元素，那么就没有任何东西被拖动；直接返回，拖放操作永远不会启动
    
    ![drag and drop-introduce.gif](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/drag_and_drop-introduce.gif)
    
    <aside>
    ℹ️ 注意，`img`元素和带有`href`属性的`a`元素的`draggable`属性默认设置为true
    
    </aside>
    
    否则，拖动操作将在用户代理权限之外调用；正在拖动的内容由开始拖动的文档或应用程序定义
    
    ![out-file2.png](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/out-file2.png)
    
2. 创建**拖动数据仓库**，本节中的步骤随后触发的所有DND事件都必须使用此**拖放数据仓库**
3. 确定哪个DOM节点是**源节点（source node）**，如下所示：
    
    如果它是一个正在被拖动的选择对象（**selection**），那么**源节点**就是用户开始拖动的`Text`节点（通常是用户最初单击的Text节点）；如果用户没有指定特定的节点，例如，如果用户只是告诉用户代理开始拖动“选择”，则源节点是**第一个**包含选择部分的`Text`节点
    
    - 上述图形表示中”applic“ 文本所在的一整段字段表示的`Text` 节点就是源节点
    
    否则，如果它是一个正在被拖动的元素，那么源节点就是正在被拖动的元素
    
    - 上述图形表示中每个可被拖拽的`li` 元素就是源节点
    
    否则，源节点是另一个文档或应用程序的一部分。在这种情况下，当该规范要求在源节点上分派事件时，用户代理必须遵循与该情况相关的**特定于平台的约定（platform-specific conventions）**
    
    - 上述图形表示中的正方形反馈UI表示的就是从其它地方拖进来的文件
    
    <aside>
    ℹ️ 注意，在拖放操作过程中，源节点上会触发多个事件
    
    </aside>
    
4. 确定**被拖动节点的列表（list of dragged nodes）**，如下所示：
    
    如果它是一个正在被拖动的选择对象（**selection**），那么**被拖动的节点列表**将以树的顺序包含选择中部分或全部包含的每个节点(包括它们的所有祖先)
    
    - 一个简单的例子，如下
        
        下面是浏览器上渲染过的一段文本，假设黄色背景部分是选择对象（selection）
        
        ```
        If it is a selection that is being dragged, then the list of dragged nodes contains, in tree order, every node that is partially or completely included in the selection (including all their ancestors).
        ```
        
        上述渲染文本的原始HTML代码如下
        
        ```html
        <p>
        If it is a selection that is being dragged, then the 
        <a href="#list-of-dragged-nodes" id="list-of-dragged-nodes">list of dragged nodes</a>
            contains, in 
        <a id="tree-order" href="https://dom.spec.whatwg.org/#concept-tree-order">tree order</a>
        , every node that is partially or completely included in the selection (including all their ancestors).
        </p>
        ```
        
        - 所以被拖动节点的列表就包括
            
            ”then the“所在的文本节点
            
            ”list of dragged nodes”所在的文件节点和它的父亲`a` 元素
            
            ”  contains,” 所在的文件节点
            
            包含上述所有文本节点的`p`元素
            
    
    否则，**拖动节点的列表**只包含源节点(如果有的话)
    
5. 如果它是一个正在被拖动的选择对象（selection），那么将一个**数据项**添加到**拖动数据仓库项列表**中，其属性设置如下：
    
    **拖动数据项类型字符串（The drag data item type string）**
    
    “text/plain”
    
    **拖动数据项类型（The drag item kind）**
    
    **Text**
    
    **实际数据（The actual data）**
    
    选择对象表示的文本字符串
    
    否则，如果有任何**文件**正在被拖动，则为**每个**文件添加一个数据项到**拖动数据仓库项列表**，其属性设置如下:
    
    **拖动数据项类型字符串（The drag data item type string）**
    
    如果已知，就是文件的MIME类型，否则为“application/octet-stream”。
    
    **拖动数据项类型（The drag item kind）**
    
    File
    
    **实际数据（The actual data）**
    
    文件的内容和名称
    
    <aside>
    ℹ️ 注意：拖动文件目前只能从导航的外部进行，例如从文件系统管理器应用程序（*file system manager application*）中选取文件拖拽
    
    </aside>
    
    如果拖动是在应用程序外部发起的，用户代理必须为被拖动的数据适当地向**拖动数据仓库项列表**中添加项，并在适当的地方遵守平台约定；然而，如果平台约定不使用MIME类型（[MIME types](https://mimesniff.spec.whatwg.org/#mime-type)）来标记拖拽数据，用户代理必须尽最大努力将类型**映射（map）**到MIME类型，并且，在任何情况下，所有**拖动数据项类型字符串（The drag data item type string）**必须**转换为ASCII小写（**[converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase)**）**
    
    用户代理还可以添加一个或多个以其他形式（例如HTML）表示**选择对象**或**被拖动元素**的数据项
    
6. 如果[被拖动的节点列表](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)不为空，则从这些节点中提取微数据到JSON表单中（[extract the microdata from those nodes into a JSON form](https://html.spec.whatwg.org/multipage/microdata.html#extracting-json)），并将一个数据项添加到**拖动数据仓库项列表**中，其属性设置如下：
    
    **拖动数据项类型字符串（The drag data item type string）**
    
    [application/microdata+json](https://html.spec.whatwg.org/multipage/iana.html#application/microdata+json)
    
    **拖动数据项类型（The drag item kind）**
    
    **Text**
    
    **实际数据（The actual data）**
    
    生成的JSON字符串
    
    - 例子，经过上面的解释，目前可以知道的是：
        - 如果被拖动的是被选择对象，那么**拖动数据仓库项列表**就会包含两种数据项，一种是类型（type）为`text/plain` 的纯文本，一种是类型为（type）为`text/html` 的**原始（**谷歌浏览器包括标签属性，样式等**）**html代码
        - 如果被拖动的是一个元素（**非`a`和`img`元素**），试验谷歌和火狐都不会有数据项添加到`items` 中
        - 如果拖动的是外部的文件，则添加的数据项就是该文件
            
            ```jsx
            const p = document.querySelector("p");
            const log = document.querySelector(".log");
            const div = document.querySelector("div");
            console.log(div);
            const dragStartFunc = (e) => {
              const items = e.dataTransfer.items;
              const types = e.dataTransfer.types;
              for (let i = 0; i < types.length; i++) {
                const li = document.createElement("li");
                let data = e.dataTransfer.getData(items[i].type);
                console.log(data === undefined,typeof data);
                items[i].getAsFile((v) => (data = v));
                console.log(data === undefined,typeof data);
                li.textContent = `items${i}  
                kind: ${items[i].kind},  \n
                type: ${items[i].type},  \n
                data: ${data}
                `;
                log.appendChild(li);
              }
            };
            
            p.addEventListener("dragstart", dragStartFunc);
            div.addEventListener("dragstart", dragStartFunc);
            document.addEventListener("dragenter", dragStartFunc);
            ```
            
            ![drag-selection.gif](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/drag-selection.gif)
            
            - 火狐浏览器拖动选择对象时，其`text/html` 类型的数据项数据不会这么详细
7. 对拖动元素是带有`href` 的`a` 元素和带有`src` 的`img` 元素的特殊处理
    1. 让*`urls`*是一个保存**绝对路径（）**的空列表
    2. 对于**被拖动节点的列表（list of dragged nodes）**中的每个节点：
        
        **如果节点是带有`href`属性的`a`元素**
        
        解析相对于元素所在的节点文档的`href` 属性值，将解析结果添加到`*urls*`中
        
        **如果节点是具有`src`属性的`img`元素**
        
        解析相对于元素所在的节点文档的`src` 属性值，将解析结果添加到`*urls*`中
        
    3. 如果`*urls*`仍然为空，则返回
    4. 声明`*url*`字符串，它是按添加顺序将*`urls`*中每个字符串**串联**的结果，字符串之间由U+000D CARRIAGE RETURN U+000A LINE FEED字符对（CRLF）分隔
    5. 在**拖动数据仓库项列表**添加一个数据项，其属性设置如下：
        
        **拖动数据项类型字符串（The drag data item type string）**
        
        text/uri-list
        
        **拖动数据项类型（The drag item kind）**
        
        **Text**
        
        **实际数据（The actual data）**
        
        `url` 字符串
        
    
    ---
    
    - 拖动`a`元素和图像的例子
        
        ```jsx
        <img
              src="https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-82.svg"
              alt="iconfont"
        />
        <img src="./iconfont-logo.svg" alt="iconfont-当前" />
        <ul class="log"></ul>
        
        const div = document.querySelector("div");
        const img = document.querySelectorAll("img");
        
        p.addEventListener("dragstart", dragStartFunc);
        img.forEach((v) => v.addEventListener("dragstart", dragStartFunc));
        ```
        
        ![dragg items.gif](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/dragg_items.gif)
        
        - 每次拖动事件的**拖动数据仓库项列表**包含三种
            - 第一种是类型（type）为`text/uri-list` ，类型（kind）为`string` ，数据（`data`）就是上述的`url` 字符串
            - 对于图像（`img`）而言，第二种是类型（type）为`image/svg+xml` ，类型（kind）为`file` ，数据就是图像文件
                
                对于链接（`a`）而言，第二章是类型（type）为`string` ，类型（kind）为`text/plain` ，数据是`href` 属性解析后的绝对值
                
            - 第三种是类型（type）为`text/html` ，类型（kind）为`string` ，数据（`data`）就是**包含**绝对路径的HTML**源代码**
8. 根据用户代理的情况更新**拖动数据仓库默认反馈**（如果用户正在拖动选择对象**selection**，则该选择对象可能是该反馈的基础；如果用户正在拖动一个元素，那么将使用该元素的渲染；如果拖动开始于用户代理之外，则应使用用于确定拖动反馈的**平台约定platform conventions**）
9. 在源节点上激发名为`dragstart`的**DND事件**（fire a DND 事件）
    
    如果事件被取消（`preventDefault()`），则不应进行拖放操作；直接返回
    
    <aside>
    💡 由于按照定义，没有注册事件侦听器的事件几乎永远不会被取消，所以如果开发者没有特别阻止，拖放对用户来说总是可用的
    
    </aside>
    
10. 在源节点上激发名为`pointercancel` 的指针事件，并根据**指针事件 （*[Pointer Events](https://www.w3.org/TR/pointerevents3/)*）**的要求激发任何其他后续事件
11. 以符合平台约定的方式**启动拖放操作（**[Initiate the drag-and-drop operation](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）**，如下所述
    
    **拖放反馈（drag-and-drop feedback）**必须从以下第一个可用来源生成：
    
    1. **拖动数据仓库位图（**[drag data store bitmap](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）**（如果有）；在这种情况下，光标的放置位置应该使用相对于图像的**拖动数据仓库热点坐标（**[drag data store hot spot coordinate](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**）；**这些值分别表示为距离图像左侧和顶部的CSS像素距离
    2. 拖动数据仓库的默认反馈

从用户代理**启动拖放操作**（**initiate the drag-and-drop operation**）的那一刻起，直到拖放操作结束，必须**抑制（suppressed）**设备输入事件（例如鼠标和键盘事件）

在拖动操作期间，直接被用户指示为**放置目标（drop target）**的元素称为**立即用户选择（immediate user selection）；（**只有**元素**可以被立即用户选择作为**放置目标**；其他节点不能作为放置目标**）**；然而，**立即用户选择（immediate user selection）**不一定是**当前目标元素**，也就是当前为拖放操作而被选择成为**放置部分（drop part）**的元素

当用户选择不同的元素时，即**立即用户选择（immediate user selection）**发生变化（通过使用指针设备指向它们，或通过其他方式选择它们）；当**立即用户选择（immediate user selection）**发生变化时，基于文档中事件侦听器的结果，**当前目标元素**会发生变化，如下所述

**当前目标元素**和**立即用户选择（immediate user selection）**都可以为空，这意味着没有选择目标元素；它们也可以是其他（基于DOM的）文档或其他（非web）程序中的元素；（例如，用户可以将文本拖到文字处理器）；**当前目标元素**初始化为空

此外，还有一个**当前拖动操作（current drag operation）**，它的可选值有“none”、“copy”、“link”和“move”；最初，它的值为“none”，它由用户代理按照以下步骤进行更新

用户代理必须在**拖动操作启动（[initiated](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**后，以及只要拖动操作持续期间，每隔350ms（±200ms），都会**对下列任务排队**（[queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task)），以便按顺序执行以下步骤：

1. 如果在下一次迭代到期时，用户代理仍在执行序列的上一次迭代（如果有的话），则返回此迭代（实际上这种行为是“**跳过拖放操作的丢失帧**”，"**skipping missed frames**”）
2. 在**源节点（[source node](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**上激发名为`drag`的DND事件（拖放事件）；如果取消此事件，则用户代理必须将**当前拖动操作（[current drag operation](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**设置为“none”（无拖动操作）
3. 如果未取消`drag`事件，并且用户尚未结束拖放操作，请检查拖放操作的状态，如下所示：
    1. 如果用户指示的**立即用户选择（immediate user selection）**与上次迭代期间不同（或者如果这是第一次迭代），并且如果**立即用户选择（immediate user selection）**和**当前目标元素**不同，则按如下方式更新当前目标元素：
        
        如果新的**立即用户选择（immediate user selection）**为空
        
        则将**当前目标元素**也设置为空
        
        如果新的**立即用户选择（immediate user selection）**位于非DOM文档或应用程序中
        
        将**当前目标元素**设置为**立即用户选择（immediate user selection）**
        
        否则
        
        在**立即用户选择（immediate user selection）**上激发名为`dragenter`的DND事件
        
        如果事件被取消，则将**当前目标元素**设置为**立即用户选择（immediate user selection）**
        
        否则，从以下列表中选择运行相应的步骤：
        
        如果**立即用户选择（immediate user selection）**是文本控件（例如，`textarea`，或`type`属性为“Text”状态的`input`元素），**编辑载体（`contenteditable` 属性为`true`的元素）**或**可编辑元素（[editable](https://w3c.github.io/editing/docs/execCommand/#editable) element）**，并且**拖动数据仓库项列表**中有一个具有拖动数据项类型字符串为“text/plain”，拖动数据项种类为“text”的项
        
        无论如何，将**当前目标元素**设置为**立即用户选择（immediate user selection）**
        
        如果**立即用户选择（immediate user selection）**是body元素
        
        保持**当前目标元素**不变
        
        否则
        
        在body元素（如果有）或Document对象处激发名为`dragenter`的DND事件；然后，将**当前目标元素**设置为body元素，而不管该事件是否被取消
        
    2. 如果前一步导致**当前目标元素**发生更改，并且前一个目标元素不是`null`或非DOM文档的一部分，则在前一目标元素处触发名为`dragleave`的DND事件，并将新的**当前目标元素**作为特定的相关目标（related target）
    3. 如果**当前目标元素**是DOM元素，那么在该当前目标元素上触发一个名为`dragover`的DND事件
        
        如果未取消`dragover`事件，请从以下列表中选择运行相应的步骤：
        
        如果**当前目标元素**是文本控件（例如，`textarea`，或`type`属性为“Text”状态的`input`元素），**编辑载体（`contenteditable` 属性为`true`的元素）**或**可编辑元素（[editable](https://w3c.github.io/editing/docs/execCommand/#editable) element）**，并且**拖动数据仓库项列表**中有一个具有拖动数据项类型字符串为“text/plain”，拖动数据项种类为“text”的项
        
        根据**平台约定（platform conventions）**，将**当前拖动操作（[current drag operation](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**设置为“copy”或“move”
        
        否则
        
        将**当前拖动操作（[current drag operation](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**重置为“none”
        
        否则（如果取消了`dragover`事件），根据事件派发（dispatch）完成后`DragEvent`对象的`dataTransfer`对象的`effectAllowed`和`dropEffect`属性的值设置**当前拖动操作**，如下表所示：
        
        | https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed | https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect | Drag operation |
        | --- | --- | --- |
        | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copy", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copylink", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copymove", or "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy" | "https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-copy" |
        | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-link", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copylink", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-linkmove", or "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link" | "https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-link" |
        | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-move", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copymove", "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-linkmove", or "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all" | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move" | "https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-move" |
        | Any other case | Any other case | “none” |
    4. 否则，如果**当前目标元素**不是DOM元素，请使用特定于平台的机制来确定正在执行的拖动操作（none, copy, link, 或move），并相应地设置**当前拖动操作**
    5. 更新**拖动反馈**（例如鼠标光标）以匹配当前拖动操作，如下所示：
        
        
        | Drag operation | Feedback |
        | --- | --- |
        | "https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-copy" | 如果将数据放到此处，将复制数据 |
        | "https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-link" | 如果将数据放到此处，将链接数据 |
        | "https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-move" | 如果将数据放在此处，将移动数据 |
        | "https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none" | 不允许任何操作，在此处拖放将取消拖放操作 |
4. 否则，如果用户结束了拖放操作（例如，通过在鼠标驱动的拖放界面中释放鼠标按钮），或者如果拖动事件被取消（preventDefault()），则这将是最后一次迭代。运行以下步骤，然后停止拖放操作：
    1. 如果**当前拖动操作（[current drag operation](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**为“none”（无拖动操作），或者如果用户通过取消操作（例如，通过按 *Esccape* 键）结束了拖放操作，或者如果**当前目标元素**为空，则拖动操作失败。运行以下子步骤：
        1. 让`*dropped`* 为`false`
        2. 如果**当前目标元素**是一个DOM元素，则向其触发一个名为`dragleave`的DND事件；否则，如果它不为空，请使用特定于平台的约定取消拖动
        3. 将**当前拖动操作**设置为“none”。
        
        否则，拖动操作可能会成功;运行这些子步骤：
        
        1. 让`*dropped`* 为`true`
        2. 如果当前目标元素是DOM元素，则在其上触发一个名为`drop`的DND事件；否则，使用特定于平台的约定来指示一次放置（**drop**）
        3. 如果事件被取消，则将**当前拖动操作**设置为`DragEvent`对象的`dataTransfer`对象的`dropEffect`属性的值，因为它在事件分派完成后仍然存在
            
            否则，事件不取消；执行事件的默认动作，这取决于具体的目标，如下所示：
            
            如果**当前目标元素**是文本控件（例如，`textarea`，或`type`属性为“Text”状态的`input`元素），**编辑载体（`contenteditable` 属性为`true`的元素）**或**可编辑元素（[editable](https://w3c.github.io/editing/docs/execCommand/#editable) element）**，并且**拖动数据仓库项列表**中有一个具有拖动数据项类型字符串为“text/plain”，拖动数据项种类为“text”的项
            
            在**拖动数据仓库项列表**中**获取**第一个实际数据项，它具有“text/plain”的**拖动数据项类型字符串（type string）**和”*text*“的**拖动数据项类型（kind），**然后将其**插入**到**文本控件**，**辑载体（`contenteditable` 属性为`true`的元素）**或**可编辑元素（[editable](https://w3c.github.io/editing/docs/execCommand/#editable) element）**中，插入方式与特定于平台的约定一致（例如，将其插入当前鼠标光标位置，或插入字段的末尾）
            
            否则
            
            将**当前拖动操作**重置为“none”
            
    2. 在源节点上触发名为`dragend`的DND事件
    3. 从以下列表中选择适当的步骤运行，作为`dragend`事件的默认操作：
        
        如果`*dropped*`为`true`，则**当前目标元素**是一个文本控件(见下文)，**当前拖放操作**是“move”，拖放操作的源是DOM中的一个选择对象（selection），该选择对象完全包含在**编辑载体**中
        
        删除选区（[Delete the selection](https://w3c.github.io/editing/docs/execCommand/#delete-the-selection)，也就是不再选择指定文本）
        
        如果`*dropped*`为`true`，则**当前目标元素**是一个文本控件(见下文)，**当前拖放操作**是“move”，拖放操作的源是文本控件中的一个选择对象
        
        用户代理应该从相关文本控件中删除**拖拽的选择**（dragged selection）
        
        如果`*dropped*`为`false`，或者当前拖动操作为“none”
        
        拖拽被取消了。如果平台约定要求将其表示给用户(例如，通过动画拖动选择返回到拖放操作的源)，那么就这样做
        
        否则
        
        事件没有默认动作
        
        在此步骤中，文本控件是一个`textarea`元素或一个`input`元素，其`type`属性处于[Text](https://html.spec.whatwg.org/multipage/input.html#text-(type=text)-state-and-search-state-(type=search)), [Search](https://html.spec.whatwg.org/multipage/input.html#text-(type=text)-state-and-search-state-(type=search)), [Tel](https://html.spec.whatwg.org/multipage/input.html#telephone-state-(type=tel)), [URL](https://html.spec.whatwg.org/multipage/input.html#url-state-(type=url)), [Email](https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)), [Password](https://html.spec.whatwg.org/multipage/input.html#password-state-(type=password)), or [Number](https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number))状态之一
        

<aside>
💡 注意：鼓励用户代理考虑如何对可滚动区域边缘附近的拖动做出反应。例如，如果用户将一个链接拖到一个长页面的视口底部，那么滚动页面可能有意义，这样用户就可以将链接放在页面的下方

</aside>

<aside>
💡 注意：该模型与所涉及的节点来自哪个`Document`对象无关；事件按上面描述的方式触发，处理模型的其余部分按上面描述的方式运行，而不管操作中涉及多少文档

</aside>

# 6. 拖放事件类型总结

拖放模型中涉及到以下事件

| 事件名称（Event name） | 事件目标（Target） | Cancelable? | 拖动事件模式（https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode） | https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect | 默认行为（Default Action） |
| --- | --- | --- | --- | --- | --- |
| dragstart✔MDN | 源节点（https://html.spec.whatwg.org/multipage/dnd.html#source-node） | ✓ 可取消（Cancelable） | https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none" | 启动拖放操作（Initiate the drag-and-drop operation） |
| drag✔MDN | 源节点（https://html.spec.whatwg.org/multipage/dnd.html#source-node） | ✓ 可取消（Cancelable） | https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none" | 继续拖放操作(Continue the drag-and-drop operation) |
| dragenter✔MDN | 立即用户选择（https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection ）或body元素（ https://html.spec.whatwg.org/multipage/dom.html#the-body-element-2） | ✓ 可取消（Cancelable） | https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p | 基于effectAllowed属性（https://html.spec.whatwg.org/multipage/dnd.html#dropEffect-initialisationhttps://html.spec.whatwg.org/multipage/dnd.html#dropEffect-initialisationhttps://html.spec.whatwg.org/multipage/dnd.html#dropEffect-initialisation） | 拒绝立即用户选择作为潜在的目标元素（Reject https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection as potential https://html.spec.whatwg.org/multipage/dnd.html#current-target-element） |
| dragleave✔MDN | 上一个目标元素（https://html.spec.whatwg.org/multipage/dnd.html#current-target-element） | — | https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p | "https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none" | 无 |
| dragover✔MDN | 当前目标元素（https://html.spec.whatwg.org/multipage/dnd.html#current-target-element） | ✓ 可取消（Cancelable） | https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p | 基于effectAllowed属性（https://html.spec.whatwg.org/multipage/dnd.html#dropEffect-initialisationhttps://html.spec.whatwg.org/multipage/dnd.html#dropEffect-initialisationhttps://html.spec.whatwg.org/multipage/dnd.html#dropEffect-initialisation） | 将当前拖动操作重置为“none”（Reset the https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation to "none"） |
| drop✔MDN | 当前目标元素（https://html.spec.whatwg.org/multipage/dnd.html#current-target-element） | ✓ 可取消（Cancelable） | https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-ro | 当前拖动操作（https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation） | 多样的（Varies） |
| dragend✔MDN | 源节点（https://html.spec.whatwg.org/multipage/dnd.html#source-node） | — | https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p | 当前拖动操作（https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation） | 多样的（Varies） |

所有这些事件都被组合在一起，并且`effectAllowed`属性总是在`dragstart`事件之后的才有值，在`dragstart`事件中默认为“uninitialized”

# 7. draggable属性

- 所有HTML元素都可以具有**`draggable`**的内容属性集；**`draggable`**属性是一个枚举属性（[enumerated attribute](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#enumerated-attribute)），它有三种状态
    - 第一个状态是`true`，它的关键字是`true`
    - 第二个状态是`false`，它有关键字`false`
    - 第三种状态是`auto`；它没有关键字，但它是*[missing value default](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#missing-value-default)* 和 *[invalid value default](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#invalid-value-default)*
- `true`状态意味着元素是可拖拽的；`false`状态意味着元素不可拖拽；`auto`状态使用用户代理的默认行为
- 具有**`draggable`**属性的元素还应该具有`title`属性，该属性用于为**非可视交互**（**non-visual interactions**）命名元素（考虑视力障碍者）
    - [ ]  **element.[draggable](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md) [ = value ]**
        
        如果元素是可拖动的，则返回`true`;否则，返回`false`
        可以设置，以覆盖默认值并设置可拖动内容的属性
        

可拖拽（`draggable`）的IDL属性的值取决于下面描述的内容属性，它控制元素是否可拖拽；通常，只有**文本选择**（**text selections**）是可拖拽的，但其`draggable` IDL属性为true的元素也是可拖拽的

如果元素的可拖拽（`draggable`）内容属性的状态为`true`，则可拖拽IDL属性必须返回true

否则，如果元素的`draggable`内容属性的状态为`false`，则`draggable`IDL属性必须返回`false`

否则，元素的可拖动内容属性的状态为`auto`

如果元素是一个`img`元素，或者一个表示图像的`object`元素，或者一个具有`href`内容属性的`a`元素，`draggable`IDL属性必须返回true

否则，`draggable`IDL属性必须返回false

如果`draggable`IDL属性设置为值`false`，则`draggable`内容属性必须设置为字面值“false”；如果`draggable`IDL属性设置为`true`，则`draggable`内容属性必须设置为字面值“true”

# 8. 拖放模型中的安全风险

- 在`dragstart`事件发生到`drop`事件期间，用户代理**不能**让脚本添加数据项到`DataTransfer`对象，否则，如果用户要将敏感信息从一个文档拖到第二个文档，并在此过程中跨越敌对的第三个文档，则敌对文档可能会拦截数据（intercept the data）
- 出于同样的原因，只有当用户明确地结束拖拽操作时，用户代理才必须认为**放置**（**drop**）成功——如果任何脚本结束拖拽操作，则必须认为它不成功(已取消)，并且不能触发`drop`事件
- 用户代理应该注意不要在响应脚本操作时启动拖放操作。例如，在**鼠标和窗口环境（mouse-and-window environment）**中，如果一个脚本在用户按下鼠标按钮时移动了一个窗口，UA（用户代理）不会认为这是开始拖拽。这一点很重要，因为UAs可能会容许数据从敏感来源被拖拽，并在未经用户同意的情况下下载具有敌意的文件
- 用户代理应该过滤潜在的活跃(脚本)内容(例如HTML)，当它被**拖拽和放置**（**dragged and dropped**）时，使用已知安全特性的安全列表；类似地，**相对url**应该转换为**绝对url**，以避免以意想不到的方式改变引用；此规范没有指定如何执行此操作

<aside>
💡 假设一个恶意页面提供了一些内容，并让用户选择并拖放(或者是复制和粘贴)该内容到受害页面的**可编辑区域（**`[contenteditable](https://html.spec.whatwg.org/multipage/interaction.html#attr-contenteditable)`
 region**）**。如果浏览器不能确保只拖拽安全的内容，则**选择对象**（selection）中的脚本和事件处理程序等潜在不安全的内容一旦拖放到(或粘贴)受害站点，就可以获得受害站点的特权；这将使**跨站点脚本攻击**（**cross-site scripting attack**）成为可能

</aside>

# 9. 拖放事件

- 为了更好的理解每个DND事件，这个章节对每个每个拖放事件继续介绍
- 整个拖放的流程图如下
    
    ![drag-processing-model.png](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/drag-processing-model.png)
    

## 9.1 dragstart

**触发时机**

- 当用户开始拖动**一个元素**或**文本选择**时，将触发`dragstart`事件
- 所谓的**启动拖放操作**（**[initiate the drag-and-drop operation](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)**），实际上就是指针设备单击触发`mousedown` 事件后，开始维持指针设备按键状态进行指针移动，详情查看`mousedown` 的默认行为：[](4%203%201%202%20%E5%9F%BA%E4%BA%8EUIEvent%E8%A7%84%E8%8C%83%E7%9A%8411%E7%A7%8D%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E8%AF%A6%E6%83%85.md)

**特性**

- Cancelable：可以被取消  ⇒ 取消默认行为意味着直接中止拖动
- Bubbles：可以冒泡 ⇒ 可以冒泡意味着可以在父元素添加`dragstart` 事件处理程序对被拖动后代元素进行统一处理
- dropEffect: “none”
- e.target ：源节点（被拖动的节点）

**场景**

- 因为`dragstart` 事件是拖放的开始事件，它的事件处理程序对拖放操作的**初始化**有很大作用，包括
    1. 只有`dragstart` 触发时的**拖动数据仓库模式（drag data store mode）是读/写模式**，所以如果拖动要携带数据，必须在`dragstart` 的事件处理程序中利用事件对象的`dataTransfer` 进行**数据项添加**
    2. 同理，`dataTransfer` 中的`effectAllowed` 属性决定着**拖动数据仓库允许的效果状态（drag data store allowed effects state）**，所以只能在`dragstart` 事件处理程序中对`dataTransfer` 的`effectAllowed` 属性值进行修改，指定允许的拖放操作
    3. 可选操作，`dataTransfer` 对象关联**拖动数据仓库默认反馈（drag data store default feedback）**，UI反馈是有默认行为的，如果要自定义UI反馈，可以调用`setDragImage(img, x, y)` 来设置**拖动数据仓库位图（drag data store bitmap）**和**拖动数据仓库热点坐标（drag data store hot spot coordinate）**
    4. 判断**源节点，**也就是被拖动的节点，可以通过`e.target` 获取是否是场景需要拖动的节点，如果不是，则取消事件（调用`preventDefault()`）中止拖放操作

## 9.2 drag

**触发时机**

- 当用户**正在**拖动一个元素或文本选择，`drag`事件每几百毫秒触发一次
    - 上述[用户代理必须在**拖动操作启动（[initiated](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md)）**后，以及只要拖动操作持续期间，每隔350ms（±200ms），都会**对下列任务排队**（[queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task)），以便按顺序执行以下步骤：](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89.md) 描述中的任务就包括对`drag` 事件的触发
- `drag` 事件在`dragstart` 和`dragend` 期间持续触发

**特性**

- Cancelable：可以被取消  ⇒ 取消`drag` 事件意味着将**当前事件操作**设置为”none”
- Bubbles：可以冒泡 ⇒ 可以冒泡意味着可以在父元素添加`drag`事件处理程序对被拖动后代元素进行统一处理
- dropEffect: “none”
- e.target：源节点（被拖动的节点）

**场景**

- `drag` 事件的持续触发的意义在于表明**当前正在进行拖放操作**，利用这一定义可以做到定义在拖动期间被拖动元素的**样式**

## 9.3 dragenter

**触发时机**

- 当被拖动的元素或文本选择进入**有效的放置目标（valid drop target）**时，将触发`dragenter`事件
- 有效的放置目标就是放置节点**必须**是一个**元素**，而所谓的**进入**和和`mouseover` 事件的**进入类似**
    - 仅关注**最顶层元素变化**的“进入”，只要最顶层元素变化就会触发`dragenter` 事件

**特性**

- Cancelable：可以被取消
- Bubbles：可以冒泡
- dropEffect：基于`effectAllowed`属性
- e.target：进入的**最顶层元素，**也就是**立即用户选择**
- e.relatedTarget：离开的元素（如果有）

**场景**

- `dragenter` 事件的事件目标就是可能的**放置目标**，所以
    1. 对可能的**放置目标**进行判断，通过**取消事件**来**报告**放置目标是否可能愿意接受放置
    2. 当`dragenter` 触发时，指针会在被放置目标上，这时可以修改**放置目标**的样式，向用户进行反馈

## 9.4 dragleave

**触发时机**

- 当被拖动的元素或文本选择离开**有效的放置目标（valid drop target）**时，将触发`dragleave`事件
- 有效的放置目标就是放置节点**必须**是一个**元素**，而所谓的**离开**和`mouseout` 事件的**离开类似**
    - 仅关注**最顶层元素变化**的“离开”，只要最顶层元素变化就会触发`dragleave` 事件

**特性**

- Cancelable：不能被取消，因为没有默认行为
- Bubbles：可以冒泡
- dropEffect: “none”
- e.target：离开的**元素**
- e.relatedTarget：进入的元素（如果有）

**场景**

- `dragleave` 事件和`dragenter` 是一组相反事件，但是它没有默认行为，所以
    1. 当`dragleave` 触发时，指针会离开前一个放置目标，这时可以修改（还原）前一个**放置目标**的样式，向用户进行反馈

## 9.5 dragover

**触发时机**

- 当一个元素或文本选择被拖放到一个**有效的放置目标**上移动时(每几百毫秒一次)触发`dragover`事件
- 有效的放置目标就是放置节点**必须**是一个**元素**，`dragover` 和`mouseover` **完全不同**，它是一个**独特**的拖动事件，默认行为是将当前拖动操作重置为“none”（Reset the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) to "none"）

**特性**

- Cancelable：能被取消⇒因为默认行为是将当前拖动操作重置为”none”所以想要放置目标能触发`drop` 事件，必须调用`e.preventDefault()`
- Bubbles：可以冒泡
- dropEffect: 基于`effectAllowed`属性
- e.target：最顶层元素（也就是**立即用户选择**）

**场景**

- 因为`dragover` 事件是**放置目标**持续触发的（drag是被拖动元素持续触发的），所以`dragover` 事件处理程序最清楚的就是**当前的放置目标**
    1. 默认执行`e.preventDefault()` 语句，允许放置目标成为事实的放置元素，否则放置目标不会触发`drop` 不能成为放置元素
    2. 对放置目标元素进行样式改变（很少用，通常在`dragenter` 事件处理程序中进行）

## 9.6 drop

**触发时机**

- 当将**元素**或**文本选择**放到**有效的放置目标**上后（也就是释放了指针按键），将触发`drop`事件
- 有效的放置目标就是放置节点**必须**是一个**元素**

**特性**

- Cancelable：能被取消⇒是最后一次中止拖放操作的机会，可以取消默认的放置行为
- Bubbles：可以冒泡
- dropEffect: 当前拖动操作（一般为”none”）
- e.target：**立即用户选择**

**场景**

- `drop` 事件对象**拖动事件仓库模式**是只读模式，且它的触发时机决定了用户对放置目标进行了选择
    1. 判断**放置目标**是否能够成为最终的**有效放置元素**，自定义判断时通常要调用`e.preventDefault()` 来取消默认的放置行为
    2. 决定**放置元素**后，需要对**被拖动源节点**和**立即用户选择**进行场景需要的DOM操作，比如更换位置，节点移动等
    3. 对`dragenter` 或`dragover` 对放置元素的样式修改进行**还原**

## 9.7 dragend

**触发时机**

- 当拖动操作结束时（通过释放鼠标按钮或按退出键），将触发`dragend`事件
- 与`drop` 不同的是，`dragend` 的触发目前是源节点，并且无论是否触发`drop` 事件，`dragend` 事件在拖放结束最后**一定**会触发

**特性**

- Cancelable：不能被
- Bubbles：可以冒泡
- dropEffect: 当前拖动操作（[Current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation)），一般就是`effectAllowed` 允许的操作
- e.target：源节点

**场景**

- `dragend` 事件对象触发时，拖放操作已经结束，它是这次拖放事件结束的标志（无论是否进行了放置操作）
    - 对`drag` 事件处理程序对原节点的样式修改进行还原

## 9.8 例子

```jsx
let draggedItem = null;
const initListener = (ele, index) => {
  const DNDDataType = "text";
  ele.addEventListener("dragstart", (e) => {
    if (e.target.draggable) {
      draggedItem = e.target;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(DNDDataType, index);
    }
  });
  ele.addEventListener("drag", (e) => {
    e.target.style.opacity = 0.8;
    e.target.style.boxShadow = "2px 2px 2px 1px rgba(0, 0, 0, 0.2)";
  });
  ele.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (e.currentTarget.className.indexOf("dropzone") !== -1) {
      e.currentTarget.parentNode.insertBefore(ele, e.currentTarget);
    }
  });
  ele.addEventListener("dragenter", (e) => {
    if (e.target.className.indexOf("dropzone") !== -1) {
      let node = null;
      let idx1 = 0; // 被拖拽元素
      let idx2 = 0; //
      for (let idx = 0; idx < e.target.parentNode.children.length; idx++) {
        if (e.target.parentNode.children[idx] === draggedItem) {
          idx1 = idx;
        } else if (e.target.parentNode.children[idx] === e.target) {
          idx2 = idx;
        }
      }
      if (idx1 > idx2) {
        node = e.target;
      } else {
        node = e.target.nextElementSibling;
      }
      e.target.parentNode.insertBefore(draggedItem, node);
      e.target.style.backgroundColor = "rgb(188, 255, 255)";
    }
  });
  ele.addEventListener("dragleave", (e) => {
    if (
      e.target.className.indexOf("dropzone") !== -1 &&
      e.relatedTarget.parentNode !== e.target
    ) {
      e.target.style.backgroundColor = "white";
    }
  });
  ele.addEventListener("drop", (e) => {
  });
  ele.addEventListener("dragend", (e) => {
    e.target.style.opacity = 1;
    e.target.style.backgroundColor = "white";
    e.target.style.boxShadow = "";
  });
};

const rows = initTable();
rows.forEach((v, i) => initListener(v, i));
```

![drag-drop-example.gif](The%20Drag%20Event%EF%BC%88%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%EF%BC%89/drag-drop-example.gif)

- 完整代码见[github](https://github.com/mangwu/javascript/tree/master/ProfessionalJavaScriptForWebDeveloper4/ch17%20-%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89/17.4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89/17.4.3%20%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%EF%BC%88Mouse%20Events%EF%BC%89/17.4.3.3%20The%20Drag%20Event/17.4.3.3.9%20example)