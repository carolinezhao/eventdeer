<template>
  <div>
    <section class="form-section flex-col">
      <div class="form-title flex-center">New Course</div>
      <form id="course-form">
        <div class="form-row">
          <label class="form-label">Date</label>
          <div class="form-content">
            <input type="text" class="input" v-model="date">
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Start Time</label>
          <div class="form-content">
            <select v-model="selectedTime">
              <option v-for="timeOption in timeOptions" :key="timeOption.id" :value="timeOption">{{timeOption}}:00</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Course Type</label>
          <div class="form-content">
            <select v-model="selectedType">
              <option v-for="typeOption in typeOptions" :key="typeOption.id" :value="typeOption">{{typeOption}}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Description</label>
          <div class="form-content">
            <!-- 没有标注 key 的元素会被复用，即输入的内容会被保留 -->
            <template v-if="ifShowUnit">
              <label>Unit</label>
              <input type="text" class="short-input" maxlength="2" v-model.number="unit">
              <div class="err-msg">{{checkUnit()}}</div>
            </template>
            <template v-else>
              <label>Level</label>
              <input type="text" class="short-input" maxlength="2" v-model.number="lowerLevel"> -
              <input type="text" class="short-input" maxlength="2" v-model.number="upperLevel">
              <div class="err-msg">{{checkLevel()}}</div>
            </template>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">VIP</label>
          <div class="form-content">
            <select v-model="isVIP">
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>
      </form>

      <div class="form-button flex">
        <div class="err-msg">{{confirmMsg}}</div>
        <button type="submit" class="main-button small-button" @click="confirmCreate">Create</button>
      </div>
    </section>

    <section class="filter-section">
      <div class="card">
        <div class="form-row" v-for="filter in filters" :key="filter.id">
          <label class="form-label filter-label">{{filter.name}}</label>
          <div class="form-content filter-content">
            <div class="form-content filter-option" v-for="option in filter.options" :key="option.id">
              <input type="checkbox" :value="{prop: filter.prop, value: option}" v-model="selectedFilter">
              <label>{{option}}</label>
            </div>
          </div>
        </div>
      </div>

      <template v-if="tempCourses.length">
        <button class="primary-button small-button" @click="filterCourses()">Cancel</button>
      </template>
      <template v-else-if="selectedFilter">
        <button class="primary-button small-button" @click="filterCourses(selectedFilter)">Filter</button>
      </template>
      <template v-else>
        <button class="primary-button small-button">Filter</button>
      </template>
    </section>

    <section class="operation-section">
      <button class="primary-button small-button" @click="refresh">Refresh</button>
      <button class="primary-button small-button">Edit</button>
      <button class="danger-button small-button" @click="confirmRemove">Remove</button>

      <div class="operation-msg">{{operationMsg('select')}}</div>
      <div class="operation-msg">{{resultMsg}}</div>
      <!-- for debug -->
      <div class="operation-msg">test: {{checkedCourses}}</div>
    </section>

    <section class="table-section">
      <course-table ref="table" :colTitles="colTitles" :objsArray="courses" v-model="checkedCourses"></course-table>
      <!-- for production -->
      <!-- <div>Courses since today (00:00)</div> -->
    </section>
  </div>
</template>

<script>
import {displayTime, displayDate, continuousNum, checkNumber} from '@/utils/util'
// import {displayTime, displayDate, formatTime, continuousNum, checkNumber} from '@/utils/util'
import Table from '@/components/Table'
export default {
  name: 'course',
  components: {
    courseTable: Table
  },
  data () {
    return {
      // form
      date: 'Jul 15 2018', // test
      selectedTime: 11,
      selectedType: 'FTClass',
      typeOptions: ['FTClass', 'Extend', 'GroupChat'],
      unit: '',
      lowerLevel: '',
      upperLevel: '',
      isVIP: '0',
      // for table component
      colTitles: ['Date', 'Time', 'Course Type', 'Description', 'VIP'],
      courses: [],
      // from table component to manipulate
      checkedCourses: [],
      // msg
      confirmMsg: '',
      resultMsg: '',
      // filter
      selectedFilter: [],
      tempCourses: []
    }
  },
  computed: {
    timeOptions () {
      return continuousNum(11, 20)
    },
    ifShowUnit () {
      return this.selectedType === 'FTClass'
    },
    filters () {
      return [
        {
          name: 'VIP',
          prop: 'isVIP',
          options: ['Yes', 'No']
        }, {
          name: 'Course Type',
          prop: 'type',
          options: this.typeOptions
        }]
    }
  },
  mounted () {
    this.queryCourses()
  },
  methods: {
    emptySelected () {
      // before creating; after removing
      this.checkedCourses = [] // 本页面
      this.$refs.table.empty() // 子组件
    },
    checkUnit () {
      return checkNumber(this.unit)
    },
    checkLevel () {
      let msg1 = checkNumber(this.lowerLevel)
      let msg2 = checkNumber(this.upperLevel)
      let msg3
      if (this.upperLevel && (this.upperLevel - this.lowerLevel < 1)) {
        msg3 = 'Please enter lower level first'
      }
      return msg1 || msg2 || msg3
    },
    confirmCreate () {
      if (this.checkLevel || this.checkUnit) {
        this.confirmMsg = "Please correct the data that don't meet requirements"
      } else if ((this.ifShowUnit && !this.unit) || (!this.ifShowUnit && (!this.lowerLevel || !this.upperLevel))) {
        this.confirmMsg = 'Please fill in all the blank items'
      } else {
        this.confirmMsg = ''
        this.createCourse()
      }
    },
    createCourse () {
      this.emptySelected()
      // prepare data for backend
      let time = new Date(`${this.date}, ${this.selectedTime}:00`)
      let description = (this.selectedType === 'FTClass') ? `Unit ${this.unit}` : `L${this.lowerLevel}-L${this.upperLevel}`
      let isVIP = Boolean(Number(this.isVIP))
      // prepare data for frontend
      let vipStr = isVIP ? 'Yes' : 'No'
      let displayCourse = {
        date: this.date,
        time: `${this.selectedTime}:00`,
        type: this.selectedType,
        description: description,
        isVIP: vipStr
      }
      // backend
      let AV = this.$AV
      let Courses = AV.Object.extend('Courses')
      let course = new Courses()
      course.set('time', time)
      course.set('type', this.selectedType)
      course.set('description', description)
      course.set('isVIP', isVIP)
      course.save()
        .then((course) => {
          // frontend
          displayCourse.id = course.id // id 是存储成功后生成的
          console.log('id is ' + displayCourse.id)
          this.operationMsg('create')
          this.courses.unshift(displayCourse)
        })
        .catch(console.error())
    },
    queryCourses () {
      // console.log('queryCourses starts')
      let AV = this.$AV
      let queryCourses = new AV.Query('Courses')
      // for production
      // queryCourses.greaterThanOrEqualTo('time', formatTime('today'))
      queryCourses.ascending('time')
        .find()
        .then(courses => {
          // console.log(courses)
          let newCourses = courses.map(item => {
            // attributes 中是自定义属性
            let course = item.attributes
            let newCourse = {}
            // match the order of colTitle
            newCourse.date = displayDate(course.time) // add
            newCourse.time = displayTime(course.time) // revise
            newCourse.type = course.type
            newCourse.description = course.description
            newCourse.isVIP = course.isVIP ? 'Yes' : 'No' // revise
            newCourse.id = item.id // 存储对象时自动分配的 id
            return newCourse
          })
          // console.log(newCourses)
          this.courses = newCourses
        })
        .catch(console.error())
    },
    confirmRemove () {
      if (!this.checkedCourses.length) {
        alert("You haven't chosen any data.")
      } else {
        let result = window.confirm('Are you sure you want to remove checked data?')
        if (result) {
          this.removeCourses(this.courses, this.checkedCourses, 'Courses')
        }
      }
    },
    removeCourses (currentArr, targetArr, tableName) {
      let AV = this.$AV
      let removeArrFront = []
      let removeArrBack = []
      for (let targetObj of targetArr) {
        // frontend
        removeArrFront.push(targetObj.index)
        // backend
        // tableName 是 leancloud 中数据表的名称 (string)
        let removeObjBack = AV.Object.createWithoutData(tableName, targetObj.id)
        removeArrBack.push(removeObjBack)
      }
      // remove multiple objects
      AV.Object.destroyAll(removeArrBack).then(() => {
        // 后端执行成功后再操作前端
        removeArrFront.forEach(item => {
          currentArr.splice(item, 1)
        })
        this.operationMsg('remove', targetArr.length)
        this.emptySelected()
      }).catch(console.error())
    },
    filterCourses (conditionArr) {
      if (conditionArr) {
        this.tempCourses = this.courses
        let prop
        let value
        for (let item of conditionArr) {
        // conditionArr.forEach(function (item) { // cannot get 'this'
          prop = item.prop
          value = item.value
          this.courses = this.courses.filter(function (targetObj) {
            // typeof prop === 'string'
            return targetObj[prop] === value
          })
        // })
        }
        console.log(this.courses.length)
      } else {
        this.courses = this.tempCourses
        this.tempCourses = []
        conditionArr = ''
      }
    },
    refresh () {
      this.queryCourses()
    },
    operationMsg (string, number) {
      switch (string) {
        case 'create':
          this.resultMsg = 'Created Successfully!'
          setTimeout(() => {
            this.resultMsg = ''
          }, 1000)
          break
        case 'select':
          let len = this.checkedCourses.length
          if (len) {
            let plural = (len === 1) ? 'item' : 'items'
            return `Selected ${len} ${plural}`
          }
          break
        case 'remove':
          let plural = (number === 1) ? 'item' : 'items'
          this.resultMsg = `Removed ${number} ${plural}`
          setTimeout(() => {
            this.resultMsg = ''
          }, 1000)
          break
        default:
          break
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .operation-section,
  .filter-section,
  .table-section {
    margin-top: 20px;
    overflow: hidden;
  }

  .table-section {
    width: 80%;
  }

  /* 表单 */

  .form-section {
    width: 40%;
    min-width: 400px;
    max-width: 500px;
  }

  #course-form {
    margin: 10px;
  }

  /* filter */

  .filter-section {
    width: 80%;
  }

  .form-label.filter-label {
    width: 20%;
  }

  .form-content.filter-option {
    width: 120px;
    background-color: #bfcbd9;
  }
</style>
