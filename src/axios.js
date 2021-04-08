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
    requestCache.completeTask(response.config)
    return response
  },
  error => {
    // cancellation
    if (!error.config) {
      console.warn(error.toString()) // Cancel: Duplicate Request
      return Promise.reject(error)
    } else {
      requestCache.completeTask(error.config)
    }

    // Error Handling
    if (!error.response) {
      console.warn(error.toString()) // Error: timeout out of exceed
    } else {
      const response = error.response
      if (response.status === 500) {
        console.warn(error.toString()) // Error: connection lost
      }
      if (response.status === 401) {
        // Handle other error
      }
    }
    return Promise.reject(error)
  }
)

export default axios
