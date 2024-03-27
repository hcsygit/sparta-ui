import { scalarArrayEquals } from '../utils'

export default {
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      checkedList: [],
      tableWidth: '100%',
      showVScroll: false,
      children: [],
      tableKey: 0
    }
  },

  computed: {
    isIE9() {
      return navigator.appVersion.indexOf('MSIE 9.0') > -1
    },
    paginationPerPages() {
      return this.paginationOption && this.paginationOption.perPages || 7
    },
    paginationPageIndex() {
      return this.paginationOption && this.paginationOption.queryPageNo || 1
    },
    paginationPageSize() {
      return this.paginationOption && this.paginationOption.pageSize || 10
    },
    paginationTotal() {
      return this.paginationOption && this.paginationOption.totalSize || 1
    },
    paginationAlign() {
      return this.paginationOption && this.paginationOption.align || 'middle'
    },
    hasFooter() {
      return (this.selection && this.showAllSelect)
        || this.pagination
        || this.$slots.footerRightContent
        || this.$slots.footerLeftContent
    },
    hasData() {
      return this.tableList && this.tableList.length
    },
    tableList() {
      return this.list
    }
  },

  watch: {
    list() {
      // 数据变化后清除所有点亮状态
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedList = []
      this._initCheckedList()
      this._emitChange()

      this.tableKey = + new Date()
    }
  },
  
  created() {
    this.init()
  },

  mounted() {
    if (this.selection) {
      this._initCheckedList()
    }
    this._initTableWidth()
  },

  beforeUpdate() {
    this.enableUpdate && this.init()
  },
  
  methods: {
    init() {
      this.children = this.$slots.default.filter(item => {
        return /SpTableColumn/.test(item.tag)
      })
    },
    clearSelection() {
      if(this.disabled) return
      this.checkAll = false
      this._setCheckState(false)
    },
    toggleAllSelection() {
      if(this.disabled) return
      this.checkAll = !this.checkAll
      this._setCheckState(this.checkAll)
    },
    toggleRowSelection(index, selected) {
      if(!this.disabled && typeof index === 'number' && typeof selected === 'boolean') {
        this.handleCheck(index, selected)
      }
    },
    // 批量调整row选中状态
    toggleRowSelectionList(indexList, isChecked) {
      if(!this.disabled && Array.isArray(indexList) && typeof isChecked === 'boolean') {
        indexList.forEach(index => {
          if(!this.checkedList[index].disabled) {
            this.$set(this.checkedList, index, {
              rowId: this.tableList[index].id,
              disabled: this.checkedList[index].disabled,
              isChecked
            })
          }
        })
        
        this._processCheckBoxRelation()
        this._emitChange()
      }
    },
    _initTableWidth() {
      let width = 0
      for (let i = 0, len = this.children.length; i < len; i++) {
        const w = this.children[i].componentOptions.propsData.width
        if (w) {
          width += +w
        }
      }
      // 如果width大于容器宽度，则使用累加的w来处理table;
      // 否则table 100%
      const parentW = parseInt(window.getComputedStyle(this.$el).width)
      if (this.selection) {
        width += +this.selectionWidth
      }
      if (width <= parentW) {
        width = '100%'
        this.showVScroll = false
      } else {
        this.showVScroll = true
      }
      this.tableWidth = width + 'px'
    },

    _initCheckedList() {
      let len = this.tableList.length
      while(len) {
        len--
        this.$set(this.checkedList, len, {
          rowId: this.tableList[len][this.rowKey], // 用于记录行数据的唯一标识
          isChecked: false,
          disabled: this.isSelectDisable(this.tableList[len], len)
        })
      }
    },

    _emitChange() {
      // 过滤出打勾了的值给上层
      const result = []
      const isCheckedIndexList = []
      this.checkedList.forEach((item, index) => {
        if (item.isChecked) {
          isCheckedIndexList.push(index)
          result.push(this.tableList[index])
        }
      })
      if(!scalarArrayEquals(isCheckedIndexList, this.oldIsCheckedIndexList || [])) {
        // 只有值改变了才透出
        this.oldIsCheckedIndexList = isCheckedIndexList
        this.$emit('selection-change', result)
      }
    },

    /**
     * 处理checkbox的关联
     */
    _processCheckBoxRelation() {
      const checkedAccount = this.checkedList.filter(item => {
        return item.isChecked
      }).length
      if (checkedAccount === this.tableList.length) {
        this.checkAll = true
        this.isIndeterminate = false
      } else if (0 < checkedAccount && checkedAccount < this.tableList.length) {
        this.isIndeterminate = true
        this.checkAll = false
      } else {
        this.isIndeterminate = false
        this.checkAll = false
      }
    },
    _setCheckState(checkState) {
      let len = this.tableList.length
      let isEmitChange = false
      while(len) {
        len--
        if(!this.checkedList[len].disabled) {
          isEmitChange = true
          this.$set(this.checkedList, len, {
            disabled: this.checkedList[len].disabled,
            isChecked: checkState
          })
        }
      }
      if(isEmitChange) {
        this.isIndeterminate = false
        this._emitChange()
      }
    },

    /**
     * 全选单选框点击
     */
    handleCheckAllChange(isChecked) {
      this._setCheckState(isChecked)
    },

    /**
     * 单选框单独点击
     */
    handleCheck(index, isChecked) {
      // 更新checkedList
      if(!this.checkedList[index].disabled) {
        this.$set(this.checkedList, index, {
          rowId: this.tableList[index].id,
          disabled: this.checkedList[index].disabled,
          isChecked
        })
        this._processCheckBoxRelation()
        this._emitChange()
      }
    },

    handlePageChange(index, pageSize) {
      this.$emit('pagination-change', index, pageSize)
    },

    handleViewMore() {
      this.$emit('table-view-more')
    },

    isSelectDisable(row, index) {
      if(this.disabled) return true
      if(typeof this.selectable === 'function') return !this.selectable(row, index)
      return false
    },

    isExpand() {
      return false
    },

    isHide() {
      return false
    },

    isIndeterminateState() {
      return false
    },

    hasSub() {
      return false
    },

    handleRowExpand() {
      return false
    },


    
  },
}