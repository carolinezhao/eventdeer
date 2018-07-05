# 表格组件及组件间传值

## 结构和功能

有多个数据表，数据来源不同，但结构相同。

```js
[{
  id: number,
  key_1: value_1,
  key_2: value_2
}, {
  id: number,
  key_1: value_1,
  key_2: value_2
}]
```
id 是数据存储到后端时自动生成的，用于识别数据，不展示。

用表格展示的数据如下，点击 checkbox 可以选中对应行的数据进行操作。

| checkbox | key_1 | key_2 | key_n |
| --- | --- | --- | --- |
| checkbox | value_1 | value_2 | value_n |
| checkbox | value_1 | value_2 | value_n |

为了便于多次复用，将表格抽象为组件。


## 表格组件

子组件表格主体结构如下。其中 `objsArray` 是需要父组件传入的对象数组。

```html
<tbody>
  <tr v-for="(object, index) in objsArray" v-bind:key="object.id">
    <td>
      <input type="checkbox" v-bind:value="{index: index, id: object.id}" v-model="checkedObjs">
    </td>
    <td v-for="(value, key) in object" v-bind:key="value.id" v-if="!(key === 'id')">
      {{value}}
    </td>
  </tr>
</tbody>
```
行 `<tr>` 依次对应的是对象数组中的每个对象。<br>
列 `<td>` 依次对应的是对象中的每个属性值（第 1 列是 checkbox）。

操作数组要用到的值有：
- 对象的 `id` 属性：用于在后端识别对象
- 对象在数组中的位置 `index`：用于在前端识别对象

因此把这两项值绑定到 `<input>` 的 `value` 属性中。

如果希望选中多个对象进行操作，则需要把所有 `<input>` 绑定到同一个数组，即使用相同的 `v-model`。

选中某个 checkbox 后，其对应的 value 值会被添加到 `checkedObjs` 数组中；取消选择，则自动从数组中删除。

reference: [多个复选框绑定到同一数组](https://cn.vuejs.org/v2/guide/forms.html#%E5%A4%8D%E9%80%89%E6%A1%86)


## 组件间传值

### 子组件

如前所述，`objsArray` 来自父组件传值，写入 `props` 中。`checkedObjs` 数组接收选中的对象信息。

```js
export default {
  props: ['objsArray'],
  data () {
    return {
      checkedObjs: []
    }
  },
  watch: {
    checkedObjs (newValue, oldValue) {
      this.$emit('input', newValue)
    }
  }
}
```

reference: [侦听器](https://cn.vuejs.org/v2/guide/computed.html#%E4%BE%A6%E5%90%AC%E5%99%A8)

### 父组件

`courses` 数组是从后端获取到的数据，通过 `objsArray` 传值给子组件。

`checkedCourses` 数组接收子组件传来的 `checkedObjs` 的值。

```html
<section class="table-section">
  <course-table v-bind:objsArray="courses" v-model="checkedCourses"></course-table>
</section>
```
