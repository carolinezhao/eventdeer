<template>
  <div>
    <section class="form-section flex-col">
      <div class="form-title flex-center">New Event</div>
      <form id="event-form">
        <div class="form-row">
          <label class="form-label">Date</label>
          <div class="form-content">
            <input type="text" class="input" v-model="date">
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Start Time</label>
          <div class="form-content">
            <select v-model="startTime">
              <option v-for="timeOption in timeOptions" :key="timeOption.id" :value="timeOption">{{timeOption}}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Duration</label>
          <div class="form-content">
            <select v-model="duration">
              <option v-for="num in 5" :key="num.id" :value="num">{{num}} hour</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label class="form-label">Title</label>
          <div class="form-content">
            <input type="text" class="lg-input" v-model.trim="title">
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
          <label class="form-label">VIP</label>
          <div class="form-content">
            <select v-model="isVIP">
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
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
          <label class="form-label">Display in Discover</label>
          <div class="form-content">
            <input type="checkbox" v-model="ifDiscover">
            <label>{{ifDiscover}}</label>
          </div>
        </div>

        <template v-if="ifDiscover === true">
          <div class="form-row">
            <label class="form-label">Introduction</label>
            <div class="form-content form-textarea">
              <textarea v-model="intro" rows="5" cols="40"></textarea>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Image</label>
            <div class="form-content">
              <input type="file" @change="chooseFile">
            </div>
          </div>
        </template>

        <div class="form-row button">
          <div class="form-content">
            <button type="submit" class="main-button create-button" @click="createEvent">Create</button>
          </div>
        </div>
      </form>
    </section>

    <section class="operation-section">
      <button class="primary-button small-button" @click="refresh">Refresh</button>
      <button class="primary-button small-button">Edit</button>
      <button class="danger-button small-button" @click="confirmRemove">Remove</button>

      <div class="operation-msg">{{operationMsg('select')}}</div>
      <div class="operation-msg">{{resultMsg}}</div>
      <!-- for debug -->
      <div class="operation-msg">test: {{checkedEvents}}</div>
    </section>

    <section class="table-section">
      <event-table ref="table" :colTitles="colTitles" :objsArray="events" v-model="checkedEvents"></event-table>
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
      startTime: '12:00',
      duration: 1,
      title: '',
      locationType: 'Center',
      location: '',
      levelType: 'unlimited',
      lowerLevel: '',
      upperLevel: '',
      isVIP: '0',
      teacherType: 'FT',
      teacherTypes: [],
      teacherOptions: [], // {type:'', name:''}
      ifDiscover: false,
      intro: '',
      imgUrl: '',
      // for table component
      colTitles: ['Date', 'Time', 'Title', 'VIP', 'Display in Discover', 'Detail'],
      events: [],
      // from table component to manipulate
      checkedEvents: [],
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
    emptySelected () {
      // before creating; after removing
      this.checkedEvents = [] // 本页面
      this.$refs.table.empty() // 子组件
    },
    createEvent () {
      this.emptySelected()
      // prepare data for backend
      let time = new Date(`${this.date}, ${this.selectedTime}`)
      let location = (this.locationType === 'Center') ? 'Center' : this.location
      let level = (this.levelType === 'unlimited') ? 'Unlimited' : `L${this.lowerLevel}-L${this.upperLevel}`
      let isVIP = Boolean(Number(this.isVIP))
      let teacher = `${this.teacherType} ${this.teacherName}`
      // prepare data for frontend (match the order of colTitle)
      let vipStr = isVIP ? 'Yes' : 'No'
      // frontend (main)
      let displayEvent = {
        date: this.date,
        time: this.selectedTime,
        title: this.title,
        isVIP: vipStr,
        ifDiscover: this.ifDiscover,
        detail: 'url'
      }
      // backend (all)
      let AV = this.$AV
      let Events = AV.Object.extend('Events')
      let eventObj = new Events()
      eventObj.set('time', time)
      eventObj.set('duration', this.duration)
      eventObj.set('title', this.title)
      eventObj.set('location', location)
      eventObj.set('level', level)
      eventObj.set('isVIP', isVIP)
      eventObj.set('teacher', teacher)
      eventObj.set('ifDiscover', this.ifDiscover)
      eventObj.set('intro', this.intro)
      eventObj.set('img', this.imgUrl)
      eventObj.save()
        .then((eventObj) => {
          // frontend
          displayEvent.id = eventObj.id // id 是存储成功后生成的
          console.log('id is ' + displayEvent.id)
          // this.operationMsg('create')
          this.events.unshift(displayEvent)
        })
        .catch(console.error())
    },
    queryEvents () {
      // console.log('queryEvents starts')
      let AV = this.$AV
      let queryEvents = new AV.Query('Events')
      // for production
      // queryEvents.greaterThanOrEqualTo('time', formatTime('today'))
      queryEvents.ascending('time')
        .find()
        .then(events => {
          // console.log(events)
          let eventsArr = events.map(item => {
            // attributes 中是自定义属性
            let eventObj = item.attributes
            let newEvent = {}
            // match the order of colTitle
            // 如果第一条数据的某个属性格式不匹配，则会中止后续步骤
            newEvent.date = displayDate(eventObj.time) // add
            newEvent.time = displayTime(eventObj.time, eventObj.duration) // revise
            newEvent.title = eventObj.title
            newEvent.isVIP = eventObj.isVIP ? 'Yes' : 'No' // revise
            newEvent.ifDiscover = eventObj.ifDiscover
            newEvent.detail = 'URL'
            newEvent.id = item.id // 存储对象时自动分配的 id
            return newEvent
          })
          // console.log(eventsArr)
          this.events = eventsArr
        })
        .catch(console.error())
    },
    queryTeachers () {
      let AV = this.$AV
      let queryTeachers = new AV.Query('Teachers')
      queryTeachers.find()
        .then(teachers => {
          // console.log(teachers)
          let typesArr = []
          let teachersArr = teachers.map(item => {
            let teacherObj = item.attributes
            typesArr.push(teacherObj.type)
            return teacherObj
          })
          this.teacherTypes = typesArr
          this.teacherOptions = teachersArr
        })
    },
    chooseFile (e) {
      console.log('chooseFile works')
      // console.log(e.target) // <input>
      let file = e.target.files
      // file 是对象，length 和 0 都是对象中的 key
      if (file.length) {
        this.uploadFile(file[0])
      }
    },
    uploadFile (fileObj) {
      let AV = this.$AV
      let uploadFile = new AV.File(fileObj.name, fileObj)
      uploadFile.save().then((file) => {
        console.log(file.url())
        this.imgUrl = file.url()
      }).catch(console.error())
    },
    confirmRemove () {
      if (!this.checkedEvents.length) {
        alert("You haven't chosen any data.")
      } else {
        let result = window.confirm('Are you sure you want to remove checked data?')
        if (result) {
          this.removeEvents(this.events, this.checkedEvents, 'Events')
        }
      }
    },
    removeEvents (currentArr, targetArr, tableName) {
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
      this.queryEvents()
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
          let len = this.checkedEvents.length
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

<style scoped>
  .operation-section,
  .filter-section,
  .table-section {
    margin-top: 20px;
    overflow: hidden;
  }

  .table-section {
    width: 80%;
  }

  .form-section {
    width: 60%;
  }

  #event-form {
    margin: 10px;
  }

  .form-label {
    width: 35%;
  }

  .form-textarea {
    height: 140px;
  }
</style>
