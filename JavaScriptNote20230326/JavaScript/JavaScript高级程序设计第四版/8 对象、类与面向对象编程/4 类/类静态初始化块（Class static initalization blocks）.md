# 类静态初始化块（Class static initalization blocks）

参考[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Class_static_initialization_blocks)

# 定义

- **类静态初始化块**（**Class static initalization blocks**）是一个的类（class）特殊特性（special feature）,这个特性让类能更**灵活**（**flexible**）的初始化静态属性，而不是笨拙的在每个域中分开（per-field initalization）初始化
- 笨拙的初始化方式在[4.3.4 非函数原型和类成员](../4%20%E7%B1%BB.md) [非函数原型和成员](../4%20%E7%B1%BB.md) 中解释过，如下
    
    
    ```jsx
    class Person {
      sayName() {
        console.log(`${Person.greeting}${this.name}`);
      }
    }
    const person = new Person();
    person.sayName(); // undefinedundefined
    // 定义类成员
    Person.greeting = "My name is ";
    
    // 定义原型成员
    Person.prototype.name = "mangwu";
    person.sayName(); // My name is mangwu
    ```
    
    ```jsx
    class Person {
    	static constitute = ["化学组成", "血液", "肌肉", "骨骼", "大脑", "四大组织"]; 
    }
    console.log(Person.constitute); // ["化学组成", "血液", "肌肉", "骨骼", "大脑", "四大组织"]
    ```
    
- 静态块的功能强大
    - 它允许语句在初始化期间进行语句执行（evaluated）
    - 例如可以在初始化时使用`try…catch` 语句、从单个值中设置多个字段（set multiple fields from a single value）
- 静态初始化块是在当前类声明的上下文中执行的，所以它具有对私有状态的**访问特权**（**privileged access**）
    - 这意味着静态初始化块可以用于在具有**实例私有字段（instance private fields）**的类和同一个作用域中的其它声明的类或函数之间共享信息（类似于C++中的朋友类）

# 语法

```jsx
class {
	static {
		this.staticMember1 = value1;
		...
		this.staticMemberN = valueN;
	}
}
```

- 在`static` 块（类静态初始化块）中，`this` 指向类本身，`this.staticMemberI` 表示要声明的类静态成员，可以是静态属性也可以是静态方法
- 静态初始化块除了`static`外，没有其它修饰符（decorators）
- 例子
    
    ```jsx
    class ClassWithStaticInitalBlock {
      static {
        this.staticP1 = "property1";
        this.staticP2 = "property2";
        this.method = () => console.log(this.staticP1);
      }
    }
    
    console.log(ClassWithStaticInitalBlock.staticP2); // property2
    console.log(ClassWithStaticInitalBlock.staticP1); // property1
    ClassWithStaticInitalBlock.method() // property1
    ```
    
    - 类对象本身的结构如下
    
    ![Untitled](%E7%B1%BB%E9%9D%99%E6%80%81%E5%88%9D%E5%A7%8B%E5%8C%96%E5%9D%97%EF%BC%88Class%20static%20initalization%20blocks%EF%BC%89/Untitled.png)
    

# 理解类静态初始化块

## 执行顺序

- 一个**类主体**（**class body**）中能拥有多个静态初始化块
- 这些静态初始化块连通其它交叉（interleaved）的静态字段**初始化器**（**initializers**）按照声明顺序执行（evaluated）
- 父类的任何静态初始化都是在子类初始化之前执行的
- 例子
    
    ```jsx
    class Test {
      constructor() {}
      static method1() {
        console.log("method1");
      }
      static property1 = "property1";
      method() {
        console.log("method");
      }
      static {
        this.property2 = this.property1;
        this.method2 = () => console.log(this.property2);
      }
      static {
        this.property3 = this.property3;
      }
    }
    ```
    
    - 顺序：method1 ⇒ property1 ⇒ static 块 1 ⇒ static 块2
    - 块1指定义`this.property2` 的块，块2指定义`this.property3`的块

## 作用域

- 静态块内的变量声明作用域（the scope of variables declared）是**局部**作用域
- 在块中声明的var、function、const或let都是静态初始化块的局部变量，块中的var声明不会被提升到外部
- 静态块的作用域**嵌套在**（**nested within**）类主体的词法作用域（lexical scope）中，所以能访问类的私有实例变量
- 例子
    
    ```jsx
    var a = 2;
    var b = 3;
    class Test2 {
      static {
    		a = 4;
    		b = 4;
        var a = 3; // 静态块的局部变量
      }
    }
    console.log(a, b); // 2 4 
    ```
    

## this和super

- 静态块中的`this` 引用类本身，即`ClassName.prototype.constructor`
- `super.<property>` 语法能获取到父类的（静态）属性
- 注意在静态块中调用`super()` 或访问父类的`constructor` 是一个错误的语法（syntax error）
- 例子
    
    ```jsx
    // this和super
    class A {
      static fieldA = "A field";
    }
    class B extends A {
      static method() {
        console.log("B method");
      }
      static {
        console.log(super.fieldA); // A field
        this.method() // B method
      }
    }
    ```
    

## 访问私有变量

- 可以在静态块中定义方法并传递给外部变量，该方法传递一个类实例，通过类实例就能方法到任意的私有属性
    
    ```jsx
    let getDPrivateField;
    
    class D {
      #privateField;
      constructor(v) {
        this.#privateField = v;
      }
      static {
        getDPrivateField = (d) => d.#privateField;
      }
    }
    console.log(getDPrivateField(new D("private"))); // private
    ```
    
    - [v8日志](https://v8.dev/features/class-static-initializer-blocks#access-to-private-fields)上的例子
- 实际上除了静态块，普通的静态方法同样能访问到私有属性
    
    ```jsx
    class E {
      #privateField;
      constructor(v) {
        this.#privateField = v;
      }
      static getDPrivateField(d) {
        return d.#privateField;
      }
    }
    console.log(E.getDPrivateField(new E("private"))); // private
    ```
    

# 浏览器兼容性

20220921

![Untitled](%E7%B1%BB%E9%9D%99%E6%80%81%E5%88%9D%E5%A7%8B%E5%8C%96%E5%9D%97%EF%BC%88Class%20static%20initalization%20blocks%EF%BC%89/Untitled%201.png)