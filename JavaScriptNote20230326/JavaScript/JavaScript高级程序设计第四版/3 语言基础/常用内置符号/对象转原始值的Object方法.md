# 对象转原始值的Object方法

# Object.prototype.valueOf()

## 描述

- 该方法指定对象的原始值
- 语法
    
    ```jsx
    object.valueOf(); // object是一个对象
    ```
    
    - 返回值为object的原始值

## 功能

### 调用情况

- 默认情况下很少主动调用该方法
- 当遇到要预期的原始值对象时，JavaScript会自动调用
    - 即在有些操作下，需要将该对象转化为原始值进行计算时就会调用`valueOf()` 方法
    - 例如，使用`console.log(object)` 打印对象时，就会调用valueOf打印出原始值
        
        ```jsx
        #// valueOf
        const object = { a: 1, b: 2 };
        console.log(object);
        
        // 结果
        { a: 1, b: 2 } // 默认以大括号包裹，键值对形式显示(对象的字面量写法)
        ```
        

### 覆盖情况

- 默认情况`valueOf` 方法由`Object` 后面的对象继承
- 每个**内置的核心对象（**如下**）**都会覆盖此以返回适当的值
    
    ![Untitled](%E5%AF%B9%E8%B1%A1%E8%BD%AC%E5%8E%9F%E5%A7%8B%E5%80%BC%E7%9A%84Object%E6%96%B9%E6%B3%95/Untitled.png)
    
- 如果对象没有原始值，valueOf()返回对象本身（即显示对象的字面量写法）

### 不同对象的valueOf()返回值类型

| 对象 | 返回值 |
| --- | --- |
| Obejct | 对象本身（默认情况）,例如{a:1} ,type {} (如果对象是自定义类型的话)  |
| Array | 数组本身,例如 [1,2,3] |
| Boolean | 布尔值（true或者false） |
| Date | 从1970.1.1午夜开始的毫秒数UTC，例如1652888139333 |
| Function | 函数本身，例如parseInt.valueOf() // ƒ parseInt() { [native code] } |
| Number | 数字值 |
| String | 字符串值 |
|  | 注意：Math和Error对象没有valueOf方法 |

# Object.prototype.toString()

## 描述

- 返回一个表示该对象的字符串
- 语法
    
    ```jsx
    obj.toString()
    ```
    
    - 默认Object对象返回`[object Object]`

## 功能

- 每个对象都会有一个toString()方法

### 调用情况

- 在对象被当作文本值或者一个对象以预期字符串的方式引用时自动调用
- 例如使用`+` 对字符串和一个普通对象相加时，普通对象就会调用toString()方法获取字符串值
    
    ```jsx
    const obj = {}
    console.log("obj" + obj); // 'obj[object Object]'
    ```
    

### 覆盖情况

- toString()方法被每个对象继承
    - 对于自定义的对象，如果没有覆盖该方法，默认返回`"[object type]"` 其中type是对象的类型,默认是Object（没有覆写的话）
        
        ```jsx
        class A extends Object {
          constructor(data) {
            super();
            this.data = data;
          }
        }
        const a = new A(123);
        console.log(a); // 调用valueOf()
        console.log(a.toString()); // 调用toString();
        
        // 打印
        A { data: 123 }
        [object Object]
        ```
        
    - 覆写该方法可以自定义转化的字符串，如Date对象就覆写，返回一个实际时间
        
        ![Untitled](%E5%AF%B9%E8%B1%A1%E8%BD%AC%E5%8E%9F%E5%A7%8B%E5%80%BC%E7%9A%84Object%E6%96%B9%E6%B3%95/Untitled%201.png)
        

### 用于检查对象类型

- 将Object内置的toString方法使用变量保存，然后使用`Function.prototype.call()` 返回的形式调用它，填入需要检查的对象作为第一个参数，即thisArg
    
    ```jsx
    let toString = Object.prototype.toString;
    console.log(toString.call(this));
    console.log(toString.call(new Date()));
    console.log(toString.call(global));
    console.log(toString.call()); // thisArg 是undefined
    console.log(toString.call(null));
    
    console.log(new Date().toString());
    
    // 打印
    [object Object]
    [object Date]
    [object global]
    [object Undefined]
    [object Null]
    Thu May 19 2022 23:20:43 GMT+0800 (中国标准时间)
    ```
    
    1. 这种调用方式会将type指定为对应的对象类型，从而更好的判断
    2. 在JavaScript1.8.5之后，通过`null`，`undefined` 调用的toString() 返回如上形式（不能直接调用`null.toString()`）
    3. 通过call方法指明调用的this指向和直接通过对象调用内置的toString()方法是不同的
        1. 一个是调用Object类定义的toString方法
        2. 一个是调用对象内置的toString()方法（虽然是从Object继承的，但是可能被覆写了）

# 注意

- 在默认将对象转化为原始数据类型的过程中，调用方法是有优先级的
- 优先调用valueOf，再调用toString()