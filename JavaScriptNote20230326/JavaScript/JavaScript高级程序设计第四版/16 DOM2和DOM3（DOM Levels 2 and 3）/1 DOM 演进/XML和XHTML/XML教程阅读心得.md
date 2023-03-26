# XML教程阅读心得

# 1. XML与HTML本质区别

**XML 被设计用来传输和存储数据。**

**HTML 被设计用来显示数据。**

***XML 是对 HTML 的补充***。

***XML 是独立于软件和硬件的信息传输工具。***

# 2. ****W3C XML 规范和时间线****

- 查看w3c的[XML活动](https://www.w3school.com.cn/w3c/w3c_xml.asp)
- 最近一次为2010 年 8 月 3 日的[XMLHttpRequest Object](http://www.w3.org/TR/XMLHttpRequest/)
- 最新的XML规范为**[Extensible Markup Language (XML) 1.1 (Second Edition)](https://www.w3.org/TR/xml11/)**（2006.8.16）
- 最新的XML命名空间规范为**[Namespaces in XML 1.1 (Second Edition)](https://www.w3.org/TR/xml-names11/)** （2006.8.16）
- 还有其它与XML相关的规范，如XPath，XInclude等

# 3. **XML 把数据从 HTML 分离**

如果你需要在 HTML 文档中显示动态数据，那么每当数据改变时将花费大量的时间来编辑 HTML。

通过 XML，数据能够存储在独立的 XML 文件中。这样你就可以专注于使用 HTML 进行布局和显示，并确保修改底层数据不再需要对 HTML 进行任何的改变。

通过使用几行 JavaScript，你就可以读取一个外部 XML 文件，然后更新 HTML 中的数据内容。

# 4. **XML 文档形成一种树结构**

XML 文档必须包含***根元素***。该元素是所有其他元素的父元素。

XML 文档中的元素形成了一棵文档树。这棵树从根部开始，并扩展到树的最底端。

# 5. **在 XML 中，空格会被保留**

HTML 会把多个连续的空格字符裁减（合并）为一个：

```html
HTML:	Hello           my name is David.
输出:	Hello my name is David.
```

在 XML 中，文档中的空格不会被删掉

# 6. **XML 元素是可扩展的**

XML 元素是可扩展，以携带更多的信息

请看下面这个 XML 例子：

```
<note>
<to>George</to>
<from>John</from>
<body>Don't forget the meeting!</body>
</note>

```

让我们设想一下，我们创建了一个应用程序，可将 <to>、<from> 以及 <body> 元素提取出来，并产生以下的输出：

```
MESSAGE
To: George
From: John

Don't forget the meeting!

```

想象一下，之后这个 XML 文档作者又向这个文档添加了一些额外的信息：

```
<note>
<date>2008-08-08</date>
<to>George</to>
<from>John</from>
<heading>Reminder</heading>
<body>Don't forget the meeting!</body>
</note>

```

那么这个应用程序会中断或崩溃吗？

不会。这个应用程序仍然可以找到 XML 文档中的 <to>、<from> 以及 <body> 元素，并产生同样的输出。

XML 的优势之一，就是可以经常在不中断应用程序的情况进行扩展。

# 7. ****XML 属性值可以用实体****

属性值必须被引号包围，并且可以使用实体引用

```xml
<gangster name="George &quot;Shotgun&quot; Ziegler">
```

# 8. XML属性尽量不包含内容数据

在此我们极力向您传递的理念是：元数据（有关数据的数据）应当存储为属性，而数据本身应当存储为元素

# 9. **“形式良好”，“结构良好”的 XML 文档与合法的XML文档**

- “形式良好”（Well Formed），“结构良好”的 XML 文档会遵守 XML 语法规则
- 合法的XML文档是“形式良好”的 XML 文档，同样遵守文档类型定义 (DTD) 的语法规则
    - DTD 的作用是定义 XML 文档的结构。它使用一系列合法的元素来定义文档结构：
    
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE note [
      <!ELEMENT note (to,from,heading,body)>
      <!ELEMENT to      (#PCDATA)>
      <!ELEMENT from    (#PCDATA)>
      <!ELEMENT heading (#PCDATA)>
      <!ELEMENT body    (#PCDATA)>
    ]>
    <note>
    <to>George</to>
    <from>John</from>
    <heading>Reminder</heading>
    <body>Don't forget the meeting!</body>
    </note>
    ```
    

# 10. XML Scheme

- W3C 支持一种基于 XML 的 DTD 代替者，它名为 XML Schema：
    
    ```xml
    <xs:element name="note">
    
    <xs:complexType>
      <xs:sequence>
        <xs:element name="to"      type="xs:string"/>
        <xs:element name="from"    type="xs:string"/>
        <xs:element name="heading" type="xs:string"/>
        <xs:element name="body"    type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
    
    </xs:element>
    ```
    

# 11. **不要指望 XML 文件会被浏览器直接显示为 HTML 页面**

XML 文档不会携带有关如何显示数据的信息

在没有任何有关如何显示数据的信息的情况下，大多数的浏览器都会仅仅把 XML 文档显示为源代码

# 12. **通过使用 CSS，可为 XML 文档添加显示信息。**

```xml
<?xml-stylesheet type="text/css" href="cd_catalog.css"?>
```

# 13. 通过使用XSLT，可以为XML文档添加显示信息

XSLT (eXtensible Stylesheet Language Transformations) 远比 CSS 更加完善。

- 下面是一个XSLT文件
    
    ```xml
    <?xml version="1.0" encoding="ISO-8859-1"?>
    <!-- Edited with XML Spy v2007 (http://www.altova.com) -->
    <html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
      <body style="font-family:Arial,helvetica,sans-serif;font-size:12pt;
            background-color:#EEEEEE">
        <xsl:for-each select="breakfast_menu/food">
          <div style="background-color:teal;color:white;padding:4px">
            <span style="font-weight:bold;color:white">
            <xsl:value-of select="name"/></span>
            - <xsl:value-of select="price"/>
          </div>
          <div style="margin-left:20px;margin-bottom:1em;font-size:10pt">
            <xsl:value-of select="description"/>
            <span style="font-style:italic">
              (<xsl:value-of select="calories"/> calories per serving)
            </span>
          </div>
        </xsl:for-each>
      </body>
    </html>
    ```
    
    - 定义文档body基本样式
    - 对每个`breakfast_menu` 元素中的`food` 元素的样式进行定义
    - 继续对每个`food` 元素中的`name` 、`price`、`description` 、`calories` 元素的样式进行定义
- XML文件引用XSLT样式文件
    
    ```xml
    <?xml version="1.0" encoding="ISO-8859-1"?>
    <?xml-stylesheet type="text/xsl" href="simple.xsl"?>
    <breakfast_menu>
      <food>
        <name>Belgian Waffles</name>
        <price>$5.95</price>
        <description>
           two of our famous Belgian Waffles
        </description>
        <calories>650</calories>
      </food>
    </breakfast_menu>
    ```
    
- 效果[example](https://www.w3school.com.cn/example/xmle/simplexsl.xml)

# 14. **XML 命名空间提供避免元素命名冲突的方法**

在 XML 中，元素名称是由开发者定义的，当两个不同的文档使用相同的元素名时，就会发生命名冲突

## 14.1 ****使用前缀来避免命名冲突****

```xml
<h:table>
   <h:tr>
   <h:td>Apples</h:td>
   <h:td>Bananas</h:td>
   </h:tr>
</h:table>
```

```xml
<f:table>
   <f:name>African Coffee Table</f:name>
   <f:width>80</f:width>
   <f:length>120</f:length>
</f:table>
```

## 14.2 ****使用命名空间（Namespaces）****

与仅仅使用前缀不同，我们为 <table> 标签添加了一个 **`xmlns`**属性，这样就为前缀赋予了一个与某个命名空间相关联的限定名称。

```xml
<h:table xmlns:h="http://www.w3.org/TR/html4/">
   <h:tr>
   <h:td>Apples</h:td>
   <h:td>Bananas</h:td>
   </h:tr>
</h:table>
```

```xml
<f:table xmlns:f="http://www.w3school.com.cn/furniture">
   <f:name>African Coffee Table</f:name>
   <f:width>80</f:width>
   <f:length>120</f:length>
</f:table>
```

## 14.3 ****XML Namespace (xmlns) 属性****

XML 命名空间属性被放置于元素的开始标签之中，并使用以下的语法：

```xml
xmlns:namespace-prefix="namespaceURI"
```

当命名空间被定义在元素的开始标签中时，所有带有相同前缀的子元素都会与同一个命名空间相关联**：**
用于标示命名空间的地址不会被解析器用于查找信息，其惟一的作用是赋予命名空间一个惟一的名称

## 14.4 ****默认的命名空间（Default Namespaces）****

```xml
xmlns="namespaceURI"
```

# 15. **CDATA 区段（CDATA section）中的文本会被解析器忽略**

术语 CDATA 指的是不应由 XML 解析器进行解析的文本数据（Unparsed Character Data）。

**所有 XML 文档中的文本均会被解析器解析**

**只有 CDATA 区段（CDATA section）中的文本会被解析器忽略**

```xml
<![CDATA[content]]>
```

CDATA 部分中的所有内容都会被解析器忽略，DATA 部分由 "***<![CDATA[***" 开始，由 "***]]>***" 结束