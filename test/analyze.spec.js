import { analyzePatchs } from '../src/analyze'

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
    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'b', value: 2 }])
  })

  test('within prefix', () => {
    expect(analyzePatchs(lhs, rhs, prefix)).toEqual([
      { key: 'data.b', value: 2 }
    ])
  })

  test('array', () => {
    const lhs = {
      a: 1
    }

    const rhs = {
      a: 1,
      b: [2, 3, 4]
    }

    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'b', value: [2, 3, 4] }])
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
    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'a', value: 2 }])
  })

  test('different type', () => {
    const lhs = {
      a: 1
    }

    const rhs = {
      a: '2'
    }
    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'a', value: '2' }])
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
    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'a[1]', value: 3 }])
  })

  test('change occurred within an array - modify complex', () => {
    const lhs = {
      a: [{ b: 1, c: 2 }]
    }
    const rhs = {
      a: [{ b: 1, c: 3 }]
    }
    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'a[0].c', value: 3 }])
  })

  test('change occurred within an array - add', () => {
    const lhs = {
      a: [1, 2]
    }
    const rhs = {
      a: [1, 2, 3]
    }
    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'a[2]', value: 3 }])
  })

  test('change occurred within an array - delete', () => {
    const lhs = {
      a: [1, 2]
    }
    const rhs = {
      a: [1]
    }
    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'a[1]', value: undefined }])
  })

  test('change occurred within an array - clear array', () => {
    const lhs = {
      a: [1, 2]
    }
    const rhs = {
      a: []
    }
    expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'a', value: [] }])
  })
})

test('property/element was deleted', () => {
  const lhs = {
    a: [1, 2]
  }
  const rhs = {}
  expect(analyzePatchs(lhs, rhs)).toEqual([{ key: 'a', value: undefined }])
})

test('complex changes', () => {
  const lhs = {
    a: [1, 3],
    b: {
      c: {
        d: 4,
        f: 6
      }
    }
  }
  const rhs = {
    a: [1, 2, 3],
    b: {
      c: {
        e: 5,
        f: 8
      },
      g: 2
    }
  }
  expect(analyzePatchs(lhs, rhs)).toEqual([
    { key: 'b.g', value: 2 },
    { key: 'b.c.e', value: 5 },
    { key: 'b.c.f', value: 8 },
    { key: 'b.c.d', value: undefined },
    { key: 'a[2]', value: 3 },
    { key: 'a[1]', value: 2 }
  ])
})