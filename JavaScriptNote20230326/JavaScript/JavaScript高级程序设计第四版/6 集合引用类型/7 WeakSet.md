# 7. WeakSet

# 7.1 描述

> **弱集合（WeakSet）**对象允许你将*弱保持（弱引用）***对象**存储在一个集合中
> 

## 7.1.1 特性

- 和`Set` 的相同点
    - 保存在`WeakSet` 实例中的每个都独一无二，不可重复
- 和`Set` 的区别
    - `WeakSet` 实例只能保存对象，不能像`Set` 一样保存JavaScript中任何类型的值
    - `WeakSet` 实例保存的对象的引用（references）是弱保持的（*held weakly*）；如果一个在弱集合中的对象在外部没有任何引用，那么这个在弱集合中的对象随时都会被垃圾回收程序处理
    - 弱集合的弱意味着，`WeakSet` 是动态变化，不可枚举的（*enumerable*）,弱集合实例不可迭代也不能生成当前保存对象的列表

# 7.2 基本API

- 和`Set` 类似，因为弱集合中的元素不可预测，所以没有`clear()` 方法和`size` 属性

## 7.2.1 创建

- 构造函数可以不传递参数，构造一个空的弱集合
- 也可以传递可迭代对象，初始化弱集合
- 注意可迭代对象中迭代元素应该只能是对象（否则报`TypeError`错误）

```jsx
// 创建弱集合
try {
  const ws = new WeakSet([{ a: "1" }, 2]);
} catch (error) {
  console.log(error.message); // Invalid value used in weak set
}

const ws = new WeakSet({
  [Symbol.iterator]: function* () {
    yield { a: 1 };
    yield { b: 1 };
    yield { c: 1 };
  },
});
console.log(ws); // WeakSet { <items unknown> }
```

- 第一个初始化时迭代对象中的迭代元素包含数值，不是对象，报错
- 打印第二个集合，是看不到当前的元素的

## 7.2.2 添加 查询 删除

- `WeakSet.prototype.add()` 添加一个对象到集合中，添加后返回原弱集合
- `WeakSet.prototype.has()` 判断集合中是否有该对象，返回true或false，使用同值零比较（实际上这个和全等比较没有区别了，因为不用比较数值）
- `WeakSet.prototype.delete()` 删除集合中的一个对象， 删除成功返回true，否则返回false（弱集合中没有该对象）

```jsx
let obj1 = {};
let obj2 = {};
let obj3 = {};

const ws = new WeakSet([obj1, obj2, obj3]);
console.log(ws.has(obj1)); // true
console.log(ws.add(obj1)); // WeakSet { <items> unknown }
console.log(ws.delete(obj2)); // true
console.log(ws.has(obj2)); // false
```

# 7.3 弱值

- `WeakSet` 中的弱指集合”弱弱地拿着“， 意思就是这些值不属于正式地引用，不会阻止垃圾回收
- 例子， 和`WeakMap` 的例子类似
    
    ```jsx
    const container = {
      value1: { a: 1 },
      value2: { a: 2 },
    };
    const ws = new WeakSet().add(container.value1).add(container.value2);
    
    function removeRef() {
      // 移除引用
      container.value1 = null;
    }
    
    removeRef();
    
    // ws中的value1之后会被垃圾回收，value2外部还有引用，不会被回收
    ```
    
    - `container` 对象维护一个弱集合值对象的引用
    - 调用`removeRef()` 后，摧毁了`value1` 的引用，垃圾回收程序会回收这个值对象，`ws` 会减少一个元素
    - 而`value2` 仍然在`container`中具有引用，弱集合中的`value2` 暂时不会被回收

# 7.4 不可迭代值

- 和`WeakMap` 一样的原因
    1. `WeakSet` 中的值任何时候都可能被销毁，对于动态和不可预测的集合，它应该是不可枚举的
    2. 不可枚举的`WeakSet` 自然没必要提供迭代值的能力，所以也用不着`clear()` 这样的方法
    3. 即使代码可以查询`WeakSet` 实例中的值，也不能看到其中的全部内容
- 只能使用对象作为值的原因
    - 保证只有值对象的引用才能取得值
    - 如果允许原始值，就没有办法区分初始化时使用的字符串字面量和之后使用的是否是一个相等的字符串了

# 7.5 应用场景

- 相交于弱映射，弱集合的应用有限，不过和`WeakMap` 一样可以给对象打标签
- 例子
    
    ```jsx
    // 使用弱集合的应用
    const disableEles = new WeakSet();
    const loginButton = document.querySelector("#login");
    
    // 通过加入对应集合，给这个节点打上禁用标签
    disableEles.add(loginButton);
    ```
    
    - 通过查询`disableEles`就能得知元素是否被禁用
    - 如果元素从DOM树中被删除，假设其它地方没有该元素的引用，那么弱集合中的这个元素会被垃圾回收
    - 如果使用 `Set` ，元素不会被回收，可能造成内存泄漏