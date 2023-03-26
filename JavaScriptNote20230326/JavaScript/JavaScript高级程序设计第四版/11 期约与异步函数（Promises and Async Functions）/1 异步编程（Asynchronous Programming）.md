# 1. 异步编程（Asynchronous Programming）

- **同步行为**（**synchronous behavior**）和**异步行为**（**asynchronous behavior**）的**对立统一**（**duality， 二象性**）是计算机科学中一个**基础概念**（**fundamental concept**），尤其像JavaScript这种**单线程事件循环模型**（**single-threaded event loop model**）中语言中，同步行为和异步行为更是需要理解的基础概念
    - 同步行为：之前章节学习的所有例子都是同步行为，即按照代码顺序从上到下开始解释执行（代码提升也仅仅是在提升后按顺序执行，仍然属于同步行为）
    - 异步行为：异步行为**承担**（**is borne out of**）了因**高吞吐量计算**（**higher computational throughput**）而**高延迟**（**high-latency**）的操作的 **优化**（**optimize**）需求；它的核心在于，如果在等待其它操作完成的同时，即使运行其它**指令**（**instructions**），系统也能保持稳定，那么这样做就是务实的
- 更进一步，**异步操作**（**asynchronous operations**）不一定只能在计算量**密集**（**intensive**）而导致高延迟中使用；只要你不想为等待某个操作而**阻塞线程执行**（**block a thread of execution**），那么任何时候都可以使用（即可以将这个操作变为异步操作）

# 1.1 同步与异步（Synchronous vs. Asynchronous JavaScript）

## 1.1.1 同步行为（Synchronous Behavior）

### 1.1.1.1 理解同步行为

- ***同步行为***类似于内存中的顺序执行的处理器指令（**sequential processor instructions**）
    - 每条指令都会严格按照它们出现的顺序来执行
    - 每条指令之后也能立即**获取**(**retrieving**)存储在系统本地（如**寄存器**<**processeor register**>或系统内存）的信息
- 同步行为这样的执行流程容易分析程序在执行到**代码任意位置**时（**given point in code**）的状态（比如变量的值）

### 1.1.1.2 例子

- 下述执行一个简单的数学计算属于同步行为
    
    ```jsx
    let x = 3;
    x = x + 4;
    ```
    
    - 在程序的每一步，都可以推断出程序的状态，因为后面的指令总是在前面的指令完成后才会执行
        - 在`let x = 3;` 执行前，程序中没有`x` 变量
        - 在`let x = 3;` 执行后，`x = x + 4;` 执行前，程序中有一个`x` 变量保存原始值3，它可以被立即使用
        - 在`x=x+4;` 执行后，程序中的`x` 变量保存原始值 7，它可以被立即使用
    - 这两行JavaScript代码对应的**低级指令**（**low-level instructions**）不难编译出（例如，从JavaScript<代码>到x86<指令>），下面三个描述对应三个指令
        - 首先，操作系统会在栈内存上分配一个存储浮点数值的空间（`let x = 3`）
        - 然后针对这个值做一次数学运算（`x + 4`）
        - 再把计算结果写回之前分配的内存中（`x = res` ，res就是上一个指令的运算结果）
    - 所有这些指令都是在单线程中顺序执行的，在低级指令程序的每个时间点（each point），有充足的工具可以确定系统状态

## 1.1.2 异步行为（**Asynchronous Behavior**）

### 1.1.2.1 理解异步行为

- 相对的，***异步行为***类似于**系统中断**（**interrupts**）,即当前进程**外部的实体**（**entity external**）可以触发（**trigger**）代码执行
    - 异步操作经常是必要的，因为强制进程等待一个长时间的操作通常是不可行的（同步操作必须要等）
    - 如果代码要访问一些**高延迟的资源**（**high-latency resource**），比如远程服务器（remote server）发送请求并等待响应，那么就会出现长时间的等待

### 1.1.2.2 例子

- JavaScript中异步操作的例子可以是在**定时回调**（**timeout**）中执行一次简单的**数学计算**（**arithmetic operation**）
    
    ```jsx
    let x = 3;
    setTimeout(() => x = x + 4, 1000); 
    ```
    
    - 这段程序与[同步代码](1%20%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B%EF%BC%88Asynchronous%20Programming%EF%BC%89.md)执行的任务一样，都是把两个数加在一起，但这一次**执行线程**（**thread of execution**）不知道x值何时会改变，因为这取决于回调何时从**消息队列**（**message queue**）出列并执行
    - 异步代码不容易推断
        - 虽然这个例子对应的**低级代码**（**low-level instructions**）最终和前面的例子没有什么区别，但[第二个指令块](1%20%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B%EF%BC%88Asynchronous%20Programming%EF%BC%89.md)（**chunk of instructions**， 加操作及赋值操作）是由系统计时器触发的，这会生成一个**入队执行**（**enqueue execution**）的**中断**（**interrupt**）
        - 到底什么时候会触发这个中断，这对JavaScript运行时来说是一个黑盒，因此实际上无法预知（尽管可以保证这发生在**当前线程的同步代码**（**current thread of synchronous**）执行完成**之后**，否则回调都没有机会出列被执行）
        - 总之，在**排定回调**（**scheduled callback**）以后基本没办法知道系统状态何时变化
- 为了让后续代码能够使用x，异步执行的函数需要在更新x的值以后通知其他代码，如果程序不需要这个值，那么就只管继续执行，不必等待这个结果
- 设计一个能够知道x什么时候可以读取的系统是非常难的，JavaScript在实现这样的系统的过程中也经历了几次**迭代**（**iterations**）

# 1.2 以往的异步编程模式（Legacy Asynchronous Programming Patterns）

- 异步行为是JavaScript的基础，但以前的实现不理想
- 在早期的JavaScript中，只支持定义**回调函数**（**callback function**）来表明异步操作完成，**串联**（**Serializing**）多个异步操作是一个常见的问题，通常需要深度**嵌套的回调函数**（**nested callback functions**）来解决——俗称“回调地狱（callback hell）”
    - 异步编程的关键在于异步操作何时执行完毕
    - 之前的异步编程模式使用回调函数表明异步操作完成
- 假设有如下的异步函数，使用了setTimeout在1秒后执行某些操作
    
    ```jsx
    // setTimeout是一个异步函数
    function double(value) {
      setTimeout(() => setTimeout(console.log, 0, value * 2), 1000);
    }
    
    double(3); // 大约1000ms后执行
    ```
    
    - `double` 是一个异步函数，关键理解为什么说它是一个异步函数
    - `setTimeout`可以定义一个在指定时间之后会被调用执行的回调函数
    - 对于这个例子而言，1000毫秒后，JavaScript**运行时**（**runtime**）会把回调函数推到JavaScript的消息队列上去等待执行；推到队列后，回调什么时候出列被执行对JavaScript代码就完全不可见了
    - `double()` 函数在`setTimeout`成功**调度**（**scheduling，** 这里指把回调函数推到消息队列）异步操作之后会立即**退出**（**exits**）

## 1.2.1 异步返回值（Return Asynchronous Values）

- 假设`setTimeout` 操作会返回一个有用的值，一个需要考虑的问题是如何把这个值传递给需要它的地方
    - 广泛接受的一个**策略**（**strategy**）是给异步操作提供一个回调函数
    - 这个回调函数中包含要使用**异步返回值**的代码（作为回调的参数）
- 一个使用`setTimeout` 模拟的传递异步操作返回值的函数
    
    ```jsx
    function asyncGetSomething(requestParameters, callback) {
      setTimeout(() => {
        // 通过requestParameters异步操作获取到一些结果 这里只是简单模拟
        let res = requestParameters * 2;
        // 将结果传递给回调函数
        callback(res);
      }, 1000);
    }
    ```
    
    - `asyncGetSomething` 是一个异步函数，给它传递`requestParameters` （异步请求参数）和`callback` （请求完毕回调函数）
    - 使用`setTimeout` 函数模拟请求过程（在1秒后请求完成），`res` 是异步操作完毕后获得的请求响应，然后调用回调函数，把异步操作结果`res` 作为异步返回值传递，表示异步操作和后续的通知执行代码执行完成
- 之前的`double` 异步函数依照此方法变为
    
    ```jsx
    function double2(value, callback) {
      console.log(callback);
      setTimeout(() => callback(value * 2), 1000);
    }
    double2(3, (x) => console.log(`I was given: ${x}`)); // I was given: 6
    ```
    
    - 这里`setTimeout`调用（**invocation**）告诉JavaScript运行时在1000ms之后把一个函数推到消息队列上
    - 这个函数（callback）会由**运行时**（**runtime**）负责异步调度执行，而位于函数闭包中的回调及其参数在异步执行时仍是可用的

## 1.2.2 失败处理（Handling Failure）

- 异步操作的失败处理在**回调模型**（**callback model**）中也要考虑，因此就有了成功回调和失败回调，一般形式是通过`try…catch` 语句捕获可能的异步操作异常
    
    ```jsx
    function double(value, success, failure) {
      setTimeout(() => {
        try {
          if (typeof value !== "number") {
            throw "Must provide number as first arguments";
          }
          success(2 * value);
        } catch (error) {
          failure(error);
        }
      }, 1000);
    }
    
    const successCallback = (x) => console.log(`Success: ${x}`);
    const failureCallback = (e) => console.log(`Failure: ${e}`);
    
    double(3, successCallback, failureCallback); // Success: 6
    double("2", successCallback, failureCallback); // Failure: Must provide number as first arguments
    ```
    
    - 失败处理在以前的异步模式中也使用**回调模型**：将失败处理的函数作为一个回调传递给异步操作，异步操作捕获到错误时调用这个失败处理的回调函数，如果异步操作正常获取到想要的值，就可以像之前那样传递异步返回值并调用成功的回调函数
- 这种模式已经**不可取了**（**undesirable**），因为必须在初始化异步操作时定义回调，异步函数的返回值只在**短时间内存在**（**transient**）,只有预备好将这个短时间内存在的值作为参数的回调才能接收到它

## 1.2.3 嵌套异步回调（Nesting Asynchronous Callbacks）

- 如果异步返回值又依赖另一个异步返回值，那么回调的情况还会进一步边复杂。假设有异步操作A和异步操作B，异步操作B需要将异步操作A的返回值作为参数以获取异步操作B的返回值，所以情况就变成了A ⇒ A的异步返回值 ⇒ B ⇒ B的异步返回值
- 实现这种依赖需要嵌套回调，将A的返回值传递给异步操作B的回调函数
    
    ```jsx
    function double(value, success, failure) {
      setTimeout(() => {
        try {
          if (typeof value !== "number") {
            throw "Must provide number as first argument";
          }
          success(2 * value);
        } catch (error) {
          failure(error);
        }
      }, 1000);
    }
    
    const successCallback = (x) => {
      double(x, (y) => console.log(`Success: ${y}`));
    };
    
    const failureCallback = (e) => console.log(`Failure: ${e}`);
    
    double(3, successCallback, failureCallback); // Success: 12 (等待约2秒)
    ```
    
    - 这里的`successCallback` 就是异步函数B，它依赖`double()` 异步操作完毕后执行`success()` 回调传递值才能执行，且`successCallback` 被调用也是异步操作，它再次调用`double()` （另外一次调用）获取第二个异步返回值（12）
- 显然，随着代码越来越复杂，回调策略**是不具有扩展性的**（**not** **scale**）。“回调地狱”这个称号可谓实至名归，嵌套回调的代码维护起来就是噩梦