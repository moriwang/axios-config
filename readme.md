
### How to use

don't use in production, this repo is just for study purpose.

**Define Actions for api** 

See [url.js](src/api/url.js).

```js
sampleAPI: {
  requestURL(path) {
    return `sampleAPI/ + ${path}`
  },
  onSuccess: 'Get Request Success',
  onFail: 'Get Request Fail'
},
```

**Support Methods**
* get(action, parameter, [path])
* post(type, action, parameter, [path])
  * type: `json` or `qs` 


**Sample Code**
```js
get('sampleGet', parameters, path)
  .then(res => {
    let [res, message] = res
    // do something
  })
  .catch(err => {
    let [err, message] = err
    // do something else
  })

post('json', 'samplePost', parameters, path)
```
