<template>
  <table id="course-table">
    <thead>
      <tr>
        <th class="title-cell center-align">
          <input type="checkbox" v-model="checked" @change="changeCheckAll()">
        </th>
        <th class="title-cell left-align" v-for="title in colTitles" :key="title">{{title}}</th>
      </tr>
    </thead>

    <tbody>
      <tr class="content-row" v-for="(object, index) in objsArray" :key="object.id" v-if="(indexMin <= index) && (index < indexMin + itemsPerPage)">
        <td class="content-cell center-align">
          <input type="checkbox" :value="{index: index, id: object.id}" v-model="checkedObjs">
        </td>
        <td class="content-cell left-align" v-for="(value, key) in object" :key="value.id" v-if="!(key === 'id')">{{value}}</td>
        <!-- for debug -->
        <!-- <td class="center-align" style="color: blue;">{{index}}</td> -->
      </tr>
    </tbody>

    <tfoot>
      <tr class="foot-row">
        <td class="content-cell center-align" colspan="6">
          <div class="flex foot-button-container">
            <div>
              <input class="short-input" v-model.number="itemsPerPage"> items per page</div>
            <div class="flex table-page-nav">
              <button class="primary-button" :class="{disabled: currentPage == 1}" @click="pageNav('previous')">Previous</button>
              <div>Page
                <input class="short-input" v-model.number="currentPage"> of {{totalPage}}</div>
              <button class="primary-button" :class="{disabled: currentPage == totalPage}" @click="pageNav('next')">Next</button>
            </div>
          </div>
        </td>
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
      // check data
      checkedObjs: [], // 选中的对象，准备传给父组件
      checked: false, // 是否全选
      // table page
      currentPage: 1,
      itemsPerPage: 3
    }
  },
  computed: {
    checkedAllObjs () {
      let allObjs = []
      this.objsArray.forEach((item, index) => {
        allObjs.push({
          index: index,
          id: item.id
        })
      })
      return allObjs
    },
    indexMin () {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    totalPage () {
      let count = this.objsArray.length
      let quotient = Number.parseInt(count / this.itemsPerPage)
      let remainder = count % this.itemsPerPage
      return (remainder) ? (quotient + 1) : quotient
    }
  },
  watch: {
    checkedObjs (newValue, oldValue) {
      // console.log(newValue)
      this.$emit('input', newValue) // 向父组件的 v-model 传值
      this.checked = (newValue.length === this.checkedAllObjs.length) // 根据各条目的选中状态改变全选状态
    }
  },
  methods: {
    empty () { // 由父组件调用，清空选中的对象
      this.checkedObjs = []
    },
    changeCheckAll () {
      this.checkedObjs = (this.checked) ? this.checkedAllObjs : []
    },
    pageNav (string) {
      switch (string) {
        case 'previous':
          if (this.currentPage > 1) this.currentPage -= 1
          break
        case 'next':
          if (this.currentPage < this.totalPage) this.currentPage += 1
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
  #course-table {
    border: 1px solid #bfcbd9;
    width: 85%;
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

  /* table foot */

  .foot-row {
    border-top: 1px solid #bfcbd9;
  }

  .foot-button-container {
    justify-content: space-between;
    padding: 8px;
  }

  .table-page-nav>* {
    margin-right: 5px;
  }

  /* button */

  .disabled {
    color: #bfcbd9;
    border-color: #bfcbd9;
  }
</style>
