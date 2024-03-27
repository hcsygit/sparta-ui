<template>
  <div
    class="sp-table"
    :class="{
      'is--disabled': disabled,
      'is--selection': selection,
      'need--scroll': needScroll }"
  >
    <!-- 表格头部 -->
    <div
      class="sp-table__head"
      :class="{ borderBox: !showVScroll }"
      :style="`width: ${tableWidth}`"
    >
      <table :style="`width: ${tableWidth}`">
        <colgroup>
          <col
            v-if="selection"
            :width="selectionWidth"
          >
          <col
            v-for="(item, index) in children"
            :key="index"
            :width="item.componentOptions.propsData.width"
          >
        </colgroup>
        <thead>
          <tr>
            <th v-if="selection">
              <div></div>
            </th>
            <th
              v-for="(item, index) in children"
              :key="index"
            >
              <slot :name="item.data.attrs['slot-name']">
                {{ item.componentOptions.propsData.label }}
              </slot>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <!-- 表格主体 -->
    <div
      class="sp-table__body"
      :style="`width: ${tableWidth}`"
    >
      <!-- 有数据情况 -->
      <table
        v-show="hasData"
        :style="`width: ${tableWidth}`"
      >
        <colgroup>
          <col
            v-if="selection"
            :width="selectionWidth"
          >
          <col
            v-for="(item, index) in children"
            :key="index"
            :width="item.componentOptions.propsData.width"
          >
        </colgroup>
        <tbody>
          <tr
            v-for="(item, rIndex) in tableList"
            :key="rIndex"
            :class="[
              {
                'is--striped': rIndex%2 !== 0,
                'is--expand': isExpand(item[rowKey]),
                'is--hide': isHide(item, rIndex)
              },
              `sparta-table-row-level-${item.level}`
            ]"
          >
            <td v-if="selection">
              <div class="sp-table-cell">
                <sp-checkbox
                  v-if="checkedList[rIndex]"
                  v-model="checkedList[rIndex].isChecked"
                  :disabled="isSelectDisable(item, rIndex)"
                  :indeterminate="isIndeterminateState(item)"
                  @change="handleCheck(rIndex, $event)"
                />
              </div>
            </td>
            <td
              v-for="(tdItem, cIndex) in children"
              :key="cIndex"
            >
              <sp-table-cell
                :key="cIndex + tableKey"
                :column="tdItem"
                :list="tableList"
                :c-index="cIndex"
                :r-index="rIndex"
                :level="item.level"
              >
                <i
                  v-if="isTreeTable && cIndex === 0 && hasSub(item)"
                  slot="pre"
                  class="sp-icon-caret-right sp-icon-arrow-right sp-table__expand-ico"
                  :class="{ 'is--expand': isExpand(item[rowKey]) }"
                  @click="handleRowExpand(item, rIndex, rowKey)"
                />
              </sp-table-cell>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- append 插入至表格最后一行之后的内容 -->
      <div v-if="hasMore || $slots.append" class="sp-table__append">
        <slot name="append">
          <div class="sp-table__append-show-more">
            <sp-button
              type="text"
              :disabled="disabled"
              @click="handleViewMore"
            >
              {{ hasMoreText }}
              <i class="sp-icon-arrow-down-bold"></i></sp-button>
          </div>
        </slot>
      </div>
      <!-- 没有数据情况 -->
      <div
        v-show="!hasData && !loading"
        class="sp-table__empty"
      >
        <slot name="empty">
          <div class="sp-table__empty-text">
            {{ emptyText }}
          </div>
        </slot>
      </div>
      <!-- loading情况 -->
      <div
        v-show="loading"
        class="sp-table__loading-wrap"
      >
        <div class="sp-table__loading">
          <i
            v-if="!isIE9"
            class="sp-icon-loading"
          ></i>加载中
        </div>
      </div>
    </div>
    <!-- 表格底部 -->
    <div
      v-if="hasFooter"
      class="sp-table__footer"
      :style="`width: ${tableWidth}`"
    >
      <div v-if="hasData" class="sp-table__footer-left">
        <div class="sp-table__footer-left-content">
          <sp-checkbox
            v-if="selection && showAllSelect"
            v-model="checkAll"
            :disabled="disabled || loading"
            :indeterminate="isIndeterminate"
            :label="selectionAllLabel"
            @change="handleCheckAllChange"
          />
          <div class="sp-table__footer-left-operation">
            <slot name="footerLeftContent"></slot>
          </div>
        </div>
      </div>
      <div
        v-if="pagination"
        class="sp-table__footer-center"
      >
        <sp-pagination
          :align="paginationAlign"
          :per-pages="paginationPerPages"
          :page-index="paginationPageIndex"
          :disabled="loading"
          :total="paginationTotal"
          :page-size="paginationPageSize"
          @change="handlePageChange"
        >
        </sp-pagination>
      </div>
      <div class="sp-table__footer-right">
        <div class="sp-table__footer-right-content">
          <slot name="footerRightContent"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SpCheckbox from '../../checkbox'
import BasicTable from './mixins/basic'
import TreeTable from './mixins/treeTable'


// import { importMixins } from './mixins/index'

export default {
  name: 'SpTable',
  
  components: {
    SpCheckbox
  },

  mixins: [BasicTable], // 顺序不可变，BasicTable在最前

  props: {
    list: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String,
      default: '暂无搜索结果'
    },
    loading: {
      type: Boolean,
      default: false
    },
    cellEmptyText: {
      type: String,
      default: '—'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: false
    },
    selectable: Function,
    selectionWidth: {
      type: String,
      default: '33'
    },
    pagination: {
      type: Boolean,
      default: false
    },
    paginationOption: {
      type: Object,
      default: () => ({})
    },
    hasMore: {
      type: Boolean,
      default: false
    },
    hasMoreText: {
      type: String,
      default: '查看全部'
    },
    selectionAllLabel: {
      type: String,
      default: '全选'
    },
    enableUpdate: {
      type: Boolean,
      default: false
    },
    showAllSelect: {
      type: Boolean,
      default: true
    },
    needScroll: {
      type: Boolean,
      default: false
    },
    /* 树形tale props */
    rowKey: { // 行数据的 Key，用来优化 Table 的渲染；显示树形数据时该属性是必填的
      type: [String, Function],
      default: 'id'
    },
    expandRowKeys: { // 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
      type: Array,
      default: () => []
    },
    defaultExpandAll: { // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
      type: Boolean,
      default: false
    },
    treeProps: { // 渲染嵌套数据的配置选项
      type: Object,
      default() {
        return {
          hasChildren: false,
          children: 'children'
        }
      }
    },
  },

  computed: {
    isTreeTable() {
      return this.treeProps.hasChildren
    },
  },

  beforeCreate() {
    console.log(this.$options.mixins)
    this.$options.mixins.push(TreeTable)
  }
}
</script>

<style lang="scss">
@import "./style/treeTable";

.sp-table {
  table {
    table-layout: fixed;
  }
  width: 100%;
  font-size: $table-font-size;
  line-height: $table-line-height;
  border: $table-outer-border;

  &.need--scroll {
    overflow-x: auto;
  }

  &__head {
    padding: $table-head-padding;
    text-align: left;
    color: $table-thead-color;
    border-bottom: $table-border;
    background-color: $table-background;
    box-sizing: border-box;

    &.borderBox {
      box-sizing: border-box;
    }

    th {
      text-align: left; /* 为了IE */
      line-height: 19px;
      &:first-child {
        padding-left: $table-cell-padding-horizontal;
      }
      [class^="sp-icon"] {
        font-size: 14px;
        color: #97a2b5;
      }
    }
  }
  &__body {
    position: relative;
    padding: $table-body-padding;
    text-align: left;
    color: $table-tbody-color;
    min-height: $table-min-height;
    box-sizing: border-box;

    tr {
      border-bottom: $table-border;

      &.is--striped {
        background: $table-background;
      }

      td {
        vertical-align: middle;
        line-height: 1.2;
        height: $table-row-height;
        padding: $table-td-padding-vertical 0;
        box-sizing: border-box;

        &:first-child {
          .sp-table-cell {
            padding-left: $table-cell-padding-horizontal;
          }
        }
        &:last-child {
          .sp-table-cell {
            padding-right: $table-cell-padding-horizontal;
          }
        }

        .sp-checkbox__wrap {
          display: inline-block;
          height: 14px;
          line-height: 15px;
          .sp-checkbox {
            font-size: 0;
          }
        }
      }
    }
    .ellipsis {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &__expand-ico {
    color: red;
    display: inline-block;
    cursor: pointer;
  }

  &__footer {
    position: relative;
    margin: 20px 0 30px;
    height: 30px;
    &-left {
      position: absolute;
      height: inherit;
      top: 0;
      left: $table-cell-padding-horizontal + $table-indent;
      bottom: 0;
      &-content {
        height: inherit;
        display: table-cell;
        vertical-align: middle;

        .sp-checkbox__wrap {
          margin-right: 16px;
        }

        .sp-button + .sp-button {
          margin-left: 2px;
        }
      }

      .sp-checkbox + span {
        padding-left: 8px;
      }

      &-operation {
        display: inline-block;
        vertical-align: sub;
      }
    }
    &-center {
      height: 100%;
      .sp-pagination {
        padding-top: 0;
      }
    }
    &-right {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      height: 100%;
      &-content {
        display: table-cell;
        vertical-align: middle;
      }
    }
  }

  &__append {
    position: relative;
    &-show-more {
      padding: 15px 0 17px;
      line-height: 18px;
      height: 18px;
      text-align: center;
    }

    .sp-table {
      margin-left: -1 * $table-indent;
      margin-right: -1 * $table-indent;
      width: auto;
      border: none;
      &::before {
        position: absolute;
        content: "";
        display: block;
        height: 1px;
        background-color: $table-divider-color;
        left: -1 * $table-indent;
        right: -1 * $table-indent;
        top: -1px;
        z-index: 2;
      }
      &__head {
        tr {
          border: 0;
        }
      }
      &__footer {
        border-bottom: 0;
      }
    }
  }

  &__empty {
    &-text {
      height: $table-min-height;
      line-height: $table-min-height;
      text-align: center;
      color: $table-empty-color;
      font-size: 16px;
    }
  }
  &__loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: $table-loading-color;

    .sp-icon-loading {
      font-size: 24px;
      vertical-align: sub;
      color: $table-loading-color;
      margin-right: 10px;
    }

    &-wrap {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgb(255 255 255 / 50%);
    }
  }

  &-cell {
    position: relative;
    padding-right: 20px;
    box-sizing: border-box;
    word-break: break-all;
    line-height: 1.5;
  }

  &.is--disabled {
    box-shadow: 0 1px 0 0 #dbdfe6;
    background-color: $table-background--is-disabled;
    color: $color-text-tip;
    .sp-table__head {
      background-color: $table-background--is-disabled;
    }
    .sp-table__body {
      color: $color-text-tip;
      tr {
        &.is--striped {
          background: $table-background--is-disabled;
        }
      }
    }
    .sp-table__footer {
      border-bottom: none;
    }
  }

  &.is--selection {
    .sp-table {
      &__body {
        tr {
          td {
            &:first-child {
              .sp-table-cell {
                padding-right: 7px;
                padding-left: 10px;
                margin-left: $table-selection-margin-left;
              }
            }
          }
        }
      }
      &__head {
        tr {
          th:first-child {
            div {
              margin-left: $table-selection-margin-left;
              width: 11px;
            }
          }
        }
      }
      &__footer {
        &-left {
          left: $table-indent + $table-selection-margin-left;
        }
      }
    }
  }
}
</style>