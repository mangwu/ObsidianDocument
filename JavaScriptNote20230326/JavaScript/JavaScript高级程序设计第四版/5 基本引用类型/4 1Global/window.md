# window

# 描述

- ECMA-262没有规定直接访问Global对象的方式，但是浏览器将window对象**实现为Global对象的代理**
- 在浏览器环境中声明的全局变量和函数都是window对象的属性
    
    ```jsx
    var color = "red";
    function sayColor() {
      console.log(window.color);
    }
    window.sayColor(); // "red"
    ```
    
- window对象不止实现了ECMAScript规范的Global对象，还实现了具有宿主特性（浏览器）的方法和属性，如window.document等

# 获取Global对象

- 在浏览器环境中，可以通过window访问浏览器实现的Global对象代理
- 还可以通过this关键字获取Global对象（即window对象）
- 在全局作用域中，this指代的就是window
    
    ```jsx
    let global = function(){
    	return this;
    }();
    // global在浏览器环境下就是window
    ```
    
    - 一个立即调用的函数表达式，返回this值
    - 当一个函数没有明确指定this值的情况下(函数没有成为某个对象的方法，或通过call()/apply()指定this)执行时，this值就是Global对象
    - 调用一个**简单返回this的函数是在任何上下文中获取Global对象的通用方式**
- 注意，在node环境中，gobal对象是ECMAScript规范中Global对象实现的代理