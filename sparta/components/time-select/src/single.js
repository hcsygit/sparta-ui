export default {
  data() {
    return {
      visible: false,
      singleTime: '',
      oldSingleTime: '',
    }
  },

  computed: {
    singleTimeIndex() {
      return this.isValidSingleTimeData(this.singleTime) ? this.singleTime : this.oldSingleTime
    },
  },

  methods: {
    /**
     * 单个选择，点亮选择的时间值
     */
    getTimeIndexForSingle(val) {
      if(val && this._disableSingleTime(val)) {
        return -1
      }
      return this.getTimeIndex(val)
    },
    /**
     * 单个选择，时间选择框聚焦显示下拉面板
     */
    handleSingleFocus() {
      if (!this.disabled) {
        this.visible = true
        // 为了每次弹出dropdown，都会根据处的环境做适应
        this.broadcast('SpTimePickerDropdown', 'updatePopper')
      }
    },

    /**
     * 单个选择, 用户主动输入监听
     */
    handleSingleInput() {
      if(this.isValidSingleTimeData(this.singleTime)) {
        this.oldSingleTime = this.singleTime
      }
    },

    /**
     * 单个选择，清除不符合格式的时间值
     */
    handleSingleBlur() {
      if(!this.isValidSingleTimeData(this.singleTime)) {
        this.singleTime = this.oldSingleTime
      }
    },

    /**
     * 单个选择，保存旧值，方便当用户输入不符合规范的值时恢复之前的值
     */
    handleSinglePaneClick(time) {
      this.singleTime = time
      this.oldSingleTime = time
      this._hideSingleDropdown()
    },

    /**
     * 单个选择, 清空时间
     */
    handleSingleClear() {
      this.singleTime = ''
      this.oldSingleTime = ''
    },

    /**
     * 单个选择, 验证时间值是否是符合格式的
     */
    isValidSingleTimeData(val) {
      return this.availableTimeList.includes(val) && !this._disableSingleTime(val)
    },

    /**
     * 单个选择, 组件外赋值 初始化数据
     */
    _initSingleTime(newVal) {
      if(this.isValidSingleTimeData(newVal) || !newVal) {
        this.singleTime = newVal || ''
        this.oldSingleTime = this.singleTime
      }
    },
    /**
     * 单个选择, 禁用单个时间选择的可选值
     */
    _disableSingleTime(item) {
      return this.disabledTime(item) || this._compareTimeWithMinAndMax(item)
    },

    /**
     * 单个选择，重置时间选择状态
     */
    _hideSingleDropdown() {
      this.visible = false
    },
  }

  

  
}