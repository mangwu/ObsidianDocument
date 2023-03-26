# 6.1.2 switch语句

和if语句一样，同属于条件语句，是一种应用在可枚举情况下的**流控制语句**

## 描述

- switch语句是ECMAScript从其它语言中借鉴而来，和C语言相似
- 通过对一个可枚举的变量进行判断，执行不同的语句
- 每个语句块结束都需要`break;`语句，除了`default` 默认执行的语句

## 语法

```jsx
switch (expression) {
    case value1:
			doSomething(value1);
      break;
    case value2:
			doSomething(value2);
      break;
		...
    case valuen:
			doSomething(valuen);
      break;
    default:
      doSomething();
  }
```

- expression的结果可以是value1-valuen中的任意一值，不是就默认执行default中的语句
- 每个case就是一个条件，对比if语句，相当于 `expression === value`
- 每个case中的语句块最后一个语句需要使用`break;`退出匹配，否则会继续向下匹配条件
    - 如果需要向下继续匹配，可以不写`break;`
- default关键字用于在没有任何条件满足的情况下默认执行的语句（相当于else）

## 特性

ECMAScript的switch有其它不一样的优势

1. switch语句中的expression结果可以是任何数据类型（一些语言中只能是数值）
2. case的条件值可以不用是一个常量（字面量），可以是变量和字面量组成的表达式，只要表达式能有效执行即可
- 注意，switch语句在比较expression和case的value值时，使用的是**全等操作符（===）**