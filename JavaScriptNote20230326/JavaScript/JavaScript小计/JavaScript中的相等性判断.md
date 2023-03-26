# JavaScript中的相等性判断

参考：[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) 

# JavaScript中4种相等性算法

1. 松散（不严格）相等比较（`==`），isLooselyEqual
2. 严格相等比较（`===`）,isStrictlyEqual, 被`Array.prototype.indexOf,` `Array.prototype.lastIndexOf` 和`case` 匹配 使用；
3. 同值零比较，`SameValueZero` 被定型数组和字节数组使用，包括`Map`和`Set` 在增减查数据时的操作，自ES2016来，也用于在`String.prototype.includes()`和`Array.prototype.includes()`中
4. 同值，SameValue，用于其它所有地方

# JavaScript中3种显式的比较操作

1. `===` ：严格相等比较
2. `==` ： 松散相等比较（非严格）
3. Object.is ： 同值比较 SameValue

### 三种比较方式的选择

- `==` 比较时会进行类型转换，并且特殊处理 +0 -0 NaN，这三个在比较时会以符合IEEE 754的格式进行比较，所以
    
    ```jsx
    +0 == -0; // true
    NaN != NaN; // true
    ```
    
- `===` 比较时不会进行类型，转换，如果两个比较对象类型不同会直接返回false；对于 + 0, -0, NaN和`==` 的处理是一样的
    
    ```jsx
    +0 === -0; // true
    NaN !== NaN; // true
    ```
    
- `Object.is` 比较时和`===` 一样不进行类型转换，类型不相同就会返回false；但是对于 +0, -0, NaN的处理如下
    
    ```jsx
    Object.is(+0, -0); // false
    Object.is(NaN, NaN); // true
    ```
    

### 相同点

- 上述的区别只对包含有**原始数据类型**的比较有效
- 对于两个非原始数据类型的相同类型变量，即使它们的结构相同，都会返回false
- `==` 的判断比较复杂，因为可以比较原始数据类型和非原始数据类型，例如
    
    ```jsx
    const a = {
    	valueOf() {
    		return "1";
    	}
    }
    console.log(a == true); // 返回true 
    // 这里做了两层转换
    // 先将对象转换为原始值
    // 再将字符串和布尔值转换位数字
    ```
    
    - `==` 比较时的类型转换原则可以查看[转换规则](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/5%207%20%E7%9B%B8%E7%AD%89%E6%93%8D%E4%BD%9C%E7%AC%A6.md)

# 严格相等使用===

- `===`称为全等操作符，用于比较两个值是否相等，比较前，两个值都**不进行**隐式类型转换
- 比较规则：
    1. 不同类型的值直接返回false
    2. 相同类型的值按值比较
    3. 对于非number类型的值，如果值也相同，二者全等，返回true
    4. 对于number类型的值，不包含+0, -0, NaN，则正常比较值，**数值相等**就返回true
    5. 对于特殊number类型的值，+0 和-0相等返回true, NaN和NaN被认为不是全等的，返回false
- 注意**数值相等 ⇒** number类型表示的值在**数学**上相等，不用考虑存储形式（32位或64位等）
    
    ```jsx
    var num = 0;
    var obj = new String("0");
    var str = "0";
    var b = false;
    console.log(obj === obj); // true
    console.log(num === obj); // false
    console.log(num === str); // false
    console.log(num === b); // false
    console.log(null === undefined); // false
    console.log(obj === null); // false
    console.log(obj === undefined); // false
    console.log(new Int32Array([1])[0] === new Int8Array([1])[0]); // true
    ```
    

### 使用建议

- 日常使用几乎总是**正确**的选择
- 对于除了数值之外的值，全等操作符的语义就是：一个值与自身相等
- 而对于数值，在语义上有两个特殊情况
    1. 浮点数的0是不分正负的，+0和-0在解决一些**数学问题**时，二者是有区别的，但是大部分情况不用关心
    2. **浮点数包含了NaN值**，用来表示某些定义不明确的数学问题的解，全等操作符认为NaN与其它任何值都不全等，包括其本身，所以 `x !== x` 为true的唯一情况就是x的值是NaN

# 非严格相等 ==

- JavaScript比较复杂的比较操作符，在比较前将两个被比较值转换为相同类型（`==`两边的值都可能被转换）
- 转换后的比较方式和 === 的比较方式相同（对特殊值的考虑也相同）
- 相等操作符满足交换率，即`a == b` 的结果和 `b == a` 的结果一样

## 转换规则

| A\B的类型 | Undefined | Null | Number | String | Boolean | Object |
| --- | --- | --- | --- | --- | --- | --- |
| Undefined | true | true | false | false | false | IsFalsy(B) |
| Null | true | true | false | false | false | IsFalsy(B) |
| Number | false | false | A===B | A===ToNumber(B) | A===ToNumber(B) | A==ToPrimitive(B) |
| String | false | false | toNumber(A) === B | A === B | toNumber(A)===toNumber(B) | toPrimitive(B) == A |
| Boolean | false | false | ToNumber(A) ===B | toNumber(A) === toNumber(B) | A===B | toNumber(A) == ToPrimitive(B) |
| Object | IsFalsy(A) | IsFalsy(A) | toPrimitive(A)==B | toPrimitive(A)==B | toPrimitive(A)==toNumber(B) | A===B |

### 注

1. `IsFalsy` 表示对象是否是一个`Falsy`值；
    1. 一般情况下（ECMAScript规范），所有的对象与undefined和null都不相等，即大部分情况下`obj == undefined` 或 `obj == null` 都是返回`false`
    2. 但是有些**浏览器**允许非常窄的一类对象充当`undfined`的角色，即当且仅当`obj` 能效仿`undefined` 时（`undefined`和`null` 对于 == 操作符是等同的）,`IsFalsy(obj)` 的值为`true` ；一个（且仅有这一个）有效的例子是所有页面中的`document.all` 对象
    3. 关于Falsy值的具体解释可以查看[Falsy](Falsy.md) 
2. `ToNumber()` 尝试将A或B转换为数字，`ToPrimitive` 尝试将A或B转换为原始值（只对对象使用）

## 文字规则

1. 操作数同类型，判断方式和`===`相同
    1. Object: 两个变量指向同一个引用才返回true
    2. String：由相同字符构成且字符顺序相同才返回true
    3. Number：除了NaN(返回false)，普通数组按照数学运算比较是否相同，注意 `+0==-0` 返回true，`Infinity`保证符号相同就返回true
    4. Boolean: 两个变量或字面量相同返回true
    5. BigInt: 在数学运算比较中相同就返回true
    6. Symbol: 两个符合指向同一个引用才返回true
2. 操作数是`null` 或 `undefined`, 除了`document.all` 对象，与其它不同类型（不是`Null`和`Undefined`）的操作数比较都返回false；二者的实现原理相似，所以`null == undefined` 返回true，可以说具有等同特性
3. 一个操作数是对象，另一个是原始数据类型，需要使用`ToPrimitive` 转换对象为原始数据类型，再通过原始数据类型规则进行比较，转换使用的方法包括：
    1. `@@toPrimitive()`  对象符号属性
    2. `valueOf()` 
    3. `toString()` 
    
    ---
    
    - 上述是从上到下是优先级顺序
    - 这种转换和加法操作符(`addtion`)一样
4. 最后一步是比较两个已被确定为原始数据类型（可以由对象转换而来）的操作数
    1. 如果是相同类型的原始数据类型，转到step1
    2. 如果一个原始数据类型是符号（`Symbol`），另一个不是，直接返回false
    3. 如果一个是布尔值，而另一个不是，将布尔值转换为数字（`true` ⇒ `1` `false` ⇒ `0`），然后继续下面的步骤（或者另一个是数字可以直接得到结果）进行比较
    4. 一个是数字，另外一个是字符串，使用`Number()` 将字符串转换为数字然后进行第一步的比较
    5. 一个是数字，一个是BigInt： 进行数学上的数值比较，如果数字是`±Infinity`或`NaN` 直接返回； 注意，`BigInt`没有正负零，只有`0n`， 但是`0n == +0` 和 `0n == -0` 均返回true
    6. 最后一种情况，一个字符串，一个`BigInt` 使用`BigInt()` 将字符串转换为大整型数字后进行比较 

## 例子

```jsx
console.log("==");
console.log(+0 == -0); // 同类型比较 true
console.log(NaN == NaN); // 同类型比较 false
console.log(Symbol.call == Symbol.call); // 同类型比较 true

console.log(null == undefined); // null和undefined特殊处理 true
console.log(null == {}); // false
console.log(null == ""); // false

console.log(
  {
    valueOf() {
      return 1;
    },
  } == 1
); // 对象先转换为原始值 再进行原始值比较 true
console.log({} == "[object Object]"); true

console.log(
  true ==
    {
      valueOf() {
        return 1;
      },
    }
); // 布尔值转换为数字再比较 true
console.log("123.4" == 123.4); // 字符串与数字 true
console.log("123.4" == 123n); // 字符串与BigInt false (BigInt不能转换小数)
console.log(0n == -0); // 数字与BigInt true
```

## 使用推荐

- 永远不要使用相等操作符（==）
- 非严格相等规则复杂，会进行类型转换，有时候开发者并不知道对象被转换为了何等原始值，所以结果往往是不可控的
- 全等操作符（===）结果更容易预测，更好使用

# 同值比较 Object.is()

- 同值比较即Same Value， 使用Object.is()作为比较的方式
- 其比较规则和严格相等（===）相似，唯一的区别在于对数字类型的处理上：
    - 对于`+0` 和 `-0` 严格相等判断二者全等，而同值比较判断二者不相等
    - 对于`NaN` ,严格相等判断`NaN`不等于任何值，包括它自己，但同值比较判断它等于自身，仍然不等于其他值
- 从本质上讲，同值比较就是确定两个值是否在任何情况下功能上是否相同
    - 数学上+0和-0是不相同的，所以二者不应该相等
    - `NaN` 在定义上是 不是数，所以在任何不是数的地方都可以使用，所以两个NaN是相同的

## 例子

```jsx
console.log(Object.is(new Int32Array([1])[0], new Uint8Array([1])[0])); // true
console.log(Object.is(+0, -0)); // false
console.log(Object.is(NaN, NaN)); // true
```

- 同值比较同样不关心数字（number）存储时占用的空间，在数学上是等同的就返回true
- 只有当`1n`和`1` 进行比较时才返回false，因为前者是`BigInt` 类型

# 同值零比较

- Same Value Zero 与同值比较一样唯一区别在于认为+0 和 -0一样
- 零值比较没有直接的操作符或函数，而是隐式的在`includes()` 方法，和Set，Map等方法中使用
    
    ```jsx
    console.log([NaN].includes(NaN));
    const set = new Set([NaN, -0]);
    console.log(set.has(NaN), set.has(+0));
    ```
    
    - `includes()` 使用同值零比较，所以数组中的NaN后传入的NaN视为相等
    - `Set` 不区分+0 和-0，也是因为使用同值零比较的原因