# 16. 私有变量（Private Variables）

# 16.1 定义

- 严格来讲，JavaScript没有**私有成员（private members）**的**概念**（**concept**）；所有对象的属性都是公有（public）的。【但是可以通过闭包和WeakMap模拟私有成员，类中也有`#member` 语法来实现私有成员】
- **私有变量**（**Private Variables**）在JavaScript是存在的**任何定义在函数或块中的变量**，都可以认为是**私有的**，因为在这个函数或块的外部无法访问其中的变量
- 私有变量包括**函数参数**（**function arguments**）、**局部变量**（**local variables**）、以及函数内部定义的其它函数
    
    ```jsx
    function sum(num1, num2) {
      let sum = num1 + num2;
      return sum;
    }
    ```
    
    - `sum()` 函数中有3个私有变量：`num1` , `num2` 、`sum`
    - 这几个变量只能在函数内部使用不能在函数外部访问

# 16.2 理解私有变量

- 在上一节（闭包）中，在函数中创建一个闭包，则这个闭包能通过其作用域链访问外部函数中的变量，基于这一点，就可以创建出能够访问私有变量的**公共（public）**方法

## 16.2.1 特权方法（privileged mehtod）

- **特权方法（privileged mehtod）**就是能够访问函数私有变量（及私有函数）的公有方法
- 在**对象（objects）**中创建特权方法的有两种，第一种是在构造函数（constructor）中实现
    
    ```jsx
    // 在构造函数中创建
    function SuperType() {
      // 私有变量和私有函数
      let privateVariable = 0;
      function privateFunction() {
        return false;
      }
      // 特权方法
      this.getPrivateVariable = function () {
        return privateVariable;
      };
      this.getPrivateFunction = function () {
        return privateFunction;
      };
    }
    ```
    
    - 这个模式把所有私有变量和私有函数都定义在构造函数，然后再创建两个能访问这些私有成员的特权方法
    - 因为定义在构造函数中的特权方法其实是一个闭包，它具有访问构造函数中定义的所有变量和函数的能力
    - 在创建`SuperType` 的实例后，没有办法直接访问`privateVariable` 私有变量和`privateFunction` 私有函数，只能通过实例的特权方法`getPrivateVariable()` 和`getPrivateFunction()` 访问
- 因为闭包除了能访问到函数中外部声明的变量，还能访问到外部函数的参数，所以可以将传入的参数作为私有变量，然后定义访问和设置它的特权方法，隐藏这个参数以达到模拟其他语言中私有成员的效果（隐藏不能直接修改的数据）
    
    ```jsx
    // 私有变量，隐藏不能被直接修改的数据
    function Person(name) {
      this.getName = function () {
        return name;
      };
      this.setName = function (value) {
        name = value;
      };
    }
    let person = new Person("mangwu");
    console.log(person.getName()); // mangwu
    person.setName("wumang");
    console.log(person.getName()); // wumang
    ```
    
    - `Person` 构造函数具有两个特权方法，`getName()` 和`setName()` 它们都是闭包，引用`Person` 函数的活动对象中的参数`name` ，每次调用都能获取或设置`name`
    - 私有变量`name` 对每个`Person` 实例而言都是独一无二，因为每次调用构造函数都会重写创建一套变量和方法，相当于每次调用`Person` 创建的活动对象都会保留活动对象，这回导致内存占用太多空间，使用静态私有变量特权方法可以避免问题

# 16.3 静态私有变量（Static Private Varibales）

- 特权方法也可以通过使用**私有作用域**（**private scope**）定义**私有变量**和**私有函数**来实现；这里这个私有作用域实际上就是**IIFE**或块级作用域，在这个作用域中不使用声明关键字或使用`var` 保证外部能引用到定义的构造函数，使用`let` 或`const` 定义局部的**私有变量**和**私有函数**使得外部不能引用，然后在构造函数中通过原型链的方式定义公共的特权方法能够访问私有变量和私有函数，这样就可以避免内存占用的问题
    
    ```jsx
    (function () {
      let name = "";
      const hash = new WeakMap();
      let idx = 0;
      Person = function (value) {
        name = value;
        hash.set(this, idx++);
      };
      Person.prototype.getName = function () {
        return name;
      };
      Person.prototype.setName = function (value) {
        name = value;
      };
      Person.prototype.getId = function () {
        return hash.get(this);
      };
    })();
    
    const person1 = new Person("mangwu");
    console.log(person1.getName()); // mangwu
    person1.setName("mangmang")
    console.log(person1.getName()); // mangmang
    console.log(person1.getId()); // 0
    
    const person2 = new Person("wumang");
    console.log(person2.getId()); // 1
    console.log(person1.getName()); // wumang
    ```
    
    - 注意这个模式定义的构造函数没有使用函数声明，使用的是函数表达式且没有使用关键字声明，因为函数声明会创建内部函数，而不使用关键字声明的函数表达式创建的函数能在外部使用（注意严格模式下这种声明发生会抛出异常，就可以使用ES6的块作用域用`var`关键字声明函数表达式即可）
    - 私有变量`name`和`idx` 以及`hash` 是由实例共享的，它们只被定义一次，是实例共用的静态私有变量，又由于特权方法定义在原型上，特权方法同样是由实例共享的，特权方法作为闭包，始终引用着包含IIEE作用域中的变量
- 像这样创建静态私有变量可以利用原型更好的重用代码，只是每个实例没有了自己的私有变量，最终到底是把私有变量放在实例上还中还是作为静态私有变量，都需要根据自己的需求来确定

<aside>
💡 注意：使用闭包和私有变量会导致作用域链变长，作用域链越长，则查找变量所需的时间也越多

</aside>

# 16.4 模块模式（The Module Pattern）

- 前面的私有变量都是通过闭包，要么引用在构造函数外部不可引用的参数或变量实现私有，要么创建一个块作用域后引用在构造函数的原方法中引用定义在块作用域中的变量实现私有；两种方式都是**自定义类型**并创建私有变量和特权方法
- 而模块模式则是在一个**单例对象**（**singletons**）上实现了相同的隔离和封装
    - 由Douglas Crockford（就是第八章提出原型式继承和寄生式继承的家伙）提出
    - **单例对象**（**singleton**）就是只有一个实例的对象
    - JavaScript通过对象字面量（object literal notation）来创建单例对象
- 模块模式是仍然需要使用闭包和和私有作用域，在单例对象（而不是自定义类型）的基础上加以扩展，让单例对象中的私有变量和私有函数存在于一个私有作用域中，通过作用域链来关联私有变量和特权方法，如下
    
    ```jsx
    let singleton = function () {
      // 私有变量和私有函数
      let privateVariable = 10;
      function privateFunction() {
        return false;
      }
      // 单例对象
      return {
        // 公共方法和属性
        publicProp: true,
        publciMethod() {
          privateVariable++;
          return privateFunction();
        },
      };
    };
    ```
    
    - 模块模式使用IIFE返回一个对象，在这个IIFE中，首先定义私有变量和私有函数
    - 之后创建一个要通过IIFE的对象字面量，这个对象字面量中包含可以公开访问的属性和方法以及可以访问私有变量和函数的特权方法
    - 本质上，对象字面量定义了单例对象的公共接口，如果单例对象需要进行某种初始化且需要访问私有变量时就可以采用这个模式

## 16.4.1 **使用场景**

- 在Web中，经常需要使用单例对象管理**应用程序级的信息**（**application-level information**），例如需要一个单例对象管理所有的**组件**（**components**），但是由于一些原因不能直接访问组件，所以可以定义一个私有组件变量保存所有组件，同时提供公共方法用于注册新组件和获取组件数量信息等
    
    ```jsx
    class BaseComponent {}
    class Component extends BaseComponent {
      constructor(name) {
        super();
        this.name = name;
      }
    }
    
    let application = function () {
      // 私有变量
      let components = new Array();
      // 初始化
      components.push(new BaseComponent());
      // 公共接口
      return {
        getComponetLength() {
          return components.length;
        },
        registerComponent(component) {
          if (component instanceof Component) {
            components.push(component);
            return true;
          }
          return false;
        },
      };
    };
    application.registerComponent(new Component("mangwu"));
    console.log(application);
    // {
      // getComponetLength: [Function: getComponetLength],
      // registerComponent: [Function: registerComponent]
    // }
    console.log(application.getComponetLength());// 2
    ```
    
    - 这里`Component` 组件的实现代码并不重要，关键是`application`单例对象可以访问到IIFE中的私有组件数组变量，并且外部可以通过对象字面量的**公共接口**（**public  interface**）进行组件注册和获取组件数量信息

## 16.4.2 模块增强模式（The Module Augmentation Pattern）

- 模块增强模式与模块模式类似，唯一的区别在于返回的公共接口不再是使用字面量定义的对象，而是需要某个特定类型的实例，（增强体现在）必须给这个实例添加额外的属性和方法，如下
    
    ```jsx
    class CustomType {}
    
    let singleton = (function () {
      // 私有变量和私有函数
      let privateVariable = 10;
      function privateFunction() {
        return false;
      }
      // 创建实例
      let o = new CustomType();
      // 增强对象，添加公共方法和属性
      o.publicProp = true;
      o.publicMethod = function () {
        privateVariable++;
        return privateFunction();
      };
      return o;
    })();
    ```
    
    - 和模块模式类似，只不过不使用字面量而是使用特定类型创建实例然后作为公共接口访问私有变量和私有函数使用
- 同理，上面的`application`对象也可以使用这种方式，只是单例对象不再是对象字面量定义，而是`BaseComponent` 实例
    
    ```jsx
    const application = (function () {
      // 私有变量和私有函数
      let components = new Array();
      // 初始化私有变量
      components.push(new BaseComponent());
    
      // 创建实例
      const o = new BaseComponent();
      // 增强实例,公共接口
      o.getComponentLength = function () {
        return components.length;
      };
      o.registerComponent = function (component) {
        if (component instanceof BaseComponent) {
          components.push(component);
          return true;
        }
        return false;
      };
      return o;
    })();
    
    application.registerComponent(new Component("mangwu"));
    console.log(application.getComponentLength()); // 2
    console.log(application);
    // BaseComponent {
      // getComponentLength: [Function (anonymous)],
      // registerComponent: [Function (anonymous)]
    // }
    ```