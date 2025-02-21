// import apiClient from 'services/axios'
import axios from 'axios'
/* eslint-disable */

const url = process.env.REACT_APP_API_URL.replace(/admin/g, '')
export async function fetchCurrency() {
  return axios
    .get(`${url}utility/public/currencies`)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function fetchCountry() {
  return axios
    .get(`${url}utility/public/countries`)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}
