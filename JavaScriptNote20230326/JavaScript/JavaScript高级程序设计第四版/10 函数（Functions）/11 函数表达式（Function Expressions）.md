# 11. 函数表达式（Function Expressions）

函数表达式功能更强大也更让人迷惑，定义函数的两种基本方式是函数声明和函数表达式，关于二者的区别在第7结有详细解释过：

- 函数声明和函数表达式实际上是有区别的，二者虽然在创建函数方面几乎相同，但事实上JavaScript引擎在加载数据（load data）到执行上下文时对它们是区别对待的
    - JavaScript引擎在任何代码执行之前，会**先读取函数声明**，并在执行上下文中生产函数定义
    - 而函数表达式必须等到代码执行到它那一行才会在执行上下文生产函数定义

函数声明有函数声明提升，而函数表达式在执行到哪一行时才生成函数定义

函数表达式有两种形式

# 11.1 匿名函数表达式（anonymous function expression）

- 语法
    
    ```jsx
    var implicitName = function (param0) {
      statements
    }
    var implicitName = function (param0, param1) {
      statements
    }
    var implicitName = function (param0, param1, /* … ,*/ paramN) {
      statements
    }
    ```
    
    - `paramN` 命名参数，可选
    - `statements` 组成函数体的语句
    - `implicitName` 定义时赋值给匿名函数表达式的变量，该变量标识符将作为函数对象的`name` 属性值（如果匿名函数没有被赋值，则默认为空）；
        - 当有名称的匿名函数被赋值给另外的变量时，名称不会改变
        - 使用初始赋值的变量标识符作为函数的名称称为**隐式名称**（**implicit name**）
        - 如果函数表达式使用函数名称（下一小节），那么这个函数名称就是**显式名称**（**explicit name**）
- 匿名函数表达式看不起来就像一个普通的变量定义和赋值，即创建一个函数再把它赋值给一个变量（变量标识符作为函数名称）
- 匿名函数表达式创建的函数叫做**匿名函数（anonymous function），**也称**拉姆达函数**（**lambda function**）
- 匿名函数表达式可以用作**IIFE**（**Immediately Invoked Function Expression** ，**立即调用函数表达式**），即一经定义就立即运行
    
    ```jsx
    (function() {
    	console.log("Code runs")
    })();
    // 打印
    Code runs
    ```
    
- 匿名函数也常作为函数返回值返回，在任何时候、只要函数被当作值来使用，它就是一个函数表达式，就像之前函数作为值时提到过的创建比较函数的函数返回一个匿名的比较函数
    
    ```jsx
    function createComparisonFunction(prop) {
      return function (a, b) {
        let v1 = a[prop];
        let v2 = b[prop];
        if (v1 < v2) {
          return -1;
        } else if (v1 > v2) {
          return 1;
        } else {
          return 0;
        }
      };
    }
    let a = createComparisonFunction("prop");
    console.log(a); // [Function (anonymous)] 匿名函数
    ```
    

# 11.2 命名函数表达式（**[Named function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function#named_function_expression)**）

- 语法
    
    ```jsx
    var func = function name(param0) {
      statements
    }
    var func = function name(param0, param1) {
      statements
    }
    var func = function name(param0, param1, /* … ,*/ paramN) {
      statements
    }
    ```
    
    - `paramN` 命名参数，可选
    - `statements` 组成函数体的语句
    - `name` :函数名称，**显式名称**（**explicit name**），能在函数体内部引用为函数本身
- 如果希望在函数体中引用当前函数对象，则可以通过一个命名函数表达式创建一个函数，这个显式名称可以作为只对函数体（域）有用的局部变量引用函数对象本身，这种方式避免了使用非标准的`arguments.callee` 属性
    
    ```jsx
    const func = function funcName() {
      console.log(funcName);
    };
    
    func(); // [Function: funcName]
    var funcName = "123";
    func(); // [Function: funcName]
    ```
    
    - `funcName` 作为命名函数表达式创建的函数对象的局部域变量能始终引用函数对象本身，不用担心外部声明同名变量