# 3. 理解参数（understanding arguments）

# 3.1 函数签名

为了更好的理解JavaScript中的函数参数，可以参考[为什么称JavaScript没有函数签名](../../JavaScript%E5%B0%8F%E8%AE%A1/JavaScript%E4%B8%8E%E5%87%BD%E6%95%B0%E7%AD%BE%E5%90%8D.md) 

## 3.1.1 ECMAScript函数传递参数特性

- ECMAScript函数的参数（arguments）与其他大多数语言不同，ECMAScript函数既**不关心传入的参数个数**，也**不关心这些参数的数据类型**
- 定义函数时要接受两个参数，但并不意味着调用时就一定要传递两个参数，可以传递两个，三个，更多，甚至一个不传，解释器不会报错（但是执行时有可能报错）
- 这个参数特性也被称为“**JavaScript没有函数签名**”
    
    ```jsx
    function sum(num1, num2) {
      return num1 + num2;
    }
    
    console.log(sum()); // NaN
    console.log(sum(1)); // NaN
    console.log(sum(1, 2)); // 3
    console.log(sum("1", "2", 3)); // 12  (字符串)
    ```
    

## 3.1.2 不设计函数签名的原因

- 因为`ECMAScript`设计出了一个`arguments` 对象，函数的参数在函数体内部表现为一个数组，这个参数数组就是`arguments` 对象
- 函数被调用时总会接受一个数组，但函数并不关心参数数组中包含什么，即使数组中没有如何元素（没有传递参数），或者元素个数超过定义时传递参数的个数，都没有关系
- 事实上，在使用`function` 关键字定义（非箭头）函数时，就可以在函数内部访问`arguments` 对象，从中获取传进来的每个参数值

## 3.1.3 `arguments`对象

- `arguments` 对象是一个类数组对象（不是`Array`实例，node环境及浏览器环境下都显示为`Arguments`类型实例），可以使用**中括号语法（bracket notation）**访问其中的元素，元素顺序就是传入参数的顺序，从位置0开始。要确定传递参数的个数，可以访问`arguments.length` 属性
    
    ```jsx
    function aboutArguments() {
      console.log(arguments);
      console.log(arguments[0], arguments[2], arguments.length);
    }
    aboutArguments();
    // [Arguments] {}
    // undefined undefined 0
    aboutArguments("mangwu", 22);
    // [Arguments] { '0': 'mangwu', '1': 22 }
    // mangwu undefined 2
    aboutArguments("mangwu", 22, "male");
    // [Arguments] { '0': 'mangwu', '1': 22, '2': 'male' }
    // mangwu male 3
    ```
    
- 通过上述的代码可以知道，即使**没有命名参数**（**no named arguments**），通过`arguments` 仍然可以获取实际调用中传递的参数，这表明（**illustrates**）ECMAScript函数的**命名参数**只是**为了方便**才写出来的，并**不是必须**写出来的。这一点是与其他语言的不同之处：在ECMAScript中的命名参数**不会**创建让之后的调用必须匹配的**函数签名**，这是因为ECMAScript没有设计**验证（validation）**命名参数的机制而是使用`arguments` 对象进行替代

### 3.1.3.1 模拟重载（overloading）

- 没有函数签名这种特性会使得函数的重载难以实现，但是通过`arguments` 特性，仍然可以模拟出函数重载（overloading）
- 通过`arguments` 对象的`length` 属性检查传入的参数个数，实现不同的功能
    
    ```jsx
    // 使用arguments模拟函数重载（其他语言依靠函数签名实现）
    function increase() {
      if (arguments.length == 1) {
        return arguments[0] + 10;
      } else if (arguments.length == 2) {
        return arguments[0] + arguments[1];
      }
      throw new Error("请传递1或2个参数");
    }
    
    console.log(increase(10)); // 20
    console.log(increase(30, 20)); // 50
    ```
    
    - `increase()` 函数只传递一个参数时，会将参数加10并返回，在传递两个参数时，将它们相加并返回，传递其他个数参数时抛出异常
    - 虽然这不像真正函数重载那么明确（参数的类型和顺序也考虑），但这已经足以弥补ECMAScript在这方面的缺失

### 3.1.3.2 `arguments` 与命名参数（named argument）

1. `arguments` 对象可以和命名参数一起使用
    
    ```jsx
    // arguments对象和命名参数可以一起使用
    function increase(num1, num2) {
      if (arguments.length == 1) {
        return num1 + 10;
      } else if (arguments.length == 2) {
        return arguments[0] + num2;
      }
      throw new Error("请传递1或2个参数");
    }
    console.log(increase(10));
    console.log(increase(30, 20));
    ```
    
    - 同时使用命名参数和`arguments` 对象，`num1` 和`arguments[0]` 保存着相同的值，因此使用谁都无所谓
2. `arguments` 对象的值**始终**和对应的命名参数**同步**（**stay in sync with**），这句话保证正确的前提是调用函数时，该命名参数被传值了
    
    ```jsx
    // arguments的值始终和对应的命名参数保持同步
    function syncNamedArguments(num) {
      arguments[0] = 5;
      console.log(num);
      num = 7;
      console.log(arguments[0]);
    }
    syncNamedArguments(1);
    // 打印
    5
    7
    ```
    
    - 通过`arguments[0]` 重写(rewrite)第一个参数的值，`arguments` 对象的值会自动同步到对应的命名参数，所以修改`arguments[0]` 也会修改`num` 的值，所以打印打印`num` 会得到5
    - 同理重写`num` 也会影响`arguments[0]` 的值，二者是**同步**的
    - 但是这**并不意味着它们访问同一个内存地址，**`arguments[0]` 和`num` 在内存中还是分开的，只不过会保持同步而已
        
        🧐这一点和代理很像，但不知道`arguments` 的元素和命名参数是否是代理（proxy）关系
        
    
    <aside>
    💡 **注意**：如果没有传递参数，即执行`syncNamedArguments()` ,`arguments[0]` 设置的值不会反映到`num` 上，`num` 设置的值也不会反映到`arguments[0]` 上，这是因为`arguments` 对象的长度是根据**传入的参数个数**，而非定义函数时给出的命名参数个数确定的（即**同步**只作用于`arguments` 对象长度规定的元素，在函数体内部改变`arguments`对象的`length` 属性也不会修改规定好的同步行为）
    
    ```jsx
    function syncNamedArguments(num) {
      console.log(arguments.length);
      arguments.length = 1;
      console.log(arguments.length);
      arguments[0] = 5; // 如果没有传递参数，此修改不会同步到命名参数中
      console.log(num);
    }
    syncNamedArguments();
    // 打印结果
    0
    1
    undefined
    ```
    
    还需要注意的一点是，在**没有**参数默认值的情况下，**传递`undefined` 的情况属于传递了参数**，且同步依然有效果；但是有参数默认值的情况就会有所不同，可以查看[5. 默认参数值(Default Parameter Values)](5%20%E9%BB%98%E8%AE%A4%E5%8F%82%E6%95%B0%E5%80%BC(Default%20Parameter%20Values).md) ；无论使用了默认参数与否，传递`undefined` 都会影响`arguments.length` 的值
    
    ```jsx
    syncNamedArguments(undefined);
    // 打印结果
    1
    1
    5 // 同步结果
    ```
    
    </aside>
    
3. 严格模式下，`arguments` 对象的行为会有一些变化：首先`arguments` 中的元素不再和传入了值的命名参数同步，其次在函数体中尝试重写（overwrite）`arguments` 对会导致语法错误（代码不会执行）
    
    ```jsx
    "use strict";
      function syncNamedArguments(num) {
        arguments[0] = 5;
        console.log(num);
        num = 7;
        console.log(arguments[0]);
      }
      // 二者相互独立
      syncNamedArguments(1); // 1 5
      function overwriteArguments(num) {
        arguments = [1];
    		严格模式下“arguments”的使用无效。
      }
    ```
    

# 3.2 箭头函数中的参数

- 如果函数是使用箭头函数语法定义的，那么传递给函数的参数不能使用`arguments` 关键字进行访问，而只能通过定义的命名参数访问，如果箭头函数定义所在的作用域没有`arguments` 对象，使用`arguments` 会抛出引用异常的错误
    
    ```jsx
    function foo() {
      console.log(arguments);
    }
    foo(); // [Arguments] {}
    const a = () => console.log(arguments);
    a(); // Uncaught ReferenceError: arguments is not defined
    ```
    
    - 上述是在浏览器环境下的打印
    - 在node环境下（node执行写在文件中的代码）不会报错，因为箭头函数所在作用域有`arguments` 对象，就是`[exports, require, module, __filename, __dirname]` ,关于node环境的`this` 可以查看[var 变量在node跟浏览器环境下的声明](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6/var%20%E5%8F%98%E9%87%8F%E5%9C%A8node%E8%B7%9F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%A3%B0%E6%98%8E.md)
- 上述例子在node环境下不会报错，说明箭头函数虽然没有`arguments` 对象，但是可以在包装函数中给箭头函数借用`arguments` 对象，如下
    
    ```jsx
    function foo() {
    	let bar = () => console.log(arguments);
    	bar(); // [Arguments] {}
    }
    foo(5) // [Arguments] { '0': 5 }
    ```
    

<aside>
💡 注意：ECMAScript中的所有参数都按值传递。不可能按引用传递参数，如果把对象作为参数传递，那么传递的值就是这个对象的引用

</aside>