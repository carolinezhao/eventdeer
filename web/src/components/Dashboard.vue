<template>
  <div>
    <div class="page-title">{{date}}</div>
    <section class="info-section card flex">
      <div class="info" v-for="(value, key) in info" :key="key.id">
        <div class="info-key">{{key}}</div>
        <div class="info-value">{{value}}</div>
      </div>
    </section>

    <section class="card-section flex">
      <div class="calendar-container">
        <datepicker :value="new Date()" :inline="true" calendar-class="calendar"></datepicker>
        <!-- <div class="calendar-tip">Click on a date to preview the schedule.</div> -->
      </div>
      <router-link class="nav-entry card" v-for="nav of navs" :to="{name: nav.name}" :key="nav.id">
        <div class="nav-title flex-center">{{nav.title}}</div>
        <div class="nav-content" v-for="obj of nav.schedule" :key="obj.id">
          <span class="time">{{obj.time}}</span>
          <span v-if="nav.name === 'course'">
            <span class="type">{{obj.type}}</span>
            <span>{{obj.description}}</span>
          </span>
          <span v-if="nav.name === 'event'">{{obj.title}}</span>
          <span class="vip" v-if="obj.isVIP">{{obj.isVIP}}</span>
        </div>
      </router-link>
    </section>
  </div>
</template>

<script>
import {displayTime, formatTime} from '@/utils/util'
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'dashboard',
  components: {
    Datepicker
  },
  data () {
    return {
      info: {
        username: '',
        role: ''
      },
      navs: [{
        name: 'course',
        title: 'Regular Course',
        schedule: ''
      }, {
        name: 'event',
        title: 'Special Event',
        schedule: ''
      }]
    }
  },
  computed: {
    date () {
      return (new Date()).toDateString()
    }
  },
  mounted () {
    this.queryUser()
    // this.queryCount()
    this.queryCourses('today', 'tomorrow')
    this.queryEvents('today', 'tomorrow')
  },
  methods: {
    queryUser () {
      let AV = this.$AV
      let currentUser = AV.User.current().attributes
      this.info.username = currentUser.username
      this.info.role = (currentUser.isAdmin) ? 'admin' : 'visitor'
    },
    queryCount () {
      let AV = this.$AV
      let query = new AV.Query('_User')
      query.equalTo('isAdmin', false)
      query.count().then(count => {
        console.log(count)
        this.count = count
      }).catch(console.error())
    },
    queryCourses (start, end) {
      let AV = this.$AV
      let queryCourses = new AV.Query('Courses')
      queryCourses.greaterThanOrEqualTo('time', formatTime(start))
      queryCourses.lessThan('time', formatTime(end))
      queryCourses.ascending('time')
        .find()
        .then(courses => {
          this.navs[0].schedule = this.backendToTableCourse(courses)
        })
        .catch(console.error())
    },
    backendToTableCourse (objsArray) {
      return objsArray.map(item => {
        let course = item.attributes
        return {
          time: displayTime(course.time),
          type: course.type,
          description: (course.type === 'FTClass') ? `Unit ${course.unit}` : `L${course.lowerLevel} - L${course.upperLevel}`,
          isVIP: course.isVIP ? 'VIP' : ''
        }
      })
    },
    queryEvents (start, end) {
      let AV = this.$AV
      let queryEvents = new AV.Query('Events')
      queryEvents.greaterThanOrEqualTo('startTime', formatTime(start))
      queryEvents.lessThan('startTime', formatTime(end))
      queryEvents.ascending('startTime')
        .find()
        .then(events => {
          this.navs[1].schedule = this.backendToTableEvent(events)
        })
        .catch(console.error())
    },
    backendToTableEvent (objsArray) {
      return objsArray.map(item => {
        let backObj = item.attributes
        return {
          time: `${displayTime(backObj.startTime)}`,
          title: backObj.title,
          isVIP: backObj.isVIP ? 'VIP' : ''
        }
      })
    }
  }
}
</script>

<style scoped>
  .page-title {
    font-size: 23px;
    font-weight: 300;
  }

  .info-section {
    margin-top: 20px;
    min-width: 550px;
    width: 50%;
  }

  .info {
    margin: 0 10px;
  }

  .info-key {
    font-size: 15px;
    margin-bottom: 5px;
    color: #42b983;
  }

  .info-value {
    font-size: 20px;
  }

  .card-section {
    margin-top: 30px;
    flex-wrap: wrap;
  }

  .calendar-container {
    margin-right: 30px;
    margin-bottom: 20px;
  }

  .calendar-tip {
    margin-top: 10px;
    color: #bfcbd9;
    font-size: 14px;
  }

  .nav-entry {
    width: 300px;
    min-height: 300px;
    margin-bottom: 20px;
    margin-right: 30px;
    color: #2c3e50;
    box-shadow: 3px 3px 8px 1px #bfcbd962;
    padding-bottom: 18px;
  }

  .nav-entry:hover {
    border-color: #42b983;
    transition: all .5s;
  }

  .nav-title {
    font-size: 18px;
    padding: 8px;
  }

  .nav-content {
    font-size: 15px;
    padding: 0 6px;
    line-height: 30px;
  }

  .time {
    margin-right: 10px;
    color: #42b983;
  }

  .type {
    margin-right: 10px;
  }

  .vip {
    border: 1px solid #42b983;
    border-radius: 5px;
    padding: 1px 5px;
    font-size: 13px;
    color: #42b983;
    margin-left: 10px;
  }
</style>
