
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return undefined
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
}
export function dayDiffFromNow (endTime, baseTime) {
  // const now = new Date().getTime()
  // endTime = new Date(endTime).getTime()
  return Math.floor((endTime - baseTime) / (24 * 3600 * 1000))
}
/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
// 压缩数字为100k这种
export function shortenLargeNumber (num, digits) {
  const units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  let decimal = null

  for (let i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1)
    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    }
  }
  return num
}
// 获取国家码
export function getCountryCode (language) {
  const arr = language.toLowerCase().split('-')
  const firstCode = arr.slice(0, 1)[0]
  const lastCode = arr.slice(-1)[0]
  if (firstCode === 'zh') {
    if (lastCode === 'sg') {
      return 'SG'
    }
    return 'CN'
  }
  if (firstCode === 'gsw') {
    return 'FR'
  }
  if (lastCode === 'latn') {
    return 'ES'
  }
  if (['az-Cyrl', 'az-Latn', 'az-Latn-AZ', 'az-Cyrl-AZ'].includes(language)) {
    return 'AZ'
  }
  if (['bs-Latn', 'bs-Cyrl', 'bs-Latn-BS', 'bs-Cyrl-BS'].includes(language)) {
    return 'FR'
  }
  if (['ha-Latn', 'ha-Latn-NG'].includes(language)) {
    return 'NG'
  }
  if (firstCode === 'mk') {
    return 'MK'
  }
  if (['sr-Latn', 'sr-Cyrl'].includes(language)) {
    return 'RS'
  }
  if (language === 'tg-Cyrl') {
    return 'TJ'
  }
  if (language === 'tzm-Latn') {
    return 'DZ'
  }
  if (['iu-Latn', 'iu-Cans'].includes(language)) {
    return 'CA'
  }
  if (language === 'en-029') {
    return 'CU'
  }
  return lastCode.toUpperCase()
}
export function getRandom (n, m) {
  return Math.floor(Math.random() * (m - n + 1) + n)
}
export function isObj (obj) {
  const typeCheck = typeof obj !== 'undefined' && typeof obj === 'object' && obj !== null
  return typeCheck && Object.keys(obj).length > 0
}
