# 6.2.1while语句

ECMAScript中的while语句包括两种，先测试后循环的语句和后测试，先循环的语句，分别使用while和do-while

# do-while

## 描述

- 后测试先循环的语句，**循环的内容至少被执行一次**
- 循环体中的代码被执行后再对退出条件进行求值判断

## 语法

```jsx
do {
	statement
} while (expression);
```

- 一般不省略语句块的大括号
- 如果省略，statement通常只有一行，且和do在同一行

## 例子

```jsx
let idx = 0;
do idx++;
while (idx < 0);

console.log(idx); // 1
```

- 因为后测试先循环，所有至少被执行一次，即使一开始不满足条件，也需要在循环一次之后再对退出条件进行执行判断

# while

## 描述

- 先测试后循环的语句，需要先检测退出条件，再执行循环体内的代码
- **循环体内的代码可能不会被执行**

## 语法

```jsx
while(expression) statement
```

## 例子

```jsx
let idx = 1;
while (idx > 1) {
  idx--;
  console.log("执行了循环体"); // 不会被执行
}
console.log(idx);
```