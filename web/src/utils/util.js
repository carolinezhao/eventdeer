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
