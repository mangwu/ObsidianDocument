# 2.2 RegExp实例属性

# 描述

- RegExp引用类型的实例属性分为三种
    - 一种是可以在构造函数创建正则时就传递的模式(pattern)和标记（flags）
    - 一种时根据标志判断正则行为的标记布尔值
    - 最后一种就是跟匹配有关系的下一次匹配开始索引

# 所有实例属性

| 实例属性 | 解释 |
| --- | --- |
| global | 布尔值，表示是否设置了g标记 |
| ignoreCase | 布尔值，表示是否设置了i标记 |
| unicode | 布尔值，表示是否设置了u标记 |
| sticky | 布尔值，表示是否设置了y标记 |
| multiline | 布尔值，表示是否设置了m标记 |
| dotAll | 布尔值，表示是否设置了s标记 |
| source | 字符串，正则表达式中的模式（字面量构造正则实例中的pattern），和传递给构造函数的模式字符串不同 |
| flags | 字符串，标记字符串，如”ig” |
| lastIndex | 整数，只有在实例的global属性为true的情况时，才有意义，表示在源字符串中下一次搜索的开始位置，始终从0开始 |

# 例子

```jsx
// 正则表达式实例属性
let pattern1 = /\[bc\]at/i;

console.log(
  "跟标记有关的实例属性",
  pattern1.global,
  pattern1.ignoreCase,
  pattern1.multiline,
  pattern1.unicode,
  pattern1.sticky,
  pattern1.dotAll
);
console.log("跟正则表达式构造有关的实例属性", pattern1.source, pattern1.flags);
console.log("跟正则表达式匹配的开始索引有关的实例属性", pattern1.lastIndex);

let pattern2 = new RegExp("\\[bc\\]at", "i");

console.log(
  "跟标记有关的实例属性",
  pattern2.global,
  pattern2.ignoreCase,
  pattern2.multiline,
  pattern2.unicode,
  pattern2.sticky,
  pattern2.dotAll
);
console.log("跟正则表达式构造有关的实例属性", pattern2.source, pattern2.flags);
console.log("跟正则表达式匹配的开始索引有关的实例属性", pattern2.lastIndex);
```

- pattern1和pattern2的结果是一致的
- 打印结果如下（只展示pattern1的结果）
    
    ```jsx
    跟标记有关的实例属性 false true false false false false
    跟正则表达式构造有关的实例属性 \[bc\]at i
    跟正则表达式匹配的开始索引有关的实例属性 0
    ```