# 2. 用户代理检测（User-Agent Detection）

- 顾名思义，用户代理检测就是通过检测浏览器的**用户代理字符串**确定使用的是什么浏览器
    - 用户代理字符串包含在每个HTTP请求的头部
        
        ![用户代理.png](2%20%E7%94%A8%E6%88%B7%E4%BB%A3%E7%90%86%E6%A3%80%E6%B5%8B%EF%BC%88User-Agent%20Detection%EF%BC%89/%25E7%2594%25A8%25E6%2588%25B7%25E4%25BB%25A3%25E7%2590%2586.png)
        
    - 在JavaScript中可以通过`navigator.userAgent` 访问
- 在服务端，常见的做法是根据接收到的用户代理字符串确定浏览器并执行相应的操作
- 而在客户端，用户代理检测被认为是不可靠的，只应该在没有其他选项时再考虑（因为可以任意修改）

---

- 用户代理字符串饱受争议，因为很长一段时间里，浏览器通过在用户代理字符串包含错误或误导性信息来欺骗服务器，要理解其中原因，必须了解用户代理字符串的历史

# 2.1 用户代理的历史（History of User-Agent Composition）

## 2.1.1 HTTP规范

- HTTP规范（1.0和1.1）**要求**浏览器应该向服务器发送**包含浏览器名称和版本信息**的简短字符串，RFC 2616（HTTP 1.1）是这样描述用户代理字符串的
    
    > 产品标记用于通过软件名称和版本来标识通信产品的身份。多数使用产品标记的字段也允许列出属于应用主要部分的子产品，以空格分隔。按照约定，产品按照标识应用重要程度的先后顺序列出。
    > 
- 这个规范进一步要求用户代理字符串应该是“标记/版本”形式的产品列表。但是现实当中的用户代理字符串远没有那么简单

## 2.1.2 早期浏览器

- 美国国家超级计算应用中心（NCSA，National Center for Supercomputing Application）发布于1993年的Mosaic是早期Web浏览器的代表，其用户代理字符串相当简单，类似于：
    
    > Mosaic/0.9
    > 
- 虽然在不同的操作系统和平台中可能有所不同，但基本形式都是这么简单直接，斜杠前是产品名称（有时候可能是“NCSA Mosaic”），斜杆后是产品版本
- 在网景公司准备开发浏览器时，代号确定为“Mozilla”（Mosaic Killer的简写），第一个公开发行版Netscape Navigator2的用户代理字符串是这样的
    
    > Mozilla/*Version* [*language*] *(Platform; Encryption)*
    > 
- 网景公司遵守了将产品名称和版本作为用户代理字符串的规定，但是又在后面添加了如下信息
    - [ ]  language：语言代码，表示浏览器的目标使用语言
    - [ ]  Platform：表示浏览器所在的操作系统和/或平台
    - [ ]  Encryption：包含的安全加密类型，可能的值为U(128位加密)、I（40位加密）、N（无加密）
    
    Netscape Navigator 2一个例子如下
    
    Mozilla/2.02 [fr] (WinNT; I)
    
    这个字符表示Netscape Navigator 2.02 ,在主要使用法语地区发行，运行在Window NT上，40位加密
    
- 总体上看，早期浏览器是可以通过用户代理字符串知道浏览器类型的

## 2.1.3 Netscape Navigator3 和 IE3

- 1996年，Nerscape Navigator3发布，超过Mosaic成为最受欢迎的浏览器，其用户代理字符串也发生了一些小变化，删除了语言信息，并将操作系统或系统CPU信息（OS或CPU 描述）等列为可选信息，格式如下
    
    > Mozilla/*Verson (Platform; Encryption [; OS-or-CPU description])*
    > 
    
    运行在Windows系统上的Netscape Navigator3的典型用户代理字符串如下：
    
    Mozilla/3.0 (Win95; U)
    
    这个字符串表示Netscape Navigator 3 运行在Windows 95上，采用128位加密（注意在windows系统上没有OS-or-CPU部分）
    
- 之后IE3也首次对外发布，因为当前Netscape Navigator3是市场占有率最高的浏览器，很多服务器在返回网页之前都会**特意检测**其用户代理字符串，如果IE因此打不开网页会导致自身受创，为此IE就在用户代理字符串中添加了兼容Netscape用户代理字符串的内容，结果格式如下
    
    > Mozilla/2.0 (compatible; MSIE *Version; Operating System*)
    > 
    
    运行在Windows95上的IE3.02的用户代理字符串如下
    
    Mozilla/2.0 (compatible; MSIE 3.02; Windows 95)
    
    - 当前大多数浏览器检测程序都只看用户代理字符串中的产品名称，因此IE成功将自己伪装成了Mozilla，也就是Netscape Navigator，这个做法引发了争议，因为它违反了浏览器标识的初衷
    - 另外真正的浏览器版本也跑到了字符串中间，并且它将自己标识成了Mozilla 2.0 而非3.0，背后的原因至今也没揭开，不过很可能就是当事人一时大意照成的

## 2.1.4 Netscape Communicator 4 和IE4~8

- 1997年8月，Netscape Communicator 4 发布（将Navigator修改为了Communicator），Netscape在这个版本仍然沿用了上个版本的格式
    
    > Mozilla/*Verson (Platform; Encryption [; OS-or-CPU description])*
    > 
    
    比如Windows 98 上的第4版，其用户代理字符串就是这样
    
    Mozilla/4.0 (Win98; I)
    
    如果发布了补丁，则相应增加版本号，比如下面是4.79版的字符串
    
    Mozilla/4.79 (Win98; I)
    
- 微软在发布IE4时只更新了版本，格式不变，如下
    
    > Mozilla/4.0 (compatible; MSIE *Version; Operating System*)
    > 
    
    比如Windows 98上运行的IE4字符串是
    
    Mozilla/4.0 (compatible; MSIE 4.0; Windows 98)
    
- 更新版本号之后，IE的版本和Mozilla的就一致了，识别同为第4代的两款浏览器也方便了
    - 但这种版本同步就此打住，在IE4.5（只针对Mac）面世时，Mozilla的版本号还是4，IE的版本号却变了
        
        Mozilla/4.0 (compatible; MSIE 4.5; Mac_PowerPC)
        
- 直到IE7，Mozilla的版本号就没有变过了，比如
    
    Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)
    
- IE8在用户代理字符串中添加了额外的标识“Trient”，就是浏览器渲染引擎的代号，格式变成
    
    Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)
    
    这个新增的Trident是为了让开发者知道IE8运行兼容模式，在兼容模式下，MSIE的版本会变成7，但是Trient的版本不变，添加这个标识后，就可以确定浏览器究竟是IE7（没有“Trident”），还是IE8运行在兼容模式
    
- IE9稍微升级了一下用户代理字符串的格式，Mozilla的版本增加到了5.0，Trient的版本号也增加到了5.0，IE9的默认用户代理字符串是这样的
    
    Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trient/5.0)
    
    如果IE9运行兼容模式，则会恢复旧版的Mozilla和MSIE版本号，但是Trient的版本号还是5.0，如下是IE9运行在IE7兼容模式下的用户代理字符串
    
    Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trient/5.0)
    
    所有这些改变都是为了让之前的用户代理检测脚本正常运作，同时还能为新脚本提供额外的信息
    

## 2.1.5 Gecko

- Gecko渲染引擎是Firefox的核心，Gecko最初是作为通用Mozilla浏览器（即后来的Netscape 6）的一部分开发的
- 有一个针对Netscape 6的用户代理字符串规范，规定了未来的版本应该如何构造这个字符串，新的格式与之前一直沿用到4.x版的格式有了很大的出入
    
    > Mozilla/*MozillaVersion (Platform; Encryption; OS-or-CPU; Language; PrereleaseVersion) Gecko/GeckoVersion ApplicationProdcut/ApplicationProductVersion*
    > 
    
    这个复杂的用户代理字符串包含了不少新信息，下表是其中每一部分的含义
    
    | 字符串 | 是否必需 | 说明 |
    | --- | --- | --- |
    | MozillaVersion | 是 | Mozilla版本 |
    | Platform | 是 | 浏览器所在的平台，可能的只包括Windows、Mac和X11（UNIX X-Windows） |
    | Encryption | 是 | 加密能力；U表示128位，I表示40位，N表示无加密 |
    | OS-or-CPU | 是 | 浏览器所在的操作系统或计算机处理器类型。如果是Windows平台，则这里是Windows的版本（WinNT,Win95）。如果是Mac平台，则这里是CPU类型（如68k，PPC for PowerPC 或 MacIntel）。如果是X11平台，则这里是通过uname -sm命名得到的UNIX操作系统名 |
    | Language | 是 | 浏览器的目标使用语言 |
    | Prerelease Version | 否 | 最初的设想是Mozilla预发布版本的版本号，现在表示Gecko引擎的版本号 |
    | GeckoVersion | 是 | 以yyyymmdd格式的日期表示的Gecko渲染引擎的版本 |
    | ApplicationProduct | 否 | 使用Gecko的产品名称，可能是Netscape，Firefox等 |
    | ApplicationProductVersion | 否 | ApplicationProduct的版本，区别于MozillaVersion和Gecko Version |
- 要理解Gecko的用户代理字符串，最好看几个不同的基于Gecko的浏览器返回的用户代理字符串
    
    Windows XP上的Netscape 6.21
    
    Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv: 0.9.4) Gecko/20011128 Netscape6/6.2.1
    
    Linux上的SeaMonkey 1.1a
    
    Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.11) Gecko/20060823 SeaMonkey/1.1a 
    
    Windows XP上的Firefox 2.0.0.11：
    
    Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11
    
    Mac OS X上的Camino 1.5.1：
    
    Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en; rv:1.8.1.6) Gecko/20070809 Camino/1.5.1
    
    ---
    
    Windows11上的Firefox 108.0.1 (64位)：现代浏览器已经不包含加密能力和语言信息，含有操作系统的位数和当前浏览器的位数信息
    
    Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0
    
- 相较于知道特定的浏览器，知道是不是基于Gecko才更重要，从第一个基于Gecko的浏览器发布开始，Mozilla的版本就是5.0，不会再改变
- 再Firefox4发布时，Mozilla简化了用户代理字符串，主要变化包括
    - [ ]  去掉了语言标记（即前面的en-US）
    - [ ]  在浏览器使用强加密时去掉加密标记（因为是默认了）。这意味着I和N还可能出现，但U不可能出现了
    - [ ]  去掉了Windows平台的平台标记，这是因为跟OS-or-CPU部分重复了，否则两个地方都会有Windows
    - [ ]  GeckoVersion固定为“Gecko/20100101”
    
    下面是Firefox4中用户代理字符串的例子
    
    Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox 4.0.1
    

## 2.1.6 WebKit

- 2003年，苹果宣布发布自己的浏览器Safari，Safari的渲染引擎叫WebKit，是基于Linux平台浏览器Konqueror使用的渲染引擎KHTML开发的，几年后，WebKit又拆分出了自己的开源项目，专注于渲染引擎开发
- 这个新浏览器也面临IE3.0时代同样的问题，怎样保证浏览器不被排除在流行的站点之外，答案是在用户代理字符串中添加足够多的信息，让网站知道这个浏览器与其他浏览器是兼容的，于是Safari就有了如下的用户代理字符串
    
    > Mozilla/5.0 *(Platform; Encryption; OS-or-CPU; Language) AppleWebKit/AppleWebKitVersion* (KHTML, like Gecko) Safari/*SafairVersion*
    > 
    
    一个实际的例子
    
    Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/124 (KHTML, like Gecko) Safari/125.1
    
- 这个字符串不仅包括苹果WebKit版本，也包含Safari的版本，一开始还有是否需要将浏览器标识位Mozilla的争论，但考虑到兼容性很快就达成了一致，现在所有基于WebKit的浏览器都将自己标识为Mozilla 5.0，与所有基于Gecko的浏览器一样。
- Safari版本通常是浏览器的构建编号，不一定是发布的版本号，比如Safari 1.25在用户代理字符串中的版本是125.1，但也不一定始终这样对应
- Safari用户代理字符串最受争议的部分是1.0预发布版本中添加的”(KHTML, like Gecko)”，由于有意想让客户端和服务器把Safari当成基于Gecko的浏览器（好像光添加Mozilla/5.0还不够），苹果也招来了许多开发者的反对，苹果回应：Safari与Mozilla兼容，不能让网站以为用户使用了不受支持的浏览器而把Safari排斥在外
- Safari的用户代理字符串在第三版时有所改进，下面的版本标记现在用来表示Safari实际版本号
    
    Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/522.15.5 (KHTML, like Gecko) **Version/3.0.3** Safari/522.15.5
    
    注意这个变化只针对Safari而不包括WebKit，因此，其他基于WebKit的浏览器可能不会有这个变化，通常是不是WebKit比识别是不是Safari更重要
    
    谷歌浏览器108.0.5359.125（64位正式版）的用户代理字符串：
    
    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KTHML, like Gecko) Chrome/108.0.0.0 Safari/537.36
    

## 2.1.7 Konqueror

- Konqueror是与KDF Linux桌面环境打包发布的浏览器，基于开源渲染引擎KHTML。
- 虽然只有Linux平台的版本，Konqueror的用户却不少，为实现最大化兼容，Konqueror决定采用Internet Exolore的用户代理字符串格式
    
    > Mozilla/5.0 (compatible; Konqueror/*Version; OS-or-CPU*)
    > 
- 但是Konqueror 3.2为了与WebKit就标识KHTML保持一致，也对格式做了一点修改
    
    > Mozilla/5.0 (compatible; Konqueror/*Version; OS-or-CPU*) KHTML/*KHTMLVersion*
    > 
- 一个例子
    
    Mozilla/5.0 (compatible; Konqueror/3.5; SunOS) KHTML/3.5.0 (like Gecko)
    
- Konqueror和KHTML的版本号通常是一致的，有时候也只有子版本的不同，比如Konqueror是3.5，而KHTML是3.5.1

## 2.1.8 Chrome

- 谷歌的Chrome浏览器使用Blink作为渲染引擎（基于WebKit），使用V8作为JavaScript引擎，Chrome的用户代理字符串包含所有WebKit的信息，另外加上了Chrome及其版本的信息，其格式如下
    
    > Mozilla/5.0 (*Platform; Encryption; OS-or-CPU; Language*) AppleWebKit/*AppleWebKitVersion* (KHTML, like Gecko) Chrome/*ChromeVersion* Safari/*SafariVersion*
    > 
- 以下是Chrome 7 完整的用户代理字符串
    
    Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.44 Safari/534.7
    
- 其中的Safari版本和WebKit版本可能始终保持一致，但也不能肯定

## 2.1.9 Opera

- 在用户代理字符串方面引发争议最大的浏览器就是Opera，它默认的用户代理字符串是所有现代浏览器中最符合逻辑的，因为它正确标识了自己和版本，在Opera8之前，其用户代理字符串都是这个格式
    
    > Opera/*Version (OS-or-CPU; Encryption) [Language]*
    > 
    
    比如Windows XP上的Opera 7.54 的字符串是这样的
    
    Opera/7.54 (Windows NT 5.1; U) [en]
    
    <aside>
    💡 注意，在Opera7之前的版本中，Opera可以解析Windows操作系统字符串的含义，比如Windows NT5.1实际上表示Windows XP，因此Opera6的用户代理字符串会包含Window XP而不是Windows NT 5.1,为了与其他浏览器保持一致，Opera7及后来的版本就改为使用官方报告的操作系统字符串而不是自己进行转换了
    
    </aside>
    
- Opera 8发布后，语言标记从括号外移到了括号内，目的是与其他浏览器保持一致
    
    > Opera/*Version (OS-or-CPU; Encryption; Language*)
    > 
    
    Window XP 上的Opera 8的用户代理字符串是这样的
    
    Opera/8.0 (Windows NT 5.1; U; en)
    
- Opera是唯一一个使用产品名称和版本完全标识自身的主流浏览器，不过与其他浏览器一样，Opera也遇到了使用这种字符串的问题，虽然从技术角度这么设置用户代理字符串是正确的，但网上很多检测代码只考虑了Mozilla这个产品名称，还有不少代码是针对IE和Gecko的
- 从Opera9开始，Opera也采用了两个策略改变自己的字符串
    - 一是把自己标识为别的浏览器，如Firefox和IE，这个时候用户代理字符串和它们一样，只是末尾会多一个Opera及其版本号，如
        
        Mozilla/5.0 (Windows NT 5.1; U; en; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 9.50
        
        Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.50
        
        这些字符串可以通过针对Firefox和IE的测试，但也可以被识别为Opera
        
    - 另一个策略是伪装成Firefox和IE，这种情况下用户代理字符串和Firefox，IE返回的一样，末尾也没有Opera及其版本信息，这样就每帮法区分Opera和其他浏览器了，更严重的是Opera会根据访问的网站不同设置不同的用户代理字符串，却不通知用户，这就导致很难通过用户代理字符串来识别Opera
- Opera 10又修改了字符串格式，如下
    
    > Opera/9.80 (*OS-or-CPU; Encryption; Language*) Presto/*PrestoVersion* Version/*Version*
    > 
    
    注意开头的版本号Opera/9.80 是固定不变的，Opera没有这个版本，但Opera工程师担心某些浏览器检测脚本会错误地把Opera/10.0当成Opera1而不是Opera 10因此Opera 10新增了额外地Presto标识（Presto是Opera地渲染引擎）
    
    Windows 7上地Opera 10.63的用户代理字符串：
    
    Opera/9.80 (Windows NT 6.1; U; en) Presto/2.6.30 Version/10.63
    
- Opera最近的版本已经更改为更标准的字符串末尾追加”OPR”标识和版本号，这样除了末尾的”OPR”标识符和版本号，字符串的其他部分与WebKit浏览器是类似的，下面是Windows 10上的Opera 52的用户代理字符串
    
    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.64
    

## 2.1.10 iOS和Android

- iOS和Android移动操作系统上默认的浏览器都是基于**WebKit**的，因此具有与相应桌面浏览器一样的用户代理字符串，iOS设备遵循以下基本格式
    
    > Mozilla/5.0 (*Platform; Encryption; OS-or-CPU like Mac OS X; Language*) AppleWebKit/*AppleWebKitVersion* (KHTML, like Gecko) Version/*BrowserVersion* Mobile/*MobileVersion* Safari/*SafariVersion*
    > 
    
    注意其中用于辅助判断Mac操作系统的“like Mac OS X”和“Mobile”相关的标识，这里的Mobile除了说明这是移动的WebKit之外没有什么用，平台可能是iPhone，iPod，iPad，因设备而异，如
    
    Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-US) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16
    
    注意在iOS3之前，操作系统的版本号不会出现在用户代理字符串中
    
- 默认的Android浏览器通常与iOS上的浏览器格式相同，只是没有Mobile后面的版本号（Mobile标识仍然有），例如
    
    Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    
    这个用户代理字符串是谷歌Nexus One手机上的默认浏览器
    

# 2.2 浏览器分析（Brower Analysis）

- 想要得到自己代码运行在什么浏览器上，大部分开发者会分析`window.navigator.userAgent` 返回的字符串值
    - 这一分析能精确的关键在于所有浏览器都会提供这个值
    - 开发者**相信**这个返回值是正确的，那么基于这个返回字符串的一组浏览器检测会得到关于浏览器和操作系统有比较精确的结果
- 相较于能力检测，用户代理检测还是有一定优势的
    - 能力检测可以保证脚本不必理会浏览器而正常执行
    - 现代浏览器用户代理字符串的过去、现在和未来格式都是有章可循的，我们能够利用它**准确识别**浏览器

## 2.2.1 伪造用户代理（**Spoofing User-Agent**）

- 通过检测用户代理来识别浏览器不是完美的方式，毕竟这个字符串可以造假
- 只不过实现window.navigator对象的浏览器（即所有现代浏览器）都会提供`userAgent`这个**只读属性**,因此简单的给这个属性设置其他值不会有效
    
    ![userAgent.png](2%20%E7%94%A8%E6%88%B7%E4%BB%A3%E7%90%86%E6%A3%80%E6%B5%8B%EF%BC%88User-Agent%20Detection%EF%BC%89/userAgent.png)
    
- 不过通过简单的方法可以绕开这个限制，有些浏览器会提供**伪私有的__defineGetter__方法**，利用它可以篡改用户代理字符串
    
    ![修改用户代理.png](2%20%E7%94%A8%E6%88%B7%E4%BB%A3%E7%90%86%E6%A3%80%E6%B5%8B%EF%BC%88User-Agent%20Detection%EF%BC%89/%25E4%25BF%25AE%25E6%2594%25B9%25E7%2594%25A8%25E6%2588%25B7%25E4%25BB%25A3%25E7%2590%2586.png)
    
- 对付这种造假是一件吃力不讨好的事情，检测用户代理是否以这种方式造过假是有可能的，但是总体来看是一场猫捉老鼠的游戏
- 与其劳心费力检测造假，不如更好的专注于浏览器识别，如果相信浏览器返回的用户代理字符串，就可以用它来判断浏览器，如果怀疑脚本或浏览器可能篡改了这个值，那最好还是使用能力检测

## 2.2.2 分析浏览器

- 通过解析浏览器返回的用户代理字符串，可以及其准确地推断出下列相关环境信息：
    - [ ]  浏览器
    - [ ]  浏览器版本
    - [ ]  浏览器渲染引擎
    - [ ]  设备类型（桌面/移动）
    - [ ]  设备生产商
    - [ ]  设备型号
    - [ ]  操作系统
    - [ ]  操作系统版本
- 新浏览器，新操作系统和新设备随时可能出现，用户代理字符串也会有所变化，因此用户代理解析程序需要与时俱进，频繁更新，以免落伍，自己手写如果不及时修订就过时了
- 这里推荐Github上维护的比较频繁的第三方用户代理解析程序：
    - Browser
    - UAParser.js
    - Platform.js
    - CURRENT-DEVICE
    - Google Closure
    - Mootools

<aside>
💡 注意：Mozilla维基（[wiki.mozilla.org](http://wiki.mozilla.org/)）有一个页面“[Compatibility/UADetectionLibraries](https://wiki.mozilla.org/Compatibility/UADetectionLibraries)”,其中提供了用户代理解析程序列表，可以用来识别Mozilla浏览器（甚至主流浏览器），这些解析程序是按照语言分组的，但是这个页面维护不频繁

</aside>