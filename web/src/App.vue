<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  input,
  button,
  select {
    box-sizing: border-box;
    border-radius: 5px;
  }

  button {
    background-color: #42b983;
    border: 1px solid #42b983;
    color: #fff;
    font-size: 15px;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .theme-color {
    color: #42b983
  }

  .theme-bg-color {
    background-color: #42b983;
  }
</style>
