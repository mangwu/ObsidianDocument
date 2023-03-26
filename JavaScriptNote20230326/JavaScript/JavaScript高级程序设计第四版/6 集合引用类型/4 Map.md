# 4. Map

# 4.1 Map类型的基本API

## 4.1.1 创建映射

- 语法
    
    ```jsx
    const m = new Map([iterator])
    ```
    
- 参数
    - iterator：可选，是一个可迭代对象；如果不传入，就创建一个空映射；如果传入，就是在创建时同时初始化映射实例；可迭代对象包含**键值对数组**
- 返回值
    - 一个键值对映射对象
- 例子
    
    ```jsx
    const m0 = new Map();
    const m1 = new Map([
      ["key1", "value1"],
      ["key2", "value2"],
    ]);
    const m2 = new Map({
      [Symbol.iterator]: function* () {
        yield ["k1", "v1"];
        yield ["k2", "v2"];
        yield ["k3", "v3"];
      },
    });
    console.log(m0);
    console.log(m1);
    console.log(m2);
    // 打印结果
    Map(0) {}
    Map(2) { 'key1' => 'value1', 'key2' => 'value2' }
    Map(3) { 'k1' => 'v1', 'k2' => 'v2', 'k3' => 'v3' }
    ```
    
    - 如果传入的可迭代对象的迭代不是**键值对数组形式**，会因此报错
        - 只要保证迭代对象产生的是数组即可，不用强制要求是长度为2的数组
    - 一些非寻常的但不会报错的构造方式如下
        
        ```jsx
        const m3 = new Map([
          ["key1", "value1", 2],
          ["key2", "value2", 1],
        ]);
        console.log(m3);
        
        const m4 = new Map([["key1"], ["key2"]]);
        console.log(m4);
        
        const m5 = new Map([[,], []]);
        console.log(m5);
        // 打印
        Map(2) { 'key1' => 'value1', 'key2' => 'value2' }
        Map(2) { 'key1' => undefined, 'key2' => undefined }
        Map(1) { undefined => undefined }
        ```
        
        - 这说明键值对可以是空数组，且参数容许有重复键值对（但构造时只会保留一个）

## 4.1.2 `Map.prototype.set()`

- 在初始化后，可以使用`set()` 方法新增或修改键值对
- 语法
    
    ```jsx
    map.set(key, val);
    ```
    
    - 参数
    - `key` : 键
    - `val` ：值
    - 返回值：原始映射（键值对被更新）
- 时间复杂度$O(1)$.
- 更新规则：如果map中已存在这个键，就更新值为set的给定值；如果map中不存在这个键，就新增键值对
- 例子
    
    ```jsx
    const map = new Map();
    console.log(map.set(+0, 3)); // 新增
    console.log(map.set(-0, -3)); // 修改
    console.log(map.set(NaN, "NaN")); // 新增
    console.log(map.set(NaN, "nan")); // 修改
    // 打印
    Map(1) { 0 => 3 }
    Map(1) { 0 => -3 }
    Map(2) { 0 => -3, NaN => 'NaN' }
    Map(2) { 0 => -3, NaN => 'nan' }
    ```
    
- 通过例子可以得知，映射判断键是否存在的比较算法不是严格相等
- 因为NaN可以被识别，而+0和-0不被区分，所以是**同值零比较**，更多查看**[同值零比较 ](../../JavaScript%E5%B0%8F%E8%AE%A1/JavaScript%E4%B8%AD%E7%9A%84%E7%9B%B8%E7%AD%89%E6%80%A7%E5%88%A4%E6%96%AD.md)**

## 4.1.3 `Map.prototype.has()`

- 用于判断映射中是否存在参数给的键，存在判断使用**同值零比较**
- 语法
    
    ```jsx
    map.has(key)
    ```
    
    - 参数key：键，可以是任意类型的实例
    - 返回值：使用同值零判断是否存在键，存在就返回true，不存在就返回false
- 时间复杂度$O(1)$.
- 例子，使用上面创建的map
    
    ```jsx
    // 判断键 has
    console.log(map.has(0n)); // false
    console.log(map.has(NaN)); // true
    ```
    
    - `0n` 是`BigInt` 类型大整数类型，与`number` 不同，所以返回false
    - 同值零比较`NaN` 与`NaN`等同

## 4.1.4 `Map.prototype.get()`

- 用于获取映射中某一个键值
- 语法
    
    ```jsx
    map.get(key)
    ```
    
    - 参数key：键，可以是任意类型的实例
    - 返回值：键值，如果不存在就返回`undefined`
- 时间复杂度$O(1)$.
- 例子
    
    ```jsx
    // 获取键 get
    const map2 = new Map([["key"], ["key1", "value1"], []]);
    console.log(map2);
    console.log(map2.get("key"));
    console.log(map2.get("key1"));
    console.log(map2.get("k"));
    console.log(map2.get());
    console.log(map2.has());
    // 打印结果
    Map(3) {
      'key' => undefined,
      'key1' => 'value1',
      undefined => undefined
    }
    undefined
    value1
    undefined
    undefined
    true
    ```
    
    - 通过这个例子可以得出一个重要结论：`get()` 不能用于判断映射中是否含有某一键
    - 因为键和键值都可以是`undefined`
    - 如果`get()`和`has()` 不传递参数，默认查询的是映射中`undefined` 作为键的情况

## 4.1.5 删除API

- 删除键值对有两个API，分别删除单个和删除所有键值对

### 4.1.5.1 `Map.prototype.delete()`

- 删除单个单个键值对
- 语法
    
    ```jsx
    map.delete(key);
    ```
    
    - 参数key: 键值
    - 返回值:布尔值，如果映射中存在该键，则删除键值对，返回true；否则返回false
- 例子，使用上面例子的映射
    
    ```jsx
    // 删除单个
    console.log(map2.delete()); // true 
    console.log(map2); // Map(2) { 'key' => undefined, 'key1' => 'value1' }
    ```
    
    - 不传递参数默认删除`undefined` 作为键的键值对

### 4.1.5.2 `Map.prototype.clear()`

- 删除映射中的所有键值对
- 语法
    
    ```jsx
    map.clear()
    ```
    
    - 返回值 undefined
- 例子 使用上面的例子的`map2`
    
    ```jsx
    map2.clear();
    console.log(map2); // Map(0) {}
    ```
    

## 4.1.6 `Map.prototype.size`

- 实例属性，只读，返回映射的键值对个数

## 4.1.7 技巧

1. 因为`set()` 在被使用后返回原映射，所以可以将多个set连续起来操作到达批量增加键值对的功能，包括初始化声明
    
    ```jsx
    const map3 = new Map().set(1, 2).set(3, 4); 
    console.log(map3); // Map(2) { 1 => 2, 3 => 4 }
    map3.set(5, 6).set(7, 8).set(9, 10);
    console.log(map3); // Map(5) { 1 => 2, 3 => 4, 5 => 6, 7 => 8, 9 => 10 }
    ```
    
2. `Map`中的键和值可以使用JavaScript中的任何类型实例，这点与`Object` 的键只能使用数值、字符串、符号不同
    
    ```jsx
    console.log(
      new Map()
        .set(Symbol.iterator, function* () {
          yield 1;
          yield 2;
        })
        .set(function getName() {
          return "mangwu";
        }, "functionValue")
        .set(new Set([1, 2]), new Date())
    );
    // 打印
    Map(3) {
      Symbol(Symbol.iterator) => [GeneratorFunction (anonymous)],
      [Function: getName] => 'functionValue',
      Set(2) { 1, 2 } => 2022-08-30T09:08:12.421Z
    }
    ```
    
    - `Set` 是后面要介绍的一种集合类型
3. SameValueZero比较使得+0和-0一致，NaN等同；同时作为键或值的对象而言，它们被修改不影响`get()`, `set()`, `has()` 的判断和使用，因为实质的引用值未变，只是引用值指向的对象被改变了
    
    ```jsx
    const date = new Date();
    const arr = [1, 2];
    const map4 = new Map().set(date, arr);
    console.log(map4);
    // Map(1) { 2022-08-30T09:23:26.485Z => [ 1, 2 ] } 
    date.setTime(Date.parse("2022-08-30 12:00:22.456 GMT+0800"))
    arr.push(3)
    console.log(map4.get(date));
    // [1,2,3]
    ```
    
    - 可以看到无论`date`表示的时间如何变化，只要`date`这个引用值不变，不会影响到`get()` 的使用
    - 同时打印出的`arr` 仍然是原来的数组，只是`arr`指向的数组对象新增了一个元素

# 4.2 顺序与迭代

- `Map` 有三个方法获取迭代器对象
    - `Map.prototype.entries()`
    - `Map.prototype.keys()`
    - `Map.prototype.values()`
- `Map`有一个符号属性是迭代生成器对象
    - `Map.prototype[Symbol.iterator]`

## 4.2.1 迭代顺序

- 在讨论迭代API前，先考虑一下映射迭代对象中每个键值对的顺序问题
- 与`Object`不同的是，`Map`实例会维护键值对的插入顺序，而Object中键值对的迭代顺序和浏览器的实现有关系，一般而言
    - **`Map`**实例的迭代顺序就是键值对的插入顺序，先插入的先出，后插入的后被遍历；修改值不会影响迭代顺序，只有删除对应键值对后，重新插入相同键值对，该键值对才会拥有重新的插入顺序
    - `Object` 遍历顺序在浏览器中的实现各不相同，在node环境下的顺序如下：`for…in` 只遍历字符串和数字属性，数字属性优先遍历，且按照转换成字符串的字典顺序从小到大排序；然后遍历字符串属性，按照声明的顺序进行遍历（这点和`Map`实例类型）
- 例子
    
    ```jsx
    const obj = {
      get() {
        return 1;
      },
      [Symbol.isConcatSpreadable]: false,
      jh: 1,
      k: 1,
      b: 2,
      12: 7,
      1: 5,
      0: 6,
      3: 2,
      toString() {
        return 1;
      },
      [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
      },
    };
    obj["new"] = "new";
    obj.jh = "modify";
    for (const key in obj) {
      console.log(key);
    }
    const map = new Map().set("a", 1).set("b", 2).set("c", 3).set("d", 4);
    for (const [key, val] of map) {
      console.log(key, val);
    }
    map.set("c", "c3");
    map.delete("b");
    map.set("b", "b3");
    for (const [key, val] of map) {
      console.log(key, val);
    }
    // 打印结果
    0
    1
    3
    12
    get
    jh
    k
    b
    toString
    new
    a 1
    b 2
    c 3
    d 4
    a 1
    c c3
    d 4
    b b3
    ```
    
    - 对于对象，遵循先数字后字符串原则，数字按照字典排序后遍历，字符串按照声明顺序遍历
    - 对于`Map`实例，按照插入顺序遍历，如初始的`a b c d` ，后来修改了`c`的值，但不会影响顺序，然后删除`b` 后重新插入`b` 导致`b`的插入顺序在最后，所以遍历顺序变为了`a c d b`

## 4.2.2 `Map.prototype.entries()`

- 和`Array` ，定型数组的api类似，都返回一个迭代器对象，该迭代器对象包括以`[key, value]` 形式数组
- 需要注意的是`Map.prototype[Symbol.iterator]()` 符号属性同样可以返回一个迭代器对象，且功能相同，因为符号属性`@@iterator`和`entries` 属性指向**同一个迭代生成器方法**
- `entries()` 是默认迭代器，可以直接使用`for...of` 遍历映射（因为迭代器符号属性和`entries` 引用同一个迭代生成器方法）
- 例子
    
    ```jsx
    const map = new Map().set("a", 1).set("b", 2).set("c", 3);
    console.log(map.entries === map[Symbol.iterator]); // true 同一个迭代生成器
    for (const [key, val] of map.entries()) {
      console.log(key, val);
    }
    for (const [key, val] of map[Symbol.iterator]()) {
      console.log(key, val);
    }
    // 两个迭代打印相同，因为二种生成的迭代器功能相同
    ```
    

## 4.2.3 `Map.prototype.keys()/Map.prototype.values()`

- 二者分别返回以插入顺序生成键和值的迭代器
- 例子 使用上面的map
    
    ```jsx
    for (const key of map.keys()) {
      console.log(key);
    }
    for (const val of map.values()) {
      console.log(val);
    }
    ```
    
    - 按照[键值对的插入顺序](4%20Map.md)遍历

## 4.2.4 `Map.prototype.forEach()`

- 映射的实例遍历方法，通过传入回调依次迭代每个键值对，遍历的顺序一样是插入顺序
- 语法
    
    ```jsx
    map.forEach(callBack[, thisArg])
    ```
    
    - 参数
        - `callBack`: 回调函数，常以 `(value, key, map) => {}` 的形式传入，`value`是键值，`key`是键，`map`是原映射
        - `thisArg` : 指明回调函数的`this`指针，可选
    - 返回值 `undefined`
- 例子
    
    ```jsx
    map.forEach((v, k, _m) => {
      console.log(v, k);
    });
    // 打印的v,k顺序一样是插入顺序
    ```
    

## 4.2.5 技巧

1. 任何迭代对象都可以使用扩展操作符`…` ，所以可以通过扩展操作符将映射转换为键值对数组
    
    ```jsx
    const map2 = new Map().set("a", 1).set("b", 2).set("c", 3);
    console.log([...map2]); // [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]
    ```
    
2. 在使用迭代生成器方法生成的迭代器时，映射是可以修改的,但是最好不要使用`delete()`方法，这会导致插入顺序改变，进而改变迭代对象，可能造成死循环：
    
    ```jsx
    for (const [key, val] of map2.entries()) {
      map2.delete(key);
      map2.set(key, val + 1);
      console.log(map2);
      if (val == 100) {
        map2.clear();
      }
    }
    // 打印
    Map(3) { 'b' => 2, 'c' => 3, 'a' => 2 }
    Map(3) { 'c' => 3, 'a' => 2, 'b' => 3 }
    Map(3) { 'a' => 2, 'b' => 3, 'c' => 4 }
    Map(3) { 'b' => 3, 'c' => 4, 'a' => 3 }
    Map(3) { 'c' => 4, 'a' => 3, 'b' => 4 }
    ...
    Map(3) { 'c' => 100, 'a' => 99, 'b' => 100 }
    Map(3) { 'a' => 99, 'b' => 100, 'c' => 101 }
    ```
    
    - 上面的不断删除键值对，然后重新`set` 相当于新增键值对，导致迭代对象无限长，使用了一个判断条件进行退出，直接清除(`clear()`) 映射，从而避免死循环
    - 如果一定要删除键值对，可以使用**扩展操作符创建键值对数组**，遍历键值对数组，这样遍历的对象是固定的，遍历次数也就固定了
        
        ```jsx
        for (const [key, val] of [...map2]) {
          map2.delete(key);
          map2.set(key, val + 1);
          console.log(map2);
        }
        // 打印
        Map(3) { 'b' => 2, 'c' => 3, 'a' => 2 }
        Map(3) { 'c' => 3, 'a' => 2, 'b' => 3 }
        Map(3) { 'a' => 2, 'b' => 3, 'c' => 4 }
        ```
        

# 4.3 Object和Map比较

大多数Web开发者不必关系使用哪个更好，因为`Object`和`Map` 都能使用在大多数需要构建键值对的情况；

但是对于在乎内存和性能的开发者而言，对象和映射之间确实存在差异

1. **内存占用**
    - `Object`和`Map` 在不同浏览器中实现存在差异，无法具象给出具体的内存占用差异
    - 但是二者都遵循一个原则：**存储单个键值对所占用的内存会随键的数量线性增长**
    - 在给定**固定**大小的内存，Map大约可以比Object**多存储50%的键值对**
2. 插入性能
    - `Map`中插入新键值对**稍微**比`Object`快一点
    - 二者都遵循一个原则：**插入速度不会随着键值对数量而线性增加**
    - 如果代码涉及大量插入操作，显然`Map`性能更佳
3. 查找速度
    - 在大型键值对中进行查找，`Map`和`Object` 性能差异极小
    - 如果只包含少量键值对，`Object` 有时候速度更快，例如对于数组而言，浏览器引擎可以进行优化，在内存中使用更高效的布局
    - 二者都遵循一个原则：**查找速度不会随着键值对数量而线性增加**
    - 代码涉及大量查找操作，选择`Object`更佳
4. 删除性能
    - 对于大多数浏览器来说，`Map` 的`delete()` 操作比插入和查找更快
    - 因为`Object` 的`delete` 删除属性的**性能一直饱受诟病**，所以代码涉及大量删除操作一定要选`Map`
    - 当然，`Object` 也有一种伪删除对象属性的操作，就是将被删除的属性值设置为`undefined` 和 `null` ，这种伪删除的性能和插入性能一样，但是这是一种折中的讨厌的解决方案