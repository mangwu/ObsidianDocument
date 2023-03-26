# URL解码方法

# 描述

- 在[URL编码方法](URL%E7%BC%96%E7%A0%81%E6%96%B9%E6%B3%95.md) 中，有两种针对URI的编码方法，encodeURI()和encodeURIComponent()
- 所以URL的解码方法有两种decodeURI()和decodeURIComponent()
- 这两个解码方法和编码方法一一对应
    - 使用decodeURI()解码使用encodeURI()编码过的字符
    - 使用decodeURIComponent()解码使用encodeURIComponent()编码过的字符

# decodeURI()

## 语法

- 传递一个由encodeURI()编码过的字符串
- 返回原始的解码后的字符串
- 因为encodeURI()编码的字符串不会替换如下字符
    
    
    | 类型 | 包含 | 备注 |
    | --- | --- | --- |
    | 保留字符 | ; , / ? : @ & = + $ | URI中使用的特殊字符 |
    | 非转义字符 | 字母，数字 - _ . ! ~ * ‘ ( )  | 无需转义的字符 |
    | 数字符号 | # |  |
- 所以解码时decodeURI()解码后是上述字符的UTF-8转义字符是不会进行解码的
- 例如使用encodeURIComponent()编码的字符串会将问号(?)，逻辑与(&)进行编码，但是decodeURI()并不会解码它们，因为在encodeURI()中需要编码的特殊字符不包括它们，所以解码的特殊字符也就不包括它们了

## 例子

```jsx
// decodeURI()
let encodeUrl = encodeURI(
  "http://example.com/path/to/illegal value.js?s='非法query'#非法锚点"
);
let encodeUrlCpn = encodeURIComponent(
  "http://example.com/path/to/illegal value.js?s='非法query'#非法锚点"
);
console.log(decodeURI(encodeUrl));
console.log(decodeURI(encodeUrlCpn));
// 打印结果
http://example.com/path/to/illegal value.js?s='非法query'#非法锚点
http%3A%2F%2Fexample.com%2Fpath%2Fto%2Fillegal value.js%3Fs%3D'非法query'%23非法锚点
```

- 使用encodeURIComponent()方法编码的url会将”?“”=””#””/”等进行UTF-8编码转义，但是encodeURI()方法的编码字符不包括这些
- 所以使用decodeURI()J解码时，就不会解码?，=，#，/等的转义字符，因为它们不在decodeURI的编码/解码范围内

# decodeURIComponent()

## 语法

- 传递一个由encodeURIComponent()编码过的字符串
- 返回原始的解码后的字符串
- encodeURIComponent()不会编码替换如下字符
    
    ```jsx
    A-Z a-z 0-9 - _ . ! ~ * ' ( )
    ```
    
- 这些不会编码替换的字符是上述encodeURI()不会编码替换字符的子集
- 与之对应，decodeURIComponent()能解码的字符更多，所以decodeURIComponent()能实际解码encodeURI()编码的字符

## 例子

```jsx
let encodeUrl = encodeURI(
  "http://example.com/path/to/illegal value.js?s='非法query'#非法锚点"
);
let encodeUrlCpn = encodeURIComponent(
  "http://example.com/path/to/illegal value.js?s='非法query'#非法锚点"
);
console.log(decodeURIComponent(encodeUrl));
console.log(decodeURIComponent(encodeUrlCpn));
// 打印结果
http://example.com/path/to/illegal value.js?s='非法query'#非法锚点
http://example.com/path/to/illegal value.js?s='非法query'#非法锚点
```

- decodeURIComponent()实际能解码encodeURI()编码的字符，因为解码的字符跟多