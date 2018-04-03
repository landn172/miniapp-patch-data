import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'patch-data'
  },
  plugins: [
    resolve({
      modulesOnly: true,
      browser: true
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
