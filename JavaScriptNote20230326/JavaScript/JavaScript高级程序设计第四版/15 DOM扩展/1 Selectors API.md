# 1. Selectors API

- JavaScript库中最流行的一种能力就是根据**CSS选择符的模式**（参见[MDN-CSS选择器](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors)）匹配DOM元素，jQuery就完全以CSS选择符查询DOM获取元素引用
- Selectors API（参见w3c.org的[Selectors API](https://www.w3.org/TR/?title=selectors)）是W3C推荐标准，规定了浏览器原生支持的CSS查询API，现在已经发布到[Selectors API Level 2](https://www.w3.org/TR/2013/NOTE-selectors-api2-20131017/) 了
    - 支持CSS选择符查询API的特性的所有JavaScript库都会实现一个基本的CSS解析器，然后使用已有的DOM方法搜索文档并匹配目标节点
    - 虽然库的开发者在不断改进其性能，但JavaScript代码能做到的有限（性能不好）
    - 通过浏览器原生支持这个API，解析和遍历DOM树可以通过底层编译语言实现，性能也有了数量级的提升
- [Selectors API Level 1](https://www.w3.org/TR/selectors-api/) （旧版本但向下兼容）的核心是两个方法：`querySelector()` 和`querySelectorAll()` ，在兼容浏览器中，Document类型和Element类型的实例都会暴露这两个方法（这两个方法定义在`ParentNode` 混入（mixin）接口中，`Document` 接口，`DocumentFragment` 接口，`Element` 都实现了`ParentNode` 接口（非继承而是包含））
- [Selectors API Level 2](https://www.w3.org/TR/2013/NOTE-selectors-api2-20131017/) 规范在`Element` 类型上新增了更多的方法，比如`matches()` ，`find()` 和`findAll()` ，不过目前（20230105）还没有浏览器实现或宣称实现`find()`和`findAll()`

# 1.1 querySelector()

- `querySelector()` 方法接受CSS选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配项则返回`null`
    
    ```jsx
    <body>
        <div id="root">
          <p class="selected"></p>
          <input type="text" />
        </div>
    </body>
    
    // 获取<body>元素
    let body = document.querySelector("body");
    
    // 获取ID为root的元素
    let root = document.querySelector("#root");
    
    // 获取类名为selected得到元素
    let selected = document.querySelector(".selected");
    
    // 获取类型为text的input元素
    let input = document.querySelector("input[type='text']");
    ```
    
- 在Document上使用`querySelector()` 方法时，会从文档元素开始搜索；在Element上使用`querySelector()` 方法时，则只会从当前元素的后代中查询
- 用于查询模式的CSS选择符可繁可简，如果选择符有语法错误或碰到不支持的选择符，则`querySelector()` 会抛出异常

# 1.2 querySelectorAll()

- `querySelectorAll()` 和`querySelector()` 一样，接收一个用于查询的参数，但是它会返回所有匹配的节点，也就是一个`NodeList`的**静态实例**
    - `NodeList` 的静态实例就是一个静态的“快照”，而非“实时”的查询，这样避免了`NodeList` 对象可能造成的性能问题
    - 如果没有任何匹配的节点，返回的`NodeList` 就是空的
    - `querySelectorAll()` 和`querySelector()` 都是`ParentNode` 的接口，包含`ParentNode` 的Document、DocumentFragement、Element类型都可以使用
    - 如果选择符语法错误或者不支持，则`querySelectorAll()` 会抛出错误
    
    ```jsx
    <body>
      <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
      </ul>
      <script>
        const lis = document.querySelectorAll("ul li");
        for (const li of lis) {
          console.log(li);
        }
      </script>
    </body>
    
    // 打印
    // <li>...</li>
    // <li>...</li>
    // <li>...</li>
    ```
    

# 1.3 matches()

- `matches()` 方法（~~在规范草案中称为`matchesSelectors`~~ ,标准中没有这种说法）接收一个CSS选择符参数，如果元素匹配则该选择返回`true` ，否则返回`false`
    - 所有主流浏览器都支持`matches()`
    - 使用这个方法方便检测某个元素是否匹配CSS选择符表示的节点，假设调用元素节点为`element` ，这个方法就是在整个文档检测CSS选择符是否能匹配`element`
    - 需要注意`matches()` 并非定义在`ParentNode` 接口上，它仅在`Element` 接口上实现了
    
    ```jsx
    <body>
      <p>
        <span>k</span>
      </p>
      <script>
        const p = document.querySelector("p");
        console.log(p.matches("p")); // true
        console.log(p.matches("body p")); // true
        console.log(p.matches("span")); // false
      </script>
    </body>
    ```