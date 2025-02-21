import apiClient from 'services/axios'

export async function fetchAllBusiness({ qryString }) {
  return apiClient
    .get(`${process.env.REACT_APP_API_GATEWAY_URL}/event-trigger/internal/businesses?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchAllOnboardingReviewBusiness({ qryString }) {
  return apiClient
    .get(`businesses/onboardingreview?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessDetails({ businessId }) {
  return apiClient
    .get(`businesses/${businessId}`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function activeDeactivaeBusiness(businessId, isActive) {
  console.log(businessId, isActive)
  return apiClient
    .patch(`businesses/${businessId}`, { isActive }, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function addBusinessNotes(businessId, notes) {
  return apiClient
    .put(`businesses/${businessId}/notes`, notes, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function activeDeactiveUsers(isActive, businessId, userId) {
  return apiClient
    .patch(`businesses/${businessId}/users/${userId}`, { isActive }, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function toggleOnboarding(businessId, reqBody) {
  return apiClient
    .patch(`businesses/${businessId}/allow-onboarding`, reqBody, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function forceUpdatePassword(businessId) {
  return apiClient
    .patch(`businesses/${businessId}/forcepasswordchange`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function getPaymentReceiveds(businessId, qryString) {
  return apiClient
    .get(`businesses/${businessId}/payment?${qryString}`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function sendPromotionalEmails(data) {
  return apiClient
    .post(`businesses/promotional/email`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function deleteStripeAccount(businessId) {
  return apiClient
    .delete(`businesses/stripe/${businessId}`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function generatePassword(userId) {
  return apiClient
    .get(`businesses/generate-password/${userId}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function changeStatementDescriptor(businessId, displayName) {
  return apiClient
    .patch(`businesses/${businessId}/legals`, displayName, { params: { businessId } })
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}

export async function syncStripeAccount(businessId) {
  return apiClient
    .patch(`businesses/${businessId}/sync`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessByName(qryString) {
  return apiClient
    .get(`businesses/searchByName?${qryString}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function cloneBusiness(businessId, cloneBusinessId, legalName, statementDescriptor) {
  return apiClient
    .patch(
      `businesses/${businessId}/clone`,
      { cloneBusinessId, legalName, statementDescriptor },
      { params: { businessId } },
    )
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function restrictBusiness(data) {
  return apiClient
    .put(`businesses/restrict`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const fetchPaymentOnboardingSteps = (step, id) => {
  return apiClient
    .get(`businesses/${id}/onboarding?step=${step}`, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const onboardingDataSubmit = (data, id) => {
  return apiClient
    .post(`businesses/${id}/onboarding`, data, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const updateOnboardingDataStatus = (status, id, remarks) => {
  return apiClient
    .patch(`businesses/${id}/onboarding`, { status, remarks }, { params: { businessId: id } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export const bulkBlockOnboardingBusiness = (status, businessIds) => {
  return apiClient
    .patch(`businesses/onboarding/bulk-block`, { status, businessIds })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function manageBusinessCapabilities(businessId, capabilityType, status) {
  return apiClient
    .patch(
      `businesses/${businessId}/capabilities`,
      { capabilityType, status },
      { params: { businessId } },
    )
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessCapabilities(businessId) {
  return apiClient
    .get(`businesses/${businessId}/capabilities`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchBusinessPaymentSettings(businessId) {
  return apiClient
    .get(`businesses/${businessId}/paymentSettings`, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function updateBusinessPaymentSettings(businessId, data) {
  return apiClient
    .patch(`businesses/${businessId}/paymentSettings`, { ...data })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function adjustRewardPoints(businessId, data) {
  return apiClient
    .post(`rewards/business/${businessId}`, data, { params: { businessId } })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function manageBusinessProvider(businessId, isLinked, providerName) {
  return apiClient
    .patch(
      `businesses/${businessId}/providers`,
      { isLinked, providerName },
      { params: { businessId } },
    )
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function migrateDataFromPeymynt(data) {
  return apiClient
    .post(`businesses/migrate-to-new-db`, data)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchWebhookLogs(query) {
  return apiClient
    .get(`${process.env.REACT_APP_API_GATEWAY_URL}/event-service/internal/webhooks?${query}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

export async function fetchErrorLogs(query) {
  return apiClient
    .get(`${process.env.REACT_APP_API_GATEWAY_URL}/event-service/internal/errors?${query}`)
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}
