import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/refunds'
import * as Notification from 'services/showNotifications'
import actions from './actions'

export function* FETCH_ALL_REFUNDS({ payload: qryString }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      refunds: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchAllRefunds, qryString)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        refunds: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        refunds: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export function* FETCH_REFUND_DETAIL({ payload: refundId }) {
  yield put({
    type: actions.SET_STATE,
    payload: {
      refund: {
        loading: true,
      },
    },
  })
  const response = yield call(Services.fetchRefundDetails, refundId)
  if (!response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        refund: {
          loading: false,
          data: response.data,
        },
      },
    })
  } else if (response.error) {
    yield put({
      type: actions.SET_STATE,
      payload: {
        refund: {
          loading: false,
        },
      },
    })
    Notification.showError(response.message)
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_ALL_REFUNDS, FETCH_ALL_REFUNDS),
    takeEvery(actions.FETCH_REFUND_DETAIL, FETCH_REFUND_DETAIL),
  ])
}
