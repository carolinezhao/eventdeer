<template>
  <div>
    <section class="form-container flex-center" v-if="ifShowForm">
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
              <select v-model="time">
                <option v-for="timeOption in timeOptions" :key="timeOption.id" :value="timeOption">{{timeOption}}:00</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Course Type</label>
            <div class="form-content">
              <select v-model="type">
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
              <input type="radio" :value="false" v-model="isVIP" id="false">
              <label class="radio-label" for="false">No</label>
              <input type="radio" :value="true" v-model="isVIP" id="true">
              <label class="radio-label" for="true">Yes</label>
            </div>
          </div>
        </form>

        <div class="form-footer flex">
          <button type="button" class="primary-button small-button" @click="closeForm">Cancel</button>
          <button type="submit" class="main-button small-button" v-if="ifNewForm" :disabled="disabledCreate" @click="createCourse">Create</button>
          <button type="submit" class="main-button small-button" v-if="!ifNewForm" :disabled="disabledSave" @click="updateCourse">Save</button>
        </div>
      </section>
    </section>

    <section class="filter-section">
      <course-filter ref="filter" :filters="filters" v-model="selectedFilter"></course-filter>
      <div class="filter-footer card flex">
        <template v-if="tempCourses.length">
          <button class="primary-button small-button" @click="cancelFilter">Cancel</button>
        </template>
        <template v-else>
          <button class="main-button small-button" @click="filterCourses(selectedFilter)">Filter</button>
        </template>
        <div class="operation-msg">{{filterMsg}}</div>
      </div>
    </section>

    <section class="operation-section">
      <button class="main-button small-button" @click="openForm">Create</button>
      <button class="primary-button small-button" @click="refresh">Refresh</button>
      <button class="primary-button small-button"  @click="editForm">Edit</button>
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
import Filter from '@/components/Filter'
export default {
  name: 'course',
  components: {
    courseTable: Table,
    courseFilter: Filter
  },
  data () {
    return {
      // form content
      date: 'Sun Jul 15 2018', // test
      time: 11,
      type: 'FTClass',
      typeOptions: ['FTClass', 'Extend', 'GroupChat'],
      unit: '', // num
      lowerLevel: '', // num
      upperLevel: '', // num
      isVIP: false,
      formKey: ['date', 'time', 'type', 'unit', 'lowerLevel', 'upperLevel', 'isVIP'],
      origin: ['Sun Jul 15 2018', 11, 'FTClass', '', '', '', false], // 初始值，用于在编辑状态下比较
      editing: [], // 打开编辑框时的值
      changedObj: {}, // 更改的 key-value
      // form status
      ifShowForm: false,
      ifNewForm: true,
      disabledSave: true,
      // for table component
      colTitles: ['Date', 'Time', 'Course Type', 'Description', 'VIP'],
      courses: [],
      // from table component to manipulate
      checkedCourses: [],
      // msg
      resultMsg: '',
      // filter
      selectedFilter: [],
      tempCourses: [],
      filterMsg: ''
    }
  },
  computed: {
    // form content
    timeOptions () {
      return continuousNum(11, 20)
    },
    ifShowUnit () {
      return this.type === 'FTClass'
    },
    vipStr () {
      return (this.isVIP) ? 'Yes' : 'No'
    },
    // form status
    disabledCreate () {
      if ((this.ifShowUnit && !this.unit) || (!this.ifShowUnit && (!this.lowerLevel || !this.upperLevel))) {
        return true
      } else if (this.checkLevel() || this.checkUnit()) {
        return true
      } else {
        return false
      }
    },
    editingForm () {
      return [this.date, this.time, this.type, this.unit, this.lowerLevel, this.upperLevel, this.isVIP]
    },
    // filter
    filters () {
      return [
        {
          name: 'VIP',
          key: 'isVIP',
          options: ['Yes', 'No']
        }, {
          name: 'Course Type',
          key: 'type',
          options: this.typeOptions
        }]
    }
  },
  watch: {
    editingForm: {
      // 编辑时有三种状态：
      // old初始值，new已有值(打开时)-->不激活save；old已有值，new修改值-->激活save；old修改值，new已有值-->不激活save
      handler (newValue, oldValue) {
        // 两者不能直接用 == 比较，因为 this.数据中有个 observer (不可迭代)
        let oldIfOrigin = this.ifSameArray(oldValue, this.origin) // origin 结果为 true，是初始值
        console.log(oldIfOrigin)
        if (oldIfOrigin) { // 打开表格的瞬间执行
          this.editing = newValue // 已有值
        }
        console.log(this.editing)
        console.log(newValue)

        let newIfExisted = this.ifSameArray(newValue, this.editing)
        console.log(newIfExisted)
        if (!oldIfOrigin && !newIfExisted) { // old不是初始值且new不是已有值
          this.disabledSave = this.disabledCreate // 如果通过了检查，则为 false，激活 save
          this.changedObj = this.diff(this.editing, newValue)
        } else {
          this.disabledSave = true
        }
      }
    }
  },
  mounted () {
    this.queryCourses()
  },
  methods: {
    // common
    emptySelected () {
      // before creating; after removing
      this.checkedCourses = [] // 本页面
      this.$refs.table.empty() // 子组件
    },
    ifSameArray (arr1, arr2) {
      return arr1.every((item1, index1) => { // 有一个不符合就返回 false
        return item1 === arr2[index1]
      })
    },
    diff (editing, edited) {
      let keys = this.formKey
      let obj = {}
      edited.forEach((item, index) => {
        if (item !== editing[index]) {
          let key = keys[index]
          obj[key] = item
        }
      })
      return obj
    },
    // form --> create
    openForm () {
      this.ifShowForm = true
      this.ifNewForm = true
    },
    closeForm () {
      this.ifShowForm = false
      this.resetForm()
      this.emptySelected()
    },
    resetForm () {
      this.date = 'Sun Jul 15 2018' // test
      this.time = 11
      this.type = 'FTClass'
      this.unit = ''
      this.lowerLevel = ''
      this.upperLevel = ''
      this.isVIP = false
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
    createCourse () {
      this.emptySelected()
      // prepare data for backend
      let time = new Date(`${this.date}, ${this.time}:00`)
      let unit
      let lowerLevel
      let upperLevel
      if (this.type === 'FTClass') {
        unit = this.unit
        lowerLevel = 0
        upperLevel = 0
      } else {
        unit = 0
        lowerLevel = this.lowerLevel
        upperLevel = this.upperLevel
      }
      // prepare data for frontend
      let displayCourse = {
        date: this.date,
        time: `${this.time}:00`,
        type: this.type,
        description: (this.type === 'FTClass') ? `Unit ${this.unit}` : `L${this.lowerLevel} - L${this.upperLevel}`,
        isVIP: this.vipStr
      }
      // backend
      let AV = this.$AV
      let Courses = AV.Object.extend('Courses')
      let course = new Courses()
      course.set('time', time)
      course.set('type', this.type)
      course.set('unit', unit)
      course.set('lowerLevel', lowerLevel)
      course.set('upperLevel', upperLevel)
      course.set('isVIP', this.isVIP)
      course.save()
        .then((course) => {
          // frontend
          this.ifShowForm = false
          displayCourse.id = course.id // id 是存储成功后生成的
          console.log('id is ' + displayCourse.id)
          this.operationMsg('create')
          this.courses.unshift(displayCourse)
          this.resetForm()
        })
        .catch(console.error())
    },
    // form --> edit
    editForm () {
      if (this.checkedCourses.length !== 1) {
        alert('Please select one item to edit')
      } else {
        this.ifNewForm = false
        let index = this.checkedCourses[0].index
        let obj = this.courses[index] // 前端展示的
        // console.log(obj)
        this.setFormContent(obj)
      }
    },
    setFormContent (obj) {
      this.ifShowForm = true
      // 转换为表单的数据格式
      this.date = obj.date
      this.time = Number.parseInt(obj.time)
      this.type = obj.type
      if (obj.type === 'FTClass') {
        this.unit = this.getNum(obj.description)
      } else {
        this.lowerLevel = this.levelNum(obj.description)[0]
        this.upperLevel = this.levelNum(obj.description)[1]
      }
      this.isVIP = (obj.isVIP === 'Yes')
    },
    getNum (string) {
      return Number.parseInt(string.match(/\d/g).join(''))
    },
    levelNum (string) {
      let arr = string.split(' - ')
      // map 和 forEach 都拿不到 this？？
      arr[0] = this.getNum(arr[0])
      arr[1] = this.getNum(arr[1])
      console.log(arr)
      return arr
    },
    updateCourse () {
      console.log(this.changedObj)
      let newObj = this.changedObj // 包含改动项目和新值的对象

      let editingCourse = this.checkedCourses[0]
      let index = editingCourse.index // 用于修改前端数据
      let id = editingCourse.id // 用于修改后端数据
      let obj = this.courses[index]

      let AV = this.$AV
      var course = AV.Object.createWithoutData('Courses', id)

      for (let key in newObj) {
        if (obj.hasOwnProperty(key)) {
          console.log(key)
          // frontend: date, time, type, description, isVIP
          // backend: time, type, isVIP
          switch (key) {
            case 'date':
              obj.date = newObj.date
              if (!newObj.time) {
                // console.log(newObj.date, obj.time)
                course.set('time', new Date(`${newObj.date}, ${obj.time}:00`))
              }
              break
            case 'time':
              obj.time = `${newObj.time}:00`
              let date = (newObj.date) ? newObj.date : obj.date
              // console.log(date, newObj.time)
              course.set('time', new Date(`${date}, ${newObj.time}:00`))
              break
            case 'type':
              obj.type = newObj.type
              course.set('type', newObj.type)
              // backend: unit, lowerLevel, upperLevel 直接设置，不经过循环
              if (newObj.type === 'FTClass') {
                obj.description = `Unit ${newObj.unit}`
                course.set('unit', newObj.unit)
                course.set('lowerLevel', 0)
                course.set('upperLevel', 0)
              } else {
                obj.description = `L${newObj.lowerLevel} - L${newObj.upperLevel}`
                course.set('unit', 0)
                course.set('lowerLevel', newObj.lowerLevel)
                course.set('upperLevel', newObj.upperLevel)
              }
              break
            case 'isVIP':
              obj.isVIP = (newObj.isVIP) ? 'Yes' : 'No'
              course.set('isVIP', newObj.isVIP)
              break
            default:
              break
          }
        }
      }
      console.log(obj)

      course.save()
        .then((course) => {
          console.log('updated id = ' + course.id)
          // frontend
          this.ifShowForm = false
          this.courses[index] = obj // 前端展示
          this.operationMsg('save')
          this.emptySelected()
          this.resetForm()
        })
    },
    // table
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
            newCourse.description = (course.type === 'FTClass') ? `Unit ${course.unit}` : `L${course.lowerLevel} - L${course.upperLevel}` // add
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
    refresh () {
      this.queryCourses()
    },
    // filter
    filterCourses (conditionArr) {
      if (!conditionArr.length) {
        alert("You haven't chosen any filters.")
      } else {
        this.tempCourses = this.courses
        let key
        let value
        for (let item of conditionArr) {
        // conditionArr.forEach(function (item) { // cannot get 'this'
          key = item.key
          value = item.value
          this.courses = this.courses.filter(function (targetObj) {
            // typeof key === 'string'
            return targetObj[key] === value
          })
        }
        let count = this.courses.length
        if (count) {
          let plural = (count === 1) ? 'result' : 'results'
          this.filterMsg = `${count} ${plural}`
        } else {
          this.filterMsg = 'No results'
        }
      }
    },
    cancelFilter () {
      this.$refs.filter.empty() // 子组件
      this.selectedFilter = []
      this.filterMsg = ''
      this.courses = this.tempCourses
      this.tempCourses = []
    },
    // common
    operationMsg (string, number) {
      switch (string) {
        case 'create': // 异步操作后，没有后续
          this.resultMsg = 'Created Successfully!'
          setTimeout(() => {
            this.resultMsg = ''
          }, 1000)
          break
        case 'select': // 点击操作时，有后续操作
          let len = this.checkedCourses.length
          if (len) {
            let plural = (len === 1) ? 'item' : 'items'
            return `Selected ${len} ${plural}`
          }
          break
        case 'refresh': // 异步操作后，没有后续
          this.resultMsg = `Refreshed Successfully!`
          setTimeout(() => {
            this.resultMsg = ''
          }, 1000)
          break
        case 'save': // 异步操作后，没有后续
          this.resultMsg = `The change has been saved`
          setTimeout(() => {
            this.resultMsg = ''
          }, 1000)
          break
        case 'remove': // 异步操作后，没有后续
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
  .form-section {
    width: 40%;
    min-width: 400px;
    max-width: 500px;
  }

  #course-form {
    margin: 15px 10px;
  }

  .filter-section {
    width: 80%;
  }

  .radio-label {
    margin-right: 10px;
  }

  .filter-footer {
    border-radius: 0 0 5px 5px ;
    border-top: none;
    align-items: center;
  }

  .table-section {
    width: 80%;
  }
</style>
