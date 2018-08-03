<template>
  <div>
    <section class="course-section">
      <div class="section-title">Regular Course (before today)</div>
      <course-table :colTitles="colTitles" :objsArray="courses" :colKeys="colKeys" :keyLimit="colKeys.length" :ifArchive="true"></course-table>
    </section>
    <section class="event-section">
      <div class="section-title">Special Event (before today)</div>
      <event-table :colTitles="eventColTitles" :objsArray="events" :colKeys="eventColKeys" :keyLimit="7" :ifArchive="true"></event-table>
    </section>
  </div>
</template>

<script>
import {displayTime, displayDate, formatTime} from '@/utils/util'
import Table from '@/components/Table'
export default {
  components: {
    courseTable: Table,
    eventTable: Table
  },
  data () {
    return {
      // course
      colTitles: ['Date', 'Time', 'Course Type', 'Description', 'VIP'],
      colKeys: ['date', 'time', 'type', 'description', 'isVIP'],
      courses: [],
      // event
      eventColTitles: ['Date', 'Time', 'Title', 'VIP', 'Level', 'Teacher', 'Location'], // 暂不显示 Detail
      eventColKeys: ['date', 'time', 'title', 'vip', 'level', 'teacher', 'location', 'ifDiscover', 'intro', 'imgUrl', 'detail'],
      events: []
    }
  },
  mounted () {
    this.queryCourses()
    this.queryEvents()
  },
  methods: {
    queryCourses () {
      let AV = this.$AV
      let queryCourses = new AV.Query('Courses')
      queryCourses.lessThan('time', formatTime('today'))
      queryCourses.descending('time')
        .find()
        .then(courses => {
          this.courses = this.backendToTableCourse(courses)
        })
        .catch(console.error())
    },
    backendToTableCourse (objsArray) {
      return objsArray.map(item => {
        let course = item.attributes
        return {
          date: displayDate(course.time),
          time: displayTime(course.time),
          type: course.type,
          description: (course.type === 'FTClass') ? `Unit ${course.unit}` : `L${course.lowerLevel} - L${course.upperLevel}`,
          isVIP: course.isVIP ? 'Yes' : 'No',
          id: item.id
        }
      })
    },
    queryEvents () {
      let AV = this.$AV
      let queryEvents = new AV.Query('Events')
      queryEvents.lessThan('startTime', formatTime('today'))
      queryEvents.descending('startTime')
        .find()
        .then(events => {
          this.events = this.backendToTableEvent(events)
        })
        .catch(console.error())
    },
    backendToTableEvent (objsArray) {
      return objsArray.map(item => {
        let backObj = item.attributes
        backObj.date = displayDate(backObj.startTime)
        backObj.time = `${displayTime(backObj.startTime)} - ${displayTime(backObj.endTime)}`
        backObj.vip = backObj.isVIP ? 'Yes' : 'No'
        backObj.detail = false // 暂不显示
        let tableObj = {
          id: item.id
        }
        this.eventColKeys.forEach((key) => {
          tableObj[key] = backObj[key]
        })
        return tableObj
      })
    }
  }
}
</script>

<style scoped>
  .section-title {
    margin-bottom: 10px;
    font-size: 20px;
  }

  .course-section {
    width: 60%;
    min-width: 550px;
    overflow: hidden;
  }

  .event-section {
    margin-top: 40px;
    width: 85%;
    min-width: 650px;
    overflow: hidden;
  }
</style>
