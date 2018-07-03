<template>
  <div>
    <div class="page-title">Dashboard</div>
    <section class="info-section card">
      <div>管理员：{{admin}}</div>
      <div>用户数量：{{count}}</div>
    </section>
    <section class="card-section flex">
      <div class="card form-entry">Course</div>
      <div class="card form-entry">Event</div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      count: ''
    }
  },
  computed: {
    admin () {
      let AV = this.$AV
      let currentUser = AV.User.current().attributes.username
      return `${currentUser}`
    }
  },
  mounted () {
    // this.queryCount()
  },
  methods: {
    queryCount () {
      let AV = this.$AV
      let query = new AV.Query('_User')
      query.equalTo('isAdmin', false)
      query.count().then(count => {
        console.log(count)
        this.count = count
      }).catch(console.error())
    }
  }
}
</script>

<style scoped>
.page-title {
  font-size: 30px;
}

.info-section,
.card-section {
  margin-top: 20px;
}

.info-section {
  width: 600px;
}

.form-entry {
  width: 200px;
  margin-right: 20px;
}
</style>
