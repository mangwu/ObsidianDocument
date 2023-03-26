# 可重入函数（reentrant function）

关于可重入函数的讨论[what-exactly-is-a-reentrant-function](https://stackoverflow.com/questions/2799023/what-exactly-is-a-reentrant-function) [reentrancy-in-javascript](https://stackoverflow.com/questions/34129978/reentrancy-in-javascript)

# Wikipedia上关于reentrance的介绍

reentrance，重入

> 如果一个计算机**程序或例程**（**program or routine**）在之前的调用执行完全之前，它能被安全地再次调用（**safely called again**）（即可以安全的并发执行），则该程序或例程是**可重入的**（**reentrant**），可重入的计算机程序或例程有以下特性
> 
> 1. 必须不包含静态（static）（或全局 global）**非恒定**（**non-constant**）数据
> 2. 不能将**地址**（**address**）返回到静态（或全局）非常量数据
> 3. 必须只对**调用者**（**caller**）提供给它的数据起作用
> 4. 一定不能依赖对**单例资源**（**singleton resources**）的**锁**（**locks**）
> 5. 不能修改自己的代码【除非在自己唯一的**线程存储**（**thread storage**）中执行】
> 6. 绝对不能调用**不可重入的**（**non-reentrant**）计算机程序或例程

# JavaScript中的可重入函数

- JavaScript中的可重入函数（reentrant function）是一个可以恢复执行（whose execution can be **resumed**）的函数
- 在浏览器和node环境下，所有**多处理**（**multiprocessing**）都是协作（cooperative）的（没有中断或上下文切换）；常规的函数总是在JavaScript中运行到完成
- 下面是一些例子
    
    ```jsx
    function* foo() {
      yield 1;
      yield 2;
    }
    ```
    
    ```jsx
    function foo() {
      return 1;
    }
    ```
    
    ```jsx
    var x = 0;
    function foo() {
      return x++;
    }
    ```
    
    ```jsx
    function foo() {
      setTimeout(foo, 1000);
    }
    ```
    
- 上面四个例子的情况
    - 只有第一个生成器函数是可重入函数，因为它不一次性运行完毕其代码，并且可以安全地在后面的点（point）恢复执行
    - 第二个函数就是一个普通函数，因为它不可被中断，所以它不是可重入函数
    - 第三个函数使用外部作用域，它也不是可重入的函数
    - 第四个函数会立即运行（它会安排对它的另一个调用，也不是可重用函数）
- 关于第二点有争议，可以查看**[Reentrancy in JavaScript](https://stackoverflow.com/questions/34129978/reentrancy-in-javascript)**