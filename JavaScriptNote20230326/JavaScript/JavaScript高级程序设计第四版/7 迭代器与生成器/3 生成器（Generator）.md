# 3 生成器（Generator）

生成器是ECMAScript 6新增的**极为灵活**的结构，拥有在一个函数块内暂停和恢复代码执行的能力；使用生成器可以**自定义迭代器和实现协程**

# 3.1 生成器基础

## 3.1.1 生成器的基本语法

- 生成器的形式就是一个函数，函数名称前面加一个星号（*****）表示它是一个生成器
    
    ```jsx
    function * generatorFun(argument) {
    	// 生成器相关代码
    }
    ```
    

## 3.1.2 生成器的使用原则

1. 只要可以**定义函数的地方**就可以定义生成器
2. 箭头函数**不能**用来定义生成器函数
3. 生成器可以使用**函数声明**，也可以使用生成器**函数表达式**声明
    
    ```jsx
    function * generatorFn() {} // 函数声明
    var generatorFn = function * () {} // 函数表达式
    ```
    
4. 生成器函数可以作为对象字面量的属性
    
    ```jsx
    let foo = {
    	* generatorFn() {},
    	gF: function * () {}
    }
    ```
    
5. 生成器函数可以作为类实例方法属性
    
    ```jsx
    class Foo {
    	* generatorFn() {
    		
    	}
    }
    ```
    
6. 生成器函数可以作为类静态方法属性
    
    ```jsx
    class Foo {
    	static * generatorFn() {
    		
    	}
    }
    ```
    
7. 标识生成器函数的星号不受两侧空格的影响（最好左右各一个空格）

## 3.1.3 生成器对象

- 调用生成器函数会产生一个**生成器对象（generator object）**
    - 实现了迭代器协议（Iterator 接口），具有`next()`方法
    - 初始处于**暂停执行**状态(**suspended**)
    - 执行`next()` **让生成器开始或恢复执行**，并返回和迭代器一样类型的返回值，有`done`属性和`value`属性，然后继续处于下一个暂停执行状态
- 函数体为空的生成器函数不会停留，调用一次`next()` 后就让生成器达到了`done:true` 的状态
    
    ```jsx
    const generatorFn = function* () {};
    let gt = generatorFn();
    console.log(gt); // Object [Generator] {}
    console.log(gt.next); // [Function, next]
    console.log(gt.next()); // { value: undefined, done: true }
    console.log(gt); // Object [Generator] {}
    ```
    
    - 上述的打印是node（v16.14.0）环境下的打印
    - 在浏览器（谷歌v100+）环境下的打印为
        
        ![Untitled](3%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88Generator%EF%BC%89/Untitled.png)
        
    - 可以发现，调用了一次`next()` 后，生成器对象的状态就转变为了`closed` ，这是[因为函数体为空的生成器函数不会停留](3%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88Generator%EF%BC%89.md)
    - `value`属性默认为`undefined`

### 3.1.3.1 生成器对象的返回值

- 生成器对象在最后可以使用`return`返回一个值，这个值会作为最后一个（`done` 为`true`时）`next()` 返回值的`value`属性值
    
    ```jsx
    const generatorFn2 = function* () {
      return "foo";
    };
    let gt2 = generatorFn2();
    console.log(gt2.next()); // { value: 'foo', done: true }
    console.log(gt2.next()); // { value: undefined, done: true }
    ```
    
    - 返回值只会作为生成器对象要关闭时调用的`next()` 返回的对象的`value`属性值

### 3.1.3.2 生成器函数中语句的执行

- 调用生成器函数生成生成器并不会执行生成器函数中的语句（处于暂停执行**suspended**状态）
- 生成器函数会在**初次**调用`next()` 方法后开始执行**一般**语句
    
    ```jsx
    const generatorFn3 = function* () {
      console.log("Executed on the first call of next()");
      return "foo";
    };
    let gt3 = generatorFn3();
    console.log(gt3.next()); // Executed on the first call of next()
    // { value: 'foo', done: true }
    console.log("上面是初次执行next的打印");
    console.log(gt3.next()); // { value: undefined, done: true }
    ```
    

### 3.1.3.3 生成器的自引用

- 生成器对象本身是可迭代对象，它实现了Iteratble 接口（可迭代协议），它默认的迭代器是自引用的
    
    ```jsx
    const gt4 = generatorFn3();
    const gt5 = gt4[Symbol.iterator]();
    console.log(gt4); // Object [Generator] {}
    console.log(gt5); // Object [Generator] {}
    console.log(gt4 === gt5); // true
    ```
    

# 3.2 yield语句

## 3.2.1 yield的基本使用

- `yield` 关键字能让生成器停止和开始执行，也是生成器最有用的地方
    - 生成器函数在遇到`yield`关键字之前会正常执行
    - 遇到这个关键字后，执行会停止,函数作用域的状态会被保留
    - 停止执行的生成器函数只能通过在生成器对象上调用`next()`方法来恢复执行
- `yield` 关键字有点像函数的**中间返回语句,**它生成的值出现在`next()` 方法返回的对象中
    - 但是通过`yield` 关键字退出的生成器函数会处在`done:false`状态
    - 而通过`return` 关键字退出的生成器函数会处于`done: true` 状态
- 语法
    
    ```jsx
    function * generatorFn() {
    	yield value1;
    	yield value2;
    	....
    	yield valuen;
    	return value;
    }
    ```
    
    - `valuex` 是作为一次`next()` 调用后的返回值的`value`属性
    - `next()` 调用后`done`为`false` 的次数就是`yield` 的个数
- 例子
    
    ```jsx
    function* generatorFn() {
      console.log("1");
      yield "foo";
      console.log("2");
      yield "bar";
      console.log("3");
      return "baz";
    }
    const gt1 = generatorFn();
    console.log(gt1.next());
    console.log(gt1.next());
    console.log(gt1.next());
    console.log(gt1.next());
    // 打印结果
    1
    { value: 'foo', done: false }
    2
    { value: 'bar', done: false }
    3
    { value: 'baz', done: true }
    { value: undefined, done: true }
    ```
    
    - 第一次调用`next()` 开始执行生成器函数，正常执行语句，打印出1，然后遇到`yield`语句，获取到**中间返回值，**执行停止，函数作用域状态被报错，生成器状态变为暂停执行（suspended）
    - 第二次调用`next()` 恢复执行生成器函数，正常执行语句，打印出2，然后遇到`yield`语句，获取到中间返回值，执行停止，函数作用域状态被报错，生成器状态变为暂停执行（suspended）
    - 第三次调用`next()` 恢复执行生成器函数，正常执行语句，打印出3，然后遇到`return`语句，获取到最终返回值，执行停止，函数被执行完毕，生成器状态变为关闭（closed）
    - 后续的`next()` 调用都会默认返回`{ value: undefined, done: true }` 因为生成器状态变为关闭，不能继续迭代可
- **注意：生成器函数内部的执行流程会针对每个生成器对象区分作用域，即在一个生成器对象上调用next()不会影响其它生成器**

## 3.2.2 yield语句规则

1. `yield`关键字**只能在生成器函数内部**使用，用在其它地方会抛出错误
2. `yield` 关键字不能定义在生成器函数的嵌套的非生成器函数中（必须直接位于生成器函数定义中），否则抛出语法错误
    
    ```jsx
    function * invalidGeneratorFn {
    	function a() {
    		yield;// 抛出语法错误
    	}
      (function b() {
    		yield;// 抛出语法错误
    	})(); // 即使是闭包也不行
    }
    ```
    

## 3.2.3 生成器对象作为可迭代对象(Iterable Object)

- 获取生成器对象后显式的调用`next()` 作用并不大
- 因为[实现了迭代器协议（Iterator 接口），具有`next()`方法](3%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88Generator%EF%BC%89.md) 所以生成器可以作为迭代器使用
- 又因为使用[闭包实现的迭代器本身实现了可迭代协议](2%20%E8%BF%AD%E4%BB%A3%E5%99%A8%E6%A8%A1%E5%BC%8F.md)（Iterable protocol），所以生成器可以作为可迭代对象使用
- 对于可迭代对象，它[**接受隐式调用其工厂函数**](2%20%E8%BF%AD%E4%BB%A3%E5%99%A8%E6%A8%A1%E5%BC%8F.md)的语言特性，使用起来会很方便，最典型的就是`for…of` 循环语句
    
    ```jsx
    function* generatorFn() {
      yield 1;
      yield 2;
      yield 4;
      yield 3;
      return 5;
    }
    for (const item of generatorFn()) {
      console.log(item); // 1 2 4 3
    }
    ```
    
- 因为生成器既可以作为迭代器使用，也可以作为可迭代对象使用
    - 所以在**自定义迭代对象**时，就可以直接声明一个生成器函数，用它来生成需要的可迭代对象
    - 相交于声明自定义类型，实现实例符号属性`Symbol.iertator` ，使用生成器函数更加便捷
- 例如，想要一个迭代指定次数（n）的迭代器，直接使用生成器函数配合循环语句就可以构造：
    
    ```jsx
    function* nGeneratorFn(n) {
      // 循环n次
      while (n--) {
        yield;
      }
    }
    for (const _ of nGeneratorFn(3)) {
      console.log("foo");
    }
    // 打印三次foo
    ```
    

## 3.2.4 使用yield实现输入和输出

- yield语句是有返回值的，其语法如下
    
    ```jsx
    rv = yield expression;
    ```
    
    - `rv` : `yield`语句会返回调用生成器的`next()` 时传递给`next()` 的值，如果没有传递给`next()` ，`rv`就是`undefined`
    - `expression`：该表达式的返回值会作为`next()` 返回值中的`value`属性值，默认就是`undefined`
- yield的输入和输出
    - 输入：上一次让生成器函数暂停的`yield`关键字会接收到本次调用传给`next()`方法的第一个值
    - 输出：本次生成器函数执行的环境可以使用上一个`yield`关键字返回的`rv` 即是通过本次调用`next()` 传递的值
- 例子：
    
    ```jsx
    function* inputAndOutPut(initial) {
      console.log(initial);
      let first = yield 1;
      console.log(
        "本语句是第二个next()调用时执行，第一次调用的next参数不会被使用，但上一个yield返回本次传递给next参数的值",
        first
      );
      let second = yield 2;
      console.log("本语句是第三个next(),第三个next的参数为", second);
      let third = yield 3;
      console.log("本语句是第四个next(),第四个next的参数为", third);
      return "foo";
    }
    const gt = inputAndOutPut("initial");
    console.log("------");
    console.log(gt.next("不会被使用的值"));
    console.log("------");
    
    console.log(gt.next("next2"));
    console.log("------");
    // 打印结果
    ------
    initial
    { value: 1, done: false }
    ------
    本语句是第二个next()调用时执行，第一次调用的next参数不会被使用，但上一个yield返回本次传递给next参数的值 next2
    { value: 2, done: false }
    ------
    本语句是第三个next(),第三个next的参数为 next3
    { value: 3, done: false }
    ------
    本语句是第四个next(),第四个next的参数为 next4
    { value: 'foo', done: true }
    ------
    ```
    
- **注意，**通过上面的例子可得知的一些事情
    1. 第一次调用`next()` 传入的值**不会**被使用，因为第一次调用为初始化，还没有上一个`yield` 语句，所以不会有传入的值
    2. 后面每次调用`next()` 传入的值都会被上一个`yield` 语句返回，如下语句
        
        `let first = yield 1;` 
        
        这是第一个`yield`语句，第一个`next()`执行到这里时**暂停执行**，获取到`yield`后的值作为返回值的`value` 属性值
        
        但是`first`此时还没被赋值，即这个语句只执行了了后半句，变成了`let first = rv;` ，`rv`此时的值为`undefined`
        
        执行第二个`next()` 语句时，从上次暂停执行的语句恢复执行，即执行已变成`let first = rv` 的语句
        
        假设第二个`next()` 传递的参数为`val` ,那么上一个`yield` 语句的返回值`rv` 就是`val` ，即执行`let first = val` 语句
        
        所以`first`就是第二次执行`next()` 传递给`next()`的参数值`val`
        
- 因为上一个`yield` 语句会返回本次`next()` 执行传递的参数值，所以可以同时用于输入输出，如下
    
    ```jsx
    function* gFn() {
      return yield "foo";
    }
    const gt2 = gFn();
    console.log(gt2.next()); // { value: 'foo', done: false }
    console.log(gt2.next("bar")); // { value: 'bar', done: true }
    ```
    
    - 同[注意](3%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88Generator%EF%BC%89.md)中的解释，这里只是把上一个`yield` 的返回值当作了最后一次`next()` 返回值中的`value`属性值
    - 而上一个`yield`的返回值就是本次`next()` 调用传递的值`bar`

## 3.2.5 使用生成器自定义迭代对象-计数器

- 在[3.2.3 生成器对象作为可迭代对象(Iterable Object)](3%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88Generator%EF%BC%89.md) 中，构造了一个可以生成指定迭代次数的可迭代对象的生成器函数
- 其实通过`yield` 构造的生成器函数生成的可迭代对象功能可以很强大
1. 无穷计数生成器函数：生成一个无穷计数的可迭代对象
    
    ```jsx
    function* generatorFn() {
      for (let i = 0; ; i++) {
        yield i;
      }
    }
    for (const item of generatorFn()) {
      console.log(item); // 0 - 100
      if (item == 100) {
        break; // 如果使用循环退出语句，会一直
      }
    }
    ```
    
2. 可以实现python中的`range()` 函数，指定开始索引，结束索引以及步数，然后在一个范围中进行迭代的可迭代对象
    
    ```jsx
    function* range(start = 0, end = 0, step = 1) {
      while (start < end) {
        yield start;
        start += step;
      }
    }
    for (const item of range(5, 9)) {
      console.log(item); //  5 6 7 8 
    }
    for (const item of range(7, 17, 3)) {
      console.log(item); // 7 10 13 16
    }
    ```
    
3. 可以实现python中的`zeros()` 函数，指定0的个数构造一个指定长度，全部填充0的可迭代对象，可用于初始化数组
    
    ```jsx
    function* zeros(n = 0) {
      while (n--) {
        yield 0;
      }
    }
    console.log(Array.from(zeros(5))); // [0,0,0,0,0]
    ```
    

# 3.3 yield * 语句

## 3.3.1 定义

- `yield *` 表达式用于**委托**（**delegate**）给另一个生成器或可迭代对象
- `yield *` 中的星号用于增强**yield**的行为，让它能够迭代一个可迭代对象，从而一次产出一个值
- 语法
    
    ```jsx
    yield * expression
    ```
    
    - `expression` 表达式返回一个可迭代对象
- 与生成器函数的星号类似，`yield`星号两侧的空格不受影响
- `**yield *`  实际上就是把可迭代对象序列化为一连串可以单独产出的值**，相当于在生成器函数中迭代可迭代对象，然后把`yield` 放到这个迭代循环里
    
    ```jsx
    function* generatorFn() {
      yield* [1, 2, 3];
    }
    function* generatorFn2() {
      for (const item of [1, 2, 3]) {
        yield item;
      }
    }
    for(const item of generatorFn()) {
      console.log(item);
    }
    for(const item of generatorFn2()) {
      console.log(item);
    }
    ```
    
    - `generatorFn`生成器函数和`generatorFn2` 生成器函数本质上是一样的
- 注意，和生成器函数一样，星号左右两侧的空格不影响行为

## 3.3.2 yield * 的返回值

- `yield *`  的默认返回值就是`undefined` ，不同于`yield` 的返回值依靠生成器的下一个`next()` 传入的值，`yield *`  的返回值依靠后面的`expression`
- 如果`expression` 是普通的迭代对象，例如数组，集合等，`yield *` 的返回值就是`undefined`
- 如果`expression` 是生成器函数产生的生成器，那么这个值就生成器函数的返回值：
    - 即`expression` 执行`next()` 返回`done:true` 时的`value`属性值
    - 当然这个值也有可能时`undefined` ，只要生成器函数不返回任何值
- 例子
    
    ```jsx
    function* generatorFn() {
      yield 1;
      yield 2;
      return "foo";
    }
    function* generatorFn2() {
      let first = yield* generatorFn();
      console.log("yield *的返回值：", first);
      yield first;
    }
    for (const item of generatorFn2()) {
      console.log("------");
      console.log(item);
      console.log("------");
    }
    // 打印结果
    ------
    1
    ------
    ------
    2
    ------
    yield *的返回值： foo
    ------
    foo
    ------
    ```
    
    - 一共迭代3次
    - `yield *` 的返回值是`generatorFn()` 执行完的返回值

## 3.3.3 yield * 实现递归算法

- 因为`yield *` 用于迭代一个可迭代对象，生成器函数产生的生成器也是一个可迭代对象，所以可以在声明生成器函数时，在`yield *` 后**调用自身**生成一个可迭代对象（生成器）
- 递归语法：
    
    ```jsx
    function * generatorFn(arg) {
    	// 递归迭代
    	yield * generatorFn(newArg);
    	// 退出条件
    	yield; // 通常有一个退出时的默认yield
    }
    ```
    
- 例子, 使用`yield *` 实现计数器
    
    ```jsx
    function* nTimes(n) {
      if (n > 0) {
        yield* nTimes(n - 1);
        yield n - 1;
      }
    }
    for (const item of nTimes(5)) {
      console.log(item); // 0 1 2 3 4
    }
    ```
    
    - 每个生成器首先会从新创建的生成器对象产出每个值，然后再产出一个整数
    - 结果就是生成器函数会递归地减少计数器值，并实例化另一个生成器对象
    - 从顶层来看，相当于创建了一个可迭代对象并返回递增的整数
- 图的[深度优先遍历(dfs)](https://www.notion.so/653ae62c0843418ab84653d39e2fd1f2)，可以使用`yield *` 递归算法实现
    - 图的节点类
        
        ```jsx
        class Node {
          constructor(id, neighbors = new Set()) {
            this.id = id;
            this.neighbors = neighbors;
          }
          connect(node) {
            if (node !== this) {
              this.neighbors.add(node);
              node.neighbors.add(this);
            }
          }
        }
        ```
        
    - 随机图
        
        ```jsx
        class RandomGraph {
          constructor(size) {
            this.size = size;
            this.nodes = new Set();
            // 创建节点
            for (let i = 0; i < size; i++) {
              this.nodes.add(new Node(i));
            }
            // 随机连接节点
            this.generateRandomGraph();
          }
          generateRandomGraph() {
            // 清空原始连接
            for (const node of this.nodes) {
              node.neighbors.clear();
            }
            // 随机连接点
            const threshold = 1 / this.size; // 两个点是否连接的固定值
            for (const nodea of this.nodes) {
              for (const nodeb of this.nodes) {
                if (Math.random() < threshold) {
                  nodea.connect(nodeb);
                }
              }
            }
          }
          toString() {
            // 打印成字符串的方法
            const prints = [];
            for (const node of this.nodes) {
              const ids = [...node.neighbors].map((n) => n.id).join(",");
              prints.push(`${node.id}:${ids}`);
            }
            return prints.join("\n");
          }
        }
        ```
        
    - 随机图是否连通的方法(放在图内部)
        
        ```jsx
        class RandomGraph {  
        	**isConnected() {
            const visited = new Set();
            function* traverse(nodes) {
              for (const node of nodes) {
                if (!visited.has(node)) {
                  // 没有就进行递归
                  yield node;
                  yield* traverse(node.neighbors);
                }
              }
            }
            // 获取第一个节点
            const firstNode = this.nodes[Symbol.iterator]().next().value;
            // 使用递归将已遍历到的节点入visited
            for (const node of traverse([firstNode])) {
              visited.add(node);
            }
            return visited.size === this.nodes.size;
          }**
        }
        ```
        
        - 这个方法巧妙地使用了`yield *` 递归节点
        - 每次遍历到一个新节点都作为迭代值弹出，然后添加到已访问节点(**visited**)中
        - 再进行递归迭代时，需要判断当前的node是否已被迭代过，没有就可以使用`yield *` 遍历它的邻居节点
    - 使用
        
        ```jsx
        const g = new RandomGraph(6);
        console.log(g.toString(), g.isConnected());
        g.generateRandomGraph();
        console.log(g.toString(), g.isConnected());
        g.generateRandomGraph();
        console.log(g.toString(), g.isConnected());
        // 可能的打印结果
        0:2
        1:4
        2:0,3,4
        3:2,5
        4:1,2
        5:3
         true
        0:5
        1:5,3
        2:5
        3:1
        4:
        5:0,1,2
         false
        0:3,4
        1:5,3
        2:4,5
        3:0,1
        4:2,0,5
        5:1,2,4
         true
        ```
        

# 3.4 生成器作为默认迭代器

- [因为[实现了迭代器协议（Iterator 接口），具有`next()`方法](3%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88Generator%EF%BC%89.md) 所以生成器可以作为迭代器使用](3%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88Generator%EF%BC%89.md)
- 而且生成器函数和默认迭代器调用后都产生迭代器，所以生成器格外适合作为默认迭代器
- 在声明一个可迭代对象的引用类型时，实现**可迭代协议**（**Iterable protocol**）就是赋予迭代器符号属性能产生迭代器的能力，即迭代器工厂函数，这个迭代器工厂函数适合使用生成器函数
- 例如
    
    ```jsx
    class Foo {
      constructor(values) {
        this.values = new Set(values);
      }
      add(val) {
        this.values.add(val);
        return this;
      }
      *[Symbol.iterator]() {
        yield* this.values;
      }
    }
    const foo = new Foo([1, 2, 3]).add(4).add(8);
    for (const item of foo) {
      console.log(item);
    }
    ```
    
    - `for…of` 循环调用默认迭代器产生一个生成器对象，生成器对象时可迭代的，所以可以当成迭代器使用

# 3.5 提前终止生成器

- 和迭代器类似，生成器也支持“可关闭”的概念
- 实现迭代器协议（Iterator 接口）的对象有`next(), return(), throw()` 方法
- 生成器也实现了迭代器协议，所以也有这三个方法
    
    ```jsx
    function* generatorFn() {
      yield 1;
      yield 2;
    }
    const gt = generatorFn();
    console.log(gt.next); 
    console.log(gt.throw);
    console.log(gt.return);
    ```
    
    - node环境（v16.14.0）打印
        
        ```jsx
        [Function: next]
        [Function: throw]
        [Function: return]
        ```
        
    - 浏览器环境打印（谷歌浏览器v100+）
        
        ```jsx
        ƒ next() { [native code] }
        ƒ throw() { [native code] }
        ƒ return() { [native code] }
        ```
        
- `return()`和`throw()` 都能强制生成器进入关闭状态

## 3.5.1 `Generator.prototype.return()`

- return()方法强制生成器进入关闭状态，提供给`return()`方法的值就是终止迭代器对象的值
- 与迭代器不同的是，所有生成器都有`return()` 方法，只要通过它进入了**关闭状态**（closed）就无法恢复了，后续调用`next()`会显示`done: true` 状态

### 3.5.1.1 显示调用

- 通过生成器显示调用：
    
    ```jsx
    function* range(start, end) {
      while (start < end) {
        yield start;
        start++;
      }
    }
    const gt = range(1, 8);
    console.log(gt); // range {<suspended>}
    console.log(gt.next()); // { value: 1, done: false }
    console.log(gt.next()); // { value: 2, done: false }
    console.log(gt.next()); // { value: 3, done: false }
    console.log(gt.return(4)); // { value: 4, done: true }
    console.log(gt.return(5)); // { value: 5, done: true }
    console.log(gt.next()); // { value: undefined, done: true }
    console.log(gt.next()); // { value: undefined, done: true }
    console.log(gt); // range {<closed>}
    ```
    
    - 可以看到在调用`return()` 后，生成器直接进入关闭状态，再次调用`next()` 已经无法获取序列中的值

### 3.5.1.2 隐式调用

- 和迭代器一样，`return()` 在数组解构语法和`for…of` 循环中如果不迭代完毕生成器中的所有元素，会调用其`return()` 方法
    
    ```jsx
    const gt2 = range(2, 6); // 使用上面定义的生成器函数
    const [a, b] = gt2;
    console.log(gt2); // range {<closed>}
    console.log(gt2.next()); // { value: undefined, done: true }
    
    const gt3 = range(3, 8);
    for (const item of gt3) {
      console.log(item); // 3 4 5
      if (item == 5) {
        break;
      }
    }
    console.log(gt3); // range {<closed>}
    console.log(gt3.next()); // {value: undefined, done: true}
    ```
    
    - 生成器的`return()` 方法比自定义的迭代器更严格，进入关闭状态后就无法再迭代了
- 如果再`for…of` 循环中途直接显示调用`return()` 达到的效果和使用`break;` 语句是一样的，唯一区别是调用return()后本轮循环的后续语句会执行完毕再退出循环
    
    ```jsx
    const gt4 = range(3, 8);
    for (const item of gt4) {
      console.log(item); // 3 4 5
      if (item == 5) {
        gt4.return();
        console.log("后续语句"); // 会被执行
      }
    }
    console.log(gt4); // range {<closed>}
    console.log(gt4.next()); // {value: undefined, done: true}
    ```
    

## 3.5.2 `Generator.prototype.throw()`

- 传入一个错误，`throw()` 方法被调用在暂停状态将这个错误注入到生成器对象，如果错误未被处，生成器就会被关闭
    
    ```jsx
    const range = function* (start, end) {
      while (start < end) {
        yield start;
        start++;
      }
    };
    const gt = range(1, 6);
    gt.next();
    console.log(gt); // range {<suspended>}
    try {
      gt.throw("抛出错误");
    } catch (error) {
      console.log(error); // 抛出错误
    }
    console.log(gt); // range {<closed>}
    console.log(gt.next()); // {value: undefined, done: true}
    ```
    
- 如果生成器函数内部处理了这个错误，那么生成器就不会关闭，而且可以恢复执行，但是错误处理会跳过本轮的`yeild` 即跳过序列中的一个值
    
    ```jsx
    const range2 = function* (start, end) {
      while (start++ < end) {
        try {
          yield start;
        } catch (error) {
          console.log(error); // 抛出错误
        }
      }
    };
    const gt2 = range2(2, 7);
    console.log(gt2); // range2 {<suspended>}
    gt2.next();
    gt2.throw("抛出错误"); 
    console.log(gt2); // range2 {<suspended>}
    console.log(gt2.next()); // {value: 5, done: false}
    ```
    
    - `gt2.throw("抛出错误");`  向生成器对象内部注入一个错误，这个错误会被`yield`关键字抛出
    - 因为错误在生成器函数的try/catch块中被捕获，生成器不会被关闭，只是跑本次抛出错误的`yield` 语句不会产出值 `4`
- **注意**
    - 如果生成器对象还没有开始执行，那么调用throw()抛出的错误不会在生成器函数内部被捕获，因为这相当于在函数块外部抛出了错误
        
        ```jsx
        const gt3 = range2(2, 7);
        gt3.throw("直接报错");
        ```