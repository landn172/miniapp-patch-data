# miniapp-patch-data

目的是为了减少小程序 setData 时 data 的大小，尤其是对长数组优化。

## 原理

diff 两个数据差异，只设置需要改变的值，diff 库引用[deep-diff](https://www.npmjs.com/package/deep-diff)

## NEXT v1.1.0

diff库替换成 deep-object-diff

## example

```js
const patchData = require('miniapp-patch-data')

const lhs = {
  test: 1
}

const rhs = {
  testb: 2
}

/**
 * {
 *   test:undefined,
 *   testb: 2
 * }
 */
const data = patchData(lhs, rhs)

// 当然你如果知道改变的范围(以减少diff范围), 你可以设置prefix

/**
 * {
 *  'data[0].test':undefined,
 *  'data[0].testb': 2
 * }
 */
const data = patchData(lhs, rhs, 'data[0]')
```
