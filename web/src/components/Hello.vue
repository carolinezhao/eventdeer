<template>
  <div>
    <h2>{{msg}}</h2>
    <h2>Login</h2>
    <label>Username</label>
    <input placeholder="Enter your username">
    <label>Password</label>
    <input placeholder="Enter your password">
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      msg: 'Welcome to EventDeer'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}
</style>
