# 3.2 Number

# 描述

- Number包装类型是对应数值的引用类型

# 语法

```jsx
let numObj = new Number(primaryNumber: number);
```

- 在Number构造函数中传入一个数值
- 返回一个包装的引用类型实例

# 方法

## 继承的方法

- 重写了valueOf()和toLocaleString(), toString();

### valueOf()

- 返回Number对象实例表示的原始数值

### toString()

- 接受一个表示进制的基数，并返回相应基数形式的数值字符串
    
    ```jsx
    let numObj = new Number(10);
    console.log(numObj.toString()); // "10"
    console.log(numObj.toString(2)); // "1010"
    console.log(numObj.toString(8)); // "12"
    console.log(numObj.toString(10)); // "1010"
    console.log(numObj.toString(16)); // "a"
    ```
    

### toLocaleString()

- 返回10进制的美式数字格式的字符串
    - 美式数字格式：三位一个逗号隔开；小数点保留3位
    
    ```jsx
    const num = 1225.35688;
    const numObj = new Number(num);
    // 继承的方法被重写
    console.log(numObj.valueOf(), numObj.toLocaleString(), numObj.toString(16));
    ```
    
    - 打印结果`1225.35688 1,225.357 4c9.5b5c7cd898c`

## Number类型提供的方法

- 包装类型提供了几个用于将数值格式化为字符串的方法

### toFixed()

- 语法
    
    ```jsx
    num.toFixed(digits);
    ```
    
    - digits表示数字保留的位数,范围[0, 20]
    - 返回保留了指定位数的数值字符串
- 例子
    
    ```jsx
    const num2 = 12.25;
    console.log(num2.toFixed(), num2.toFixed(1), num2.toFixed(2), num2.toFixed(3)); 
    // 12 12.3 12.25 12.250
    ```
    
    - 从返回值可以发现toFixed()方法的特性
        - 默认为0，返回整数的字符串
        - 如果数值本身的小数位超过了参数指定的位数，则**四舍五入**到最接近的小数位
        - 如果数值的小数位小于参数指定的位数，则补上若干0到达指定的小数位
- toFixed()常用来处理货币，但是注意浮点数数学计算不一定会得到精确的结果

### toExponential()

- 语法和toFixed的类似
    - 输入范围为[0, 20]的保留位数
    - 返回科学计数法（指数计数法）表示的数值字符串
    - 其中保留位数为科学计数法中的前面小数的位数
- 例子
    
    ```jsx
    const num3 = 15387814524.215;
    console.log(
      num3.toExponential(),
      num3.toExponential(1),
      num3.toExponential(2),
      num3.toExponential(3),
    	num3.toExponential(15)
    );
    // 打印结果
    1.5387814524215e+10 1.5e+10 1.54e+10 1.539e+10 1.538781452421500e+10
    ```
    
    - 不传递值时，保留可能的最多位数
    - 同样使用四舍五入的方式进行小数取舍
    - 多余位数补0

## toPrecision()

- 语法和toFixed类似
    - 输入范围为[1, 21]
    - 返回指定位数最合理的输入结果，可以是toExponential()的科学计数法，也可以是toFixed()的位数补齐
- 例子
    
    ```jsx
    const num4 = 555;
    console.log(
      num4.toPrecision(),
      num4.toPrecision(1),
      num4.toPrecision(2),
      num4.toPrecision(3),
      num4.toPrecision(4),
      num4.toPrecision(5)
    );
    // 555 6e+2 5.6e+2 555 555.0 555.00
    ```
    
    - 不传递值，默认返回toString()的结果
    - 传递1，使用一位表示555，则必须使用科学计数法，得到6e+2 即600，采用四舍五入的方式得到结果
    - 传递2，用两位表示555，同样使用科学计数法，得到5.6e+2 即560，采用四舍五入的方式得到合理的结果
    - 传递的值大于3时，就可以返回和toFixed()一样的结果了，因为这时能准确表示值了，只需要补0即可

### 静态方法

- ES6新增方法，Number.isInteger()和Number.isSafeInteger()

**Number.isInterger()**

- 用于辨别一个数值是否保存为整数,传入数值，返回布尔值
- 一个数有小数位不一定不是整数，如果小数位都是0，则会被认为是整数
    
    ```jsx
    console.log(Number.isInteger(5.0), Number.isInteger(5.00001)); // true false
    ```
    

**Number.isSafeInteger()**

- 在阐述JavaScript的数值类型时理清过，IEEE754数值格式有一个特殊的数值范围
    - `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`
    - `[-9007199254740991,9007199254740991]`
    - $[-2^{53} + 1, 2^{53} - 1]$
    - 超出这个范围的数字，即使尝试保存为整数，IEEE754编码无法确定二进制值会正确表示，可能保存的是一个完全不同的数值
- 使用Number.isSafeInteger()可以判断保存的数值是否是一个编码能正常表达的**安全整数**

# 建议

- 不要使用创建Number包装类型的对象
- Number对象为数值提供了一些重要的能力（如格式化数字的方法）
- 因为原始值同样可以通过后台临时创建的Number对象实例调用上述的方法，所以不必使用Number创建引用对象，避免混淆
- 原始值和引用值的区别和Boolean的一样，使用typeof判断时不同，使用instanceof判断为Number类型时不同