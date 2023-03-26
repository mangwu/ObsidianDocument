# 8. 安全上下文（Secure contexts）

# 定义

- 安全上下文（Secure contexts）是`Window` 和`Worker` 中满足了最低标准的**身份验证和机密性**（**authentication and confidentiality**）的概念，许多Web API仅能在安全上下文中访问
- 安全上下文的主要目标是防止**中间人攻击者**（[MITM attackers](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)）访问强大的接口，从而导致更加严重的破坏

# 为什么要限制Web API的功能

- 因为一些Web API的功能非常强大，能给攻击者更强的能力以及更多的操作：
    - 侵犯用户隐私（privacy）
    - 获得对用户计算机的低级访问权限
    - 获得对数据的访问权限，例如**用户凭证**（**user credentials**）

# 什么时候上下文是安全的

- 当一个上下文满足安全上下文（[w3c标准](https://w3c.github.io/webappsec-secure-contexts/)）规范中定义的某些最低限度的认证和保密标准时，它是安全的
- 当一个特定的文档是**顶层浏览上下文**（**top-level-browsing-context，基本是一个包含窗口<containing window>或选项卡**）的[活动文档](https://html.spec.whatwg.org/multipage/document-sequences.html#active-document)时，这个特定的文档是在一个安全的上下文中
- 例如，在<iframe>中的文档即使通过TLS进行传输，如果它有一个父节点（ancestor，指包含它的）没有通过TLS进行传输，其上下文也不会视为安全
- 需要注意，如果一个不安全的上下文创建了新窗口（例如调用`window.open()` ，无论是否指定`noopener` 参数），那么创建新窗口的文档不安全的事实不会影响新窗口的安全性（也就说不安全上下文可以创建安全的上下文）
    - 这是因为确定一个特点的文档是否在安全上下文中，仅仅需要考虑与之相关的顶层浏览器上下文，而与是否碰巧使用了非安全的上下文来创建它无关
- **本地传递**（**Locally-delivered**）的资源，例如那些带有`http://127.0.0.1` 、`http://localhost` 和 `http://*.localhost`（如[http://dev.whatever.localhost/](http://dev.whatever.localhost/)）和`file://`网址的资源也被认为是安全传递的
- 非本地资源要被认为是安全的，必须满足以下标准
    - 必须通过`https://` 或 `wss://` URL提供服务
    - 用于传送资源的网络信道的**安全属性**（**security properties**）不能是废弃的

# 特性检测

页面可以通过暴露在全局范围的 `[isSecureContex](https://developer.mozilla.org/zh-CN/docs/Web/API/isSecureContext)t` 布尔属性值真假来判断它是否处于安全上下文中。

```jsx
if(window.isSecureContext) {
	// 页面在安全上下文，service Worker可用
	navigator.serviceWorker.register("/offline-worker.js").then(() => {
    // …
  });
}
```