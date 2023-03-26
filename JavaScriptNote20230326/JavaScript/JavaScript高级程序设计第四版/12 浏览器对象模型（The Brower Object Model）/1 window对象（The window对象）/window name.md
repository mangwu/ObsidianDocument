# window.name

参考MDN-[Window.name](https://developer.mozilla.org/en-US/docs/Web/API/Window/name)

# 定义

`window.name` 是一个**访问器自有**属性，用于**设置和获取**（**sets/gets**）当前**窗口的浏览上下文**（**window's browsing context**）

# 值

- 必是字符串

<aside>
💡 注意：如果复制给window.name的值不是一个字符串，它调用值的`toString()` 方法获取对应的字符串

</aside>

# 理解`window.name`

- 窗口的名称主要用于在**超链接**（**hyperlinks**）和**表单**（**forms**）中设置`target` ，**浏览上下文**（**Browsing contexts**）实际上并不需要名称
    - 这句话的意思就是`window.name`只是用来暂时标识一个窗口（tab页）
    - 在<a>标签或<form>标签元素上的`target` 属性可以设置成指定`tab`标识的用来“侵占”相同名称的tab页（通常配合`window.open()` 使用）
    - 如果在<a>标签的`target` 上设置了指定窗口标识字符串，但是没有现存的tab窗口，会创建一个`window.name`值为`target` 属性（attribute）指定值的tab窗口，并且再点击这个<a>标签链接，也会直接跳到刚刚创建的页面
- 如果一个选项卡（tab页）从一个不同的域中加载（即有一个超链接，默认未设置`target`属性就会从当前选项卡加载页面），现代浏览器会将`window.name` **重置为一个空字符串**
    - 如果原页面被重新加载，例如通过浏览器工具栏的返回按钮回到原始页面，则当前窗口的名称会被恢复
    - 现代浏览器这种特性能防止不受信任的页面收集之前窗口存储在`window`对象的属性中的一些信息（新页面还可能修改这些数据导致返回原始页面时，原始页面会读取到错误的信息导致一些不可预料的行为）
- `window.name` 在一些**框架**(**frameworks**)中被用于比*JSONP*更安全的**跨域消息传递**（**cross-domain messaging**）方案
    - 但是现代浏览器因为**托管敏感数据**（**hosting sensitive data**），不应该依赖`window.name` 进行跨域消息传递——window.name的本来目的是为了提供当前窗口的浏览上下文（窗口标识）
    - 应该使用更安全，更好用的`window.postMessage()` 进制进行窗口之间的信息分享

# 例子

使用三个html文档， 一个利用window.open()打开另外一个文档otherTab，并设置该文档的`name`属性值，提供一个超链接到第三个文档，但是`target`指定为otherTab的`name` 以达成通过`window.name`“占领”窗口的功能

window opening.html

```html
<body>
  <script>
    const otherTab = window.open("./12.1.6.1 window otherTab.html");
    if (otherTab) otherTab.name = "other-tab";
  </script>
  <a href="./12.1.6.1 window cuckoo.html" target="other-tab"
    >点击占领other-tab页面</a
  >
</body>
```

window otherTab.html

```html
<body>
  <p>临时性的othertab，window.name被设置为"other-tab"</p>
</body>
```

window cuckoo.html

```html
<body>
    <p>
      点击opening中的链接，这个页面会“占领”otherTab页面，因为链接目标设置为了otherTab的窗口名称
  </p>
</body>
```

结果

![window name.gif](window%20name/window_name.gif)