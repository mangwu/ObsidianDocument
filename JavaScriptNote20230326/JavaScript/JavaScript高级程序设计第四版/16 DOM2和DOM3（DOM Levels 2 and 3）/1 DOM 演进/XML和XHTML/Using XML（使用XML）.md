# Using XML（使用XML）

by **[J. David Eisenberg](https://alistapart.com/author/j-davideisenberg/)** July 19, 2002 4:00 PM

Published in [HTML](https://alistapart.com/blog/topic/html/)

# 1. 问题引入

- 为每一个内容输入特定的标签效率不是很低下吗？
- 如何处理拥有标签的XML文件？
- 如何把XML放在一个网页上？

---

使用XML并不是为了某一个特定的应用程序，XML不仅仅拥有规范好写法的漂亮面孔（pretty face），也与计算机世界的其它东西隔离开来了

XML不仅仅是生成自定义标记语言的工具书（rulebook），它也是一系列技术的一部分（a family of）

- 使您基于XML的文档非常有用

为了证明这一点，我（作者）决定从头开始创建一个新的基于XML的标记语言，并展示你可以用新创建的标记语言写好的文档做些什么

# 2. 创建一个新的标记语言（New Markup Language）

- 我要创建的标记语言可以存储美国食品标签上的**营养信息**
    - 关于普通视频的营养信息可以去[食物成分查询平台](http://yycx.yybq.net/) 去查询，
    - 营养信息通常包含
        - 能量相关的成分，如碳水化合物，蛋白质，脂肪等
        - 维生素，如胡萝卜素，维生素B等
        - 矿物质，如钙，钠，碘等
            
            ![西瓜营养成分查询.png](Using%20XML%EF%BC%88%E4%BD%BF%E7%94%A8XML%EF%BC%89/%25E8%25A5%25BF%25E7%2593%259C%25E8%2590%25A5%25E5%2585%25BB%25E6%2588%2590%25E5%2588%2586%25E6%259F%25A5%25E8%25AF%25A2.png)
            
- 首先该文档需要一个根标签，因为是营养信息，可以`<nutrition>` 开头
- 接下来就是日摄入量，定义`<daily-values>` 元素，给出了每天2000卡路里饮食中的脂肪、钠等的最大摄入量，并配上测量单位
- 每日摄入量后面就是一系列的`<food>`元素，每个元素提供了关于特定元素及其营养类别的信息
    - 因为<daily-value>已经定义了每个类别的测量单位，就不需要为食物重复它们
    - 只需要输入特定食物的总脂肪，总钠含量即可
- 最后一个食物之后，使用</nutrition>标记结束文档
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <nutrition>  <!-- 建立日均摄取量 -->
      <daily-values>
        <total-fat units="g"> 65 </total-fat>    <!--脂肪总量-->
        <saturated-fat units="g"> 20 </saturated-fat>    <!--饱和脂肪-->
        <cholesterol units="mg"> 300 </cholesterol>    <!--胆固醇-->
        <sodium units="mg"> 2400 </sodium>    <!--钠-->
        <carb units="g"> 300 </carb>    <!--碳水化合物-->
        <fiber units="g"> 25 </fiber>    <!--纤维素-->
        <protein units="g"> 50 </protein>    <!--蛋白质-->
      </daily-values>
      <!-- Now list the individual foods -->
      <food>
        <name>Avocado Dip</name>    <!--蘸酱-->
        <mfr>Sunnydale</mfr>    <!--mfr表示生产商，其中内容为生产商名称-->
        <serving units="g"> 29 </serving>    <!--提供的含量-->
        <calorie total="110" fat="100"/>
        <!--卡路里-->
        <total-fat> 11 </total-fat>    <!--脂肪总量-->
        <saturated-fat> 3 </saturated-fat>    <!--饱和脂肪-->
        <cholesterol> 5 </cholesterol>    <!--胆固醇-->
        <sodium> 210 </sodium>    <!--钠-->
        <carb> 2 </carb>    <!--碳水化合物-->
        <fiber> 0 </fiber>    <!--纤维素-->
        <protein> 1 </protein>    <!--蛋白质-->
        <vitamins>      <!--维生素-->
          <a> 0 </a>        <!--维生素a-->
          <c> 0 </c>      <!--维生素c-->
        </vitamins>
        <minerals>      <!--矿物质-->
          <ca> 0 </ca>      <!--钙-->
          <fe> 0 </fe>      <!--铁-->
        </minerals>
      </food>
    
    	<!-- etc. -->
    
    </nutrition>
    ```
    
    - 完整XML文档可以查看[see the entire document](https://alistapart.github.io/code-samples/usingxml/xml_uses_a.html) ：此文档中的数据（碳水化合物，脂肪等）都是真实的，只有制造商的名字被更改
    - 简单说明一下：维生素和矿物质是以百分比计算的，而不是克或毫克。这就是为什么我们不需要在元素中为它们建立任何单位或最大值。
- 我在Linux系统上用编辑程序（作者用的`nedit` ，一款文本编辑器 ）手动输入数据。我可以使用任何允许我将文件保存为纯ASCII文本的编辑器；Windows上的记事本或Linux上的vi也可以。为了使数据输入更容易，我为食物元素（<food>）创建了一个空“模板”，你可以文件的底部看见它。我复制粘贴了每一种新的食物，这样我就不会不得不一遍又一遍的打标签。

# 3. 直接的好处

- 通过在文本编辑器中创建XML文件，而不是创建HTML文档或保存在电子表格或数据库，我们得到了什么？
    - 首选，数据是格式化的（structured）；它不是HTML表格中的大量数字，也不是仅由制表符分隔的值组成的文本文件
    - 因为有了一些自定义的标签，所以人类是可以阅读何理解的
    - 它也是开放的（跨平台），不需要专有软件来读取提取信息，作为一种传输媒介，XML已经很好的为我们服务了

# 4. 验证文档（Validating the Document）

- XML很重要的一点就是要保证XML格式正确，数据正确
    - 即使您是唯一一个在文档中输入数据的人，您也希望能够检查出您没有遗漏任何信息或添加额外的标签。
    - 此外，您希望确保您的百分比都在0到100之间。
- 如果有很多人输入数据，**文档的验证**就变得更加重要
    - 即使你告诉其他人正确的格式，他们可能会忽略它或犯错误
    - 简而言之，您希望计算机帮助您确定文件中的数据是否有效
- 为此，您可以创建一个机器可读的语法
    - 该语法指定哪些标记和属性是有效的，以何种组合，以及标记和属性可能包含哪些值
    - 然后将文档和语法交给一个名为验证器的程序，该程序检查文档是否符合您的规范。
- 指定这种语法的一种机器可读的形式是Relax NG符号（REgular LAnguage for XML Next Generation，基于语法的可扩展标记语言模式语言）
    - Relax NG本身是一种基于XML的标记语言
    - 它的可以用来指定其他标记语言中什么是有效的
    - 这并不像听起来那么疯狂或不可能，毕竟，告诉你如何正确使用英语语法的书也是用英语写的。
- 例如，我们的营养标记语言的规范之一是`<calories>`元素是一个空元素，它有两个属性，`total`属性和`fat`属性。这些必须都有小数。我们可以在Relax NG中这样说：
    
    ```xml
    <element name="calories">
      <empty/>
      <attribute name="total">
        <data type="decimal"/>
      </attribute>
      <attribute name="fat">
        <data type="decimal"/>
      </attribute>
    </element>
    ```
    
    - 这个Relax NG文件的语义清晰，就是告诉我们这个营养标记语义有一个元素名称为`calories` 的元素，空元素，拥有两个属性，且属性值都是小数
    - 如果把包含如下XML语句的营养标记文件测试通过验证器时，验证器将告诉我们下面的第一个标签是正确的，但第二个标签是错误的。
        
        ```xml
        <calories total="100" fat="10"/>
        <calories total="217" fat="don't ask!"/>
        ```
        
    - 完整的检查Relax NG文件可以查看[营养标记的完整语法规范](https://alistapart.github.io/code-samples/usingxml/xml_uses_b.html)
- 如果您想校验指定语法，Relax NG并不是唯一的选择
    - 你可以使用*DTD*(文档类型定义)，但它可能没有Relax NG那么强大
    - 或者您可以使用*XML Schema*，它与Relax NG一样强大，但是学习起来要复杂得多

# 5. 进行文档检查

- 想要进行文档检查，您将需要一些XML工具
    - [这里](https://alistapart.github.io/code-samples/usingxml/windows_setup.html)是如何为Windows设置工具
    - [这里](https://alistapart.github.io/code-samples/usingxml/linux_setup.html)是为Linux设置工具
- 要验证文件
    - 如果您使用的是Windows，请转到命令提示符
    - 如果使用的是Linux，则转到控制台窗口并获得shell提示符
    - 然后使用设置说明中描述的batch/shell文件来调用Multi-Schema Validator:
        
        ```bash
        msvalidate nutrition.rng nutrition.xml
        ```
        

# 6. 展示XML

- 虽然我们可以输入可读数据并检查它是否正确，但我们仍然不能对它做任何事情。
    - 如果我们在浏览器中显示它，我们只能看到压缩在一起的文本
    - 这是因为浏览器不知道如何显示`<food>`或`<vitamins>`标签
- 想要显示XML，可以将**样式表**附加到XML文件。在本例中，我们将这一行放在nutrition.xml文件的顶部
    
    ```xml
    <?xml version="1.0"?>
    <?xml-stylesheet type="text/css" 
     href="nutrition.css"?>
    <nutrition></nutrition>
    ```
    
- 我们为file nutrition.css编写的样式表与HTML文件中使用的样式表非常相似。不同之处在于，我们将样式分配给了新的营养标签，而不是标准的HTML标签。例如，食品生产商应该用16号斜体字显示，而不需要新的一行，你可以这样写:
    
    ```css
    mfr {
      display: inline;
      font-size: 16pt;
      font-style: italic;
    }
    ```
    
    在与XML文件相同的目录中创建了[整个样式表](https://alistapart.github.io/code-samples/usingxml/xml_uses_c.html)之后，就可以在Mozilla等现代浏览器中打开XML文件，它将显示信息
    
    ![XML_STYLES.png](Using%20XML%EF%BC%88%E4%BD%BF%E7%94%A8XML%EF%BC%89/XML_STYLES.png)
    

# 7. 更好的方案——转换（****Transformation—A Better Way****）

- 样式表的问题是:
    - ~~它只适用于处理级联样式表级别2（CSS2）的最新浏览器~~。（作者是在2002年的语境下说的这句话）
    - 它不能提取所有信息(例如，单元不会显示在输出文档中，因为它们“隐藏”在属性值中
    - 它不能计算百分比
- 此外，我们在这里发明的标记语言是**面向数据（data-oriented）**的
    - 它被设计用来描述要存储或要传输到其他程序的数据
    - 在这些文档中，元素的顺序和每个元素中的数据类型是相当严格的
    - 样式表与**面向叙述**（**narrative-oriented**）的标记文档一起使用效果更好，这些文档通常是供人类阅读的，并且比面向数据的文档更“自由”
    - 面向叙述的标记的例子有XHTML、DocBook(用于编写书籍和文章的标记)和NewsML(用于编写新闻报道)。
- 为了解决这些问题，我们可以使用XSLT(**可扩展样式表转换语言**，**Extensible Stylesheet Language Transformations**)将营养文件转换为其他形式
    - XSLT也是另一种基于xml的标记语言，是一种样式转换标记语言，可以将XML数据文档转换为另外的XML或其它格式，如HTML网页，纯文字
    - 它的目的是描述如何从一个XML文件(“源文档”)获取输入并将其输出成结果文档
    - XSLT可以灵活地从属性和元素内容中提取数据，并且可以对源文档中的数据进行计算和排序。
- XSLT的这种功能使XSLT成为XML技术家族中的关键技术。想要一个好的介绍，请阅读
    - [Norman Walsh’s excellent presentation on the subject](http://www.nwalsh.com/docs/tutorials/xsl/xsl/frames.html)
    - [hands-on tutorial](http://www.ibm.com/developerworks/xml/library/x-hands-on-xsl/)

# 8. 转换成HTML

- 第一个XSLT文件([您可以在这里看到](https://alistapart.github.io/code-samples/usingxml/xml_uses_d.html))将营养文档转换为非常简单的HTML文件，适合在桌面或PDA的任何浏览器上显示。要进行转换，您可以键入以下命令：
    
    ```bash
    transform nutrition.xml 
    nutrition_plain.xslt nutrition_plain.html
    ```
    
    - 转换的结果是一个名为nutrition_plain.html的HTML文件，您可以在任何喜欢的浏览器中打开该文件。
    - 即使是这个简单的转换也完成了两件我们在CSS中无法完成的事情：
        - 它使用属性中的信息来显示每种营养类别的单位
        - 并计算每日摄入量的百分比。
- 转换成的HTML的网页展示可以查看**[Nutrition Facts Summary](https://alistapart.github.io/code-samples/usingxml/nutrition_plain.html)**
    
    ![transform_to_html.png](Using%20XML%EF%BC%88%E4%BD%BF%E7%94%A8XML%EF%BC%89/transform_to_html.png)
    

# 9. 有趣的转换

- 好吧，也许你想要一些更花哨的东西。这里有一个更复杂的转换，它根据每份脂肪卡路里与总卡路里的比例对数据进行排序;一种“健康”
指数。”
- 如果您将XSLT保存在一个名为[nutrition_fancy.xslt](https://alistapart.github.io/code-samples/usingxml/xml_uses_e.html)的文件中。XSLT您可以键入以下命令：
    
    ```bash
    transform nutrition.xml 
    nutrition_fancy.xslt nutrition_fancy.html
    ```
    
    - 这将生成一个名为nutrition_fancy.html的文件
    - 它看起来与普通版本有很大不同
    - 它使用级联样式表来生成小条形图；需要一个现代的浏览器，如Internet Explorer 5+或Mozilla/Netscape 6才能看到效果
    - 注意，XSLT允许您选择想要显示的数据；关于碳水化合物、纤维、维生素和矿物质的信息在花哨的版本中被省略了。(当然，可以通过更改XSLT文件来添加它们。)
- 我们使用XSLT获取源XML文件并将其转换为两个不同的HTML文件
    - 一个简单的版本适合在老式浏览器和pda上显示
    - 另一个花哨的版本适合在台式电脑和现代浏览器上使用。
- 花哨版本的网址可以查看**[How Healthy Is It?](https://alistapart.github.io/code-samples/usingxml/nutrition_fancy.html)**
    
    ![transform_to_html_fancy.png](Using%20XML%EF%BC%88%E4%BD%BF%E7%94%A8XML%EF%BC%89/transform_to_html_fancy.png)
    

# 10. 非HTML转换

- 但是等等，也许你不需要HTML；
    - 你知道，世界上不只有浏览器
    - 您可能想要获取数据并将其转换为一个由制表符分隔的值组成的文本文件，以便导入电子表格或数据库程序
- 转换文件也可以用xslt写，完整转换文件地址为[nutrition_csv.xslt](https://alistapart.github.io/code-samples/usingxml/xml_uses_f.html)，使用这个命令：
    
    ```bash
    transform nutrition.xml nutrition_csv.xslt nutrition.csv
    ```
    
- 最终结果是一个[nutrition_csv.txt](https://alistapart.com/wp-content/uploads/2012/07/nutrition_csv.txt)
    
    ![nutrition_csv.txt.png](Using%20XML%EF%BC%88%E4%BD%BF%E7%94%A8XML%EF%BC%89/nutrition_csv.txt.png)
    

# 11. 转换为打印

- 假设您想要从XML创建一个PDF文件
    - 这可以通过使用转换将XML更改为另一种标记语言：*XSL-FO*(**XSL Formatting Objects，用于文档格式的XML 置标语言**)来实现
        - 这是一种页面布局语言
        - 一种名为*FOP*(Formatting Objects to PDF，将对象格式化为PDF)的工具使用该标记并为您创建PDF文件。
        
        > FOP 是由 James Tauber 发起的一个开源项目，原先的版本是利用 xsl-fo 将 xml 文件转换成 pdf 文件。但最新的版本它可以将 xml 文件转换成 pdf，mif，pcl，txt 等多种格式以及直接输出到打印机，并且支持使用 SVG 描述图形。
        > 
- 转换文件也可以用xslt写，完整转换文件地址为`[nutrition_fo.xslt](https://alistapart.github.io/code-samples/usingxml/xml_uses_g.html)`，它获取营养数据并将其转换为格式化对象，使用FOP最终转换为PDF，执行如下命令：
    
    ```bash
    fop -xml nutrition.xml -xsl nutrition_fo.xslt -pdf nutrition.pdf
    ```
    
- 最终结果是一个[nutrition.pdf](https://alistapart.com/wp-content/uploads/2012/07/nutrition.pdf)
    
    ![nutrition.pdf.png](Using%20XML%EF%BC%88%E4%BD%BF%E7%94%A8XML%EF%BC%89/nutrition.pdf.png)
    

# 12. 生成图形（****Graphics****）

- 最后，您可能希望创建数据的交互式图形版本
    - 另一个基于xml的标记SVG-Scalable Vector Graphics为您提供了这种功能
    - SVG有如下元素，它们画了一条黑色的对角线和一个黄色的圆，有绿色的轮廓:
        
        ```xml
        <line x1="0" y1="0" x2="50" y2="50" />
        <circle cx="100" cy="100" r="30" />
        ```
        
- 通过使用生成SVG的转换文件—[nutrition_svg.xslt](https://alistapart.github.io/code-samples/usingxml/xml_uses_h.html)，我们可以构造一个图形，该图形显示您单击名称的食物的柱状图。下面是执行命名:
    
    ```bash
    transform nutrition.xml nutrition_svg.xslt nutrition.svg
    ```
    
- 您可以使用作为Batik工具包一部分的SVG浏览器显示结果（现在SVG的显示可以用浏览器，没必要使用额外工具）
    - 如果你已经按照Linux或Windows的说明安装了Batik，输入`batikï¿½nutrition.svg`
    - 我没有使用最新版本的[Adobe SVG Viewer](http://www.adobe.com/svg/)测试该文件，但它应该可以很好地工作。这是一个截图;点击查看完整尺寸。
    
    ![barchart.webp](Using%20XML%EF%BC%88%E4%BD%BF%E7%94%A8XML%EF%BC%89/barchart.webp)
    

# 13. 使用XML工具的其他方法

- 在本文中，我们从命令提示符中使用了Multi-Schema Validator、Xalan Transformer、FOP转换器和Batik查看器。这是最快、最简单的工作方式，这样您就可以体验XML的功能。
- batch或shell文件方法适用于生产环境，
    - 在这种环境中，您可以定期从一个或多个XML文件生成整个网站的HTML文件
    - 您只需设置一个批作业，在预定的时间运行(Unix术语为cron作业)，以生成所需的文件。
- 如果需要动态生成HTML页面或PDF文件以响应用户请求，该怎么办?
    - 显然，您不希望每次有请求时都启动Java进程的开销，而静态批处理文件肯定不能达到这个目的
    - Multi-Schema Validator和Xalan都有一个API(应用程序程序接口)，因此可以成为运行在服务器上的Java servlet的一部分，并处理动态用户请求
    - 一旦加载了servlet，它就保存在内存中，因此没有后续使用转换的额外开销
- 如果您对运行servlet感兴趣，一种选择是使用Jakarta Tomcat servlet容器。它可以作为独立的服务器进行测试，也可以作为Apache或Microsoft IIS的模块运行。

# 14. 计时（Timing）

- 计时有两个方面：编写语法和转换需要多长时间，以及它们运行的速度有多快。
    - 设计标记语言花了我大约25分钟
    - 输入数据又花了我25分钟，有些时间我跑到厨房去从架子上或冰箱里拿东西
    - 编写和测试Relax NG语法需要30分钟。
    - 在Mozilla中直接显示XML的级联样式表的编写总共花费了15分钟
    - “纯HTML”转换大约花了50分钟，其中包括查找一些XSLT结构和做一些实验的时间
    - 这个“花哨”的转变花了45分钟
    - 我需要20分钟来弄清楚如何使用样式表来制作柱状图，我又用了5分钟来进行轻微的美学调整
    - 转换为制表符分隔值的文件需要15分钟
    - 转换为PDF花了一个小时，第一次通过时，我把它设计成一张光盘插入大小的纸。我想了想，决定把它缩小到衬衫口袋那么大。这又花了30到45分钟的时间来调整，让字体大小达到我想要的样子。我还必须做一些更改，以避免使用FOP尚未实现的XSL格式化对象的部分
    - 最后，编写SVG转换花费了一个半小时。大约有一半的时间是在尝试将所有东西都放置在合适的位置上，并使ECMA Script交互正常工作。
- 您不必是Relax NG、XSLT、XSL格式化对象或SVG方面的专家，也可以做到这一点
    - 我没有在日常生活中使用这些技术
    - 我对他们每个人的了解足以让事情顺利进行
    - 在这种情况下，我的哲学是“你认为有效的第一种方式就是正确的方式
    - ”这就是为什么XSLT专家在普通HTML转换文件中看到这样低效的构造时会感到震惊。
- 这并不是说这里不涉及学习
    - 你需要在这方面花些时间
    - 不过，你不需要花一辈子的时间在这上面
    - 在短时间内充分了解这些技术并有效地使用它们是完全有可能的

# 15. 性能（****Performance****）

- 我在运行SuSE Linux 7.2的400MHz AMD K-6和128Mb内存上测试了所有这些文件。对于转换，我修改了Xalan附带的SimpleTransform.java示例程序。该程序记录生成输出的总时间以及解析XSLT文件后转换所涉及的时间。如果在服务器上运行转换，则可以缓存解析后的XSLT文件，因此解析的开销只发生一次。
    
    
    | 转换类型（Transformation） | 总耗时（Total，以秒计算） | 转换时间（Transform，以秒计算） |
    | --- | --- | --- |
    | 转换为普通HTML | 3.691 | 1.018 |
    | 转换为有趣的HTML | 4.057 | 1.409 |
    | 转换为制表符分隔的值（txt，csv） | 3.057 | 0.548 |
    | 转换为SVG | 3.386 | 0.689 |
- 我用Linux time命令测量了PDF转换的时间。生成文件的实时时间为15.115秒，用户CPU时间为10.920秒。
- 当然，这些并不是唯一可用的工具
    - 还有其他XSLT处理器和程序用于将XSL格式化对象转换为PDF
    - 我选择MSV, Xalan, Fop和Batik，因为它们是免费的，易于使用，而且我已经熟悉它们了

# 16. 小结

- 使用基于xml的标记可以提供文档结构，并使其具有可读性和开放性。
- XML是一系列技术的一部分。
- 您可以使用Relax NG或XML Schema等语法标记语言来验证文档。
- 您可以使用XSLT转换来重新定义文档的用途。单个文档可以作为XHTML、纯文本、PDF或其他XML标记语言(如SVG)的源。
- 进行验证和转换的程序是免费的，而且很容易使用。

这些功能现在就存在，而且很容易学习和利用。这就是XML的优点所在，也是人们一旦开始使用它就对它如此兴奋的原因。