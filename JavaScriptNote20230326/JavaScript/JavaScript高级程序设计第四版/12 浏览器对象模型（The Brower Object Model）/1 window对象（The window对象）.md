# 1. window对象（The window对象）

`window`是浏览器对象模型的核心，它表示**浏览器的实例**（**instance of the browser**）,它在浏览器中有两重身份

- 它是ECMAScript中在浏览器宿主环境中的Global对象实现，这意味着网页中定义的所有对象、变量和函数都以window作为兜底对象，都可以访问其上定义的`parseInt()` 等全局方法
- 它也是浏览器窗口（window本身具有窗口之意）的JavaScript接口

<aside>
💡 注意：因为window对象的属性在全局作用域中有用，所以很多浏览器API及相关构造函数都以window对象属性的形式暴露出来，例如之前介绍过的`Array` ,`Function` ,`Map` 等都是以window对象属性的形式成为内置JavaScript对象的

另外，由于浏览器的实现不同，某些window对象的属性在不同浏览器之间可能差异巨大，所以非标准化或特定于浏览器的window属性不会被介绍

</aside>

# 1.1 Global作用域（The Global Scope）

- `window`对象被复用为ECMAScript的Global对象，所以通过var（在块作用域中）声明的所有全局变量和函数都会成为window对象的属性和方法
    
    ```jsx
    var age = 22;
    var sayAge = () => alert(this.age);
    alert(window.age); // 22
    sayAge(); // 22
    window.sayAge(); // 22
    ```
    
    - 这里变量`age` 和函数`sayAge()` 被定义在全局作用域，所以自动成为window对象的cheng'yuan
    - 而`sayAge` 保存的函数对象是一个箭头函数，箭头函数的`this` 值是最近词法的作用域，及定义时的作用域（这里是全局作用域），所以`this`值为`window`
- 使用`let`或`const` 代替`var` ，`age` 和`sayAge` 就不会被挂载到`window`上了
    
    ```jsx
    let age = 22;
    const sayAge = () => alert(this.age);
    alert(window.age); // undefined
    sayAge(); // undefined
    window.sayAge(); // Uncaught TypeError: window.sayAge is not a function
    ```
    
- 访问**未声明的属性**不会抛出异常，但是访问**未声明的变量**会抛出错误，所以对**可能存在的全局变量**通过`window`进行访问总是不会报错，但是不使用`window` 直接访问就会抛出错误，如下
    
    ```jsx
    var k = m; // Uncaught ReferenceError: m is not defined
    var k = window.m; // undefined 不会报错
    ```
    
- BOM中涉及到的`location`对象和`navigator` 对象也属于`window`对象的属性，可以在全局作用域中访问到它们

# 1.2 窗口关系（Window Relationships）

- 浏览器中每个页面至少有一个`window` 对象表示当前页面的“窗口”，但是有些页面可以有多个`window` 对象，使用<*iframe*>标签嵌套其它网页就可以达成这个功能
    - 只是在当前页面**无法直接访问**到嵌套的页面的`window` 对象
    - 嵌套页面的`window` 对象可以通过`window` 下的`parent`,`top` 属性访问到父窗口的`window` 对象
- 关于`window` 对象和窗口关系有关的属性
    - `window.top` 属性，始终指向最上层（最外层）窗口（最上层`window`对象），即浏览器串口本身
    - `window.parent` 属性，始终指向当前窗口的父窗口（上层的`window`对象）
    - `window.self` 属性，始终指向`window` 本身，即`self`和`window`是同一个对象，之所以要暴露这个是为了与`top`, `parent` 统一
    
    ---
    
    - 最外层的`window`对象的`top`,`parent`，`self` 属性都指向`window` 本身

## 1.2.1 例子

- 使用<*iframe*>标签嵌套两层的子页面，最底层的页面可以通过`window.parent.parent` 访问到最外层的`window`对象
    
    最外层index.html文件核心代码
    
    ```html
    <body>
      <script>
        window.a = "top";
        console.log("------top的打印开始-------");
        console.log(window.a);
        console.log(window.parent.a);
        console.log(window.parent.parent.a);
        console.log(window.top.a);
        console.log(window === window.parent);
        console.log(window === window.parent.parent);
        console.log(window === window.top);
        console.log(window === self);
        console.log("------top的打印结束-------");
      </script>
      <h1>top</h1>
      <iframe
        src="./frame1.html"
        title="Inline Frame Example"
        width="500"
        height="500"
      ></iframe>
    </body>
    ```
    
    中层的frame1.html核心代码
    
    ```html
    <body class="middle">
        <script>
          window.a = "middle";
          console.log("------middle的打印开始-------");
          console.log(window.a);
          console.log(window.parent.a);
          console.log(window.parent.parent.a);
          console.log(window.top.a);
          console.log(window === window.parent);
          console.log(window === window.parent.parent);
          console.log(window === window.top);
          console.log(window === self);
          console.log("------middle的打印开始结束-------");
        </script>
        <h2>middle</h2>
        <iframe
          src="./frame2.html"
          frameborder="2"
          width="300"
          height="200"
        ></iframe>
      </body>
    ```
    
    底层frame2.html核心代码
    
    ```jsx
    <body class="bottom">
      <script>
        window.a = "bottom";
        console.log("------bottom的打印开始-------");
        console.log(window.a);
        console.log(window.parent.a);
        console.log(window.parent.parent.a);
        console.log(window.top.a);
        console.log(window === window.parent);
        console.log(window === window.parent.parent);
        console.log(window === window.top);
        console.log(window === self);
        console.log("------bottom的打印开始结束-------");
      </script>
      <h3>bottom</h3>
    </body>
    ```
    
    - 页面
        
        ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled.png)
        
    - 打印结果
        
        ```html
        ------top的打印开始-------
        top
        top
        top
        top
        true
        true
        true
        true
        ------top的打印结束-------
        ------middle的打印开始-------
        middle
        top
        top
        top
        false
        false
        false
        true
        ------middle的打印开始结束-------
        ------bottom的打印开始-------
        bottom
        middle
        top
        top
        false
        false
        false
        true
        ------bottom的打印开始结束-------
        ```
        
    - 通过打印可以发现
        - iframe标签引用的页面在当前页面加载完毕后才开始加载，就也是说父窗口的脚本代码全部执行完毕后才开始执行子窗口的脚本代码
        - 通过在子脚本中使用`window.top` 和`window.parent` 可以得到最外层窗口和父窗口的`window` 对象，就可以**间接**得到父窗口们的全局变量，所以得到的`a` 属性打印在`bottom` 页面中会得到”top“,”middle“,”bottom“三种情况

## 1.2.2 间接获取子窗口的window

- 获取子窗口的window对象不能在当前窗口进行操作，而是在子窗口环境中给予父窗口访问子窗口的”权限“，如下
    
    frame1.html文件
    
    ```html
    <script>
      window.parent.son = window;
    </script>
    ```
    
    frame2.html
    
    ```html
    <script>
      window.parent.son = window;
      window.top.grandSon = window;
    </script>
    ```
    
    - top窗口的`window`对象就有`son` 和`grandSon` 两个属性，分别表示子窗口的`window` 和子窗口的子窗口的`window` 对象
    - middle窗口的`window`对象有`son` 属性表示子窗口的`window`对象
        
        ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%201.png)
        

## 1.2.3 浏览器不同tab页面窗口间的关系

- `window` 对象的`**window.open()**`方法可以在当前浏览器的tab页中打开一个新窗口，并且它会返回新窗口页面的`window`对象
    - 利用`window.open()` 方法返回的对象可以将两个页面的window对象连接起来以到达在一个页面访问另一个页面的全局对象的功能
    - `window.open()` 接收`url` 参数，理论上可以打开任意一个网页然后在当前页面获取它的`window` 对象
- 在刚刚的top页面的控制台执行如下语句
    
    ```jsx
    let example = window.open("./another.html")
    console.log(example.location);
    ```
    
    打印
    
    ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%202.png)
    
    - `another.html`是在同一个文件夹下的html文件，执行后会弹窗一个新tab页面，同时在当前tab页获得新tab页面的`window`对象
- 通过`example` 对象可以操作新页面，且可以
    
    ```jsx
    const btn = document.createElement("button")
    btn.textContent = "按钮"
    btn.addEventListener("click", () => alert(this.a))
    example.document.body.append(btn)
    ```
    
    - 新tab页，会添加一个按钮（原本没有）
        
        ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%203.png)
        
    - 点击这个按钮，另一个页面会弹出一个弹窗，因为alert是旧页面的方法
        
        ![window relationship2.gif](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/window_relationship2.gif)
        

# 1.3 窗口位置与像素比（Window Position and Pixel Ratio）

23英寸的显示屏幕（1920×1080分辨率，16：9）宽高为：50.9174cm，28.6411cm；一英寸相当于2.54cm

16英寸的显示屏幕（2560×1600分辨率，16：10）宽高为：34.4627cm，21.5392cm

---

## 1.3.1 窗口位置

- window对象的位置（即窗口的位置）可以通过不同的属性和方法来确定
    - 现代浏览器提供`screenLeft` 和`screenTop` 这两个全局属性表示窗口**相对于屏幕**的位置（可以是负数）
    - 以`screenLeft` 返回窗口相当于屏幕左侧的距离
    - `screenTop` 返回窗口相对于屏幕顶部的距离
    - 返回值的单位都是**CSS像素**
    
    ---
    
    - **CSS像素（CSS pixels）**在CSS中以`px` 为后缀—一个长度单位，大致相当于一个肉眼可以轻松看见的小点的长宽；一个CSS像素被[W3C标准](https://drafts.csswg.org/css-values-3/#absolute-lengths)定义为1/96英寸的一个物理像素（1px = 1/96th of 1in），大概为0.2646mm
        - 因此，上述的显示屏幕虽然使用了固定的像素点个数，但是实际的像素点所占位置并非为0.2646mm
        - 相反会更加密集，如第一个显示屏幕的像素长大概为0.2652mm，略大于0.2646
        - 第二个显示屏幕的像素长大概为0.1346mm，小于0.2646
        - 像素点长度越小，说明显示屏幕的像素越密集，屏幕也就不容易出现花屏
        - 有一个单位PPI，每英寸长度内的像素点数用于表示屏幕的精度，第一个屏幕PPI为95.78， 第二个屏幕PPI为188.68
        - 实际上第一个屏幕的PPI更接近标准以W3C标准定义的像素长度的PPI，即每英寸96个像素点
- 介绍CSS像素和屏幕的分辨率的目的在于，`screenLeft` 和`screenTop` 的值和实际屏幕上这段距离的像素点个数是不一样的，PPI和96差距越大，屏幕上实际存在的像素点个数和打印出来的`screenLeft`和`screenTop` 的差距就越大
    - `screenLeft`和`screenTop` 是按照标准的CSS像素单位说明距离左边或上边的长度
    - 所以在获取到值后，不要因为截屏软件显示的像素个数与浏览器打印的不一致而产生困惑，本质上是因为屏幕在一英寸内容纳了超过96个像素点导致的
    
    在浏览器的控制台中输入如下语句，可以打印出当前窗口距离屏幕左边和上边的**标准像素距离，**假设屏幕宽度为w英寸，屏幕高度为h英寸
    
    ```jsx
    window.screenTop; // [0, 96 * h]
    window.screenLeft; // [-96*w, 96 *w] 
    
    ```
    
    - 理论上浏览器窗口可以移动到屏幕的**左右**“不可见区域”，所以`screenLeft` 的值可以为负数
    - 在window11中的谷歌浏览器似乎不能将窗口移动到上方的不可见区域，所以这里`screenTop` 的最小值为0
    - 总之，重要的不是这两个属性值的范围，而是它所表示的含义—距离屏幕左边和上边的**标准像素距离**

---

- 窗口的位置除了可以通过`screenLeft`和`screenTop` 读取外，还可以通过`window`提供的`moveTo()`和`moveBy()` 函数移动窗口
    - `window.moveTo()` 是**`Window`** 接口提供的将当前窗口（window）移动到指定位置**坐标**（**coordinates**）的方法
        
        **语法**
        
        ```jsx
        moveTo(x, y)
        ```
        
        - 参数：
            
            x是移动到的水平坐标位置，单位为CSS像素
            
            y是移动到的垂直坐标位置，单位为CSS像素
            
        - 返回值:`undefined`
        - 注意：窗口所在坐标系为以**设备屏幕左上角**为原点的垂直坐标系，x轴水平向右，y轴垂直向下
    - `window.moveBy()` 是`Window`接口提供的将当前窗口**相对当前位置**在两个方向（水平和垂直）上移动指定距离的方法
        
        **语法**
        
        ```jsx
        moveBy(deltaX,deltaY);
        ```
        
        - 参数：
            
            delataX是用于水平移动窗口的像素量，正值为向右边移动，负值为向左边移动（坐标系相关）
            
            delataY是用于垂直移动窗口的像素量，正值为向下边移动，负值为向上边移动（坐标系相关）
            
        - 返回值：`undefined`
        - 注意：窗口所在坐标系为以**设备屏幕左上角**为原点的垂直坐标系，x轴水平向右，y轴垂直向下

<aside>
💡 注意：关于这两个窗口移动方法，浏览器可能**部分或全部禁用**，比如创建一个插入如下代码的HTML文件并打开

```html
<script>
  moveTo(150, 150);
  moveBy(300, -50);
</script>
```

经过测试，发现

1. 谷歌浏览器无法生效
2. 火狐浏览器在单开页面时会生效
3. IE在单开页面时会生效

在MDN相关描述中得知

从Firefox7开始，如果符合下列情况，普通网页中的JavaScript无法通过调用函数来移动浏览器窗口

1. 当前窗口或标签页不是由`window.open()` 方法创建的
2. 当前标签页所在的窗口包含多个标签页
</aside>

## 1.3.2 像素比（Pixel Radio）

- CSS像素是Web开发中使用的**统一像素单位**
    - 这个单位的背后与一个角度有关系：0.0213°
    - 这样定义像素大小是为了在**不同设备**上统一标准
        - 不同分辨率的设备如果按照自己的像素长度显示长度，那么会出现同一个页面使用相同数量像素的长度因为设备像素密集而显示得更“短”
        - 例如低分辨率平板设备上12像素（CSS像素）的文字应该和高清4K屏幕下的12像素（CSS像素）的文字具有相同大小
    - 因为不同设备使用统一的CSS像素表示大小，那么不同设备自身的像素密度下就会有不同的**缩放系数**（**scaling factor**），以便把物理像素（屏幕实际分辨率）转换为CSS像素（浏览器报告的虚拟分辨率），而**物理像素与CSS像素的比就是一个设备的像素比**
- 例如，手机屏幕的**物理分辨率（physical resolution）**为2340×1080像素，因为手机屏幕尺寸较小，而物理分辨率过大，它的DPI可以达到288（每英寸像素个数），所以浏览器就需要将其分辨率减为较低的**逻辑分辨率**（**logical resolution**），例如780×360，并设置**像素比为3**
    
    ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%204.png)
    
    - 这个物理像素和CSS像素之间的转换比率由`window.devicePixelRatio` 属性提供
    - 对于上述从2340×1080转化为780×360的设备，`window.devicePixelRaitio` 的值就是3
    - 12像素（CSS像素）的文字实际上就会用36像素的物理像素来显示
- `window.devicePixelRatio` 实际上与每英寸像素数（DPI dots per inch）是对应的，DPI表示单位像素密度，而`window.devicePixelRatio` 表示物理像素和逻辑像素之间的缩放系数，用它乘以96（标准CSS像素长度下的DPI大小）就是设备的实际DPI

<aside>
💡 注意，DPI和PPI通常区别很小，都表示单位英寸的像素数，但是DPI原本是用于衡量打印精度的参数之一，因为现代打印都是在一英寸长度中取样**像素点**，所以dpi也可以表示单位英寸的像素数；关于二者的区别可以查看**[PPI vs. DPI: what’s the difference?](https://99designs.com/blog/tips/ppi-vs-dpi-whats-the-difference/)**

</aside>

---

**0.0213°的由来**

参考[stackoverflow](https://stackoverflow.com/questions/49554344/why-is-the-visual-angle-equals-0-0213)

- **0.0213°**是一个角度值，表示成弧度就是**0.000372**，而这个弧度长度就是1 / 96 / 28的结果
- 人在观看电脑屏幕时，人眼距离屏幕的长度为一臂之长大概为65~75cm，而转化为英寸就是25.6~29.5inch，这里选取28英寸作为标准距离
- 根据视角=物体大小 / 距离物体的距离 公式可以验证,一个CSS单位像素就是物体大小（1/96英寸），距离物体距离就是28inch，即 1 / 96 / 28 就是视角的弧度

# 1.4 窗口大小（Window Size）

## 1.4.1 窗口表示尺寸的属性

- 不同浏览器中表示窗口大小的属性可能没那么统一，但是所有**现代**浏览器都支持4个属性：
    - `window.innerWidth` ：返回浏览器窗口中页面视口的宽度（不包含浏览器边框和工具栏）
    - `window.innerHeight` ：返回浏览器窗口值页面视口的高度（不包括浏览器边框和工具栏）
    - `window.outerWidth` ：返回浏览器窗口自身的宽度（在窗格<frame>中使用具有同样效果）
    - `window.outerHeight` ：返回浏览器窗口自身的高度（在窗格<frame>中使用具有同样效果）
- 在一个html文件中插入如下代码,它能随着浏览器窗口的尺寸变化动态显示页面视口大小和窗口自身的大小
    
    ```html
    <body>
        <h2>Window Size</h2>
        <p>window.innerWidth: <span class="inner-width"></span></p>
        <p>window.innerHeight: <span class="inner-height"></span></p>
        <p>window.outerWidth: <span class="outer-width"></span></p>
        <p>window.outerHeight: <span class="outer-height"></span></p>
        <p>window.devicePixelRatio: <span class="device-pixel-ratio"></span></p>
    
        <script>
          const iw = document.querySelector(".inner-width");
          const ih = document.querySelector(".inner-height");
          const ow = document.querySelector(".outer-width");
          const oh = document.querySelector(".outer-height");
          const dpr = document.querySelector(".device-pixel-ratio");
          iw.textContent = window.innerWidth;
          ih.textContent = window.innerHeight;
          ow.textContent = window.outerWidth;
          oh.textContent = window.outerHeight;
          dpr.textContent = window.devicePixelRatio;
          window.addEventListener("resize", () => {
            iw.textContent = window.innerWidth;
            ih.textContent = window.innerHeight;
            ow.textContent = window.outerWidth;
            oh.textContent = window.outerHeight;
          });
        </script>
      </body>
    ```
    
    ![window size.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/window_size.png)
    
    - 可以发现，浏览器视口显示的**逻辑分辨率**为675 × 342，而**物理分辨率**为1236 × 627，因为显示屏幕的DPI较高，一个像素的大小并非为标准的CSS大小，所以出现物理分辨率较高的现象；同时`window.innerWidth * devicePixelRatio` 结果就是1235，恰好接近物理分辨率的宽度，也进一步验证了`devicePixelRatio` 就是较为准确的**像素比**
    - 同时需要注意，`outerWidth` 和`outerHeight` 显示的值比实际浏览器窗口自身的值（物理分辨率折算后的）大一些，这是**谷歌浏览器**的原因，如果在**火狐浏览器**中，视口的宽高和窗口自身的宽高都恰好是符合设备的物理分辨率和逻辑分辨率的，如下,设置火狐浏览器的宽高在设备上的（物理）像素占比为1920 ×1080,此时视口和窗口的宽高都可以通过给定的devicePixelRatio完美转换为物理分辨率
    
    ![window size2.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/window_size2.png)
    

## 1.4.2 document表示尺寸的属性

---

- 除了使用全局变量`innerWidth/Height`, `outerWidth/Height` 获取视口和窗口的宽高外，还可以使用全局变量`document` 对象中的属性获取页面视口的宽度和高度
    - `document.documentElement.clientWidth` : 返回视口的宽度
    - `doocument.documentElement.clientHeight` ：返回视口的高度
- 浏览器窗口的精确尺寸不好确定，但是容易确定页面视口，同时可以确定如下两个表达式都返回`true`
    
    ```jsx
    document.documentElement.clientWidth === window.innerWidth;
    document.documentElement.clientHeight === window.innerHeight;
    ```
    
    - 如果**文档为标准模式且没有滚动条**，现代浏览器上方的两个表达式一定返回`true` ，
    - 非标准模式（混杂模式）下或有滚动条，可能会有其他情况
- 《JavaScript高级程序设计（第4版）》举了如下的例子用于确定页面视口
    
    
    ```jsx
    let pageWidth = window.innerWidth;
    let pageHeight = window.innerHeight;
    if (typeof pageWidth !== "number") {
      if (document.compatMode === "CSS1Compat") {
        pageHeight = document.documentElement.clientHeight;
        pageWidth = document.documentElement.clientWidth;
      } else {
        pageHeight = document.body.clientHeight;
        pageWidth = document.body.clientWidth;
      }
    }
    ```
    
    1. 将`pageWidth/Height` 分别设置为`innerWidth/Height` ，这是**包括了滚动条**的页面视口高度和宽度
    2. 如果要计算**不包括**滚动条的页面视口高宽，就需要获取具体的文档中最外层元素的高度和宽度，`clientWidth/Height` 是文档对象模型中的标签元素都具有的属性
    3. 以文档元素对象角度获取视口高宽，有两个可选的元素节点，一个是包裹全部元素的html元素，一个是包裹全部可被渲染的内容元素的body元素
    4. 在这里，通过`document.compatMode` 判断文档是否处于标准模式，如果是就是使用html元素的宽度和高度，如果不是就使用body元素的宽度和高度
        
        关于文档模式可以查看第二章[3.文档模式](../2%20HTML%E4%B8%AD%E7%9A%84JavaScript.md) 查看一些具体差别，关于`document.compatMode` 属性值，它可以返回当前文档处在的文档模式，具体参考[MDN-compatMode](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/compatMode)
        
        [document.compatMode](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/document%20compatMode.md)
        
        - 如果文档使用标准模式，就使用`document.documentElement.clientHeight/Width` ，因为`documentElement` 是html元素对象，它在标准模式下的宽高就是**不计算**滚动条的视口宽高
        - 如果文档使用混杂模式，就使用`document.body.clientHeight/Width` 因为混杂模式下的文档html元素的行为会有区别，但是`body` 元素始终是内容元素，它是最后计算视口宽高的保底
        
        ![quirk mode viewport heigt.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/quirk_mode_viewport_heigt.png)
        
        - 上面是火狐浏览器（谷歌浏览器不会出现这种情况）打开一个空白（混杂模式）的文档在控制台输出`innerHeight`和`clientHeight`相关属性的例子，~~可以发现火狐浏览器的html元素在混杂模式下的高度不是准确的~~ （关于这种情况详情查看16章-[**MDN补充**](../16%20DOM2%E5%92%8CDOM3%EF%BC%88DOM%20Levels%202%20and%203%EF%BC%89/2%20%E6%A0%B7%E5%BC%8F.md) ）

## 1.4.3 可见视口和布局视口

**下面的解释参考《JavaScript高级程序设计（第4版）》，可能不太清楚，可以直接查看[补充](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89.md)**

- 上述关于窗口的大小都是关于浏览器的窗口，在**移动设备**上，`window.innerWidth`和`window.innerHeight` 返回**可见视口**（**visual viewport**）大小。也就是屏幕上页面可视区域大小。
    
    ![IPHONE SE.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/IPHONE_SE.png)
    
    - 这是IPhone SE移动设备，全屏显示内容时的情况，它的内部视口宽高等于设备的宽高
    
    <aside>
    ❓ 注意：Mobile Internet Explorer 支持这些属性，但在`document.documentElement.clientWidth/clientHeight` 中 提供了相同的信息，在放大缩小时这些值会相应的变化（无关紧要，因为Mobile Internet Explorer已被淘汰，没必要针对它做一些特殊处理）
    
    </aside>
    
- 在**其他移动浏览器（非**Mobile Internet Explorer**）**中，`document.documentElement.clientWidth` 和`document.documentElement.clientHeight` 返回的是**布局视口（layout viewport）**大小，即**渲染页面**（**rendered page**）的实际大小
    - **布局视口**是相对于可见视口的概念，可见视口只能显示整个页面的一小部分
    - 因为桌面浏览器的差异，所以需要确定用户是不是在使用移动设备，然后再决定使用哪个属性
- 移动设备上的视口比较复杂，但是可以通过resize事件随时获取浏览器或移动设备上页面视口的不同属性的高宽值，之前有一个例子能动态显示浏览器窗口的尺寸变化下页面视口大小和窗口自身的大小，现在加上`document.body.clenetWidth/Height` 以此观察**布局视口**大小
    
    ```jsx
    iw.textContent = window.innerWidth;
    ih.textContent = window.innerHeight;
    ow.textContent = window.outerWidth;
    oh.textContent = window.outerHeight;
    dpr.textContent = window.devicePixelRatio;
    hcw.textContent = document.documentElement.clientWidth;
    hch.textContent = document.documentElement.clientHeight;
    bch.textContent = document.body.clientHeight;
    bcw.textContent = document.body.clientWidth;
    
    window.addEventListener("resize", () => {
      iw.textContent = window.innerWidth;
      ih.textContent = window.innerHeight;
      ow.textContent = window.outerWidth;
      oh.textContent = window.outerHeight;
      dpr.textContent = window.devicePixelRatio;
      hcw.textContent = document.documentElement.clientWidth;
      hch.textContent = document.documentElement.clientHeight;
      bch.textContent = document.body.clientHeight;
      bcw.textContent = document.body.clientWidth;
    });
    ```
    
    - 火狐浏览器的显示
    
    ![firefox.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/firefox.png)
    
    - 谷歌浏览器的显示
    
    ![chromepng.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/chromepng.png)
    
    - 可以发现在整个浏览器设置为1920 × 1080 物理分辨率大小时，二者各个属性的值差别其实不大
    - 可能因为浏览器本身设置的字体大小以及工具栏的显示，在`document.body.clientHeight` 上有所差别
    - 可以确定的是
        - 在标准文档模式和没有滚动条的情况下，html元素的`clientWidth/Height` 总是与`innerWidth` 和`innerHeight` 全局变量值相等
        - `outerWidth/Height` 在电脑等可以运行PC浏览器的地方，它们的值会因为浏览器的工具栏和边框而大于`innerWidth/Height` ，而在移动设备中，因为移动设备的整个屏幕可能都显示页面，所以二者几乎没有差别
        - body元素的`clientWidth/Height` 显示的是渲染body元素的部分的大小，所以`clientHeight` 的变化会比较大，如下
            
            ![body.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/body.png)
            
            - 在实际开发中，body元素应该设置和视口一样的高宽，标准文档模式下body本身自带样式，所以显示的高度和宽度比视口要小

---

**补充**

- 首先要搞清楚**可见视口（visual viewport）**，**布局视口（layout viewport）**指的是什么，不然也无法知晓通过`clientWidth`和`clientHeigt` 获得的长度有什么意义
    - **可见视口（visual viewport）**：又称**视觉视口**，顾名思义，在当前**视口（viewport）**中可见的**部分**（**portion**），称为可见视口；一般的，可见视口是屏幕的可视部分，或者说浏览器内容的显示区域；更具体一点，浏览器窗口减掉所有**按钮，工具栏**等组件，包含的实际网页内容的空间（包含滚动条宽度）；一般可以通过`window.innerWidth/Height` 来获取视觉视口
    - **布局视口（layout viewport）**：布局视口是浏览器在其中绘制网页的视口。本质上，它表示可以看到的内容，而视觉视口表示用户显示设备上当前可见的内容。布局视口在移动设备上变得很重要，在移动设备中，通常可以使用捏手势来放大和缩小网站的内容。渲染的文档不会以任何方式更改，因此当用户调整缩放级别时，布局视口保持不变。相反，视觉视口将更新以指示用户可以看到的页面区域（不包括`borders`, `margins`, 滚动条）。
        
        ![mobile_layoutviewport.jpg](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/mobile_layoutviewport.jpg)
        
- 关于两种视口，可以查看如下的文章
    
    [quirksmode-viewports](https://www.quirksmode.org/mobile/viewports.html)
    
    [quirksmode-viewports2](https://www.quirksmode.org/mobile/viewports2.html)
    
    [两个视口的故事——第一部分](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/%E4%B8%A4%E4%B8%AA%E8%A7%86%E5%8F%A3%E7%9A%84%E6%95%85%E4%BA%8B%E2%80%94%E2%80%94%E7%AC%AC%E4%B8%80%E9%83%A8%E5%88%86.md)
    
    [两个视口的故事——第二部分](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/%E4%B8%A4%E4%B8%AA%E8%A7%86%E5%8F%A3%E7%9A%84%E6%95%85%E4%BA%8B%E2%80%94%E2%80%94%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86.md)
    
- 现在再看《JavaScript高级程序设计（第4版）》中的获取页面视口大小的代码，就能理解为啥要这么写了
    - 在浏览器实现了`innerWidth/Height`的情况下，`innerWidth`和`innerHeight` 就是视口的大小（包含滚动条）
    - 如果文档是标准模式，那么根据CSSOM规范的特殊例子，<html>元素的`clientWidth` 和`clientHeight` 始终返回视口大小（不包含滚动条，近似结果）
    - 如果文档是混杂模式，那么<html>元素的`clientHeight` 属性不再返回视口大小，它根据会因为文档的内容而有可能大于视口高度；而<body>元素的`clientWidth.Height` 属性会返回视口大小（不包含滚动条，近似结果）
- 例子
    
    ```jsx
    function getClientSize(ele) {
      return [ele.clientWidth, ele.clientHeight];
    }
    function getOffsetSize(ele) {
      return [ele.offsetWidth, ele.offsetHeight];
    }
    
    function getWindowSize() {
      return [innerWidth, innerHeight];
    }
    
    function getInfomation() {
      const infomation = {
        "&lt;html&gt;的clientSize": getClientSize(document.documentElement),
        "&lt;html&gt;的offsetSize": getOffsetSize(document.documentElement),
        "&lt;body&gt;的clientSize": getClientSize(document.body),
        "&lt;body&gt;的offsetSize": getOffsetSize(document.body),
        window的innerSize: getWindowSize(),
      };
      const lis = [];
      for (const key in infomation) {
        lis.push(`<li>${key}：${infomation[key].join("x")}</li>`);
      }
      return `<ul>${lis.join("")}</ul>`;
    }
    
    const info = document.querySelector(".info");
    info.innerHTML = getInfomation();
    
    window.addEventListener("resize", () => {
      info.innerHTML = getInfomation();
      setVisualInfo();
      setLayoutInfo();
    });
    
    function getVisualSize() {
      let pageWidth = innerWidth;
      let pageHeight = innerHeight;
      if (typeof pageWidth !== "number") {
        if (document.compatMode === "CSS1Compat") {
          pageHeight = document.documentElement.clientHeight;
          pageWidth = document.documentElement.clientWidth;
        } else {
          pageHeight = document.body.clientHeight;
          pageWidth = document.body.clientWidth;
        }
      }
      return [pageWidth, pageHeight];
    }
    function setVisualInfo() {
      const widthDiv = document.querySelector(".visual-info .width");
      const [pageWidth, pageHeight] = getVisualSize();
      widthDiv.textContent = pageWidth;
      const heightDiv = document.querySelector(".visual-info .height");
      heightDiv.textContent = pageHeight;
    }
    setVisualInfo();
    
    function setLayoutInfo() {
      const widthDiv = document.querySelector(".layout-info .width");
      const [layoutWidth, layoutHeight] = getClientSize(document.documentElement);
      widthDiv.textContent = layoutWidth;
      const heightDiv = document.querySelector(".layout-info .height");
      heightDiv.textContent = layoutHeight;
    }
    setLayoutInfo();
    ```
    
    ![视口例子.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/%25E8%25A7%2586%25E5%258F%25A3%25E4%25BE%258B%25E5%25AD%2590.png)
    
    - 这个例子**主要针对PC端的浏览器，**完整代码查看[GITHUB](https://github.com/mangwu/javascript/tree/master/ProfessionalJavaScriptForWebDeveloper4/ch12%20-%20BOM/12.1%20window/12.1.4%20window%20size/12.1.4.3%20layout%20viewport%20and%20visual%20viewport)
    - 可以通过边框发现，<html>，<body>的尺寸**继承于**文档之上的（PC端为可视视口，移动端为布局视口）视口，内部`div` 元素的高宽超出了视口，所以产生了滚动条
    - 对于PC端浏览器而言，**可视视口**就是`window.innerHeight`和`window.innerWidth`
    - 对于PC端浏览器，**布局视口**使用`document.documentElement.clientWidth/Height`
    - 可以得出的结论：
        - 元素的客户端尺寸（`clientWidth/clientHeight`）是包括内容，`padding` 的（包括可以滚动的部分），属于元素内部的**布局尺寸**；标准模式下，除了<html>元素的客户端尺寸表示布局视口的尺寸外，其它情况都符合定义
        - 元素的偏移尺寸（`offsetWidth/offsetHeight`），和客户端尺寸的唯一却别在于它**包括滚动条和边框**，并且在标准模式下，**<html>元素也遵循这个规则**，包含边框和滚动条
    - 对于移动端浏览器而言，情况会很复杂，但是**[可视视口](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89.md)和[布局视口](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89.md)的两条结论是没有错误的**
        - 本例子使用了meta语句，对移动设备进行了部分兼容
            
            ```jsx
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            ```
            
        - 在移动端，布局视口被赋予一个默认值，大部分为`980px`
        - 移动端的可视（视觉）视口是变化的，当用户对浏览器进行缩放时，不会改变布局视口的大小，所以页面布局是不变的，但是缩放会改变视觉视口的大小。
        - 除了视觉视口和布局视口外，移动端还有理想视口的概念，即网站页面在移动端展示的理想大小，当页面缩放比例为`100%`时，`CSS像素 = 设备独立像素`，`理想视口 = 视觉视口`。可以通过调用`screen.width / height`来获取理想视口大小。

## 1.4.4 窗口尺寸变化

- window提供两个方法调整窗口大小，和`moveTo()`或`moveBy()` 方法类似
    - `resizeTo()` ，接受两个参数，第一个是新的宽度，第二个是新的高度，单位都是标准CSS物理像素，它会重新设置`outerWidth` 和`outerHeight` （包括滚动条，窗口边框，标题栏，工具栏等）
    - `resizeBy()` ，接受两个参数，第一个参数为窗口水平方向变化的像素值，第二个参数为窗口垂直方向变化的像素值，单位都是标准CSS物理像素，它们可以是负数，表示缩小窗口。需要注意的是，`resizeBy()` 属于DOM Level 0，[**现在不属于规范**](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/resizeBy#%E8%A7%84%E8%8C%83)了
- 谷歌*似乎*已经禁用了这两个方法，虽然window对象上存在这两个方法，但是无法生效
- 从火狐7开始，是以下情况下的窗口也无法调整窗口大小了
    1. 不能调整非window.open方法打开的窗口或Tab页面
    2. 当一个窗口内含超过一个Tab页面时，不能调整窗口大小
    
    ---
    
    也就是说火狐浏览器允许一个只有一个Tab页面且由window.open方法打开的窗口调整大小
    
- 以下是一个使用火狐浏览器完成窗口变化的例子，利用`window.open()` 方法打开一个提前写好页面，实现使用resize系列方法的条件1，并利用`window.close()` 方法关闭当前页面，实现条件2；然后利用`setTimeout` 函数在新页面中异步执行resize系列方法，就能看到`resizeTo`和`resiezBy`的效果
    
    工具页面 window size change.html，用于打开目标页面
    
    ```html
    <script>
      window.open("./12.1.4 target window.html");
      window.close();
    </script>
    ```
    
    执行`resizeTo/By` 方法的页面，使用异步函数以看到方法效果
    
    ```html
    <body>
      <p>1.5秒后变化为800 × 500（逻辑像素）</p>
      <script>
        const p = document.querySelector("p");
        setTimeout(() => {
          resizeTo(800, 500);
          p.textContent = "2.5秒后减少300宽度（CSS像素），增加100高度（CSS像素）";
          setTimeout(() => {
            resizeBy(-300, 100);
            p.textContent = "变化窗口成功！";
          }, 2500);
        }, 1500);
      </script>
    </body>
    ```
    
    结果
    
    ![window size change.gif](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/window_size_change.gif)
    

# 1.5 视口位置（Window Viewport Position）

## 1.5.1 理解视口位置

- 浏览器窗口尺寸通常无法满足完整显示整个页面，为此用户可以通过**滚动**（**scroll**，滚动条在视口内）在有限的视口中查看文档
- 视口当前显示的一部分在整个文档中的位置就是视口位置，它可以用一个平面坐标表示$(x, y)$,
    - 如果能显示完整文档内容，视口的位置就是$(0, 0)$.
    - 如果不能完整显示内容，视口的位置就是当前浏览器视口左上角所在的文档位置距离完整文档左上角在水平和垂直方向的距离，使用$(x, y)$表示
    - 通过上述描述，$x$实际上就是水平滚动条向右移动的距离，而$y$实际上就是垂直滚动条向下移动的距离，下面的图很好的显示了视口位置的概念
    
    ![MacBook Air - 1.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/MacBook_Air_-_1.png)
    
    ![MacBook Air - 2.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/MacBook_Air_-_2.png)
    
- 度量文档相对于视口滚动距离的属性有两对，因为视口位置可以从**文档角度**[解释为距离文档原点的位置](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89.md)，也可以从**页面角度**[解释为页面滚动的距离](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89.md)；总之二者返回相同的值
    - `window.pageXoffset/window.scrollX` , 返回文档/页面水平方向滚动的像素值
    - `window.pageYoffset/window.scrollY` ,返回文档/页面在垂直方向滚动的像素值
- 可以通过监听`scroll` 事件实时获取文档/页面的视口位置信息：
    
    ```html
    <head>
    	<style>
      body {
        height: 150vh;
        width: 150vw;
        position: relative;
      }
      div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      </style>
    </head>
    <body>
      <div>
        <p>window.scrollX: <span class="scroll-x">0</span></p>
        <p>window.scrollY: <span class="scroll-y">0</span></p>
      </div>
      <script>
        const sx = document.querySelector(".scroll-x");
        const sy = document.querySelector(".scroll-y");
        window.addEventListener("scroll", () => {
          sx.textContent = window.scrollX;
          sy.textContent = window.scrollY;
        });
      </script>
    </body>
    ```
    
    ![scrollXY.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/scrollXY.png)
    
    - 滚动垂直滚动条，window.scrollY改变
    - 滚动水平滚动条，window.scrollX改变

## 1.5.2 滚动方法

- window提供了三个方法让页面进行滚动，并改变对应的scrollX和scrollY值，这三个方法都接受相对视口距离的$(x, y)$坐标
    - `scroll() /scrollTo()` 这两个方法的功能完全一样，传递一个视口位置，并滚动到这个视口位置
    - `scrollBy()` 接受相对当前视口位置的距离坐标，可以为负数，负数就表示文档垂直向上或水平向左移动一定距离，正数就表示文档标准垂直向下或水平先右移动一定距离
- 滚动方法除了接受相对视口距离的$(x, y)$坐标外，还可以**只接受**一个可选`options` 参数
    - 它是一个表示滚动行为的参数，包括`top`和`left` 属性，等同于相对于视口距离的`x`和`y`
    - 除此之外还有一个`behavior`属性，它具有枚举值，表示滚动时的“效果”，具体有
        - “smooth”:平滑滚动
        - “instant”：瞬间滚动
        - “auto”：默认值，效果和“instant”一样
- 例子，在上面监听窗口的视口位置的基础上，利用`setTimeout` 查看滚动效果
    
    ```jsx
    const tips = document.querySelector(".tips");
    setTimeout(() => {
      scrollTo({
        top: 300,
        left: 400,
        behavior: "smooth",
      });
      tips.textContent = "2s后向上移动100，向左移动200";
      setTimeout(() => {
        scrollBy({
          top: -100,
          left: -200,
          behavior: "smooth",
        });
        tips.textContent = "移动完毕";
      }, 2000);
    }, 1500);
    ```
    
    效果如下
    
    ![scroll window.gif](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/scroll_window.gif)
    

# 1.6 导航和打开新窗口（Navigating and Opening Windows）

## 1.6.1 `window.open()`

### 1.6.1.1 **定义**

- `widnow.open()` 方法用于**导航**（**navigate**）到指定URL，也可以用于打开新浏览器窗口
- MDN如下定义：`window.open()` 加载一个指定的资源到一个新的或已经存在的**浏览器上下文**（可以是一个tab页，可以是一个窗口，或者一个内联iframe元素）

### 1.6.1.2 语法

```html
open();
open(url);
open(url, target);
oepn(url,target, windowFeatures);
```

- **参数**
    - `url` 可选，要加载的资源的的URL，一个字符串；如果传递空字符串或者忽略`url` ，一个空白页面（about:blank）会被打开到目标浏览器上下文（**targeted browsing context**）
    - `target` : 可选，一个没有空格的字符串，它指定资源被加载到的**浏览器上下文**(**browsing context**)的**名称**（`**window.name**`），即目标窗口的`window.name` 属性值（意思就是说有另一个tab页的`name` 属性值为`target` 指定的值，那么这个tab页窗口中的页面就会加载为open()指定url的文档）
        
        [window.name](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/window%20name.md)
        
        - 如果这个name不能标识现有的浏览上下文，一个新的上下文会被创建（即一个新浏览器tab页面）
        - `target` 值和a标签元素的`target`属性（attribute）值功能类似（都是加载新页面的一种方式），所以它也有一些特殊值：`_self`, `_blank`, `_parent`, 和 `_top`
    - `windowFeatures` :可选，一个字符串，表示加载的文档窗口特性，它可以用**逗号分隔**（**comma-separated**）表示多个特性；每个特性的的表示格式为`name=value` 形式，如果一个特性的value为布尔值可以直接使用特性名称（name）。如果没有传递这个参数， 则新窗口（标签）会带有所有默认的浏览器特性（工具栏、地址栏、状态栏都是默认配置）；如果**打开的不是新窗口，则忽略第三个特性**。这些特性包括窗口的默认尺寸和位置等，具体如下表
        
        
        | feature特性名称 | value特性值 | 描述 |
        | --- | --- | --- |
        | popup | falsy值，yes,no；使用表示布尔效果的值说明是否支持该特性，也可不使用value，直接用名称表示支持 | 请求使用最小的弹出窗口；弹出窗口中包含的UI功能将由浏览器自动决定，通常只包括一个地址栏；如果没有启用popup，则没有声明窗口功能，新浏览上下文就是一个选项卡（tab页）。注意，在使用windowFeatrues指定任意除了noopener和noreferrer的特性，默认开启popup |
        | width/innerWidth | 数值，最小值为100，以CSS标准像素为单位 | 设置新窗口的内容区（视口区，包括滚动条）的宽度 |
        | height/innerHeight | 数值，最小值为100，以CSS标准像素为单位 | 设置新窗口的内容区（视口区，包括滚动条）的高度 |
        | left/screenX | 数值，非负数，以CSS标准像素为单位 | 新窗口的x坐标，表示窗口浏览器左上角距离用户操作系统工作区域左边的垂直距离 |
        | top/screenY | 数值，非负数，以CSS标准像素为单位 | 新窗口的y坐标，表示窗口浏览器左上角距离距离用户操作系统工作区域上边的垂直距离 |
        | noopener | falsy值，yes,no；使用表示布尔效果的值说明是否支持该特性，也可不使用value，直接用名称表示支持 | 默认情况下，普通的新窗口可以通过window.opener 访问原始窗口（执行open打开新窗口的window）；如果启用这个特性，新窗口访问window.opener获得null 。注意，使用这个特性字符，第二个参数target 除了使用_top，_self，和_parent 这些特殊非空值时，默认被视为_blank（即打开新窗口而非使用已存在的浏览上下文） |
        | noreferrer | falsy值，yes,no；使用表示布尔效果的值说明是否支持该特性，也可不使用value，直接用名称表示支持 | 启用该功能，浏览器将忽略https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer头文件，并将noopener设置为true；这和a标签上的rel属性（attribute）设置为noreferrer功能类似 |
    
    <aside>
    💡 注意：新弹出的窗口任何部分最初都不能定位在屏幕外部，具体而言就是在设置sceenX/Y何width/heigth时，需要保证弹窗的窗口的尺寸和位置都在用户操作系统的工作区内，否则会自动被修正（corrected）
    
    </aside>
    
    <aside>
    ❓ 上述的windowFeatures可选特性参考[MDN-open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#description) ；而《JavaScript高级程序设计（第4版）》，因为它列举的一些特性已经不是标准甚至有些已经失去效果，如fullscreen，location等
    
    </aside>
    
- **返回值**
    - 加载的新窗口`window`对象的代理，就是一个`WindowProxy`对象，可以用它访问新窗口的属性和方法，只要符合同源策略安全需求（the same-origin policy security requirements）

### 1.6.1.3 例子测试

[1.6.3 一些自定义例子](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/1%206%203%20%E4%B8%80%E4%BA%9B%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BE%8B%E5%AD%90.md)

## 1.6.2 安全限制（Security Restrictions）

- 弹出窗口有段时间被在线广告用滥了，原因在于
    - 弹出窗口长得像系统对话框，用户难以分辨
    - 很多在线广告会把弹出窗口伪装成系统对话框，诱导用户点击
- 为了让用户能够区分清楚，浏览器开始对弹窗施加限制
    - IE早期版本实现针对弹窗的**多重安全限制（multiple security features），**包括不允许创建弹窗或把弹窗移到屏幕外，以及不允许隐藏状态栏
    - IE7开始，地址栏不能被隐藏，而且弹窗默认是不能移动或缩放的
    - 火狐1禁用乐隐藏状态栏的功能
    - 火狐3强制弹窗始终显示地址栏
    - opera只会在主窗口中打开新窗口，但不允许它们出现在系统对话框的位置
    - 浏览器只会在用户操作下才允许创建弹窗，在~~网页加载的过程中调用window.open()没有效果~~

## 1.6.3 弹窗屏蔽程序（Pop-up Blockers）

- 所有现代浏览器都内置了屏蔽弹窗的程序，因此大多数意料之外的弹窗都会被屏蔽，如下是谷歌浏览器对弹出窗口进行的限制
    
    ![popup.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/popup.png)
    
- 如果弹窗被浏览器内置的弹出屏蔽程序阻止了弹窗，那么window.open()很可能会返回null，此时只要检查open方法的返回值就能知道弹窗是否被屏蔽了，如下
    
    ```jsx
    let baiduWin = window.open("https://baidu.com/");
    if(!baiduWin) {
    	alert("popup was blocked");
    }
    ```
    
    ![blocker.png](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/blocker.png)
    
- 除此之外，浏览器屏蔽程序或浏览器扩展在屏蔽弹窗时，`window.open()` 通常会**抛出错误**，因此要准确检测弹窗是否被屏蔽，除了检测window.open()的返回值，还可以使用try/catch包装起来，如下
    
    ```jsx
    let blocked = false;
          try {
            let baiduWin = window.open("https://baidu.com/");
            if (!baiduWin) {
              blocked = true;
            }
          } catch (error) {
            console.log(error);
            blocked = true;
          }
          if (blocked) {
            alert("The Popup was blocked");
          }
    ```
    
    - 注意1：现代浏览器使用弹窗默认会被拦截，但是不会**抛出异常**
    - 注意2：检查弹窗是否被屏蔽，不影响浏览器显示关于弹窗被屏蔽的消息

# 1.7 定时器（Intervals and Timeouts）

- JavaScript在浏览器中是**单线程**（**single-threaded**）执行的，但允许使用定时器（timeouts and intervals）指定在某个时间之后或间隔一段时间就执行相应的代码（这一点在第11章期约和异步函数中已经应用过），下面的两个window方法是JavaScript中用于定时执行代码的两个函数
    - `window.setTimeout()` 用于指定在一定时间后执行某些代码
    - `window.setInterval()` 用于在指定每隔一段时间执行某些代码

## 1.7.1 setTimeout()

全局的setTimeout()方法设置一个**定时器**（**timer**），该定时器在定时器到期后执行**一个函数**或指定的**一段代码**

### 1.7.1.1 语法

```jsx
var timeoutId1 = scope.setTimeout(function[, delay, arg1, arg2, ...]);
var timeoutId2 = scope.setTimeout(function[, delay]);
var timeoutId3 = scope.setTimeout(code[, delay]);
```

参数

- `function` ：第一个参数，是在到期时间（`delay` 毫秒）之后执行的函数
- `code` : 第一个参数， 同时是一个可选语法，可以使用字符串而不是`function` （函数）来表示在到期时间后编译和执行的字符串；该语法不被推荐，和`eval()` 一样有安全问题
- `delay` ：可选，延迟的毫秒数，第一个参数的执行（函数的调用或字符串代码的编译执行）会在该延迟后发生。如果省略该参数，delay取默认值0，意味“马上”执行或尽快执行
    
    <aside>
    💡 注意，由于代码执行需要时间，以及设备的指令执行需要时间，所以开始执行代码的延迟时间可能会比期待的值（delay 值）长，~~最小延迟时间为为4ms~~,这也是为什么说“马上”而不是立即的原因
    
    </aside>
    
- `arg1,arg2…,argN` ：可选，附加参数， 如果第一个参数是`function`，那么可以添加附加参数，一旦定时器到期，这些参数会传递给`function`
    
    <aside>
    💡 注意，IE9及其更早的浏览器不支持向回调函数中传递额外参数
    
    </aside>
    

**返回值**

- `timeoutID` 是一个正整数，表示定时器的编号（**numeric ID**），这个值可以传递给`clearTimeout()` 来取消该定时器
    - 定时器的编号各不相同，它们组成一个编号池，需要注意 `setTimeout()` 和`setInterval()` 是共用一个编号池的，技术上，`clearTimeout()` 和`clearInterval()` 可以互换使用（但不要混用）
    - 在同一个对象上（一个window或一个worker），`setTimeout()` 和`setInterval()` 在后续的调用不会重用同一个定时器编号，但是不同的对象使用独立的编号池

### 1.7.1.2 理解`setTimeout()`

- JavaScript是单线程的，所以每次只能执行一段代码；但是为了调度不同代码的执行，JavaScript维护了一个**任务队列**
    - 其中的任务会按照添加到队列的先后顺序执行
    - `setTimeout()` 的第二个参数只是告诉JavaScript引擎指定的毫秒数过后把任务添加到这个任务队列
    - 如果队列为空，则会立即执行该代码，如果队列不为空，则代码必须等待前面的任务执行完才能执行
- `setTimeout()` 在`delay` 到期时间后为任务队列添加一个任务，在`delay` 之前的时间，可以随时进行中断，即临时取消在JavaScript的任务队列中添加任务，可以使用`clearTimeout()` 完成，传入对应定时器的编号即可；如果在任务执行后（`delay`到期后）再调用`clearTimeout()` 是没有效果的
- 所有定时器的代码（函数）都会在全局作用域中的一个匿名函数中运行，因此函数中的`this` 值在非严格模式下始终指向`global` 全局对象（浏览器就是window），而在严格模式下是`undefined` 。为了保证`this` 是定义时的最近词法作用域中的`this`值，**推荐**在第一个参数中使用**箭头函数**

---

MDN上关于`setTimeout()` 更深层次的理解可以查看[MDN-setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)

[MDN-setTimeout](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/MDN-setTimeout.md)

### 1.7.1.3 例子

```jsx
let timeoutId = setTimeout(() => alert("Hello, world!"), 1000);
clearTimeout(timeoutId); // 取消
```

## 1.7.2 setInterval()

setInterval()和setTimeout()使用方法类似，只不过它设置的是一个**循环定时器**，指定的任务会每隔指定时间就执行一次，直到取消循环定时或页面卸载

### 1.7.2.1 语法

```jsx
var intervalID = setInterval(func, [delay, arg1, arg2, ...]);
var intervalID = setInterval(function[, delay]);
var intervalID = setInterval(code, [delay]);
```

参数

- `function` ：第一个参数，是在每个到期时间（`delay` 毫秒）之后执行的函数，第一次调用发生在`delay` 毫秒后
- `code` : 第一个参数， 同时是一个可选语法，可以使用字符串而不是`function` （函数）来表示在到期时间后编译和执行的字符串；该语法不被推荐，和`eval()` 一样有安全问题
- `delay` ：可选，延迟的毫秒数，第一个参数的每次执行（函数的调用或字符串代码的编译执行）会以该延迟后为间隔。如果省略该参数，delay取默认值0，意味每次执行的间隔“很短”
    
    <aside>
    💡 注意，由于代码执行需要时间，以及设备的指令执行需要时间，所以每次执行代码的延迟时间可能会比期待的值（delay 值）长，~~最小延迟时间为为4ms~~,这也是为什么说“很短”而不是连续的原因
    
    </aside>
    
- `arg1,arg2…,argN` ：可选，附加参数， 如果第一个参数是`function`，那么可以添加附加参数，一旦定时器到期，这些参数会传递给`function`

### 1.7.2.2 理解setInterval()

- `delay` 在`setInterval()` 中指间隔时间，指的是向队列中添加新任务之前等待的时间，它不会关心上一个任务是否执行完毕
    - 例如调用`setInterval()` 的时间为01:00:00，间隔时间为2000毫秒，意味着01:00:02时，浏览器会把任务添加到执行队列
    - 浏览器不会关心这个任务什么时候执行以及要花费多少时间，浏览器确定的是在01:00:04时，它会再向队列中添加一个任务
    - 如果任务执行的时间大于3000毫秒或者期间有其它任务异步操作添加了任务，可能导致任务开始执行的时间延迟从而照成阻塞
    - 所以**执行时间短，非阻塞**的回调函数比较适合`setInterval()`
- `setInterval()` 和`setTimeout()` 一样会返回一个循环定时器的编号ID，用于在未来的某个时间点取消对应的循环定时器，调用`clearInterval()` 并传入定时编号ID，取消对应循环定时器
- `setInterval()` 在实际开发中很少用到，因为一个任务结束和下一个任务开启之间的时间间隔是无法保证的，有些循环定时任务可能会因此而被跳过，`setTimeout()` 能确保不会出现这种情况下，且`setTimeout()` 可用于防抖函数中防止连续多次进行网络请求

### 1.7.2.3 例子

```jsx
function cycle(times, callback, delay, ...args) {
  let interval = null;
  const wrapperCallback = () => {
    times--;
    callback(...args);
    if (times == 0) {
      clearInterval(interval);
      console.log("done");
    }
  };
  interval = setInterval(wrapperCallback, delay);
}

let num = 0;
cycle(500, () => console.log(num++), 20);
// 0
// 1
// ...
// 498
// 499
// done
```

- 这个例子实现了**异步循环**，只要指定循环次数和每次循环的时间间隔，就能达到每隔`delay` 秒执行执行指定回调，共执行`times` 次

使用`setTimeout()`同样能实现这样的异步循环,不过要利用递归的性质如下

```jsx
// 使用setTimeout实现上述的情况下
function cycle2(times, callback, delay, ...args) {
  if (times <= 0) {
    console.log("done");
    return;
  }
  setTimeout(() => {
    callback(...args);
    cycle2(--times, callback, delay, ...args);
  }, delay);
}
let num = 0;
cycle2(500, () => console.log(num++), 20);
// 0
// 1
// ...
// 498
// 499
// done
```

上面的两个例子每个打印间隔为20ms，共打印500次，所以理论异步花费时间为10s，但实际上可能比这要多，可以通过`Date` 记录开始和结束时间，经过比较可得如下代码和打印

```jsx
let num = 0;
let last = new Date();
cycle(500, () => console.log(num++), 20);
// 0
// 1
// ...
// 498
// 499
// done 15748
// 两段代码分别执行
let num2 = 0;
let last2 = new Date();
cycle2(500, () => console.log(num2++), 20);
// 0
// 1
// ...
// 498
// 499
// done 15778
```

- 上述都是在node环境下进行打印，在浏览器环境下可能会更快一点（done 12015）

# 1.8 系统对话框（System Dialogs）

- 浏览器可以使用`alert()` 、`confirm()` 、`prompt()` 等方法，让浏览器调用系统对话框向用户显示消息
    - 这些对话框于浏览器中显示的网页无关，而且也不包括HTML
    - 它们的外观由操作系统或者浏览器决定，无法使用CSS设置样式
    - 此外这些对话框都是同步的模拟对话框，即在它们显示的时候，代码会停止执行，在它们消失后，代码才会恢复执行

## 1.8.1 alert()

- `window.alert()` 会指示浏览器显示一个带有可选消息的对话框，并等待用户确认后**消失**（**dismiss**）
- 在某些情况下浏览器可能不会实际显示出对话框，例如在切换选项卡时，当前窗口弹出的对话框就不会显示

### 1.8.1.1 语法

```jsx
window.alert([message]); 
```

- 参数，`message` ，可选的，想要在alert对话框中显示的字符串，传入其它类型的参数会被转化为字符串
- 返回值`undefined`

### 1.8.1.2 理解alert()

- alert对话框只有一个**确定（OK）**按钮
- **alert** 英文本身具有警告，警示之意，所以也可以称为**警告框（alert）**，它会向用户显示一些浏览器无法控制的信息，比如报错，用户唯一的选择就是在看到警告框之后点击确定让其关闭
- 不同的浏览器会有不同形态的警告框，但是样式大体相同

### 1.8.1.3 警告框

```jsx
window.alert("Hello, world!"); // 不同的浏览器弹出的警告框大同小异
```

- 谷歌浏览器
    
    ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%205.png)
    
- 火狐浏览器
    
    ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%206.png)
    
- 二者区别在于
    - **位置**：谷歌浏览器的警告框水平居中，垂直方向向上固定靠近地址工具栏，而火狐浏览器的警告框水平垂直居中
    - **背景：**谷歌和火狐弹出弹窗后的页面的其余部分都无法点击（除了弹窗其它交互都暂时失效），但是火狐使用了一层灰色部分透明元素掩盖了后面的元素，但是谷歌没有
    - **样式：**弹窗样式略有不同，火狐使用了一个图标，标题加深且仅为当前页面的域名，而谷歌没有使用图标，标题没有加深，但是后面多加了”**显示“**（”**display“**）文字

## 1.8.2 confirm()

- `window.confirm()` 弹出的是**确认框**（**confirm**），它和**警告框**（**alert**）一样指示浏览器显示一个带有可选消息的对话框，并等待用户**操作**后**消失**（**dismiss**）

### 1.8.2.1 语法

```jsx
window.confirm([message]);
```

- 参数，`message` ，可选的，想要在confirm对话框中显示的字符串，传入其它类型的参数会被转化为字符串
- 返回值，布尔值，表示用户在确认框中选择确定（OK）还是取消（Cancel），如果浏览器忽略页内对话框，则返回值总为false

### 1.8.2.2 理解confirm()

- `confirm()`的基本用法和`alert()` 类似，只不过它弹出的确认框有两个按钮：”**取消**“（Cancel）和”**确定**“（OK）
- 点击确定`confirm()` 返回`true` ，其它情况都返回`false`

### 1.8.2.3 确认框

```jsx
if(confirm("Are you sure?")) {
	alert("I'm glad you're sure!")
} else {
		alert("I'm sorry to hear you're not sure.")
}
```

- 谷歌浏览器
    
    ![chrome window.confirm.gif](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/chrome_window.confirm.gif)
    
- 火狐浏览器
    
    ![firefox window.confirm.gif](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/firefox_window.confirm.gif)
    
- 注意二者区别：
    - **位置：**区别和警告框一样
    - **标题**：因为是本地文件，没有所谓的域名，谷歌和火狐都没有显示具体的文件路径，谷歌直接使用“此网页显示”，而火狐则用图标加”file://”的形式表示这是本地文件
    - **背景**：注意点击确定后火狐浏览器的背景变成灰色
    - **文本**：火狐浏览器在点击确认或取消后的警告框文本会出现”不允许此网站再次向您提示“的字样

## 1.8.3 prompt()

- 和确认框一样，`window.prompt()` 指示浏览器弹出一个有两个按钮的对话框，提示用户输入一些文本，并等待用户提交文本或取消对话框

### 1.8.3.1 语法

```jsx
window.prompt([messgae[, defaultValue]])
```

- 参数
    - `message` ，可选的，想要在prompt对话框中显示的字符串，传入其它类型的参数会被转化为字符串
    - `defaultValue` ,可选的，包含在prompt对话框中的文本输入框的默认值
- 返回值，用户在prompt对话框中的文本输入，字符串或`null`

### 1.8.3.2 理解prompt()

- prompt在英文上有提示的意思，所以可以称prompt对话框为**提示框**
- 提示框的用途是提示用户输入信息，除了显示`message` 外，还会显示一个文本框，让用户输入内容，该文本框的默认值是`prompt()` 接收的第二个参数
- `prompt()` 的返回值和用户的操作有关，如果用户单机了**确定**（**OK**）按钮，则会返回文本框中的值，如果用户单击了**取消**（**Cancel**）按钮，或者对话框被关闭，则会返回`null`

### 1.8.3.3 提示框

```jsx
let res = prompt("Please input password", "password");
if (res === "mangwu") {
  const h1 = document.createElement("h1");
  h1.textContent = "Welcome";
  document.body.appendChild(h1);
} else {
  window.close();
}
```

- 谷歌浏览器
    
    ![chrome window.prompt.gif](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/chrome_window.prompt.gif)
    
- 火狐浏览器
    
    ![firefox window.prompt.gif](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/firefox_window.prompt.gif)
    

## 1.8.4 理解系统对话框

- 系统对话框不需要HTML和CSS，所以系统对话框是Web应用程序最简单快捷的沟通手段
- 很多浏览器针对这些系统对话框添加了特殊功能
    - 如果网页中的脚本生成了两个或更多系统对话框，则除第一个之外所有后续的对话框都会显示一个复选框，如果选中则会禁用后续的弹框，直到页面刷新
    - 《JavaScript高级程序设计（第4版）》上述的对话所述的复选框实际上就是火狐浏览器中的“不允许此网站再次向您提示”或“阻止网页创建更多的对话框”（上面例子在火狐中的动态图中有显示），在**谷歌浏览器中，不会出现这个复选框**

### 1.8.4.1 其它系统对话框

- 除了上述三种直接与用户交互的对话框之外，还有两种**异步显示（asynchronously display）**的对话框，这两个对话框弹出后会将控制权立即返回给脚本
    - `window.find()` ：显示查找对话框，它的功能是按顺序在当前窗口查找字符串
    - `window.print()` ：显示打印对话框
- 这两个方法不会返回任何有关用户在对话框中执行了什么操作的信息，因此很难利用；此外，这两种对话框是异步的，所以浏览器的对话框计数器不会涉及它们，而用户选择禁用对话框对它们也没什么影响

---

### 1.8.4.1 MDN-关于其它系统对话框

`**window.find()**`

- 根据MDN提示，实际上window.find()并**不是**Web浏览器上需要实现的**标准方法**，而且在两大浏览器中直接执行`find()` 并不会弹出查找对话框
- 用户在当前浏览器页面点击Ctrl+F键会弹出查找框，如下（第一个是谷歌浏览器的，它靠近窗口右上角，第二个是火狐浏览器的，它在窗口最下方，是一个和窗口宽度一样的横条）
    
    ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%207.png)
    
    ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%208.png)
    
- `window.find()` 的语法如下
    
    ```jsx
    find(aString, aCaseSensitive, aBackwards, aWrapAround, aWholeWord, aSearchInFrames, aShowDialog)
    ```
    
    - 参数
        - `aString` ：要查找的字符串
        - `aCaseSensitive` : 布尔值，指定搜索是否**区分大小写**（**case-sensitive**）
        - `aBackwards` : 布尔值，指定是否进行**反向搜索**（**backward search**）
        - `aWrapAround` : 布尔值，指定是否进行**换行（循环）搜索（a wrap around search）**
        - `aWholeWord` ：布尔值，指定是否进行**全字匹配搜索**（**whole word search**），改搜索在火狐浏览器中未实现
        - `aSearchInFrames` : 布尔值，指定是否在**框架**（**frames**）中进行搜索
        - `aShowDialog` ：布尔值，指定是否弹出一个**搜索对话框**
    - 返回值：如果能搜索到指定字符串就返回`true`，否则返回`false`
- 注意事项，`window.find()` 各个浏览器的实现不一样，在实际开发中**不要使用**，`aShowDialog` 参数在有些浏览器中并不能弹出具体的查找对话框，但是可以将查找结果进行高亮表示如下：
    
    ![chrome window.find.gif](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/chrome_window.find.gif)
    

`window.print()` 

- `print()` 会弹出当前窗口的打印对话框，并进行打印当前文档的准备
- 如果调用此函数时文档仍然在加载，则在文档加载完成后再**打开打印对话框（异步地）**
- 当前窗口地打印对话框会阻塞`print()` 方法（即执行一次`print()` 后，如果没有关闭打印对话框，再执行`print()` 没有效果）
- 语法上`print()` 很简单， 没有任何参数，返回值为`undefined`
- 谷歌和火狐页面对同一个页面执行`print()` 弹出的**打印对话框**如下
    
    ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%209.png)
    
    ![Untitled](1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89/Untitled%2010.png)