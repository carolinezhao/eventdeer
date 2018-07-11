<template>
  <div>
    <section class="form-section flex-col">
      <div class="form-title flex-center">New Event</div>
      <form id="event-form">
        <div class="form-row">
          <label class="form-label">Date</label>
          <div class="form-content">
            <input type="text" class="lg-input" v-model="date">
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Start Time</label>
          <div class="form-content">
            <select v-model="selectedTime">
              <option v-for="timeOption in timeOptions" :key="timeOption.id" :value="timeOption">{{timeOption}}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Title</label>
          <div class="form-content">
            <input type="text" class="lg-input" v-model="title">
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Location</label>
          <div class="form-content">
            <select v-model="locationType">
              <option value="Center">Center</option>
              <option value="Outing">Outing</option>
            </select>
            <template v-if="locationType === 'Outing'">
              <input type="text" class="lg-input" v-model="location">
            </template>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Level</label>
          <div class="form-content">
            <select v-model="levelType">
              <option value="unlimited">Unlimited</option>
              <option value="limited">Limited</option>
            </select>
            <template v-if="levelType === 'limited'">
              <label>Level</label>
              <input type="text" class="short-input" maxlength="2" v-model.number="lowerLevel"> -
              <input type="text" class="short-input" maxlength="2" v-model.number="upperLevel">
            </template>
            <div class="err-msg">{{checkLevel}}</div>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Teacher</label>
          <div class="form-content">
            <select v-model="teacherType">
              <option v-for="type in teacherTypes" :key="type.id" :value="type">{{type}}</option>
            </select>
            <select v-model="teacherName">
              <option v-for="option in teacherOptions" :key="option.id" v-if="option.type === teacherType" :value="option.name">{{option.name}}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Intro</label>
          <div class="form-content form-textarea">
            <textarea v-model="intro" rows="5" cols="40"></textarea>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Photo</label>
          <div class="form-content">
            <input type="file">
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Display in Discover</label>
          <div class="form-content">
            <input type="checkbox" v-model="isParty">
            <label>{{isParty}}</label>
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

        <div class="form-row button">
          <div class="form-content">
            <!-- <button type="submit" class="main-button create-button" @click="createCourse">Create</button> -->
          </div>
        </div>
      </form>
    </section>

    <section class="table-section">
      <event-table :colTitles="colTitles" :objsArray="events" v-model="checkedEvents"></event-table>
      <!-- for production -->
      <!-- <div>Events since today (00:00)</div> -->
    </section>
  </div>
</template>

<script>
import {displayTime, displayDate} from '@/utils/util'
// import {displayTime, displayDate, formatTime} from '@/utils/util'
import Table from '@/components/Table'
export default {
  name: 'event',
  components: {
    eventTable: Table
  },
  data () {
    return {
      // form
      date: '',
      selectedTime: '12:00',
      title: '',
      locationType: 'Center',
      location: '',
      levelType: 'unlimited',
      lowerLevel: '',
      upperLevel: '',
      teacherTypes: [],
      teacherOptions: [],
      teacherType: 'FT',
      photo: '',
      intro: '',
      isParty: false,
      isVIP: '0',
      // for table component
      colTitles: ['Date', 'Time', 'Title', 'VIP', 'Display in Discover', 'Detail'],
      events: [],
      // from table component to manipulate
      checkedEvents: []
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
    checkLevel () {
      if (this.upperLevel && (this.lowerLevel > this.upperLevel)) {
        return 'Please enter lower level first'
      }
    },
    teacherName () {
      for (let option of this.teacherOptions) {
        if (option.type === this.teacherType) {
          return option.name
        }
      }
    }
  },
  mounted () {
    this.queryEvents()
    this.queryTeachers()
  },
  methods: {
    queryEvents () {
      // console.log('queryEvents starts')
      let AV = this.$AV
      let queryEvents = new AV.Query('Events')
      // for production
      // queryEvents.greaterThanOrEqualTo('time', formatTime('today'))
      queryEvents.ascending('time')
        .find()
        .then(events => {
          console.log(events)
          let eventsArr = events.map(item => {
            // attributes 中是自定义属性
            let eventObj = item.attributes
            let newEvent = {}
            // match the order of colTitle
            newEvent.date = displayDate(eventObj.time) // add
            newEvent.time = displayTime(eventObj.time, eventObj.duration) // revise
            newEvent.title = eventObj.title
            // newEvent.location = eventObj.location
            // newEvent.teacher = eventObj.teacher
            // newEvent.detail = eventObj.detail
            newEvent.isVIP = eventObj.isVIP ? 'Yes' : 'No' // revise
            newEvent.isParty = eventObj.isParty
            newEvent.detail = 'URL'
            newEvent.id = item.id // 存储对象时自动分配的 id
            return newEvent
          })
          console.log(eventsArr)
          this.events = eventsArr
        })
        .catch(console.error())
    },
    queryTeachers () {
      let AV = this.$AV
      let queryTeachers = new AV.Query('Teachers')
      queryTeachers.find()
        .then(teachers => {
          console.log(teachers)
          let typesArr = []
          let teachersArr = teachers.map(item => {
            let teacherObj = item.attributes
            typesArr.push(teacherObj.type)
            return teacherObj
          })
          this.teacherTypes = typesArr
          this.teacherOptions = teachersArr
        })
    }
  }
}
</script>

<style scoped>
  .operation-section,
  .filter-section,
  .table-section {
    margin-top: 20px;
    overflow: hidden;
  }

  .table-section {
    width: 90%;
  }

  .form-section {
    width: 60%;
  }

  #event-form {
    margin: 10px;
  }

  .form-label {
    width: 30%;
  }

  .form-textarea {
    height: 120px;
  }
</style>
