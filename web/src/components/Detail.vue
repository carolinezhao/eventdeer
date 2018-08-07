<template>
  <section class="modal-container flex-center">
    <div class="detail-container card">
      <div class="detail-content">
        <div class="img-container" v-if="detail.imgUrl">
          <img class="img" :src="detail.imgUrl">
        </div>

        <div class="text-container">
          <div class="title">{{detail.title}}
            <span class="vip card">{{(detail.isVIP) ? 'VIP' : 'Deluxe'}}</span>
          </div>
          <div class="info">
            <div>{{detail.date}}</div>
            <div>{{detail.time}}</div>
            <div v-if="detail.level !== 'Unlimited'">{{detail.level}}</div>
            <div v-if="detail.teacher">{{detail.teacher}}</div>
            <div v-if="detail.location !== 'Center'">{{detail.location}}</div>
          </div>
          <div class="intro">{{detail.intro}}</div>
        </div>
      </div>
      <button class="primary-btn small-btn close-btn" @click="goBack">Close</button>
    </div>
  </section>
</template>

<script>
import {displayDate, displayTime} from '@/utils/util'
export default {
  data () {
    return {
      detail: ''
    }
  },
  computed: {
    getPara () {
      // this.$route 访问当前路由
      return this.$route.params
    }
  },
  mounted () {
    this.queryEvent()
  },
  methods: {
    goBack () {
      // this.$router 访问路由器
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    queryEvent () {
      let AV = this.$AV
      let queryEvent = new AV.Query('Events')
      queryEvent.equalTo('objectId', this.getPara.id)
        .find()
        .then(eventObj => {
          // console.log(eventObj)
          this.detail = this.backendToDetail(eventObj)
        })
        .catch(console.error())
    },
    backendToDetail (obj) {
      let backObj = obj[0].attributes
      backObj.date = displayDate(backObj.startTime)
      backObj.time = `${displayTime(backObj.startTime)} - ${displayTime(backObj.endTime)}`
      // console.log(backObj.intro)
      return backObj
    }
  }
}
</script>

<style scoped>
  .detail-container {
    background-color: #fff;
    border-width: 2px;
    margin-top: 30px;
    padding: 25px;
    width: 60%;
    min-width: 600px;
    max-width: 800px;
  }

  .detail-content {
    margin-bottom: 15px;
    display: table;
  }

  .img-container,
  .text-container {
    display: table-cell;
    vertical-align: middle;
  }

  .img-container {
    width: 45%;
  }

  .img {
    width: 100%;
  }

  .text-container {
    width: 55%;
    padding-left: 25px;
  }

  .title {
    font-size: 22px;
  }

  .vip {
    font-size: 15px;
    border-color: #f66;
    color: #f66;
    padding: 1px 5px;
  }

  .info,
  .intro {
    margin-top: 10px;
    line-height: 25px;
  }

  .intro {
    /* 保留换行 */
    white-space: pre-wrap;
  }

  .close-btn {
    float: right;
  }
</style>
