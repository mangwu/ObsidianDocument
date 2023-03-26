# 14. DOM

- [ ]  理解文档对象模型（DOM）的**层次结构**（**hierarchy**）
- [ ]  节点类型（nodes types）
- [ ]  浏览器兼容性（**incompatibilities and gotchas**）
- [ ]  MutationObserver接口

文档对象模型（DOM，Document Object Model）是HTML和XML文档的**编程接口（Application programming interface，API）**。DOM表示由**多层节点构成**（**hierarchical tree of nodes**）的文档，通过它开发者可以添加、删除和修改页面的各个部分

脱胎于网景和微软早期的动态HTML（DHTML，Dynamic HTML），DOM现在是真正跨平台，语言无关的表示和操作网页的方式

DOM Level 1 在1998年成为W3C推荐标准，提供了基本文档结构和查询的接口。本章之所以介绍DOM，主要因为它与浏览器中的HTML网页相关，并且在JavaScript中提供了DOM API

<aside>
💡 注意，IE8及其更低版本中的DOM是通过COM对象实现的，这意味着这些版本的IE中，DOM对象和原生JavaScript对象具有不同的行为和功能

</aside>

# 1. 节点层级（**HIERARCHY OF NODES**）

[1. 节点层级（**HIERARCHY OF NODES**）](14%20DOM/1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89.md)

# 2. DOM编程 （Work with the DOM）

[2. DOM编程](14%20DOM/2%20DOM%E7%BC%96%E7%A8%8B.md)

# 3. MutationObserver接口（Mutation Observers）

[3. MutationObserver接口](14%20DOM/3%20MutationObserver%E6%8E%A5%E5%8F%A3.md)

# 4. 小结

- 文档对象模型（DOM，Document Object Model）是语言中立的HTML和XML文档的API，DOM Level 1 将HTML和XML文档定义为一个**节点的多层级结构**（**a hierarchy of nodes**），这个结构会暴露出JavaScript接口以操作文档的底层结果和外观
- DOM是一系列节点类型构成，主要包括如下几种
    - [ ]  Node是基准节点类型，是文档一个部分的抽象表示，所有其它类型都继承Node
    - [ ]  Document类型表示整个文档，对应树形结构的根节点。在JavaScript中，document对象是Document的实例，拥有查询和获取节点的很多方法
    - [ ]  Element节点表示文档中所有HTML或XML元素，可以用来操作它们的内容和属性
    - [ ]  其它节点类型分别表示文本内容、注释、文档类型、CDATA区块和文档片段
- DOM编程在多数情况下没问题，在涉及<script>和<style>元素时会有一些兼容性问题，因为这些元素分别包含脚本和样式信息，所以浏览器（旧版本IE浏览器）会将它们和其它元素区别对待
- 理解DOM，要关心影响其性能的因素。DOM操作在JavaScript代码中代价比较高，NodeList对象尤其需要注意。`NodeList` 对象是“实时更新”的，这意味着每次访问它都会执行一次新的查询。尽量减少DOM操作数量
- `MutationObserver` 接口用于观察DOM节点的变化（**mutation**），它是为了替代性能不好的`MutationEvent` 而问世的，它API相对简单并且能精准有效地监控DOM变化