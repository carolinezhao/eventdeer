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

  input:not([type="file"]),
  textarea,
  select,
  button {
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #bfcbd9;
    color: #2c3e50;
    outline: none;
  }

  button {
    cursor: pointer;
  }

  button[disabled] {
    opacity: .5; /* 会导致穿透 modal window */
    pointer-events: none;
    cursor: not-allowed;
  }

  input[type="file"] {
    font-size: 13px;
    outline: none;
  }

  input[type="text"],
  input[type="password"],
  select {
    height: 27px;
    font-size: 15px;
  }

  input:focus,
  textarea:focus {
    border-color: #42b983;
  }

  textarea {
    resize: none;
    padding: 8px;
    font-size: 15px;
    margin-top: 3px;
    line-height: 20px;
    box-shadow: 0 0 2px 2px #dedede75 inset;
  }

  .short-input {
    text-align: center;
    width: 32px;
    padding: 5px 5px 6px;
  }

  .input,
  .lg-input {
    padding: 7px 7px 8px;
  }

  .input {
    width: 100px;
  }

  .lg-input {
    width: 240px;
  }

  /* button color */

  .primary-button {
    background-color: #fff;
  }

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
    height: 27px;
    margin-right: 12px;
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

  /* form for Course and Event */

  .form-container {
    width: 100%;
    height: 100vh;
    background-color: rgba(66, 66, 66, 0.7);
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    padding-bottom: 10%;
  }

  .form-section {
    border: 2px solid #bfcbd9;
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
  }

  .form-title {
    border-bottom: 1px solid #bfcbd9;
    height: 45px;
    font-weight: 500;
  }

  .form-footer {
    border-top: 1px solid #bfcbd9;
    height: 50px;
    padding-left: 10px;
    align-items: center;
    justify-content: flex-end;
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

  /* msg: err-msg for form; operation-msg for table */

  .err-msg {
    color: #f66;
    font-size: 12px;
  }

  .operation-msg {
    font-weight: 300;
    font-size: 14px;
  }
</style>
