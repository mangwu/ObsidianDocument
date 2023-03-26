# 6. 参数扩展与收集（Spread Arguments and Rest Parameters）

ES6新增了**扩展操作符**（**spread operator**），使用它可以非常**简洁**（**elegant**）地操作和组合**集合数据**（**collections**）

扩展操作符最有用地场景就是函数定义中的参数列表（函数签名），它充分利用JavaScript的弱类型及参数长度可变的特点

扩展操作符既可以用于调用函数时传递参数，也可以用于定义函数参数

# 6.0 关于ECMAScript中的Arguments和Parameters

- *Arguments* 和 *Parameters* 在通常情况下是可以互相使用的，即都表示参数的意思
- 但是在大多数的标准中，这两个还是有区别的
    - *Parameters* 表示**形式参数**，指**声明函数使用的参数**,即命名参数
    - *Arguments* 表示**实际参数**，指在**函数实际调用时传入的确定值**
- 例如
    
    ```jsx
    function demo(a, b) {
    	console.log(a, b);
    }
    demo(1,2);
    ```
    
    - `a`, `b` 是函数的形式参数，即*Parameters*
    - 1，2是函数的实际参数，即*Arguments*

# 6.1 扩展参数（Spread Arguments）

- 扩展参数指在调用函数时，可以利用扩展操作符（`…`）扩展实际参数（*Arguments*），以达到只使用少数的实际参数（*Arguments*），传递到多数形式参数（*Parameters*）的目的

**从例子出发**

- 一个函数需要分别传递多个参数，而这多个参数正好在组合在一个数组中，假设有如下函数定义，它将所有传入的参数累加起来
    
    ```jsx
    function getSum() {
    	let sum = 0;
    	for(const item of arguments) {
    		sum+=item;
    	}
    	return sum;
    }
    ```
    
    - 这个函数希望所有加数逐个传入，然后通过迭代`arguments` 对象实现累计
    - 这个时候开发者得到一个数组，需要计算数组中元素之和，使用上述的`getSum()` 无法进行直接传递，如果不使用扩展操作符，想要将实际参数（数组）进行**拆分**（**flattern，**也称“打平”）传入函数中，就得应用`apply()` 方法了
        
        ```jsx
        let values = [1,2,3,4];
        console.log(getSum.apply(null ,values)); // 10
        ```
        
- 但是在ES6中，就可以通过扩展操作符极为**简洁**（**succinctly**）实现这种“打平”操作：对可迭代对象（实际参数）应用扩展操作符，然后将其作为单个参数传入；这种方式可以将可迭代对象**拆分**（**break apart**）为N个值，并将迭代返回的N个值逐个进行传入
    
    ```jsx
    getSum(...values); // 10
    // 等价于
    getSum(1,2,3,4);
    ```
    
    - `...values` 相当于将可迭代对象`values` 进行拆分，变成了 `1,2,3,4` ，根据`value` 的元素顺序和个数不同，拆分得到的结果也不同

**组合使用**

- 因为使用扩展操作符扩展**可迭代的实际参数**相当于拆分可迭代对象为**N size的分离实际参数**（**N separate arguments**）进行传递，这个N根据扩展参数而确定，所以不会妨碍在其前面或后面再传入其他的值，**包括使用扩展操作符传入其他可迭代的实际参数**
    
    ```jsx
    console.log(getSum(**3, 5, ...values, ...[-3, -8, 9], 2, 5**)); // 23
    ```
    
- 上面这个例子等价于传入了`(3,5,1,2,3,4,-3,-8,9,2,5)` ，对于函数体中的`arguments` 对象而言，它得到的就是按照调用函数时传入的**已被拆分**（**being broken apart**）成**分离形式**（**separate pieces**）的参数，即`(3,5,1,2,3,4,-3,-8,9,2,5)` ，而不会知道扩展操作符的存在

**命名参数同样适用**

- 上面的例子从整体来看就是使用`arguments` 消费扩展操作符，在普通函数和箭头函数中，也可以将扩展操作符用于命名参数（named parameters），同样也可以使用默认参数，因为扩展参数的本质就是**使用少数的实际参数（*Arguments*），传递到多数形式参数（*Parameters*）**
    
    ```jsx
    function getProduct(a, b, c = 1) {
      return a * b * c;
    }
    let getThreeSum = (a, b, c = 0) => {
      return a + b + c;
    };
    console.log(getProduct(...[1, 2])); // 2
    console.log(getProduct(...[1, 2, 3])); // 6
    console.log(getProduct(...[1, 2, 3, 4])); // 6
    
    console.log(getThreeSum(...[1, 2])); // 3
    console.log(getThreeSum(...[1, 2, 3])); // 6
    console.log(getThreeSum(...[1, 2, 3, 4])); // 6
    ```
    

# 6.2 收集参数（Rest Parameter）

- 收集参数（Rest Parameter）指的是在函数定义时，使用扩展操作符把不同长度的独立**形式参数**（***Parameters***）组合成一个数组，这类似于`arguments` 对象的构造机制（works），但是收集参数的结果是得到了一个`Array` 类型的**形式参数**（***Parameters***）【`arguments` 是一个类似数组的`Arguments` 类型实例】

**例子**

- 6.1中的`getSum` 函数可以利用扩展操作符定义一个收集参数直接使用，而不用麻烦`arguments` 了
    
    ```jsx
    function getSum(...values) {
      let sum = 0;
      for (const item of values) {
        sum += item;
      }
      return sum;
    }
    ```
    
- 实际上，上面的例子不能很好的显示收集参数对于`arguments` 的优势，下面的写法展示了收集参数能更好利用数组的各种API的优势
    
    ```jsx
    function getSum(...values) {
      return values.reduce((pre, cur) => pre+cur, 0);
    }
    ```
    

**组合使用**

- 除了能利用`Array` API这种优势外，收集参数的其他优势在于它可以和其他命名参数（named parameter）组合使用，一起定义函数
- 不过因为收集参数的长度是可变的，它会尽可能多的匹配传入的参数，所以**只能把收集参数作为最后一个参数**，它收集的是前面的命名参数匹配完毕后的**其余参数**（**remaining parameters**），如果没有则会得到空数组
    
    ```jsx
    function ignoreFirst(firstValue, ...rest) {
      console.log(rest);
    }
    ignoreFirst(1); // []
    ignoreFirst(1, 2, 3); // [2,3]
    ignoreFirst(1, 2, 3, 4);// [2,3,4]
    ```
    
    - 收集参数的英文名称为Rest Parameter，所以常使用`rest` 作为收集参数的标识符

**箭头函数使用场景**

- 箭头函数不支持`arguments`对象，但是支持收集参数的定义方式，因此可以利用扩展操作符实现与`arguments` 一样的逻辑
    
    ```jsx
    const getSumArrow = (...values) => {
      return values.reduce((x, y) => x + y, 0);
    };
    getSumArrow(1, 2, 3, 4); // 10
    ```
    
- 从这里也可以看成，收集参数并不会影响`arguments` 对象，二者是相互独立的语法，就像[扩展参数](6%20%E5%8F%82%E6%95%B0%E6%89%A9%E5%B1%95%E4%B8%8E%E6%94%B6%E9%9B%86%EF%BC%88Spread%20Arguments%20and%20Rest%20Parameters%EF%BC%89.md)中所述：
    
    在函数调用时，对于函数体中的`arguments` 对象而言，它得到的就是按照调用函数时传入的**已被拆分**（**being broken apart**）成**分离形式**（**separate pieces**）的参数，而不会知道扩展操作符的存在
    
    ```jsx
    function getSum(...values) {
      console.log(arguments.length);
      console.log(arguments);
      arguments[0] = "k";
      console.log(arguments);
      console.log(values);
    }
    getSum(1, 2, 3, 4);
    // 打印
    4
    [Arguments] { '0': 1, '1': 2, '2': 3, '3': 4 }
    [ 1, 2, 3, 4 ]
    [Arguments] { '0': 'k', '1': 2, '2': 3, '3': 4 }
    ```
    
    <aside>
    💡 **注意：**使用收集参数，因为形式参数被组合成了一个数组，所以`arguments` 对象中的元素无法和某一个命名参数**同步，**同时在组合使用的场景下，在收集参数前的单个的形式参数**也不能**同步
    
    ```jsx
    function ignoreRest(firstValue, ...rest) {
      arguments[0] = "k";
      console.log(firstValue); // 不会被改变
    }
    ignoreRest(...[1, 2, 3, 4]);
    ```
    
    </aside>