import { analyzePatchs } from './diff'

export default function patchData(lhs, rhs, prefix = '') {
  const patchs = analyzePatchs(lhs, rhs, prefix)
  return patchs
}
