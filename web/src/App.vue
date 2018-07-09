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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  body {
    margin: 0;
  }

  a {
    text-decoration: none;
  }

  input,
  select,
  button {
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #bfcbd9;
    color: #2c3e50;
    outline: none;
  }

  input:not([type="checkbox"]),
  select {
    height: 25px;
    font-size: 15px;
  }

  input:focus {
    border-color: #42b983;
  }

  .short-input {
    text-align: center;
    width: 32px;
    padding: 5px 5px 6px;
  }

  /* button color */

  .primary-button:hover {
    border-color: #42b983;
    color: #42b983;
    transition: all .5s;
  }

  .main-button {
    background-color: #42b983;
    border-color: #42b983;
    color: #fff;
  }

  .main-button:hover {
    background-color: #309c6b;
    border-color: #309c6b;
    transition: all .5s;
  }

  .danger-button {
    background-color: #f66;
    border-color: #f66;
    color: #fff;
  }

  .danger-button:hover {
    background-color: #e04e4e;
    border-color: #e04e4e;
    transition: all .5s;
  }

  /* button size */

  .small-button {
    font-size: 14px;
    width: 70px;
    height: 25px;
    margin-right: 10px;
  }

  /* layout */

  .flex {
    display: flex;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* form-row: form-label(left), form-content(right) */

  .form-row {
    display: table;
    width: 100%;
    height: 40px;
  }

  .form-label,
  .form-content {
    display: table-cell;
    vertical-align: middle;
  }

  .form-label {
    width: 40%;
    text-align: right;
    padding-right: 20px;
  }

  /* common styles */

  .card {
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #bfcbd9;
    padding: 10px;
  }

  /* msg */

  .err-msg {
    color: #f66;
    font-size: 12px;
  }

  .operation-msg {
    font-weight: 300;
    font-size: 14px;
    margin-top: 10px;
  }
</style>
