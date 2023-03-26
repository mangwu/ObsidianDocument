# JavaScript设计模式：工厂模式

参考

[从ES6重新认识JavaScript设计模式(二): 工厂模式](https://segmentfault.com/a/1190000014196851)

[JavaScript 设计模式（四）：抽象工厂模式](https://zhuanlan.zhihu.com/p/474342971)

# 1. 工厂模式

## 1.1 概念

- 工厂模式是用来创建对象的一种最常用的设计模式
    - 在不暴露创建对象的逻辑下，将**逻辑封装**在一个函数中
    - 通过调用这个函数可以不断地创建**同一结构**的对象，这个函数就被视为一个工厂
    - 在JavaScript中，将创建一种对象的逻辑封装在一个函数并视它为一个对象创建工厂，通过这个工厂来创建对象的模式叫做**工厂模式**
- 工厂模式根据**抽象程度**不同可分为三种
    - **简单工厂**
    - **工厂方法**
    - **抽象工厂**

## 1.2 抽象（abstract）

- 只了解JavaScript的开发者不是很好理解**抽象（abstract），**因为JavaScript一直把**abstract作为**保留字没有被实现，所以很难理解三种工厂模式的异同
- 下面是一个理解**抽象**和**工厂**的例子
    
    <aside>
    ⚪ 比如说：我要去一个大型的**体育用品店**买一个**篮球**，但是店里除了篮球以外还有**足球、网球**等等其他各种各样的体育用品，由于第一次来到这家店，对店内商品摆放位置不熟悉，短时间内想要找到它可能有点困难，于是我找到**售货员**，并告诉他我想要买个**球**，然后他问我：“你要买什么**类型**的球”，我说我要买一个7号的篮球，在售货员的帮助下我很快就找到了想要的篮球。
    
    </aside>
    
    - 买到的篮球可以被看作一个实例对象，体育用品店可以看作是一个工厂
        - 可以认为这个体育用品店是一个工厂函数，这个工厂函数中有着各种各样的体育用品
        - 如何获取到实例？
            - 获取篮球的方式是向售货员表示要一个7号的篮球
            - 即，给体育用品店（工厂函数）传递了正确的参数——“7号的篮球”
    - 第一次告诉售货员需求时，他不能明白我想要买什么类型的球，因为我说的太**抽象**
        - 我说我想买个**球，**但是球分为很多类型，没有具体到某一件商品
        - 这种将**复杂事务的一个或多个共有特征抽取出来的思维过程**就是**抽象**

# 2. 三种工厂模式

## 2.1 简单工厂模式（Simple Factory Pattern）

- 简单工厂模式又称为**静态工厂模式**，由一个工厂对象决定去创建某一种产品对象类的实例。主要用于创建同一类对象
- 上述体育用品店（工厂）实例化球类的例子如下
    
    ```jsx
    // 简单工厂模式
    // 篮球基类
    var Basketball = function () {
      this.info = "篮球盛行于美国";
    };
    Basketball.prototype = {
      getMember() {
        console.log("每个队伍需要5名球员");
      },
    };
    // 足球基类
    var Football = function () {
      this.info = "足球在世界上很受欢迎";
    };
    Football.prototype = {
      getMember() {
        console.log("每个队伍需要11名球员");
      },
    };
    // 网球基类
    var Tennis = function () {
      this.info = "李娜在中国网球界内是顶尖高手";
    };
    Tennis.prototype = {
      getMember() {
        console.log("每个队伍需要1名球员");
      },
    };
    // 运动工厂
    var SportsFactory = function (name) {
      switch (name) {
        case "篮球":
          return new Basketball();
        case "网球":
          return new Tennis();
        case "足球":
          return new Football();
        default:
          console.log("请传递正确的参数");
          break;
      }
    };
    let basketball = SportsFactory("篮球");
    console.log(basketball);
    basketball.getMember();
    ```
    
    - `SportsFactory` 就是一个简单工厂，这个函数包含三个构造函数，可以创建三种的体育用品的球类
    - 只需要传递“篮球”，“足球”，“网球”这三种可选的参数就可以获得对应的实例对象
- 简单工厂模式的优点
    - 只需要传递一个正确的参数就可以获取想要的对象实例
    - **不需要**知道工厂根据传递的参数创建对象的具体细节
- 简单工厂模式的缺点
    - 在工厂函数内包含了**所有**对象的创建逻辑（构造函数）和判断逻辑的代码
    - 每增加一个新的构造函数（增加一个需要创建的对象实例）就需要修改判断逻辑
    - 当工厂需要创建的对象不是3个而是30个或者更多时，这个函数就会成为庞大的超级函数，难以**维护**
- 简单工厂应用场景
    - 只作用于创建的对象**数量较少**
    - 对象的创建**逻辑不复杂**

## 2.2 工厂方法模式（Function Factory Pattern）

- 工厂方法模式的本意是将实际创建对象的工作推迟到子类中，这样核心类就变成了抽象类
    - 如上面的方法中，创建对象的过程在`SportsFactory` 中就直接`new` 出来了
    - 但是在工厂方法中，需要将创建对象的过程推迟到一个`AbstractFactory` 的子类（XXFacroty）中，让这个子类专门进行创建对象的功能
- 但是在JavaScript中**很难**像传统面向对象那样去实现创建抽象类
    - 所以只需要参考工厂方法模式的核心思想：将创建对象工作推迟到子类中
    - 所以我们可以将`SportsFactory` （工厂方法）看作是一个实例化对象的工厂类（而非工厂函数）
    - 每次要创建对象时，先创建一个`SportsFactory` 的实例，这个实例应该包含所有的构造函数
    - 想要创建对象时，调用`SportsFacroty` 实例中保存的对应构造函数即可
    - 为了使用`SportFactory` 直接创建对象，可以使用安全模式
- 实现
    
    ```jsx
    // 工厂是一个类，包含所有的构造函数
    var SportsFactory = function (name) {
      if (this instanceof SportsFactory) {
        var s = new this[name]();
        return s;
      } else {
        return new SportsFactory(name);
      }
    };
    SportsFactory.prototype = {
      Basketball: function () {
        this.info = "篮球盛行于美国";
        this.getMember = function () {
          console.log("篮球队员5人");
        };
      },
      Football: function () {
        this.info = "足球在全世界都很流行";
        this.getMember = function () {
          console.log("足球队需要11人");
        };
      },
      Tennis: function () {
        this.info = "李娜是中国网球的顶尖选手";
        this.getMember = function () {
          console.log("网球是单人项目");
        };
      },
    };
    
    const football = SportsFactory("Football");
    console.log(football);
    football.getMember();
    // 打印
    Football { info: '足球在全世界都很流行', getMember: [Function (anonymous)] }
    足球队需要11人
    ```
    
    - 上述这段代码很好的解决了每添加一个构造函数就需要修改两处代码的问题，在简单工厂模式中
        - 需要新增一个构造函数
        - 需要修改工厂函数，增加可构造的函数
    - 而在工厂方法模式中，只需要在工厂类中新增可构造函数即可
- 例如加一个乒乓球构造函数
    
    ```jsx
    SportsFactory.prototype = {
    	...
    	Pingpang: function () {
        this.info = "中国的乒乓球是世界霸主";
        this.getMember = function () {
          console.log("乒乓球由单人和双人项目");
        };
      },
    }
    ```
    
- 因为将`Basketball`, `Football`,等构造函数保存到了`SportFactory.prototype` 中，这意味这必须实例化`SportFactory` 函数才能进行以上对象的创建；使用安全模式仅仅是为了直接调用工厂函数也能创建对象，如果不使用安全模式，则需要进行两次实例化，如下
    
    ```jsx
    SportsFactory = function () {};
    SportsFactory.prototype = {
      Basketball: function () {
        this.info = "篮球盛行于美国";
        this.getMember = function () {
          console.log("篮球队员5人");
        };
      },
      Football: function () {
        this.info = "足球在全世界都很流行";
        this.getMember = function () {
          console.log("足球队需要11人");
        };
      },
      Tennis: function () {
        this.info = "李娜是中国网球的顶尖选手";
        this.getMember = function () {
          console.log("网球是单人项目");
        };
      },
      Pingpang: function () {
        this.info = "中国的乒乓球是世界霸主";
        this.getMember = function () {
          console.log("乒乓球有单人和双人项目");
        };
      },
    };
    const sf = new SportsFactory();
    const pingpang = new sf.Pingpang();
    console.log(pingpang);
    pingpang.getMember();
    // 打印
    Pingpang { info: '中国的乒乓球是世界霸主', getMember: [Function (anonymous)] }
    乒乓球由单人和双人项目
    ```
    
    - 一旦任何一个地方忘记`new`，都会导致无法正常获取到`pingpang` 所以需要使用安全模式

## 2.3 抽象工厂模式（Abstract Factory Pattern）

- 抽象工厂模式（Abstract Factory Pattern）就是通过类的抽象使得业务适用于一个产品类簇（cu）的创建，而不负责某一类产品的实例
- 抽象工厂的通用实现需要一下类或方法
    - Factory: 工厂，负责返回对象实例
    - AbstractFactory: 虚拟工厂，制定工厂实例的结构
    - Product： 产品，访问者从工厂中拿到的产品对象实例，实现抽象类
    - AbstractPorduct: 产品抽象类，有具体产品实现，制定产品实例的结构
- 可能不好理解，还是从体育用品店出发
    - 体育用品店除了球外，还卖球拍，以及球鞋等
    - 如果我们使用工厂方法模式，那么每有一个具体的体育用品要卖就要在工厂函数中新增一个构造函数
    - 当体育用品过多时，这个工厂就很拥挤了，且没有对球，球拍，球鞋的产品进行分类
    - 所以我们需要抽象出来一个工厂，这个抽象工厂制定实例的结构，如体育用品店能购买球，购买球拍等
    - 而继承它的工厂`Factory` 应该实现虚拟工厂的制定的方法，从中获取制定的产品，如实现构造球的方法，根据球类型返回具体的球类
    - 而产品通用需要抽象，一种运动可以有球拍也可能没有球拍，我们创建一个抽象的排类来制定产品实例的结构，具体的是乒乓球拍还是网球拍需要继承抽象的排类来实现结构
- 使用ES6的class的通用实现如下
    
    ```jsx
    /* 工厂 抽象类 */
    class AbstractFactory {
        constructor() {
            if (new.target === AbstractFactory) 
                throw new Error('抽象类不能直接实例化!')
        }
        
        /* 抽象方法 */
        createProduct1() { throw new Error('抽象方法不能调用!') }
    }
    
    /* 具体工厂类 */
    class Factory extends AbstractFactory {
        constructor() { super() }
        
        createProduct1(type) {
            switch (type) {
                case 'Product1':
                    return new Product1()
                case 'Product2':
                    return new Product2()
                default:
                    throw new Error('当前没有这个产品 -。-')
            }
        }
    }
    
    /* 抽象产品类 */
    class AbstractProduct {
        constructor() {
            if (new.target === AbstractProduct) 
                throw new Error('抽象类不能直接实例化!')
            this.kind = '抽象产品类1'
        }
        
        /* 抽象方法 */
        operate() { throw new Error('抽象方法不能调用!') }
    }
    
    /* 具体产品类1 */
    class Product1 extends AbstractProduct {
        constructor() {
            super()
            this.type = 'Product1'
        }
        
        operate() { console.log(this.kind + ' - ' + this.type) }
    }
    
    /* 具体产品类2 */
    class Product2 extends AbstractProduct {
        constructor() {
            super()
            this.type = 'Product2'
        }
        
        operate() { console.log(this.kind + ' - ' + this.type) }
    }
    
    const factory = new Factory()
    
    const prod1 = factory.createProduct1('Product1')
    prod1.operate()                                                                     // 输出: 抽象产品类1 - Product1
    const prod2 = factory.createProduct1('Product3')    // 输出: Error 当前没有这个产品 -。
    ```
    
- 从体育用品店中购买用品
    
    ```jsx
    // 抽象工厂模式
    
    class AbstractSportsFactory {
      constructor() {
        if (new.target === AbstractSportsFactory) {
          throw new Error("抽象类不能直接实例化！");
        }
      }
      // 抽象方法
      createBall() {
        throw new Error("抽象方法不能调用");
      }
      createShoes() {
        throw new Error("抽象方法不能调用");
      }
      createBats() {
        throw new Error("抽象方法不能调用");
      }
    }
    class SportsFactory extends AbstractSportsFactory {
      constructor() {
        super();
      }
      createBall(type) {
        switch (type) {
          case "Pingpong":
            return new Pingpong();
          case "Tennis":
            return new Tennis();
          case "Basketball":
            return new Basketball();
          case "Football":
            return new Football();
          default:
            throw new Error(`本店不提供${type}球`);
        }
      }
      createShoes(type) {
        switch (type) {
          case "Pingpong":
            return new PingpongShoes();
          case "Tennis":
            return new TennisShoes();
          case "Basketball":
            return new BasketballShoes();
          case "Football":
            return new FootballShoes();
          default:
            throw new Error(`本店不提供${type}鞋`);
        }
      }
      createBats(type) {
        switch (type) {
          case "Pingpong":
            return new PingpongBats();
          case "Tennis":
            return new TennisBats();
          default:
            throw new Error(`本店不提供${type}拍`);
        }
      }
    }
    class AbstractBall {
      constructor() {
        if (new.target === AbstractBall) {
          throw new Error("抽象产品不能直接实例化");
        }
        this.type = "球";
      }
      play() {
        throw new Error("抽象方法不能直接调用");
      }
    }
    class AbstractShoes {
      constructor() {
        if (new.target === AbstractShoes) {
          throw new Error("抽象产品不能直接实例化");
        }
        this.type = "球鞋";
      }
      wear() {
        throw new Error("抽象方法不能直接调用");
      }
    }
    class AbstractBats {
      constructor() {
        if (new.target === AbstractShoes) {
          throw new Error("抽象产品不能直接实例化");
        }
        this.type = "球拍";
      }
      test() {
        throw new Error("抽象方法不能直接调用");
      }
    }
    
    class PingpongShoes extends AbstractShoes {
      constructor() {
        super();
      }
      wear() {
        console.log("穿上了乒乓球鞋");
      }
    }
    class TennisShoes extends AbstractShoes {
      constructor() {
        super();
      }
      wear() {
        console.log("穿上了网球鞋");
      }
    }
    class BasketballShoes extends AbstractShoes {
      constructor() {
        super();
      }
      wear() {
        console.log("穿上了篮球鞋");
      }
    }
    class FootballShoes extends AbstractShoes {
      constructor() {
        super();
      }
      wear() {
        console.log("穿上了足球鞋");
      }
    }
    class Football extends AbstractBall {
      constructor() {
        super();
      }
      play() {
        console.log("踢足球真好玩，可是不会踢");
      }
    }
    class Tennis extends AbstractBall {
      constructor() {
        super();
      }
      play() {
        console.log("讨厌网球，不喜欢打网球");
      }
    }
    class Basketball extends AbstractBall {
      constructor() {
        super();
      }
      play() {
        console.log("很想打篮球，但是打的很烂");
      }
    }
    class Pingpong extends AbstractBall {
      constructor() {
        super();
      }
      play() {
        console.log("会打乒乓球，乒乓球很好玩");
      }
    }
    class PingpongBats extends AbstractBats {
      constructor() {
        super();
      }
      test() {
        console.log("这个乒乓球拍质量怎么样啊");
      }
    }
    class TennisBats extends AbstractBats {
      constructor() {
        super();
      }
      test() {
        console.log("网球拍好重啊");
      }
    }
    
    const sf = new SportsFactory();
    const pingpong = sf.createBall("Pingpong");
    const basketballshoes = sf.createShoes("Basketball");
    const tennisbats = sf.createBats("Tennis");
    
    console.log(pingpong); // Pingpong { type: '球' }
    pingpong.play(); // 会打乒乓球，乒乓球很好玩
    console.log(basketballshoes); // BasketballShoes { type: '球鞋' }
    basketballshoes.wear(); // 穿上了篮球鞋
    console.log(tennisbats); // TennisBats { type: '球拍' }
    tennisbats.test(); // 网球拍好重啊
    try {
      const basketballbats = sf.createBats("Basketball");
    } catch (error) {
      console.log(error.message); // 本店不提供Basketball拍
    }
    try {
      const a = new AbstractSportsFactory();
    } catch (error) {
      console.log(error.message); // 抽象类不能直接实例化！
    }
    ```
    
- 因为JavaScript没有直接的抽象类，`abstract` 只是一个保留字，为了模拟实现抽象类，需要在构造函数和抽象类方法中抛出错误
    
    ```jsx
    class AbstractSportsFactory {
      constructor() {
        if (new.target === AbstractSportsFactory) {
          throw new Error("抽象类不能直接实例化！");
        }
      }
      // 抽象方法
      createBall() {
        throw new Error("抽象方法不能调用");
      }
    }
    ```
    
    - `[new.target](http://new.target)` 是是用来判断`new` 的是那个类的属性
- 抽象工厂模式的优点
    - 抽象产品类将产品的结构抽象出来，访问者不需要知道具体实现，只需要面向向产品的结构编程即可，从产品的具体实现解耦
- 抽象工厂模型的缺点
    - 扩展新类簇的产品类比较困难，因为需要创建新的抽象产品，并且还需要修改工厂类，违反开闭原则，如体育用品店卖球衣，则需要构建抽象球衣类以及具体的球衣类，也要修改工厂类
    - 带来新的复杂度，增加新的类，和形的复杂关系