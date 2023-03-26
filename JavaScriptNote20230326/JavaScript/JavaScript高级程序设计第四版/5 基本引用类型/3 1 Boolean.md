# 3.1 Boolean

# 描述

- 布尔值对应的引用类型就是Boolean
- Boolean作为一个包装对象具有一般引用类型的所有特性

## 语法

```jsx
let booleanObj = new Boolean(true | false);
```

- 传入原始的布尔值

# 方法

## 继承的方法

- valueOf()和toString()方法都被重写了

### Boolean.prototype.valueOf()

- 返回原始值true或者false

```jsx
let b = new Boolean(25);
console.log(b.valueOf()); // true
```

### Boolean.prototype.toString()

- 返回字符串”true”或”false”

```jsx
let b = new Boolean(25);
console.log(b.toString()); // "true"
```

# 区别

- 原始值和引用值（Boolean对象）的区别
1. typeof用于判断原始值和引用值，二者的返回不同，原始值返回boolean, 包装对象返回object
2. instanceof用于判断引用值的类型，原始值判断不是Boolean类型，而Boolean包装对象判断是Boolean类型
    
    ```jsx
    let bValue = true;
    let bObj = new Boolean(bValue);
    console.log(typeof bValue, typeof bObj);
    console.log(bValue instanceof Boolean, bObj instanceof Boolean);
    // 打印结果
    boolean object
    false true
    ```
    

# 建议

- 永远不要使用包装类型创建实例
- 因为容易混淆原始值和引用值而造成不必要麻烦
    
    ```jsx
    let falseObject = new Boolean(false);
    let res = falseObject && true; // obj本身被视为true
    console.log(res); // true 
    ```
    
    - 所有对象在布尔表表达式中被自动转化为true，所以结果为true