import axios from '../axios'
import urls from '../api/url'
import qs from 'qs'

export function get(action, parameter, path = '') {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: urls[action].requestURL(path),
      params: parameter
    })
      .then(res => {
        let message = urls[action].onSuccess
        resolve([res, message])
      })
      .catch(err => {
        let message = urls[action].onFail
        reject(err, message)
      })
  })
}

export function post(type, action, parameter, path = '') {
  let args = {}
  if (type === 'json') {
    args = {
      data: JSON.stringify(parameter),
      headers: { 'Content-Type': 'application/json' }
    }
  } else if (type === 'qs') {
    args = {
      data: qs.stringify(parameter)
    }
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: urls[action].requestURL(path),
      ...args
    })
      .then(res => {
        let message = urls[action].onSuccess
        resolve([res, message])
      })
      .catch(err => {
        let message = urls[action].onFail
        reject([err, message])
      })
  })
}
