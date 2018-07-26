<template>
  <div>
    <section class="modal-container flex-center" v-if="ifShowForm">
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
            <label class="form-label">Time</label>
            <div class="form-content">
              <select v-model="startTime">
                <!-- <option disabled value="">Start</option> -->
                <option v-for="timeOption in startTimeOptions" :key="timeOption.id" :value="timeOption">{{timeOption}}:00</option>
              </select> -
              <select v-model="endTime">
                <!-- <option disabled value="">End</option> -->
                <option v-for="timeOption in endTimeOptions" :key="timeOption.id" :value="timeOption">{{timeOption}}:00</option>
              </select>
              <div class="form-msg">{{checkTime()}}</div>
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
                <input type="text" class="lg-input" v-model.trim="location">
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
              <div class="form-msg">{{checkLevel()}}</div>
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

          <div class="form-row">
            <label class="form-label">Teacher</label>
            <div class="form-content">
              <select v-model="teacherType">
                <option v-for="type in teacherTypes" :key="type.id" :value="type">{{type}}</option>
              </select>
              <select v-model="teacherName" v-for="option in teacherOptions" :key="option.id" v-if="option.type === teacherType">
                <option v-for="name in option.names" :key="name.id" :value="name">{{name}}</option>
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
                <p class="img-tip">{{imgTip}}</p>
              </div>
            </div>

            <div class="form-row" v-if="imgUrl">
              <label class="form-label">Preview</label>
              <div class="form-content">
                <div class="img-container">
                  <img class="img" :src="imgUrl">
                </div>
              </div>
            </div>
          </template>
        </form>

        <div class="form-footer flex">
          <button type="button" class="primary-btn small-btn" @click="closeForm">Cancel</button>
          <button type="submit" class="main-btn small-btn" :disabled="disabledCreate" @click="createEvent">Create</button>
        </div>
      </section>
    </section>

    <section class="filter-section">
      <event-filter ref="filter" :filters="filters" v-model="selectedFilter"></event-filter>
      <div class="filter-footer card flex">
        <template v-if="tempEvents.length">
          <button class="primary-btn small-btn" @click="cancelFilter">Cancel</button>
        </template>
        <template v-else>
          <button class="main-btn small-btn" @click="filterEvents(selectedFilter)">Filter</button>
        </template>
        <div class="filter-msg">{{filterMsg}}</div>
      </div>
    </section>

    <section class="operation-section">
      <button class="main-btn small-btn" @click="openForm">Create</button>
      <button class="primary-btn small-btn" @click="refresh">Refresh</button>
      <button class="primary-btn small-btn">Edit</button>
      <button class="danger-btn small-btn" @click="confirmRemove">Remove</button>
      <div class="select-msg">{{selectMsg}}</div>
      <!-- for debug -->
      <!-- <div>test: {{checkedEvents}}</div> -->
    </section>

    <section class="table-section">
      <event-table ref="table" :colTitles="colTitles" :objsArray="events" v-model="checkedEvents"></event-table>
      <!-- for production -->
      <!-- <div>Events since today (00:00)</div> -->
    </section>

    <event-dialog :dialog="dialogMsg" :isAlert="isAlert" @confirm="execute" @close="closeAlert"></event-dialog>

    <event-message :message="resultMsg" :ifShowMsg="ifShowMsg"></event-message>
  </div>
</template>

<script>
import {displayTime, displayDate, formatTime, continuousNum, checkNumber, operationMsg} from '@/utils/util'
import Table from '@/components/Table'
import Filter from '@/components/Filter'
import Dialog from '@/components/Dialog'
import Message from '@/components/Message'
export default {
  name: 'event',
  components: {
    eventTable: Table,
    eventFilter: Filter,
    eventDialog: Dialog,
    eventMessage: Message
  },
  data () {
    return {
      // form content
      date: 'Wed Aug 1 2018', // test
      startTime: 11,
      endTime: 12,
      title: '',
      locationType: 'Center',
      location: '',
      levelType: 'unlimited',
      lowerLevel: '',
      upperLevel: '',
      isVIP: false,
      teacherType: 'FT',
      teacherTypes: [],
      teacherOptions: [],
      teacherName: 'John',
      ifDiscover: false,
      intro: '',
      imgUrl: '',
      imgTip: 'Optimal ratio of length to width: 5:3',
      // form status
      ifShowForm: false,
      // table component
      colTitles: ['Date', 'Time', 'Title', 'VIP', 'Display in Discover', 'Detail'],
      events: [],
      // from table component to manipulate
      checkedEvents: [],
      // msg component
      resultMsg: '',
      ifShowMsg: false,
      // dialog component
      dialogMsg: '',
      isAlert: false,
      // filter
      selectedFilter: [],
      tempEvents: [],
      filterMsg: ''
    }
  },
  computed: {
    startTimeOptions () {
      return continuousNum(11, 20)
    },
    endTimeOptions () {
      return continuousNum(12, 21)
    },
    disabledCreate () {
      if (!this.title || (this.levelType === 'limited' && (!this.lowerLevel || !this.upperLevel)) || (this.ifDiscover && !this.intro)) {
        return true
      } else if (this.checkLevel() || this.checkTime()) {
        return true
      } else {
        return false
      }
    },
    // table select
    selectMsg () {
      let len = this.checkedEvents.length
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
          name: 'Display in Discover',
          key: 'ifDiscover',
          options: [true, false]
        }]
    }
  },
  watch: {
    startTime (newValue, oldValue) {
      this.endTime = newValue + 1
    },
    teacherType (newValue, oldValue) {
      for (let option of this.teacherOptions) {
        if (option.type === newValue) {
          this.teacherName = option.names[0]
        }
      }
    },
    resultMsg (newValue) {
      if (newValue) {
        this.ifShowMsg = true
        setTimeout(() => {
          this.ifShowMsg = false
        }, 2000)
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
    openForm () {
      this.ifShowForm = true
    },
    closeForm () {
      this.ifShowForm = false
      this.resetForm()
    },
    checkTime () {
      if (this.endTime && (this.endTime - this.startTime < 1)) {
        return 'Please enter earlier time first'
      }
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
    createEvent () {
      this.emptySelected()
      // prepare data for backend
      let startTime = new Date(`${this.date}, ${this.startTime}:00`)
      let endTime = new Date(`${this.date}, ${this.endTime}:00`)
      let location = (this.locationType === 'Center') ? 'Center' : this.location
      let level = (this.levelType === 'unlimited') ? 'Unlimited' : `L${this.lowerLevel}-L${this.upperLevel}`
      let isVIP = Boolean(Number(this.isVIP))
      let teacher = `${this.teacherType} ${this.teacherName}`
      // prepare data for frontend (match the order of colTitle)
      let vipStr = isVIP ? 'Yes' : 'No'
      // frontend (main)
      let displayEvent = {
        date: this.date,
        time: `${this.startTime}:00 - ${this.endTime}:00`,
        title: this.title,
        isVIP: vipStr,
        ifDiscover: this.ifDiscover,
        detail: 'url'
      }
      // backend (all)
      let AV = this.$AV
      let Events = AV.Object.extend('Events')
      let eventObj = new Events()
      eventObj.set('startTime', startTime)
      eventObj.set('endTime', endTime)
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
          this.resultMsg = operationMsg('create')
          this.events.unshift(displayEvent)
        })
        .catch(() => {
          this.resultMsg = operationMsg('fail')
          console.error()
        })
    },
    queryEvents () {
      // console.log('queryEvents starts')
      let AV = this.$AV
      let queryEvents = new AV.Query('Events')
      // for production
      queryEvents.greaterThanOrEqualTo('startTime', formatTime('today'))
      queryEvents.ascending('startTime')
        .find()
        .then(events => {
          // console.log(events)
          let eventsArr = events.map(item => {
            // attributes 中是自定义属性
            let eventObj = item.attributes
            let newEvent = {}
            // match the order of colTitle
            // 如果第一条数据的某个属性格式不匹配，则会中止后续步骤
            newEvent.date = displayDate(eventObj.startTime) // add
            // newEvent.time = displayTime(eventObj.time, eventObj.duration) // revise
            newEvent.time = `${displayTime(eventObj.startTime)} - ${displayTime(eventObj.endTime)}`
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
          let type1 = 'FT'
          let type2 = 'CT'
          let type3 = 'Manager'
          let namesArr1 = []
          let namesArr2 = []
          let namesArr3 = []
          for (let item of teachers) {
            let teacherObj = item.attributes
            let type = teacherObj.type
            let name = teacherObj.name
            switch (type) {
              case type1:
                namesArr1.push(name)
                break
              case type2:
                namesArr2.push(name)
                break
              case type3:
                namesArr3.push(name)
                break
              default:
                break
            }
          }
          let teachersArr = [{
            type: type1,
            names: namesArr1
          }, {
            type: type2,
            names: namesArr2
          }, {
            type: type3,
            names: namesArr3
          }]
          this.teacherTypes = [type1, type2, type3]
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
        // console.log(file.url())
        this.imgUrl = file.url()
      }).catch(console.error())
    },
    // table --> remove
    confirmRemove () {
      if (!this.checkedEvents.length) {
        this.alert("You haven't chosen any data.")
      } else {
        this.dialogMsg = 'Are you sure you want to remove checked data?'
        this.$dialog.confirm({})
          .then((value) => {
            console.log(value)
            this.dialogMsg = ''
            this.removeEvents(this.events, this.checkedEvents, 'Events')
          }).catch()
      }
    },
    execute () {
      this.$dialog.util.promiseResolver('run')
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
        this.resultMsg = operationMsg('remove', targetArr.length)
        this.emptySelected()
      }).catch(() => {
        this.resultMsg = operationMsg('fail')
        console.error()
      })
    },
    filterEvents (conditionArr) {
      if (!conditionArr.length) {
        alert("You haven't chosen any filters.")
      } else {
        this.tempEvents = this.events
        let key
        let value
        for (let item of conditionArr) {
          key = item.key
          value = item.value
          this.events = this.events.filter(function (targetObj) {
            return targetObj[key] === value
          })
        }
        let count = this.events.length
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
      this.events = this.tempEvents
      this.tempEvents = []
    },
    refresh () {
      this.queryEvents()
    },
    resetForm () {
      this.startTime = 11
      this.endTime = 12
      this.title = ''
      this.locationType = 'Center'
      this.location = ''
      this.levelType = 'unlimited'
      this.lowerLevel = ''
      this.upperLevel = ''
      this.isVIP = '0'
      this.teacherType = 'FT'
      this.teacherName = 'John'
      this.ifDiscover = false
      this.intro = ''
      this.imgUrl = ''
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

<style scoped>
  .form-section {
    width: 60%;
    min-width: 550px;
    max-width: 650px;
  }

  #event-form {
    margin: 15px 10px;
  }

  .form-label {
    width: 32%;
  }

  .form-textarea {
    height: 140px;
  }

  .img-tip {
    font-size: 11px;
    margin: 2px;
  }

  .img-container {
    padding: 10px 0;
    height: 120px;
    width: 200px;
  }

  .img {
    width: 100%;
    height: 100%;
  }

  .filter-section {
    width: 80%;
  }

  .radio-label {
    margin-right: 10px;
  }

  /* 深度作用选择器：影响子组件样式 */

  .filter-section >>> .filter-label {
    width: 30%;
  }

  .filter-footer {
    border-radius: 0 0 5px 5px ;
    border-top: none;
    align-items: center;
  }

  .table-section {
    width: 80%;
    margin-top: 10px;
    overflow: hidden;
  }
</style>
