import diff from 'deep-object-diff/dist/diff/index'
import { joinPath, isObject, isDate, isEmptyArray, isEmptyObject } from './util'

export function analyzePatchs(lhs, rhs, prefix) {
  const { l, r, preresult } = preprocess(lhs, rhs)
  const result = diff(l, r)
  return Object.assign(analyzeResult(result, prefix), preresult)
}

export function analyzeResult(result, prefix) {
  const patchs = {}
  walkObject(result, [prefix], patchs)
  return patchs
}

function walkObject(obj, paths, patchs) {
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    const npaths = paths.concat(key)
    if (isObject(value)) {
      return walkObject(value, npaths, patchs)
    }
    const pathStr = joinPath(npaths)
    patchs[pathStr] = value
  })
}

function preprocess(lhs, rhs, prefix) {
  const result = {}
  walk(lhs, rhs, [prefix])
  walk(rhs, lhs, [prefix], true)
  return { l: lhs, r: rhs, preresult: result }
  // 把rhs/lhs同类型 为空数组或者空对象的单独处理
  function walk(l, r, paths, isReverse = false) {
    Object.keys(r).forEach(key => {
      if (!l.hasOwnProperty(key)) return
      const npaths = paths.concat(key)
      const lk = l[key]
      const rk = r[key]
      if (Array.isArray(lk) && isEmptyArray(rk)) {
        const pathStr = joinPath(npaths)
        result[pathStr] = isReverse ? lk : rk
        delete l[key]
        delete r[key]
        return
      }
      if (isObject(lk) && isEmptyObject(rk)) {
        const pathStr = joinPath(npaths)
        result[pathStr] = isReverse ? lk : rk
        delete l[key]
        delete r[key]
        return
      }
      walk(lk, rk, npaths, isReverse)
    })
  }
}
