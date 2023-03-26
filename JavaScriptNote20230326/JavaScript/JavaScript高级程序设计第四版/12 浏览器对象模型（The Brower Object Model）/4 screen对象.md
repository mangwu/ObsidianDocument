# 4. screen对象

- window上的属性`screen` 返回一个`Screen` 对象，是为数不多在编程中很少用的JavaScript对象
- 这个对象保存的纯粹是客户端能力信息，也就是**浏览器窗口外面的客户端显示器的信息（**screen就是屏幕的意思**）**，例如像素宽度，像素高度等
- w3c规范的[CSSOM View Module标准](https://w3c.github.io/csswg-drafts/cssom-view/#the-screen-interface) 中，Screen 接口的解释为 表示输出设备屏幕的信息

# 4.0 规范中的Screen 接口

- w3c规范在[CSSOM View Module](https://w3c.github.io/csswg-drafts/cssom-view/#the-screen-interface)标准中规范了Screen 接口以及`window.screen` 属性
- Screen接口IDL定义如下
    
    ```jsx
    [Exposed=Window]
    interface Screen {
    	readonly attribute long availWidth;
    	readonly attribute long availHeight;
    	readonly attribute long width;
    	readonly attribute long height;
    	readonly attribute unsigned long colorDepth;
    	readonly attribute unsigned long pixelDepth;
    }
    ```
    
    - `[Exposed=Window]`表示接口的实例只能在主线程中使用，不能在worker中使用
    - `long` 表示属性值为（32位）整型
    - `unsigned long` 表示属性值为无符号（32位）整型

| 属性 | 描述/说明 |
| --- | --- |
| availWidth | 只读属性，屏幕像素宽度减去系统组件宽度，也就是网页可用屏幕区域（Web-exposed available screen area）的宽度，单位为CSS像素；所谓的系统组件就是浏览器无法覆盖的地方，如window操作系统下的任务栏；所谓Web-exposed available screen area就是浏览器可以在屏幕中显示的区域，同样，window操作系统下的任务栏浏览器无法覆盖，显示区域就是不包括任务栏的部分 |
| avialHeight | 只读属性，屏幕像素高度减去系统组件高度，也就是网页可用屏幕区域（Web-exposed available screen area）的高度，单位为CSS像素 |
| width | 返回屏幕像素宽度，也就是暴露给网页显示的屏幕区域的宽度（Web-exposed screen area）；实际上这个值就是浏览器所在设备的显示屏幕以CSS标准像素为单位的宽度 |
| height | 返回屏幕像素高度，也就是暴露给网页显示的屏幕区域的高度（Web-exposed screen area）；实际上这个值就是浏览器所在设备的显示屏幕以CSS标准像素为单位的高度 |
| colorDepth | 只读属性，表示屏幕颜色的位数；多数系统是32位；CSSDOM提示，这个值表示一个像素点的颜色用多少个位表示，位数越大，屏幕能表示的颜色越丰富，出于兼容性原则，有些浏览器实现中返回24（实际设备屏幕色深为32）；如果颜色深度小于8，那么屏幕仅能用灰色表示，可以通过这个值特定显示灰色版本的页面 |
| pixelDepth | 只读属性，屏幕的位深度；CSSDOM提示，这个属性和colorDepth 属性返回的值是一样的，二者实际上表示的是同一个东西，为了兼容性而同时使用；CSSDOM对它们的完整定义为：它们应该返回输出设备中每个像素分配给颜色的位数，alpha通道除外，如果用户代理不能返回输出设备的比特数，它应该返回最接近的估计值，例如发送到显示器的帧缓冲区使用的比特数或任何与输出设备使用的值最接近的内部表示；用户代理必须返回这两个属性的值，至少是彩色媒体特征（color media feature）的值乘以3（通常有RGB三个颜色分量）；如果不同颜色分量（color components）不使用相同的位数表示，则返回值可能大于彩色媒体特征的3倍；如果用户代理不知道颜色深度或者出于隐式不想返回，就应该返回24 |

# 4.1 测试

- 当前显示屏（Lenovo）设备信息
    
    ![device_screen.png](4%20screen%E5%AF%B9%E8%B1%A1/device_screen.png)
    
- 以此为基础，window10操作系统打开下方的任务栏，那么访问浏览器的`window.screen` 得到的属性值如下
    - `screen.width` 1920
    - `screen.height` 1080
    - `screen.availWidth` 1920
    - `screen.availHeight` 1040  （说明任务栏高40px）
    - `screen.colorDepth/pixelDepth` 24

# 4.2 非接口直接定义的属性

- MDN提示`screen` 对象的属性除了CSSDOM规范指出的Screen Interface定义的属性外，还包含一些非接口直接定义和非标准的属性
- 同时《JavaScript高级程序设计（第4版）》也列出了一些通用的`screen` 对象属性

| 属性 | 描述/说明 |
| --- | --- |
| availTop | 只读属性，没有被系统组件占用的屏幕的最顶端像素（的y坐标），通常为window.screen.height - window.screen.availHeight-toobarHeight 的值（需要减去下方任务栏的高度，如果任务栏在上方，就不能减去），也就是0；MDN提示这个属性为非标准属性，但是谷歌和火狐都实现了 |
| availLeft | 只读属性只读属性，没有被系统组件占用的屏幕的最顶端像素（的x坐标），通常为window.screen.width - window.screen.availWidth-toobarHeight （需要减去右方任务栏的高度，如果任务栏在左边，就不能减去）的值，也就是0；MDN提示这个属性为非标准属性，但是谷歌和火狐都实现了 |
| top | 当前屏幕顶端的像素距离，通常为0；MDN提示这个属性是非标准属性，且不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除（谷歌浏览器已经废弃使用，火狐浏览器还保留） |
| left | 当前屏幕左边的像素距离，通常为0；MDN提示这个属性是非标准属性，且不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除（谷歌浏览器已经废弃使用，火狐浏览器还保留） |
| mozEnabled | 布尔值，控制屏幕显示的属性，设置成false 会关闭屏幕；MDN提示这个属性是非标准属性，且不再被推荐使用，因为在任何浏览器中，保留此属性只是为了兼容性（compatibility）的目的，未来该属性可能被删除（谷歌浏览器和火狐浏览器都已经废弃使用） |
| 和mozEnabled类似的属性 | mozBrightness，lockOrientation()，unlockOrientation()，mozOrientation，orientationchange，这些属性是仅在火狐浏览器实现过的废弃非标准属性（现代火狐浏览器有些保留，有些删除），MDN是火狐浏览器背后的mozilla组织对JavaScript进行解释时构建的网站，所以会包含对这些无意义属性的解释（反而是与屏幕扩展相关的screen.isExtended 属性没有得到解释，因为火狐浏览器没有实现） |
| orientation | 返回https://w3c.github.io/screen-orientation/#dom-screen-orientation 中关于屏幕朝向的信息，实际上返回一个ScreenOrientation 对象，对象中的type 属性可以指明当前的屏幕朝向；MDN提示除了Safari浏览器外其它浏览器都实现了这个属性 |
| isExtended | 布尔值，但是设备是否有多个屏幕连接（即主机可以连接多个显示屏）,除了火狐和Safari浏览器外，谷歌系的高版本浏览器都实现了该属性 |

## 4.2.1 availTop/Left和top/left

- 它们现在都是0，通过修改任务栏的位置可以查看它们的变动
    
    ```jsx
    <ul>
      <li>screen.availLeft: <span class="availLeft">0</span></li>
      <li>screen.left: <span class="left">0</span></li>
      <li>screen.availTop <span class="availTop">0</span></li>
      <li>screen.top <span class="top">0</span></li>
    </ul>
    <script>
      const screenAvailLeft = document.querySelector(".availLeft");
      const screenLeft = document.querySelector(".left");
      const screenAvailTop = document.querySelector(".availTop");
      const scrennTop = document.querySelector(".top");
      screenAvailLeft.textContent = screen.availLeft;
      screenLeft.textContent = screen.left;
      scrennTop.textContent = screen.top;
      screenAvailTop.textContent = screen.availTop;
    </script>
    ```
    
- window10操作系统可以在设置中调整任务栏位置，解锁任务栏已调整高度或宽度：
    
    ![task-bar.png](4%20screen%E5%AF%B9%E8%B1%A1/task-bar.png)
    
- 默认情况下（不解锁任务栏），选择任务栏四种显示方位会有如下几种模式：
    - 底部和靠右
        
        ![bottom_right.png](4%20screen%E5%AF%B9%E8%B1%A1/bottom_right.png)
        
    - 顶部
        
        ![top.png](4%20screen%E5%AF%B9%E8%B1%A1/top.png)
        
    - 靠左
        
        ![left.png](4%20screen%E5%AF%B9%E8%B1%A1/left.png)
        
    - 上面都是火狐浏览器的显示（谷歌浏览器已经废弃`screen.left`和`screen.top`属性）
        - 可以知道`screen.left`和`screen.top` 的值与系统内部组件无关，就是当前显示器左上角为原点的像素点坐标
        - `screen.availLeft` 和`screen.availTop` 的值与系统内部的组件有关，它能显示出浏览器**可以显示区域的左上角坐标位置**

## 4.2.2 orientation

- 所谓朝向（**orientation**）就是设备显示器的文字和图像的朝向
    - 正常情况下原点在左上角，x轴为横向向右水平轴，y轴为竖直向下水平轴，称为**横向（landscape）**
    - 如果原点在左下角，x轴为竖直向上水平轴，y轴为横向向右水平轴，称为**纵向**（**portrait**）
    - 如果原点在右上角，x轴为竖直向下水平轴，y轴为横向向左水平轴，称为**纵向**（**翻转**）
    - 如果原点在右下角，x轴为横向向左水平轴，y轴为竖直向上水平轴，称为**横向**（**翻转**）
- window10操作系统可以在屏幕显示设置中设置这4种翻转方向
    
    ![window10_orientation.png](4%20screen%E5%AF%B9%E8%B1%A1/window10_orientation.png)
    
- 通过如下代码测试，可以得到四种`type` 的`ScreenOrientation` 对象
    
    ```jsx
    <p>screen.orientation: <pre></pre></p>
        <script>
          const pre = document.querySelector("pre");
          pre.innerHTML = 
    `{
      type: ${screen.orientation.type},
      angle: ${screen.orientation.angle},
      onchange: ${String(screen.orientation.onchange)}
    }`
        </script>
    ```
    
- 结果如下
    
    ```jsx
    // 横向
    {
      type: "landscape-primary",
      angle: 0,
      onchange: null
    }
    ```
    
    ```jsx
    // 横向（翻转）
    {
      type: "landscape-secondary",
      angle: 180,
      onchange: null
    }
    ```
    
    ```jsx
    // 纵向
    {
      type: "portrait-primary",
      angle: 270,
      onchange: null
    }
    ```
    
    ```jsx
    // 纵向（翻转）
    {
      type: "portrait-secondary",
      angle: 90,
      onchange: null
    }
    ```
    
- 可以发现`angle` 表示当前朝向相较于标准横向时顺时针翻转的角度，它是90的倍数
- 四种`type` 分别表示系统的4中朝向
    - `landscape-primary` 横向
    - `landscape-secondary` 横向（翻转）
    - `portrait-primary` 纵向
    - `portrait-secondary` 纵向（翻转）
- 这个属性在**手机浏览器**上很有用
    - 手机可以根据的使用者手持方式（横着拿或竖直拿）更改屏幕朝向
    - 而浏览器可以通过监听朝向的`change` 事件更改显示布局