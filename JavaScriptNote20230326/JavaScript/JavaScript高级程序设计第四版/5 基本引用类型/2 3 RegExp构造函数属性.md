# 2.3 RegExp构造函数属性

RegExp构造函数本身的属性在其他语言中称为静态属性

# 描述

- RegExp构造函数的属性可以直接通过RegExp句点调用访问
- **这些属性不属于任何实例，但是适用于作用域中的所有正则表达式，而且会根据最后执行的正则表达式操作而变化**
- 在捕获组的JavaScript程序引用中，就说明了可以通过`RegExp.$number`编号的形式[获取捕获组匹配到的值](2%203%20RegExp%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95/%E6%8D%95%E8%8E%B7%E7%BB%84.md)

# 有效构造函数属性

- RegExp的构造函数属性有一个特点，就是可以通过全称和简写的方式访问它们
- 每个属性都有一个全名和简写，下表是RegExp构造函数的属性
    
    
    | 全名 | 简写 | 说明 | 备注 |
    | --- | --- | --- | --- |
    | input | $_ | 最后搜索的字符串 | 非标准特性 |
    | lastMatch | $& | 最后匹配的文本 |  |
    | lastParen | $+ | 最后匹配的捕获组 | 非标准特性 |
    | leftContext | $` | input字符串中，出现在lastMatch前面的文本 |  |
    | rightContext | $’ | input字符串中，出现在lastMatch后面的文本 |  |
- 根据[MDN的标准](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#%E9%9D%99%E6%80%81%E5%B1%9E%E6%80%A7)，上述的所有构造函数的属性都是非标准特性
- 只有**RegExp[Symbol.species]**符号属性（返回构造器本身）是标准特性

## 例子

```jsx
const pattern = /([\w\d]+)@([\w\d]+).com/g;
let a =
  "1185956753@qq.com, wangzhihao@inspur.com, 13451142805@163.com, invalidEmail@com";

pattern.exec(a);
pattern.exec(a);

console.log(RegExp.input, 1);
console.log(RegExp.lastMatch, 2);
console.log(RegExp.lastParen, 3);
console.log(RegExp.leftContext, 4);
console.log(RegExp.rightContext, 5);
```

- 打印结果
    
    ```jsx
    1185956753@qq.com, wangzhihao@inspur.com, 13451142805@163.com, invalidEmail@com 1
    wangzhihao@inspur.com 2
    inspur 3
    1185956753@qq.com,  4
    , 13451142805@163.com, invalidEmail@com 5
    ```
    
    - 正则表达式有g标志，为全局搜索，所以进行两次exec()匹配，分别匹配第一个邮箱和第二个邮箱
- 最后一次匹配的结果lastMatch为第二个邮箱
- 最后一次捕获组匹配的结果lastParen为第二个邮箱的后缀
- 左边上下文是第一个邮箱加上逗号控股
- 右边上下文是第三个邮箱和一个非法邮箱

---

- 如果不使用全称，而使用简称来访问，大部分需要使用中括号语法来访问，如下
    
    ```jsx
    console.log(RegExp.$_, 1);
    console.log(RegExp["$&"], 2);
    console.log(RegExp["$+"], 3);
    console.log(RegExp["$`"], 4);
    console.log(RegExp["$'"], 5);
    ```
    

# 捕获组相关的构造函数属性

- 使用RegExp$1 ~ RegExp$9 来[获取捕获组匹配到的值](2%203%20RegExp%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95/%E6%8D%95%E8%8E%B7%E7%BB%84.md)
- 1 - 9是捕获组的编号，调用exec()和test() 实例方法时会被填充
    
    ```jsx
    const pattern8 = /(\d{4})-((?<month>\d{2})-(?<day>\d{2}))/;
    console.log(
      pattern8.test("2012-07-04"),
      RegExp.$1,
      RegExp.$2,
      RegExp.$3,
      RegExp.$4
    );
    ```
    
    - 打印结果 `true 2012 07-04 07 04`
- 捕获组有关的RegExp构造函数属性也不是标准特性

# 注意

- 上面的构造函数的属性都是非标准特性，但是大部分环境都实现了
- 虽然如此，也**不要在生产环境下使用它们**，它们在浏览器环境下都是非法的