# 10. 函数属性与方法(Function Property and Method)

ECMAScript中的函数是对象，所以函数对象本身是具有属性和方法的。

通过在浏览器中打印一个标准就能大致直到函数对象本身的属性和方法，如下

![Untitled](10%20%E5%87%BD%E6%95%B0%E5%B1%9E%E6%80%A7%E4%B8%8E%E6%96%B9%E6%B3%95(Function%20Property%20and%20Method)/Untitled.png)

- 红色框中的是函数对象的**自有**属性（如果是箭头函数就没有`arguments`，`caller` 和`prototype`属性），其中`arguments` 并不等价于前面提到的可以在函数体中直接使用的`arguments` ，`caller` 属性就是上一节中提到的`caller`属性
- 黄色框内的是函数**原型**（[[Prototype]]）上的属性和方法，继承自`Function` 构造函数的`prototype`属性。可以看到其中也有`arguments` 和`caller` 属性，但是它们都是访问器属性且访问就会抛出异常，是[非标准的已被抛弃属性](%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md) ；而且原型上`name` 属性始终为空字符串和，`length` 属性始终为0

# 10.1 函数对象的length属性

- `length`属性表示的是保存函数定义的**命名参数**的个数，它是**可配置不可写不可枚举的函数对象自有属性**
- 每个函数都有`length`和`name`属性，`[name](2%20%E5%87%BD%E6%95%B0%E5%90%8D%EF%BC%88Function%20Names%EF%BC%89.md)`属性 在之前（函数名）已经解释过
- 在函数声明后，`length` 的值就固定了，因为`length` 的值只与命名参数有关，与调用函数时传递的参数个数无关
    
    ```jsx
    function sayName(name) {
      console.log(name);
    }
    function sum(num1, num2) {
      return num1 + num2;
    }
    function sayHi() {
      console.log("Hi");
    }
    console.log(sayName.length); // 1
    console.log(sum.length); // 2
    console.log(sayHi.length); // 0
    ```
    
    - `length` 根据声明函数时定义的命名参数决定大小
    - **重新声明**函数相当于新创建一个函数对象，`length` 值也会变为新声明函数的命名参数个数

# 10.2 函数对象的prototype属性

- `prototype` 属性是函数对象的**可写不可枚举不可配置的自有属性，**它并不是[[Prototype]]隐藏属性，它是ECMAScript核心中最有趣的部分
- `prototype` 属性是**保存引用类型所有实例方法**的地方，这意味着`toStrig()` 、`valueOf()` 等方法实际上都保存在`prototype`上，进而由所有实例共享，这个属性在自定义类型时特别重要（在[第八章](../8%20%E5%AF%B9%E8%B1%A1%E3%80%81%E7%B1%BB%E4%B8%8E%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/2%20%E5%88%9B%E5%BB%BA%E5%AF%B9%E8%B1%A1.md)已经介绍过）
- [[Prototype]]隐藏属性继承自`Function` 构造函数的`prototype` 属性，记住它与函数对象本身的`prototype` 不同

## 10.2.1 关于Function、Object、Function object、function instance、object之间的关系

- `Function` 是创建函数实例的构造函数，所以`Function` 的`prototype` 属性应该赋予为函数对象的[[Prototype]]属性，而`Function` 本身也是一个函数对象，所以Function的`prototype` 属性和它自身的[[Prototype]]隐藏属性是等同的，即`Function.prototype === Function.___proto__` 返回`true`
- 函数对象（Function object）本身的[[Prototype]]来源于`Function.prototype` ,而函数对象的`prototype` 属性就像第八章解释过的那样，包含一个`constructor` 属性引用函数对象本身，并且`funcObj.prototype` 属性引用的对象的[[Prototype]]就是`Object.prototype` （普通对象默认为`Object` 的实例，且普通对象不存在`prototype`属性）
- `Object` 本身是一个构造函数（也就是说是`Function` 对象的实例），所以它的[[Prototype]]隐藏属性应该继承自`Function.prototype` ,而`Object` 的`prototype` 属性是一个对象实例，但是它的[[Prototype]]隐藏属性为`null`
    
    ```jsx
    console.log(Function.prototype === Function.__proto__); // true
    console.log(function () {}.__proto__ === Function.prototype); // true
    console.log(function () {}.prototype.__proto__ === Object.prototype); // true
    console.log(Function.prototype.__proto__ === Object.prototype); // true
    console.log(Object.prototype.__proto__ === null); // true
    console.log(Object.__proto__ === Function.prototype); // true
    console.log(Object.__proto__.__proto__ === Object.prototype); // true 
    ```
    
- 原型图如下
    
    ![Function.png](10%20%E5%87%BD%E6%95%B0%E5%B1%9E%E6%80%A7%E4%B8%8E%E6%96%B9%E6%B3%95(Function%20Property%20and%20Method)/Function.png)
    

# 10.3 函数对象的原型方法

- 函数对象的[[Prototype]]继承了`Function` 构造函数实现在`Function.prototype` 的原型方法，所以每个函数对象都共享`Function.prototype.bind()` 、`Function.prototype.call()` 、`Function.prototype.apply()` 等方法，另外一个共享方法`Function.prototype.toString()`  覆盖了`Function.prototype` 对象原型（这里是[[Prototype]]）上的`Object.prototype.toString()` 方法，还有一个`@@Symbol.hasInstance` 符号属性方法在语言基础的[2. Symbol.hasInstance](../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/%E5%B8%B8%E7%94%A8%E5%86%85%E7%BD%AE%E7%AC%A6%E5%8F%B7.md) 中解释过

## 10.3.1 `Function.prototype.call()/apply()`

- 这个两个方法功能一致，第一个参数接受`thisArg` ，都会以指定的`this` 值来调用函数，即会设置调用函数时函数体内的`this` 对象的值，但是调用函数对象本身的参数在这两个方法中传递的方式不同
    - `apply()` 的第二个参数可以是一个`Array`实例也可以是`arguments` 对象，是传递给函数对象本身的参数集合
    - `call()` 剩下的要传递给被调用函数的参数是逐个传递的，参数必须一个个列出来
- 使用`call()` 还是`apply()` 取决于怎样调用函数传参更方便
    
    ```jsx
    function sum(num1, num2) {
      return num1 + num2;
    }
    
    console.log(sum.apply(this, [1, 2])); // 3 通过数组调用
    const o = {
      applySum: function (num1 = 3, num2 = 4) {
        arguments[0] = num1;
        arguments[1] = num2;
        arguments.length = 2;
        return sum.apply(this, arguments);
      },
    };
    console.log(o.applySum()); // 7 通过传递arguments对象调用
    
    console.log(sum.call(this, 7, 8)); // 15
    ```
    
    - 上述例子中`sum.apply(this, [1, 2])` 以数组形式通过`apply` 传递参数，`this` 为当前作用域的`this` （node环境为`module.exports` , 浏览器环境为`window`）
    - `sum.apply(this, arguments)` 以`arguments` 对象形式通过`apply` 传递参数， 不过需要注意的是`arguments` 不能与命名参数（默认值和外部调用没有传递参数的源于）同步，所以需要额外设置元素，且要设置长度（`length`）才能保证传递成功；`this` 是当前上下文中的`this` 即 `o`对象
    - `sum.call(this, 7, 8)` 通过`call`调用，将传递给调用函数的参数逐个传递，一个个列出来，`this` 同[第一种情况](10%20%E5%87%BD%E6%95%B0%E5%B1%9E%E6%80%A7%E4%B8%8E%E6%96%B9%E6%B3%95(Function%20Property%20and%20Method).md)
- `apply()` 和`call()` 真正强大的地方不是给函数传参，而是**控制函数调用上下文**即函数体内`this` 的能力
    
    ```jsx
    // 控制函数作用域中的this值
    globalThis.color = "red";
    this.color = "green";
    const obj = {
      color: "blue",
    };
    function sayColor() {
      console.log(this.color);
    }
    sayColor.call(global); // red
    sayColor.call(this); // green
    sayColor.call(obj); // blue
    ```
    
    - 改例子运行在node 环境下，`global` 是全局对象，`this` 是当前文件的作用域，`obj` 是一个对象，指定不同的`this` ，分别打印出`global.color` 、`this.color` 、和`obj.color`
- 优点：可以将任何对象设置为任意函数的作用域，这样对象就不用关心方法（对象不用额外设置属性赋值为方法然后再调用以运行时绑定对象本身）

## 10.3.2 `Function.prototype.bind()`

- ES5出于同样的目的定义了一个新方法，`bind()` ，它会创建一个新的函数实例，其`this` 值会**绑定（bound）**传递给`bind()` 的`thisArg`
- 并且新的函数实例会**永久**绑定新`this` ，再次修改都无效
    
    ```jsx
    function sayColor() {
      console.log(this.color);
    }
    
    this.color = "red";
    
    const bound = sayColor.bind(this);
    const o = {
      color: "blue",
    };
    bound(); // red
    bound.call(o); // red
    ```
    

## 10.3.3 `Function.prototype.toString()`

- 对于函数而言，继承的方法`toString()` 和`toLocaleString()` 始终**返回函数的代码**，返回代码的具体格式因浏览器而异，有的返回源代码，包括注释，有得只返回代码的内部形式，会删除注释，所以不要在重要功能中使用这两个方法的返回值，只应在调式中使用
    
    ```jsx
    function test() {
      // 注释
      return null;
    }
    console.log(test.toString());
    ```
    
    - node环境
        
        ```jsx
        function test() {
          // 注释
          return null;
        }
        ```
        
    - 谷歌浏览器
        
        ```jsx
        'function test() {\n  // 注释\n  return null;\n}'
        ```
        
    - 火狐浏览器
        
        ```jsx
        "function test() {
          // 注释
          return null;
        }"
        ```