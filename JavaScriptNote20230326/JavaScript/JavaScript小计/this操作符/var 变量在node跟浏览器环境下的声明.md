# var 变量在node跟浏览器环境下的声明

# var 关键字变量

- 在浏览器下，会自动挂载到`window`对象上
    
    ![Untitled](var%20%E5%8F%98%E9%87%8F%E5%9C%A8node%E8%B7%9F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%A3%B0%E6%98%8E/Untitled.png)
    
- 在node环境下
    1. 直接在terminal输入（命令行输入node就能进入node的terminal模式）
        
        ![Untitled](var%20%E5%8F%98%E9%87%8F%E5%9C%A8node%E8%B7%9F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%A3%B0%E6%98%8E/Untitled%201.png)
        
        - 这个情况就和浏览器控制台的情况一样
    2. 在文件中通过var声明然后使用node执行
        
        ```jsx
        // 一个文件下的代码
        var k = 22;
        console.log(global.k); // undefined
        ```
        

# 原因

- 在node环境下，terminal输入代码和在文件里写代码后用node执行文件是不同的，在文件里写的代码在执行时按照如下方式在terminal中执行：
    
    ```jsx
    (function(exports, require, module, filename, dirname) {
    	// 执行的代码（在文件中写的代码）
    })(exports,exports,module,__filename, __dirname)
    ```
    
    - `~~require` `module` 都是和`global` 在同一上下文（全局上下文）的对象，`exports` `__filename`  `__dirname` 是node执行文件时传递的~~ 这些对象需要进一步学习node才会知道，`exports`实际上是`module`的一个属性
- 因为写在文件中的代码被函数包裹着，`var` 的作用域是函数作用域，所以不会挂载到`global`对象上
- 这也解释了文件中的代码`this` 和`global` 、`globalThis` 不一样的现象：`this` 是`node`执行文件时包裹代码的函数创建的`this` 它被指定为`module.exports`
    
    ```jsx
    console.log(this === module.exports); // true
    ```
    
- 关于`exports exports module __filename __dirname` ,可以通过闭包进行打印观察
    
    ```jsx
    (function (exports, require, module, __filename, __dirname) {
      //打印一出，所有模块的类型和值一目了然
      console.log("exports：", exports);
      console.log("__dirname：", __dirname);
      console.log("__filename：", __filename);
      console.log("require：", require);
      console.log("module：", module);
    })(exports, require, module, __filename, __dirname);
    ```
    

# 解决方法

- **不用关键字声明变量，**关于这种语法**，**在第三章解释`var` 关键字时[提到过](../../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80.md)
    
    node环境
    
    ```jsx
    age = 3;
    console.log(global.age); // 3
    ```
    
    浏览器环境
    
    ![Untitled](var%20%E5%8F%98%E9%87%8F%E5%9C%A8node%E8%B7%9F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%A3%B0%E6%98%8E/Untitled%202.png)