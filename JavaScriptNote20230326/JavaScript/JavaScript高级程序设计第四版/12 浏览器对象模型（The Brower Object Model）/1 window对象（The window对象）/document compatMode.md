# document.compatMode

表明当前文档的渲染模式是怪异模式/混杂模式还是标准模式

[3.文档模式](../../2%20HTML%E4%B8%AD%E7%9A%84JavaScript.md) 中提到的文档模式信息

| 英文 | 中文 | 描述 |
| --- | --- | --- |
| Quirks mode | 怪异模式，混杂模式 | 省略文档开头的doctype声明作为文档标准的开关 |
| Standard mode | 标准模式 | 使用doctype声明文档遵守的html标准，包括严格的HTML4.01，严格的XHTML1.0和正式的HTML5（<!DOCTYPE html>） |
| almost standard mode limited-quirks mode | 准标准模式 | 包括过渡性文档类型（Transitional）和框架集文档类型（Frameset），与标准模式非常接近 |

**语法**

```jsx
let mode = document.compatMode
```

**值**

`mode` 是一个枚举值（enumerated value），可能为

- “BackCompat”：文档为怪异模式
- “CSS1Compat”：文档不是怪异模式，意味着文档处于标准或准标准模式

<aside>
💡 注意：现在，这些模式都被标准化了，准标准模式已经和标准模式相同，而标准模式成为了默认表现。标准模式和准标准模式这两个名字失去了意义，不再在规范文档中出现

</aside>