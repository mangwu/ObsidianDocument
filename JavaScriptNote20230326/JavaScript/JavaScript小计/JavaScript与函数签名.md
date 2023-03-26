# JavaScript与函数签名

参考[MDN](https://developer.mozilla.org/en-US/docs/Glossary/Signature/Function)

# 函数签名（function signature）

- 一个函数签名，或称类型签名（type signature）、方法签名（method signatrue），定义为函数(function)或方法(method)的输入(input)与输出(output)
- 一个签名应该包括：
    - 参数和它们的类型
    - 返回值和它的类型
    - 可能抛出或**传回**（**pass back**）的**异常**（**exceptions**）
    - 在面向对象程序中，关于方法的**可用性**（**availability**）信息，例如关键字`public`、`static`、`prototype`等

# 深入理解

## JavaScript中的签名

- JavaScript是一门**松散类型**（**loosely typed**）或动态类型（dynamic）的语言。
    - JavaScript不需要提前声明变量的类型
    - 变量类型会在程序执行时**自动确定**（**get determined automatically**）
- 但是JavaScript的签名仍然可以给予方法一些信息：
    
    ```jsx
    MyObject.prototype.myFunction(value);
    ```
    
    - 这个方法被定义(installed)在一个名叫`MyObject` 的对象上
    - 这个方法被定义在`MyObject` 的`prototype` （原型）上，因此它是一个实例方法（instance method）而不是静态方法（static method）
    - 方法名称叫做`myFunction`
    - 这个方法接受一个参数，参数名为`value` 并且没有进一步的定义

## Java中的签名

- 在Java中，签名在**虚拟机代码**（**virtual machine code**）层面 用于标方法和类
    - 为了正常允许Java代码，开发者必须声明变量的类型
    - Java是一门**严格类型**（**strictly typed**）的语言，并且在编译（compilation）时检查每个参数（**parameters**）的类型是否正确
- Java的签名给予了方法确定的参数类型和返回值类型以及**可用性**（**availability**）
    
    ```java
    public static void main(String[] args)
    ```
    
    - `public` 关键字是一个访问修饰符（access modifier），它表示方法可以被任何对象调用
    - `static` 关键字表示方法是一个类方法（class method， 静态方法）而不是一个实例方法（instance method）
    - `void` 关键字表示这个方法没有返回值
    - 方法名称是`main`
    - 方法只接受一个参数`args` ，且`args` 是字符串数组类型

# 为什么称JavaScript没有函数签名

- 在严格类型的语言中，函数的命名参数前必须事先创建函数签名，并且将来的调用必须与该签名保持一致；即
    - 定义了几个参数调用时就要传递几个参数，
    - 定义了每个参数的类型调用就要传递对应类型的参数，
    - 定义了返回值的类型实现就要严格返回对应类型的值，
    - 定义了参数传递的位置调用时就要按照对应位置传递
    - …
- 而JavaScript不用管这些，因为JavaScript参数是由0或者多个值的数组(**arguments**)来表示的，命名参数只是为了提供便利，而不是必须的，例如
    
    ```jsx
    function sayHello() {
    	alert("Hello, " + arguments[0] + ", " + arguments[1])
    }
    sayHello("baby","How are you?"); // Hello, baby, How are you?
    sayHello("baby"); // Hello, baby, undefined
    sayHello(); // Hello, undefined, undefined
    sayHello("baby","How are you?", "girls"); // Hell, baby, How are you?
    ```
    
    - 命名参数为空，照样可以按照任意个参数格式去调用
- 所谓的参数类型，参数个数，参数位置，出入参数，JavaScript都不关心，传递所有的值都被放到`arguments`数组中了。需要返回值就直接`return`， 也不用声明 `void`或返回值类型