/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { LOCATION_CHANGE } from 'react-router-redux';

import {
  LOAD_DATA,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  NEW_MINI_MAP,
  SELECT_MAPS,
  LOCK_SELECTED_MAPS,
  SET_TILE_LAYER,
  SHOW_LIGHTBOX,
  LIGHTBOX_PREV,
  LIGHTBOX_NEXT
} from './constants';

import { fromJS } from 'immutable';

import rbush from 'rbush';

// The initial state of the App
const initialState = fromJS({
  loading: true,
  error: null,
  decade: null,
  mapId: null,
  selectedMaps: [],
  selectedMapsLocked: false,
  showLightbox: false,
  ligtboxIndex: 0,
  tileUrl: null,
  data: {
    all: null,
    grouped: null
  },
  miniMaps: fromJS([]),
  config: fromJS(__CONFIG__)
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_DATA_SUCCESS:
      var bands = {}

      action.data.features.forEach((feature) => {
        const band = feature.properties.band
        if (!bands[band]) {
          bands[band] = []
        }

        bands[band].push(feature)
      })

      // TODO: Check bands for holes!
      // all bands from min(band) to max(band) should exist in bands

      if (action.file === 'all') {
        var trees = [];

        Object.keys(bands).forEach((band) => {
          const features = bands[band];
          var tree = rbush(features.length);
          tree.load(
            features.map((feature, i) => ({
              minX: feature.properties.boundingbox[0],
              minY: feature.properties.boundingbox[1],
              maxX: feature.properties.boundingbox[2],
              maxY: feature.properties.boundingbox[3],
              index: i
            }))
          );
          trees[band] = tree;
        });
      }

      var newState = state
        .set('trees', trees)
        .setIn(['data', action.file], bands);

      var loaded = true
      for(let value of newState.get('data').values()){
        loaded = loaded && (value ? true : false);
      }

      return newState
        .set('loading', !loaded);
    case NEW_MINI_MAP:
      return state
        .update('miniMaps', (miniMaps) => miniMaps.push(action.map));
    case LOCATION_CHANGE:
      return state
        .set('selectedMaps', [])
        .set('selectedMapsLocked', false)
        .set('ligtboxIndex', 0)
        .set('tileUrl', null);
    case SELECT_MAPS:
      return state
        .set('selectedMaps', action.maps)
        .set('ligtboxIndex', 0);
    case LOCK_SELECTED_MAPS:
      return state
        .set('selectedMapsLocked', action.locked);
    case  SET_TILE_LAYER:
      return state
        .set('tileUrl', action.tileUrl);
    case SHOW_LIGHTBOX:
      return state
        .set('showLightbox', action.show)
        .set('lightboxIndex', action.index);
    case LIGHTBOX_PREV:
      var selectedMapsLength = state.get('selectedMaps').length;
      return state
        .update('lightboxIndex', (lightboxIndex) => ((lightboxIndex - 1) + selectedMapsLength) % selectedMapsLength);
    case LIGHTBOX_NEXT:
      var selectedMapsLength = state.get('selectedMaps').length;
      return state
        .update('lightboxIndex', (lightboxIndex) => (lightboxIndex + 1) % selectedMapsLength);
    default:
      return state;
  }
}

export default appReducer;
