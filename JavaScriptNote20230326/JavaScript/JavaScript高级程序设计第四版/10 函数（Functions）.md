# 10. 函数（Functions）

本章内容

- [ ]  函数表达式（Function expression）、函数声明（function declaration）及箭头函数（arrow functions）
- [ ]  默认参数，**扩展操作符**（**spread operators**）
- [ ]  使用函数实现**递归**（**Recursion** with functions）
- [ ]  使用**闭包**实现私有变量（Private variables using **closures**）

**实例化函数对象**

- 函数是ECMAScript中最有意思的一部分因为**函数实际上是对象**（JavaScript中一切皆对象），**每个函数都是`Function`类型的实例，**而**`Function`**和其它引用类型一样也有属性和方法
    - 函数是对象，所以函数名（function names）就是指向函数对象的指针（pointers）
    - 函数名不一定与函数本身紧密绑定，因为它们作为保存指针的变量可以被赋值为其它值
- 有四种创建函数对象的方式：
    - 函数声明语法（func-declaration syntax）
        
        ```jsx
        function sum(num1, num2) {
          return num1 + num2;
        }
        ```
        
        - 在函数声明语法中，变量**`sum`**被定义并初始化为一个函数
        - 注意函数声明语法后没有**分号（semicolon）**
    - 另一种几乎与函数声明语法等价的语法是函数表达式（function expression）语法
        
        ```jsx
        let sum = function (num1, num2) {
          return num1 + num2;
        };
        ```
        
        - 函数表达式定义了一个变量**`sum`**并将其初始化为一个函数
        - 注意function关键字后面没有名称，因为不是必要的（函数被引用到了变量`sum`）
        - 注意函数表达式语法末尾有**分号**（**semicolon**），就和任何变量初始化语句一样
    - 还有一种和函数表达式很像的定义函数的方式：箭头函数（arrow function）,因为使用箭头（`=>`）所以得名
        
        ```jsx
        let sum = (num1, num2) => {
          return num1 + num2;
        };
        ```
        
    - 最后一种定义函数的方式是使用`Function`构造函数（constructor），这个构造函数接受任意多个字符串参数，最后一个参数始终被当作函数体（function body），而之前的参数按顺序**枚举**（**enumerate**）为新函数的参数
        
        ```jsx
        let sum = new Function("num1", "num2", "return num1 + num2");
        ```
        
        - 注意这种构造方式需要将函数体写成字符串形式，并**不推荐**（**not recommended**）
        - 并且由于字符串形式的原因，会导致这段代码被**解释**（**interpretation**）两次（会影响性能）
            - 第一次被当作常规的ECMAScript代码
            - 第二次解释传给构造函数的字符串
        - 但是这种语法能更好理解：**函数是对象，函数名是指针**
    
    <aside>
    💡 **注意：**这几种实例化函数对象的方式之间存在**微妙（subtle）**但是重要的差别，不能一概而论，但是其中任何一种方式都能创建函数对象
    
    </aside>
    
- 关于**`Function`** 引用类型，参考[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)的介绍：
    
    [函数（Function）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)
    

# 1. 箭头函数

[1. 箭头函数（Arrow Functions）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/1%20%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0%EF%BC%88Arrow%20Functions%EF%BC%89.md)

# 2. 函数名

[2. 函数名（Function Names）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/2%20%E5%87%BD%E6%95%B0%E5%90%8D%EF%BC%88Function%20Names%EF%BC%89.md)

# 3. 理解参数

[3. 理解参数（understanding arguments）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/3%20%E7%90%86%E8%A7%A3%E5%8F%82%E6%95%B0%EF%BC%88understanding%20arguments%EF%BC%89.md)

# 4. 没有重载

[4. 没有重载( No Overloading)](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/4%20%E6%B2%A1%E6%9C%89%E9%87%8D%E8%BD%BD(%20No%20Overloading).md)

# 5. 默认参数值

[5. 默认参数值(Default Parameter Values)](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/5%20%E9%BB%98%E8%AE%A4%E5%8F%82%E6%95%B0%E5%80%BC(Default%20Parameter%20Values).md)

# 6. 参数扩展与收集

[6. 参数扩展与收集（Spread Arguments and Rest Parameters）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/6%20%E5%8F%82%E6%95%B0%E6%89%A9%E5%B1%95%E4%B8%8E%E6%94%B6%E9%9B%86%EF%BC%88Spread%20Arguments%20and%20Rest%20Parameters%EF%BC%89.md)

# 7. 函数声明与函数表达式

[7. 函数声明VS函数表达式（Function Declarations versus Function Expression）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/7%20%E5%87%BD%E6%95%B0%E5%A3%B0%E6%98%8EVS%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88Function%20Declarations%20versus%20Functio.md)

# 8. 函数作为值

[8. 函数作为值（Functions as Values）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/8%20%E5%87%BD%E6%95%B0%E4%BD%9C%E4%B8%BA%E5%80%BC%EF%BC%88Functions%20as%20Values%EF%BC%89.md)

# 9. 函数内部

[9. 函数内部（Function Internals）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/9%20%E5%87%BD%E6%95%B0%E5%86%85%E9%83%A8%EF%BC%88Function%20Internals%EF%BC%89.md)

# 10. 函数属性与方法

[10. 函数属性与方法(Function Property and Method)](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/10%20%E5%87%BD%E6%95%B0%E5%B1%9E%E6%80%A7%E4%B8%8E%E6%96%B9%E6%B3%95(Function%20Property%20and%20Method).md)

# 11. 函数表达式

[11. 函数表达式（Function Expressions）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/11%20%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88Function%20Expressions%EF%BC%89.md)

# 12. 递归函数

[12. 递归（RECURSION）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/12%20%E9%80%92%E5%BD%92%EF%BC%88RECURSION%EF%BC%89.md)

# 13. 尾调用优化

[13. 尾调用优化（Tail Call Optimization）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/13%20%E5%B0%BE%E8%B0%83%E7%94%A8%E4%BC%98%E5%8C%96%EF%BC%88Tail%20Call%20Optimization%EF%BC%89.md)

# 14. 闭包

[14. 闭包（Closures）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/14%20%E9%97%AD%E5%8C%85%EF%BC%88Closures%EF%BC%89.md)

# 15. 立即调用的函数表达式

[15. 立即调用的函数表达式（Immediately Invoked Function Expressions）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/15%20%E7%AB%8B%E5%8D%B3%E8%B0%83%E7%94%A8%E7%9A%84%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88Immediately%20Invoked%20Function%20Express.md)

# 16. 私有变量

[16. 私有变量（Private Variables）](10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/16%20%E7%A7%81%E6%9C%89%E5%8F%98%E9%87%8F%EF%BC%88Private%20Variables%EF%BC%89.md)

# 17. 小结

函数是JavaScript编程中最有用也最通用的工具。ECMAScript6 新增了更加强大的语法特性，从而让开发者可以更有效的使用函数

- [ ]  函数声明和函数表达式不一样，函数声明要求写出函数名称，而函数表达式名称可选，没有名称的函数表达式创建的函数被称为匿名函数
- [ ]  ES6新增了类似于函数表达式的箭头函数语法，箭头函数相加于标准函数有重要区别
    1. 箭头函数没有自己的`arguments`和`this`对象
    2. 箭头函数的this在定义时绑定最近上下文中的作用域中的`this`
- [ ]  JavaScript中函数定义于调用时的参数极其灵活：JavaScript的函数不存在函数签名，以下实现让JavaScript函数的**定义和调用完全动态化**（**dynamic definition and invocation**）
    1. `arguments`对象
    2. ES6新增的扩展操作符
- [ ]  函数内部也**暴露**（**expose**）了很多对象和引用指示函数被调用时的一些信息：
    1. 函数如何被调用的：`this` 
    2. 函数在哪里被调用的：`arguments.callee.caller` 
    3. 函数调用时原始的参数传递：`arguments`
- [ ]  JavaScript引擎可以优化符合尾调用（ optimize function with tail call）条件的函数，以节省（**preserve**）栈空间
- [ ]  闭包的作用域链中包含自己的一个变量对象，然后是包含函数的变量对象，直到全局上下文的变量对象
- [ ]  通常，函数作用域及其中的所有变量在函数执行完毕后都会被销毁
    - 闭包因为引用包含函数的变量对象会导致包含函数的作用域会一直保存在内存中，直到闭包被销毁
    - 所以闭包容易造成内存泄漏，不推荐使用
- [ ]  函数可以在创建后被立即调用，执行其中的代码之后却不留下对函数的引用
    - 英文缩写：IIFE ,Immediately Involved Function Expression
    - ES5.1及之前常用于模拟块级作用域
    - 如果不在包含作用域（containing scope）中将返回值赋给一个变量，其包含的所有变量都会被销毁
- [ ]  虽然JavaScript没有私有对象属性（private objects properties）的概念，但可以使用闭包实现公共方法（特权方法），访问位于包含作用域中定义的变量
    - 可以访问私有变量的公共方法叫做特权方法
    - 特权方法可以使用构造函数或原型模式（静态私有变量）通过自定义类型中实现
    - 特权方法也可以使用模块模式或模块增强模式在单例对象上实现