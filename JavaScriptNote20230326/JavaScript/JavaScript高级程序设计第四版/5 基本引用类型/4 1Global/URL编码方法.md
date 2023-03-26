# URL编码方法

# 描述

- URL编码方法包含两个 encodeURI和encodeURIComponent()
- encodeURI()方法传递**完整的URI**（统一标识符地址）
- 而encodeURIComponent()用于**编码URI中单独的组件**

## 关于URL与URI

- 两个方法使用URI，而JavaScript高级程序设计中称它们是URL编码方法
- URL是一种URI，URI指统一资源标识符，包括URL和URN
- 在大部分情况下，URI都表示URL，表示一个网页地址
- 详情查看[URL与URI](URI%E4%B8%8EURL.md)

# 作用

- URI编码方法来编码URI，可以让浏览器能理解它们
- 编码时将浏览器无法识别的无效字符串使用特殊的UTF-8编码替换

## 场景

- 在使用ajax提交前端数据到后台时，就需要对url进行encodeURI编码
- 否则后台会出现各种乱码，通过encodeURL统一编码为utf-8格式，后台解码就很好处理

# encodeURI()

## 语法

- 传入一个完整的URI
- 返回一个用UTF-8编码替换了无效字符的新URI
- 通常而言，一个URI中的空格对浏览器来说是无效的编码，需要使用UTF-8的%20进行替换

## 特性

- 假定传入的URI是一个完整的URI，那么无需对那些保留的并且在URI中右特殊含义的字符进行编码
    
    ```jsx
    http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor
    ```
    
    - 上面是一个标志的URI构成例子
    - 对于本来就存在与URI中的具有特殊含义的字符，如斜杆，加号等，URI不会将其进行替换（即使在UTF-8中有对应转义编码）
- 由此可以得到encodeURI()**不会替换的字符**
    
    
    | 类型 | 包含 | 备注 |
    | --- | --- | --- |
    | 保留字符 | ; , / ? : @ & = + $ | URI中使用的特殊字符 |
    | 非转义字符 | 字母，数字 - _ . ! ~ * ‘ ( )  | 无需转义的字符 |
    | 数字符号 | # |  |
    - 所以除了上述的字符， 其它的字符都会被encodeURI方法进行，例如空格，汉字

## 例子

```jsx
// 对汉字，空格等进行替换
console.log(
  encodeURI(
    "http://example.com/path/to/illegal value.js?s='非法query'#非法锚点"
  )
);
// 打印结果
http://example.com/path/to/illegal%20value.js?s='%E9%9D%9E%E6%B3%95query'#%E9%9D%9E%E6%B3%95%E9%94%9A%E7%82%B9
```

- %20 是空格的UTC-8转义字符
- %E9%9D%9E%E6%B3%95 是汉字 “非法”的UTC-8转义字符
- %E9%94%9A%E7%82%B9 是汉字 “锚点”的UTC-8转义字符

## 注意

- encodeURI()方法编码的新URI无法作为HTTP GET或POST请求的URI
- 因为对于XMLHTTPRequests而言，”&”,”+”,”=”等字符不会被编码，而在GET和POST请求中，它们都是特殊字符（encodeURIComponent()会对它们编码）
- encodeURI**无法编码非高 - 低 位完整的代理字符**
    - 下面的解释参考[字符编码对String方法的影响](../3%203%20String.md) [csdn](https://blog.csdn.net/PIPE111/article/details/121308945)
    - JavaScript的字符基于16位码元，有些字符需要占用两个16位码元（UTF-16）
    - 这些占用两个16位码元的字符属于代理对，在前的就是高位代理字符，在后的就是低位代理字符
    - 而代理字符出现在D800~DFFF之间，例如Unicode字符😊的编码为(U+1F600)，使用UTF-16表示就是两位的代理对字符U+D83D和U+DE00
        
        ![Untitled](URL%E7%BC%96%E7%A0%81%E6%96%B9%E6%B3%95/Untitled.png)
        
    - 高位代理和低位代理各有0x400个(DFFF - D800 + 1)字符,总共0x100000个，1-16号平面字符都可以使用代理对表示
    - 如果两个代理对不是完整的，那么encodeURI就会抛出URIError错误
        
        ```jsx
        console.log(encodeURI("\ud83d\ude00"));
        console.log(encodeURI("\ud800\udfff"));
        try {
          console.log(encodeURI("\ud800"));
          console.log(encodeURI("\udfff"));
        } catch (error) {
          console.log("高低位不完整");
        }
        // 打印机
        %F0%9F%98%80
        %F0%90%8F%BF
        高低位不完整
        ```
        
        - 简单点就是需要使用两个码元表示的字符，只给出了其中一个码元，就会导致编码出错
        - 而两个码元使用的代理对范围是U+D800 ~U+DFFF, 在这范围内的码元必须成对出现，单独出现encodeURI无法编码
- 在URL的语法完整格式中，host可以是域名，也可以是IP地址，如果是IPv6地址，需要用`[]` 括号括起来，作为URL预留的字符，encodeURI方法不应该是要UTF-8编码替换它，但是实际上中括号不在encodeURI的保留字符中，会被编码替换成转义序列
    
    ```jsx
    console.log(
      encodeURI("https://[3ffe:3201:1401:1:280:c8ff:fe4d:db39]:8080/index.html")
    );
    // 打印结果
    https://%5B3ffe:3201:1401:1:280:c8ff:fe4d:db39%5D:8080/index.html
    ```
    
    - 为此，需要自定义一个修正方法避免这种情况
    
    ```jsx
    function fixedEncodeURI(str) {
      return encodeURI(str).replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    console.log(fixedEncodeURI("https://[3ffe:3201:1401:1:280:c8ff:fe4d:db39]:8080/index.html"));
    // 打印结果
    https://[3ffe:3201:1401:1:280:c8ff:fe4d:db39]:8080/index.html
    ```
    

# encodeURIComponent()

## 语法

- 传入一个uriComponent,即URI组件，URI组件就是组成URI的一部分，具体可以查看[URL与URI](URI%E4%B8%8EURL.md)； uriComponent可以是字符串，数字，布尔值，null，undefined,或者然后object，编码这个参数会被转化位字符串
- 返回原字符中无效字符被编码替换后的新字符串

## 描述

> encodeURIComponent() 函数通过将一个、两个、三个或四个字符的UTF-8编码的转义序列替换某些字符的每个实例来编码URI
> 
- UTF-8编码的转义序列形如`%xx` ，x是十六进制，汉字一般由三个这样的转义序列组成

## 与encodeURI()的区别

- 最大区别在于encodeURIComponent()不编码完整的URI，而是**URI中的单独组件（**大部分情况是URI中的query，因为query中可能包含许多浏览器无法识别的无效字符**）**
- 所以encodeURLComponent()回对在URI中是要的保留字符(如`:` `/`等)一样进行转义编码
    
    ```jsx
    console.log(
      encodeURIComponent(
        "http://example.com/path/to/illegal value.js?s='非法query'#非法锚点"
      )
    );
    // 打印
    http%3A%2F%2Fexample.com%2Fpath%2Fto%2Fillegal%20value.js%3Fs%3D'%E9%9D%9E%E6%B3%95query'%23%E9%9D%9E%E6%B3%95%E9%94%9A%E7%82%B9
    ```
    
    - 完整URI中的所有冒号，斜杆，空格，问号等被编码为UTF-8的转义序列
- 这也是encodeURIComponent()通常只编码那些追加到已有URI后面的字符串的原因（query）

## 不转义字符

- 以下是encodeURIComponent()不转义的字符（其它字符一律转义）
    
    
    ```jsx
    A-Z a-z 0-9 - _ . ! ~ * ' ( )
    ```
    
- 所以query中的问号`?`，逻辑与号 `&`  ，等于号 `=` 都需要被转义，value值如果不是上述组成的字符也需要被转义

## 例子

```jsx
var set1 = ";,/?:@&=+$"; // 保留字符
var set2 = "-_.!~*'()"; // 不转义字符
var set3 = "#"; // 数字标志
var set4 = "ABC abc 123"; // 字母数字字符和空格

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // -_.!~*'()
console.log(encodeURI(set3)); // #
console.log(encodeURI(set4)); // ABC%20abc%20123 (空格被编码为 %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // -_.!~*'()
console.log(encodeURIComponent(set3)); // %23
console.log(encodeURIComponent(set4)); // ABC%20abc%20123
```

- set2 set2 和set3 set4都是encodeURI不转义的字符（不包括空格）
- 而只有set2是encodeURIComponent不转义的字符

## 注意

- encodeURIComponent()比encodeURI()使用更频繁，因为编码查询字符串参数（query）的频率比编码基准URI的次数更多