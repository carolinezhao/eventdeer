<template>
  <div>
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
      // for table component
      colTitles: ['Date', 'Time', 'Title', 'Location', 'Teacher', 'Detail', 'VIP', 'Display in Discover'],
      events: [],
      // from table component to manipulate
      checkedEvents: []
    }
  },
  mounted () {
    this.queryEvents()
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
            newEvent.location = eventObj.location
            newEvent.teacher = eventObj.teacher
            newEvent.detail = eventObj.detail
            newEvent.isVIP = eventObj.isVIP ? 'Yes' : 'No' // revise
            newEvent.isParty = eventObj.isParty
            newEvent.id = item.id // 存储对象时自动分配的 id
            return newEvent
          })
          console.log(eventsArr)
          this.events = eventsArr
        })
        .catch(console.error())
    }
  }
}
</script>

<style scoped>
</style>
