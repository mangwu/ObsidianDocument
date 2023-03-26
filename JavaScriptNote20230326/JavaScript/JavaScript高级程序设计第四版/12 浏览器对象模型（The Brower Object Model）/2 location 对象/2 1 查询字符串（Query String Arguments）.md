# 2.1 查询字符串（Query String Arguments）

# 2.1.1 使用查询字符串

- `location` 的多数信息都有可以通过属性获取，但是URL中的查询字符串并不容易使用
- 这是因为`location.search` 返回了从问号开始直到URL的所有`query string` ，但是没有办法逐个访问每个查询参数
- 下面是一个能解析查询字符串的函数，它返回一个以每个查询字符串的构成的`key:value` 组合对象
    
    ```jsx
    /**
     * @description 解析查询字符串
     * @param {string} search
     */
    function getQueryString(search) {
      const queryStrs = search.length > 0 ? search.substring(1).split("&") : [];
      const ans = {};
      queryStrs.forEach((v) => {
        let [key, value] = v.split("=");
        key = decodeURIComponent(key);
        value = decodeURIComponent(value);
        if (key) {
          ans[key] = value;
        }
      });
      return ans;
    }
    console.log(getQueryString("?age=21&name=%E7%9B%B2%E9%9B%BE&=kk"));
    // 打印
    // {age: '21', name: '盲雾'}
    ```
    
    - 这个方法有三个需要注意的点
        - 注意`search` 可能为空
        - 需要使用`decodeURIComponent()` 将`key`和`value` 进行解码，因为查询字符串的键值对可能不是能在网络请求中正常使用的字符，在网络请求中它们会被`encodeURIComponent()` 进行编码，如汉字
        - 除此之外要判断`key` 值是否为空字符串，过滤掉不合理的空字符串`key`值

# 2.1.2 URLSearchParams

- `URLSearchParams` 是属于全局对象（`window`或`global` 等）的属性，可以再全局环境中直接使用，`URLSearchParams` 接口提供了使用URL查询字符串的**实用方法（utility methods）**
- 可以通过`URLSearchParams` 提供的一组标准API方法，检查何修改查询字符串
    - 给`URLSearchParams` **构造函数**传递一个查询字符串，就可以创建一个实例
    - 这个实例暴露的get()、set()、delete()、append()、getAll()、has()方法可以对查询字符串进行“获取”，“设置”，“删除”，“增加”，”获取指定key的所有值“，”判断键是否存在“的操作
    - entries()，forEach()，keys()，values()方法可以对查询字符串进行”获取键值迭代器“，”进行内部迭代“，”获取键迭代器“和”获取值迭代器“
    - sort()方法可以对查询字符串进行”排序“的操作
    - toString()方法可以对查询字符串进行”转化为字符串“的操作

## 2.1.2.1 查询字符串基本操作

- 查询字符串中的值键可以是相同的，`URLSearchParams` 构造的关于查询字符串的数据结构会保存重复键的不同值
    - `get()`获取的是指定key的第一个值，如果没有就返回`null`
    - `getAll()`获取的是指定key的所有值，如果没有就放回空数组(`[]`)
    - `delete()`删除指定key的所有值，返回`undefined`
    - `append()` 增加一个键值对，如果key本身存在，就会在value数组中增加一个，否则创建一个键值对，值为`[value]` ,返回`undefined`
    - `set()` 设置键值，无论`key` 本身是否存在，都会将键值设置为`[value]` （会舍弃原来的键值数组），返回 `undefined`
    - `has()` 比较简单，判断键是否存在，返回一个布尔值，`true` 就是存在，`false` 就是不存在
    
    ```jsx
    const urlsp = new URLSearchParams(
      `?age=21&name=mangwu&name=${encodeURIComponent("盲雾")}&=k&1=`
    );
    console.log(urlsp.getAll("age")); // [ '21' ]
    console.log(urlsp.getAll("name")); // [ 'mangwu', '盲雾' ]
    console.log(urlsp.get("")); // k
    console.log(urlsp.get("1")); // ""
    console.log(urlsp.get("age")); // 21
    console.log(urlsp.get("name")); // mangwu
    
    console.log(urlsp.has("age")); // true
    urlsp.delete("age");
    console.log(urlsp.get("age")); // null
    console.log(urlsp.has("age")); // false
    
    urlsp.append("name", "wumang");
    console.log(urlsp.getAll("name")); // [ 'mangwu', '盲雾', 'wumang' ]
    
    urlsp.set("name", encodeURIComponent("盲雾"));
    console.log(urlsp.getAll("name")); // [ '%E7%9B%B2%E9%9B%BE' ]
    
    console.log(urlsp.toString()); // name=%25E7%259B%25B2%25E9%259B%25BE&=k&1=
    ```
    
    - 从上述例子中可以观察出
        - `URLSearchParams` 构造函数会对传入的字符串进行解码处理（`decodeURIComponent`）
        - `URLSearchParams` 操作实例中数据结构的方法**不会**临时进行解码处理
        - 空`key` 和空`value` 可以存在，空`key` 和空`value`就是空字符串
- `URLSearchParams` 构造的实例实现了可迭代协议，可以作为一个迭代器使用，并且提供了默认迭代器方法和内置迭代方法
    - `forEach()` 和数组的内置迭代方法类似，允许通过回调函数迭代该对象中包含的所有查询字符串
    - `entries()` 是`URLSearchParams` 实例的默认迭代器方法，返回一个由查询字符串的键值对构成的迭代器对象
    - `keys()` 和`values()` 是类似于`entries()` 的方法，返回一个迭代器对象，只是前者的迭代器对象由键构成，后者的迭代器对象由值构成
    
    ```jsx
    const urlsps = new URLSearchParams(
      `?age=21&name=mangwu&name=${encodeURIComponent("盲雾")}&=k&1=`
    );
    
    for (const [key, value] of urlsps) {
      console.log(key, value);
    }
    for (const key of urlsps.keys()) {
      console.log(key);
    }
    for (const value of urlsps.values()) {
      console.log(value);
    }
    // 打印
    // 第一个，直接迭代实例或者使用entries()
    age 21
    name mangwu
    name 盲雾
     k
    1
    // 第二个，使用keys()
    age
    name
    name
    
    1
    // 第三个，使用values()
    21
    mangwu
    盲雾
    k
    
    ```
    
    - 注意迭代器对象中的迭代次数由总共的**键值个数**决定而**不是**键值对个数决定
    - 也就是说，如果一个键对应n个值，那么默认迭代器对象中会包含n个键值对，它们的键相同
- `URLSearchParams` 实例中的查询字符串的数据结构可以通过`sort()` 进行排序，排序后可以通过`toString()` 获取适用于URL的查询字符串，可以发现顺序改变
    - 查询字符串实例的`sort()` 与数组的`sort()` 不同，它不接受任何参数，它预设的排序方式是比较**键**（**keys**）的unicode编码，具有相同编码的键值对按照原始的顺序进行排列，返回值为`undefined`
    - `toString()` 方法会返回`URLSearchParams` 实例在URL中适用的查询字符串，也就是说，键值会被`encodeURIComponent` 进行编码以符合URL规范
    
    ```jsx
    const urlsps = new URLSearchParams(
      `?age=21&name=mangwu&name=${encodeURIComponent("盲雾")}&=k&1=`
    );
    urlsps.sort();
    console.log(urlsps); // URLSearchParams { '' => 'k', '1' => '', 'age' => '21', 'name' => 'mangwu', 'name' => '盲雾' }
    console.log(urlsps.toString()); // =k&1=&age=21&name=mangwu&name=%E7%9B%B2%E9%9B%BE
    ```
    
    - 注意顺序，空字符串排在最前，它没有unicode编码，比较特殊，`age`中的`a`字符unicode为0061，`name` 中的`n` 字符串unicode为006e，所以`age` 应该排在`name` 前面