import axios from 'axios'

axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api/'

let requestCache = {
  tasks: {},
  checkTask(config) {
    const urlToken = `${config.url}&${config.method}`
    return this.tasks.hasOwnProperty(urlToken)
  },
  addTask(config) {
    const urlToken = `${config.url}&${config.method}`
    this.tasks[urlToken] = undefined
  },
  completeTask(config) {
    const urlToken = `${config.url}&${config.method}`
    delete this.tasks[urlToken]
  }
}

const cancelToken = axios.CancelToken
let tempConfig

axios.interceptors.request.use(
  config => {
    config.cancelToken = new cancelToken(cancel => {
      if (requestCache.checkTask(config)) {
        cancel('Duplicate Request')
        tempConfig = config
      } else {
        requestCache.addTask(config)
      }
    })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // Cancel: Duplicate Request
    if (!error.config) {
      console.log(error.toString())
    }

    // Network: Connection timeout or network error
    if (
      error.code === 'ECONNABORTED' ||
      error.message.indexOf('timeout') !== -1 ||
      error.name === 'Error'
    ) {
      requestCache.completeTask(error.config)
      console.log('Network: Connection timeout or network error')
    }

    return Promise.reject(error)
  }
)

export default axios
