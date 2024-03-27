// import Vue from 'vue'
// import Table from '../table/src/table'
// import TreeTable from '../table/src/mixins/treeTable'

// console.log('TreeTable>>>>', TreeTable)

// // const ExtendedComponent = Vue.extend(Table)
// // ExtendedComponent.options.mixins.push(TreeTableMixins)
// // console.log('ExtendedComponent', new ExtendedComponent())


// // const TreeTable = {
// //   extends: Table,
// //   mixins: [TreeTableMixins],
// // }

// const TreeTable = Vue.extend(Table,{
//   name: 'SpTreeTable',
//   mixins: [TreeTableMixins],
// })
// TreeTable.options.name = 'SpTreeTable'
// TreeTable.options.mixins.push(TreeTableMixins)

// console.log('TreeTable>>>>')
// // const TreeTable = new ExtendedComponent()


// TreeTable.install = Vue => {
//   Vue.component('SpTreeTable', Table)
// }

// export default TreeTable


// const TreeTable =

///********* */

// import Vue from 'vue'
// import Table from '../table/src/table'

// const CompVue = Vue.extend(Table)
// CompVue.options.name = 'SpTreeTable'

// const yy = new CompVue({
//   name: 'SpTreeTable',
//   mixins: [TreeTable]
// })
// yy.options.name = 'SpTreeTable'
// console.log('yy>>>>', yy)



// TreeTable.install = Vue => {
//   Vue.component('SpTreeTable', TreeTable)
// }

// export default yy
// export default CompVue.options


import TreeTable from '../table/src/mixins/treeTable.vue'

export default TreeTable