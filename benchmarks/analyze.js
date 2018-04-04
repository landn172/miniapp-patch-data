const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()
const newDiff = require('../src/diff')

const lhs = {
  asd: [1, 2, 3, 4],
  d: {
    c: 1
  }
}
const rhs = {
  asd: [],
  aed: [123],
  d: {
    c: 2,
    e: { e: 3 }
  }
}
const prefix = ''

suite
  .add('new#diff', () => {
    const patchs = newDiff.analyzePatchs(lhs, rhs, prefix)
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  // run async
  .run({ async: true })
