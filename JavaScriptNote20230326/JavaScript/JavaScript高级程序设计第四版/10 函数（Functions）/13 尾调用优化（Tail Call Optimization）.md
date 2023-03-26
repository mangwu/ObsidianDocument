# 13. 尾调用优化（Tail Call Optimization）

# 13.1 尾调用优化

## 13.1.1 尾调用(tail call)

- **尾调用**（**tail call**）指在一个函数中，其**返回值为调用另外一个函数的返回值**，即外部函数（**outer function**）的返回值是一个内部函数（**inner function**）的返回值
- 例如
    
    ```jsx
    function innerFunction() {
      return "尾调用";
    }
    
    // 尾调用
    function outerFunction() {
      return innerFunction(); // 尾调用
    }
    ```
    

## 13.1.2 内存管理优化机制

- ES6新增了一项**内存管理优化机制**（**memory management optimization**），让JavaScript引擎在满足条件时可以**重用栈帧**（**reuse stack frames**）
- 这项优化非常适合尾调用

---

- 在ES6优化之前（不使用内存管理优化机制），尾调用（以上面的尾调用例子举例）会在内存中发生如下操作
    1. **执行到**(**execution reach**)`outerFunction` 函数体，第一个**栈帧**(**stack frame**)被**推到**（**push onto**）栈上
    2. **执行**（**execute**）`outerFunction` 函数体，**到**(**reach**)`return`语句，**计算**（**evaluate**）返回值必须先计算`innerFunction()` 
    3. **执行到**(**execution reach**)`innerFunction` 函数体，第二个**栈帧**(**stack frame**)被**推到**（**push onto**）栈上
    4. **执行**（**execute**）`innerFunction` 函数体，**计算**（**evaluate**）其返回值
    5. 将返回值**传回**(**pass back**)`outerFunction` ,然后
    6. 将**栈帧**（**stack frames**）**弹出**（**poped off**）栈（注意这里栈帧是复数）
- 在ES6优化之后（使用内存管理优化机制），尾调用（以上面的尾调用例子举例）会在内存中发生如下操作
    1. **执行到**(**execution reach**)`outerFunction` 函数体，第一个**栈帧**(**stack frame**)被**推到**（**push onto**）栈上
    2. **执行**（**execute**）`outerFunction` 函数体，**到**(**reach**)`return`语句，**计算**（**evaluate**）返回值必须先计算`innerFunction()` 
    3. 引擎发现能把第一个**栈帧**（**stack frame**）**安全**（**safely**）**弹出**（**pop off**）栈，因为`innerFunction`
    4. **弹出**（**pop off**）`outerFunction` 的**帧栈**（**stack frame**）
    5. **执行到**(**execution reach**)`innerFunction` 函数体，**栈帧**(**stack frame**)被**推到**（**push onto**）栈上
    6. **执行**（**execute**）`innerFunction` 函数体，**计算**（**evaluate**）其返回值
    7. **弹出**（**pop off**）`innerFunction` 的**帧栈**（**stack frame**）

---

- 很明显，第一种情况下每多调用一次**嵌套函数**（**nested function**），就会多增加一个帧栈的成本
- 而第二种情况下无论调用多少次嵌套函数，整个**执行周期**（**length of execution**）都只占用一个帧栈的成本
- 这就是ES6尾调用优化的关键：如果以一种方式被构造的函数（function is structured in a way）允许**基于尾调用**（**upon the tail call**）被**安全的销毁**（**safely discarded**），则引擎就会这么做
    - 这句话的意思就是内存管理优化后，如果遇到尾调用，可以**提前将外部函数的栈帧出栈**（相当于销毁），直接调用内部函数

<aside>
💡 **注意**：现在没有办法测试尾调用优化是否**有作用**（**occurring**）。不过，因为这是ES6规范所规定，**兼容的**（**compliant**）浏览器实现都能保证在代码满足条件（**requirements**）的情况下应用这个优化

理论上，假设有n个嵌套的尾调用，那么不使用优化的情况下，空间复杂度主要是栈的长度，即O(n)，使用优化的情况下，因为整个执行周期只占用一个栈帧成本，所以空间复杂度只有O(1)

</aside>

# 13.2 尾调用优化的条件（Tail Call Optimization Requirements）

- 明确几个概念
    - **外部函数（outer function）**，返回值为调用另外一个函数的返回值的函数
    - **尾调用函数（tail call function），**就是尾调用中的内部函数，是外部函数体的返回语句中被调用的函数
    - **外部栈帧**（**outer stack frame**），执行到外部函数推到栈上的栈帧
- 尾调用优化的条件就是确定**外部栈帧**（**outer stack frame**）真的没有必要存在了，每必要存在的条件如下
    - [ ]  代码在严格模式下执行
    - [ ]  外部函数的返回值是对**尾调用函数**（**tail call function**）的调用
    - [ ]  尾调用函数返回后没有**额外执行命令**（**no further execution**）
    - [ ]  尾调用函数不是**引用**（**refer to**）**外部函数的作用域**（**outer function’s scope**）中自有变量的**闭包**（**closure**）
    
    <aside>
    💡 注意：之所以要求严格模式，主要因为在非严格模式下函数调用允许使用`f.arguments` 和`f.caller` ，而它们都会引用外部函数的栈帧，而它们都会引用外部函数的栈帧（`f.caller` 引用的就是外部函数，而`f.arguments` 的属性`f.arguments.callee.caller` 会间接引用外部函数）；显然，这意味着不能应用优化了（不能提前销毁外部函数的栈帧），因此尾调用优化必须要求在严格模式下有效，防止引用这些属性
    
    </aside>
    
- 一些违反上述条件的例子
    
    ```jsx
    // 在外部函数中调用的内部函数
    function innerFunction() {
      "use strict";
      return 4396;
    }
    
    // 以下是不不满足条件的例子
    function outerFunction() {
      // 无尾调用优化：不是严格模式
      return innerFunction();
    }
    
    function outerFunction() {
      // 无尾调用优化：尾调用没有返回
      "use strict";
      innerFunction();
    }
    
    function outerFunction() {
      // 无尾调用优化：尾调用没有直接返回
      "use strict";
      const res = innerFunction();
      return res;
    }
    
    function outerFunction() {
      // 无尾调用优化：尾调用函数返回后不需要执行额外的逻辑
      "use strict";
      return innerFunction().toString();
    }
    
    function outerFunction() {
      // 无尾调用优化：尾调用函数返不能引用外部函数作用域中的闭包
      "use strict";
      let foo = "bar";
      function innerFunction() {
        return foo;
      }
      return innerFunction();
    }
    ```
    
- 一些符合条件的例子
    
    ```jsx
    // 符合条尾调用优化条件的例子
    function outerFunction(a, b) {
      // 有尾调用优化：帧栈销毁前执行参数计算
      "use strict";
      return innerFunction(a + b);
    }
    
    function outerFunction(a, b) {
      // 有尾调用优化：初始返回值不涉及栈帧
      "use strict";
      if (a < b) {
        return a;
      }
      return innerFunction(a + b);
    }
    
    function outerFunction(a, b) {
      // 有尾调用优化：两个尾调用函数都在尾部且没有额外的逻辑执行
      "use strict";
      return a > b ? innerFunction(a) : innerFunction(b); // 这两个尾调用函数可以不是同一个函数对象
    }
    ```
    
    - 这三个符合条件的尾调用例子中，最后一个属于**差异化尾调用**（**differentiating tail calls**），即根据条件不同，尾调用的函数参数不同或尾调用函数不同

---

- 实际上，**递归调用（recursive cal）在符合条件的情况下也属于尾调用**，差异化尾调用和递归调用是容易让人感到**困惑的**（**confusion**）；但需要注意到的是：无论是递归调用还是非递归调用，在满足尾调用条件的情况下，都可以应用优化，引擎并不区分尾调用中调用的函数是函数自身还是其它函数
- 递归场景下，尾调用优化的效果是最**明显**的，因为一般函数尾调用嵌套不了多少层，而递归代码最容易在栈内存中迅速产生大量栈帧；但是大多数递归函数并不是简单的调用函数本身然后返回，更复杂的会多次递归调用本身，所以下一节会介绍将不符合条件的递归函数转换为可以进行尾调用优化的递归函数

# 13.3 尾调用优化的代码（Coding for Tail Call Optimization）

- 可以通过把简单的递归函数转换成待优化的代码以加深对尾调用优化的理解
- 斐波那契数列可以用一个典型的递归函数实现：
    
    ```jsx
    "use strict";
    // 0 1 1 2 3 5 ...
    function fibonacci(n) {
      if (n < 2) {
        return n;
      }
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    ```
    
- 显然整个函数不符合尾调用优化的条件，因为返回语句中有相加的操作（需要执行额外的逻辑）
- 又因为在一次函数调用中需要递归调用两次`fibonacci()` 函数，所以`fibonacci(n)` 需要的栈帧数内存空间复杂度为
    
    $O(n) = \begin{cases} O(1), & \text{if n < 2} \\ O(2^{n-1} + 1) & \text{if n ≥ 2} \end{cases}$.
    
    - 因此指数级的空间复杂度导致即使`n` 只有40这么大都会使得浏览器或node需要耗费较长的时间进行运算，如下
    
    ```jsx
    // node环境
    const date = new Date();
    console.log(fibonacci(40)); // 102334155
    console.log(Date.now() - date); // 1070   (以毫秒为单位，平均为1000ms，因设备不同而异)
    ```
    
- 解决栈帧数空间复杂度的问题有不同的**策略**（**techniques**），例如记忆化或把递归写成迭代循环形式
    
    **记忆化方法**，使用`Map` 映射保存已经计算过的斐波纳契数列，避免重复运算
    
    ```jsx
    const hash = new Map([
      [1, 1],
      [0, 0],
    ]);
    const fib = (n) => {
      if (n < 2) {
        return n;
      }
      if (hash.has(n)) {
        return hash.get(n);
      }
      let pre1 = -1;
      let pre2 = -1;
      if (hash.has(n - 1)) {
        pre1 = hash.get(n - 1);
      }
      if (hash.has(n - 2)) {
        pre2 = hash.get(n - 2);
      }
    
      if (pre1 == -1) {
        pre1 = fib(n - 1);
      }
      if (pre2 == -1) {
        pre2 = fib(n - 2);
      }
      hash.set(n, pre1 + pre2);
      return pre1 + pre2;
    };
    date = new Date();
    console.log(fib(40)); // 102334155
    console.log(Date.now() - date); // 1 (以毫秒为单位，有时也会是0)
    ```
    
    把递归写成迭代循环形式
    
    ```jsx
    const fib2 = (n) => {
      if (n < 2) {
        return n;
      }
      let a = 1;
      let b = 1;
      let temp;
      for (let i = 2; i < n; i++) {
        temp = b;
        b = b + a;
        a = temp;
      }
      return b;
    };
    date = new Date();
    console.log(fib2(40)); // 102334155
    console.log(Date.now() - date); // 0 （以毫秒为单位，有时也会是1）
    ```
    
- 如果想要保持递归实现，为了让引擎启用尾调用优化，可以重构成满足优化条件的形式
    
    使用两个嵌套的函数，外部函数作为基础框架，内部函数执行递归
    
    ```jsx
    // 基础框架
    function fibouter(n) {
      return fibImpl(0, 1, n);
    }
    // 执行递归
    function fibImpl(a, b, n) {
      if (n == 0) {
        return a;
      }
      return fibImpl(b, a + b, n - 1);
    }
    date = new Date();
    console.log(fibouter(40)); // 102334155
    console.log(Date.now() - date); // 1 (以毫秒为单位，有时也会是0)
    ```
    
    - `fibImpl` 实际上将`n`作为递归深度，`a` ，`b` 是斐波那契数列的两个初始值，只要不断执行`nextA = b , nextB = a + b` 就能保证一步步得到第`n`个斐波那契数
    - `fibouter` 基础框架是为了保证实现斐波那契数列的函数签名特性：即给一个下标就能获取第n个斐波那契数