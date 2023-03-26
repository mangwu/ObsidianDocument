# 2. location 对象

`location`是最有用的BOM对象之一，只读不可配置的访问器属性，提供了当前窗口中加载的**文档的信息（document information）,**以及通用的**导航功能**（**navigation functionality**）

`location` 的特殊之处在于

- 它既是`window` 的属性，也是`document` 的属性，`window.location` 和`document.location` 指向同一个对象
- 虽然`window.location` 是一个只读属性，但也可以给它赋值为一个字符串，这意味着在大多数情况下`window.location` 可以当做一个字符串使用，`location='http://www.example.com'` 和`location.href='http://www.example.com'` 是相同的

`location` 除了保存着当前加载文档的信息，也保存着把URL解析为离散片段后能够通过属性访问的信息，如下是谷歌浏览器中**可枚举的`location`自有属性**

![locationpng.png](2%20location%20%E5%AF%B9%E8%B1%A1/locationpng.png)

`location` 保存的URL解析的离散片段或者说`location` 的属性以`http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents` 为例子的具体值表格如下

| 属性 | 值 | 说明 |
| --- | --- | --- |
| location.href | “http://www.wrox.com:80/WileyCDA/?q=javascript#contents” | 当前加载页面的完整URL（不包括遗弃的用户名和密码），location 对象的 |
| location.origin | “http://www.wrox.com:80” | URL的源地址，只读，源地址包括URL使用的协议，协议后接的”://”字符串，以及后接的域名和端口号，这里没有显示(指《JavaScript高级程序设计（第4版）》)是因为在http协议中端口号一般（默认）都为80和443，而这两个端口在浏览器网址上不再显示（如果是本地具有端口的服务是要包含端口号的） |
| location.protocol | “http:” | 页面使用的协议，通常是”http:”和”https:” |
| location.username | “foouser” | 域名前指定的用户名，在域名中直接显示不安全，已被HTML标准舍弃，主要浏览器的location.username 已不再被实现，不要使用 |
| location.password | “barpassword” | 域名前指定的密码，在域名中直接显示不安全，已被HTML标准舍弃，主要浏览器的location.password 已不再被实现，不要使用 |
| location.host | “www.wrox.com:80” | URL的服务器名和端口号（在现代浏览器中一般都是wrox.com，因为地址栏只会显示域名，而省去www和默认的80端口号） |
| location.hostname | “www.wrox.com” | 服务器名称（域名，现代浏览器中一般都是wrox.com，因为地址栏只会显示域名，而省去www） |
| location.port | “80” | 端口号，如果URL中没有端口号，则返回空字符串 |
| location.pathname | “/WileyCDA/” | URL中的路径（directory） 和/或 文件名（filename），它以”/”开头，后面跟着URL路径，不包括查询字符串和片段 |
| location.search | “?q=javascript” | URL的查询字符串，这个字符串以问号开头，然后是以key=value 形式的query字符串并通过&连接多个query字符串，如?a=b&d=c |
| location.hash | “#contents” | URL散列值（hash，井号后跟零或多个字符），如果没有就是空字符串 |
- 下面的一个图像化网站更能说明location的属性，并且它以及舍弃了对不再是标准的username和password的解释

[https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/API/Location/_sample_.location_anatomy.html](https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/API/Location/_sample_.location_anatomy.html)

# 2.0 MDN-location的方法

[2.0 location 方法（method）](2%20location%20%E5%AF%B9%E8%B1%A1/2%200%20location%20%E6%96%B9%E6%B3%95%EF%BC%88method%EF%BC%89.md)

# 2.1 查询字符串（**Query String Arguments**）

[2.1 查询字符串（Query String Arguments）](2%20location%20%E5%AF%B9%E8%B1%A1/2%201%20%E6%9F%A5%E8%AF%A2%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%88Query%20String%20Arguments%EF%BC%89.md)

# 2.2 操作地址（Manipulating the Location）

[2. 操作地址（Manipulation the Location）](2%20location%20%E5%AF%B9%E8%B1%A1/2%20%E6%93%8D%E4%BD%9C%E5%9C%B0%E5%9D%80%EF%BC%88Manipulation%20the%20Location%EF%BC%89.md)