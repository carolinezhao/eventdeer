<template>
  <table id="table">
    <thead>
      <tr>
        <th class="title-cell center-align" :class="{'check-col': !ifArchive}">
          <input type="checkbox" v-model="checked" @change="changeCheckAll()" v-if="!ifArchive">
        </th>
        <th class="title-cell left-align" v-for="title in colTitles" :key="title">{{title}}</th>
      </tr>
    </thead>

    <tbody>
      <tr class="content-row" v-for="(object, index) in objsArray" :key="object.id" v-if="(indexMin <= index) && (index < indexMin + itemsPerPage)">
        <td class="content-cell center-align" :class="{'check-col': !ifArchive}">
          <input type="checkbox" :value="{index: index, id: object.id}" v-if="!ifArchive" v-model="checkedObjs">
        </td>
        <td class="content-cell left-align" v-for="(colKey, index) in colKeys" :key="colKey.id" v-if="index < keyLimit">{{object[colKey]}}</td>
        <td class="content-cell center-align detail-col" v-if="object.detail">
          <template v-if="object.ifDiscover">
            <router-link class="link" :to="{name: 'detail', params: {id: object.id}}">view</router-link>
          </template>
          <template v-else> - </template>
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr class="foot-row">
        <td class="content-cell center-align" :colspan="colNum">
          <div class="flex foot-button-container">
            <div>
              <input type="text" class="short-input" v-model.number="itemsPerPage"> items per page</div>
            <div class="flex table-page-nav">
              <button class="primary-btn" :disabled="currentPage == 1" @click="pageNav('previous')">Previous</button>
              <div>Page
                <input type="text" class="short-input" v-model.number="currentPage"> of {{totalPage}}</div>
              <button class="primary-btn" :disabled="currentPage == totalPage" @click="pageNav('next')">Next</button>
            </div>
          </div>
        </td>
      </tr>
      <!-- <tr>
        <td class="content-cell center-align" :colspan="colNum">{{checkedObjs}}</td>
      </tr> -->
    </tfoot>
  </table>
</template>

<script>
export default {
  props: ['colTitles', 'objsArray', 'colKeys', 'keyLimit', 'ifArchive'],
  data () {
    return {
      // check data
      checkedObjs: [], // 选中的对象，准备传给父组件
      checked: false, // 是否全选
      // table page
      currentPage: 1,
      itemsPerPage: 8
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
    colNum () {
      return this.colTitles.length + 1
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
  #table {
    border: 1px solid #bfcbd9;
    width: 100%;
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
    height: 38px;
  }

  .center-align {
    text-align: center;
  }

  .left-align {
    text-align: left;
    padding-left: 6px;
  }

  .check-col {
    width: 30px;
  }

  .detail-col {
    width: 60px;
  }

  .link {
    /* color: #2c3e50; */
    cursor: pointer;
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
</style>
