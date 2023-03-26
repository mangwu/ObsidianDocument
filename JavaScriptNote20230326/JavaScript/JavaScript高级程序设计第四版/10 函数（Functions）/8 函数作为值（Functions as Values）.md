# 8. 函数作为值（Functions as Values）

因为函数本身就是对象，所以函数名称在ECMAScript中就是变量，所以函数可以用在任何可以使用变量的地方

这意味着函数作为值可以

作为实际参数传给另一个函数

在一个函数中返回另一个函数

# 8.1 函数作为实际参数

- 一个实现调用函数功能的模板函数，就是典型的将函数作为实际参数的函数，代码如下
    
    ```jsx
    // 调用函数功能的模板函数
    function callSomeFunction(someFunction, ...someArgument) {
      return someFunction(...someArgument);
    }
    ```
    
    - `callSomeFunction` 函数接受两个参数，第一个参数应该是函数对象，另外一个参数应该是传给第一个参数所表示的函数对象的参数值，它是一个收集参数
- 任何函数都可以通过`callSomeFunction` 这个函数模板调用传入的参数，它最终返回的就是调用第一个参数传入的函数的结果
    
    ```jsx
    function sum(num1, num2) {
      return num1 + num2;
    }
    
    function sayHello(name) {
      console.log(`Hi, ${name}`);
    }
    console.log(callSomeFunction(sum, 1, 2)); // 3
    callSomeFunction(sayHello, "mangwu"); // Hi, mangwu
    ```
    
- 实际上这个方便的函数ECMAScript已经实现了，即`apply()` 和`call()` ，只不过它们功能更强大，可以指定调用函数的`this`值

# 8.2 函数作为返回值

- 一些高阶函数需要函数作为参数传入，这些作为参数传入的函数可以使用另外一个函数生产，避免了每次调用高阶函数都需要额外手写一个新函数的重复代码
- 例如对一个数组进行排序可以使用`sort()` 高阶函数，通过传入**比较函数（comparison function）**进行排序，但是每个数组根据数组元素的什么值，是升序还是降序都需要在额外新写箭头函数（也可以是普通函数）时思考，这个时候可以写一个生成**比较函数**（**comparison function**）的函数，只要传入升序还是降序，元素比较依据即可。如下
    
    ```jsx
    /**
     * @description 生成比较函数的函数
     * @param {string} type
     * @param  {...any} basis 排序依据
     * @returns {function}
     */
    function createComparisonFunction(type = "ascend", ...basis) {
      return function (a, b) {
        const n = basis.length;
        for (let i = 0; i < n; i++) {
          let value1 = a[basis[i]];
          let value2 = b[basis[i]];
          // -1 value1排在前面
          // 1 value2排在前面
          if (value1 > value2) {
            return type == "ascend" ? 1 : -1;
          } else if (value2 > value1) {
            return type == "ascend" ? -1 : 1;
          } else {
            if (i === n - 1) {
              return 0;
            }
            continue;
          }
        }
        // 没有basis，默认将数组元素作为排序依据
        if (a > b) {
          return type == "ascend" ? 1 : -1;
        } else if (b > a) {
          return type == "ascend" ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
    ```
    
    - 这个函数语法看起来复杂，其实就是在一个函数中返回另外一个函数，注意`return` 操作符
    - 返回的函数就是比较函数，它能访问传递的`basis` 依据，通过中括号语法取得要比较的数组元素对象中的属性值，然后进行比较，根据`type` 决定升序还是降序，最后按照`sort()` 高阶函数对比较函数的定义返回`0` `-1` `1`三个可选数字即可
- 以下是利用生成比较函数的函数进行排序的例子
    
    ```jsx
    const data = [
      { name: "mangwu", age: 22 },
      { name: "mangwu", age: 23 },
      { name: "wumang", age: 22 },
      { name: "wumang", age: 23 },
    ];
    
    data.sort(createComparisonFunction("descend", "name"));
    console.log(data);
    data.sort(createComparisonFunction("ascend", "age"));
    console.log(data);
    data.sort(createComparisonFunction("descend", "age", "name"));
    console.log(data);
    data.sort(createComparisonFunction("ascend", "name", "age"));
    console.log(data);
    // 打印结果如下
    [
      { name: 'wumang', age: 22 },
      { name: 'wumang', age: 23 },
      { name: 'mangwu', age: 22 },
      { name: 'mangwu', age: 23 }
    ]
    [
      { name: 'wumang', age: 22 },
      { name: 'mangwu', age: 22 },
      { name: 'wumang', age: 23 },
      { name: 'mangwu', age: 23 }
    ]
    [
      { name: 'wumang', age: 23 },
      { name: 'mangwu', age: 23 },
      { name: 'wumang', age: 22 },
      { name: 'mangwu', age: 22 }
    ]
    [
      { name: 'mangwu', age: 22 },
      { name: 'mangwu', age: 23 },
      { name: 'wumang', age: 22 },
      { name: 'wumang', age: 23 }
    ]
    ```
    
    - `data` 数组中包含4个结构相同的对象，每个都有一个`age` 和`name` 属性，默认情况下使用`sort()` 不传递比较函数比较没有意义
    - 通过调用`createComparisonFunction("descend", "name")` 创建比较函数，就可以根据`name`属性 的值降序排序
    - 而调用`createComparisonFunction("ascend", "age")` 创建比较函数，就可以根据`age` 属性的值升序排序
    - 除此之外，传入多个比较**依据**（**basis**），如`createComparisonFunction("descend", "age", "name")` 优先比较`age` 属性值，如果`age` 值相同，再比较`name` 属性值，都是降序