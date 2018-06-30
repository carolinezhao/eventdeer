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
      <button class="danger-button small-button">Remove</button>
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
              <input type="checkbox">
            </td>
            <td class="content-cell left-align" v-for="value in course" v-bind:key="value.id">{{value}}</td>
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
      // fake data
      courses: [
        {
          date: 'Wed Jun 27',
          time: '15:00',
          type: 'FTClass',
          description: 'Unit 60',
          isVIP: true},
        {
          date: 'Thu Jun 28',
          time: '19:00',
          type: 'FTClass',
          description: 'Unit 30',
          isVIP: false
        }
      ],
      currentPage: '1',
      totalPage: '3'
    }
  },
  computed: {
    ifShowUnit () {
      return this.type === 'FTClass'
    }
  },
  methods: {
    createCourse () {
      // 处理数据格式
      let time = new Date(`${this.date}, ${this.startTime}:00`)
      console.log(time)
      let description = (`Unit ${this.unit}` && this.unit) || `L${this.lowerLevel}-L${this.upperLevel}`
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
          console.log('objectId is ' + course.id)
          this.courses.unshift(displayCourse)
        })
        .catch(console.error())
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
