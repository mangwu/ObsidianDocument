# URI与URL

URL与URI属于父子关系，URI包括URL，而URL是一种URI

# URL

## 描述

- 统一资源定位符 Uniform Resource Locator, 又称统一资源定位器、定位地址、URL地址，俗称**网页地址，**简称网址
- 它是**因特网上标准的资源的地址**（Address），已被万维网联盟作为因特网标准RFC 1738
- 它可以用来**检索web上公布的任何资源**，这个资源可以是一个HTML页面，CSS文档，图像等等
- URL也可能指向一个不存在或者已被移动过的资源

## 语法

- 统一资源定位符的标准格式如下
    
    > [协议类型]://[服务器地址][:端口号]/[资源层级UNIX文件路径][?查询][#片段ID]
    > 
    
    > [scheme]://[host][:port]/[path][?query][#fragment]
    > 
- 统一资源定位符的完整格式如下
    
    > [协议类型]://[访问资源需要的凭证信息@][服务器地址][:端口号]/[资源层级UNIX文件路径][?查询][#片段ID]
    > 
    
    > [scheme]://[userinfo@][host][:port]/[path][?query][#fragment]
    > 
    - 其中，访问资源需要的凭证信息, 服务器地址，端口号可以构成**访问凭证**（authority）
        
        > authority = [userinfo@][host][:port]
        > 
- 如下是URL语法图
    
    ![1068px-URI_syntax_diagram.svg.png](URI%E4%B8%8EURL/1068px-URI_syntax_diagram.svg.png)
    
- 其中访问资源需要的凭证信息(userinfo),端口号(port)，查询(query)，片段ID(fragment)都可以省略，构成最简单的web资源地址[https://example.com/](https://example.com/)
- 组成
    - scheme：协议类型,在URL地址中后跟冒号，由字母开头，可以接数字、加号(+)、句点(.)、连字符（-）,协议不区分大小写，但是标准形式使用小写。流行的协议包括http、https、ftp、mailto、file、data和irc等。协议方案应该向互联网编号分配机构（IANA）注册，实践中也可以使用未注册的方案
    - // : 层级URL标记符号，固定不变，后接可选的凭证信息
    - userinfo: 可选的房资源的凭证信息，后接@，可选的，包含用户名和可选密码，例如`username:password@` ；出于安全考虑password不应该使用纯文本形式，除非冒号后为空（没有密码）；一般userinfo会被省略
    - host: 服务器，通常为域名，有时为IP地址。IPv4地址必须使用点-十进制格式，例如`10.112.10.88` ,IPv6地址必须用[]括起来
    - port: 端口号，以数字方式表示，若为默认值可以省略，例如https协议默认端口号443, http协议默认端口号，80;如果显示，前面应该接上`:`
    - path: 路径，以”/”字符开头，”/”区别路径中的每个目录名称，路径可能为空，仅仅是 `/`
    - query: 查询，GET模式的窗体参数，以”?”字符为起点，每个参数以”&”隔开，再以”=”分开参数名称与资料，通常以**UTF-8**的URL编码，避免字符冲突问题，例如[`https://developer.mozilla.org/en-US/search?q=URL`](https://developer.mozilla.org/en-US/search?q=URL)
    - fragment: 片段，以”#”字符为起点，在网页中通常表示锚点,例如[`https://developer.mozilla.org/zh-CN/docs/Learn/Common_questions/What_is_a_URL#如何使用_url`](https://developer.mozilla.org/zh-CN/docs/Learn/Common_questions/What_is_a_URL#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8_url)

## 示例

- *[https://chinois.jinzhao.wiki:443/w/index.php?title=随机页面](https://chinois.jinzhao.wiki/w/index.php?title=Special:%E9%9A%A8%E6%A9%9F%E9%A0%81%E9%9D%A2)*
    1. https是协议，现代网页访问的协议大多是超文本传输协议，后接冒号，表示具体web地址
    2. chinois.jinzhao.wiki, 服务器地址，这里是域名，没有使用useinfo,现代网页进步不会传递userinfo了
    3. 443: 端口号，可省略，因为https协议默认端口号为443
    4. /w/index.php 路径
    5. ?title=随机页面 ，query，查询
- 现代浏览器不需要用户输入协议和端口，且可以省略服务器地址的部分，如”www” ，所以要访问以上网页可以直接在浏览器网址栏上输入*[chinois.jinzhao.wiki/w/index.php?title=随机页面](https://chinois.jinzhao.wiki/w/index.php?title=Special:%E9%9A%A8%E6%A9%9F%E9%A0%81%E9%9D%A2)*

# URI

## 描述

- 统一资源标志符，Uniform Resource Identifer 缩写URI
- 用于在电脑术语中标志某一互联网资源名称的字符串
- URI最常见的形式就是URL(统一资源定位符)，通常指定为非正式网址
- URI还可以用于表示URN（统一资源名称 Uniform Resource Name）
    
    ![URI_Euler_Diagram_no_lone_URIs.svg.png](URI%E4%B8%8EURL/URI_Euler_Diagram_no_lone_URIs.svg.png)
    

## URL与URN

- URI可以指URL或者URN或二者兼备
- URN如同一个人的名称，URL如同一个人的住址
    - **URN定义某事物的身份**
    - **URL提供查找事物的方法**
- 一个典型的URN使用范例就是标志唯一数目的ISBN系统
    - `ISBN 0-486-27557-4`  无二异性的标志了一本《罗密欧与朱丽叶》的特定版本
- 而URL则的使用范例就是指定一个资源的位置，如上述特定版本的书的URL地址为
    - `[file://home/username/RemeoAndJuliet.pdf](file://home/username/RemeoAndJuliet.pdf)`
- 因此URL与URN是互补的关系，一个指出资源地址，一个指出资源基于某**名字空间**的唯一名称

## 技术观点

- 技术刊物，如W3C和IETF，通常不再使用URL这个术语，因为很少区别与URL与URI
- 而在非文献的万维网中，URL仍然被广泛使用，术语**网址**常作为URL和URI的同义词出现

# URL与URI的关系

- 上述图片已经显示的很清楚
    - URL属于URI的子类
    - URI可以是URL或URN二者之一或同时是URI和URN
- 技术上
    - URL和URN属于资源ID
    - 但是一个资源ID往往无法归类与二者中的一个，因为二者各有侧重
    - URL倾向表示某一资源的地址，而URN以某命名空间标识唯一资源名称
    - 而所有的URI都可被看作名称（标识identifer）