# ElementType

# 解释

- `ElementType`就是 `DataView` 在读写缓冲区内的数据类型时读取的方式
- 因为`DataView`不像规定了保存的元素的数字类型的定型数组，它对存储在缓冲内的数据类型没有预设
- 所以在读写缓冲区时就需要有暴露的API强制开发者在读写时指定一个`ElementType` ,然后`DataView` 就会忠实的为读、写而完成相应的转换

## ECMAScript6 支持的ElementType

| ElementType | 字节 | 说明 | 等价的C类型 | 值范围 |
| --- | --- | --- | --- | --- |
| Int8 | 1 | 8位有符号整数 | signed char | -128~127 |
| Uint8 | 1 | 8位无符号整数 | unsigned char | 0~255 |
| Int16 | 2 | 16位有符号整数 | short | -32768~32767 |
| Uint16 | 2 | 16位无符号整数 | unsigned short | 0~65535 |
| Int32 | 4 | 32位有符号整数 | int | -2147483648~2147483647 |
| Uint32 | 4 | 32位无符号整数 | unsigned int | 0~4294967295 |
| Float32 | 4 | 32位IEEE-754浮点数 | float | -3.4e+38 ~+3.4e+38 |
| Float64 | 8 | 64位IEEE-754浮点数 | double | -1.7e+308~+1.7e+308 |

### 新增

- ECMAScript现在新增了`BigInt`数字类型，`BigInt`可以表示**大于**`2^53 - 1` 的整数，这原本是JavaScript用Number表示的最大数字(Number.MAX_SAFE_INTEGER), `BigInt` 类似与`Number`类型，但能表示的数量级更大（可以表示任意大的整数），常使用8位字节保存整数

| ElementType | 字节 | 说明 | 等价的C类型 | 值范围 |
| --- | --- | --- | --- | --- |
| BigInt64 | 8 | 64位有符号整数 | long long | -9223372036854775808n~9223372036854775807n |
| BigUint64 | 8 | 64位无符号整数 | unsigned int | 0~18446744073709551615n |

# 20种读写方法

- `DataView` 针对上表中的每种类型都暴露了get和set方法

## 语法

- 通用写法为
    
    ```jsx
    getElementType(byteOffset[,littleEndian]);
    setElementType(byteOffset, value[,littleEndian]);
    ```
    

### 参数

- `byteOffset` 是字节偏移量，用于定位要读取或写入值的开始位置，在`get`和`set`方法中都是必填的
- `value` 是`set`方法中要以ElementType类型在`buffer` 的字节中设置的数字值
- `littleEndian` 是可选参数，布尔值，表示存储和读取数字的字节序，对于`set/getInt8`和`set/getUint8` 不存在这个参数，因为单个字节的数字不存在字节序的问题；默认为false，即以大端格式（[big-endian](https://developer.mozilla.org/zh-CN/docs/Glossary/Endianness)）存储数字的字节序，大端格式就是低位字节存储在高地址端，而小端格式正好相反
    - 例如数字`0x12345678` 使用`Int32` 格式的4字节存储，`0x12` 是数字中的高位，而`0x78` 是数字中的低位
    - 大端格式：`0x12` `0x34` `0x56` `0x78`  ,内存地址从左到右增加，数字中的高位字节存在地址低位
    - 小端格式：`0x78` `0x56` `0x34` `0x12` ，内存地址从左到右增加，数字中的高位字节存储在地址高位