<template>
  <transition name="slide-fade">
      <section class="msg-section card flex-center" :class="message.type" v-if="ifShowMsg">
        <div class="msg-text">{{message.text}}</div>
      </section>
  </transition>
</template>

<script>
export default {
  props: ['message', 'ifShowMsg']
}
</script>

<style scoped>
  .msg-section {
    height: 50px;
    width: 400px;
    box-shadow: 0 0 2px 2px #bfcbd962;
    position: absolute;
    left: 30%;
    top: 20%;
    z-index: 100;
  }

  .success {
    border-color: #a5dc86;
    background-color: #e7f5e0;
  }

  .fail {
    border-color: #f66;
    background-color: rgb(252, 232, 232);
  }

  .msg-text {
    font-size: 16px;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(10px);
    opacity: 0;
  }
</style>
