import { takeEvery } from 'redux-saga';
import { take, call, put, select  } from 'redux-saga/effects';
import {
  LOAD_DATA,
  NEW_MINI_MAP
} from 'containers/App/constants';

import {
  dataLoaded,
  dataLoadingError
} from 'containers/App/actions';

import {
  selectMiniMaps
} from 'containers/App/selectors';

import request from 'utils/request';

function* loadData(action) {
  const url = `https://raw.githubusercontent.com/nypl-spacetime/maps-by-decade-data/gh-pages/data/${action.file}.geojson`;
  const result = yield call(request, url);

  if (!result.err) {
    yield put(dataLoaded(action.file, result.data));
  } else {
    yield put(dataLoadingError(action.file, result.err));
  }
}

function* loadDataSaga() {
  yield* takeEvery(LOAD_DATA, loadData);
}

function* newMiniMap(action) {
  const miniMaps = yield select(selectMiniMaps());

  const newMiniMap = miniMaps[miniMaps.length - 1];
  const existingMiniMaps = miniMaps.slice(0, -1);

  const syncOptions = {
    noInitialSync: true
  };

  // Sync maps when new minimap is created
  // https://github.com/turban/Leaflet.Sync
  existingMiniMaps.forEach((existingMap) => {
    newMiniMap.sync(existingMap, syncOptions)
    existingMap.sync(newMiniMap, syncOptions)
  });
}

function* newMiniMapSaga() {
  yield* takeEvery(NEW_MINI_MAP, newMiniMap);
}

export default [
  loadDataSaga,
  newMiniMapSaga
];