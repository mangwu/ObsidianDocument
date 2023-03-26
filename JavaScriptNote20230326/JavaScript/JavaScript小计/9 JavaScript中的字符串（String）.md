# 9. JavaScript中的字符串（String）

- 在HTML Standard和w3c规范，CSSDOM标准中，它们在用IDL定义JavaScript的接口时，对于字符串通常分为如下几种
    - USVString
    - DOMString
    - CSSOMString
    - Binary strings
- 要了解JavaScript中的字符串，就要从unicode说起，因为[String即字符串类型，标识零个或多个16位Unicode字符序列，字符串可以使用三种符号包裹](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80.md) [-String即字符串类型，标识零个或多个16位Unicode字符序列](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80.md)

# 9.1 Unicode

## 9.1.1 MDN关于Unicode的基础解释

- unicode是一个**标准字符集**（**standard character set**），这个**标准字符集**对世界上不同地方的语言，书写文字系统，和符号（**symbols**）进行**编号**（**number**）和**定义**（**define**）
- 给每个字符一个编号，相应地程序就能创建一个**字符编码（character encodings）**代表整个字符，也就能让计算机在同一个文件和程序中**存储，处理和传输**（**store、process、transmit**）任何语言组合

---

- 在unicode出现之前，还出现了很多字符集
    - GB2312（对汉字进行编码的字符集）
    - Shift-JIS（对平假名，片假名，符号，全半拉丁字母和日语汉字进行编码的字符集）等
- 不同的字符集意味着同一个字符编码在不同的字符集中可能表示不同的符号
    - 公共的符号，如ASCII码中的基础数字和26个拉丁字母等字符因为较早统一的缘故，不同字符集中的字符编码是一样的
    - 但是有关语言的编码数据，在同一数据中混合使用不同的语言十分困难，很容易出错，因为无法判断字符编码使用的是哪一个字符集
    - 例如一个字符集存储的是日文字符，而另一个字符集存储的是阿拉伯字母，如果没有明确标明数据的哪个部分属于哪个字符集，其他程序和计算机就会错误地显示文本，或者在处理过程中损坏文本

---

- 网络上最常见地unicode标准字符集是**UTF-8**（**UCS Transformation Format 8**）；还有一些其他的unicode标准字符集，如UTF-16和过时的UCS-2，但是推荐使用UTF-8

## 9.1.2 unicode标准官网介绍

unicode标准官方网站为[https://www.unicode.org/](https://www.unicode.org/) ,其中有一篇[英文技术文章](https://www.unicode.org/standard/principles.html)介绍unicode

[Unicode®标准：技术介绍](9%20JavaScript%E4%B8%AD%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2%EF%BC%88String%EF%BC%89/Unicode%C2%AE%E6%A0%87%E5%87%86%EF%BC%9A%E6%8A%80%E6%9C%AF%E4%BB%8B%E7%BB%8D.md)

# 9.2 USVString

- USVString 代表的是所有可用Unicode**标量序列**的集合

<aside>
💡 USVString === unicode scalar values（unicode标量值）

Unicode标量值是除了**高代理码点**和**低代理码点**之外的任何Unicode代码点。换句话说，是整数范围在0到D7FF16和E00016到10FFFF16(包括)。

</aside>

- 在JavaScript中返回时，USVString映射为String
- 它通常只用于执行文本处理并需要**操作unicode标量值的字符串来操作的api**
- USVString会等价于DOMString，除了不允许**未匹配的代理码点**（在浏览器中，USVString 中未匹配的代理码点会转换为Unicode U+FFFD（�）字符）

# 9.3 DOMString

- DOMString是UTF-16字符串
- 在JavaScript中，DOMString最终也会被映射为String
- 一个DOMString类型的方法或参数允许传递null，通常指“null”

# 9.4 CSSOMString

- CSSOM是CSS Object Model，它是一个可以通过JavaScript操作CSS的API集合
- CSSOMString在CSSOM中表示字符串数据，可以引用DOMString或者USVString
- 在标准规范中使用IDL定义提到CSSOMString时，依赖于浏览器的实现去使用DOMString或USVString
    - 在浏览器中如果通过UTF-8表示字符串数据，那么可以使用USVString来替代CSSOMString
    - 如果浏览器要用16位的序列表示字符串，可以使用DOMString
- 目前几款主流的火狐，谷歌，Safari，Opera都是用USVString来表示CSSOMString的

# 9.5 Binary strings

- **JavaScript中的字符是UTF-16编码的，这就意味着一个代码单元需要两个字节的内存**，也就是说JavaScript中的string长度基本上是以两个字节单位进行计算的
- 二进制字符串是用来代表二进制数据的，并不是为了代表字符，如“011001100”
- 引入二进制字符串的原因在于使用Unit8类型数字的web应用在音频，视频以及WebSocket方面越来越强大，所以需要引入一个很好用的api来提供支持

# 9.6 charset=”utf-8”

- charset现在没必要设置，因为HTML文档默认使用utf-8编码
- 但是JavaScript中的String采用UTF-16格式编码与HTML文档的utf-8不是矛盾吗？
    - UTF-16人类友好，固定两个字节，人类可辨别
    - UTF-8机器友好，方便端到端的通信
    - 在`<script>` 中书写的JavaScript中的字符串是由0个或多个16bit的无符号整数组成，每个整数的值通常表示UTF-16文本的一个16bit单元，ES规定JavaScript字符必须是一个16bit的无符号整数，当在具体文件中，字符串仍然会被UTF-8编码