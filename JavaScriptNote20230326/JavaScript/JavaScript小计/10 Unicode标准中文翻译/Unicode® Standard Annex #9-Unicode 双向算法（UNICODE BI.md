# Unicode® Standard Annex #9-Unicode 双向算法（UNICODE BIDIRECTIONAL ALGORITHM）

[Unicode Bidirectional Algorithm](https://www.unicode.org/reports/tr9/#Introduction)

| 版本 | Unicode 15.0.0 (2022)  |
| --- | --- |
| 编辑 | Mark Davis (mailto:mark@unicode.org)， Ken Whistler (mailto:ken@unicode.org) |
| 日期 | 2022-08-16 |
| 当前版本 | https://www.unicode.org/reports/tr9/tr9-46.html |
| 上个版本 | https://www.unicode.org/reports/tr9/tr9-44.html |
| 最新版本 | https://www.unicode.org/reports/tr9/ （20221215目前46就是最新版本，47还处于提案阶段） |
| 修订（Revision） | https://www.unicode.org/reports/tr9/#Modifications |

***总结***

*本附录描述了包含从右向左流动的字符(如阿拉伯语或希伯来语)的文本中字符的**定位规范**（**specifications for the positioning**）。*

***附录状态***

*本文件已由Unicode成员和其他感兴趣的团体审阅，并已获Unicode联盟批准出版（**publication**）。这是一个稳定的文件，可以视为**参考资料**（**reference material**）或作为其他规范的**标准参考**（**normative reference**）。*

***Unicode标准附件**(UAX，**Unicode Standard Annex**)是Unicode标准的组成部分，但会作为一个单独的文件在网上被发布。如果在Unicode标准版本的一致性章节中有遵循标准附件的规定，Unicode标准可能要求符合Unicode标准附件中的规范性内容。UAX文档的版本号对应于它所组成的Unicode标准的版本。*

*请在在线报告表[[反馈](https://www.unicode.org/reporting.html)]中提交**更正**（**corrigenda**）和其他意见。对理解本附录有用的相关信息可以在Unicode标准附录#41，“[Unicode标准附录的常见参考](https://www.unicode.org/reports/tr41/tr41-30.html)”中找到。有关Unicode标准的最新版本，请参阅[[Unicode](https://www.unicode.org/versions/Unicode15.0.0/)]。有关当前Unicode技术报告的列表，请参阅[[报告](https://www.unicode.org/reports/)]。有关Unicode标准版本的更多信息，请参见[[版本](https://www.unicode.org/versions/Unicode15.0.0/)]。适用于本附件的任何勘误表，见[[勘误表](https://www.unicode.org/errata/)]。*

***内容***

---

# 1. 介绍

Unicode标准规定（prescribes）了一种以**逻辑顺序（logical order）**为著称的**内存表示顺序**（**memory representation order**）。当文本以水平行的方式显示时，大多数**文字（scripts）**都是从左到右显示字符。然而，有几种文字(如阿拉伯语或希伯来语)水平文本的自然显示顺序是从右到左。如果所有文本具有统一的水平方向，则显示文本的顺序是明确的。

然而，由于这些从右到左的**文字（scripts）**需要使用从左到右书写的数字，因此文本实际上是**双向的**（**bidirectional**）：由右到左和从左到右的混合文本。除了数字，英语和其他文字的嵌入词也从左到右书写，同样产生**双向文本**（**bidirectional text**）。如果没有明确的规范，当文本的水平方向不一致时，在确定显示字符的顺序时可能会出现歧义。

本附录描述一个用于确定双向Unicode文本的**方向**（**directionality**）的算法。该算法扩展了现有并已被实现的**隐式模型（implicit model）**，并为特殊情况添加了**显式格式化字符**（**explicit formatting characters**）。在大多数情况下，不需要在文本中包含额外的信息来获得正确的显示顺序。

然而，在某些显示**双向文本**的情况下，**隐式的双向显示顺序**（**implicit bidirectional ordering**）不足以产生**可理解的**（**comprehensible**）文本。为了处理这些情况，我们定义了一组最小的**定向格式化字符**（**directional formatting characters**），以控制字符在渲染时的顺序。这为**清楚的信息交换（legible interchange）**提供了准确地显示顺序控制方案，并确保用于文件名或标签等简单项目的纯文本总是可以以正确顺序显示。

定向格式化字符仅用于影响文本的显示顺序。在其他方面，应该忽略它们，因为它们对文本比较、**分词**（**word breaks**）、解析或数值分析没有影响。

每个字符都有一个**隐式的双向类型**（**implicit bidirectional type**）。从左到右和从右到左的双向类型称为强类型(strong type)，这些类型中的字符称为**强定向字符**(**strong directional character**)。与数字关联的双向类型称为弱类型(**weak type**)，这种类型中的字符称为**弱定向字符**(**weak directional character**)。除了**定向格式化字符**之外，其余的双向类型和字符都称为**中性**（**neutral**）字符。该算法利用文本中字符的隐式双向类型来达到合理的文本显示顺序。

在处理**双向文本**时，字符仍然按照逻辑顺序解释（**interpreted**）——只是影响显示。双向文本的显示顺序取决于文本中字符的**方向属性（directional properties）**。请注意，有一些与双向文本相关的重要安全问题:更多信息，请参阅[[UTR36]](https://www.unicode.org/reports/tr41/tr41-30.html#UTR36)。

# 2. 定向格式化字符（****Directional Formatting Characters****）

三种类型的显式定向格式化字符用于修改标准的隐式Unicode双向算法(**Unicode Bidirectional Algorithm, UBA**)。此外，还有隐式的定向格式化字符，即从右到左和从左到右的标记。所有这些格式化字符的效果仅限于当前段落；因此，它们由**段落分隔符**（**paragraph separator**）终止。

这些格式化字符都具有`Bidi_Control`属性，并分为三组:

| 隐式定向格式化字符 | LRM, RLM, ALM（ALM是阿拉伯语字符） |
| --- | --- |
| 显式定向内嵌和重写格式化字符 | LRE, RLE, LRO, RLO, PDF（LRE，RLE是嵌入的，E表示Embedding；LRO，RLO是重写的，O表示Override，PDF是终止控制符） |
| 显式定向隔离格式化字符 | LRI, RLI, FSI, PDI（PDI是隔离的终止控制符） |

虽然术语**“嵌入”（Embedding）**用于一些显式格式化字符，但嵌入格式化字符范围内的文本与周围的文本并不是独立的。嵌入内的字符会影响外部字符的顺序，反之亦然。然而，隔离格式化字符的情况并非如此。**隔离**（**isolate**）中的字符不能影响外部字符的顺序，反之亦然。隔离字符作为一个整体对周围字符排序的影响与**中性字符**（**neutral character**）的影响相同，而**嵌入**或**重写**大概具有强字符的影响。

**定向嵌入字符**通常对其周围字符有很强的影响，因此使用起来有没必要的困难，为此在Unicode 6.3中引入了**定向隔离字符**。引入新字符而不是改变现有字符的行为，这样做可以避免对那些依赖旧行为的现有文档产生不良影响。然而，在新文档中鼓励使用**定向隔离**而不是**嵌入**——只要知道目标平台支持它们。

在web页面上，显式定向格式化字符(所有类型——嵌入、重写和隔离)应该被适用于被HTML和CSS的**机制**（**mechanisms**）替换。有关显式定向格式化字符与等效的HTML5标记和CSS属性之间的对应关系，请参见2.7节：[标记和格式化字符](https://www.unicode.org/reports/tr9/#Markup_And_Formatting)。

## 2.1 显式定向嵌入

下面的字符表示的一段文本被视为嵌入。例如，阿拉伯语句子中间的英语**引文**（**quotation**）可以标记为嵌入的从左到右文本。如果在英语引文中间有一个希伯来语**短语**（**phrase**），这个短语就可以被标记为嵌入的从右到左的文本。嵌入可以嵌套在另一个中，也可以嵌套在隔离和重写中。

| 简写 | 码点 | 名称 | 描述/说明 |
| --- | --- | --- | --- |
| LRE | U+202A | LEFT-TO-RIGHT EMBEDDING | 将之后的文本视为从左到右嵌入的。 |
| RLE | U+202B | RIGHT-TO-LEFT EMBEDDING | 将之后的文本视为从右到左嵌入的。 |

例如，**左右线方向**（**right-left line direction**）的效果可以通过嵌入RLE…PDF来实现(PDF将在2.3节中描述，显式嵌入和覆盖终止符)。

## 2.2 显式定向重写

在特殊情况下，使用以下字符会重写双向字符类型，例如与数字有关部分。出于安全考虑，应尽可能避免使用它们。更多信息，请参阅[[UTR36](https://www.unicode.org/reports/tr41/tr41-30.html#UTR36)]。定向重写可以嵌套在另一个重写中，也可以嵌套在嵌入和隔离中。

| 简写 | 码点 | 名称 | 描述/说明 |
| --- | --- | --- | --- |
| LRO | U+202D | LEFT-TO-RIGHT OVERRIDE | 强制将后面的字符视为从左到右的强字符。 |
| RLE | U+202E | RIGHT-TO-LEFT OVERRIDE | 强制将后面的字符视为从右到左的强字符。 |

这些字符的**确切含义**（**precise meaning**）将在讨论算法时说明。例如，从右到左的重写可以强制由英文、数字和希伯来字母混合组成的<**?双向文本>**（**a part number**）从右到左书写。

## 2.3 显式定向嵌入和覆盖终止符

下面的字符终止尚未终止的最后一个LRE、RLE、LRO或RLO的作用域。

| 简写 | 码点 | 名称 | 描述/说明 |
| --- | --- | --- | --- |
| PDF | U+202C | POP DIRECTIONAL FORMATTING | 结束最后一个LRE、RLE、RLO或LRO的作用域。 |

这个字符的确切含义将在讨论算法时说明。

## 2.4 显式定向隔离

下面的字符表示一段文本被视为与周围字符**定向分离（directionally isolated）**。它们与显式嵌入格式化字符非常相似。然而，虽然嵌入大致上对周围文本的顺序具有强字符的效果，但隔离字符具有**中性**（**neutral**）字符的效果，就像[U+FFFC OBJECT REPLACEMENT CHARACTER](对象替换字符)，并被分配在周围文本中相应的显示位置。此外，隔离内部的文本不会影响其外部文本的顺序，反之亦然。

**隔离格式化字符**除了能让文本嵌入具有强方向性的文本而不过度影响其周围字符的**双向顺序**（**bidirectional order**）外，隔离格式化字符之一还提供了一个额外的功能：嵌入文本同时启发式地（**heuristically**）从其**组成字符**（**constituent characters**）推断其方向。

隔离可以一个嵌套在另一个中，也可以嵌套在嵌入和重写中。

| 简写 | 码点 | 名称 | 描述/说明 |
| --- | --- | --- | --- |
| LRI | U+2066 | LEFT‑TO‑RIGHT ISOLATE | 将后面的字符视为隔离的从左到右的文本。 |
| RLI | U+2067 | RIGHT‑TO‑LEFT ISOLATE | 将后面的字符视为隔离的从右到左的文本。 |
| FSI | U+2068 | FIRST STRONG ISOLATE | 将下面的文本视为隔离的，并按照其第一个强方向字符的方向处理，不包含在嵌套隔离中的字符。 |

这些字符的确切含义将在讨论算法时说明。

## 2.5 显示定向隔离终止符

以下字符终止最后一个LRI、RLI或FSI尚未终止的作用范围，以及任何后续LREs、RLEs、LROs或RLOs尚未终止的作用范围。

| 简写 | 码点 | 名称 | 描述/说明 |
| --- | --- | --- | --- |
| PDI | U+2069 | POP DIRECTIONAL ISOLATE | 结束最后一个LRI、RLI或FSI的作用域。 |

这个字符的确切含义将在讨论算法时说明。

## 2.6 隐式定向标记

这些字符是非常**轻量级的格式**（**light-weight formatting**）。它们的行为完全类似于从右到左或从左到右的字符，只是它们不显示或不具有任何其他语义效果。它们的使用比使用显式嵌入或重写更方便，因为它们的作用域更局部。

| 简写 | 码点 | 名称 | 描述/说明 |
| --- | --- | --- | --- |
| LRM | U+200E | LEFT-TO-RIGHT MARK | 从左到右零宽度字符 |
| RLM | U+200F | RIGHT-TO-LEFT MARK | 从右到左零宽度的非阿拉伯字符 |
| ALM | U+061C | ARABIC LETTER MARK | 从右到左零宽度的阿拉伯字符 |

下面的算法没有特别提到隐式方向标记。这是因为**它们对双向顺序的影响与相应的强方向性字符完全相同**；唯一的区别是它们不会显示在屏幕上。

## 2.7 标记和格式化字符

显式格式化字符将**状态**（**state**）引入到纯文本中，在编辑或显示文本时必须维护状态。在没有意识到这一状态的情况下修改文本的过程可能会无意中影响大部分文本的呈现，例如删除PDF。

**Unicode双向算法（Unicode Bidirectional Algorithm）**的设计使得显式格式化字符的使用可以等效地用**越行信息**（**out-of-line information**）来表示，例如样式信息或标记【样式信息就是CSS，标记就是HTML标签】。如果在同一段中同时使用标记字符和显式格式化字符，就会出现冲突。在可用的情况下，应该使用标记而不是显式的格式化字符：更多信息，请参阅[[UnicodeXML](https://www.unicode.org/reports/tr41/tr41-30.html#UnicodeXML)]。但是，任何**可选方案**（**alternative representation**）的定义都只能**参考（by reference to）**该算法中相应显式格式化字符的行为，以确保与Unicode标准一致。

HTML5[[HTML5](https://www.unicode.org/reports/tr41/tr41-30.html#HTML5)]和CSS3[[CSS3Writing](https://www.unicode.org/reports/tr41/tr41-30.html#CSS3Writing)]对bidi标记的支持如下所示：

| Unicode | HTML5等效项(Equivalent Markup) | CSS等效项 | 说明（Common） |
| --- | --- | --- | --- |
| RLI…PDI | dir=”rtl” | direction: rtl; unicode-bidi: isoloate; | 在任意一个元素上的dir属性 |
| LRI…PDI | dir=”ltr” | direction: ltr; unicode-bidi: isoloate; | 在任意一个元素上的dir属性 |
| FSI…PDI | <bdi>…</bdi>或dir=”auto” | unicode-bidi: plaintext; | 在任意一个元素上的dir属性 |
| RLE…PDF |  | direction: rtl; unicode-bidi: embed; | HTML中没有对应的标记 |
| LRE…PDF |  | direction: ltr; unicode-bidi: embed; | HTML中没有对应的标记 |
| RLO…PDF |  | direction: rtl; unicode-bidi: bidi-override; | HTML中没有对应的标记 |
| LRO…PDF |  | direction: lrt; unicode-bidi: bidi-override; | HTML中没有对应的标记 |
| FSI RLO…PDF PDI | <bdo dir=”rtl”>…</bdo> | direction: rtl; unicode-bidi: isoloate-override; |  |
| FSI LRO…PDF PDI | <bdo dir=”ltr”>…</bdo> | direction: ltr; unicode-bidi: isoloate-override; |  |

与HTML4.0不同的是，HTML5并没有为LRE、RLE、LRO和RLO提供完全等价的格式，尽管上面概述的`dir`属性和`BDO`元素在大多数情况下应该可以和这些格式化字符一样好，甚至更好。在绝对必要的情况下，还可以使用CSS来获取等价的LRE、RLE、LRO和RLO，以及LRI、RLI和FSI。

在从包含标记的文档生成纯文本时，应该引入等价的格式化字符，这样就不会丢失正确的顺序。例如，当剪切和粘贴产生纯文本时，就应该进行这种转换。

# 3. 基础显示算

Unicode双向算法(Unicode Bidirectional Algorithm, UBA)接受一个文本流作为输入，分四个主要阶段进行处理：

1. **分成段落（Separation into paragraphs）**。算法的剩下部分分别应用于每个段落中的文本。
2. **初始化（Initialization）**。初始化双向字符类型的列表，原始文本中的每个字符对应一个**条目**（**entry**）。每个**条目（entry）**的值是对应字符的**Bidi_Class**属性值。然后初始化嵌入级别列表，每个字符对应一个**嵌入级别（embedding level）**。请注意，原始字符是在3.3.5节中引用的，[解决中性和隔离的格式化类型](Unicode%C2%AE%20Standard%20Annex%20#9-Unicode%20%E5%8F%8C%E5%90%91%E7%AE%97%E6%B3%95%EF%BC%88UNICODE%20BI.md)。
3. **解析嵌入级别（Resolution of the embedding levels）**。一系列规则被应用于嵌入级别列表和双向字符类型。每个规则都对这些列表的当前值进行操作，并可以修改这些值。在某些规则的应用中会引用原始字符及其`Bidi_paired_brackets`和`Bidi_Paired_Bracket_Type`属性值。这个阶段的结果是修改嵌入级别列表中的值并舍弃双向字符类型列表。
4. **重新排序**（**Reordering**）。每个段落中的文本将重新排序以供显示：首先，将段落中的文本分成几行，然后使用已解析的嵌入级别对每行的文本进行重新排序以供显示。

该算法只对**段落**（**paragraph**）内的文本进行重排；一段中的字符对另一段中的字符没有影响。段落由**段落分隔符（Paragraph Separator）**或适当的**换行符函数**（**Newline Function**）分割(有关处理CR、LF和CRLF的参考，请参阅[[Unicode15.0.0标准文档](https://www.unicode.org/versions/Unicode15.0.0/)]的第4.4节-**方向性**（**Directionality**）和第5.8节-**换行的原则**（**Newline Guidelines）**)。段落也可以由**更高级**（**higher-level**）的协议确定：例如，表中两个不同单元格中的文本将位于不同的段落中。

在内存表示中，**组合字符（Combining characters）**总是附加到前面的基本字符。即使在显示重新排序和**执行字符整形**（**performing character shaping**）之后，表示组合字符的**字形**（**glyph**）仍将附加到在内存中表示其基本字符的字形上。例如，根据基本字形的**行方向**（**line orientation**）和**放置方向**（**placement direction**），它可以附在字形的左侧、右侧或上方。

本附录使用编号约定了规范定义和规则，见表1

**Table 1. 规范性定义和规则(normative definitions and rules)**

| 编码/简称 | 单位/全称 |
| --- | --- |
| BDn | 定义（Definitions） |
| Pn | 段级别（Paragraph levels） |
| Xn | 显示级别和方向（Explicit levels and directions） |
| Wn | 弱类型（Weak types） |
| Nn | 中性类型（Neutral types） |
| In | 隐式级别（Implicit levels） |
| Ln | 解决级别（Resolved levels） |

## 3.1 定义

### 3.1.1 基础

***BD1*. *双向字符类型（bidirectional character types）***是分配给每个Unicode字符的值，包括未分配的字符。它在*Unicode字符数据库[[UCD](https://www.unicode.org/reports/tr41/tr41-30.html#UCD)]*中的正式属性名称是Bidi_Class。

***BD2.* *嵌入级别（Embedding levels）***是表示文本嵌套深度的数字，以及该级别上文本的默认方向。文本的最小嵌入级别为0，最大显式深度为125——在本文档的之后的部分称为max_depth。

正如[规则](Unicode%C2%AE%20Standard%20Annex%20#9-Unicode%20%E5%8F%8C%E5%90%91%E7%AE%97%E6%B3%95%EF%BC%88UNICODE%20BI.md)X1到X8将指定的那样，嵌入级别由**显式格式化字符**(嵌入、隔离和重写)设置；数字越大，文本嵌套越深。嵌入级别有一个最大显式深度的原因是：提供精确的栈限制，以保证具体实现具有相同的结果。即使使用机器生成的文本格式，125的最高显式级别对文本排序也足够了；有超过少量的嵌入，显式顺序就会变得相当**混乱**（**muddied**）。

为保证实现的稳定性，该规范现在确保max_depth的值为125，在未来的版本中不会增加(或减少)。因此，将max_depth值视为常量是安全的。从UBA版本6.3.0开始，max_depth值一直是125。

***BD3*. 当前嵌入级别(所述字符)的默认方向称为*嵌入方向（embedding direction）*。如果嵌入级别为偶数，则为L;如果嵌入级别为奇数，则为R。**

例如，在特定的一段文本中，级别0是纯英语文本。级别1是纯阿拉伯文本，可以被嵌入到英语级别0文本中。第2级是英语文本，可能嵌入在阿拉伯语第1级文本中，以此类推。除非他们的方向被重写，英文文本和数字将永远是一个偶数级别；阿拉伯文本(不包括数字)将始终是奇数级别。在讨论重排序算法时，嵌入层的确切含义将变得清晰，下面提供了该算法如何工作的示例。

***BD4*. *段落嵌入级别（paragraph embedding level）***是确定该段落中文本的默认双向方向的嵌入级别。

***BD5*. 段落嵌入级别的方向称为*段落方向（paragraph direction）*。**

- 在某些语境中，段落方向也称为***基本方向（base direction******）***。

***BD6*. *定向重写状态（directional override status）*决定是否重置双向字符类型。**定向重写状态通过使用明确的显式定向格式化字符来设置。此状态有三种状态，如表2所示。

**表2. 定向重写状态**

| 状态 | 解释 |
| --- | --- |
| 中性（Neutral） | 当前没有激活重写 |
| Right-to-left | 字符将重置为R |
| Left-to-right | 字符将重置为L |

***BD7. 级别串(level run)***是具有相同嵌入级别的字符的最大子串。它的最大性体现在，子字符串前后的字符没有相同的嵌入级别(级别串也称为***方向串（directional run）***)。

如下所述，在双向算法的两个不同阶段，**级别串**都很重要。第一阶段发生在，X1到X9范围，基于**段落方向**和**显式定向格式化字符**为每个字符分配**显式嵌入级别**之后。在这个阶段，在X10中，**级别串**用于构建应用于后续规则的单元。这些规则根据每个字符的**隐式双向类型（implicit bidirectional type）**和单元中其他字符的类型进一步调整每个字符的嵌入级别，但不调整单元之外的字符。由这些已解决的嵌入级别产生的级别运行，然后用于规则L2对文本的实际重排。下面的例子演示了level在算法的最后阶段的运行。

**例子**

在这个示例和下面的示例中，用大小写表示不同的隐式字符类型，以模拟哪些不熟悉的从右到左的字母。大写字母代表从右到左的字符(如阿拉伯语或希伯来语)，小写字母代表从左到右的字符(如英语或俄语)。

**`Memory:**            car is THE CAR in arabic`

**`Character types:**   LLL-LL-RRR-RRR-LL-LLLLLL`

**`Paragraph level:**   0`

**`Resolved levels:**   000000011111110000000000`

注意，和`CAR`之间的中立字符(空格)将获得周围字符的级别。中性字符的级别可以通过在中性字符周围插入适当的方向标记，或使用显式的定向格式化字符来更改。

### 3.1.2 匹配显式定向格式化字符

***BD8***. ***隔离启动器（isolate initiator）***是LRI、RLI或FSI类型的字符。

正如规则X5a到X5c规范的那样，当<?执行深度限制的规则允许时>(the rules enforcing the depth limit allow it)，**隔离启动器**将提高在它之后的字符的嵌入级别。

***BD9.*** 对于给定的隔离启动器，***匹配的PDI***是由以下算法确定的：

- 将一个计数器初始化为1。
- 对**隔离启动器（isolate initiator）**到段落末尾的文本进行扫描，同时每扫描到一个**隔离启动器**就将计数器加1，每扫描一个**PDI**就将计数器减1。
- 如果有将计数器减为零的PDI，则在第一个计数器减为0的PDI处停止扫描。
- 如果找到了这样的PDI，那么它就是给定隔离启动器的匹配PDI。否则，没有匹配的PDI。

请注意，在查找匹配的PDI时，除了**隔离启动器**和PDI之外的所有格式化字符都会被忽略。

请注意，无论**隔离启动器**提高嵌入级别还是深度限制规则阻止这样做，该算法都会将匹配的PDI(或缺乏PDI)分配给隔离启动器。

正如规则X6a指出，匹配的PDI返回一个**嵌入级别，**它的值是隔离启动器开始之前的值。PDI本身被赋予新的嵌入级别。如果它不匹配任何隔离启动器，或者隔离启动器没有提高嵌入级别，那么PDI将保持嵌入级别不变。因此，隔离启动器及其匹配的PDI总是被分配相同的显式嵌入级别，就是隔离外部的级别。在双向算法的后期阶段，**隔离启动器**及其匹配的PDI为不可见的中性字符，它们的嵌入级别有助于确保**隔离串（isolate）**具有中性字符的同等效果，并在周围文本的影响下被分配相应的显示位置。

***BD10.*** ***嵌入启动器（embedding initiator）***是LRE、RLE、LRO或RLO类型的字符。

请注意，**嵌入启动器**包含定向嵌入和定向重写；为简明起见，其名称省略了overrides。

正如规则X2到X5表明，当<?执行深度限制的规则允许时>(the rules enforcing the depth limit allow it)，**嵌入启动器**将提高在它之后的字符的嵌入级别。

***BD11.*** 对于给定的嵌入启动器，***匹配的PDF（matching PDF）***由以下算法确定：

- 将一个计数器初始化为1。
- 扫描**嵌入启动器**后面的文本
    - 扫描到**隔离启动器**，跳到改隔离启动器匹配的PDI，或者如果没有匹配的PDI，跳到段落的末尾。
    - 在段落末尾，或在第一个匹配了**嵌入启动器，**且嵌入启动器文本位置在隔离启动器前的PDI处停止：嵌入启动器没有匹配的PDF。
    - 扫描到嵌入启动器，增加计数器。
    - 烧苗到PDF，将计数器减1。如果计数器为零，停止：找到了**匹配的PDF**。

请注意，无论**嵌入启动器**提高嵌入级别还是深度限制规则阻止这样做，该算法都会将匹配的PDF(或缺乏PDF)分配给嵌入启动器。

尽管上面的算法为术语“匹配PDF”提供了精确的含义，但请注意，整个双向算法实际上**从未使用**它来查找对应**嵌入启动器**的**匹配PDF**。相反，规则X1到X7指定了一种机制，该机制确定**嵌入启动器**的作用范围(如果有的话)，即确定PDF匹配哪个有效的**嵌入启动器**。

正如规则X7指出，**匹配的PDF**返回一个**嵌入级别，**它的值是**嵌入启动器**开始之前的值。如果它不匹配任何嵌入启动器，或者嵌入启动器没有提高嵌入级别，则PDF保持嵌入水平不变。

正如规则X9指出，一旦使用了**显式定向格式化字符**来为段落中的字符分配嵌入级别，则从段落中删除(或虚拟删除)嵌入启动器和PDFs。因此，分配给**嵌入启动器**和PDF本身的嵌入级别是无关紧要的。在这一点上，**嵌入启动器**和PDFs不同于**隔离启动器**和PDIs，后者继续在确定段落的显示顺序方面发挥作用。

***BD12.*** ***定向隔离状态（isolating run sequence*）**是使用**隔离格式化字符**设置的布尔值：当前嵌入级别是由隔离启动器确定时为`true`。

***BD13. 隔离串序列（isolating run sequence）***是**级别串**的最大序列，对于除了**序列**（**sequence**）中的最后一个级别串之外的所有**级别串（level runs）**，串的最后一个字符是一个隔离启动器，其匹配的PDI是序列中的下一个**级别串**的第一个字符。最大的意义是，如果在序列中第一个**级别串**的第一个字符是一个PDI，它必须不匹配任何**隔离启动器**，如果在序列中运行的最后一个级别的最后一个字符是一个隔离启动器，它必须没有匹配的PDI。

段落中**隔离串序列**的集合可以用下面的算法计算:

- 从**隔离串序列**的空集合开始。
- 对于每个在段落中的首个字符不是PDI的级别串，或者首个字符是PDI但不匹配任何隔离启动器的级别串：
    - 创建一个新的**级别串序列**（**level run sequence**），并初始化它以仅包含该**级别串**。
    - 当当前序列中最后一个**级别串**以具有匹配PDI的**隔离启动器**结束时，将包含匹配PDI的**级别串**附加到序列中。(注意，这个匹配的PDI必须是其**级别串**的第一个字符。)
    - 将**级别串**的结果序列添加到**隔离串序列（isolating run sequences）**。

注意

- 段落中的每一个**级别串**都只属于一个**隔离串序列**。
- 在没有隔离启动器的情况下，段中的每个**隔离串序列**仅由一个确定的**级别串**组成，并且每个**级别串**构成一个单独的**隔离串序列**。
- 对于一个**隔离串序列**的任何两个相邻级别，由于其中一个以一个**隔离启动器**结束，其匹配的PDI启动另一个启动器，因此这两个级别必须具有相同的嵌入级别。因此，在一个**隔离串序列**的所有级别串具有**相同**的嵌入级别。
- 当**隔离启动器**提高嵌入级别时，隔离启动器和与其匹配的PDI(如果有)都将获得**原始**嵌入级别，而不是提高了的嵌入级别。因此，如果**匹配的PDI**在段落中**不**紧随**隔离启动器**之后，那么**隔离启动器**是其级别串中的最后一个字符，而匹配的PDI(如果有的话)是其**级别串**的第一个字符，并且这个PDI的在相同的**隔离串序列**后紧随**隔离启动器**。另一方面，段中的隔离启动器之后的**级别串**开始一个新的**隔离串序列**，段中在匹配PDI(如果有)之前的**级别串**结束其**隔离串序列**。

在下面的例子中，假设:

- 段落嵌入级别为0。
- 没有**字符序列文本（character sequence text）**包含显式格式化字符或段落分隔符。
- 点（·）只是用来提高示例的视觉清晰度；它们不是文本的一部分。
- 段落文本中的字符按照上面松散描述的那样被分配**嵌入级别**，这样它们就形成了每个示例中给出的**级别串**集合（set of level runs）。

**示例1**

段落文本：text1·**RLE**·text2·**PDF**·**RLE**·text3·**PDF**·text4

**级别串**：

- *`text1`* – level 0
- *`text2*·*text3`* – **level 1
- *`text4`* – level 0

产生的**隔离串序列**：

- *`text1`* – level 0
- *`text2*·*text3`* – **level 1
- *`text4`* – level 0

**示例2**

段落文本：text1·**RLI**·text2·**PDI**·**RLI**·text3·**PDI**·text4

**级别串**：

- *`text1*·**RLI**` – level 0
- *`text2`* – level 1
- **`PDI**·**RLI**` – level 0
- *`text3`* – level 1
- **`PDI**·*text4*` – level 0

产生的**隔离串序列**：

- *`text1*·**RLI** **PDI**·**RLI** **PDI**·*text4*` – level 0
- *`text2`* – level 1
- *`text3`* – level 1

**示例3**

段落文本：text1·**RLI**·text2·**LRI**·text3·**RLE**·text4·**PDF**·text5·**PDI**·text6·**PDI**·text7

**级别串**：

- *`text1*·**RLI**` – level 0
- *`text2*·**LRI**` – level 1
- *`text3`* – level 2
- *`text4`* – level 3
- *`text5`* – level 2
- **`PDI**·*text6*` – level 1
- **`PDI**·*text7*` – level 0

产生的**隔离串序列**：

- *`text1*·**RLI** **PDI**·*text7*` – level 0
- *`text2*·**LRI** **PDI**·*text6*` – level 1
- *`text3`* – level 2
- *`text4`* – level 3
- *`text5`* – level 2

正如规则X10指出，一个**隔离串序列**是后面的规则应用的基本**单元**（**unit**），在算法<?获取隔离串序列>阶段，序列中的一个**级别串**的最后一个字符被认为紧跟着该序列中的下一个**级别串**的第一个字符。由于这些规则基于字符的**隐式双向类型**，隔离确实对围绕它的文本的顺序具有和**中性字符**一样的影响——或者更准确地说，一对**中性字符**，**隔离启动器**和PDI，它们在这些规则中的表现行为就像**中性字符。**

### **3.1.3 成对括号（Paired Brackets）**

下面的定义**利用**（**utilize**）了*Unicode字符数据库[[UCD](https://www.unicode.org/reports/tr41/tr41-30.html#UCD)]*在*bidibracets .txt文件[[Data9](https://www.unicode.org/reports/tr41/tr41-30.html#Data9)]*中定义的标准属性Bidi_Paired_Bracket和Bidi_Paired_Bracket_Type。

***BD14***. ***左对括号（opening paired bracket）***是一个Bidi_Paired_Bracket_Type属性值为Open且当前[双向字符类型](Unicode%C2%AE%20Standard%20Annex%20#9-Unicode%20%E5%8F%8C%E5%90%91%E7%AE%97%E6%B3%95%EF%BC%88UNICODE%20BI.md)为ON的字符。

***BD15.*** ***右对括号（closing paired bracket）***是一个Bidi_Paired_Bracket_Type属性值为Close且当前[双向字符类型](Unicode%C2%AE%20Standard%20Annex%20#9-Unicode%20%E5%8F%8C%E5%90%91%E7%AE%97%E6%B3%95%EF%BC%88UNICODE%20BI.md)为ON的字符。

***BD16.*** ***括号对（bracket pair）***是由一个***左对括号（opening paired bracket）***和一个***右对括号（closing paired bracket）***组成的一对字符，并且前者或其**规范等效物**（**canonical equivalent**）的Bidi_Paired_Bracket属性值等于后者或其**规范等效物（canonical equivalent）**，它们在**隔离串序列**中的特定文本位置被算法识别。下面的算法在给定**隔离串序列**中会识别所有**括号对**：

- 创建一个固定大小的栈，其中包含63个元素，每个元素由一个**括号字符（bracket character）**和一个**文本位置（text position）**组成。将其初始化为空。
- 创建一个元素列表，每个元素包含两个**文本位置（text position）**，一个用于左对方括号，另一个用于相应的右对方括号。将其初始化为空。
- 如果找到**右对括号**，执行以下操作
    1. 声明一个变量，保存对当前栈元素的引用，并使用栈顶元素初始化它。
    2. 把正在检查的**右对括号**或它的**规范等价（canonical equivalent）**和当前堆栈元素中的括号进行比较。
    3. 如果两个值匹配，即两个字符组成一个**括号对**，则
        - 将当前栈元素中的文本位置连同**右对括号**中的文本位置附加到列表中。
        - 通过当前栈元素(包括栈)弹出栈。
    4. 否则，如果当前栈元素不在栈的底部，则将其向前推进到栈更深的下一个元素，然后回到步骤2。
    5. 否则，继续检查下一个字符，而不弹出栈。
- 根据**左对括号**的文本位置，对文本位置对列表进行升序排序。

注意，**括号对**只能出现在**隔离串序列**中，因为它们在明确的级别解析之后在规则[N0](Unicode%C2%AE%20Standard%20Annex%20#9-Unicode%20%E5%8F%8C%E5%90%91%E7%AE%97%E6%B3%95%EF%BC%88UNICODE%20BI.md)中处理。参见第3.3.2节，[明确的水平和方向](Unicode%C2%AE%20Standard%20Annex%20#9-Unicode%20%E5%8F%8C%E5%90%91%E7%AE%97%E6%B3%95%EF%BC%88UNICODE%20BI.md)。

**括号对的例子**

```
Text                 Pairings
*1 2 3 4 5 6 7 8*
a ) b ( c		         None
a ( b ] c		         None
a ( b ) c		         2-4
a ( b [ c ) d ]		   2-6
a ( b ] c ) d		     2-6
a ( b ) c ) d		     2-4
a ( b ( c ) d		     4-6
a ( b ( c ) d )		   2-8, 4-6
a ( b { c } d )		   2-8, 4-6
```

### 3.1.4 附加缩略语

表3列出了示例中使用的其他缩写和算法中使用的**内部字符类型**（**internal character types**）。

**表3. 示例和内部类型的缩写**

| 符号（Symbol） | 描述（Description） |
| --- | --- |
| https://www.unicode.org/reports/tr9/#NI | 中性或隔离格式化字符(B, S, WS, ON, FSI, LRI, RLI, PDI)。 |
| e | 与嵌入级别方向(偶数或奇数)匹配的文本排序类型(L或R)。 |
| o | 与嵌入级别方向(偶数或奇数)相反的文本排序类型(L或R)。注意o是e的反义词。 |
| sos | 在隔离串序列之前分配给虚拟位置的文本排序类型(L或R)。 |
| eos | 隔离串序列后分配给虚拟位置的文本排序类型(L或R)。 |

## 3.2 双向字符类型

每个字符的**标准双向字符类型（normative bidirectional character types）**在Unicode字符数据库[[UCD](https://www.unicode.org/reports/tr41/tr41-30.html#UCD)]中指定，并在表4中总结。这只是一个总结:在一般作用域内是有例外的。例如，某些字符，如U+0CBF**卡纳达语元音符号I**（**KANNADA VOWEL SIGN I**），被赋予类型L(而不是NSM)，以保持规范等价。

- 欧洲数字指的是在欧洲和其他地方常见的十进制形式，阿拉伯-印度数字指的是阿拉伯本土的形式。(请参阅9.2节，[Unicode]的阿拉伯语，了解更多有关命名数字的细节。)
- 未分配的字符在算法中被赋予强类型。这是对未分配字符的一般Unicode一致性要求的一个显式例外。随着将来分配字符，这些双向类型可能会改变。有关对字符类型的赋值，请参阅[[UCD](https://www.unicode.org/reports/tr41/tr41-30.html#Props)]中的DerivedBidiClass.txt [[DerivedBIDI](https://www.unicode.org/reports/tr41/tr41-30.html#Props)]。
- 私有使用的字符可以通过一致性实现分配不同的值。
- 对于双向算法而言，内联对象(如图形)被视为U+FFFC**对象替换字符**（**OBJECT REPLACEMENT CHARACTER**）。
- 从Unicode 4.0开始，对一些**印欧语系**（**Indic**）字符的双向字符类型进行了更改，以便双向算法保持规范等价。也就是说，应用该算法后，两个标准上等效的字符串将得到等效的排序结果。这个不变量将在未来被维护。
    
    注意:双向算法不保持兼容性等价。
    

**表4. 双向字符类型**

| 类别（Category） | 类型（Type） | 描述（Description） | 一般作用域（General Scope） |
| --- | --- | --- | --- |
| 强 | L | Left-to-Right | LRM，大多数字母，音节，汉表意文字，非欧洲或非阿拉伯数字，… |
|  | R | Right-to-Left | RLM，希伯来字母，和相关的标点符号 |
|  | AL | Right-to-Left Arabic | ALM、阿拉伯语、塔安那文、古叙利亚语字母表，大多数针对这些文字的标点符号，…… |
| 弱 | EN | European Number | 欧洲数字，东方阿拉伯-印度数字，… |
|  | ES | European Number Separator | 正号，负号（PLUS SIGN、MINUS SIGN） |
|  | https://www.unicode.org/reports/tr9/#ET | European Number Terminator | 度数符号，货币符号，… |
|  | AN | Arabic Number | 阿拉伯数字、阿拉伯小数和千位分隔符…… |
|  | CS | Common Number Separator | 冒号，逗号，句号，不换行空格，… |
|  | NSM | Nonspacing Mark | General_Category属性值为Mn (Nonspacing_Mark)和Me (Enclosing_Mark)的字符 |
|  | BN | Boundary Neutral | 默认可忽略值、非字符、控制字符，显式指定的其他类型除外。 |
| 中性 | B | Paragraph Separator | 段落分隔符（PARAGRAPH SEPARATOR），适当的换行函数，更高级别的协议段落确定 |
|  | S | Segment Separator | Tab（tab空格） |
|  | WS | Whitespace | 空格，图形空格，行分隔符，换行符，一般标点空格，… |
|  | ON | Other Neutrals | 所有其他字符，包括对象替换字符（OBJECT REPLACEMENT CHARACTER） |
| 显式格式 | LRE | Left-to-Right Embedding | LRE |
|  | LRO | Left-to-Right Override | LRO |
|  | RLE | Right-to-Left Embedding | RLE |
|  | RLO | Right-to-Left Override | RLO |
|  | PDF | Pop Directional Format | PDF |
|  | LRI | Left-to-Right Isolate | LRI |
|  | RLI | Right-to-Left Isolate | RLI |
|  | FSI | First Strong Isolate | FSI |
|  | PDI | Pop Directional Isolate | PDI |

## 3.3 解析嵌入级别

双向算法的主体使用**双向字符类型**、**显式格式化字符**和**括号对**来生成解析级别的列表。该解决方案包括以下步骤。

- 应用规则P1将文本分成段落，对于每一个段落：
    - 应用P2和P3规则确定段落级别。
    - 应用规则X1(采用规则X2-X8)来确定显式嵌入级别和方向。
    - 应用X9规则删除许多控制字符。
    - 应用规则X10将段落分割为**隔离串序列**，并且对于其中的每个级别串
        - 应用W1-W7规则来解析弱类型。
        - 应用N0-N2规则解决中性类型。
        - 应用I1-I2规则求解隐式嵌入层次。

### 3.3.1 段落级别

***P1.*** *将文本分成单独的段落。段落分隔符(类型B)与前一段保持一致。在每个段落中，应用该算法的所有其他规则。*

***P2.** 在每个段落中，查找类型L、AL或R的第一个字符，同时跳过隔离的启动器与其匹配的PDI之间的任何字符，或者如果没有匹配的PDI，则跳过段落的结尾。*

注意：

- 因为在这个算法中，段落分隔符界定了文本，所以该规则找到的字符通常是段落分隔符之后的第一个强字符，或者是文本开头的字符。
- 该规则忽略了**隔离启动器**与其匹配PDI之间的字符，因为定向隔离应该与中性字符对周围文本的顺序具有相同的效果，并且该规则忽略了中性字符。
- 该规则忽略隔离启动器与其匹配的PDI之间的字符，即使深度限制(如下文规则X5a到X5c所定义)阻止隔离启动器提高嵌入级别。这意味着规则更容易实现。
- 在此规则中，嵌入启动器(但不包括嵌入中的字符)将被忽略。

***P3.** 如果一个字符出现在P2中，并且类型为AL或R，则将段落嵌入级别设置为1；否则，将其设置为零。*

每当一个更高级别的协议指定了段落级别时，P2和P3规则就可能被覆盖:参见[HL1](https://www.unicode.org/reports/tr9/#HL1)。

### 3.3.2 显式的级别和方向

### 3.3.5 解决中性和隔离的格式化类型

N0. Z`