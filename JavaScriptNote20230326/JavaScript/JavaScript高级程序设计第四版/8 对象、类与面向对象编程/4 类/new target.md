# new.target

# new.target

`new.target` 伪属性（pseudo-property）能检测（detect）一个函数或构造函数(function or constructor)是否使用了`new`操作符进行调用

在使用`new`操作符调用(invoked)的函数和构造函数中，`new.target` 会返回函数或构造函数本身的引用

不使用`new` 操作符普通调用函数或构造函数，`new.target` 是`undefined`

### 语法

```jsx
new.target
```

# 描述

- 对于JavaScript语法而言，句点访问语法的左边都是对象，右边是对象要访问的属性，但是`new.target`中 `new`并不是一个对象
- `new.target` 伪属性在所有的方法中都有效，可以把它看作一个能在方法中使用的表达式
    - 在类构造函数中，`new.target` 引用被构造的类，例如在父类的构造函数中使用`new.target` ，子类在实例化时，`new.target` 就是子类的引用
    - 在普通的函数中，假设函数是通过`new`操作符调用的，`new.target` 就是指函数本身，否则就是`undefined`
        - 注意在任何通过盗用构造函数实际继承的普通构造函数中，调用父类的方式为`call()` 或`apply()` 所以父类中的`new.target` 是`undefined`
        - 而在构造函数中，使用`super(..args)` 语法调用父类构造函数，父类构造函数中的`new.target` 是子类
    - 在箭头函数中，`new.target` 继承于周围的域（surrounding scope）

## 例子

```jsx
class A {
  constructor() {
    console.log(new.target);
  }
}
class B extends A {}

new B(); // [class B extends A]
new A(); // [class A]
```