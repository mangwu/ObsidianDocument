# 15. 立即调用的函数表达式（Immediately Invoked Function Expressions）

立即调用的函数表达式在[匿名函数表达式可以用作**IIFE**（**Immediately Invoked Function Expression** ，**立即调用函数表达式**），即一经定义就立即运行](11%20%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88Function%20Expressions%EF%BC%89.md) 中简单介绍过使用

# 15.1 立即调用的函数表达式

- 立即调用的匿名函数又被称为**立即调用的函数表达式（IIFE，Immediately Invoked Function Expressions）**
- 它类似于函数声明，但由于被包括在括号中，所以会被解释为函数表达式，紧跟在第一组括号后面的第二组括号会理解调用前面的函数表达式

## 15.1.1 语法

```jsx
(function() {
	// 块级作用域
})()
```

## 15.1.2 使用场景

- 使用IIFE可以**模拟**（**simulate**）**块级作用域**（**block scope**）：在一个函数表达式内部声明变量，然后立即调用这个函数，这样位于函数体作用域的变量行为就像是在块级作用域中一样（**block scope-like**）
- ES5尚未支持块级作用域，使用IIFE模拟块级作用域是相当普遍的
    
    ```jsx
    (function(){
    	for(var i = 0; i < count; i++) {
    		console.log(i);
    	}
    })();
    console.log(i); // 抛出错误
    ```
    
    - `var` 定义的变量是函数作用域的，所以在IIFE外部访问`i` 会抛出异常
- 在ECMAScript5.1及以前（没有`let`和`const`），为了防止**变量外泄**（**variable bleed**），IIFE是一个非常有效的方式；这样也不会导致闭包相关的内存问题，因为不存在对这个匿名函数的引用，因此，只要函数执行完毕，其作用域链就可以被销毁

# 15.2 ES6的块级作用域

- 在ECMAScript6以后，IIFE没有使用的必要了，因为ES6支持`let`和`const` ，在扩块级作用域中的变量无需IIFE就可以实现同样的隔离
- 例如在内嵌的**块级作用域**(**inline block scope**)和循环的块级作用域中
    
    ```jsx
    // 内嵌级块作用域
    {
      let i;
      for (i = 1; i < 10; i++) {
        console.log(i);
      }
    }
    // 循环块作用域
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    ```
    

## 15.2.1 锁定循环的参数值

- 这里的参数值指在一个循环中为方法添加可用的变量值，典型的应用场景就是为顺序元素添加事件处理程序时使用循环的条件变量
    
    ```jsx
    const divs = document.querySelectorAll("div");
    
    for (let i = 0; i < divs.length; i++) {
      divs[i].addEventListener("click", function () {
        **console.log(i);**
      });
    }
    ```
    
    - 每次点击一个`div` 元素都能显示正确的索引
- 循环块作用域可以轻松锁定参数值，因为在ECMAScript6中，如果对for循环使用块级作用域变量关键字，那么循环就会为每次**遍历**（**iteration**）创建**独立的变量**（**separate counter instance**），从而让每个单机处理程序都能引用特定的索引
- 但是注意，如果把声明拿到`for`循环外部，因为这样就相当于引用同一个变量`i` ，它的值最后为固定的`divs` 长度
    
    
    <aside>
    ❌ let j = 0;
    for (j = 0; j < divs.length; j++) {
      divs[i].addEventListener("click", function () {
        console.log(j);
      });
    }
    
    </aside>
    

### 15.2.1.1 在ES5中锁定循环的参数值

- 使用`var` 关键字声明的循环迭代变量`i` 不会被限制在for循环的块级作用域内，因此会出现和上述把`let j = 0` 声明到for循环外部相同的情况，即值每个事件处理程序都引用同一个变量， 打印`i` 循环后的最终结果（`divs` 的长度）
    
    <aside>
    ❌ for (var j = 0; j < divs.length; j++) {
      divs[i].addEventListener("click", function () {
        console.log(j);
      });
    }
    
    </aside>
    
- 以前，为了实现锁定循环的参数值，需要借助**IIFE**和闭包一起实现：一个匿名函数传入每次循序的当前索引，然后返回一个引用了当前索引的事件处理匿名函数，从而锁定循环的参数值
    
    ```jsx
    for (var i = 0; i < divs.length; i++) {
      divs[i].addEventListener(
        "click",
        **(function (frozenCounter) {
          return function () {
            console.log(frozenCounter);
          };
        })(i)**
      );
    }
    ```
    
    - 这种相当于每个闭包函数引用了每个外部立即执行函数的活动对象中的**`frozenCounter`**参数变量，而这个参数变量就是当前循环的索引值`i`