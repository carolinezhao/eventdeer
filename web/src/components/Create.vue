<template>
  <div class="page-container">
    <div class="path">Location: ... / Create a Course</div>
    <form>
      <div class="row">
        <label>Course Type</label>
        <div class="content">
          <select id="">
            <option value="FTClass">FTClass</option>
            <option value="Extend">Extend</option>
            <option value="GroupChat">GroupChat</option>
          </select>
        </div>
      </div>

      <div class="row">
        <label>Start Time</label>
        <div class="content">
          <input class="short" maxlength="2"> : 00
        </div>
      </div>

      <div class="row">
        <label>Description</label>
        <div class="content">
          <template v-if="false">
            <label>Unit</label>
            <input class="short" maxlength="2">
          </template>
          <template v-else>
            <label>Level</label>
            <input class="short" maxlength="2"> -
            <input class="short" maxlength="2">
          </template>
        </div>
      </div>

      <div class="row">
        <label>VIP</label>
        <div class="content">
          <select name="type" id="">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>

      <div class="row button">
        <div class="content">
          <button type="submit">Create</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Create',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    padding: 20px;
  }

  .path {
    background-color: #bfcbd9;
  }

  form {
    padding: 20px 0;
  }

  .row {
    display: table;
    width: 100%;
    height: 40px;
  }

  .row>label,
  .row>.content {
    display: table-cell;
    vertical-align: middle;
  }

  .row>label {
    width: 20%;
    text-align: right;
    padding-right: 20px;
  }

  .row.button {
    padding-left: 20%;
    margin-top: 20px;
  }

  input.short {
    width: 32px;
    padding: 5px 5px 6px;

  }

  select,
  input {
    border: 1px solid #bfcbd9;
    height: 25px;
    font-size: 15px;
    color: #2c3e50;
    text-align: center;
  }

  button {
    height: 30px;
    width: 100px;
  }
</style>
