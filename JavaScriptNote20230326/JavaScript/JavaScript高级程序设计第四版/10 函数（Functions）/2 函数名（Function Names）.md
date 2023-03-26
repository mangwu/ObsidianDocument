# 2. 函数名（Function Names）

# 2.1 函数名

## 2.1.1 ES5及之前的理解

- **函数名就是指向函数的指针**，所以它们跟其它包含对象指针的变量具有相同的行为，也就是说一个函数**可以有多个函数名称**
- ES5及之前，函数对象本身没有一个表示自身名称的属性，所以只要一个**变量** 保存着指向函数的指针，在广义上理解这个变量名称就是该函数的一个名称

**例子**

```jsx
function sum(num1, num2) {
  return num1 + num2;
}
console.log(sum(1, 2)); // 3

let anotherSum = sum;
console.log(anotherSum(2, 3)); // 5

sum = null;

console.log(anotherSum(4, 3)); // 7
```

- 定义一个`sum()` 的函数，然后又声明了一个变量`anotherSum` 值设置为`sum` （不带括号使用函数会访问函数指针，而不会指向函数），此时`anotherSum`和`sum` 都指向同一个函数，即这个函数有两个名称
- 把`sum` 设置为`null` ，就切断了`sum` 和函数之间的关联，而`anotherSum` 仍然指向该函数，可以正常调用，此时，这个函数只有一个函数名即`anotherSum`

## 2.1.2 ES6及之后的理解

- ES6的**所有函数（包括箭头函数）**对象本身都会暴露一个只读的`name` 属性，其中包含了关于函数的信息
- `name` 属性的特征为可配置（**configurable**）、不可枚举（non-enumerable），不可写（non-writable）的数据属性
- 多数情况下，这个属性中保存的就是一个函数标识符，或者说是一个字符串化的变量名，可以在函数定义时在函数体内直接使用

`**name` 属性的初始化**

1. 箭头函数的`name` 属性初始化为**首次声明**时，保存箭头函数对象引用的变量标识符;如果作为参数传递，没有使用变量保存，箭头函数的`name` 就是空字符串
    
    ```jsx
    // 箭头函数
    const a = () => {};
    const b = a;
    function logFuncName(arrowFunc) {
      console.log(arrowFunc.name);
    }
    logFuncName(() => {}); // 无名箭头函数
    logFuncName(a); // 箭头函数名称为首次声明时使用的变量标识符
    logFuncName(b);
    // 打印结果
    
    a
    a
    ```
    
2. 函数声明语法：函数声明语法已经明确了函数的名称，就是`function`关键字后的名称标识符
    
    ```jsx
    // 函数声明语法
    function funName() {}
    logFuncName(funName); // funName
    ```
    
3. 函数表达式语法：因为函数表达式语法可以省略`function` 关键字后的名称标识符，所以它的名称分为如下三种情况
    1. 省略名称标识符，作为参数传递时，`name` 属性值为空字符串
        
        ```jsx
        logFuncName(function () {});
        ```
        
    2. 省略名称标识符，赋值给一个变量，`name` 属性是首次定义时，保存函数对象的变量标识符（和箭头函数类似）
        
        ```jsx
        const expressionFunc = function () {};
        logFuncName(expressionFunc) // expressionFunc 
        ```
        
    3. 不省略名称标识符，`name` 属性就是`function` 关键字后的名称标识符（在声明完后不能在外部使用）
        
        ```jsx
        const expressionFunc2 = function anonymous() {};
        logFuncName(expressionFunc2); // anonymous
        ```
        
4. 使用`Function` 后构造函数创建的函数对象，默认名称标识符为`anonymous` ，但是不能在函数内部使用这个名称标识符
    
    ```jsx
    logFuncName(new Function()); // anonymous
    ```
    
    - 注意，虽然`Function` 构造函数创建的函数名称为`anonymous` 但函数体内部是不能使用`anonymous` 来引用函数对象本身的，因为使用构造函数创建的函数对象的作用域是`Function` 所在的作用域

# 2.2 特殊函数名

- 如果函数是一个`setter` 、`getter` 或者使用`bind()` **实例化**（**instantiated**）的的函数，`name` 属性标识符前面会增加一个**前缀**（**preffix**）
    - `setter`：加上`set` 前缀
    - `getter` : 加上`get`前缀
    - 使用`bind()` 绑定`this` 的函数：加上`bound` 前缀
- 例子
    
    ```jsx
    const o = {
      age_: 22,
      get age() {
        return this.age_;
      },
      set age(val) {
        this.age_ = val;
      },
    };
    const k = { age_: 23 };
    const propertyDescriptor = Object.getOwnPropertyDescriptor(o, "age");
    const fn = propertyDescriptor.get.bind(k);
    console.log(propertyDescriptor.get.name); // get age
    console.log(propertyDescriptor.set.name); // set age
    console.log(fn.name); // bound get age
    console.log(fn()); // 23
    ```
    
    - 值得注意的是获取访问器属性的`setter`和`getter` 不能直接使用对象进行访问，需要使用获取自有属性的描述符的方法进行获取
    - 可以对`getter` 或`setter` 方法进行`this` 绑定，如`propertyDescriptor.get.bind(k)` 这样`name` 就会在原有的名称标识符加上`bound` 变成 `bound get age`
- `setter` `getter` 以及使用`bind()` 实例化的函数名称标识符需要加上各自的前缀是为了**更好识别区分**，它们都是没有`prototype` 属性不能当作构造函数的函数

<aside>
💡 注意：普通函数的名称标识符可以在函数体内当作函数对象本身进行使用，而`setter`，`getter`，`bind` 等特殊函数的名称标识符仅作区分，不能当作函数对象本身在函数体中进行使用（因为标识符中包含空格无法使用），一般通用解决方案是使用`arguments.callee` （同样适用于[使用`Function` 构造函数实例化的函数对象](2%20%E5%87%BD%E6%95%B0%E5%90%8D%EF%BC%88Function%20Names%EF%BC%89.md)）

</aside>