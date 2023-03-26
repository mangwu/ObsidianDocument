# 2. 期约（Promise）

> A “promise” is a surrogate entity that acts as a stand-in for a result that does not yet exist. —《JavaScript高级程序设计（第4版）》
> 

**一个“promise”就是一个尚不存在的结果的一个代理实体**（替身）。

“promise“这个名字最早由Daniel Friedman和David Wise在他们于1976年发表的论文”The Impact of Applicative Programming on Multiprocessing”“中提出来的，直到十几年后，Barbara Liskov和Liuba Shrira在1988年发表论文“Promises: Linguistic Support for Efficient Asynchronous Procedure Calls in Distributed Systems”,这个概念才真正确立下来

同一时期的计算机科学家还使用了“eventual”，“future”，“delay”，“deferred”等术语指代同样的概念，所有**这些概念描述的都是一种异步程序执行的机制**

# 2.1 Promises/A+规范（The Promises/A+ Specification）

- 早期的promises机制在jQuery和Dojo中以Deferred API的形式出现，到了2010年，CommonJS项目实现的Promises/A规范日益流行起来
- Q和Bluebird等第三方JavaScript promises库也越来越得到社区认可，虽然这些库的实现多少都有些不同
- 为弥合现有实现之间的差异，2012年Promises/A+组织**分叉了**（**forked**）CommonJS的Promises/A**建议**（**proposal**），并以相同的名字指定了Promises/A+规范，这个规范最终成为了ECMAScript6规范实现的范本

---

- ECMAScript 6 增加了对Promises/A+规范的完善支持，就即`Promise`类型。一经推出，`Promise` 就大受欢迎，成为了**主导性的异步编程机制**
- 所有现代浏览器都支持ES6 Promises/A+规范，很多其他浏览器API（如fetch()和Battery Status API）也以`Promise`为基础

# 2.2 Promise基础（Basics）

- ECMAScript 6 新增的引用类型`Promise` ，可以通过`new` 操作符来实例化。
- 创建新`Promise`对象时需要传入**执行器**（**executor**）函数作为参数，一个简单的例子使用空函数对象当作执行器应付解释器
    
    ```jsx
    let promise = new Promise(() => {});
    setTimeout(console.log, 0, promise); // Promise { <pending> }
    ```
    
    - 应付解释器的意思就是在创建`Promise` 对象时必须提供执行器函数，否则会抛出语法错误
    - 这里`setTimeout` 模拟异步操作，对新创建的`Promise`对象进行了打印

## 2.2.1 期约状态机（The Promise State Machine）

- 在把一个`Promise`实例传递给`console.log()` 时，控制台输出（可能因浏览器不同而有所差异）表明该实例处于**待定**（**pending**）状态，也就是说，`Promise` 实例是一个有状态的对象，它可能处于如下3种状态之一：
    - [ ]  ***Pending** （待定）*
    - [ ]  ***Fulfilled** (兑现，有时候也称为**resolved<解决>**)*
    - [ ]  ***Rejected** （拒绝）*

**Pending Fulfilled Rejected**

- **Pending<待定>**状态是`Promise` 实例**最初始**（**initial**）的状态
    - 在**pending<待定>**状态下，`Promise`实例可以**落定**（**settled**）**转化为**（**transitioning to**）代表成功的**fulfilled<兑现>**状态
    - 也可以落定为代表失败的**rejected<拒绝>状态**
- 无论落定成哪种状态都是不可逆的，只要从**pending<待定>**转换为**fulfilled<兑现>**或**rejected**<**拒绝**>，`Promise` 实例的状态就不会再改变
- 并且，不能保证`Promise` 实例会脱离**pending**<**待定**>状态（即一个期约对象可能一直处于待定状态）
- 所以，无论`Promise` 对象是成功解决（**resolve，** 指进入兑现状态），还是拒绝（**reject**，指进入拒绝状态），异或是永远处于**Pending**<**待定**>状态,都应该组织合理的代码结构，避免状态转换混乱

**State features**

- `Promise`对象的状态是**私有（Private）**的，不能直接通过JavaScript检测到
    - 主要是**避免**根据读取到的`Promise` 实例状态以同步方式处理（synchronous programmatic handling）Promise实例
- `Promise` 对象的状态不能被外部JavaScript代码修改
    - 与不能读取该状态的原因一致：Promise故意将异步行为**封装**（**encapsulates**）起来，从而隔离外部的同步代码

## 2.2.2 解决值、拒绝理由及期约用例（Resovled Values, Rejection Reasons and Utility of Promises）

- Promise结构有两大用途
    - 首先是**抽象地**（**abstractly**）表示一个**异步执行**（**asynchronous execution**）
        - 一个promise的状态能表示它是否完成执行
        - ***Pending***<**待定**>状态表示执行还未开始或正在执行中
        - ***Fulfilled***<**兑现**>状态表示执行已经成功完成
        - ***Rejected***<**拒绝**>状态表示执行**没有**成功完成
        
        ---
        
        - 某些情况下，内部状态机就是promise能提供的最有用的信息：仅仅知道一段异步代码已经完成 对 **通知程序流**（**informing program flow**）就足够了
        - 例如，假设promise要向服务器发送一个HTTP请求，请求返回200~299范围内的**状态码**（**status code**）就足以让promise的状态变为***Fulfilled***<**兑现**>；如果请求返回的状态码不在200~299这个范围内，那么就会把promise状态切换为***Rejected***<**拒绝**>
    - 另一个用途是，Promise封装的**异步执行**（**asynchronous execution**）会实际生成某个值，而程序期待promise状态改变时可以访问这个值
        - 如果promise被拒绝，程序流就会期待promise状态改变时可以拿到**拒绝的理由**（**reason for rejection**）
        - 如果promise成功解决（**resolve**），程序流就会期待promise状态改变时可以拿到**解决的结果**（**result for resolution**）
        
        ---
        
        - 以同样的例子举例，假设promise向服务器发送一个HTTP请求并预定会返回一个JSON数据，如果请求返回范围为200~299的状态码，则足以让promise的状态变为***Fulfilled***<**兑现**>，此时**promise内部就会收到一个JSON字符串（**解决的结果**）；**如果请求返回范围不再200~299这个范围内，那么就会把promise的状态变为***Rejected***<**拒绝**>，此时**拒绝的理由**
- 为了支持这两种用例，每个`Promise` 实例只要状态切换为***Fulfilled***<**兑现**>就会有一个**私有的内部值**（**private internal value**）；每个`Promise` 实例只要状态切换为***Rejected***<**拒绝**>，就会有一个**私有的内部理由**（**private internal reason**）
    - 无论是值还是理由，都是包含原始值或对象的**不可修改引用**（**immutable reference**）
    - 并且二种都是可选的，默认值都是`undefined`
    - 在promise到达某个**落地状态**（**settled state**）后，执行的异步代码始终会收到这个值或理由

## 2.2.3 通过执行函数控制期约状态（Controlling Promise State with the Executor）

- 因为Promise的状态是私有的，所以只能在内部进行**操作**（**manipulate**），内部操作在Promise的**执行器函数**（**executor function**）中执行
- 执行器主要有两项主要职责：
    - 初始化Promise的**异步行为**（**asynchronous behavior**）
    - 控制状态的最终转换（any eventual state transition）
- 其中第二项控制Promise状态的转换是通过调用控制器函数的两个函数**参数**（**parameters**）实现的
    - `resolve()` ：调用`resolve()` 会把状态切换为***Fulfilled***<**兑现**>
    - `reject()` :调用`reject()` 会把状态切换为***Rejected***<**拒绝**>，通常调用`reject()` 也会抛出错误
    
    ```jsx
    let p1 = new Promise((resolve, reject) => resolve());
    setTimeout(console.log, 0, p1); // Promise {<fulfilled>: undefined}
    let p2 = new Promise((resolve, reject) => reject());
    setTimeout(console.log, 0, p2); // Promise {<rejected>: undefined}
    // Uncaught (in promise) undefined
    ```
    
    - 注意上述打印都是在谷歌浏览器的控制台下的打印
    - 在node环境下，`p2` 的`Promise` 构造函数构造就会抛出错误`UnhandledPromiseRejection` ，即没有使用`catch` 捕获拒绝之后抛出的错误
- 上面这个例子没有异步操作，因为在初始化构造`Promsie` 实例时，执行器函数就已经改变了每个`Promise` 实例的状态
    - 关键在于：执行器函数是**同步（synchronously）**执行的，因为执行器函数是Promise的**初始化程序**（**initializer**）
    
    ```jsx
    // 观察顺序
    let p3 = new Promise(() => setTimeout(console.log, 0, "executor")); 
    console.log(p3);
    setTimeout(console.log, 0, 'promise initialized');
    // 打印结果
    Promise { <pending> }
    executor
    promise initialized
    ```
    
    - 上面的打印可以得出，执行顺序是同步操作优先，`Promise` 构造函数中的执行器随后执行，最后是外部的`setTimeout()`
    - 在执行器函数中添加 `setTimeout()` 可以推迟切换形态，如下
    
    ```jsx
    let p4 = new Promise((resolve, reject) => setTimeout(resolve, 1000));
    
    setTimeout(console.log, 0, p4);
    setTimeout(console.log, 1000, p4);
    // 打印结果
    Promise {<pending>}
    Promise {<fulfilled>: undefined}
    ```
    
    - 第一个`setTimeout` 在打印`p4` 时，还没有执行超时调用（即没有执行`resolve()`）
    - 第二个`setTimeout` 在打印`p4` 时，执行器中的异步操作已执行完毕（执行了`resolve()`）所以打印出的`p4` 状态为***Fulfilled***<**兑现**>
- 无论`resolve()` 还是`reject()` 中的哪个被调用，状态转换的不可**撤销（undone）**了，于是继续修改状态会**静默失败**(**silently be ignored**)，如下
    
    ```jsx
    // 不可撤销的状态转换
    let p5 = new Promise((resolve, reject) => {
      resolve();
      reject(); // 默认被忽略
      console.log("----"); // ----
    });
    console.log(p5); // Promise {<fulfilled>: undefined}
    ```
    
- 为了避免Promise卡在***Pending***<**待定**>状态，可以添加一个定时退出功能，比如，通过一个`setTimeout` 设置一个10秒钟后无论如何都会拒绝Promise的回调
    
    ```jsx
    // 避免期约一直在等待状态
    let p6 = new Promise((resolve, reject) => {
      setTimeout(reject, 10000); // 10秒后调用reject拒绝函数
      // 进行请求
      /** 请求的异步代码有10秒的请求时间，请求成功就执行resolve */
    });
    setTimeout(console.log, 0, p6); // Promise {<pending>}
    setTimeout(console.log, 11000, p6); // （11 秒后的打印）Promise {<rejected>: undefined}
    // 报错打印
    Uncaught (in promise) undefined （10秒后的打印）
    
    ```
    
    - 因为Promise的状态只能改变一次，所以这里的超时拒绝逻辑中可以放心地设置让Promise处于待定状态的最长时间
    - 如果执行器中的代码之前已经解决或拒绝，那么超时回调中再尝试拒绝也会**静默失败**(**silently be ignored**)

## 2.2.4 Promise.resolve() （Promise Casting with Promise.resolve()）

- Promise并不是一定要一开始就是***Pending***<**待定**>状态，它可以利用执行器函数一开始就达到另两个**落定状态**（**settled state**）
- 通过调用`Promise.resolve()` 静态方法可以直接实例化一个在***Fulfilled***<**兑现**>状态的的`Promise` 实例；下面两个`Promise` 对象的**实例化**（**instantiations**）后实际上是一样的（状态一致）
    
    ```jsx
    let p1 = new Promise((resolve, reject) => resolve());
    
    let p2 = Promise.resolve();
    
    console.log(p1); // Promise {<fulfilled>: undefined}
    console.log(p2); // Promise {<fulfilled>: undefined}
    ```
    
    - 可以看到两个声明了两个状态都是***Fulfilled***<**兑现**>的`Promise`对象，但是两个`Promise`对象的**内部值**（**internal value**）都是`undefined`
- 解决的Promise值（**the value of resolved promise**）对应着传给`Promise.resolve()` 的第一个参数，使用这个静态方法实际上可以把如何值都转化为一个Promise实例
    
    ```jsx
    setTimeout(console.log, 0, Promise.resolve()); // Promise {<fulfilled>: undefined}
    setTimeout(console.log, 0, Promise.resolve(3)); // Promise {<fulfilled>: 3}
    // 多余的参数会被忽略
    setTimeout(console.log, 0, Promise.resolve(3, 4, 5)); // Promise {<fulfilled>: 3}
    ```
    
    - 这个静态方法相当于将参数**包装（wrap）**成了一个状态为***Fulfilled***<**兑现**>`Promise` 的对象
- 如果传入`Promise.resolve()` 的参数本身就是一个`Promise` 对象，那么它的行为类似于一个**空包装**（**passthrough** 英文版使用透传这个词语解释）；因此`Promise.resolve()` 可以说是一个**幂等方法（idempotent method）**
    
    [关于幂等（about idempotent）](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89/%E5%85%B3%E4%BA%8E%E5%B9%82%E7%AD%89%EF%BC%88about%20idempotent%EF%BC%89.md)
    
    ```jsx
    let p3 = new Promise(() => {});
    console.log(p3 === Promise.resolve(p3)); // true
    console.log(p3 === Promise.resolve(Promise.resolve(p3))); // true
    console.log(p3); // Promise {<pending>}
    ```
    
    - 这个幂等性体现在对传入的`Promise` 对象进行原封不动的进行返回，并且会保留`Promise` 对象在传入的状态
- 需要注意的是这个静态方法能**包装**任何非Promise值（对Promise对象是透传的），包括错误对象，并将器转换为**解决**（**resolved**）的`Promise`对象，因此可能导致不符合预期的行为
    
    ```jsx
    let p4 = Promise.resolve(new Error("foo"));
    console.log(p4);
    // 打印
    // 谷歌
    Promise {<fulfilled>: Error: foo
        at <anonymous>:1:26}
    // 火狐
    Promise { <state>: "fulfilled", <value>: Error }
    ```
    
    - 上面是谷歌和火狐浏览器的打印，而node环境下会直接打印出错误的完整位置（但仍然正常执行）
        
        ![Untitled](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89/Untitled.png)
        

## 2.2.5 Promise.reject()（Promise Rejection with Promise.reject()）

- 与`Promise.resolve()` 类似的静态方法，`Promise.reject()` 会实例化一个处于***Rejected <*拒绝***>*状态的`Promise` 对象，**并抛出一个异步错误(asynchronous error，**这个异步错误不能通过`try/catch` 语句捕获，而只能通过拒绝处理程序捕获**，**下面两个`Promise` 对象的**实例化**（**instantiations**）后实际上是一样的（状态一致）
    
    ```jsx
    let p1 = Promise.reject();
    let p2 = new Promise((resolve, reject) => reject());
    console.log(p1); // Promise {<rejected>: undefined}
    console.log(p2); // Promise {<rejected>: undefined}
    // 错误信息
    Uncaught (in promise) undefined
    ```
    
    - node环境下直接[抛出错误](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89.md)（不会执行打印语句）；上述打印是谷歌浏览器下的打印
- `Promise.reject()` 的第一个参数就是拒绝的Promise的理由（‘reason’ filed），这个参数也会传递给后续的**拒绝处理程序**（**reject handler**）
    
    ```jsx
    // 第一个参数接受拒绝的期约的理由
    let p = Promise.reject("reason");
    console.log(p); // Promise {<rejected>: 'reason'
    p.then(null, (e) => {
      console.log(e); // reason
    }) // then方法本身会返回一个**新期约** Promise {<fulfilled>: undefined}
    ```
    
    - 这里`then`方法会在后续介绍，它能接受Promise状态转换后的内部值，并且让拒绝的Promise能正常执行（不会抛出报错红字）
- `Promise.reject()` 的区别除了生成的`Promise` 对象状态不一样外，`Promise.reject()` 没有照搬`Promise.resolve()` 的幂等逻辑，如果给它传递一个`Promise` 对象，那么这个对象会成功它返回的**拒绝期约**（**rejected promise**）的“理由（reason）”
    
    ```jsx
    console.log(Promise.reject(Promise.resolve(5))); // Promise {<rejected>: Promise}
    // 报错信息
    Uncaught (in promise) Promise {<fulfilled>: 5}
    ```
    
    - 在谷歌浏览器中，它的结构如下
        
        ![1.png](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89/1.png)
        

## 2.2.5 同步/异步执行的二元性（Synchronous/Asynchronous Execution Duality）

- Promise的设计很大程度上会导致一种完全不同于JavaScript的**计算模式**（**computation mode**），下面的例子完美地展示了这一点，它指出了两种模式在错误处理情况下的不同
    
    ```jsx
    // 同步执行与异步执行的二元性
    try {
      **throw new Error("foo");**
    } catch (error) {
      console.log(error.toString()); // Error: foo
    }
    try {
      **Promise.reject(new Error("bar"));** 
    // Promise {<rejected>: Error: bar
    //    at <anonymous>:8:18}
    } catch (error) {
      console.log(error.toString());
    }
    ```
    
    - 第一个`try/catch` 抛出并捕获了异常，第二个`try/catch` 中`try` 中的`Promise` 语句调用`reject()` 静态方法创建`Promise` 实例同时抛出了错误，但是缺**没有**被`catch` 捕获到
    - 乍一看可能**违反直觉**（**counterintuitive**），因为代码中确实**同步（synchronously）**创建了一个拒绝的期约实例，而这个实例在拒绝时抛出了错误
    - 这里的同步代码之所以没有捕获期约抛出的错误，是因为代码没有通过合适的**异步模式（asynchronous mode）**来捕获错误
    - 从这里可以看出Promise真正的特性：它们是**同步对象—**在同步执行模式中使用，但也是**异步执行模式**（**asynchronous mode of execution**）得到媒介
- 在上面的例子中，拒绝期约的错误并没有抛到执行同步代码中的线程（**thread**）里，而是通过浏览器异步消息队列来处理的，因此，`try/catch`块并不能捕获该错误；代码一旦开始以异步模式执行，则唯一与之交互的方式就是使用异步结构——更确切地说就是`Promise` 的方法

# 2.3 期约的实例方法（Promise Instance Method）

Promise实例方法是连接外部同步代码和内部异步代码之间的桥梁

这些方法可以

- 访问异步操作返回的数据
- 处理promise成功和失败的结果
- 连续对promises求值
- 或者添加只有promise进入**终止状态**（**terminal state**）时才会执行的代码

期约的所有实例方法可以通过谷歌浏览器中打印出来的简单`Promise` 对象查看

![2.png](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89/2.png)

- 可以发现有`catch()`、`finally()`、`then()`等方法
- 其中`constructor` 属性引用`Promise` 构造函数，这一点和之前介绍过的原型对象默认属性一样
- 除此之外还有`Symbol(Symbol.toStringTag)` 符号属性，引用一个字符串，该字符串用于创建对象的默认字符串描述（所以调用期约实例的`toString()` 返回`"[object Promise]"`）

## 2.3.1 实现*Thenable*接口（Implementing The *Thenable* Interface）

- 在ECMAScript暴露的异步结构中，**任何对象**都有一个`then()` 方法，这个方法被认为实现了***Thenable***接口
- ***Thenable*** 分开就是 then + able ,~~then指的就是`then()` 方法~~，而able在英语中作为后缀表示”能…的“之意，这里可以理解为：Thenable表示”具有then特性的“
- 一个简单的实现Thenable接口的类如下
    
    ```jsx
    // Thenable接口
    class MyThenable {
      then() {}
    }
    ```
    
- ECMAScript的`Promise`类型实现了***Thenable*** 接口；这个简化的接口（指上面的例子）跟TypeScript或其他包中的接口或类型定义不同，它们都设定了***Thenable***接口更具体的形式

<aside>
💡 注意：这里只是简单解释以下***Thenable*** 接口，后面介绍异步函数时还会再谈到它的*用途（utility）*和*目的（purpose）*

</aside>

## 2.3.2 Promise.prototype.then()

- `Promise.prototype.then()` 是为了`Promise` 实例**添加处理程序**（**attach handlers**）的主要方法，它接受最多两个参数（都是可选的）
    - `onResolved` 处理程序函数，提供的话，会在`Promise` 实例进入***fulfilled***<**兑现**>状态时执行
    - `onRejected` 处理程序函数，提供的话，会在`Promise` 实例进入***rejected***<**拒绝**>状态时执行
- 因为`Promise` 实例的状态只能转换一次，所以这两个操作（处理程序函数）一定是互斥的（只能有一个被执行），如下
    
    ```jsx
    // Promise进入兑现状态时的处理程序
    function onResolved(id) {
      setTimeout(console.log, 0, id, "resolved");
    }
    // Promise进入拒绝状态时的处理程序
    function onRejected(id) {
      setTimeout(console.log, 0, id, "rejected");
    }
    // 3秒后进入兑现状态
    let p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000));
    // 3秒后进入拒绝状态
    let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000));
    
    p1.then(
      () => onResolved("p1"),
      () => onRejected("p1")
    );
    p2.then(
      () => onResolved("p2"),
      () => onRejected("p2")
    );
    // 3秒后的打印
    p1 resolved
    p2 rejected
    ```
    
    - 两个处理程序参数都是可选的，这里给`p1.then()` 和`p2.then()` 都传递了两个进入不同状态后的处理程序参数
- 如果只想提供`onRebjected` 参数，可以在`onResolved` 参数位置（第一个参数）上传入`undefined` （**canonical 规范**的选择） ，这样有助于避免在内存中创建多余的**临时**（**temporary**）对象（会被解释器忽略），对期待函数参数的类型系统也是一个交代；并且传递给任何非函数类型的参数都会被**静态忽略**（**silently ignored**）
    
    ```jsx
    // 3秒后进入兑现状态
    let p3 = new Promise((resolve, reject) => setTimeout(resolve, 3000));
    // 3秒后进入拒绝状态
    let p4 = new Promise((resolve, reject) => setTimeout(reject, 3000));
    // 会被忽略，不推荐
    p3.then("auisdhc");
    // 不传递onResolved处理程序的规范写法
    p4.then(null, () => onRejected("p4")); // p4 rejected （3秒后打印）
    ```
    

---

- `Promise.prototype.then()` 方法返回一个新的`Promise` 对象
    - 这个新对象基于`onResovled` 处理程序的返回值构建，也就是说该处理程序的返回值通过`Promise.resolve()` 静态方法包装生成新`Promise` 对象
    - 如果没有提供对应的处理程序，则`Promise.resolve()` 就会包装上一个`Promise` 解决之后的值（**包括**拒绝的Promise对象）
    - 如果提供了处理程序但是没有显式的返回语句，则`Promise.resolve()` 会默认包装默认的返回值`undefined`
    
    ```jsx
    // p.then()的返回值
    // 4秒后进入兑现状态
    let p5 = new Promise((resolve, reject) => setTimeout(resolve, 4000));
    let reP5 = p5.then(() => {
      // onResolved
      console.log("p5 resolved");
      // 返回p5作为p5.then返回值(Promise兑现)包装的值
      return "p5";
    });
    setTimeout(console.log, 4000, reP5); 
    // 四秒后打印
    // p5 resolved
    // Promise {<fulfilled>: 'p5'}
    
    // 3秒后进入兑现状态
    let p6 = new Promise((resolve, reject) =>
      setTimeout(() => {
        resolve("foo");
      }, 500)
    );
    // 不传递任何处理程序
    let p7 = p6.then();
    setTimeout(() => {
      console.log(p6);
      console.log(p7);
      console.log(p6 === p7);
    }, 500);
    // 半秒后打印
    // Promise {<fulfilled>: 'foo'}
    // Promise {<fulfilled>: 'foo'}
    // false
    
    // 返回的Promise兑现内部值都是undefined的例子
    let p8 = p6.then(() => undefined);
    let p9 = p6.then(() => {});
    let p10 = p6.then(() => Promise.resolve());
    setTimeout(() => {
      console.log(p8);
      console.log(p9);
      console.log(p10);
    }, 500);
    // 半秒后打印
    // Promise {<fulfilled>: undefined}
    // Promise {<fulfilled>: undefined}
    // Promise {<fulfilled>: undefined}
    ```
    
    - 如果直接调用`then()` 不传递任何处理程序，相当于**透传**（**passthrough**）返回一个新的与调用者状态和值都相同的`Primise` 实例
    - 有对应的处理程序且该处理程序有返回值，那么`Promise.resovle()` 的会包装这个值，如上面的`p5` 和`reP5`
    - 在不返回值，或者返回没有值的`Promise` 实例时，`then()` 返回的新创建的`Promise` 实例内部也会没有值，就像`p8`, `p9`, `p10`
- 如果在处理程序中抛出异常，`then()` 会返回一个拒绝的`Promise` 实例，而把错误对象在对应的处理程序中作为返回值不会触发拒绝行为（浏览器引擎不会抛出红字错误）
    
    ```jsx
    // 在处理程序中抛出异常
    const p11 = Promise.resolve("foo");
    let p12 = p11.then(() => {
      throw "baz";
    });
    setTimeout(() => {
      console.log(p12);
    }, 0);
    let p13 = p11.then(() => Error("qux"));
    setTimeout(() => {
      console.log(p13);
    }, 0);
    ```
    
    ![3.png](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89/3.png)
    
    - 可以看到在对应的处理程序中抛出错误，`p12` 就是一个状态为***Rejected* <拒绝>**，值为抛出的异常的`Promise` 对象，因为没有在内部捕捉拒绝的原因，所以浏览器打印出红字错误（`Uncaught`）
    - 但是直接将错误作为返回值在对应的处理程序中返回，`p13` 就是一个状态为***Fulfilled** <***兑现***>*，值为返回的错误对象的`Promise` 实例，且不会触发浏览器的未捕获错误信息（因为这个错误对象未被抛出）
    - 注意这里使用`setTimeout` 函数**异步**打印两个`Promise` 对象，如果直接使用`console.log()` 会打印出两个处于***Pending <***待定*>*状态的`Promise` 对象，因为`then()` 是异步函数

---

- 上述介绍的`then()` 返回值的调用者都是解决的`Promise`实例——全利用`onResolved` 处理程序的返回值进行`Promise.resolve()` 的包装后返回；类似地，而拒绝的`Promise` 实例在`onRejected` 处理程序中的返回值也会被`Promise.resolve()` 包装后作为`then()` 的返回值：这可能有点**违反直觉**（**counterintuitive**），但是，`onRejected` 处理程序的任务就是捕获**异步错误（asynchronous error）**，因此**拒绝处理程序**（**rejection handler**）在捕获异常错误后不抛出异常是符合Promise的行为的，应该返回一个**解决**（**resolved**）`Promise`实例; 下面的代码将之前例子中的解决`Promise`实例替换为拒绝`Promise`实例
    
    ```jsx
    // p.then()的返回值
    // 4秒后进入兑现状态
    let p5_ = new Promise((resolve, reject) => setTimeout(reject, 4000));
    let reP5_ = p5_.then(() => {
      // onRjected
      console.log("p5 rejected");
      // 返回p5_作为p5_.then返回值(Promise兑现)包装的值
      return "p5_";
    });
    setTimeout(console.log, 4000, reP5_); // （4秒后打印）p5 rejected Promise {<fulfilled>: 'p5_'}
    
    // 3秒后进入兑现状态
    let p6_ = new Promise((resolve, reject) =>
      setTimeout(() => {
        reject("foo");
      }, 500)
    );
    // 不传递任何处理程序
    let p7_ = p6_.then();
    setTimeout(() => {
      console.log(p6_);
      console.log(p7_);
      console.log(p6_ === p7_);
    }, 500); 
    // 半秒后打印
    Uncaught (in promise) foo // 这里会抛出错误，因为没有对p7_的拒绝状态抛出的错误进行处理，这一点与上面的例子不同
    // Promise {<rejected>: 'foo'}
    // Promise {<rejected>: 'foo'} 
    // false
    
    // 返回的Promise兑现内部值都是undefined的例子
    let p8_ = p6_.then(null, () => undefined);
    let p9_ = p6_.then(null, () => {});
    let p10_ = p6_.then(null, () => Promise.resolve());
    setTimeout(() => {
      console.log(p8_);
      console.log(p9_);
      console.log(p10_);
    }, 500);
    // 半秒后打印
    // Promise {<fulfilled>: undefined}
    // Promise {<fulfilled>: undefined}
    // Promise {<fulfilled>: undefined}
    
    // 在处理程序中抛出异常
    const p11_ = Promise.reject("foo");
    let p12_ = p11_.then(null, () => {
      throw "baz";
    });
    setTimeout(() => {
      console.log(p12_);
    }, 0);
    let p13_ = p11_.then(null, () => Error("qux"));
    setTimeout(() => {
      console.log(p13_);
    }, 0);
    // 马上打印
    Uncaught (in promise) baz // 这里和上面的例子相同不会因为返回值是错误对象而打印错误信息，而是因为抛出错误而打印错误信息
    // Promise {<rejected>: 'baz'}
    // Promise {<fulfilled>: Error: qux
       // at <anonymous>:9:34}
    ```
    
    - 可以看到，唯一不同的地方在直接调用`then()` 不传递任何处理程序时，拒绝的`Promise` 实例因为透传的原型，`then()` 的返回值也是新的拒绝的`Promise`实例，因为新的拒绝`Promise` 实例抛出的错误未被捕获，所以浏览器引擎打印出红色错误`Uncaught`

## 2.3.3 `Promise.prototype.catch()`

- `Promise.prototype.catch()` 方法用于给Promise添加**拒绝处理程序**（**reject handler**），这个方法只接受一个参数：`onRejected`处理程序
- 实际上它就是一个语法糖，使用`Promise.prototype.then()` 能实现同样的功能，调用它相当于调用`Promise.prototype.then(null, onRejected)`
    
    ```jsx
    let p = Promise.reject("reason");
    let onRejected = function (e) {
      console.log(e);
      setTimeout(console.log, 0, "rejected");
    };
    
    // 两种添加拒绝处理程序的方式是一样的
    p.then(null, onRejected); // reason \n rejected
    p.catch(onRejected); // reason \n rejected
    ```
    
- `Promise.prototype.catch()` 返回一个新的`Promise` 实例，这方面的行为和`Promise.prototype.then()` 的`onRejected` 处理程序是一样的
    
    ```jsx
    let p1 = new Promise(() => {});
    let p2 = p1.catch();
    setTimeout(console.log, 0, p1); // Promise {<pending>}
    setTimeout(console.log, 0, p2); // Promise {<pending>}
    setTimeout(console.log, 0, p1 === p2); // false
    ```
    

## 2.3.4 `Promise.prototype.finally()`

- `Promise.prototype.finally()`方法给Promise添加`onFinally` 处理程序，这个处理程序在`Promise` 实例转换为**解决或拒绝状态**（**resolved or rejected state**）时都会执行
- 这个方法可以避免`onResolved` 和`onRejected` 处理程序中出现**冗余代码**（**code duplication**）
- 但是`onFinally` 处理程序没有办法知道Promise的状态是解决还是拒绝，所以这个方法主要用于添加**清理代码（cleanup）**
    
    ```jsx
    let p1 = Promise.resolve("resolved value");
    let p2 = Promise.reject("rejected reason");
    
    let onFinally = function () {
      setTimeout(console.log, 0, "Finally!");
    };
    
    p1.finally(onFinally); // Finally!
    p2.finally(onFinally); // Finally!
    // 谷歌浏览器打印
    Uncaught (in promise) rejected reason
    ```
    
    - 注意`onFinally` 处理程序没有参数，不能获取调用者（`Promise`实例）的内部值（拒绝和解决处理程序可以获取到调用者的内部值）
    - 上面`p2` 被拒绝，所以它会抛出错误，`finally()` 不能像`then()` 和`catch()` 一样捕获错误，所以node环境会直接报错（不能运行），而谷歌浏览器会打印出`Uncaght` 的错误信息
- `Promise.prototype.finally()` 方法返回一个新的`Promise` 实例，它返回的实例不同与`Promise.prototype.catch()` 和`Promise.prototype.then()` 返回的实例，因为`onFinally` 处理程序被设置为一个**状态无关**（**state-agnostic**）的方法，所以在**大多数情况下**它将表现为父Promise的传递（**passthrough，透传**），对于已解决和被拒绝状态都是如此（即返回的新`Promise` 实例的状态和内部值和调用者一致）
    
    ```jsx
    let p = Promise.resolve("foo");
    let pa = p.finally();
    setTimeout(console.log, 0, p, pa); // Promise {<fulfilled>: 'foo'} Promise {<fulfilled>: 'foo'}
    setTimeout(console.log, 0, p === pa); // false
    
    let pb = p.finally(() => undefined);
    let pc = p.finally(() => {});
    let pd = p.finally(() => 'bar');
    let pe = p.finally(() => Promise.resolve('bar'));
    let pf = p.finally(() => new Error('qux'));
    // 打印的Promise实例引用个不相同，但是状态和内部值和p一致
    setTimeout(console.log, 0, pb); // Promise {<fulfilled>: 'foo'}
    setTimeout(console.log, 0, pc); // Promise {<fulfilled>: 'foo'}
    setTimeout(console.log, 0, pd); // Promise {<fulfilled>: 'foo'} 
    setTimeout(console.log, 0, pe); // Promise {<fulfilled>: 'foo'}
    setTimeout(console.log, 0, pf); // Promise {<fulfilled>: 'foo'}
    ```
    
- 少数情况下，`onFinally` 不会表现为父Promise的传递
    - 返回的是一个处于***Pending <*待定***>*状态的Promise实例，返回待定Promise实例
    - `onFinally` 处理程序抛出错误，包括显式抛出错误，或者返回一个拒绝Promise实例隐式抛出，返回相应的拒绝`Promise`实例
    
    ```jsx
    // 返回待定和拒绝的情况
    let pg = p.finally(() => new Promise(() => {}));
    let ph = p.finally(() => Promise.reject("reason"));
    
    setTimeout(console.log, 0, pg); // Promise {<pending>}
    setTimeout(console.log, 0, ph); // Promise {<rejected>: 'reason'}
    // 谷歌浏览器的错误信息打印
    Uncaught (in promise) reason
    
    let pi = p.finally(() => {
      throw new Error("baz");
    });
    
    setTimeout(console.log, 0, pi); 
    // Promise {<rejected>: Error: baz
       // at <anonymous>:9:9
       // at <anonymous>}
    // 谷歌浏览器的错误信息打印
    Uncaught (in promise) Error: baz
        at <anonymous>:9:9
        at <anonymous>
    ```
    
- 对于上面的特殊情况，返回处于***Pending <*待定***>*状态的Promise实例并**不常见**，因为这个待定Promise只要一解决（resolves），返回的新期约就会被透传为和父Promise（调用者）一样的状态和值的Promise实例
    
    ```jsx
    let p = Promise.resolve("foo");
    // 返回待定的期约并不常见，这个待定的期约一旦被解决，就会返回为透传的新期约
    // 返回一个待定的期约，这个期约在100ms后会被解决
    let pj = p.finally(
      () => new Promise((resolve, reject) => setTimeout(() => resolve("bar"), 100))
    );
    
    setTimeout(console.log, 0, pj); // Promise {<pending>} 
    // 0ms时返回的就是在onFinally中创建的新期约
    setTimeout(console.log, 0, pj == p); // false
    
    setTimeout(console.log, 200, pj); // Promise {<fulfilled>: 'foo'} 
    // 200ms时返回的就是透传的和调用者一样(状态和内部值)的新期约
    setTimeout(console.log, 200, pj == p); // false
    ```
    
    - 在0~100ms期间的`pj` 是在`onFinally` 程序处理程序中临时创建的待定状态的`Promise` ，它（指临时创建的`Promise` 实例）解决后就是内部值为’bar’的***Fulfilled** <***兑现***>*Promise实例，但是之后`pj` 就是一个新创建的和调用者一样的状态和值的`Promise` 实例（不是之前临时创建的`Promise`实例）

## 2.3.5 非重入期约方法（Non-Reentrant Promise Methods）

关于可重入函数可以查看[可重入函数（**[reentrant function](https://stackoverflow.com/questions/2799023/what-exactly-is-a-reentrant-function)**）](../../JavaScript%E5%B0%8F%E8%AE%A1/%E5%8F%AF%E9%87%8D%E5%85%A5%E5%87%BD%E6%95%B0%EF%BC%88reentrant%20function%EF%BC%89.md) ，简单来说就是一个函数在调用执行完全之前（被中断），它能被安全地再次调用（**safely called again**），JavaScript典型的可重入函数就是**生成器**

---

- 当一个`Promise` 实例进入**落地状态**（**settled state**）时，与该状态相关的处理程序仅仅会被**排期**（**scheduled**），而不是立即执行（也就是说`then()`，`catch()` 等函数是异步的，传递给它们的处理程序异步执行）
- 这就导致跟在这个处理程序的代码之后的**同步（Synchronous）**代码一定会在处理程序被调用之前执行，即使`Promise` 实例一开始就是与**新附加处理程序**（**newly attached handler**）关联的状态，执行顺序也是这样的
- 这种特性由JavaScript**运行时**（**runtime**）保证，被称为”**非重入**“（**non-reentrancy**）特性
    
    ```jsx
    // 创建解决的期约
    let p = Promise.resolve();
    
    // 添加解决处理程序
    p.then(() => console.log("onResolved handler"));
    
    /// 添加onFinally处理程序
    p.finally(() => console.log("onFinally handler"));
    
    // 同步输出
    console.log("then() returns");
    // 实际的输出
    then() returns
    onResolved handler
    onFinally handler
    ```
    
    - 在一个***fulfilled***<**兑现**>状态Promise实例上调用`then()`会把`onResolved` 处理程序推进消息队列，调用`finally()` 会把`onFinally` 处理程序推进消息队列，但这个两个处理程序在当前线程上的同步代码执行完成前不会执行，因此跟在`then()` 和`finally()` 后面的同步代码一定先于处理程序执行
- 实际上**非重入** 最基础的**充分条件**就是不能被**中断**，因为JavaScript单线程的缘故，对于两个非重入的处理程序而言，运行时不能在执行一个处理程序的中途被中断执行同步输出代码，所以会先执行完后续所有的同步代码再执行两个处理程序

---

- 先添加处理程序后解决Promise具有一样的效果（即先让处于***Pending***<等待>状态的期约调用`then()` ，然后调用同步方法解决Promise让其落地状态，最后书写同步代码，这个时候的同步代码仍然发生在`then()` 执行处理程序前），在添加处理程序之后，同步代码才改变Promise状态，那么处理程序仍然会基于该状态变化表现出**非重入**特性，如下
    
    ```jsx
    let synchronousResolve = null;
    
    let p1 = new Promise((resolve) => {
      synchronousResolve = function () {
        console.log("1: invoking resolve()");
        resolve();
        console.log("2: resolve return");
      };
    });
    
    p1.then(() => console.log("4:then() handler executes"));
    
    synchronousResolve();
    console.log("3: synchronousResolve() returns");
    // 实际输出
    1: invoking resolve()
    2: resolve return
    3: synchronousResolve() returns
    4:then() handler executes
    ```
    
    - `p1` 的状态变化发生在添加处理器之后，处理器程序也会等到运行的消息队列让它出列时才会执行
- 非重用特性适用于`onResolved`/`onRejected`处理程序，`catch()` 处理程序和`finally()` 处理程序，下面的例子中的处理程序都只能异步执行
    
    ```jsx
    let pa = Promise.resolve();
    let pb = Promise.reject();
    let pc = Promise.reject();
    let pd = Promise.resolve();
    
    // 进入落地状态时调用对应的处理程序
    pa.then(() => console.log("5: pa.then() onResolved"));
    pb.then(null, () => console.log("6: pb.then() onRejected"));
    pc.catch(() => console.log("7: pc.catch onRejected"));
    pd.finally(() => console.log("8: pd.finally onFinally"));
    
    console.log("1: pa.then() returns");
    console.log("2: pb.then() returns");
    console.log("3: pc.catch() returns");
    console.log("4: pd.finally() returns");
    // 打印结果
    1: pa.then() returns
    2: pb.then() returns
    3: pc.catch() returns
    4: pd.finally() returns
    4:then() handler executes
    5: pa.then() onResolved
    6: pb.then() onRejected
    7: pc.catch onRejected
    8: pd.finally onFinally
    ```
    

## 2.3.6 临近处理程序的执行顺序（Sibling Handler Order of Execution）

- 如果给Promise添加多个处理程序，当期约状态变化时，相关处理程序会按照添加它们的属顺序依次执行，无论是`then()`,`catch()` ,`finally()` 添加的处理程序都是如此（这一点在上一节的例子中也有所体现）
    
    ```jsx
    // 临近处理程序的顺序
    let p1 = Promise.resolve();
    let p2 = Promise.reject();
    
    p1.then(() => console.log(1));
    p1.then(() => setTimeout(console.log, 0, 4));
    
    p2.catch(() => console.log(2));
    p2.catch(() => setTimeout(console.log, 0, 5));
    
    p1.finally(() => console.log(3));
    p1.finally(() => setTimeout(console.log, 0, 6));
    // 打印
    1
    2
    3
    4
    5
    6
    ```
    

## 2.3.7 传递解决值和拒绝理由（Resolved Value and Rejected Reason Passing）

- 到了**落定状态**（**settled state**）后，promise会提供其解决值（如果兑现，fulfilled）获取拒绝理由（如果拒绝，rejected）给相关状态的处理程序，拿到返回值后，就可以进一步对这个值进行操作，这种串行的场景对需要进行**连续的串行计算块**（**successive blocks of serial computation**）时很方便
- 例如，第一次**网络请求**（**network request**）返回JSON是发送第二次请求必须的数据，那么第一次请求返回的值就应该传给`onResolved` 处理程序继续处理；当然失败的网络请求也应该把HTTP状态码传给`onRejected` 处理程序
- 解决的值和拒绝理由是在执行函数（executor）中分别作为`resolve()` 和`reject()` 的第一个参数往后传的，然后这些值又会传给它们各自的处理程序，作为`onResolved`或`onRejected` 处理程序的唯一参数，下面的例子展示了上述传递的过程
    
    ```jsx
    let p1 = new Promise((resolve, reject) => resolve("foo"));
    let p2 = new Promise((resolve, reject) => reject("reason"));
    
    p1.then((value) => console.log(value)); // foo
    p2.catch((reason) => console.log(reason)); // reason
    ```
    
    - 将`p1`和`p2` 赋值为`Promise.resolve()` 和`Promise.reject()` 静态方法创建的兑现期约和拒绝期约具有一样的效果

## 2.3.8 拒绝期约与拒绝错误处理（Rejecting Promises and Rejection Error Handling）

### 2.3.8.1 拒绝期约

- 拒绝一个`Promise`实例相当于一个`throw`表达式，它们都代表一种程序状态，即需要**中断**（**discontinuation**）或特殊**后续**（**subsequent**）处理
- 将一个`Promise` 由等待状态变为拒绝状态的拒绝期约动作包含
    - 在`Promise` 实例的执行函数（executor）中抛出错误，错误对象会作为拒绝的原因
    - 在`Promise` 实例的执行函数中调用执行函数的第二个参数`reject()` 隐式抛出异常，`reject()` 的参数会拒绝的原因
    - 在`Promise` 实例的处理程序中抛出错误，错误对象会作为拒绝的原因
    - 在`Promise` 实例的处理程序中返回拒绝的`Promise` 实例
    - 直接调用`Promise.reject()` 方法
    
    ---
    
    - 例子如下
        
        ```jsx
        // 拒绝期约
        let p1 = new Promise((resolve, reject) => reject(Error("foo")));
        let p2 = new Promise((resolve, reject) => {
          throw new Error("foo");
        });
        let p3 = Promise.resolve().then(
          () => new Promise((resolve, reject) => reject(new Error("foo")))
        );
        let p4 = Promise.resolve().then(() => {
          throw new Error("foo");
        });
        
        let p5 = Promise.reject(new Error("foo"));
        setTimeout(console.log, 0, p1);
        setTimeout(console.log, 0, p2);
        setTimeout(console.log, 0, p3);
        setTimeout(console.log, 0, p4);
        setTimeout(console.log, 0, p5);
        // 打印结果
        Promise {<rejected>: Error: foo
            at <anonymous>:2:50
            at new Promise (<anonymous>)
            at <anonymous>:2:10}
        Promise {<rejected>: Error: foo
            at <anonymous>:4:9
            at new Promise (<anonymous>)
            at <anonymous>:3:10}
        Promise {<rejected>: Error: foo
            at <anonymous>:7:49
            at new Promise (<anonymous>)
            at <anonymous>:7:9}
        Promise {<rejected>: Error: foo
            at <anonymous>:10:9}
        Promise {<rejected>: Error: foo
            at <anonymous>:13:25}
        // 同时会抛出5个未捕获的错误（红字）
        Uncaught (in promise) Error: foo × 5
        ...
        ```
        
- 期约可以使用任何理由拒绝，包括`undefined` ，但是最好统一使用错误对象，这样做主要是因为创建错误对象可以让浏览器不会错误对象中的**栈追踪信息**(**capture the stack trace**)，而这些信息对调试非常有用，例如前面浏览器抛出的5个未捕获的错误
    
    ```jsx
    Uncaught (in promise) Error: foo
        at <anonymous>:2:50
        at new Promise (<anonymous>)
        at <anonymous>:2:10
    Uncaught (in promise) Error: foo
        at <anonymous>:4:9
        at new Promise (<anonymous>)
        at <anonymous>:3:10
    Uncaught (in promise) Error: foo
        at <anonymous>:13:25
    Uncaught (in promise) Error: foo
        at <anonymous>:10:9
    Uncaught (in promise) Error: foo
        at <anonymous>:7:49
        at new Promise (<anonymous>)
        at <anonymous>:7:9
    ```
    
- 所有错误都是**异步**（**asynchronously**）抛出且未处理的，通过错误对象捕获的栈追踪信息展示了错误发生的路径；同时，需要注意浏览器**抛出错误的顺序：p1 p2 p5 p4 p3**,（打印Promise实例的顺序是正常的p1, p2, p3, p4, p5）,这是因为`p1`, `p2` 都是在执行函数中就抛出错误，而`p5` 使用静态方法的方式[等同于](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89.md)在执行函数中就抛出错误，它应该排在`p1`和`p2`后，而`p3`和`p4` 都使用了`then()` 方法在相应的处理程序中抛出错误，因为它们需要在**运行时消息队列**（**runtime’s message queue**）中**添加**处理程序，也就是说在最终抛出的未捕获错误之前还会创建另一个`Promise`实例，又因为`p3` 需要额外创建2个Promise实例而`p4` 只需要额外创建1个Promise实例，所以`p4` 抛出的错误信息在`p3` 之前
- 这个例子同样揭示了异步错误有意思的副作用：
    - 正常情况下通过`throw` 关键字抛出错误时，JavaScript运行时的错误处理机制会停止执行抛出错误之后的任何指令
        
        ```jsx
        throw Error("foo");
        console.log("bar"); // 这一行不会执行
        // 抛出异常信息
        Uncaught Error: foo
        ```
        
    - 但是，在Promise抛出错误时，因为错误实际上是从消息队列中异步抛出的，所以并不会阻止运行时继续执行同步指令（即同步和异步操作具有一定的独立性，但是node环境下抛出异步错误也会立马终止执行）
        
        ```jsx
        // 异步抛出错误
        Promise.reject(Error("foo"))
        console.log(bar); // 会执行
        // Uncaught (in promise) Error: foo
        ```
        

### 2.3.8.2 拒绝错误处理

- 拒绝的Promise会隐式抛出异步错误，异步错误只能通过异步的`onRejected`处理程序进行捕获，而不能使用同步的`try/catch` 语句进行捕获
    
    ```jsx
    Promise.reject(Error("foo")).catch(e => console.log(e)) 
    // Error: foo
      // at <anonymous>:1:16
    ```
    
    <aside>
    🚫 try {
      Promise.reject(Error("foo"));
    } catch (error) {} // 错误的捕获方式
    
    </aside>
    
- 但是在执行函数（`executor`）中的错误，在解决和决绝Promise前，仍然可以使用`try/catch` 在执行函数中捕获错误（因为执行函数同步执行）
    
    ```jsx
    // 在执行函数中使用try catch
    let p = new Promise((resolve, reject) => {
      try {
        throw new Error("foo");
      } catch (error) {
        console.log(error);
    // Error: foo
    //    at <anonymous>:4:11
    //    at new Promise (<anonymous>)
    //    at <anonymous>:2:9
      }
      resolve();
    });
    setTimeout(console.log, 0, p); // Promise {<fulfilled>: undefined}
    ```
    
- `then()` 和`catch()` 的`onRejected` 处理程序在**语义**（**semantics**）上相当于`try/catch` 出发点都是捕获错误之后将其**隔离**（**neutralize**），同时不影响正常逻辑执行，为此，`onRejected` 处理程序的任务应该是在捕获异步错误之后返回一个**[解决**的期约](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89.md)
    
    ```jsx
    // 同步错误处理和异步错误处理
    console.log("开始同步错误处理");
    try {
      throw new Error("foo");
    } catch (error) {
      console.log("捕获错误:", error.toString());
    }
    console.log("结束同步错误处理");
    
    new Promise((resolve, reject) => {
      console.log("开始异步拒绝错误处理");
      reject(new Error("foo"));
    })
      .catch((reason) => {
        console.log("捕获异步错误：", reason.toString());
      })
      .then(() => {
        console.log("结束异步拒绝错误处理");
      });
    // 打印
    开始同步错误处理
    捕获错误: Error: foo
    结束同步错误处理
    开始异步拒绝错误处理
    捕获异步错误： Error: foo
    结束异步拒绝错误处理
    ```
    

# 2.4 期约连锁与期约合成（Promise Chaining and Composition）

Composition，组成，构成之意

多个Promise实例**组合在一起**（**Combining together**）可以构成强大的**代码逻辑**（**code patterns**），这种组合行为有两种实现方式：

**期约连锁**（**Promise Chaining**），就是一个Promise接一个Promise地**拼接（sequencing）**

**期约合成**（**Promise Composition**），将多个Promise组合成一个Promise

## 2.4.1 Promise Chaining

- ECMAScript 的Promise最有用的特性之一就是**期约连锁（Promise Chaining）**:一种将非常有用的将期约逐个**串联（sequencing）**起来的编程模式
- 能将期约串联起来的能力来源于Promise API的结构：每个`Promise`实例的`then()` ,`catch()` ,`finally()` 方法都会返回一个**新的（separate）**`Promise`对象，而这个新实例又有自己的实例方法，可以继续调用Promise API的方法。这种连缀的方法调用就可以构成所谓的“**期约连锁**”，例如
    
    ```jsx
    let p = new Promise((resolve, _reject) => {
      console.log("first");
      setTimeout(() => resolve("DATA"), 500);
    });
    
    p.then((res) => {
      console.log("second:", res);
      return `dispose or wrap '${res}'`;
    })
      .then((res) => {
        console.log("third:", res);
        return `dispose or wrap '${res}'`;
      })
      .then((res) => {
        console.log("fourth:", res);
        return `dispose or wrap '${res}'`;
      });
    	// 打印结果
    // first
    // second: DATA
    // third: dispose or wrap 'DATA'
    // fourth: dispose or wrap 'dispose or wrap 'DATA''
    ```
    
    - 这个实现最终执行了一连串的**同步**任务（chained **synchronous** tasks， 这里指在`then()` 方法中执行打印语句），这种方式执行的任务没有那么有用，因为使用4个同步函数也可以做到
- 要真正实现串联的**异步**任务（chained **asynchronous** tasks），可以改写之前的例子，让每个处理程序都返回一个Promise实例，每个期约的执行器都使用`setTimeout`模拟异步执行，这样就可以让每个后续Promise对象都等待之前的Promise实例从Pending状态到达落地状态，也就是**串行化异步任务（serialize asynchronous tasks）**
    
    ```jsx
    // 串行化异步任务
    let p2 = new Promise((resolve) => {
      console.log("p2 executor");
      setTimeout(resolve, 500, "p2 data");
    });
    
    p2.then((res) => {
      console.log(res);
      return new Promise((resolve) => {
        console.log("p3 executor");
        setTimeout(resolve, 500, "p3 data");
      });
    }).then((res) => {
      console.log(res);
      return new Promise((resolve) => {
        console.log("p4 executor");
        setTimeout(resolve, 500, "p4 data");
      });
    }).then((res) => {
      console.log(res);
      return new Promise((resolve) => {
        console.log("p5 executor");
        setTimeout(resolve, 500, "p5 data");
      });
    })
    // 打印
    // p2 exetcuor (立即)
    // p2 data (500ms后)
    // p3 executor (500m后)
    // p3 data (1s后)
    // p4 executor (1s后)
    // p4 data (1.5s后)
    // p5 executor (1.5s后)
    ```
    
- 在期约连锁的过程中，每次在`then()` 方法中都要创建新Promise对象，为此可以将生成期约的代码提取到一个工厂函数（**factory function**）中
    
    ```jsx
    /**
     * @description 生成Promise的工厂函数
     * @param {string} pStr 执行器打印字符串
     * @param {string} pdata 当前期约的内部值
     * @param {string} preData 上一个期约的内布置
     * @returns
     */
    function delayedResolve(pStr, pdata, preData = "初始期约") {
      console.log(preData);
      return new Promise((resolve, _reject) => {
        console.log(pStr);
        setTimeout(resolve, 1000, pdata);
      });
    }
    
    delayedResolve("p1 executor", "p1 data")
      .then((res) => delayedResolve("p2 executor", "p2 data", res))
      .then((res) => delayedResolve("p3 executor", "p3 data", res))
      .then((res) => delayedResolve("p4 executor", "p4 data", res));
    // 打印
    // 初始期约 (立即)
    // p1 executor (立即)
    // p1 data (1s后)
    // p2 executor (1s后)
    // p2 data (2s后)
    // p3 executor (2s后)
    // p3 data (3s后)
    // p4 executor (3s后)
    ```
    
    - 每个后续的处理程序都会等待**前一个**（**predecessor**）Promise实例解决，然后实例化一个新的Promise对象并返回
    - 这种结构可以简洁地将异步任务串行化，解决了之前依赖回调（**callbacks**）的难题，如果使用回调上述代码可能如下
        
        ```jsx
        /**
         * @description 回调的结构
         * @param {string} pStr 表示正在执行的回调
         * @param {string} pdata 当前回调获得的数据，这里直接传递，实际上是在回调内部通过异步操作获取的
         * @param {Function} callback 下一个回调函数
         * @param {string} preData 上一个回调产生的数据
         */
        function delayedCallback(pStr, pdata, callback, preData = "初始回调") {
          console.log(preData);
          console.log(pStr);
          setTimeout(() => {
            callback && callback(pdata);
          }, 1000);
        }
        
        delayedCallback("p1 callback", "p1 data", (res) => {
          delayedCallback(
            "p2 callback",
            "p2 data",
            (res) => {
              delayedCallback(
                "p3 callback",
                "p3 data",
                (res) => {
                  delayedCallback("p4 callback", "p4 data", null, res);
                },
                res
              );
            },
            res
          );
        });
        // 打印结果
        // 初始回调 (立即)
        // p1 callback (立即)
        // p1 data (1s后)
        // p2 callback (1s后)
        // p2 data (2s后)
        // p3 callback (2s后)
        // p3 data (3s后)
        // p4 callback (3s后)
        ```
        
        - 如果嵌套再多几层，就会出现很明显的**回调地狱**（**callback hell**）
- Promise这种期约连锁的特性正好解决了以前的异步编程模式的回调地狱问题，因为`then()` 、`catch()` 、`finally()` 都返回期约，所以串联这些方法很**直观**（**straightforward**）
    
    ```jsx
    let pa = new Promise((resovle, reject) => {
      console.log("inital pa promise rejects");
      setTimeout(() => {
        reject("test");
      }, 500);
    });
    pa.catch((reason) => {
      console.log("捕获异步错误：", reason);
      return "默认数据";
    })
      .then((res) => console.log("处理获取到的数据：", res))
      .finally(() => console.log("一些拒绝和解决都有的冗余操作"));
    // 打印结果
    // inital pa promise rejects
    // 捕获异步错误： test
    // 处理获取到的数据： 默认数据
    // 一些拒绝和解决都有的冗余操作
    ```
    

## 2.4.2 期约图（Promise Graphs）

- 因为期约可以有任意多个处理程序，所以期约连锁可以构建**有向非循环图（directed acyclic graphs）**
    - 每个期约都是一个图中的一个**节点**（**node**）
    - 而使用实例方法（`then()` 等）添加的处理程序则是**有向顶点**（**directed vertex**）
    - 图的方向就是期约的解决或拒绝顺序，因为图中的每个节点都会等待前一个节点落地
- 一个简单例子
    
    ```jsx
    let A = new Promise((resovle, reject) => {
      console.log("A");
      resovle();
    });
    
    let B = A.then(() => console.log("B"));
    let C = A.then(() => console.log("C"));
    
    B.then(() => console.log("D"));
    B.then(() => console.log("E"));
    C.then(() => console.log("F"));
    C.then(() => console.log("G"));
    // 打印
    A
    B
    C
    D
    E
    F
    G
    // 图
    //    A
    //   / \
    //  B   C
    // /\   /\
    // D E  F G
    ```
    
    - 日志的输出语句是对二叉树（**binary tree**）的**层序遍历**（**level-order traversal**）
    - 期约的处理程序按照它们添加的顺序执行，由于期约的处理程序是**先**（**eagerly**）添加到消息队列，**然后**（**lazily**）才逐个执行，因此构成了层序遍历
- 树只是期约的**一种表现形式**（**one manifestation of**）。考虑到根节点不一定唯一，且多个Promise实例可以组合成一个期约（下一个小节介绍的Promise的静态方法），所以**有向非循环图**（**directed acyclic graph**）是体现期约连锁可能性的最准确的**表达**（**characterization**）

## 2.4.3 Promise.all()和Promise.race() （Parallel Promise Composition with Promise.all() and Promise.race() ）

Parallel 表示“并行的，并联”，这里应该表示Promise的**组合**（**Composition**）方式应该是并联的，各个Promise实例并行平等

- `Promise`类提供两个将多个Promise实例组合成一个Promise期约的静态方法：`Promise.all()` 和`Promise.race()`
- 而后**合成promise**（**composed promise**）的行为取决于内部期约的行为

### 2.4.3.1 Promise.all()

- Promise.all()静态方法创建`Promise` **会在一组期约全部解决之后再解决**，这个静态方法接受一个可迭代对象，返回一个**要么全有要么全无的（all-or-nothing）**新期约
    
    ```jsx
    let p1 = Promise.all([Promise.resolve(), Promise.resolve()]);
    console.log(p1);
    setTimeout(console.log, 0, p1)
    // 可迭代元素可以不是期约
    // 但是它会作为期约的内部值传递给Promise.resolve()转换为期约
    let p2 = Promise.all([1, 2]);
    console.log(p2);
    setTimeout(console.log, 0, p2)
    
    // 空的可迭代对象等价于Promise.resolve()
    let p3 = Promise.all([]);
    console.log(p3);
    setTimeout(console.log, 0, p3)
    // 必须给Promise.all传递一个可迭代对象，否则会报错
    let p4 = Promise.all();
    // 打印结果
    Promise {<pending>}
    Promise {<pending>}
    Promise {<fulfilled>: Array(0)}
    Promise {<fulfilled>: Array(2)}
    Promise {<fulfilled>: Array(2)}
    Promise {<fulfilled>: Array(0)}
    Uncaught (in promise) TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
        at Function.all (<anonymous>)
        at <anonymous>:12:18
    ```
    
    - 注意看打印结果，`p1` 和 `p2` 立即打印都是***Pending<*等待*>*状态**，而`p3` 立即打印就是***filfilled***<**兑现**>状态，虽然`p1` 和`p2` 组成的期约都是通过`Promise.resolve()` 直接生成的，但是等待它们都被解决仍然需要“时间”，所以立即（同步）打印自然是等待状态。而`p3` 则是因为`Promise.all([])` 等价于`Promise.resolve()` ，直接创建了一个处于***filfilled***<**兑现**>状态的promise，所以立即打印的状态就是兑现状态
    - 给`Promise.all()` 不传递任何参数会抛出`TypeError` ，但是这个`TypeError` 不能使用外部的`try/catch` 语句捕获到，因为它属于Promise内部抛出的异步错误，能通过对应的拒绝处理程序捕获到错误，其中`p4` 的内部值就是错误对象，如下
        
        ```jsx
        let p4 = Promise.all();
        p4.catch((reason) => {
          console.log(reason.toString());
        })
        // TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
        ```
        
- 因为合成的期约(**composed promise**)只会在每个**包含的promises**(**contained promises**)都解决后才解决，所以合成期约的等待时间往往是包含的promises中最后一个的解决的时间
    
    ```jsx
    // 合成的期约等待的时间是包含的最后一个期约的解决时间
    let pa = Promise.all([
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("1: resolved");
          resolve();
        }, 589);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("2: resolved");
          resolve();
        }, 345);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("3: resolved");
          resolve();
        }, 456);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("4: resolved");
          resolve();
        }, 590);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("5: resolved");
          resolve();
        }, 589);
      }),
    ]);
    pa.then(() => {
      console.log("pa: resolved");
    });
    // 打印
    // 2: resolved (345ms后)
    // 3: resolved (456ms后)
    // 1: resolved (589ms后)
    // 5: resolved (589ms后)
    // 4: resolved (590ms后)
    // pa: resolved (590ms后)
    ```
    
    - `Promise.all()` 的参数（可迭代对象）的第四个元素最后解决，所以合成的参数的解决时间“紧随其后”（立即）
- 如果至少有一个包含的promises(**contained promises**)待定，则合成的promise也会待定；如果有一个包含的promise拒绝，那么合成的promise也会拒绝
    
    ```jsx
    let p_pending = Promise.all([Promise.resolve("k"), new Promise(() => {})]);
    setTimeout(() => {
      console.log(p_pending);
    }, 0);
    // 打印 Promise {<pending>}
    ```
    
    - 虽然可迭代对象的第一个元素本身处于兑现状态，但是第二个元素永远不会被解决，所以合成参数不会被解决
    - 同时需要注意合成参数的内部值在等待期间一直是`undefined`
    
    ```jsx
    // 一个拒绝的期约会导致合成期约处于拒绝状态
    let p_reject = Promise.all([
      new Promise((_resolve, reject) =>
        setTimeout(
          (reason) => {
            console.log("1: rejected");
            reject(reason);
          },
          1001,
          "reason1"
        )
      ),
      Promise.resolve("resolve"),
      Promise.resolve("resolve"),
      new Promise((_resolve, reject) =>
        setTimeout(
          (reason) => {
            console.log("4: rejected");
            reject(reason);
          },
          1000,
          "reason4"
        )
      ),
      new Promise((_resolve, reject) =>
        setTimeout(
          (reason) => {
            console.log("5: rejected");
            reject(reason);
          },
          1000,
          "reason5"
        )
      ),
    ]);
    
    p_reject.catch((reason) => {
      console.log(reason);
    });
    setTimeout(() => {
      console.log(p_reject);
    }, 1000);
    // 打印结果
    // 4: rejected (1000ms后)
    // reason4 (1000ms后)
    // 5: rejected (1000ms后)
    // Promise {<rejected>: 'reason4'} (1000ms后)
    // 1: rejected (1001ms后)
    ```
    
    - 需要注意的是合成的promise和包含的promises之间是**相互独立**的，合成的promise拒绝了 并不影响它包含的promise落定自己的状态，这一点在打印除了合成状态后，第一个元素在1ms后立即进入拒绝状态有关
    - 合成的promise*会***静默(*will* silently handle)**处理所有包含的promises的落地拒绝状态抛出的异步错误；也就是说，第五个元素和第一个元素的promise落地拒绝状态后它们抛出的异步错误，会因为合成的promise在落地拒绝状态时（虽然拒绝理由是第四个元素的拒绝理由），在对应的合成promise的拒绝处理程序捕获而被静默处理
    - 除此之外，合成的promise拒绝的理由是它包含的promises中第一个拒绝的promise的拒绝理由，虽然第四个元素和第五个元素都在1000ms时落定拒绝状态，在时间相同的情况下，就按照可迭代对象的元素顺序决定合成promise的拒绝理由，即选择第四个元素的拒绝理由作为合成promise的拒绝理由
- 如果所有promises都成功解决，则合成promise在落定解决状态后的内部值就是**包含所有promises解决值的数组**，按照迭代器顺序
    
    ```jsx
    // 合成的期约的内部值
    let p_resolved = Promise.all([
      Promise.resolve(5),
      Promise.resolve(),
      Promise.resolve(1),
    ]);
    p_resolved.then((res) => {
      console.log("内部值：", res);
    }); // [5, undefined, 1]
    ```
    

### 2.4.3.2 Promise.race()

- `Promise.race()`静态方法返回一个包装期约，它是一组集合中最先解决或拒绝的promise的**镜像（mirror），**这个方法接收一个可迭代对象，返回一个新promise；它与`Promise.all()` 最大的区别是，它是”**first-of-all**”（**第一个落地状态的promise镜像**） 而`Promise.all()` 是（**all-or-nothing）（要么全有要么全无的<对于成为兑现状态而言>）**
    
    ```jsx
    // Promise.race() 返回一组包含的期约中最先落地状态的期约的镜像期约
    let promises = [Promise.resolve(1), Promise.resolve(2), Promise.reject("reason")];
    let p1 = Promise.race(promises);
    
    setTimeout(() => {
      console.log(p1); // Promise {<fulfilled>: 1}
      console.log(p1 === promises[0]); // false
    }, 0);
    ```
    
    - 通过打印可以发现，如果有多个“最先”解决或拒绝的包含的promise，就会按照可迭代对象的顺序选择第一个，所以包装期约的内部值是参数的第一个元素的内部值，二者的状态和值完全相同，但是不是同一个promise，所以称为**镜像（mirror）**
    - 和`Promise.all()` 相似的行为是，合成的promise生成后，它会静默其它包含的promises中的拒绝promise
- 关于`race()` 接收参数的行为也与`Promise.all()` 类似，以下以可迭代对象代指参数
    - 如果可迭代对象中的元素不是promise，会通过`Promise.resolve()` 转化为promise
    - 空的可迭代对象等价于`new Promise(() => {})`
    - 不传递参数会抛出异步错误，且这个错误不能被`try/catch` 捕获，可以使用`Promise.prototype.catch()` 进行捕获
        
        ```jsx
        // 参数
        let p2 = Promise.race([5, 3, 4]);
        p2.then((res) => {
          console.log(res); // 5
        });
        
        let p3 = Promise.race([]);
        setTimeout(() => {
          console.log(p3); // 
        }, 0);
        
        let p4 = Promise.race();
        p4.catch((reason) => {
          console.log(reason.toString());
        });
        // 打印结果
        // TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
        // 5
        // Promise {<pending>}
        ```
        
- `Promise.race()` 不会对解决或拒绝的promise区别对待，无论是解决还是拒绝，只要是第一个落定的promise，它就会成为Promise.race()生成的新期约的蓝本
    - 解决先发生，超时后的拒绝和解决被忽略
    - 拒绝先发送，超时后的解决和拒绝被忽略
    - 迭代顺序决定了落定的顺序
    - **合成**（**composed**）的期约***会*静默**处理**（*will* silently** handle**）**所有**包含**（**contained**）期约的拒绝操作

## 2.4.3 串行期约合成（Serial Promise Composition）

上面的两个`Promise` 的静态合成方法都是**并行的期约合成（Parallel Promise Composition），**而在讨论**期约连锁（Promise Chaining）**时一直围绕期约的串行执行，并且期约还有另外一个特性：**异步（asynchronously）产生值并将其传递给处理程序**

---

- 基于后续期约使用之前期约(**predecessor**)的返回值来串联期约是期约的基本功能,这很像**函数合成（function composition）,**即将多个个函数合成为一个函数
    
    ```jsx
    // 后续期约使用之前的期约的返回值来串联期约很像函数合成
    function addTwo(x) {
      return x + 2;
    }
    function addThree(x) {
      return x + 3;
    }
    function addFive(x) {
      return x + 5;
    }
    
    // 合成函数
    function addTen(x) {
      return addFive(addTwo(addThree(x)));
    }
    console.log(addTen(7)); // 17
    ```
    
    - 在这个例子中，有三个函数基于一个值合成为一个函数（尽管这样看起来很傻，但当三个函数功能都十分复杂时，这种合成函数的作用就很大了）
- 类似于函数合成，期约也可也这样合成起来用，渐进地消费一个值，并返回一个结果
    
    ```jsx
    // 转化为期约形式，假设每个函数都是复杂的操作
    function addTen(x) {
      return Promise.resolve(x).then(addTwo).then(addThree).then(addFive);
    }
    
    addTen(8).then(console.log); // 18
    ```
    
    - 这种将promise的处理程序分离为多个函数作为多个`then()` 的参数以达到成功处理期约内部值的模式利用到了期约连锁的特性，这就是一种串行的期约合成
- 如果处理程序函数过多，导致合成的函数也有一条很长的代码，可以利用`Array.pototype.reduce()` 高阶函数提炼出一个通用函数，把任意多个函数作为处理程序合成一个连续传值的期约连锁，如下
    
    ```jsx
    // 通用函数，合成函数时使用reduce()高阶函数生成一个串联的函数
    function compose(...fns) {
      return (x) =>
        fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x));
    }
    
    let addFifteen = compose(addFive, addTwo, addThree, addFive);
    addFifteen(45).then(console.log); // 60
    ```
    

<aside>
💡 注意：在讨论异步函数时还会出现这个串行期约合成的概念

</aside>

# 2.5 期约扩展（Promise Extensions）

上述基本上就是ECMAScript6参考Promises/A+规范实现的期约的大部分特性，但是它也有**不足之处：**

**期约取消**（**promise canceling**）

**进度追踪**（**progress tracking**）

这些在很多第三方期约库实现中具备而ECMAScript 6 规范未涉及的两个特性就是**期约的扩展特性（Promise Extensions）**

## 2.5.1 期约取消（Promise Canceling）

- 在一些场景下， promise还在**进度**（**progress**）中，**程序**（**program**）就不关心这个promise的结果了，这个时候能“**取消**（**cancel**）”promise就好了
    - 一些第三方库就提供了这种期约的扩展功能，如Bluebird
    - 实际上TC39委员会也曾准备在ES6的期约中增加这个特性，但是相[提案](https://github.com/tc39/proposal-cancelable-promises)被**撤回**（**withdrawn**）了
    - 这就导致ES6的期约的**封装函数**（**encapsulated function**）开始执行，就没办法阻止它执行到完成，这使得期约很“**激进**（**eager**）”
- 要实现期约取消功能，可以在现有的ECMAScript 6 的期约基础上提供**一种临时性的封装**（**an ad-hoc implementation**）
    - Kevin Smith**设计**的”**取消令牌**（**cancel token，** [github地址](https://github.com/zenparsing/es-cancel-token)）”**草图**（**design sketch**）能实现这种功能
    - 生成的**取消令牌实例（cancel token）**提供一个接口，利用这个接口可以取消期约
    - 同时提供一个期约的实例，可以用来触发取消（**tigger cancellation**）后的操作并求值取消状态
        
        ```jsx
        // 取消令牌
        class CancelToken {
          constructor(cancelFn) {
            this.promise = new Promise((resolve, reject) => {
              cancelFn(resolve);
            });
          }
        }
        ```
        
        - 这个类包装了一个期约，把解决方法暴露给了`cancelFn`参数，这样**外部代码**（**external entity**）就可以向构造函数中传入一个函数，从而控制什么情况下可以取消期约
        - 这里的期约是令牌类的公共成员，因此可以给它添加**监听处理程序**（**listeners**）以取消期约
- 一个使用取消令牌的思想的例子
    
    ```jsx
    class CancelToken {
      static {
        this.id = 0;
      }
      constructor(cancelFn) {
        this.id = CancelToken.id++;
        this.promise = new Promise((resolve, reject) => {
          **cancelFn(() => {
            setTimeout(console.log, 0, "delay cancelled");
            resolve();
          });**
        });
      }
    }
    
    const startBtn = document.querySelector("#start");
    const cancelBtn = document.querySelector("#cancel");
    
    function cancellableDelayedResolved(delay) {
      setTimeout(() => console.log("set delay"), 0);
      return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
          setTimeout(console.log, 0, "delayed resolved");
          resolve();
          cancelBtn.removeEventListener("click", listener);
        }, delay);
        let listener = null;
        const cancelToken = new CancelToken(**(cancelCallback) => {
          listener = () => {
            console.log(cancelToken.id);
            cancelCallback();
            cancelRequest();
          };
          cancelBtn.addEventListener("click", listener);
        }**);
        cancelToken.promise.then(() => {
          clearTimeout(id);
          // 移除当前的事件处理程序
          cancelBtn.removeEventListener("click", listener);
        });
      });
    }
    
    startBtn.addEventListener("click", () =>
      cancellableDelayedResolved(1000)
    );
    ```
    
    - 最重要的两部分代码是黄色背景的代码，第一段黄色背景的代码`CancelToken`实例声明后就会立即将构造函数传递进来的回调函数执行，执行时将resolve配合函数参数作为对象传递，让外部代码可以获取到resolve决定何时执行以取消其它的promise
    - 第二段黄色背景的代码就是在进行一次Promise请求时创建它对应的取消令牌，这里很高级的是，`cancelCallback` 参数实际上就是创建过程中`CancelToken` 传递出来的包含`resolve`的取消函数对象，在这里取消promise的条件是点击一个按钮，所以会声明一个点击事件处理程序用于监听按钮的点击，而这个事件处理程序就会执行`cancelCallback` ，即执行`resolve` 直接将`CancelToken` 实例的promise完成（取消确定），后续`CancelToken` 实例将当前Promise请求中的异步操作清除即可（这里使用`clearTimeout`）
    - 注意在取消Promise和完成Promise都需要将取消按钮关联的**listener**解绑，因为**`addEventListener`**的监听的事件处理程序是独立叠加的，防止下一次取消时执行上一次监听的事件处理程序（否则会多次调用不同的`CancelToken` 实例的promise中的resolve，打印出多个**"delay cancelled"**）
    - 完整代码在[GitHub](https://github.com/mangwu/javascript/blob/master/ProfessionalJavaScriptForWebDeveloper4/ch11%20-%20Promise%20And%20Async%20Functions/11.2%20Promise/11.2.5%20Promise%20Extensions/11.2.5.1%20Promise%20Canceling.js)上，效果如下
        
        ![Promise Cancelling.gif](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89/Promise_Cancelling.gif)
        
- 实际上，取消期约的本质就是终止期约在执行过程中的异步操作，而上述的取消令牌方法就是利用期约的`resolve()` 处理程序，让另外一个`Promise`实例感知程序是否需要终止进行中的期约，如果需要，就让另一个`Promise` 实例进入兑现状态（确定取消），执行对应的解决处理程序，将期约的异步操作终止（例子中是使用`clearTimeout` 函数进行模拟）

## 2.5.2 期约进度通知（Promise Progress Notifications）

- **执行中**（**in-progress**）的期约可能会有不少的**离散**（**discrete**）的“阶段”，在最终解决之前必须依次经过，某些情况下**监控**（**watch for**）期约的**执行进度**（**checkpoints**）会很有用，这种监控期约的执行进度的特性叫做**进度追踪**（**progress tracking**）
    - ECMAScript 6 期约并不支持**进度追踪**（**progress tracking**）
    - 但是可以通过**扩展**（**extends**）来实现
- 一种实现方式是**扩展**（**extends**）`Promise`类，为它的子类添加`notify()` 方法
    
    ```jsx
    // 进度跟踪
    class TrackablePromise extends Promise {
      constructor(executor) {
        const notifyHandlers = [];
        super((resolve, reject) => {
          return executor(resolve, reject, (status) => {
            notifyHandlers.map((handler) => handler(status));
          });
        });
        this.notifyHandlers = notifyHandlers;
      }
      notify(notifyHandler) {
        this.notifyHandlers.push(notifyHandler);
        return this;
      }
    }
    ```
    
    - 首先这个`TrackablePromise` 的构造函数会创建了一个`notifyHandlers` 数组，这个数组用于保存在追踪过程中的追踪处理程序（即要追踪的Promise）
    - 然后调用`super()` 以继承`Promise` 的特性，调用`super()` 需要传递父类的`executor` 执行器，但是至少简单的讲子类的`executor` 传递过去就达不到扩展的效果，需要在`executor`中增加额外的**追踪参数函数**，使用箭头函数包装一下再传递给执行函数原始的`resolve` 和`reject` ，然后在子类的`executor` 执行器中添加额外的`notify` 函数，这个函数用于在实例化Promise编写执行器函数时使用，用于设置在何时调用`notify` 以记录当前`Promise`进度
    - 因为初始时`notifyHandlers` 是空数组，如果不添加然后追踪处理程序的函数对象，执行上述的`notify` 也没有效果，所以需要在`TrackablePromise` 上添加一个原型方法用于在`notifyHandlers` 上添加追踪处理程序（《JavaScript高级程序设计（第4版）》中将这个原型方法也定义成了`notify` ，所以可能不好理解）
- 使用上述定义的`TrackablePromise`
    
    ```jsx
    let p = new TrackablePromise((resolve, reject, notify) => {
      function countDown(x) {
        if (x > 0) {
          notify(`${20 * x} % remainin`);
          setTimeout(() => countDown(x - 1), 1000);
        } else {
          resolve();
        }
      }
      countDown(5);
    });
    // 没有任何打印
    ```
    
    - 期约`p` 会连续5次**递归**(**recursively**)的设置1000毫秒的**超时**（**timeout**）
    - 每个超时都会调用`notify()` 并传入状态值，注意这里的`notify()` 是在`executor` 上额外增加的一个函数对象，用于遍历执行`notifyHandlers` 数组上的每个追踪处理程序
    - `notifyHandlers` 初始为空数组，因为没有使用`notify(notifyHandler)` （原型方法）增加追踪处理程序，所以没有任何打印
- 使用原型方法增加追踪处理程序，以记录期约执行时的日志
    
    ```jsx
    let p1 = new TrackablePromise((resolve, reject, notify) => {
      function countDown(x) {
        if (x > 0) {
          notify(`${20 * x} % remaining`);
          setTimeout(() => countDown(x - 1), 1000);
        } else {
    			notify(`p1 promise resolved`);
          resolve();
        }
      }
      countDown(5);
    });
    
    p1.notify((x) => setTimeout(console.log, 0, "progress:", x));
    // 打印
    // progress: 80 % remaining (1s 后)
    // progress: 60 % remaining (2s 后)
    // progress: 40 % remaining (3s 后)
    // progress: 20 % remaining (4s 后) 
    // progress: p1 promise resolved (5s 后)
    ```
    
    - 注意这里**没有**”100 % remaining” 相关提示，因为在执行`countDoun(5)` ，`notify()` 函数执行时，`notifyHandlers` 还是空（执行器是同步执行的，所以后面执行的`p1.notify()` 晚于`countDown(5)`） ，之后才添加通过原型方法添加上一个`notifyHandler` ,所以才有记录
- `notify()` (原型)函数可以返回期约，所以可以连缀调用，连续添加处理程序，多个处理程序会针对的每条消息分别执行一遍
    
    ```jsx
    let p1 = new TrackablePromise((resolve, reject, notify) => {
      function countDown(x) {
        if (x > 0) {
          notify(x);
          setTimeout(() => countDown(x - 1), 1000);
        } else {
          console.log(`p1 promise resolved`);
          resolve();
        }
      }
      countDown(5);
    });
    
    p1.notify((x) => setTimeout(console.log, 0, `progress: ${x * 20}% remaining`, ));
    p1.notify((x) => setTimeout(console.log, 0, `${x} seconds later, the execution is complete`));
    // 打印结果
    // progress: 80% remaining (1s 后)
    // 4 seconds later, the execution is complete (1s 后)
    // progress: 60% remaining (2s 后)
    // 3 seconds later, the execution is complete (2s 后)
    // progress: 40% remaining (3s 后)
    // 2 seconds later, the execution is complete (3s 后)
    // progress: 20% remaining (4s 后)
    // 1 seconds later, the execution is complete (4s 后)
    // p1 promise resolved (5s 后)
    ```
    
    - 虽然这个实现很**粗糙**（**crude**），但是可以演示如何使用**通知**（**notification**）报告进度了

<aside>
💡 注意：ES6不支持取消期约和进度追踪，一个主要的原因就是这样会导致期约连锁和期约合成过度复杂化。比如在一个期约连锁中，如果某个被其他期约依赖的期约被取消或者发出了一个通知，那么接下来应该发生什么完全说不清楚（~~后续的期约都应该取消，个人认为~~）。毕竟，如果取消了`Promise.all()` 其中的一个期约（~~个人认为应该按照这个期约合并时就不存在这种情况继续处理~~），或者期约连锁中前面的期约都发送了一个通知，那么接下来应该怎么办比较合理呢？

</aside>

# 2.6 现代ECMAScript关于Promise新增的特性

参考MDN

[2.6 额外补充](2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89/2%206%20%E9%A2%9D%E5%A4%96%E8%A1%A5%E5%85%85.md)