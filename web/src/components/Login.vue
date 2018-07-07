<template>
  <div class="page-container flex-center">
    <section class="content-container flex-col">
      <div class="logo-container">
        <img class="logo" src="../assets/eventdeer.png">
      </div>
      <h2 class="page-title">{{title}}</h2>
      <form>
        <div class="flex-col flex-container">
          <input v-model="username" class="login-input" type="text" placeholder="Username" autocomplete="" required autofocus>
          <input v-model="password" class="login-input" type="password" placeholder="Password" autocomplete="" required>
          <div class="err-msg">{{errMsg}}</div>
          <button v-on:click="login" class="main-button login-button" type="submit">Login</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      title: 'EventDeer Dashboard',
      username: '',
      password: '',
      errMsg: ''
    }
  },
  methods: {
    login (e) {
      e.preventDefault()
      // LeanCloud SDK
      let AV = this.$AV
      AV.User.logIn(this.username, this.password)
        .then((res) => {
          console.log(res.attributes.username + ' 登录成功')
          this.$router.push('/home')
        })
        .catch((res) => {
          console.error()
          this.errMsg = res.rawMessage
        })
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
    height: 170px;
  }

  .login-input,
  .login-button {
    padding: 5px 10px;
    height: 40px;
    width: 220px;
  }

  .login-button {
    font-size: 16px;
    margin-top: 8px;
  }
</style>
