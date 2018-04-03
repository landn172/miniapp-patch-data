import { joinPath, getTarget } from './util'

export default function mergeDiffs(diffs, opts = {}) {
  const { lhs, rhs, withoutMerge } = opts
  // diffs
  if ((!lhs && !rhs) || !!withoutMerge) return diffs

  return walkDiffs(diffs, opts)
}

function walkDiffs(diffs, opts) {
  const { lhs, rhs } = opts
  let len = diffs.length - 1
  let item
  const diffPaths = {}
  // collect diff with same path
  while ((item = diffs[len])) {
    item = Object.assign({}, item, { _index: len })
    const path = joinPath(item.path)
    if (diffPaths[path]) {
      diffPaths[path].push(item)
    } else {
      diffPaths[path] = [item]
    }
    len--
  }

  Object.keys(diffPaths).forEach(path => {
    const diff = diffPaths[path]
    const deletedItems = diff.filter(
      ({ kind, item }) => kind === 'A' && item.kind === 'D'
    )
    const deletedLen = deletedItems.length
    // 如果rhs数组为空数组
    // 删除该diff 并添加kind = 'E'的数据
    if (deletedLen > 0 && deletedLen === getTarget(lhs, path).length) {
      let index = 0
      while ((item = diff[index])) {
        diffs.splice(item._index, 1)
        index++
      }
      diffs.push({
        kind: 'E',
        path: path,
        rhs: []
      })
    }
  })
  return diffs
}
