import axios from 'axios'
import { history } from 'index'
import store from 'store'

// const history = createBrowserHistory({
//   basname: ''
// })

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
})

apiClient.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    //  request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.Authorization = `Bearer ${accessToken}`
    if (request?.params?.businessId) {
      request.headers['x-business-id'] = request?.params?.businessId
      delete request?.params?.businessId
    }
  }
  return request
})

apiClient.interceptors.response.use(undefined, error => {
  // Errors handling
  const { response } = error
  if (response.status === 401) {
    history.push('/auth/login')
  }
  return response
})

export default apiClient
