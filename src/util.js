export function joinPath(paths, prefix) {
  const chainPath = [prefix, ...paths].filter(path => {
    if (isStringNumber(path)) return true
    return !!path
  })
  return chainPath.slice(1).reduce((str, path) => {
    const isNumber = typeof path === 'number'
    // 0 => data[0]
    // 'abc' => data.abc
    const nextPath = isNumber || isStringNumber(path) ? `[${path}]` : `.${path}`
    return `${str}${nextPath}`
  }, chainPath[0])
}

export function isStringNumber(str) {
  return typeof str === 'string' && !!str && !isNaN(+str)
}

// obj => abc.sds
// obj => abc[0].def
// export function getTarget(obj, path) {
//   const paths = path.split('.')
//   let index = 0
//   const len = paths.length
//   const arrReg = /(.*)\[(\d*)\]/
//   while (index < len) {
//     const tpath = paths[index]
//     const matchs = tpath.match(arrReg)
//     if (matchs) {
//       const match = matchs.slice(1).filter(match => !!match)
//       obj = getTarget(obj, match.join('.'))
//     } else {
//       obj = obj[tpath]
//     }
//     index++
//   }
//   return obj
// }

export function isEmptyArray(arr) {
  return Array.isArray(arr) && arr.length === 0
}

export function isEmptyObject(obj) {
  return isObject(obj) && Object.keys(obj).length === 0
}

export const isObject = o =>
  o != null && typeof o === 'object' && !Array.isArray(o)

export const isDate = d => d instanceof Date
