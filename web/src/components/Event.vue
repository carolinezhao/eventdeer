<template>
  <div>
    <section class="modal-container flex-center" v-if="ifShowForm">
      <section class="form-section flex-col">
        <div class="form-title flex-center">New Event</div>
        <form id="event-form">
          <div class="form-row">
            <label class="form-label">Date</label>
            <div class="form-content">
              <datepicker v-model="rawDate" :format="formatPickedDate" :disabledDates="disabledDates" input-class="m-input" calendar-class="calendar" placeholder="Select Date"></datepicker>
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
            <label class="form-label">Level</label>
            <div class="form-content">
              <select v-model="levelType">
                <option :value="false">Unlimited</option>
                <option :value="true">Limited</option>
              </select>
              <template v-if="levelType">
                <label>Level</label>
                <input type="text" class="short-input" maxlength="2" v-model.number="lowerLevel"> -
                <input type="text" class="short-input" maxlength="2" v-model.number="upperLevel">
              </template>
              <div class="form-msg">{{checkLevel()}}</div>
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
              <input type="checkbox" v-model="teacherIfOther">
              <label>Other</label>
              <input type="text" class="input" v-if="teacherIfOther" v-model="teacherOther">
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
            <label class="form-label">Location</label>
            <div class="form-content">
              <select v-model="locationType">
                <option :value="false">Center</option>
                <option :value="true">Outing</option>
              </select>
              <template v-if="locationType">
                <input type="text" class="lg-input" v-model.trim="locationName">
              </template>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Detail
              <span class="icon-btn" @click="ifShowTip = !ifShowTip"><i class="iconfont icon-wenhao"></i></span>
            </label>
            <div class="form-content">
              <input type="checkbox" v-model="ifDiscover">
              <label>{{ifDiscover}}</label>
            </div>
          </div>

          <div class="detail-tip card flex" v-if="ifShowTip">
            <span>{{detailTip}}</span>
            <span class="icon-btn" @click="ifShowTip = false"><i class="iconfont icon-guanbi"></i></span>
          </div>

          <template v-if="ifDiscover">
            <div class="form-row">
              <label class="form-label">Introduction</label>
              <div class="form-content form-textarea">
                <textarea v-model="intro" rows="5" cols="40"></textarea>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label">Image (optional)</label>
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
          <button type="submit" class="main-btn small-btn" v-if="ifNewForm" :disabled="ifDisabled" @click="createEvent">Create</button>
          <button type="submit" class="main-btn small-btn" v-if="!ifNewForm" :disabled="disabledSave" @click="updateEvent">Save</button>
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
      <button class="primary-btn small-btn" @click="editForm">Edit</button>
      <button class="danger-btn small-btn" @click="confirmRemove">Remove</button>
      <div class="select-msg">{{selectMsg}}</div>
      <!-- for debug -->
      <!-- <div>test: {{checkedEvents}}</div> -->
    </section>

    <section class="table-section">
      <event-table ref="table" :colTitles="colTitles" :objsArray="events" :colKeys="colKeys" :keyLimit="7" :ifArchive="false" v-model="checkedEvents"></event-table>
      <!-- <div>Events since today (00:00)</div> -->
    </section>

    <event-dialog :dialog="dialogMsg" :isAlert="isAlert" @confirm="execute" @close="closeAlert"></event-dialog>

    <event-message :message="resultMsg" :ifShowMsg="ifShowMsg"></event-message>

    <!-- event detail -->
    <router-view></router-view>
  </div>
</template>

<script>
import {displayTime, displayDate, formatTime, continuousNum, checkNumber, ifSameArray, diff, operationMsg} from '@/utils/util'
import Table from '@/components/Table'
import Filter from '@/components/Filter'
import Dialog from '@/components/Dialog'
import Message from '@/components/Message'
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'event',
  components: {
    eventTable: Table,
    eventFilter: Filter,
    eventDialog: Dialog,
    eventMessage: Message,
    Datepicker
  },
  data () {
    return {
      // form content
      rawDate: '', // obj
      startTime: 14,
      endTime: 15,
      title: '',
      locationType: false,
      locationName: '',
      levelType: false,
      lowerLevel: '',
      upperLevel: '',
      isVIP: false,
      teacherType: 'FT',
      teacherTypes: ['FT', 'SA', 'VIP SA', 'CC', 'Manager'],
      teacherOptions: [],
      teacherName: 'Hassan',
      teacherIfOther: false,
      teacherOther: '',
      ifDiscover: false,
      ifShowTip: false,
      detailTip: "If you check this option, this Event will be displayed in 'Discover' page of miniprogram.",
      intro: '',
      imgUrl: '',
      imgTip: 'Optimal ratio of length to width: 5:3',
      // form editing (与 'editingForm' 对应)
      formKey: ['date', 'startTime', 'endTime', 'time', 'title', 'location', 'level', 'isVIP', 'vip', 'teacher', 'ifDiscover', 'intro', 'imgUrl'],
      origin: ['', 14, 15, '11:00 - 12:00', '', 'Center', 'Unlimited', false, 'No', 'FT Hassan', false, '', ''], // 初始值，用于在编辑状态下比较
      editing: [], // 打开编辑框时的值
      changedObj: {}, // 更改的 key-value
      // form status
      ifShowForm: false,
      ifNewForm: true,
      disabledSave: true,
      // table component
      colTitles: ['Date', 'Time', 'Title', 'VIP', 'Level', 'Teacher', 'Location', 'Detail'],
      colKeys: ['date', 'time', 'title', 'vip', 'level', 'teacher', 'location', 'ifDiscover', 'intro', 'imgUrl', 'detail'],
      detail: true,
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
    date () {
      return (typeof this.rawDate === 'object' && this.rawDate !== null) ? this.rawDate.toDateString() : this.rawDate
    },
    disabledDates () {
      return {
        to: formatTime('today')
      }
    },
    startTimeOptions () {
      return continuousNum(14, 20)
    },
    endTimeOptions () {
      return continuousNum(15, 21)
    },
    // form data to table/backend
    time () { // only for table
      return `${this.startTime}:00 - ${this.endTime}:00`
    },
    location () {
      return (this.locationType) ? this.locationName : 'Center'
    },
    level () {
      return (this.levelType) ? `L${this.lowerLevel} - L${this.upperLevel}` : 'Unlimited'
    },
    vip () {
      return this.isVIP ? 'Yes' : 'No'
    },
    teacher () {
      return (this.teacherIfOther) ? this.teacherOther : `${this.teacherType} ${this.teacherName}`
    },
    // form status
    ifDisabled () {
      if (!this.date || !this.title || (this.levelType && (!this.lowerLevel || !this.upperLevel)) || !this.location || !this.teacher || (this.ifDiscover && !this.intro)) {
        return true
      } else if (this.checkLevel() || this.checkTime()) {
        return true
      } else {
        return false
      }
    },
    editingForm () { // 与 'formKey' 和 'origin' 对应
      return [this.date, this.startTime, this.endTime, this.time, this.title, this.location, this.level, this.isVIP, this.vip, this.teacher, this.ifDiscover, this.intro, this.imgUrl]
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
          key: 'vip',
          options: ['Yes', 'No']
        }, {
          name: 'Discover',
          key: 'ifDiscover',
          options: [true, false]
        }]
    }
  },
  watch: {
    startTime (newValue, oldValue) {
      if (this.ifNewForm) {
        this.endTime = newValue + 1
      }
    },
    teacherType (newValue, oldValue) {
      for (let option of this.teacherOptions) {
        if (option.type === newValue && option.names.length) {
          this.teacherName = option.names[0]
        }
      }
      this.teacherIfOther = !newValue
    },
    teacherIfOther (newValue) {
      this.teacherType = (newValue) ? '' : 'FT'
      if (!newValue) {
        this.teacherOther = ''
      }
    },
    resultMsg (newValue) {
      if (newValue) {
        this.ifShowMsg = true
        setTimeout(() => {
          this.ifShowMsg = false
        }, 2000)
      }
    },
    editingForm: {
      handler (newValue, oldValue) {
        if (!this.ifNewForm) {
          let oldIfOrigin = ifSameArray(oldValue, this.origin) // origin 结果为 true，是初始值
          if (oldIfOrigin) {
            this.editing = newValue
          }
          // console.log(newValue)

          let newIfExisted = ifSameArray(newValue, this.editing)
          if (!oldIfOrigin && !newIfExisted) {
            this.disabledSave = this.ifDisabled // 如果通过了检查，则为 false，激活 save
            this.changedObj = diff(this.formKey, this.editing, newValue)
            // console.log(this.changedObj)
          } else {
            this.disabledSave = true
          }
        }
      }
    }
  },
  mounted () {
    this.queryEvents()
    this.queryTeachers()
  },
  methods: {
    formatPickedDate (date) {
      return displayDate(date) // 选择日期后显示的内容
    },
    // common
    emptySelected () {
      // before creating; after removing
      this.checkedEvents = [] // 本页面
      this.$refs.table.empty() // 子组件
    },
    // for 'ifDisabled'
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
    // form content
    queryTeachers () {
      let AV = this.$AV
      let queryTeachers = new AV.Query('Teachers')
      queryTeachers.find()
        .then(teachers => {
          // console.log(teachers)
          this.teacherOptions = this.formatTeacher(teachers)
        })
    },
    formatTeacher (objsArray) {
      let teachersArr = []
      this.teacherTypes.forEach((type) => {
        let teacherObj = {
          type: type,
          names: []
        }
        objsArray.forEach((item) => {
          let obj = item.attributes
          if (obj.type === teacherObj.type) {
            teacherObj.names.push(obj.name)
          }
        })
        teachersArr.push(teacherObj)
      })
      // console.log(teachersArr)
      return teachersArr
    },
    chooseFile (e) {
      // console.log('chooseFile works')
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
    // form --> create
    openForm () {
      this.ifShowForm = true
      this.ifNewForm = true
    },
    closeForm () {
      this.ifShowForm = false
      this.resetForm()
      this.emptySelected()
    },
    resetForm () {
      this.rawDate = ''
      this.startTime = 14
      this.endTime = 15
      this.title = ''
      this.locationType = false
      this.locationName = ''
      this.levelType = false
      this.lowerLevel = ''
      this.upperLevel = ''
      this.isVIP = false
      this.teacherType = 'FT'
      this.teacherName = 'Hassan'
      this.teacherIfOther = false
      this.teacherOther = ''
      this.ifDiscover = false
      this.intro = ''
      this.imgUrl = ''
    },
    createEvent () {
      this.emptySelected()
      let displayEvent = this.formToTable() // data for table (main)
      let saveEvent = this.formToBackend() // data for backend (all)
      // console.log(saveEvent)
      // backend
      let AV = this.$AV
      let Events = AV.Object.extend('Events')
      let eventObj = new Events()
      for (let key in saveEvent) {
        eventObj.set(key, saveEvent[key])
      }
      eventObj.save()
        .then((eventObj) => {
          // frontend
          this.ifShowForm = false
          displayEvent.id = eventObj.id // id 是存储成功后生成的
          // console.log('id is ' + displayEvent.id)
          this.resultMsg = operationMsg('create')
          this.events.unshift(displayEvent)
          this.resetForm()
        })
        .catch(() => {
          this.resultMsg = operationMsg('fail')
          console.error()
        })
    },
    formToTable () { // 和 backendToTable 结构一致
      let tableObj = {}
      // this.colKeys 为根据列标题排列的属性
      this.colKeys.forEach((key) => {
        tableObj[key] = this[key]
      })
      // console.log(tableObj)
      return tableObj
    },
    formToBackend () {
      return {
        startTime: new Date(`${this.date}, ${this.startTime}:00`),
        endTime: new Date(`${this.date}, ${this.endTime}:00`),
        title: this.title,
        isVIP: this.isVIP,
        ifDiscover: this.ifDiscover,
        location: this.location,
        level: this.level,
        teacher: this.teacher,
        intro: this.intro,
        imgUrl: this.imgUrl
      }
    },
    // form --> edit
    editForm () {
      if (this.checkedEvents.length !== 1) {
        this.alert('Please select one item to edit.')
      } else {
        this.ifShowForm = true
        this.ifNewForm = false
        let index = this.checkedEvents[0].index
        let tableObj = this.events[index]
        // console.log(tableObj)
        this.tableToForm(tableObj)
      }
    },
    tableToForm (obj) {
      this.rawDate = obj.date
      this.startTime = this.timeNum(obj.time)[0]
      this.endTime = this.timeNum(obj.time)[1]
      this.title = obj.title
      this.locationType = (obj.location !== 'Center')
      this.locationName = (obj.location !== 'Center') ? obj.location : ''
      if (obj.level === 'Unlimited') {
        this.levelType = false
      } else {
        this.levelType = true
        let levelArr = this.levelNum(obj.level)
        this.lowerLevel = levelArr[0]
        this.upperLevel = levelArr[1]
      }
      this.isVIP = (obj.vip === 'Yes')
      // [this.teacherType, this.teacherName] = this.teacherText(obj.teacher)
      let teacherArr = this.teacherText(obj.teacher)
      this.teacherType = teacherArr[0]
      this.teacherName = teacherArr[1]
      this.teacherIfOther = teacherArr[2]
      this.teacherOther = teacherArr[3]
      this.ifDiscover = obj.ifDiscover
      this.intro = obj.intro
      this.imgUrl = obj.imgUrl
    },
    timeNum (string) {
      // possible case: '11:00 - 12:00'
      let arr = string.match(/^(\d{1,2}):.+ (\d{1,2}):/)
      return [Number.parseInt(arr[1]), Number.parseInt(arr[2])]
    },
    levelNum (string) {
      // possible case: 'L1 - L10'
      let arr = string.match(/^.(\d{1,2}).+ .(\d{1,2})/)
      // console.log(arr)
      return [Number.parseInt(arr[1]), Number.parseInt(arr[2])]
    },
    teacherText (string) {
      let arr = string.match(/(.{2,}) (.{1,})/) // 格式匹配
      let ifExist
      if (arr) {
        ifExist = this.teacherTypes.some((item) => { // 内容匹配
          return item === arr[1]
        })
      }
      let result = (ifExist) ? [arr[1], arr[2], false, ''] : ['', '', true, string]
      // console.log(result)
      return result
    },
    updateEvent () {
      let eventInfo = this.checkedEvents[0]
      let id = eventInfo.id // for backend data
      let index = eventInfo.index // for table data
      let tableObj = this.events[index]

      let AV = this.$AV
      let eventObj = AV.Object.createWithoutData('Events', id)

      // params：包含改动项目的obj，表格中需要改动的obj，后端存储的obj
      this.updateEditedItems(this.changedObj, tableObj, eventObj)
      // console.log(tableObj)

      eventObj.save()
        .then((eventObj) => {
          // console.log('updated id = ' + eventObj.id)
          // frontend
          this.ifShowForm = false
          this.events[index] = tableObj
          this.resultMsg = operationMsg('save')
          this.emptySelected()
          this.resetForm()
        }).catch(() => {
          this.resultMsg = operationMsg('fail')
          console.error()
        })
    },
    updateEditedItems (changedObj, tableObj, backObj) {
      for (let key in changedObj) {
        // console.log(key, changedObj[key])
        if (!tableObj.hasOwnProperty(key)) {
          switch (key) {
            case 'isVIP':
              backObj.set('isVIP', changedObj.isVIP)
              break
            default: // 'startTime', 'endTime'
              if (!changedObj.date) {
                backObj.set(key, new Date(`${tableObj.date}, ${changedObj[key]}:00`))
              }
              break
          }
        } else {
          switch (key) {
            case 'date':
              tableObj.date = changedObj.date
              let currentStartTime = this.timeNum(tableObj.time)[0]
              let currentEndTime = this.timeNum(tableObj.time)[1]
              let startTime = (changedObj.startTime) ? changedObj.startTime : currentStartTime
              backObj.set('startTime', new Date(`${changedObj.date}, ${startTime}:00`))
              let endTime = (changedObj.endTime) ? changedObj.endTime : currentEndTime
              backObj.set('endTime', new Date(`${changedObj.date}, ${endTime}:00`))
              break
            case 'time':
              tableObj[key] = changedObj[key]
              break
            case 'vip':
              tableObj[key] = changedObj[key]
              break
            default:
              // direct：'title', 'ifDiscover', 'intro', 'imgUrl'
              // combined：'location', 'level', 'teacher'
              tableObj[key] = changedObj[key]
              backObj.set(key, changedObj[key])
              break
          }
        }
      }
    },
    // table --> get
    refresh () {
      this.queryEvents()
    },
    queryEvents () { // <-- mounted / refresh
      // console.log('queryEvents starts')
      let AV = this.$AV
      let queryEvents = new AV.Query('Events')
      queryEvents.greaterThanOrEqualTo('startTime', formatTime('today'))
      queryEvents.descending('startTime')
        .find()
        .then(events => {
          // console.log(events)
          this.events = this.backendToTable(events)
        })
        .catch(console.error())
    },
    backendToTable (objsArray) {
      return objsArray.map(item => { // 和 formToTable 结构一致
        let backObj = item.attributes
        // 重写特殊格式的数据
        backObj.date = displayDate(backObj.startTime)
        backObj.time = `${displayTime(backObj.startTime)} - ${displayTime(backObj.endTime)}`
        backObj.vip = backObj.isVIP ? 'Yes' : 'No'
        backObj.detail = true
        let tableObj = {
          id: item.id
        }
        // this.colKeys 为根据列标题排列的属性
        this.colKeys.forEach((key) => {
          tableObj[key] = backObj[key]
        })
        // console.log(tableObj)
        return tableObj // 行数据
      })
    },
    // table --> remove
    confirmRemove () {
      if (!this.checkedEvents.length) {
        this.alert("You haven't chosen any data.")
      } else {
        this.dialogMsg = 'Are you sure you want to remove checked data?'
        this.$dialog.confirm({})
          .then((value) => {
            // console.log(value)
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
    // filter
    filterEvents (conditionArr) {
      if (!conditionArr.length) {
        this.alert("You haven't chosen any filters.")
      } else {
        this.tempEvents = this.events
        let key
        let value
        conditionArr.forEach(item => {
          key = item.key
          value = item.value
          this.events = this.events.filter(function (targetObj) {
            return targetObj[key] === value
          })
        })
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

  .icon-btn:hover {
    cursor: pointer;
  }

  .detail-tip {
    font-size: 12px;
    padding: 3px 5px;
    color: #42b983;
    border-color: #42b983;
    width: 88%;
    margin: auto;
    justify-content: space-between;
    align-items: center;
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
    width: 60%;
    min-width: 500px;
  }

  .radio-label {
    margin-right: 10px;
  }

  /* 深度作用选择器：影响子组件样式 */

  .filter-section>>>.filter-label {
    width: 30%;
  }

  .filter-footer {
    border-radius: 0 0 5px 5px;
    border-top: none;
    align-items: center;
  }

  .table-section {
    width: 80%;
    min-width: 650px;
    margin-top: 10px;
    overflow: hidden;
  }
</style>

<style scoped src="../assets/iconfont.css"></style>
