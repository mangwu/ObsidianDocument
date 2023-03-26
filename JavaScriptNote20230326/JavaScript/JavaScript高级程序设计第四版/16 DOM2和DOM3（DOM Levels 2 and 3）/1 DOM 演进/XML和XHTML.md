# XML和XHTML

**参考**

[**MDN-XML introduction**](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)

[**Using XML: A List Apart**](https://alistapart.com/article/usingxml/)

**规范**

[Extensible Markup Language (XML) @ W3.org](https://www.w3.org/XML/)

# 1. XML

XML(**可扩展标记语言**，Extensible Markup Language)是一种类似于HTML的标记语言，但是不使用预定义的标记，因此，可以根据自己的设计需求定义专属的标记

这是一种以可存储、可搜索和可共享的格式存储数据的方案，最重要的是，因为XML的基本格式是标准化的，所以如果需要跨系统或平台共享或传输XML，无论在本地还是互联网上，接收方仍然可以根据标准化的XML语法解析

有许多基于XML的语言，例如XHTML、MathML，SVG，RSS和RDF，也可以基于XML定义自己的语言

## 1.2 XML文档的结构（Structure）

XML和基于XML的语言的整个结构都是构建在标记（tags）之上的

## 1.3 XML声明

每个XML文件第一行都有一个XML声明语句，它并不是一个标记，而是它用于表示XML文档编码和XML规范版本，以便于传输XML文档的元数据

```jsx
<?xml version="1.0" encoding="UTF-8"?>
```

元数据属性

- `version` ：本文档使用的XML语言版本
- `encoding` ：本文档的编码格式

## 1.4 XML注释

```jsx
<!-- comment -->
```

- `<!--` 开头，可以换行，结束用 `-->` 即可

## 1.5 “正确的”XML（有效且格式良好）

### 1.5.1 正确的设计规则

- 一个XML文档格式是否正确，需要满足如下条件
    - 文档必须格式良好
    - 文档必须符合所有XML语法规则
    - 文档必须符合语义规则，这些规则通常在XML或DTD规范（文档类型定义，[Document Type Definition (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)）中

### 1.5.2 字符（characters）

- 像HTML一样，XML规范定义了5个“**预定义实体**”来表示特殊字符，它们有自己的含义，使用它们的**字符**不能直接表示内容（content），使用实体才能在内容中表示，如下
    
    
    | 名字 | 实体（Entity） | 字符 | Unicode码位（十进制） | 标准 | 描述 |
    | --- | --- | --- | --- | --- | --- |
    | quot | &quot; | " | U+022(34) | XML 1.0  | 双引号 |
    | amp | &amp; | & | U+0026(38) | XML 1.0 | 和（Ampersand） |
    | apos | &apos; | ' | U+0027(39) | XML 1.0 | 单引号（撇号） |
    | lt | &lt; | < | U+003C(60) | XML 1.0 | 小于号 |
    | gt | &gt; | > | U++003E(62) | XML 1.0  | 大于号 |
- XML中使用这些**实体对应的字符**能构建基本的XML文档，如果要将它们作为内容使用，直接使用实体即可
- 如果要想自定义实体，可以借助文档的类型定义（DTD，[Document Type Definition (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)）引入，通过在`<!DOCTYPE >` 文档类型中通过`<!`定义实体名称和对应值即可，如下
    
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE body [
      <!ENTITY warning "Warning: Something bad happened... please refresh and try again.">
    ]>
    ```
    
    `waring` 就是定义的实体名称，想要使用实体，在后续的内容区域写入`&warning;` 即可，这样实体值就会被表示在内容中
    
- 除此之外，有些字符既可以直接写入内容中，又可以作为实体的方式写入，但是这些字符在并不表示特殊含义，如字符”©“既可以直接使用，也可以用`&#xA9;`代替

### 1.5.3 处理器（Processer）与应用（application）

XML处理器（Processer，也称为XML parser）分析标记语言并传递结构化信息给应用（application）

### 1.5.3 标记（Markup）与内容（content）

- XML文档中的字符被分为标记(Markup)与内容（content）两类
    - 标记通常以`<`开头，以`>` 结尾；或者以字符`&`开头，以`;` 结尾
    - 不是标记的字符就是内容
- 但是CDATA部分，分解符号`<![CDATA[` 与`]]>` 是标记，二者之间的文本为内容
- 最外层的空白符是标记

### 1.5.4 标签（Tag）

- 一个*tag*属于标记结构，以`<`开头，以`>` 结尾
- Tag名字（`<`和`>`中的内容）特点
    - 大小写敏感
    - 不能包含`!"#$%&'()*+,/;<=>?@[\]^`{|}~`和空格
    - 不能以`-`或`.`或数字开头
- 标签可以分为
    - 开始标签（start-tag），如<section>
    - 结束标签（end-tag），如</section>
    - 空元素标签（empty-element tag），如<line-break />

### 1.5.5 元素（Element）

- 元素是文档的逻辑组成，或者在start-tag与匹配的end-tag之间，或者仅作为一个empty-element tag，例如`<greeting>Hello, world!</greeting>` ，`<line-break />`等
- 单个根（root）元素包含所有的其它元素

### 1.5.6 属性（Attribute）

- 属性是一种标记结构，在start-tag或empty-element tag内部的“名字-值”对，例如`<img src="madonna.jpg" alt="Madonna" />` ，`<img>` 标签有`src`和`alt` 两个属性，它们有对应的值
- 每个元素中，一个属性最多出现一次，一个属性只能有一个值
    - 如果属性有多个值，这需要采取XML协议以外的方式来表示
    - 如采用逗号或分号间隔，对于CSS类或标识符的名字可以使用空格来间隔

### 1.5.7 例子

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- 
  version ：本文档使用的XML语言版本
  encoding ：本文档的编码格式 
-->
<小紙條>
  <收件人>大元</收件人>
  <發件人>小張</發件人>
  <主題>問候</主題>
  <具體內容>早啊，飯吃了沒？ </具體內容>
</小紙條>
```

- XML定义结构，存储信息，传送信息
- 上面的XML文档仅是纯粹的信息标签，这些标签意义的展开依赖于应用它的程序

### 1.5.8 结构

- 每个XML文档都由XML声明开始，在上面代码中的第一行就是XML声明，这一行代码告诉浏览器会解析器，这个文件参照的XML版本和编码格式
- 但是根元素到底是`<小紙條>` 还是`<小便条>` 是由文档类型定义（DTD）或XML纲要（XML Schema）定义的
    - 如果DTD规定根元素必须叫`<小便条>` ，那么写作`<小紙條>` 就不符合要求
    - 这种不符合要求的DTD或XML纲要的要求的XML文档，被称为**不合法的XML**，反之是**合法的XML**
- XML文件的第二行并不一定包含文档元素；如果有注释或其它内容（如文档类型定义DTD），文档元素可以推迟出现

## 1.6 展示XML

- XML通常被用作描述，而且有很多方法去展示XML数据，如果不定义一个让XML展示的特别方式，那么原始的XML会被展现在浏览器上
- 一个展示XML输出的方法是将CSS应用于文档，用`xml-stylesheet`去处理指令
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <?xml-stylesheet type="text/css" href="./16.1.0.5 stylesheet.css"?>
    <!DOCTYPE body [
      <!ENTITY warning "XML is usually used for descriptive purposes, but there are ways to display XML data.
      If you don't define a specific way for the XML to be rendered, the raw XML is displayed in the browser.">
    ]>
    <message>
      <warning>警告</warning>
      <title>Hello</title>
      <content>
        &warning;
      </content>
    </message>
    ```
    
    ```css
    message {
      display: block;
      width: 50%;
      margin: 20px auto;
      background-color: antiquewhite;
      border-radius: 10px;
      box-sizing: border-box;
    }
    warning {
      display: block;
      text-align: center;
      color: red;
      font-weight: 600;
      font-size: 26px;
    }
    title {
      display: block;
      text-align: right;
      padding-right: 20px;
      font-size: 21px;
      color: black;
    }
    
    content {
      display: block;
      padding: 20px;
      font-size: 16px;
    }
    ```
    
    ![XML.png](XML%E5%92%8CXHTML/XML.png)
    
- 除了CSS外，还有其它更有效的方法去展示XML，就是使用XSLT（the **Extensible Stylesheet Language Transformations**），这个可以用做将XML转化为其它语言，例如HTML的文件，这使得XML用途十分广泛
    
    ```css
    <?xml-stylesheet type="text/xsl" href="transform.xsl"?>
    ```
    

## 1.7 Using XML

[Using XML](https://www.alistapart.com/articles/usingxml/)文章对于转换和创造你自己的语言是一个很好的资源

[****Using XML（使用XML）****](XML%E5%92%8CXHTML/Using%20XML%EF%BC%88%E4%BD%BF%E7%94%A8XML%EF%BC%89.md)

## 1.8 W3C的XML教程

地址：****[XML 教程](https://www.w3school.com.cn/xml/index.asp)****

[XML教程阅读心得](XML%E5%92%8CXHTML/XML%E6%95%99%E7%A8%8B%E9%98%85%E8%AF%BB%E5%BF%83%E5%BE%97.md)

# 2. XHTML

## 2.1 不同标记语言之间的关系

![不同标记语言之间的关系.png](XML%E5%92%8CXHTML/%25E4%25B8%258D%25E5%2590%258C%25E6%25A0%2587%25E8%25AE%25B0%25E8%25AF%25AD%25E8%25A8%2580%25E4%25B9%258B%25E9%2597%25B4%25E7%259A%2584%25E5%2585%25B3%25E7%25B3%25BB.png)

## 2.2 基本介绍

- **可扩展超文本标记语言**（英语：e**X**tensible **H**yper**T**ext **M**arkup **L**anguage，XHTML），是一种[标记语言](https://zh.wikipedia.wmmirror.live/wiki/%E6%A0%87%E8%AE%B0%E8%AF%AD%E8%A8%80)
    - 表现方式：与[超文本标记语言](https://zh.wikipedia.wmmirror.live/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E6%A0%87%E8%AE%B0%E8%AF%AD%E8%A8%80)（[HTML](https://zh.wikipedia.wmmirror.live/wiki/HTML)）类似，不过语法上更加严格
    - 继承关系：**XHTML**基于[可扩展标记语言](https://zh.wikipedia.wmmirror.live/wiki/%E5%8F%AF%E6%89%A9%E5%B1%95%E6%A0%87%E8%AE%B0%E8%AF%AD%E8%A8%80)（[XML](https://zh.wikipedia.wmmirror.live/wiki/XML)），XML是[SGML](https://zh.wikipedia.wmmirror.live/wiki/SGML)的一个子集
- 版本基本历史
    - XHTML 1.0在2000年1月26日成为[W3C](https://zh.wikipedia.wmmirror.live/wiki/W3C)的推荐标准
    - XHTML 1.1为XHTML最后的独立标准
    - XHTML 2.0止于草案阶段
    - XHTML5则是属于HTML5标准的一部分，且名称已改为“以XML序列化的HTML5（****XML-serialized HTML5****）”，而非“可扩展的HTML（e**X**tensible **H**yper**T**ext **M**arkup **L**anguage）”

## 2.3 版本对照

- **XHTML 1.0 Strict（严格版）**是参照“HTML 4.01 Strict”改编，但不包括被弃用的元素。其[文件类型描述](https://zh.wikipedia.wmmirror.live/wiki/%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%8F%E8%BF%B0)(DTD)为：
    
    ```xml
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    ```
    
- **XHTML 1.0 Transitional（过渡版）**是参照“HTML 4.01 Transitional”改编，包括已于Strict版本被弃用的呈现性元素（例如`<center>`, `<font>`等）。其[文件类型描述](https://zh.wikipedia.wmmirror.live/wiki/%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%8F%E8%BF%B0)（DTD）为：
    
    ```xml
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    ```
    
- **XHTML 1.0 Frameset（框架版）**是参照“HTML 4.01 Frameset”改编，并允许于网页中定义[框架元素](https://zh.wikipedia.wmmirror.live/w/index.php?title=%E6%A1%86%E6%9E%B6%E5%85%83%E7%B4%A0&action=edit&redlink=1)。其[文件类型描述](https://zh.wikipedia.wmmirror.live/wiki/%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%8F%E8%BF%B0)(DTD)为：
    
    ```xml
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
    ```
    
- **XHTML 1.1,**其[文件类型描述](https://zh.wikipedia.wmmirror.live/wiki/%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%8F%E8%BF%B0)(DTD)为
    
    ```xml
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
    ```
    
- **XHTML Basic，**其[文件类型描述](https://zh.wikipedia.wmmirror.live/wiki/%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B%E6%8F%8F%E8%BF%B0)为：
    
    ```xml
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">
    ```
    
- [XHTML5](https://zh.wikipedia.wmmirror.live/wiki/XHTML5)不需要DTD，XHTML5并非[XHTML](https://zh.wikipedia.wmmirror.live/wiki/XHTML)的第5版，没有自己独立的标准规范，而是HTML5的一种序列化方式