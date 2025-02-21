import { all, put, call } from 'redux-saga/effects'
import getMenuData, { getMenuItemCount } from 'services/menu'

export function* GET_DATA() {
  const countData = yield call(getMenuItemCount)
  let menuData = yield call(getMenuData)
  menuData = menuData.map(value => {
    if (countData[value.key]) {
      return {
        ...value,
        count: countData[value.key],
      }
    }
    return value
  })
  yield put({
    type: 'menu/SET_STATE',
    payload: {
      menuData,
    },
  })
}

export default function* rootSaga() {
  yield all([
    GET_DATA(), // run once on app load to fetch menu data
  ])
}
