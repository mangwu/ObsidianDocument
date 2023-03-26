# 6. Set

# 6.1 基本API

- `Set`和`Map`类似，新增，删除，清除的方法名称类似，甚至创建的方式也类似
- 因为`Set` 就是创建一个具有不同重复值的集合，相当于`Map` 只有键的情况

## 6.1.1 创建

- 和`Map` 一样，可以创建一个空集合，也可以传递可迭代的对象初始化集合
- 和`Map` 一样，使用**同值零比较,**不区分+0，-0 和NaN，如果可迭代对象有重复值会自动去重
    
    ```jsx
    const set = new Set([+0, -0, NaN, NaN]);
    console.log(set);
    // Set(2) { 0, NaN }
    ```
    

## 6.1.2 API

- 基本API和`Map` 一致，只是将`set` 方法改为了`add`
1. `Set.prototype.has()` 判断`Set` 实例中是否包含某个值
2. `Set.prototype.add()` 增加集合中的元素，如果有重复就不会增加
    - 语法
        
        ```jsx
        set.add(val)
        ```
        
        - 参数 val：增加的值
        - 返回值：调用的对象
3. `Set.prototype.delete()` 删除集合中的某个元素，有就删除并返回`true`，否则不做任何操作返回`false`
4. `Set.prototype.clear()` 清除集合中的所有元素
5. `Set.prototype.size` 返回`Set` 实例中元素的个数
- 例子
    
    ```jsx
    const set = new Set().add(0).add(-0).add(NaN).add("1");
    console.log(set);
    console.log(set.has(NaN));
    console.log(set.delete(NaN));
    console.log(set.size);
    set.clear();
    console.log(set);
    // 打印
    Set(3) { 0, NaN, '1' }
    true
    true
    2
    Set(0) {}
    ```
    

# 6.2 顺序与迭代

## 6.2.1 顺序

- 与`Map` 一样，按照插入时的顺序迭代
- `delete()` 后再重新添加值会更新插入顺序

## 6.2.2 迭代

- 与`Map`一样有三个迭代器和一个迭代符号属性
- 其中`values()` 和`keys()` 生成功能一样的迭代器对象，是默认迭代器，即`Set` 的迭代器属性也是同样的迭代生成器
1. `Set.prototype.values()/keys()` 返回集合中所有元素的迭代器，迭代顺序为插入顺序
2. `Set.prototype[Symbol.iterator]()` 同上
3. `Set.prototype.entries()` 返回的迭代器中包含两个元素的数组，这两个元素是集合中每个值的重复出现
4. `Set.prototype.forEach()` 使用回调函数的迭代方法，回调函数格式为`(val, subval, set) ⇒ {}` val和subval是一样的
- 例子
    
    ```jsx
    // 迭代
    // 顺序为插入顺序
    const set = new Set().add(0).add(1).add(2);
    // 使用keys()一样
    for (const val of set.values()) {
      console.log(val); // 0 1 2
    }
    // 删除后添加会更新顺序
    set.delete(1);
    set.add(1);
    for (const [val, subval] of set.entries()) {
      console.log(val, subval); // 相同的值
    	// 0 0  2 2  1 1
    }
    // 使用回调的迭代方法
    set.forEach((val, subval, _set) => {
      console.log(val, subval);
    	// 0 0  2 2  1 1
    });
    ```
    

## 6.2.3 技巧

- `Set` 是可迭代的，可以使用扩展操作符转换为数组
- 值如果是对象，修改对象属性不会影响其作为集合值的身份

# 6.3 定义正式集合操作

- `Set`和`Map` 很相似，很多开发者都喜欢使用`Set` ，简单，不重复，可快速查找添加
- 但是`Set` 的缺点也很明显，单个集合只能针对自身元素进行操作，对于多个集合之间的关系做不到很好的处理，例如合并两个或多个集合，求两个或多个集合的交集，差集等
- 显然，可以通过集合自有的`has()` ，`add()` 和相应的迭代方法求出新的交集，并集等，当每次都需要写迭代代码，这很不方便
- 所以可以子类化`Set`，或者定义一个实用的函数库；直接适用包装好的方法即可
- 假设需要定义一个`XSet` 继承于`Set` 但是有自己的合并，交集等方法

## 6.3.1 XSet基本定义

- 继承于`Set` 就能获得`Set`的构造和实例方法，属性
    
    ```jsx
    class XSet extends Set {
    
    }
    ```
    

## 6.3.2 求并集

- 语法应该如下
    
    ```jsx
    const newxset = xseta.union(xset1, xset2, ..., xsetn);
    ```
    
    - 参数`xsetn` : 可选参数，表示需要合并的所有集合
    - 返回值：一个新的`Xset` 实例，原参与合并的集合都不会被修改
- 对于参数个数为n个的情况，在实现时需要使用扩展操作符替代多个参数，例如可以使用`…sets`代替所有的`XSet`实例
- 由于合并包括调用者本身，故而调用者本身也需要被计入，可以写一个**静态方法，**表示两个或多个集合合并的情况，如下
    
    ```jsx
    const newxset = XSet.union(xseta, ...xsets);
    ```
    
    - 参数
        - `xseta` ：调用的集合
        - `xsets`：合入的所有集合
    - 返回：一个新的合并的集合
- 新建一个空集合，初始化为xseta，然后遍历xsets和其中的元素，加入到答案集合中就能得到结果
    
    ```jsx
    class XSet extends Set {
      static union(xseta, ...xsets) {
        const ans = new XSet(xseta);
        for (const xset of xsets) {
          for (const val of xset) {
            ans.add(val);
          }
        }
        return ans;
      }
      union(...xsets) {
        return XSet.union(this, ...xsets);
      }
    }
    ```
    

## 6.3.3 求交集

- 两个或以上集合求交集的思路
    - 以调用集合为基础，遍历调用集合的每个元素
    - 然后遍历需要相交的所有集合，判断集合中是否包含调用集合中的元素
    - 如果有一个不包含，就可以删除该元素
- 同样的使用静态方法，实例方法调用静态方法实现
- 语法
    
    ```jsx
    // 实例方法
    const newxset = xseta.intersection(xset1, xset2, ... xset3);
    // 静态方法
    Xset.intersection(xseta, ...xsets);
    ```
    
- 实现
    
    ```jsx
    class XSet extends Set {
      static intersection(xseta, ...xsets) {
        const ans = new XSet(xseta);
        for (const val of ans) {
          for (const xset of xsets) {
            if (!xset.has(val)) {
              ans.delete(val);
            }
          }
        }
        return ans;
      }
      intersection(...xsets) {
        return XSet.intersection(this, ...xsets);
      }
    }
    ```
    

## 6.3.4 求差集

- 差集就是存在于集合A中，但不存在于B集合中的元素，如图所示
    
    ![集合差值.png](6%20Set/%25E9%259B%2586%25E5%2590%2588%25E5%25B7%25AE%25E5%2580%25BC.png)
    
- 所以两个或两以上求差集合的思路就是
    - 以调用的集合作为基准，遍历它的值val
    - 然后遍历其它集合
    - 如果其它集合包含val，说明val是交集需要被删除
- 语法
    
    ```jsx
    // 实例方法
    const newxset = xseta.difference(xset1, xset2, ...xsetn);
    // 静态方法
    XSet.difference(xseta, ...xsets);
    ```
    
- 实现
    
    ```jsx
    class XSet extends Set {
      static difference(xseta, ...xsets) {
        const ans = new XSet(xseta);
        for (const val of ans) {
          for (const xset of xsets) {
            if (xset.has(val)) {
              ans.delete(val);
              break;
            }
          }
        }
        return ans;
      }
      difference(...xsets) {
        return XSet.difference(this, ...xsets);
      }
    }
    ```
    

## 6.3.5 求对称差集

- 实际上对称差集就是只属于两个集合中其中一个的元素组成的集合，如图
    
    ![对称差集.png](6%20Set/%25E5%25AF%25B9%25E7%25A7%25B0%25E5%25B7%25AE%25E9%259B%2586.png)
    
- 对称差集只针对两个集合，所以静态方法应该只有两个参数
- 根据数学公式可知：
    
    $AΔB = (A∪B)-(A∩B)$.
    
- 所以可以利用并集，交集和差集方法就能求出对称差集无需再次遍历
- 语法
    
    ```jsx
    // 实例方法
    const newxset = xseta.symmetricDifference(xsetb);
    // 静态方法
    XSet.symmertricDifference(xseta, xsetb);
    ```
    
- 实现
    
    ```jsx
    class XSet extends Set {
      static symmetricDifference(seta, setb) {
        return seta.union(setb).difference(seta.intersection(setb));
      }
      symmetricDifference(setb) {
        return XSet.symmetricDifference(this, setb);
      }
    }
    ```
    

## 6.3.6 求笛卡尔积

- 笛卡尔积就是若干个集合中，每个集合选择一个元素，这些元素组成一个组合，所有的组合就是笛卡尔积
- 例如`Set{1,2,5}`和`Set{2,3}` 的笛卡尔积就是 `(1,2), (1,3), (2,2),(2,3),(5,2),(5,3)`
- 因为笛卡尔积中组合的个数为每个集合元素个数的乘积，所以已被只需要求出两个集合的笛卡尔积
- 语法
    
    ```jsx
    const cp = xseta.cartesianProduct(xsetb);
    XSet.cartesianProduct(xseta, xsetb);
    ```
    
- 实现
    
    ```jsx
    class XSet extends Set {
      static cartesianProduct(seta, setb) {
        const cb = [];
        for (const vala of seta) {
          for (const valb of setb) {
            cb.push([vala, valb]);
          }
        }
      }
      cartesianProduct(setb) {
        return XSet.cartesianProduct(this, setb);
      }
    }
    ```
    

## 6.3.7 集合的幂集

- 幂集就是原集合中所有的子集，构成的集族，例如`{1,2,3}` 的幂集为 `{∅, {1}, {2}, {3},{1,2},{2,3},{1,3},{1,3}}`
- 假设原集合的元素个数为`n`，则幂集中子集的个数为$2^n$ 个
- 集合求幂集的思路
    - 初始时幂集默认有空集
    - 遍历原集合，每次增加的集合为幂集中增加当前值的子集
    - 这样就能保证总数为$2^n$. 每次增加的都是子集
- 语法
    
    ```jsx
    // 实例方法
    const powerSet = xset.powerSet();
    // 静态方法
    XSet.powerSet(xset);
    ```
    
- 实现
    
    ```jsx
    cartesianProduct(setb) {
        return XSet.cartesianProduct(this, setb);
      }
      static powerSet(set) {
        // 初始保存空集
        const powerSet = new XSet().add(new XSet());
        for (const addVal of set) {
          for (const addSet of new XSet(powerSet)) {
            powerSet.add(new XSet(addSet).add(addVal));
          }
        }
        return powerSet;
      }
    ```
    

## 6.3.8 例子

```jsx
class XSet extends Set {
  static union(xseta, ...xsets) {
    const ans = new XSet(xseta);
    for (const xset of xsets) {
      for (const val of xset) {
        ans.add(val);
      }
    }
    return ans;
  }
  union(...xsets) {
    return XSet.union(this, ...xsets);
  }
  static intersection(xseta, ...xsets) {
    const ans = new XSet(xseta);
    for (const val of ans) {
      for (const xset of xsets) {
        if (!xset.has(val)) {
          ans.delete(val);
          break;
        }
      }
    }
    return ans;
  }
  intersection(...xsets) {
    return XSet.intersection(this, ...xsets);
  }
  static difference(xseta, ...xsets) {
    const ans = new XSet(xseta);
    for (const val of ans) {
      for (const xset of xsets) {
        if (xset.has(val)) {
          ans.delete(val);
          break;
        }
      }
    }
    return ans;
  }
  difference(...xsets) {
    return XSet.difference(this, ...xsets);
  }
  static symmetricDifference(seta, setb) {
    return seta.union(setb).difference(seta.intersection(setb));
  }
  symmetricDifference(setb) {
    return XSet.symmetricDifference(this, setb);
  }
  static cartesianProduct(seta, setb) {
    const cb = [];
    for (const vala of seta) {
      for (const valb of setb) {
        cb.push([vala, valb]);
      }
    }
    return cb;
  }
  cartesianProduct(setb) {
    return XSet.cartesianProduct(this, setb);
  }
  static powerSet(set) {
    // 初始保存空集
    const powerSet = new XSet().add(new XSet());
    for (const addVal of set) {
      for (const addSet of new XSet(powerSet)) {
        powerSet.add(new XSet(addSet).add(addVal));
      }
    }
    return powerSet;
  }
  powerSet() {
    return XSet.powerSet(this);
  }
}

const xseta = new XSet([1, 3, 5, 7]);
const xsetb = new XSet([3, 4, 7]);
console.log(xseta.union(xsetb)); // 并集
console.log(xseta.intersection(xsetb)); // 交集
console.log(xseta.difference(xsetb)); // 差集
console.log(xseta.symmetricDifference(xsetb)); // 对称差集
console.log(xseta.cartesianProduct(xsetb)); // 笛卡尔积
console.log(xseta.powerSet()); // 幂集
// 打印
XSet(5) [Set] { 1, 3, 5, 7, 4 }
XSet(2) [Set] { 3, 7 }
XSet(2) [Set] { 1, 5 }
XSet(3) [Set] { 1, 5, 4 }
[
  [ 1, 3 ], [ 1, 4 ],
  [ 1, 7 ], [ 3, 3 ],
  [ 3, 4 ], [ 3, 7 ],
  [ 5, 3 ], [ 5, 4 ],
  [ 5, 7 ], [ 7, 3 ],
  [ 7, 4 ], [ 7, 7 ]
]
XSet(16) [Set] {
  XSet(0) [Set] {},
  XSet(1) [Set] { 1 },
  XSet(1) [Set] { 3 },
  XSet(2) [Set] { 1, 3 },
  XSet(1) [Set] { 5 },
  XSet(2) [Set] { 1, 5 },
  XSet(2) [Set] { 3, 5 },
  XSet(3) [Set] { 1, 3, 5 },
  XSet(1) [Set] { 7 },
  XSet(2) [Set] { 1, 7 },
  XSet(2) [Set] { 3, 7 },
  XSet(3) [Set] { 1, 3, 7 },
  XSet(2) [Set] { 5, 7 },
  XSet(3) [Set] { 1, 5, 7 },
  XSet(3) [Set] { 3, 5, 7 },
  XSet(4) [Set] { 1, 3, 5, 7 }
}
```