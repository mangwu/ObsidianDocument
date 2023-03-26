# 3.3 String

# 描述

- String包装类型对应字符串的引用类型

## 语法

```jsx
let strObj = new String(string)
```

- 构造函数传入一个原始字符串
- 返回一个String包装对象实例

# 方法与属性

String对象的方法可以在字符串原始值上调用；属性可以在原始字符串上访问

String提供了很多方法来解析和操作字符串

## 继承方法

### valueOf()

### toLocaleString()

### toString()

- 三个方法都返回对象的原始字符串值

## length属性

- 每个String对象都有一个length属性，表示字符串中字符的数量
- 即使字符串中包含双字节字符（而不是单字节的ASCII字符），仍然按照单字符来计数（因为JavaScript的字符串基本单元码元是16位的，具体看下面的[JavaScript字符](3%203%20String.md)）
    
    ```jsx
    const strObj = new String("Hello, 世界");
    // length属性表示字符串中的字符数量，双字节字符按照单个字符数量计算
    console.log(strObj.length); // 9
    ```
    
    - “世界”两个字都是双字节字符，但是按照单字符计数，两个字就是两个字符

## 1. JavaScript字符

### 码元

- **码元（code unit）**是构成JavaScript字符串的基本单元
- 对于多数字符，每**16位码元**对应**一个JavaScript字符**
- JavaScript字符串由**16位码元**组成
- 字符串中的length属性表示字符串包含多少16位码元

### String.prototype.charAt()

- 字符串调用`charAt()`方法
    - 传入字符串中字符的索引位置（整数）
    - 查找指定索引位置的16位码元，并返回该码元对应的字符

```jsx
llet message = "abc按不出";
console.log(message.charAt(4)); // "不"
```

- 字符索引位置为4的16位码元对应的字符是”不“

### 字符编码

- JavaScript字符串中的字符编码使用**Unicode编码混合策略**
    - UCS-2
    - UTF-16
- 对于可以采用16位编码的字符（U+0000~U+FFFF），这两种编码是一样的
- 关于JavaScript的字符编码可以查看如下文章
    
    [JavaScript's internal character encoding: UCS-2 or UTF-16?](https://mathiasbynens.be/notes/javascript-encoding)
    
- UCS-2（2字节通用字符集）对于简单地将16位编码和字符一一对应，对于0-0xFFFF范围地大多数字符都可以表示；如果字符才有16位编码，那么这两种编码完全一致
- UTF-16（16位Unicode转换格式）是UCS-2的扩展，它定义的字符编码长度是可变的，相较于UCS-2，具有额外的16种代码点，可以对0~0x10FFFF范围内的代码点进行编码
    
    ```jsx
    message = "𝌆";
    
    console.log(message.length, message.charAt(0), message.charAt(1));
    // 2 � �
    ```
    
    - 中心四方文（𝌆），使用UTF-16编码，unicode码为U+1D306，需要使用**两个十六位编码单元**：0xD834 和0xDF06，构成一个代理对，即**`"𝌆" == "\uD834\uDF06"`**
    - 所以字符长度为2，且单独的16位码元不能表示任何的字符，打印出未知字符

### String.prototype.charCodeAt()

- 查看指定码元的字符编码
- 可以传递字符串码元的位置索引（整数，范围为[0, str.length - 1]），返回指定索引位置的码元值（字符编码）
    - 码元值是10进制整数（将16进制的编码进行了处理）
    - 如果不传递码元的位置索引，默认返回第一位码元的码元值
    - 如果传递的位置索引不在可选的范围，返回NaN
    - 调用的字符串为空字符串，也会返回NaN

```jsx
let message = "𝌆a";
console.log(
  "".charCodeAt(),
  message.charCodeAt(),
  message.charCodeAt(0),
  message.charCodeAt(1),
  message.charCodeAt(2),
  message.charCodeAt(3)
);

// 打印结果
NaN 55348 55348 57094 97 NaN
```

- 字符𝌆，charCodeAt()将视其占用两位码元，字符串总长度为3，三个码元具有各自的编码
- 一些常用的字符编码可以记住：
    - [a, z] ⇒ [97, 122]
    - [A, Z] ⇒ [65, 90] （与上面的编码范围正好相差32）
    - [0, 9] ⇒ [48, 57]

### String.fromCharCode()

- 字符串引用类型的静态方法
- 根据给定的UTF-16码元创建字符串中的字符
- 传入x个字符的码元值或者字符编码，可以返回x长度的对应的字符串
    - 字符串字符的顺序按照传入参数的顺序
    - 码元值或字符编码必须是有效的，否则返回的字符串可能会有未知字符

```jsx
console.log(String.fromCharCode(67, 85, 0x61, 0x65, 12582, 0xd834, 0xdf06));
// CUaeㄦ𝌆
```

- 码元值67的字符编码是U+0043,代表字符“C”
- 码元值85的字符编码是U+0055， 代表字符”U“
- 字符编码0x0061码元值是97，代表字符”a”
- 字符编码0x0065码元值是101, 代表字符”e”
- 12582是随手输入的码元值，在UTC-16编码中代表汉字”儿“
- 后面的两个码元构成一个代理对，代表字符“𝌆”

### 字符编码对String方法的影响

- 对于U+0000~U+FFFF范围内的字符，使用UCS-2编码方式，一个字符固定为16位码元
    - length，charAt()，charCodeAt()和fromCharCode()都是基于16位码元完成操作的
    - 只要字符编码大小和码元大小一一对应，这些方法就能正常工作
- 但是对于使用UTF-16编码的字符，这些对应关系就不一定成立了
    - UTF-16称为16位Unicode转换格式， 包含Unicode增补字符平面，是对UCS-2的扩展
    - 16位只能编码65 536 个字符，这些编码字符在Unicode中被称为**基本多语言平面（BMP）**
    - 为了表示更多的字符，Unicode采用**代理对**的策略，即每个字符**使用另外16位去选择一个增补平面**
        - 这种每个字符使用两个16位码元的策略就是**代理对**策略
- 上述的例子中实际上已经测试过String的方法和属性
    - 对于length,不在BMP（基本多语言平面）的编码字符会占用两位码元，一个字符表示两个字符长度
    - 对于charAt() 当索引位置到**代理对**码元位置时，会返回未知字符`<?>`
    - 对于charCodeAt()，指定索引位置到代理对码元位置时，返回单个码元的码元值
    - 而对于fromCharCode(), 只要**代理对码元是连续传入的，**那么返回的字符串就不会出错
- 对于需要输入索引位置的方法 charAt()和charCodeAt()
    - 由于字符串中的字符无法确定是双码元字符还是单码元字符
    - 需要确定的码元位置索引就无法得知了

### String.prototype.codePointAt()

- codePointAt()解决上述方法只基于16为码元进行操作的缺点，可以代替codePointAt()实现对双码元字符的UTF编码获取
- 和使用codePointAt()类似
    - 接受16位码元的索引位置
    - 返回索引位置上的**码点（code point）**
- 码点是Unicode中一个字符的完整标识,可以是16位的，也可以是32位的
    - “c”的码点是0x0063，16位
    - 而“😊”的码点是0x1F60A，32位
    - 在实际的node环境中，会返回10进制的码点值，而不是十六进制的码点编码

```jsx
message = "a😊b";
console.log(
  message,
  message.codePointAt(),
  message.codePointAt(0),
  message.codePointAt(1),
  **~~message.codePointAt(2),~~**
	message.codePointAt(3)
);
// 打印结果
a😊b 97 97 128522 56842 98
```

- 倒数第二个输出的不是码点，它是没有意义的
- 传入的码元索引位置必须是代理对的开头位置才有效果，否则会返回错误的码点（实际上这个码点值和使用charCodeAt()返回是一致的）
- 注意在字符串迭代时，能智能的识别代理对的码点
    
    ```jsx
    for(const ch of message) {
      console.log(ch);
    }
    console.log(...message)
    // 打印结果 
    a
    😊
    b
    a 😊 b
    ```
    

### String.fromCodePoint()

- 得到了码点值使用fromCharCode()方法不一定能还原字符串
    - fromCharCode()只接受16位编码的码元值
    - 如果需要还原32位的编码字符，需要连续传入占用的两个码元值
    - 传入码点值不一定能识别，因为码点值可能是32位的
- 而使用fromCodePoint()只需要传入一个码点值就能还原
    - formCodePoint()会自动识别码点值是16位还是32位，遇到32位码点值会构造占用两个码元的字符

```jsx
console.log(String.fromCodePoint(97, 128522, 98));
// 打印结果
a😊b
```

## 2. String.prototype.normalize()方法

### 字符编码的映射

- 字符编码并不是一一对应的，一个Unicode字符可能有多种编码方式
- 有的字符可以通过一个**BMP**（基本多语言平面）字符表示，也可以通过一个**代理对**表示
    - 上面带圆圈的大写拉丁字母A—Å , 是BMP字符编码表示，码点U+00C5
        
        ```jsx
        console.log(String.fromCharCode(0x00c5));
        // Å
        ```
        
    - 长度单位“埃”— Å， 也是BMP字符编码表示，码点U+212B
        
        ```jsx
        console.log(String.fromCharCode(0x212b));
        // Å
        ```
        
    - 大写拉丁字母A— U+004, 上面加个圆圈U+030A; 两个码元代表一个字符
        
        ```jsx
        console.log(String.fromCharCode(0x0041, 0x030a));
        // Å
        ```
        
- 这些看起来相同的字符，实际上比较时是互不相等的
    
    ```jsx
    let a = "Å";
    let b = "Å";
    let c = "Å";
    console.log(a == b, b == c, a == c);
    console.log(a.charCodeAt(), b.charCodeAt(), c.codePointAt());
    // 打印结果
    false false false
    197 8491 65
    ```
    
    - 从次也可以得知，JavaScript比较字符不是在比较字符是否看起来相同，而是在**比较字符串中的每个码元是否相同**

### 字符规范

- 上述的字符显示的是同一个，但是编码却不是同一个
- 为此需要将字符规范成同一种格式，Unicode提供了4种规范化形式，无论底层字符代码是什么
    - NFD：Normalization Form D
    - NFC： Normalization Form C
    - NFKD：Normalization Form KD
    - NFKC: Normalization Form KC
- 上面的四种规范实际上就是**字符标准化表，** 只是每个字符标准化表的标准各不相同，以D、C、KD、KC命名
    
    字符标准化标准的相关内容可以查看[UAX15 # :Unicode Normalization Forms](https://www.unicode.org/reports/tr15/) 中的1.2节
    

---

- normalize()方法由字符实例调用，传入4个标准中其中一个的简称，返回标准化后的字符
    
    ```jsx
    let a = "Å"; // 0x00c5
    let b = "Å"; // 0x212b
    let c = "Å"; // 0x0041, 0x030a
    console.log(a == b, b == c, a == c);
    console.log(a.charCodeAt(), b.charCodeAt(), c.codePointAt());
    
    // normalize
    
    console.log(
      a.normalize("NFD").charCodeAt(),
      a.normalize("NFC").charCodeAt(),
      a.normalize("NFKD").charCodeAt(),
      a.normalize("NFKC").charCodeAt()
    );
    
    console.log(
      b.normalize("NFD").charCodeAt(),
      b.normalize("NFC").charCodeAt(),
      b.normalize("NFKD").charCodeAt(),
      b.normalize("NFKC").charCodeAt()
    );
    
    console.log(
      c.normalize("NFD").charCodeAt(),
      c.normalize("NFC").charCodeAt(),
      c.normalize("NFKD").charCodeAt(),
      c.normalize("NFKC").charCodeAt()
    );
    
    console.log(b == b.normalize("NFC"), b == b.normalize("NFD"));
    // 打印结果
    false false false
    197 8491 65
    65 197 65 197
    65 197 65 197
    65 197 65 197
    false false
    ```
    
    - 可以得到，四种标准中，NFD和NFKD规范对字符Å的编码规范确定为0x0041, 0x030a代理对，Å占用两个码元
    - NFC和NFKC规范对字符Å的编码规范确定为0x00c5，Å占用一个码元
    - 而0x212b不属于任何规范，所以保存0x212b的b经过NFC或NFD标准化后都变为与原始编码不同码元了
- 选择同一种编码规范能够避免在比较字符串时因为字符使用的码元不同而导致的比较不相等
    
    ```jsx
    console.log(
      a.normalize("NFD") == b.normalize("NFD"),
      a.normalize("NFKD") == c.normalize("NFKD"),
      b.normalize("NFC") == c.normalize("NFC")
    );
    // true true true
    ```
    

## 3. 字符串操作方法

## String.prototype.concat()

- 用于将一个或多个字符串拼接成一个新字符串（注意和数组的concat()方法是两个不同的方法，但是功能类似）
- 语法:
    
    ```jsx
    let res = strValue.concat(str);
    ```
    
    - 调用者为字符串
    - 返回值为拼接的字符串
    - 源字符串不会发生改变，获得的是**新的字符串**
- 例子
    
    ```jsx
    let strValue = "hello ";
    let res = strValue.concat("world");
    console.log(res);
    // hello world
    ```
    
- 注意：
    - 实际上**加法操作符**有[连接字符串](../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/5%205%E5%8A%A0%E6%80%A7%E6%93%8D%E4%BD%9C%E7%AC%A6.md)的功能
    - 实际开发过程中，拼接字符串更多使用`+` 而非concat()方法

### String.prototype.slice(),String.prototype.substring(),String.prototype.substr()

- 这三个方法功能相近，从字符串中提取子字符串
- slice()和substrng()的语法
    - 传入0-2个参数，第一个参数为子字符串在源字符串中的起始索引位置，第二个参数为子字符串在源字符串中结束的位置
    - 返回指定参数表示的子字符串
        - 如果不传入任何参数，返回源字符串的副本
        - 如果只传入第一个参数，从开始位置提取到源字符串末尾
    - 需要注意的是**子字符串包括第一个参数索引的字符而不包括第二个参数索引的字符**
    
    ```jsx
    let str = "ABCDEFGHIJKLM";
    console.log(str.slice(2, 5), str.substring(2, 5), str.slice(8), str.slice());
    // CDE CDE IJKLM ABCDEFGHIJKLM
    ```
    
- substr()语法
    - 同样传入两个参数，第一个参数是子字符串在源字符串中的起始索引位置，第二个参数是**子字符串的长度**
    - 返回指定参数表示的子字符串
        - 如果不传入任何参数，返回源字符串副本
        - 如果传入第一个参数，从开始位置提取源字符串到末尾
    - 注意：**substr已被定为[废弃标准](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr)，将来可能被移除**，应该避免使用
    
    ```jsx
    let str = "ABCDEFGHIJKLM";
    console.log(str.substr(2, 5));
    // CDEFG
    ```
    

**注意**

- 如果上面三个提取子字符串的操作不会对源字符串产生影响，返回的是**新的子字符串**
- 参数可以为负数，对于负数，每个方法的处理方式不同，假设源字符串长度为n
    - slice()， **两个参数的范围都是[-n, n]**
        - **超出范围被视为0，负数的索引值会被加上一个n进行处理**
        - 所以slice()中的两个参数param1 和param2在处理后的大小应该是**param1 < param2** 否则返回空字符串
    - substring()，两个参数的范围都是[0, n]
        - 超出范围被视为0，所以负数被当成0看
    - substr(), 第一个参数范围[-n, n], **第二个参数必须大于等于0**
        - **超出范围被视为0**
        - 第一个参数的负数索引值会被加上一个n进行处理
    
    ```jsx
    let str = "ABCDEFGHIJKLM";
    console.log(str.slice(-8, -2), str.substring(-5, 11), str.substr(-2, 1));
    // FGHIJK ABCDEFGHIJK L
    // 相当于 
    console.log(str.slice(5, 11), str.substring(0, 11), str.substr(11, 1));
    ```
    

## 4. 字符串位置方法

### String.prototype.indexOf()

- 定位子字符串在源字符串的开始位置索引，如果源字符串不包含子字符串就返回-1;搜索顺序为从左到右。
- 语法
    - 源字符串调用
    - 第一个参数必传递，子字符串
    - 第二个参数可传递，表示开始搜索的位置（搜索包括这个位置的字符）
    - 返回**第一个**搜索到的子字符串的开始位置
- 例子
    
    ```jsx
    let str2 =
      "Hello, cat, how constructor pop you Oh, you are fine cat, be careful cat";
    console.log(str2.indexOf("cat"));
    // 7
    ```
    
- 如果想要搜索字符串中的**所有子字符串**，可以利用第二个参数，每次搜索后传入上一个结果加1的索引位置，从上一个子字符串开始位置往后一个位置开始搜索，就能搜索到下一个子字符串
    
    ```jsx
    let str2 =
      "Hello, cat, how constructor pop you Oh, you are fine cat, be careful cat";
    console.log(str2.indexOf("cat"));
    let pos = str2.indexOf("cat");
    let allIdx = [];
    while (pos > -1) {
      allIdx.push(pos);
      pos = str2.indexOf("cat", pos + 1);
    }
    console.log(allIdx);
    // [ 7, 53, 69 ]
    ```
    

### String.prototype.lastIndexOf()

- 作用和indexOf一样，从源字符串中搜索子字符串的开始位置，**只是搜索顺序是从右到左的**
- 语法
    - 源字符串调用
    - 第一个参数必传递，子字符串
    - 第二个参数可选，搜索开始位置
    - 返回第一个搜索到的子字符串的开始位置
- 注意，传入第二个参数后，搜索从这个参数指定的位置开始**向字符串开头进行搜索**
- 例子
    
    ```jsx
    let str2 =
      "Hello, cat, how constructor pop you Oh, you are fine cat, be careful cat";
    console.log(str2.lastIndexOf("cat")); // 69
    console.log(str2.lastIndexOf("cat", 20)); // 7
    ```
    

### 注意

- 对于字符位置方法，**第一个子字符串可以传递空字符串**
- 传递空字符串后，返回的索引范围为[0, n] n是源字符串长度
- 返回值和传入的第二个参数有关
    - indexOf，默认是0
    - lastIndexOf默认是n
- 如果传入第二个参数，就会返回第二个参数的索引值
    - 第二个参数范围有效的范围也是[0, n]
    - 如果超出范围，会被处理为最接近的有效值(负数当作0，正数当作n)

## 5. 字符串包含方法

ECMAScript 6 新增的3个用于判断字符串是否包含另一个字符串的方法（判断子字符串是否在源字符串中被找到），返回布尔值

### String.prototype.includes()

- 检查整个字符串是否包含一个指定的子字符串，形如 `str.indexOf(substr) !== -1`
- 语法
    - 源字符串调用
    - 第一个参数，必传，子字符串
    - 第二个参数，可选，表示开始搜索的位置索引
    - 返回布尔值，表示包含或不包含
- 例子
    
    ```jsx
    let str3 = "foobarbaz";
    console.log(str3.includes("bar")); // true
    console.log(str3.includes("bar", 4)); // false
    ```
    

### String.prototype.startWith()

- 方法如其名，检查从字符串索引位置0开始的同长子字符串是否和指定字符串相等，形如 `str.indexOf(substr) === 0`
- 语法
    - 源字符串调用
    - 第一个参数必传，子字符串
    - 第二个参数，可选，表示开始搜索的位置索引
    - 返回布尔值，表示搜索开头是否包含子字符串
- 例子
    
    ```jsx
    let str3 = "foobarbaz";
    console.log(str3.startsWith("foo"), str3.startsWith("bar"));
    console.log(str3.startsWith("foo", 3), str3.startsWith("bar", 3));
    // 打印结果
    true false
    false true
    ```
    

### String.prototype.endWith()

- 方法如其名。检查从字符串索引位置(str.length -substr.length)开始的同长子字符串是否和指定字符串相等，形如`str.lastIndexOf(substr) == str.length - substr.length`
- 语法
    - 源字符串调用
    - 第一个参数必传，子字符串
    - 第二个字符串可选，表示字符串末尾的位置，传递后从该位置**向原字符串前**搜索等长子字符串
    - 返回布尔值，表示搜索的源字符串末尾是否包含子字符串
- 例子
    
    ```jsx
    let str3 = "foobarbaz";
    console.log(str3.endsWith("baz"), str3.endsWith("bar"));
    console.log(str3.endsWith("baz", 6), str3.endsWith("bar", 6));
    // 打印结果
    true false
    false true
    ```
    

### 注意

- 上述方法对于传入空字符串时，统一返回true，无论第二个参数值是什么

## 6.String.prototype.trim()

- 创建一个字符串的副本，删除前后的所有空格字符
- 语法
    - 源字符串调用
    - 无参数
    - 返回删除前后所有空格的副本字符串
- 原始字符串不受影响，得到的是新的字符串
    
    ```jsx
    let str4 = " \r\n\tabcde  f\r\n\tg hijklmn  \r\n\t";
    console.log(str4);
    console.log(str4.trim());
    // 打印结果
    ________
    				abcde  f
            g hijklmn  
    ________
    abcde  f
            g hijklmn
    ```
    
    - 其中黄色部分为原始字符所占的位置，下划线所在位置为空格或转义字符，为了更好标识而制作
    - 红色部分为使用trim()方法后的字符
        - 可以发现trim()对标识换行，回车，制表的转义字符是有效果的
        - 对于字符中间的空格，trim()不会处理
        - 关于转义字符可以查看[第三章介绍原始数据类型String](../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80.md)时
    - 原始字符长度为29，而非打印出来的那么长（因为\t可以打印4个空格，而只占用一个字符长度）

---

### 注意

- 其它trim()方法还包括**String.prototype.trimLeft()和String.prototype.trimRight()**
    - 分别用于清理字符串开始和末尾的空格
    - 和trim()能清理的”空格“一样，包括制表，回车，换行等转义字符

## 7. String.prototype.repeat()方法

- 复制字符串的方法，将复制的字符串进行拼接返回
- 语法
    - 接受一个整数参数，表示将字符串复制多少次
    - 返回复制指定次数后字符串拼接结果
- 例子
    
    ```jsx
    let str5 = "cn ";
    console.log(str5.repeat());
    console.log(str5.repeat(0));
    console.log(str5.repeat(1));
    console.log(str5.repeat(2));
    // 打印结果
    
    cn
    cn cn
    ```
    
    - 不传入参数或者传入参数0，相当于复制0次，即返回空字符串
    - 传入1返回一个字符串副本

## 8. String.prototype.padStart()和String.prototype.padEnd()方法

- 字符串填充方法，如其名称，在字符串的左侧或者右侧填充相同字符（默认为空格U+0020），直到长度达到给定的参数大小
- 语法
    - 第一个参数为整数，表示需要将字符串填充到的指定长度
    - 第二个参数可选，表示填充的字符，默认为空格字符，参数可以是字符串，按照字符顺序循环填充
    - 返回填充后的字符串
- 例子
    
    ```jsx
    let str6 = "bar";
    console.log(str6.padStart(10, "."), str6.padEnd(8, "foo"), str6.padStart(2));
    // 打印
    .......bar barfoofo bar
    ```
    
    - 如果第一个参数的大小没有源字符串长度大，则不做任何处理，返回源字符串副本

## 9. 字符串迭代与解构

- 字符串原型上具有一个`@@iterator`方法，表示可以迭代字符串的每个字符
- 对于具有迭代器的字符串，可以使用解构操作符对字符串进行字符分割解构

### String.prototype[Symbol[@@iterator]]()

- 语法
    - 调用字符串实例的迭代符号方法会得到一个迭代器对象
    - 调用迭代器对象的next()方法会顺序返回字符和字符串状态的对象
    - 返回解构如下
        
        ```jsx
        {
        	value: ch,
        	done: boolean,
        }
        ```
        
        - ch是调用迭代符号方法的字符串中的字符
        - done表示是否已经迭代完毕
- 例子
    
    ```jsx
    let str7 = "abc";
    const iterator = str7[Symbol["iterator"]]();
    console.log(iterator.next());
    console.log(iterator.next());
    console.log(iterator.next());
    console.log(iterator.next());
    // 打印结果
    { value: 'a', done: false }
    { value: 'b', done: false }
    { value: 'c', done: false }
    { value: undefined, done: true }
    ```
    
    - 字符串长度为3，所以调用next()方法三次可以顺序得到每个字符
    - 第四次调用时，已经迭代完毕，所以done状态为真值，而value为undefined

---

- 在介绍Symbol的常用内置符号中包含[Symbol.iterator符号](../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/%E5%B8%B8%E7%94%A8%E5%86%85%E7%BD%AE%E7%AC%A6%E5%8F%B7.md)的解释
    - 描述：该符号属性表示“一个方法，该方法返回**对象默认的迭代器**，由for of语句使用”。
- 所以可以直接使用for of 语句通过迭代器按序访问每个字符
    
    ```jsx
    let str7 = "abc";
    for (const ch of str7) {
      console.log(ch);
    }
    // 打印结果
    a
    b
    c
    ```
    

---

- 迭代器还有一个作用，可以被解构操作符进行解构，得到字符数组
    
    ```jsx
    console.log([...str7]);
    // ["a", "b", "c"]
    ```
    

## 10. 字符串大小写转换

- 字符串大小写涉及部分字符的大小写转换
    - 一般而言英文的26位字母大小写是一一对应的
    - 如果语言不同，部分字符的大小写对应规则也不同
    - 所以除了通用的转化大小写的方法`toLowerCase()`和`toUpperCase()` 针对不同地区，需要有`toLocaleLowerCase()` 和 `toLocaleUpperCase()`
- 大部分地区，Locale方法和默认方法是一样的，具有相同的大小写规则，但是有些地区不相同，如土耳其语言中的`i` 对应大写字母为`İ`

### String.prototype.toLowerCase(), String.prototype.toUpperCase()

- 语法
    - 字符串调用
    - 没有参数
    - 返回一个新的字符串，表示转换为小写或大写的调用字符串
- 例子
    
    ```jsx
    let hello = "Hello, World";
    console.log(hello.toLowerCase(), hello.toUpperCase());
    // 打印
    hello, world HELLO, WORLD
    ```
    

### String.prototype.toLocaleLowerCase(), String.prototype.toLocaleUpperCase()

- 语法
    - 字符串调用
    - 可选参数locale,指明要转换成小写或大写格式的特定语言区域，可以传递一个表示区域的字符串，也可以以数组形式传递多个locales，由方法决定[最合适的区域](https://tc39.es/ecma402/#sec-bestavailablelocale)；默认的locale是主机环境的区域设置,如中国大陆为`zh_CN` （中国大陆的区域和上面的两个标准方法没有区别）
    - 返回一个新字符串，表示指定区域的转换成大写或小写的调用字符串
- 例子（土耳其语为例子）
    
    ```jsx
    let tl = "Türk dili";
    console.log(
      tl.toLocaleLowerCase(["tr", "TR", "tr-TR", "tr-u-co-search", "tr-x-turkish"])
    );
    console.log(tl.toLowerCase());
    console.log(
      tl.toLocaleUpperCase(["tr", "TR", "tr-TR", "tr-u-co-search", "tr-x-turkish"])
    );
    console.log(tl.toUpperCase());
    // 打结果
    türk dili
    türk dili
    TÜRK DİLİ
    TÜRK DILI
    ```
    
    - 可以看到，标准方法对`i` 的大小写转换处理使用英语字母的 `i - I` 对，而土耳其语言区域中使用 `i - İ` 对

## 11. 字符串模式匹配方法

### String.prototype.match()

- 和正则表达式实例的exec()方法类似，用于模式匹配，只是调用者和参数反了过来
- 语法
    - 接受一个参数，可以是一个正则表达式字符串，也可以是正则实例
    - 如果正则表达式不是全局匹配
        - 返回匹配到的有关第一个子字符串的数组，包含匹配的子字符串，捕获组，匹配开始的位置索引，和exe()方法的返回值[一样](2%203%20RegExp%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95.md)
    - 如果正则表达式是全局匹配
        - 返回每个匹配到的字符串数组，不包含额外的捕获组，匹配开始索引信息等
- 例子
    
    ```jsx
    let text = "cat, bat, sat, lat";
    let reg1 = /.a(t)/;
    let reg2 = /.a(t)/g;
    
    console.log(text.match(reg1));
    console.log(text.match(reg2));
    // 打印结果
    [
      'cat',
      't',
      index: 0,
      input: 'cat, bat, sat, lat',
      groups: undefined
    ]
    [ 'cat', 'bat', 'sat', 'lat' ]
    ```
    
    - 第一个match匹配执行的reg1不是全局匹配，所以只返回第一个匹配结果，但是包含捕获组，匹配开始索引等信息
    - 第二个match匹配执行的reg2是全局匹配，返回所有匹配结果，不包含匹配成功的子字符串的额外信息
- **注意**
    - 如果没有匹配成功任何子字符串，返回null
    - **match方法调用正则实例匹配，不会改变正则实例的lastIndex属性**
        - 使用正则实例调用exec()会改变实例的lastIndex属性
    - 如果传入空字符串，默认返回如下
        
        ```jsx
        [ '', index: 0, input: 'cat, bat, sat, lat', groups: undefined ]
        ```
        
- 更多详细介绍查看[JavaScript正则表达式（RegExp）](../../JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89.md)

### String.prototype.search()

- 和match()方法不同的时，search()方法更像indexOf()方法，用于查找源字符串中是否具有可以正则匹配的子字符串
- 语法
    - 由源字符串调用
    - 一个参数，可以是一个正则表达式字符串，也可以是正则实例
    - 返回第一个匹配到正则模式的子字符串开始位置索引
    - 如果没有匹配到，就返回-1
- 例子
    
    ```jsx
    let text = "cat, bat, sat, lat";
    let reg1 = /.a(t)/;
    let reg2 = /.a(t)/g;
    console.log(
      text.search("bat"),
      text.search(""),
      text.search(reg1),
      text.search(reg2)
    );
    // 打印结果
    5 0 0 0
    ```
    
    - 传入空字符串返回0
    - search方法不关心正则实例是否为全局匹配，只返回第一个匹配到的子字符串的开始索引位置

### String.prototype.replace()

- 字符串中子字符串的替换操作方法
- 语法
    - 第一个参数，可以是字符串（不会被转换为正则表达式），也可以是正则实例
    - 第二个参数可以是一个字符串或函数
        - 如果是字符串，那么前面匹配的子字符串就会被这个字符串替换
        - 如果是函数，函数可以传递有关匹配的信息参数，然后处理返回新的替换的字符串
            
            ```jsx
            function replacer(match, p1, p2 ..., offset, string) {
            	// 通过参数处理得到新字符串
            	return newStr;
            }
            ```
            
            - match是匹配到的子字符串
            - p1,p2..是正则实例的捕获组匹配到的子字符串
            - offset是match在原字符串中的偏移量，如”abcd” 匹配到”bc”，那么偏移量就是1
            - string是原字符串（调用replace方法的字符串）
    - 返回值
        - 如果第一个参数是一个字符串，那么**替换的子字符串只会是第一个匹配到的子字符串**
        - 如果第已个参数是正则实例且带有g标记，那么字符串中所有匹配的字符串都会被替换，否则也只替换第一个匹配到的子字符串
        - 调用字符串不会改变，返回的是一个在调用字符串基础上经过替换的新字符串
- 例子
    
    ```jsx
    let text = "cat, bat, sat, lat";
    console.log(text.replace("at", "onc"));
    console.log(text.replace(/at/g, "onc"));
    console.log(
      text.replace(/(.)(a)(t)/g, (_match, $1, $2, $3) => {
        return $3 + $2 + $1;
      })
    );
    // 打印
    conc, bat, sat, lat
    conc, bonc, sonc, lonc
    tac, tab, tas, tal
    ```
    
    - 第一个参数为字符串，只替换了第一个匹配到的子字符串
    - 第二个参数为函数时，改函数利用捕获组捕获到的字符串将子字符串顺序颠倒然后作为替换子字符串返回

---

- 注意
    - 使用字符串作为第二个参数时，有一些特殊的序列用来表达式匹配到的值
    
    | 字符序列 | 替换文本 |
    | --- | --- |
    | $$ | $ (即要替换成$字符时的用法) |
    | $& | 匹配的子串，与RegExp.lastMatch类似 |
    | $’ | 匹配的子串之前的字符串，与RegExp.rightContext类似 |
    | $` | 匹配的子串之后的字符串，与RegExp.leftContext类似 |
    | $n | 匹配的第n个捕获组的字符串，范围[0, 9],$1表示第一个捕获组匹配到的字符串，如果没有捕获组就为空字符串 |
    | $nn | 匹配的第nn个捕获组的字符串，范围[01, 99], $01表示第一个捕获组匹配到的字符串，如果没有捕获组就为空字符串 |
- 例子
    
    ```jsx
    let text = "cat, bat, sat, lat";
    console.log(text.replace(/(.)(a)(t)/g, "$3$2$1"));
    tac, tab, tas, tal
    ```
    
    - 替换作用和上面第二个参数使用函数是一样，将捕获组的子字符串颠倒拼接后返回
- 如果第一个参数传入空字符串
    - 返回的新字符串会在原字符串的基础上在字符串开头加上第二个参数的字符串

### String.prototype.split()

- 这个方法根据传入的分隔符将字符串拆分成数组
- 语法
    - 字符串调用
    - 传入一个可选的参数， 可以是字符串，也可以正则实例
    - 第二个参数也是可选的，表示返回的字符串数组长度，确保返回的数组不会超过指定大小
    - 返回值
        - 如果不传入任何参数，返回一个长度为1，只有原字符串的数组
        - 如果只传入第一个参数，根据原字符串匹配到参数的个数决定返回的数组的长度，加上匹配个数为n，则数组长度为n+1,每个元素是匹配到的子字符串之间的字符串，如图所示
            
            ![split方法.png](3%203%20String/split%E6%96%B9%E6%B3%95.png)
            
            如果匹配项在边缘，那么空字符串也会作为一个元素存在于数组中。如如果匹配项为0，就返回一个长度为1的只包含原字符串的数组
            
            最终匹配项会被当作分割符在数组中被删除
            
- 例子
    
    ```jsx
    console.log("blue, wihte, red".split(""));
    console.log("blue, wihte, red".split(", "));
    console.log("blue, wihte, red".split(", ", 2));
    console.log("blue, wihte, red".split(", ", -1));
    // 打印
    [
      'b', 'l', 'u', 'e',
      ',', ' ', 'w', 'i',
      'h', 't', 'e', ',',
      ' ', 'r', 'e', 'd'
    ]
    [ 'blue', 'wihte', 'red' ]
    [ 'blue', 'wihte' ]
    [ 'blue', 'wihte', 'red' ]
    ```
    
    - 注意第二个参数的如果为负数将会无效，范围大于等于0，先得到分割好字符串数组后，从前面开始截取指定长度的数组，直到截取完
    - 第一个参数传入空字符串相当于获取字符串的单字符数组，等价于解构语法`[…str]`

### String.prototype.replaceAll()

- ES6的新方法，实际上谷歌浏览器85版本之前未实现这个方法，具体规范查看[ecma262官网](https://tc39.es/ecma262/#sec-string.prototype.replaceall) JavaScript高级程序设计指南未介绍该方法
- 语法
    - 第一个参数，**字符串**或者**带有g标记的正则实例**
    - 第二个参数和replace方法一样，特性也一样
    - 返回，**替换了所有匹配项的字符串**
- 例子
    
    ```jsx
    let text = "cat, bat, sat, lat";
    console.log(text.replaceAll("at", "onc"));
    // 打印
    conc, bonc, sonc, lonc
    ```
    
    - replaceAll与replace的最大区别在于**前者默认替换所有匹配项，且正则必须带有g标记**
    - **replace完全具有replaceAll的功能**，只要传递的正则具有g标记

## 12. String.prototype.localeCompare()

- 按照**字典顺序**比较字符串的大小，这里的字典顺序**不可以**看成使用String.charCodeAt()方法获取到的十进制Unicode编码大小，而是传统意义上的字典中对单词的排序方式**[aAbBcCdD-zZ]**
- 语法
    - 字符串调用
    - 传入第一个参数，也是字符串
    - 第二个参数可选，locales，表示语言和区域，不同语言的字母使用和排序方式不同，默认使用英语区的26位字母排序
    - 第三个参数可选 options，这两个可选参数是额外特性，查看[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)查找有关兼容性问题
    - 返回值为0, 1, -1 其中一个
        - 0：调用字符串和传入字符串相等
        - 1： 按照字典顺序，从两个字符串的第0位开始比较，如果调用字符排列在传入字符的**后面**则返回1
        - -1: 按照字典顺序，从两个字符串的第0位开始比较，如果调用字符排列在传入字符的**前面**则返回-1
        
        ---
        
        - 注意这里的前后，对于字母表而言就是**[aAbBcCdD-zZ],** a在所有其它字母的前面
- 例子
    
    ```jsx
    console.log("dce".localeCompare("dcea"));
    console.log("dce".localeCompare("dce"));
    console.log("dce".localeCompare("abc"));
    console.log("dce".localeCompare("Dce"));
    // 
    -1
    0
    1
    -1
    ```
    
    - dce与dcea相比，前面dce相同，但是deca比dec多一个字符，所以dec在前面，返回负数
    - dce与dce相同，二者相同，返回0
    - dce与abc相比，字符d在字符a之后，返回正数
    - dce与Dce相比，字符d在字符D之前，返回负数
- 注意
    - 不同的实现返回的整数可能不同，因为ECMAScript只规范了应该返回负数，0或正数，没规定一定返回-1或1
    - localeCompare()的实现与所在地区（国家和语言）有关系，比较字符串的大小和语言的字母顺序相关
        - 默认使用英语地区的字母排序[aAbB-zZ]
        - locales设定地区后，可能产生不同的情况
            
            ```jsx
            console.log("ä".localeCompare("z", "de")); // 德语区ä字符在z的前面，返回负数
            console.log("ä".localeCompare("z", "sv")); // 瑞典语区ä字符在z的后面，返回正数
            ```
            
            - 打印结果第一个为-1, 第二个为1
            - 因为字符ä在德语字母和瑞典字母中的排序不同导致的
    

## 13. HMTL方法

- 早期浏览器需要JavaScript动态生成一个HTML标签
- 因为早期DOM还未完善，所以依靠String定义了一些方法来生成HMTL标签
- 这些方法现在已经没人使用了，因为结果不是语义化的标记

| 方法 | 输出 | 备注 |
| --- | --- | --- |
| String.prototype.anchor(name) | <a name="name">string</a> | name是传入的字符串参数，string是调用的字符串实例，下同，返回的也是字符串， 下同，https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/anchor |
| String.prototype.big() | <big>string</big> | 不仅该方法在web标准中被删除，https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/big |
| String.prototype.bold() | <b>string</b> | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/bold |
| String.prototype.fixed() | <tt>string</tt> | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fixed tt标签用于将包裹的字符串具有固定间距 |
| String.prototype.fontcolor(color) | <font color="color">string</font> | color是传入的字符串参数，该方法在web标准中已被删除，且https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fontcolor |
| String.prototype.fontsize(size) | <font size="size">string</font> | size是传入的字符串参数，该方法在web标准中已被删除，且https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fontcolor |
| String.prototype.italics() | <i>string</i> | i标签用于将包裹的字符串变为斜体，https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/italics |
| String.prototype.link(url) | <a href="url">string</a> | url是传入的字符串参数，https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/link |
| String.prototype.small() | <small>string</small> | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/small, small用于将包裹的字符串显示小号字体 |
| String.prototype.strike() | <strike>string</strike> | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/strike，strike标签用于将包裹的字符串展示位被删除的文本 |
| String.prototype.sub() | <sub>string</sub> | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/sub |
| String.prototype.sup() | <sup>string</sup> | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/sup |