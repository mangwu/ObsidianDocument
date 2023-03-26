# 2. 操作地址（Manipulation the Location）

可以通过`location` 对象修改浏览器的地址，修改地址的方式如下

# 2.1 使用`location.assign()`

- `assign()` 接受一个URL，调用后会将当前页面导航到指定的URL资源，同时在浏览器**历史记录中增加一条记录**
- 如果给`location.href` 或者`window.location` (可当作字符串使用)设置一个URL，这相当于同一个URL值调用`assign()` 方法
- 这三种方法本质上都是使用`location.assign()` 导航入指定URL页面，如下
    
    ```jsx
    // 三种等价的导航方式
    window.location.assign("https://example.com");
    
    window.location = "https://example.com";
    
    location.href = "https://example.com";
    ```
    
    - 三种方式中，`location.href` 最常用

# 2.2 修改`location`属性

- 修改`location` 对象的属性也会修改当前加载的页面，其中hash,search,hostname,pathname和port属性被设置为新值后都会修改当前URL，如下
    
    ```jsx
    // 假设当前地址为"https://developer.mozilla.org/en-US/docs/Web/API/Location"
    
    // 将URL修改为"https://developer.mozilla.org/en-US/docs/Web/API/Location#examples"
    location.hash = "#examples"
    
    // 将URL修改为"https://developer.mozilla.org/en-US/docs/Web/API/Location?q=javascript#examples"
    location.search = "?q=javascript"
    
    // 把URL修改为"https://developer.mozilla.org/zh-CN/docs/Web/API/Location?q=javascript#examples"
    location.pathname = "/zh-CN/docs/Web/API/Location"
    
    // 把 URL修改为 "https://developer.mozilla.org:443/zh-CN/docs/Web/API/Location?q=javascript#examples"
    location.port= "443" // 因为https协议端口默认为443所以地址栏不会显示，打印location.port仍然是空字符串
    
    // 把URL修改为"https://www.baidu.com/zh-CN/docs/Web/API/Location?q=javascript#examples"
    location.hostname = "baidu.com"
    ```
    

<aside>
💡 注意：上面所有的修改属性操作都会在浏览器历史中增加一条记录，也就是说可以通过点击浏览器地址栏左边的”back“按钮导航到修改URL之前的状态并重新加载URL

</aside>

# 2.3 使用`location.replace()`

- 这个方法也用于接受一个URL，调用后会将当前页面导航到指定的URL资源，与之前的方法唯一区别在于它**不会增加历史记录**
- 这就意味着调用`location.replace()` 的页面导航到新URL地址后，无法通过地址栏左边的后退按钮回到调用`replace()` 的URL页面
    
    ```jsx
    location.replace("https://baidu.com"); // 当前页面a导航进入百度首页，但是无法通过后退按钮回到页面a
    ```
    
    - 后退按钮不能回到页面a，不代表后退按钮无效。它仍然能点击回退到页面a的上一个页面，直到历史记录栈中的栈底页面

# 2.4 使用`location.reload()`

- 不接受任何参数， 直接调用，**重新加载**当前显示的页面，所谓的重新加载有如下含义
    - 页面会以最有效的方式重新加载
    - 即如果页面自上次请求以来没有修改过，浏览器可能从缓存中加载页面
    - 如果想强制从服务器重新加载，就可以调用`location.reload(true)` ，给重新加载方法传递一个`true`
        - `reload()` 在HTML规范中是不需要参数的
        - 实际上传入布尔值是火狐浏览器支持的一个非标准`forceGet` （强制获取）的实现
        - 所以无需因此而传入`true` ，不是所有浏览器都支持强制从服务器重新加载，详情查看**[MDN-reload](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/reload)**
- 注意`reload()` 不会为当前窗口的历史记录中添加一次URL记录，它仅表示重新加载页面（刷新页面）
    
    ```jsx
    location.reload();
    console.log("123"); // 未知是否执行
    ```
    
    - 脚本中位于`reload()` 调用之后的代码可能执行也可能不执行（上面在`reload()` 后的打印未知）
    - 具体是否执行后续代码取决于网络延迟和系统资源等因素，因此最好把`location.reload()` **作为最后一行代码**