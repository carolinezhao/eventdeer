<template>
  <div>
    <div class="page-title">{{date}}</div>
    <section class="info-section card">
      <div>管理员：{{admin}}</div>
      <div>用户数量：{{count}}</div>
    </section>
    <section class="card-section flex">
      <template v-for="nav in navs">
        <router-link class="card form-entry" :to="{name: nav.toLowerCase()}" :key="nav.id">
          <div>{{nav}}</div>
        </router-link>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      count: '',
      navs: ['Course', 'Event', 'Activity1']
    }
  },
  computed: {
    date () {
      return (new Date()).toDateString()
    },
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
  font-size: 23px;
  font-weight: 300;
}

.info-section,
.card-section {
  margin-top: 20px;
}

.info-section {
  width: 600px;
}

.card-section {
  flex-wrap: wrap;
}

.form-entry {
  width: 200px;
  margin-bottom: 20px;
  margin-right: 20px;
  border-left: 4px solid #42b983;
  color: #2c3e50;
}

.form-entry:hover {
  background-color: #e4eaf0c7;
  transition: all .5s;
}
</style>
