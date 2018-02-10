import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { push } from 'react-router-redux'

import { createSelector } from 'reselect'

import {
  selectHasTouch,
  selectSelectedMaps,
  selectTileLayerMaps,
  selectMapOptions,
  selectSelectedMapsLocked
} from 'containers/App/selectors'

import {
  lockSelectedMaps
} from 'containers/App/actions'

import ArrowLink from 'components/ArrowLink'
import SelectedMap from 'containers/SelectedMap'
import MapLightbox from 'containers/MapLightbox'
import { Container, List, Instructions, GoBack } from './styles'

export class Sidebar extends React.Component {

  render () {
    if (!this.props.selectedMaps || this.props.selectedMaps.length === 0) {
      let text
      if (this.props.hasTouch) {
        text = <span>
          Sleep om de kaart te verschuiven, klik om kaarten te selecteren.
        </span>
      } else {
        text = <span>
          Use your mouse or arrow keys to move around the map. With a mouse,
          hover over outlined areas to see details and click to lock and unlock
          selected areas. When using arrow keys, press Enter to lock selections and
          Escape to unlock.
        </span>
      }

      return (
        <Instructions>
          <span>
            ←
          </span>
          <span>
            {text} <span>Zie <Link to='/over'>Over</Link> voor meer informatie.</span>
          </span>
        </Instructions>
      )
    }

    return (
      <Container ref='sidebar'>
        <GoBack>
          <ArrowLink direction='left' onClick={this.goBack.bind(this)} showTextOnMobile
            title='Terug naar kaart - of gebruik de Escape-toets' >
            Terug naar kaart
          </ArrowLink>
        </GoBack>
        <List>
          { this.props.selectedMaps.map((map, index) => (
            <SelectedMap map={map} index={index} key={map.properties.id}
              tilesOnMap={this.props.tileLayerMaps.get(String(map.properties.id)) !== undefined} />
          ))}
        </List>
        <MapLightbox />
      </Container>
    )
  }

  goBack () {
    this.props.lockSelectedMaps(false)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    lockSelectedMaps: (locked) => dispatch(lockSelectedMaps(locked)),
    changeRoute: (url) => dispatch(push(url))
  }
}

export default connect(createSelector(
  selectHasTouch(),
  selectSelectedMaps(),
  selectTileLayerMaps(),
  selectMapOptions('miniMap'),
  selectSelectedMapsLocked(),
  (hasTouch, selectedMaps, tileLayerMaps, options, selectedMapsLocked) => ({
    hasTouch, selectedMaps, tileLayerMaps, options, selectedMapsLocked
  })
), mapDispatchToProps)(Sidebar)
