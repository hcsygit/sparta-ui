import { mount, shallowMount } from '@vue/test-utils'
import TimeSelect from 'sparta/components/time-select'

import { createTest, createVue, destroyVM } from '../../util';

describe('time-select', () => {
 
  describe('single', () => {
    const wrapper = mount({
      data() {
        return {
          val: '',
          disabled: false,
          pickerOptions: {}
        }
      },
      methods: {
        handleDisabledTime(val) {
          return ["10:00"].includes(val)
        }
      },
      template: `
        <sp-time-select 
          ref="spTimeSelect" 
          v-model="val" 
          clearable 
          :disabledTime="handleDisabledTime"
          :pickerOptions="pickerOptions">
        </sp-time-select>
      `,
      components: {
        'sp-time-select': TimeSelect,
      }
    })
    document.body.appendChild(wrapper.vm.$el)

    it('set data', async () => {
      await wrapper.setData({ val: '02:00' })
      expect(wrapper.vm.val).toEqual('02:00')
    })

    it('input focus', async () => {
      const input = wrapper.find('input')
      input.trigger("focus")
      console.log("document.activeElement", document.activeElement)
      document.activeElement.focus()
      document.body.click()
    })

    it('input blur', async () => {
      const input = wrapper.find('input')
      input.trigger("blur")
    })

    it('input change', async () => {
  
    })

    it('pane click', async () => {
  
    })

    // it('disabled', async () => {
    //   await wrapper.setData({ disabled: true })
    //   // expect(wrapper.vm.val).toEqual('02:00')
    // })

    it('disabledTime', async () => {
      // await wrapper.setData({ disabled: true })
      // expect(wrapper.vm.val).toEqual('02:00')
    })

    it('pickerOptions set', async () => {
      await wrapper.setData({ pickerOptions: {
        start: '02:00',
        end: '20:00',
        step: '01:00',
        minTime: '05:00',
        maxTime: '06:00',
      }
     })
    })

    it('clear data', async () => {
      await wrapper.setProps({ val: '02:00' })
      const input = wrapper.find('input')
      await input.trigger("focus")
      wrapper.vm.$nextTick(() => {
        document.querySelectorAll(".sp-icon-close-bold")[0].click()
      })
    })
  })

  describe('range', () => {
    const wrapper = mount({
      data() {
        return {
          val: '',
          disabled: false,
          pickerOptions: {}
        }
      },
      methods: {
        handleDisabledTime(val) {
          return ["10:00"].includes(val)
        }
      },
      template: `
        <sp-time-select 
          ref="spTimeSelect" 
          v-model="val" 
          clearable
          type="range" 
          :pickerOptions="pickerOptions">
        </sp-time-select>
      `,
      components: {
        'sp-time-select': TimeSelect,
      }
    })
    document.body.appendChild(wrapper.vm.$el)

    it('set data', async () => {
      await wrapper.setData({ val: ['02:00',"18:00"] })
      expect(wrapper.vm.val).toEqual(['02:00',"18:00"])
    })

    it('input focus', async () => {
      const input = wrapper.find('input')
      input.trigger("focus")
      console.log("document.activeElement", document.activeElement)
      document.activeElement.focus()
      document.body.click()
    })

    it('input blur', async () => {
      const input = wrapper.find('input')
      input.trigger("blur")
    })

    it('input change', async () => {
  
    })

    it('pane click', async () => {
  
    })

    // it('disabled', async () => {
    //   await wrapper.setData({ disabled: true })
    //   // expect(wrapper.vm.val).toEqual('02:00')
    // })

    it('disabledTime', async () => {
      // await wrapper.setData({ disabled: true })
      // expect(wrapper.vm.val).toEqual('02:00')
    })

    it('pickerOptions set', async () => {
      await wrapper.setData({ pickerOptions: {
        start: '02:00',
        end: '20:00',
        step: '01:00',
        minTime: '05:00',
        maxTime: '06:00',
      }
     })
    })

    it('clear data', async () => {
      await wrapper.setProps({ val: ['02:00',"18:00"] })
      const input = wrapper.find('input')
      await input.trigger("focus")
      wrapper.vm.$nextTick(() => {
        console.log("wrapper.vm.val [range]", wrapper.vm.val)
        document.querySelectorAll(".sp-icon-close-bold")[0].click()
      })
    })
  })

})
