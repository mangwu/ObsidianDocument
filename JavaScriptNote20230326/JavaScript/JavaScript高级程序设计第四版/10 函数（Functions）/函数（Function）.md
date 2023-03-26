# 函数（Function）

每个JavaScript函数实际上是一个`Function` 对象，通过代码`(function(){}).constructor === Function` 返回`true` 可以验证这一事实

# 1. 构造函数（Constructor）

`Function()`constructor

## 1.2 定义

- 构造函数`Function()` 会创建一个新的`Function` 对象
- 直接调用`Function()` 构造函数能**动态（dynamically）**构造函数（functions），但是会有安全问题和`eval()`类似的[性能问题](../10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89.md)（没那么严重）
- 和`eval()` （可以访问局部作用域）不同，`Function` 构造函数只创建**在全局作用域中执行的函数**

## 1.3 语法

```jsx
new Function(functionBody);
new Function(arg0, arg1,..., argN, functionBody);

Function(functionBody);
Function(arg0, arg1, ..., argN, functionBody);
```

<aside>
💡 注意:`Function()` 能直接被调用而不使用`new` 操作符，两种方式都能创建`Function`实例

</aside>

**参数**

- `argN` 可选参数
    
    作为新创建函数的正式参数的名称。每个`argi` 都是字符串形式，对应JavaScript有效的参数【普通标识符（plain identifier），`rest`参数，解构参数（destructured parameter），带有默认值（default）的可选（optionally）参数】，或使用逗号分隔构成一个参数列表。几种有效参数如下
    
    ```jsx
    "num1"
    "...rest"
    "{a, b}"
    "num2 = 3"
    "num1, num2"
    ```
    
    因为参数的解析（parsed）方式和函数表达式相同，允许空格（whitespace）和注释（comments）的存在。一些例子
    
    ```jsx
    "[a,  b] /* numbers */"
    "x, theValue = 42 /* defaultValue */"
    ```
    
    尽管可读性很差，但这些都是正确的参数
    

## 1.4 理解Function构造函数

### 1.4.1 性能问题

- 使用`Function()` 创建函数对象比使用函数表达式和函数声明语法创建函数对象的**效率更低，**同时调用石头`Function()` 创建的函数对象的效率也更低，因为
    - 在创建时，代码被**解释**（**interpretation**）两次（一次是常规的创建语法，一次是`argi` 参数的解析（parsed））
    - 而在调用时，会解析`functionBody` 参数

### 1.4.2 动态编译

- 除了最后一个参数外，其它字符串参数（`argi`）都作为新函数的参数标识（identifiers）被按照顺序传递。新函数会被**动态编译**（**dynamically compiled**）为函数表达式，并以一下方式组装（assembled）成函数表达式的源代码
    
    ```jsx
    `function anonymous(${args.join(",")}
    ) {
    	${functionBody}
    }
    ```
    
    - 这种模式可以通过调用函数对象的`toString()` 方法被观察到：
        
        ```jsx
        const sum = new Function("num1,num2", "return num1 + num2");
        
        console.log(sum);
        console.log(sum(1, 2));
        
        console.log(sum.toString());
        // 打印
        
        ```
        
    - `anoymous` 是匿名的意思
- 注意**组装**（**assembled**）函数表达式源代码的两个部分——`args.join(",")` 和`${functionBody}` 会被分别解析（parsed），确保它们在语法上是有效的，这样可以防止**类似注入**（**injection-like**）的尝试

### 1.4.3 函数标识符

- 与普通的函数表达式不同的是，`anonymous` 不会加入到`functionBody` 的域（`scope`）中，因为`functionBody` 只能访问全局域（`global scope`）；这句话是[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function)中的原文，可能很难理解，下面是一些解释
    - 在函数表达式中，`function`关键字后面可以接一个标识符表示这个函数的名称，如果不接就是匿名函数，名称使用初始定义时被赋值变量的标识符名称，如下
    - 实际上，这个`anonymous` 还有一个作用，就是可以在函数内部作为函数对象本身被使用，而匿名的函数没有声明名称，因此名称是被赋值变量的标识符名称，所以可以直接使用初次被赋值的变量名称标识符（前提是不改变变量）
        
        ```jsx
        let sum3 = function anonymous(num1, num2) {
          console.log(sum3);
          return num1 + num2;
        };
        sum3(1, 2); // [Function: anonymous]
        
        let sum4 = function (num1, num2) {
          console.log(sum4);
          return num1 + num2;
        };
        sum4(1, 2);  // [Function: sum4]
        let sum5 = sum4;
        sum4 = "sum4";
        sum5(1, 2); // sum4
        ```
        
        - 可以发现，`sum4` 变量被修改后，匿名函数的打印就发送了变化，这表明在函数表达式中尽量声明函数名称的好处，可以直接在函数体内部获取函数对象本身
    - 但是使用`Function` 构造函数创建的函数对象虽然按照`sum3` 的形式进行了[**动态编译](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)** 但是`anonymous` 并不能在函数体内被使用（这就是[上面这段话](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)的意思），如下，直接使用`anonymous` 会报错，尽管函数名称是`anonymous`
        
        ```jsx
        let sum = new Function(
          "num1,num2",
          `try {
            console.log(anonymous)
          } catch(error) {
            console.log(error.toString())
          }
          return num1 + num2`
        );
        
        console.log(sum); // [Function: anonymous]
        console.log(sum(1, 2)); // ReferenceError: anoymous is not defined
        ```
        
        ![Untitled](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89/Untitled.png)
        
    - 这种问题的成因在于`functionBody` 只能访问全局作用域，而声明后全局作用域中是不存在`anoymous` 的，显然也不能通过访问`sum` 访问函数对象本身，因为`sum` 作为变量是可以被改变的

**解决方案**

- 如果`functionBody` 没有处于严格模式下（方法体本身不是严格模式的，因为它不会从上下文继承严格模式，如果外部是严格模式，就需要在方法体中声明`"use strict"`指令）,可以使用`[arguments.callee](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee)` 引用方法本身
    
    ```jsx
    const sum6 = new Function(
      "num1,num2",
      `
      **console.log(arguments.callee)**
      return num1 + num2
      `
    );
    sum6(1, 2); // [Function: anonymous]
    ```
    
- 另外，使用**闭包**也能解决这个问题
    
    ```jsx
    const sum7 = new Function(
      "num1,num2",
      `
    return (function anonymous(num1,num2) {
      console.log(anonymous);
      return num1 + num2
    })(num1, num2);
    `
    );
    sum7(3); // 打印[Function: anonymous]
    ```
    
    - 但是`anonymous` 并非动态编译产生的匿名函数使用的名称，而是临时声明的函数

**使用场景**

- 因为**递归（recursive）**需要调用函数自身，所以在使用递归时，可以使用闭包解决`Function` 构造函数不能使用函数对象本身的情况，如求斐波那契数列的第n位
    
    ```jsx
    const fibonacci = new Function(
      "n",
      `
      return (function fibonacci(n) {
        if(n == 1 || n == 2) {
          return 1;
        };
        return fibonacci(n-1) + fibonacci(n-2);
      })(n);
    `
    );
    
    console.log(fibonacci(30)); // 832040
    ```
    

### 1.4.4 构造函数与函数声明的不同

- `Function` 构造函数**不能**通过**创建上下文**（**creation contexts**）**创建闭包**（**create closures**），因为（通过`Function` 创建的）函数对象只能在**全局作用域**（**global scope**）下创建
- 当调用`Function` 构造函数创建的函数对象时，它们只能访问自己的**局部作用域**（**local scope**）和全局作用域的变量，而不能访问`Function` 构造函数所在作用域中的变量(即不能创建闭包)，如下
    
    ```jsx
    globalThis.x = "global x";
    
    function createFunc(type = "standard") {
      const x = "createFunc scope x";
      if (type == "constructor") {
        // 通过构造函数创建
        return new Function("return x;"); // 引用全局作用域中的x
      } else {
        return function () {
          return x;
        }; // 引用当前作用域中的x，是一个闭包
      }
    }
    
    console.log(createFunc()()); // createFunc scope x
    console.log(createFunc("constructor")()); // global x
    ```
    

## 1.5 例子

### 1.5.1 例子的运行问题

**运行环境**

- 如果想要在浏览器的控制台运行有关`Function()` 或`eval()` 这种包含动态编译内容的代码，大概率会报如下错误
    
    ![Untitled](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89/Untitled%201.png)
    
    - 大概意思就是拒绝将字符串评估（解析）为JavaScript代码，因此在以下内容安全策略（Content Security Policy）指令中，”unsafe-eval”不是一个允许运行的脚本源
- 这个和当前页面的内容安全策略有关

**问题分析**

1. **内容安全策略，CSP，Content Security Policy，**是一个额外的安全层，用于检测并削弱某些特定类型的攻击
    
    CSP的主要目标是减少**跨站脚本（Cross-Site Scripting XSS）**的攻击，XSS攻击利用了浏览器对于从服务器所获取的内容的信任，即使有些时候这些脚本并非来自于它本该来的地方，由于浏览器信任其内容来源，使得恶意脚本在受害者的浏览器中得以运行
    
2. 配置内容安全策略，有些网站为了抵挡XSS攻击，会配置内容安全策略
    
    一个策略由一系列策略指令所组成，每个策略指令都描述了一个**特定资源类型**以及**生效范围**（信任的来源）
    
    HTML中在`head`元素内中使用`<meta>` 元素来配置安全策略
    
    ```jsx
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
    ```
    
    - `http-equiv` 设置为`Content-Security-Policy` 表示此条`<meta>` 用于配置CSP
    - `content`属性的内容格式：多个资源类型用英文分号分隔，类型和来源、多个来源之间用空格分隔，来源加英文单引号
        
        ```jsx
        "srcTypeA 'src1' 'src2'...; srcTypeB 'src1' 'src2'...; ..."
        ```
        
3. 内容安全策略指令，上述的<**资源类型 ‘来源1’ ‘来源2’>** 就构成一条指令，表示此资源类型的如下来源是安全的，常见的资源类型有
    
    `default-src` ： 资源类型不确定时，默认使用`default-src` 的值作为生效范围
    
    **`script-src` ：** 表示资源类型为脚本文件时，安全来源为（可以如下添加）
    
    - `self` ：表示允许脚本来源于当前网站（域名）
    - `unsafe-inline` : 表示允许脚本来源于<script></script>标签
    - `unsafe-eval`: 表示允许脚本来源于字符串
    
    更多的资源类型可以查看**[MDN-Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives)**
    

**问题解决**

- `eval()`、`Function()` 等函数会从字符串中解析脚本代码，必须在内容安全策略中添加信任字符串来源的脚本的策略指令，该来源的脚本才可以正常运行
    
    ```jsx
    <html>
    <head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; **script-src self unsafe-eval**; child-src 'none';"/>
    </head>
    </html>
    ```
    
- 如果是开发谷歌插件，可以配置manifest.json里的content_security_policy属性，添加策略的规则相同
- 如果只是随便打开一个网页，F12进入控制台然后在输入JavaScript代码进行简单测试，使用eval()等方法有可能产生错误
    - 尝试修改网页上的`meta` 元素或添加自定义配置内容安全策略的`meta`  元素都是行不通的，如果这样可以那么就可以随意攻击别人的网站了
    - 解决方案是自己创建一个空白网页进行测试

### 1.5.2 通过在functionBody中进行函数声明和函数表达式创建函数对象

- `Function()` 构造函数的立即调用返回函数
    
    ```jsx
    const sumOfArr = new Function(`
      const sumArray = (arr) => arr.reduce((pre, cur) => pre + cur);
      return sumArray
    `)();
    console.log(sumOfArr([1, 2, -5, 8, 6, 2, 4, -3, -2])); // 13
    ```
    
    - 这个方法的特别之处在于，直接将`Function` 中的`functionBody` 参数作为字符串形式的语句直接调用执行，然后立刻返回`sumArray` 函数给`sumOfArr`变量， `new Function()` 只是作为产生目标函数的跳板，这个和如下使用`eval()` 的语句具有相同的作用
    
    ```jsx
    const sumOfArr2 = eval(`
      const sumArray = (arr) => arr.reduce((pre, cur) => pre + cur);
      sumArray
    `);
    console.log(sumOfArr2([1, 2, -5, 8, 6, 2, 4, -3, -2])); // 13
    ```
    
- `Function()` 构造函数不立即调用，目标函数不需要被立即创建，仅在需要的时候通过`call()` 仅创建后再调用
    
    ```jsx
    const largestNumOfArr = new Function(`
      function largestNumOfArr(arr) {
        return Math.max(...arr);
      }
      return largestNumOfArr;
    `);
    console.log(
      largestNumOfArr
        .call({})
        .call({}, [78, 25, 36, 87, 41, 25, 96, 34, 54, 24, 13, 39, 64])
    ); // 96
    ```
    
    - `largestNumOfArr` 保存的是`new Function()` 创建的中间函数，通过调用这个中间函数会或获得通过字符串形式定义的`largestNumOfArr` 函数，然后再调用它即可查找数组中最大值

# 2. 实例属性(**Instance properties**)

~~实际上是`Function` 引用类型上的**原型属性**~~

- 一个函数对象的**自有属性**从各个环境来看包括如下五个
    - `length`  必有
    - `name` 必有
    - `caller` 可能没有（箭头函数）
    - `arguments` 可能没有（箭头函数）
    - `prototype` 可能没有（箭头函数）
- 而下述描述的都是原型属性（参考MDN），因为**MDN**在解释`Function`**内置对象**时需要介绍实例的原型属性
    - `Function` 引用类型的`prototype` 属性本身就是一个函数对象，所以它具有[上述](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)的属性很正常
    - 由任何对象的[[Prototype]]都是由其对应的构造函数的`prototype` 继承而来可知，`Function` 引用类型本身就是一个函数对象，所以其[[Prototype]]来源于它自身的`prototype`属性,即`Function.prototype === Function.__proto__`
    - 还需要注意的是`caller` ， `arguments` 这些属性在`Function` `Function.prototype` `Function.__proto__` `function.__proto__` 这些函数对象上访问时会抛出异常【**毒丸访问器（poison pill accessor**）】，由此，这些函数对象也不能使用`new` 操作符进行调用，普通调用没有任何效果（返回`undefined`）
    - 普通函数对象的`prototype` 属性不是函数对象，而是一个普通对象，拥有`constructor` 属性引用函数本身，以及来源于`Object.prototype` 的[[Prototype]]属性
    - `Object` 本身是一个构造函数对象，所以其[[Prototype]]属性就是`Function.prototype`

[2. Function对象的属性](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89/2%20Function%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%B1%9E%E6%80%A7.md)

# 3. 实例方法（instance methods）

- 这里的实例方法就是定义在`Function.prototype` 上真正能在函数对象的原型（[[Prototype]]）上获取到的公共方法

## 3.1 `Function.prototype.apply()`

- 函数的`apply()` 方法使用**给定**（**given**）的`this` 值和**类数组对象**（**array-like object**）的`arguments` （参数）调用**指定**（**specified**）的函数

### 3.1.1 语法

```jsx
apply(thisArg);
apply(thisArg, argsArray);
```

- 参数
    - `thisArg` ：提供给被调用函数的`this` 值，可以使用`null`或者`undefined` ；如果方法不是严格模式，`null` 和`undefined` 会被全局对象替代（这一点在`this` 操作符中[函数上下文](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6.md)中介绍了），原始值也会被转换为对应的包装对象
    - `argsArray` ：可选参数，类数组对象，**指定**（**specifying**）被调用函数的参数
- 返回值，被指定`this` 和`arguments` 的被调用函数的执行的返回值

### 3.1.2 理解`apply()`

<aside>
💡 注意：此函数和`Function.prototype.call()` **几乎相同**（**is almost identical to**），除了在接受**参数列表**（**argument list**）时不同：`apply()` 接受**单个参数数组**（**single array of arguments**），而`call()` 接受离散的多个参数；例如，`func.apply(this, ["arg1", "arg2"])` 和`func.call(this, "arg1", "arg2")` 等价

</aside>

- 一般而言，`fn.apply(null, args)` 等价于`fn(…args)` ，就是使用扩展操作符的**收集参数**（**rest parameter**）写法
- 如果被调用的函数`this` 值是固定的，那么可以将其包装一下，使用最简单的调用方法进行调用如下
    
    ```jsx
    function wrapper() {
    	return fn.apply(null, arguments);
    }
    ```
    
    - 传递给`wrapper()` 函数的参数就是被调用函数`fn` 的参数
    - `arguments` 属于类数组对象
- `apply()` 最主要的作用仍然是指定函数执行时的`this` 值

### 3.1.3 例子

**扩展数组**

- `Array.prototype.push()` 方法能在数组尾部扩展（**append**）元素，同时`push()` 能接受多个离散的参数，一次性为数组添加多个元素
- 但是在需要将一个数组中的所有元素”push“入目标数组尾部时，就需要遍历源数组一个个调用`push()` ，这是因为直接将源数组作为`push()` 的参数会将这个数组仅作为一个元素“push”进目标数组尾部【实际上可以使用扩展（spread）操作符将源数组离散后传入`push()` 函数中，入`targetArr.push(…srcArr)`】
- 虽然`Array.prototype.concat()` 可以将两个数组合并，但是它不是在目标数组上操作，而是创建了一个新数组按顺序保存两个数组中的所有元素
- 使用`apply()` 可以**隐式地**（**implicitly**）将数组”展开（spread）“为一系列的参数传入
    
    ```jsx
    const arr = [1, 2];
    const eles = ["a", "b", "c"];
    
    arr.push.apply(arr, eles);
    console.log(arr); // [ 1, 2, 'a', 'b', 'c' ]
    ```
    
- 使用扩展操作符可以达成同样的效果
    
    ```jsx
    const arr2 = [1, 2];
    const eles2 = ["a", "b", "c"];
    
    arr2.push(...eles2);
    console.log(arr2); // [ 1, 2, 'a', 'b', 'c' ]
    ```
    

**对内置函数使用apply**

- 有些内置函数接受任意多个参数，聪明地应用`apply()` 方法在处理一些任务时会很有用，否则需要通过遍历数组值（参数集合）来实现任务
- 例如，`Math.max()/Math.min()` 返回给定参数中的最大值或最小值，如果不使用`apply()` ，找出数组中的最大值或最小值就需要遍历一遍数组；而是要`apply()` 就可以直接将数组作为`apply()` 的参数隐式的将数组展开为一系列参数传入`Math.max()`和`Math.min()` 中，快速获取最大值或最小值
    
    ```jsx
    const nums = [
      2, 8, 5, 4, 2, 3, 6, 9, 7, 4, 5, 21, 23, 41, 21, 23, 53, 24, 63, 21, 2, 0, 7,
      -2, -6, 9, 5, 4, 42,
    ];
    // 不使用apply
    let max = -Infinity;
    let min = Infinity;
    for (const num of nums) {
      max = Math.max(max, num);
      min = Math.min(min, num);
    }
    console.log(max, min); // 63 -6
    // 使用apply
    max = -Infinity;
    min = Infinity;
    
    max = Math.max.apply(null, nums);
    min = Math.min.apply(null, nums);
    console.log(max, min); // 63 -6
    ```
    
- 但是需要注意的是，以这种方式使用`apply()` ，就会有超过（**exceeding**）JavaScript引擎**参数长度限制**（**argument length limit**）的风险。不同引擎的参数长度限制大小不同，但是有一个阈值表示最大的参数个数（JavaScriptCore引擎的硬编码（hard-coded）[参数限制为65536](https://bugs.webkit.org/show_bug.cgi?id=80797)）
    
    ```jsx
    const nums2 = new Array(100000)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10000000));
    console.log(Math.min.apply(null, nums2)); // 27   具有随机性
    console.log(Math.max.apply(null, nums2)); // 9999903 具有随机性
    ```
    
    - 上述的代码现代浏览器和node环境下都不会报错
    - 因为现代设备性能提升，JavaScript引擎的参数长度限制已被提升到125568（不包括125568），其二进制为'11110101010000000’（2022.10.17测试）
    - 超出参数长度限制会抛出`RangeError: Maximum call stack size exceeded` 异常（范围错误）
- 这种参数长度限制是任何**过分大堆栈**（**excessively-large-stack**）行为的**本质**（**nature**）；如果你的数组长度可能是成千上万的，使用**混合策略**（**hybrid strategy**），将数组进行分**块**（**chunks**），块作为`apply()` 的参数调用函数解决每个块的问题，然后将块的结果再应用函数以解决整个问题，如下
    
    ```jsx
    const nums3 = new Array(1000000)
      .fill(0)
      .map(() => Math.floor(Math.random() * 1000000000));
    
    function minOfArray(arr) {
      let min = Infinity;
      // 量子块
      const QUANTUM = 32768;
      for (let i = 0; i < arr.length; i += QUANTUM) {
        // 每次计算QUANTUM大小的参数，最后一个块可能长度不够，所以需要取小值
        const subMin = Math.min.apply(
          null,
          arr.slice(i, Math.min(i + QUANTUM, arr.length))
        );
        min = Math.min(subMin, min);
      }
      return min;
    }
    console.log(minOfArray(nums3)); // 197 具有随机性
    ```
    

## 3.2 **`Function.prototype.call()`**

- 函数的`call()` 方法使用**给定**（**given**）的`this` 值和**离散**的`arguments` （参数）调用**指定**（**specified**）的函数

### 3.2.1 语法

```jsx
call()
call(thisArg)
call(thisArg, arg1, /*...*/, argN)
```

- 参数：
    - `thisArg` ： 被调用函数的`func` 执行时使用的`this` 值；如果函数不在严格模式下，`this` 值指定为`null` 或`undefined` 会被替换为全局对象，原始值也会被转换为对应的包装对象
    - `arg1, /*...*/, argN` ： 可选参数，被调用函数的参数
- 返回值：被调用函数在给定`this`和给定参数执行后的返回值

### 3.2.2 理解call()

- `call()` 的使用场景与`apply()` 不太同（`call()` 不适用扩展数组和过大参数个数调用），使用`call()` 可以编写一次方法，然后在一个新对象中继承（**inherit**）它，而不必为新对象重写方法，因为`call()` 函数允许为属于一个对象的函数/方法被另外一个对象调用（指定`this`）

### 3.2.3 例子

- 下述例子`call()`和`apply()` 通用

**盗用构造函数**

- 在实现构造函数的继承时，可以在子类构造函数中通过`call()`调用父类以继承父类的实例属性
    
    ```jsx
    function Product(name, price) {
      this.name = name;
      this.price = price;
    }
    
    function Food(name, price) {
      Product.call(this, name, price);
      this.category = "food";
    }
    const food = new Food("辣条", "五毛");
    console.log(food); // Food { name: '辣条', price: '五毛', category: 'food' }
    ```
    

## 3.3 `Function.prototype.bind()`

- `bind()` 方法能创建出一个函数对象，这个函数对象被调用时，使用`bind()` 方法的第一个参数作为的`this` 值，而其余参数将作为新函数的参数

### 3.3.1 语法

```jsx
bind(thisArg)
bind(thisArg, arg1);
bind(thisArg, arg1, arg2);
bind(thisArg, arg1, arg2, /*..., */ argN);
```

- 参数
    - `thisArg` : 创建的新函数对象绑定的`this` ，如果函数不是在严格模式下执行，传递`null`和`undefined` 会被替换为全局对象，原始值会被转换为包装类型；[如果使用`new` 操作符调用绑定函数，这个`this` 会被忽略](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)
    - `arg1, arg2, /*..., */ argN` :可选参数，当绑定函数被调用时，预留给绑定函数的参数（**arguments**）
- 返回值：绑定了`this`和初始化参数的**绑定函数**（**bound function**）

### 3.3.2 理解`bind()`

- `bind()` 创建的函数对象叫做**绑定函数**（**bound function**），而调用`bind()` 生成绑定函数的函数叫做**目标函数**（**target function**）；绑定函数本质上包装了目标函数，在调用绑定函数时实际上是在调用它**包装**（**wrap**）的目标函数
- 绑定函数没有`prototype` ，`caller`， `arguments` 属性，它存储（store）着传递给`bind()` 的参数，包括`this` 和前几个`arguments` （first few arguments） 作为**内部状态**（**internal state**）；这些值提前存储而不是在调用时传递，它的逻辑相当于一个箭头函数，函数体中通过`call()`或`apply()` 调用目标函数，如下
    
    ```jsx
    const boundFn = fn.bind(thisArg, arg1, arg2)
    // 逻辑上等价于
    const boundFn = (...restArgs) => {
    	fn.call(thisArg, arg1, arg2, ...restArgs)
    }
    ```
    

---

- 绑定函数可以通过`boundFunc.bind(thisArg, /* more args */)`**被进一步绑定**（**be further bound**）,从而创建另外一个绑定函数`boundFunc2` 。基于绑定函数的新的绑定函数使用的`this` 仍然是原始绑定函数的`this` （忽略传递的`thisArg`），因为`boundFunc2` 的目标函数`boundFunc` 已经绑定了`this` 。当调用`boundFunc2` 时，相当于调用`boundFunc` ，也就相当于调用`fn` (`boundFunc` 的目标函数)。`fn` **最终**（**ultimately**）接受到的参数，按顺序是：`boundFunc` 绑定的参数，`boundFunc2` 绑定的参数，`boundFunc2` 接受到的参数
    
    ```jsx
    // 进一步绑定
    function fn() {
      console.log(this, ...arguments);
    }
    
    const boundFnc1 = fn.bind("this value", 2, 8);
    const boundFnc2 = boundFnc1.bind("new this value", 4, 1);
    boundFnc2.call("another this value", 3, 7); // [String: 'this value'] 2 8 4 1 3 7
    ```
    

---

- 如果绑定函数的目标函数是**可构造的**（**constructable**），那么绑定函数也可以使用`new` 操作符进行调用（即使没有`prototype` 属性），这和使用目标函数构造一样（新实例的原型使用的也是目标函数的`prototype`）
- 同理，在使用`new` 操作符调用时，也会传入预先保存的参数（arguments），但是`this` 就会被忽略（因为构造器会准备它自己的`this` ，就像**[Reflect.construct()](../9%20%E4%BB%A3%E7%90%86%E5%92%8C%E5%8F%8D%E5%B0%84(Proxy%20and%20Reflect)/1%20%E4%BB%A3%E7%90%86%E5%9F%BA%E7%A1%80/Reflect.md)** 的参数）
- 使用绑定函数直接进行构造，那么`new.target` 就是目标函数本身（而不是绑定函数），也就是说，绑定函数对`new.target` 操作符而言是**透明的**(**transparent**)
    
    ```jsx
    // 使用绑定函数作为构造函数
    function Base() {
      console.log(...arguments);
      console.log(new.target === Base);
      console.log(arguments.callee);
    }
    
    const BoundBase = Base.bind(null, 1, 2);
    new BoundBase(3, 4); 
    // 打印结果
    1 2 3 4
    true
    [Function: Base]
    ```
    
- 虽然绑定函数可以作为构造函数使用，但因为它没有`prototype` 属性，所以它不能被用作`extends` 指定的基类
    
    <aside>
    🚫 try {
      class Derived extends BoundBase {}
    } catch (error) {
      console.log(error.toString()); 
    	// TypeError: Class extends value does not have valid prototype property undefined
    }
    
    </aside>
    

---

- 当绑定函数作为`instanceof` 操作符的右侧操作数时，相当于使用绑定函数的目标函数作为右侧操作数（即绑定函数内部存储的就是目标函数）；`instanceof` 读取`prototype` 属性时就会使用目标函数的`prototype`
    
    ```jsx
    class A {}
    const B = A.bind(null, 1, 2);
    const C = B.bind(null, 3, 4);
    const a = new A();
    const b = new B();
    console.log(a instanceof B); // true
    console.log(a instanceof C); // true
    console.log(b instanceof A); // true
    console.log(b instanceof C); // true
    ```
    
    - 本质上，a和b就是A的实例，而`instanceof`操作符右侧的操作数的绑定函数会被看作最终的目标函数

---

- 绑定函数的自有属性只有`length`和`name`
    - `length` : 目标函数的`length` 减去绑定的参数个数（不包含`thisArg`）,最小值为0
    - `name` ： 目标函数的`name` 加上”bound ”**前缀**（**prefix**）
- 而它的[[Prototype]]属性继承自目标函数的[[Prototype]]，所以绑定函数没有目标函数的自有属性（例如构造函数的静态属性），但是可以有目标函数原型上的属性
    
    ```jsx
    // 绑定函数的属性
    class D {
      constructor(a, b, c, d) {}
      static {
        this.x = 1;
        this.y = 2;
      }
    }
    class E extends D {}
    const BoundD = D.bind(null, 2);
    const BoundE = E.bind(null, 2);
    console.log(BoundE.__proto__ === E.__proto__); // true
    console.log(BoundE.__proto__ === D); // true
    console.log(BoundD.__proto__ === Function.prototype); // true
    console.log(D.length); // 4
    console.log(BoundD.length); // 3
    console.log(BoundD.x); // undefined
    console.log(BoundE.x); // 1
    ```
    
    - E继承于D，所以E的[[Prototype]]就是D
    - 而BoundE的[[Prototype]]继承于E，所以BoundE可以通过原型访问到D的x属性

### 3.3.3 例子

**偏函数（[Partially applied functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#partially_applied_functions)）**

- 偏函数本质上就是预存了初始参数的绑定函数
- 预设的参数作为`bind()` 的参数写在`this` 后面，当绑定函数调用时，这些参数会被插入到目标函数的参数列表的开始位置，传递给绑定函数的参数会跟在它们后面
    
    ```jsx
    function list(...args) {
      return args;
    }
    console.log(list(1, 2, 3)); // [1, 2, 3]
    const leading37List = list.bind(null, 37);
    console.log(leading37List(1, 2, 3)); // [37,1,2,3]
    ```
    

**配合`setTimeout`**

- `setTimeout` 函数的第一个参数是回调函数，它在一段时间后被调用，但是回调函数的`this` 关键字会指向全局对象
- 当一个类或构造函数中使用`setTimeout` 时，需要回调函数的`this` 保证为实例，这个时候就可以使用`bind()` 构造一个包装回调函数并指定`this` 的值(使用箭头函数也可以解决)
    
    ```jsx
    function LateBloomer() {
      this.petalCount = Math.ceil(Math.random() * 12) + 1;
    }
    LateBloomer.prototype.bloom = function () {
      // 1秒后执行decalre
      setTimeout(this.declare.bind(this), 1000);
    };
    LateBloomer.prototype.declare = function () {
      console.log(`我是有${this.petalCount}朵花瓣的鲜花`);
    };
    const flower = new LateBloomer();
    flower.bloom(); // 我是有10朵花瓣的鲜花  (数量具有随机性)
    ```
    
    - 如果`setTimeout(this.declare.bind(this), 1000);` 不使用绑定函数绑定当前上下文`this` ，后续回调执行会使用全局对象导致`this.petalCount` 属性为`undefined` 而打印出”我是有undefined朵花瓣的鲜花“

**使用绑定函数作为构造函数的优劣**

- 绑定函数可以作为构造函数使用，使用`new` 调用绑定函数创建的实例相当于使用`new` 调用目标函数
- 使用绑定函数的优劣是
    - 好处：可以预留参数，使得绑定函数可以方便创建的特殊实例；并且`new` ，`new.target` ，`instanceof` ,`this` 等操作符都能按照预期使用
    - 坏处：不能使用`extends` 继承绑定函数
    
    ```jsx
    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    }
    Point.prototype.toString = function () {
      return `${this.x},${this.y}`;
    };
    
    const YAxisPoint = Point.bind(null, 0);
    const p = new Point(2, 5);
    const p2 = new YAxisPoint(3);
    console.log(p.toString()); // 2,5
    console.log(p2.toString()); // 0,3
    ```
    
    - YAxisPoint 绑定函数只能创建在Y轴上的点（方便创建特殊实例）

**快捷调用（[Transforming methods to utility functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#transforming_methods_to_utility_functions)）**

- `bind()` 方法可以很好的将需要指定`this` 的对象方法转换为一个**普通的实用函数**（**plain utility function**）
- 一般而言，可以使用一个变量保存对象的方法，这个变量需要指定`this` 进行调用，因此需要通过`call()`或`apply()` 间接调用，例如`[Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)` 方法可以指定类数组对象为`this` 从而创建对应的数组形式，如下
    
    ```jsx
    const slice = Array.prototype.slice;
    const arrLikeObj = {
      1: 0,
      2: 5,
      0: 2,
      3: 7,
      length: 4,
    };
    console.log(slice.apply(arrLikeObj)); // [ 2, 0, 5, 7 ]
    ```
    
    - 这里相当于`arrLikeObj` 调用`slice()` 获得了对应的数组
- 每次调用都需要使用`apply()` 或`call()` 间接调用，既然每次都是通过调用`slice` 的`apply()` 方法（即`apply()` 方法的`this` 值一直是`slice`函数对象），所以可以为`apply()` 创建一个绑定了`slice` 的绑定函数，这样就可以只传递`this` 值（类数组对象）就能获取对应的数组了，如下
    
    ```jsx
    **const slice2 = Function.prototype.apply.bind(Array.prototype.slice);**
    console.log(slice2(arrLikeObj)); // [ 2, 0, 5, 7 ]
    ```
    
    - **`Function.prototype.apply.bind(Array.prototype.slice);`** 创建了一个`apply()` 的绑定函数，执行这个绑定函数相当于执行给定了`this` 值的`apply()` 函数，而`apply()` 函数本身的功能就是执行`this` 函数对象（调用apply函数的函数对象，而不是传递给`this` 函数对象的`thisArg`），所以就相当于执行`this` 函数对象（即**`Array.prototype.slice`**）；而传递给绑定函数的第一个参数，就是调用目标函时传递给`apply()` 函数的第一个参数，这个参数就是`thisArg` ，即执行**`Array.prototype.slice`** 时指定的`thisArg`

## 3.4 `Function.prototype.toString()`

- 返回表示函数对象源代码的字符串，每个引擎的返回值可能有所区别

### 3.4.1 语法

```jsx
toString()
```

- 返回值：表示（**representing**）函数对象的**源代码**（**source code**）的字符串

### 3.4.2 理解`toString()`

- `Function` 在原型（prototype）上**重写**（**overrides**）了继承自`Object` 原型（`prototype` ）上的`toString()` 方法，对于开发者定义的函数而言，调用函数对象的`toString()` 方法会返回定义函数时在函数体中编写的**源文本段**（**source text segment**）
- 当函数对象期望作为一个文本值时，会自动（automatically）调用`toString()` 进行转换，例如使用加法操作符连接函数对象和字符串时
- 利用`apply()` 或`call()` 等方法 在**不兼容**（**incompatible**）的对象上调用函数的`toString()` 方法会抛出`TypeError`异常（即`toString()`方法的`this` 必须是一个函数对象）
    
    <aside>
    🚫 Function.prototype.toString.call("foo"); // TypeError: Function.prototype.toString requires that 'this' be a Function
    
    </aside>
    

---

- 调用内置函数对象、绑定函数、非JavaScript函数对象的`toString()` 的方法，`toString()` 会返回**原生函数代码字符串（*native function string*****），**如下
    
    ```jsx
    "function someName() { [native code] }"
    ```
    
    ```jsx
    console.log(Math.pow.toString()); // function pow() { [native code] }
    console.log(Array.prototype.slice.toString()); // function slice() { [native code] }
    ```
    
    ```jsx
    function func() {
      return false;
    }
    const boundFunc = func.bind(null, 1);
    console.log(boundFunc.toString()); // function () { [native code] }
    ```
    
    - 所有绑定函数调用`toString()` 都没有`someName`

---

- 对于**内部**（**intrinsic**）对象方法和函数，`someName` 是函数的初始名称；否则就是**实现定义**（**implementation-defined**）的名称，但是始终以属性名称语法呈现，如`[1+1]` 、1
    
    ```jsx
    // 内部(intrinsic)对象
    const obj = {
      [1 + 2]() {
        return false;
      },
      [Symbol.hasInstance]: function Name() {
        return false;
      },
    };
    console.log(obj[3].toString()); //
    [1 + 2]() {
        return false;
      }
    console.log(obj[Symbol.hasInstance].toString());
    function Name() {
        return false;
      }
    ```
    
    - 注意打印出来的字符串**缩进**和**换行**是完全按照编写代码时的缩减和换行确定的
    - 打印出来的函数对象的名称也按照定义方法的模式

<aside>
💡 注意：这意味着对原生函数的字符串调用`eval()` 将始终产生语法错误（即将内部对象方法和函数的`toString()` 结果作为`eval()` 的参数进行函数声明编码，会因为语法错误抛出异常）

</aside>

---

- 使用`Function` 构造函数创建的函数对象调用`toString()` 会返回创建后的函数源码，包含形参和函数体，函数名称为“anonymous”（匿名）
    
    ```jsx
    // 构造函数创建的函数对象
    const sum = new Function("num1", "num2", "return num1 + num2");
    console.log(sum.toString());
    // 打印结果
    function anonymous(num1,num2
    ) {
    return num1 + num2
    }
    ```
    
- 关于`Function`构造函数创建的函数对象，可以查看上面的[动态编译](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)

---

- 从ES2018开始规范要求`toString()` 的返回值与声明的**源代码完全相同**（**exact same source code**），包括任何的空格，换行和**注释**（**comments**）；如果因为某种原因主机（**host**）没有源代码，则要求返回一个**原生函数代码字符串（*native function string*****）**
- 关于这一行为(**Implements `Function.prototype.toString` revision, toString实现修订**)支持的情况可以查看MDN上的[浏览器兼容性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString#browser_compatibility) （2022/10/19显示Node，Deno和Safari不支持这一行为）

### 3.4.3 例子

通过**模板字符串**（**template literal**）获取函数对象的**源文本**（**source text**），使用`${}` 语法会把函数对象强制转换为对应的字符串

```jsx
function foo() {
  /* 我是注释 */
  return "bar";
}
console.log(`${foo}`);
// 打印结果
`function foo() {
  /* 我是注释 */
  return "bar";
}`
```

实际源代码与`toString()` 结果

- 在`Function.prototype.toString()` 行为变更（ES2018的**Implements `Function.prototype.toString` revision**）后，在调用`toString()` 时，该方法的实现不允许在函数对象不是**原生函数**（**native function**）时**合成**（**synthesize**）函数的源码（意思就是说原生函数可以使用**原生函数代码字符串**合成函数源码返回，而自定义的函数必须返回定义时确切的源代码）
- 方法始终返回创建函数时使用的**确切的源代码（exact source code），**适用于setter个getter，而`Function`构造函数本身具有合成函数源代码的能力
    
    ```jsx
    // 实际源代码与toString()结果
    function test(fn) {
      console.log(fn.toString());
    }
    
    test(function f() {}); // function f() {}
    test(function* g() {}); // function* g() {}
    test(class A {}); // class A {}
    
    test((a, ...args) => console.log(a, args)); // (a, ...args) => console.log(a, args)
    
    test({ [0]() {} }[0]); // [0]() {}
    test({ [0]: function () {} }[0]); // function () {}
    
    test(Object.getOwnPropertyDescriptor({ get a() {} }, "a").get); // get a() {}
    test(
      Object.getOwnPropertyDescriptor(
        {
          /**
           * @param {any} _val
           */
          set a(_val) {},
        },
        "a"
      ).set
    ); // set a(_val) {}
    
    test(Function.prototype.toString); // function toString() { [native code] }
    
    test(function f() {}.bind(null)); // function () { [native code] }
    
    test(Function("a", "b"));
    
    // function anonymous(a
    // ) {
    // b
    // }
    ```