# 6.3.1 break和continue语句

ECMAScript和其它语言一样，为了退出或者提前结束本轮循环而设置了循环控制语句

# break语句

## 描述

- 使用在循环体中，用于立即退出循环，忽略循环体后的语句，立即执行循环体外后的下一条语句
- 退出循环表示改循环体的内容不再被执行，退出的是**语句所在作用域最近的循环体**，而不是外层包裹的其它循环

## 语法

### while语句中的break

```jsx
while(expression) {
	if(condition) {
		//
		break;
	}
}
```

- break通常和条件语句一起使用，表示再某种条件下提前退出循环

### for语句中的break

```jsx
for(initialization; expression; loop-expression) {
	if(condition) {
		break;
	}
}
```

### 嵌套循环的情况

```jsx
while(expression) {
	if(condition) {
		// 此条break;执行后跳出while循环，执行statement2
		break;
	}
	for(initialization; expression; loop-expression) {
		if(condition) {
			// 此条break;执行后，跳出for循环，执行statement1
			break;
		}
	}
	statement1;
}
statement2;
```

- break语句**默认跳出最近的循环体**

# continue语句

## 描述

- 和break语句一样，用于跳出循环体，但是**continue跳出的是本轮循环，而不是整个循环体**
- continue被执行后，默认跳出最近的循环体，但会**再次从循环顶部开始执行**

## 语法

- 和break;类似，只是跳出循环后需要再从循环顶部开始执行
    
    ```jsx
    while(expression) {
    	statement1;
    	if(condition) {
    		// 此条continue;执行后跳出while循环，执行statement1
    		continue;
    	}
    	for(initialization; expression; loop-expression) {
    		statement2;
    		if(condition) {
    			// 此条continue;执行后，跳出for循环，执行statement2
    			continue;
    		}
    	}
    }
    
    ```
    

## 例子

```jsx
let idx = 0;
let num = 0;
while (idx < 10) {
  if (idx % 5 == 0) {
    idx++;
    continue;
  }
  
  for (let i = 0; i < 10; i++) {
    if ((i + idx) % 5 == 0) {
      break;
    }
    num++;
  }
	idx++;
}
console.log(num); // 20
```

- 最终只执行了20下num++
- 分析：
    - idx == 0, 5时，while循环执行continue，直接跳过了num的自增
    - 所以idx只有[1,4], [6,9]时（9种情况）才有可能执行num的自增
        
        
        | idx | i | num自增次数 |
        | --- | --- | --- |
        | 1 | [0, 3] | 4 |
        | 2 | [0,2] | 3 |
        | 3 | [0,1] | 2 |
        | 4 | [0] | 1 |
        | 6 | [0,3] | 4 |
        | 7 | [0,2] | 3 |
        | 8 | [0,1] | 2 |
        | 9 | [0] | 1 |
        | 和值 |  | 20 |