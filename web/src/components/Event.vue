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
                <option :value="false">Center</option>
                <option :value="true">Outing</option>
              </select>
              <template v-if="locationType">
                <input type="text" class="lg-input" v-model.trim="location">
              </template>
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

          <template v-if="ifDiscover">
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
      <event-table ref="table" :colTitles="colTitles" :objsArray="events" v-model="checkedEvents"></event-table>
      <!-- for production -->
      <!-- <div>Events since today (00:00)</div> -->
    </section>

    <event-dialog :dialog="dialogMsg" :isAlert="isAlert" @confirm="execute" @close="closeAlert"></event-dialog>

    <event-message :message="resultMsg" :ifShowMsg="ifShowMsg"></event-message>
  </div>
</template>

<script>
import {displayTime, displayDate, formatTime, continuousNum, checkNumber, ifSameArray, diff, operationMsg} from '@/utils/util'
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
      locationType: false,
      location: '',
      levelType: false,
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
      // form editing
      formKey: ['date', 'startTime', 'endTime', 'title', 'locationType', 'location', 'levelType', 'lowerLevel', 'upperLevel', 'isVIP', 'teacherType', 'teacherName', 'ifDiscover', 'intro', 'imgUrl'],
      origin: ['Wed Aug 1 2018', 11, 12, '', false, '', false, '', '', false, 'FT', 'John', false, '', ''], // 初始值，用于在编辑状态下比较
      editing: [], // 打开编辑框时的值
      changedObj: {}, // 更改的 key-value
      // form status
      ifShowForm: false,
      ifNewForm: true,
      disabledSave: true,
      // table component
      colTitles: ['Date', 'Time', 'Title', 'VIP', 'Level', 'Teacher', 'Location', 'Detail'],
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
    // form status
    ifDisabled () {
      if (!this.title || (this.levelType === 'limited' && (!this.lowerLevel || !this.upperLevel)) || (this.ifDiscover && !this.intro)) {
        return true
      } else if (this.checkLevel() || this.checkTime()) {
        return true
      } else {
        return false
      }
    },
    editingForm () {
      return [this.date, this.startTime, this.endTime, this.title, this.locationType, this.location, this.levelType, this.lowerLevel, this.upperLevel, this.isVIP, this.teacherType, this.teacherName, this.ifDiscover, this.intro, this.imgUrl]
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
      if (this.ifNewForm) {
        this.endTime = newValue + 1
      }
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
    },
    editingForm: {
      handler (newValue, oldValue) {
        if (!this.ifNewForm) {
          let oldIfOrigin = ifSameArray(oldValue, this.origin) // origin 结果为 true，是初始值
          if (oldIfOrigin) {
            this.editing = newValue
          }
          console.log(newValue)

          let newIfExisted = ifSameArray(newValue, this.editing)
          if (!oldIfOrigin && !newIfExisted) {
            this.disabledSave = this.ifDisabled // 如果通过了检查，则为 false，激活 save
            this.changedObj = diff(this.formKey, this.editing, newValue)
            console.log(this.changedObj)
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
      this.date = 'Wed Aug 1 2018' // test
      this.startTime = 11
      this.endTime = 12
      this.title = ''
      this.locationType = false
      this.location = ''
      this.levelType = false
      this.lowerLevel = ''
      this.upperLevel = ''
      this.isVIP = false
      this.teacherType = 'FT'
      this.teacherName = 'John'
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
          console.log('id is ' + displayEvent.id)
          this.resultMsg = operationMsg('create')
          this.events.unshift(displayEvent)
          this.resetForm()
        })
        .catch(() => {
          this.resultMsg = operationMsg('fail')
          console.error()
        })
    },
    formToTable () {
      return { // 和 backendToTable 结构一致
        date: {
          text: this.date,
          index: 1
        },
        time: {
          text: `${this.startTime}:00 - ${this.endTime}:00`,
          index: 2
        },
        title: {
          text: this.title,
          index: 3
        },
        isVIP: {
          text: this.isVIP ? 'Yes' : 'No',
          index: 4
        },
        level: {
          text: (this.levelType) ? `L${this.lowerLevel} - L${this.upperLevel}` : 'Unlimited',
          index: 5
        },
        teacher: {
          text: `${this.teacherType} ${this.teacherName}`,
          index: 6
        },
        location: {
          text: (this.locationType) ? this.location : 'Center',
          index: 7
        },
        // 详情
        detail: {
          text: '',
          index: 8
        },
        ifDiscover: {
          text: this.ifDiscover,
          index: 9
        },
        intro: {
          text: this.intro,
          index: 10
        },
        imgUrl: {
          text: this.imgUrl,
          index: 11
        }
      }
    },
    formToBackend () {
      return {
        startTime: new Date(`${this.date}, ${this.startTime}:00`),
        endTime: new Date(`${this.date}, ${this.endTime}:00`),
        title: this.title,
        isVIP: this.isVIP,
        ifDiscover: this.ifDiscover,
        location: (this.locationType) ? this.location : 'Center',
        level: (this.levelType) ? `L${this.lowerLevel} - L${this.upperLevel}` : 'Unlimited',
        teacher: `${this.teacherType} ${this.teacherName}`,
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
      this.date = obj.date.text
      this.startTime = this.timeNum(obj.time.text)[0]
      this.endTime = this.timeNum(obj.time.text)[1]
      this.title = obj.title.text
      this.locationType = (obj.location.text !== 'Center')
      this.location = (obj.location.text !== 'Center') ? obj.location.text : ''
      if (obj.level.text === 'Unlimited') {
        this.levelType = false
      } else {
        this.levelType = true
        this.lowerLevel = this.levelNum(obj.level.text)[0]
        this.upperLevel = this.levelNum(obj.level.text)[1]
      }
      this.isVIP = (obj.isVIP.text === 'Yes')
      // [this.teacherType, this.teacherName] = this.teacherText(obj.teacher.text)
      this.teacherType = this.teacherText(obj.teacher.text)[0]
      this.teacherName = this.teacherText(obj.teacher.text)[1]
      this.ifDiscover = obj.ifDiscover.text
      this.intro = obj.intro.text
      this.imgUrl = obj.imgUrl.text
    },
    timeNum (string) {
      // possible case: '11:00 - 12:00'
      let arr = string.match(/^(\d{1,2}):.+ (\d{1,2}):/)
      return [Number.parseInt(arr[1]), Number.parseInt(arr[2])]
    },
    levelNum (string) {
      // possible case: 'L1 - L10'
      let arr = string.match(/^.(\d{1,2}).+ .(\d{1,2})/)
      console.log(arr)
      return [Number.parseInt(arr[1]), Number.parseInt(arr[2])]
    },
    teacherText (string) {
      let arr = string.match(/(.{2,}) (.{1,})/)
      console.log([arr[1], arr[2]])
      return [arr[1], arr[2]]
    },
    updateEvent () {
      let eventInfo = this.checkedEvents[0]
      let id = eventInfo.id // for backend data
      let index = eventInfo.index // for table data
      let tableObj = this.events[index]

      let AV = this.$AV
      let eventObj = AV.Object.createWithoutData('Events', id)

      // params：包含改动项目的obj，表格中需要改动的obj，后端存储的obj
      this.updateEditedKeys(this.changedObj, tableObj, eventObj)
      console.log(tableObj)

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
    updateEditedKeys (changedObj, tableObj, backObj) {
    },
    // table --> get
    refresh () {
      this.queryEvents()
    },
    queryEvents () { // <-- mounted / refresh
      // console.log('queryEvents starts')
      let AV = this.$AV
      let queryEvents = new AV.Query('Events')
      // for production
      queryEvents.greaterThanOrEqualTo('startTime', formatTime('today'))
      queryEvents.ascending('startTime')
        .find()
        .then(events => {
          // console.log(events)
          // console.log(this.backendToTable(events))
          this.events = this.backendToTable(events)
        })
        .catch(console.error())
    },
    backendToTable (objsArray) {
      return objsArray.map(item => {
        // attributes 中是自定义属性
        let eventObj = item.attributes
        // match the order of colTitle <-- need to be revised
        // 如果第一条数据的某个属性格式不匹配，则会中止后续步骤
        return { // 和 formToTable 结构一致
          id: item.id, // 存储对象时自动分配的 id
          date: {
            text: displayDate(eventObj.startTime),
            index: 1
          },
          time: {
            text: `${displayTime(eventObj.startTime)} - ${displayTime(eventObj.endTime)}`,
            index: 2
          },
          title: {
            text: eventObj.title,
            index: 3
          },
          isVIP: {
            text: eventObj.isVIP ? 'Yes' : 'No',
            index: 4
          },
          level: {
            text: eventObj.level,
            index: 5
          },
          teacher: {
            text: eventObj.teacher,
            index: 6
          },
          location: {
            text: eventObj.location,
            index: 7
          },
          // 详情
          detail: { // 自动生成的
            text: '',
            index: 8
          },
          ifDiscover: {
            text: eventObj.ifDiscover,
            index: 9
          },
          intro: {
            text: eventObj.intro,
            index: 10
          },
          imgUrl: {
            text: eventObj.imgUrl,
            index: 11
          }
        }
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
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
  }
</style>
