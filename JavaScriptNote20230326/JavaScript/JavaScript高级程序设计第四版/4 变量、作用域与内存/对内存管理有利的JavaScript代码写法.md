# 对内存管理有利的JavaScript代码写法

开发者的代码风格和写法对JavaScript引擎的内存管理是有影响的，好的影响包括性能优化，提升运行速度，坏的影响可导致内存泄漏

# 1. 通过const和let声明提升性能

## 描述

- ES6新增的这两个声明关键字声明的变量都是块作用域的
- 相比于var声明的函数作用域变量，**块作用域变量可能会更早地让垃圾回收程序介入**

## 原理

- 在块作用域，如条件语句，循环语句中
    - 使用const和let声明地变量是局部变量
    - 是var声明地变量不是局部变量
- 在退出块作用域的上下文后
    - 其中的局部变量被销毁，无法再访问到
    - var声明的变量在父作用域仍然可以访问到
    - 垃圾回收程序会优先回收let和const声明的局部变量
- 本质上是因为
    - var声明的变量在块作用域中不会挂载到块的上下文变量对象中
    - 而是挂载到父函数上下文或全局上下文的变量对象中
    - 而let和const声明的变量仅进入当前上下文中
    - 块执行完毕后，上下文变更，let和const声明的变量不存在作用域链中的任何上下文的变量对象中，而var声明的变量仍然存在于某一函数上下文或全局上下文的变量对象中
    - 垃圾回层序标记所有存在内存中的变量值，去除当前作用域链中所有上下文的变量对象中的变量的标记，剩下有标记的被清除（包括上下文变更前声明的局部变量值）

# 2. 隐藏类和删除操作

## 描述

- 关于隐藏类可以查看如下专栏
    
    [V8中的隐藏类（Hidden Classes）和内联缓存（Inline Caching）](https://zhuanlan.zhihu.com/p/469962133)
    
    [隐藏类和内联缓存](%E5%AF%B9%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E6%9C%89%E5%88%A9%E7%9A%84JavaScript%E4%BB%A3%E7%A0%81%E5%86%99%E6%B3%95/%E9%9A%90%E8%97%8F%E7%B1%BB%E5%92%8C%E5%86%85%E8%81%94%E7%BC%93%E5%AD%98.md)
    
- 隐藏类是V8为了优化对象属性读取速率而提出的解决方案
- V8在JavaScript运行期间将所有对象和隐藏类关联起来，跟踪对象属性的特征
- **能够共享相同隐藏类的对象性能会更好，**针对这种情况V8能通过内联缓存继续进行优化

## 尽量书写隐藏类相同的对象

- 因为对象共享隐藏类能提高效率，所以在书写代码时应该**尽量保持相同类型的对象具有同样的隐藏类**

### 错误的写法

1. 随意增加属性
    
    ```jsx
    // 谷歌浏览器V8引擎，确保相同类型对象共享相同的隐藏类
    function Article() {
      this.title = "Computer";
    }
    let a1 = new Article();
    let a2 = new Article();
    // 此时a1和a2有相同的隐藏类
    
    ~~a1.author = "Jake";~~
    // a1关联的隐藏类变化，不利于V8读取属性时的优化
    ```
    
    - 尽量保证类的属性完整
2. 使用delete随意删除属性
    
    ```jsx
    // 谷歌浏览器V8引擎，确保相同类型对象共享相同的隐藏类
    function Article() {
      this.title = "Computer";
    	this.author = "Jake";
    }
    let a1 = new Article();
    let a2 = new Article();
    // 此时a1和a2有相同的隐藏类
    
    ~~delete a1.author;~~
    // a1和a2有不同的隐藏类
    ```
    
    - 动态删除属性和动态添加属性导致的后果一样

### 解决方法

- 尽量保证类的属性完整，不需要额外添加太多属性
- 把不想要的属性设置为null，保证隐藏类不变，同时也能达到删除引用值公垃圾回收程序处理的效果
    
    ```jsx
    class Article {
      constructor(title = "Computer", author = "Jake") {
        **this.title = title;
        this.author = author;**
      }
    }
    let a1 = new Article();
    let a2 = new Article("KKK", "Mangwu");
    // 两个实例关联相同隐藏类，可以带来潜在的性能提升
    
    // 删除属性不要使用delete，将数值值设置为null即可
    **a1.title = null;**
    ```
    

# 3. 内存泄漏

内存泄漏不仅涉及到内存管理的问题，还涉及到安全的问题

## 描述

- 写不好的JavaScript代码不仅不会提高内存管理的性能，反而会造成内存泄漏的问题

- 内存泄漏通常指在**内存有限**的设备上，存储着一些**不使用的变量值**，但这些变量值因为代码写法的问题**一直保留在内存中**无法被垃圾回收程序回收，一旦这些变量值过多，程序运行占用的内存变少，如果分配给程序的内存无法满足程序运行条件，就会导致内存泄漏，而那些无用的变量值就是导致内存泄漏的原因之一
- JavaScript中的内存泄漏大部分都是由**不合理的引用**导致的（声明了但不使用的变量引用，一直存在于内存中）

## 容易导致内存泄漏的写法

### 意外声明全局变量

```jsx
function setName() {
	name = "Jake";
}
```

- 如果不是有意在函数中省略var关键字，那么这种写法相当于意外声明了一个全局变量name
- 在浏览器环境中，变量name会被当作window的属性来创建，只要window本身不被清理，name就不会被清理

### 异步定时器

```jsx
let name = "Jake"
setInterval(() => {
	console.log(name);
}, 100);
```

- 只要定时器一直运行，回调函数中引用的name变量就一直占用内存
- 所以垃圾回收程序不会清理掉name，如果回调函数使用的外部变量过多，占用内存大，则可能产生内存泄漏

### JavaScript闭包

```jsx
let outer = function() {
	let name = "function";
	return function () {
		return name;
	}
}
```

- 调用`outer()` 会导致分配给name的内存被泄漏
- 以上代码之后后会创建一个闭包，只要outer调用返回的函数存在，垃圾回收程序就不能清理name，因为闭包一直引用name
- 假设name的内容很大，那就会造成问题

# 4. 静态分配与对象池

## 描述

- 所谓的静态分配实际上就是尽量每次需要一个对象时，不是新建开辟内存空间，而是利用已有的同类型对象来复用
- 这样做的好处在于充分压榨浏览器，减少浏览器执行垃圾回收的次数，提升运行速度
- 开发者不能直接控制什么时候开始进行内存回收，但是可以通过静态分配的策略间接控制触发垃圾回收的条件
- 如果合理使用分配的内存，避免多余的垃圾回收就可以保证因释放内存而损失的性能

## 对象池

### 活跃对象

- 之前提到过，V8会根据活跃对象和余量判断是否进行垃圾回收
    
    
    > “在一次完整的垃圾回收后，V8的**堆增长策略**会根据**活跃对象的数量外加一些余量**来确定何时再次垃圾回收。“
    > 
- 所以频繁新建对象，再离开作用域后又被标记为可清理对象（对象更替速度快）
    - 浏览器就可能采用更激进的方式调度垃圾回收程序
    - 频繁的垃圾程序运行又会影响性能
- 例如：在函数中新建对象，如果新建对象声明周期很短，那么**多次调用函数就会导致对象更替速度变快**
    
    ```jsx
    class Vector {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      toString() {
        return `(${this.x}, ${this.y})`;
      }
    }
    
    const a = new Vector(0, 0);
    const b = new Vector(0, 0);
    
    **function addVector(a, b) {
      const resV = new Vector();
      resV.x = a.x + b.x;
      resV.y = a.y + b.y;
      console.log(resV.toString());
      return resV;
    }**
    
    for (let i = 0; i < 20; i++) {
      a.x = i % 8;
      a.y = Math.floor(i ** 2 / ((i % 7) + 1));
      b.x = i;
      b.y = i * 2 + 1;
      addVector(a, b);
    }
    ```
    
    - 调用addVector函数，会在堆上创建新矢量对象，然后修改返回
    - 使用循环语句设置a，b的矢量值，然后传递给addVector函数
    - 每次函数执行完毕后，创建返回的vector对象就会被回收，因为是块作用域，声明周期很短
    - 这样会导致垃圾回收频繁，性能损耗过大

### 解决方案

- 不要每次都创建一个Vector对象，而是使用一个已有的矢量对象
    
    ```jsx
    function addVector**(a, b, resV)** {
      resV.x = a.x + b.x;
      resV.y = a.y + b.y;
      console.log(resV.toString());
      return resV;
    }
    ```
    
- 但是如果每次调用addVector时仍然新建一个矢量对象然后传入参数中，这个函数行为没变，仍然会被垃圾回收程序察觉
- 需要确定在哪里创建矢量可以不让垃圾回收程序盯上

### 对象池策略

- 为了尽可能复用已创建对象，可以使用对象池
- 初始化时，创建一个对象池，用来管理一组可回收的对象
- 应用程序可以向对象池请求对象、设置属性、然后使用，操作完成后还给对象池
    - 没有发生对象初始化，垃圾回收探测就不会频繁运行

**对象池分类**

- 对象池可以初始时就创建一组对象，使用固定的对象数
- 对象池也可以按需分配，在对象不存在时创建新的，如果有对象就复用存在的
    - 本质上是贪婪算法
    - 有单调的增长但为静态的内存
    - 可以使用数组实现
    
    ```jsx
    /**
     * @class VectorPool
     */
    class VectorPool {
      /**
       * @description 构造函数
       */
      constructor() {
        // 使用循环队列管理对象池
        this.vectorList = new Array(30).fill(null);
        this.low = 0; // 指向队首
        this.high = 0; // 指向队尾
        this.cur = 0;
        this.createNum = 0;
      }
      /**
       * @description 从对象池中捞取对象
       * @returns {Vector|Boolean}
       */
      allocate() {
        // 队首出队，如果没有就新建一个
        if (this.cur == 0) {
          if (this.createNum < 30) {
            // 容量判断
            this.createNum++;
            return new Vector();
          } else {
            console.log("超出创建容量");
            return false;
          }
        } else {
          this.cur--;
          // 返回队首对象
          let ans = this.vectorList[this.low];
          this.vectorList[this.low] = null;
          // 注意数组容量
          this.low++;
          this.low = this.low % 30;
          return ans;
        }
      }
      /**
       * @description 回收矢量对象
       * @param {Vector} v 矢量对象
       * @returns {Boolean}
       */
      free(v) {
        if (this.cur == 30) {
          return false;
        }
        this.cur++;
        this.vectorList[this.high] = v;
        this.high++;
        this.high = this.high % 30;
        return true;
      }
    }
    
    const vp = new VectorPool();
    ```
    
    - 上述本质上是一个循环队列
    - 由于数组大小是动态可变的，为了避免因为push造成数组大小改变，需要在初始化时给定一个大小够用的数组，从而避免先删除再创建的操作，进一步避免额外的垃圾回收

## 注意

- 静态分配和对象池考虑的是对象复用问题，避免频繁的垃圾回收导致性能倒退
- 实际情况下，不一定需要静态分配和对象池，因为创建对象池也需要额外性能消耗
- 只有当应用程序需要大量相同对象时，使用对象池才会有优化效果，这种过早优化是程序开发在极端形式下的解决方案