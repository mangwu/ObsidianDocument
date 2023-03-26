# 5. 默认参数值(Default Parameter Values)

# 5.1 ES5.1及以前的理解

- 在ES5.1及以前，实现默认参数值的一种常用方式就是检查某个参数是否等于`undefined`
- 如果是`undefined`就意味着没有传递这个参数，就赋予默认值，如下
    
    ```jsx
    // es5.1之中检查传递参数的方式
    function sayHello(name) {
      name = typeof name !== "undefined" ? name : "mangwu";
      console.log(`Hello, ${name}`);
    }
    
    sayHello(); // Hello, mangwu
    sayHello("wumang"); // Hello, wumang
    ```
    
- 虽然可以手动传递`undefined` ，即`sayHello(undefined);` ，在这种情况下：
    - 对于所有参数有默认参数值的情况，就相当于**没有传值**
    - 对于没有默认参数值的情况，就相当于传递了`undefined`值 详情查看[还需要注意的一点是，在**没有**参数默认值的情况下，**传递`undefined` 的情况属于传递了参数**，且同步依然有效果；但是有参数默认值的情况就会有所不同，可以查看[5. 默认参数值(Default Parameter Values)](5%20%E9%BB%98%E8%AE%A4%E5%8F%82%E6%95%B0%E5%80%BC(Default%20Parameter%20Values).md) ；无论使用了默认参数与否，传递`undefined` 都会影响`arguments.length` 的值](3%20%E7%90%86%E8%A7%A3%E5%8F%82%E6%95%B0%EF%BC%88understanding%20arguments%EF%BC%89.md)
    
    ```jsx
    console.log("---------有默认值------------");
    function syncNamedArguments(num = "100") {
      console.log(arguments[0], num);
      num = "Hi";
      console.log(arguments[0], num);
      arguments[0] = "How are you";
      console.log(arguments[0], num);
    }
    syncNamedArguments(undefined);
    // 打印 证明arguments[0]和num不同步，即相当于没有传值
    // undefined 100
    // undefined Hi
    // How are you Hi
    console.log("---------无默认值------------");
    function syncNamedArguments2(num) {
      console.log(arguments[0], num);
      num = "Hi";
      console.log(arguments[0], num);
      arguments[0] = "How are you";
      console.log(arguments[0], num);
    }
    syncNamedArguments2(undefined);
    // 打印 证明arguments[0]和num同步，即相当于传了undefined值
    undefined undefined
    Hi Hi
    How are you How are you
    ```
    
- 上述的例子表明如果使用ES5.1的方法实现，即通过`undefined` 判断是否传递了参数，就会影响到`arguments` 对象元素和命名参数的同步性（即传递undefined和不传递参数会有**不同**的同步性行为）
- 而使用ES6不会出现这样的问题，因为使用默认值语法后，ES6自动保证传递`undefined` 就相当于没有传递参数（传递`undefined`和不传递参数会有相同的同步性行为），命名参数和`arguments` 对象不会和没有传递值的参数保持同步

# 5.2 ES6的理解

- ES6写参数的默认值不需要像ES5.1那样麻烦，它支持显式定义默认参数，只要在函数中定义参数后面用`=`号就可以为参数赋上一个默认值
    
    ```jsx
    function sayGreetings(greeting = "Hello", name = "mangwu") {
      console.log(`${greeting}, ${name}`);
    }
    sayGreetings(); // Hello, mangwu
    sayGreetings("How are you", "wumang"); // How are you, wumang
    sayGreetings(undefined, "wumang"); // Hello, wumang
    ```
    
- 给参数传`undefined` 就相当于没有传值，可以利用这种行为跳过传递一个值（使用默认值），继续传递其他值，像上面的`sayGreetings(undefined, "wumang");` 就是这种用法
- `arguments` 的行为和不使用默认参数时基本一样，即`arguments` 对象只反映传给函数的参数，不反映参数的默认值（没有传递给函数的参数），严格模式下，即使传递了函数参数值，命名参数和`arguments` 的值也不会同步，即修改命名参数不会影响`arguments` 对象
    - 使默认值语法唯一的区别在于传递`undefined` **不再被认为**是传递了一个值，这个时候`arguments` 和命名参数不再同步，参考[上述的例子](5%20%E9%BB%98%E8%AE%A4%E5%8F%82%E6%95%B0%E5%80%BC(Default%20Parameter%20Values).md)
- 默认参数并不局限于原始值或对象类型，它可以是一个表达式，也可以是一个调用函数获取的值，如下
    
    ```jsx
    // 默认值为其他函数调用获取
    let romanNumerals = ["I", "II", "III", "IV", "V", "VI"];
    let idx = 0;
    function getRomanNum() {
      return romanNumerals[idx++];
    }
    
    function makeKing(name = "Henry", numerals = getRomanNum()) {
      return `King ${name} ${numerals}`;
    }
    console.log(makeKing()); // King Henri I
    console.log(makeKing("Louis", "XVI")); // King Louis XVI
    console.log(makeKing()); // King Henri II
    console.log(makeKing()); // King Henri III
    ```
    
    - 默认参数只要在函数被调用时才会求值，不会在函数定义时求值
    - 并且计算默认值的函数（如例子中的`getRomanNum()`）只有在调用函数未传相应的参数时才会被调用
- 箭头函数也可以使用默认参数，只不过在只有一个参数时，括号不能省略了
    
    ```jsx
    const makeKing2 = (name = "Henry") => `King ${name}`;
    ```
    

# 5.3 默认参数作用域与暂时性死区(Defaut Parameter Scope and Tomporal Dead Zone)

- 默认参数作用域指参数被赋值为默认值时的作用域，因为在求值默认参数时可以定义对象，也可以动态调用函数，所以这个作用域一定存在
- 给参数定义默认值实际上和使用`let`关键字在函数顶部顺序声明变量一样，所以当参数使用默认值时，可以对定义默认值的函数进行如下转换（即可以将默认参数作用域看成函数作用域，只是永远在顶部）
    
    ```jsx
    function sayGreetings(greeting = "Hello", name = "mangwu") {
      console.log(`${greeting}, ${name}`);
    }
    
    // 逻辑上可以转换成如下定义
    function sayGreetings() {
      let greeting = "Hello";
      let name = "mangwu";
      console.log(`${greeting}, ${name}`);
    }
    ```
    
- 据此，可以得出以下结论：
    - 因为参数是按顺序初始化的，所以后定义默认值的参数可以引用先定义的参数
        
        ```jsx
        function sayGreetings(greeting = "Hello", fname = "mangwu", **sname = fname**) {
          console.log(`${greeting}, ${fname} ${sname}`);
        }
        sayGreetings("How are you", "wumang"); // How are you, wumang wumang
        ```
        
        - 这里**`sname = fname`** 不仅能表示`sname` 使用`fname` 的默认值，还可以表示在`sname` 没有传值时可以使用`fname` 的传值
    - 按顺序初始化还可以得出一个结论：参数初始化遵循“暂时性死区”的规则，这和`let`，`const` 声明变量时的规则是一样的，即前面定义的参数不能引用后面定义的，同理参数也不能引用函数体中的变量，这样会抛出错误
        
        ```jsx
        // 暂时性死区
        function makeKing(name = numerals, numerals = "IV") {
          console.log(`King ${name} ${numerals}`);
        }
        try {
          makeKing("wumang"); // 不会报错
          makeKing(undefined); // 报错
        } catch (error) {
          console.log(error.toString()); // ReferenceError: Cannot access 'numerals' before initialization
        }
        
        function sayName(name = n) {
          let n = 1;
          console.log(name);
        }
        
        try {
          sayName("wumang"); // 不会报错
          sayName(undefined); // 报错
        } catch (error) {
          console.log(error.toString()); // ReferenceError: n is not defined
        }
        ```
        
        - 注意，在语法上后面的参数引用前面的，或引用函数体中的变量并不会出错，如果给这个参数传入了指也不会报错
        - 只要在不传递该参数值或者传递`undefined` 时，该参数使用默认值才会因为引用或找不到默认值而报错