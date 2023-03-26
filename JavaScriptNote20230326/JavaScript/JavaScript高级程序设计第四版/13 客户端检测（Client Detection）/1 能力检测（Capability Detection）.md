# 1. 能力检测（Capability Detection）

能力检测又称为特性检测，即在JavaScript运行时中使用一套简单的检测逻辑，测试浏览器是否支持某种特性，这种方式不要求事先知道特定浏览器的信息，只需检测自己关心的能力是否存在即可。能力检测的基本模式如下

```jsx
if(object.propertyInQuestion) {
	// 使用object.propertyInQuestion
}
```

例如IE5之前版本没有`document.getElementById()` 这个DOM方法，但是可以通过`document.all` 属性实现相同的功能，可以进行如下能力检测

```jsx
function getElement(id) {
  if (document.querySelector) {
    return document.querySelector(`#${id}`);
  } else if (document.getElementById) {
    return document.getElementById(id);
  } else if (document.all) {
    return document.all[id];
  } else {
    throw new Error("无法通过id获取元素");
  }
}
```

能力检测的关键是理解两个重要的概念：

1. **应该先检测最常用的方式**。如上面的例子，现在最常用的是querySelector，然后是getElementById，最后document.all（可能不存在被废弃）
2. **必须检测切实需要的特性**。即某个能力存在不代表别的能力也存在，例如不能通过document.all来判断documentElement.clientWidth是存在的

# 1.1 安全能力检测（Safer Capability Detection）

- 能力检测最有效的场景是检测能力是否存在的同时，**验证**其是否能够展现出预期的行为
    - 前面的例子依赖将测试对象的成员转换类型（转化为布尔值），然后确定是否存在
    - 虽然这种方式能检测对象成员的存在，但是**不能确定成员就是你想要的**
- 一个错误的例子如下
    
    ```jsx
    // 错误的例子
    function isSortable(object) {
      return !!object.sort;
    }
    ```
    
    - 这个方法本意是检测某个对象是否可以排序
    - 但是检测对象上是否存在sort()方法并不能确定它是否支持排序，问题在于对象有一个sort属性，该函数也会返回`true`
- 也许更好的方式是检测sort是不是函数（也不能完全检测出对象是否能排序）：
    
    ```jsx
    function isSortable(object) {
      return typeof object.sort === "function";
    }
    ```
    
    - 使用typeof 确定sort是不是函数，从而确定是否可以通过调用它来对数据进行排序
    - 进行能力检测尽量使用typeof操作符
- 光使用typeof还不够，尤其是某些宿主对象并不保证对typeof测试返回合理的值
    - 例如IE中的document.createElement()，它是一个创建元素的方法
        
        ```jsx
        // 不适用IE8及以下
        function hasCreateElement() {
          return typeof document.createElement === "function";
        }
        ```
        
    - 大多数浏览器`hasCreateElement()` 都返回`true` ，但是在IE8及更低的版本中，这个函数会返回`false`，这是因为DOM作为宿主对象，它在IE8及其低版本中是通过COM而非JScript实现的，因此document.createElement()函数被实现为COM对象，typeof 返回”object”从而返回`false`
- 要深入理解能力检测，可以查看**[Feature Detection: State of the Art Browser Scripting](http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting)**

# 1.2 基于能力检测进行浏览器分析

恰当地使用能力检测可以**精准地分析运行代码的浏览器**

使用能力检测而非用户代理（userAgent）的优点在于：伪造用户代理字符串很简单，而伪造能够欺骗能力检测的浏览器特性很难

## 1.2.1 检测特性（Detection Feature Support）

- 可以按照能力将浏览器归类，如果web应用程序需要使用特定的浏览器能力，那么最好**集中检测所有能力**，而不是等到用时再重复检测
    
    ```jsx
    // 检测浏览器是否支持Netscape式的插件
    let hasNSPlugins = !!(navigator.plugins && navigator.plugins.length);
    // 检测浏览器是否具有DOM Level 1能力
    let hasDOM1 = !!(
      document.getElementById &&
      document.createElement &&
      document.getElementsByTagName
    );
    ```
    
    - 第一项检测浏览器是否支持Netscape式的插件（现在plugins是固定值，使用已经没有意义了）
    - 另一个是检测浏览器是否具备DOM Level 1 能力，保存再变量中的布尔值可以用在后面的条件语句中，比重复检测省事

## 1.2.2 检测浏览器（Detection Browser Identity）

- 根据对浏览器特性的检测并与已知特性对比，确认用户使用的是什么浏览器，这样可以获得比**用户代码嗅探（user-agent spoofing）**更准确的结果，但是未来版本的浏览器可能不是使用这种方式
- 根据不同浏览器的独有行为判断浏览器身份，不使用navigator.userAgent属性
    
    ```jsx
    class BrowserDetetor {
      constructor() {
        // 测试条件编译
        // IE6~10支持
        this.isIE_Gte6Lte10 = /*@cc_on!@*/ false;
    
        // 测试documentMode
        // IE7~11支持
        this.isIE_Gte7Lte11 = !!document.documentMode;
    
        // 测试StyleMedia构造函数
        // Edge 20 及以上版本
        this.isEdge_Gte20 = !!window.StyleMedia;
    
        // 测试火狐专有扩展安装api
        // 所有火狐版本都支持
        this.isFirefox_Gte1 = typeof InstallTrigger !== "undefined";
    
        // 测试chrome对象及其webstore属性
        // Opera某些版本有chrome对象，但是没有chrome.webstore
        // 所有谷歌版本都支持
        this.isChrome_Gte1 = !!window.chrome && !!window.chrome.webstore;
    
        // Safari早期版本会给构造函数的标签追加“Constructor”字样
        // window.Element.toString(); // [object ElementConctructor]
        // Safari3~9.1 支持
        this.isSafari_Gte3Lte9_1 = /constructor/i.test(window.Element);
    
        // 推送通知API暴露在window对象上
        // 使用默认参数值避免对undefined调用toString()
        // Safari 7.1 及以上版本支持
        this.isSafari_Gte7_1 = (({ pushNotification = {} } = {}) =>
          pushNotification.toString() === "[object SafariRemoteNotification]")(
          window.safari
        );
    
        // 测试addons属性
        // Opera 20及以上版本支持
        this.isOpera_Gte20 = !!window.opr && !!window.opr.addons;
      }
      isIE() {
        return this.isIE_Gte6Lte10 || this.isIE_Gte7Lte11;
      }
      isEdge() {
        return this.isEdge_Gte20 && !this.isIE();
      }
      isFirefox() {
        return this.isFirefox_Gte1;
      }
      isChrome() {
        return this.isChrome_Gte1;
      }
      isSafari() {
        return this.isSafari_Gte7_1 || this.isSafari_Gte3Lte9_1;
      }
      isOpera() {
        return this.isOpera_Gte20;
      }
    }
    ```
    
- 这个BrowserDetector类暴露的通用浏览器检测方法使用了检测浏览器范围的能力测试
- 随着浏览器的发展和变化，可以不断调整底层检测逻辑，但主要API可以保持不变

<aside>
💡 注意：经过测试，谷歌浏览器（108.0.5359.125）执行上述的`isChrome()` 会返回`false` ,这是因为最新版本的谷歌浏览器的`chrome` 对象中不包含`webstore` 对象了，关于chrome对象，可以查看[chrome-外部资料](https://www.cnblogs.com/tzwbk/p/13083187.html)。由于Edge浏览器现在使用和谷歌浏览器相同的内核，所以`isEdge()` 只对老版本的Edge浏览器有效，除此之外，火狐浏览器虽然能使用`isFirefox()` 且判断为`true` ，但它也提示“InstallTrigger 已不赞成使用，未来将被移除。”

</aside>

## 1.2.3 能力检测的局限（limitation）

- 通过检测一种或一组能力，**并不总能确定使用的那种浏览器，**因为
    - 其他浏览器未来是否也会实现同样的属性未知
    - 被检测浏览器未来是否会舍弃这种属性未知
- 常见的错误检测方式
    
    ```jsx
    // 错误使用方式
    let isFirefox = !!(navigator.vendor && navigator.vendorSub);
    
    let isIE = !!(document.all && document.uniqueID);
    ```
    
- `vendor` 和`vendorSub` 现在并不是火狐独有的属性，并且这两个属性属于仅为兼容性保留的属性，不能用于检测浏览器
- 而`document.all`和`document.uniqueID` 虽然是IE独有的属性，但是并不能保证未来的版本IE仍然继续存在这两个属性
- **能力检测最适合用于决定下一步该怎么做**，而不一定能够作为辨识浏览器的标志