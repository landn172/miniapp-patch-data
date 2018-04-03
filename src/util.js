export function joinPath(paths, prefix) {
  const chainPath = [prefix, ...paths].filter(path => {
    if (typeof path === 'number') return true
    return !!path
  })
  return chainPath.slice(1).reduce((str, path) => {
    const isNumber = typeof path === 'number'
    // 0 => data[0]
    // 'abc' => data.abc
    const nextPath = isNumber ? `[${path}]` : `.${path}`
    return `${str}${nextPath}`
  }, chainPath[0])
}

// obj => abc.sds
// obj => abc[0].def
export function getTarget(obj, path) {
  const paths = path.split('.')
  let index = 0
  const len = paths.length
  const arrReg = /(.*)\[(\d*)\]/
  while (index < len) {
    const tpath = paths[index]
    const matchs = tpath.match(arrReg)
    if (matchs) {     
      const match = matchs.slice(1).filter(match => !!match)
      obj = getTarget(obj, match.join('.'))
    } else {
      obj = obj[tpath]
    }
    index++
  }
  return obj
}
