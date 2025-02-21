import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllRefunds = async ({ qryString }) => {
  return apiClient
    .get(`refunds?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchRefundDetails = async ({ refundId }) => {
  return apiClient
    .get(`refunds/${refundId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
