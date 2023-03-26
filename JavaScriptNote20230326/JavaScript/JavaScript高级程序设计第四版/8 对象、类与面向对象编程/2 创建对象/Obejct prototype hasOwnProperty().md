# Obejct.prototype.hasOwnProperty()

# 介绍

- `Object.prototype.hasOwnProperty()` 检查对象是否包含参数传递的自有属性（而不是继承该参数）
- 在支持`Object.hasOwn()` 的浏览器上更支持使用`Object.hasOwn()` 因为有些对象可能没有`hasOwnProperty()` 方法

# 语法

```jsx
hasOwnProperty(prop);
```

- 参数：`prop` 属性名称，可以是字符串，也可以是符号
- 返回值：如果对象存在`prop` 自有属性，就返回`true` ；否则返回`fasle`

# 描述

1. 与`in` 操作符不同，`hasOwnProperty()` 方法只检查对象的**直接（direct）属性**是否包含指定属性，即使这个属性的属性值为`null`或者`undefined` ;`in` 操作符会检查对象的原型链中是否包含指定属性但本方法不会检查原型链，即使原型链上有指定属性，也会返回`false`
2. `hasOwnProperty()` 写在`Object`构造函数的原型对象上，大多数对象**派生**（**descend**）于`Object` ，所以能继承`hasOwnProperty()` 并使用；例如`Array` 是一个`Object` ，所以能使用`hasOwnProperty()` 检查是否存在指定索引
3. 当对象被**重新实现**（**reimplemented**）或对象由`Object.create(null)` 创建时，可能无法使用`hasOwnProperty()` 因为它们的原型被修改了，可能没有继承本方法；这个时候可以使用`Object.hasOwn()` 静态方法进行判断

# 例子

- `in` 操作符会检查继承(inherited)的属性
    
    ```jsx
    const obj = {};
    Object.defineProperties(obj, {
      name: {
        value: "mangwu",
        enumerable: true,
      },
      id: {
        value: 1,
      },
    });
    console.log("name" in obj); // true
    console.log("id" in obj); // true
    console.log("hasOwnProperty" in obj); // true
    console.log(obj.hasOwnProperty("name")); // true
    console.log(obj.hasOwnProperty("id")); // true
    console.log(obj.hasOwnProperty("hasOwnProperty")); // false
    ```
    
- 可以使用`for in` 获取对象中的每个**可枚举**属性，然后通过`hasOwnProperty()` 判断是否是自有的，就可以获得所有**可枚举的自有**属性。因为现代引擎基本使原型链上的属性为不可枚举的，所以，但它们仍然可配置(configurable)，所以使用`Object.defineProperties()` 修改了原型对象上的部分属性特性
    
    ```jsx
    Object.defineProperties(obj.__proto__, {
      toLocaleString: {
        writable: true,
        enumerable: true,
        configurable: true,
      },
      toString: {
        writable: true,
        enumerable: true,
        configurable: true,
      },
      isPrototypeOf: {
        writable: true,
        enumerable: true,
        configurable: true,
      },
      constructor: {
        writable: true,
        enumerable: true,
        configurable: true,
      },
    });
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        console.log(`${key}是自有的可枚举属性`);
      } else {
        console.log(`${key}是原型链上的可枚举属性`);
      }
    }
    // 打印
    name是自有的可枚举属性
    constructor是原型链上的可枚举属性
    isPrototypeOf是原型链上的可枚举属性
    toString是原型链上的可枚举属性
    toLocaleString是原型链上的可枚举属性
    ```
    
- 重新实现`hasOwnProperty` 可能会导致`hasOwnProperty`被**遮蔽**（**shadow**），这种情况可以使用`Object.own()` 判断属性是否是对象的自有属性
    
    ```jsx
    console.log(obj.hasOwnProperty("name")); // true
    Object.defineProperty(obj, "hasOwnProperty", {
      value: function () {
        return false;
      },
      enumerable: true,
      configurable: true,
      writable: false,
    });
    console.log(obj); // { name: 'mangwu', hasOwnProperty: [Function: value] }
    console.log(obj.hasOwnProperty("name")); // false
    console.log(Object.hasOwn(obj, "name")); // true
    ```
    
    - 定义了一个同名的属性`hasOwnProperty` ，它**遮蔽**了原型链上的同名属性，它调用时默认返回`false` 所以无法判断自有属性
    - 使用静态方法`Object.hasOwn()` 不会发生这种情况
- 同理，纯净对象因为没有原型，使用`hasOwnProperty` 会报错，但也可以使用`hasOwn()`
    
    ```jsx
    const obj2 = Object.create(null, {
      name: {
        value: "mangwu",
        enumerable: true,
      },
    });
    console.log(obj2); // [Object: null prototype] { name: 'mangwu' }
    try {
      obj2.hasOwnProperty("name");
    } catch (error) {
      console.log(error.message); // obj2.hasOwnProperty is not a function
    }
    console.log(Object.hasOwn(obj2, "name")); // true
    ```