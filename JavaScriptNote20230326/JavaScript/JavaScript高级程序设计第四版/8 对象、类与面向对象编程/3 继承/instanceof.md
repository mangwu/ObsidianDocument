# instanceof

# `instanceof`

- `instanceof` 操作符用于检查一个构造函数的`prototype` 属性（原型对象）是否存在于一个对象的原型链上，如果存在就返回`true`，否则返回`false`
- `instanceof` 的行为能被`[Symbol.hasInstance](../../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/%E5%B8%B8%E7%94%A8%E5%86%85%E7%BD%AE%E7%AC%A6%E5%8F%B7.md)` 自定义

# 语法

```jsx
object instanceof constructor
```

## 参数

`object` : 用于检查其原型链上是否存在构造函数关联的原型对象的对象

`constructor` ： 被检查的构造函数，其关联的原型对象用于匹配`object` 的原型链

## 异常（Exception）

抛出 `TypeError` 的情况

1. 如果`constrcutor` 不是一个对象
2. 构造函数`constructor`没有一个`[@@hasInstance](../../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/%E5%B8%B8%E7%94%A8%E5%86%85%E7%BD%AE%E7%AC%A6%E5%8F%B7.md)`符号属性方法
3. `constructor` 必须是一个函数

# 理解instanceof

- `instanceof` 操作符测试构造函数关联的原型对象是否存在于对象的原型链中
- 这**通常**意味着对象由构造函数构建(constructed)

# 注意

1. `instanceof` 检查两次相同的对象和构造函数时，返回的值结果可能发生变化
    1. 如果构造函数的原型被重写（re-assigned）,那么之前声明的实例的`instanceof` 构造函数就会返回false
    2. 使用`Object.setPrototypeOf()` 修改构造函数原型对象的原型时，构造函数声明的实例和其他构造函数使用`instanceof` 可能返回false
    
    ```jsx
    // instanceof
    function A() {}
    function B() {}
    function C() {}
    
    const a1 = new A();
    console.log(a1 instanceof A); // true
    const b = new B();
    A.prototype = b;
    console.log(a1 instanceof A); // false
    console.log(a1 instanceof B); // false
    
    const a2 = new A();
    console.log(a2 instanceof A); // true
    console.log(a2 instanceof B); // true
    
    Object.setPrototypeOf(b, C.prototype);
    console.log(a2 instanceof A); // true
    console.log(a2 instanceof B); // false
    console.log(a2 instanceof C); // true
    ```
    
    - 在A的原型被重写前声明的`a1` 因为最初的原型不再是A的原型，所以`a1 instanceof A` 由`true` 变为`false`
    - 因为A的原型被重写为B的实例`b` ，所以在重写后声明的`a2` 的原型链上既有A的原型，又有B的原型
    - 将b实例的原型设置为`C.prototype` 后，`a2` 的原型链上就不再有`B.prototype` ，而是`C.prototype`
2. 类（clas）同样遵循上面的原则，将A，B，C使用类声明，上述的例子的结果是一致的
3. 如果构造器函数有`Symbol.hasInstance` 方法，`instanceof` 在判断时会优先调用该符号属性方法，且该方法的唯一参数就是被检查的o`bject` ，`this` 指向构造函数
    
    ```jsx
    class Forgeable {
      static isInstanceFlag = Symbol("isInstanceFlag");
      static [Symbol.hasInstance](obj) {
        // 如果对象中有指定的符号属性就方法true
        return Forgeable.isInstanceFlag in obj;
      }
    }
    // 构造一个包括符号属性的普通对象和一个Forgeable实例
    const normal = { [Forgeable.isInstanceFlag]: true };
    const forgeable = new Forgeable();
    console.log(normal instanceof Forgeable); // true
    console.log(forgeable instanceof Forgeable); // false
    ```
    
    - 使用`instanceof` 检查对象的原型时，会检查构造函数是否定义了`Symbol.hasInstance`方法
    - 如果定义了就直接使用该符号方法，传入被检查的对象；因为`normal` 对包含指定的符号属性，所以返回`true` ；而`Forgeable` 实例没有指定得到符号属性（符号属性被定义为静态的），所以返回false
4. 对于*bound functions* （使用bind()绑定指定this的方法）而言，`instanceof` 检查的构造函数仍然是被绑定的构造函数，因为*bound functions* **没有**原型对象
    
    ```jsx
    class Base {}
    
    const BoundBase = Base.bind(null, 1, 2, 3);
    console.log(new Base() instanceof BoundBase); // true
    ```
    
    - 相当于 `new Base() instanceof Base`
5. instanceof 和多个全局对象（**multiple realms**）
    1. 每个JavaScript的运行环境（如windows， frames等）在它们自己的全局环境（**realm**）中
    2. 不同的全局环境有不同的内置对象（不同的全局对象，不同的构造函数）
    3. 当浏览器脚本需要在多个窗口之间进行交互时，可能会引发一些问题
    4. 比如：`[] instance of window.frames[0].Array` 会返回`false` 因为`Array.prototype !== window.frames[0].Array.prototype` 并且数组从前者继承后者
    
    ---
    
    - 你可能认为这样没有意义，但当你的脚本开始出多个frame或多个window以及通过函数将对象从一个窗口传到另一窗口时，这个就是一个巨大的问题
    - 可以使用`Array.isArray(myObj)` 或者`Object.prototype.toString().call(myObj) === "[object Array]"` 来安全的检测传过来的对象是否是一个数组
    - 检测一个`Nodes`在另外一个窗口中是不是`SVGElement` ，可以使用`myNode instanceof myNode.ownerDocument.defaultView.SVGElement`
6. 使用`Object.create()` 创建的对象的原型是传入的对象，所以它返回的对象的`instanceof` 结果和传入的对象是一致的，因为`null instanceof Object` 返回`false`，所以[纯净对象](../2%20%E5%88%9B%E5%BB%BA%E5%AF%B9%E8%B1%A1/Object%20with%20null%20prototype.md) 也有相同的行为
    
    ```jsx
    console.log(null instanceof Object); // false
    console.log(Object.create(null) instanceof Object); // false
    ```