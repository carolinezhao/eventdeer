<template>
  <div class="detail-container card">
    <button @click="goBack">Go Back</button>
    <div class="detail-img">
      <img class="img" :src="detail.imgUrl">
    </div>
    <template v-for="(value, key) in detail">
      <div :key="key.id">{{key}}: {{value}}</div>
    </template>
  </div>
</template>

<script>
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
          this.detail = eventObj[0].attributes
        })
        .catch(console.error())
    }
  }
}
</script>

<style scoped>
  .detail-container {
    margin-top: 20px;
    padding: 10px;
    width: 50%;
  }

  .detail-img {
    padding: 10px 0;
    height: 120px;
    width: 200px;
  }
</style>
