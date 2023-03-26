# Object with null prototype

# 介绍

- 一个对象的原型是`null` ，它被称为纯净对象，或`nullProtoObj`
- 纯净对象的一些行为和普通对象不同，因为它没有继承任何对象从`Object.prototype` 获取的基本对象方法

# 缺点

- 纯净对象debug时棘手
    - 因为普通对象可以通过 对象属性的**转换**/**检查**（**converting**/**detecting**）实用函数 产生的错误或信息来判断问题
    - 而纯净对象没有这些实用函数，可能打印都无法进行，更别说在**静默错误陷阱**（**slient error-traps**）的情况下，更加无法进行bug检查
- 例如，纯净对象缺少`Object.prototype.toString()` 方法，又是打印对象的字符串表示是很好的debug方式，但是纯净对象缺棘手起来
    
    ```jsx
    const obj = {};
    const nullProtoObj = Object.create(null);
    
    console.log(obj.toString());
    console.log(nullProtoObj.toString()); // TypeError: nullProtoObj.toString is not a function
    
    alert(obj);
    alert(nullProtoObj); // Uncaught TypeError: Cannot convert object to primitive value
    ```
    
- 其它本可继承于`Object.prototype` 的方法或属性也不能使用
    
    ```jsx
    obj.valueOf(); // {}
    nullProtoObj.valueOf(); // Uncaught TypeError: nullProtoObj.valueOf is not a function
    
    obj.hasOwnProperty("p"); // false
    nullProtoObj.hasOwnProperty("p"); // Uncaught TypeError: nullProtoObj.hasOwnProperty is not a function
    
    obj.constructor; // Object() {[native code]}
    nullProtoObj.constructor; // undefined
    ```
    
- 通过将`Object.prototype` 的`toString`加到纯净对象的**自有**方法中，解决纯净对象打印的问题
    
    ```jsx
    nullProtoObj.toString = Object.prototype.toString;
    nullProtoObj.toString(); // '[object Object]'
    ```
    
    - 不像正常地从`Object`构造函数的原型上继承`toString()`的对象，
    - 纯净对象的`toString()` 方法是**自有**的,因为纯净对象原型为`null`

## 使用现有接口为纯净对象添加自定义原型

- 纯净对象的[[Prototype]]为null，不代表不可以重写赋值原型
- 原型本身是一个对象，所以可以为纯净对象增加一个自定义的原型
- 为了使原型中只存在想要的方法，可以**将纯净对象的原型也设置成纯净对象**
- 然后在这个纯净对象上添加方法，这样就相当于自定义了一个原型，且创造了一个实例其原型是自定义的
- 利用`Object.create()` `Object.getPrototypeOf()` `Object.setPrototypeOf()` `Object.defineProperties()` 可以完成这些方法
    
    ```jsx
    const proto = Object.create(null);
    Object.setPrototypeOf(nullProtoObj, proto);
    Object.getPrototypeOf(nullProtoObj).toString = Object.prototype.toString;
    Object.getPrototypeOf(nullProtoObj).__proto__ = proto;
    Object.defineProperties(proto, {
      constructor: {
        value: Symbol("DIYPrototype"),
      },
      toLocaleString: {
        value: function () {
          return this.toString() + "DIYPrototype";
        },
      },
    });
    ```
    
    ![Untitled](Object%20with%20null%20prototype/Untitled.png)
    
    - 下面是正常的对象
    
    ![Untitled](Object%20with%20null%20prototype/Untitled%201.png)
    
    - 自定义原型的对象只拥有`toString()` `toLocaleString()` 方法，以及`constructor` 和`__proto__` 属性，`constructor`被赋值为一个自定义符号，而`__proto__` 循环引用原型自身

# 优点

- 纯净对象可以因为没有多余的方法和属性，常常作为`[maps](../../6%20%E9%9B%86%E5%90%88%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B/4%20Map.md)` 的**下位替代**（**cheap substitute**）
- 因为普通的对象作为`maps` 常常会产生一些bug
    
    ```jsx
    let ages = { alice: 18, bob: 17 };
    function hasPerson(name) {
      return name in ages;
    }
    function getAge(name) {
      return ages[name];
    }
    
    hasPerson("alice"); // true
    console.log(hasPerson("hasOwnProperty")); // true
    console.log(getAge("bob")); // 17
    console.log(getAge("toString")); // [Function: toString]
    ```
    
    - `hasOwnProperty` 等方法继承自`Object.prototype` 导致出现bug
- 使用纯净对象能解决这种bug
    
    ```jsx
    ages = Object.create(null, {
      alice: {
        enumerable: true,
        value: 18,
      },
      bob: {
        enumerable: true,
        value: 17,
      },
    });
    
    hasPerson("alice"); // true
    console.log(hasPerson("hasOwnProperty")); // false
    console.log(getAge("bob")); // 17
    console.log(getAge("toString")); // undefined
    ```
    
    - 如果将纯净对象作为`map`使用应该避免为纯净对象增加方法，否则也会出现普通对象的问题
- 纯净对象还有一个安全作用：防止原型污染攻击
    - 如果有恶意的脚本在`Object.prototype` 上添加属性或方法
    - 那么在访问普通对象时，这些属性和方法都可能被访问到，除了纯净对象
    - 例如
        
        ```jsx
        let user = {};
        Object.prototype.authenticated = true;
        if (user.authenticated) {
          // 能访问到敏感数据了
          console.log(true); // true
        }
        
        // 使用纯净对象
        user = Object.create(null);
        Object.prototype.authenticated = true;
        if (user.authenticated) {
          // 不会被访问
          console.log(true);
        }
        ```