# 关于幂等（about idempotent）

- 在数学上的理解就是：在一个**一元运算**中，x为某集合中的任意数，如果$f(f(x)) = f(x)$，那么该函数$f$在x所在集合内就具有**幂等性**
- 例如$abs(x)$求绝对值的运算满足在实数范围内，$abs(a) = abs(abs(a))$.所以它是一个幂等性函数
- 在二元运算中，x为某集合中的任何数，如果满足$f(x, x) = x$,前提是$f$运算的两个参数都是x，那么称$f$运算具有幂等性
- 例如求最大值函数$max(x,x)=x$就是幂等性函数

---

- 所以对于JavaScript中的内置函数而言，可以将上述描述进行测试即可大致得知函数是否具有幂等性
    - $Math.abs(x) === Math.abs(Math.abs(x))$ 成立，所以$Math.abs()$就是一个具有幂等性的函数
    - $Promise.resovle(Promise.resovle(a)) === Promise.resolve(a)$ 成立，所以$Promise.resolve()$也是一个具有幂等性的函数（它返回一个包装了第一个参数的`Promise` 对象，如果参数本身即使一个`Promise` 对象，会进行空包装）
    
    …