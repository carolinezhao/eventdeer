<template>
  <table id="course-table">
    <thead>
      <tr>
        <th class="title-cell center-align">
          <!-- <input type="checkbox"> -->
        </th>
        <th class="title-cell left-align" v-for="title in colTitles" :key="title">{{title}}</th>
      </tr>
    </thead>

    <tbody>
      <tr class="content-row" v-for="(object, index) in objsArray" :key="object.id">
        <td class="content-cell center-align">
          <input type="checkbox" :value="{index: index, id: object.id}" v-model="checkedObjs">
        </td>
        <td class="content-cell left-align" v-for="(value, key) in object" :key="value.id" v-if="!(key === 'id')">{{value}}</td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td class="content-cell center-align" colspan="6">Page {{currentPage}} of {{totalPage}}</td>
      </tr>
      <tr>
        <!-- for debug -->
        <td class="content-cell center-align" colspan="6">{{checkedObjs}}</td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
export default {
  props: ['colTitles', 'objsArray'],
  data () {
    return {
      checkedObjs: [], // 选中的对象，准备传给父组件
      // fake data
      currentPage: '1',
      totalPage: '3'
    }
  },
  watch: {
    checkedObjs (newValue, oldValue) {
      console.log(newValue)
      this.$emit('input', newValue) // 向父组件的 v-model 传值
    }
  },
  methods: {
    empty () { // 由父组件调用，清空选中的对象
      this.checkedObjs = []
    }
  }
}
</script>

<style scoped>
  #course-table {
    border: 1px solid #bfcbd9;
    width: 80%;
    border-collapse: collapse;
  }

  /* table row
  字体和高度对 thead 和 tr 无效，背景色有效 */

  .content-row:nth-child(even) {
    background-color: #f8f8f8;
  }

  /* table cell */

  .title-cell {
    background-color: #bfcbd9;
    font-weight: normal;
    height: 40px;
  }

  .content-cell {
    font-weight: 300;
    font-size: 15px;
    height: 35px;
  }

  .center-align {
    text-align: center;
  }

  .left-align {
    text-align: left;
  }
</style>
