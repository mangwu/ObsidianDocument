# JavaScript正则表达式（RegExp）

# MDN关于正则表达式介绍

[RegExp(正则表达式) - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

# 定义

- 描述：正则表达式用于将文本和一个模式匹配
    - JavaScript中定义实现了一个全局对象RegExp，它提供了用于在JavaScript中构建和使用正则表达式的接口

# 正则表达式创建

## 构造函数字符串参数创建

- `RegExp`是JavaScript实现的全局对象之一，可以用于构建RegExp对象实例，即正则表达式
    - 使用RegExp构造函数创造的正则表达式提供了正则表达式运行时的编译（runtime compilation）
    - 如果不知道所获得的正则表达式的模式（如从用户输入获取），可以使用构造函数生成正则表达式
    
    ---
    
    - 正则表达式的模式指的是用于**匹配字符串中字符组合的模式，**如ab+c、\w都是这种模式，可以作为构造函数的参数
- `RegExp()` 构造函数
    
    ```jsx
    new RegExp(pattern[, flags])
    ```
    
    - 签名
        - pattern: 正则表达式的文本
            - 从ES5开始，模式可以是另一个RegExp对象，可以是字符串模式文本，也可以是字面量(使用斜杠包围)
                
                ```jsx
                let a = new RegExp(/abc/); // 可以是字面量
                let b = new RegExp('abc', 'i'); // 可以是字符串文本
                let c = new RegExp(a); //可以是另一个RegExp对象
                ```
                
            - 从ES6开始，使用带有后缀的字面量再使用第二个参数不会报错
                - ES5及之前报错原因是字面量后缀与flag功能冲突
                - ES6开始，flag回替换掉字面量已经存在的后缀，且使用构造函数时会创造一个新的正则表达式
                
                ```jsx
                let d = new RegExp(/abc/g, 'i'); // 结果为 /abc/i 'i'替换了'g'
                ```
                
        - flags： 可选参数，为正则添加标志的字符串，会替换掉字面量原有的标志后缀,其包含以下字符的组合
            1. **g :全局匹配，**找到所有匹配，而不是在第一个匹配后停止
            2. **i： 忽略大小写**，如果u标志也被启用，将使用Unicode大小写编码判定
            3. **m: 多行匹配**，将开始字符^和结束字符$视为在多行上工作。也就是说，匹配每一个行(\n或\r分隔)的开头或结尾，而不仅仅是整个字符串的开头和结尾
            4. **s: 点号匹配所有字符**，允许`.` 匹配新的行
            5. **u: unicode编码，**将模式视为Unicode编码序列。
            6. **y： stiky**，粘性匹配，只匹配目标字符串中lastIndex位之后的字符串，lastIndex是一个正则表达式的属性，用来指定下一次匹配的起始索引，只有当使用了全局匹配，该属性才有意义
            7. **d： 索引(indices)匹配**，为匹配的子字符串生成索引

## 字面量创建正则表达式

- 使用字面量可以直接创建真正表达式，无需使用构造函数
    - 字面量使用斜杆括起来，不使用引号
    - 字面量可以使用后缀表示标志，如/abc/g

```jsx
const reg = /abc/g;
```

- 使用场景
    - 使用字面量时，赋值后，文字符号表示方法（字面量创建法）会对正则表达式进行编译
    - 所以，reg保存的是固定的正则表达式。**当正则表达式是固定的时候，使用字面量创建是最好的**
    - 例如在循环中的正则表达式不会在每次迭代后重新编译正则表达式，节省了性能

# RegExp属性

## 构造函数

- [RegExp()](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89.md)

## 静态属性

- RegExp.lastIndex: 该索引用于表示从字符串的哪里开始下一个匹配

## 实例属性

- RegExp.prototype.flags: RegExp对象的flags的字符串，如”g”, “gi”等
- 其余实例属性为可选的flags中判断该正则表达式的匹配模式
    - 如RegExp.prototype.global 表示该正则表达式对象是否是全局匹配，是则返回true，否则返回false

## 实例方法

- RegExp.prototype.compile()
    - 运行脚本的期间重新编译正则表达式
    - 已被**废弃**，没有意义，因为可以使用构造函数重新编译获得正则表达式得到相同的效果
- RegExp.prototype.exec()
    - 在一个指定字符串中执行**一个**搜索匹配，返回数组或null
    - 如果设置了标志位为global或sticky
        - JavaScript RegExp对象是**有状态**的
        - RegExp对象的静态属性lastIndex会记录上一次成功匹配后的索引位置
        - 使用此特性，exec可以对单个字符串中的多次匹配结果进行逐条的遍历
        
        ```jsx
        /**
         * @type {RegExp} reg 正则表达式，全局匹配
         */
        const reg = new RegExp("foo*", "g");
        
        const str = "table football football fo";
        
        // exec会执行一次搜索匹配，使用lastIndex记录上一次的索引位置
        const arr = reg.exec(str); // 
        console.log("上一次索引位置：", reg.lastIndex);
        const arr2 = reg.exec(str);
        console.log("上一次索引位置：", reg.lastIndex);
        const arr3 = reg.exec(str);
        console.log("上一次索引位置：", reg.lastIndex);
        
        console.log(arr, arr2, arr3);
        ```
        
        - 结果
            
            ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled.png)
            
        - [完整代码](https://github.com/mangwu/javascript/blob/master/ScatteredRecord/RegExp/exec/example.js)
- RegExp.prototype.test()
    - 传入字符串，执行一次检索，查看正则表达式是否在字符串中有匹配，返回布尔值
    - 使用了g或者y标志的RegExp对象测试时会记录上一次匹配结束时的索引位置，下一次使用test匹配相同字符串时会从索引位置开始匹配
        
        ```jsx
        const reg = new RegExp("foo*", 'g');
        
        const a = "table football fofo a";
        
        console.log(reg.test(a), reg.lastIndex);
        console.log(reg.test(a), reg.lastIndex);
        console.log(reg.test(a), reg.lastIndex);
        console.log(reg.test(a), reg.lastIndex);
        ```
        
    - 结果
        
        ```bash
        true 9
        true 17 
        true 19
        false 0
        ```
        

---

# 字符串匹配方法

## String.prototype.match()

- 定义：match()方法检索返回一个字符串匹配正则表达式的结果
- 签名：
    - 参数regexp：
        - 一个正则表达式对象
        - 可以传入字面量和字符串
        - 传入字符串会隐式的使用new RegExp()将其转化为一个正则表达式对象
        - 没有传递任何值，会返回包含空字符串的数组
    - 返回值
        - 如果正则表达式**使用了g**标志，就会返回完整的正则表达式匹配的所有结果（字符串数组）或者空值（无任何匹配），但**不会返回捕获组**
        - 如果正则表达式没有使用g标志，则仅返回第一个完整匹配及其相关的**捕获组Array**或者空值（无任何匹配）
    - 捕获组属性：
        - groups: 一个捕获组数组或者undefined（如果没有定义捕获组）
        - index：匹配结果的开始位置
        - input：搜索的字符串
- 注意：
    - 正则表达式不包含g标志，match匹配的返回值和exec函数一致
- 例子:
    1. 使用小括号区分正则表达式，且不使用g标志，match匹配的结果先列出完整匹配结果，在列出子表达式匹配结果
        
        ```jsx
        // 使用小括号的分组匹配
        const str2 = "JavaScript is a single-threaded language";
        let reg = /a (single-threaded) language/;
        console.log(str2.match(reg));
        ```
        
        ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%201.png)
        
    2. 无论是否使用g标志，如果没有匹配结果都会返回空
        
        ```jsx
        const str = "JavaScript";
        
        // 使用g和不使用g的区别，以及无匹配值和有匹配值的区别
        let a = str.match(/a/);
        console.log(a); //['a', index: 1, input: 'JavaScript', groups: undefined]
        let b = str.match(/a/g);
        console.log(b); // ['a', 'a']
        let c = str.match(/k/g);
        console.log(c); //null
        let d = str.match(/k/);
        console.log(d); // null
        ```
        
    3. 使用非正则表达式对象作为参数时的情况
        1. 参数是一个字符串时，可通过new RegExp(str)直接将字符串转化位正则表达式进行匹配
        2. 如果参数是一个数字时，match函数会先隐式的将数字转化为字符串，再用转化的字符串构造正则表达式，如`NaN`对象会被转化为`/NaN/` 
        3. 在数字转化成字符串时，“+”会被忽略，所以不会匹配”+”（负号会被匹配）
        
        ```jsx
        // 匹配非正则对象
        var str1 =
            "NaN means not a number. Infinity contains -Infinity and +Infinity in JavaScript.",
          str2 = "My grandfather is 65 years old and My grandmother is 63 years old.",
          str3 = "The contract was declared null and void.";
        let m1 = str1.match("number"); // "number" 是字符串。返回["number"]
        let m2 =str1.match(NaN); // NaN的类型是number。返回["NaN"]
        let m3 =str1.match(Infinity); // Infinity的类型是number。返回["Infinity"]
        let m4 =str1.match(+Infinity); // 返回["Infinity"]
        let m5 =str1.match(-Infinity); // 返回["-Infinity"]
        let m6 =str2.match(65); // 返回["65"]
        let m7 =str2.match(+65); // 有正号的number。返回["65"]
        let m8 =str3.match(null); // 返回["null"]
        
        console.log(m1);
        console.log(m2);
        console.log(m3);
        console.log(m4);
        console.log(m5);
        console.log(m6);
        console.log(m7);
        console.log(m8);
        ```
        
        ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%202.png)
        
    - 完整代码
        
        [javascript/match.js at master · mangwu/javascript](https://github.com/mangwu/javascript/blob/master/ScatteredRecord/RegExp/match/match.js)
        

## String.prototype.matchAll()

- 定义：matchAll()方法返回一个包含所有匹配正则表达式的结果及分组捕获器的迭代器
- 签名:
    - 参数：正则表达式对象，可以使用字面量，必须是设置了全局模式g的形式，否则会抛出异常`TypeError`
    - 返回值：一个迭代器，包含所有匹配结果和对应分组捕获器
- 注意：
    - matchAll()和RegExp.prototype.exec()有相似之处，即都加上g标志后都能匹配每一项字符并给出对应匹配项信息（分组捕获器，索引等）
    - exec通过**lastIndex**记录上一次的匹配的索引，匹配之后的字符，来一次次获取所有匹配项信息
    - 而matchAll()可以一次性匹配所有字符并给出每个匹配字符对应的匹配项信息，不必使用循环加exec的方式
- 例子：
    1. 使用matchAll获取每个匹配项的信息和使用exec循环迭代获取每个匹配项信息
        
        ```jsx
        const str = "testtest1test2";
        const reg = /t(e)(st(\d?))/g;
        
        **const arr = [...str.matchAll(reg)];**
        console.log(arr);
        
        console.log("---exec循环迭代获取每个匹配项相关信息----");
        let execOneTime;
        while ((**execOneTime = reg.exec(str)) !== null**) {
          console.log(execOneTime);
        }
        ```
        
        - 因为迭代器不可重用，所以使用数据结构语法获取相关匹配项信息数组
        - matchAll结果
            
            ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%203.png)
            
        - exec循环迭代结果
            
            ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%204.png)
            
    2. 注意matchAll在字符串扫描时，正则表达式对象的lastIndex不会改变,因为每次匹配都会复制一次regexp
        
        ```jsx
        // matchAll不会改变lastIndex，但是lastIndex会影响matchAll的匹配结果
        const regexp = RegExp('[a-c]','g');
        regexp.lastIndex = 1;
        const str2 = 'abc';
        console.log(Array.from(str2.matchAll(regexp), m => `${regexp.lastIndex} ${m[0]}`));
        // Array [ "1 b", "1 c" ]
        ```
        
        ⇒ 没有匹配到”a”，因为设置了lastIndex为1，从第二个字符开始匹配
        
        ⇒ matchAll没有影响到lastIndex值，始终是1
        
        [完整代码](https://github.com/mangwu/javascript/blob/master/ScatteredRecord/RegExp/matchAll/matchAll.js)
        

# JavaScript正则语法

正则表单式的语法体现在[字符模式](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89.md)上。

- **字符模式：**
    - 一组特殊的格式的字符串
    - 由一系列特殊字符和普通字符构成
    - 每个特殊字符都包含一定的语义和功能

## 描述字符

对字符进行描述和定义是重要的匹配字符的基础

- 字符模式中的字符构成有两种
    - 普通字符，仅能描述本身，如所有的数字，字母等
    - 特殊字符，也称**元字符**，拥有特定功能
- **元字符**：
    - 大部分需要加反斜杠进行**标识**，便于和普通字符区分
    - 少数元字符需要加反斜杆进行**转义，**便于转义成普通字符使用
    - 元字符表
        
        
        | 元字符 | 描述 |
        | --- | --- |
        | . | 匹配单个字符，除了换行和行结束符 |
        | \w | 匹配单字字符(字母。数字，下划线)，等价于[A-Za-z0-9_]。其中w是word的意思 |
        | \W | 匹配非单词字符，等价于[^A-Za-z0-9_] |
        | \d | 匹配一个数字，等价于[0-9]。d是digit的意思 |
        | \D | 匹配一个非数字字符，等价于[^0-9] |
        | \s | 匹配一个空白字符，包括空格、制表符、换页符、换行符。等价于（MDN声明）[\f\n\r\t\v\u00a0\u1680\u180e\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]。其中的unicode字符大都是显示为空白的字符，可在https://unicode-table.com/cn 中查找，且https://unicode-table.com/cn/180E/ 作为一个空白符（蒙古语元音分隔符）测试不被匹配。s是space的意思。 |
        | \S | 匹配非空白字符，等价于(MDN声明)[^\f\n\r\t\v\u00a0\u1680\u180e\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff] |
        | \b | 匹配一个词的边界。单词的边界指的是一个词不被另外一个“字”字符跟随的位置或者前面跟其他“字”字符的位置，例如字母和空格之间的位置就是单词的边界，边界的内容长度为0。例如"gnk48 gn8k 4g8”，/\bg/g能匹配第一个g和第二个g, /8\b/g能匹配到第一个8和第三个8，其他的由于不在单词的边界所以不符合匹配条件。b是border的意思。 |
        | \B | 匹配一个非单词边界。匹配如下情况①字符串第一个字符为非“字”字符②字符串最后一个字符为非“字”字符③两个单词字符之间④两个非单词字符之间⑤空字符串。即使用\B连接匹配的字符不能是单词的边界。 |
        | \0 | 匹配NULL（U+0000）字符，不要在其后增加其他小数，因为\0是一个八进制转义序列。 |
        | \n | 匹配换行(LF)符，这里的n是字符n，而不是数字(1 2, ... n)中的n。n是newline的意思，将当前位置移到下一行开头。 |
        | \f | 匹配换页(FF)符号（U+000C）。f是form feed/clear screen的意思，将当前位置移到下一页开头。 |
        | \r | 匹配回车(CR)符号（U+000D）。r是Carriage Return的意思,将当前位置移到本行开头 |
        | \t | 匹配水平制表符号（U+0009）。t是Horizontal tab的意思，跳到下一个tab位置 |
        | \v | 匹配垂直制表符号（U+000B）。v是Vertical tab的意思。 |
        | \xxx | 匹配以八进制数xxx规定的字符，如a的ASCII码为97，其八进制表示为141，则/\141/可以匹配字符a。 |
        | \xdd | 匹配以十六进制数dd(两位)规定的字符，如a的ASCII码为97，其十六进制表示为61，则/\x61/可以匹配字符a。其中x是hexadecimal的意思。 |
        | \uxxxx | 匹配一个四位十六进制表示的UTF-16代码单元。a字符的UTF-16码位\u0061,则/\u0061/可以匹配字符a。其中u是unicode的意思。 |

### 元字符匹配例子

1. 使用ASCII编码的十六进制表示定义正则表达式字面量
    
    ```jsx
    var r = /\x61/;
    var s = "JavaScript"
    var a = s.match(r);
    ```
    
2. 使用正则表达式将下划线命名字符串转化为驼峰命名
    
    ```jsx
    /**
     * @description 下划线转驼峰命名
     * @param {String} str 下划线命名名称变量
     * @returns {String}
     */
    var underlineToBigHump = (str) => {
      // 使用正则表达式
      let ans = str.replace(
    		**/(_)(\w)/g,** 
    		**(_match, _$1, $2) => `${$2.toLocaleUpperCase()}`**
    	);
      return ans;
    };
    
    ```
    
    - replace用于将字符串中匹配到的字符进行替换
    - 替换可以通过一个函数进行替换，$x表示替换的
3. 在RegExp()构造函数中通过**字符串**使用元字符时，需要使用双斜杆；使用进制或unicode编码的元字符双斜杠和单斜杠同样有效
    
    ```jsx
    let str2 = "java script\njavascript";
    // 通过构造函数的字符串参数，使用元字符需要使用双斜杠
    let reg2 = new RegExp("\u0061"); // 使用单斜杠一样有效
    let reg3 = new RegExp("\\w")
    **let reg4 = new RegExp("\\s")
    let reg5 = new RegExp("\s")**
    **let reg6 = new RegExp("\n");
    let reg7 = new RegExp("\\n");**
    console.log(str.match(reg2)); // a
    **console.log(str.match(reg3)); // J**
    console.log(str.match(reg4)); // 空格
    console.log(str.match(reg5)); // s
    **console.log(str2.match(reg6)); // \n
    console.log(str2.match(reg7)); // \n**
    ```
    
    - 对于编码字符，和\n\f\r\t\v等[转义字符](http://c.biancheng.net/view/5385.html) （编码字符严格上也是转义字符），添加额外斜杠和不添加斜杆，其匹配到的都是编码代表的字符
    - 对于其他使用斜杆的元字符，添加额外斜杆能正常匹配其代表的字符，不添加额外斜杆匹配的就是普通字符，如”\s”匹配s。因为**字符串中任何字符（除了转义字符）加反斜杆还是字符本身**。
    - 结论：建议直接使用**字面量，**ES6现已支持**在构造函数中使用字面量**且添加flag不会报错

### 总结

1. 字符模式：如`ab\w`, `a+b`等都是字符模式，它由元字符和普通字符构成，如`ab\w`由元字符`\w`和普通字符`a` ,`b` 构成
2. 字面量：使用斜杆定义的正则表达式，由斜杆和字符模式构成，如`/ab\w/`
3. 元字符：拥有特殊功能的字符，大部分使用反斜杆进行标识，便于区分普通字符
4. 转义字符：转义字符是字符的间接表达方式，特殊语境无法使用字符本身，部分转义字符也是元字符，如\n \t
5. 正则构造函数RegExp: 使用RegExp字符串参数构造正则表达式时，**元字符中的非转义字符**需要**额外加反斜杆**才能正确匹配

---

## 描述字符范围

- 正则表达式中，方括号`[]` 表示字符范围
    - 方括号中包含多个字符，表示匹配其中任意一个字符
    - 方括号中多个字符的编码顺序是连续，可仅指定开头结尾，使用连字符`-`
    - 如果在方括号中使用`^`则可以表示字符范围外的字符
    - 注意空格也会被作为一种可选字符被单一匹配
- 常用的字符范围
    - [a-z]：查找一个小写字母字符
    - [A-Z]：查找一个大写字母字符
    - [0-9]：查找一个数字字符
- 可以配合元字符中的编码字符进行顺序匹配，如
    - **[\u0000-\u00ff]** 匹配一个任意的ASCII字符
    - [^\u0000-\u00ff] 匹配一个任意的双字节汉字

### 字符范围例子

1. 匹配任意大小写字母和数字
    
    ```jsx
    const str = "(Java)[Script]\n1.1";
    // 匹配任意数字和字符
    var r = /[a-zA-Z0-9]/g;
    console.log(str.match(r));
    //['J', 'a', 'v','a','S','c','r','i','p','t','1','1']
    ```
    
2. 使用字符编码匹配数字
    
    ```jsx
    // 匹配任意数字
    var r2 = /[\u0030-\u0039]/g;
    console.log(str.match(r2));
    // ['1', '1']
    ```
    
3. 使用反义字符匹配非数字和字母字符，从而达到只保留数字和字母的目的。反义字符比简单字符的功能更强大和实用
    
    ```jsx
    // 消除非数字，字母和小数点
    let a = str.replace(/[^a-zA-Z0-9.]/g, "")
    console.log(a); // JavaScript1.1
    ```
    

## 选择匹配

- 在两个子模式中任选一个匹配，实用竖线`|` 表示
    - 如果有多个模式进行选择，加上小括号以避免歧义如`/(123)|(456)|(abc)/`
- 通过选择匹配可以匹配特殊的字符进行转义，如匹配HTML的敏感字符
    - `let reg = /\"|\'|\<|\>|\&/g;` 匹配HTML的敏感字符

### 选择匹配例子

- HTML敏感词过滤，使用replace方法替换掉HTML敏感字符，HTML的完整转义字符可查看[对照表](https://tool.oschina.net/commons?type=2)
    
    
    | HTML敏感字符 | 十进制字符 | 转义字符 |
    | --- | --- | --- |
    | “ | &#34; | &quot; |
    | & | &#38; | &amp; |
    | < | &#60; | &lt; |
    | > | &#62; | &gt; |
    | 不断开空格（non-breaking space） | &#160; | &nbsp; |
    - 十进制字符的前缀相同，后面的是字符在ASCII表中的字符编码，可以通过十进制字符统一处理
    
    ```jsx
    const input = document.querySelector("input");
    input.addEventListener("change", (_e) => {
      let str = input.value;
      **let reg = /\"|\'|\<|\>|\&/g;**
      let a = str.replace(reg, **(m) => "&#" + m.charCodeAt() + ";"**);
      console.log(a);
      document.write(a);
    });
    ```
    
    - charCodeAt返回匹配到的字符对应的ASCII编码，和在一起就是HTML敏感字符的十进制字符

## 重复匹配

- 如果需要匹配连续的多个字符，JavaScript RegExp了定义一组重复类**量词**
    
    
    | 量词 | 描述 |
    | --- | --- |
    | n+ | 匹配任何包含至少一个n的字符串。等价于{1,}。如/a+/g会匹配”candy caaandy”中的[’a’, “aaa”] |
    | n* | 匹配任何包含至少0个或多个n的字符串。等价于{0,}。 |
    | n? | 匹配任何包含0个或一个n的字符串。等价于{0, 1}。如果紧跟在任何量词（+、*、？、{}）后面，会使得量词变的非贪婪（匹配尽量少的字符）,而缺省的匹配时贪婪模式（匹配尽量多的字符）。如”123abc”使用/\d+/会匹配”123“，而使用/\d+?/只会匹配到”1”。 |
    | n{x} | 匹配包括x个n的序列的字符串。 |
    | n{x, y} | 匹配包含最少x个、最多y个n的序列字符串。 |
    | n{x,} | 匹配包含至少x个n的序列的字符串 |
- 对于手机号码的匹配可以使用重复类量词
    
    [手机号验证最新正则表达式_itbrand的博客-CSDN博客_手机号正则](https://blog.csdn.net/itbrand/article/details/109239620)
    
    - 手机号码固定11位
    - 对于一般用户开头默认是1
    - 13和18开头的手机号第三位是全段
    - 15和19开头的手机号第三位除4外都有
    - 17开头手机号第三位除9外都有
    - 14开头手机号第三位除2，3外都有
    - 16开头的手机号除只有2、5、6、7
    - 总结出手机号的正常表达式：
        - `/1((3\d)|(8\d)|(5[0-35-9])|(9[0-35-9])|7([0-8])|(4[014-9])|(6[2567]))\d{8}/`
    
    ```jsx
    // 匹配手机号码
    let reg =
      /1((3\d)|(8\d)|(5[0-35-9])|(9[0-35-9])|7([0-8])|(4[014-9])|(6[2567]))\**d{8}**/;
    
    console.log(reg.test("13451142805")); //true
    console.log(reg.test("15451142805"));  // false
    console.log(reg.test("17951142805")); //false
    ```
    
- 重复类量词总是出现在作用的字符或子表达式的后面，作用于多个字符，使用**小括号**把它们包裹在一起形成一个子表达式

## 惰性匹配

### 重复类量词匹配模式

- 重复类量词大都具有**贪婪性，**即在条件允许的情况下匹配尽可能多的字符
    - ?、{n}、{n,m}重复类量词具有**弱贪婪性**，表现为贪婪的有限性
    - *、+、{n,}重复类量词具有**强贪婪性**，表现为贪婪的无限性
- 强贪婪性的重复类量词越左侧优先级越高
    - 当多个重复类量词同时满足条件时，会**保证右侧重复类量词最低匹配次数**的基础上，**使得最左侧的重复类量词尽可能占有所有字符**
    
    ```jsx
    const html = 
    	"<html><head><title></title></head><body></body></html>";
    
    // 前面一个会尽量匹配多的字符
    const reg = /(<.*>)(<.*>)/;
    
    const a = html.match(reg);
    console.log(a);
    ```
    
    - 结果
        
        ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%205.png)
        
    - 用小括号区分的匹配分组
        - 第一个字符串为完整的匹配结果
        - 第二个字符串为左侧重复类匹配子正则表达式匹配的结果
        - 第三个字符串为右侧重复类匹配子正则表达式匹配的结果

### 惰性匹配模式

- 惰性匹配模式
    - 与贪婪匹配模式相反
    - 在满足匹配条件的情况下，尽可能匹配少的字符
    - 定义惰性匹配的方法：在**重复类量词后面添加问号?限制词**
- 例子
    - 全局惰性匹配
        
        ```jsx
        // 惰性匹配
        const reg = /<.{5,}?>/g;
        const html = "<html><head><title></title></head><body></body></html>";
        
        console.log(html.match(reg));
        ```
        
        ⇒ 会尽量匹配中间字符为5位的标签，不足5位也会组合尽量少的标签
        
        ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%206.png)
        
    - 尽量匹配0次
        
        ```jsx
        const html = 
        	"<html><head><title></title></head><body><a></a></body></html>";
        const reg2 = **/<.??>/**;
        console.log(html.match(reg2));
        // 匹配<a>
        ```
        
- 6种惰性匹配
    1. {n, m}? :尽量匹配n次，为了满足条件最多重复m次
    2. {n}? :匹配n次
    3. {n,}? :尽量匹配n次，为了满足限定条件可匹配任意次
    4. ??: 尽量匹配0次，为了满足条件可匹配1次，相当于{0,1}?
    5. +?: 尽量匹配1次，为了满足限定条件可以匹配任意次，相当于{1,}?
    6. *? :尽量不匹配，为了满足条件可以匹配任意次，相当于{0,}?

## 边界量词

- 边界量词
    - 描述：用于确定匹配模式的匹配位置，如字符串的头部或尾部
    - 边界量词表
        
        
        | 量词 | 说明 |
        | --- | --- |
        | ^ | 匹配字符串的开始。如果多行标记被设置为true，也会匹配换行符后紧跟的位置。如/^A/会匹配“An E”中的“A”不会匹配”an A”中的A。^字符在字符范围中表示反向字符集的意思。 |
        | $ | 匹配字符串的结束。如果多行标记被设置位true，也会匹配换行符前的位置。如/t$/会匹配“eat”中的t，不会匹配”eater”中的t。 |
- 例子：
    1. 删除字符左侧空白字符
        
        ```jsx
        const str = "  javascript is a great language!   ";
        console.log("原始字符长度:", str.length);
        // 匹配左侧空白字符
        const reg = /^\s*/;
        console.log(str.replace(reg, ""));
        ```
        
    2. 删除字符右侧空白字符
        
        ```jsx
        // 匹配右侧空白字符
        const reg2 = /\s*$/;
        console.log(
        	str.replace(reg2, ""),
        	str.replace(reg2, "").length
        );
        ```
        
    3. 删除字符左右侧空白字符
        
        ```jsx
        // 匹配左侧和右侧空白字符
        const reg3 = /(^\s*)|(\s*$)/g;
        console.log(
        	str.replace(reg3, ""), 
        	str.replace(reg3, "").length
        );
        ```
        
    4. 删除除了字符左右侧的空白字符（匹配删除中间空白字符）
        
        ```jsx
        // 匹配中间空白字符
        const reg4 = /\s*/g;
        // 匹配左侧和右侧空白字符
        const arr = str.match(reg3);
        // 删除全部字符后添加左右侧空白字符
        console.log(
          arr[0] + str.replace(reg4, "") + arr[1],
          (arr[0] + str.replace(reg4, "") + arr[1]).length
        );
        ```
        
    - 结果
        
        ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%207.png)
        
    - [完整代码](https://github.com/mangwu/javascript/blob/master/ScatteredRecord/RegExp/6-BoundaryMeasure/boundaryMeasure.js)

## 声明量词

- 声明量词是声明表示条件的意思，包含声明量词两种模式
    - 正向声明
    - 方向声明

### 正向声明

- 正向声明指指定**模式后面的字符**必须被匹配，但是又**不返回这些字符**
    
    ```jsx
    匹配模式(?=匹配条件)
    ```
    
    ⇒ 匹配模式后面的匹配条件字符必须被匹配，但是只返回符合匹配条件的字符
    
- 例子
    1. 使用正向声明，匹配模式必须满足匹配条件才被匹配（匹配模式后有匹配条件表示的字符）
        
        ```jsx
        // 正向声明量词用于匹配符合条件的字符
        var s = "one : 1; two= 2";
        var r = /\w*(?==)/; //使用正前向声明，指定执行匹配必须满足的条件
        var a = s.match(r); //返回数组["two"]
        console.log(a);
        ```
        
        ⇒ 通过`(?==)` 锚点条件，指定只有后面包含等号字符的单词才能被匹配
        
    2. 匹配指定字符串中指定字符的最后一个字符索引，如”abcdabcd” 匹配“a”返回最后一个“a’字符的索引4
        
        ```jsx
        // 返回最后一个指定字符索引
        function lastCharIndex(str, c) {
          const reg = new RegExp(**`${c}(?=[^${c}]*$)`**);
          return str.match(reg).index;
        }
        var str = "JavaScript is a great language";
        console.log(lastCharIndex(str, "a"));
        ```
        
        - **``${c}(?=[^${c}]*$)``**  此正则表达式
            - 前半部分`${c}`表示需要匹配c字符
            - 后半部分`(?=[^${c}]*$)`表示匹配的条件：匹配字符串的结束，且其中不包含其他c字符（即前面的c字符就是最后一个c字符了）
        - 结果为27
    - [完整代码](https://github.com/mangwu/javascript/blob/master/ScatteredRecord/RegExp/7-DeclarationQuantifiers/positiveQuantifiers.js)

### 反向声明

- 反向声明的用法和正向声明一致，指定**模式后面的字符不必被匹配**，且不返回指定模式后的字符
    
    ```jsx
    匹配模式(?!匹配条件)
    ```
    
    ⇒ 匹配模式后面的匹配条件不能被满足，且只返回不符合匹配条件（反向）的匹配模式
    
- 例子
    1. 使用反向匹配，匹配模式后的字符不能满足匹配条件才会被匹配
        
        ```jsx
        // 反向声明匹配不符合条件的匹配模式
        const reg = /\w+(?!=)/g;
        const str = "one: 1; two=2";
        
        console.log([...str.matchAll(reg)]);
        ```
        
        ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%208.png)
        
        ⇒ 条件为后面不能跟”=”字符，所以匹配了4个结果
        
    2. 使用反向匹配匹配指定字符串的指定字符的最后一个
        
        ```jsx
        function lastCharIndex(str, c) {
          const reg = new RegExp(`${c}(?![^${c}]*${c}[^${c}]*)`, "g");
          console.log([...str.matchAll(reg)]);
          // console.log(str.match(reg));
          return str.match(reg).index;
        }
        lastCharIndex("JavaScript JavaScript", "a") // 14
        ```
        
        ⇒ 匹配条件应该是包含字符c的字符串，故而是[^${c}]*${c}[^${c}]*
        
        ⇒ 没有加$符号的原因是，反向声明对$有效，会导致匹配条件不会匹配到最后
        

## 子表达式

- 使用小括号对字符模式进行分组
    - 小括号包裹的就是子表达式，也称**子模式**
    - 子表达式具有独立的匹配功能，保存独立的匹配结果
    - 小括号后的量词会作用于整个子表达式
- 通过match(), matchAll()，exec()等匹配函数可以看到每个子模式的匹配结果
- 例子
    - 将下划线声明的变量字符串转化为驼峰表示
        
        ```jsx
        // 将下划线声明的变量转化为驼峰
        const str = "this_is_a_underline_var";
        function underlineToTuofeng(str) {
          return str.replace(/(_)(\w)/g, (_m, _$1, $2) => $2.toLocaleUpperCase());
        }
        console.log(underlineToTuofeng(str));
        // 结果 thisIsAUnderlineVar
        ```
        
        ⇒ (m, $1, $2)分别表示完整匹配项，第一个匹配子项，第二个匹配子项
        

## 反向引用

- 对于子表达式，可以在子表达式后面**引用前面的子表达式**,这就是反向引用
- 反向引用的模式为
    
    ```jsx
    \数字
    ```
    
    - 数字从1开始，表示第一个子表达式
    - 反向引用常用于有对称特性的字符串
    - 如果子表达式有嵌套，根据其**左括号的顺序决定数字**
- **注意**
    - 反向引用的匹配到的字符串**必须是相同**的
    - 如/(<\/?\w+>)\1/ 第一个子表达式可以匹配到有/或者没有/的内容，那么\1匹配得到的和第一个表达式匹配到的内容必须相同，都是无斜杆且中间字符一致
- 例子
    1. 使用反向引用匹配成对的html标签
        
        ```jsx
        const str = "<p></p><div><div><h2></h2>";
        
        const reg = /<\/?(\w+)><\/?\1>/g;
        
        console.log([...str.matchAll(reg)]);
        ```
        
        ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%209.png)
        
        ⇒  \1表示标签中的字符内容
        
    2. 嵌套的子表达式顺序按照左括号顺序
        
        ```jsx
        const str2 = "javascript java script rust";
        const reg2 = /((java)(script)).*\2.*\3/g
        console.log([...str2.matchAll(reg2)]);
        ```
        
        ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%2010.png)
        
    3. 反向引用的值可以通过$1，$2的形式使用
        
        ```jsx
        // 通过$n获取反向引用的值
        var s = "abcdefghijklmn";
        var r = new RegExp(/(\w)(\w)(\w)/g);
        
        console.log(s.replace(r, (m, $1, $2, $3) => $2 + $3 + $1));
        ```
        

## 禁止引用

- 反向引用会占用一定系统资源，分组为了方便操作，可以不禁用反向引用
    - 禁用方法：在左括号的后面加上一个问好和冒号
        
        ```jsx
        (?:pattern)
        ```
        
- 例子
    
    ```jsx
    const reg = /(?:\w+)/g;
    
    const str = "JavaScript is a great language";
    
    console.log([...str.matchAll(reg)]);
    // 不会有子表达式的引用
    ```
    
    ![Untitled](JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89/Untitled%2011.png)
    
    ⇒ 仅显示完整匹配项信息