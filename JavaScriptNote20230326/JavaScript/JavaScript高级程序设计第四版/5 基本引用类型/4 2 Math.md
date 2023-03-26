# 4.2 Math

# 描述

- Math是ECMAScript规范提出宿主环境必须实现的**单例内置对象**
- Math是作为保存数学公式、信息和计算的地方
- Math对象提供了辅助计算的属性和方法

## 注意

- Math对象上提供的计算比直接直接在JavaScript中实现快的多
    - 例如`Math.pow()` 计算指数值，直接计算需要使用循环，而pow()方法又更高效的实现
- Math对象上的计算使用了JavaScript引擎中更高效的实现和处理器指令
    - 但是计算速度仍然由浏览器、操作系统、指令集和硬件而异

# 1.Math对象中的属性

- 保存数学中的一些特殊值，如圆周率等
    
    
    | 属性 | 值（大概） | 说明 |
    | --- | --- | --- |
    | Math.E | 2.718281828459045 | 自然对数的基数E的值,即$lim_{n\rightarrow∞}(1 + \frac 1 n)^n$ |
    | Math.LN10 | 2.302585092994046 | ln10的值，即以自然对数底E为底，10为真数的对数值，$log_e{10}$ |
    | Math.LN2 | 0.6931471805599453 | ln2的值，即以自然对数底E为底，2为真数的对数值，$log_e{2}$ |
    | Math.LOG2E | 1.4426950408889634 | 以2为底部，自然对数底E为真数的值，$log_2{e}$ |
    | Math.LOG10E | 0.4342944819032518 | 以10为底部，自然对数底E为真数的值,$log_{10}{e}$ |
    | Math.PI | 3.141592653589793 | 圆周率π的值 |
    | Math.SQRT1_2 | 0.7071067811865476 | 1/2的平方根，即$\frac {\sqrt 2} 2$ |
    | Math.SQRT2 | 1.4142135623730951 | 2的平方根，即$\sqrt 2$ |

# 2. Math对象的方法

- Math对象中的方法可以直接传入参数使用，无需新建实例
- Math对象中的方法大都是静态方法

## 2.1 min()与max()

- 最大和最小值方法
- 用于确定一组数值中的最大值和最小值
- 语法
    - 接受任意多个参数，每个参数都应该是数值，或者能转化成数值
    - 返回参数中的最大值或最小值
- 例子
    
    ```jsx
    console.log(Math.max(4,2,8,9)); // 9
    console.log(Math.min(4,2,8,9)); // 2
    ```
    
- 如果有一组数组需要求最大和最小值，可以利用min()和max()，再结合扩展操作符，避免使用额外的循环或if语句来计算最大和最小值
    
    ```jsx
    let values = [5,8,9,6,3,1,2,4,12,54,23,6,5,85,47,5,2,6]
    console.log(Math.max(...values)); // 85
    console.log(Math.min(...values)); // 1
    ```
    
    - 这对需要比较的数量较多且不确定的一组数很有用，适合用于获取数组中的最大和最小值
    - 还有通过apply()函数的另一种写法,关于apply()可以查看[apply使用](../../JavaScript%E5%B0%8F%E8%AE%A1/concat%E5%92%8Capply.md)
    
    ```jsx
    console.log(Math.min.apply(null, values));
    console.log(Math.max.apply(null, values));
    ```
    

### 注意

- 如果传入的参数不是数值且无法进行比较，min()和max()会返回`NaN`
    
    ```jsx
    Math.max("25","26"); // 26
    Math.max("str", [5,6]); // NaN
    ```
    
- 不传入任何参数，min()默认返回`Infinity`,max()默认返回`-Infinity`
    
    ```jsx
    console.log(Math.max()); // -Infinity
    console.log(Math.min()); // Infinity
    ```
    
    - 初始min()函数是将传入参数和Infinity进行比较的，所以返回Infinity
    - 初始max()函数是将传入参数和-Infinity进行比较的，所以返回-Infinity
    - 可查看[ecma262规范](https://tc39.es/ecma262/#sec-math.max)的实现原理得知道

## 2.2 舍入方法

- 把小数值舍入为整数的4个方法：Math.ceil(), Math.floor(), Math.round(), Math.fround()

### Math.ceil()

- 语法
    - 传入一个参数，数值类型
    - 返回舍入后的整数
- 舍入规则：
    - 始终向上舍入
    - 假设传入参数为x，舍入结果为y，始终向上舍入就是保证 `y >= x === true` 且y为整数
- 通过舍入规则可得知
    - 如果x为整数，则返回结果就是x
    - 如果x为正小数，则返回就是x取整数部分加1的结果（向上取整）
    - 如果x为负小数，则返回的就是x取整数部分的结果（保留符号）
- 例子
    
    ```jsx
    // ceil()
    console.log(Math.ceil(2.3)); // 3
    console.log(Math.ceil(0.5)); // 1
    console.log(Math.ceil(-0.5)); // -0
    console.log(Math.ceil(-3.5)); // -3
    console.log(Math.ceil(-5)); // -5
    ```
    

### Math.floor()

- 语法和Math.ceil()，一样，传入数值类型，返回舍入后的整数
- 舍入规则
    - 始终向下舍入
    - 假设传入参数为x，舍入结果为y，始终向下舍入就是保证 `y <= x === true` 且y为整数
- 通过舍入规则可得知道
    - 如果x为整数，则返回结果就是x
    - 如果x为正小数，则返回结果就是x取整数部分的结果（向下取整）
    - 如果x为负小数，则返回结果就是x取整数部分（保留符号）后减去1的结果
- 例子
    
    ```jsx
    // floor()
    console.log(Math.floor(2.3)); // 2
    console.log(Math.floor(0.5)); // 0
    console.log(Math.floor(-0.5)); // -1
    console.log(Math.floor(-3.5)); // -4
    console.log(Math.floor(-5)); // -5
    ```
    

### Math.round()

- 语法和Math.ceil()，一样，传入数值类型，返回舍入后的整数
- 舍入规则
    - 对于正数，四舍五入
        - 如果小数第一位部分大于4，则向上取整数
        - 如果小数第一位部分小于5，则向下取整数
    - 对于负数,五舍六入
        - 如果小数第一部分大于5，则向下取整数
        - 如果小数第一位部分小于6，则向上取整数
- 根据规则可知
    - 如果x为整数，返回结果就是x
    - 如果x为正小数，遵循四舍五入原则，取整数部分，如果第一位小数大于4，则整数部分加1返回，否则直接返回整数部分
    - 如果x为负小数，遵循五舍六入原则，取整数部分（保留符号），如果第一位小数大于5，则整数部分减1返回，否则直接返回整数部分
- 例子
    
    ```jsx
    // round()
    console.log(Math.round(2.3)); // 2
    console.log(Math.round(0.5)); // 1
    console.log(Math.round(-0.5)); // -0
    console.log(Math.round(-3.4)); // -3
    console.log(Math.round(-5.6)); // -6
    ```
    

### Math.fround()

- fround()方法与上述的三个方法不同，它将传入的数字转化为离数字最近的单精度（32位）浮点数
- 使用场景
    - JavaScript内部使用64位的双浮点数字，支持很高的精度
    - 但是有时候又需要使用32位的浮点数字，例如从一个Float32Array读取值时会产生混乱
    - 一个相同的小数，使用64位浮点和32位浮点表示时，二者比较不相等
- 为了解决64位与32位的使用混乱，Math,fround()就是将64位浮点转换为32位浮点的方法
    - 在内部JavaScript继续把这个数字看为64位浮点数
    - 处理时，仅仅将尾数部分的第23位执行“**舍入到偶数**”的操作，并在后续尾数设置0
    - 如果64位浮点数大小超过32位浮点数能表示的范围，则返回Infinity或-Infinity
- 例子
    
    ```jsx
    // fround()
    console.log(Math.fround(1.5), Math.fround(1.5) == 1.5);
    console.log(Math.fround(1.337), Math.fround(1.337) == 1.337);
    console.log(Math.fround(2 ** 150), 2 ** 150);
    console.log(
      Math.fround(0.1 + 0.2),
      Math.fround(0.3),
      Math.fround(0.1 + 0.2) == Math.fround(0.3),
      0.1 + 0.2 == 0.3
    );
    // 打印结果
    1.5 true
    1.3370000123977661 false
    Infinity 1.42724769270596e+45
    0.30000001192092896 0.30000001192092896 true false
    ```
    
    1. 32位精度的1.5和64位精度的1.5相等，因为1.5可以在使用二进制的数字系统精确表示：$2^0 + 2^{-1}$
    2. 32位精度的1.337和64位精度的1.337不相等，因为1.337无法在二进制数字系统中精确表示：$2^0 + 2^{-2} + 2^{-4} + 2^{-6} ...$
    3. $2^{150}$ 数值可以使用64位表示，但是32位精度的浮点数无法表示，所以返回Infinity
    4. 因为0.1，0.2在二进制数字系统中**不能精确**表示，使用64位精度保存的0.1和0.2相加结果实际上是两个接近0.1和0.2数字相加的结果，同时0.3也不能在二进制数字系统中精确表示，所以`0.1 + 0.2 == 0.3` 的结果为false，更多解释可以参考[掘金](https://juejin.cn/post/6844903680362151950) 和 [简书](https://www.jianshu.com/p/a0d434d7bad1)
        - 但是如果将0.1和0.2转化为32位精度
        - 精度变低的好处在于，二者相加的结果就是32位精度最接近0.3的结果
        - 同时将64位的0.3转化为32位精度（最接近0.3的32位精度结果），这种”不精确”的比较反而能比较出二者是相等的

## 2.3 random()方法

### 语法

- Math.random()调用
- 返回一个在[0, 1) 范围内的随机数，包含0，不包含1

### 场景

- 使用Math.random()可以生成安全整数范围内的任意随机整数
- 常用于随机选取数组中的任意一个元素

### 随机整数

- 如果想要获取[x, y]  (x < y且x，y为整数)范围内的任意整数，可以通过数学计算将Math.random()得到的值对应到[x, y]上
- Math.random()能生成[0, 1)的随机数，那么乘上 y - x + 1就能生成[0, y-x+1)的随机数了
- 再将[0, y-x+1)之间的随机数加上x，就能获取到[x, y-x+1)之间的随机数
- 最后使用Math.floor()将随机数取整，就相当于获取到[x,y]之间的随机整数了

```jsx
// random()
/**
 * @description 生成[fromVal, endVal]范围内的随机整数
 * @param {number} fromVal 开始数字
 * @param {number} endVal 结束数字
 * @returns {number}
 */
const getRandomSpecaifedRangeInt = (fromVal = 0, endVal = 1) => {
  const m = endVal - fromVal + 1;
  return Math.floor(Math.random() * m) + fromVal;
};
let random = getRandomSpecaifedRangeInt(25, 50);
while (random !== 36) {
  random = getRandomSpecaifedRangeInt(25, 50);
  console.log(random);
}
// 可能的打印结果
40
34
47
42
36
```

- 上述循环平均需要执行26次才会结束循环

## 2.4 其它方法（涉及数学运算）

$x$

| 方法 | 说明 |
| --- | --- |
| Math.abs(x) | 返回x的绝对值 |
| Math.exp(x) | 返回Math.E的x次幂 |
| Math.expm1(x) | 等于Math.exp(x) - 1 |
| Math.log(x) | 返回x的自然对数，即In(x) |
| Math.log1p(x) | 等于1 + Math.log(x), 即In(x) + 1 |
| Math.pow(x, power) | 返回x的power次幂，即$x^{power}$ |
| Math.hypot(…nums) | 返回nums中每个数平方和的平方根，即$\sqrt {nums[0]^2 + nums[1]^2 + ... + nums[n-1]^2}$ |
| Math.clz32(x) | 返回32位整数x的前置0的数量（包括符号位） |
| Math.sign(x) | 返回表示x符号的1、0、-0或、-1;如果是正数就返回1，负数就返回-1；如果是0，分为正0和负0，正0返回0，负0返回-0 |
| Math.trunc(x) | 返回x的整数部分、删除所有小数（没有向上、向下取整或四舍五入的规则，直接取包括符号位的整数部位并返回） |
| Math.sqrt(x) | 返回x的平方根（传入负数会返回NaN） |
| Math.cbrt(x) | 返回x的立方根，即$^3\sqrt {x}$ |
| Math.acos(x) | 返回x的反余弦, 范围[-1,1],超出范围返回NaN |
| Math.acosh(x) | 返回x的反双曲余弦 |
| Math.asin(x) | 返回x的反正弦, 范围[-1, 1],超出范围返回NaN |
| Math.asinh(x) | 返回x的反双曲正弦 |
| Math.atan(x) | 返回x的反正切 |
| Math.atanh(x) | 返回x的反双曲正切 |
| Math.atan2(y,x) | 返回y/x的反正切 |
| Math.cos(x) | 返回x的余弦 |
| Math.sin(x) | 返回x的正弦 |
| Math.tan(x) | 返回x的正切 |
- 这些方法的精度根据实现Math对象的JavaScript引擎而定
- 基数ECMA-262规范了这些方法，但具体的实现仍然需要看具体的宿主环境