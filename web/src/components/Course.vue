<template>
  <div>
    <section class="form-section flex-col">
      <div class="section-title flex-center">New Course</div>
      <form id="course-form">
        <div class="form-row">
          <label class="form-label">Date</label>
          <div class="form-content">
            <input class="lg-input" v-model="date">
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Start Time</label>
          <div class="form-content">
            <select class="form-select" v-model="selectedTime">
              <option v-for="timeOption in timeOptions" :key="timeOption.id" :value="timeOption">{{timeOption}}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Course Type</label>
          <div class="form-content">
            <select class="form-select" v-model="selectedType">
              <option v-for="typeOption in typeOptions" :key="typeOption.id" :value="typeOption">{{typeOption}}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Description</label>
          <div class="form-content">
            <template v-if="ifShowUnit">
              <label>Unit</label>
              <input class="short-input" maxlength="2" v-model="unit">
            </template>
            <template v-else>
              <label>Level</label>
              <input class="short-input" maxlength="2" v-model.number="lowerLevel"> -
              <input class="short-input" maxlength="2" v-model.number="upperLevel">
            </template>
            <div class="err-msg">{{checkLevel}}</div>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">VIP</label>
          <div class="form-content">
            <select class="form-select" v-model="isVIP">
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>

        <div class="form-row button">
          <div class="form-content">
            <button type="submit" class="main-button create-button" v-on:click="createCourse">Create</button>
          </div>
        </div>
      </form>
    </section>

    <section class="operation-section">
      <button class="primary-button small-button">Edit</button>
      <button class="danger-button small-button" v-on:click="confirmRemove">Remove</button>
      <div class="operation-msg">{{operationMsg('select')}}</div>
      <div class="operation-msg">{{resultMsg}}</div>
      <!-- for debug -->
      <div class="operation-msg">test: {{checkedCourses}}</div>
    </section>

    <section class="table-section">
      <course-table ref="table" :colTitles="colTitles" :objsArray="courses" v-model="checkedCourses"></course-table>
    </section>
  </div>
</template>

<script>
import Table from '@/components/Table'
export default {
  name: 'course',
  components: {
    courseTable: Table
  },
  data () {
    return {
      // form
      date: '',
      selectedTime: '12:00',
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
      resultMsg: ''
    }
  },
  computed: {
    timeOptions () {
      let optionArr = []
      let option = 12
      while (option <= 20) {
        optionArr.push(`${option}:00`)
        option++
      }
      return optionArr
    },
    ifShowUnit () {
      return this.selectedType === 'FTClass'
    },
    checkLevel () {
      if (this.upperLevel && (this.lowerLevel > this.upperLevel)) {
        return 'Please enter lower level first'
      }
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
    createCourse () {
      this.emptySelected()
      // prepare data for backend
      let time = new Date(`${this.date}, ${this.selectedTime}`)
      let description = (this.selectedType === 'FTClass') ? `Unit ${this.unit}` : `L${this.lowerLevel}-L${this.upperLevel}`
      let isVIP = Boolean(Number(this.isVIP))
      // prepare data for frontend
      let vipStr = isVIP ? 'Yes' : 'No'
      let displayCourse = {
        date: this.date,
        time: this.selectedTime,
        type: this.selectedType,
        description: description,
        vip: vipStr
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
      console.log('queryCourses starts')
      let AV = this.$AV
      let queryCourses = new AV.Query('Courses')
      queryCourses.descending('time')
        .find()
        .then(courses => {
          console.log(courses)
          let newCourses = courses.map(item => {
            // attributes 中是自定义属性
            let course = item.attributes
            let newCourse = {}
            // match the order of colTitle
            newCourse.date = this.displayDate(course.time) // add
            newCourse.time = this.displayTime(course.time) // revise
            newCourse.type = course.type
            newCourse.description = course.description
            newCourse.isVIP = course.isVIP ? 'Yes' : 'No' // revise
            newCourse.id = item.id // 存储对象时自动分配的 id
            return newCourse
          })
          console.log(newCourses)
          this.courses = newCourses
        })
        .catch(console.error())
    },
    confirmRemove () {
      let result = window.confirm('Are you sure you want to remove checked data?')
      if (result) {
        this.removeCourses()
      }
    },
    removeCourses () {
      let AV = this.$AV
      let currentArr = this.courses
      // data to be removed
      let targetArr = this.checkedCourses
      let count = targetArr.length
      if (count === 0) {
        alert("You haven't chosen any data.")
      } else {
        let removeArrFront = []
        let removeArrBack = []
        for (let targetObj of targetArr) {
          // frontend
          removeArrFront.push(targetObj.index)
          // backend
          let removeObjBack = AV.Object.createWithoutData('Courses', targetObj.id)
          removeArrBack.push(removeObjBack)
        }
        // remove multiple objects
        AV.Object.destroyAll(removeArrBack).then(() => {
          // 后端执行成功后再操作前端
          removeArrFront.forEach(item => {
            currentArr.splice(item, 1)
          })
          this.operationMsg('remove', count)
          this.emptySelected()
        }).catch(console.error())
      }
    },
    displayTime (timeObj, duration) {
      let hour = timeObj.getHours()
      let time
      if (duration === undefined) {
        time = `${hour}:00`
      } else {
        time = `${hour}:00-${hour + duration}:00`
      }
      return time
    },
    displayDate (timeObj) {
      let date = timeObj.toDateString()
      return date
    },
    operationMsg (string, number) {
      switch (string) {
        case 'create':
          this.resultMsg = 'Successfully created!'
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
  .table-section {
    margin-top: 20px;
    overflow: hidden;
  }

  .section-title {
    border-bottom: 1px solid #bfcbd9;
    padding: 10px 0;
    font-weight: 500;
  }

  /* 表单 */

  .form-section {
    width: 40%;
    border: 1px solid #bfcbd9;
    border-radius: 5px;
    overflow: hidden;
  }

  #course-form {
    margin: 10px;
  }

  .form-row {
    display: table;
    width: 100%;
    height: 40px;
  }

  .form-label,
  .form-content {
    display: table-cell;
    vertical-align: middle;
  }

  .form-label {
    width: 40%;
    text-align: right;
    padding-right: 20px;
  }

  .form-row.button {
    margin-top: 20px;
  }

  .create-button {
    margin-left: 40%; /* same with the width of label */
    height: 30px;
    width: 100px;
    font-size: 16px;
  }

  .small-button {
    font-size: 14px;
    width: 70px;
    padding: 5px 0;
    margin-right: 10px;
  }

  .lg-input {
    width: 150px;
    padding: 5px 5px 6px;
  }

  .short-input {
    text-align: center;
    width: 32px;
    padding: 5px 5px 6px;
  }
</style>
