<template>
  <div class="page-container flex-center">
    <section class="content-container flex-col">
      <div class="logo-container">
        <img class="logo" src="../assets/eventdeer.png">
      </div>
      <h2 class="page-title">{{msg}}</h2>
      <form action="">
        <div class="flex-col flex-container">
          <input class="login-input" type="text" placeholder="Username" autocomplete="">
          <input class="login-input" type="password" placeholder="Password" autocomplete="">
          <button class="main-button login-button" type="submit">Login</button>
        </div>
      </form>
    </section>
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
    height: 100vh;
    box-sizing: border-box;
    padding-bottom: 45px;
  }

  .content-container {
    height: 360px;
    width: 55%;
    padding: 40px 10px;
    box-shadow: 0 0 10px 5px #dedede75;
    border-radius: 10px;
    justify-content: space-around;
    align-items: center;
  }

  .logo-container {
    width: 100px;
    height: 100px;
  }

  .logo {
    width: 100%;
  }

  .page-title {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-weight: normal;
  }

  .flex-container {
    justify-content: space-around;
    align-items: center;
    height: 160px;
  }

  .login-input,
  .login-button {
    padding: 5px 10px;
    height: 40px;
    width: 220px;
  }

  .login-button {
    font-size: 16px;
  }
</style>
