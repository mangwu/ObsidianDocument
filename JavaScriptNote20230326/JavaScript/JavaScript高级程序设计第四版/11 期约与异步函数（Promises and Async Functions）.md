# 11. 期约与异步函数（Promises and Async Functions）

本章内容

- [ ]  **异步编程**（**Asynchronous Programming**）
- [ ]  **期约**（**Promises**）
- [ ]  **异步函数** （**Async Functions**）

ES6及之后的几个版本逐步加大了对**异步编程机制**（**asynchronous behavior**）的支持

ES6新增正式的`Promise`（期约）引用类型，支持**优雅地定义和组织**（**elegant definition and organization**）**异步逻辑**（**asynchronous behavior**）

接下来几个版本增加了`async`和`await` 关键字定义异步函数的机制

<aside>
💡 注意：本章示例将大量使用异步日志输出方式 `setTimeout(console.log, 0, …params)`, 旨在演示执行顺序及其其它异步行为。异步输出的内容虽然像是同步输出的，但实际上是异步打印的。这样可以让期约等返回的值达到其最终状态。（如果要模拟开发时的异步输出，需要起后台服务，通过http网络请求<第24章内容>感受真正的异步）
除此之外，浏览器控制台的输出经常能打印出JavaScript运行时中无法获取的对象的信息（比如期约的状态），这个特性在示例中广泛使用，以便理解相关概念

</aside>

# 1. 异步编程（Asynchronous Programming）

- **同步行为**（**synchronous behavior**）和**异步行为**（**asynchronous behavior**）的**对立统一**（**duality， 二象性**）是计算机科学中一个**基础概念**（**fundamental concept**），尤其像JavaScript这种**单线程事件循环模型**（**single-threaded event loop model**）中语言中，同步行为和异步行为更是需要理解的基础概念
    - 同步行为：之前章节学习的所有例子都是同步行为，即按照代码顺序从上到下开始解释执行（代码提升也仅仅是在提升后按顺序执行，仍然属于同步行为）
    - 异步行为：异步行为**承担**（**is borne out of**）了因**高吞吐量计算**（**higher computational throughput**）而**高延迟**（**high-latency**）的操作的 **优化**（**optimize**）需求；它的核心在于，如果在等待其它操作完成的同时，即使运行其它**指令**（**instructions**），系统也能保持稳定，那么这样做就是务实的
- 更进一步，**异步操作**（**asynchronous operations**）不一定只能在计算量**密集**（**intensive**）而导致高延迟中使用；只要你不想为等待某个操作而**阻塞线程执行**（**block a thread of execution**），那么任何时候都可以使用（）

[1. 异步编程（Asynchronous Programming）](11%20%E6%9C%9F%E7%BA%A6%E4%B8%8E%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88Promises%20and%20Async%20Functions%EF%BC%89/1%20%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B%EF%BC%88Asynchronous%20Programming%EF%BC%89.md)

# 2. 期约（Promise）

[2. 期约（Promise）](11%20%E6%9C%9F%E7%BA%A6%E4%B8%8E%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88Promises%20and%20Async%20Functions%EF%BC%89/2%20%E6%9C%9F%E7%BA%A6%EF%BC%88Promise%EF%BC%89.md)

# 3. 异步函数（Async Functions）

[3. 异步函数（ASYNC FUNCTIONS）](11%20%E6%9C%9F%E7%BA%A6%E4%B8%8E%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88Promises%20and%20Async%20Functions%EF%BC%89/3%20%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%EF%BC%88ASYNC%20FUNCTIONS%EF%BC%89.md)

# 4. 小结（Summary）

1. **单线程**（**single-threaded**）的JavaScript运行时
    - 长期依赖，因为JavaScript运行时单线程的特性，实现异步行为是一项艰巨的任务
    - 随着ES6的期约和ES7的异步函数等特性的增加，ECMAScript的异步编程特性有了长足的进步
    - 通过期约和async/await，不仅可以实现之前难以实现或不可能实现的任务，还能清晰、简洁的写出容易理解调试的代码
2. 期约的主要功能是为异步代码提供了**清晰的抽象**（**clean abstraction**）
    - 可以用期约表示异步执行的代码块
    - 可以用期约表示异步计算的值
    - 在串行异步代码时，期约没有以前异步编程模式的回调地狱问题
    - 作为可塑性极强的一种结构，期约可以被序列化，连锁使用，复合，扩展和重组
3. 异步函数是将**期约范式**（**promise paradigm**）应用于JavaScript函数的结果
    - 异步函数可以暂停执行，而不阻塞主线程
    - 基于期约的代码和组织串行或平行执行的异步代码，都能使用异步函数轻松完成
    - 异步函数是现代JavaScript工具箱中最重要的工具之一