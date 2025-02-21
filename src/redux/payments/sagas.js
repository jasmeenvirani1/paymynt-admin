import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/payments'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_PAYMENTS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payments: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllPayments, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payments: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payments: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_PAYMENTS_DETAILS({ payload: paymentId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      payment: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchPaymentDetails, paymentId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payment: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        payment: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_PAYMENTS, FETCH_ALL_PAYMENTS),
    takeEvery(actions.FETCH_PAYMENTS_DETAILS, FETCH_PAYMENTS_DETAILS),
  ])
}
