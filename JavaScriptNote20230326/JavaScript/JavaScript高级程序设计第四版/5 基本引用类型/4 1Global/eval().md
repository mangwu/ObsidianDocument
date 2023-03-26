# eval()

# 描述

- eval()方法是整个ECMAScript语言中**最强大的**方法
- 这个方法就是一个完整的ECMAScript解释器

## 语法

- 接受一个字符串参数，这个字符串就是要执行的ECMAScript(JavaScript)字符串
- 然后执行传入的字符串中表示的语句
- 如果传入的字符串中有语法错误，则抛出响应的异常给调用者
- 返回最后一个语句执行后的返回值

## 执行原理

- 当解释器发现eval()方法被调用时，会将参数解释为实际的ECMAScript语句，然后将其插入到该位置
- **eval()执行的代码属于该调用所在上下文**，被执行的代码上下文拥有和eval()执行上下文相同的作用域链
- 所以eval()上下文作用域链中的变量对象可以在字符串形式的语句中使用
- 同理，字符串形式语句在不构建新的语句块（不创建新上下文）时，**声明的方法**可以在eval()后文的上下文中使用

# 例子

```jsx
// eval()

let msg = "i will used in eval function";
eval("console.log('eval:'+msg);function sayHi(msg){console.log(msg)}");
sayHi("THIS IS SAYHI, DECLARE IN EVAL FUNCTION");
// 打印结果
eval:i will used in eval function
THIS IS SAYHI, DECLARE IN EVAL FUNCTION
```

- 可以看到，在eval中声明的方法会被替换为真正的函数定义，所以能在下一行代码中调用它

## 注意

- **使用let const声明的方法或变量**无法在eval()执行的上下文使用
    
    ```jsx
    try {
      eval("let evalVar = 'hello';");
      console.log(evalVar);
    } catch (error) {
      console.log("evalVar未定义");
    }
    
    function f(x) {
      eval("var y=x;const y2 = x;const bar = () => {console.log(y2)};bar()");
      console.log("y:", y);
      try {
        bar();
      } catch (error) {
        console.log("bar未定义");
      }
    }
    
    f("hello");
    
    // 打印结果
    evalVar未定义
    hello
    y: hello
    bar未定义
    ```
    
    - 使用function直接声明方法，相当于原始的使用var声明定义的方法
    - 而使用const和let定义的是临时变量，在eval执行后被销毁
- **使用var在eval()中声明定义的任何变量和函数都不会被提升**
    
    ```jsx
    // 在eval中定义的var变量不会被提升
    console.log(k); // 不会报错，打印undefined
    {
      var k = 0;
    }
    console.log(m); // 报错
    eval("var m = 0;");
    ```
    
- 严格模式下，eval()内部创建变量和函数无法被外部访问，且eval本身不能被重新赋值
    
    ```jsx
    "use strict";
    eval = "hi"; // 抛出错误
    ```
    
    - Global中的属性和方法都能被重新赋值，因为本质上它们就是全局作用域变量对象中可使用的初始就有的变量
- 个人理解的eval()
    
    ```jsx
    let m = 1;
    eval("var k = 0;let i = 2;console.log(m)"); // 1
    console.log(k); // 0
    ```
    
    - ~~等价~~类似于
    
    ```jsx
    let m = 1;
    {
    	var k = 0;
    	let i = 2;
    	console.log(m); //1
    }
    console.log(k); // 0
    ```
    
    - 因为var声明的变量是函数作用域，所以k在块外也能使用，而let声明的变量是块作用域，所以i在块外不能使用
    - 但是上面二者不是等价的，因为使用var定义在eval参数中的k不具有提升的特性，而在块作用域声明的k会被提升到外部顶层

# 使用建议

- 永远不要使用eval()方法
- eval()方法的功能过于强大，XSS攻击常利用这个方法攻击网页