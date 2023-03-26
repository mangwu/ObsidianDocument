# 3. 异步函数（ASYNC FUNCTIONS）

异步函数，就是普通函数前加上**操作符关键字对**(**operative keyword pair**)”**async/await**”的函数，它是ES6**期约模式**（**Promise paradigm**）在ECMAScript函数中的应用

**async/await** 关键字是ES7新增的，这个新增的关键字从行为和语法上都增强了JavaScript，让以同步方式写的代码能够异步执行

在上一节最简单的例子中，声明一个`Promise` 实例，等待获取它解决的结果需要使用`then()` 方法，通过传入兑现处理程序利用参数获取`Promise` 实例的内部值

这种方式有明显的缺点，就是程序中的其它代码要**这个值可用**时访问它，需要额外写一个解决处理程序获取

这样做并不方便，因为其它代码都必须塞到期约处理程序中，~~这可能导致期约处理程序的冗余或不可维护~~，ES7提供了async/await关键字优雅的解决这个问题

# 3.1 异步函数基础（Async Function Basics）

ES7的async/await旨在直接利用**异步结构**（**asynchronous constructs**）解决**代码组织**（**organizing code**）的问题。为此，ES7通过两个关键词—async和awiait—为JavaScript中的函数进行逻辑上的**异步行为**（**asynchronous behavior**）扩展。

## 3.1.1 async关键字（keyword）

### 3.1.1.1 async声明的函数

- `async` 关键字用于声明异步函数，这个关键字可以用在函数声明、函数表达式、箭头函数和方法上
    
    ```jsx
    async function foo() {}
    let bar = async function () {};
    let baz = async () => {};
    class Qux {
      async que() {}
    }
    console.log(foo); // [AsyncFunction: foo]
    ```
    
    - 可以发现异步函数的直接引用类型是`AsyncFunction` 而不是`Function`
    - 通过浏览器中的打印可以发现异步函数没有`prototype` 属性（所以不能当作构造函数，也是箭头函数可以作为异步函数的原因）
        
        ![异步函数.png](3%20%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88ASYNC%20FUNCTIONS%EF%BC%89/%25E5%25BC%2582%25E6%25AD%25A5%25E5%2587%25BD%25E6%2595%25B0.png)
        
- 使用`async`关键字可以让声明异步函数，那么该函数也会具有相应的**异步特征**（**asynchronous characteristics**），但总体上其代码仍然是**同步**（**synchronously**）求值的
    - 和普通函数相比，异步函数在参数和**闭包**(**closures**)方面仍然具有JavaScript普通函数的正常行为
    - 调用异步函数仍然会在后面的指令前求值
    
    ```jsx
    // 异步函数仍然具有普通函数的正常行为
    async function logOne() {
      console.log(1);
    }
    logOne();
    console.log(2);
    // 打印
    1
    2
    ```
    

### 3.1.1.2 异步函数的返回值

- 使用`async` 声明的异步函数的特性表现在：
    - 如果异步函数使用`return` 关键字返回了值（没有使用`return` 则默认返回`undefined`）,这个值会被`Promise.resolve()` 包装成一个期约对象
    - **异步函数始终返回期约对象**，在函数外部调用这个函数可以得到它返回的期约
    
    ```jsx
    async function getThree() {
      console.log(1);
      return 3;
    }
    let a = getThree(); // 调用获得一个内部值为3，状态为兑现的Promise，同时因执行内部代码还打印了1
    console.log(a); // Promise { <state>: "fulfilled", <value>: 3 }
    a.then((res) => console.log(res)) // 通过then()方法能获取到Promise的内部值 3
    console.log(2); // 2
    // 打印结果
    1
    Promise {<fulfilled>: 3}
    2   // 同步打印
    3   // 异步操作获取内部值，所以在2的后面
    ```
    
    - 在异步函数中直接返回一个期约对象也是可行的
    
    ```jsx
    async function getThree2() {
      console.log(1);
      **return Promise.resolve(3)**
    }
    let b = getThree();
    console.log(b);
    b.then((res) => console.log(res))
    console.log(2);
    // 打印结果和上面一致
    1
    Promise {<fulfilled>: 3}
    2   // 同步打印
    3   // 异步操作获取内部值，所以在2的后面
    ```
    
- 异步函数的返回值**期待**（**anticipates，** 但实际上并不要求）一个实现**thenable**接口的对象，但是**常规值**（**regular values**）也可以
    - 如果返回的是实现thenable接口的对象，则这个对象（的内部值）可以通过提供给`then()` 的处理程序的第一个参数进行“解包（**unwrapped**）”【~~意思就是没必要使用`Promise.resolve()` 进行包装以提供`then()` 及其解决处理程序 进行解包~~】
        - 这里所谓的解包实际上就是把异步函数**获取到的值**认定为 异步函数内返回的 实现thenable接口的对象的 `then()` 方法中的 传递给`then()` 的处理回调函数 进行调用时的 第一个参数值；基本模式如下
            
            ```jsx
            let thenableObj = {
            	then(callback) {
            		callback(res); 
            // 这样在获取到thenableObj 后，调用其then方法，
            // 传递一个函数对象，该函数对象就会被调用，且第一个参数一定是在thenableObj中确定的res
            	}
            }
            ```
            
    - 如果不是，则返回中就被当作已经解决的期约
    
    ```jsx
    // 返回一个原始值
    async function primaryType() {
      return "foo"; // 会被Promise.resolve()进行包装
    }
    let p1 = primaryType();
    console.log(p1);
    p1.then((res) => console.log(res));
    
    // 返回一个没有使用thenable接口的对象
    async function objType() {
      return ["bar"]; // 会被Promise.resolve()进行包装
    }
    let p2 = objType();
    console.log(p2);
    p2.then((res) => console.log(res));
    
    // 返回一个实现了thenable接口的非期约对象
    async function thenableObj() {
      const thenable = {
        then(callback) {
          callback("baz");
        },
      };
      return thenable;
    }
    let the = thenableObj();
    console.log(the);
    the.then((res) => console.log(res));
    
    // 返回一个期约
    async function promise() {
      return Promise.resolve("qux");
    }
    let p3 = promise();
    console.log(p3);
    p3.then((res) => console.log(res));
    // 打印结果
    // Promise {<fulfilled>: 'foo'}
    // Promise {<fulfilled>: Array(1)}
    // Promise {<pending>}
    // Promise {<pending>}
    // foo
    // ['bar']
    // baz
    // qux
    ```
    
    - 从打印结果可以看出，无论返回的是自定义实现的`thenable` 接口的对象还是原始值异或普通对象，得到的具体返回值都是一个`Promise` 实例
    - 对于异步函数内部返回普通对象和原始值而言，外部得到它们的返回值相当于使用`Promise.resolve()` 得到的返回值，所以可以直接同步打印出来它们在对象状态
    - 对于异步函数内部返回`Promise`实例和实现`thenable` 接口的对象而言，外部得到它们的返回值初始状态为Pending，所以同步打印不能打印出它们立即执行的落定状态
    - 对于返回实现`thenable` 接口对象而言，返回的`Promise` 对象的最终内部值不是对象本身，而是[包装在对象`then()` 方法的解决回调函数执行时传递的值](3%20%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88ASYNC%20FUNCTIONS%EF%BC%89.md)
    - 外部promises使用`then()` 获取内部值进行打印是异步操作，所以在所有同步打印后才执行

### 3.1.1.3 在异步函数中抛出错误

- 与在期约的处理程序中一样的行为，在异步函数中抛出错误会返回拒绝的期约；
- 同时这个拒绝的期约的内部值就是抛出的错误；
- 抛出的错误不能通过`try/catch` 语句进行捕获，需要调用返回的拒绝的期约的`then()` 或`catch()` 方法添加一个拒绝处理程序进行捕获
    
    ```jsx
    // 抛出错误
    async function throwError() {
      console.log(1);
      throw 3;
    }
    let t1 = throwError();
    console.log(t1);
    t1.catch(console.log);
    console.log(2);
    // 打印
    1
    Promise {<rejected>: 3}
    2
    3
    ```
    
- 如果在异步函数中返回一个拒绝的期约，其行为和上面的抛出错误的行为**大体**一致（立即打印的结果不一致，抛出错误立即打印会得到一个落定的拒绝状态的promise，而返回一个拒绝promise会得到一个新的初始为pending的promise）
    
    ```jsx
    async function throwError2() {
      console.log(1);
      return Promise.reject(3);
    }
    let t2 = throwError2();
    console.log(t2);
    t2.catch(console.log);
    console.log(2);
    // 打印
    1
    Promise {<pending>}
    2
    3 
    ```
    
- 如果在异步函数中生成一个拒绝的期约但是并不作为返回值返回，那么这个错误就没办法在函数外部进行捕获了，只能在函数内部通过这个局部期约自己的`catch()` 方法进行捕获
    
    ```jsx
    async function throwError3() {
      console.log(1);
      Promise.reject(3);
    }
    let t3 = throwError3();
    console.log(t3);
    t3.catch(console.log);
    console.log(2);
    // 打印
    1
    Promise {<fulfilled>: undefined}
    2
    Uncaught (in promise) 3
    ```
    
    - 这里在`throwError3` 执行的`Promise.reject(3);` 语句生成会抛出一个异步错误，浏览器会报出Uncaught 的错误信息
    - 同时也发现如果不返回任何值也会返回一个`Promise` 实例（实例会异步兑现），只不过这个实例的内部值就是`undefined`

## 3.1.2 await 关键字（keyword）

### 3.1.2.1 在异步函数中使用await

- 异步函数主要针对不会马上完成的任务，所以自然需要一种**暂停和恢复执行的能力（pause and resume execution, ~~*可重入？*~~）**，使用`await` 关键字可以**暂停异步函数代码的执行**(**pause execution of the async function**)，等待期约解决（以下为**个人理解**）
    - 使用`async` 声明的异步函数本身具有普通函数的性质，其中的代码除了返回值，其他的**正常语句（非异步操作）**都是同步执行的
    - 如果要在异步函数中执行异步语句，那么这个异步语句的结果一半是返回值
    - 如果有多个异步语句，这几个异步语句之间相互依赖（只有获取其中一个之后才能获取另一个异步语句的值），或许可以通过期约连锁的方式进行，最后返回最后一个期约即可
    - 虽然期约连锁可以通过类似函数合成的思想实现简洁的串联期约合成，但是在书写逻辑上更期望简单的代码
    - 所以就出现了`await` ，它能让一个语句等待异步任务执行完毕后才执行，就像下面这样
        
        ```jsx
        async function foo() {
          let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
          console.log(**await p**); // 
        	console.loh(1);
        }
        foo(); 
        // 3 (1秒后)
        // 1 (1秒后)
        ```
        
        - 注意这里，`await` 关键字会暂停执行异步函数后面的代码，让出JavaScript**运行时的执行线程**(**runtime’s thread of execution**)
        - 这个行为和生成器中的`yield` 关键字类似，`await` 关键字同样尝试“解包”对象（实现了thenable接口的对象）的值，然后将这个值传给表达式，再**异步**（**asynchronously**）恢复异步函数的执行
    - 如果不使用`await` ，这里获取`p` 的值就需要使用`then()` ，将`console.log` 代码[塞进`then()` 的解决处理程序](3%20%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88ASYNC%20FUNCTIONS%EF%BC%89.md)中了(同时后续的同步代码能正常执行因为`then()`是异步的操作)，如下
        
        ```jsx
        async function foo2() {
          let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
          p.then((res) => console.log(res));
          console.log(1);
        }
        foo2();
        // 1  (立即)
        // 3  (1秒后)
        ```
        
- `await` 关键字的用法和JavaScript的一元操作一样，它可以单独使用，也可以在表达式中使用，如下
    
    ```jsx
    // 单独使用，在表达式中使用都可以
    async function printFoo() {
      console.log(await Promise.resolve("foo"));
    }
    printFoo();
    
    async function returnBar() {
      return await Promise.resolve("bar");
    }
    let a = returnBar();
    console.log(a);
    a.then(console.log);
    
    // 异步打印
    async function printBaz() {
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      console.log("baz");
    }
    printBaz();
    // 打印
    // Promise { <pending> }
    // foo
    // bar
    // baz (1s后)
    ```
    
- `await` 关键字期待（但实际上并不要求）一个实现`thenable` 接口的对象，但是常规的值也可以
    - 如果是实现`thenable` 接口的对象，则这个对象可以由`await` 来解包
    - 如果不是，则这个值就被当作已经解决的期约
    
    ```jsx
    // 等待一个原始值
    async function primaryType() {
      console.log(await "foo");
    }
    primaryType();
    // 等待一个没有实现thenable接口的对象
    async function obj() {
      console.log(await ["bar"]);
    }
    obj();
    // 等待一个实现了thenable接口的非期约对象
    async function thenableObj() {
      console.log(
        await {
          then(callback) {
            callback("baz");
          },
        }
      );
    }
    thenableObj();
    
    // 等待一个期约
    async function promiseType() {
      console.log(await Promise.resolve("qux"));
    }
    promiseType();
    // 打印
    // foo
    // ['bar']
    // qux
    // baz
    ```
    

### 3.1.2.2 await处理抛出异常的语句

- **等待**（**Awaiting**）会抛出错误的**同步**（**synchronous**）操作，会返回拒绝的期约，该期约可以使用`catch()` 对抛出的异步错误进行捕获
    
    ```jsx
    // 抛出错误
    async function throwError() {
      console.log(1);
      await (() => {
        throw 3;
      })();
    }
    
    let t1 = throwError();
    console.log(t1)
    t1.catch(console.log);
    console.log(2);
    // 打印
    // 1
    // Promise {<rejected>: 3}
    // 2
    // 3
    ```
    
    - 注意这里立即打印的`t1` promise是拒绝状态的，这一定是和上述直接在异步函数中抛出错误[一样的行为](3%20%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88ASYNC%20FUNCTIONS%EF%BC%89.md)
- 在异步函数中[获取到了单独拒绝的promise](3%20%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88ASYNC%20FUNCTIONS%EF%BC%89.md) （而隐式抛出的错误）不会在异步函数外部被捕获到，不过，如果对拒绝的期约使用`await` 则会**释放**（**unwrap**）错误值，并将拒绝期约返回
    
    ```jsx
    async function throwError2() {
      console.log(1);
      await Promise.reject(3);
      console.log(4); // 这行代码不会执行
    }
    let t2 = throwError2();
    console.log(t2);
    t2.catch(console.log);
    console.log(2);
    // 打印
    // 1
    // Promise {<pending>}
    // 2
    // 3
    ```
    
    - 注意打印4的代码不会执行，因为上一个代码因为promise拒绝而直接返回了拒绝的promise
    - 立即打印`t2` 状态为pending，这与直接抛出错误立即打印的状态为rejected不同

### 3.1.2.3 await的限制（Restrictions on await）

1. `**await` 关键字必须在异步函数中使用**，不能在顶级上下文如<script>标签或模块中使用
    
    但是定义并立即调用异步函数是没问题的，如下
    
    ```jsx
    async function normalAFunc() {
      console.log(await Promise.resolve(3));
    }
    normalAFunc(); // 3
    (async function () {
      console.log(await Promise.resolve(3));
    })(); // 3
    ```
    
2. 异步函数的特质不会扩散到嵌套函数中，因此`await` 关键字也只能**直接**出现在异步函数的定义中，在同步函数内部使用`await` 会抛出`SyntaxError`
    
    ```jsx
    (async function () {
      for (let i = 0; i < 3; i++) {
        console.log(await Promise.resolve(3)); // 可行
      }
      ~~function syncFn() {
        return await Promise.resolve("bar");~~ // 不可行
      ~~}~~
    })();
    ```
    

# 3.2 停止和恢复执行（Halting and Resuming Execution）

- 使用`await` 关键字的**本质**(**nature**)比上述的使用要**细致入微的**（**nuanced**）多；对不同的语句使用`await` 它们之间的执行顺序略有差异
    
    ```jsx
    async function foo() {
      console.log(await Promise.resolve("foo"));
    }
    
    async function bar() {
      console.log(await "bar");
    }
    
    async function baz() {
      console.log("baz");
    }
    foo();
    bar();
    baz();
    // 打印
    // baz
    // foo
    // bar
    ```
    
    注意在《JavaScript高级程序设计（第4版）》中，这里的示例打印顺序是相反的，但是实际上，`foo()` 和`bar()` 二者打印的顺序和调用顺序一样，不存在因为await后面不是一个`thenable`的对象而有所区别，但是同步操作的`baz()` 即使在最后调用，因为同步操作的关系仍然首先打印
    
- async/await关键字中**真正起作用**的是await；
    - async只是一个标识符，它表明函数是异步函数（允许使用await）
    - 异步函数如果不包含await关键字，其执行**基本上**和普通函数没有什么区别（唯一区别在于返回值）
    
    ```jsx
    // 异步函数在不关心返回值时，起关键作用的其实是await关键字
    async function printOne() {
      console.log(2);
    }
    console.log(1);
    printOne();
    console.log(2);
    // 打印
    1
    2
    3
    ```
    

## 3.2.1 理解await

- await关键字并非只是等待一个值可用那么简单，在异步函数中使用await，然后调用异步函数，会有如下过程
    - JavaScript**运行时**(**runtime**)在碰到await关键字时，会**记录(track)**在哪里暂停执行
    - 暂停执行期间，异步函数await后的语句不会执行，而异步函数外的同步语句会执行
    - 等到await右边的值可用了，JavaScript运行时会向消息队列中推送一个任务，这个任务会**恢复**(**resume**)异步函数的执行
    
    ```jsx
    // await会暂停异步函数的执行，记录位置
    async function test() {
      console.log(2);
      await null;
      console.log(4);
    }
    console.log(1);
    test();
    console.log(3);
    // 打印
    1
    2
    3
    4
    ```
    
    - 即使`await`后面跟着一个立即可用的值，函数的其余部分也会被**异步（asynchronously）**求值
    - 上面例子的输出的结果很好的解释了运行时的工作原理
        1. **打印（Print）**1
        2. 调用异步函数`test()`
        3. （在`test()`中）**打印（Print）**2
        4. （在`test()` 中）await关键字暂停执行，为立即可用的值null向消息队列中添加一个任务
        5. `foo()` 退出
        6. **打印（Print）**3
        7. 同步线程的代码执行完毕
        8. JavaScript运行时从消息队列中**取出**（**dequeues**）任务，恢复异步函数执行
        9. （在`test()` 中）恢复执行，`await` 取得null值（这里没有使用）
        10. （在`test()`中）**打印（Print）**4
        11. `test()` 返回（一个期约）
- 如果`await`后面不是立即可用的值而是一个期约，则问题会稍微复杂一点，此时会有*两个任务(?**实际上仍然是一个**)*被添加到消息队列并被异步求值
    
    ```jsx
    // 异步函数，await后面是期约的情况
    async function test2() {
      console.log(2);
      console.log(await Promise.resolve(8));
      console.log(9);
    }
    
    async function test3() {
      console.log(4);
      console.log(await 6);
      console.log(7);
    }
    console.log(1);
    test2();
    console.log(3);
    test3();
    console.log(5);
    // 打印
    1
    2
    3
    4
    5
    8
    9
    6
    7
    ```
    
    注意在《JavaScript高级程序设计（第4版）》中，示例的打印是顺序的1-9，但是实际情况并非如此，这是因为TC39对await后面是期约的情况如何处理做了一次修改，修改后，本例中的`Promise.resolve(8)` 只会生成一个异步任务（和上面的立即可用值一样），在新版浏览器（包括node环境）中输出结果为123458967
    
    - 运行时会这样执行（修改了原书错误的地方）
        1. 打印1
        2. 调用异步函数`test2()`
        3. （在`test2()` 中）打印2
        4. （在`test2()` 中）await关键字暂停执行，向消息队列中添加一个期约执行任务
        5. `test2()` 退出
        6. 打印3
        7. 调用异步函数`test3()` 
        8. （在`test3()` 中）打印4
        9. （在`test3()` 中）await关键字暂停执行，为立即可用的值6向消息队列中添加一个任务
        10. `test3()` 退出
        11. 打印5
        12. **顶级线程执行**（**Top-level thread of execution**）完毕
        13. JavaScript运行时从消息队列中取出恢复执行`test2()` 的任务和期约的解决值8
        14. （在`test2()`中）恢复执行，await取得8
        15. （在`test2()` 中）打印8
        16. （在`test2()` 中）打印9
        17. `test2()` 返回
        18. JavaScript运行时从消息队列中取出恢复执行`test3()` 的任务和立即可用值6
        19. 在`test3()`中）恢复执行，await取得6
        20. （在`test3()` 中）打印6
        21. （在`test3()` 中）打印7
        22. `test3()` 返回

# 3.3 异步函数策略（Strategies for Async Functions）

异步函数简单实用，所以很快成为JavaScript项目中使用最广泛的特性之一，不过使用异步函数仍然有一些需要注意的问题和扩展

## 3.3.1 实现sleep()（Implementing Sleep()）

- 在支持多线程（JavaScript是单线程）的语言（如Java）中，可以使用`Thread.sleep()` 之类的函数，以便在程序中加入**非阻塞的暂停**（**non-blocking delay**）
- 在以前的JavaScript中，这个需求通过`setTimeout()` 利用JavaScript**运行时（runtime）**的行为来实现，有了异步函数后，一个简单的箭头函数就可以实现了
    
    ```jsx
    // 非阻塞暂停 线程
    async function sleep(delay) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
    
    async function foo() {
      const t0 = Date.now();
      await sleep(1500); // 暂停约1500毫秒
      console.log(Date.now() - t0);
    }
    foo(); // 1509 (大概数字，因为引擎和设备会有差异)
    ```
    
    - 在这里`sleep()` 就相当于非阻塞的暂停了1.5s的时间，等待完这个时间后异步函数才开始继续执行
    - 以线程的角度看，`foo()` 相当于一个线程，在遇到`await sleep(1500)` 的时候暂停了1.5s，然后继续执行

## 3.3.2 利用平行执行（Maximizing Parallelization）

Maximizing 是最大化之意，Parallelization是并行化之意，这一小节讲述了一种利用**期约并行执行的方式**将异步函数的**执行时间缩小**的模式，所谓的最大化并行之意就是尽可能在异步函数中并行所有异步操作

---

- 在使用await的时候，需要等待后面的语句执行完毕再接着执行之后的语句（即[停止和恢复执行](3%20%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88ASYNC%20FUNCTIONS%EF%BC%89.md)）
- 如果每次执行的异步操作都直接放在await后，则这些异步操作都是串行的，一个执行完毕后才开始执行另外一个，很可能错过**平行加速**（**parallelization speedups**）的机会
    
    ```jsx
    async function randomDelay(id) {
      const delay = Math.random() * 1000;
      return new Promise((resolve) =>
        setTimeout(() => {
          console.log(`${id} finished: ${delay}ms`);
          resolve();
        }, delay)
      );
    }
    
    async function foo1() {
      const t0 = Date.now();
      await randomDelay(0);
      await randomDelay(1);
      await randomDelay(2);
      await randomDelay(3);
      await randomDelay(4);
      console.log(`${Date.now() - t0}ms elapsed`);
    }
    
    foo1();
    // 打印
    0 finished: 214.19967228425307ms
    1 finished: 119.86127024318205ms
    2 finished: 993.3495744350952ms
    3 finished: 94.76989928516267ms
    4 finished: 35.69635694252315ms
    1498ms elapsed
    
    ```
    
    - 定义了一个`randomDelay()` 函数用于生成异步的`Promise` 示例，然后使用`await` 等待这些期约解决，最后打印执行时间
    - 打印的结果是变化（生成的期约执行时间随机）的，但是有两点始终不变
        - 期约打印的顺序始终是从0-5的（因为等待第一个期约解决后才创建等待另一个期约执行完毕）
        - 最终消耗时间大体上等于每个期约的解决的时间之和（略大，因为算上了语句执行时间）
    - 如果期约过多，可以使用for循环，如下
    
    ```jsx
    async function foo2() {
      const t0 = Date.now();
      for (let i = 0; i < 5; i++) {
        await randomDelay(i);
      }
      console.log(`${Date.now() - t0}ms elapsed`);
    }
    foo2();
    // 打印结果（可能）
    0 finished: 546.2711688323944ms
    1 finished: 762.0109712491126ms
    2 finished: 9.054193227309714ms
    3 finished: 930.0128971909828ms
    4 finished: 1.1669204783719689ms
    2292ms elapsed
    ```
    
- 上述的这种方式并没有利用期约的并行执行方式，即使这些期约之间没有依赖，异步函数也会依次暂停，等待每个期约执行完毕，然后再创建执行下一个期约，这样可以**保证执行顺序和获取结果的顺序**
- 如果执行顺序**不是**必须保证的（await获取结果的顺序还是要保证），那么可以一次性初始化所有的期约，然和分别等待它们的结果，这样就能让所有期约并行执行，优化异步函数的执行时间
    
    ```jsx
    async function foo3() {
      const t0 = Date.now();
      const p0 = randomDelay(0);
      const p1 = randomDelay(1);
      const p2 = randomDelay(2);
      const p3 = randomDelay(3);
      const p4 = randomDelay(4);
    
      await p0;
      await p1;
      await p2;
      await p3;
      await p4;
    
      console.log(`${Date.now() - t0}ms elapsed`);
    }
    foo3();
    // 可能的打印
    0 finished: 439.2154559340167ms
    4 finished: 484.21195483601355ms
    2 finished: 555.1757965519266ms
    1 finished: 718.3955819162295ms
    3 finished: 926.4098582123498ms
    939ms elapsed
    ```
    
    - 期约没有按照顺序打印，而是按照完成的时间进行打印，但是await**按顺序**收到了每个期约解决的值
    - 打印的结果是变化的，但是这种串行打印有两点是不变的
        - 打印顺序按照随机得到的`delay` 的大小按从小到大进行打印
        - 最终消耗的时间大体等于最后解决的期约花费的时间（并行优化的结果会使得异步函数执行时间比上述的要短）
    - 如果异步执行的操作过多，可以使用for循环和数组解决
    
    ```jsx
    async function foo4() {
      const t0 = Date.now();
      const promises = new Array(5).fill(0).map((v, i) => randomDelay(i));
      for (const promise of promises) {
        await promise;
      }
      console.log(`${Date.now() - t0}ms elapsed`);
    }
    
    foo4();
    // 可能的打印
    0 finished: 385.3511002437029ms
    2 finished: 469.86862617835203ms
    3 finished: 661.1382122053251ms
    1 finished: 807.2015049467173ms
    4 finished: 909.7679726941122ms
    917ms elapsed
    ```
    
    - 注意这里的`promises` 数组不能使用`forEach` 方法遍历，因为异步函数的异步性不扩展到内部的函数作用域（使用`forEach` 内部无法使用`await`）

## 3.3.3 串行执行期约（Serial Promise Execution）

- 在[2.4.3 串行期约合成（Serial Promise Composition）](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89.md) 的串行期约合成中，讨论过如何把相互依赖的期约通过函数合成进行代码优化编写，有了async/await关键字后，期约连锁会变得更简单，不再需要通过显式的书写`Promise` 一个个进行传递
    
    ```jsx
    function addTwo(x) {
      return x + 2;
    }
    
    function addThree(x) {
      return x + 3;
    }
    
    function addFive(x) {
      return x + 5;
    }
    
    async function addTen(x) {
      for (const fn of [addTwo, addThree, addFive]) {
        x = await fn(x);
      }
      return x;
    }
    addTen(36).then(console.log); // 46
    ```
    
- 如果使用[函数合成](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89.md)的方法，如下
    
    ```jsx
    function compose(...fns) {
      return (x) =>
        fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x));
    }
    
    let addFifteen = compose(addFive, addTwo, addThree, addFive);
    addFifteen(22).then(console.log);
    ```
    

## 3.3.4 栈追踪与内存管理（Stack Traces and Memory Management）

在JavaScript运行代码时，如果遇到错误，抛出错误信息，而错误信息具体发生的位置会给出具体的栈追踪信息，这些栈追踪信息应该直接表示函数之间的套用关系，如下

```jsx
function getError() {
  if (arguments[0] === undefined) {
    throw new Error("need first argument");
  }
  return 2;
}

function foo() {
  let k = getError();
  return k + 1;
}

foo();
// 打印
**Uncaught Error: need first argument
    at getError (<anonymous>:3:11)
    at foo (<anonymous>:9:11)
    at <anonymous>:13:1**
```

- 这里的错误信息是**`need first argument`** ，而下面的三条就是具体抛出错误的位置给出的栈追踪信息
    - 它指出出现错误的位置在`getError()` 函数中
    - 而`getError()` 函数在`foo()` 函数中被调用
    - 而出错的`foo()` 函数在全局的第13:1位置被调用

对于异步函数和期约而言，**二者的栈追踪信息可能有所区别**，这会导致内部管理的差异

---

- 期约与异步函数的功能有相当程度的重叠（如上述的串行执行期约），但是它们在内存中的表示则差别很大,下面是使用期约的栈追踪信息例子
    
    ```jsx
    // 期约
    function barPromiseExecutor(resolve, reject) {
      setTimeout(reject, 1000, "bar");
    }
    function bar() {
      new Promise(barPromiseExecutor);
    }
    bar();
    // 报错打印
    // Uncaught (in promise) bar
    // setTimeout (async)		
    // **barPromiseExecutor**
    // **bar**
    // (anonymous)
    ```
    
    - 栈追踪信息应该直接表现JavaScript引擎**当前**栈内存中函数调用之间的嵌套关系
    - 可以看到报错信息包括嵌套函数的标识符，那是被调用以创建最初期约的执行函数（`barPromiseExecutor` 和`bar`），但是在执行`bar()` ，这些函数**已经返回（already return）**了，因此栈追踪中应该看不到它们
    - 但是JavaScript引擎会**在创建期约时**尽可能保留**完整的调用栈**，在抛出错误时，**调用栈**（**call stack**）可以由运行时的错误处理逻辑**回收**（**retrievable**），所以这些栈追踪信息就会出现在报错的信息中，这也意味着栈追踪信息会**占用内存，从而带来**
- 但是使用`await/async` 关键字使得bar变为异步函数，等待创建的期约落地状态，这个时候栈追踪信息就能准确地反映当前的调用栈
    
    ```jsx
    async function bar2() {
      await new Promise(barPromiseExecutor);
    }
    bar2();
    // Uncaught (in promise) bar
    // bar2	
    // await in bar2 (async)		
    // (anonymous)
    ```
    
    - `barPromiseExecutor` 执行后已经返回，所以它不在错误信息中，但是`bar2` 因为`await` 的缘故被挂起，并没有退出，所以错误信息中有`bar2`
    - 是`bar2` 中的`await` 关键字所在语句抛出的异步错误，所以栈信息包含`await in bar2 (async)`
    - ~~最后的匿名函数实际上是`reject`~~
    - JavaScript运行时可以简单地在嵌套函数中存储指向**包含函数**（**container function**）的指针，就跟对待同步函数调用栈一样，这个指针实际上存储在内存中，可用于在出错时生成栈追踪信息，这样就不会像之前（只使用期约）的例子带来额外的消耗，因此在重视性能的应用中可以优先考虑