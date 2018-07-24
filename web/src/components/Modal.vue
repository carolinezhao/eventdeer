<template>
  <div class="modal-container light flex-center" v-if="confirmMsg">
    <transition>
    <section class="modal-section card flex-col">
      <div class="modal-content flex-center modal-msg">{{confirmMsg}}</div>
      <div class="modal-footer flex">
        <button class="primary-btn small-btn" v-if="!isAlert" @click="$emit('close')">Cancel</button>
        <button class="main-btn small-btn" v-if="!isAlert" @click="$emit('confirm')">Confirm</button>
        <button class="main-btn small-btn" v-if="isAlert" @click="$emit('close')">OK</button>
      </div>
    </section>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['confirmMsg', 'isAlert'],
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  .modal-section {
    height: 200px;
    width: 450px;
    background-color: #fff;
    box-shadow: 0 0 2px 2px #bfcbd962;
  }

  .modal-content {
    height: 145px;
  }

  .modal-footer {
    height: 55px;
    align-items: center;
    justify-content: flex-end;
  }

  .modal-msg {
    font-size: 16px;
  }
</style>
