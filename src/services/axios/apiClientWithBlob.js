import axios from 'axios'
import store from 'store'
import { notification } from 'antd'

const apiClientWithBlob = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  responseType: 'arraybuffer',
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
})

apiClientWithBlob.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    //  request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.Authorization = `Bearer ${accessToken}`
  }
  return request
})

apiClientWithBlob.interceptors.response.use(undefined, error => {
  // Errors handling
  const { response } = error
  const { data } = response
  if (data && data.message) {
    notification.warning({
      message: data.message,
    })
  }
})

export default apiClientWithBlob
