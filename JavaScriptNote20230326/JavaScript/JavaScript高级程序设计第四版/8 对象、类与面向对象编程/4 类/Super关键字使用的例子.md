# Super关键字使用的例子

# 在类中使用Super

- 在类构造函数中作为父类的构造函数被调用super(…args)

```jsx
// 作为父类的函数被调用
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  get area() {
    return this.height * this.width;
  }
  sayName() {
    console.log(this.name);
  }
}
Rectangle.prototype.name = "Rectangle";

class Square extends Rectangle {
  constructor(length) {
    console.log("super必须在this访问前被调用");
    **super(length, length); // 必须在使用this前被调用**
    this.length = length;
  }
}
Square.prototype.name = "Square";

const square = new Square(6); // super必须在this访问前被调用
square.sayName(); // Square
console.log(square.area); // 36
```

# 调用超类的静态方法

- 在子类的静态方法中才能调用超类的静态方法

```jsx
class Triangle {
  static logSides() {
    return "我有三条边";
  }
}
class EquilateralTriangle extends Triangle {
  static logDescription() {
    console.log(`${super.logSides()}, 并且它们都相等`);
  }
}
EquilateralTriangle.logDescription(); // 我有三条边, 并且它们都相等
```

# 在类字段声明时访问super

- 在**类字段初始化**（**class field initialization**）时，`super` 的引用取决于当前字段是实例字段还是静态字段

```jsx
// 在字段初始化时进行访问
class Base {
  static staticField = 100;
  instancePrototypeMethod() {
    return 1000;
  }
}
Base.prototype.instancePropertypeProperty = 999;
class Extended extends Base {
  extendedField = super.instancePrototypeMethod();
  constructor() {
    super();
    this.ownProperty = super.instancePropertypeProperty;
  }
  static extendedStaticField = super.staticField;
  static staticMethod() {
    console.log(super.staticField);
  }
}

console.log(Extended.extendedStaticField); // 100
Extended.staticMethod() // 100

const extened = new Extended();
console.log(extened); // Extended { extendedField: 1000, ownProperty: 999 }
```

**临时小结**

至此，关于super在**类**中的基本使用已经全部介绍完毕：

1. 在静态环境下，`super`就可以看成**父类本身**，能获取到父类对象的自有属性（静态成员）以及父类的[[Prototype]]特性中的属性
2. 在非静态环境下，`super` 就可以看成**子类**的`prototype` 属性，能获取到父类的原型方法和原型属性；`~~constructor` 是非静态环境，`super(…args)` 等价于 `super.constructor(…args)` 等价于 `Class.prototype.constructor(...args)` 等价于 调用父类的构造函数~~ (并不准确)

# 删除super的属性会抛出错误

```jsx
// 不能删除super的属性
class Base2 {
  foo() {}
}

class Derved extends Base2 {
  delete() {
    delete super.foo;
  }
}
try {
  new Derved().delete()
} catch (error) {
  console.log(error.toString()); // ReferenceError: Unsupported reference to 'super'
}
```

# 在对象字面量中使用super.prop

- super也能用在**对象初始化器/字面量标识（object initializer/literal notation）**

```jsx
const obj1 = {
  method1() {
    console.log("method1");
  },
};

const obj2 = {
  method2() {
    super.method1();
  },
};
obj2.__proto__ = obj1;
obj2.method2(); // method1
```

- 在`obj2` 中，`super`被看作`obj2.__proto__` 因为`obj2.__proto__` 被赋值为`obj1` 所以可以访问到`method1()`

# 通过super.prop访问到的方法在绑定其他对象执行时不会发生变化

- 访问`super.x` 的行为和`Reflect.get(Object.getPropertyOf(objectLiteral), "x", this)` 一样
- 这意味着属性总是在对象字面量/类声明的原型上寻找，并且解绑和重绑定一个方法不会改变`super`的引用（因为super与this无关，解绑和重绑都是针对`this`的修改）

```jsx
// 解绑和重绑不会影响super的引用
class A {
  aGetX() {
    return 1;
  }
}
class B extends A {
  getX() {
    return super.aGetX();
  }
}

const b = new B();
console.log(b.getX());
const { getX } = b;
console.log(getX()); // 在全局作用域中调用，this就是Global

const parent1 = { prop: 1 };
const parent2 = { prop: 2 };
const child = {
  getParentProp() {
    console.log(super.prop);
  },
};
Object.setPrototypeOf(child, parent1);
child.getParentProp();

const getParentProp = child.getParentProp;
getParentProp();

const anotherChild = { __proto__: parent2, getParentProp };
anotherChild.getParentProp(); // 绑定了anotherChild且原型为parent2
// 打印结果全为1，不会改变
```

- 唯一能使super引用发生改变的情况是，super引用的原型的继承链完全改变

```jsx
class C {
  aGetX() {
    return 2;
  }
}
Object.setPrototypeOf(B.prototype, C.prototype); // B.prototype.__proto__ = C.prototype
console.log(getX()); // 2

Object.setPrototypeOf(child, parent2); // child.__proto__ = parent2
getParentProp(); // 2
```

# 设置super.prop或导致设置成this.prop

- 设置super的属性值，例如`super.x = 1` 行为和`Reflect.set(Object.getPrototypeOf(objectLiteral), "x", 1, this)` 一样
- `Reflect.set(target, propertyKey, value, receiver)` 等行为是
    - 将`target`对象中的`propertyKey`属性值设置为`value`
    - 如果`target` 上没有设置`propertyKey` 的setter方法，就会在`receiver`上设置`propertyKey` 属性
- 在例子`super.x = 1` 中，`receiver`就是`this` 所以相当于`this.x = 1`

```jsx
class D {}
class E extends D {
  setX() {
    super.x = 2;
  }
}
const e = new E();
e.setX();
console.log(e); // E { x: 2 }
```

- `super.x = 2` 会去在`D.prototype` 属性上寻找属性`x` 的属性描述符（property descriptor）
- 如果存在`D.prototype.x` 就会调用其`setter` （首先x要是访问器属性才有效）并设置值为2
- 因为`D.prototype.x`上不存在相关属性所以直接在`this` 上定义了属性`x`