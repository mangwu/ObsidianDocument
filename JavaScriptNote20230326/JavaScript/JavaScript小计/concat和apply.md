# concat和apply

## concat使用

- JavaScript Array concat()方法
- 用于连接两个或者多个数组

### 语法

```tsx
arr.concat(arr2|ele, arr3|ele, ... , arrX|ele);
```

- 参数：
    - 可以是n个数组或任何元素
    - 数组中的元素会被组成新数组的元素
    - 元素也会被组成新数组的元素
- 不会更改现有数组arr
- 返回一个由arr和参数连接而成的新数组
    
    ![Untitled](concat%E5%92%8Capply/Untitled.png)
    

## apply使用

- JavaScript 函数 Apply
- 用于在调用方法时设置this

### 语法

```tsx
instance.func.apply(pointer[, args]);
```

- 参数：
    - pointer: 自定义的this指针
    - args: 可选，方法的参数，可以是数组，**以数组中的元素为参数调用**
- apply方法能编写**用于不同对象的方法**
    
    ```jsx
    var person = {
    	fullName() {
    		return this.firstName + ' ' + this.secondName;
    	}
    }
    var person1 = {
    	firstName: 'Bill',
    	secondName: 'Gates',
    }
    person.fullName.apply(person1);
    ```
    
    ![Untitled](concat%E5%92%8Capply/Untitled%201.png)
    
    ⇒ 相当于使用person对象的方法，但是调用者是person1(即没有该方法的person1使用了该方法)
    
- apply方法与call方法的不同之处在于，call方法**分别接受参数**,而apply方法以**数组的形式接受参数**
    
    ```jsx
    Math.max.apply(null, [1, 2, 3, 4]); // 返回4
    Math.max.call(null, 1, 2, 3, 4); // 返回4
    ```
    
    ⇒ max方法比较传入参数中的最大值，所以指针为空也不要紧（指针）
    
    ⇒ apply的第二个参数一定要是数组，数组中的每个元素作为max的参数依次传入
    
    ⇒ **通过max和apply的组合，可以轻易找到数组中的最大值，**这也是以数组形式接受参数的好处
    

## concat和apply

- apply的特点在于以**数组形式接受参数**
    - 通过这一点，可以将二维数组中的**数组元素中的元素** 提出来连接到外层
- 例如数组`[[1,2],[3,4,5]]`
    - 仅通过concat无法提取出数组元素中的元素
        
        ```jsx
        let arr = [[1, 2], [3, 4, 5]];
        const newArr = [0].concat(arr); // [0,[1, 2], [3, 4, 5]];
        ```
        
    - 通过apply的形式调用，提取数组元素中的元素
        
        ```jsx
        let arr = [[1, 2], [3, 4, 5]];
        const newArr = [].concat.apply([0], arr); // [0, 1, 2, 3, 4, 5];
        ```
        
        ⇒ 注意第一个参数使用[0],表示它才是调用者，前面的[]只提供concat方法
        
        ⇒ 第二个参数arr实际上是以`[0].concat([1, 2], [3, 4, 5])` 形式调用的，所以得到了一维数组
        

## 关于小计concat和apply的原因

- 来源于codewars题目
    
    [Training on Greed is Good | Codewars](https://www.codewars.com/kata/5270d0d18625160ada0000e4/train/javascript)
    
- 题目描述为：
    
    [translate](concat%E5%92%8Capply/translate.md)
    
- 该题目实际上就是
    1. 先求出每个位置字符的可能值组成的数组，可以通过定义键盘数组后遍历得到，也可以手写
        
        ```jsx
        // 手写
        const keypadAround = [
        	["0", "8"], // "0"
        	["1", "2", "4" ], // "1"
        	["1", "2", "3", "5"], // "2"
        	["2", "3", "6"], // "3"
        	["1", "4", "5", "7"], // "4"
        	["2", "4", "5", "6", "8"], // "5"
        	["3", "6", "5", "9"], // "6"
        	["4", "8", "7"], // "7"
        	["9", "8", "5", "7", "0"], // "8"
        	["6", "8", "9"], // "9"
        ]
        
        // 遍历
        const arr = [];
        for (let i = 0; i < observed.length; i++) {
        	// observed为数字字符（观察密码）
        	arr[i] = keypadAround[observed[i]]; 
        }
        ```
        
        ```jsx
        // 定义键盘数组后遍历
        const DIRS = [[0, 1],[1, 0],[0, -1],[-1, 0],[0, 0]];
        // 声明键盘
          const keypad = [
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            [null, "0", null],
          ];
          // 数组个数
          const len = observed.length;
          const arr = [];
          for (let idx = 0; idx < len; idx++) {
            const i = observed[idx] === "0" ? 3 : Math.floor((observed[idx] - 1) / 3);
            const j = observed[idx] === "0" ? 1 : Math.floor((observed[idx] - 1) % 3);
            arr[idx] = [];
            for (const dir of DIRS) {
              const x = i + dir[0];
              const y = j + dir[1];
              if (x >= 0 && y >= 0 && x < 4 && y < 3 && keypad[x][y] !== null) {
                arr[idx].push(keypad[x][y]);
              }
            }
          }
        ```
        
    2. 关键点在于得到arr数组后，如何组合
        1. 以第一个数组为原始数组，每次组合两个数组，合成一个，然后更相原始数组再进行组合
            - 这种方式代码多，每次组合都需要声明新的数组保存组合后的数组
        2. 使用高阶函数，包括reduce，map，concat等
            - 每次都要组合两个数组，使用reduce可以遍历
            - 使用map时会生成每个组合的二维数组，所以需要concat配合apply进行提取
            
            ```jsx
            return arr.reduce((pre, cur) => [].concat.apply(
            	[], 
            	pre.map(t => cur.map(g =>t + g))
            ));
            // 实际上一行代码就能解决
            ```
            
            ⇒ 核心代码`**[].concat.apply([], arrargs)`** 
            
            ⇒ pre.map(t => cur.map(g =>t + g))生成的是组合的二维数组如`[ [ '22', '24', '21' ], [ '42', '44', '41' ], [ '12', '14', '11' ] ]` ,使用concat无法提取出数组元素中的元素，所以利用apply以数组方式提供参数的特性，相当于`[].concat([ '22', '24', '21' ], [ '42', '44', '41' ], [ '12', '14', '11' ])`