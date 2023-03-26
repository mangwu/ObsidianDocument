# 1.Object

# 描述

- Object是JavaScript的一种数据类型（引用类型的一种）
- 它用于**存储各种键值集合和更复杂的实体**
- JavaScript中**几乎所有的对象都是Object类型的实例**
    - 这些对象通过Object.prototype基础属性和方法
    - 大部分属性和方法都被覆盖（shadowed）或重写（overridden）
- 关于Object类型的更多描述可以查看[4.8 Object类型](../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80.md)

# 语法

- 创建Object实例有两种方法
- 读取实例的属性也有两种方法

## 使用new操作符

```jsx
let obj = new Object()
obj.name = "mangwu";
```

## 对象字面量

- 对象字面量(object literal)表示法，对象字面量是对象定义的**简写模式**，可以**方便地**创建一个Object实例对象

```jsx
let person = {
	name: "mangwu",
	age: 22,
}
```

- 左大括号（{）表示对象字面量的开始
    - 左大括号出现在一个**表达式上下文**（expression context）中
    - 表达式上下文指期待返回值的上下文
    - 赋值操作符表示后面期待一个值，所以是**表达式上下文**
    - 所以左大括号在这里表示对象字面量的开始
    
    ---
    
    - 如果左大括号出现在一个**语句上下文**（statement context）中
    - 则左大括号表示一个语句块的开始
    - 例如if语句后的左大括号，if是一个语句上下文，所以左大括号表示语句块的开始
- 然后指定name属性和，后跟上一个冒号，然后是属性的值
    - 对象字面量中属性的定义语法就是`key: value`
- 逗号用于在对象字面量中分隔属性定义，而最后一个对象定义后可以不添加逗号
    - 在最后一个属性定义后面添加逗号在非常老的版本中会报错
    - 但是在现代浏览器中，最后一个属性定义后面逗号是可选的，和代码风格有关系
- 对象字面量表示法中，属性名可以是
    - 字符串， 可以使用单/双引号包裹字符串，也可以不使用引号（不能使用反引号）
    - 数值，自动转化成字符串
    - `[varible]` :中括号中是外部变量，变量类型可以是**字符串或数值或符号**

```jsx
let sym = Symbol.iterator;
const person = {
  [sym]: function* () {
    yield 1;
    yield 2;
    yield 3;
  },
  5: 2,
  "a": 2,
  k: "567",
};
console.log(person);
for(const item of person) {
  console.log(item);
}
// 打印结果
{
  '5': 2,
  a: 2,
  k: '567',
  [Symbol(Symbol.iterator)]: [GeneratorFunction: [Symbol.iterator]]
}
1
2
3
```

### 注意

- 在使用对象字面量方法构造Object实例时，**不会调用Object构造函数**

### 使用

- 对象字面量方法构造对象实例已是常用的对象构造方法
- 因为代码更简洁，更直观，也有封装数据的感觉
- 除此之外，函数传递大量参数时，可以将参数集合成一个对象字面量的形式进行传递
    
    ```jsx
    function displayInfo(args) {
      const { name, age } = args;
      console.log(name + age);
      return name + age;
    }
    displayInfo({ name: "mangwu", age: 22 }); // mangwu22
    ```
    
    - 这种方式将函数参数作为一个对象集合起来，方便参数传递
- 一般而言，参数分开传递更加直观，但是参数过多就显得笨拙
    - 最好方式是，必传参数直接使用命名参数
    - 而多个可选参数可以通过对象字面量封装传递

## 点语法存取

- 使用点语法可以存取**key为字符串定义**的属性
    
    ```jsx
    person.a = 3;
    ```
    

## 中括号存取

- 中括号存取的方式功能更强大
    - 可以存取字符串定义的属性，但是需要使用引号包裹字符串
    - 可以存取数字定义的属性，直接传入数字即可（也可使用字符串形式数字）
    - 可以存取符号定义的属性，直接使用符号即可
    - 也可以在中括号中使用变量，变量类型可以是数字，字符串和符号
- 例子
    
    ```jsx
    let sym = Symbol.iterator;
    const person = {
      [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
        yield 3;
      },
      5: 2,
      a: 2,
      k: "567",
    };
    // 中括号语法
    console.log(person[5]); // 2
    console.log(person["5"]); // 2
    console.log(person[Symbol.iterator]); // [GeneratorFunction: [Symbol.iterator]]
    console.log(person[sym]) // [GeneratorFunction: [Symbol.iterator]]
    ```
    
    - sym是一个变量，利用中括号可以读取以变量值为属性key的属性值
    - 也可以直接使用符号Symbol.iterator读取以符号位属性的属性值

### 注意

- 对于有特殊字符的字符串属性，点语法可能无法调用，需要使用中括号语法
- 例如”first name” 中间有一个空格，它可以被当作属性，但是无法通过点语法读取
    
    ```jsx
    let person2 = {
      "first name": "mang",
    };
    // 只能通过中括号语法调用
    console.log(person2["first name"]);
    ```