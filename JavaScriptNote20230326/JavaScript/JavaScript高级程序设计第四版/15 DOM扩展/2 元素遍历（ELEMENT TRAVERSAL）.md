# 2. 元素遍历（ELEMENT TRAVERSAL）

- 在上一章中，`childNodes` 是`Node` 接口定义用于表示元素子节点的属性，它包括注释节点，文本节点
    - 虽然IE9之前的版本不会把元素间的空格当作空白的文本节点，但是其它浏览器会这样
    - 这就导致了`childNodes` 、`firstChild` 中存在空白的文本节点而**不好用**的情况
    - 有时候开发者只会关心一个节点下的所有**元素节点**，为了弥补这个缺口同时不影响DOM规范，W3C通过新的Element Traversal规范定义了一组新属性
- W3C已经找不到Element TravesalAPI的相关规范，但是可以知道的是`[ParentNode](https://dom.spec.whatwg.org/#interface-parentnode)` 这个接口和`[NonDocumentTypeChildNode](https://dom.spec.whatwg.org/#nondocumenttypechildnode)` 接口实现了Element Travesal API所定义的所有属性
    
    ```jsx
    interface mixin ParentNode {
      [SameObject] readonly attribute HTMLCollection children;
      readonly attribute Element? firstElementChild;
      readonly attribute Element? lastElementChild;
      readonly attribute unsigned long childElementCount;
    
      [CEReactions, Unscopable] undefined prepend((Node or DOMString)... nodes);
      [CEReactions, Unscopable] undefined append((Node or DOMString)... nodes);
      [CEReactions, Unscopable] undefined replaceChildren((Node or DOMString)... nodes);
    
      Element? querySelector(DOMString selectors);
      [NewObject] NodeList querySelectorAll(DOMString selectors);
    };
    Document includes ParentNode;
    DocumentFragment includes ParentNode;
    Element includes ParentNode;
    
    interface mixin NonDocumentTypeChildNode {
      readonly attribute Element? previousElementSibling;
      readonly attribute Element? nextElementSibling;
    };
    Element includes NonDocumentTypeChildNode;
    CharacterData includes NonDocumentTypeChildNode;
    ```
    
    - [ ]  `childElementCount` ，返回子元素数量（不包含文本节点和注释），`ParentNode` 接口定义属性，被`Document`，`DocumentFragment`，`Element` 类型实现
    - [ ]  `firstElementChild` ，指向第一个`Element` 类型的子节点，`ParentNode` 接口定义属性，被`Document`，`DocumentFragment`，`Element` 类型实现
    - [ ]  `lastElementChild` ，指向最后一个`Element`类型的子节点，`ParentNode` 接口定义属性，被`Document`，`DocumentFragment`，`Element` 类型实现
    - [ ]  `previousElementSibling` ，指向前一个`Element`类型的同胞元素，`NonDocumentTypeChildNode` 接口定义属性，被`Element` ，`CharacterData` 类型实现
    - [ ]  `nextElementSibling` ，指向后一个`Element`类型的同胞元素，`NonDocumentTypeChildNode` 接口定义属性，被`Element` ，`CharacterData` 类型实现
- 有了上述的属性（还包括《JavaScript高级程序设计（第4版）》没有介绍的定义在`ParentNode` 接口中的`children` 属性），就没必要通过遍历`Node` 接口定义的`childNodes` 属性，然后[判断`nodeType` 的方式](../14%20DOM/1%20%E8%8A%82%E7%82%B9%E5%B1%82%E7%BA%A7%EF%BC%88HIERARCHY%20OF%20NODES%EF%BC%89/Element%E7%B1%BB%E5%9E%8B.md)获取节点的所有子元素节点了
    
    ```jsx
    <ul class="parent">
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
    </ul>
    <script>
      const parent = document.querySelector(".parent");
      let curChildEle = parent.firstElementChild;
      while (curChildEle) {
        // 处理元素节点
        console.log(curChildEle);
        // 获取下一个元素节点
        curChildEle = curChildEle.nextElementSibling;
      }
    </script>
    
    // 打印
    <li>...</li>
    <li>...</li>
    <li>...</li>
    ```
    
- IE9及以上版本和所有现代浏览器都支持Element Traversal API新增的属性