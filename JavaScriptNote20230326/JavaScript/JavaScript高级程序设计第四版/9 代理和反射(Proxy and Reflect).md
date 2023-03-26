# 9. 代理和反射(Proxy and Reflect)

需要知道地内容: 代理基础、代理捕获器与反射方法、代理模式

ECMAScript 6 新增的**代理**（**Proxy**）和**反射**（**Reflect**）为开发者提供了**拦截**（**intercept**）并向基本操作嵌入额外行为的能力

具体来说，可以给目标对象定义一个关联的代理对象，而这个对象可以作为**抽象**的目标对象来使用

在对目标对象的各种操作影响目标对象之前，可以在代理对象中对这些操作加以控制

<aside>
💡 **注意：** 在ECMAScript6前，ES中没有类似代理的特性，所以对于刚刚解除这个主题的开发者而言，代理作为一种新的基础性语言能力，很多转译程序都不能把代理行为转化为之前的ECMAScript代码，因为**代理的行为实际上是无可替代**的。代理和反射只能在100%支持它们的平台上使用。为了兼容性，可以先判断一下**代理**(**Proxy**)是否存在，不存在就提供后备代码（会导致代码冗余并不提倡）

</aside>

# 1. 代理基础

[1. 代理基础](9%20%E4%BB%A3%E7%90%86%E5%92%8C%E5%8F%8D%E5%B0%84(Proxy%20and%20Reflect)/1%20%E4%BB%A3%E7%90%86%E5%9F%BA%E7%A1%80.md)

# 2. 代理捕获器（Proxy Traps）与反射方法（Reflect Method）

[2. 代理捕获器（Proxy Traps）与反射方法（Reflect Method）](9%20%E4%BB%A3%E7%90%86%E5%92%8C%E5%8F%8D%E5%B0%84(Proxy%20and%20Reflect)/2%20%E4%BB%A3%E7%90%86%E6%8D%95%E8%8E%B7%E5%99%A8%EF%BC%88Proxy%20Traps%EF%BC%89%E4%B8%8E%E5%8F%8D%E5%B0%84%E6%96%B9%E6%B3%95%EF%BC%88Reflect%20Method%EF%BC%89.md)

# 3. 代理模式（Proxy Patterns）

[3. 代理模式(Proxy Pattern)](9%20%E4%BB%A3%E7%90%86%E5%92%8C%E5%8F%8D%E5%B0%84(Proxy%20and%20Reflect)/3%20%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F(Proxy%20Pattern).md)

# 4. 小结

1. 代理是ECMAScript6 新增的令人兴奋和动态十足的新特性，虽然不支持向后兼容，但它开辟了一片前所未有的JavaScript**元编程**（**metaprogramming**）和**抽象（abstraction）**的新天地
2. 从宏观上看，代理是真实JavaScript对象的**透明**（**transparent**）**抽象**（**virtualization**）层，代理可以定义包含**捕获器**（**traps**）的处理程序对象，而这些捕获器可以拦截绝大部分JavaScript的基本操作和方法。在这个捕获器处理程序中，可以任意修改基本操作的行为，当然前提是遵从**捕获器不变式**（**trap invariants**）
3. 与代理如影随形的反射API（Reflect API）则**封装**（**encapsulate**）了一整套与捕获器拦截的操作**相对应**（**identically**）的方法。可以把反射API看作一套基本操作集合，这些操作是绝大部分JavaScript对象API的基础
4. 代理的应用场景是不可限量的。开发者使用它们可以创建出各种编码模式，比如（但远远不限于）**跟踪属性访问**（**tracking property access**）、隐藏属性、阻止修改或删除属性（**preventing modification or deletion of properties**）、函数参数验证、构造函数参数验证、数据绑定、以及观察对象

,