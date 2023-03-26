# 16. DOM2和DOM3（DOM Levels 2 and 3）

- [ ]  DOM2到DOM3的变化
- [ ]  操作样式的DOM API
- [ ]  DOM遍历与范围
- DOM1（DOM Level 1）主要定义了HTML和XML文档的底层结构（第14章内容）
- DOM2（DOM Level 2）和DOM3（DOM Level 3）在这些结构之上加入了更多的交互功能，提供了更高级的XML特性
- DOM2和DOM3是按照**模块**化（**modules**）的思路来制定标准的，每个模块之间有一定关联，但分别针对某个DOM子集，这些模块如下
    - [ ]  DOM Core：在DOM1核心部分的基础上，为节点增加方法和属性，在W3C中的具体标准规范为**[Document Object Model (DOM) Level 3 Core Specification](https://www.w3.org/TR/DOM-Level-3-Core/)** （DOM Level 2 Core已经过时）
    - [ ]  DOM Views：定义基于样式信息的不同视图，在W3C中的具体标准规范为****[Document Object Model (DOM) Level 3 Views and Formatting Specification](https://www.w3.org/TR/DOM-Level-3-Views/)** （该文档已经退休(retired)，已合入[DOM Living Standard](https://dom.spec.whatwg.org/)）
    - [ ]  DOM Events：定义通过事件实现DOM文档交互，在W3C中不同类型的事件被模块化（主要为uievents）为不同的事件标准，如****[UI Events](https://www.w3.org/TR/uievents/) 、[Pointer Events](https://www.w3.org/TR/pointerevents/) 、[Server-Sent Events](http://www.w3.org/TR/eventsource/) 、[Progress Events](https://www.w3.org/TR/progress-events/)**等；对于事件的**广泛解释**，可以查看[**DOM Living Standard**](https://dom.spec.whatwg.org/#events)
        - 现在的UIEvents就是以前的DOM Events 3
    - [ ]  DOM Style：定义以编程方式访问和修改CSS样式的接口，W3C中的具体标准规范为**[CSS Style Attributes](https://www.w3.org/TR/css-style-attr/)**，并且其标签为HTML和CSS
    - [ ]  DOM Traversal and Range：新增遍历DOM文档及选择文档内容的接口，在W3C中没有一个**独立**的关于DOM文档遍历的标准规范，可以在[**DOM Living Standard**](https://dom.spec.whatwg.org/#traversal) 第6章找到关于Traversal的内容，在[第5章](https://dom.spec.whatwg.org/#ranges) 找到关于Ranges的内容
    - [ ]  DOM HTML：在DOM1 HTML部分的基础上，增加属性、方法和新接口，已经没有DOM HTML的说法（或者说没有独立的DOM HTML标准规范），部分DOM HTML特性合入[DOM Living Standard](https://dom.spec.whatwg.org/) 中了，参考DOM Living Standard的[原始提案](https://dom.spec.whatwg.org/review-drafts/2020-06/)：
        
        > 该规范（原始提案）标准化了DOM。它的做法如下:
        > 
        > 1. 通过整合***DOM Level 3 Core***[[DOM-Level-3-Core](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-dom-level-3-core)]，***Element Traversal***[[ELEMENTTRAVERSAL]](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-elementtraversal)，***Selectors API Level 2***[[SELECTOR-API2]](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-selectors-api2)， ***DOM Level 3 Events** [*[uievents-20031107](https://www.notion.so/mangwu/%E7%89%B9%E5%AE%9A%E7%B1%BB%E5%9E%8B%E7%9A%84%E4%BA%8B%E4%BB%B6%E4%B8%8D%E5%B1%9E%E4%BA%8EDOM%E6%A0%87%E5%87%86)]的“DOM事件架构”和“基本事件接口”章节（特定类型的事件不属于DOM标准），以及***DOM Level 2 Traversal and Range***[[DOM-Level-2-Traversal-Range]](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-elementtraversal)，以及:
        >     - 尽可能让它们与JavaScript生态系统保持一致。
        >     - 将它们与现有实现对齐。
        >     - 尽可能地简化它们。
        >     
        > 2. 通过从HTML Standard[[HTML](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-html)]中移动一些更有意义的特性，将其指定为DOM标准的一部分。
        >     
        >     
        > 3. 通过将*DOM Level 3 Events*[[uievents-20031107]](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-uievents-20031107)的有问题的“Mutation Events”和“Mutation Name Event Types”章节旧模型进行替换
        >     
        >     
        >     旧模型预计将在适当的时候从实现中移除。（替换为MutationObserver）
        >     
        > 4. 通过定义简化通用DOM操作的新特性。
    - [ ]  DOM Mutation Observers：定义基于DOM变化触发回调的接口，这个模块是DOM 4级模块，用于取代MutationEvents；W3C中的具体规范标准为****[W3C DOM 4.1](https://www.w3.org/TR/2020/NOTE-dom41-20200317/)****（该文档已经退休(retired)，已合入[DOM Living Standard](https://dom.spec.whatwg.org/)），其中第4章的第3节就是**[4.3. Mutation observers](https://www.w3.org/TR/2020/NOTE-dom41-20200317/#mutation-observers)，**在DOM Living Standard中同样是**[4.3部分](https://dom.spec.whatwg.org/#mutation-observers)** 为Mutation Observers
- 《JavaScript高级程序设计（第4版）》在**本章**会介绍除了DOM Events（在[17.Event](17%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89.md) 中介绍）和DOM Mutation Observers（在[14.DOM](14%20DOM/3%20MutationObserver%E6%8E%A5%E5%8F%A3.md) 中介绍过了）的其它所有模块
- 除此之外，DOM3还有XPath和Load and Save模块，将在22章介绍

<aside>
💡 注意：老旧浏览器（如IE8）可能不支持上述部分特性，在使用API前需要确定浏览器的支持情况，如果项目要兼容低版本的浏览器，推荐参考[Can I Use](https://caniuse.com/) 网站，它是一个查询CSS、JS、HTML5、CSS、SVG在各个流行浏览器中的特性和兼容性的网站

</aside>

# 1. DOM的演进(DOM Changes)

[1. DOM 演进](16%20DOM2%E5%92%8CDOM3%EF%BC%88DOM%20Levels%202%20and%203%EF%BC%89/1%20DOM%20%E6%BC%94%E8%BF%9B.md)

# 2. 样式(Styles)

[2. 样式](16%20DOM2%E5%92%8CDOM3%EF%BC%88DOM%20Levels%202%20and%203%EF%BC%89/2%20%E6%A0%B7%E5%BC%8F.md)

# 3. 遍历(TRAVERSALS)

[3.遍历](16%20DOM2%E5%92%8CDOM3%EF%BC%88DOM%20Levels%202%20and%203%EF%BC%89/3%20%E9%81%8D%E5%8E%86.md)

# 4. 范围(Ranges)

[4. 范围](16%20DOM2%E5%92%8CDOM3%EF%BC%88DOM%20Levels%202%20and%203%EF%BC%89/4%20%E8%8C%83%E5%9B%B4.md)

# 5. 小结(Summary)

DOM2规范定义了一些模块用来丰富DOM1的功能

1. DOM2 Core在一些类型上增加了与XML命名空间有关的新方法
    - [ ]  这些变化只有在使用XML或XHTML时才有用
    - [ ]  DOM2 增加的与XML命名空间无关的方法涉及以编程方式创建`Document`和`DocumentType`类型的新实例（`implementation`）
2. DOM2 Style模块定义了如何操作元素的样式信息
    - [ ]  每个元素都有一个关联的`style`对象，可用于确定和修改元素特定的样式
    - [ ]  要确定元素的计算样式，包括应用到元素身上的所有CSS规则，可以使用`getComputedStyle()` 方法
    - [ ]  通过`document.styleSheets` 集合可以范围文档上所有的样式表
3. DOM2 Tranversal and Range模块定义了与DOM结构交互的不同方式
    - [ ]  `NodeIterator` 和`TreeWalker` 可以对DOM树执行深度优先的遍历
    - [ ]  `NodeIterator` 接口简单，每次只能向前或向后移动一步；`TreeWalker` 支持DOM树所有方向移动，包括父节点，同胞节点，子字节，和深度遍历
    - [ ]  `Range` 是选择DOM结构中特定部分并进行操作的一种方式
    - [ ]  通过范围的选区可以在保持文档结构完好的同时从文档中移除内容，也可以复制文档中相应的部分