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
      <button class="danger-button small-button" v-on:click="removeCourse">Remove</button>
    </section>

    <section class="table-section">
      <table id="course-table">
        <thead>
          <tr>
            <th class="title-cell center-align">
              <input type="checkbox">
            </th>
            <th class="title-cell left-align" v-for="title in colTitles" v-bind:key="title">{{title}}</th>
          </tr>
        </thead>

        <tbody>
          <tr class="content-row" v-for="course in courses" v-bind:key="course.id">
            <td class="content-cell center-align">
              <input type="checkbox" v-bind:value="course" v-model="checkedCourses">
            </td>
            <td class="content-cell left-align" v-for="(value, key) in course" v-bind:key="value.id" v-if="!(key === 'id')">{{value}}</td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td class="content-cell center-align" colspan="6">Page {{currentPage}} of {{totalPage}}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Course',
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
      // table
      colTitles: ['Date', 'Time', 'Course Type', 'Description', 'VIP'],
      courses: [],
      checkedCourses: [],
      currentPage: '1',
      totalPage: '3'
    }
  },
  computed: {
    ifShowUnit () {
      return this.type === 'FTClass'
    }
  },
  created () {
    this.queryCourses()
  },
  methods: {
    createCourse () {
      // 处理数据格式
      let time = new Date(`${this.date}, ${this.startTime}:00`)
      // console.log(time)
      let description = (this.type === 'FTClass') ? `Unit ${this.unit}` : `L${this.lowerLevel}-L${this.upperLevel}`
      let isVIP = Boolean(Number(this.isVIP))
      // 页面展示
      let vipStr = isVIP ? 'Yes' : 'No'
      let displayCourse = {
        date: this.date,
        time: `${this.startTime}:00`,
        type: this.type,
        description: description,
        vip: vipStr
      }
      // 后端存储
      let AV = this.$AV
      let Courses = AV.Object.extend('Courses')
      let course = new Courses()
      course.set('time', time)
      course.set('type', this.type)
      course.set('description', description)
      course.set('isVIP', isVIP)
      course.save()
        .then((course) => {
          // 表格中数据直接展示，id 是存储成功后生成的
          displayCourse.id = course.id
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
    removeCourse () {
      // remove data in backend
      let AV = this.$AV
      let targetArr = this.checkedCourses
      let len = targetArr.length
      if (len === 0) {
        alert("You haven't chosen any data.")
      } else if (len === 1) {
        // remove single object
        let id = targetArr[0].id
        let removeObj = AV.Object.createWithoutData('Courses', id)
        removeObj.destroy().then((res) => {
          console.log('removed ' + res.id)
        }).catch(console.error())
      } else {
        // remove multiple objects
        let removeArr = []
        for (let targetObj of targetArr) {
          let removeObj = AV.Object.createWithoutData('Courses', targetObj.id)
          removeArr.push(removeObj)
        }
        console.log(removeArr)
        AV.Object.destroyAll(removeArr).then(() => {
          console.log('removed')
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

  /* 表格 */

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
