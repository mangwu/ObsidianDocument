# 9. 函数内部（Function Internals）

在ES5标准中，函数内部存在两个特殊的对象：`arguments` 和`this` ，ES6又新增了`new.target`属性（关于这个在第八章时就介绍过[new.target](../8%20%E5%AF%B9%E8%B1%A1%E3%80%81%E7%B1%BB%E4%B8%8E%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/4%20%E7%B1%BB/new%20target.md) ）

# 9.1 arguments

- `arguments` 对象在[3. 理解参数（understanding arguments）](3%20%E7%90%86%E8%A7%A3%E5%8F%82%E6%95%B0%EF%BC%88understanding%20arguments%EF%BC%89.md) 中已经讨论过多次，它是一个类数组对象，包含调用函数时传入的所有参数，这个对象只有以`function` 关键字定义函数（除了箭头函数语法创建的函数，其他三种方式创建的都有`arguments`对象）时才会有
- 虽然主要用于包含函数参数，但是`arguments` 对象还有一个`callee`属性，是一个指向`arguments`对象**所在函数**的指针，`arguments.callee` 是那些**不能**在函数体中使用函数本身进行递归调用的解决方案（如使用`[Function` 构造函数](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)，匿名函数表达式，和箭头函数可能无法通过函数名称递归调用函数本身）

**一个例子**

- 常见的阶乘函数需要递归调用本身
    
    ```jsx
    function factorial(num) {
      if (num <= 1) {
        return 1;
      }
      return **num * factorial(num - 1);**
    }
    ```
    
    - 函数声明创建的函数可以使用函数名称在函数体内引用函数本身，**只要给函数一个名称并且这个名称不会变**，这样定义就没有问题
    - 但是使用`Function` 构造函数形式创建的函数无法通过函数名称在函数体中引用自身，同理，**匿名**函数表达式会因为保存函数对象的变量引用改变而无法再使用变量标识符作为函数名称，箭头函数和匿名函数表达式具有同样的问题
    
    ```jsx
    // 匿名函数表达式和箭头函数的问题
    let factorial2 = function (num) {
      if (num <= 1) {
        return 1;
      }
      return num * factorial2(num - 1);
    };
    let k = factorial2;
    factorial2 = "123";
    try {
      k(3);
    } catch (error) {
      console.log(error.toString()); // TypeError: factorial2 is not a function
    }
    let factorial3 = (num) => {
      if (num <= 1) {
        return 1;
      }
      return num * factorial3(num - 1);
    };
    let g = factorial3;
    factorial3 = "123";
    try {
      console.log(g(3));
    } catch (error) {
      console.log(error.toString()); // TypeError: factorial2 is not a function
    }
    ```
    
- 对于递归函数而言，函数能正常执行的必要条件是保证函数名称必须不再变化，这会导致名称和函数**紧密耦合**（**tightly coupled**），使用`arguments.callee` 就可以让函数逻辑与函数名**解耦（decoupled）**
    
    ```jsx
    // 解耦
    function factorial(num) {
      if (num <= 1) {
        return 1;
      }
      return **num * arguments.callee(num - 1);**
    }
    console.log(factorial(10)); // 3628800
    ```
    
- 这个重写后的`factorial()` 函数已经用`arguments.callee` 代替了之前硬编码的`factorial` ，保证无论函数叫什么名称都可以引用正确的函数
    
    ```jsx
    let h = factorial;
    factorial = "123"; // 修改保存函数对象的变量引用
    console.log(h(10)); // 3628800
    ```
    

**其他解决方案**

1. 使用`const` 声明变量，配合函数表达式和箭头函数语法进行初始化，这样即使函数体内部绑定函数名称也不会出错，因为保存函数对象的标识符不会改变
    
    ```jsx
    const f = (num) => {
      if (num <= 1) {
        return 1;
      }
      return num * f(num - 1);
    };
    // f永远保存上面使用箭头函数声明的函数对象，所以不用担心内部绑定函数名称会出错
    console.log(f(10)); // 3628800
    ```
    
2. 在使用函数表达式声明变量时确定函数名称
    
    ```jsx
    let a = **function myFunc(num)** {
      if (num <= 1) {
        return 1;
      }
      return num * **myFunc(num - 1)**;
    };
    console.log(a(10)); // 3628800
    let b = a;
    a = "123";
    console.log(b(10)); // 3628800
    ```
    

# 9.2 this

- 关于`this` 在不同上下文中的值可以查看[this操作符](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6.md)
- 在函数上下文中，`this` 的值在标准函数和箭头函数中有不同的行为，且在严格模式和非严格模式下，`this` 值在函数函数上下文中也有区别

## 9.2.1 标准函数（standard function）

- 在标准函数中，`this` 引用的是把函数当成方法调用的**上下文对象**（**context object**），这个时候通常称其为`this` 值；如果不使用任何对象调用标准函数，标准函数的`this` 值默认为全局对象（浏览器环境为`window`，`node` 环境为global ），但是严格模式下默认值为`undefined`
    
    ```jsx
    color = "red";
    function sayColor() {
      console.log(this.color);
    }
    function sayColor2() {
      "use strict";
      console.log(this);
    }
    
    sayColor(); // red
    sayColor2(); // 因为严格模式下默认this是undefined，所以不会打印color
    const o = {
      sayColor,
      color: "blue",
    };
    o.sayColor(); // blue
    ```
    
    - `sayColor()` 定义在全局上下文（node环境下只是定义在一个文件上下文）中，其中引用了一个`this` 对象
    - `this` 对象的引用值必须到函数调用时才能确定（**运行时绑定**），因此在全局上下文中调用`sayColor()` 会输出挂载到全局对象的`color` 属性值`red` ，而通过`o.sayColor()` 调用函数，`this` 会指向`o` ，所以打印的就是`this.color` 属性值`blue`

<aside>
💡 注意：函数名只是保存指针的变量，因此全局定义的`sayColor()` 函数和`o.sayColor()` 是同一个函数，只是执行时的上下文不同（调用者不同）

</aside>

## 9.2.2 箭头函数

- 在箭头函数中，`this` **引用的是定义箭头函数的上下文**
- 箭头函数和调用它的对象无关，它的`this` 就是定义箭头函数所在作用域的`this`值（详情查看[4.3 箭头函数（arrow functions）](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6.md) ）
    
    ```jsx
    // node环境下
    // 箭头函数this
    this.color = "red";
    color = "green";
    const obj = {
      color: "blue",
      sayColor: () => {
        console.log(this.color);
      },
      createSayColor: function () {
        const sayColor = () => {
          console.log(this.color);
        };
        return sayColor;
      },
    };
    
    // 箭头函数的this值和调用对象无关
    obj.sayColor(); // red
    // 箭头函数的this值是定义时所在作用域的this值
    obj.createSayColor()(); // blue
    const fn = obj.createSayColor;
    fn()(); // green
    ```
    
    - 上述情况是在node环境下执行文件中的代码的打印，js文件上下文中的`this` 值是`[module.exports](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6/var%20%E5%8F%98%E9%87%8F%E5%9C%A8node%E8%B7%9F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%A3%B0%E6%98%8E.md)`
    - 执行`obj.sayColor()` 因为定义在`obj` 的`sayColor` 是一个箭头函数，所以它的`this` 就是`obj` 所在作用域的`this` ，之前设置过`this.color = "red";` 所以这里打印`red`
    - 执行`obj.createSayColor()()` 因为`createSayColor()` 是一个标准函数，通过`obj` 调用所以它的`this` 就是`obj` ，而在`createSayColor()` 函数内定义的`sayColor()` 是一个箭头函数，这个箭头函数继承最近的上下文，所以打印出来的就是`obj.color` 即`blue`
    - `fn` 虽然也是`obj` 中的`createSayColor()` 标准函数，但是在外部没有使用对象或指定`this` 进行调用，`fn` 的`this` 就是全局对象，所以`fn` 中的`sayColor()` 箭头函数继承最近的上下文，打印出全局对象的`color` ，之前设置过`color = "green";` 即打印`green`
- 事件回调（event callback）和定时回调（timeouts callback）中的函数既可以是普通函数也可以是箭头函数，它们的`this` 值指向的**并非想要的对象**（not intended object），将其中的回调函数写成箭头函数能保证`this` 保留（preserved）为定义该函数时的上下文
    
    ```jsx
    // 回调函数
    function Queen() {
      this.name = "Elizabeth";
      setTimeout(function () {
        console.log(this.name);
      }, 1000);
    }
    
    function King() {
      this.name = "Henry";
      setTimeout(() => {
        console.log(this.name);
      }, 1000);
    }
    
    new Queen(); // undefined
    new King(); // Henry
    ```
    
    - 标准回调函数`this`引用默认全局对象，因为全局对象上没有`name` 属性，所以打印`undefined`
    - 箭头函数保留定义该函数时的上下文，所以`this` 就是`new King()` 构造函数新创建的`this`  ，打印`Henry`

# 9.3 caller

- ES5规范的`caller` 是函数对象的属性，`[Function.prototype.caller](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)` ；虽然ES3并没有定义`caller` 这个属性，但所有浏览器（除了早期版本的Opera）都支持这个属性，这个属性引用的是调用当前函数的函数，或者如果是全局作用域中调用的则为`null`
    
    ```jsx
    // node环境
    function outer() {
      inner(arguments.callee);
      console.log(outer.caller);
      console.log(outer.caller === arguments[0]);
    }
    
    function inner() {
      console.log(inner.caller);
      console.log(inner.caller === arguments[0]);
    }
    
    outer(arguments.callee);
    // 打印结果
    [Function: outer]
    true
    [Function (anonymous)]
    true
    ```
    
    - 对于`inner()`而言，它会在`outer` 函数中被调用，所以`inner.caller` 引用`outer` 函数对象本身，而在`outer` 中调用`inner()` 时传递了`arguments.callee` 即解耦使用的`outer` 函数对象本身，所以也会打印出`true` 值；如果要想进一减低耦合度（looser coupling），可以使用`arguments.callee.caller` 来引用调用`inner` 的所在作用域的函数本身
    - 对于`outer()` 而言，因为`node`环境下js文件运行就是在一个[闭包环境](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6/var%20%E5%8F%98%E9%87%8F%E5%9C%A8node%E8%B7%9F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%A3%B0%E6%98%8E.md)，所以`outer` 本身在一个匿名函数中被调用，它的`caller` 属性值肯定打印除了一个匿名函数，可以通过给`outer` 传递`arguments.callee` 以确定这个匿名函数的存在
- 在严格模式下，`arguments.callee` 是不能被访问的，会抛出TypeError异常；同时，函数对象的`caller`属性不能被赋值，也会抛出异常
- 同时ES5也定义了`arguments.caller` 属性，在非严格模式下始终是`undefined` ，严格模式下报错，这是为了分清楚`arguments.caller` 和函数对象的`caller` 而有意为之，同时作为对这门语言的安全防护，这个改动也让第三方代码无法检测同一上下文中运行的其他代码

# 9.4 new.target

- `new.target` 是ES6新增的用于检测函数是否使用`new`关键字进行调用的**伪属性**
    - 如果不是使用`new` 关键字进行调用，`new.target` 就是`undefined`
    - 如果使用`new` 关键字进行调用（前提是函数不是箭头函数），`new.target` 引用被调用的构造函数
- `new.target` 能用于保证构造函数通过`new` 进行调用，杜绝简单的函数调用，通过判断`new.target` 是否为`undefined` ，使用简单函数调用的方式抛出异常即可
- 类的构造函数中也可以使用`new.target` （因为类底层使用函数和原型链实现）,同理`new.target` 会引用类本身，通过`super()` 调用父类，父类的构造函数中同样具有`new.target` 属性，且为子类本身，更多可以查看[new.target](../8%20%E5%AF%B9%E8%B1%A1%E3%80%81%E7%B1%BB%E4%B8%8E%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/4%20%E7%B1%BB/new%20target.md)
    
    ```jsx
    // 创建抽象类
    function Person(name, age) {
      if (new.target === Person) {
        throw new Error("抽象类不能被new操作符进行调用");
      }
      this.name = name;
      this.age = age;
    }
    
    function King(name, age, generation) {
      if (!new.target) {
        throw new Error("必须使用new操作符实例化King构造函数");
      }
      Person.call(this, name, age);
      this.generation = generation;
    }
    
    // 寄生式组合继承
    function parasiticCompositeInheritance(subType, superType) {
      const prototype = Object.create(superType.prototype);
      prototype.sayName = function () {
        console.log(`${this.name} ${this.generation}`);
      };
      prototype.constructor = subType;
      subType.prototype = prototype;
    }
    parasiticCompositeInheritance(King, Person);
    const king = new King("Henry", 26, "III");
    king.sayName(); // Henry III
    
    try {
      King("Henry", 26, "III");
    } catch (error) {
      console.log(error.toString()); // Error: 必须使用new操作符实例化King构造函数
    }
    
    try {
      new Person("Henry", 26);
    } catch (error) {
      console.log(error.toString()); // Error: 抽象类不能被new操作符进行调用
    }
    ```