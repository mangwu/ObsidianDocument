# 2. 代理捕获器（Proxy Traps）与反射方法（Reflect Method）

代理可以捕获十三种不同的基本操作，这些操作有各自不同的反射API方法、参数、关联的ECMAScript操作和不变式（invariants）

有几种不同的JavaScript操作会调用同一个**捕获器处理程序**（**trap handler**），但是对于代理对象上执行的任何一种操作，只会有一个捕获处理程序被调用，不会存在重复调用的情况

只要在代理上调用，所有捕获器都会拦截它们对应的反射API操作

所有捕获器在第一结就简述过，如下

| trap(捕获器方法) | description（简单描述） |
| --- | --- |
| handler.apply() | 拦截源对象的函数调用 |
| handler.construct() | new 操作符的捕获器，new target 一定要合法才能被拦截，所以target 一般是构造函数或类（有[[Construct]]内部方法） |
| handler.defineProperty() | 拦截源对象定义属性的操作，它是Object.defineProperty() 的捕获器 |
| handler.deleteProperty() | 拦截源对象删除属性的操作，它是delete 操作符的捕获器 |
| handler.get() | 拦截源对象获取属性值的操作 |
| handler.getOwnPropertyDescriptor() | 拦截源对象获取属性的属性描述符的操作，他是Object.getOwnPropertyDescriptor() 的捕获器 |
| handler.getPrototypeOf() | 拦截源对象获取自身原型的操作，它是Object.getPrototypeOf() 的捕获器 |
| handler.has() | 拦截源对象判断是否存在某一属性的操作，它是in 操作符的捕获器 |
| handler.isExtensible() | 拦截源对象判断自身是否是可扩展的操作，它是Obejct.isExtensible() 的捕获器 |
| handler.ownKeys() | 拦截源对象获取自身所有属性（包括符号属性）的操作，它是Reflect.ownKeys() 的捕获器 |
| handler.preventExtensions() | 拦截源对象将自身变为不可扩展的操作， 它是Object.preventExtensions() 的捕获器 |
| handler.set() | 拦截对象设置属性值的操作 |
| handler.setPrototypeOf() | 拦截对象设置自身原型的操作，它是Object.setPrototypeOf()的捕获器 |

# 2.1 get()

- get()捕获器会在**获取（retrieve）属性值**的操作中被调用，对应方法位`Reflect.get()`

## 2.1.1 返回值

返回值无限制

## 2.1.2 拦截的操作

- [ ]  proxy.property
- [ ]  proxy[property]
- [ ]  Object.create(proxy)[property]
- [ ]  Reflect.get(proxy, property, receiver)

## 2.1.3 捕获器处理程序参数（Trap handler parameter)

- [ ]  `target`: 目标对象
- [ ]  `property` : 引用在目标对象上的字符串键属性（包括符号属性）
- [ ]  `receiver` ： 代理对象或继承代理对象的对象

## 2.1.4 捕获器不变式（Trap invariants）

- 如果`target.property` 不可写且不可配置，那么处理程序（handler）返回的值必须与`target.property`匹配
- 如果`target.property` 不可配置且[[Get]]特性为`undefined` ，处理程序（handler）的返回值也必须是`undefined`

## 2.1.5 例子

```jsx
const target = { foo: "bar" };
const proxy = new Proxy(target, {
  get() {
    console.log(arguments);
    return Reflect.get(...arguments);
  },
});
proxy.foo; // [Arguments] { '0': { foo: 'bar' }, '1': 'foo', '2': { foo: 'bar' } }
```

# 2.2 set()

- set()捕获器会在**设置**属性值（**asssin** a property value）的操作中被调用。对应的反射API方法为`Reflect.set()`

## 2.2.1 返回值

- 布尔值，`true` 表示成功设置，`false` 表示设置失败（严格模式下会抛出错误）

## 2.2.2 拦截的操作

- [ ]  proxy.property = value
- [ ]  proxy[property] = value
- [ ]  Object.create(proxy)[property] = value
- [ ]  Reflect.set(proxy, property, value, receiver)

## 2.2.3 捕获器处理程序参数

- [ ]  `target` : 目标对象
- [ ]  `property` ： 引用的目标对象上的字符串键属性（包括符号属性）
- [ ]  `value` ： 要赋值给属性的值
- [ ]  `receiver` ： 接受最初赋值（orginal assinment）的对象

## 2.2.4 捕获不变式

- 如果`target.property`不可写且不可配置，则不能修改目标属性的值
- 如果`target.property` 不可配置且[[Set]]特性为`undefined` ，则不能修改目标属性的值
- 在严格模式下，处理程序中返回false会抛出`TypeError` 错误

## 2.2.5 例子

```jsx
const target = {};
const proxy = new Proxy(target, {
  set() {
    console.log(arguments);
    return Reflect.set(...arguments);
  },
});

proxy.foo = "bar"; // [Arguments] { '0': {}, '1': 'foo', '2': 'bar', '3': {} }
```

# 2.3 has()

- has()捕获器会在in操作符中被调用。对应的`Refllect` API方法是`Reflect.has()`

## 2.3.1 返回值

- has()必须返回布尔值，表示属性是否存在，返回非布尔值会被转型为布尔值

## 2.3.2 拦截的操作

- [ ]  property in proxy
- [ ]  property in Object.create(proxy)
- [ ]  with(proxy) { (property); }
- [ ]  Reflect.has(proxy, property)
- 注意`with(){}` 语法在在第二章介绍过：[6.4 with语句](../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/6%204%20with%E8%AF%AD%E5%8F%A5.md)

## 2.3.3 捕获器处理程序参数

- [ ]  `target` ： 目标对象
- [ ]  `property` ： 引用的目标对象上的字符串键属性（包括符号属性）

## 2.3.4 捕获器不定式

- 如果`target.property` 存在且不可配置，则处理程序必须返回`true` （因为该属性不能被删除，一定存在）
- 如果`target.property` 存在且目标对象不可扩展，则处理程序必须返回`true` （因为不可扩展对象的属性是固定的）

## 2.3.5 例子

```jsx
const target = { foo: "bar" };
const proxy = new Proxy(target, {
  has() {
    return true;
  },
});
Reflect.preventExtensions(target); // 不可扩展
console.log("foo" in proxy); // true
console.log("bar" in proxy); // true
```

- 可以发现对于不可扩展的属性，不存在于属性上的属性值被拦截返回`true` 并不是捕获器不定式

# 2.4 defineProperty()

- `defineProperty()` 捕获器会在`Object.defineProperty()` 中被调用，对应的反射API方法为`Reflect.defineProperty()`

## 2.4.1 返回值

- 必须返回布尔值，表示属性是否被成功定义，返回非布尔值会被转换为布尔值

## 2.4.2 拦截的操作

- [ ]  Object.defineProperty(proxy, property, descriptor)
- [ ]  Reflect.defineProperty(proxy, property, descriptor)

## 2.4.3 捕获器处理程序参数

- [ ]  `target` ： 目标对象
- [ ]  `property` ： 引用的目标对象上的字符串键属性（包括符号属性）
- [ ]  `descriptor` ： 包含可选的enumerble、configurable、writable、value、get、set定义的对象

## 2.4.4 捕获器不定式

- 如果目标对象不可扩展，则无法定义属性
- 如果目标对象有一个可配置的属性，则不能添加同名的不可配置属性
- 如果目标对象有一个不可配置的属性，则不能添加同名的可配置属性

```jsx
const target = {};
Object.defineProperties(target, {
  foo: {
    configurable: false,
    value: "foo",
    writable: true,
    enumerable: true,
  },
  bar: {
    configurable: true,
    value: "bar",
    writable: true,
    enumerable: true,
  },
});
const proxy = new Proxy(target, {
  defineProperty(target, prop, value) {
    if (prop == "b") {
      target[prop] = value.value;
      return false;
    }
    if (prop == "foo") {
      Reflect.defineProperty(target, prop, value);
      return true;
    }
    if (prop == "bar") {
      Reflect.defineProperty(target, prop, value);
      return false;
    }
  },
});

try {
  Object.defineProperty(proxy, "b", {
    value: 2,
  });
} catch (error) {
  console.log("添加了新属性但是返回false必然报错：", error.message);
}

console.log(proxy);

try {
  Object.defineProperty(proxy, "foo", {
    configurable: true,
    value: "foo2",
    writable: true,
    enumerable: true,
  });
} catch (error) {
  console.log(
    "为不可配置属性添加同名可配置属性(返回true，false都会报错)",
    error.message
  );
}
console.log(proxy);

try {
  Object.defineProperty(proxy, "bar", {
    configurable: false,
    value: "bar2",
    writable: true,
    enumerable: true,
  });
} catch (error) {
  console.log(
    "为可配置属性添加同名不可配置属性（返回false才报错）",
    error.message
  );
}
console.log(proxy);
```

- 总结就是：如果拦截后实际添加（修改）成功了属性，就应该返回`true` ,如果实际没有添加（修改）成功属性，就应该返回`false`

# 2.5 getOwnPropertyDescriptor()

- 在`Object.getOwnPropertyDescriptor()` 中被调用，对应的反射API方法是`Reflect.getOwnPropertyDescriptor()`

## 2.5.1 返回值

- 必须返回对象，或者在属性不存在时返回`undefined`

## 2.5.2 拦截的操作

- [ ]  Object.getOwnpropertyDescriptor(proxy, property)
- [ ]  Reflect.getOwnpropertyDescriptor(proxy, property)

## 2.5.3 捕获器处理程序参数

- [ ]  `target` ： 目标对象
- [ ]  `property` : 引用在目标对象上的字符串键属性（包括符号属性）

## 2.5.4 捕获器不定式

- 如果自有的`target.property` 存在且不可配置的，则处理程序必须返回一个表示该属性粗存在的对象
- 如果自有的`target.property` 存在且可配置，则处理程序必须返回表示该属性可配置的对象
- 如果自有的`target.property` 存在且`target` 不可扩展，则处理器程序必须返回一个表示该属性存在的对象
- 如果`target.property` 不存在且`target` 不可扩展，则处理器程序必返回`undefined` 表示该属性不存在
- 如果`target.property` 不存在，则处理器程不能返回表示该属性可配置的对象

## 2.5.5 例子

```jsx
const target = {};
Object.defineProperties(target, {
  foo: {
    value: "foo",
    configurable: false,
    enumerable: true,
    writable: true,
  },
  bar: {
    value: "bar",
    configurable: true,
    enumerable: true,
    writable: true,
  },
  a: {
    value: "a",
    configurable: true,
    enumerable: true,
    writable: true,
  },
});
const proxy = new Proxy(target, {
  getOwnPropertyDescriptor(target, prop) {
    if (prop == "foo") {
      return undefined;
    }
    if (prop == "bar") {
      return {
        value: "bar",
        configurable: false,
        enumerable: true,
        writable: true,
      };
    }
    if (prop == "a") {
      return undefined;
    }
    if (prop == "b") {
      return {
        value: "bar",
        configurable: false,
        enumerable: true,
        writable: true,
      };
    }
    if (prop == "c") {
      return {
        value: "bar",
        configurable: false,
        enumerable: true,
        writable: true,
      };
    }
  },
});
try {
  Object.getOwnPropertyDescriptor(proxy, "foo");
} catch (error) {
  console.log("存在不可配置，必须返回存在的对象,结果返回undefined");
}

try {
  Object.getOwnPropertyDescriptor(proxy, "bar");
} catch (error) {
  console.log("存在可配置，必须返回可配置的对象，结果返回不可配置对象");
}
try {
  Object.getOwnPropertyDescriptor(proxy, "c");
} catch (error) {
  console.log("不存在target，不能返回可配置对象，结果返回不可配置对象");
}
Object.preventExtensions(target);

try {
  Object.getOwnPropertyDescriptor(proxy, "a");
} catch (error) {
  console.log("存在target不可扩展，必须返回存在的对象，结果返回undefined");
}

try {
  Object.getOwnPropertyDescriptor(proxy, "b");
} catch (error) {
  console.log("不存在target不可扩展，必须返回undefined，结果返回存在对象");
}
// 打印
存在不可配置，必须返回存在的对象,结果返回undefined
存在可配置，必须返回可配置的对象，结果返回不可配置对象
不存在target，不能返回可配置对象，结果返回不可配置对象
存在target不可扩展，必须返回存在的对象，结果返回undefined
不存在target不可扩展，必须返回undefined，结果返回存在对象
```

- 对上不变式的测试：对象不存在属性的情况可以返回可配置的对象，反而是返回不可配置的对象抛出错误（）
- 不变式的原则是：~~返回的属性描述符是在一定操作下能将指定属性的描述修改成返回属性描述符就不会报错，如果不能就必须返回合理的属性描述符~~ （书本没有提示这段话）

# 2.6 deleteProperty()

- deleteProperty()捕获器会在delete操作符中被调用，对应的反射API是`Reflect.deleteProperty()`

## 2.6.1 返回值

- 返回布尔值，表示删除属性是否成功，返回非布尔值会被转型为布尔值

## 2.6.2 拦截的操作

- [ ]  delete proxy.property
- [ ]  delete proxy[property]
- [ ]  Reflect.deleteProperty(proxy, property)

## 2.6.3 捕获器处理程序参数

- [ ]  `target` 目标对象
- [ ]  `property` : 引用的目标对象上的字符串键属性（包括符号属性）

## 2.6.4 捕获器不定式

- 如果自有的`target.property` 存在且不可配置，则处理程序不能删除这个属性

## 2.6.5 例子

```jsx
const target = {};

Object.defineProperties(target, {
  foo: {
    value: "foo",
    enumerable: true,
    writable: true,
    configurable: false,
  },
  bar: {
    value: "bar",
    enumerable: true,
    writable: true,
    configurable: true,
  },
});

const proxy = new Proxy(target, {
  deleteProperty(target, prop) {
    if (prop == "foo") {
      // 肯定是删除失败的因为不可配置
      delete target[prop];
      return false;
    }
    if (prop == "bar") {
      // 肯定能删除成功
      delete target[prop];
      // 但是返回false
      return false;
    }
    // 删除其它没有的属性返回true
    return true;
  },
});

try {
  delete proxy.foo;
} catch (error) {
  console.log("删除不可配置属性foo返回false，结果报错?", error.toString());
}
console.log(proxy);
try {
  delete proxy.bar;
} catch (error) {
  console.log("删除可配置属性bar返回false，结果报错?", error.toString());
}
console.log(proxy);

try {
  delete proxy.a;
} catch (error) {
  console.log("删除不存在属性返回true，结果报错?", error.toString());
}
console.log(proxy);
// 打印
{ foo: 'foo', bar: 'bar' }
{ foo: 'foo' }
{ foo: 'foo' }
```

- 上述例子没有一个报错，经过测试，对于不可配置属性，如果返回false，是不会报错的，可以得出结论
    - 只要在删除不可配置属性返回true的情况下才会报错

# 2.7 ownKeys()

- ownKeys()捕获器会在`Object.keys()` 及类似方法中被调用，对应的反射API方法是Reflect.ownKeys()

## 2.7.1 返回值

- 必须返回包含字符串或符号的可枚举对象

## 2.7.2 拦截的操作

- [ ]  Object.getOwnPropertyNames(proxy)   获取自有字符串属性（包括不可枚举）
- [ ]  Object.getOwnPropertySymbols(proxy)  获取自有符号属性（包括不可枚举）
- [ ]  Object.keys(proxy)   获取可枚举的自有属性（不包括符号属性）
- [ ]  Reflect.ownKeys(proxy) 获取自有属性（包括符号属性，不可枚举属性）

## 2.7.3 捕获器处理程序参数

- [ ]  `target`:目标对象

## 2.7.4 捕获器不变式

- 返回的可枚举对象必须包含target的所有不可配置的自有属性
- 如果target不可扩展，则返回可枚举对象必须准确地包含自有属性键

## 2.7.5 例子

```jsx
const target = {};
Object.defineProperties(target, {
  a: {
    value: "a",
    enumerable: true,
    configurable: false,
  },
});
const proxy = new Proxy(target, {
  ownKeys(target) {
    return ["c"];
  },
});
try {
  Reflect.ownKeys(proxy);
} catch (error) {
  console.log("必须包含不可配置自有属性", error.toString());
}
Reflect.preventExtensions(target);

const proxy2 = new Proxy(target, {
  ownKeys(target) {
    return ["a", "c"];
  },
});
try {
  Reflect.ownKeys(proxy2);
} catch (error) {
  console.log("必须准确包含自有属性键值", error.toString());
}
// 打印
必须包含不可配置自有属性 TypeError: 'ownKeys' on proxy: trap result did not include 'a'
必须准确包含自有属性键值 TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensibl
```

# 2.8 getPrototypeOf()

- getPrototypeOf()捕获器会在`Object.getPrototype()` 中被调用，对应的反射API方法为`Reflect.getPrototypeOf()`

## 2.8.1 返回值

- 必须返回对象或`null`

## 2.8.2 拦截的操作

- [ ]  Object.getPrototypeOf()
- [ ]  Reflect.getPrototypeOf()
- [ ]  proxy.__proto__  相当于获取代理的原型
- [ ]  Object.prototype.isPrototypeOf(proxy)  判断一个对象是否proxy的原型，需要获取proxy的原型进行比对
- [ ]  proxy instanceof Object 判断proxy是否是Object的实例，需要获取代理的原型

## 2.8.3 捕获器处理程序参数

- [ ]  `target`

## 2.8.4 捕获器不变式

- 如果`target` 不可扩展，则`Object.getPrototypeOf(proxy)`唯一有效的返回值就是`Object.getPrototypeOf(target)`的返回值

## 2.8.5 例子

```jsx
const prototype = { a: "a" };

const target = {};
Object.setPrototypeOf(target, prototype);

const proxy = new Proxy(target, {
  getPrototypeOf(target) {
    console.log("getPrototypeOf");
    // 返回固定原型对象
    return Function.prototype;
  },
  get() {
    console.log("get");
    return Reflect.get(...arguments);
  },
});

console.log(Object.getPrototypeOf(proxy));
console.log(Reflect.getPrototypeOf(proxy));
console.log(proxy.__proto__ === target.__proto__);
console.log(prototype.isPrototypeOf(proxy));
console.log(proxy instanceof Function);

Reflect.preventExtensions(target);

try {
  Object.getPrototypeOf(proxy);
} catch (error) {
  console.log(error.toString());
}
// 打印
getPrototypeOf
{}
getPrototypeOf
{}
get
getPrototypeOf
false
getPrototypeOf
false
getPrototypeOf
true
getPrototypeOf
TypeError: 'getPrototypeOf' on proxy: proxy target is non-extensible but the trap did not return its actual prototype
```

- 可以发现的一个事实是，使用`proxy.__proto__` 同样被get捕获器拦截，之后再被getPrototypeOf捕获器拦截，最终返回的仍然是getPrototypeOf中固定的`Function.prototype`
- 如果`get` 捕获器**不使用**`Reflect.get()` 最为默认执行返回结果，那么getPrototypeOf不再被执行
- 在目标对象不可扩展的情况下，必须返回正确的原型

# 2.9 setPrototypeOf()

- setPrototypeOf()捕获器在`Object.setPrototype()`中被调用，其对应的反射API方法为`Reflect.setPrototypeOf()`

## 2.9.1 返回值

- 必须返回布尔值，表示原型是否赋值成功，返回非布尔值会被转化我布尔值

## 2.9.2 拦截的操作

- [ ]  Object.setPrototypeOf()
- [ ]  Reflect.setPrototypeOf()

## 2.9.3 捕获器处理程序参数

- [ ]  `target` 目标对象
- [ ]  `prototype` target的替代原型，如果是顶级原型则为null

## 2.9.4 捕获器不变式

- 如果target不可扩展，唯一有效的prototype参数就是`Object.getPrototypeOf(target)`的返回值

## 2.9.5 例子

```jsx
const target = {};
const proxy = new Proxy(target, {
  setPrototypeOf(target, prototype) {
    console.log("setPrototypeOf");
    return Reflect.setPrototypeOf(...arguments);
  },
});
Object.setPrototypeOf(proxy, Function.prototype);
Reflect.setPrototypeOf(proxy, Object.prototype);
proxy.__proto__ = Function.prototype;
console.log(proxy.__proto__ === Object.prototype);

Reflect.preventExtensions(target);

try {
  Reflect.setPrototypeOf(proxy, null);
} catch (error) {
  console.log(error.message);
}
// 打印
setPrototypeOf
setPrototypeOf
setPrototypeOf
false
setPrototypeOf
```

- 可以发现`proxy.__proto__  = value` 赋值语句也会被setPrototypeOf()捕获器拦截
- 将`target`设置为不可扩展后，仍然可以对代理设置原型，只是不能改变原型了

# 2.10 isExtensible()

- `isExtensible()` 捕获器在`Object.isExtensible()` 中被调用，对应的反射API方法为`Reflect.isExtensible()`

## 2.10.1 返回值

- `isExtensible()` 必须返回布尔值，表示`target` 是否可扩展，返回非布尔值会被转型为布尔值

## 2.10.2 拦截的操作

- [ ]  Object.isExtensible(proxy)
- [ ]  Reflect.isExtensible(proxy)

## 2.10.3 捕获器处理程序参数

- [ ]  target：目标对象

## 2.10.4 捕获器不变式

- 如果target可扩展，则处理程序必须返回true
- 如果target不可扩展，则处理程序必须返回false

## 2.10.5 例子

```jsx
const target = {};
const proxy = new Proxy(target, {
  isExtensible(target) {
    console.log("isExtensible");
    return !Reflect.isExtensible(target);
  },
});

try {
  console.log(Object.isExtensible(proxy));
} catch (error) {
  console.log(error.toString()); // TypeError: 'isExtensible' on proxy: trap result does not reflect extensibility of proxy target (which is 'true')
}
Object.preventExtensions(target);
try {
  console.log(Object.isExtensible(proxy));
} catch (error) {
  console.log(error.toString()); // TypeError: 'isExtensible' on proxy: trap result does not reflect extensibility of proxy target (which is 'false')
}
```

- 必须返回正确的布尔值

# 2.11 preventExtensions()

- preventExtensions()捕获器在`Object.preventExtensions()` 中被调用，对应的反射API为`Reflect.preventExtensions()`

## 2.11.1 返回值

- 必须返回布尔值，表示target是否已不可扩展，返回非布尔值会被转型为布尔值

## 2.11.2 拦截的操作

- [ ]  Object.preventExtensions(proxy)
- [ ]  Reflect.preventExtensions(proxy)

## 2.11.3 捕获器处理程序参数

- [ ]  target:目标对象

## 2.11.4 捕获器不定式

- 如果Object.isExtensions(proxy)是false，则处理程序必须返回true

## 2.11.5 例子

```jsx
const target = {};
const proxy = new Proxy(target, {
  preventExtensions(target) {
    return false;
  },
});

try {
  console.log(Object.preventExtensions(proxy));
} catch (error) {
  console.log(error.toString());
}
Object.preventExtensions(target);
try {
  console.log(Object.preventExtensions(proxy));
} catch (error) {
  console.log(error.toString());
}
//
TypeError: 'preventExtensions' on proxy: trap returned falsish
TypeError: 'preventExtensions' on proxy: trap returned falsish
```

- 无论target是否可扩展，直接返回false都会导致报错

# 2.12 apply()

- `apply()` 捕获器在调用函数时被调用，对应的反射API方法为`Reflect.apply()`

## 2.12.1 返回值

- 返回值无限制

## 2.12.2 拦截的操作

- [ ]  proxy(…argumentsList)
- [ ]  Function.prototype.apply(thisArg, argumentsList)
- [ ]  Function.prototype.call(thisArg, … argumentsList)
- [ ]  Reflect.apply(target, thisArg, argumentsList)

## 2.12.3 捕获器处理程序参数

- [ ]  target: 目标对象
- [ ]  thisArg： 调用函数时的this参数
- [ ]  argumentsList：调用函数时的参数列表

## 2.12.4 捕获器不变式

target必须是一个函数对象

## 2.12.5 例子

```jsx
const target = function () {};

const proxy = new Proxy(target, {
  apply() {
    return "自定义";
  },
});
console.log(proxy()); // 自定义
console.log(new proxy()); // target {}  
```

# 2.13 construct()

- construct()捕获器会在new操作符中被调用，对应的反射API方法是`Reflect.construct()`

## 2.13.1 返回值

- 必须返回一个对象

## 2.13.2 拦截的操作

- [ ]  new proxy(…argumentsList)
- [ ]  Reflect.construct(target, argumentsList, newTarget)

## 2.13.3 捕获器处理程序参数

- [ ]  target：目标构造函数
- [ ]  argumentsList：传给目标构造函数的参数列表
- [ ]  newTarget: 最初被调用的构造函数

## 2.13.4 捕获器不变式

target必须可以作为构造函数

## 2.13.5 例子

```jsx
const Target = function () {
  this.x = "1";
};

const proxy = new Proxy(Target, {
  construct() {
    console.log(arguments, arguments[2] === Target, arguments[2] === proxy);

    return Reflect.construct(...arguments);
  },
});
console.log(new proxy());
function Person() {
  this.y = 2;
}
console.log(Reflect.construct(proxy, [], Person));
// 打印
[Arguments] {
  '0': [Function: Target],
  '1': [],
  '2': [Function: Target]
} false true
Target { x: '1' }
[Arguments] {
  '0': [Function: Target],
  '1': [],
  '2': [Function: Person]
} false false
Person { x: '1' }
```

- 所谓最初被调用的构造函数，默认就是指代理本身
- 使用Reflect.construct()调用代理，可以自定义第三个最初被调用的构造函数，从而构造出一个不同类型的对象，如上构造出了一个`Person`的实例，但是自有属性仍然按照`Target` 的进行构造