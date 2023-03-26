# 3. navigator 对象

`window.navigator` 对象最早是由Netscape Navigator 2 引入浏览器的，现在已成为**客户端标识浏览器**（**browser identification on the client** ）的标准（HTML标准）

只要浏览器启用了JavaScript，`navigator` 对象就一定存在

与其它BOM对象一样，`navigator` 对象中的属性取决于浏览器的实现，但是不同浏览器对`navigator` 的实现有相似之处，主要参考[HTML标准](https://html.spec.whatwg.org/multipage/system-state.html#the-navigator-object)

以下是谷歌和火狐两大浏览器的`navigator`自有属性

![chrome navigator.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/chrome_navigator.png)

![firefox-navigator.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/firefox-navigator.png)

- 可以发现，相较于谷歌浏览器，火狐浏览器的`navigator` 对象属性会**少一些**

# 3.0 HTML标准和MDN-navigator解释

## 3.0.1 `navigator` 的定义

- `Navigator` 接口表示**用户代理**的**状态**和**标识**（**state** and **identity** of the **user agent**），它允许脚本查询它并注册自己以执行一些活动
- 一个`Navigator` 对象通过`window.navigator` 获得，`window.navigator` 是一个只读属性

> “每个窗口都有一个关联的**导航器**（**Navigator**）,这个导航器就是用`Navigator` 接口定义的一个`Navigator` 对象，在创建`Window` 对象时，必须将窗口关联的**导航器**（**Navigator**）设置为在`Window` 对象的相关域中创建的新`Navigator` 对象” ——[HTML Standard # the-navigator-object](https://html.spec.whatwg.org/multipage/system-state.html#the-navigator-object)
> 

## 3.0.2 HTML标准中导航器接口

- HTML标准中定义了`Navigator` 接口的实现的伪代码，《JavaScript高级程序设计（第4版）》所述的`NavigatorID` ，`NavigatorLanguage` 等接口定义的属性和方法便引用它
    
    ```jsx
    interface Navigator {
    	// 实现此接口的对象也实现下面给出的接口
    }
    Navigator includes NavigatorID;
    Navigator includes NavigatorLanguage;
    Navigator includes NavigatorOnLine;
    Navigator includes NavigatorContentUtils;
    Navigator includes NavigatorCookies;
    Navigator includes NavigatorPlugins;
    Navigator includes NavigatorConcurrentHardware;
    ```
    
- 实现`Navigator` 接口的`window.navigator` 对象实现了上述表示不同的用户代理状态的7个子接口，它们的接口属性如下

### 3.0.2.1 NavigatorID

- `NavigatorID` 接口表示**客户端标识**（**Client identification**）

```jsx
[Exposed=Window]
interface mixin NavigatorID {
  readonly attribute DOMString appCodeName; // constant "Mozilla"
  readonly attribute DOMString appName; // constant "Netscape"
  readonly attribute DOMString appVersion;
  readonly attribute DOMString platform;
  readonly attribute DOMString product; // constant "Gecko"
  [Exposed=Window] readonly attribute DOMString productSub;
  readonly attribute DOMString userAgent;
  [Exposed=Window] readonly attribute DOMString vendor;
  [Exposed=Window] readonly attribute DOMString vendorSub; // constant ""
};
```

- `readonly`表示只读，`attribute` 表示属性，`DOMString`表示文档字符串，`[Exposed=Window]` 表示接口的实例只能在主线程中使用，不能在worker中使用
- 这些接口的属性或方法在`window.navigator` 对象中被实现，如下

| 属性/方法 | 说明/描述 |
| --- | --- |
| appCodeName | 即使在非Mozilla浏览器（详情查看../1%20%E4%BB%80%E4%B9%88%E6%98%AFJavaScript.md）中也会返回固定字符串”Mozilla”;MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除 |
| appName | 浏览器全名，返回固定值“Netscape”（就是网景浏览器，查看../1%20%E4%BB%80%E4%B9%88%E6%98%AFJavaScript.md）；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除 |
| appVersion | 浏览器版本，通常与实际的浏览器版本不一致；火狐浏览器（版本 Firefox 107.0 (20221110173214)）返回字符串"5.0 (Windows)”，谷歌浏览器（版本 107.0.5304.107（正式版本） （64 位））返回字符串“5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36”MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除（并且这个属性不准确） |
| platform | 返回浏览器允许的系统平台，它是一个标识用户浏览器的平台的字符串，如"MacIntel"， "Win32"， "Linux x86_64"， "Linux x86_64”；在window10操作系统上，火狐和谷歌都返回固定值”Win32”；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除；一般而言，不要依赖这个属性来查找用户环境信息，而应该编写进行特性检测的代码 |
| product | 返回产品（浏览器内核）名称，它是一个固定值“Gecko”（详情查看../1%20%E4%BB%80%E4%B9%88%E6%98%AFJavaScript.md）；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除 |
| productSub | 返回产品的额外信息，通常是Gecko版本，或者当前浏览器的构建号码（build number），火狐浏览器返回"20100101”，谷歌浏览器返回”20030107“（明显二者都是一个日期，应该表示浏览器项目第一个版本构建的日期），苹果Safari浏览器也返回“20030107”；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除；https://html.spec.whatwg.org/multipage/system-state.html#concept-navigator-compatibility-mode中表示这个值只有上面的两种，如果导航器兼容模式（navigator compatibility mode，枚举值）是chrome或WebKit时返回”20030107”,是Gecko时返回”20100101” |
| userAgent | 返回浏览器用户代理字符串；https://html.spec.whatwg.org/multipage/system-state.html#client-identification提示，用户代理字符串应该包含导航器兼容模式（枚举值，chrome，WebKit或Gecko）；MDN提示，要求浏览器通过该字段提供尽可能少的信息，并且开发者不要假定该属性的值在浏览器的未来版本中不会改变，尽量别使用这个属性，或者只在浏览器的当前和过去版本中使用，无法保证浏览器使用的用户代理就是这个属性值，因为只要浏览器用户愿意，他们可以更改这个字段的值（UA欺骗）；谷歌浏览器该字符串为“Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36”（仅比appVersion多一个Mozilla/），火狐浏览器该字符串为“Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0” |
| vendor | 返回浏览器厂商名称，它的值总是”Google Inc.“ ，”Apple Computer, Inc.”或空字符串，谷歌浏览器返回的就是'Google Inc.’，苹果的Safari浏览器返回的就是”Apple Computer, Inc.“，火狐浏览器返回的就是空字符串（火狐浏览器自诩开源，非某一个厂商开发）；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除 |
| vendorSub | 返回浏览器厂商的更多信息，在任何浏览器中，它都是固定值空字符串；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除 |
- 可以发现**NavigatorID** 接口下的属性除了`userAgent` 还可以使用外，其它的都不再被推荐使用，仅是做兼容性考虑
- 并且`userAgent` 也是用户可以自有更改的，尽量也不要使用它来获取用户浏览器信息

**注意-navigator标识为什么有些属性是假值**

- `window.navigator.appVersion` ，`window.navigator.appName` `window.navigator.appCodeName`以及`window.navigator.userAgent` 属性都是假值，它们并不能正确表示用户浏览器的版本，名称，用户代理状态和标识等
- 这是因为这些属性在“**浏览器嗅探**（**browser sniffing，**就是确定访问者使用的网页浏览器）”代码中使用：这些使用它们（NavigatorID 属性）的脚本试图找出用户正在使用的浏览器类型，然后据此调整页面；这会导致不同浏览器显示的页面不一样，浏览器为了**避免被一些网站锁定**，不得不返回这些属性的假值

**注意-navigator.userAgent的使用**

- `window.navigator.userAgent` 是导航器标识（NavigatorID ）接口中有作用的属性
- 它可以指定浏览器在HTTP请求**报头**（**headers**）以及请求响应（**response**）的报头中指定完整的用户代理字符串，并且它也可以为`window.navigator` 对象的其它方法提供有用信息
    
    ![requestHeaders.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/requestHeaders.png)
    
- 用户代理字符串的构造有一个具体正式的构造结构（**formal structure**），它可以被**分解**（**decomposed**）成如下几个信息片段，这些信息的每一个部分都来自于可被用户设置`Navigator`接口的的其它属性；基于**Gecko内核**的浏览器的用户代理由遵循以下一般结构
    
    ```jsx
    userAgent = appCodeName/appVersion number (Platform; Security; OS-or-CPU;
    Localization; rv: revision-version-number) product/productSub
    Application-Name/Application-Name-version
    ```
    
    - 基于Gecko内核的浏览器就是火狐浏览器，它的用户代理字符串为
        
        ```jsx
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0"
        ```
        
        - appCodeName ：`Mozilla`
        - appVerson：`5.0 (Windows)` （这里使用appVerson的number `5.0`）
        - platform: `Win32`
        - oscpu: `Windows NT 10.0; Win64; x64` （这里似乎直接使用了整个oscpu）
        - product：`Gecko`
        - productSub：`20100101`
        
        ---
        
        - 上述的Security应该指~~`Navigator.securitypolicy`~~ 该属性已被废弃
        - revision-version-number,指修订版本，应该指火狐浏览器当前的版本
        - Application-Name 指”真实”的`appName` (Firefox)
        - Application-Name-version 指”真实”的`appVerson` (107.0)
        
        ---
        
        - 所谓的“真实”指在用户没有修改浏览器用户代理时的默认浏览器信息
- 基于Blink内核的浏览器为谷歌浏览器，它的默认用户代理为
    
    ```jsx
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'
    ```
    
    - 这里的格式就是`navigator.appCodeName/navigator.appVersion`
    - 谷歌浏览器的`navigator`没有`oscpu` 属性，`appVerson` 包含浏览器所在的操作系统的信息和浏览器本身的内核信息
    - 因为谷歌使用的Blink内核基于苹果的AppleWebKit内核，并且WebKit内核的规范来自KHTML，所以这里内核信息显示的是`AppleWebKit/537.36 (KHTML, like Gecko)`
    - 最后的浏览器信息既显示了谷歌（Chrome）的真实`appName` 名称和真实`appVerson` 版本，和苹果浏览器（Safari）的真实`appName` 名称和真实`appVersion`版本

**注意-`navigator.platform` 的唯一用处**

- 虽然为了**特征检测**（**[feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)**）应该避免使用`naigator.platform` ，但是在一种情况下，它可能还是有用处的
    - 当需要向用户显示关于键盘快捷键的**修饰符键**（**`metaKey`d**）需要使用`navigator.platform` 进行判断
    - 因为苹果系统上的修饰符键盘是`⌘` (**command key**)，但是标准PC的修饰符键为`⊞` (**Windows key**)
        
        ```jsx
        let modifierKeyPrefix = "⊞"; // Windows key
        if(navigator.platform.indexOf("MAC") === 0 || navigator.platform === "iPhone") {
        	modefierKeyPrefix = "⌘"; // Command Key
        }
        ```
        

**注意-火狐浏览器关于`NavigatorID` 接口的额外属性和方法**

- HTML标准中关于**导航器兼容模式为*Gecko***时，浏览器的`NavigatorID` 接口额外实现如下属性和方法
    
    ```jsx
    partial interface mixin NavigatorID {
    	[Exposed=Window] boolean taintEnabled(); // constant false
    	[Exposed=Window] readonly attribute DOMString oscpu; 
    }
    ```
    
- 只可以在火狐浏览器（基于Gecko内核）中查看`taintEnabled`方法，其中`taintEnabled` 是原型方法，固定返回`false`
    - `taintEnabled` 方法是网景公司在JavaScript1.2中使用的一种安全方法，在火狐浏览器中它仅为了兼容性适应于非常旧的脚本
    - MDN提示这个方法**不再被推荐使用，**因为在任何浏览器中，保留此属性只是为了**兼容性（compatibility）**的目的，未来该属性可能被删除
- `navigator.oscpu` 也只能在基于Gecko内核的浏览器中存在，它返回一个标识当前浏览器所处操作系统的的字符串，具体的操作系统和`oscpu` 对应为
    
    
    | 操作系统 | oscpu字符串格式 |
    | --- | --- |
    | OS/2 | OS/2 Wrap x (3,4或4.5) |
    | Windows CE | WindowsCE x.y (微软操作系统版本) |
    | Windows 64-bit(64-bit build) | Windows NT x.y; Win64; x64 (x.y微软操作系统版本，如10.0) |
    | Windows 64-bit(32-bit build) | Windows NT x.y; WOW64 (x.y微软操作系统版本，如7.0) |
    | Windows 32-bit | Window NT x.y |
    | Mac OS X (PPC build) | PowerPC Mac OS X version x.y |
    | Mac OS X (i386/x64 build) | Intel Mac OS X or macOS version x.y |
    | Linux 64-bit (32-bit build) | Output of uname -sfollowed by i686 on x86_64 |
    | Linux | Output of uname -sm |
    - MDN提示这个方属性**不再被推荐使用，**因为在任何浏览器中，保留此属性只是为了**兼容性（compatibility）**的目的，未来该属性可能被删除

### 3.0.2.2 **NavigatorLanguage**

- `NavigatorLanguage` 接口表示浏览器的语言首选项（****Language preferences****）

```jsx
interface mixin NavigatorLanguage {
	readonly attribute DOMString language;
	readonly attribute FrozenArray<DOMString> languages;
}
```

- `FrozenArray<DOMString>` 表示一个固定大小不能被修改的字符串数组（该数组的值，属性，可枚举性，可配置性，可写性都不能被修改）

| 属性/方法 | 说明/描述 |
| --- | --- |
| language | 返回浏览器的主语言,通常就是浏览器UI使用的语言；MDN提示https://datatracker.ietf.org/doc/html/rfc5646 标准规范了各个国家的语言简称，如中文就使用字符串”zh-CN”，美式英文就是”en-US”等，Safari浏览器有可能使用全小写，如”zh-cn”, “en-us” |
| languages | 返回浏览器偏好的语言数组，这个数组是固定的字符串数组，由一些使用RFC 5646规范的语言简称字符串组成，如['zh-CN', 'zh'] ,它的第一个元素就是navigator.language ;MDN提示它的值发生改变时，用户偏好的语言变化会导致languagechange 事件发生在window对象上 |

**注意-languages数组中的语言都是浏览器可以切换成的语言**

- 火狐浏览器支持切换切换和添加语言，例如下载的火狐浏览器（105.0.2(64位),简体中文版），它的语言选项有6种，如下
    
    ```jsx
    [ "zh-CN", "zh", "zh-TW", "zh-HK", "en-US", "en" ]
    ```
    
    - 它们分别表示：中文（中国大陆），中文（zh），中文（台湾地区），中文（中国香港），英语（美国），英文（en）
    - 同时可以在火狐浏览器的常规设置中找到切换首选语言的页面，如下
        
        ![page-languages.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/page-languages.png)
        
    - 如果在这里添加日语，打印出来的`navigator.languages`就会新增一个”ja”，如下
        
        ```jsx
        [ "zh-CN", "zh", "zh-TW", "zh-HK", "en-US", "en", "ja" ]
        ```
        
        ![ja.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/ja.png)
        
- 除此之外，在HTTP请求报头和中，HTTP header的`Accept-Language` 属性会使用`navigator.languages` 属性值，并且后面还会增加一个额外的质量值（quality values）字段
    
    ![accept language.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/accept_language.png)
    
    - q表示用户对该范围指定的语言偏好估计。例：zh-CN,zh;q=0.9,en-US,en;q=0.8,意味着我更喜欢中文，但是英语也可以接受，中文为第一语言，英文则为第二语言。
    - 所以上面的q值按照语言顺序依次递减

### 3.0.2.3 NavigatorOnLine

- 这个接口表示浏览器联网状态（****Browser State****）

```jsx
interface mixin NavigatorOnline {
	readonly attribute boolean onLine;
}
```

| 属性/方法 | 说明/描述 |
| --- | --- |
| onLine | 返回布尔值，表示浏览器是否联网；在浏览器联机(online)时为true ,在浏览器脱机（offline）时为false ；每当浏览器连接网络的能力发送变化时，这个属性都会发送更新，它的改变发送在用户在浏览器中点击链接或者脚本发送网络请求时，例如用户在失去浏览器网络连接后不久点击链接，该属性返回false |

**注意-不同浏览器有不同的实现方式**

- 基于WebKit的谷歌和Safari浏览器
    - 如果浏览器不能连接到局域网（LAN）或者路由器（router），onLine属性就是`false`( 离线状态 )
    - 除此之外的其它情况，onLine属性是`true` （在线状态）
    
    ---
    
    - 这种实现方式保证当`navigator.onLine`返回`false` 时，可以假定用户环境是没有网络连接的
    - 但是无法保证在`navigator.onLine` 返回`true` 时，浏览器一定能访问**Internet** ，因此可能产生误报
    - 例如在计算机正在运行的虚拟化软件（**virtualization software**）具有一个始终“连接”的**虚拟以太网适配器**（**virtual ethernet adapters**），这种情况下实际上浏览器不一定能访问**Internet** ，但是`onLine` 仍然为`true`
    
    ---
    
    - 确定浏览器是否处于在线状态需要开发额外的检查方法
- 火狐浏览器和IE浏览器
    - 将浏览器切换到**脱机模式**（**offline mode**）时才会发送`onLine` 属性为`false` 的更新
    - 在火狐41之前，除此之外的其它情况`onLine` 都是`true`
    - 在Windows操作系统上测试的火狐Nightly68版本的`onLine` 属性，它的行为和谷歌/Safari一样寻找局域网连接后给出假`true` 值

**注意-网络连接触发事件**

- `navigator.onLine` 的更新的同时，浏览器也会触发网络连接更新的事件
    - `online` 事件：当浏览器能访问网络，且`navigator.onLine` 的值被设置为`true` 时，`Window` 接口的`online` 事件被触发
    - `offline` 事件：当浏览器不能访问网络，且`navigator.onLine` 的值被设置为`false` 时，`Window` 接口的`offline` 事件被触发

### 3.0.2.4 **NavigatorContentUtils**

- **`NavigatorContentUtils`** 接口用于自定义协议处理程序（****Custom scheme handlers****）

```jsx
interface mixin NavigatorContentUtils {
	[SecureContext] undefined registerProtocolHandler(DOMString scheme, USVString url);
	[SecureContext] undefined unregisterProtocolHandler(DOMString scheme, USVString url);
};
```

- [SecureContext]表示这两个方法仅能在安全上下文（HTTPS）使用，安全上下文是Web API需求的最小最低标准的身份验证和机密性的安全概念，关于安全上下文可以查看**[MDN-Secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)**
- `undefined` 表示这个两个方法的返回值为`undefined`
- **`USVString`** 对应于所有可能的 **unicode标量值**序列的集合。

| 属性/方法 | 说明/描述 |
| --- | --- |
| registerProtocolHandler | 将一个网站注册为特定协议的处理程序；MDN提示这个方法能够注册拥有处理特定URL协议（schemes或者protocols）的能力，例如这个方法能让网页版邮箱拥有打开mailto: URL的能力，或让VoIP网站拥有打开tel: URL的能力 |
| unregisterProtocolHandler | 与上面的方法对立，用于注销一个网址注册过的特定协议的处理程序；MDN没有与这个相关的方法，因为大多数环境没有支持这个方法（火狐浏览器没有支持） |

`**navigator.registerProtocolHandler**`

- 语法
    
    ```jsx
    navigator.registerProtocolHandler(scheme, url);
    navigator.registerProtocolHandler(scheme, url~~, title~~)
    ```
    
    - 参数
        
        `scheme` : 字符串，包含当前站点希望处理的**允许的协议**（**permitted scheme for the protocol**），例如可以传入”sms”以注册当前站点能够处理SMS文本信息链接
        
        `url` : 字符串，包含**处理程序**（**handler**）的URL，此`url` 必须包含`%s` 作为**占位符**（**placeholder**），这个占位符会被要处理的转义URL替换；并且这个处理程序URL必须使用`https`协议，老版本的浏览器支持`http` ；一个可用的例子为”https://burgers.example.com/?burger=%s"，它支持`web+burger` 协议（第一个参数）
        
        `~~title~~` ： 便于开发者可读的处理程序标题字符串，这个字符串会显示给用户，例如“Allow this site to handle [scheme] links?”（允许此站点处理【协议】链接），或在浏览器的设置中列出已注册的处理程序；由于`title` 可以自定义，浏览器用户可能因此受到欺骗，所以该`title`已被规范删除；但是一些浏览器仍然至此它
        
    - 返回值：`undefined`
    - 异常：
        
        `SecurityError` `[DOMException](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)` ：安全异常，用户代理阻塞了注册（registration），可能情况如下
        
        - 注册的协议（scheme or protocol）无效，例如浏览器自己处理的协议（https:，about:等）
        - 处理程序URL的源与调用此API的页面源不匹配（域名不同导致的安全问题）
        - 浏览器要求从安全上下文调用此方法（当前文档不在安全上下文中）
        - 浏览器要求处理程序的URL使用HTTPS协议
        
        `SyntaxError` `DOMException` : 语法异常，最常见的情况是处理程序的URL没有使用`%s` 
        
- 支持的协议
    
    出于安全考虑，`registerProtocolHandler()` 限制了哪些协议是可用的
    
    - **自定义协议**（**custom scheme**）,只要遵循以下书写原则就可用
        - 自定义协议的名称以“**web+**”开头
        - 自定义协议的名称在“**web+**”前缀后至少有一个字符
        - 自定义协议的名字只有**小写的ASCII字母**
    - 除此之外，一些公用协议如下
        - `bitcoin`
        - `ftp`，`ftps` ，`sftp`
        - `geo`
        - `im`
        - `irc` ，`ircs`
        - `magnet`
        - `mailto`
        - `matrix`
        - `mms`
        - `news`
        - `nntp`
        - `openpgp4fpr`
        - `sip`
        - `sms`
        - `smsto`
        - `ssh`
        - `tel`
        - `urn`
        - `webcal`
        - `wtai`
        - `xmpp`
- 例子，如果你的站点是`burgers.example.com` ，可以注册一个**协议处理程序**（**protocol handler**），来处理自定义的`web+burger` 链接，如下
    
    ```jsx
    navigator.registerProtocolHandler("web+burger", "https://burgers.example.com/?burger=%s", "Burger handler"); // 第三个参数是为了兼容性而写
    ```
    
    - 这相当于创建了一个处理程序，这个处理程序让`web+burger:` 自定义的协议链接能够将用户发送到注册协议的站点
    - 此脚本必须从与处理程序的URL相同的源上运行（即`https://burgers.example.com/`），并且处理程序的URL必须是http或https
    - 用户将会接收到通知：您的代码正在注册协议处理程序，以便它们决定是否允许它，如下
        
        ![firefox registerProtocolHandler().gif](3%20navigator%20%E5%AF%B9%E8%B1%A1/firefox_registerProtocolHandler().gif)
        
        - 上面是火狐浏览器的注册时的允许提示，一旦同意之后再注册就不会出现提示框
        
        ![Untitled](3%20navigator%20%E5%AF%B9%E8%B1%A1/Untitled.png)
        
        - 谷歌浏览器也有注册协议时给用户的提示

`**navigator.unregisterProtocolHandler**`

- 与`navigator.registerProtocolHandler` 对立的方法，用于**注销**（**Unregisters**）一个网址注册过的特定协议的处理程序
- 语法和`registerProtocolHandler` 参数一样，如下
    
    ```jsx
    navigator.unregisterProtocolHandler(scheme, url);
    ```
    
    - 参数
        
        `scheme` : 字符串，包含当前站点希望**注销**处理程序的**协议**，例如可以传入”sms”以注销当前站点能够处理SMS文本信息链接的能力
        
        `url` : 字符串，包含**要注销**的**处理程序**（**handler**）的URL，此`url` 必须包含`%s` 作为**占位符**（**placeholder**），这个占位符会被要处理的转义URL替换；并且这个处理程序URL必须使用`https`协议，老版本的浏览器支持`http` ；一个可用的例子为”https://burgers.example.com/?burger=%s"，它支持`web+burger` 协议（第一个参数）
        
    - 返回值 `undefined`
- 因为火狐浏览器（107 64bit正式版）目前并不支持这个方法，所以只能以谷歌浏览器作为例子
    
    ![chrome unregisterProtocolHandler().gif](3%20navigator%20%E5%AF%B9%E8%B1%A1/chrome_unregisterProtocolHandler().gif)
    
    - 首先在当前站点上注册`web+developer` 自定义协议，弹出对话框提示是否允许，再次注册时不会弹出因为已经注册过了
    - 然后使用`navigator.unregisterProtocolHandler` 注销刚才注册的`web+developer` 协议处理程序，第三次注册协议，发现又弹出了对话框提示是否允许，说明注销协议处理程序的时候是成功注销的

### 3.0.2.5 NavigatorCookies

- 此接口表示浏览器的`Cookies` 使用状态

```jsx
interface mixin NavigatorCookies {
	readonly attribute boolean cookieEnable;
}
```

- `boolean` 表示`cookieEnable` 是布尔值

| 属性/方法 | 说明/描述 |
| --- | --- |
| cookieEnable | 返回布尔值，表示是否启用cookie |

**注意-现代浏览器的cookie使用状态有多种**

- 现代浏览器可以通过“设置”对cookie的使用状态进行自定义的设置，最基础的有4种，如下是谷歌浏览器的cookie设置
    
    ![chrome cookie sets.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/chrome_cookie_sets.png)
    
    - 允许所有Cookie：就是在任何情况下，站点都可以使用用户浏览器的Cookie API保存站点想要的Cookie信息，以便用户下次进入网址，站点能根据这些Cookie信息知晓用户的状态（如登录状态，主题喜好等），此时`navigator.cookieEnable` 返回的值是`true`
    - **阻止第三方Cookie**（**block third-party cookies**）：第三方Cookie就是当前站点引入的第三方iframe，阻止它使用Cookie会让第三方无法使用Cookie API保存信息，这种设置很好，因为有些恶意的第三方会利用Cookie信息收集用户信息，侵犯用户隐私；在浏览器设置阻止第三方Cookie时，不同浏览器的`navigator.cookieEnable` 在不同的上下文中的返回值不同：
        - 在正常的站点上下文，`navigator.cookieEnable` 返回`true` ，它们还是能使用Cookie
        - 在第三方站点的上下文中访问`navigator.cookieEnable` Safari、Edge Spartan和IE会返回`true` (但是第三方站点仍然不能设置Cookie)，但是在firefox和chrome的浏览器中返回`false`
    - 在无痕模式下阻止第三方Cookie：无痕模式正如上面说述，无痕模式下，网站无法使用Cookie查看在各个不同网站上的浏览活动，这种模式下既能让当前网页使用自己生成的Cookie以提升浏览体验，又能让第三方网址无法获取当前站点Cookie以防止恶意收集利用Cookie；无痕模式可以通过浏览器的右上角的三点工具打开，谷歌浏览器的无痕模式如下
        
        ![Untitled](3%20navigator%20%E5%AF%B9%E8%B1%A1/Untitled%201.png)
        
    - 阻止所有Cookie：浏览器将限制所有站点设置或获取Cookie的操作，完全杜绝站点使用Cookie，这回导致用户浏览时有不好的体验，此时`navigator.cookieEnable` 的值为`false`
- 一个体现“选择阻止第三方Cookie”时，`naigator.cookieEnable` 值变化的例子
    - 先创建一个iframe html文件，当作第三方网页
        
        ```jsx
        <body>
            <h3>第三方iframe</h3>
            <p></p>
            <script>
              const p = document.querySelector("p");
              p.textContent = `navigator.cookieEnable: ${navigator.cookieEnabled}`;
            </script>
          </body>
        ```
        
    - 再创建一个主html文件，引用另一个iframe html文件
        
        ```jsx
        <body>
            <h3>当前页面</h3>
            <p></p>
            <iframe
              src="http://localhost:3000/ch12%20-%20BOM/12.3%20navigator/12.3.0%20navigator%20in%20HTML%20and%20MDN/12.3.0.2%20HTML%20Standard%20NavigatorInterface/12.3.0.2.5%20iframe"
              frameborder="1"
            ></iframe>
            <script>
              const p = document.querySelector("p");
              p.textContent = `navigator.cookieEnable: ${navigator.cookieEnabled}`;
            </script>
          </body>
        ```
        
    - 这里使用`localhost:3000` 是为了让iframe页面与当前页面**不同源**，让浏览器知道当前页面中的iframe页面是第三方网页，在默认的“在无痕模式下阻止第三方Cookie”下的谷歌浏览器如下显示
        
        ![cookieEnable chrome.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/cookieEnable_chrome.png)
        
    - 如果在无痕页面打开这个页面，第三方的`navigator.cookieEnable` 为`false` ，如下
        
        ![无痕模式.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/%25E6%2597%25A0%25E7%2597%2595%25E6%25A8%25A1%25E5%25BC%258F.png)
        
    - 如果设置浏览器为“**阻止第三方Cookie**”，那么在正常浏览器模式下，第三方iframe的`navigator.cookieEnable` 也是`false`
    - 如果设置浏览器为“阻止所有Cookie”，那么任何情况下，`navigator.cookieEnable` 都是`false`

### 3.0.2.6 NavigatorPlugins

- 浏览器支持的插件有关的接口，而浏览器自带的主要插件为对pdf文件查看的支持

```jsx
interface mixin NavigatorPlugins {
	[SameObject] readonly attribute PluginArray plugins;
	[SameObject] readonly attribute MimeTypeArray mimeTypes;
	boolean javaEnable();
	readonly attribute boolean pdfViewerEnable;
}

[Exposed=Window, LegacyUnenumerableNamedProperties]
interface PluginArray {
	undefined refresh();
	readonly attribute unsigned long length;
	getter Plugin? item(unsigned long index);
	getter Plugin? namedItem(DOM String name);
}

[Exposed=Window, LegacyUnenumerableNamedProperties]
interface MimeTypeArray {
	readonly attribute unsigned long length;
	getter MimeType? item(unsigned long index);
	getter MimeType? namedItem(DOMString name);
}

[Exposed=Window, LegacyUnenumerableNamedProperties]
interface Plugin {
	readonly attribute DOMString name;
	readonly attribute DOMString description;
	readonly attribute DOMString filename;
	readonly attribute unsigned long length;
	getter MimeType? item(unsigned long index);
	getter MimeType? namedItem(DOMString name);
}

[Exposed=Window]
interface MimeType {
	readonly attribute DOMString type;
	readonly attribute DOMString description;
	readonly attribute DOMString suffixes;
	readonly attribute Plugin enabledPlugin;
}
```

- `LegacyUnenumerableNamedProperties` :在web IDL（web interface description language，一门描述接口的语言，就是上面HTML标准中用来解释BOM中的对象的描述语言）中，像`item` 这样可以通过`index` 属性来访问的`getter` 方法称为`index properties` ；像`nameItem` 这样可以通过`name` 属性访问的`getter` 方法称为`name properties` ; `[LegacyUnenumerableNamedProperties]` 就是用来描述这个接口中的`name properties` 是不可枚举的，所以使用`Object.getOwnPropertyDescriptor` 查看`nameItem` 对应的集合时，`enumerable` 的值`false`
- 上面的IDL代码这么多实际上有历史遗留的问题
    - 现在可以通过`navigator.pdfViewedEnabled` 属性来检测浏览器对**pdf查看器的支持（PDF viewer support）**
    - 但一些历史原因，有许多复杂且相互交织的接口提供了相同的功能，历史遗留代码依赖这些接口
    - 为了兼容性，现代浏览器都保留了这些接口或属性，但是**最基本**的是：每个用户代理都有一个PDF查看器的是否支持的布尔值属性，它的值由浏览器实现决定（根据用户首选项可能有所不同）；这个PDF查看器支持值也会影响**导航处理模式**（**navigation processing model**）,如下
        
        ![chrome pdf.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/chrome_pdf.png)
        

| 属性/方法 | 说明/描述 |
| --- | --- |
| plugins | 返回浏览器安装的插件数组；HTML标准文档提示：每个Window 对象都有一个PDF 查看器插件对象（PDF viewer plugin objects）列表，如果用户代理的3%20navigator%20%E5%AF%B9%E8%B1%A1.md 是false值，那么这个列表就是空的，否则，这个列表必然包含5个Plugin 对象，它们的名字分别是：0."PDF Viewer" 1."Chrome PDF Viewer" 2."Chromium PDF Viewer" 3."Microsoft Edge PDF Viewer" 4."WebKit built-in PDF" ，上述的列表的值和序号构成了PDF 查看器插件数组（navigator.plugins）的名称和索引属性；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除 |
| mimeTypes | 返回浏览器注册的MIME类型数组；HTML标准文档提示：每个Window 对象都有一个PDF查看器MIME类型对象（PDF viewer mime type objects）列表，如果用户代理的3%20navigator%20%E5%AF%B9%E8%B1%A1.md 是false 值，那么这个列表就是空的，否则，这个列表必然包含2个MimeType 对象，它们的名字分别是：0."application/pdf" 1."text/pdf" ，上述的列表的值和序列构成了PDF查看器MIME类型（PDF viewer mime types）数组（navigator.mimeTypes）的名称和索引属性；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除 |
| javaEnable | 一个方法，固定方法false值；MDN提示这个属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除 |
| pdfViewerEnable | 布尔值，指示浏览器在导航PDF文件时是否支持内联显示PDF文件，它就是HTML标准中说的，浏览器对pdf查看器的支持（PDF viewer support）的属性 |

**注意-理解插件数组**

- `navigator.plugins` 不再被推荐使用，但是有必要理解它的构成和构成元素，谷歌和火狐浏览器具有相同的插件数组，如下
    
    ![navigator.plugins.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/navigator.plugins.png)
    
- 可以发现不算原型[[Prototype]]，它共有11个属性，5个索引属性（`item`）和5个名称属性（`namedItem`），以及一个长度属性（`length` ），由于`[LegacyUnenumerableNamedProperties]` 标识，`PluginArray` 接口实现的名称属性是不可枚举的。
- 五个索引属性和五个名称属性指向的`Plugin` 对象一一对应，所以实际上`navigator.plugins` 只保存了5个不同的`Plugin`对象，如下
    
    ```wasm
    navigator.plugins[0] === navigator.plugins["PDF Viewer"]; // true
    navigator.plugins[1] === navigator.plugins["Chrome PDF Viewer"]; // true
    navigator.plugins[2] === navigator.plugins["Chromium PDF Viewer"]; // true
    navigator.plugins[3] === navigator.plugins["Microsoft Edge PDF Viewer"]; // true
    navigator.plugins[4] === navigator.plugins["WebKit built-in PDF"]; // true
    ```
    
- 在访问这个五个属性时，既可以通过名称进行访问，也可以通过索引进行访问：
    - 在`PluginArray` 接口中通过`namedItem(name)` `getter` 方法进行访问，就是将`navigator.plugins` 中的每个`Plugin` 对象的`plugin.name` 值和中括号语法传入的`name` 属性值进行比较，如果相同就返回这个*plugin* 实例，没有相同的就返回`null`
    - 在`PluginArray` 接口中通过`item(index)` `getter` 方法进行访问，就是比较通过中括号语法传入的`index` 数值和`navigator.plugins.length` ，如果是小于长度的非负数，就返回`navigator.plugins[index]` 指向的*plugin* 实例，否则返回`null`
- 除此之外，`PluginArray` 接口的`refresh()` 方法被调用后，**不做任何事情**

**注意-理解MIME类型数组**

- `navigator.mimeTypes` 不在被推荐使用，它是一个包含`MimeType` 对象的列表，代表浏览器识别和支持的MIME类型，在谷歌和火狐浏览器中，它的内容如下
    
    ![navigator.mimeTypes.png](3%20navigator%20%E5%AF%B9%E8%B1%A1/navigator.mimeTypes.png)
    
- `MimeTypeArray` 接口支持两个名称属性（`namedItem` ）和两个索引属性（`item`）,以及一个长度属性；由于`[LegacyUnenumerableNamedProperties]` 标识，`MimeTypeArray` 接口实现的名称属性是不可枚举的
- 两个索引属性和两个名称属性指向的`Plugin` 对象一一对应，所以实际上`navigator.mimeTypes` 只保存了2个不同的`MimeType` 对象
    
    ```jsx
    navigator.mimeTypes[0] === navigator.mimeTypes["application/pdf"] // true
    navigator.mimeTypes[1] === navigator.mimeTypes["text/pdf"] // true
    ```
    
- 访问这两个属性时，既可以通过名称进行访问，也可以通过索引进行访问
    - 在`MimeTypeArray` 接口中通过`namedItem(name)` `getter` 方法进行访问，就是将`navigator.mimeTypes`中的每个`MimeType` 对象的`mimeType.type` 值和中括号语法传入的`name` 属性值进行比较，如果相同就返回这个*mimeType*实例，没有相同的就返回`null`
    - 在`MimeTypeArray` 接口中通过`item(index)` `getter` 方法进行访问，就是比较通过中括号语法传入的`index` 数值和`navigator.mimeTypes.length` ，如果是小于长度的非负数，就返回`navigator.mimeTypes[index]` 指向的*mimeType*实例，否则返回`null`

**注意-理解`Plugin`插件接口**

- 现代浏览器实现了`Plugin` ，它属于全局对象（`window`）的属性，表示浏览器插件具有的基本信息，但是在MDN中提示：这个接口**不再被推荐使用，**因为在任何浏览器中，保留此接口只是为了**兼容性（compatibility）**的目的，未来该属性可能被删除
- `window.Plugin` 就是`Plugin` 接口的浏览器实现，它本来作为构造函数用于构造插件实例，但是现在**不能**使用（只为兼容性存在），可以通过`instanceof` 操作符判断`navigator.plugins` 列表中的元素是否是`Plugin`的实例，如下
    
    ```jsx
    navigator.plugins[0] instanceof Plugin; // true
    navigator.plugins[1] instanceof Plugin; // true
    navigator.plugins[2] instanceof Plugin; // true
    navigator.plugins[3] instanceof Plugin; // true
    navigator.plugins[4] instanceof Plugin; // true
    ```
    
- `Plugin` 接口定义了4个属性和两个getter方法，所以 *plugin* 插件对象也有这四个属性和两个方法，如下是具体的属性和`navigator.plugins` 中每个插件对象的属性值
    
    
    | 属性/方法 | 描述 | naigator.plugins[i]对应的属性值 |
    | --- | --- | --- |
    | name | 插件名称 | 0.PDF Viewer 1.Chrome PDF Viewer 2.Chromium PDF Viewer 3.Microsoft Edge PDF Viewer 4.WebKit built-in PDF |
    | description | 插件描述 | 全部返回固定字符串值Portable Document Format  |
    | filename | 插件文件的文件名称 | 全部不返回固定字符串值internal-pdf-viewer  |
    | length | 插件包含的3%20navigator%20%E5%AF%B9%E8%B1%A1.md（PDF viewer mime types）的个数 | 数字 2 |
    | namedItem(name) | Plugin 接口支持名称属性，如果用户代理支持PDF 查看器（navigator.pdfViewerEnable）,那么它们这些名称属性就是3%20navigator%20%E5%AF%B9%E8%B1%A1.md（PDF viewer mime types），否则是空列表 | 每个插件中的PDF查看器MIME类型都相同，包括属性key为application/pdf 的MimeType 对象和key为text/pdf 的MimeType对象。使用中括号语法传入属性名称，相当于调用这个namedItem(name) getter 方法，查找每个MimeType 对象的type 属性值是否和name 相同，相同就返回对应的mimType 对象，没有就返回null |
    | item(index) | Plugin 接口支持索引属性，如果用户代理支持PDF 查看器（navigator.pdfViewerEnable）,那么它们这些名称属性就是3%20navigator%20%E5%AF%B9%E8%B1%A1.md（PDF viewer mime types），否则是空列表 | 每个插件中的PDF查看器MIME类型都相同，它们和上面通过名称属性访问的MimeType 对象一一对应，application/pdf 属性指代的MimeType对象索引为0，text/pdf 属性指代的MimeType 对象索引为1,通过中括号语法调用item(index) getter 方法，获取指定索引的mimeType 对象，如果索引超出范围就返回null |

**注意-理解`MimeType` 接口**

- **MIME type** 现在称为媒体类型（media type），但有时也是内容类型（content type），它是指示文件类型的字符，与文件一起发送，它与Windows上的文件扩展名称有相同目的（是被媒体或内容类型）
- 现代浏览器实现了`MimeType` ，它本可以通过传递`type` 构造一个`MimeType` 实例，但是MDN提示这个接口**不再被推荐使用，**因为在任何浏览器中，保留此接口只是为了**兼容性（compatibility）**的目的，未来该属性可能被删除；`navigator.mimeTypes` 数组中的元素都是`MimeType` 类型的
    
    ```jsx
    navigator.mimeTypes[0] instanceof MimeType; // true
    navigator.mimeTypes[1] instanceof MimeType; // true
    ```
    
- `MimeType` 接口具有4个属性，如下
    
    
    | 属性/方法 | 描述 | naigator.mimeTypes[i]对应的属性值 |
    | --- | --- | --- |
    | type | MimeType 对象的类型，通常格式为content/format | 每个MIME类型中都有自己不同的type：0. application/pdf 1. text/pdf |
    | description | MimeType 对象的描述 | 固定字符串值Portable Document Format |
    | suffixes | MimeType 对象的后缀名称，就是type 中的format  | 固定字符串值pdf |
    | enablePlugin | MimeType 对象的相关全局对象中的PDF查看器Plugin对象 | 一般指名称为”PDF Viewer”的那一个插件，即navigator.mimeTypes[1].enabledPlugin === navigator.plugins[0] 返回true |

### 3.0.2.7 NavigatorConcurrentHardware

- 这个接口用于表示浏览器所在**硬件的并行能力**（ ****Concurrent hardware capabilities****）

```jsx
interface mixin NavigatorConcurrentHardware {
	readonly attribute unsigned long long hardwareConcurrency;
}
```

- `unsigned long long` 表示这个属性是无符号的长整型（8个字节，64位表示）类型

| 属性/方法 | 说明/描述 |
| --- | --- |
| hardwareConcurrency | 返回用户代理可能可用的逻辑处理器（logical processors）数量。https://html.spec.whatwg.org/multipage/workers.html#navigatorconcurrenthardware提示，该属性的getter 方法必须返回一个介于1到用户代理可能可用的逻辑处理器数量之间的数量，如果不能确定，必须返回1 |

**注意-`hardwareConcurrency` 的值并不准确**

- 现代计算机在CPU上通常有多个**逻辑处理器核心**（**physical processor cores**），同时每个**处理器核心**通过**高级调度技术（advanced scheduling techniques）**也经常能跑超过一个的**线程**（**thread**）
    - 举例来说，AMD的锐龙R7 5800H具有8个**处理器核心，**每个核心能跑2个线程，所以具有16个逻辑处理器核心（16线程）
    - 所以`navigator.hardwareConcurrency` 返回的逻辑处理器核心的数量能表明设备最大能在不切换上下文的情况下高效运行的线程个数
- 但是，[HTML提示](https://html.spec.whatwg.org/multipage/workers.html#navigatorconcurrenthardware)用户代理应该错误地暴露可用逻辑处理器的数量，通常而言这个数量应该少于当前设备的最大线程数。[MDN提示](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency#value) 这样做的目的是为了更准确的表示可以同时运行的`[Worker`](https://developer.mozilla.org/en-US/docs/Web/API/Worker) s的数量，因此不要将`navigator.hardwareConcurrency` 的值视为用户系统中的内核数量或线程数量的绝对度量
    - 我这台个人笔记本电脑（Legion R9000P2021H）安装的谷歌浏览器的`navigator.hardwareConcurrency` 的值为16（等于R7 5800H的最大线程数）

---

至此，HTML标准中的`Navigator` 接口定义的属性或方法已介绍完毕，但实际上不同浏览器还**实现了各自不同的属性和方法**，一些属于实验性功能，一些将来可能成为标准

## 3.0.3 w3c以及现代谷歌浏览器`navigator` 对象的提及的属性

- navigator的一些属性可能是[w3c规范](https://github.com/w3c/w3c.github.io/) 或其它Web规范的，如[WebVR API](https://immersive-web.github.io/webvr/spec/1.1/)

| 属性/方法 | 说明 |
| --- | --- |
| activeVrDisplays | 返回数组，包含ispresenting属性为true 的VRDisplay 实例;MDN提示该属性不再是标准且被遗弃了，它是老版本的WebVR API一部分，现代浏览器中已经没有navigator.activeVrDisplays 这个属性（除了安卓火狐） |
| bluetooth | 火狐浏览器没有但是谷歌浏览器有的属性（MDN和HTML标准都没有该属性介绍，但是），该属性返回一个Bluetooth 对象，https://webbluetoothcg.github.io/web-bluetooth/#bluetooth 接口是实验性的非标准接口，接口实现了一些https://webbluetoothcg.github.io/web-bluetooth/#bluetooth 阐述的方法，这些方法用于返回蓝牙设备相关的Promise对象 |
| buildID | 浏览器的构建编号，MDN提示它不是标准且只有火狐浏览器实现了它，火狐浏览器返回一个有关时间的字符串：“20181001000000” |
| canShare() | 返回布尔值，表示指定的数据是否可共享，默认返回false ，可以传入一个data 对象给canShare(data) ，data 的属性有，url （字符串），text （字符串），title （字符串），files （File 对象数组）;如果data 能通过navigator.share() 测试分析成功就返回true ，否则返回false ;MDN提示该方法需要在安全上下文（secure contexts）中才能使用；canShare() 是浏览器的navigator 对象的原型[[Prototype]]上的属性，属于w3c规范的https://w3c.github.io/web-share/#canshare-data-method |
| clearAppBadge() | 异步函数，会返回一个解决的值为undefined的Promise 对象；MDN提示这个属性是实验性（Experimental）的属性，属于w3c的https://w3c.github.io/badging/#clearappbadge-method ，需要在较高版本的浏览器才能使用的位于navigator 原型上的方法，用于清除当前app图标上的标志（bagde） |
| clipboard | clipboard属性返回一个只读的Clipboard 对象，https://w3c.github.io/clipboard-apis/#navigator-clipboard 实现了在web 应用上的剪切，复制和粘贴，可以用clipboard 返回的对象访问系统粘贴板 |
| connection | 返回暴露https://wicg.github.io/netinfo/#connection-attribute的NetworkInformation对象；MDN提示这个属性是实验性（Experimental）的属性，不是正式标准，它包含关于系统连接的，用户设备的带宽（bandwidth），或连接是否被计量（metered）的信息。谷歌和火狐浏览器都实现了这个属性 |
| contacts | 返回暴露https://w3c.github.io/contact-api/spec/#dom-navigator-contacts 的ContactsManager 对象；MDN提示这个属性允许用户从联系人（contact）列表中选择条目，并与网站或引用程序共享所选条目的有限详细信息；同时这个属性是实验性（Experimental）的属性，属于w3c规范的https://w3c.github.io/contact-api/spec/#dom-navigator-contacts ，目前只有部分手机浏览器实现了这个属性（安卓谷歌和安卓欧鹏） |
| credentials | 返回暴露给https://w3c.github.io/webappsec-credential-management/#framework-credential-management 的CredentialsContainer 对象，调用这个对象提过的方法可以请求凭证（credentials）;MDN提示这个属性需要在安全上下文（secure contexts）中才能使用 |
| deviceMemory | 返回单位为GB的设备内存容量（浮点数）；MDN提示这个属性是实验性（Experimental）的属性，并应该在安全上下文（secure contexts）使用，来源https://www.w3.org/TR/device-memory/#sec-device-memory-js-api ，返回的值并不精确，它的值是2的幂，0.25,0.5,1,2,4,8其中一位（本机R9000P2021安装的谷歌浏览器返回了8，实际上设备有16G RAM） |
| doNotTrack | 返回用户不跟踪（do-not-track）的设置，改设置的意思就是用户指示网站和广告商是否跟踪他们。MDN提示该属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除，它是w3c规范https://www.w3.org/TR/tracking-dnt/#dom-navigator-donottrack 的一部分，属性值为”1”,”0”或“unspecified”，火狐和谷歌浏览器都有这个属性，前者返回"unspecified"，后返回null  |
| geolocation | 返回暴露https://w3c.github.io/geolocation-api/#dom-navigator-geolocation的Geolocation对象；MDN提示调用这个对象的方法网页能获取用户设备的位置信息，这也能让网站或app基于位置给用户呈现个性化内容；因为涉及隐私信息，该属性需要在安全上下文（secure contexts）中才能使用；该属性属于w3c规范的https://w3c.github.io/geolocation-api/#dom-navigator-geolocation |
| getVRDisplays() | 返回数组，包含可用的每个VRDisplay实例；MDN提示该方法不再是标准且被遗弃了，没有相关的标准，现代浏览器中已经没有navigator.getVRDisplays这个属性（除了安卓火狐） |
| getUserMedia() | 返回与可用媒体设备硬件关联的流；MDN提示该属性不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除，新代码应该使用MediaDevices.getUserMedia 而不是导航器中的getUserMedia ；大部分浏览器（除了Safari一部分版本）在navigator 的原型（[[Prototype]]）上都保留了这个方法 |
| getBattery() | 异步函数，返回一个解决了的值为BatteryManager 实例的Promise 对象；MDN提示这个BatteryManager 实例是关于系统电池，例如充电状态（charging），充电时间（chargingTme）等，还提供充电状态改变，充电时间改变等事件监控电池状态；该属性属于w3c规范的https://w3c.github.io/battery/#dom-navigator-getbattery ，在现代浏览器较高的版本，需要在安全上下文（secure contexts）中才能使用，有些浏览器（火狐，Safari等）并未实现这个在原型上的方法 |
| getGamepads() | 返回一个数组，每个数组元素都是一个Gamepad对象，它对应设备连接的手柄（gamepad，又称游戏控制器）；如果没有连接手柄设备或会话期间断开连接，数组元素为null ；在现代浏览器较高的版本，需要在安全上下文（secure contexts）中才能使用（但是大部分浏览器没有实现安全上下文需求），本机（R9000P）的谷歌浏览器返回一个长度为4的null 组成的数组（大概可以连接4个手柄）；MDN提示这个navigator 的原型方法属于w3c规范的https://w3c.github.io/gamepad/#dom-navigator-getgamepads； |
| getInstalledRelatedApps() | 异步函数，返回一个解决了的内部值为数组的Promise 对象，其中数组元素是设备已经安装相关应用；这个原型方法仅在谷歌浏览器中存在，不是正式的标准，它可以让浏览器知道某些应用程序是否安装了，这些应用程序可以是安卓应用，windows应用和PWA（浏览器应用）；直接测试调用，内部值为空数组（大概因为隐私问题） |
| hid | 暴露一个https://wicg.github.io/webhid/#dom-navigator-hid 的HID 对象；MDN提示HID 对象用于连接HID设备，列出连接的HID设备，以及设置连接断开HID的事件处理器；这个属性是实验性（Experimental）的属性，属于w3c规范的https://wicg.github.io/webhid/#dom-navigator-hid ，目前只在谷歌，欧鹏，edge等浏览器实现了 |
| keyboard | 暴露一个https://wicg.github.io/keyboard-lock/#h-navigator-keyboard相关的Keyboard 对象；MDN提示Keyboard 对象可以检索设备键盘的布局映射，并感知捕获物理键盘按键的按压与切换；除了火狐和Safari系列浏览器没有实现，较高版本的现代浏览器都实现了这个属性；这个属性是实验性（Experimental）的属性，属于w3c规范的https://wicg.github.io/keyboard-lock/#h-navigator-keyboard |
| locks | 暴露一个https://w3c.github.io/web-locks/#dom-navigatorlocks-locks的LockManager 对象；MDN提示LockManager 对象提供请求新Lock对象和查询现有Lock对象的方法；Lock就是锁的意思，Web Locks API允许一个脚本异步持有对资源的锁定，直到处理完成再释放；现代浏览器都实现了这个属性 |
| maxTouchPoints | 返回设备触摸屏支持的最大接触点数量；它属于w3c规范的https://w3c.github.io/pointerevents/#dom-navigator-maxtouchpoints，手机设备上的浏览器返回大于1的数，电脑等不能非触屏设备上的浏览器这个属性返回0（可以点击谷歌浏览器的Toggle device toobar打开自适应宽高模拟为手机设备以改变这个属性的值）；现代浏览器都实现了这个属性 |
| mediaCapabilities | 返回暴露https://w3c.github.io/media-capabilities/#dom-navigator-mediacapabilities的MediaCapabilities对象；MDN提示这个对象暴露了一些编码和解码媒体文件的方法以格式化或输出相应的媒体数据；这个属性属于w3c规范中的https://w3c.github.io/media-capabilities/#dom-navigator-mediacapabilities 所有现代浏览器都实现了它； |
| mediaDevices | 返回可用的媒体设备；MDN提示媒体设备是一个MediaDevice对象，它提供对连接的媒体输入设备的访问，例如相机，麦克风，屏幕共享等；getUserMedia() 因为这个属性被遗弃，该属性属于w3c规范的https://w3c.github.io/mediacapture-main/#mediadevices ，需要在安全上下文（secure contexts）中使用，再谷歌浏览器中执行navigator.mediaDevices.enumerateDevices() 会得到一个解决的Promise 对象，内部值为连接的媒体输入设备 |
| mediaSession | 返回暴露https://w3c.github.io/mediasession/#dom-navigator-mediasession 的MediaSession 对象;MDN提示该对象可以用于共享浏览器元数据（metadata）以及共享关于文档处理的当前媒体的播放状态（playback state）信息 |
| mozIsLocallyAvailable() | 该方法允许外接程序确定给定的资源是否可用；MDN提示该属性没有相关标准且被遗弃了，现代浏览器都没有实现该方法 |
| requestMediaKeySystemAccess() | 返回一个Promise 对象，而这个期约解决后内部值为一个MediaKeySystemAccess 对象；MDN提示这个对象可用于访问特定的媒体密钥系统（media key system），而该系统又可用于创建用于解密媒体流的密钥。这个方法是https://w3c.github.io/encrypted-media/#navigator-extension-requestmediakeysystemaccess的一部分，它为网络提供了对加密媒体和DRM-保护视频的支持；所有现代浏览器都支持这个属性 |
| requestMIDIAccess() | 返回一个Promise 对象，而这个期约解决后内部值为一个MIDIAccess 对象。MDN提示该对象是w3c规范的https://webaudio.github.io/web-midi-api/#dom-navigator-requestmidiaccess 一部分，它提供了一种访问、枚举和操作MIDI设备的方法；该属性需要在安全上下文（secure contexts）中使用，大部分现代浏览器都支持这个属性（Safari除外，火狐在108版本试验） |
| permissions | 返回暴露https://w3c.github.io/permissions/#dom-navigator-permissions的Permissions 对象；MDN提示Persmissions 对象可以查询和更新Permissions API覆盖的权限状态（permission status）；属于w3c规范的https://w3c.github.io/permissions/#dom-navigator-permissions，大部分现代浏览器都实现了该属性 |
| presentation | 返回暴露https://w3c.github.io/presentation-api/#dom-navigator-presentation 的Presentation 对象；MDN提示这个属性是实验性（Experimental）的属性，属于w3c规范的https://w3c.github.io/presentation-api/#dom-navigator-presentation ，火狐和Safari没有实现该属性，但谷歌，Edge，欧鹏等浏览器实现了该属性 |
| scheduling | MDN提示这个属性是实验性（Experimental）的属性，返回一个Scheduling 对象，它是谷歌和React团队合作的产物，并非实际标准，只在基于Blink内核的浏览器中实现了。navigator.scheduling.isInputPending 函数会检测当前是否有input 事件的调度，有则返回true  |
| sendBeacon() | 异步函数，它能异步发送包含一些小数据的HTTP POST请求给服务器端；MDN提示该方法主要用于发送分析数据（analytics data），避免使用XMLHttpRequest 发送分析数据导致的一些技术残留问题；该方法属于w3c规范的https://w3c.github.io/beacon/#sendbeacon-method 所有现代浏览器都实现了这个方法 |
| serial | 返回暴露https://wicg.github.io/serial/#extensions-to-the-navigator-interface的Serial 对象。MDN提示该属性是实验性（Experimental）的属性，仅在较高版本的谷歌，Edge，欧鹏等浏览器实现了 |
| serviceWorker | 返回暴露Service Workers API的ServiceWorkerContainer 对象；MDN提示这个对象提供了与ServiceWorker实例交互的能力，它是w3c规范的https://w3c.github.io/ServiceWorker/#navigator-service-worker-attribute 的一部分，现代浏览器基本都实现了该属性 |
| setAppBadge() | 和clearAppBadge() 方法作用相反的异步函数，它可以用于设置应用程序（app）相关的图标标志（badge on the icon），传递一个数字给该函数，会设置这个数字的标志在app图标上，不传递就会设置成点（dot）；MDN提示这个方法是实验性（Experimental）的方法，是w3c规范的https://w3c.github.io/badging/#setappbadge-method规范的navigator 对象的原型方法，仅在谷歌，Edge，欧鹏等较高版本浏览器实现 |
| share() | 和canShare() 方法一样属于w3c规范的https://w3c.github.io/web-share/#share-method，执行share() 会调用设备的本机共享机制（native sharing mechanism）来共享文本，URL或文件等数据，可用的共享目标取决于设备，但可能包括剪贴板、联系人、电子邮件应用程序、网站、蓝牙等；大部分浏览器都实现了这个方法（目前火狐浏览器未实现） |
| storage | 返回暴露https://storage.spec.whatwg.org/#dom-navigatorstorage-storage的StorageManager 对象，MDN提示https://storage.spec.whatwg.org/#dom-navigatorstorage-storage来源于HTML标准，它需要在安全上下文（secure contexts）中使用；StorageManager 对象用于访问浏览器上当前站点或应用程序的整体存储能力，它允许开发者检查和配置数据存储的持久性，并了解用户浏览器有多少可用空间用于本地存储 |
| usb | 返回暴露https://wicg.github.io/webusb/的USB 对象，MDN提示USB对象提供了一种向Web公开的非标准USB（Universal Serial Bus）兼容设备服务的方案，使得USB更安全和更容易使用；该属性属于w3c规范的非标准https://wicg.github.io/webusb/ 的一部分，是实验性（Experimental）的属性，需要在安全上下文（secure contexts）中使用 |
| userActivation | 返回暴露https://html.spec.whatwg.org/multipage/interaction.html#dom-navigator-useractivation的UserActivation 对象，MDN提示这个属性是实验性（Experimental）的属性，返回值对象包含有关当前窗口的用户激活状态（activation state）的信息，navigator.userActivation.isActive 是布尔值，用户如果在与当前页面交互（https://developer.mozilla.org/en-US/docs/Glossary/Transient_activation）就会返回true ,navigator.userActivation.hasBeenActive 是布尔值，用户如果在当前页面已经交互过了就返回true ；该属性属于HTML标准的https://html.spec.whatwg.org/multipage/interaction.html#dom-navigator-useractivation，除了火狐和Safari外的现代浏览器都支持userActivation  |
| userAgentData | 返回暴露https://wicg.github.io/ua-client-hints/#dom-navigatorua-useragentdata的NavigatorUAData 对象，MDN提示这个属性是实验性（Experimental）的属性，返回的对象用于访问https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints_API ；该属性是谷歌提出的w3c规范的非标准https://wicg.github.io/ua-client-hints/#dom-navigatorua-useragentdata的一部分，需要在安全上下文（secure contexts）中使用，且仅在谷歌，Edge，欧鹏等现代高版本浏览器实现了 |
| vibrate() | （如果设备存在振动硬件就会）触发设备震动，如果调用此方法时设备已经在振动模式（vibration pattern）则停止这个模式，重新开始振动模式；调用vibrate() 需要传递一个pattern 参数，表示振动的特性，如持续时间，交替振动等（查看https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API）,返回一个布尔值表示执行是否成功；大部分现代浏览器都实现了该方法（Safari没有） |
| virtualKeyboard | 返回一个暴露https://www.w3.org/TR/virtual-keyboard/ 的VirtualKeyboard 对象；w3组织提示该属性用在当硬件键盘不可用时显示的虚拟键盘（VK）上，它可以获取虚拟键盘的宽高和位等；MDN提示该属性是实验性（Experimental）的属性，仅在高版本谷歌，Edge，欧鹏等高版本浏览器上实现了，是w3c组织在2021.8.24才提出来的较新标准 |
| wakeLock | 返回一个暴露https://w3c.github.io/screen-wake-lock/#extensions-to-the-navigator-interface的WakeLock 对象，该对象能允许文档唤醒设备锁：当屏幕唤醒锁活动时，用户代理可以通过它阻止设备调暗屏幕、完全关闭屏幕、或显示屏幕保程序；MDN提示这个属性是实验性（Experimental）的属性，需要在安全上下文（secure contexts）中使用，属于w3c规范的https://w3c.github.io/screen-wake-lock/#extensions-to-the-navigator-interface，仅在大部分高版本现代浏览器实现（火狐，Safari未实现） |
| webdriver | 返回一个布尔值，表示浏览器当前是否被自动化程序（automation）控制，https://w3c.github.io/webdriver/ 是w3c规范的一个进程外程序远程指示web浏览器行为相关的接口，所有现代浏览器都实现 |
| windowControlsOverlay | 返回一个暴露https://wicg.github.io/window-controls-overlay/#windowcontrolsoverlay-interface 的WindowControlsOverlay 对象，它拥有一个方法可以获取桌面渐进Web应用程序中关于标题栏几何形状的信息（the title bar geometry in desktop Progressive Web Apps），MDN提示该属性需要在安全上下文（secure contexts）中使用，属于w3c规范的https://wicg.github.io/window-controls-overlay/#windowcontrolsoverlay-interface ，仅在部分高版本浏览器（>105的谷歌，>105的Edge，>91的欧鹏）实现 |
| xr | 返回一个暴露https://immersive-web.github.io/webxr/#navigator-xr-attribute 的XRSystem 对象，它可以向用户呈现增强的虚拟现实图像（virtual reality imagery）；MDN提示该属性是实验性（Experimental）的属性，需要在安全上下文（secure contexts）中使用，目前仅在谷歌，Edge，欧鹏等浏览器中实现 |
- 一般属性返回一个暴露了API的对象，其用处通常为给用户提供API接口的方法便于操作获取某些值
- 需要注意需要在**安全上下文（secure contexts）**中使用的属性，直接在任意站点的控制台访问相关属性，可能无法获取，可以自建一个本地服务器，例如`navigator.storage`

# 3.1 检测插件（Detecting Plug-ins）

- 根据上面的`navigator.plugins` 的[现代解释](3%20navigator%20%E5%AF%B9%E8%B1%A1.md)可知，`plugins` 已经是一个被废弃的属性，现代浏览器保留之只是为了兼容以前的代码
- 对相等浏览器而言，浏览器需要插件的额外功能仅有一个：就是可以作为pdf查看器查看pdf文件，所以HTML标准规定使用`navigator.pdfViewerEnable` 判断浏览器是否支持作为pdf查看器
- 而`navigator.plugins` 被固定为一个`PluginArray` ，里面的5个元素（`Plugin`对象）可以通过索引访问，也可以通过插件名称访问，如下是伪代码
    
    ```jsx
    PluginArray {
    	["0", "PDF Viewer"]: Plugin {
    		["0", "application/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[0], // 引用相同插件
    			suffixes: "pdf",
    			type: "application/pdf"
    		},
    		["1", "text/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[0], // 引用相同插件
    			suffixes: "pdf",
    			type: "text/pdf"
    		},
    		description: "Portable Document Format",
    		filename: "internal-pdf-viewer",
    		length: 2,
    		name: "PDF Viewer"
    	},
    	["1", "Chrome PDF Viewer"]: Plugin {
    		["0", "application/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[1], // 引用相同插件
    			suffixes: "pdf",
    			type: "application/pdf"
    		},
    		["1", "text/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[1], // 引用相同插件
    			suffixes: "pdf",
    			type: "text/pdf"
    		},
    		description: "Portable Document Format",
    		filename: "internal-pdf-viewer",
    		length: 2,
    		name: "Chrome PDF Viewer"
    	},
    	["2", "Chromium PDF Viewer"]: Plugin {
    		["0", "application/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[2], // 引用相同插件
    			suffixes: "pdf",
    			type: "application/pdf"
    		},
    		["1", "text/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[2], // 引用相同插件
    			suffixes: "pdf",
    			type: "text/pdf"
    		},
    		description: "Portable Document Format",
    		filename: "internal-pdf-viewer",
    		length: 2,
    		name: "Chromium PDF Viewer"
    	},
    	["3", "Microsoft Edge PDF Viewer"]: Plugin {
    		["0", "application/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[3], // 引用相同插件
    			suffixes: "pdf",
    			type: "application/pdf"
    		},
    		["1", "text/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[3], // 引用相同插件
    			suffixes: "pdf",
    			type: "text/pdf"
    		},
    		description: "Portable Document Format",
    		filename: "internal-pdf-viewer",
    		length: 2,
    		name: "Microsoft Edge PDF Viewer"
    	},
    	["4", "WebKit built-in PDF"]: Plugin {
    		["0", "application/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[4], // 引用相同插件
    			suffixes: "pdf",
    			type: "application/pdf"
    		},
    		["1", "text/pdf"]: MimeType {
    			description: "Portable Document Format",
    			enabledPlugin: navigator.plugins[4], // 引用相同插件
    			suffixes: "pdf",
    			type: "text/pdf"
    		},
    		description: "Portable Document Format",
    		filename: "internal-pdf-viewer",
    		length: 2,
    		name: "WebKit built-in PDF"
    	}
    }
    ```
    

## 3.1.1 JavaScript高级程序设计（第4版）关于插件检测的说明

- 尽管`navigator.plugins` 已经被废弃，但是在以前的版本中的浏览器，它还是有效的

---

### 3.1.1.1 检测插件就是遍历浏览器中的可用的插件

- 检测浏览器是否存在某一个插件，可以通过`Plugin` 对象的`name` 属性确定，`name` 决定了插件需要的必要信息（现在是固定的5个不同pdf支持的名称）
    
    ```jsx
    function hasPlugin(name) {
      name = name.toLowerCase();
      for (let plugin of window.navigator.plugins) {
        if (plugin.name.toLocaleLowerCase().includes(name)) {
          return true;
        }
      }
      return false;
    }
    // 检测Flash
    alert("flash:" + hasPlugin("Flash"));
    // 检测QuickTime
    alert("QuickTime:" + hasPlugin("QuickTime"));
    // 检测pdf
    alert("pdf:" + hasPlugin("pdf"));
    ```
    
    - `hasPlugin()` 接收一个参数，就是待检测插件的名称，然后遍历`navigator.plugins` （通过索引顺序遍历，`[name properties` 是不可枚举的](3%20navigator%20%E5%AF%B9%E8%B1%A1.md)），比较每个插件的`name` 属性是否包含传入参数（都用小写）
    - 现代浏览器的`plugins` 是固定的5个pdf查看器插件，所以上述的`alert` 检测中只有`hasPlugin("pdf")` 返回`true`

<aside>
💡 注意：这是IE10及之后版本的插件检测方式，在IE11之后每个插件还包含了`MimeType` 对象，~~这意味着插件的`name` 根具插件包含的`MimeType` 具有明确的规范~~，即上面定义的函数适用于较新版本的浏览器的插件检测，在IE11之后，`ActiveXObject` 从DOM中隐身，不再作为插件检测的手段

</aside>

### 3.1.1.2 旧版本IE中的插件检测

- IE10即更低版本的插件检测问题，在IE中需要使用专有的`ActiveXObject` ，并尝试实例化特定插件
- IE中的插件实现为COM对象，由唯一的字符串标识，检测某个插件就必须知道其COM标识符，然后使用`ActiveXObject` 进行实例化，例如Flash的标识符是”ShockwaveFlash.ShockwaveFlash”
    
    ```jsx
    function hasIEPlugin(name) {
      // 使用ActiveXObject需要谨慎，不是所有浏览器都支持它
      try {
        new ActiveXObject(name);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    // 检测Flash
    alert(hasIEPlugin("ShockwaveFlash.ShockwaveFlash"));
    // 检测QuickTime
    alert(hasIEPlugin("QuickTime.QuickTime"));
    ```
    
    - 上述两个检测只在IE10和之前的旧版本浏览器有效
    - 现代浏览器以及IE10之后的浏览器都会返回`false` ，并且抛出的错误会不同，前者表示不存在`ActiveXObject` ，后者则是因为“Automation 服务器不能创建对象”

---

- 上面的插件检测实际上没有任何意义，因为`ActiveXObject` 属于IE旧版本的独有属性，并且**IE现在不再维护**，是落后的浏览器，况且`plugins` 属性都已走进历史的舞台，**不要再使用这些废弃的属性**，它们仅为兼容性而存在

### 3.1.1.3 navigator.plugins.refresh()

- 在之前HTML标准中提到过的插件数组对象的`refresh()` 方法：[除此之外，`PluginArray` 接口的`refresh()` 方法被调用后，**不做任何事情**](3%20navigator%20%E5%AF%B9%E8%B1%A1.md)
- 在之前这个方法用于刷新`plugins` 属性以反映新按照的插件，因为现代浏览器的`plugins` 都是固定的5个，所以**直接调用**它不会发生任何事情
    - 但是`refresh()` 接收一个布尔值参数，默认为`false` ，表示刷新`plugins` 属性时是否重新加载页面
    - 如果传入`true` ,则页面会重新加载，否则不会重新加载
    
    ```jsx
    <h2>1s后重新加载</h2>
    <script>
      setTimeout(() => {
        navigator.plugins.refresh(true);
      }, 1000);
    </script>
    ```
    
    - 页面在1s后重新加载

# 3.2 注册处理程序（Registering Handlers）

- 使用`navigator.registerProtocolHandler()` （在HTML5中定义的）方法注册处理程序
    - 它可以赋予一个网站具有**处理特定类型的信息**的能力，即在站点**注册** 对 特定类型的信息的 **处理程序**
    - 随着在线RSS阅读器和电子邮件客户端的流行，可以借助这个方法将Web应用程序注册为像桌面软件一样的默认应用程序（这样就能处理电子邮件等特定类型的信息）
- `navigator.registerProtocolHandler()` 使用需要传入三个参数，要处理的协议，处理协议的URL，以及应用名称（第三个在标准中不再使用），把一个Web应用程序注册为默认邮件客户端可以这样做
    
    ```jsx
    navigator.registerProtocolHandler("mailto", "https://somemailclient.com?cmd=%s", "Some Mail Client")
    ```
    
    - 注册一个协议为”mailto”的处理程序，这样邮件地址就可以通过指定的Web应用程序打开
    - 注意URL后加的`%s` query字符串，它表示原始索引
- 更多关于注册和注销处理程序的信息查看[3.0.2.4 **NavigatorContentUtils**](3%20navigator%20%E5%AF%B9%E8%B1%A1.md)