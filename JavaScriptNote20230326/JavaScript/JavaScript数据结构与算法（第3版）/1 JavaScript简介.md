# 1. JavaScript简介

JavaScript在github上的项目[数据](https://githut.info/)

Electron 桌面端应用

# 1.1 JavaScript数据结构和算法

JavaScript作为函数式编程语言非常适合用来学习数据结构和算法（更简单）

# 1.2 环境搭建

有浏览器足以

## 1.2.1 最简单的环境搭建

- 现代浏览器的开发者工具

## 1.2.2 使用Web服务器

- 下载谷歌浏览器插件[Web Server for Chrome](https://chrome.google.com/webstore/detail/ofhbbkphhbklhfoeikjpcbhemlocgigb)
    
    [ofhbbkphhbklhfoeikjpcbhemlocgigb.zip](1%20JavaScript%E7%AE%80%E4%BB%8B/ofhbbkphhbklhfoeikjpcbhemlocgigb.zip)
    
- 在chrome://apps/中找到打开，点击Choose Folder就可以选择在一个文件夹下开启服务器（和`python -m http.server` 类似）

## 1.2.3 Node.js http-server

- 全局安装http-server，这是一个JavaScript服务器（依赖node.js）
    
    ```bash
    npm install http-server -g
    ```
    
- 移动到工作区，输入http-server即可启动服务

<aside>
💡 注意：这种依赖node.js的起服务的库有很多，例如`serve` ，运行`npm install -g serve` 即可全局安装

</aside>

# 1.3 JavaScript基础

- 在HTML中引入JavaScript代码的两种方式：行内引用，外部文件

## 1.3.1 变量

- JavaScript非强类型语言
- 7种原始数据类型和Object引用类型
    - number
    - string
    - symbol
    - null
    - undefined
    - boolean
    - bigint
    
    ---
    
    - Object

### 1.3.1.1 变量作用域

- 作用域：在算法的角度，它就是能在当前位置访问到的变量
- 从作用域的角度，有局部和全局变量两种
- 少使用全局变量

## 1.3.2 运算符

算数运算符：`+ - * / % ++ --`

赋值运算符：`= += -= *= /= %=`

比较运算符：`== === != > >= < <=` 

逻辑运算符：`&& || !`

位运算符：   `& | ~ ^ << >>`

---

这里没有解释全，左移分为[无符号右移](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/5%201%E4%B8%80%E5%85%83%E6%93%8D%E4%BD%9C%E7%AC%A6%E4%B8%8E%E4%BD%8D%E6%93%8D%E4%BD%9C%E7%AC%A6.md)（`>>>`）和[有符号右移](../JavaScript%E9%AB%98%E7%BA%A7%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E7%AC%AC%E5%9B%9B%E7%89%88/3%20%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/5%201%E4%B8%80%E5%85%83%E6%93%8D%E4%BD%9C%E7%AC%A6%E4%B8%8E%E4%BD%8D%E6%93%8D%E4%BD%9C%E7%AC%A6.md)(`>>`)；比较运算符还有 `!==`

## 1.3.3 真值和假值

在条件语句中，undefined，null，+0, -0, NaN，空字符串被看作false，详见[Falsy](../JavaScript%E5%B0%8F%E8%AE%A1/Falsy.md) 

## 1.3.4 相等运算符

详见[JavaScript中的相等性判断](../JavaScript%E5%B0%8F%E8%AE%A1/JavaScript%E4%B8%AD%E7%9A%84%E7%9B%B8%E7%AD%89%E6%80%A7%E5%88%A4%E6%96%AD.md) ，建议只使用`===`

# 1.4 控制结构

## 1.4.1 条件语句

```jsx
if() {

} else {

}

switch() {
	case x:
		
		break;	
	default:
	
}
```

- 三元操作符可以替代if…else语句：`exp ? res1 : res2`

## 1.4.2 循环

```jsx
for(let i = 0; i < n; i++) {

}

let idx = 0;
while(idx < n) {
	idx++;
}

let j = 0;
do {
	j++;
} while(j < n)

```

# 1.5 函数

四种定义函数的方式

函数声明

函数表达式

箭头函数

使用Function构造函数创建

# 1.6 JavaScript面向对象编程

- 基本的创建对象的两种方式
    - 使用Object构造函数
    - 对象字面量语法
- 自定义引用类型的方式
    - 声明构造函数
    - 使用ES6新增的语法糖class类

# 1.7 调试工具

谷歌出的调试工具[使用教程](https://developer.chrome.com/devtools/docs/javascript-debugging)

火狐出的调试工具[使用教程](https://firefox-source-docs.mozilla.org/devtools-user/index.html)

## 1.7.1 推荐编辑器

WebStorm

Sublime Text

Atom

**Visual Studio Code**

## 1.7.2 使用vscode进行调试

安装**~~Debugger for Chrome~~（已被弃用） 插件，推荐使用JavaScript Debugger**

![Untitled](1%20JavaScript%E7%AE%80%E4%BB%8B/Untitled.png)