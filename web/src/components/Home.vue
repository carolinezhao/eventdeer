<template>
  <div class="page-container flex">
    <section class="navbar-container">
      <router-link :to="{name: 'dashboard'}">
        <div class="top-btn flex-center">Home</div>
      </router-link>
      <div class="navbar flex-col">
        <template v-for="nav in navs">
          <!-- to='string' :to='js' -->
          <router-link :to="{name: nav.text.toLowerCase()}" :key="nav.id">
            <div class="nav-inner flex-col">
              <i class="iconfont" :class="nav.icon"></i>
              <div class="nav-text"></div>{{nav.text}}</div>
          </router-link>
        </template>
      </div>
      <div class="nav-logout" @click="logout">Logout</div>
    </section>

    <section class="navbar-placeholder"></section>

    <section class="content-container">
      <transition name="slide-fade">
        <router-view></router-view>
      </transition>
    </section>

    <home-dialog :dialog="dialogMsg" :isAlert="isAlert" @confirm="execute" @close="close"></home-dialog>
  </div>
</template>

<script>
import Dialog from '@/components/Dialog'
export default {
  name: 'home',
  components: {
    homeDialog: Dialog
  },
  data () {
    return {
      navs: [{
        text: 'Course',
        icon: 'icon-kecheng1'
      }, {
        text: 'Event',
        icon: 'icon-taolun'
      }],
      dialogMsg: '',
      isAlert: false
    }
  },
  methods: {
    logout () {
      this.dialogMsg = 'Are you sure you want to logout?'
      this.$dialog.confirm({})
        .then((value) => {
          console.log(value)
          this.dialogMsg = ''
          let AV = this.$AV
          AV.User.logOut()
          // console.log('已登出')
          this.$router.push('/login')
        }).catch()
    },
    execute () {
      this.$dialog.util.promiseResolver()
    },
    close () {
      this.dialogMsg = ''
    }
  }
}
</script>

<style scoped>
  .page-container {
    width: 100%;
    font-size: 16px;
  }

  .content-container {
    width: 90%;
    padding: 20px 25px;
  }

  .navbar-placeholder {
    width: 8%;
    min-width: 100px;
  }

  .navbar-container {
    width: 8%;
    min-width: 100px;
    background-color: #bfcbd9;
    height: 100vh;
    position: fixed;
  }

  .top-btn {
    height: 10%;
    min-height: 60px;
    background-color: #2c3e50;
    color: #fff;
    font-weight: 500;
    font-size: 17px;
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

  .nav-text {
    margin-top: 5px;
  }

  .nav-logout {
    background-color: #f66;
    color: #fff;
    cursor: pointer;
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

<style scoped src="../assets/iconfont.css"></style>
