# 【深入理解ES6】JavaScript中的类

参考

[【读书笔记】【深入理解ES6】#9-JavaScript中的类](http://wjhsh.net/Ryukaka-p-7885802.html)

大多数面向对象的编程语言都有类和类继承特性，JavaScript关于类的规范分为两个时期

1. ES5及之前，这个时期class仅作为关键字被保留，还未被规范，所以出现了第二、三节提到的多种对象创建和对象继承的方法
2. ES6及之后，尽管JavaScript开发强烈坚持JavaScript不需要类，但由于类似的库层出不穷，最终ECMAScript6 中引入了类的特性，但是这只是一个**语法糖结构**的特性，它与其它语言中的类还是不同，底层仍然是依靠原型链和构造函数实现的

# 1.ECMAScript 5 中的近类结构

- 实际上就是第二节说明的构造函数模式和原型模式
- 首先创建一个构造函数，声明实例的自有属性，然后使用原型模式声明实例的原型方法
    
    ```jsx
    function PersonType(name) {
    	this.name = name;
    }
    PersonType.prototype.sayName = function() {
    	console.log(this.name);
    }
    var person = new PersonType("mangwu");
    person.sayName(); // "mangwu"
    
    console.log(person instanceof PersonType); // true
    console.log(person instanceof Object); // true
    ```
    

# 2.类的声明

## 2.1 基本的类声明语法

通过class关键字声明类

```jsx
class PersonClass {
	// 等价于 PersonType 构造函数
	constructor(name) {
		this.name = name;
	}
	// 等价于 PersonType.prototype.sayName
	sayName() {
		console.log(this.name);
	}
}
let person = new PersonClass("mangwu");
person.sayName(); // mangwu;
console.log(person instanceof PersonClass); // true
console.log(person instanceof Object); // true

console.log(typeof PersonClass); // function
console.log(typeof PersonClass.prototype.sayName); // function
```

- 创建方法和之前通过构造函数创建`PersonType`类似，这里直接通过`constructor`方法来定义构造函数，除了`constructor`外没有其它**保留方法名称**
- 在`constructor` 中定义的属性是**实例属性，**对于对象而言又称**自有属性**
- 通过最后两行可以看出：class关键字只是一个**语法糖，**最终生成的类PersonClass仍然是一个函数，而且`sayName`方法也是定义在该函数的原型上的

## 2.2 构造函数与类语法的区别

> 与函数不同的是**类属性（指prototype）不可被赋予新值**，而构造函数的原型是一个**可读的**属性
> 

```jsx
console.log(Object.getOwnPropertyDescriptors(PersonType));
console.log(Object.getOwnPropertyDescriptors(PersonClass));
```

- node(v16.14.0)环境下的打印
    
    ```jsx
    {
      length: { value: 1, writable: false, enumerable: false, configurable: true },
      name: {
        value: 'PersonType',
        writable: false,
        enumerable: false,
        configurable: true
      },
      arguments: {
        value: null,
        writable: false,
        enumerable: false,
        configurable: false
      },
      caller: {
        value: null,
        writable: false,
        enumerable: false,
        configurable: false
      },
      prototype: {
        value: { sayName: [Function (anonymous)] },
        **writable: true,**
        enumerable: false,
        configurable: false
    }
    {
      length: { value: 1, writable: false, enumerable: false, configurable: true },
      name: {
        value: 'PersonClass',
        writable: false,
        enumerable: false,
        configurable: true
      },
      prototype: {
        value: {},
        **writable: false,**
        enumerable: false,
        configurable: false
      }
    }
    ```
    
    - 可以发现在node JavaScript引擎的实现中，使用构造函数的`PersonType` 除了比类多了不可配置不可写的`caller`和`arguments` 属性外，其它的`length` 、`name` 、`prototype` 二者都有
    - `length` 和`name` 在构造函数和类中的属性特性（property attribute）一样，但是`prototype` 属性在构造函数中是不可枚举不可配置**可写**的，而在类中是不可枚举不可配置**不可写**的，所以使用构造函数可以直接重写原型，但是类不能重写原型
- 在浏览器环境（v105.0.5195.102）中的打印
    
    ![Untitled](%E3%80%90%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3ES6%E3%80%91JavaScript%E4%B8%AD%E7%9A%84%E7%B1%BB/Untitled.png)
    
    - 和node环境下一致，可以更清晰的看到构造函数与类的区别
- 除此之外，对于没有`arguments` 、`caller` 属性的类来说，试图打印一个不存在的对象属性应该打印出`undefined` 但是对于类而言并非如此，打印`arguments`和`caller` 会报同样的错误
    
    ```jsx
    try {
      console.log(PersonClass.arguments);
    } catch (error) {
      console.log(error.toString());
    }
    
    try {
      console.log(PersonClass.caller);
    } catch (error) {
      console.log(error.toString());
    }
    // 打印
    TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
    TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
    ```
    
    - 为了区分类和构造函数，让类看起来***”不像“***函数，`arguments`和`caller` 两个典型的函数属性在类中被定义为严格模式下访问就抛出异常，如下
        
        ![Untitled](%E3%80%90%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3ES6%E3%80%91JavaScript%E4%B8%AD%E7%9A%84%E7%B1%BB/Untitled%201.png)
        

## 2.3 为何使用类语法

首先看一下类声明和函数声明的差异

1. 函数声明可以被提升，而类声明与`let`类似，不能被提升；真正执行声明语句前，它们会一直存在于[临时死区](../../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80.md)中
2. 类声明中所有代码将**自动运行在严格模式**下，而且无法强行让代码脱离严格模式执行
3. 在自定义类型中，需要通过`Object.defineProperty()` 方法**手工指定**某个方法为**不可枚举**；而在类中，所有方法都是不可枚举的
4. 每个类都有一个名为[[Construct]]的内部方法，通过关键字`new` 调用那些不含[[Construct]]的方法会导致程序抛出错误（关于[[Construct]]可以查看[ecma262](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ecmascript-function-objects-construct-argumentslist-newtarget)规范）
5. 使用除了new关键字外的方式调用类的构造函数会导致程序抛出错误
6. 在**类中**修改类名会导致程序报错（声明后在外部可以修改）

使用出了类之外的语法(闭包加构造函数)为PersonClass编写等价代码

```jsx
// 构造函数加闭包实现的类的的等价写法
**let** PersonType2 = **(function () {**
  **"use strict";**
  const PersonType2 = function (name) {
    // 确保通过关键字new调用该方法
    **if (typeof new.target === "undefined") {**
      // throw new Error("必须通过new关键字调用构造函数");
      throw new TypeError(
        "Class constructor PersonClass cannot be invoked without 'new'"
      );
    }
    this.name = name;
  };
  Object.defineProperty(PersonType2.prototype, "sayName", {
    value: function () {
      // 确保不会通过new调用该方法
      if (typeof new.target !== "undefined") {
        throw new Error("不可使用关键字new调用该方法");
      }
      console.log(this.name);
    },
    **enumerable: false,**
    writable: true,
    configurable: true,
  });
  return PersonType2;
**})();**
```

1. 函数声明可提升，类不可提升，所以使用`let` 声明`PersonType2`
2. 类声明中所有代码将**自动运行在严格模式**下,所以需要一个闭包中运行严格代码，外边嵌套一层闭包，然后在里面进行类的构造函数模式的代码编写
3. 类声明中的所有原型方法和属性都是不可枚举的（可配置可写），所以使用`defineProperty` 设置原型方法的特性
4. 构造函数中也有[[Construct]]方法，本质上类和构造函数一样
5. 不能使用`new`关键字外的调用方式调用类的构造函数，所以使用**`typeof new.target === "undefined"`** 判断是否使用了`new` 关键字
6. 在类中修改类名会导致程序报错：上述代码中存在两个`PersonType2` ，第二个`PersonType2` 属于临时的构造函数，用于实现类，它绑定声明时使用的类名称标识符，所以在内部不能修改  
- 在浏览器环境中对比二者的原型和原型特性
    
    ![Untitled](%E3%80%90%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3ES6%E3%80%91JavaScript%E4%B8%AD%E7%9A%84%E7%B1%BB/Untitled%202.png)
    
    ![Untitled](%E3%80%90%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3ES6%E3%80%91JavaScript%E4%B8%AD%E7%9A%84%E7%B1%BB/Untitled%203.png)
    
    - 二者的原型除了`constructor` 属性值不同外，其它都是相同的，本质上`constructor` 属性值都是方法
    - 至于`arguments` 和`caller` 属性，因为模拟代码在**严格模式**下执行的，所以被设置成了访问就抛出异常了
    
    ![Untitled](%E3%80%90%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3ES6%E3%80%91JavaScript%E4%B8%AD%E7%9A%84%E7%B1%BB/Untitled%204.png)
    
    - 二者的原型特性一模一样，都是不可枚举的可配置可写属性或方法（普通的构造函数新增的方法和属性默认是可枚举可配置可写的）
- 所以为何使用类语法
    - 尽管不使用class关键字的前提下能通过闭包和构造函数实现所有功能，但**代码变的极为复杂**
    - 简单说，**class作为语法糖使用更方便**

# 3. 类表达式

类和函数都存在两种形式：**声明式**和**表达式形式**

而类表达式语法又分为两种：**基本的类表达式语法**和**命名类表达式语法**

## 3.2 基本的类表达式语法

```jsx
**var** PersonClass = class {
  // 等价于 PersonType 构造函数
  constructor(name) {
    this.name = name;
  }
  // 等价于PersonType.prototype.sayName
  sayName() {
    console.log(this.name);
  }
};
```

- 这种方式的构造函数实现和声明式的类的构造函数实现一样，唯一区别在于它给予了类可以使用`let`, `var`, `const` 三种变量声明的选择权力，而不是只有`let`

## 3.3 命名类表达式

```jsx
// 2. 命名类表达式
let PersonClass2 = class PersonName {
  // 等价于 PersonType 构造函数
  constructor(name) {
    this.name = name;
  }
  // 等价于PersonType.prototype.sayName
  sayName() {
    console.log(this.name);
  }
};
console.log(PersonClass2.name); // PersonName
console.log(typeof PersonClass2); // function
console.log(typeof PersonName); // undefined
```

- 类的名称为`PersonName`, `PerosnClass2` 只是保存类对象的变量
- 但是在声明外部并不存在一个名为`PersonName` 的绑定，因为**标识符`PersonName` 只存在于类定义了**
- 或者说命名类表达式给出了一个能自定义类名称的方法：使用`PersonName` 标识符自定义，但是外部无效

将命名类表达式修改为等价的不使用class关键字的声明就知道原因：

```jsx
let PersonClass2 = (function () {
  "use strict";
  const PersonName = function (name) {
    // 确保通过关键字new调用该方法
    if (typeof new.target === "undefined") {
      // throw new Error("必须通过new关键字调用构造函数");
      throw new TypeError(
        "Class constructor PersonClass cannot be invoked without 'new'"
      );
    }
    this.name = name;
  };
  Object.defineProperty(PersonName.prototype, "sayName", {
    value: function () {
      // 确保不会通过new调用该方法
      if (typeof new.target !== "undefined") {
        throw new Error("不可使用关键字new调用该方法");
      }
      console.log(this.name);
    },
    enumerable: false,
    writable: true,
    configurable: true,
  });
  return PersonName;
})();
```

- 它与基本的类表达式语法的区别在于，`class` 关键字后面的标识符将取代使用默认的类变量标识符绑定构造函数的名称

在JavaScript引擎中，类表达式的实现和类声明稍有不同

- 类声明
    
    通过`let`定义的外部绑定与通过`const`定义的内部绑定具有相同的名称
    
- 类表达式
    
    通过`const`定义名称，默认是但并不绑定`let`定义的外部绑定，如果有`class` 后的名称标识符，就会取代默认值