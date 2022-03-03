import { mount, shallowMount } from '@vue/test-utils'
import Select from 'sparta/components/select'
import { createTest, createVue, destroyVM , sleep } from '../../util';

const getTestData = function() {
  return [
    { id: 1, name: 'cat', disabled: false, icon: 'sp-icon-file' },
    { id: 2, name: 'dog', disabled: false, icon: 'sp-icon-check' },
    { id: 3, name: 'pig', disabled: false, icon:'sp-icon-search'},
    { id: 4, name: 'tiger', disabled: false, icon: 'sp-icon-file'   },
    { id: 5, name: 'elephant', disabled: false, icon: 'sp-icon-check'  }
  ];
};

describe('Select', () => {

  describe('single 可搜索', () => {
    const wrapper = mount({
      data() {
        return {
          val: '',
          optionsData: getTestData(),
          clearable: false
        }
      },
      template: `
      <div>
      <sp-button class="sp-select-other-button">测试single</sp-button>
        <sp-select 
          ref="select"
          filterable
          v-model="val">
          <i slot="prepend" :class="icon"></i>
          <sp-option 
           v-for="(item, index) in optionsData"
           :key="index"
           :label="item.name"
           :value="item.id" 
           :disabled="item.disabled"
          >
          <i :class="item.label"></i><span>{{item.name}}</span>
          </sp-option>
        </sp-select>
      </div>
      `,
      components: {
        'sp-select': Select,
      },
      computed: {
        icon() {
          return (this.optionsData.find(item => item.id === this.val) || {}).icon
        }
      }
    })
    document.body.appendChild(wrapper.vm.$el)
    

    describe('默认无值-点选', () => {
      it('点击组件，显示所有下拉选项，全部没有点亮', async () => {
        await clearSelect(wrapper)
        await selectClick(wrapper)
        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.true
        expect(getVisibleOptionsLength(wrapper).length).to.be.equal(5) 
        expect(wrapper.find('.sp-select-list .is--selected').exists()).to.be.false
       });

       it('点击组件，显示所有下拉选项，全部没有点亮，输入异常的值，显示无匹配数据', async () => {
        await setSelectVal(wrapper,'mnh')
        expect(wrapper.find('.sp-select-list-emptyText').isVisible()).to.be.true
        await handelOtherClick(wrapper) 
       });

       it('点击组件，显示所有下拉选项，全部没有点亮，输入异常的值，显示无匹配数据，再点击其他地方，清空异常的数据，并隐藏下拉框，组件无新值传出', async () => {
        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.false
        expect(wrapper.vm.$children[1].inputText).to.be.equal('')
        expect(wrapper.vm.val).to.be.equal('')
       });

       it('点击组件，显示所有下拉选项，全部没有点亮，输入包含的值，正确过滤选项，点击选项，正确显示文案和icon， 并将新值传出', async () => {
        await selectClick(wrapper)
        await setSelectVal(wrapper, 'pi')
        expect(getVisibleOptionsLength(wrapper).length).to.be.equal(1)

        await clickFirstOptions(wrapper)

        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.false
        expect(wrapper.vm.$children[1].inputText).to.be.equal('pig')
        expect(wrapper.vm.val).to.be.equal(3)
        expect(wrapper.vm.icon).to.be.equal('sp-icon-search')
       });

       it('点击组件，显示所有下拉选项，全部没有点亮，输入包含的值，正确过滤选项，点击选项，正确显示文案和icon， 并将新值传出，再点击显示所有的选项，并且请选择的地址显示已选的文案，滚动和点亮已选项', async () => {
        await selectClick(wrapper)
        expect(getVisibleOptionsLength(wrapper).length).to.be.equal(5)
        expect(wrapper.vm.$children[1].inputText).to.be.equal('')
        expect(wrapper.find('.sp-select__prepend').isVisible()).to.be.false
        expect(wrapper.find('.sp-select-list .is--selected').exists()).to.be.true
        await handelOtherClick(wrapper)
       });

       it('点击组件，显示所有下拉选项，全部没有点亮，输入完全符合的值，点击其他地方，下拉框隐藏，还是显示请选择，无新值传出', async () => {
        await clearSelect(wrapper)
        expect(wrapper.vm.val).to.be.equal('')
        expect(wrapper.vm.$children[1].inputText).to.be.equal('')

        await selectClick(wrapper)
        expect(getVisibleOptionsLength(wrapper).length).to.be.equal(5)
        await setSelectVal(wrapper, 'pig')
        await handelOtherClick(wrapper)

        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.false
        expect(wrapper.vm.val).to.be.equal('')
        expect(wrapper.vm.$children[1].inputText).to.be.equal('')
       });
    })

    describe('默认无值-键盘操作', () => {
      const select = wrapper.vm.$children[1];
      it('直接使用键盘向上/向下，显示所有下拉选项，全部没有点亮', async () => {
        await handelOtherClick(wrapper)
        await clearSelect(wrapper)
        await select.navigateOptions('next')
        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.true
        expect(getVisibleOptionsLength(wrapper).length).to.be.equal(5) 
        expect(wrapper.find('.sp-select-list .is--selected').exists()).to.be.false
      });

      it('直接使用键盘向上/向下，显示所有下拉选项，全部没有点亮，输入包含的值，正确过滤数据，使用键盘移动，并选择一个选项, 下拉框关闭，正确显示正常的文案和icon, 并将新值传出， 再次使用键盘向上/向下，显示所有下拉选项，并且请选择的地址显示已选的文案，滚动和点亮已选项', async () => {
        await setSelectVal(wrapper, 'pi')
        await select.navigateOptions('next')
        select.handleInputEnter()
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.false
        expect(wrapper.vm.$children[1].inputText).to.be.equal('pig')
        expect(wrapper.vm.val).to.be.equal(3)
        expect(wrapper.vm.icon).to.be.equal('sp-icon-search')
        expect(wrapper.find('.sp-select__prepend').isVisible()).to.be.true

        await select.navigateOptions('next')
        await wrapper.vm.$nextTick()
        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.true
        expect(getVisibleOptionsLength(wrapper).length).to.be.equal(1) 
        expect(wrapper.find('.sp-select-list .is--selected').exists()).to.be.true
      });
    })
    
    describe('默认有值-点选', () => {
      it('点击组件，显示所有下拉选项，滚动并点亮已选项，输入异常的值，显示无匹配数据，再点击其他地方，正常显示之前的已选项和icon，并隐藏下拉框，组件无新值传出', async () => {
        await wrapper.setData({ val: 3})
        await selectClick(wrapper)
        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.true
        expect(getVisibleOptionsLength(wrapper).length).to.be.equal(5)
        expect(wrapper.find('.sp-select-list .is--selected').exists()).to.be.true
        
        await setSelectVal(wrapper, 'uij')
        await handelOtherClick(wrapper)
        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.false
        expect(wrapper.vm.val).to.be.equal(3)
      })

      it('点击组件，显示所有下拉选项，滚动并点亮已选项，输入包含的值，正确过滤选项，点击选项，正确显示文案和icon， 并将新值传出，再点击显示所有的选项，并且请选择的地址显示已选的文案，滚动和点亮已选项', async () => {
        await selectClick(wrapper)
        await setSelectVal(wrapper, 'dog')

        await clickFirstOptions(wrapper)

        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.false
        expect(wrapper.vm.$children[1].inputText).to.be.equal('dog')
        expect(wrapper.vm.val).to.be.equal(2)
        expect(wrapper.vm.icon).to.be.equal('sp-icon-check')
      })
    })

    describe('默认有值-键盘操作', () => {
      const select = wrapper.vm.$children[1];
      it('直接使用键盘向上/向下，显示所有下拉选项，滚动并点亮已选项，输入包含的值，正确过滤数据，使用键盘移动，并选择一个选项, 下拉框关闭，正确显示正常的文案和icon, 并将新值传出， 再次使用键盘向上/向下，显示所有下拉选项，并且请选择的地址显示已选的文案，滚动和点亮已选项', async () => {
        await wrapper.setData({ val: 3})
        await wrapper.vm.$nextTick()
        await select.navigateOptions('next')

        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.true
        expect(getVisibleOptionsLength(wrapper).length).to.be.equal(1) 
        expect(wrapper.find('.sp-select-list .is--selected').exists()).to.be.true

        await setSelectVal(wrapper, 'pig')
        await select.navigateOptions('next')
        select.handleInputEnter()
        await wrapper.vm.$nextTick()
        
        expect(wrapper.find('.sp-select-dropdown').isVisible()).to.be.false
        expect(wrapper.vm.$children[1].inputText).to.be.equal('pig')
        expect(wrapper.vm.val).to.be.equal(3)
        expect(wrapper.vm.icon).to.be.equal('sp-icon-search')
        expect(wrapper.find('.sp-select__prepend').isVisible()).to.be.true
      })
    })
    after(() => {
      //  document.body.removeChild(wrapper.vm.$el)
    }) 
  })
})

/**
 * 清空组件值
 * @param {*} wrapper 
 */
function clearSelect(wrapper) {
  return wrapper.setData({ val: ''})
}

/**
 * 点击组件
 * @param {*} wrapper 
 */
function selectClick(wrapper) {
  return wrapper.find('.sp-select').trigger('click')
}

/**
 * 设置值
 * @param {*} wrapper 
 * @param {*} val 
 */
 async function setSelectVal (wrapper, val) {
  await wrapper.find('.sp-select__input').trigger('focus')
  await wrapper.find('.sp-select__input').setValue(val)
  return wrapper.find('.sp-select__input').trigger('focus')
}

/**
 * 点击其他地方，失焦
 * @param {*} wrapper 
 */
function handelOtherClick(wrapper) {
  return wrapper.vm.$el.querySelector('.sp-select-other-button').click()
}

/**
 * 获取可见的options
 * @param {*} wrapper 
 * @returns 
 */
function getVisibleOptionsLength(wrapper) {
  return wrapper.findAll('.sp-select-list .sp-option').filter(item => item.element.style.display!== 'none')
}

/**
 * 点击第一个选项
 * @param {*} wrapper 
 * @returns 
 */
function clickFirstOptions(wrapper) {
  const options = wrapper.findAll('.sp-select-list .sp-option').filter(item => item.element.style.display!== 'none')
  options.wrappers[0].element.click()
  return options.wrappers[0].trigger('click')
}