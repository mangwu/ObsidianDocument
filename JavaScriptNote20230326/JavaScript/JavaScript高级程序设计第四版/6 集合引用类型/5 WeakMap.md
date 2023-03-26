# 5. WeakMap

# 5.1 描述

参考**[mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap#instance_methods)**

`WeakMap` 是一个**键必须是对象**的保存键值对的集合，弱映射不会对它保存的键创建一个[强引用关系](../4%20%E5%8F%98%E9%87%8F%E3%80%81%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8E%E5%86%85%E5%AD%98/3%201-2%20%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F.md)

- 弱映射中的键必须是对象
- 也就是说作为键的对象存在于弱映射中不会阻止该对象被垃圾回收程序处理
- 一旦作为键的对象被回收，它对应的键值也会作为垃圾回收的候补，只要这个键值没有其它地方的强引用

`WeakMap` 不被允许观察其保存的**键的活性**，即无法对`WeakMap` 实例中的键值对计数

- 如果`WeakMap` 暴露任何的方法获取当前保存的所有键值对列表，这个键值对列表内容取决于当前垃圾回收的状态
- 所以`WeakMap` 中的键值对列表是变化的，在代码中无法准确预判会导致不同JavaScript环境下效果不一致

# 5.2 基本API

- `WeakMap` 的基本API和`Map` 类似，因为其API是`Map API`的子集
- 包括创建，初始化，插入，修改，查询，删除（没有清除）
1. `WeakMap.prototype.set()` 
2. `WeakMap.prototype.has()`
3. `WeakMap.prototype.get()`
4. `WeakMap.prototype.delete()` 
    
    ```jsx
    const a = { a: 0 };
    const weakmap = new WeakMap([[{ label: "hello" }, "value"]]).set(a, "1");
    console.log(weakmap);
    try {
      console.log([...weakmap]);
    } catch (error) {
      console.log(error.message);
    }
    console.log(weakmap.get(a));
    weakmap.delete(a);
    // 打印
    WeakMap { <items unknown> }
    weakmap is not iterable
    1
    ```
    
    - 通过打印可知，`WeakMap` 实例不是可迭代对象，且无法查看键值对

---

- `WeakMap` 的键值对列表是变化的，所以没有迭代方法和`size` 属性，同时也没有`clear()`

# 5.3 弱键

- `WeakMap` 中的”weak“ 表示弱映射的键是“弱弱地拿着”的；更规范化的解释是，这些键不属于正式的引用（非强引用），不会阻止垃圾回收
- 但是弱映射中的键值**并非**弱引用，只要键存在，键值对就会存在于映射中，即对值的引用是被记录的
- 例子 这个例子很好的解释了`Map`和`WeakMap` 在对于键的最大区别
    
    ```jsx
    // 弱键
    const container = {
      key1: {},
      key2: {},
    };
    
    const map = new Map().set(container.key1, "value1");
    const weakMap = new WeakMap().set(container.key2, "value2");
    
    console.log(map);
    console.log(weakMap.has(container.key2));
    
    // 清除key在container中的引用
    container.key1 = null;
    container.key2 = null;
    
    console.log(map);
    // 此时key2被垃圾回收，weakMap是空的
    
    // 打印
    Map(1) { {} => 'value1' }
    true
    Map(1) { {} => 'value1' }
    ```
    
    - 使用一个`container`保存了两个键，即在当前上下文，这两个键都有引用
    - 声明一个普通的映射，和一个弱映射分别设置其中一个键，因为使用了`container` 弱映射中的键不会被回收
    - 将`container`中的两个键都设置为空，即`container` 不再保存两个键的引用
    - 此时普通映射没有任何变化，因为普通映射的键是强引用，这个键不会成为垃圾回收的目标
    - 而弱映射中的键在弱映射中没有强引用关系，外部也没有该键的引用，所以会被垃圾回收程序处理，此时弱映射中的键值对就被清理了

# 5.4 不可迭代键

- 因为[`WeakMap` 不被允许观察其保存的**键的活性**，即无法对`WeakMap` 实例中的键值对计数](5%20WeakMap.md).
- 所以`WeakMap` 中的键值对是动态变化的，这种不确定性导致代码功能的不一致，迭代也就没有意义，也不可能迭代
- 既然无从计数，那么`clear()` 方法也就用不了了
- `WeakMap`之所以限制只能使用对象作为键，是为了保证只有通过键对象的引用才能取得键值
    - 键对象外部没有引用，说明键可以被回收，也无法通过`get()` 获取键值**，**此时自然`WeakMap` 中就不存在该键值对了，这是逻辑自洽的
    - 如果使用原始数据类型如字符串，是无法区分初始使用的字符串字面量和之后使用的字符串是否是同一个的；因为和`Map` 一样，查询，设置键都是使用的**同值零比较**，对于原始数据类型而言，保存在不同内存空间的两个字面量是可以相等的，这就无法保证得知原始字面量是否被回收，但对象是存储在堆内存空间中的，只有一个实体，可以有多个引用，只要外部引用无了，就能保证整个实体被回收，即知道这个对象被回收了

# 5.5 使用场景

- 为什么会有弱映射，这种不可迭代的键值对集合有什么用处
- 这个答案不是唯一的，`WeakMap` 和`Object` 有很大不同，但是已有相关的使用策略

## 5.5.1 私有变量

- 私有变量就是一个类实例中不能直接通过句点或中括号的方法直接访问到的变量，但是可以通过公共的方法访问到变量
- 使用`WeakMap` 构造私有变量的方式为：
    1. 在类外部构造一个`WeakMap`
    2. 在类中声明一个`set()` 方法用于设置私有变量的值，其中`key`为`this` （即实例本身），`value`是传递的参数
    3. 在类中声明一个`get()` 方法用于返回私有变量的值，其中`key` 为`this`
    4. 构造函数需要调用`set()` 方法用以初始化私有变量
- 上面的方法使用`Map`也可以实现，为什么要使用`WeakMap` ：参考[emulating_private_members](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap#emulating_private_members)
    - 和`Map`相比, `WeakMap`  中的键是弱引用的，所以只要将实例本身作为键，那么`WeakMap`中的键值对和实例有相同的生命周期，避免了内存泄漏（`Map`的键是强引用，即使没有变量引用实例，实例也不会被清除，因为它存在于`Map`的键中）
- 相加于使用闭包（closure）和符号属性的优点
    - 相较于不可枚举的符号属性，`WeakMap` 保存的私有变量是保存在对象外部的，符号属性可以通过检索对象的元数据（metadata）获取，例如具有*反射*机制的方法`Obejct.getOwnPropertySymbols` ；而`WeakMap` 只能通过自定义的set和get方法获取和修改
    - 相较于闭包的，内存分配更高效，因为所有实例都可以重用一个`WeakMap` ，且`WeakMap` 允许相同类型的不同实例读取对方的私有变量
- 例子 未使用JavaScript高级程序设计第4版的例子，而是使用了MDN上的例子
    
    ```jsx
    let Person;
    {
      const privateScope = new WeakMap();
      Person = function (name, id) {
        this.name = name;
        this.setIDNum(id);
      };
      Person.prototype.getIDNum = function () {
        return privateScope.get(this)["id"];
      };
      Person.prototype.setIDNum = function (val) {
        const privateMembers = privateScope.get(this) || {};
        privateMembers["id"] = val;
        privateScope.set(this, privateMembers);
      };
    }
    console.log(typeof privateScope);
    
    const person = new Person("mangwu", "421023yyyymmdd1234");
    console.log(person);
    // 公共属性可以直接句点调用修改
    person.name = "wumang";
    person.setIDNum("421023yyyymmdd4567");
    console.log(person.getIDNum());
    // 打印
    undefined
    Person { name: 'mangwu' }
    421023yyyymmdd4567
    ```
    
    - 可以看到，在外部`privateScope` 被隐藏了起来
    - 打印Person只能看到一个公告的name属性，因为身份证ID变量被保存在`WeakMap` 实例中
    - 通过公共的`set`和`get` 方法可以获取和设置私有属性
- 现代的class设置私有变量的方法是在构造函数外设置一个非静态变量，如下
    
    ```jsx
    class Others {
      #idnum;
      constructor(p, id) {
        this.publicProperty = p || "public";
        this.setIDNum(id);
      }
      getProperty() {
        return this.publicProperty;
      }
      setProperty(val) {
        this.publicProperty = val;
      }
      getIDNum() {
        return this.#idnum;
      }
      setIDNum(val) {
        this.#idnum = val;
      }
    }
    const o = new Others("p", "421544555");
    console.log(o);
    console.log(o.publicProperty);
    console.log(o.getIDNum());
    o.setIDNum("8741");
    console.log(o.getIDNum());
    // 打印
    Others { publicProperty: 'p' }
    p
    421544555
    8741
    ```
    
    - 通过打印得知`#idnum` 是私有变量，不在Others中显示，只能通过公共方法获取设置

## 5.5.2 DOM节点元数据

- 元数据（metadata）最直白简单的解释：描述数据的数据
    - 例如一个HTML文档是数据，HTML也能在`<head>`元素中定义元数据`<meta>` 描述文档的作者，总结等
    - 对于一个DOM节点而言，元数据就是节点预设的属性（attribute），和自定义的属性(data-xxx)
- 因为`WeakMap`实例不会妨碍垃圾回收，所以非常适合保存关联节点的元数据
    
    ```jsx
    // 关联元数据
    const node = document.querySelector("#login");
    const wm = new WeakMap();
    // 给节点关联元数据
    wm.set(node, { disabled: true, dataUser: "" });
    ```
    
    - 上述代码执行后，假设页面被JavaScript改变了，那么登录的节点从DOM树中被删除了
    - 假设没有其他位置引用这个node节点，那么弱映射中的节点和元数据会被垃圾回收
    - 如果使用`Map` 可能导致内存泄漏