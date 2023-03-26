# 2.3 RegExp实例方法

RegExp实例有三个方法，分别是RegExp.prototype.compile()、RegExp.prototype.exec()、RegExp.prototype.test(),其中第一个已被废弃，重要的是第二个实例方法

# RegExp.prototype.exec()

## 语法

- exec()是正则实例的主要方法，配合捕获组使用
    
    ```jsx
    reg.exec(str);
    ```
    
- exec()方法接受一个用于匹配模式的字符串参数
    - 如果找到匹配项就返回包含第一个匹配信息的数组
    - 如果没有找到匹配项，就返回null
- 返回的数组是Array实例，但是具有额外的属性
    - index: 字符串匹配模式的起始位置（从index位置开始匹配到满足正则表达式的子字符串）
    - input: 要查找的字符串
    - groups: 捕获组属性，如果没有显式命名捕获组就为undefined

### 捕获组

- 捕获组简单讲就是正则表达式中把使用括号包裹的子表达式匹配的内容保存在组中

[捕获组](2%203%20RegExp%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95/%E6%8D%95%E8%8E%B7%E7%BB%84.md)

## 返回值

- exec的返回值是一个数组，具有index, input, groups属性
- **数组元素的索引和捕获组的编号有关系：元素索引和捕获组编号一一对应**
    - 索引0对应捕获组编号0，元素是匹配整个模式的字符串
    - 后续的索引对应各个捕获组的编号，元素是表达式中捕获组匹配的字符串
    - 如果元素没有捕获组，则数组长度为1，只有整个模式匹配的字符串

### 例子

```jsx
const pattern3 = /(?<year>\d{4})-(?<date>(?<month>\d{2})-(?<day>\d\d))/;
console.log(pattern3.exec("2022-07-01"));
```

- 打印结果如下
    
    ```jsx
    [
      '2022-07-01',
      '2022',
      '07-01',
      '07',
      '01',
      index: 0,
      input: '2022-07-01',
      groups: [Object: null prototype] {
        year: '2022',
        date: '07-01',
        month: '07',
        day: '01'
      }
    ]
    ```
    
- 捕获组可以命名
- 捕获组的编号按照左括号的属性从左到右，从1开始编号‘

## exec()方法的状态

RegExp.prototype.exec()方法是有状态的，具体可以查看[如果设置了标志位为global或sticky](../../JavaScript%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%EF%BC%88RegExp%EF%BC%89.md) 

- 如果模式设置了全局标记（g）
    - 每次调用exec()方法会返回一个匹配信息
    - 这个匹配信息匹配的字符串的开始位置是**正则实例`lastIndex` 属性索引**
    - lastIndex初始为0，且不与任何字符串绑定，在匹配一次后就赋值当前字符串匹配的结束索引
    - 下一次匹配就以上一次匹配结束后的lastIndex属性开始位置进行匹配（不区分字符串）
    - 如果匹配结果为null，则重置lastIndex为0
- 如果模式没有设置全局标志
    - lastIndex始终是0
    - 每次只匹配字符串的第一个匹配信息

```jsx
const pattern9 = /(\d{4})-((?<month>\d{2})-(?<day>\d{2}))/g;
console.log(
	pattern9.lastIndex,
  pattern9.exec("2012-02-05, 2054-01-02"),
  pattern9.lastIndex,
  pattern9.exec("2012-02-05, 2054-01-02"),
  pattern9.lastIndex,
  pattern9.exec("2012-02-05"),
  pattern9.lastIndex,
  pattern9.exec("2012-02-05"),
  pattern9.lastIndex
);
```

- 打印结果
    
    ```jsx
    0 [
      '2012-02-05',
      '2012',
      '02-05',
      '02',
      '05',
      index: 0,
      input: '2012-02-05, 2054-01-02',
      groups: [Object: null prototype] { month: '02', day: '05' }
    ] 10 [
      '2054-01-02',
      '2054',
      '01-02',
      '01',
      '02',
      index: 12,
      input: '2012-02-05, 2054-01-02',
      groups: [Object: null prototype] { month: '01', day: '02' }
    ] 22 null 0 [
      '2012-02-05',
      '2012',
      '02-05',
      '02',
      '05',
      index: 0,
      input: '2012-02-05',
      groups: [Object: null prototype] { month: '02', day: '05' }
    ] 10
    ```
    
    - 可以看到每次匹配后，正则实例的lastIndex都会改变，初始为0，匹配后变为匹配结束时字符串的索引
    - 如果匹配信息为null, 则lastIndex会被重置为0

---

- 如果模式设置了粘附标记y
    - 每次调用exec()就只会在lastIndex的位置上寻找匹配项
    - 粘附标记会覆盖全局标记
- 粘附标记y与g的区别在于
    - 粘附标记y从lastIndex的位置上开始匹配，第一个字符必须匹配lastIndex索引处的元素
    - 而全局标记g，从lastIndex开始匹配，匹配的第一个字符索引可以在lastIndex后

```jsx
const pattern10 = /(\d{4})-((?<month>\d{2})-(?<day>\d{2}))/y;
console.log(
  pattern10.lastIndex,
  pattern10.exec("2012-02-05, 2054-01-02"),
  pattern10.lastIndex,
  pattern10.exec("2012-02-05, 2054-01-02"),
  pattern10.lastIndex,
  (pattern10.lastIndex = 12),
  pattern10.exec("2012-02-05, 2054-01-02"),
  pattern10.lastIndex
);
```

- 打印结果
    
    ```jsx
    0 [
      '2012-02-05',
      '2012',
      '02-05',
      '02',
      '05',
      index: 0,
      input: '2012-02-05, 2054-01-02',
      groups: [Object: null prototype] { month: '02', day: '05' }
    ] 10 null 0 12 [
      '2054-01-02',
      '2054',
      '01-02',
      '01',
      '02',
      index: 12,
      input: '2012-02-05, 2054-01-02',
      groups: [Object: null prototype] { month: '01', day: '02' }
    ] 22
    ```
    
    - 第一次可以匹配成功，因为从lastIndex(0)处开始正好有一个匹配项
    - 第二次从字符串逗号处开始匹配，因为第一个字符必须是逗号，无法进行匹配，所以返回null,重置lastIndex为0
    - 第三次匹配前指定了lastIndex的位置，所以能匹配成功

# RegExp.prototype.test()

## 描述

- 接受一个字符串参数
- 如果输入的文本与正则实例的模式匹配就返回true,否则返回false
- 只用于测试模式是否能匹配字符串，常用于条件语句中

## 例子

- 在条件语句中使用，常用于检查用户输入字符串是否符合要求
    
    ```jsx
    const text = "111-00-1111";
    const pattern = /\d{3}-\d{2}-\d{4}/
    if(pattern.test(text)) {
    	console.log("匹配成功")
    }
    ```
    

# 继承的方法

- toString()和toLocaleString()都返回正则表达式的字面量表示
    
    ```jsx
    const pattern2 = /(\d{4})-((\d{2})-(\d\d))/;
    console.log(pattern2.toString(), pattern2.toLocaleString());
    ```
    
    - 打印结果
    
    ```jsx
    /(\d{4})-((\d{2})-(\d\d))/ /(\d{4})-((\d{2})-(\d\d))/
    ```
    
- valueOf()返回正则表达式本身
    
    ```jsx
    const pattern10 = /(\d{4})-((?<month>\d{2})-(?<day>\d{2}))/y;
    console.log(pattern10.valueOf());
    ```
    
    - 打印结果
    
    ```jsx
    /(\d{4})-((?<month>\d{2})-(?<day>\d{2}))/y 
    // 不是字符串，而是正则表达式本身
    ```