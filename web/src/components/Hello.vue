<template>
  <div class="page-container">
    <img src="../assets/eventdeer.png">
    <h2>{{msg}}</h2>
    <form action="">
      <div class="flex-col flex-container">
        <input type="text" placeholder="Username" autocomplete="">
        <input type="password" placeholder="Password" autocomplete="">
        <button type="submit" class="main">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      msg: 'EventDeer Dashboard'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-container {
    text-align: center;
    margin-top: 60px;
  }

  .flex-container {
    justify-content: space-around;
    align-items: center;
    height: 150px;
  }

  h2 {
    font-weight: normal;
  }

  input,
  button {
    padding: 5px 10px;
    height: 40px;
    width: 220px;
  }

  input {
    border: 1px solid #42b983;
    font-size: 15px;
  }
</style>
