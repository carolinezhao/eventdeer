<template>
  <div class="modal-container light flex-center" v-if="dialog">
    <transition>
    <section class="dialog-section card flex-col">
      <div class="dialog-content dialog-msg flex-center">{{dialog}}</div>
      <div class="dialog-footer flex">
        <button class="main-btn small-btn" v-if="isAlert" @click="$emit('close')">OK</button>
        <button class="primary-btn small-btn" v-if="!isAlert" @click="$emit('close')">Cancel</button>
        <button class="main-btn small-btn" v-if="!isAlert" @click="$emit('confirm')">Confirm</button>
      </div>
    </section>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['dialog', 'isAlert'],
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  .modal-container.light {
    background-color: initial;
    padding-bottom: 25%;
  }

  .dialog-section {
    height: 200px;
    width: 450px;
    background-color: #fff;
    box-shadow: 0 0 2px 2px #bfcbd962;
  }

  .dialog-content {
    height: 145px;
  }

  .dialog-footer {
    height: 55px;
    align-items: center;
    justify-content: flex-end;
  }

  .dialog-msg {
    font-size: 16px;
  }
</style>
