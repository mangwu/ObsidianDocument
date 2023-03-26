# 17. 事件（Events）

- [ ]  理解事件流（events flow）
- [ ]  使用事件处理程序（event handlers）
- [ ]  了解不同类型的事件
- *事件是什么，用来做什么*：JavaScript与HTML的**交互**是通过**事件**实现的，**事件代表文档或浏览器窗口中某个有意义的时刻**
    - 可以使用监听器（也叫处理程序）**订阅事件（subscribed events）**，这样，事件发生时就能执行对应的处理程序⇒这本质上就是**交互**，用户在文档上进行相关操作触发事件，事件的监听器监听到了事件发生触发对应的处理程序，处理程序执行实现对用户的反馈
    - 在传统软件工厂领域，这个模型叫做“**观察者模式**（**observer pattern**）”，其能够做到页面行为（在JavaScript中定义）与页面展示（在HTML和CSS中定义）的**分离（loose coupling）**
- *事件的发展与演进*：事件最早是在IE3和Netscape Navigator 2中出现的，当时的用意是把某些表单处理工作从服务器转移到浏览器上来（参见[起因](1%20%E4%BB%80%E4%B9%88%E6%98%AFJavaScript.md) ）
    - 到了IE4和Netscape Navigator 3 发布的时候，这两家浏览器都提供了类似但是又不同的API，持续了几代
    - DOM 2 开始尝试以符合逻辑的方式标准化DOM事件API，目前所有现代浏览器都实现了DOM2 Events的核心部分（参见[通过整合***DOM Level 3 Core***[[DOM-Level-3-Core](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-dom-level-3-core)]，***Element Traversal***[[ELEMENTTRAVERSAL]](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-elementtraversal)，***Selectors API Level 2***[[SELECTOR-API2]](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-selectors-api2)， ***DOM Level 3 Events** [*[uievents-20031107](https://www.notion.so/mangwu/%E7%89%B9%E5%AE%9A%E7%B1%BB%E5%9E%8B%E7%9A%84%E4%BA%8B%E4%BB%B6%E4%B8%8D%E5%B1%9E%E4%BA%8EDOM%E6%A0%87%E5%87%86)]的“DOM事件架构”和“基本事件接口”章节（特定类型的事件不属于DOM标准），以及***DOM Level 2 Traversal and Range***[[DOM-Level-2-Traversal-Range]](https://dom.spec.whatwg.org/review-drafts/2020-06/#biblio-elementtraversal)，以及:](16%20DOM2%E5%92%8CDOM3%EF%BC%88DOM%20Levels%202%20and%203%EF%BC%89.md) ，现在有关事件的模块都在[DOM Living Standard](https://dom.spec.whatwg.org/)中解释了）
    - IE8是最后一个使用专有事件系统的主流浏览器（实际上现在也没啥人用了）
- *事件的复杂性与浏览器支持程度*：浏览器的事件系统非常复杂，即使所有主流浏览器都实现了DOM2 Events，规范也没有涵盖所有的事件类型
    - BOM也支持事件，这些事件与DOM事件之间的关系由于长期以来缺乏文档，经常容易被混淆（HTML5已致力于明确这些关系）
    - 而DOM3新增的事件API又让这些问题进一步复杂化了，根据具体的需求不同，使用的事件可能会相对简单，也可能会非常复杂
    - 但无论如何，理解其中的核心概念很重要

# 1. 事件流（Events Flow）

[1. 事件流（Event Flow）](17%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89/1%20%E4%BA%8B%E4%BB%B6%E6%B5%81%EF%BC%88Event%20Flow%EF%BC%89.md)

# 2. 事件处理程序（Event Handler）

[2. 事件处理程序（Event Handler）](17%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89/2%20%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%EF%BC%88Event%20Handler%EF%BC%89.md)

# 3. 事件对象（The Event Object）

[3. 事件对象（The Event Object）](17%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89/3%20%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%EF%BC%88The%20Event%20Object%EF%BC%89.md)

# 4. 事件类型（Event Types）

[4. 事件类型（Event Type）](17%20%E4%BA%8B%E4%BB%B6%EF%BC%88Events%EF%BC%89/4%20%E4%BA%8B%E4%BB%B6%E7%B1%BB%E5%9E%8B%EF%BC%88Event%20Type%EF%BC%89.md)