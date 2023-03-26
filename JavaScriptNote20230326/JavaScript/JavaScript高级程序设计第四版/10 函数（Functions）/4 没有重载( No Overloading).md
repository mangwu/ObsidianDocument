# 4. 没有重载( No Overloading)

- 虽然在[3.1.3.1 模拟重载（overloading）](3%20%E7%90%86%E8%A7%A3%E5%8F%82%E6%95%B0%EF%BC%88understanding%20arguments%EF%BC%89.md) 中使用`arguments` 对象上模拟了重载，但是ECMAScript函数**不存在函数签名的特性决定了它不能像传统编程那样重载**
- 在Java中，一个函数可以有两个定义，只要函数签名（接收参数的类型和数量）不同就行，而ECMAScript函数没有签名，因为参数是由包含零个或多个值的数组表示的，没有函数签名，自然就没有重载
    
    关于函数签名，可以查看[JavaScript与函数签名](../../JavaScript%E5%B0%8F%E8%AE%A1/JavaScript%E4%B8%8E%E5%87%BD%E6%95%B0%E7%AD%BE%E5%90%8D.md) 
    

# 4.1 同名函数

- 在ECMAScript中可以在同一个作用域通过函数声明定义两个同名函数，后定义的会覆盖先定义的
    
    ```jsx
    function addSomeNum(num) {
      return num + 100;
    }
    
    function addSomeNum(num) {
      return num + 200;
    }
    console.log(addSomeNum(100)); // 300
    ```
    
- 上面的例子分别定义了两个同名函数，这是其他语言实现重载的传统方案，但是ECMAScript只能覆盖前面定义的函数，**把函数名称当作指针**能很好的理解为什么ECMAScript无法通过传统的方案实现重载，上面的例子在逻辑上等价于定义了一个变量，只是这个变量先保存的是第一个函数对象，后保存的是第二个函数对象
    
    ```jsx
    let addSomeNum2 = function (num) {
      return num + 100;
    };
    addSomeNum2 = function (num) {
      return num + 200;
    };
    addSomeNum2(100)
    ```