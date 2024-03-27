/**
 * 判断两个一维数据是否相等
 * @param {*} array1
 * @param {*} array2
 * @returns
 */
export function scalarArrayEquals(array1, array2) {
  return array1.length === array2.length && array1.every(function(v,i) { return v === array2[i]})
}


/**
 * 将树形数据扁平化
 * @param {*} list
 * @param {*} item
 * @param {*} childrenKey
 * @param {*} rowKey
 * @param {*} level
 * @returns
 */
export function flattenItem(list, item, childrenKey, rowKey, level) {
  item[childrenKey].forEach(v => {
    list.push({
      ...v,
      level,
      parentId: item[rowKey]
    })
    if(v[childrenKey]?.length) {
      flattenItem(list, v, childrenKey, rowKey, level+1)
    }
  })
  return list
}