# 7. 函数声明VS函数表达式（Function Declarations versus Function Expression）

- 函数声明和函数表达式实际上是有区别的，二者虽然在创建函数方面几乎相同，但事实上JavaScript引擎在加载数据（load data）到执行上下文时对它们是区别对待的
    - JavaScript引擎在任何代码执行之前，会**先读取函数声明**，并在执行上下文中生产函数定义
    - 而函数表达式必须等到代码执行到它那一行才会在执行上下文生产函数定义

## 7.1 函数声明提升（function declarations hoisting）

- 在函数声明前使用函数声明定义的函数是可行的，因为函数声明会在任何代码执行之前先被读取并添加到执行上下文，这个过程叫做**函数声明提升（function declaration hoisting）**
- 在执行代码时，JavaScript引擎会先执行一遍扫描，把发现的函数声明提升到源代码树的顶部，因此函数定义出现在调用它们的代码之后，引擎也会把函数声明**提升**到顶部
    
    ```jsx
    sum(10, 12); // 22
    
    function sum(num1, num2) {
      return num1 + num2;
    }
    ```
    

## 7.2 函数表达式的暂时性死区和声明保存函数对象的变量的关键字有关

- 如果使用`let` 或`const` 声明变量保存函数表达式定义的函数对象，在前面就不能引用这个保存函数对象的变量
    
    ```jsx
    try {
      console.log(sum2);
    } catch (error) {
      console.log(error.toString()); // ReferenceError: Cannot access 'sum2' before initialization
    }
    **let sum2 = function (num1, num2)** {
      return num1 + num2;
    };
    ```
    
    - 函数定义在包含一个变量初始化语句中，意味着执行到加粗那一行之前都是`sum2` 的暂时性死区
- 如果使用`var`  声明变量保存函数表达式定义的函数对象，它只是把变量标识符提升了，没有提升函数表达式，虽然在定义前打印变量标识符不会报错，但是当作函数调用就会抛出异常
    
    ```jsx
    console.log(sum3); // undefined
    try {
      sum3(1, 2);
    } catch (error) {
      console.log(error.toString()); // TypeError: sum3 is not a function
    }
    var sum3 = function (num1, num2) {
      return num1 + num2;
    };
    ```