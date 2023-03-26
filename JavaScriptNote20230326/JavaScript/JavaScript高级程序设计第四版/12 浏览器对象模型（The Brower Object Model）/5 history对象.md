# 5. history对象

`history` 对象用于记录当前窗口（tab页，iframe等）首次使用以来用户的导航页面（**navigation history**）

`history` 是`window` 的属性，每个窗口（`window`）都有自己的`history`对象

出于安全考虑，这个对象**不会**暴露用户访问过的URL，但是通过它在不知道实际URL的情况下前进和后退

# 5.0 HTML5标准下History接口

- HTML Standard定义了[# the-history-interface](https://html.spec.whatwg.org/multipage/history.html#the-history-interface) 接口，这是现代浏览器实现的基础

## 5.0.1 接口

```jsx
enum ScrollRestoration { "auto", "manual" };
[Exposed=Window]
interface History {
	readonly attribute unsigned long length;
	attribute ScrollResoration scrollResoration;
	readonly attribute any state;
	undefined go(optional long delata = 0);
	undefined back();
	undefined forward();
	undefined pushState(any data, DOMString unused, optional USVString? url = null);
	undefined replaceState(any data, DOMString unused, optional USVString? url = null);
}
```

- 这里定义了一个枚举类型`ScrollRestoration` ，表示以它为类型的值只能是”auto”或”manual”
- `any` 表示属性的类型没有限制（可以是任何类型值）
- `optional` 表示参数可选
- `USVString` 代表所有可用`unicode`**标量序列**的集合，关于DOMString，USVString，CSSDOMString以及BinaryString可以查看[9. JavaScript中的字符串（String）](../../JavaScript%E5%B0%8F%E8%AE%A1/9%20JavaScript%E4%B8%AD%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%88String%EF%BC%89.md)

| 属性/方法 | 描述 |
| --- | --- |
| length | 返回一个整数值，表示会话历史（session history）中元素的数量，包括当前加载页面，所以最小值为1 |
| scrollResoration | 一个枚举类型的属性，它只有”auto”和”manual”两个值，它允许web应用程序明确设置历史导航的默认滚动恢复行为（default scroll restoration behavior）。默认情况下这个属性值就是”auto”，它保证浏览器会记住当前用户滚动到的位置，刷新后仍然在记录的位置；如果设置为“manual”，那么浏览器不会记录当前页面滚动到的位置，刷新后页面将会变成初始状态 |
| state | 返回表示历史堆栈顶部状态的值，这是一种不用等待popstate 事件就能查看状态的方法，在未进行使用pushState()和repalceState()方法前，这个属性的值为null  |
| go() | 从会话历史中加载特定的页面，可以使用它根据参数值在历史记录中向前或向后移动，这是一个异步方法；可以传递一个delta 参数（不传递默认为0），它表示相对于当前页面，想要移动到的页面历史位置，负值表示向后移动，正值表示向前移动，例如history.go(2) 表示前进两个页面，传递0则相当于调用location.reload() ,传递-2表示后退两个页面，如果给出的值超过了能移动范围，则不会进行任何操作 |
| back() | 异步函数，让当前页面在历史会话上向后移动一个页面，它和go(-1)效果一样，也相当于浏览器地址栏左边的后退按钮 |
| forward() | 异步函数，让当前页面在历史会话上向前移动一个页面，它和go(1)效果一样也相当于浏览器地址栏左边的前进按钮 |
| pushState() | 在HTML文档中，调用该方法会在浏览器的会话历史栈中添加一条记录（状态）， |
| replaceState() | 修改当前历史记录项（history entry），将其替换为方法参数中传递的状态对象和URL。当想更新当前的state对象或者当前历史记录项的URL以响应用户操作时，这个方法特别有用 |

## 5.0.2 pushState与replaceState()

### 5.0.2.1 参数

- 二者都用来修改历史会话中的状态，都可以接收三个参数

```jsx
history.pushState(state, title[, url]);
```

```jsx
history.replaceState(state, unused[, url]);
```

- 第一个参数：`state`
    - 状态对象是一个JavaScript对象，它与`pushState()` 创建的新历史记录条目相关联；每当用户导航到新状态时，都是触发`popstate` 事件，并且该事件的状态属性包含历史记录条目的状态对象副本
    - 状态对象**可以是任何可序列化的对象**。
    - Firefox对状态对象序列化表示施加了2MiB的大小限制，如果将序列化后大于2MiB的的状态传递给pushState()会引起异常
- 第二个参数：`title`/`unused`
    - `title` 被当前大多数浏览器都忽略，它用于为要添加的状态传递简短的标题
    - `unused` 传递空值，由于历史原因需要传递，这个值没有用处，只是为了兼容性
- 第三个参数：`url` 可选
    - 历史记录项（history entry）的URL，必须和当前页面的URL同源
    - 注意调用pushState()或replaceState()后，不会尝试加载此URL，可能会在之后尝试（如重写加载页面）
    - URL不一定是绝对，可以是相对的，如果不传递这个参数，则当前URL不会改变

### 5.0.2.2 URL

- 从某种程度来说，调用`pushState()`和`window.location = "#foo"` 基本上一样，它们都会在当前document中创建和激活一个新的历史记录。但是`pushState()` 有以下优势
    - 新的URL可以是任何和当前URL同源的URL，但是设置`window.location`只会在你设置锚时才会使用当前URL
    - 非强制修改URL，相反设置`window.location="#foo"` 仅仅会在当前锚的值不是`"#foo"` 时才创建一个新的历史记录项
    - 可以在新的历史记录中关联任何数据。`window.location = "#foo"` 形式的操作，只能将所需数据写入锚的字符串中
- `pushState()` 不会触发hashchange事件，即使新的URL和之前URL只是锚数据不同

### 5.0.2.3 例子

- 初始URL：`https://www.example.org/foo.html` ，执行如下语句
    
    ```jsx
    const stateObj = { foo: "bar" };
    history.pushState(stateObj, '', 'bar.html');
    ```
    
- URL变成了：`https://www.example.org/bar.html` ,状态（history.state）变成了`{ foo: "bar" }` ，但是页面没有变化
- 继续执行如下语句
    
    ```jsx
    history.replaceState(stateObj, '', 'bar2.html');
    ```
    
- URL变成了：`https://www.example.org/bar2.html` ,状态（history.state）变成了`{ foo: "bar" }` ，但是页面没有变化
- 现在在地址栏输入[https://www.microsoft.com](https://www.microsoft.com/)导航到微软首页，然后点击旁边的后退按钮，URL显示为`https://www.example.org/bar2.html`，页面加载成example的页面；如果再次点击后退按钮，URL显示为`https://www.example.org/foo.html` ，直接绕开了`bar.html` ，这就是使用`replaceState()` 的效果

# 5.1 JavaScript高级程序设计4

## 5.1.1 导航

- 本节讲解一些使用history的go，back，forward方法进行导航的方式，上面已经介绍过
- 值得注意的是
    - 在旧版本的浏览器中，`go()` 方法的参数也可以是一个字符串，在这种情况下，会导航到历史中包含该字符串的第一个位置，最接近的位置可能涉及后退，也可能涉及前进，如果历史记录中没有匹配的项，那么这个方法什么都不会做
    - 如果URL发生变化，则会在历史记录中生成一个新条目，对于2009年以来发布的主流浏览器，这包括改变URL的散列值（因此，把location.hash设置为一个新值会在这些主流浏览器的历史记录中增加一条新记录），这个行为被**单页应用程序框架**用来模拟前进和后退，这样做是为了不会因为导航而触发页面刷新

## 5.1.2 历史状态管理

- 现代web应用程序开发最难的环节之一就是**历史记录管理（history management）**
- 用户每次点击都会触发页面刷新的时代已经过去，”后退“和”前进“按钮对用户来说就代表”帮我切换一个状态“的历史也随之结束了
- 为了解决这个问题，首先出现的就是hashchange事件，HTML5也为history对象增加了方便状态管理特性（pushState, replaceState）

---

- hashchange会在页面URL的散列变化时被触发，开发者可以在此时执行某些操作
- 而状态管理API则可以让开发者改变浏览器URL当不会加载新页面
    - `history.pushState()` 它接收三个参数，`state` ，`title` ，可选的`URL`
        
        ```jsx
        let stateObj = {foo: "bar"};
        history.pushState(stateObj, "My title", "baz.html");
        ```
        
        - pushState()方法执行后，状态信息被推到历史记录中，浏览器地址也会改变以反映新的相对URL
        - 除此之外，`location.href` 返回的是地址栏中的内容，浏览器页面不会向服务器发送请求
        - 第一个参数应该包含正确初始化页面状态所必需的信息，为防止滥用，这个状态的对象大小是有限制的，通常在500KB~1MB以内
    - `popstate`事件，该事件是在当前状态（`history.state`）发生变化时触发，如上面`pushState` 后，点击回退按钮，就会触发window对象上的`popstate` 事件，该事件对象上有一个`state`属性，其值就是当前状态
        
        ```jsx
        window.addEventListener("popstate", (event) => {
        	let state = event.state;
        	console.log(state);
        })
        ```
        
    - 使用`history.replaceState()` 来更新状态，更新状态不会创建新历史记录，只会覆盖当前状态，其参数和`pushState()` 一样
        
        ```jsx
        let stateObj = {foo: "bar"};
        history.replaceState(stateObj, "", "bar.html");
        ```
        
        - 传给`pushState()` 和`replaceState()` 的`state` 对象应该只包含可以被序列化的信息，因此DOM元素之类的并不适合放入状态对象中
    
    <aside>
    💡 注意：使用HTML5管理状态时，要确保通过`pushState()` 创建的每个”假“的URL背后都对应着一个服务器上真实的URL，否则单机”刷新“按钮会导致404错误，所有单页应用程序（SPA）框架都必须通过服务器或客户端的某些配置解决这个问题
    
    </aside>