import apiGatewayClient from 'services/axios/apiGatewayClient'
/* eslint-disable */
export const getTimeLine = async (entityId, businessId, userId) => {
  return apiGatewayClient
    .get(`/event-service/external/${entityId}`, { businessId, userId })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
