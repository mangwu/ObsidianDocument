# 12. 递归（RECURSION）

- 递归函数（recursive function）通常形式是**一个函数通过名称调用自己**
- 实际上关于通过名称调用自己的问题在**[函数参数](9%20%E5%87%BD%E6%95%B0%E5%86%85%E9%83%A8%EF%BC%88Function%20Internals%EF%BC%89.md)**中已经给出了解决方案：使用`arguments.callee`

---

- 再以经典的递归阶乘函数为例子
    
    ```jsx
    function factorial(num) {
      if (num <= 1) {
        return 1;
      }
      return num * factorial(num - 1);
    }
    ```
    
    - `factorial()`是一个递归函数，它在函数体中通过函数名称调用了自己
- 但如果把函数保存函数对象的`factorial` 变量赋值为其他值，那么函数体内的`factorial(num - 1)` 就无法引用函数对象而抛出异常
    
    ```jsx
    let anoterFactorial = factorial;
    factorial = null;
    try {
      anoterFactorial(4);
    } catch (error) {
      console.log(error.toString()); // TypeError: factorial is not a function
    }
    ```
    
    - 使用`anoterFactorial` 变量保留对原始函数的引用，使得`factorial` 变量为`null` ，而在调用`anoterFactorial()` 时，要递归调用`factorial()` ，但因为它已经不再是函数，所以会出错
- 使用`arguments.callee` 可以解决这个问题，它就是一个指向正在执行函数的指针，因此可以在函数内部递归调用，如下
    
    ```jsx
    function factorial(num) {
      if (num <= 1) {
        return 1;
      }
      return num * arguments.callee(num - 1);
    }
    ```
    
- 但是在严格模式下，运行代码是不能访问`arguments.callee` 的，因此访问会出错，此时可以使用**命名函数表达式（named function expression）**达到在函数内部递归调用函数本身的目的
    
    ```jsx
    let fac = function factorial(num) {
      if (num <= 1) {
        return 1;
      }
      return num * factorial(num - 1);
    };
    ```
    
    - 这里创建了一个命名函数表达式`factorial()` ，然后将创建的函数赋值给`fac` 变量，但是函数本身的名称为`factorial`
    - 即使把函数赋值给另外的变量，命名函数表达式创建的函数的名称`factorial` 也不会变，因此递归调用就不会有问题，在严格模式和非严格模式都可以使用
- 实际上最简单解决方案是使用`const` 声明变量保存函数表达式或箭头函数创建的函数，这样在函数内部通过不变的变量名称标识符一直可以调用到函数本身
    
    ```jsx
    const f = (num) => {
      if (num <= 1) {
        return 1;
      }
      return num * f(num - 1);
    };
    ```