<template>
  <div class="page-container flex">
    <section class="navbar-container">
      <router-link to="/home">
        <div class="top-btn flex-center">Dashboard</div>
      </router-link>
      <div class="navbar flex-col">
        <template v-for="nav in navs">
          <!-- to='string' :to='js' -->
          <router-link :to="'/home/' + nav.toLowerCase()" v-bind:key="nav.id">
            <div class="nav-inner">{{nav}}</div>
          </router-link>
        </template>
      </div>

      <!-- 路径 '/' 必须有 exact，否则永远是 active 状态 -->
      <!-- <router-link to="/" exact> -->
      <div class="nav-logout" v-on:click="logout">Logout</div>
      <!-- </router-link> -->
    </section>

    <section class="home-content">
      <!-- 渲染路由匹配到的组件 -->
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      navs: ['Course', 'Event']
    }
  },
  methods: {
    logout () {
      let AV = this.$AV
      AV.User.logOut()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
  .page-container {
    width: 100%;
    font-size: 16px;
  }

  .home-content {
    width: 90%;
    padding: 20px;
  }

  .navbar-container {
    width: 10%;
    min-width: 100px;
    background-color: #bfcbd9;
    height: 100vh;
  }

  .top-btn {
    height: 10%;
    min-height: 60px;
    background-color: #2c3e50;
    color: #fff;
  }

  .navbar {
    height: 75%;
  }

  .nav-inner,
  .nav-logout {
    text-align: center;
    color: #2c3e50;
    padding: 15px 0;
  }

  .nav-inner:hover {
    background-color: #61788d;
    color: #fff;
    transition: all .5s;
  }

  .nav-logout {
    background-color: #f66;
    color: #fff;
  }

  .nav-logout:hover {
    background-color: #e04e4e;
    border-color: #e04e4e;
    transition: all .5s;
  }

  /* <router-link> 匹配到对应路由时，自动添加 class="router-link-active" */

  .router-link-active {
    background-color: #61788d;
  }

  .router-link-active .nav-inner {
    color: #fff;
  }
</style>
