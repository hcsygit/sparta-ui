<script>
import { flattenItem } from '../utils'
import Table from '../table'

export default {

  name: 'SpTreeTable',


  extends: Table,
  

  data() {
    return {
      expandedRowKeyList: [], // 展开的节点
    }
  },

  computed: {
    tableList() {
      let list = []
      this.list.forEach(item => {
        list.push({
          ...item,
          level: 0
        })
        if (this.isTreeTable && item[this.treeProps.children]?.length) {
          list.push(...flattenItem([],item, this.treeProps.children, this.rowKey, 1))
        }
      })

      return list
    },

    isTreeTable() {
      return this.treeProps.hasChildren
    },

    allCheckedList() { // 所有选中的节点
      return this.checkedList.filter(v => v.isChecked)
    },

    isTreeTableMixin() {
      return true
    }
  },

  watch: { },

  created() {
    console.error('this is treeTable mixins created')
  },
  
  methods: {
    getRowClassName(item) {
      return `sparta-table-row-level-${item.level}`
    },

    isExpand(id) {
      return this.expandedRowKeyList.includes(id)
    },

    isSub(v) {
      return v?.parentId
    },

    hasSub(v) {
      return v?.childList?.length
    },
    /**
     * 仅调整样式
     * @param {*} rowData
     */
    isIndeterminateState(rowData) {
      // 判断当前节点是否有子节点，如果有子节点，
      if(this.hasSub(rowData)) {
        const checkedInfo = this.checkedList.find(checkedItem => checkedItem.rowId === rowData.id)
        // 判断子节点是否有选中状态，如果有选中状态，且当前节点有选中状态
        return rowData.childList.some(child => this.allCheckedList.some(checkedItem => checkedItem.rowId === child.id)) && !checkedInfo?.isChecked
      }
    },

    /**
     * 调整样式，同时调整选中状态
     * @param {*} v
     */
    allChildChecked(v) {
      console.log('allChildChecked>>>', v)
    },
  
    /**
     * 判断父节点是否隐藏
     * @param {*} item
     * @returns boolean
     */
    parentHasHide(item) {
      const parent = this.tableList.find(v => v.id === item.parentId)
      if(!this.isSub(parent)) {
        // 说明父节点是根节点
        return false
      }
      // 递归判断父节点是否隐藏， 如果有一个父节点隐藏，返回true, 否则直到level为0, 返回false
      const isExpanded = this.expandedRowKeyList.includes(item.parentId)
      if(!isExpanded) {
        // 说明父节点是收起状态
        return true
      } else {
        // 说明父节点是展开状态, 这个时候需要判断父节点的父节点是否是收起状态
        return this.parentHasHide(parent)
      }
    },
    
    /**
     * 隐藏子节点
     * @param {*} item
     * @returns
     */
    isHide(item) {
      return this.isSub(item) && (
        !this.isExpand(item[this.rowKey])
        || this.parentHasHide(item)
      )
    },
    
    /**
     *  行展开收起
     * @param {*} item
     * @param {*} index
     */
    handleRowExpand(item, index, key) {
      if(item?.childList?.length) {
        // 1. 判断当前节点是否展开
        // 2. 如果当前节点展开，将当前节点的id加入到expandedRowKeyList
        // 3. 如果当前节点收起，将当前节点的id从expandedRowKeyList中移除
        const expandKeys = item.childList.map(v => (v[key]))
        this.expandedRowKeyList = this.expandedRowKeyList.includes(expandKeys[0])
          ? this.expandedRowKeyList.filter(v => !expandKeys.includes(v))
          : [...this.expandedRowKeyList, ...expandKeys]
      }
    },


    /**
     * 单选框单独点击
     * @param {*} index
     * @param {*} isChecked
     */
    handleCheck(index, isChecked) {
      // 1. 判断当前节点是否disabled
      // 2. 如果当前节点不是disabled，判断是否有子节点，如果有子节点，递归调用
      // 3. 如果当前节点不是disabled，判断是否有父节点，如果有父节点，递归调用选中状态
      if(!this.checkedList[index].disabled) {
        const rowData = this.tableList[index]
        let allNeedCheckIndexList = [index]
        this.getTreeTableListChildIndex(rowData.id, allNeedCheckIndexList)
        console.log('allNeedCheckIndexList>>>', allNeedCheckIndexList)

        this.getTreeTableListParentIndex(rowData, allNeedCheckIndexList)


        for (let i = 0; i < allNeedCheckIndexList.length; i++) {
          const checkedListIndex = allNeedCheckIndexList[i]
          this.$set(this.checkedList, checkedListIndex, {
            rowId: this.tableList[checkedListIndex].id,
            disabled: this.checkedList[checkedListIndex].disabled,
            isChecked
          })
        }

        this._emitChange()
      }
    },

    /**
     *
     * @param {*} id
     * @param {*} treeTableIndexList
     */
    getTreeTableListChildIndex(id, treeTableIndexList) {
    // 找到tableData
      for (let index = 0; index < this.tableList.length; index++) {
        const item = this.tableList[index]
        if(item.parentId === id) { // 找到父节点，将父节点加入到treeTableIndexList
          treeTableIndexList.push(index)
          if(this.hasChild(item.id)) { // 如果有子节点，递归调用
            this.getTreeTableListChildIndex(item.id, treeTableIndexList)
          }
        }
      }
    },

    hasChild(id) {
      return !!this.tableList.find(item => item.parentId === id)
    },

    /**
     *
     * @param {*} rowData
     * @param {*} treeTableIndexList
     */
    getTreeTableListParentIndex(rowData, treeTableIndexList) {
      // 1. 判断是否是根节点，如果是根节点，返回
      if(!rowData.parentId) {
        return
      }
      // 判断同级节点的选中状态，如果同级节点都选中，父节点选中，如果还不是跟节点，递归调用
      let brothersList = this.tableList.filter(v => v.parentId === rowData.parentId).filter(v => v.id !== rowData.id) // 同级节点
      console.log('brothersList>>>>', JSON.parse(JSON.stringify(brothersList)))
      // 这里要先过滤掉不可选的节点
      brothersList = brothersList.filter((item, index) => !this.checkedList[index].disabled)
      console.log('brothersList>>>>', JSON.parse(JSON.stringify(brothersList)))
      console.log('this.checkedList>>>>', JSON.parse(JSON.stringify(this.checkedList)))
      // 判断同级可选节点是否都选中
      const isAllChecked = brothersList.every(v => this.checkedList.some(item => item.rowId === v.id && item.isChecked))
      if(isAllChecked) {
        const parentIndex = this.tableList.findIndex(v => v.id === rowData.parentId)
        treeTableIndexList.push(parentIndex) // 将父节点

        this.getTreeTableListParentIndex(this.tableList[parentIndex], treeTableIndexList)
      }

    }

  }
}
</script>
