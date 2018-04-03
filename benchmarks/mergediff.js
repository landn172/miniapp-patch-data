const Benchmark = require('benchmark')
const DeepDiff = require('deep-diff')
const { analyzeDiff } = require('../src/analyze')
const mergeDiffs = require('../src/mergeDiffs').default
const suite = new Benchmark.Suite()

const lhs = {
  asd: [1, 2, 3, 4]
}
const rhs = {
  asd: [],
  aed: [123]
}
const prefix = ''

const opts = {
  lhs,
  rhs
}

suite
  .add('with#walkDiffs', () => {
    const diffs = DeepDiff(lhs, rhs)
    const patchs = analyzeDiff(
      mergeDiffs(diffs, {
        lhs,
        rhs
      }),
      prefix,
      {
        lhs,
        rhs
      }
    )
    JSON.stringify(patchs)
  })
  .add('without#walkDiffs', function() {
    const diffs = DeepDiff(lhs, rhs)
    const patchs = analyzeDiff(
      mergeDiffs(diffs, Object.assign({}, opts, { withoutMerge: true })),
      prefix,
      opts
    )

    JSON.stringify(patchs)
  })
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  // run async
  .run({ async: true })
