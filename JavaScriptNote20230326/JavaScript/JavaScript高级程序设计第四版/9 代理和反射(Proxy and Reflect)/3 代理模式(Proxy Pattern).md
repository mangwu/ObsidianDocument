# 3. 代理模式(Proxy Pattern)

使用代理可以在代码中实现一些有用的**编程模式**

# 3.1 跟踪属性访问（Tracking Property Access）

- `get`, `set` 和 `has` 等基本（nature）操作提供了大体上对象属性在什么时候正被**访问**（**accessed**）或**检查**（**inspected**）的**了解**（**insight**）
- 如果把实现相应捕获器的某个对象代理放到应用中，可以**准确（exactly）**监控这个对象何时在何处被访问过

```jsx
const target = {
  age: 22,
  name: "mangwu",
};
target.__proto__.sayHello = function () {
  console.log(`Hello, I'm ${this.name}`);
};

const proxy = new Proxy(target, {
  set() {
    console.log(
      `target ${arguments[0]} is setting ${arguments[1]} = ${arguments[2]}`
    );
    return Reflect.set(...arguments);
  },
  get() {
    console.log(
      `target ${arguments[0]} is getting ${arguments[1]} property value`
    );
    return Reflect.get(...arguments);
  },
});
proxy.age;
proxy.name = "wumang";
proxy.sayHello();
// 打印
target [object Object] is getting age property value
target [object Object] is setting name = wumang
target [object Object] is getting sayHello property value
target [object Object] is getting name property value
Hello, I'm wumang
```

- 在调用`sayHello()` 时，执行了两次`get` 操作，一次是对`sayHello` 本身的操作，另一次是在调用执行方法过程中，因为方法对`name` 的依赖所以还要获取`name`

# 3.2 隐藏属性(Hidden Properties)

- 代理的内部实现对外部代码是不可见的，因此要**隐藏**（**conceal**）目标对象上属性的存在比较容易
- 只要get捕获器，has捕获器实现时将需要隐藏的对象当作不存在进行返回，就实现了在使用代理时就好像目标对象上不存在这些属性一样

```jsx
const target = {
  foo: "foo",
  bar: "bar",
  baz: "baz",
};
const hiddenProp = ["foo", "bar"];

const proxy = new Proxy(target, {
  get() {
    if (hiddenProp.includes(arguments[1])) {
      return undefined;
    }
    return Reflect.get(...arguments);
  },
  has() {
    if (hiddenProp.includes(arguments[1])) {
      return false;
    }
    return Reflect.has(...arguments);
  },
});

// get
console.log(proxy.foo); // undefined
console.log(proxy.bar); // undefined
console.log(proxy.baz); // baz
// has
console.log("foo" in proxy); // false
console.log("bar" in proxy); // false
console.log("baz" in proxy); //  true
```

# 3.3 属性验证（Property Validation）

- 因为所有的**赋值操作**（**assignments**）都会通过set()捕获器，可以根据所赋值决定是允许还是拒绝赋值

```jsx
const person = {
  age: 22,
};
const proxy = new Proxy(person, {
  set() {
    if (typeof arguments[2] !== "number") {
      return false;
    }
    if (arguments[2] < 0 || arguments[2] > 100) {
      return false;
    }
    return Reflect.set(...arguments);
  },
});
console.log(Reflect.set(proxy, "age", "23", proxy)); // 赋值失败 false
console.log(Reflect.set(proxy, "age", 123, proxy)); // 赋值失败 false
console.log(Reflect.set(proxy, "age", -1, proxy)); // 赋值失败 fasle
console.log(Reflect.set(proxy, "age", 23, proxy)); // 赋值成功 true
```

- `age` 属性的验证是只能赋值 [0,100]范围内的数字

# 3.4 函数与构造函数参数验证（Parameter Validation）

- 跟保护（protected）和验证（validated）对象属性类似，函数和构造函数的参数也能被捕获器审查（vetting）
- 使用`apply` 捕获器验证函数的参数，使用`construct()` 捕获器验证构造函数的参数
- 例如可以让函数只接受某种类型的值

```jsx
function average(...nums) {
  let sum = 0;
  for (const num of nums) {
    sum += num;
  }
  return sum / nums.length;
}

const proxy = new Proxy(average, {
  apply(target, thisArg, argArray) {
    for (const arg of argArray) {
      if (typeof arg !== "number") {
        throw "需要数字数组";
      }
    }
    return Reflect.apply(...arguments);
  },
});
console.log(proxy(4, 2, 5, 8, 6, 4, 1, 2, 4, 3)); //3.9
try {
  console.log(proxy(4, 2, 5, 8, 6, "4", 1, 2, 4, 3)); 
} catch (error) {
  console.log(error.toString());  // 需要数字数组
}
```

- 类似，可以让构造函数在实例化对象是必须传递某些参数

```jsx
function User(id) {
  this.id = id;
}
const proxy2 = new Proxy(User, {
  construct(target, argArray, newTarget) {
    if (argArray[0] === undefined) {
      throw "User 构造函数必须传递id";
    }
    return Reflect.construct(...arguments);
  },
});

new proxy2(1);
try {
  console.log(new proxy2()); //
} catch (error) {
  console.log(error.toString()); // User 构造函数必须传递id
}
```

# 3.5 数据绑定与可观察对象（Data Binding and Observables）

- 代理可以将**运行时**（**runtime**）中原本不想关的部分**联系**（**intertwine**）在一起，这样可以实现各种模式，从而让不同的代码进行交互（**interact**）
- 例如，可以将代理的类绑定到一个全局实例集合中（**数据绑定**），让所有创建的实例都被添加到这个集合中

```jsx
const userList = [];
class User {
  constructor(name) {
    this.name = name;
  }
}

const proxy = new Proxy(User, {
  construct() {
    const newUser = Reflect.construct(...arguments);
    userList.push(newUser);
    return newUser;
  },
});
new proxy("mang");
new proxy("wu");
new proxy("mangwu");

console.log(userList); // [ User { name: 'mang' }, User { name: 'wu' }, User { name: 'mangwu' } ]
```

- 另外，还可以把集合绑定到一个**事件分派程序**（**emitter**），每次插入新实例都会发送消息（fire）

```jsx
const userList = [];
class User {
  constructor(name) {
    this.name = name;
  }
}
var proxy2 = new Proxy(userList, {
  set(target, property, newValue, receiver) {
    const res = Reflect.set(...arguments);
    if (res && property !== "length") {
      // 判断是否插入成功
      emit(Reflect.get(target, property));
    }
    return res;
  },
});
function emit(newValue) {
  console.log(`create a new User named ${newValue.name}`);
}

const proxy = new Proxy(User, {
  construct() {
    const newUser = Reflect.construct(...arguments);
    proxy2.push(newUser);
    return newUser;
  },
});
new proxy("mang");
new proxy("wu");
new proxy("mangwu");

console.log(userList);
// 打印
create a new User named mang
create a new User named wu
create a new User named mangwu
[ User { name: 'mang' }, User { name: 'wu' }, User { name: 'mangwu' } ]
```

- 每通过`proxy`创建一次User实例，都会使用`proxy2` 在`userList`中新增实例
- 因为创建了3次实例，所以`emit` 被执行三次，即打印三次的消息
- 实际上`proxy2` 的`set` 捕获器被调用了6次，因为`push` 方法在添加元素成功后会设置数组长度，通过`res && property !== "length"` 过滤掉了`length` 设置导致的`emit`触发