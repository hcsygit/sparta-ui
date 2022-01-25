<template>
  <div
    ref="spTimePicker"
    class="sp-time-select"
    :class="{ 'is--focus': isTimeSelectFocus, 'is--range': isRangeType }"
  >
    <!-- 非范围型time-pick -->
    <div v-if="!isRangeType">
      <div class="sp-time-select__single">
        <sp-input
          v-model="singleTime"
          :disabled="disabled"
          :placeholder="placeholder"
          prefix-icon="sp-icon-clock"
          :clearable="clearable"
          @focus="handleSingleFocus"
          @blur="handleSingleBlur"
          @input="handleSingleInput"
          @clear="handleSingleClear"
        />
      </div>
      <sp-time-picker-dropdown
        ref="sp-time-select__dropdown"
        v-model="visible"
        class="sp-time-select__dropdown is--single-dropdown"
      >
        <transition name="sp-zoom-in-top">
          <div v-show="visible" class="sp-time-picker-dropdown__box">
            <sp-time-picker-pane :index="getTimeIndexForSingle(singleTimeIndex)">
              <sp-time-picker-option
                v-for="(item, index) in timeList"
                :key="item"
                :disabled="_disableSingleTime(item)"
                :text="item"
                :index="index"
                @click="handleSinglePaneClick(item)"
              />
            </sp-time-picker-pane>
          </div>
        </transition>
      </sp-time-picker-dropdown>
    </div>
    <!-- 范围 -->
    <div
      v-else class="sp-time-select__content"
    >
      <!-- 开始input -->
      <div
        class="sp-time-select__range"
        :class="{'is--disabled': disabled}"
        @click="handleRangeClick"
      >
        <div class="sp-time-select__range-start">
          <sp-input
            v-model="rangeTimeStart"
            :disabled="disabled"
            :validate-event="false"
            :placeholder="startPlaceholder"
            prefix-icon="sp-icon-clock"
            @blur="handleRangeTimeStartBlur"
            @input="handleRangeTimeStartInput"
          />
        </div>
        <div class="sp-time-select__range-end">
          <sp-input
            v-model="rangeTimeEnd"
            :disabled="disabled"
            :validate-event="false"
            :placeholder="endPlaceholder"
            :clearable="clearable"
            @clear="handleRangeClear"
            @blur="handleRangeTimeEndBlur"
            @input="handleRangeTimeEndInput"
          />
        </div>
      </div>
      <sp-time-picker-dropdown
        ref="sp-time-select__dropdown"
        v-model="visibleTimeRange"
        class="sp-time-select__dropdown is--range-dropdown"
      >
        <transition name="sp-zoom-in-top">
          <div v-show="visibleTimeRange" class="sp-time-picker-dropdown__box">
            <sp-time-picker-pane :index="getTimeStartIndexForRange(rangeTimeStartIndexVal)">
              <sp-time-picker-option
                v-for="(item, index) in timeList"
                :key="item"
                :disabled="_disableRangeTimeStart(item)"
                :text="item"
                :index="index"
                @click="handleRangeStartPaneClick(item)"
              />
            </sp-time-picker-pane>
            <sp-time-picker-pane :index="getTimeEndIndexForRange(rangeTimeEndIndexVal)">
              <sp-time-picker-option
                v-for="(item, index) in timeList"
                :key="item"
                :disabled="_disableRangeTimeEnd(item)"
                :text="item"
                :index="index"
                @click="handleRangeEndPaneClick(item)"
              />
            </sp-time-picker-pane>
          </div>
        </transition>
      </sp-time-picker-dropdown>
    </div>
  </div>
</template>

<script>
const parseTime = function(time) {
  const values = (time || '').split(':')
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10)
    const minutes = parseInt(values[1], 10)
    return {
      hours,
      minutes
    }
  }
  return null
}
const compareTime = function(time1, time2) {
  const value1 = parseTime(time1)
  const value2 = parseTime(time2)
  const minutes1 = value1.minutes + value1.hours * 60
  const minutes2 = value2.minutes + value2.hours * 60
  if (minutes1 === minutes2) {
    return 0
  }
  return minutes1 > minutes2 ? 1 : -1
}
const formatTime = function(time) {
  return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes)
}
const nextTime = function(time, step) {
  const timeValue = parseTime(time)
  const stepValue = parseTime(step)
  const next = {
    hours: timeValue.hours,
    minutes: timeValue.minutes
  }
  next.minutes += stepValue.minutes
  next.hours += stepValue.hours
  next.hours += Math.floor(next.minutes / 60)
  next.minutes = next.minutes % 60
  return formatTime(next)
}
const defaultPickerOption = () => ({
  start: '00:00',
  end: '24:00',
  step: '01:00',
  minTime: '',
  maxTime: '',
}
)
import SpTimePickerDropdown from 'sparta/components/time-picker/src/dropdown'
import SpTimePickerPane from 'sparta/components/time-picker/src/pane'
import SpTimePickerOption from 'sparta/components/time-picker/src/option'
import Emitter from 'sparta/common/js/mixins/emitter'

import Single from './single'
export default {
  name: 'SpTimeSelect',

  components: {
    'sp-time-picker-dropdown': SpTimePickerDropdown,
    'sp-time-picker-pane': SpTimePickerPane,
    'sp-time-picker-option': SpTimePickerOption
  },

  mixins: [Emitter, Single],

  props: {
    value: {},
    type: {
      type: String,
      default: '',
      validator(val) {
        return ['', 'range'].includes(val)
      }
    },
    clearable: { // 是否显示清除按钮
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pickerOptions: {
      type: Object,
      default: () => defaultPickerOption()
    },
    placeholder: {
      type: String,
      default: '请选择时间'
    },
    // 范围型时间选择框
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    },
    disabledTime: {
      type: Function,
      default: () => {
        return false
      }
    },
    disabledTimeStart: {
      type: Function,
      default: () => {
        return false
      }
    },
    disabledTimeEnd: {
      type: Function,
      default: () => {
        return false
      }
    },
  },
  data() {
    return {
      visibleTimeRange: false, // 控制时间范围选择面板是否显示
      rangeTimeStart: '',
      oldRangeTimeStart: '',
      rangeTimeEnd: '',
      oldRangeTimeEnd: '',
      isTimeSelectFocus: false,
      paneRangeVal: []
    }
  },
  computed: {
    isRangeType() {
      return this.type === 'range'
    },
    minTime() {
      return this.pickerOptions.minTime || defaultPickerOption().minTime
    },
    maxTime() {
      return this.pickerOptions.maxTime || defaultPickerOption().maxTime
    },
    timeList() {
      let { start, end, step, minTime, maxTime } = this.pickerOptions
      if(!start) start = defaultPickerOption().start
      if(!end) end = defaultPickerOption().end
      if(!step) step = defaultPickerOption().step
      if(!minTime) minTime = defaultPickerOption().minTime
      if(!maxTime) maxTime = defaultPickerOption().maxTime
      const result = []
      if (start && end && step) {
        let current = start
        while (compareTime(current, end) <= 0) {
          result.push({
            value: current,
          })
          current = nextTime(current, step)
        }
      }
      return result.map(item => item.value)
    },
    availableTimeList() {
      return this.timeList.filter(item => !this._compareTimeWithMinAndMax(item))
    },

    rangeTimeStartIndexVal() {
      return this.paneRangeVal[0] || this.oldRangeTimeStart
    },

    rangeTimeEndIndexVal() {
      return this.paneRangeVal[1] || this.oldRangeTimeEnd
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if(this.isRangeType) {
          if(Array.isArray(newVal)) {
            if(this.isValidRangeTimeStartData(newVal[0]) || !newVal[0]) {
              this.rangeTimeStart = newVal[0] || ''
              this.oldRangeTimeStart = this.rangeTimeStart
            }
            if(this.isValidRangeTimeEndData(newVal[1]) || !newVal[1]) {
              this.rangeTimeEnd = newVal[1] || ''
              this.oldRangeTimeEnd = this.rangeTimeEnd
            }
          } else {
            this.handleRangeClear()
          }
        } else {
          this._initSingleTime(newVal)
        }
      }
    }
  },
  created() {
    document.addEventListener('click', this.handleOtherAreaClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOtherAreaClick)
  },
  methods: {
    /**
     * 范围选择，范围值开始时间点击
     */
    handleRangeStartPaneClick(rangeTimeStart) {
      this.$set(this.paneRangeVal, '0', rangeTimeStart)

      this._checkPaneVal()
    },
    /**
     * 范围选择，范围值结束时间点击
     */
    handleRangeEndPaneClick(rangeTimeEnd) {
      this.$set(this.paneRangeVal, '1', rangeTimeEnd)

      this._checkPaneVal()
    },
    /**
     * 单个选择/范围选择，点击其他区域触发事件
     */
    handleOtherAreaClick(e) {
      if(!this.$el.contains(e.target) && e.target != document.body) {
        if(this.isRangeType) {
          this.visibleTimeRange && this._resetRangeRelative()
        } else {
          this.visible && this._hideSingleDropdown()
        }
      }
    },
    /**
     * 范围选择，范围开始时间输入监听
     */
    handleRangeTimeStartInput() {
      if(this.isValidRangeTimeStartData(this.rangeTimeStart)) {
        if(this.oldRangeTimeEnd && compareTime(this.rangeTimeStart, this.oldRangeTimeEnd) >= 0 ) return
        this.oldRangeTimeStart = this.rangeTimeStart

        this._setRangeValChange()
      }
    },
    /**
     * 范围选择，范围结束时间输入监听
     */
    handleRangeTimeEndInput() {
      if(this.isValidRangeTimeEndData(this.rangeTimeEnd)) {
        this.oldRangeTimeEnd = this.rangeTimeEnd

        this._setRangeValChange()
      }
    },
    /**
     * 范围选择，范围点击显示下拉面板
     */
    handleRangeClick() {
      if (!this.disabled) {
        this.isTimeSelectFocus = true
        this.visibleTimeRange = true
        // 为了每次弹出dropdown，都会根据处的环境做适应
        this.broadcast('SpTimePickerDropdown', 'updatePopper')
      }
    },
   
    /**
    * 范围选择，清除不符合格式的时间范围开始值
    */
    handleRangeTimeStartBlur() {
      if(this.isValidRangeTimeStartData(this.rangeTimeStart)) {
        if(this.oldRangeTimeEnd && compareTime(this.rangeTimeStart, this.oldRangeTimeEnd) >= 0 ) {
          this.rangeTimeStart = this.oldRangeTimeStart
        }
      } else {
        this.rangeTimeStart = this.oldRangeTimeStart
      }
    },
    /**
    * 范围选择，清除不符合格式的时间范围结束值
    */
    handleRangeTimeEndBlur() {
      if(!this.isValidRangeTimeEndData(this.rangeTimeEnd)) {
        this.rangeTimeEnd = this.oldRangeTimeEnd
      }
    },
    /**
    * 范围选择，验证开始时间值是否是符合格式的
    */
    isValidRangeTimeStartData(val) {
      return this.availableTimeList.includes(val) && !this._disableRangeTimeStart(val)
    },
    /**
    * 范围选择，验证结束时间值是否是符合格式的
    */
    isValidRangeTimeEndData(val) {
      const result = this.availableTimeList.includes(val) && !this._disableRangeTimeEnd(val)
      if(val && this.rangeTimeStart) {
        return result && compareTime(val, this.oldRangeTimeStart) > 0
      }
      return result
    },
    /**
     * 范围选择， 清空时间范围的数据
     */
    handleRangeClear() {
      this.rangeTimeStart = ''
      this.oldRangeTimeStart = ''

      this.rangeTimeEnd = ''
      this.oldRangeTimeEnd = ''

      this._setRangeValChange()

      this.paneRangeVal = []
    },
    
    /**
     * 单个选择/范围选择，点亮选择的值
     */
    getTimeIndex(val) {
      return this.timeList.findIndex(item => item === val)
    },
   
    /**
     * 范围选择,点亮选择的时间开始值
     */
    getTimeStartIndexForRange(val) {
      if(this.paneRangeVal[1]) return -1

      return this.getTimeIndex(val)
    },

    /**
     * 范围选择,点亮选择的时间结束值
     */
    getTimeEndIndexForRange(val) {
      if(this.paneRangeVal[0]) return -1

      return this.getTimeIndex(val)
    },

    _disableRangeTimeStart(item) {
      return this.disabledTimeStart(item) || this._compareTimeWithMinAndMax(item)
    },

    _disableRangeTimeEnd(item) {
      const _result = this.disabledTimeEnd(item) || this._compareTimeWithMinAndMax(item)
      const _rangeTimeStar = this.paneRangeVal[0] || this.oldRangeTimeStart
      if(_rangeTimeStar) {
        return _result || compareTime(item, _rangeTimeStar) <= 0
      }
      return _result
    },

    _compareTimeWithMinAndMax(item) {
      return compareTime(item, this.minTime || '-1:-1') <= 0 || compareTime(item, this.maxTime || '100:100') >= 0
    },

    /**
     * 范围，触发值校验
     */
    _dispatchRangeTimeValidate(type) {
      const rangeVal = !this.oldRangeTimeStart && !this.oldRangeTimeEnd ? [] : [this.oldRangeTimeStart, this.oldRangeTimeEnd]
      this.dispatch('SpFormItem', type === 'blur' ? 'sp.form.blur' : 'sp.form.change', rangeVal)
    },

    /**
     * 范围选择，重置时间范围选择状态
     */
    _resetRangeRelative() {
      this.isTimeSelectFocus = false
      this.visibleTimeRange = false

      this.paneRangeVal = []

      this._dispatchRangeTimeValidate('blur')
    },
    /**
     * 范围选择，触发值更新
     */
    _setRangeValChange() {
      const rangeVal = !this.oldRangeTimeStart && !this.oldRangeTimeEnd ? [] : [this.oldRangeTimeStart, this.oldRangeTimeEnd]
      this.$emit('input', rangeVal)
      this._dispatchRangeTimeValidate('change')
    },

    _checkPaneVal() {
      if(this.paneRangeVal[0] && this.paneRangeVal[1]) {
        this.rangeTimeStart = this.paneRangeVal[0]
        this.oldRangeTimeStart = this.paneRangeVal[0]

        this.rangeTimeEnd = this.paneRangeVal[1]
        this.oldRangeTimeEnd = this.paneRangeVal[1]

        this._setRangeValChange()

        this.paneRangeVal = []

        this._resetRangeRelative()
      }
    }
  }
}
</script>

<style lang="scss">
@import "~sparta/common/scss/mixin";
@import "~sparta/common/scss/variable";
.sp-time-select {
  &.is--focus  {
    .sp-time-select__range {
      outline: none;
      border-color: $color-primary;
      box-shadow: $input-box-shadow-focus;
    }
  }
  &__range {
    @include clearfix();
    border: $data-picker-range-border;
    border-radius: $input-border-radius;
    transition: $transition-all;
    &.is--disabled {
      background-color: #f0f3f7;
      border-color: #d5d9e0;
      color: #c7cbd1;
      cursor: not-allowed;
    }
  }
  &__range-start {
    float: left;
    left: 50%;
  }
  &__range-start, &__range-end {
    width: 50%;
    float: left;
    overflow: hidden;
    .sp-input .sp-input__inner {
      border: none;
      &:focus {
        box-shadow: none;
      }
    }
  }
  &__range-end {
    .sp-input {
     display: inline-table;
      &::before {
        content: '一';
        width: 10px;
        color: #d5d9e0;
        display: table-cell;
      }
    }
  }
  &__dropdown {
    &.is--single-dropdown {
      .sp-time-picker-pane {
        width: 100%;
      }
    }
    &.is--range-dropdown {
      .sp-time-picker-pane {
        width: 50%;
      }
    }
  }
}
</style>