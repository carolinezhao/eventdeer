<template>
  <div class="page-container flex">
    <section class="home-navbar flex-col">
      <div class="top-fixed flex-center">eventdeer</div>
      <router-link to="/home/course">
        <div class="nav-inner">Course</div>
      </router-link>
      <router-link to="/home/event">
        <div class="nav-inner">Event</div>
      </router-link>
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

  .home-navbar {
    width: 10%;
    background-color: #bfcbd9;
    height: 100vh;
  }

  .top-fixed {
    background-color: #2c3e50;
    color: #fff;
    height: 60px;
  }

  .nav-inner {
    text-align: center;
    color: #2c3e50;
    padding: 15px 0;
  }

  .nav-inner:hover {
    background-color: #61788d;
    color: #fff;
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
