# 2. Function对象的属性

## 2.1 `Function.prototype.arguments`

- 这是一个**不建议使用（Deprecated）**并且**不是标准（Non-standard）**的函数对象原型属性
- `arguments` **访问器属性**表示传递给`Function`对象的参数，它并**不是函数内部**使用的`arguments` ，它只是一个被废弃的定义在函数对象原型上的属性，如下
    
    ```jsx
    function test(a, b, c) {}
    console.log(test.prototype);
    try {
      test.__proto__.arguments;
    } catch (error) {
      console.log(error.message); // 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
    }
    
    ```
    
    - `test.__proto__.arguments` 就是本节中简述的`Function.prototype.arguments` ，~~而`test.arguments` 是在函数内部使用的函数对象自有属性~~，如下是函数对象原型的打印（谷歌浏览器v105.0.5195.127，`test.arguments` 只不过是**谷歌浏览器为了实现ECMAScript关于`Function.prototype.arguments` 的规范**在函数对象实例上额外添加的一个自有数据属性，而在函数内部使用的`arguments` 是一个`Arguments` 类型实例，）
        
        ![Untitled](2%20Function%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%B1%9E%E6%80%A7/Untitled.png)
        
- 需要在注意的是，ECMAScript规范关于`Function.prototype.arguments` 的唯一行为是，它是一个初始`arguments` 访问器属性，会无条件的为任何`get` 和`set` 请求抛出`TypeError` 错误【这种访问器属性称为**毒丸访问器（poison pill accessor**）】，并且除了非严格的（**non-strict**）普通函数外，这种抛出错误的实现（implementations）不允许被更改。而关于`Function.prototype.arguments` 行为规范的实际实现，谷歌浏览器是在`Function` 的实例上定义了一个`arguments` 自有属性（[上述划线的不正确](../%E5%87%BD%E6%95%B0%EF%BC%88Function%EF%BC%89.md)），而火狐和Safari浏览器扩展了**最初的毒丸访问器**(**initial poison-pill `Function.prototype.arguments` accessor**) 以专门处理非严格函数的值
    
    ```jsx
    (function f() {
      if (Object.hasOwn(f, "arguments")) {
        console.log(
          "arguments is an own property with descriptor",
          Object.getOwnPropertyDescriptor(f, "arguments"),
        );
      } else {
        console.log(
          "f doesn't have an own property named arguments. Trying to get f.[[Prototype]].arguments",
        );
        console.log(
          Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(f),
            "arguments",
          ).get.call(f),
        );
      }
    })();
    // 在谷歌浏览器中的打印
    arguments is an own property with descriptor 
    {value: Arguments(0), writable: false, enumerable: false, configurable: false}
    // 在火狐浏览器中的打印
    f doesn't have an own property named arguments. Trying to get f.[[Prototype]].arguments
    Arguments { … }
    
    ```
    
    - 上面的`.get.call(f)`,是获取了`Function.prototype.arguments` 的属性标识符后直接调用其中的`get` 方法得到的结果
    - 注意在node（v16.14.0）环境下，打印和谷歌浏览器类似

## 2.2 `Function.prototype.caller`

- 这是一个**不建议使用（Deprecated）**并且**不是标准（Non-standard）**的函数对象原型属性
- `Function` 对象的`caller`访问器属性**表示调用当前正在执行的的函数的函数**。在严格模式下，异步函数，生成器函数的调用者（caller），访问`caller` 属性时会抛出异常
- 注意函数体内的`arguments` 对象实现了`caller` 属性（为了与函数的`caller` 分清而故意为之），但是始终为`undefined` ，严格模式下访问`arguments.caller` 会抛出异常

### 2.2.1 一个典型的例子

```jsx
function outer() {
  inner(arguments.callee);
}

function inner() {
  console.log(**inner.caller**);
  console.log(**inner.caller === arguments[0]**);
}
outer(); 
// [Function: outer]
// true

```

- `arguments.callee` 就是`outer` 函数对象本身，它与`inner.caller` 相等，因为`inner.caller` 是调用当前执行函数时所在作用域的函数，`outer` 在函数体内调用了`inner` ，所以`inner.caller` 就是`outer` 函数对象本身

### 2.2.1  理解`caller`

- 和`Function.prototype.arguments` 类似，ECMAScript规范指出`Function.prototype` 包含一个初始化的`caller` 访问器属性，它无条件的为任何`get` 或`set` 请求抛出`TypeError` 异常，这种属性访问器称为**毒丸访问器**（**poison pill accessor**），并且`caller` 的这种实现除了非严格的普通函数，不允许任何函数修改其语义
- `Function.prototype.caller` 的实际行为是由环境的具体**实现有关**的（**implementation-defined**）；谷歌浏览器实现ECMAScript规范的`caller` 属性时，会在函数对象中定义一个自有的数据属性，默认为`null`； 而火狐浏览器和Safari浏览器扩展了**最初的毒丸访问器**(**initial poison-pill `Function.prototype.arguments` accessor**) 以专门处理非严格函数的值
    
    ```jsx
    (function f() {
      if (Object.hasOwn(f, "caller")) {
        console.log(
          "caller is an own property with descriptor",
          Object.getOwnPropertyDescriptor(f, "caller"),
        );
      } else {
        console.log(
          "f doesn't have an own property named caller. Trying to get f.[[Prototype]].caller",
        );
        console.log(
          Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(f),
            "caller",
          ).get.call(f),
        );
      }
    })();
    // 在谷歌浏览器中的打印
    caller is an own property with descriptor 
    {value: null, writable: false, enumerable: false, configurable: false}
    // 在火狐浏览器中的打印
    f doesn't have an own property named caller. Trying to get f.[[Prototype]].caller
    null
    ```
    

## 2.3 `Function.prototype.displayName`

- 一个函数对象可选的原型属性，返回函数对象的函数**昵称**（**displayName**）

<aside>
💡 注意：这个原型属性不是标准（non-standard），不要在生成环境下使用它（并不是每个浏览器都支持该属性）。在未来它的实现和行为可能因为兼容性的问题而被改变

</aside>

### 2.3.1 理解`displayName`

- 这个属性最初不会出现在任何函数上，它是开发者自定义添加的
- 如果属性存在，控制台（consoles）或解析器（profilers）**可能**优先使用`displayName` 而不是`name`属性来表示函数名称
- 实际上也就火狐浏览器的控制台应用（utilizes）了这个属性。React devtools也使用了`displayName` 属性用于清晰的显示组件树（React中有函数组件）
- 并且火狐浏览器还尝试对`displayName` 进行解码（decode），依照[anonymous JavaScript functions naming convention](http://johnjbarton.github.io/nonymous/index.html)
 algorithm （一种字符识别算法），将包含特殊字符的`displayName` 进行转义

### 2.3.2 例子

```jsx
function foo() {}

function testName(name) {
  foo.displayName = name;
  console.log(foo);
}

testName("$foo$"); // function $foo$()
testName("foo bar"); // function bar()
testName("Foo.prototype.add"); // function add()
testName("foo ."); // function foo .()
testName("foo <"); // function foo <()
testName("foo?"); // function foo?()
testName("foo()"); // function foo()()

testName("[...]"); // function ...()
testName("foo<"); // function foo()
testName("foo..."); // function foo()
testName("foo(^)"); // function foo()
```

- 上述打印**仅在**火狐浏览器的控制台生效，谷歌和node环境下，`displayName` 由于不是标准并没有被实现，显示的名称仍然是原始的`foo`

## 2.4 `Function.prototype.length`

- `length` 属性表示函数对象定义时的**形式参数**（parameter）数量，它是一个可配置不可写，不可枚举的参数

### 2.4.1 理解`length`

- 函数对象的`length` 属性表示函数被调用时期望传递的参数个数，也就是形式参数个数
- 这个数量并不包括**收集参数**（**rest parameter，查看[6.2 收集参数（Rest Parameter）](../6%20%E5%8F%82%E6%95%B0%E6%89%A9%E5%B1%95%E4%B8%8E%E6%94%B6%E9%9B%86%EF%BC%88Spread%20Arguments%20and%20Rest%20Parameters%EF%BC%89.md)** ）,并且只包括第一个具有默认值之前的参数个数（就是有默认值的参数极其之后的参数都不计入期待传递的参数数量中）
- 与函数对象本身的`length` 相比，函数内部的`arguments` 对象的`length` 属性表示实际传入的**参数个数**（**number of arguments**）【注意这里传递参数使用arguments而不是parameters，表示[实际参数](../6%20%E5%8F%82%E6%95%B0%E6%89%A9%E5%B1%95%E4%B8%8E%E6%94%B6%E9%9B%86%EF%BC%88Spread%20Arguments%20and%20Rest%20Parameters%EF%BC%89.md)】
- `Function` 构造函数本身的`length` 属性值为1（由`Function`构造函数的语法可知，必填的参数只有一个，其它的都是可选的）
- 由于历史原因，`Function.prototype` 对象本身就是**可调用的**（**callable**），它的`length` 属性值为0

### 2.4.2 例子

```jsx
console.log(Function.length); // 1
console.log(Function.prototype.length); // 0

console.log(function (a, b) {}.length); // 2
console.log(((a) => {}).length); // 1

console.log(((a, ...rest) => {}).length); // 1
console.log(((a, b = 1, c, ...rest) => {}).length); // 1
```

## 2.5 `Function.prototype.name`

- ES6新增的表示函数对象名称的属性`name`，它被初始化为 定义函数时使用在`function`关键字后的名称标识符，或初始赋值的变量的标识符，否则要么是`anonymous` （匿名）要么是空字符串
- `name` 是可配置的不可写不可枚举属性

### 2.5.1 理解`name`

- 函数的`name` 属性可用于在**调式工具**（**debugging tools**）或错误信息中**标识函数（identify function）**
- 函数名称标识符本身**不具有语义意义**（**semantic significance**）
    - 实际上递归函数中递归调用本身时使用的标识符不完全等同于函数名称，等同于保存函数对象的变量标识符
    - 一旦保存函数对象的变量标识符不再和函数名称一致，就会导致函数名称不能等价与自身
- 函数对象的`name` 属性是不可写的，但是能通过`Object.defineProperty()` 修改[[Writable]]特性后进行修改
- `name` 的属性值是从函数的定义方式**推断**（**inferred**）出来的（例如是`Function` 构造函数创建的函数对象默认使用`anonymous` 作为函数名称）

### 2.5.2 例子

**函数声明**

```jsx
function doSomething() {}
console.log(doSomething.name); // doSomething
let temp = doSomething;
doSomething = null;
console.log(temp.name); // doSomething
```

**node环境下的方法在一个文件中导出方法，方法名称为空字符串（打印显示为匿名函数）**

```jsx
// a.js
// export
exports.test = function () {
  return false;
};
// b.js
const someModule = require("./10.0.2.5 Function.prototype.name");
console.log(someModule.test.name === ""); // true
console.log(someModule.test); // [Function (anonymous)]
```

**浏览器环境下使用ES6语法导出默认方法，方法名称为default**

```jsx
// module.js
export default function() {
  console.log("1");
}
// main.js
import someModule from "./module.js";
console.log(someModule.name); // default
```

`**Function` 构造函数创建的函数对象的`name` 属性值为`anonymous`**

```jsx
console.log(new Function().name); // anonymous
```

函数表达式分两种情况：如果使用命名函数表达式，函数名称就是命名标识符；匿名函数表达式的函数名称默认为空字符串，除非在定义时就赋值为一个变量，该变量标识符会作为匿名函数表达式的名称

```jsx
console.log(function hello() {}.name); // hello
console.log(function () {}.name); // 空字符串
let k = function () {}; 
console.log(k.name); // k
```

<aside>
💡 注意箭头函数的名称和匿名函数表达式创建的函数名称行为一致

</aside>

---

在对象中声明的方法(method)的`name` 属性和变量声明时的行为一致（优先使用命名函数标识符，之后再使用属性标识符）

```jsx
// 方法
const o = {
  someMethod: function a() {
    return false;
  },
  someMethod2: function () {
    return true;
  },
  someMethod3() {
    return true;
  },
};
console.log(o.someMethod.name); // a
console.log(o.someMethod2.name); // someMethod2
console.log(o.someMethod3.name); // someMethod3
```

通过解构（[destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value)）语法，默认参数值(deault parameters)，类域中获取的函数将继承**绑定标识符（the bound identifier）**作为名称

```jsx
const [f = () => {}] = [];
console.log(f.name); // f

const { someMethod: m = () => {} } = {};
console.log(m.name); // m

function foo(f = () => {}) {
  console.log(f.name); // f
}
foo();

class Foo {
  static someMethod = () => {};
}
console.log(Foo.someMethod.name); // someMethod
```

通过`bind()` 方法生成的绑定指定`this` 的函数名称会在原函数的名称加上`bound` 字符串

```jsx
console.log(foo.bind({}).name); // bound foo
```

访问器属性的`setter`和`getter` 方法的函数名称会加上`set`或`get`

```jsx
// setter
const obj = {
  set prop(v) {},
  get prop() {},
};

const descriptors = Object.getOwnPropertyDescriptors(obj);
console.log(descriptors.prop.get.name); // get prop
console.log(descriptors.prop.set.name); // set prop
```

类的底层依靠函数的原型，所以类的名称的和函数名称类似，根据声明方式而有所不同

```jsx
class A {}
const B = class C {};
class D {
  static name = "ABCD";
}
// node环境下的打印
console.log(A.name);  // A
console.log(B.name);  // C
console.log(D.name);  // ABCD
console.log(A); // [class A] {}
console.log(B); // [class C] {}
console.log(D); // [class ABCD] {}
```

<aside>
💡 注意：在类中定义名称为`name` 的静态属性会与底层的函数实现`name` 冲突，在node环境下打印出来的结果和浏览器环境下的结果有区别（浏览器按照class D处理而node环境按照class ABCD处理）；在类中定义`name` 为一个函数时，就无法使用`name` 标识类名称了，所以不要依赖`name` 属性来表示类名称

</aside>

当符号作为函数对象的`name` 值时，标识符号的字符串包裹中括号（square brackets）将作为函数名称（仍然是字符串），如果是匿名函数，依旧是空字符串

```jsx
const sym1 = Symbol();
const sym2 = Symbol("foo");
const obj2 = {
  [sym1]() {},
  [sym2]() {},
};
console.log(obj2); 
// {
  // [Symbol()]: [Function (anonymous)],
  // [Symbol(foo)]: [Function: [foo]]
// }
console.log(obj2[sym1].name); // 空字符串
console.log(obj2[sym2].name); // [foo]
```

类中的私有属性（**Private property**）值是匿名函数的情况

```jsx
class F {
  #field = () => {};
  #method() {}
  getNames() {
    console.log(this.#field.name);
    console.log(this.#method.name);
  }
}
new F().getNames() 
// #field
// #method
```

### 2.5.3 注意事项-JavaScript压缩器（compressor）与精简器（minifier）

- 在现代Web前端开发中，JavaScript代码往往会被压缩打包成更小的体积，提高运行性能，为了让文件体积更小，会将一个作用域小的所有标识符按照一定规则进行替换，如`Foo` 函数标识符占用3个字符，为了节省空间可能就用一个字符`F` （也可能是其他的）表示
- 需要注意的是，谨慎在需要进行**转化**（**transformations，**即使用JavaScript压缩器和精简器进行压缩和丑化）的源代码中使用`name` 属性，因为这些转化工具通常作为JavaScript**构建管道**（**build pipeline**）的一部分在程序部署到生产之前减少程序的大小，就也是说`name` 属性值会被连带修改
- 最典型的不合理使用是将`name` 属性值作为判断依据执行不同的代码，如下
    
    ```jsx
    // 不要使用name属性值
    function Bar() {}
    const bar = new Bar();
    if (bar.constructor.name === "Bar") {
      console.log("bar is an instance of Bar");
    } else {
      console.log("Oops");
    }
    ```
    
    - 它使用`name` 的属性值作为判断依据，如果程序被压缩，可能变成如下代码
    
    ```jsx
    // 不要使用name属性值
    function a() {}
    const b= new a();
    if (b.constructor.name === "Bar") {
      console.log("bar is an instance of Bar");
    } else {
      console.log("Oops");
    }
    ```
    
    - 在未压缩版本中，`Bar()` 函数的名称就是`"Bar"` 打印`"bar is an instance of Bar"`
    - 但是在压缩版本中，`Bar()`函数 的标识符被压缩为`a` ，也就是说`a()` 函数在被JavaScript执行时，它的函数名称会变为`a`，这个时候`b.constructor.name === "Bar"` 返回`false`， 打印`"Oops"`
- 所以使用`name` 属性可能导致生产环境和运行环境下的运行结果不同，需要谨慎使用；如果代码一定要依赖`name` 属性，需要确保**构建管道**（**build pipeline**）没有更改函数名，或者不要假定函数有一个特定（**particular**）的名称

## 2.6 `Function.prototype.prototype`

- `Function.prototype.prototype` 的值本身是`undefined` ，这里指的是**函数对象的自有属性，**这个`prototype`属性被用在函数作为**构造函数**（**constructor**）使用`new` 操作符实例化对象时，新对象的[[Prototype]]隐藏属性会被赋值构造函数的`prototype` 以继承原型方法和原型属性
- 函数对象的自有属性`prototype` 属性是可写的不可配置不可枚举的数据属性，不也是所有函数对象都有`prototype` 属性（箭头函数就没有`prototype` 属性）

### 2.6.1 理解`prototype` 属性

- 当使用`new` 操作符调用函数时，构造函数的`prototype` 属性会作为结果对象的原型（[[Prototype]]）
- **具有`prototype` 属性的函数并不足以使其具有作为构造函数的资格（eligible），**例如`Generator` 函数（生成器）具有`prototype` 属性，但是它不能通过`new` 调用
    - 生成器函数的`prototype` 属性在正常调用（不使用`new`）时被使用，生成器函数的`prototype` 会成功其返回值（生成器对象）对象的[[Prototype]]隐藏属性值
        
        ```jsx
        function* Generator() {
          yield* [1, 2, 3];
        }
        
        const iterator = Generator();
        console.log(iterator.__proto__ === Generator.prototype); // true
        ```
        
- 还有些内置函数具有原型但是在用`new` 调用时会无条件抛出异常，如`Symbol()` 函数，它用于生成符号实例，`BigInt()` 函数，用于将number类型值转化为BigInt类型，它们都具有`prototype` 属性但是仅用于为对应的原始值（符号和BigInt类型值）提供方法，不能使用`new` 调用
    
    ```jsx
    const sym = Symbol("123");
    const bigint = BigInt(123);
    console.log(sym); // Symbol(123)
    console.log(bigint); // 123n
    ```
    
- 箭头函数因为没有`prototype` 属性无法作为构造函数，即使为箭头函数本身**手动分配**（**manually assigned**）一个`prototype` 对象也无法作为构造函数
    
    ```jsx
    // 箭头函数不具有prototype所以不能作为构造函数(即使进行自定义)
    const arrow = () => {};
    console.log(arrow.prototype);
    arrow.prototype = {
      constructor: arrow,
      __proto__: Object.prototype,
    };
    console.log(arrow);
    // <ref *1> [Function: arrow] {
     // prototype: { constructor: [Circular *1] }
    // }
    try {
      const o = new arrow();
    } catch (error) {
    	console.log(error.toString()); // TypeError: arrow is not a constructor
    }
    ```
    
- **绑定函数**（**bound functions**）没有`prototype` 属性，但是它可能是**可构造的**（**constructable**）。使用一个绑定函数作为构造函数时，实例原型使用原始函数的`prototype` 属性（如果原始函数不可构造就不能使用`new` 操作符调用绑定函数了）
    
    ```jsx
    // 绑定函数不具有prototype，但是可能是可构造的
    function a() {}
    const boundFunc = a.bind(null);
    console.log(boundFunc.prototype); // undefined
    const b = new boundFunc();
    console.log(b); // a {}
    console.log(b.__proto__ === a.prototype); // true
    ```
    
- 函数对象的`prototype` 属性值是一个只有`constructor` 属性的**普通对象**（**plain object**），`constructor` 属性引用函数对象本身，`constructor`是一个可写、不可枚举、可配置的属性（普通对象的意思就是它具有[[Prototype]]特性属性）
- 如果一个函数对象的`prototype` 属性值被**重新赋值**（**reassigned**） 为非对象的值（原始数据类型），当使用`new` 操作符调用这个函数对象创建实例时，新实例的原型（[[Prototype]]）不会是函数对象的`prototype` 而是使用`Object.prototype` 替代（换句话说，`new` 操作符会忽略函数对象的`prototype` 属性值为非对象而使用`Object.prototype` 作为新对象的原型）
    
    ```jsx
    function foo() {}
    foo.prototype = 3;
    const f = new foo();
    console.log(foo.prototype); // 3
    console.log(f.__proto__ === Object.prototype); // true
    ```
    

### 2.6.2 例子

**为类添加非方法（non-method）原型属性**

- 类是ES6实现构造函数和继承的语法糖，所以其底层实现就是函数和原型链，通过给类的原型（**prototype**）添加属性就能给每个类实例添加原型([[Prototype]])属性了
    
    ```jsx
    class Dog {
      constructor(name) {
        this.name;
      }
    }
    Dog.prototype.species = "dog";
    
    console.log(new Dog("Jack").species);
    ```
    
- 使用[类静态初始化块（Class static initalization blocks）](../../8%20%E5%AF%B9%E8%B1%A1%E3%80%81%E7%B1%BB%E4%B8%8E%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/4%20%E7%B1%BB/%E7%B1%BB%E9%9D%99%E6%80%81%E5%88%9D%E5%A7%8B%E5%8C%96%E5%9D%97%EF%BC%88Class%20static%20initalization%20blocks%EF%BC%89.md) 会使得这种添加更加**人性化**（**ergonomic**），因为使用类静态初始化块能在声明类时就能定义原型属性
    
    ```jsx
    class Dog2 {
      constructor(name) {
        this.name = name;
      }
      **static {
        this.prototype.species = "dog";
      }**
    }
    console.log(new Dog2("Jack").species);
    ```
    
    - 类静态初始化块中的`this` 就是类本身