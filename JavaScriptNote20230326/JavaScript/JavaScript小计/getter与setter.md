# getter与setter

# 1. getter

- get语法将对象属性绑定到查找该属性时调用的函数，这个属性属于**访问器属性**（**accessor property**）

## 1.1 语法

```jsx
{
	get prop() {
		/* ... */
	}
}
{
	get [expression]() {
		/* ... */
	}
}
```

- 参数
    - `prop` ：属性名称，被绑定给定的`get`方法，用于查找时调用的函数
    - `expression` ：表达式，计算结果就是属性名称，使用中括号语法

## 1.2 解释

### 1.2.1 必要性

- 访问数据属性的值在[[Value]] 中 是固定的，即保存的什么就返回什么
- 但是有些时候，我们需要一些 属性值是**动态计算（dynamically compute）**后返回的 属性
- 或者在**映射**（**reflect**）一个**内部变量**（**internal variable**）的状态时，不想要**显示**地（**explict**）调用方法获取，而是通过句点或中括号语法直接获取
    - 一个简单的例子，在声明类时定义的**私有变量**，通过`getIt()` 和`setIt` 进行获取和修改
    - 为了避免显示地调用方法，可以为实例定义一个**访问器属性（accessor property），** 它使用`getter` 和`setter` 语法实现，引用指向那个私有变量即可

### 1.2.2 互斥性

- 不可能**同时（simultaneously）**让一个对象属性绑定一个`getter` 并让该属性保存一个值
- 可以**结合**（**conjunction**）`getter` 和`setter` 创建一个**伪属性**（**pseudo-property**）类型（访问器属性）

### 1.2.3 使用原则

1. 标识符（`prop`）可以是数字也可以是字符串
2. `get`方法必须没有参数传递（这是[ES5](https://whereswalden.com/2010/08/22/incompatible-es5-change-literal-getter-and-setter-functions-must-now-have-exactly-zero-or-one-arguments/)规范的）
3. 在字面量声明中，一个标识符只能声明一次`get` 方法，下面的写法是禁止的
    
    <aside>
    ❌ {
    	get x() {}, get x() {}
    }
    
    </aside>
    
4. 一个标识符使用数据属性的声明方式后，不能再声明`get`和`set`
    
    <aside>
    ❌ {
    	x: /* ... */, get x() {}
    }
    
    </aside>
    

## 1.3 例子

### 1.3.1 在对象初始化器（initializer）中为对象定义getter

```jsx
const obj = {
  log: ["a", "c", "e", "e"],
  get latest() {
    if (this.log.length) {
      return this.log[this.log.length - 1];
    }
    return undefined;
  },
  get 1() {
    if (this.log.length) {
      return this.log[0];
    }
    return undefined;
  },

};
console.log(Object.getOwnPropertyDescriptors(obj));
console.log(obj[1]);
console.log(obj.latest);
// 打印
{
  '1': {
    get: [Function: get 1],
    set: undefined,
    enumerable: true,
    configurable: true
  },
  log: {
    value: [ 'a', 'c', 'e', 'e' ],
    writable: true,
    enumerable: true,
    configurable: true
  },
  latest: {
    get: [Function: get latest],
    set: undefined,
    enumerable: true,
    configurable: true
  }
}
a
e
```

- 在使用字面量初始化一个对象时，声明了两个`gettter` 即`get letest()` 和`get 1()` ，证明标识符可以使用字符串和数字
- 通过打印属性描述符得知，声明的两个`props` 是访问器属性（accessor property），它们是可枚举，可配置的，只是没有[[Set]]
- 可以直接通过句点和中括号访问这两个访问器属性，访问时它们调用对应的`getter` ，返回数据属性`log` 的第一个日志元素和最后一个日志元素
- 这种动态计算的获取方式恰好解决了日志随时改变照成的不固定问题，从这个角度可知**访问器属性**有实用的应用场景，get和set语法也就有了声明访问器属性的意义

### 1.3.2 使用`delete` operator的方式删除getter

- `operator` 就是`props` 即属性名称，访问器属性的两个特性[[Get]]和[[Set]]指的就是`getter`和`setter`  直接删除属性相当于删除了`getter`和`setter`
    
    ```jsx
    delete obj.latest;
    ```
    

### 1.3.3 使用`Object.defineProperty()`定义或修改一个对象的getter

- 实际上就是添加或修改一个**访问器属性，**参考[JavaScript高级程序设计第4版第八章1.2.2.2](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/8%20%E5%AF%B9%E8%B1%A1%E3%80%81%E7%B1%BB%E4%B8%8E%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/1%20%E7%90%86%E8%A7%A3%E5%AF%B9%E8%B1%A1.md)
    
    ```jsx
    Object.defineProperty(obj, "length", {
      **configurable: true,
      enumerable: true,
      get() {
        return this.log.length;
      },**
    });
    console.log(obj);
    console.log(obj.length);
    // 打印
    {
      '1': [Getter],
      log: [ 'a', 'c', 'e', 'e' ],
      latest: [Getter],
      length: [Getter]
    }
    4
    ```
    

### 1.3.4 定义静态的getter

- 静态的`getter` 就是使用`static` 关键字表明对象成员非实例的访问器属性，而是引用类型访问器属性，例如
    
    ```jsx
    class MyConstants {
      static get UnitCircle() {
        return {
          radius: 1,
          area: Math.PI,
          perimeter: 2 * Math.PI,
        };
      }
      static get UnitTriangle() {
        return {
          side: 1,
          perimeter: 3,
          area: Math.sqrt(3) / 4,
        };
      }
    }
    console.log(Object.getOwnPropertyDescriptors(MyConstants));
    console.log(MyConstants.UnitCircle, MyConstants.UnitTriangle);
    // 打印
    {
      length: { value: 0, writable: false, enumerable: false, configurable: true },
      name: {
        value: 'MyConstants',
        writable: false,
        enumerable: false,
        configurable: true
      },
      prototype: {
        value: {},
        writable: false,
        enumerable: false,
        configurable: false
      },
      UnitCircle: {
        get: [Function: get UnitCircle],
        set: undefined,
        enumerable: false,
        configurable: true
      },
      UnitTriangle: {
        get: [Function: get UnitTriangle],
        set: undefined,
        enumerable: false,
        configurable: true
      }
    }
    { radius: 1, area: 3.141592653589793, perimeter: 6.283185307179586 } { side: 1, perimeter: 3, area: 0.4330127018922193 }
    ```
    
    - **静态访问器属性**的可以只定义`getter`方法，这样就能实现一个**数据类**，类中保存公共的固定值
    - 如同例子中的`MyConstants` 类，它保存了单位圆和单位等边三角形固定的面积和周长信息
    - 并且使用`get`方法有一个好处，不用特地使用`defineProperty()` 将单位圆的数据设置为不可写的
        - 因为`UnitCircle` 返回的是一个对象，如果使用**数据属性**直接保存，那么可以直接修改其中的值，下一次获取的就是错误值了
        - 而使用访问器属性，每次获取都要调用`get` 即每次返回的都是一个新对象，即使修改了对象中保存的属性值，下一次获取的仍然是正确值

## 1.4 记忆化（Smart）、自我覆写（Self-overwriting）、懒加载getters（lazy getters）

### 1.4.1 懒加载

- `getter` 提供了一种定义（访问器）属性的方式，但是它不会立即计算（*calculate*）属性的值，只有当属性被访问时，`getter`才会被调用计算
- `getter` 将计算该值的成本推迟到值被访问时，如果该属性没有被访问过，程序就不会有调用执行`getter` 的花费
- **lazy getters** 指的就是这种成本推迟的**懒加载**特性

### 1.4.2 记忆化

- 另一种用于**延迟**（**lazify or delay**）属性值计算并将计算值进行**缓存**（**cache**）（用于下次省略计算直接返回结果）的优化技术 就是**记忆化**（**memoized or smart**） `getters`
- 属性值在第一次被访问时，调用`getter` ,然后**缓存**（**cache**）返回结果，后续的属性访问能直接通过缓存获取返回值，不必重新调用`getter`计算
- 记忆化适用场景如下
    - `getter`计算开销昂贵的情况，例如需要占用大量的RAM或CPU时间的工作：产生工作线程，检索远程文件等
    - 一个语句就多次访问同一个**访问器属性**的情况，通常这种情况下属性值都是同一个不会被改变，也就只需要计算一次，不用重新计算
- 记忆化`getter`与懒加载`getter`
    - 二者通常只用一个，不存在懒加载的同时仍然记忆化
    - 因为懒加载的`getter`对应的访问器属性值是会改变的，这与记忆化不改变的属性值冲突
    - **注意，getters本质上不是懒加载（lazy）或记忆化（memoized）,**如果想要这两种特性开发者需要自己实现它们

### 1.4.3 自我覆写

- 使用字面量语法在对象中定义一个`getter`，`get`方法中语句操作如下
    1. 删除`getter` 对应的访问器属性
    2. 将属性赋值为一个具体的值然后返回（转换成了数据属性）
- 如下
    
    ```jsx
    const obj = {
    	latest: "e"
    }
    const obj2 = {
      get notifier() {
        delete this.notifier;
        return (this.notifier = obj.latest);
      },
    };
    console.log(obj2);
    console.log(obj2.notifier);
    obj.latest = "kk";
    console.log(obj.latest);
    console.log(obj2);
    console.log(obj2.notifier);
    // 打印
    { notifier: [Getter] }
    e
    kk
    { notifier: 'e' }
    e
    ```
    
    - 可以看到，第一次访问`obj2.notifier` ，它是访问器属性，所以调用`get`
    - `get` 执行的自我覆写操作导致`notifier` 属性被删除，然后重新定义为了数据属性，并且属性值为`get` 获取到的一个外部值`obj.latest`
    - 外部值`obj.latest`改变后，`notifier` 不会改变，因为它不再是之前的`get` ，而是固定的不需要使用`getter` 计算的一个值
- 这样做的好处在于：**实现了一个根据外部状态进行初始化的数据属性**
    - 首次访问时访问器属性，获取到的值是当前外部状态的值
    - 自我覆盖后，后续使用的属性就是一个数据属性

# 2. setter

- `set`语法将对象属性绑定到设置该属性时调用的函数，这个属性属于**访问器属性**（**accessor property**）

## 2.1 语法

```jsx
{set prop(val) {/* ... */}}
{
	set [expression](val) {/* ... */}
}
```

- 参数
    - `prop` 绑定给定的`set`方法的属性名称
    - `val` 试图给`prop` 属性赋值的变量
    - `expression` 表达式，计算结果为属性名称
- 返回值：undefined

## 2.2 解释

- JavaScript中，`setter` 被用于试图修改访问器属性时调用执行的方法
- 可以**结合**（**conjunction**）`getter` 和`setter` 创建一个**伪属性**（**pseudo-property**）类型（访问器属性）
- 不可能**同时（simultaneously）**让一个对象属性绑定一个`setter` 并让该属性保存一个值

### 2.2.1 使用原则

1. 标识符（`prop`）可以是数字也可以是字符串
2. `set`方法必须有一个参数传递（这是[ES5](https://whereswalden.com/2010/08/22/incompatible-es5-change-literal-getter-and-setter-functions-must-now-have-exactly-zero-or-one-arguments/)规范的）
- 参考`get`语法的使用原则

## 2.3 例子

### 2.3.1 对象初始化（initializer）时定义setter

```jsx
const obj3 = {
  logs: [],
  /**
   * @param {any} val
   */
  set current(val) {
    this.logs.push(val);
  },
};
console.log(obj3);
obj3.current = "value";
console.log(obj3);
console.log(obj3.current);
// 打印
{ logs: [], current: [Setter] }
{ logs: [ 'value' ], current: [Setter] }
undefined
```

- 上述代码定义了一个伪元素（pseudo-property） `current`
- 当`current` 被赋值时，对应的`setter`被调用，它会更新`logs` 属性
- 因为没有定义访问器属性的`getter`，所以访问`current`会默认得到`undefined`

### 2.3.2 使用`defineProperty` 定义或修改访问器属性

```jsx
Object.defineProperty(obj3, "first", {
  configurable: true,
  enumerable: false,
  set(val) {
    this.logs.unshift(val);
  },
});
obj3.first = "newValue";
console.log(obj3); // { logs: [ 'newValue', 'value' ], current: [Setter] }
console.log(obj3.first); // undefined
```

- `defineProperty` 可以修改访问器属性的特性