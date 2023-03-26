# 1. 箭头函数（Arrow Functions）

# 1.1 箭头函数

- ES6新增的使用**胖箭头**（fat-arrow`=>`）语法定义函数表达式的能力。
- 在很大程度上，箭头函数实例化的函数对象与正式的函数表达式创建的函数对象行为是相同的，任何可以使用函数表达式的地方，都可以使用箭头函数

# 1.2 语法

```jsx
(arguments) => { /* functionBody */ };
(arguments) => ( /* returnValue */ );
```

- `arguments` 表示箭头函数的参数，如果只有一个参数，可以不用括号包裹。在每个参数或有多个参数时才使用括号
- 胖箭头右边的就是箭头函数的**函数体**：
    - 如果使用大括号（`{}`），则其中包含的是函数体，和常规函数一样，可以包含多条语句，并可以使用`return` 返回值
    - 如果不使用括号，则可以使用**可选的**小括号（`()`）,小括号中只能包含“一行”代码，比如一个表达式，一个赋值操作，且**这行代码的结果会作为返回值返回**
        - 另外，如果“一行”代码比较简单，只是简单的运算，那么包裹返回值的**小括号也可以直接省略**
        - 如果要返回的代码结构比较复杂，如一个复杂的字面量对象，就必须使用小括号，防止字面量对象的大括号被识别为包裹函数体的大括号
        - 使用省略大括号的写法就**不能使用return**了

# 1.3 例子

1. 箭头函数的简洁语法非常适合嵌入到**高阶函数**中做函数参数
    
    ```jsx
    const ints = [1, 2, 5, 3, -5, -2, 3, 5, 4];
    console.log(ints.reduce(**(pre, cur) => { return pre + cur})**);
    ```
    
    - 箭头函数很简洁，极大缩减代码量，如果使用函数表达式，代码函数就会增加，如下
        
        ```jsx
        const sum = function (pre, cur) {
          return pre + cur;
        };
        console.log(ints.reduce(sum));
        ```
        
2. 在箭头函数只有一个参数时，可以直接省略包裹参数的括号
    
    ```jsx
    ints.map(**v => {console.log(v)}**) // // 打印数组中每个元素
    ```
    
3. 除此之外，箭头后的函数体如果只有一行代码，可以直接省略包裹函数体的大括号
    
    ```jsx
    ints.map(**v => console.log(v)**); // 打印数组中每个元素
    ```
    
4. 在函数体是一行代码的箭头函数中，省略大括号的写法会默认将这一行代码的执行结果作为返回值
    
    ```jsx
    console.log(ints.map(v => v)); // 获得了一份源数组的复杂，并打印出来
    ```
    
5. 如果使用一行代码作为返回值，而且这一行代码是对象字面量声明的对象，需要使用小括号包裹，避免对象字面量的大括号被识别为包裹函数体的大扩展
    
    ```jsx
    console.log(ints.map(**(v, i) => ({ lable: i, value: v }))**); // 获得一个根据原数组数据得到的对象数组
    // 打印结果
    [
      { lable: 0, value: 1 },
      { lable: 1, value: 2 },
      { lable: 2, value: 5 },
      { lable: 3, value: 3 },
      { lable: 4, value: -5 },
      { lable: 5, value: -2 },
      { lable: 6, value: 3 },
      { lable: 7, value: 5 },
      { lable: 8, value: 4 }
    ]
    ```
    

# 1.4 理解箭头函数

- 语法简洁是箭头函数的最大优点
- 箭头函数的最大缺点是函数体内不能使用`arguments`、`super`、`new.target` 等操作符或内置对象，也不能作为构造函数使用
- 箭头函数也没有`prototype`属性，并且总是**匿名的**（**anonymous**）

## 1.4.1 箭头函数中的`this`

- 箭头函数中的`this` 和其它方式定义的函数的`this` 不一样,**箭头函数的`this` 捕捉闭包上下文（enclosing context）的`this`值**
    
    ```jsx
    // 顶层
    const obj = {
      arrowFunc: () => this,
      normalFunc: function () {
        return this;
      },
    };
    
    console.log(obj.arrowFunc() === obj.normalFunc()); // false
    ```
    
    - `obj.arrowFunc()` 调用箭头函数，其中的`this` 是`obj` 对象所在作用域的`this` ，在node环境中就是`[module.exports](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6/var%20%E5%8F%98%E9%87%8F%E5%9C%A8node%E8%B7%9F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%A3%B0%E6%98%8E.md)` 在浏览器环境中就是`window`
    - `obj.normalFunc()` 调用普通函数，其中的`this` 就是`obj` 这符合函数运行时绑定`this` 的逻辑
- 箭头函数的`this`是在定义时由所在作用域的`this` 决定的，而普通函数的`this` 却决于函数如何被调用（**运行时绑定**）。下面这个例子更能说明这两种函数中`this`的不同
    
    ```jsx
    // 另外一个例子
    const foo = {
      bar1: function () {
        const arrFunc = () => this;
        return arrFunc;
      },
      bar2: function () {
        const func = function () {
          return this;
        };
        return func;
      },
    };
    
    console.log(foo.bar1()()); // foo
    console.log(foo.bar2()()); // global
    
    const fn = foo.bar1;
    const fn2 = { func: foo.bar2() };
    console.log(fn()()); // global
    console.log(fn2.func()); // fn2
    ```
    
    - `foo.bar1()()` ,此时定义的箭头函数的作用域是`bar1` 这个函数，而这个函数的`this` 由调用者决定，因为使用`foo` 堆`bar1` 进行调用，所以定义的箭头函数的`this` 就是`foo` ；而`bar2` 定义的普通函数不存在被随调用的情况，所以就是默认值全局对象（严格模式下为`undefined`）
    - `fn = foo.bar1` ，此时箭头函数未被定义，只是将`bar1` 作为值赋值给`fn` ，即`fn` 就是一个`bar1` 函数，直接调用`fn` 是定义的箭头函数的作用域就是`fn` 这个函数，而这个函数没有被随调用，所以`this`是默认全局对象，即箭头函数的`this` 也是`global` ；而`bar2` 定义的普通函数被生产出来定义在一个`fn2` 对象中命名为`func`，通过`fn2` 调用`func` 根据运行时绑定原则，此时的`this` 就是`fn2`
- 更多关于箭头函数`this` 的内容以及在普通函数上下文，类上下文，全局上下文中的`this` 可以查看[this操作符](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6.md)