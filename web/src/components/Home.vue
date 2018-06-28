<template>
  <div class="page-container flex">
    <section class="home-navbar flex-col">
      <div class="top-fixed flex-col">eventdeer</div>
      <router-link to="/home/course">
        <div class="nav-inner">Course</div>
      </router-link>
      <router-link to="/home/event">
        <div class="nav-inner">Event</div>
      </router-link>
    </section>

    <section class="home-content">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
  .page-container {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
  }

  .home-content {
    width: 90%;
    padding: 20px;
  }

  .home-navbar {
    width: 10%;
    background-color: #bfcbd9;
  }

  .top-fixed {
    background-color: #2c3e50;
    color: #fff;
    height: 60px;
    justify-content: center;
    align-items: center;
  }

  .nav-inner {
    text-align: center;
    color: #2c3e50;
    padding: 15px 0;
  }

  .nav-inner:hover {
    background-color: #2c3e5080;
    color: #fff;
    transition: all .5s;
  }
</style>
