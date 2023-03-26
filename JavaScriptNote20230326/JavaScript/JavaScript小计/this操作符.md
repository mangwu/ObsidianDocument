# this操作符

参考[MDN-this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

# 1. this

**this行为改变**

- 和其它语言相比，JavaScript中**函数**（**function**）中的`this` **关键字**（**keyword**）的行为略有不同
- 并且在严格模式（**strict mode**）和非严格模式下，`this` 的行为也会有所区别

**this的值**

- 在大多数情况下，**函数的调用方式（how function is called）**决定了`this` 的值，即**运行时绑定**（**runtime binding**）
- `this` 值不能在方法执行期间被**赋值**（**assignment**），并且每次函数调用时，`this` 的值都有可能不同（调用方式不同导致）
- 在ES5中，引入了`bind()` 方法用于设置方法被调用时的`this` 值而**不是**根据调用方式运行时绑定
- 在ES6中，引入了箭头函数（arrow function），箭头函数不提供自身的`this` 绑定【`this` 的值保持（retains）为闭合词法上下文（enclosing lexical context）的值】

**简单的运行时绑定的例子**

```jsx
global.prop = 22; // node环境下的写法，如果是浏览器环境可以写成var prop = 22
function func() {
  console.log(this.prop); // 非严格模式
}
const test = { prop: 42, func };
func(); // 非严格模式打印 22

test.func(); // 42 
```

- `func()` 在全局作用域下被调用，`this` 就是全局对象（Global）
- `func()` 被`test` 对象调用，`this` 就是`test` 对象所以打印出了`test.prop`
- 这就是`this` 运行时绑定的特性

# 2. 语法

```jsx
this
```

## 2.1 值

- 它是**当前执行上下文**（**execution context**）的一个属性，常见当前执行上下文有global，function，eval等
- 在非严格模式下总是指向一个**对象，**如果指定的this不是一个对象，会被转换为对应的包装对象
- 在严格模式下可以是任何值（可以不是对象而是原始数据类型）
    - node环境下，严格模式下，**在全局作用域里调用函数（**正常情况的普通函数**）**，`this`为`undefined` (非严格模式是全局对象)

```jsx
function func2() {
  console.log(this);
  console.log(this.length);
}
func2.apply(5); 
func2.apply("5");
// 非严格模式下的打印
[Number: 5] // 包装对象
undefined 
[String: '5']
1
// 严格模式下的打印
5 // 数字
undefined
5 // 字符串
1 
```

# 3. 理解`this`

## 3.1 全局上下文（Global Context）

- 无论是严格模式还是非严格模式，全局上下文（在任何函数体外部）中的`this` 都指向全局对象（ECMAScript规范的一个`[Global`对象](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/5%20%E5%9F%BA%E6%9C%AC%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B/4%201Global.md)，由具体的环境实现）
- 浏览器环境
    
    ```jsx
    "use strict"; // 无论是否严格模式还是非严格模式，下述打印结果一样
    
    console.log(this); // Window {}
    console.log(globalThis); // Window {}
    // 浏览器环境
    console.log(this == window); // true
    console.log(globalThis == window); // true
    ```
    
    - `this`引用就是浏览器中的全局对象实现`window` ，`globalThis` 也是`window` ，在全局上下文中，三者等价
- node（v18.9.0）环境
    
    ```jsx
    "use strict"; // 无论是否严格模式还是非严格模式，下述打印结果一样
    console.log(this); // {}
    console.log(global);
    console.log(globalThis);
    // node环境
    console.log(this === global); // false
    console.log(globalThis === this); // false
    console.log(globalThis === global); // true
    ```
    
    - 无论严格模式还是非严格模式，`node`环境下的全局上下文中，`**~~this` 是一个空对象~~(this是`module.exports`)，**而`globaThis`和`global` 对象等价，都指向Node实现`ECMAScript`规范的一个全局对象，如下
        
        ```jsx
        <ref *1> Object [global] {
          global: [Circular *1],
          queueMicrotask: [Function: queueMicrotask],
          clearImmediate: [Function: clearImmediate],
          setImmediate: [Function: setImmediate] {
            [Symbol(nodejs.util.promisify.custom)]: [Getter]
          },
          structuredClone: [Function: structuredClone],
          clearInterval: [Function: clearInterval],
          clearTimeout: [Function: clearTimeout],
          setInterval: [Function: setInterval],
          setTimeout: [Function: setTimeout] {
            [Symbol(nodejs.util.promisify.custom)]: [Getter]
          },
          atob: [Function: atob],
          btoa: [Function: btoa],
          performance: Performance {
            nodeTiming: PerformanceNodeTiming {
              name: 'node',
              entryType: 'node',
              startTime: 0,
              duration: 36.28760004043579,
              nodeStart: 1.9882000088691711,
              v8Start: 3.253600001335144,
              bootstrapComplete: 25.267500042915344,
              environment: 14.454699993133545,
              loopStart: -1,
              loopExit: -1,
              idleTime: 0
            },
            timeOrigin: 1664700355284.943
          },
          fetch: [AsyncFunction: fetch]
        }
        ```
        

<aside>
💡 **注意 ：**`globalThis` 用于获取全局对象（window或global）,**无论**你的代码在那个当前上下文中运行

</aside>

## 3.2 函数上下文（Function Context）

- 在函数上下文中，`this` 的值取决于函数如何被调用，且和代码是否是严格模式有关系
1. 在**非严格模式**下，如果函数在全局作用域调用，且不是`this` 的值**没有**被调用关系设置（通过对象调用，通过`call()`或`apply()`设置），`this` 默认引用全局对象（global object），在node环境下是`globalThis` /`global` 在浏览器环境下是`globalThis` / `window` /`this` 
    
    ```jsx
    // node环境
    function f1() {
      return this;
    }
    console.log(f1() === globalThis); // true
    console.log(f1() === global); // true
    console.log(f1() === this); // false
    ```
    
    - 关于文件中的`this` ，它其实是一个局部的对象，参考[jianshu](https://www.jianshu.com/p/7cc68507ca66)
        
        [var 变量在node跟浏览器环境下的声明](this%E6%93%8D%E4%BD%9C%E7%AC%A6/var%20%E5%8F%98%E9%87%8F%E5%9C%A8node%E8%B7%9F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%A3%B0%E6%98%8E.md)
        
    
    ```jsx
    // 浏览器环境
    function f1() {
      return this;
    }
    console.log(f1() === globalThis); // true
    console.log(f1() === global); // true
    console.log(f1() === this); // true
    ```
    
2. 在**严格模式**下，函数在全局作用域下调用，且不是`this` 的值**没有**被调用关系设置（通过对象调用，通过`call()`或`apply()`设置)，`this` 默认是`undefined` 
    
    ```jsx
    function f2() {
      "use strict";
      return this;
    }
    // 浏览器环境和node环境打印一致，都是undefined
    console.log(f2()); // undefined
    ```
    

<aside>
💡 注意：第2个例子中的`f2()` 返回的`this` 是`undefined` ，因为`f2` 是被直接调用的，而不是作为对象的属性或方法，如果使用`window.f2()` 那么其返回值就是`window` 全局对象了。有一些老版本的浏览器在最初支持严格模式时没有正确实现这个功能，会错误的返回`window`

</aside>

## 3.3 类上下文（Class Context）

- `this` 在类中的表现和函数类似，因为类的底层是函数（functions under the hood），但是也有一些区别和注意事项
1. 在类的构造函数中，`this` 就是一个常规（regular）对象，类中所有非静态方法都会被添加到`this` 的原型中，所以构造函数中的`this`就是新创建的对象，而调用非静态方法时的`this`由**调用者**决定（**运行时绑定**）
2. 类的静态方法是类自身的属性，所以一般调用类的静态方法，`this` 就是类本身
    
    ```jsx
    class Person {
      constructor() {
        // this就是一个新创建的对象
        console.log(this);
      }
      sayHello() {
        console.log(this);
        console.log(this === Person.prototype);
        console.log(this === person);
    
        console.log("Hello");
      }
      static breathe() {
        console.log(this);
        console.log(this === Person);
      }
    }
    // 打印构造函数中的this，就是新创建的对象person
    const person = new Person(); // Person {}
    
    // 调用类的静态方法，this 就是类本身
    Person.breathe(); // [class Person]
    
    // 通过类的prototype属性调用sayHello()由调用者决定this值（Person.prototype）
    Person.prototype.sayHello(); // {} true false Hello
    // 通过类实例调用sayHello, 类实例person就是sayHello中的this值
    person.sayHello(); // Person {} false true Hello
    ```
    

## 3.4 派生类（Derived Classes）

- 派生类的构造函数不像基类（base class）的构造函数，它没有初始的`this` 绑定（binding ，即派生类在构造函数中的`this` 值 通过基类创建）。在派生类构造函数中调用`super()` 会创建一个`this` 绑定到构造函数上，`super()` 代码等价于如下的代码，其中`Base` 是派生类的基类
    
    ```jsx
    this = new Base();
    ```
    
    <aside>
    💡 注意：这也是为什么派生类的构造函数必须在引用`this`前调用`super()` 的原因，因为没有调用`super()` 派生类的构造函数不会有`this`绑定
    
    </aside>
    
- 派生类如果使用了构造函数，就必须调用`super()` 或者直接返回一个对象（不使用`this`）
    
    ```jsx
    class Base {}
    
    class Good extends Base {} // 不使用构造函数
    
    class AlsoGood extends Base {
      constructor() {
        return { a: 1 }; // 使用构造函数并返回对象
      }
    }
    
    class Bad extends Base {
      constructor() {} // 使用构造函数如果不返回对象必须使用super()
    }
    new Good();
    new AlsoGood();
    try {
      new Bad(); // ReferenceError
    } catch (error) {
      console.log(error.toString()); 
    // ReferenceError: Must call super constructor in derived class before 
    // accessing 'this' or returning from derived constructor
    }
    ```
    

# 4. 例子

## 4.1 `this` 和对象转换

- 在2.1中提过，[在非严格模式下总是指向一个**对象，**如果指定的this不是一个对象，会被转换为对应的包装对象](this%E6%93%8D%E4%BD%9C%E7%AC%A6.md) 现在总结一下
1. 非严格模式下，使用`call`和`apply` 指定`this` 时，如果指定的`this` 不是一个对象，会被转换（convert）成一个对象
    1. 字符串，符号，数字，布尔值都会转换成对应的包装对象
    2. `null` ,`undefined` 会被转换成全局对象（node环境下是global）
2. 严格模式下，`this` 值可以是任何类型，所以指定的`this` 值不会进行类型转换，可以是字符串，数字等原始数据类型
    
    ```jsx
    function logThis() {
      console.log(this);
    }
    function logStrictlyThis() {
      "use strict";
      console.log(this);
    }
    
    logThis.apply("5", []); // [String: '5'] 字符串包装类型
    logThis.apply(Symbol("123"), []); // [Symbol: Symbol(123)] 符号包装类型
    logThis.apply(undefined, []); // global  全局对象
    
    logStrictlyThis.apply("7", []); // 7
    logStrictlyThis.apply(Symbol("123"), []); // Symbol(123)
    logStrictlyThis.apply(undefined, []); // undefined
    ```
    

## 4.2 `bind()` 方法

- ES5引入了一个`Function.prototype.bind()` 方法用于创建一个与原始方法具有相同函数体和作用域（scope）的函数，但是这个新函数的`this` 将被**永久**（**permanently**）绑定到`bind` 方法的第一个参数，无论这个新函数如何被调用
    
    ```jsx
    function a() {
      console.log(this.prop);
    }
    
    let g = a.bind({ prop: "g" });
    // 再绑定会无效，仍然使用上面的g
    let f = g.bind({ prop: "f" });
    
    // 使用apply，call无法指定已绑定的this对象
    g.apply({ prop: "apply" }, []);
    f.apply({ prop: "apply" }, []);
    
    globalThis.prop = "global";
    // 普通函数默认使用global作为this
    a();
    const o = { a, g, f, prop: "o" };
    o.a(); // 普通函数的运行时绑定特性
    o.g(); // g
    o.f(); // g
    ```
    
    - 所谓**永久**就是使用bind绑定后的新函数的`this` 不会再发生改变，即使再调用新函数的`bind` 创建另一个新函数也是如此

## 4.3 箭头函数（arrow functions）

- 箭头函数，`this` 值保持为封闭词法环境（enclosing lexical context，实际上就是**最近上下文**）的`this`
    
    简单点说，箭头函数的`this` 就是**继承自箭头函数定义的作用域（定义该函数所在作用域指向的对象），**而不是和普通函数一样的运行时绑定，以及指向调用函数的对象，默认为全局对象
    
    ```jsx
    // node 环境下
    const arrFunc = () => {
      console.log(this);
      console.log(this === module.exports);
    };
    // 全局环境
    arrFunc(); // module.exports true
    const o = { arrFunc }; 
    
    o.arrFunc(); // module.exports true 打印和全局环境一样，不是运行时绑定，和最近上下文有关
    
    console.log("------");
    // 函数环境，在另一个函数中定义箭头函数
    function normal() {
      // 这个时候
      const k = () => console.log(this);
      arrFunc();
      k();
    }
    normal(); // module.exports true global
    
    o.normal = normal;
    o.normal(); // module.exports true o
    ```
    
    - `arrFunc` 箭头函数的定义位置为一个js文件中，所以执行`arrFunc` 的`this`应该固定是使用`node` 执行js文件时指定的`this` ，即`module.exports` ，所以无论在哪个作用域，使用什么方式调用`arrFunc()` 它的打印应该都是不变的
    - 而定义在`normal` 普通函数中的箭头函数`k` 的情况就有所变化了，因为`k` 定义在`normal`中，而`normal`是一个函数所以它可以作为一个作用域，所以`k` 的`this` 应该和`normal` 函数的`this` 保持一致，默认情况下，`normal` 的`this` 为`global` 或 `undefined`（严格模式），所以`k` 箭头函数的`this` 也是`global` 或`undefined` ,但使用`o` 调用`normal` 后，`normal` 的`this` 变成了`o` ，所以`k` 箭头函数的`this` 也变成了`o`

<aside>
💡 **注意：**如果在**调用**（**invocation**）箭头函数时使用`call`，`bind`或`apply` 等传递指定`this` 会被忽略。但是仍然可以使用`call` `apply` 进行箭头函数参数的传递，但是第一个参数应该设置为`null`

</aside>

```jsx
// 箭头函数不能使用bind call apply等指定this
const obj = { func: arrFunc };
obj.func(); // this true
arrFunc.apply(obj); // // this true
const boundFunc = arrFunc.bind(obj);
boundFunc(); // // this true
```

- `arrFunc`作为初始就声明好的箭头函数，它的`this` 是已经确定的，就是`module.exports` （node环境,浏览器环境为window）所以无论使用call，apply，bind，还是声明为对象属性进行调用,`this` 值是不会受到影响的
- 还有一种情况是箭头函数作为函数返回值**不是立即定义**的（在函数中定义，所以在函数执行时箭头函数才被定义）,此时作为返回值的箭头函数的`this` 值时可变的，如下
    
    ```jsx
    const foo = {
      bar: function () {
        const arrFunc = () => this;
        return arrFunc;
      },
    };
    
    // 由foo调用bar函数，bar函数此时的this是foo对象，
    // 此时bar函数内部的箭头函数杯定义，最近的上下文是
    console.log(foo.bar()() === globalThis); // false
    console.log(foo.bar()() === foo); // true
    
    // bar是一个函数，此时箭头函数还未杯定义
    const bar = foo.bar;
    // 因为调用bar没有使用对象调用，其this默认是全局对象，
    // 所以定义的箭头函数返回的this就是globalThis
    console.log(bar()() === globalThis); // true
    console.log(bar()() === foo); // false
    ```
    

## 4.4 原型链上的方法的`this`

- 原型链上的方法的`this` 引用遵循上述**同样的概念**（**same notion**）:如果该方法存在于一个对象的原型链上,那么`this` 指向的是调用这个方法的对象，就像该方法就在这个对象上一样（箭头函数除外）
    
    ```jsx
    // 原型链上的方法
    const obj = {
      foo: function () {
        return this;
      },
      bar: () => this,
    };
    // 普通方法的this取决于调用对象
    console.log(obj.foo() === obj); // true
    // 箭头函数的this取决于定义时的作用域
    console.log(obj.bar() === this); // true
    
    // 原型链上的普通方法的this也取决于调用对象
    const newObj = Object.create(obj); 
    console.log(newObj.foo() === newObj); // true
    console.log(newObj.__proto__.foo() === newObj); // false 应该是newObj.__proto__
    // 原型链上箭头函数的this不变，却决于定义时的作用域
    console.log(newObj.bar() === this); // true
    console.log(newObj.__proto__.bar() === this); // true
    ```
    

## 4.5 getter和setter中的`this`

- 同理，访问器方法（getter和setter）的`this` 引用同样遵循上述**同样的概念**（**same notion**）：用作`getter` 和`setter` 的函数都会把`this` 绑定为设置或获取属性的对象
    
    ```jsx
    const obj = {
      *[Symbol.iterator]() {
        yield* [-2, -8, 6, 7, 9, 4];
      },
      get average() {
        let sum = 0;
        let n = 0;
        for (const val of this) {
          sum += val;
          n++;
        }
        return Math.floor(sum / n);
      },
    };
    
    // 调用average时会访问它的getter方法，此时this就是调用它的obj
    console.log(obj.average); // 2
    
    const newObj = Object.create(obj);
    newObj[Symbol.iterator] = function* () {
      yield* [5, 3, 8, -6, 5, 41];
    };
    // 调用average时会访问它的getter方法，此时this就是调用它的newObj
    console.log(newObj.average); // 9
    ```
    

## 4.6 构造函数中的`this`

- 使用`new` 操作符调用函数时，`this` 绑定为创建的新对象

<aside>
💡 注意：虽然构造函数默认返回`this` 所指的哪个新对象，但是它仍然可以手动返回其他对象（如果返回值不是对象，就会返回`this`引用的新对象）

</aside>

```jsx
// 构造函数中的this引用new调用构造函数时创建的新对象

function C1() {
  this.a = 1;
}
let o = new C1();
console.log(o.a); // o就是new创建的新对象，能打印出1就反向证明this引用新对象

function C2() {
  this.a = 1;
  return {
    a: 2,
  };
}
o = new C2();
console.log(o.a); // 打印2，因为C2主动返回了一个对象，这个对象不也是默认返回的this
```

- `C2` 构造函数中的`this.a = 1` 成为了**僵尸代码**（**dead code**），因为C2**抛弃**（**discarded**）了与`this` 绑定的默认对象，返回了一个自定义对象，虽然这条语句执行了，但是它对于外部没有任何影响

## 4.7 DOM事件处理程序（DOM event handler）中的`this`

- 当函数被用作事件处理程序时，`this` 会被设置为监听器监听的DOM元素【一些**没有**使用`addEventListener` 函数为元素**动态**（**dynamically**）添加监听器的浏览器不遵守这一约定（convention）】
    
    HTML文档结构
    
    ```html
    <h3 id="as_a_dom_event_handler">
    	<a href="#as_a_dom_event_handler" title="Permalink to As a DOM event handler">
    		As a DOM event handler
    	</a>
    </h3>
    ```
    
    在浏览器上的显式结构（整体是`h3` ,蓝色部分是`a`）
    
    ![html_.png](this%E6%93%8D%E4%BD%9C%E7%AC%A6/html_.png)
    
    为`h3` 元素添加的DOM事件处理函数
    
    ```jsx
    const h = document.querySelector("#as_a_dom_event_handler");
    h.addEventListener("click", function (e) {
      console.log(e.currentTarget === this); // true
      console.log(e.target === this); // 可能是true
      console.log(this);
      console.log(e.target);
      console.log(e.currentTarget);
    });
    ```
    
    点击`a` 元素，打印如下
    
    ![console.log.png](this%E6%93%8D%E4%BD%9C%E7%AC%A6/console.log.png)
    
    - `this` 就是监听器监听的DOM元素，即`h3`标签，显然`e.currentTarget` 的定义相同，所以返回`true`
    - 而`e.target` 为**触发监听器执行事件处理函数**的DOM元素，即`a`元素，所以与`this`不同，返回`false`

## 4.8 内联事件处理程序（inline event handler）中的`this`

- 当在内联处理程序执行代码时，`this` 就是监听器（**listener，**如onclick）所在的元素
    
    ```html
    <button onclick="alert(this.tagName.toLowerCase());">
    	Show this
    </button>
    ```
    
    - 点击后提示内容为button
- 注意只有外层代码的this是监听器（例子中是onclick）所在的元素，如果在内联事件处理程序中声明新的函数，整个函数的`this` 视具体情况而定，默认仍然是全局对象（global或window，即严格模式下调用函数的默认指向）
    
    ```html
    <button onclick="alert((function(){return this})());">
      Show inner this
    </button>
    ```
    
    - 内联事件处理程序中声明了新函数，整个新函数的`this` 为全局对象

## 4.9 在类中的`this`

- 对于类构造函数而言，它的`this` 和普通构造函数的特性一致，都是引用新创建的对象
- 对于类中定义的实例方法（instance method），和普通函数一样，`this` 的值取决于它们如何被调用
- 有这样的场景：实例方法的`this` 必须是由定义该实例方法的类的实例，所以可以在构造函数中改写（**override**）实例方法，让它的`this` 绑定为类实例，其他不同类实例调用这个方法仍然使用定义该方法的类的实例作为`this`
    
    ```jsx
    // 在类中应用bind
    class Car {
      constructor() {
        // Bind sayBye but not sayHi to show the difference
        this.sayBye = this.sayBye.bind(this);
      }
      sayHi() {
        console.log(`Hello from ${this.name}`);
      }
      sayBye() {
        console.log(`Bye from ${this.name}`);
      }
      get name() {
        return "Ferrari";
      }
    }
    
    class Bird {
      get name() {
        return "Tweety";
      }
    }
    
    const car = new Car();
    const bird = new Bird();
    
    // 实例方法的this取决于调用它的对象
    car.sayHi(); // Hello from Ferrari
    bird.sayHi = car.sayHi;
    bird.sayHi(); // Hello from Tweety
    
    // 对于绑定了类实例的方法，this不再取决于调用它的对象
    bird.sayBye = car.sayBye;
    bird.sayBye(); // Bye from Ferrari
    ```
    
    - 上例中的`this.sayBye = this.sayBye.bind(this);` 是很经典的一段代码，在React中写类组件时常用于[为组件方法绑定事件内部的`this`](https://www.notion.so/5-89df9dcb5ace4711a7b97d3c93b380cf) ；这段代码实际上为`Car`类的实例声明了一个**自有属性**，它的值是一个固定绑定实例本身的一个方法，如下
        
        ![bind.png](this%E6%93%8D%E4%BD%9C%E7%AC%A6/bind.png)
        

<aside>
💡 注意：类内部默认是严格模式。调用一个`this` 值为`undefined`的方法会抛出错误（就像React中类组件中不为事件处理程序绑定`this` 一样）

</aside>