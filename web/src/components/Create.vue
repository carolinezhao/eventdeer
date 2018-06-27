<template>
  <div class="page-container">
    <div class="path">Location: ... / Courses</div>

    <section class="form">
      <!-- <div class="section-title">创建课程</div> -->
      <form>
        <div class="row">
          <label>Date</label>
          <div class="content">
            <input class="calendar">
          </div>
        </div>

        <div class="row">
          <label>Start Time</label>
          <div class="content">
            <input class="short" maxlength="2"> : 00
          </div>
        </div>

        <div class="row">
          <label>Course Type</label>
          <div class="content">
            <select id="">
              <option value="FTClass">FTClass</option>
              <option value="Extend">Extend</option>
              <option value="GroupChat">GroupChat</option>
            </select>
          </div>
        </div>

        <div class="row">
          <label>Description</label>
          <div class="content">
            <template v-if="false">
              <label>Unit</label>
              <input class="short" maxlength="2">
            </template>
            <template v-else>
              <label>Level</label>
              <input class="short" maxlength="2"> -
              <input class="short" maxlength="2">
            </template>
          </div>
        </div>

        <div class="row">
          <label>VIP</label>
          <div class="content">
            <select name="type" id="">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        <div class="row button">
          <div class="content">
            <button type="submit" class="main create">Create</button>
          </div>
        </div>
      </form>
    </section>

    <section class="button">
      <!-- <div class="section-title">已创建课程列表</div> -->
      <button class="small">Edit</button>
      <button class="danger small">Remove</button>
    </section>

    <section class="table">
      <table>
        <thead>
          <tr>
            <th class="center-align">
              <input type="checkbox">
            </th>
            <th class="left-align" v-for="title in colTitles" v-bind:key="title">{{title}}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="course in courses" v-bind:key="course.id">
            <td class="center-align">
              <input type="checkbox">
            </td>
            <td class="left-align" v-for="value in course" v-bind:key="value.id">{{value}}</td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td class="center-align" colspan="6">Page {{currentPage}} of {{totalPage}}</td>
          </tr>
        </tfoot>
      </table>
    </section>

  </div>
</template>

<script>
export default {
  name: 'Create',
  data () {
    return {
      colTitles: ['Date', 'Time', 'Type', 'Description', 'VIP'],
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
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    padding: 20px;
  }

  .path {
    background-color: #bfcbd9;
  }

  section {
    margin-top: 20px;
    overflow: hidden;
  }

  form {
    border: 1px solid #bfcbd9;
    border-radius: 5px;
    padding: 10px;
  }

  .row {
    display: table;
    width: 100%;
    height: 40px;
  }

  .row>label,
  .row>.content {
    display: table-cell;
    vertical-align: middle;
  }

  .row>label {
    width: 20%;
    text-align: right;
    padding-right: 20px;
  }

  .row.button {
    margin-top: 20px;
  }

  .row.button button {
    /* same with the width of label */
    margin-left: 20%;
  }

  select,
  input.short {
    height: 25px;
    font-size: 15px;
    text-align: center;
  }

  input.short {
    width: 32px;
    padding: 5px 5px 6px;
  }

  button.create {
    height: 30px;
    width: 100px;
  }

  /* 表格 */

  table {
    border: 1px solid #bfcbd9;
    width: 100%;
    border-collapse: collapse;
  }

  .center-align {
    text-align: center;
  }

  .left-align {
    text-align: left;
  }

  th {
    background-color: #bfcbd9;
    font-weight: normal;
    height: 40px;
  }

  td {
    font-weight: 300;
    height: 35px;
  }
</style>
