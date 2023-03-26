# 4.1Global

# 描述

- Global对象是ECMAScript最**特殊**的对象，因为代码不会**显示地**访问它
    - 直接在代码中打印Global会报错 `ReferenceError: Global is not defined`
    - 因为这个对象很特殊，它定义了一些方法，但是无法直接访问它
- Global对象是一种**兜底对象**
    - 也就是说，**不属于任何对象的属性和方法**默认是Global对象定义的
    - 事实上，不存在全局变量或全局函数这种东西，因为所有在全局作用域中定义的函数和变量都会成为Global对象的属性
- 前面说的isNaN(), isFinite(), parseInt(), parseFloat()实际上都是Global对象的方法
    - 不同环境下，isNaN,isFinite等方法挂载的实际对象不同
    - 在node中它们挂载在global对象上，**global对象实际上就是node对ECMAScript中Global的实现**
        
        ![Untitled](4%201Global/Untitled.png)
        
    - 在浏览器环境中，它们挂载在window对象上，**window对象实际上就是浏览器环境对ECMAScript中Global的实现**
        
        ![Untitled](4%201Global/Untitled%201.png)
        

# Global对象上的方法

## 1. URL编码方法

## URI与URL

[URI与URL](4%201Global/URI%E4%B8%8EURL.md)

### URL编码方法

[URL编码方法](4%201Global/URL%E7%BC%96%E7%A0%81%E6%96%B9%E6%B3%95.md)

### URL解码方法

[URL解码方法](4%201Global/URL%E8%A7%A3%E7%A0%81%E6%96%B9%E6%B3%95.md)

### 废弃的方案

- ECMAScript-262 第三版中使用的escape()和unescape()方法是旧标准中的编码和解码
- 因为只能正确编码ASCII字符，现在已经废弃，不要再使用，也不必了解

## 2. eval()

[eval()](4%201Global/eval().md)

# Global对象属性

- 所有原生引用类型构造函数，包括之前提过的Boolean,String，Number都是Global对象的属性
    
    
    | 属性 | 说明 |
    | --- | --- |
    | undefined | 特殊值undefined |
    | NaN | 特殊值NaN |
    | Infinity | 特殊值Infinity |
    | Object | Object的构造函数 |
    | Array | Array的构造函数 |
    | Function | Function的构造函数 |
    | Boolean | Boolean的构造函数 |
    | String | String的构造函数 |
    | Number | Number的构造函数 |
    | Date | Date的构造函数 |
    | RegExp | RegExp的构造函数 |
    | Symbol | Symbol的伪构造函数 |
    | Error | Error的构造函数 |
    | EvalError | EvalError的构造函数 |
    | RangeError | RangeError的构造函数 |
    | ReferenceError | ReferenceError的构造函数 |
    | SyntaxError | SyntaxError的构造函数 |
    | TypeError | TypeError的构造函数 |
    | URIError | URIError的构造函数 |

# window对象

[window](4%201Global/window.md)