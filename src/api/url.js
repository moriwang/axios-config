const urls = {
  sampleGet: {
    requestURL(path) {
      return `userinfo/ + ${path}`
    },
    onSuccuess: 'Get Request Success',
    onFail: 'Get Request Fail'
  },
  samplePost: {
    requestURL(path) {
      return `userinfo/ + ${path}`
    },
    onSuccess: 'Post Request Success',
    onFail: 'Post Request Fail'
  }
}

export default urls
