# 3. MutationObserver接口

MutationObserver接口实现了可以在DOM被修改时**异步执行回调**

使用MutationObserver可以**观察**整个文档、DOM树的一部分、或某个元素，此外还可以观察元素属性、子节点、文本或者前三者的**任意组合变化**

**Mutation**在英语中意为突变，在前端领域，它常被指为 **DOM 元素所经历的变化**或 渲染DOM元素的 **状态的变化**

<aside>
💡 注意：MutaionObserver接口的引入是为了取代废弃的MutationEvent

</aside>

# 3.0 MutationObserver接口规范

- DOM Standard规范定义了 [MutationObserver](https://dom.spec.whatwg.org/#interface-mutationobserver) 接口，如下
    
    ```jsx
    [Exposed=Window]
    interface MutationObserver {
      constructor(MutationCallback callback);
    
      undefined observe(Node target, optional MutationObserverInit options = {});
      undefined disconnect();
      sequence<MutationRecord> takeRecords();
    };
    
    callback MutationCallback = undefined (sequence<MutationRecord> mutations, MutationObserver observer);
    
    dictionary MutationObserverInit {
      boolean childList = false;
      boolean attributes;
      boolean characterData;
      boolean subtree = false;
      boolean attributeOldValue;
      boolean characterDataOldValue;
      sequence<DOMString> attributeFilter;
    };
    ```
    
- 一个`MutationObserver`对象可以用来观察DOM树上所有节点的**变化**（**mutation**）
- 每个`MutationObserver` 对象都有以下相关概念
    - 创建时设置的**回调函数（callback）**
    - 一个**节点列表**(**node list**，节点的列表)，初始为空。
    - 一个**记录队列**(由零个或多个`MutationRecord`对象组成的队列)，最初是空的。
- 对网页开发者而言，非规范化的用法解释如下
    - [ ]  `observer = new MutationObserver(callback)`
        
        构造一个`MutationObjserver`对象并设置其回调函数为`callback` ；调用回调时，`MutationRecord` 对象列表作为第一个（回调函数的）参数，构造的`MutationObserver` 对象作为第二个参数；在`observer()` 方法**注册的节点**发生**变化**（**mutation**）后调用它（回调函数）
        
    - [ ]  `observer.observer(target, options)`
        
        注册节点，其具体职能为 指定用户代理需要**观察**(**observe**)的目标（**target，**节点），并根据选项（**options，**一个对象）给出报告任何**变化**（**mutation**）的标准。
        
        `options`参数允许通过对象成员（即属性）设置**变化观察选项**（**mutation observation options**），以下是可以使用的对象成员
        
        - **`childList` ，**布尔值，表示是否需求用户代理观察目标的**子节点**（**children**）变化，为`true` 时表示目标的子节点变化也会被观察
        - **`attributes`** ，布尔值，表示是否需求用户代理观察目标的属性（**attributes**）变化，为`true` 时表示目标的属性变化也会被观察，如果后面的`attributeOldValue` 或`attributeFilter` 被赋值了，`attributes` 选项会被忽略
        - `**characterData`** ，布尔值， ****表示是否需求用户代理观察目标节点的数据（**data**，指继承于`CharacterData` 接口的部分类型节点，包括文本节点，ProcessingInstruction节点和注释节点）变化，为`true` 时表示目标的数据变化也会被观察，如果后面的`characterDataOldValue` 被赋值了，`characterData` 选项会被忽略
        - **`subtree`** ，布尔值，表示是否需求用户代理不仅要观察目标的变化，还要观察目标的**后代**（**descendants**）的变化，为`true` 时表示二者都进行观察
        - `attributeOldValue` ，布尔值，如果`attributes` 选项为`true` 或被忽略则为`true` ，（设置为`true` )需要记录**变化**(**mutation**)前的目标属性值
        - `characterDataOldValue` ，布尔值，如果被指定，`attributes` 选项被忽略 ，（设置为`true`）需要记录目标在**变化**(**mutation**)前的目标数据值
        - `attributeFilter` ，列表（数组）类型，在不是所有目标的属性变化都需要被观察时使用，它被赋值为需被观察的**属性名称**（**local name，不带有namespace命名空间**）字符串数组，如果被指定，`attributes` 选项被忽略
    - [ ]  `observer.disconnect()`
        
        停止**观察者**(**observer**)观察任何变化。在再次使用`observe()`方法之前，`observer`对象的回调函数不会被调用。
        
    - [ ]  `observer.takeRecords()`
        
        清空记录队列并返回其中的内容。
        

# 3.1 基本用法

- `MutationObserver` 的实例要通过调用`MutationObserver` 构造函数并传入一个回调函数来创建
    
    ```jsx
    let observer = new MutationObserver(() => console.log("DOM was mutated!"))
    ```
    

## 3.1.1 observe()方法

- 新创建的`MutationObserver` 实例不会关联DOM的任何部分，要把这个`observer`与DOM关联起来需要使用`observe()`
- 这个方法接收两个必须的参数
    - 要观察其变化的DOM节点
    - 以及一个`MutationObserverInit`对象（就是上面接口规范说的要设置的观察报告标准）
- `MutationObserverInit` 对象用于控制观察哪些方面的变化，是一个键/值对形式配置选项的字典，如下
    
    ```jsx
    let observer = new MutationObserver(() =>
      console.log("<body> attributes changed")
    );
    
    **observer.observe(document.body, {
      attributes: true,
    });**
    
    document.body.className = "foo";
    
    console.log("Changed body class")
    
    // 打印结果
    // Changed body class
    // <body> attributes changed
    ```
    
    - 执行以上代码后，<body>元素上任何属性发生变化都会被这个`MutationObserver` 实例发现，然后就会**异步执行**注册的回调函数
    - <body>元素后代的修改或其它**非属性**修改都不会除法回调进入任务队列（因为`MutationObserverInit` 对象设置仅观察目标节点的属性）

## 3.1.2 回调与MutationRecord

- DOM Standard规范的 `[MutationRecord`](https://dom.spec.whatwg.org/#mutationrecord) 接口定义如下

```jsx
[Exposed=Window]
interface MutationRecord {
  readonly attributeDOMStringtype;
  [SameObject] readonly attributeNodetarget;
  [SameObject] readonly attributeNodeListaddedNodes;
  [SameObject] readonly attributeNodeListremovedNodes;
  readonly attributeNode?previousSibling;
  readonly attributeNode?nextSibling;
  readonly attributeDOMString?attributeName;
  readonly attributeDOMString?attributeNamespace;
  readonly attributeDOMString?oldValue;
};
```

- 这个接口实际上是对一次变化（**Mutation**）的记录，一个`MuationRecord` 实例包含的信息包括发生了什么变化，以及DOM的哪一些部分收到了影响
- `MutationObserver` 实例的每个回调都会收到一个`MutationRecord` 实例构成的数组作为参数，因为回调执行之前可能同时发生多个满足观察条件的事件，所以每次调用执行回调都会传入一个包含按顺序入队的`MutationRecord`实例的数组
- 回调函数的第二个参数就是`MuatrionObserver` 构造函数本身，下面展示反映了属性变化的`MutationRecord`实例的数组
    
    ```jsx
    let observer = new MutationObserver((mutationRecords, observer) => {
      console.log(mutationRecords);
      console.log(observer === observer);
    });
    
    observer.observe(document.body, { attributes: true });
    document.body.setAttribute("foo", "bar");
    document.body.className = "baz";
    ```
    
    ![MutationRecord.png](3%20MutationObserver%E6%8E%A5%E5%8F%A3/MutationRecord.png)
    
    - 这里进行了两次属性的设置，一次是自定义属性，一次是类名称设置，按顺序`MutationRecord` 保存到了一个数组中，并提供了这两次属性变化的记录
    - 因为`MutationObserverInit` 对象只要求记录`attributes` ，所以`MutationRecord` 也就只记录了`attributeName` （变化的属性名称）、`target` （变化的目标节点）、和`type` （目标节点变化的类型）
- 在之前的介绍中，设置属性除了`setAttribute` 外，还有对命名空间中属性的设置，`setAttributeNs()` ,虽然这个方法在XML文档中更有用处，但是在HTML使用仍然是会被`MutationObserver`对象所观察，如下
    
    ```js
    let observer = new MutationObserver((mutationRecords, observer) => {
      console.log(mutationRecords);
    });
    
    observer.observe(document.body, { attributes: true });
    
    document.body.setAttributeNS("localhost:8000", "foo", "bar");
    ```
    
    ![attributeNSMutationRecord.png](3%20MutationObserver%E6%8E%A5%E5%8F%A3/attributeNSMutationRecord.png)
    
    - `setAttributeNS()` 设置属性触发的回调函数记录的`mutationRecords` 中的记录实例与`setAttribute()` 的唯一区别在于多记录了一个`attributeNamespace` 属性
- 下表列出了`MutationRecord` 实例的属性和描述
    
    
    | 属性 | 说明 |
    | --- | --- |
    | target | 被修改影响的目标节点 |
    | type | 字符串，表示变化的类型：“attribute”、”characterData”或”childList” |
    | oldValue | 如果在MutationObserverInit 对象中启用(attributeOldValue或characterDataOldValue)，“attributes”或”characterData”的变化事件会设置这个属性为被替代的值；”childList”类型的变化始终将这个属性设置为null |
    | attributeName | 对于”attributes”类型的变化，这里保存被修改属性的名字 |
    | attributeNamespace | 对于使用了命名空间的”attributes”类型的变化，这里保存被修改属性的命名空间名字，其它变化事件会将这个属性值设置为null |
    | addedNodes | 对于”childList”类型的变化，返回包含变化中添加节点的NodeList默；认为空NodeList |
    | removedNodes | 对于”childList“类型的变化，返回包含变化中删除节点的NodeList；默认为空NodeList |
    | previousSibling | 对于”childList“类型的变化，返回变化节点的前一个同胞Node；默认为null |
    | nextSibling | 对于”childList”类型的变化，返回变化节点的后一个同胞Node；默认为null |
- 对于`childList`类型的变化，有如下例子
    
    ```jsx
    const div = document.querySelector("div");
    
    const observer = new MutationObserver((MutationRecords) => {
      console.log(MutationRecords);
    });
    observer.observe(div, { childList: true });
    **div.appendChild(document.createTextNode("你好")); // ①**
    **div.textContent = "hello"; // ②**
    **div.childNodes[0].textContent = "hello2"; // ③**
    **div.removeChild(div.firstChild); // ④**
    const p = document.createElement("p");
    p.textContent = "Hello";
    **div.appendChild(p); // ⑤**
    const span = document.createElement("span");
    span.textContent = "你好";
    **p.appendChild(span); // ⑥**
    ```
    
    ![childList.png](3%20MutationObserver%E6%8E%A5%E5%8F%A3/childList.png)
    
    - `childList` 类型的变化只针对目标节点的**直接子节点**的变化，说简单点就是目标节点的`childNodes` 中的节点变化
    - 直接在目标节点上新增一个文本节点，也就是操作①，目标节点（div）的`childNodes` 发生改变，新增了一个文本节点，所以第一个`MutationRecord` 实例的`addedNodes`就是这个文本节点；`childNodes` 为包含一个空格字符串文本节点的`NodeLists` ，变化后仍然存在，不存在移除的节点，所以`removedNodes` 为空`NodeLists` ；而`previousSibling` 就是当前新增的节点的前一个同胞节点（空字符串文本节点），没有`nextSibling` ，因为默认新增的文本节点在`childNodes` 的最后
    - 直接修改目标节点的`textContent` ，也就是操作②，目标节点（div）的`childNodes` 发生改变，整个`childNodes` 直接变成了一个文本节点，所以第二个`MutationRecord` 实例的`addedNodes` 就是新的文本节点，`removedNodes` 就是之前的两个文本节点，因为目标节点的子节点就只有当前的新文本节点，所以`previousSibling` 和`nextSibling` 都是`null`
    - 修改目标节点的子节点的`textContent` ，也就是操作③，不会触发`observer` 对象的回调函数，因为`observe()` 方法设置为`childList` ，即仅观察**目标节点的直接子节点**变化，修改目标节点的子节点的`textContent` 不会改变目标节点的直接子节点引用（即`childNodes` 属性的列表元素值没有变化）
    - 删除目标节点的子节点，也就是操作④，目标节点（div）的`childNodes` 发生改变，`childNodes` 中的文本节点被删除了，所以第三个`MutationRecord` 实例的`removedNodes` 就是被删除的节点，而`addedNodes` 为空`NodeList` ；因为删除节点不存在`addedNodes` 并且删除后`childNodes` 为空`NodeList`，所以`previousSibling` 和`nextSibling` 都是`null`
    - 直接在目标节点上新增一个元素节点，也就是操作⑤，无论是什么类型的节点，在目标节点上直接进行增删改节点都会触发`observer` 对象的回调函数，所以第四个`MutationRecord` 实例和第一个`MutationRecord` 实例类似，`addedNodes` 就是包含新增的元素节点（p）的`NodeList` 对象，`removedNodes` 就是空`NodeList` ，因为目标节点当前子节点为空`NodeList` ，所以`previousSibling` 和`nextSibling` 都是`null`
- 对于`subtree` 类型的变化，先要理解：
    - 它不能单独作为`MutationObserverInit` 对象的属性，因为它表明是否需求用户代理不仅要观察目标的变化，还要观察目标的**后代**（**descendants**）的变化，也就是说它作为对观察范围的一个**扩展**，而不是指定被观察的具体对象；如果单独使用`subtree` 则会浏览器会抛出如下错误
        
        ```jsx
        Uncaught TypeError: Failed to execute 'observe' on 'MutationObserver': The options object must set at least one of 'attributes', 'characterData', or 'childList' to true.
            at 14.3.1.2 MutationRecord.js:21:10
        ```
        
    - 如前面例子，增加一个`subtree` 属性，值为true，则会出现如下结果
        
        ![subtree.png](3%20MutationObserver%E6%8E%A5%E5%8F%A3/subtree.png)
        
        - 除了前4个`MutationRecord` 实例和前面的记录一样外，新增了一个`MutationRecord` 实例在最后
        - 因为增加了`subtree` 类型，所以`observer` 对象注册的目标的所有后代节点都会被观察，也就是操作⑥；`p` 元素节点是目标节点（div）的一个子节点，在p节点上新增子节点会被观察到，因为子节点变化的直接对象是元素节点`p` ，所以最后一个`MutationRecord` 实例的`target` 是节点`p` （而不是`div`），`addedNodes` 就是包含新增的`span` 节点的`NodeList`，没有删除，所以`removedNodes` 是一个空的`NodeList` ，同理新增的`span` 节点作为`childNodes` 的最后一个节点加入，`previousSibling` 就是前面的文本节点，`nextSibling` 就是`null`
- 对于`**characterData`** 类型的变化而言，先要理解
    - `characterData` 类型表示只对文本节点，ProcessingInstruction节点和注释节点进行观察，不会对元素节点进行观察，因为元素节点的接口定义为`Element` 而不是`CharacterData` 接口
    - `subtree` 对`characterData` 类型一般无效，因为HTML常见的**文本节点不会有子节点**
    - 例子如下
        
        ```jsx
        const div = document.querySelector("div");
        
        const observer = new MutationObserver((MutationRecords) =>
          console.log(MutationRecords)
        );
        
        observer.observe(div, { characterData: true, subtree: true });
        div.textContent = "Hello";
        div.appendChild(document.createTextNode("你好"));
        div.appendChild(document.createElement("p"));
        div.firstChild.data = "KKK";
        observer.disconnect();
        
        observer.observe(div.firstChild, { characterData: true });
        div.firstChild.textContent = "KKK"; // ①
        div.firstChild.data = "SSS"; // ②
        div.firstChild.nodeValue = "RRR"; // ③
        div.replaceChild(document.createTextNode("MMM"), div.firstChild); // ④
        div.firstChild.data = "SSS"; // ⑤
        ```
        
        ![CharacterData.png](3%20MutationObserver%E6%8E%A5%E5%8F%A3/CharacterData.png)
        
        - `observer` 对象本来注册的观察对象是`div`元素节点，但是对于`div` 及其子节点的修改并不能引起任何的变化(**Mutation**)，因为注册时的`MutationObserverInit` 对象的观察标准是`characterData` 类型，所以`subtree` 对其无效，而`div` 又是元素节点，所以不会有触发`observer` 的回调函数
        - 而后调用`disconnect()` 注销了对`div` 元素节点的观察，再注册`div` 节点的第一个文本节点为目标对象，之后就可以观察文本节点的内容
        - 操作①②③对应回调函数的参数中三个`MutationRecord` 实例的变化记录，它们的`type` 都是`characterData` 这是由注册时的`MutationObserverInit` 对象决定，因为观察的是文本内容，所以`addedNodes` 、`removedNodes` 自然是空`NodeList` ，`nextSibling` 、`previousSibling` 自然是`null` ，`target` 是目标对象，即`div` 的第一个文本节点；从中也可以发现，文本节点的`data`（`CharacterData` 接口定义）、`nodeValue`（`Node` 接口定义）、`textContent` （`Node` 接口定义）实际上指的都是文本字符串
        - 操作④没有触发回调函数，因为调用`replaceChild()` 替换文本节点不属于对被观察文本节点的内容改变，而是对`div` 元素节点的子节点改变，因为被观察的文本节点已不再DOM树中，操作⑤也就是不是对目标文本节点的改变，而是对替换的新文本节点的改变，所以也不会触发回调函数
- 对于 `attributeOldValue` 属性，需要了解
    - 设置`attributeOldValue` 为`true` ，那么就不用关心`attributes` 的值，它要么为`true` ，要么不进行设置（即被连带为`true`），否则（在`attributeOldValue` 为`true` ，`attributes` 为`false` 的情况下）会抛出异常
        
        <aside>
        🔴 Uncaught TypeError: Failed to execute 'observe' on 'MutationObserver': The options object may only set 'attributeOldValue' to true when 'attributes' is true or not present.
        at 14.3.1.2 attributeOldValue.js:21:10
        
        </aside>
        
    - 设置`attributeOldValue` 为`false` ，那么`attributes` 的值决定了是否观察注册的目标对象的属性，如果观察目标对象的属性，那么`oldValue` 的值一定是`null` （因为不记录上一个属性值）
    - `attributeOldValue` 配合 `subtree` 可以连带目标节点的所有后代节点的属性值都被观察，如下是例子
        
        ```jsx
        const div = document.querySelector("div");
        
        const observer = new MutationObserver((mutationRecords) =>
          console.log(mutationRecords)
        );
        
        observer.observe(div, {
          subtree: true,
          attributeOldValue: true,
          attributes: true, // 可以不设置或设置成true，但不能设置为false
        });
        
        div.className = "bar"; // ①
        div.className = "barz"; // ②
        
        div.appendChild(document.createElement("p"));
        div.children[0].className = "my-p"; // ③
        div.children[0].className = "my-p2"; // ④
        ```
        
        ![attributesOldValue.png](3%20MutationObserver%E6%8E%A5%E5%8F%A3/attributesOldValue.png)
        
        - 第一个`MutationRecord` 实例由操作①引起，因为是首次修改`class` 不存在上一个类名称，所以`oldValue` 为`null`
        - 第二个`MutationRecord` 实例由操作②引起，本来的类名就是上一个操作（①）设置的类名称，所以`oldValue` 为`bar`
        - 第三个`MutationRecord` 实例由操作③引起，它是目标对象的后代节点（`p`）的属性产生的**变化**，`target` 为`p` 元素节点，因为是首次修改`class` ，所以`oldValue` 为`null`
        - 第四个`MutationRecord` 实例由操作④引起，它是上一个操作的`p` 元素节点修改`className` 的变化，所以`oldValue` 为 `my-p`

## 3.1.3 disconnect()方法

- 使用`observe()` 注册被观察的节点和观察标准后，只要节点不被垃圾回收，`MutationObserver` 实例的回调就会响应DOM变化事件
- 要注销`MutationObserver` 注册的被观察节点，可以调用`disconnect()` 方法
    - `disconnect()` 是同步方法，所以执行后不仅会停止此后变化事件的回调，也会**抛弃已加入任务队列要异步执行的回调**
    - 想要让已加入的任务队列的回调执行，可以使用`setTimeout()` 让已经入列的回调执行完毕再调用`disconnect()`
    
    ```jsx
    const div = document.querySelector("div");
    
    const observer = new MutationObserver((mutationRecords) =>
      console.log(mutationRecords)
    );
    
    observer.observe(div, { attributes: true });
    
    div.className = "foo";
    observer.disconnect();
    div.className = "bar";
    // 不会有任何打印
    ```
    
    ```jsx
    const div = document.querySelector("div");
    
    const observer = new MutationObserver((mutationRecords) =>
      console.log(mutationRecords)
    );
    
    observer.observe(div, { attributes: true });
    
    div.className = "foo"; // 操作①
    setTimeout(() => {
      observer.disconnect();
      div.className = "bar"; // 操作②
    });
    // 打印
    [MutationRecord] {
    	0: MutationRecord {type: 'attributes', target: div.bar, addedNodes: NodeList(0), removedNodes: NodeList(0), previousSibling: null, …}
    	length :1
    }
    ```
    
    - 使用`setTimeout()` 后，操作①触发的变化事件会调用回调函数，但是操作②触发的变化事件会被停止

## 3.1.4 复用MutationObserver（Multiplexing a MuatationObserver）

- 一个`MuattionObserver` 对象可以同时观察多个不同的目标节点，只要多次调用`observe()` 方法时传入不同的目标节点即可，回调函数的参数中的`MutationRecord` 实例的`target` 属性会保存变化的目标节点
- 而`disconnect()` 方法是一个“一刀切”方案，调用它会停止观察所有目标
- 即使同时观察多个不同的目标节点，回调函数参数中的`MutationRecord` 实例数组中的顺序也是按照**变化**发生的顺序排列的
    
    ```jsx
    const div = document.querySelector("div");
    const p = document.querySelector("p");
    
    const observer = new MutationObserver((mutationRecords) =>
      console.log(mutationRecords)
    );
    observer.observe(div, { attributes: true });
    observer.observe(p, { attributes: true });
    p.className = "bar";
    div.className = "foo";
    
    setTimeout(() => {
      observer.disconnect();
      p.className = "bar2";
      div.className = "foo2";
    });
    
    // 打印
    // [MutationRecord, MutationRecord]
    ```
    

## 3.1.5 重用MutationObserver（Reusing a MutationObserver）

- 调用`disconnect()` 并不会结束`MutationObserver` 的生命，还可以重新使用这个观察者，只需要再调用`observe()` 把它关联到新的目标节点就行
- 因为`observe()` 和`disconnect()` 都是同步的，调用后就会立即生效，而产生的变化事件去调用异步函数又是异步的，所以`disconnect()` 会无效在调用它之前到下一个`observe()` 调用之前的所有变化事件
    
    ```jsx
    const p = document.querySelector("p");
    const observer = new MutationObserver((mutationRecords) =>
      console.log(mutationRecords)
    );
    
    observer.observe(p, { attributes: true }); // 开始
    p.className = "bar";
    
    **observer.disconnect();**
    
    p.className = "bar2";
    p.className = "bar3";
    observer.observe(p, { attributes: true }); // 结束  ->这一段的属性变化事件无效
    
    p.className = "bar4";
    
    // 打印
    // [MutationRecord]
    ```
    

# 3.2 MutationObserverInit与观察范围（Controlling the Observer scope with MutationObserverInit）

- `MutationObserverInit` 对象用于[控制对目标节点的观察范围](3%20MutationObserver%E6%8E%A5%E5%8F%A3.md) 。观察者可以观察的变化包括属性变化（`attributes`），文本变化（`characterData`），子节点变化（`childList`）
- `MutationObserverInit` 对象的属性如下表
    
    
    | 属性 | 说明 |
    | --- | --- |
    | subtree | 布尔值，表示除了目标节点，是否观察目标节点的子树（后代）；如果是false 则只观察目标节点的变化；如果是true 则观察目标节点及其整个子树；默认为false  |
    | attributes | 布尔值，表示是否观察目标节点的属性变化；默认为false |
    | attributeFilter | 字符串数组，表示要观察哪些属性的变化；把这个值设置为true 也会将attributes 的值转换为true ；默认值为观察所有属性 |
    | attributeOldValue | 布尔值，表示MutationRecord 是否记录变化之前的属性值，把这个值设置为true 也会将attributes 的值转换为true ，默认为false  |
    | characterData | 布尔值，表示修改字符数据是否触发事件；默认为false  |
    | characterDataOldValue | 布尔值，表示MutationRecord 是否记录变化之前的字符数据；把这个值设置为true 也会将characterData 的值转换为true ，默认为false |
    | childList | 布尔值，表示修改目标节点的子节点是否触发变化事件；默认为false  |

<aside>
💡 注意：在调用`observe()`时，`MutationObserverInit` 对象中的`attributes` 、`characterData` 、`childList` 属性必须至少有一项为`true` （无论是直接设置这几个属性，还是通过设置`attributeOldValue` 等属性间接导致它们的值转换为`true`）。否则会抛出错误，因为没有任何变化事件可能触发回调

</aside>

## 3.2.1 观察属性

- `MutationObserver` 可以观察节点属性的**添加、移除和修改**，要为属性变化注册回调，需要在`MutationObserverInit` 对象将`attributes` 属性设置为`true` 即可
- 把`attributes` 设置为`true` 的默认行为是观察所有属性，但不会在`MutationRecord` 对象中记录原来的属性值。
    - 如果想要观察某个或一些属性，可以使用`attributeFilter` 属性来设置白名单，即一个属性名字符串数据
    - 如果想要记录属性变化的前一个值，可以使用`attributeOldValue` 来指示记录前一个属性值
- 观察属性的例子可以查看 [example](3%20MutationObserver%E6%8E%A5%E5%8F%A3.md)

## 3.2.2 观察字符数据

- `MutationObserver` 可以观察文本节点（如Text，Comment和ProcessingInstruction节点）中字符（data）的添加、删除修改，要为字符数据注册回调，需要在`MutationObserverInit` 对象中将`characterData`属性设置为`true`
- 将`characterData` 属性设置为`true` 的默认行为不会在`MutationRecord` 对象记录原本的字符数据，如果想要在变化记录中保存原来的字符数据，可以将`characterDataOldValue` 属性设置为`true`
- 观察字符数据的例子可以查看[example](3%20MutationObserver%E6%8E%A5%E5%8F%A3.md)

## 3.2.3 观察子节点

- `MutationObserver` 可以观察目标节点子节点的添加和移除，要观察子节点，需要在`MutationObserverInit` 对象中将`childList` 属性设置为`true`
- 对子节点的**重新排序（**尽管调用一个方法即可实现**）**会报告两次变化事件，因为从技术上会涉及先移除和再添加
    - 最简单的排序就是使用`insertBefore()` 方法将两个已经存在的子节点改变位置，也就是将其中一个节点的位置移动到另一个节点的前面
    - 这里涉及到两个变化，假设移动位置的节点为`node1` ，那么先要将他从目标节点中移除，移除会触发一次变化事件，对应的`MutationRecord` 实例的`removedNodes` 包含`node1` ，`nextSibling` 和`previousSibling` 就是`node1` 节点的前后相邻节点；假设参考位置的节点为`node2` ，那么将`node1` 插入到`node2` 节点前相当于一次添加变化，对应的`MutationRecord` 实例的`addedNodes` 包含`node1` ，`nextSibling` 和`previousSibling`就是`node1` 节点插入后的前后相邻节点
- 使用`inserBefore()` 进行排序的例子如下
    
    ```jsx
    <div>
      <p>1</p>
      <p>2</p>
      <p>3</p>
    </div>
    -----------------------
    const div = document.querySelector("div");
    
    const observer = new MutationObserver((mutationRecords) =>
      console.log(mutationRecords)
    );
    
    observer.observe(div, { childList: true });
    
    div.insertBefore(div.lastElementChild, div.firstElementChild);
    // 打印
    // [MutationRecord, MutationRecord]
    ```
    

## 3.2.4 观察子树

- 默认情况下，MutationObserver将观察的范围限定为一个元素及其子节点的变化，要把观察范围扩展到这个元素的子树（所有后代节点），这需要在`MutationObserverInit` 对象中将`subtree` 属性设置为`true`
- 被观察的子树中的节点**被移出子树之后仍然能触发变化事件**，这意味着在时间维度上，曾经在过子树上的节点都能触发变化事件，除非这个节点被垃圾回收
    
    ```jsx
    const div = document.querySelector("div");
    
    const observer = new MutationObserver((mutationRecords) =>
      console.log(mutationRecords)
    );
    const p = document.createElement("p");
    div.appendChild(p);
    
    observer.observe(div, { childList: true, subtree: true });
    
    div.removeChild(p); // 删除节点，触发变化事件
    
    p.textContent = "Hello"; // 被删除节点也会触发变化事件
    
    // 打印
    // [MutationRecord, MutationRecord]
    ```
    

# 3.3 异步回调与记录队列（Async Callbacks and Record Queue）

- `MutationObserver` 接口的核心是**异步回调**与**记录队列**模型，这样设计是出于**性能**考虑
    - 为了在大量变化事件发生时不影响性能，每次变化的信息（由观察者实例决定）会保存在`MutationRecord` 实例中，然后实例被添加到**记录队列**
    - 这个队列对每个`MutationObserver` 实例都是唯一的，是所有DOM变化事件的有序列表

## 3.3.1 记录队列的行为

- 每次`MutationRecord` 被添加到`MutationObserver` 的记录队列时，仅当之前没有已排期的微任务回调时（队列中微任务长度为0），才会将观察者注册的回调（在初始化`MutationObserver`时传入）作为微任务调度在任务队列上，这样可以保证记录队列的内容不会被回调处理两次
    - **微任务**（**microtask**），组成任务的更小部分
    - 上面的是《JavaScript高级程序设计（第4版）》的原话，为了表示多个微任务回调应该组合成一个任务，这样就只需调用一次回调，而不需要多次调用回调
- 不过在回调的微任务异步执行的期间，有可能又发生更多变化事件，因此被调用的回调会接收到一个`MutationRecord` 实例的数组，顺序为它们进入记录队列的顺序，回调要负责处理这个数组的每一个实例，因为函数退出之后这些实现（**persist**）就不存在了。回调执行后，这些`MutationRecord` 就用不着了，因此记录队列会被清空，其内容会被丢弃

## 3.3.2 takeRecords()方法

- 调用`MutationObserver` 实例的`takeRecords()` 方法可以清空记录队列，取出并返回其中的所有`MutationRecord` 实例
- 这是希望**断开与观察目标的联系**，但又希望处理由于调用disconnect()而被抛弃的记录队列中的`MutationRecord` 实例时比较有用
    - 上面的是《JavaScript高级程序设计（第4版）》的原话
    - 因为`takeRecords()` 是同步函数，所以一旦执行，已经记录的变化对应的`MutationRecord` 会从记录队列中被取出
    - 之后的变化事件仍然会进入到记录队列中，这就是与`disconnect()` 的主要区别
    
    ```jsx
    const div = document.querySelector("div");
    
    const observer = new MutationObserver((mutationRecords) =>
      console.log(mutationRecords)
    );
    
    observer.observe(div, { attributes: true });
    
    div.className = "bar";
    div.className = "baz";
    div.className = "foo";
    
    console.log(observer.takeRecords()); // [MutationRecord, MutationRecord, MutationRecord]
    console.log(observer.takeRecords()); // []
    
    div.className = "foo";
    // 异步打印
    // [MutationRecord]
    ```
    

# 3.4 性能、内存与垃圾回收（**Performance, Memory, and Garbage Collection**）

- DOM Level 2 规范中描述的`MutationEvent` 定义了一组会在各种DOM变化时触发的事件，由于浏览器事件的实现机制，这个接口出现了严重的**性能**问题
- 因此DOM Level 3 规定废弃了这些事件，提出了`MutationObserver` 接口用于替代，把DOM变化的观察设计的更实用、性能更好
- 无论如何，使用`MutationObserver`仍然**不是没有代价**的，因此理解什么时候避免出现这种情况很重要

## 3.4.1 MutationObserver的引用（**References**）

- 在[5. WeakMap](../6%20%E9%9B%86%E5%90%88%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B/5%20WeakMap.md) 中，提到过弱引用的概念，弱引用的键值会被垃圾回收程序回收，在`MutationObserver` 接口中同样有弱引用的实现
    - `MutationObserver` 实例与目标节点之间的引用关系是**非对称的（asymmetric）**
    - 非对称指观察者与被观察的目标节点之间互相引用，但是引用类型不同
    - `MutationObserver` 实例对要观察的目标节点是**弱引用，**所以**不会妨碍**垃圾回收程序回收目标节点（~~也许是在DOM树中被删除节点依然能触发变化的原因~~）
    - 目标节点对`MutationObserver` 实例是**强引用，**所以等注册的所有目标节点从DOM中被移除，随后被垃圾回收后，关联的`MutationObserver` 才会被垃圾回收

## 3.4.2 MutationRecord的引用（**References**）

- 记录队列中的每个`MutationRecord` 实例至少包含对已有DOM节点的一个引用（`target` 属性），如果变化是`childList`类型，则会包含多个节点的引用
- 记录队列和回调处理的默认行为是**耗尽**这个队列，处理每个`MutationRecord` ，然后让它们超出作用域并被垃圾回收
    - 异步调用一次回调，就会消耗记录队列中的`MutationRecord` 实例
    - 如果需要保存某个观察者的完整变化记录，**不能直接保存**`MutationRecord` 实例，因为它们引用着节点，会妨碍这些节点被回收，如果需要尽快释放内存，可以从`MutationRecord` 中抽取有用的信息，然后保存到一个新对象上，最后抛弃`MutationRecord`