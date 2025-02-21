import apiClient from 'services/axios'
/* eslint-disable */
export const fetchAllPayments = async ({ qryString }) => {
  return apiClient
    .get(`payments?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchPaymentDetails = async ({ paymentId }) => {
  return apiClient
    .get(`payments/${paymentId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
