# Reflect

# 1. 定义

- `Reflect` 是一个内置的JavaScript对象，它为**可被拦截的**（**interceptable**）JavaScript操作（operations）提供原始方法
- 这些方法和`[proxy handler](../1%20%E4%BB%A3%E7%90%86%E5%9F%BA%E7%A1%80.md)` 能使用的**捕获器**（trap）名称是一样的
- `Reflect` 并不是一个函数对象，它是**不可构造的**（**not constructible**）

# 2. 理解Reflect

**只包含静态方法**

- 不像其他内置对象，`Reflect` 不是构造函数，不能使用`new`操作符对它进行调用创建实例
- `Reflect`上所有的属性和方法都是**静态的**（**static**），就像`Math`内置对象

**Object和Proxy相关**

- `Reflect` 对象提供的静态方法和**代理的处理程序对象的方法**（**proxy handler methods**）有相同的方法名称
- `Reflect` 在`Object` 对象上也有一些对应的方法，但是方法的具体实现有**细微的区别**（**some subtitle differences**）
    - 关于细微区别在介绍完全部方法后说明

# 3. 静态方法

## 3.1 `Reflect.apply()`

- 调用带有指定参数的目标函数

### 3.1.1 语法

```jsx
Reflect.apply(target, thisArgument, argumentsList)
```

- 参数：
    - `target` ： 被调用的目标函数
    - `thisArgument` : 调用`target` 时指定的`this`值
    - `argumentsList` ： 目标函数的参数，以数组形式统一传递
- 返回值：`target` 目标函数给定`this`和参数后调用返回结果
- 异常：如果`target`不是可调用的对象会抛出`TypeError` 错误

### 3.1.2 理解`Reflect.apply()`

- 在ES5中，通常使用`Function.prototyp.apply()` 在指定`this` 和参数数组（**array-like arguments**）后调用
    
    ```jsx
    Function.prototype.apply(Math.floor, undefined, [1.75]) // 1
    ```
    
- 有了Reflect就变的不那么冗长，且更容易理解

### 3.1.3 例子

```jsx
let str = Reflect.apply(
  String.fromCharCode,
  undefined,
  [104, 101, 108, 108, 111]
);
console.log(str); // hello
```

## 3.2 `Reflect.construct()`

- `Reflect.construct()` 的行为表现的和`new`操作符一样 ，它能调用构造函数，但是也是本身是一个函数
- 使用`Reflect.construct()` 和`new target(…args)` 是一样的，但`Reflect.construct()` 除了能调用构造函数外，还能给提供额外的参数去指定新实例的原型

### 3.2.1 语法

```jsx
Reflect.construct(target, argumentsList);
Reflect.construct(target, argumentsList, newTarget);
```

- 参数：
    - `target` 用于创建新对象的目标构造函数
    - `argumentsList` ,数组形式的参数，会作为参数被传递进目标构造函数
    - `newTarget` :可选参数，另外的构造函数，它的`prototype` 属性会被当作新实例的原型。如果没有传递（present）`newTarget` 那么默认使用`target` 的原型
- 返回值：一个`target` 或（如果传递了的`newTarget` ）的实例（instance），使用`target` 函数作为构造函数，给定`argumentsList` 作为参数被初始化
- 异常： 如果`target` 或`newTarget` 不是构造函数就会抛出`TypeError` 错误

### 3.2.2 理解`Reflect.construct`

- 允许开发者使用参数数组调用构造函数（在使用new操作符调用构造函数也可以使用扩展操作符(spread syntax)实现）
    
    ```jsx
    const obj = new Foo(...args);
    const obj = Reflect.construct(Foo, args);
    ```
    

`**Reflect.construct() vs Obejct.create()`** 

- 在引入`Reflect` 前，可以使用`Object.create()` 组合任意的构造函数和原型构造对象
    
    ```jsx
    // 可以指定原型
    function OneClass() {
      this.name = "one";
    }
    function OtherClass() {
      this.name = "other";
    }
    
    // 使用construct构造一个OneClass实例，使用OtherClass.prototype作为原型
    const obj1 = Reflect.construct(OneClass, [], OtherClass);
    
    // 使用Object.create创建
    const obj2 = Object.create(OtherClass.prototype);
    OneClass.apply(obj2);
    
    console.log(obj1); // OtherClass { name: 'one' }
    console.log(obj2); // OtherClass { name: 'one' }
    
    console.log(obj1 instanceof OneClass); // false
    console.log(obj2 instanceof OneClass); // false
    
    console.log(obj1 instanceof OtherClass); // true
    console.log(obj2 instanceof OtherClass); // true
    ```
    
    ![tianruo_2022-9-23-637995693423861301.png](Reflect/tianruo_2022-9-23-637995693423861301.png)
    
    - 两个对象的原型都是`OtherClass.prototype` ，盗用`OneClass`构造函数s使得二者有相同的自有属性
- 虽然最终的构造的两个对象的结构一样，但是在构造过程中有一个**重要的区别**
    - 使用`Object.create()`和`Function.prototype.apply()` 时，`new.target` 操作符指向的是`undefined` ，因为创建对象和调用`OneClass()` 的后过程都没有是`new`操作符
    - 但是通过`Reflect.construct()` 创建对象时，虽然没有显式的使用`new` 操作符，但是其实现底层是使用`new` 调用了构造函数，如果传递了`newTarget`参数，那么`new.target` 就指向`newTarget` ,否则指向`target`

```jsx
function OneClass() {
  this.name = "one";
  console.log("OneClass");
  console.log(new.target);
}
function OtherClass() {
  this.name = "other";
  console.log("OtherClass");
  console.log(new.target);
}

// 使用construct构造一个OneClass实例，使用OtherClass.prototype作为原型
const obj3 = Reflect.construct(OneClass, [], OtherClass); // OneClass [Function: OtherClass]

// 使用construct构造一个OneClass实例，
const obj4 = Reflect.construct(OneClass, []); // OneClass [Function: OneClass]

// 使用Object.create创建
const obj5 = Object.create(OtherClass.prototype);
OneClass.apply(obj5); // OneClass undefiend

console.log(obj3); // OtherClass { name: 'one' }
console.log(obj4); // OneClass { name: 'one' }
console.log(obj5); // OtherClass { name: 'one' }
```

## 3.3 `Reflect.defineProperty()`

- 和Object.defineProperty()类似，但是返回**布尔值**

### 3.3.1 语法

```jsx
Reflect.defineProperty(target, propertyKey, attributes)
```

- 参数
    - `target` 定义属性的目标对象
    - `propertyKey` 被定义或修改的属性名称
    - `attributes` : 被定义或修改的属性特性
- 返回值：布尔值，表示属性是否被成功定义或修改
- 异常：`target` 不是对象会抛出`TypeError`

### 3.3.2 理解`Reflect.defineProperty()`

- 其功能和`Object.defineProperty()`类似 ,用于对对象属性进行**精确**的（**precise**）修改或添加
- 唯一与`Object.defineProperty()` 的区别在于如果定义或修改失败，`Reflect.defineProperty()` 会返回布尔值表达，而`Object.defineProperty()` 会直接抛出`TypeError` 错误

### 3.3.3 例子

```jsx
const obj = {};

if (
  Reflect.defineProperty(obj, "prop", {
    value: "prop",
    writable: false,
    configurable: false,
    enumerable: true,
  })
) {
  console.log("定义成功");
  console.log(obj);  // { prop: 'prop' }
} else {
  console.log("定义失败");
}
```

- `Reflect.defineProperty()` 相较于`Object.defineProperty()` 的好处就在这里，可以直接使用判断语句进行处理，而不需要使用try…catch 块考虑定义失败的情况

## 3.4 Reflect.deleteProperty()

- `delete` 操作符的方法表示，`Reflect.deleteProperty()` 能删除对象的指定属性

### 3.4.1 语法

```jsx
Reflect.deleteProperty(target, propertyKey)
```

- 参数：
    - `target` 被删除属性的源对象
    - `propertyKey` :被删除属性的名称
- 返回值： 布尔值，表示对象的属性是否删除成功
- 异常：如果`target` 不是对象会抛出`TypeError` 错误

### 3.4.2 理解Reflect.deleteProperty()

- `Reflect.deleteProperty()` 方法的功能和**非严格**（**non-strict**）的`delete` 操作符功能相同

### 3.4.3 例子

```jsx
const obj = { x: 1, y: 2 }; 
console.log(Reflect.deleteProperty(obj, "x")); // true
console.log(obj); // {y: 2}

console.log(Reflect.deleteProperty(Object.freeze(obj), "y")); // 不能删除成功 因为属性变为不可配置的了
```

## 3.5 `Reflect.get()`

- 静态方法`Reflect.get()` 能从一个对象中获取属性值，它和`target[property]` 具有一样的功能，但是是函数（function）形式

### 3.5.1 语法

```jsx
Reflect.get(target, propertyKey);
Reflect.get(target, propertyKey, receiver);
```

- 参数
    - `target` : 被获取指定属性值的目标对象
    - `property` : 要获取的属性名称
    - `receiver` : 如果`target`对象中指定了`getter` ，那么`receiver` 则会称为调用`getter` 时的`this`值。如果和代理（proxy）一起使用，那么`receiver` 可以是继承`target` 的对象
- 返回值：目标对象的属性值
- 异常：如果`target`不是对象，就会抛出`TypeError`

### 3.5.2 理解Reflect.get()

- 和使用**属性访问器**（**property accessor**）语法（即句点访问和中括号访问法）具有一样的功能，用于获取对象的属性值，只不过是函数（function）形式
- 唯一的区别只是在属性具有`getter` （访问器属性）时，可以指定`getter` 方法执行时的`this`值

### 3.5.3 例子

- 传入`receiver`, 访问器属性中的`getter`this被替换为`receiver`而不是目标对象
    
    ```jsx
    const a = {
      x_: 1,
      get x() {
        console.log("a");
        return this.x_;
      },
      set x(val) {
        this.x_ = val;
      },
    };
    const b = {
      x_: 2,
      get x() {
        console.log("b");
        return this.x_;
      },
      set x(val) {
        this.x_ = val;
      },
    };
    console.log(Reflect.get(a, "x", b)); // a 2
    ```
    
    - 可以看到调用的还是`a`中`x` 访问器属性的`getter` ，但获取的`this.x_` 却是`b`中`x_` ，因为`this`被指定为了b
- 和**代理**一起使用,在代理中定义`get` 捕获器，那么使用`Reflect.get()` 通过代理获取目标对象的属性值时，捕获器的`receiver` 就会从默认的代理对象变为`Reflect.get()` 提供的`receiver`
    
    ```jsx
    const obj1 = {
      message: "hello",
    };
    
    const obj2 = {
      message: "world",
    };
    
    const proxy = new Proxy(obj1, {
      get(target, prop, receiver) {
        return target[prop] + ", " + receiver[prop];
      },
    });
    
    console.log(Reflect.get(proxy, "message", obj2)); // hello, world
    ```
    
    - 因为传递`obj2` 作为`receiver` ，所以关联了`obj1` 的代理`proxy` 拦截了获取属性值的操作后，返回了源对象(obj1)和`receiver` (obj2) 的`message` 属性值构成的一个字符串
    - 如果没有传递`obj2` 上述例子会进入死循环而报错，因为`receiver` 默认是代理，而在拦截重定义的`get()` 中执行`receiver[prop]` 会递归调用`get()` 获取属性值，因为没有递归退出条件，所以会报错

## 3.6 `Reflect.getOwnPropertyDescriptor()`

- 获取目标对象的的一个自有属性的属性描述符，功能和`Object.getOwnPropertyDescriptpor()`类似

### 3.6.1 语法

```jsx
Reflect.getOwnPropertyDescriptor(target, propertyKey)
```

- 参数：
    - `target` ：目标对象
    - `propertyKey`：获取属性描述符的对象的自有属性名称
- 返回值： 如果目标对象存在`propertyKey`  自有则返回其属性描述符，否则返回`undefined`
- 异常：如果`target` 不是一个对象就抛出`TypeError` 错误

### 3.6.2 理解`Reflect.getOwnPropertyDescriptor()`

- 与`Object.getOwnPropertyDescriptor()` 的功能类似，唯一区别在于对`target` 不是对象时的处理方式不同（Object获取自有属性的属性描述符会将原始数据类型转换为对应的包装对象）

### 3.6.3 例子

```jsx
try {
  console.log(Reflect.getOwnPropertyDescriptor("foo", "0"));
} catch (error) {
  console.log(error.message); // Reflect.getOwnPropertyDescriptor called on non-object
}
console.log(Object.getOwnPropertyDescriptor("foo", "0"));
// { value: 'f', writable: false, enumerable: true, configurable: false }
```

## 3.7 `Reflect.getPrototypeOf()`

- 和`Object.getPrototypeOf()` 的方法功能几乎相同，返回目标对象的原型（内置的[[Prototype]]属性）

### 3.7.1 语法

```jsx
Reflect.getPrototypeOf(target)
```

- 参数：`target` 被获取原型的目标对象
- 返回值：目标对象的原型，如果目标对象没有继承属性（inherited properties），那么会返回`null`
- 异常：`target` 不是对象时会抛出`TypeError`

### 3.7.2 理解Reflect.getPrototypeOf()

- 和`Object.getPrototypeOf()` 区别很小，唯一的区别在于Object获取`target`的原型时检查`target`类型是原始数据类型后会进行强制（coerce）类型转换（为包装类型）

### 3.7.3 例子

```jsx
try {
  Reflect.getPrototypeOf("foo");
} catch (error) {
  console.log(error.message); // Reflect.getPrototypeOf called on non-object
}
console.log(Reflect.getPrototypeOf("foo")); // {}   （String.prototype）
```

## 3.8 `Reflect.has()`

- `Reflect.has()` 相当于 `in` 操作符的函数形式，它能判断对象中是否存在指定的属性

### 3.8.1 语法

```jsx
Reflect.has(target, propertyKey)
```

- 参数
    - `target` 被查找属性的目标对象
    - `propertyKey` 要查找的属性名称
- 返回值： 布尔值，表示目标对象`target` 是否存在属性`propertyKey`
- 异常：如果`target` 不是对象，就会抛出`TypeError`

### 3.8.2 理解

- 和`in` 操作符基本没有区别，对于符号和非符号，枚举和不可枚举，自有还是原型等都可以判断出来

### 3.8.3 例子

- 继承于原型的属性也会检查出来

```jsx
const a = { foo: "a" };
const b = { __proto__: a };
const c = { __proto__: b };

console.log(Reflect.has(c, "foo")); // true
```

## 3.9 `Reflect.isExtensible()`

- `Reflect.isExtensible()` 用于确定对象是否可扩展（extensible，对象是否能添加新属性），它和`Object.isExtensible()` 类似，但是又一些不同之处

### 3.9.1 语法

```jsx
Reflect.isExtensible(target);
```

- 参数：`target` 被检查是否可扩展的目标对象
- 返回值：布尔值，表示对象是否可扩展
- 异常：如果`target`不是对象就会抛出`TypeError` 错误

### 3.9.2 理解Reflect.isExtensible()

- 和`Object.isExtensible()` 的区别在于，`target` 是非对象类型时，`Object.isExtensible()` 直接返回`false`，不会抛出任何错误

### 3.9.3 例子

```jsx
const empty = {};
console.log(Reflect.isExtensible(empty)); // true
Reflect.preventExtensions(empty); // 使对象不可扩展
console.log(Reflect.isExtensible(empty)); // false

const frozen = Object.freeze({});
const sealed = Object.seal({});
console.log(Reflect.isExtensible(frozen)); // false
console.log(Reflect.isExtensible(sealed)); // false
```

- `preventExtensions()` 是后面介绍的方法，就是让对象变得不可扩展
- 冻结对象和密封对象都是不可扩展的

## 3.10 `Reflect.ownKeys()`

- 获取对象的所有自有属性键(property keys)（包括符合属性和非符号属性）

### 3.10.1 语法

```jsx
Refelect.ownKeys(target)
```

- 参数：`target`  被获取所有自有属性键(property keys)的目标对象
- 返回值：由`target` 的所有自有属性键（property keys）组成的数组
- 异常：如果`target` 不是对象就会抛出`TypeError` 错误

### 3.10.2 理解`Reflect.ownKeys()`

- `Reflect.ownKeys()` 没有对应在`Object`中的静态方法，但是它的返回值等价于`Object.getOwnPropertyNames()` 和`Object.getOwnPropertySymbols()` 二者结合，即`[Object.getOwnPropertyNames(target)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames).concat([Object.getOwnPropertySymbols(target)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols))`

### 3.10.3 例子

```jsx
const obj = {
  [1]: 2,
  [Symbol("123")]: "123",
  name: "obj",
  x_: "x_",
  get x() {
    return this.x_;
  },
  0: 2,
  8: 7,
  set x(val) {
    this.x_ = val;
  },
};
console.log(Reflect.ownKeys(obj)); // [ '0', '1', '8', 'name', 'x_', 'x', Symbol(123) ]
```

- 可以观察到node(v18.9)环境下的属性的排序：数字升序，字符串插入顺序、符号插入顺序

## 3.11 `Reflect.preventExtensible()`

- `Reflect.preventExtensible()` 方法用于将对象变为不可扩展的对象，即不能再添加属性
- 它和`Object.preventExtensible()` 方法功能类似但是也有细微不同

### 3.11.1 语法

```jsx
Reflect.prventExtensible(target)
```

- 参数：`target` 被设置为不可扩展的对象
- 返回值：布尔值，表示是否成功设置对象不可扩展
- 异常：如股票`target` 不是对象就会抛出错误

### 3.11.2 理解

- `Object.preventExtensible()` 不会因为`target` 是非对象（non-object）而抛出错误（会不进行任何处理直接返回`target`），且其返回值为设置不可扩展后的对象
- 

### 3.11.3 例子

```jsx
const target = {};
console.log(Reflect.isExtensible(target)); // true
console.log(Reflect.preventExtensions(target)); // true
console.log(Reflect.isExtensible(target)); // false

const target2 = {};
console.log(Object.isExtensible(target2)); // true
console.log(Object.preventExtensions(target2)); // {}
console.log(Object.isExtensible(target2)); // false

try {
  console.log(Reflect.preventExtensions("123"));
} catch (error) {
  console.log(error.toString()); // TypeError: Reflect.preventExtensions called on non-object
}
console.log(Object.preventExtensions("123")); // 123
```

## 3.12 `Reflect.set()`

- 为对象设置键值对，就像句点和中括号调用赋值一样

### 3.12.1 语法

```jsx
Reflect.set(target, propertyKey, value)
Reflect.set(target, propertyKey, value, receiver)
```

- 参数
    - `target` ： 被设置键值对的目标对象
    - `propertyKey` : 要被设置值的属性键
    - `value` ： 属性值
    - `receiver`：可选如果对象属性有`setter` ，那么`setter`方法体内的`this`会被指向为`receiver`; 如果操作的对象是代理(**proxy**)，那么代理拦截`set` 操作后，代理的程序处理对象的捕获器的`receiver` 参数会被传递为本方法的`receiver`参数
- 返回值： 布尔值，表示键值对是否设置成功
- 异常：`target` 不是一个对象就会抛出`TypeError` 错误

### 3.12.2 理解`Reflect.set()`

- `Reflect.set()` 和对象属性赋值（property assignment）没有区别，就像属性访问器（property accessor）语法的函数形式
- 当`target`和`receiver` 不相同时，`Reflect.set()` 会使用`target` 的属性描述符（如果是访问器属性就找到[[Setter]]，如果是数数据数学就查找[[Writable]]）用于设置`receiver`中的属性

### 3.12.3 例子

```jsx
const target = {
  x_: 2,
  get x() {
    return this.x_;
  },
  set x(val) {
    this.x_ = val;
  },
};
Object.defineProperty(target, "prop", {
  value: "hello",
  writable: false,
  configurable: true,
  enumerable: true,
});
const receiver = {};

Reflect.set(target, "a", "a", receiver);
Reflect.set(target, "x", "x", receiver);
Reflect.set(target, "prop", "hello", receiver);
console.log(receiver); // { a: 'a', x_: 'x' }
console.log(target); // { x_: 2, x: [Getter/Setter], prop: 'hello' }
console.log(Object.getOwnPropertyDescriptors(receiver));
//  
{
  a: { value: 'a', writable: true, enumerable: true, configurable: true },
  x_: { value: 'x', writable: true, enumerable: true, configurable: true }
}
```

- 由打印结果可知， 在传递`receiver`后 设置的键值都是在`receiver` 对象上的，只是使用了`target` 对应属性上的属性描述符
    - 如果`target` 没有对应的属性描述符，如`a` ，那么相当于直接在`receiver` 上添加了对应数据属性
    - 如果`target` 有对应的属性描述符，是一个访问器属性，那么会调用这个方法器属性的`setter` 方法，其执行时`this` 指向`receiver`对象，如果访问器属性没有`setter` （只有`getter`），那么`receiver` 和`target` 都不会有任何键值对添加
    - 如果`target` 有对应的属性描述符，是一个数据属性，那么会检查该属性的[[Writable]]特性，如果为`true` ，则能正常在receiver上添加键值对，否则都不会有任何键值对添加
    
    ---
    
    - 注意上述的各种条件都是在`receiver` 没有对应的属性的情况下（即添加键值对），如果`receiver` 本身具有对应属性，则还需要考虑本身的属性描述符，不过情况就不可确定了，因为对于访问器属性而言，`target` 中的`setter` 可以自定义，如果`target` 的`setter` 使用`this.prop = val` 直接赋值，那么再判断`receiver` 中的`prop` 是访问器属性还是数据属性，进一步调用访问器属性的`setter` 或直接判断数据属性是否可读，但是`target` 中属性的`setter` 有其他的写法，就要具体情况具体分析了

## 3.13 Reflect.setPrototypeOf()

- 和`Object.setPrototypeOf()` 方法功能类似,除了返回值不同
- `Reflect.setPrototypeOf()`  用于设置指定的对象原型（内置[[Prototype]]属性）为另一个对象或`null`

### 3.13.1 语法

```jsx
Reflect.setPropertyOf(target, prototype)
```

- 参数
    - `target` : 被设置原型的目标对象
    - `prototype` : 目标对象的新原型，一个对象或`null`
- 返回值：布尔值，表示目标对象的原型是否被设置成功了
- 异常：如果`target`  不是一个对象,或`prototype` 不是对象或`null` ，就会抛出`TypeError` 异常

### 3.13.2 理解Reflect.setPrototypeOf()

- `Reflect.setPrototypeOf()` 返回布尔值表示是否成功设置对象原型，而`Object.setPrototypeOf()` 返回设置原型后的`target`

### 3.13.3 例子

```jsx
console.log(Reflect.setPrototypeOf({}, Object.prototype)); // true
console.log(Reflect.setPrototypeOf({}, null)); // 纯净对象 // true
let target = {};
Object.preventExtensions(target);
console.log(Reflect.setPrototypeOf(target, null)); // 不可扩展对象无法设置原型 // false

target = {};
let proto = Object.create(target); // proto是以target为原型的对象 
console.log(Reflect.setPrototypeOf(target, proto)); // 会形成原型链环 // false
```

- 不可扩展对象，封闭对象，冻结对象都不能设置原型
- 如果`prototype` 对象包含`target` 上的原型，那么`prototype` 不能设置为`target` 的原型，这会限制原型链环，是不被允许的

# 4. 比较Reflect方法和Object方法

`Reflect`内置对象为JavaScript对象提供了交互（interface）的方法

`Reflect`的一些 内置方法在Object对象上存在对应同名的方法，尽管二者功能类似，但是也有**细微**（**subtle**）的差别

下面是所有Object和Reflect都可用的（available）同名方法之间差别的表格，如果一个静态方法不存在于Object会被标记为N/A(反之亦然)

| Method Name(方法名称) | Object | Reflect |
| --- | --- | --- |
| defineProperty()  | 1. 返回值为传递给方法的目标对象
2. 属性没有被成功在对象上定义会抛出TypeError 错误 | 1. 返回值为布尔值，表示属性是否成功被定义在了目标对象上
2. 如果传入target 不是对象，会抛出TypeError 错误 |
| defineProperties() | 1. 返回值为传递给方法的目标对象
2. 属性没有被成功在对象上定义会抛出TypeError 错误 | N/A |
| has() | N/A | 1. 返回值为布尔值，表示属性是否存在于对象和其原型链上。
2. 功能和in 操作符类似（similar）
3. 如果传入target 不是对象，会抛出TypeError 错误 |
| get() | N/A | 1. 返回值是传入的属性的属性值
2. 如果传入target 不是对象，会抛出TypeError 错误 |
| set() | N/A | 1. 返回值是布尔值，表示属性的值是否在对象上被成功设置
2. 如果传入target 不是对象，会抛出TypeError 错误 |
| deleteProperty() | N/A | 1. 返回值是布尔值，表示属性是否在对象上被成功删除 |
| getOwnPropertyDescriptor() | 1. 返回给定对象的给定属性的属性描述符，如果不存在相应对象的自有属性，返回undefined
2.如果传入的第一个参数（目标对象）不是一个对象，会强制将其转化为对象，然后获取其指定的属性描述符 | 1. 返回给定对象的给定属性的属性描述符，如果不存在相应对象的属性，返回undefined
2. 如果传入的第一个参数不是一个对象，会抛出TypeError 错误 |
| getOwnPropertyDescriptors() | 1. 返回给定对象的所有自有属性的属性描述符组成的对象
2.如果传入的第一个参数（目标对象）不是一个对象，会强制将其转化为对象，然后获取其所有的自有属性描述符
3. 如果对象没有自有属性，返回空对象 | N/A |
| getPrototypeOf() | 1. 如果为对象设置成功了原型就返回对象
2. 如果传入的原型不是对象或null ，或传入的目标对象不是可扩展对象，会抛出TypeError 错误
3. 如果传入的目标对象是原始数据类型，会直接返回目标对象，不会进行任何操作 | 1. 返回一个布尔值表示目标对象是否成功被设置指定原型（包括目标对象是不可扩展对象的情况）
2. 如果传入的原型不是对象或null ，或传入的目标对象不是对象，会抛出TypeError 错误 |
| isExtensible() | 1. 返回布尔值表示对象是否可扩展
2. ES5中，如果第一个参数不是对象，会抛出TypeError 错误
3. 在ES2015（ES6）及之后，会将不是对象的第一个参数强制转化为不可扩展的普通对象，然后返回false | 1. 返回布尔值表示对象是否可扩展
2. 如果第一个参数不是对象，会抛出TypeError 错误 |
| preventExtensible()  | 1. 返回被设置为不可扩展的目标对象
2. ES5中，如果第一个参数不是对象，会抛出TypeError 错误
3. ES2015（ES6）及之后，非对象参数会被视为不可扩展的普通对象，返回传入的参数本身 | 1. 返回布尔值，表示目标对象是否被设置为了不可扩展的（重复设置不可扩展对象也会返回true）
2. 如果第一个参数不是对象，会抛出TypeError 错误 |
| keys() | 1. 返回目标对象的自有可枚举非符号属性组成的字符串数组
2. ES5中，如果第一个参数不是对象，会抛出TypeError 错误
3. 在ES2015（ES6）及之后，会将不是对象的第一个参数强制转化为对应的包装对象，然后获取自有可枚举非符号属性 | N/A |
| ownKeys() | N/A | 1. 返回目标对象中的自有属性构成的数组（包括符号属性，不可枚举属性）
2. 如果第一个参数不是对象，会抛出TypeError 错误 |