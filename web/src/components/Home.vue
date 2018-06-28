<template>
  <div>
    <router-link to="/home/course">Course</router-link>
    <router-link to="/home/event">Event</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
</style>
