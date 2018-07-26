export function displayTime (timeObj, duration) {
  let hour = timeObj.getHours()
  return (duration === undefined) ? `${hour}:00` : `${hour}:00-${hour + duration}:00`
}

export function displayDate (timeObj) {
  return timeObj.toDateString()
}

export function formatTime (string) {
  let currentYear = (new Date()).getFullYear()
  let currentMonth = (new Date()).getMonth()
  let currentDate = (new Date()).getDate()
  let tmrDate = (new Date()).getDate() + 1
  switch (string) {
    case 'today':
      // 当天零点
      return new Date(currentYear, currentMonth, currentDate)
    case 'tomorrow':
      // 次日零点
      return new Date(currentYear, currentMonth, tmrDate)
    default:
      // 点击日历选择的日期
      // return new Date(Date.parse(string)); // iOS 不支持
      return new Date(string)
  }
  // new Date() 创建的是 GMT 时间；后端存储是 GMT+8(CST)
}

export function continuousNum (start, end) {
  let numsArr = []
  while (start <= end) {
    numsArr.push(start)
    start++
  }
  return numsArr
}

export function checkNumber (value) {
  if (value && (typeof value !== 'number')) {
    return 'Please enter number'
  }
}

export function operationMsg (string, number) { // 均在异步操作后调用
  switch (string) {
    case 'create':
      return {
        text: 'Created successfully!',
        type: 'success'
      }
    case 'save':
      return {
        text: 'The change has been saved.',
        type: 'success'
      }
    case 'remove':
      let plural = (number === 1) ? 'item' : 'items'
      return {
        text: `Removed ${number} ${plural} successfully.`,
        type: 'success'
      }
    case 'fail':
      return {
        text: 'The operation failed. Please try again later.',
        type: 'fail'
      }
    default:
      break
  }
}
