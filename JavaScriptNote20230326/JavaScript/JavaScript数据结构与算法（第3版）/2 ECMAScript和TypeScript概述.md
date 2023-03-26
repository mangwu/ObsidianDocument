# 2. ECMAScript和TypeScript概述

**TypeScript是JavaScript的一个超集**

# 2.1 JavaScript与ECMAScript

- 详见[1. JavaScript诞生历史](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/1%20%E4%BB%80%E4%B9%88%E6%98%AFJavaScript.md)
- JavaScript是一门需要宿主的语言
- ECMAScript即，ECMA-262标准定义的语言，它不局限于Web浏览器，node.js也依据ECMA实现（实际上ECMAScript语言没有规范的输入和输出方法）
    - ECMA-262是JavaScript语言的基准，用于构建稳健的JavaScript实现
    - Web浏览器只是ECMAScript实现的一种**宿主环境（host environment）**

## 2.1.1 ES6、ES2015、ES.NEXT

- ES6就是ES2015，一个指发布的版本，一个指发布的时间
- ES.NEXT用来指代下一代的ECMAScript

## 2.1.2 兼容性列表

- 现在已经发布了第13版：ES13、ES2022，2022 06发布
- 所有的浏览器都依据ECMAScript的最新版本进行开发更新，其实现大同小异，旧版本浏览器有可能
- 谷歌浏览器进入chrome://flags/#enable-javascript-harmony，开启选项能体验过xing
    
    ![Untitled](2%20ECMAScript%E5%92%8CTypeScript%E6%A6%82%E8%BF%B0/Untitled.png)
    

## 2.1.3 使用Babel.js

- Babel是一个JavaScript**转译器，**也称源代码编译器**，它能将使用了ECMAScript语言特性的JavaScript代码转换成只使用广泛支持的ES5特性的等价代码**
- 使用方式
    - 根据设置文档按需安装
        
        [Babel · The compiler for next generation JavaScript](https://babeljs.io/en/setup/)
        
    - 直接在浏览器中试用
        
        [Babel · The compiler for next generation JavaScript](https://babeljs.io/repl/)
        

# 2.2 ES6+新功能

## 2.2.1 使用let和const

- 不要使用var
- var声明的变量是函数作用域，而let和const声明的变量都是块作用域

## 2.2.2 模板字面量

```jsx
let name = "mangwu"
let str = `用于拼接字符串，如下\${name}`;
```

## 2.2.3 箭头函数

- 省去function关键字
- 箭头函数没有prototype，caller和arguments自有属性，this为定义时确定，是最近作用域的this值

## 2.2.4 函数的参数默认值

```jsx
function sum(x = 2, y = 3, z) {
	return x + y + z;
}
```

## 2.2.5 声明展开和剩余参数

详见[6. 参数扩展与收集（Spread Arguments and Rest Parameters）](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/10%20%E5%87%BD%E6%95%B0%EF%BC%88Functions%EF%BC%89/6%20%E5%8F%82%E6%95%B0%E6%89%A9%E5%B1%95%E4%B8%8E%E6%94%B6%E9%9B%86%EF%BC%88Spread%20Arguments%20and%20Rest%20Parameters%EF%BC%89.md) 

- 就是使用扩展操作符扩展函数的参数

## 2.2.6 增强的对象属性

**数组解构**

```jsx
let x = "a";
let y = "b";
[x, y] = [y, x]; // 交换了两个变量的值
```

**属性简写（对象解构的另一种方式）**

```jsx
let [x, y] = ['a', 'b'];
const obj = {x, y}
```

**简写方法名（对对象内方法进行简写）**

```jsx
const hello = {
	printHello() {
		console.log("Hello");
	}
}
```

## 2.2.7 使用类进行面向对象编程

详见[4. 类](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/8%20%E5%AF%B9%E8%B1%A1%E3%80%81%E7%B1%BB%E4%B8%8E%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/4%20%E7%B1%BB.md) 

### 2.2.7.1 继承

- 不再依靠原型链的继承方式，而是直接使用extends

### 2.2.7.2 使用属性存取器

```jsx
class Person {
  constructor(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
  set name(val) {
    this._name = val;
  }
}
const person = new Person("mangwu");
console.log(person.name); // mangwu
```

![Untitled](2%20ECMAScript%E5%92%8CTypeScript%E6%A6%82%E8%BF%B0/Untitled%201.png)

- 相当于在实例的原型上定义了一个访问器属性，这个访问器属性能获取和设置实例的`_name` 自有属性

## 2.2.8 乘方运算符

`**` 相当于 `Math.pow()`

## 2.2.9 模块

- CommonJS语法，nodejs使用`require`语句进行模块化开发
- AMD语法，异步模块定义，RequireJS是AMD最流行的实现
- ES2015在JavaScript标准中引入了一种**官方的模块功能，**下面是官方的模块功能

### 2.2.9.1 创建模块

- 使用export关键字
    
    ```jsx
    // 创建模块
    const circleArea = (r) => Math.PI * r ** 2;
    const squareArea = (s) => s * s;
    
    export { circleArea, squareArea }; // 这就是创建的一个模块，可被其它文件使用
    ```
    
    文件名称：2.2.9.1 create module.js
    
- 除了可以统一成一个对象导出外，还可以一个个导出
    
    ```jsx
    // 创建模块
    export const circleArea = (r) => Math.PI * r ** 2;
    export const squareArea = (s) => s * s;
    ```
    
- 使用`export default` 关键字，导出默认的变量，这样另一个文件在导入模块时，可以自定义名称
    
    ```jsx
    // 导出默认值
    export default class Book {
      constructor(title) {
        this.title = title;
      }
      printTitle() {
        console.log(this.title);
      }
    }
    ```
    

### 2.2.9.2 引入模块

- 在其它文件中引入.2.9.1 create module.js中的模块
    
    ```jsx
    // 引入模块
    import { circleArea, squareArea as square } from "./2.2.9.1 create module.js";
    
    console.log(circleArea(5)); // 78.53981633974483
    console.log(square(3)); // 9
    ```
    
    文件名称2.2.9.2 import module.js
    
- 模块可以使用`as`进行重命名
- 除此之外，可以把整个模块当作一个变量来导入，然后像使用类的属性和方法那样调用导出的成员
    
    ```jsx
    import * as area from "./2.2.9.1 create module.js";
    console.log(area.circleArea(8)); // 201.06192982974676
    console.log(area.squareArea(8)); // 64
    ```
    
- 引入默认模块
    
    ```jsx
    // 引入默认模块
    // 自定义默认模块的名称
    import B from "./2.2.9.1 create module.js";
    const myBook = new B("some title");
    myBook.printTitle(); // some title
    ```
    

### 2.2.9.3 在node.js环境下运行ES2015模块

- 如果尝试直接使用node指令来执行2.2.9.2 import module.js文件,回抛出如下错误
    
    ```powershell
    node '.\2.2.9.2 import module.js' 
    (node:8764) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
    (Use `node --trace-warnings ...` to show where the warning was created)
    D:\project\study\javascript\JavaScriptDataStructuresAndAlgorithms3\useful\chapter02\2.2.9.2 import module.js:16
    import { circleArea } from "./2.2.9.1 create module";
    ^^^^^^
    
    **SyntaxError**: Cannot use import statement outside a module
        at ...
    		...
    ```
    
    **SyntaxError: Cannot use import statement outside a module**
    
- 这是因为ES2015的模块使用AMD的语法，而node.js使用的是CommonJS模块的require语法，这表示需要**转译**ES2015标准的模块代码才能在node环境下使用
- 而转译的工作可以使用[babel](2%20ECMAScript%E5%92%8CTypeScript%E6%A6%82%E8%BF%B0.md)完成(查看[babel的使用](https://babeljs.io/docs/en/babel-cli/))，为了保持简单，将babel安装在全局的方式使用Babel命令行工具
    
    ```powershell
    npm install -g babel-cli
    ```
    
     然后使用如下命令进行转译
    
    ```jsx
    babel [originFileUrl] --out-dir [targetFileUrl]
    ```
    
    - 此命令会将originFileUrl位置的源文件转译到targetFileUrl位置（源文件不变，添加新文件）
    
    经过测试，本书提供的方法不再有效，一个正确的方法是
    
    1. 在目录下初始化一个项目，得到一个package.json文件
        
        ```jsx
        npm init
        ```
        
    2. 然后在这个项目下安装babel核心
        
        ```jsx
        npm install --save-dev @babel/core @babel/cli @babel/preset-env
        ```
        
    3. 安装完babel核心后，还要安装能将ES标准模块语法转换为commonjs语法的插件
        
        ```jsx
        npm install --save-dev @babel/plugin-transform-modules-commonjs
        ```
        
    4. 在package.json文件中添加编译命令
        
        ```jsx
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            **"build": "babel src -d lib"**
         },
        ```
        
        - 该命令把src文件下的所有js文件编译后放在lib文件夹下
    5. 因为是在项目里进行编译的，所以需要一个babel的配置文件对编译的需要进行配置，在根目录下创建`babel.config.json` 文件,需要参照[官方网站](https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs#usage)
        
        ```jsx
        {
          "presets": ["@babel/env"],
          "plugins": [
            [
              "@babel/plugin-transform-modules-commonjs",
              {
                "allowTopLevelThis": true,
                "importInterop": "babel"
              }
            ]
          ]
        }
        ```
        
        - `presets` 是babel核心的配置，这里为默认配置
        - `plugins` 表示插件，这里使用`plugin-transform-modules-commonjs` 插件，并对插件进行了配置
    6. 执行`npm run build` 最终生成的文件的效果如下
        
        ```jsx
        "use strict";
        
        function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
        var area = _interopRequireWildcard(require("./2.2.9.1 create module.js"));
        function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
        function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
        
        // 引入模块
        
        console.log((0, area.circleArea)(5));
        console.log((0, area.squareArea)(3));
        console.log(area.circleArea(8));
        console.log(area.squareArea(8));
        console.log(area);
        
        // 引入默认模块
        // 自定义默认模块的名称
        
        var myBook = new area["default"]("some title");
        myBook.printTitle();
        ```
        
        - 可以看到commonjs不支持`import`语法，需要使用`require` 关键字
    7. 直接使用node执行转译后的`2.2.9.2 import module.js`文件，不会报错

### 2.2.9.4 在node 中使用原生的ES2015导入功能

一篇很好的简述[ESM和CommonJS](https://developer.aliyun.com/article/912330)的文章

- 如果能在Node.js中直接使用原生的ES2015导入功能，而不用转译就更好了
- 从Node 8.5 开始,可以将ES2015导入作为实验功能开启

---

本书介绍的方法是将文件的扩展名称由js修改为mjs，同时在引入时使用相同的mjs后缀，如下

```jsx
// 引入模块
import { circleArea, squareArea as square } from "./2.2.9.1 create module.mjs";

console.log(circleArea(5));
console.log(square(3));

import * as area from "./2.2.9.1 create module.mjs";
console.log(area.circleArea(8));
console.log(area.squareArea(8));
console.log(area);

// 引入默认模块
// 自定义默认模块的名称
import B from "./2.2.9.1 create module.mjs";
const myBook = new B("some title");
myBook.printTitle();
```

- 2.2.9.2 import module.mjs文件，将所有的后缀和使用文件后缀的地方都改为mjs

然后直接`node 2.2.9.2 import module.mjs` 即可得到结果（不会报错，但是并不推荐）

---

还有一种方法是****在package.json中配置module(推荐)****

```jsx
"type": "module",
```

配置好以后就可以直接在项目中使用ESM模块化规范了,这样直接运行`node '.\src\2.2.9.2 import module.js'` 也不会报错

### 2.2.9.5 在浏览器环境下运行ES2015模块

ESM模块在浏览器环境下也不是天然有效的，要运行ES2015代码，有几种不同的方式

1. 第一种就是生成传统的代码包，即将代码转译成ES5代码的JavaScript文件，可以使用Browserify和Webpack
2. 第二种方法就是使用<script>的`type` 属性，设置为`module` 就能使用ESM的模块语法了（推荐）
    
    ```jsx
    <script src="./src/2.2.9.2 import module.js" type="module"></script>
    ```
    
    - 要保证不支持该功能的浏览器向后兼容，可以使用nomodule

### 2.2.9.6 ES2015+的向后兼容性

- 需要把JavaScript代码更新到ES2015：肯定需要

# 2.3 介绍TypeScript

- TypeScript是一个**开源的、渐进式包含类型的JavaScript超集**
- 由微软创建并维护，主要功能就是为JavaScript变量提供类型支持

这里不再详细介绍TypeScript，等到具体学习，因为最终TypeScript会被转译为JavaScript