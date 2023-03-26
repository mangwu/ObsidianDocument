# 2. Array

# 描述

- ECMAScript数组跟其他编程语言的数组有很大的区别
- ECMAScript中的数组和其他语言一致的是，数组是一组有序数据
- 区别在于：数组中的**每个槽位可以存储任意类型的数据，**且**数组大小是动态**的，随着数据添加而自动增长

# 2.1 语法

## 2.1.1 创建数组

- 有几种方式可以创建数组

### 2.1.1.a 构造函数

- 通过Array()构造函数创建数组
- 如果直到数组中数据的数量，可以传递给Array一个数字，确定length属性的值
    
    ```jsx
    const colors = new Array(20);
    console.log(colors, colors.length);
    // 打印结果
    [ <20 empty items> ] 20
    ```
    
- 也可以通过传入个数超过1的元素数据，指定初始数组中的元素，元素数据可以有多个，以多个参数传递
    
    ```jsx
    const names = new Array(3, "a", "b", "c");
    console.log(names); //[ 3, 'a', 'b', 'c' ]
    ```
    
    - 如果只传入**一个**参数，参数为数字类型，则优先判断为数组长度（**传入负数和小数会报错**）,如果不是数字类型就会当作元素数据创建一个单个元素的数组
    - 如果传入**多个**参数，无论参数类型是什么，都会作为初始化数组的元素，安装参数传递顺序指定数组元素顺序
- 在使用构造函数时，可以**省略new操作符，同样可以创建一个新的数组**
    
    ```jsx
    console.log(Array(2, 5, 6));
    // [ 2, 5, 6 ]
    ```
    
    - 不使用new操作符创建的数组参数和使用new的完全一样，且二者的创建数组的作用没有区别
    - 唯一的区别在于**一个作为构造函数创建数组**，一个作为**函数调用新建数组**（只是语法不同，效果是一样的）

### 2.1.1.b 数组字面量（array literal）

- 数组字面量表示法：中括号中包括以逗号分隔的元素列表的方式创建数组
    
    ```jsx
    console.log([1, 2, , 5]);
    // [ 1, 2, <1 empty item>, 5 ]
    ```
    
- 注意，和对象（Object）一样，数组字面量表示法创建数组时不会调用Array构造函数

### 2.1.1.c Array.from()

- 使用Array提供的Array.from()静态方法创建数组
- from可以将类数组结构转换为数组实例，即任何可以**迭代的结构、有一个length属性和有索引元素的结构**转换为数组
- 可迭代的结构如字符串，集合（Set），映射（Map）等
    
    ```jsx
    // Array.from()
    const set = new Set().add(5).add(1).add(6).add(-2);
    const map = new Map().set(1, 5).set("2", 3).set("m", 8).set("as", 99);
    const arrayLikeObj = {
      0: "1",
      "2": "3",
      5: "6",
      length: 3,
    };
    const iteratorObj = {
      [Symbol.iterator]: function* () {
        yield 2;
        yield 3;
        yield 5;
      },
    };
    console.log(Array.from(set));
    console.log(Array.from(map));
    console.log(Array.from(arrayLikeObj));
    console.log(Array.from(iteratorObj));
    // 打印结果
    [ 5, 1, 6, -2 ]
    [ [ 1, 5 ], [ '2', 3 ], [ 9, 8 ], [ 4, 6 ] ]
    [ '1', undefined, '3' ]
    [ 2, 3, 5 ]
    ```
    
    - Array.from()方法会对集合和映射按照key添加（设置）的顺序安排元素在新数组中的顺序
    - 根据类数组结构的arrayLikeObj创建新数组时，先根据length值确保**有效的索引值范围**，然后只对**属性是数字或可转换为数字**的键值进行数组元素引入，所以对于`5:"6"` 这对键值没有使用，因为length为3，只能使用[0, 2]范围内的属性值
    - 可迭代结构按照迭代顺序安排在新数组中的元素顺序
- 因为**数组本身就是可迭代结构**，所以可以通过Array.from()对现有数组进行**浅复制**
    
    ```jsx
    const arr = [[1, 2], 3, { 4: "a", 5: [6] }];
    const copy = Array.from(arr);
    copy[0][0] = "newVal";
    copy[1] = "newVal";
    copy[2][4] = "newVal";
    copy[2][5][0] = "newVal";
    copy.push("newVal")
    console.log(arr);
    console.log(copy);
    // 打印结果
    [ [ 'newVal', 2 ], 3, { '4': 'newVal', '5': [ 'newVal' ] } ]
    [
      [ 'newVal', 2 ],
      'newVal',
      { '4': 'newVal', '5': [ 'newVal' ] },
      'newVal'
    ]
    ```
    
    - 通过打印结果可以知道，浅复制就是新建一个数组，然后按照**值复制**的方式复制每个元素值到对应索引位置
    - 新数组中的每个元素
        - 如果是引用值，则和原数组中的指向同一个对象，修改引用值对象中的属性，会导致原数组元素数据改变
        - 如果是原始值则改变后不影响原数组
- 函数中的arguments对象是可迭代的，所以也能通过Array.from()轻松转换为数组
    
    ```jsx
    function getArgsArray() {
      for(const item of arguments) {
        console.log(item);
      }
      return Array.from(arguments);
    }
    
    getArgsArray(1, 2, 3, 4); // [1,2,3,4]
    ```
    
- 可选参数
    - Array.from(iterator[, function [, thisArg]])
    - 可选参数function是一个**直接增强数组元素的函数**（Array.from以函数作为参数，所以它是一个高阶函数）
        - 传入一个function，Array.from依据iterator构建的新数组中的每个元素都会被这个function处理，从而得到一个依据原始元素的新元素值，这个新元素值最终替换原始元素值作为新数组的元素
        - 与使用`Array.from(iterator).map(funtion)` 语法得到的结果一致，只是使用map需要创建一个**中间数组**，而向from()中传递第二个参数，它可以直接得到处理过后的新数组
    - 可选参数thisArg用于指定映射函数中的this值
        - 映射函数作为参数**可能**无法获取外部的对象变量
        - 传入thisArg后再映射函数内部就可以使用thisArg获取指定上下文的对象变量了
        - 唯一不适用：this值在箭头函数中无法使用
    
    ```jsx
    const arr2 = ["abc", "d", "e", "f", "z"];
    let obj = { exponent: 2 };
    console.log(Array.from(arr2, (x) => x.charCodeAt() ** obj.exponent));
    console.log(Array.from(arr2).map((v) => v.charCodeAt() ** obj.exponent));
    console.log(
      Array.from(
        arr2,
        function (x) {
          return x.charCodeAt() ** this.exponent;
        },
        obj
      )
    );
    // 打印结果
    [ 9409, 10000, 10201, 10404, 14884 ]
    [ 9409, 10000, 10201, 10404, 14884 ]
    [ 9409, 10000, 10201, 10404, 14884 ]
    ```
    
    - 注意第三种写法不能使用箭头函数

### 2.1.1.d Array.of()

- ES6新增方法，用于替代Array.prototype.slice.call(arguments)
- Array.of()能将传入的参数(arguments对象)转换为数组，传入undefined，也会将undefined作为数组的元素值
    
    ```jsx
    // Array.of()
    console.log(Array.of(1, 2, 3));
    console.log(Array.of());
    console.log(Array.of(undefined, null));
    // 打印结果
    [ 1, 2, 3 ]
    []
    [ undefined, null ]
    ```
    

## 2.1.2 数组空位

- 数组空位语法指在使用数组字面量表示法创建数组时，使用一串逗号来创建空位（hole）
    
    ```jsx
    const arr = [1,,,,5];
    // [ 1, <3 empty items>, 5 ]
    ```
    
- ECMAScript将逗号之间的位置也会当成一个占位索引，只是这个占位索引表示的值在ECMAScript6中重新进行了规范
- ES6中将占位索引当成存在的元素，值设置为`undefined`
- **ES6之前的方法会忽略这个空位**
    
    ```jsx
    let arr = [];
    arr[5] = 0;
    arr[2] = undefined;
    console.log(arr);
    console.log(arr.map((v) => 6));
    console.log(arr.join("-"));
    // 打印机果
    [ <2 empty items>, undefined, <2 empty items>, 0 ]
    [ <2 empty items>, 6, <2 empty items>, 6 ]
    -----0
    ```
    
    - 注意，像map这样的方法会忽略空位，初始化设置了元素
    - 而join()方法则会将空位（和undefined）视为空字符串
- 实际上一些方法对待空位的方式不一样
    - map()忽视空位但不会忽视初始化为undefined的元素
    - 而join()对待undefined和空位的态度一致，都视为空字符串
    - 所以再创建数组时**避免使用数组空位，如果确实需要，显式的使用undefined值代替，而不是不初始化**

## 2.1.3 数组索引

### 访问和设置元素值

- 数组索引可以用于访问数组中哥哥索引位置的值
- 语法
    - 索引位置大于等于0
    - 数组使用中括号并提供数字索引以访问或替换相应索引位置的值
    - 访问超过（大于等于）数组大小(length)或小于等于0的索引值，会返回undefined
- 例子
    
    ```jsx
    // 访问和设置元素值
    const arr = ["blue", "red", "black"];
    console.log(arr[2]);
    arr[5] = "orange";
    console.log(arr[-1]);
    arr[-2] = "orange2";
    console.log(arr);
    for(const item of arr) {
      console.log(item);
    }
    // 打印结果
    black
    undefined
    [ 'blue', 'red', 'black', <2 empty items>, 'orange', '-2': 'orange2' ]
    blue
    red
    black
    undefined
    undefined
    orange
    ```
    
    - JavaScript中的数组的**可扩展性很强**
    - 索引值实际上可以是范围内的整数
    - 如果是访问或设置负数索引的值，数组也不会报错，同时保存负数索引值的键值对，只是它们不被当作数组元素处理，且也不会出现在迭代器中
    - 如果给组长度外的索引位置设置元素值，则扩展数组元素，增加数组长度，且原始最大元素索引位置和数组外所有位置之间都被设为**空位**

### 数组长度

- 数组中元素的数量保存在length属性中，length始终是一个大于等于0的值
- 它的值就是数组中元素的个数（**包括空位**）
- JavaScript中数组的length的属性是**可读**的
    - 可以将数组的属性进行重新赋值，赋值必须为正整数
    - 根据源数组长度的大小比较，判断是缩减数组还扩展数组
    - 如果比源数组长度小，则从数组末尾开始删除元素达到指定长度
    - 如果比源数组长度大，则在元素某位开始添加元素达到指定长度
- 例子
    
    ```jsx
    const arr2 = [5, 6, , , 3, 1];
    console.log(arr2.length); // 6
    arr2.length = 2;
    console.log(arr2); // [ 5, 6 ]
    arr2.length = 4;
    console.log(arr2); // [ 5, 6, <2 empty items> ]
    
    ```
    
    - 数组长度赋值变小时，删除了后面的元素（不可恢复）
    - 数组长度赋值变大时，从数组后面扩展了元素，扩展的就是空位，可以视为undefined
- 数组的长度会根据元素的个数进行动态调整，一个有用的技巧是**使用length属性作为数组索引可以方便的向数组末尾添加元素**
    
    ```jsx
    arr2[arr2.length] = 7;
    arr2[arr2.length] = 8;
    console.log(arr2, arr2.length); //[ 5, 6, <2 empty items>, 7, 8 ] 6
    ```
    

### 注意

- 数组最多可以包含4 294 967 295（$2^{32} - 1$）个元素
- 如果数组长度大于这个数，会抛出错误
- 以容纳个数的最大值作为length初始化数组也会导致运行时间过长而抛出错误

# 2.2 数组方法

## 2.2.1  检测数组

- ECMAScript常常需要判断对象的类型
- 如果需要判断对象是否为数组类型，在**只有一个全局作用域**的情况下，使用判断对象类型的Instanceof操作符就可以了
    
    ```jsx
    const arr = [];
    console.log(arr instanceof Array); // true
    ```
    
- instanceof假定情况是只有一个全局上下文，如果网页里有多个框架，则可能设计两个不同的全局上下文
    - 根据框架的不同，Array构造就会有不同的版本
    - 如果把一个数组从一个框架传到另一个框架，这个数组的Array（构造函数）是有区别于另一个框架的Array构造函数的
    - 这个时候instanceof会返回false
    - 所以每个版本Array都规范提供isArray()的方法，这个方法是一个静态方法，Array.isArray()判断对象是否为数组（不管它是哪个全局上下文创建的Array）
        
        ```jsx
        // isArray()
        console.log(Array.isArray(arr)); // true
        ```
        
        - 常用于条件语句中

## 2.2.2 迭代器方法

- 迭代器方法用于返回数组的迭代器
- Array在原型上暴露了3个方法用于检索（遍历）数组内容的迭代器方法

### Array.prototype.keys()

- 数组实例调用，**返回数组索引**的迭代器
- 通过for of可以遍历Array.prototype.keys()的迭代器对象
- 也可以通过迭代器对象的next()方法获取下一个数组索引
- 例子
    
    ```jsx
    const arr = [1, 2, 3, , , 4];
    const keysIterator = arr.keys()
    console.log(Array.from(keysIterator)); // 
    console.log(keysIterator.next());
    console.log(keysIterator.next());
    console.log(keysIterator.next());
    console.log(keysIterator.next());
    console.log(keysIterator.next());
    console.log(keysIterator.next());
    // 打印
    [ 0, 1, 2, 3, 4, 5 ]
    { value: undefined, done: true }
    { value: undefined, done: true }
    { value: undefined, done: true }
    { value: undefined, done: true }
    { value: undefined, done: true }
    { value: undefined, done: true }
    ```
    
    - Array.from()方法再通过迭代器构造数组时，会将内部指向next()，最终将迭代器状态(done)运行为true
    - 所以后续调用迭代器的next()，会导致无法遍历出迭代器的值
    - 如果注释掉`console.log(Array.from(keysIterator));`  ，迭代器的next()就会顺序的返回数组索引了

### Array.prototype.values()

- 数组实例调用，**返回数组元素**的迭代器
- 通过for of可以遍历
- 也可以通过迭代器对象的next()方法获取下一个数组元素
- 例子
    
    ```jsx
    const arr = [1, 2, 3, , , 4];
    const valuesIterator = arr.values();
    console.log(Array.from(valuesIterator)); //[ 1, 2, 3, undefined, undefined, 4 ]
    ```
    
    - 注意，arr本身是有空位的，使用values获得数组元素的迭代器后，再通过from()构建的数组是使用undefined代替了空位
    - 也就是说，迭代器对于空位的处理是将其看为实际的undefined的，map()方法不会忽视这些元素(因为已被undefined代替)

### Array.prototype.entries()

- 数组实例调用，返回索引/值对的迭代器
- 通过for of 加ES6的解构可以非常容易的地在循环中拆分键/值对
- 也可以通过迭代器对象的next()方法获取下一个数组元素
- 例子
    
    ```jsx
    const entriesIterator = arr.entries();
    console.log(entriesIterator.next());
    for (const [key, val] of entriesIterator) {
      console.log(key + "-" + val);
    }
    // 打印结果
    { value: [ 0, 1 ], done: false }
    1-2
    2-3
    3-undefined
    4-undefined
    5-4
    ```
    
    - 可以看到，调用迭代器的next()，value的值表示方式为[key, value]
    - 所以在使用for of时，需要配合的解构语法就是使用[key, val]的

### 注意

- 这些生成迭代器的方法是ES6规范定义了，仍然有部分浏览器未实现它们（书中说的是2017底）

## 2.2.3 复制和填充方法

- ES6新增的两个方法
    - 批量复制方法：Array.prototype.copyWithin()
    - 填充方法: Array.prototype.fill()

### Array.prototype.copyWithin()

- 指定调用数组实例上的一个范围，复制调用数组指定范围内的元素，将其**浅复制**到同一数组（调用数组）的另一个位置，并返回原数组（调用数组），不会改变原数组长度
- 语法
    
    ```jsx
    arr.copyWithin(target[, start[,end]]);
    ```
    
    - **参数**
        - target，必传递，指定原数组复制开始的位置（被复制开始赋值的位置），以0为基底，范围为(-arr.length, arr.length)；如果target索引值为负数，则从末尾开始计算，如果target大于等于arr.length，就不会发生拷贝
        - start，可选，如果不传递，默认为0，表示开始复制元素的起始位置，范围(-arr.length, arr.length),如果为负数，则从末尾开始计算，如果start大于等于arr.length,就不会发生拷贝
        - end, 可选，不然不传递，默认为arr.length，即复制到数组的结尾，范围(-arr.length, arr.length]；传递后，copyWithin()会拷贝到该位置就结束，但是拷贝位置不包括end索引位置，如果是负数，从末尾开始计算
    - **返回值**
        - 改变后的数组（调用数组会被修改）
- **注意**
    - 这个方法不要求this值必须是数组对象，它的设计是**通用式**的，对于类数组方法它也有效果
    - 它是一个**可变方法，**它不会改变this的长度，但是会改变this本身的内容，如果需要会创建新的属性（用于填补可能的空位）
- 例子
    - 只传递第一个target参数
        
        ```jsx
        // copyWithin()
        let arr;
        let reset = () => (arr = ["a", "b", "c", "d", "e", "f"]);
        // 传入target
        reset();
        console.log(arr.copyWithin(0)); // ["a", "b", "c", "d", "e", "f"]
        reset();
        console.log(arr.copyWithin(2)); // ["a", "b", "a", "b", "c", "d"]
        reset();
        console.log(arr.copyWithin(5)); // ["a", "b", "c", "d", "e", "a"]
        reset();
        console.log(arr.copyWithin(6)); // ["a", "b", "c", "d", "e", "f"]
        reset();
        console.log(arr.copyWithin(-2)); // ["a", "b", "c", "d", "a", "b"]
        reset();
        console.log(arr.copyWithin(-6)); // ["a", "b", "c", "d", "e", "f"]
        reset();
        console.log(arr.copyWithin(-7)); // ["a", "b", "c", "d", "e", "f"]
        ```
        
        - 不传入start和end,复制元素范围默认为第一个元素到末尾
        - target指定复制范围拷贝的开始位置，只对(-arr.length, arr.length)范围内的整数有效
        - 对于范围外的target值，copyWithin()没有效果
        - 负数加上`arr.length`后就是指定开始的元素位置索引
    - 传递target + start
        
        ```jsx
        reset();
        console.log(arr.copyWithin(2, 6)); // ["a", "b", "c", "d", "e", "f"]
        reset();
        console.log(arr.copyWithin(0, 2)); // ["c", "d", "e", "f", "e", "f"]
        reset();
        console.log(arr.copyWithin(3, 2)); // ["a", "b", "c", "c", "d", "e"]
        reset();
        console.log(arr.copyWithin(3, -2)); // ["a", "b", "c", "e", "f", "f"]
        reset();
        console.log(arr.copyWithin(1, -6)); // ["a", "a", "b", "e", "d", "e"]
        ```
        
        - 不传入的end默认为arr.length即，复制元素范围为[start, arr.length)
        - 如果target在start之后（第三次复制），复制的序列只能从开始复制部分
    - 传递target + start + end
        
        ```jsx
        reset();
        console.log(arr.copyWithin(2, 1, 4)); // ["a", "b", "b", "c", "d", "f"]
        reset();
        console.log(arr.copyWithin(-3, -5, 7)); // ["a", "b", "c", "b", "c", "d"]
        reset();
        console.log(arr.copyWithin(0, 4, 1)); // ["a", "b", "c", "d", "e", "f"]
        ```
        
        - 将[start, end)范围内的元素复制到从target开始的位置
        - 如果start≤ end 这个方法不会发生复制，直接返回原数组
    - 通过apply()或call()方法传递this，作用于类数组对象
        
        ```jsx
        const objLikeArray = {
          length: 5,
          0: "a",
          2: "b",
          4: "c",
        };
        console.log(Array.from(objLikeArray)); // [ 'a', undefined, 'b', undefined, 'c' ]
        console.log([].copyWithin.call(objLikeArray, 1, 2, 5)); //{ '0': 'a', '1': 'b', '3': 'c', '4': 'c', length: 5 }
        ```
        
        - 可以看到一个有空位的类数组对象
        - 是要调用数组的copyWithin方法时，调用call，传递类数组对象为this，然后传递copyWithin的参数
        - 空位也会被复制，所以objLikeArray中的索引2位置的值为undefined，对象中值为undefined属性相当于不存在，所以打印时就没有”2”,属性
        - 同时，因为target为1，从索引1开始复制赋值，所以需要创造属性”1”和”3”
- **理解**
    
    ![Array.prototype.copyWithin().png](2%20Array/Array.prototype.copyWithin().png)
    

### Array.prototype.fill()

- fill()方法用于向已有的数组中**填充全部或部分相同的值**，和copyWithin类似，可以将填充调用数组的指定范围的元素，修改原数组后返回
- 语法
    
    ```jsx
    arr.fill(value[, start[, end]])
    ```
    
    - **参数**
        - value：用来填充数组的值
        - start，可选，填充的起始索引，默认值为0，范围为[-arr.length, arr.length),对于大于等于arr.length的start值，fill()不会起作用，直接返回原始数组，对于小于-arr.length的值，将看为索引0处理
        - end，可选，填充的结束索引，默认值为arr.length,范围为(-arr.length, arr.length]，对于负数，从末尾开始计算；对于小于等于-arr.length的索引值，fill()不会起作用，对于大于arr.length的值，将看为arr.length处理；**end处的索引不会被填充**
    - 返回值
        - 修改后的原数组
- **注意**
    - 这个方法不要求this值必须是数组对象，它的设计是**通用式**的，对于类数组方法它也有效果
    - 它是一个**可变方法，**它不会改变this的长度，但是会改变this本身的内容，如果需要会创建新的属性（用于填补可能的空位）
- 例子
    
    ```jsx
    reset();
    console.log(arr.fill(2)); // [ 2, 2, 2, 2, 2, 2 ]
    reset();
    console.log(arr.fill(2, 0, 100)); // [ 2, 2, 2, 2, 2, 2 ]
    reset();
    console.log(arr.fill(2, -9, -2)); // [ 2, 2, 2, 2, "e", "f"]
    reset();
    console.log(arr.fill(2, 2, 2)); // [ 'a', 'b', 'c', 'd', 'e', 'f' ]
    ```
    
    - 当start ≤ end (处理后的索引值)时，直接返回原数组
    - end值对于大于arr.length的值当作arr.length处理
    - start值对于小于-arr.length的值当作0处理

## 2.2.4 转换方法

- 转换方法就是将数组转换原始数据类型的方法，继承自Object
- 包括toLocaleString() toString() valueOf()
- **valueOf()方法返回数组本身**

### Array.prototype.toString()

- 返回数组中每个元素值的**等效字符串**拼接而成的一个逗号分隔符的字符串
- 也就是说，数组中的每个元素都会调用toString()转换为字符串后再使用逗号进行拼接
- 例子
    
    ```jsx
    let colors = ["red","blue",,220088];
    console.log(colors.toString()); // "red,blue,,220088"
    ```
    
    - 空位被当成空字符串
    - 数字调用toString()转换为对应的数字

### Array.prototype.toLocaleString()

- 和toString()的功能相似，通用将数组中的每个元素转换成字符串和使用逗号拼接返回
- 唯一的区别在于数组的元素调用的是toLocaleString()方法
- 例子
    
    ```jsx
    let dates = ["today ", new Date()];
    console.log(dates.toLocaleString()); // "today ,Wed Jul 20 2022 14:39:50 GMT+0800 (中国标准时间)"
    console.log(dates.toString()); // "today ,2022/7/20 14:39:50"
    ```
    
    - 可以看到，因为Date对象的toLocaleString()和toString()返回的字符串值不同
    - 所以在数组中调用toString()和toLocaleString()时拼接产生的字符串也不同

### 注意

- 两个转换为字符串的方法在将数组元素转换为字符串时，采取不同的策略，查看下面例子
    
    ```jsx
    const arr = [
      1,
      ,
      "b",
      false,
      undefined,
      null,
      [
        1,
        "b",
        false,
        {
          c: 3,
          toString() {
            return "c:3";
          },
          toLocaleString() {
            return "Locale,c:3";
          },
        },
      ],
      {
        d: 5,
        toString() {
          return "d:5";
        },
      },
      {
        e: 6,
        toLocaleString() {
          return "e:6";
        },
      },
      {
        a: 2,
        valueOf() {
          return "a:2";
        },
      },
      new Date(),
    ];
    
    // toString() 将返回元素等效字符串然后拼接逗号返回
    console.log(arr.toString());
    // toLocaleString()
    console.log(arr.toLocaleString());
    ```
    
- 打印结果
    
    ```jsx
    1,,b,false,,,1,b,false,c:3,d:5,[object Object],[object Object],Wed Jul 20 2022 14:39:50 GMT+0800 (中国标准时间)
    1,,b,false,,,1,b,false,Locale,c:3,d:5,e:6,[object Object],2022/7/20 14:39:50
    ```
    
    1. 对于**空位，undefined，null**，字符串转换都按照**空字符串**进行转换，但是仍然占据位置，所以会出现`,,,` 的情况
    2. 嵌套数组同样适用于toString()或toLocaleString()的转换方式
    3. 对于只包含valueOf()的对象，toString()和toLocaleString()方法都不会让这个对象调用valueOf(),而是直接调用从Object继承的toString()方法，返回`[object Object]` 
    4. 对于**toString()而言，它只能让对象调用toSrting()**，而toLocaleString()，它**能让对象优先调用toLocaleString()再调用toString()**；即toLocaleString()规定有toLocaleString()就调，没有就使用toString()，而toString()不能调用toLocaleString()

### Array.prototype.join()

- join()方法是非继承的数组方法，它能将一个数组（或类数组对象）的所有元素转换为字符串后，按照传入的字符串参数进行拼接，然后返回拼接后的字符串；默认拼接仍然使用逗号
- 语法
    
    ```jsx
    arr.join([separator])
    ```
    
    - 参数：separator，可选，字符串，用于拼接元素的分隔字符串，缺省为逗号”,”
    - 返回值：和toString()类似，每个数组元素转换为字符串后使用指定分隔符连接的字符串
- 例子
    
    ```jsx
    // arr仍然是上面例子使用的arr
    console.log(arr.join(""));
    console.log(arr.join("-"));
    console.log(arr.join(","));
    ```
    
    打印结果
    
    ```jsx
    1bfalse1,b,false,c:3d:5[object Object][object Object]Wed Jul 20 2022 15:07:35 GMT+0800 (中国标准时间)
    1--b-false---1,b,false,c:3-d:5-[object Object]-[object Object]-Wed Jul 20 2022 15:07:35 GMT+0800 (中国标准时间)
    1,,b,false,,,1,b,false,c:3,d:5,[object Object],[object Object],Wed Jul 20 2022 15:07:35 GMT+0800 (中国标准时间)
    ```
    
    - 可以发现，`arr.join(",")`和`arr.toString()`的结果一模一样，二者是等价的
    - 对于嵌套数组，使用join()相当于对嵌套中的元素调用toString()方法，可以看到嵌套数组中的元素使用的仍然是逗号隔开的字符串`1,b,false,c:3`

## 2.2.5 栈方法

- ECMAScript给数组提供了几个方法，让数组看起来像栈

### 栈

- 栈是一种**限制插入和删除项**的数据结构，它的元素基本出入规则是**后进先出（LIFO,Last-In-First-Out）**
    - 最近添加的元素（项）先被删除
    - 第一个添加的元素最后被删除
- 栈的插入与删除
    - 栈的数据项的插入称为**推入，push**
    - 栈的数据项的删除称为**弹出，pop**
    - 且二者只发生在栈顶
- ECMAScript规范为数组提供了push()和pop()方法，实现类似栈的功能

### Array.prototype.push()

- 接受任意数量的参数，将它们按顺序添加到数组末尾，并返回数组的最新长度
- 语法
    
    ```jsx
    arr.push(ele1, ele2, ...,eleN)
    ```
    
    - 参数，eleN，被添加到数组某位的元素，可以是任何类型，可以传入任何数量的参数（不能超过方法的最大传递参数个数）
    - 返回新的数组长度
- 例子
    
    ```jsx
    const arr = [];
    console.log(arr.push(1, 2, 3), arr); // 3 [ 1, 2, 3 ]
    console.log(arr.push(), arr); // 3 [ 1, 2, 3 ]
    ```
    
    - 不传入任何参数，调用后不对数组做任何处理，返回原始数组长度

### Array.prototype.pop()

- pop()方法删除数组的最后一个元素，同时减少数组的length值，并返回被删除的项
- 语法
    
    ```jsx
    arr.pop()
    ```
    
    - 没有参数
    - 返回值：数组的最后一项元素，如果数组长度为0，返回undefined，且不改变数组长度
- 例子
    
    ```jsx
    // 使用push操作后的arr [1,2,3]
    console.log(arr.pop(), arr); // 3 [1,2]
    console.log(arr.pop(), arr); // 2 [1]
    console.log(arr.pop(), arr); // 1 []
    console.log(arr.pop(), arr); // undefined []
    ```
    

### 注意

- JavaScript中把数组当作栈
    - 就是将**数组头作为栈尾**
    - 把**数组尾部作为栈顶**，
    - 而push和pop方法只操作栈顶元素（即元素入栈顶，栈顶元素出栈）
- Array.prototype.push()和Array.prototype.pop()是通用的，对类数组元素也有效果，利用call()或apply()方法接即可

## 2.2.6 队列方法

### 队列

- 是栈以LIFO形式限制访问的数据结构，队列则是以先进先出(FIFO,First-In-First-Out）形式限制访问
- 队列在列表末尾添加元素，从列表头获取（删除）元素
- push()方法是在数组末尾添加元素的方法，同样适用于队列
- 从数组头删除（获取）元素的方法是Array.prototype.shift()
- 使用这两个方法，可以把ECMAScript中的数组当作队列使用

### Array.prototype.shift()

- 删除数组的第一项并返回它，并修改数组长度
- 语法
    
    ```jsx
    arr.shift();
    ```
    
    - 参数，无
    - 返回值，数组的第一个元素，如果数组长度为0，则返回undefined，且不改变数组长度
- 例子
    
    ```jsx
    const arr = [];
    arr.push(1, undefined);
    console.log(arr.shift(), arr);
    console.log(arr.shift(), arr);
    console.log(arr.shift(), arr);
    // 打印结构
    1 [ undefined ]
    undefined []
    undefined []
    ```
    
    - 第二条shift()语句与第三条shift()语句指向后，返回值和arr一样，但是有实质性的区别，第二条语句修改了数组长度，而第三条语句没有

### Array.prototype.unshift()

- unshift()方法将一个或多个元素添加到数组开头，并返回改数组的新长度
- unshift()和push()类似，只是一个在数组开头添加数组元素，一个在数组末尾添加数组元素
- 语法
    
    ```jsx
    arr.unshift(ele1, ele2, ..., eleN)
    ```
    
    - 参数：要添加到数组开头的若干个元素
    - 返回值：参数添加到数组后，数组的长度
- 例子
    
    ```jsx
    // 反向队列
    const arr2 = [];
    console.log(arr2.unshift(1, 2), arr2); 2 [ 1, 2 ]
    console.log(arr2.pop()); 2
    console.log(arr2.pop()); 1
    ```
    
- unshift()可以和pop()在相反的方向上模拟队列

### 注意

- JavaScript中把数组当作队列，一般情况下
    - 数组尾部为队列尾部，入队就是在数组尾部添加元素，使用push()
    - 数组头部为队列头部，出队就是在数组头部删除元素，使用shift()
- 如果在相反的方向模拟队列，则是
    - 数组头部为队列尾部，入队就是在数组头部添加元素，使用unshit()
    - 数组尾部为队列头部，出队就是在数组尾部删除元素， 使用pop()

## 2.2.7 排序方法

- 排序方法也两个，一个是用于翻转数组的reverse()，一个是根据数组元素比较进行排序的sort()

### Array.prototype.reverse()

- 如同其英文单词表达的意思，将数组中的元素反向排列
- 语法
    
    ```jsx
    arr.reverse();
    ```
    
    - 无参数
    - 返回值，反向排列后的数组（源数组对象）

### Array.prototype.sort()

- sort()方法对调用数组使用原地算法对数组元素进行排序，并返回数组。
- 不传递参数的默认排序是将元素转换成字符串，然后比较它们的UTF-16代码单元值序列值大小，按照从小到大排序
- 转换成字符串时调用的是toString()方法
- 语法
    
    ```jsx
    arr.sort([compareFunction]);
    ```
    
    - 参数，比较函数，可选，用于指定按照某种顺序排列的函数，省略就会按照 字符串各个字符Unicode位点进行排序
        
        ```jsx
        compareFunction = (firstEl, secondEl) {
        	// how to Compare;
        	return num;
        }
        ```
        
        - firstEl: 第一个用于比较的元素
        - secondeEl:第二个用于比较的元素
        - num：返回值。
            - 如果是负数firstEl排列在seondEl之前
            - 如果为0，firstEl和secondEl的相对位置不变（在原数组中不变）
            - 如果为正数，firstEl排列在scondeEl之后
        - compareFunction必须**对相同的输入返回相同的结果，**否则排序不确定
    - 返回值：排序后的数组
- 例子
    
    ```jsx
    const arr = [1, 2, 3, 10, 12, 23, 45, 69, 102, "a", "b", "c", "汉", "A"];
    // sort()
    console.log(arr.sort());
    // 打印
    [
      1,   10,  102, 12,   2,
      23,  3,   45,  69,   'A',
      'a', 'b', 'c', '汉'
    ]
    ```
    
    - 默认情况下按照字符串UTF-16序列升序排列
    - 在UTF-16字符中，常用字符升序排列为[0123456789A-Za-z], 所以1, 10,102排列在2的前面是正确的
    - 对于使用两个码元表示的字符，如”汉”，都会排在使用一个码元表示的字符后
    
    ---
    
    ```jsx
    const arr2 = [-8, 2, 5, 8, 9, 12, 2, -12, 6, 5, 61, 25, 36, 14, 25];
    console.log(arr2.sort((a, b) => a - b));
    // 打印结果
    [
      -12, -8,  2,  2,  5,  5,
        6,  8,  9, 12, 14, 25,
       25, 36, 61
    ]
    ```
    
    - 上述例子使用比较，函数，表示如果元素a比元素b小，a元素就排在b元素前
    - 所以是一个升序排列的方式
    - 对于数组中全是数字的情况下，**比较函数**能快速的将数组中的元素排好序
    - `(a, b) ⇒ a - b` 和`(a,b) ⇒ b - a` 是两个很好的将数值数组中的元素进行升序或降序的比较函数

## 2.2.8 操作方法

### Array.prototype.concat()

- 在调用数组的继承上，创建一个调用数组的副本，然后在副本末尾添加元素（参数传递），最后返回新构建的数组
- 语法
    
    ```jsx
    const newArr = arr.concat(value1[, value2[, value3[, ...[, valueN]]]])
    ```
    
    - 参数：valueN，可选， 可以是数组或其它类型值，如果是数组，数组元素默认会被打平进入副本数组中
    - 返回值：基于原调用数组的副本
- **注意**
    - **数组打平，**涉及到数组的符号属性Symbol.isConcatSpreadable,将传入的数组参数的改符号属性设置为false，那么数组就会作为一个元素添加到副本中；对于类数组结构，Symbol.isConcatSpreadable设置为true，那么类数组结构会被打平添加到副本中（类数组结构默认不打平）；关于更多数组打平的可以查看符号属性相关内容[3. Symbol.isConcatSpreadable](../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/%E5%B8%B8%E7%94%A8%E5%86%85%E7%BD%AE%E7%AC%A6%E5%8F%B7.md)
    - **副本创建**：创建副本的过程是**浅拷贝，**所以新数组中与原有数组元素相同的引用值指向的是同一个对象。如果不传入任何参数，调用concat()方法会返回调用数组的一个浅拷贝数组
- 例子
    
    ```jsx
    const primaryArr = ["1", { a: 2 }];
    const defaultArr = [{ b: 3 }, 4];
    const notSpreadableArr = [{ b: 3 }, 4];
    notSpreadableArr[Symbol.isConcatSpreadable] = false;
    const objLikeArray = {
      0: 3,
      2: 5,
      length: 3,
      [Symbol.isConcatSpreadable]: true,
    };
    let copy = null;
    console.log((copy = primaryArr.concat(defaultArr)));
    console.log(primaryArr.concat(notSpreadableArr));
    console.log(primaryArr.concat(objLikeArray));
    
    copy[1].a = "修改";
    copy[2].b = "修改";
    console.log(primaryArr, defaultArr);
    ```
    
    打印结果
    
    ```jsx
    [ '1', { a: 2 }, { b: 3 }, 4 ]
    [
      '1',
      { a: 2 },
      [ { b: 3 }, 4, [Symbol(Symbol.isConcatSpreadable)]: false ]
    ]
    [ '1', { a: 2 }, 3, <1 empty item>, 5 ]
    [ '1', { a: '修改' } ] [ { b: '修改' }, 4 ]
    ```
    
    - 如果传入参数是数组，未设置有关打平的符号属性值，则默认打平进入concat()创建的数组，且打平只进行一次（对于传入的嵌套数组，是数组类型的数组元素仍然整体添加到副本中）
    - 如果传入参数的数组设置了不能打平进入的符号属性值，则添加时就整体添加
    - 对于类数组结构，默认不打平添加，修改打平符号属性值后可以打平添加，且空位也会被添加
    - 对于数组元素中为引用类型的元素，它们被**浅拷贝**到副本中，它们指向的对象和原始数组中的引用值是一样的，所以改变新数组引用值元素的对象属性，原始数组会收到影响（包括调用的数组和传入的作为数组元素的引用值）

### Array.prototype.slice()

- slice()方法用于创建一个包含原有数组中一个或多个元素的新数组，它和String类型中的slice()方法类似
- 语法
    
    ```jsx
    const newArr = arr.slice([start[, end]]);
    ```
    
    - 参数：
        - start：需要复制到新数组中的原始数组元素的开始索引，可选，默认为0
        - end：需要复制到新数组中的原始数组元素的结束索引，可选，默认为arr.length，复制元素不包括end处的元素
    - 返回：基于原始数组的子数组，子数组中的元素在原始数组中是连续的，它是一个新数组
- 注意
    - 原始数组不受影响
    - start和end值的范围为[-arr.length, arr.length], 负值就从末尾开始计算元素位置
    - 子数组中的元素是**浅拷贝于**原始数组中的元素
- 例子
    
    ```jsx
    // slice()
    const arr = [1, { a: 2 }, 3, 4];
    const newArr = arr.slice(-3, -1); // 等价于 arr.slice(1, 3);
    console.log(newArr); // [ { a: 2 }, 3 ]
    newArr[0].a = "修改";
    console.log(arr); // [ 1, { a: '修改' }, 3, 4 ]
    ```
    
    - 可以看到子数组中的引用值元素修改后会影响原始数组中的引用值元素指向的对象

### Array.prototype.splice()

- ECMAScript中最强大的数组方法，它可以操作原始数组
    - **删除。**给splice()传入两个参数就能删除原始数组中的连续元素，第一个参数是要删除元素的开始位置，第二个参数是要删除的元素个数，例如`arr.splice(0,2)` 会删除arr的前面两个元素并返回
    - **插入。**需要给splice()传入三个参数，第一个参数是插入元素的开始位置，第二个参数必须为0（不删除元素），第三个参数为插入的元素；如果要插入多个元素，可以传入第四个，第五个…参数,从第三个参数开始，都作为元素添加到第一个参数表示的索引位置前，如`arr.splice(2,0,"red", "blue")` ,在元素arr[2]之前顺序插入”red”和”blue”
    - **替换。**至少传入三个参数，第一个参数是被替换元素的开始位置，第二个参数是被替换元素的个数，第三个参数开始就是替换元素。被删除元素的个数不一定要和替换元素个数相等，如`arr.splice(2,1, "red", "blue")` 会删除arr[2]这个元素，然后在其中插入”red” 和”blue” 两个元素
- 语法
    
    ```jsx
    array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
    ```
    
    - 参数
        - start，指定修改的开始位置，从0开始计数，如果超出了数组长度，则从数组末尾开始修改（相当于arr.length）；如果是负值，从某位开始计算，如-1表示最后一位元素位置；如果负数超过`-arr.length`，则视为索引0
        - deleteCount，可选，表示要移除的数组元素个数。如果为0或者负数，就不会删除元素，如果被省略或者大于等于`arr.length - start` 的值（即大于start之后所有元素数量），那么start后的所有元素都会被删除（包括start）
        - item1, item2 …，可选要添加进数组的元素，从start位置开始，如果没有删除元素，则会顺序插入到start元素之前，如果删除了元素，则会替换删除的元素
    - 返回值
        - 只返回删除的元素构成的数组
        - 如果没有删除元素，会返回空数组
- 例子
    
    ```jsx
    // splice()
    
    const prarr = [1, "b", 3, "d"];
    const deleteArr = prarr.splice(-5);
    console.log(prarr, deleteArr); // [] [ 1, 'b', 3, 'd' ]
    console.log(prarr.splice(0, 0, 1, 2, 3, 4, 5), prarr); // [] [ 1, 2, 3, 4, 5 ]
    console.log(prarr.splice(2, 2, "a", "b", "c", "d"), prarr); 
    // [ 3, 4 ] [1,2,'a','b','c','d', 5]
    console.log(prarr.splice(2,0,"e"), prarr);
    //[] [1,2,'e','a','b', 'c', 'd', 5]
    ```
    
    - 第一个splice()传入-5，相当于传入0，删除了所有元素
    - 第二个splice()添加了5个元素
    - 第三个splice()在prarr[2]处删除2两个元素，再添加4个元素
    - 第四个splice()再prarr[2]前添加一个元素

## 2.2.9 搜索和位置方法

- ECMAScript提供两种搜索数组的方法：严格相等搜索和按断言函数搜索

### a. 严格相等

- 严格相等搜索就是搜索过程中使用全等号（[===](../3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/5%207%20%E7%9B%B8%E7%AD%89%E6%93%8D%E4%BD%9C%E7%AC%A6.md)）比较，全等号比较就是不进行类型转换的按值比较方式
- 按照严格相等搜索的三个数组方法分别是Array.prototype.indexOf()、Array.prototype.lastIndexOf()、Array.prototype.includes()
- 前两个方法在所有ES版本适用，后一个方法是ES7新增的

**注意**

`includes`是后来添加的方法，JavaScript高级程序设计（第4版）将其定义为使用严格相等搜索的方法，其实**不是**

**`inclues()`是使用同值零（SameValueZero）搜索判断的方法**，它们对`NaN` 的判断方式不同

```jsx
[NaN].includes(NaN); // true
[NaN].indexOf(NaN); // -1
```

参考[stackoverflow](https://stackoverflow.com/questions/66743472/why-does-nan-includesnan-return-true-in-javascript)和[mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

更多分析查看[JavaScript中的相等性判断](../../JavaScript%E5%B0%8F%E8%AE%A1/JavaScript%E4%B8%AD%E7%9A%84%E7%9B%B8%E7%AD%89%E6%80%A7%E5%88%A4%E6%96%AD.md) 

**语法**

```jsx
let idx = arr.indexOf(val[, start])
```

- 参数
    - val，必传递，表示搜索的元素值
    - start，可选，默认为0，表示从搜索开始的索引
- 返回值：从start开始从**左向右搜索**到的第一个val值的索引，如果数组中不存在val，则返回-1

---

```jsx
let lastIdx = arr.lastIndexOf(val[, start])
```

- 参数
    - val，必传递，表示搜索的元素值
    - start，可选，默认为`arr.length - 1`，表示从搜索开始的索引
- 返回值：从start开始从**右向左搜索**到的第一个val值的索引，如果数组中不存在val，则返回-1

---

```jsx
let hasVal = arr.includes(val[, start])
```

- 参数
    - val，必传递，表示搜索的元素值
    - start，可选，默认为0，表示开始搜索的索引位置
- 返回值，布尔值，表示从start位置开始从左向右搜索，是否能在数组中找到全等于val的值，找到了返回true，否则返回false

**例子**

```jsx
const arr = [1, 2, 3, { name: "mangwu" }];
const person = { name: "mangwu" };
console.log(arr.indexOf(2)); // 1
console.log(arr.indexOf(2, 2)); // -1
console.log(arr.lastIndexOf(3, -2)); // 2
console.log(arr.lastIndexOf(3, -3)); // -1
console.log(arr.includes(person)); // false
arr.splice(1, 0, person);
console.log(arr.includes(person)); // true
```

- 第一次搜索person返回false，因为数组中的对象和person不是同一个对象
- 第二个搜索返回true是因为将person插入到了数组中

### b. 断言函数

- 断言函数的本质就是自定义一个匹配函数，判断数组中的元素是否满足这个匹配函数的条件，满足则表示找到了一个元素，不满足则继续搜索下一个元素
- 断言函数用于代替严格相等的搜索方式，给予数组搜索更大的自由度
- 断言函数语法
    
    ```jsx
    (ele, idx, arr) => {
    	// 判断当前元素是否匹配条件
    	return true / flase
    }
    ```
    
    - 参数：
        - ele：必选，当前遍历到的元素
        - idx： 当前元素的索引，可选
        - arr：搜索的数组本身，可选
    - 返回值：布尔值，表示元素是否满足自定义的搜索条件
- ECMAScript中有两个搜索方法使用断言函数作为搜索的方式，分别是Array.prototype.find()和Array.prototype.findIndex()

**Array.prototype.find() 和Array.prototype.findIndex()**

- 语法
    
    ```jsx
    let ele = arr.find(callback[, thisArg]);
    let idx = arr.find(callback[, thisArg])
    ```
    
    - 参数
        - 断言函数，必传，用于判断当前元素是否符合查找条件的函数
        - thisArg，执行断言函数时用作this的对象（可用于类数组结构）
    - 返回值
        - find()返回数组中**第一个**满足断言函数查找条件的元素值，**没有返回undefined**
        - findIndex()返回数中中**第一个**满足断言函数查找条件的元素的索引值，**没有返回-1**
- 断言函数搜索常用于数组元素是对象的情况，这样就可以寻找符合条件的对象属性值的数组元素
- 例子
    
    ```jsx
    const arr2 = [
      { name: "wumang", age: 26 },
      { name: "mangwu", age: 22 },
      { name: "tanaka", age: 32 },
      { name: "takahasi", age: 25 },
    ];
    console.log(
      arr2.find((ele, idx, arr) => {
        console.log(idx);
        return ele.age < 25;
      })
    );
    console.log(
      arr2.findIndex((ele, idx, arr) => {
        console.log(idx);
        return ele.age > 26;
      })
    );
    // 打印结果
    0
    1
    { name: 'mangwu', age: 22 }
    0
    1
    2
    2
    ```
    
    - 第一个find查找一个元素对象的age属性小于25的元素，第二个元素符合条件，返回第二个元素
    - 第二个findIndex查找一个元素对象的age属性大于26的元素，第三个元素符合条件，返回第三个元素的索引值

## 2.2.10 迭代方法

- ECMAScript为数组定义了五个迭代方法。
- 这五个迭代方法有共同的参数传递，只是返回值不同
    - 参数1，回调函数，在迭代数组元素时，都会执行一遍回调函数
        
        ```jsx
        (ele, idx, arr) => {
        	// 根据数组元素和调用的迭代方法做一些处理
        	return boolean | any | undefined;
        }
        ```
        
    - 参数2，thisArg，作为回调函数运行上下文的作用域对象
    - 返回值，根据每个迭代方法所要实现的功能进行返回不同类型的值

### Array.prototype.every()

- 数组的每一项都运行回调函数，回调函数返回布尔值，如果每个回调函数都返回true，那么every()方法就返回true，否则返回flase
- every()方法用于**测试一个数组内的所有元素是否都满足回调函数定义的条件**
- every()方法不会改变原数组，除非在回调函数中进行改变
- 例子
    
    ```jsx
    console.log([3, 5, 8, 6, 4, 2].every((v, i) => v + i >= 3));
    // true
    ```
    
    - 判断元素和索引之和是否都大于等于3

### Array.prototype.filter()

- 对数组中的元素都调用回调函数，回调函数返回布尔值，如果为true，表示该元素符合回调函数的条件，否则不符合，所有符合回调条件的元素最终被组成一个数组后返回
- filter()就是用来过滤一部分元素的，传入的callback就是过滤的条件，返回的新数组就是过滤后的数组（原数组不会改变）
- 例子
    
    ```jsx
    console.log(
      [25, 36, 62, 52, 36, 94, 52, 82, 31, 42, 86, 57, 76].filter((v) => v >= 60)
    ); // [ 62, 94, 82, 86, 76 ]
    ```
    
    - 过滤掉所有小于60分的元素

### Array.prototype.forEach()

- 对数组中的元素都调用一次回调函数，不返回回调函数和forEach()本身**都不返回值**
- 常用于遍历数组，可以改写为for of的遍历形式
- 例子
    
    ```jsx
    // forEach
    const oddNums = [];
    [5, 2, 3, 6, 52, 11, 23, 5, 73, 54, 21, 39, 32, 1, 87].forEach((v, i) => {
      if (v % 2 == 1 && i % 2 == 1) {
        oddNums.push(v);
      }
    });
    console.log(oddNums);
    ```
    
    - 上面的例子将原始数组中的奇数和索引也是奇数的元素保留了下来
    - 同样可以使用filter完成上面的功能

### Array.prototype.map()

- 对数组中的每个元素都调用一个回调函数，回调函数返回一个新值，每个元素对应的新值组成一个新数组，新数组长度和原始数组长度相同
- map中的回调函数用于根据当前元素和索引，生成新数组的元素
- 例子
    
    ```jsx
    console.log(["a", "b", "c", "d"].map((v, i) => ({ label: i, value: v })));
    // 打印
    [
      { label: 0, value: 'a' },
      { label: 1, value: 'b' },
      { label: 2, value: 'c' },
      { label: 3, value: 'd' }
    ]
    ```
    
    - map()方法常用于生成Options，可选项，或遍历一个数组生产需要的数组

### Array.prototype.some()

- 与every()方法类似，只是判断的逻辑不同，some()的回调函数同样返回布尔值，只要数组元素有一个元素使得some()的回调函数返回true(符合条件)，那么some()就会返回true，否则返回false
- some()通常用于测试数组中是否有一个元素符合条件，而every()用于测试数组中是否所有元素都符合条件
- 例子
    
    ```jsx
    console.log([23, 25, 35, 45, 85, 32, 43, 55, 14, 60].some((v) => v > 80)); // true
    // 存在一个大于80的数就返回true
    ```
    

## 2.2.11 归并方法

- ECMAScript为数组提供了两个归并方法，reduce()和reduceRight()
- 归并方法，顾名思义就是迭代数组中的每个元素，构建一个最终的返回值，例如求数组所有元素和就可以用这两个方法
- 两个归并方法的参数和返回值都是类似的，唯一的区别在于
    - reduce()**从左向右**(数组头到数组未)开始遍历执行回调函数并归并
    - 而reduceRight()**从右向左**(数组尾到数组头)开始遍历执行回调函数并归并
- 实际上，利用排序方法可以将相同参数的二者等价
    
    ```jsx
    arr.reduce(callback, initailVal);
    arr.reverse().reduceRight(callback, initailVal);
    ```
    

### Array.prototype.reduce() / Array.prototype.reduceRight()

- 对数组中的每个元素执行一个**reducer**函数，每一次**运行reducer会将先前元素的计算结果作为参数传入**，最后将结果汇总为单个返回值
- 第一次执行回调函数时，不存在上一次的计算结果，可以传递第二个参数作为传递给回调函数的初始值，如果不传递初始值，那么遍历到的数组的第一个元素就是初始值，reduce()给reducer传递默认初始值为`arr[0]` ,reduceRight()给reducer传递默认初始值`arr[arr.length - 1]` ，此时，迭代器将从数组遍历的第二个元素开始执行reducer
- 语法
    
    ```jsx
    arr.reduce((pre, cur[, curIdx[, arr]]) => {
    	// 获取计算结果
    	return res;
    }[, initialValue])
    
    arr.reduceRight((pre, cur[, curIdx[, arr]]) => {
    	// 获取计算结果
    	return res;
    }[, initialValue])
    ```
    
    - 参数
        - callbackFn
            - 一个reducer函数，包含四个参数，返回处理结果
            - pre，全称previousValue，上一次调用callbackFn时的返回值，第一次调用，若指定了初始值，pre值就是初始值，没有指定，就是第一个遍历的元素，arr[0]或arr[arr.length - 1]
            - cur,全称currentValue,数组中正在处理的元素，第一次调用callbackFn时，指定了初始值，cur就是第一个遍历的元素，否则就是数组中本应该第二个遍历的元素（第一个元素作为pre值不再被处理）
            - curIdx，全称curentIndex，与currentValue对应，行为也一致
            - arr，遍历的数组
        - initialValue, 可选参数，作为第一次调用callbackFn时的pre值
    - 返回值，reducer回调函数遍历整个数组后的结果
- 注意
    - `callbackFn`有可能不会被调用一次，当数组长度是1，且没有初始值时，不会调用`callbackFn`，而是直接返回数组中的唯一的一个元素；当数组长度为0，且有初始值时，也不会调用callbackFn，直接返回初始值
    - 当数组长度为0，且没有初始值时，会报`TypeError` 的错误
- 例子
    
    ```jsx
    // reduce()
    const arr = [1, 2, 5, 8, 6, 3, 4, 2];
    console.log(arr.reduce((pre, cur) => pre + cur)); // 31
    console.log(arr.reduce((pre, cur) => pre - cur, 100)); // 69
    
    // reduceRight()
    console.log(arr.reduceRight((pre, cur) => pre + cur)); // 31
    console.log(arr.reduceRight((pre, cur) => pre - cur, 100)); // 69
    ```
    
    - `pre + cur` 实际上就是求的数组元素之和
    - `pre - cur` ，并传入第二个参数（pre初始值）100,求的是100减去每个元素值后剩余的数值
    - 可以看到，`reduce()`和`reduceRight()` 的结果一样，二者只是修改了遍历数组元素的方向，除此之外没什么区别