<template>
  <div>
    <div class="page-title">{{date}}</div>
    <section class="info-section card flex">
      <div class="info" v-for="(value, key) in info" :key="key.id">
        <div class="info-key">{{key}}</div>
        <div class="info-value">{{value}}</div>
      </div>
    </section>
    <section class="card-section flex">
      <template v-for="nav of navs">
        <router-link class="nav-entry card" :to="{name: nav.name}" :key="nav.id">
          <div class="nav-title flex-center">{{nav.title}}</div>
          <div class="nav-content">{{nav.text}}</div>
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
      info: {
        username: '',
        role: ''
      },
      navs: [{
        name: 'course',
        title: 'Regular Course',
        text: 'Create or manage courses.'
      }, {
        name: 'event',
        title: 'Special Event',
        text: 'Create or manage events.'
      }, {
        name: 'archive',
        title: 'Archive',
        text: 'View expired courses and events.'
      }
      ]
    }
  },
  computed: {
    date () {
      return (new Date()).toDateString()
    }
  },
  mounted () {
    this.queryUser()
    // this.queryCount()
  },
  methods: {
    queryUser () {
      let AV = this.$AV
      let currentUser = AV.User.current().attributes
      this.info.username = currentUser.username
      this.info.role = (currentUser.isAdmin) ? 'admin' : 'visitor'
    },
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

  .info-section {
    margin-top: 20px;
    width: 840px;
  }

  .info {
    margin: 0 10px;
  }

  .info-key {
    font-size: 15px;
    margin-bottom: 5px;
    color: #42b983;
  }

  .info-value {
    font-size: 20px;
  }

  .card-section {
    margin-top: 30px;
    flex-wrap: wrap;
  }

  .nav-entry {
    width: 260px;
    height: 280px;
    margin-bottom: 20px;
    margin-right: 30px;
    color: #2c3e50;
    box-shadow: 3px 3px 8px 1px #bfcbd962;
  }

  .nav-entry:hover {
    border-color: #42b983;
    transition: all .5s;
  }

  .nav-title {
    font-size: 18px;
    padding: 5px;
  }

  .nav-content {
    font-size: 14px;
    padding: 3px;
    line-height: 20px;
    text-align: center;
  }
</style>
