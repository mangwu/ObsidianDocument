# 12. 浏览器对象模型（The Brower Object Model）

本章内容

- [ ]  理解BOM核心——window对象
- [ ]  控制窗口（windows）及弹窗（pop-ups）
- [ ]  通过location对象获取页面信息
- [ ]  使用navigator对象了解浏览器
- [ ]  通过history对象操作浏览器历史栈（**browser history stack**）

ECMAScript把**浏览器对象模型**（**Brower Object Model**）描述为JavaScript的核心，但实际BOM是使用JavaScript开发Web应用程序的核心

BOM提供了与**网页无关**的浏览器功能对象

- BOM的发展**缺乏规范**的背景，所以它的问题和乐趣都很多
- 因为浏览器开发商都按照自己的意愿来实现BOM，所以不太的浏览器BOM有所差别
- 但是浏览器实现之间**共通的部分（commonalities）**成为了**事实标准，**为Web开发提供了浏览器间**互通性**（**interoperability**）的基础
- HTML5中有一部分涵盖了BOM的主要内容，因为W3C希望将JavaScript在浏览器中最基础的部分标准化

# 1. window对象（The window Object）

[1. window对象（The window对象）](12%20%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B%EF%BC%88The%20Brower%20Object%20Model%EF%BC%89/1%20window%E5%AF%B9%E8%B1%A1%EF%BC%88The%20window%E5%AF%B9%E8%B1%A1%EF%BC%89.md)

# 2. location对象（The location Object）

[2. location 对象](12%20%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B%EF%BC%88The%20Brower%20Object%20Model%EF%BC%89/2%20location%20%E5%AF%B9%E8%B1%A1.md)

# 3. navigator对象（The navigator Object）

[3. navigator 对象](12%20%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B%EF%BC%88The%20Brower%20Object%20Model%EF%BC%89/3%20navigator%20%E5%AF%B9%E8%B1%A1.md)

# 4. screen对象（The screen Object）

[4. screen对象](12%20%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B%EF%BC%88The%20Brower%20Object%20Model%EF%BC%89/4%20screen%E5%AF%B9%E8%B1%A1.md)

# 5. history对象（The history Object）

[5. history对象](12%20%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B%EF%BC%88The%20Brower%20Object%20Model%EF%BC%89/5%20history%E5%AF%B9%E8%B1%A1.md)

# 6. 小结

浏览器对象模型（BOM）是以window对象为基础的，这个对象代表了浏览器窗口和页面可见区域。window对象也被复用为ECMAScript的Global对象，因此对所有全局变量和函数都是它的属性，而且所有**原生类型的构造函数和普通函数**也都从一开始就存在于这个对象之上

- 要引用其他window对象，可以使用几个不同的窗口指针
- 通过location对象可以以编程方式操作浏览器的导航系统，通过设置这个对象的属性，可以改变浏览器URL中的某一部分或全部
- 使用location.replace()方法可以替换浏览器历史记录中的当前显示的页面，并导航到新URL
- navigator对象提供关于浏览器的信息，提供的信息取决于浏览器的实现，不过有些属性如userAgent是所有浏览器都支持的

BOM中的另外两个对象也提供了一些功能。screen对象中保存着客户端显示器的信息，这些信息通常用于评估浏览网站的设备信息，history对象提供了操作浏览器历史记录的能力，开发者可以确定历史记录中包含对少个条目，并以编程方式实现在历史记录中导航，而且也可以修改历史记录