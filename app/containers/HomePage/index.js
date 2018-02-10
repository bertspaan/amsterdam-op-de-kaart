import React from 'react'
import { connect } from 'react-redux'

import Article from 'components/Article'
import ScreenReaderInfo from 'components/ScreenReaderInfo'
import DecadeList from 'containers/DecadeList'

import { createSelector } from 'reselect'

import {
  selectGroupBounds
} from 'containers/App/selectors'

export class HomePage extends React.Component {

  render () {
    return (
      <Article>
        <DecadeList>
          <p>
            Amsterdam op de Kaart laat kaarten uit de <a href='http://beeldbank.amsterdam.nl/beeldbank'>Beeldbank van het Amsterdamse Stadsarchief</a> zien,
            die via <a href='https://velehanden.nl/projecten/bekijk/details/project/amsterdam_kaarten'>Vele Handen</a> gegeorefereerd zijn.
            <ScreenReaderInfo />
          </p>
          <p>
            Via deze website is het makkelijker dan ooit om de historische kaarten van Amsterdam te vinden en vergelijken!
          </p>
        </DecadeList>
      </Article>
    )
  }
}

export default connect(createSelector(
  selectGroupBounds(),
  (groupBounds) => ({
    groupBounds
  })
))(HomePage)
