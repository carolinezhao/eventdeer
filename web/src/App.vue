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
    border: 1px solid #bfcbd9;
    color: #2c3e50;
  }

  /* button size */

  button.small {
    font-size: 14px;
    width: 70px;
    padding: 5px 0;
  }

  /* button color */

  button.main {
    background-color: #42b983;
    border-color: #42b983;
    color: #fff;
    font-size: 16px;
  }

  button.danger {
    background-color: #f66;
    border-color: #f66;
    color: #fff;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .theme-bg-color {
    background-color: #42b983;
  }
</style>
