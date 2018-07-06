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
            <input class="short-input" maxlength="2" v-model="startTime"> : 00
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Course Type</label>
          <div class="form-content">
            <select class="form-select" v-model="type">
              <!-- <option disabled value="">choose</option> -->
              <option value="FTClass">FTClass</option>
              <option value="Extend">Extend</option>
              <option value="GroupChat">GroupChat</option>
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
              <input class="short-input" maxlength="2" v-model="lowerLevel"> -
              <input class="short-input" maxlength="2" v-model="upperLevel">
            </template>
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

    <section class="button-section">
      <button class="primary-button small-button">Edit</button>
      <button class="danger-button small-button" v-on:click="confirmRemove">Remove</button>
    </section>

    <div>{{checkedCourses}}</div>

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
      startTime: '',
      type: 'FTClass',
      unit: '',
      lowerLevel: '',
      upperLevel: '',
      isVIP: '0',
      // for table component
      colTitles: ['Date', 'Time', 'Course Type', 'Description', 'VIP'],
      courses: [],
      // from table component to manipulate
      checkedCourses: []
    }
  },
  computed: {
    ifShowUnit () {
      return this.type === 'FTClass'
    }
  },
  mounted () {
    this.queryCourses()
  },
  methods: {
    createCourse () {
      this.checkedCourses = [] // 清空上次未完成的操作
      // prepare data for backend
      let time = new Date(`${this.date}, ${this.startTime}:00`)
      let description = (this.type === 'FTClass') ? `Unit ${this.unit}` : `L${this.lowerLevel}-L${this.upperLevel}`
      let isVIP = Boolean(Number(this.isVIP))
      // prepare data for frontend
      let vipStr = isVIP ? 'Yes' : 'No'
      let displayCourse = {
        date: this.date,
        time: `${this.startTime}:00`,
        type: this.type,
        description: description,
        vip: vipStr
      }
      // backend
      let AV = this.$AV
      let Courses = AV.Object.extend('Courses')
      let course = new Courses()
      course.set('time', time)
      course.set('type', this.type)
      course.set('description', description)
      course.set('isVIP', isVIP)
      course.save()
        .then((course) => {
          // frontend
          displayCourse.id = course.id // id 是存储成功后生成的
          console.log('id is ' + displayCourse.id)
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
      let len = targetArr.length
      if (len === 0) {
        alert("You haven't chosen any data.")
      } else {
        // remove multiple objects
        let removeArrFront = []
        let removeArrBack = []
        for (let targetObj of targetArr) {
          // frontend
          removeArrFront.push(targetObj.index)
          // backend
          let removeObjBack = AV.Object.createWithoutData('Courses', targetObj.id)
          removeArrBack.push(removeObjBack)
        }
        console.log(removeArrBack)
        AV.Object.destroyAll(removeArrBack).then(() => {
          console.log('removed')
          // 后端执行成功后再操作前端
          removeArrFront.forEach(item => {
            currentArr.splice(item, 1)
          })
          this.checkedCourses = [] // 清空已操作的对象
          this.$refs.table.empty() // 清空子组件选中的对象
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .button-section,
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
