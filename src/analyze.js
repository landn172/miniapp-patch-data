import DeepDiff from 'deep-diff'
import mergeDiffs from './mergeDiffs'
import { joinPath } from './util'

export function analyzePatchs(lhs, rhs, prefix = '') {
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
  return patchs
}

export function analyzeDiff(diffs, prefix, opts) {
  let len = diffs.length - 1
  let patchs = []
  while (len >= 0) {
    const diff = diffs[len]
    const patch = collectPatch(diff, prefix)
    patchs.push(patch)
    len--
  }
  return mergePatchs(patchs, opts)
}

function mergePatchs(patchs, opts = {}) {
  const { lhs, rhs } = opts
  // 如果没有源数据直接返回patchs
  if (!lhs && !rhs) return patchs
  return patchs
}

function collectPatch(diff, prefix) {
  const { kind, path, index } = diff
  const func = {
    E: collectKindE,
    N: collectKindN,
    A: collectKindA,
    D: collectKindD
  }[kind]
  return func(diff, prefix)
}

/**
 * kind type: property/element was edited
 * @param {*} diff
 *
 */
function collectKindE(diff, prefix) {
  const { path, rhs } = diff
  const key = joinPath(path, prefix)
  return {
    key,
    value: rhs
  }
}

/**
 * kind type: change within an array
 * @param {*} diff
 * @param {*} prefix
 */
function collectKindA(diff, prefix) {
  const { path, index, item } = diff
  item.path = path.concat(index)
  return collectKindN(item, prefix)
}

function collectKindN(diff, prefix) {
  const { path, rhs } = diff
  const key = joinPath(path, prefix)
  return {
    key,
    value: rhs
  }
}

function collectKindD(diff, prefix) {
  const { path } = diff
  const key = joinPath(path, prefix)
  return {
    key,
    value: void 0
  }
}
