import treeTableMixin from './treeTable.js'


/**
 * 导入混入
 * @returns
 */
export function importMixins(props) {
  console.log(props)
  // todo 条件判断
  return treeTableMixin
}