<template>
  <div>
    <section class="modal-container flex-center" v-if="ifShowForm">
      <section class="form-section flex-col">
        <div class="form-title flex-center">New Course</div>
        <form id="course-form">
          <div class="form-row">
            <label class="form-label">Date</label>
            <div class="form-content">
              <input type="text" class="lg-input" v-model="date">
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
                <div class="form-msg">{{checkUnit()}}</div>
              </template>
              <template v-else>
                <label>Level</label>
                <!-- .lazy 回车后生效：内容检查体验较好，激活按钮体验变差 -->
                <input type="text" class="short-input" maxlength="2" v-model.number="lowerLevel"> -
                <input type="text" class="short-input" maxlength="2" v-model.number="upperLevel">
                <div class="form-msg">{{checkLevel()}}</div>
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
          <button type="button" class="primary-btn small-btn" @click="closeForm">Cancel</button>
          <button type="submit" class="main-btn small-btn" v-if="ifNewForm" :disabled="ifDisabled" @click="createCourse">Create</button>
          <button type="submit" class="main-btn small-btn" v-if="!ifNewForm" :disabled="disabledSave" @click="updateCourse">Save</button>
        </div>
      </section>
    </section>

    <section class="filter-section">
      <course-filter ref="filter" :filters="filters" v-model="selectedFilter"></course-filter>
      <div class="filter-footer card flex">
        <template v-if="tempCourses.length">
          <button class="primary-btn small-btn" @click="cancelFilter">Cancel</button>
        </template>
        <template v-else>
          <button class="main-btn small-btn" @click="filterCourses(selectedFilter)">Filter</button>
        </template>
        <div class="filter-msg">{{filterMsg}}</div>
      </div>
    </section>

    <section class="operation-section">
      <button class="main-btn small-btn" @click="openForm">Create</button>
      <button class="primary-btn small-btn" @click="refresh">Refresh</button>
      <button class="primary-btn small-btn"  @click="editForm">Edit</button>
      <button class="danger-btn small-btn" @click="confirmRemove">Remove</button>
      <div class="select-msg">{{selectMsg}}</div>
      <!-- for debug -->
      <!-- <div>test: {{checkedCourses}}</div> -->
    </section>

    <section class="table-section">
      <course-table ref="table" :colTitles="colTitles" :objsArray="courses" :colKeys="colKeys" :keyLimit="colKeys.length" :ifArchive="false" v-model="checkedCourses"></course-table>
      <!-- <div>Courses since today (00:00)</div> -->
    </section>

    <course-dialog :dialog="dialogMsg" :isAlert="isAlert" @confirm="execute" @close="closeAlert"></course-dialog>

    <course-message :message="resultMsg" :ifShowMsg="ifShowMsg"></course-message>
  </div>
</template>

<script>
import {displayTime, displayDate, formatTime, continuousNum, checkNumber, ifSameArray, diff, operationMsg} from '@/utils/util'
import Table from '@/components/Table'
import Filter from '@/components/Filter'
import Dialog from '@/components/Dialog'
import Message from '@/components/Message'
export default {
  name: 'course',
  components: {
    courseTable: Table,
    courseFilter: Filter,
    courseDialog: Dialog,
    courseMessage: Message
  },
  data () {
    return {
      // form content
      date: 'Wed Aug 1 2018', // test
      time: 11,
      type: 'FTClass',
      typeOptions: ['FTClass', 'Extend', 'GroupChat'],
      unit: '', // num
      lowerLevel: '', // num
      upperLevel: '', // num
      isVIP: false,
      // form editing
      formKey: ['date', 'time', 'type', 'unit', 'lowerLevel', 'upperLevel', 'description', 'isVIP'],
      origin: ['Wed Aug 1 2018', 11, 'FTClass', '', '', '', 'Unit ', false], // 初始值，用于在编辑状态下比较
      editing: [], // 打开编辑框时的值
      changedObj: {}, // 更改的 key-value
      // form status
      ifShowForm: false,
      ifNewForm: true,
      disabledSave: true,
      // table component
      colTitles: ['Date', 'Time', 'Course Type', 'Description', 'VIP'],
      colKeys: ['date', 'time', 'type', 'description', 'isVIP'],
      courses: [],
      // from table component to manipulate
      checkedCourses: [],
      // msg component
      resultMsg: '',
      ifShowMsg: false,
      // dialog component
      dialogMsg: '',
      isAlert: false,
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
    // form status
    ifDisabled () {
      if ((this.ifShowUnit && !this.unit) || (!this.ifShowUnit && (!this.lowerLevel || !this.upperLevel))) {
        return true
      } else if (this.checkLevel() || this.checkUnit()) {
        return true
      } else {
        return false
      }
    },
    editingForm () {
      return [this.date, this.time, this.type, this.unit, this.lowerLevel, this.upperLevel, this.description, this.isVIP]
    }, // form items and a combined property(description)
    description () {
      return (this.type === 'FTClass') ? `Unit ${this.unit}` : `L${this.lowerLevel} - L${this.upperLevel}`
    },
    // table select
    selectMsg () {
      let len = this.checkedCourses.length
      if (len) {
        let plural = (len === 1) ? 'item' : 'items'
        return `Selected ${len} ${plural}`
      }
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
    resultMsg (newValue) {
      if (newValue) {
        this.ifShowMsg = true
        setTimeout(() => {
          this.ifShowMsg = false
        }, 2000)
      }
    },
    editingForm: {
      handler (newValue, oldValue) {
        // 编辑时有三种状态：
        // old初始值，new已有值(打开时)-->不激活save；old已有值，new修改值-->激活save；old修改值，new已有值-->不激活save
        if (!this.ifNewForm) {
          // 两者不能直接用 == 比较，因为 this.数据中有个 observer (不可迭代)
          let oldIfOrigin = ifSameArray(oldValue, this.origin) // origin 结果为 true，是初始值
          if (oldIfOrigin) { // 打开表格的瞬间执行
            this.editing = newValue // 记录已有值
          }
          // console.log(newValue)

          let newIfExisted = ifSameArray(newValue, this.editing)
          if (!oldIfOrigin && !newIfExisted) { // old不是初始值且new不是已有值
            this.disabledSave = this.ifDisabled // 如果通过了检查，则为 false，激活 save
            this.changedObj = diff(this.formKey, this.editing, newValue)
            // console.log(this.changedObj)
          } else {
            this.disabledSave = true
          }
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
    // for 'ifDisabled'
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
    resetForm () { // <-- create / edit / cancel
      this.date = 'Wed Aug 1 2018' // test
      this.time = 11
      this.type = 'FTClass'
      this.unit = ''
      this.lowerLevel = ''
      this.upperLevel = ''
      this.isVIP = false
    },
    createCourse () {
      this.emptySelected()
      let displayCourse = this.formToTable() // data for table
      let saveCourse = this.formToBackend() // data for backend
      // console.log(saveCourse)
      // backend
      let AV = this.$AV
      let Courses = AV.Object.extend('Courses')
      let course = new Courses()
      for (let key in saveCourse) {
        course.set(key, saveCourse[key])
      }
      course.save()
        .then((course) => {
          // frontend
          this.ifShowForm = false
          displayCourse.id = course.id // id 是存储成功后生成的
          // console.log('id is ' + displayCourse.id)
          this.resultMsg = operationMsg('create')
          this.courses.unshift(displayCourse)
          this.resetForm()
        })
        .catch((res) => {
          this.resultMsg = operationMsg('fail')
          console.log(res)
          console.error()
        })
    },
    formToTable () {
      // 根据 colKeys 的顺序排列属性
      return {
        date: this.date,
        time: `${this.time}:00`,
        type: this.type,
        description: (this.type === 'FTClass') ? `Unit ${this.unit}` : `L${this.lowerLevel} - L${this.upperLevel}`,
        isVIP: this.isVIP ? 'Yes' : 'No'
      }
    },
    formToBackend () {
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
      return {
        time: new Date(`${this.date}, ${this.time}:00`),
        type: this.type,
        unit: unit,
        lowerLevel: lowerLevel,
        upperLevel: upperLevel,
        isVIP: this.isVIP
      }
    },
    // form --> edit
    editForm () {
      if (this.checkedCourses.length !== 1) {
        this.alert('Please select one item to edit.')
      } else {
        this.ifShowForm = true
        this.ifNewForm = false
        let index = this.checkedCourses[0].index
        let tableObj = this.courses[index]
        this.tableToForm(tableObj)
      }
    },
    tableToForm (obj) {
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
      // possible case: 'Unit 30'
      return Number.parseInt(string.match(/\d+/))
    },
    levelNum (string) {
      // possible case: 'L1 - L10'
      let arr = string.match(/^.(\d{1,2}).+ .(\d{1,2})/)
      return [Number.parseInt(arr[1]), Number.parseInt(arr[2])]
    },
    updateCourse () {
      let courseInfo = this.checkedCourses[0]
      let id = courseInfo.id // for backend data
      let index = courseInfo.index // for table data
      let tableObj = this.courses[index]

      let AV = this.$AV
      let course = AV.Object.createWithoutData('Courses', id)

      // params：包含改动项目的obj，表格中需要改动的obj，后端存储的obj
      this.updateEditedItems(this.changedObj, tableObj, course)
      // console.log(tableObj)

      course.save()
        .then((course) => {
          // console.log('updated id = ' + course.id)
          // frontend
          this.ifShowForm = false
          this.courses[index] = tableObj
          this.resultMsg = operationMsg('save')
          this.emptySelected()
          this.resetForm()
        }).catch(() => {
          this.resultMsg = operationMsg('fail')
          console.error()
        })
    },
    updateEditedItems (changedObj, tableObj, backObj) {
      for (let key in changedObj) {
        if (!tableObj.hasOwnProperty(key)) { // unit, lowerLevel, upperLevel
          console.log(key)
          backObj.set(key, changedObj[key])
        } else { // date, time, type, description, isVIP
          // console.log(key)
          switch (key) {
            case 'date':
              tableObj.date = changedObj.date
              if (!changedObj.time) {
                // console.log(changedObj.date, obj.time)
                backObj.set('time', new Date(`${changedObj.date}, ${tableObj.time}:00`))
              }
              break
            case 'time':
              tableObj.time = `${changedObj.time}:00`
              let date = (changedObj.date) ? changedObj.date : tableObj.date
              // console.log(date, changedObj.time)
              backObj.set('time', new Date(`${date}, ${changedObj.time}:00`))
              break
            case 'type':
              tableObj.type = changedObj.type
              backObj.set('type', changedObj.type)
              // type 变化一定会带动 unit / lowerLevel & upperLevel 变，反之不成立
              if (changedObj.type === 'FTClass') {
                backObj.set('lowerLevel', 0)
                backObj.set('upperLevel', 0)
              } else {
                backObj.set('unit', 0)
              }
              break
            case 'description': // only for table
              tableObj.description = changedObj.description
              break
            case 'isVIP':
              tableObj.isVIP = (changedObj.isVIP) ? 'Yes' : 'No'
              backObj.set('isVIP', changedObj.isVIP)
              break
            default:
              break
          }
        }
      }
    },
    // table --> get
    refresh () {
      this.queryCourses()
    },
    queryCourses () { // <-- mounted / refresh
      // console.log('queryCourses starts')
      let AV = this.$AV
      let queryCourses = new AV.Query('Courses')
      // for production
      queryCourses.greaterThanOrEqualTo('time', formatTime('today'))
      queryCourses.descending('time')
        .find()
        .then(courses => {
          // console.log(courses)
          // console.log(this.backendToTable(courses))
          this.courses = this.backendToTable(courses)
        })
        .catch(console.error())
    },
    backendToTable (objsArray) {
      return objsArray.map(item => {
        // attributes 中是自定义属性
        let course = item.attributes
        // 根据 colKeys 的顺序排列属性
        return {
          date: displayDate(course.time),
          time: displayTime(course.time),
          type: course.type,
          description: (course.type === 'FTClass') ? `Unit ${course.unit}` : `L${course.lowerLevel} - L${course.upperLevel}`,
          isVIP: course.isVIP ? 'Yes' : 'No',
          id: item.id // 存储对象时自动分配的 id
        }
      })
    },
    // table --> remove
    confirmRemove () {
      if (!this.checkedCourses.length) {
        this.alert("You haven't chosen any data.")
      } else {
        this.dialogMsg = 'Are you sure you want to remove checked data?'
        this.$dialog.confirm({})
          .then((value) => {
            console.log(value)
            this.dialogMsg = ''
            this.removeCourses(this.courses, this.checkedCourses, 'Courses')
          }).catch((value) => {
            console.log(value)
          })
      }
    },
    execute () {
      // promise resolve() main.js
      this.$dialog.util.promiseResolver()
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
        this.resultMsg = operationMsg('remove', targetArr.length)
        this.emptySelected()
      }).catch(() => {
        this.resultMsg = operationMsg('fail')
        console.error()
      })
    },
    // filter
    filterCourses (conditionArr) {
      if (!conditionArr.length) {
        this.alert("You haven't chosen any filters.")
      } else {
        this.tempCourses = this.courses
        let key
        let value
        // for (let item of conditionArr) { // work
        conditionArr.forEach(item => { // function cannot get outer 'this'
          key = item.key
          value = item.value
          this.courses = this.courses.filter(function (targetObj) {
            // typeof key === 'string'
            return targetObj[key] === value
          })
        })
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
    // dialog (alert)
    alert (msg) {
      this.dialogMsg = msg
      this.isAlert = true
    },
    closeAlert () {
      this.dialogMsg = ''
      this.isAlert = false
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
    width: 60%;
    min-width: 550px;
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
    width: 60%;
    min-width: 550px;
    margin-top: 10px;
    overflow: hidden;
  }
</style>
