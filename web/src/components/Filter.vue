<template>
  <div class="filter-container card">
    <div class="form-row" v-for="filter in filters" :key="filter.id">
      <label class="form-label filter-label">{{filter.name}}</label>
      <div class="form-content">
        <div class="form-content filter-option" v-for="option in filter.options" :key="option.id">
          <input type="checkbox" :value="{key: filter.key, value: option}" v-model="checkedObjs">
          <label>{{option}}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['filters'],
  data () {
    return {
      checkedObjs: [] // 选中的对象，准备传给父组件
    }
  },
  watch: {
    checkedObjs (newValue, oldValue) {
      this.$emit('input', newValue) // 向父组件的 v-model 传值
    }
  },
  methods: {
    empty () { // 由父组件调用，清空选中的对象
      this.checkedObjs = []
    }
  }
}
</script>

<style scoped>
  .filter-container {
    border-radius: 5px 5px 0 0;
    padding: 10px;
  }

  .filter-label {
    width: 20%;
  }

  .filter-option {
    width: 120px;
    background-color: #bfcbd9;
    padding-top: 2px;
  }
</style>
