import { all, call, put, takeEvery } from 'redux-saga/effects'
import { notification } from 'antd'
import * as Services from 'services/business'
import actions from './actions'

export function* FETCH_ALL_WEBHOOK_LOGS({ payload }) {
  const { query } = payload
  yield put({
    type: actions.SET_WEBHOOK_LOADING,
    payload: true,
  })
  const response = yield call(Services.fetchWebhookLogs, query)
  if (response?.statusCode === 200) {
    yield put({
      type: actions.SET_WEBHOOK_LOGS,
      payload: response.data,
    })
  } else {
    yield put({
      type: actions.SET_WEBHOOK_LOADING,
      payload: false,
    })
    showError(response?.message, 'Oops')
  }
}

export function* FETCH_ALL_ERROR_LOGS({ payload }) {
  const { query } = payload
  yield put({
    type: actions.SET_ERROR_LOADING,
    payload: true,
  })
  const response = yield call(Services.fetchErrorLogs, query)
  if (response?.statusCode === 200) {
    yield put({
      type: actions.SET_ERROR_LOGS,
      payload: response.data,
    })
  } else {
    yield put({
      type: actions.SET_ERROR_LOADING,
      payload: false,
    })
    showError(response?.message, 'Oops')
  }
}

function showError(msg, label) {
  notification.error({
    message: label || 'Try again',
    description: msg,
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_WEBHOOK_LOGS, FETCH_ALL_WEBHOOK_LOGS),
    takeEvery(actions.FETCH_ALL_ERROR_LOGS, FETCH_ALL_ERROR_LOGS),
  ])
}
