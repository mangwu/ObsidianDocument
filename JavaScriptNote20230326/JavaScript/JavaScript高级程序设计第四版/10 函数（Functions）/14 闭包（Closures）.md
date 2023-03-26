# 14. 闭包（Closures）

# 14.1 闭包

## 14.1.1 定义

- **匿名函数**（**anonymous functions**）常被人误认为是**闭包**（**closure**），闭包实际上是那些**引用了**（**have access to**）另外一个**函数作用域**（**function’s scope**）中的变量的函数，通常在嵌套函数（creating a function inside a function）中**实现**（**accomplished**）
- 在[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)中，闭包是一个与**周边环境状态**【**surrounding state（the lexical environment ，词法环境）**】中的引用（**references**）**捆绑在一起**（**bundled together**）的**函数组合**（**the combination of a function**）
- 这两种定义都表明闭包的两个特性
    - 闭包本质上是一个函数
    - 这个函数引用不属于它作用域的（通常为另外一个函数作用域的）变量

---

- **例子：**在之前的函数作为返回值中实际上声明的一个创建比较函数的函数，其返回的匿名函数就是一个闭包，因为这个匿名函数引用了外部函数作用域中的`prop`参数，如下
    
    ```jsx
    function createComparisionFunction(prop) {
      return function (a, b) {
        **let v1 = a[prop];**
        **let v2 = b[prop];**
        if (v1 < v2) {
          return -1;
        } else if (v1 > v2) {
          return 1;
        } else {
          return 0;
        }
      };
    }
    ```
    
    - 黄色背景的代码位于内部函数（匿名函数）中，它**引用着**（**accessing**）外部函数的变量`prop`
    - 即使这个内部函数被返回并在其它地方使用，它仍然**引用着**（**accessing**）那个变量
    - 要理解为何这个匿名函数能一直引用`prop` ，需要思考当第一次调用这个函数（`createComparisonFunction()`）时会发生什么

## 14.1.2 理解闭包

- 在[4. 变量、作用域与内存](../4%20%E5%8F%98%E9%87%8F%E3%80%81%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8E%E5%86%85%E5%AD%98.md) 中介绍过**作用域链**（**scope chain**）的概念，理解**作用域链的创建和使用细节**对理解闭包非常重要
- 在调用函数过程中，作用域链的创建细节如下
    1. 在调用一个函数时，会为这个函数调用创建一个**执行上下文**（**execution context**），并且函数的作用域链也被创建。
    2. 然后用一个`arguments` 和其它命名参数来初始化这个函数的**活动对象**（**activation object**）。
    3. 外部函数的活动对象是内部函数作用域链上的第二个对象（内部函数作用域链上的第一个对象是它自身的活动对象）
    4. 内部函数作用域链（`process`）一直向外串起了所有包含函数的活动对象，**直到**（**terminates**）全局执行上下文才终止。
- 在函数执行过程中，要从作用域链中查找变量，以便读、写值
    
    ```jsx
    function compare(value1, value2) {
      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    }
    let result = compare(5, 10);
    ```
    
    - 这里定义的`compare()` 是在**全局上下文**(**global execution context**)中调用的
    - **第一次**调用`compare()` 会为它创建一个包含`arguments`、`value1`、`value2`的**活动对象**（**activation object**）
    - 而**全局上下文的变量对象**（**global context’s variable object**）则是`compare()` 作用域链上的第二个对象，其中至少包含`this`， `result`和`compare`
    - 作用域链和执行上下文关系如下
        
        ![scope chain.png](14%20%E9%97%AD%E5%8C%85%EF%BC%88Closures%EF%BC%89/scope_chain.png)
        
- 在函数执行的幕后（behind），每个执行上下文都会有一个**包含其中变量**（**represents the variables**）的对象
    - 全局上下文（**global context**）中叫**变量对象**（**variables object**），它会在代码执行期间始终存在
    - 而函数局部上下文中叫**活动对象**（**activation object**），只在函数执行期间存在（例如`compare()` 函数）
- 在定义`compare()` 函数时，就会创建作用域链，**预装载（preloaded）**全局**变量对象**（**variables object**），并保存在函数对象**内部**（**internal**）的[[Scope]]属性中
    - 在调用这个函数时，会创建相应的执行上下文
    - 然后通过复制函数的[[Scope]]属性来**构建**（**built up**）其作用域链
    - 接着会创建函数的**活动对象（activation object，**用作局部的变量对象**）**将其推入到（**pushed to**）作用域链的**前端**（**front**）
    
    ---
    
    - 在这个的例子，这意味着`compare()` 函数执行上下文的作用域链中有两个变量对象：**局部**（**local**）变量对象和**全局**（**global**）变量对象
- 作用域链实际上是一个包含指针（**pointers**）的列表，每个指针分别指向一个变量对象，但在物理上并不会包含相应的对象
- 函数内部的代码在**访问**（**accessed**）变量时，就会使用给定的名称从作用域链中查找变量；一旦函数指向完毕，局部的活动对象（函数的局部变量对象）会被销毁，内存中就只剩下全局作用域，不过**闭包就不一样**了

---

- 回到`[createComparisionFunction()](14%20%E9%97%AD%E5%8C%85%EF%BC%88Closures%EF%BC%89.md)`这个例子中，在一个函数内部定义的函数会把**其包含函数**（**containing function**）的活动对象添加到自己的作用域链中；因此`createComparisionFunction()` 函数中的匿名函数的作用域链实际上包含`createComparisionFunction()` 的活动对象，执行如下语句
    
    ```jsx
    let compare = createComparisionFunction("name");
    let result = compare({name: 'Nicholas'}, {name: 'Matt'})
    ```
    
    - 执行完毕后，会得到一个匿名函数的执行上下文及其作用域链，其关系和`createComparisionFunction()` 函数的上下文及其作用域链的关系图如下
        
        ![Frame 2.png](14%20%E9%97%AD%E5%8C%85%EF%BC%88Closures%EF%BC%89/Frame_2.png)
        
    - 在`createComparisionFunction()` 函数返回匿名函数后，它的作用域链被初始化为包含`createComparisionFunction()` 的活动对象和全局变量对象，这一匿名函数就可以访问到`createComparisionFunction()` 函数可以访问到的所有变量
    - 另外一个**副作用**（**effect**）是`createComparisionFunction()` 的活动对象并不能在它执行完毕后被销毁，因为匿名函数的作用域链中仍然有对它的活动对象的引用
- 虽然`createComparisionFunction()` 执行完毕后，其执行上下文的作用域链会被销毁，但是它的活动对象仍然会保留（remain）在内存中，直到匿名函数被销毁
    
    ```jsx
    // 创建比较函数
    let compareNames = createComparisionFunction("name");
    // 调用函数
    let result = compareNames({ name: "Nicholas" }, { name: "Matt" });
    // 销毁compare才会使得createComparisionFunction的活动对象在内存中被释放
    compareNames = null;
    ```
    
    - 比较函数被保存在变量`compareNames`中（仍然是匿名函数），把它设置为`null` 等价于解除对匿名函数的引用，从而让垃圾回收程序可以将匿名函数所在内存释放
    - 更进一步，匿名函数的作用域链也会被销毁，而作用域链中引用的`createComparisionFunction()` 函数的活动对象因为失去引用也会被安全销毁

<aside>
💡 注意：因为闭包会**保留**（**carry with**）它们包含（**containing**）函数的作用域，所以比其它函数更占用内存。**过度使用**（**Overuse**）闭包可能导致**内存过度占用**(**excess memory consumption**)，因此建议在十分必要的时候才使用闭包。V8等优化的JavaScript引擎会努力回收被闭包困住的内存，不过还是希望建议在使用闭包时要谨慎

</aside>

# 14.2 闭包中的this对象

- 在闭包中使用`this` 会让代码变的复杂，因为在标准函数中`this` 拥有**运行时绑定**的特性，开发者无法确定闭包中的`this` 在**未来**会指向哪个对象，如果不指定调用对象，而是直接调用生成的匿名函数，`this` 一般就是默认的全局对象（严格模式下为`undefined`）
- 现在来看这个例子，它在一个对象中定义了一个生成函数的方法
    
    ```jsx
    globalThis.identity = "The Global Object";
    
    let obj = {
      identity: "My Object",
      createIdentityFunction() {
        **return function () {
          return this.identity;
        };**
      },
    };
    console.log(obj.createIdentityFunction()()); // The Global Object
    ```
    
    - 从闭包的角度看，匿名函数引用了`createIdentityFunction()` 的`this` ，为什么匿名函数没有使用其包含作用域（`createIdentityFunction()`）的`this`对象呢？
- 实际上，第[9. 函数内部（Function Internals）](9%20%E5%87%BD%E6%95%B0%E5%86%85%E9%83%A8%EF%BC%88Function%20Internals%EF%BC%89.md) 节的第一句话就能解释这个问题：
    
    
    在ES5标准中，函数内部存在两个特殊的对象：`arguments` 和`this` ，ES6又新增了`new.target`属性（关于这个在第八章时就介绍过[new.target](../8%20%E5%AF%B9%E8%B1%A1%E3%80%81%E7%B1%BB%E4%B8%8E%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/4%20%E7%B1%BB/new%20target.md) ）
    
    - 每个函数在被调用时都会自动创建两个特殊变量：`this`和`arguments`
    - **内部函数永远不可能直接访问外部函数的这两个变量**
    
    ---
    
    - 对于箭头函数而言，因为它**不具有**运行时绑定的特性，而是定义时绑定最近上下文中的`this` （这点和闭包很像）
    - 所以上述的匿名函数替换为箭头函数打印的就是`My Object` 了
- 虽然内部的标准函数不能访问待外部函数的`this` ，但是以闭包的观点，内部的标准函数可以访问到其它任何定义在外部函数的变量，那么**把`this`保存到一个变量中，**那么内部函数就可以通过这个变量间接访问到外部函数的`this`了！通常可以在外部函数中定义一个`that` 变量供内部函数使用，如下
    
    ```jsx
    let obj3 = {
      identity: "My Object",
      createIdentityFunction() {
        **let that = this;**
        return function () {
          **return that.identity;**
        };
      },
    };
    console.log(obj3.createIdentityFunction()()); // My Object
    ```
    
    - 在定义匿名函数前，先把外部函数的`this` 保存到变量`that`中，然后定义闭包时，就可以让它访问`that` ，因为这是包含函数（外部函数）中名称没有任何冲突的一个变量
    - 即使外部函数返回后，`that` 仍然指向`obj3` ，所以 **`return that.identity;`** 自然返回My Object
    
    <aside>
    💡 注意：`this` 和`arguments` 都是不能直接在内部函数中访问的，如果想要访问包含作用域中的arguments对象，则同样需要将其引用先保存到闭包能访问到的另一个变量中
    
    </aside>
    

---

- 另一个解决方案是使用箭头函数，因为箭头函数的`this` 值默认绑定定义时最近上下文中的`this`
    
    ```jsx
    let obj2 = {
      identity: "My Object",
      createIdentityFunction() {
        return () => {
          return this.identity;
        };
      },
    };
    console.log(obj2.createIdentityFunction()()); // My Object
    ```
    

---

- 关于`this` 值更深层次的理解可以查看[this操作符](../../JavaScript%E5%B0%8F%E8%AE%A1/this%E6%93%8D%E4%BD%9C%E7%AC%A6.md) ，除此之外，还有几种调用方法时`this` 的期待可能有所变化的例子
    
    ```jsx
    let obj4 = {
      identity: "My Object",
      getIdentity() {
          return this.identity;
      },
    };
    console.log(obj4.getIdentity()); // My Object
    console.log((obj4.getIdentity)()); // My Object
    console.log((obj4.getIdentity = obj4.getIdentity)()); // The Global Object
    ```
    
    - `obj4.getIdentity()` 正常调用，`this` 运行时绑定`obj4` 所以打印`obj4.identity`
    - `(obj4.getIdentity)()` 调用时将方法放在括号中，虽然加了括号之后就好像是对一个函数的直接引用，但`this` 值仍然没有变，因为按照规范`(obj4.getIdentity)` 和`obj4.getIdentity` 是相等的
    - `(obj4.getIdentity = obj4.getIdentity)()` 这一次是执行了一次赋值，再调用赋值后的结果，因为赋值表达式的值是函数本身，`this` 值不再与任何对象绑定，默认是全局对象，所以打印`The Global Object`

# 14.3 内存泄漏（Memory Leaks）

- 在第4章的内存管理节中有关于[3. 内存泄漏](../4%20%E5%8F%98%E9%87%8F%E3%80%81%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8E%E5%86%85%E5%AD%98/%E5%AF%B9%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E6%9C%89%E5%88%A9%E7%9A%84JavaScript%E4%BB%A3%E7%A0%81%E5%86%99%E6%B3%95.md) 中介绍过内存泄漏：
    
    
    - 内存泄漏通常指在**内存有限**的设备上，存储着一些**不使用的变量值**，但这些变量值因为代码写法的问题**一直保留在内存中**无法被垃圾回收程序回收，一旦这些变量值过多，程序运行占用的内存变少，如果分配给程序的内存无法满足程序运行条件，就会导致内存泄漏，而那些无用的变量值就是导致内存泄漏的原因之一
    
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
- 在第4章的[3.1-2 垃圾回收的实现方式](../4%20%E5%8F%98%E9%87%8F%E3%80%81%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8E%E5%86%85%E5%AD%98/3%201-2%20%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F.md) 中讨论过[使用引用计数的浏览器版本](../4%20%E5%8F%98%E9%87%8F%E3%80%81%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8E%E5%86%85%E5%AD%98/3%201-2%20%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F.md)
    - 由于IE在IE9之前对JScript对象和COM【C++实现的组件对象模型（COM，Component Object Model）】对象使用不同的垃圾回收机制（前者使用标记清理，后者使用引用计数）
    - 所以闭包在这些旧版本的IE可能会导致问题，例如把HTML元素保存在某个闭包的作用域中，就相当于宣布该元素不能被销毁
        
        ```jsx
        function assignHandler() {
          let element = document.getElementById("someElement");
          element.onclick = () => console.log(element.id);
        }
        ```
        
        - 上述代码创建了一个闭包，即`element` 元素的**事件处理程序**（**event handler**）
        - 这个事件处理程序又创建了一个循环引用，匿名箭头函数又引用`element` 导致创建了一个循环引用（circular reference）
        - 因为匿名箭头函数（的执行上下文作用域链）引用着`assignHandler()` 的活动对象，阻止对`element` 的引用计数归零
        - 只要这个匿名箭头函数存在，`element` 的引用计数至少为1，即内部不会**被回收**（**reclaimed**）
- 解决这种问题的方式就是[切断原生JavaScript对象和DOM元素之间的连接](../4%20%E5%8F%98%E9%87%8F%E3%80%81%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8E%E5%86%85%E5%AD%98/3%201-2%20%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F.md) 以及清空活动对象中无用的变量
    
    ```jsx
    function assignHanlder() {
      let element = document.getElementById("someElement");
      let id = element.id;
      element.onclick = () => console.log(id);
      element = null;
    }
    ```
    
    - 闭包修改为引用一个保存着`element.id` 的变量`id` ，从而消除循环引用
    - 因为闭包还是会引用包含函数的活动对象，这个活动对象中包含已经不再闭包中引用的`element` ，因此必须把`element` 设置为`null`