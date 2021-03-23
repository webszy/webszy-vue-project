import axios from 'axios'
import axiosRetry from 'axios-retry'
import to from 'await-to-js'
import {isObj} from '@/utils'
const Service = axios.create({
  timeout: 12 * 1000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
const ServiceWithoutRetry = axios.create({
  timeout: 12 * 1000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
Service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const message = error.config.method + ': ' + error.config.url +'  '+ error.message
    console.log('network error', message)
  }
)
ServiceWithoutRetry.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const message = error.config.method + ': ' + error.config.url +'  '+ error.message
    console.log('network error', message)
  }
)
axiosRetry(Service, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay
})


export async function _get (url, qs, headers) {
  const params = {
    url,
    method: 'get',
    params: isObj(qs) ? qs : ''
  }
  if (isObj(headers)) { params.headers = headers }
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return false
  }
}
export async function _getNoRetry (url, qs, headers) {
  const params = {
    url,
    method: 'get',
    params: isObj(qs) ? qs : ''
  }
  if (isObj(headers)) { params.headers = headers }
  const [err, res] = await to(ServiceWithoutRetry(params))
  if (!err && res) {
    return res
  } else {
    return false
  }
}
export async function _post (url, qs, body) {
  const params = {
    url,
    method: 'post',
    params: isObj(qs) ? qs : {},
    data: isObj(body) ? body : {}
  }
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return console.log(err)
  }
}
export async function _postWithoutRetry (url, qs, body) {
  const params = {
    url,
    method: 'post',
    params: isObj(qs) ? qs : {},
    data: isObj(body) ? body : {}
  }
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return console.log(err)
  }
}
export async function _put (url, qs, body) {
  const params = {
    url,
    method: 'put',
    params: isObj(qs) ? qs : {},
    data: isObj(body) ? body : {}
  }
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return console.log(err)
  }
}
export async function _delete (url, qs) {
  const params = {
    url,
    method: 'delete',
    params: isObj(qs) ? qs : ''
  }
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return console.log(err)
  }
}
export default Service
