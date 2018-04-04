import { analyzePatchs } from '../src/diff'
// import analyzePatchs from '../lib/index'

const prefix = 'data'

describe('added property/element', () => {
  const lhs = {
    a: 1
  }

  const rhs = {
    a: 1,
    b: 2
  }

  test('without prefix', () => {
    expect(analyzePatchs(lhs, rhs)).toEqual({ b: 2 })
  })

  test('within prefix', () => {
    expect(analyzePatchs(lhs, rhs, prefix)).toEqual({ 'data.b': 2 })
  })

  test('array', () => {
    const lhs = {
      a: 1
    }

    const rhs = {
      a: 1,
      b: [2, 3, 4]
    }

    expect(analyzePatchs(lhs, rhs)).toEqual({ b: [2, 3, 4] })
  })
})

describe('property/element was edited', () => {
  test('simple', () => {
    const lhs = {
      a: 1
    }

    const rhs = {
      a: 2
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({ a: 2 })
  })

  test('different type', () => {
    const lhs = {
      a: 1
    }

    const rhs = {
      a: '2'
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({ a: '2' })
  })
})

describe('change occurred within an array', () => {
  test('change occurred within an array - modify', () => {
    const lhs = {
      a: [1, 2]
    }
    const rhs = {
      a: [1, 3]
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({ 'a[1]': 3 })
  })

  test('change occurred within an array - modify complex', () => {
    const lhs = {
      a: [{ b: 1, c: 2 }]
    }
    const rhs = {
      a: [{ b: 1, c: 3 }]
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({ 'a[0].c': 3 })
  })

  test('change occurred within an array - add', () => {
    const lhs = {
      a: [1, 2]
    }
    const rhs = {
      a: [1, 2, 3]
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({ 'a[2]': 3 })
  })

  test('change occurred within an array - delete', () => {
    const lhs = {
      a: [1, 2]
    }
    const rhs = {
      a: [1]
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({ 'a[1]': undefined })
  })

  test('change occurred within an array - clear array', () => {
    const lhs = {
      a: [1, 2]
    }
    const rhs = {
      a: []
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({ a: [] })
  })

  test('change occurred within an array - diff array', () => {
    const lhs = {
      a: [[{ a: 1, b: true }], { b: 1, c: 2 }],
      b: [{ c: { d: [1, 2] } }]
    }
    const rhs = {
      a: [[{ a: 2, b: false }], { b: 1 }],
      b: [{ c: { d: [1] } }]
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({
      'b[0].c.d[1]': undefined,
      'a[1].c': undefined,
      'a[0][0].b': false,
      'a[0][0].a': 2
    })
  })
})

describe('property/element was deleted', () => {
  test('property/element was deleted', () => {
    const lhs = {
      a: [1, 2]
    }
    const rhs = {}
    expect(analyzePatchs(lhs, rhs)).toEqual({ a: undefined })
  })

  test('property/element was deleted - empty object', () => {
    const lhs = {
      a: { b: 1, c: 2 }
    }
    const rhs = {
      a: {}
    }
    expect(analyzePatchs(lhs, rhs)).toEqual({ a: {} })
  })
})

test('without merge:true', () => {
  const lhs = {
    a: [1, 2]
  }
  const rhs = {}
  expect(analyzePatchs(lhs, rhs, '', true)).toEqual({ a: undefined })
})
