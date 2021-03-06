/* global __CONFIG__ */

import { LOCATION_CHANGE } from 'react-router-redux'

import {
  LOAD_DATA_SUCCESS,
  LOAD_DATA_ERROR,
  NEW_MINI_MAP,
  SELECT_MAPS,
  LOCK_SELECTED_MAPS,
  ADD_TILE_LAYER_MAP,
  REMOVE_TILE_LAYER_MAP,
  CLEAR_TILE_LAYER_MAPS,
  SHOW_LIGHTBOX,
  LIGHTBOX_PREV,
  LIGHTBOX_NEXT,
  SET_FILTER,
  RESET_FILTERS
} from './constants'

import { fromJS } from 'immutable'

const initialState = fromJS({
  hasTouch: 'ontouchstart' in window,
  loading: true,
  error: null,
  decade: null,
  mapId: null,
  selectedMaps: [],
  selectedMapsLocked: false,
  showLightbox: false,
  ligtboxIndex: 0,
  tileLayerMaps: fromJS({}),
  data: {
    all: null,
    grouped: null
  },
  mapCount: 0,
  groups: fromJS({}),
  groupBounds: [],
  nextPrevGroups: fromJS({}),
  miniMaps: fromJS([]),
  config: fromJS(__CONFIG__),
  filters: fromJS({})
})

function appReducer (state = initialState, action) {
  switch (action.type) {
    case LOAD_DATA_ERROR:
      return state
        .set('error', action.error)
    case LOAD_DATA_SUCCESS:
      var data = {}

      if (action.file === 'all') {
        action.data.features.sort((a, b) => {
          const aYear = parseInt(a.properties.year)
          const bYear = parseInt(b.properties.year)
          return aYear - bYear
        })
      }

      action.data.features.forEach((feature) => {
        const group = feature.properties.group
        if (!data[group]) {
          data[group] = []
        }

        data[group].push(feature)
      })

      var newState = state
        .setIn(['data', action.file], data)

      if (action.file === 'grouped') {
        var nextPrevGroups = {}
        var groups = new Set()

        action.data.features
          .forEach((feature) => {
            const group = feature.properties.group
            groups.add(group)
          })

        const sortedGroups = [...groups].sort()

        sortedGroups.forEach((group, i) => {
          nextPrevGroups[group] = {
            prev: sortedGroups[i - 1],
            next: sortedGroups[i + 1]
          }
        })

        newState = newState
          .set('groupBounds', [
            parseInt(sortedGroups[0]),
            parseInt(sortedGroups[sortedGroups.length - 1]) + 10
          ])
          .set('groups', fromJS(sortedGroups))
          .set('nextPrevGroups', fromJS(nextPrevGroups))
      } else if (action.file === 'all') {
        newState = newState
          .set('mapCount', action.data.features.length)
      }

      let allLoaded = true
      for (let value of newState.get('data').values()) {
        allLoaded = allLoaded && value
      }

      const loading = !allLoaded
      return newState
        .set('selectedMaps', [])
        .set('loading', loading)
    case NEW_MINI_MAP:
      return state
        .update('miniMaps', (miniMaps) => miniMaps.push(action.map))
    case LOCATION_CHANGE:
      return state
        .set('selectedMapsLocked', false)
        .set('ligtboxIndex', 0)
        .set('tileLayerMaps', fromJS({}))
    case SELECT_MAPS:
      return state
        .set('selectedMaps', action.maps)
        .set('ligtboxIndex', 0)
    case LOCK_SELECTED_MAPS:
      return state
        .set('selectedMapsLocked', action.locked)
    case ADD_TILE_LAYER_MAP:
      let addId = String(action.feature.properties.id)
      return state
        .set('tileLayerMaps', fromJS({}))
        .update('tileLayerMaps', (tileLayerMaps) => tileLayerMaps.set(addId, action.feature))
    case REMOVE_TILE_LAYER_MAP:
      let removeId = String(action.feature.properties.id)
      return state
        .update('tileLayerMaps', (tileLayerMaps) => tileLayerMaps.delete(removeId))
    case CLEAR_TILE_LAYER_MAPS:
      return state
        .set('tileLayerMaps', fromJS({}))
    case SHOW_LIGHTBOX:
      return state
        .set('showLightbox', action.show)
        .set('lightboxIndex', action.index)
    case LIGHTBOX_PREV:
      let prevLength = state.get('selectedMaps').length
      return state
        .update('lightboxIndex', (lightboxIndex) => ((lightboxIndex - 1) + prevLength) % prevLength)
    case LIGHTBOX_NEXT:
      let nextLength = state.get('selectedMaps').length
      return state
        .update('lightboxIndex', (lightboxIndex) => (lightboxIndex + 1) % nextLength)
    case SET_FILTER:
      if (action.filter === 'title' && !action.value) {
        return state
          .deleteIn(['filters', action.filter])
      } else if (action.filter.startsWith('decades') && action.value) {
        return state
          .deleteIn(['filters', action.filter])
      } else {
        return state
          .setIn(['filters', action.filter], action.value)
      }
    case RESET_FILTERS:
      return state
        .set('filters', fromJS({}))
    default:
      return state
  }
}

export default appReducer
