<template>
  <div class="detail-container card">
    <button @click="goBack">Go Back</button>
    <div class="img-container" v-if="detail.imgUrl">
      <img class="img" :src="detail.imgUrl">
    </div>
    <div class="title">{{detail.title}}
      <span class="vip card">{{(detail.isVIP) ? 'VIP' : 'Deluxe'}}</span>
    </div>
    <div class="info">
      <div>{{detail.date}}</div>
      <div>{{detail.time}}</div>
    </div>
    <div class="intro">{{detail.intro}}</div>
  </div>
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
      console.log(backObj.intro)
      return backObj
    }
  }
}
</script>

<style scoped>
  .detail-container {
    margin-top: 20px;
    padding: 20px;
    width: 60%;
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
</style>
