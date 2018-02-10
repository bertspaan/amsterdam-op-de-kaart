import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Helmet from 'react-helmet'

import Page from 'components/Page'
import Article from 'components/Article'

import { KeyboardTable } from './styles'

import {
  selectGroupBounds,
  selectMapCount
} from 'containers/App/selectors'

export class AboutPage extends React.Component {
  render () {
    return (
      <Page>
        <Helmet title='Over' />
        <Article>
          <h2>Over dit project</h2>
          <p>
            Amsterdam op de Kaart laat kaarten uit de <a href='http://beeldbank.amsterdam.nl/beeldbank'>Beeldbank van het Amsterdamse Stadsarchief</a> zien,
            die via <a href='https://velehanden.nl/projecten/bekijk/details/project/amsterdam_kaarten'>Vele Handen</a> gegeorefereerd zijn.
          </p>
          <p>
            Amsterdam op de Kaart is gemaakt door Menno den Engelse en Bert Spaan, voor <a href='http://hackalod.com/'>HackaLOD 2018</a>. Voor meer informatie, zie <a href='https://github.com/bertspaan/hackalod'>GitHub</a>.
          </p>

          <h3>Broncode</h3>
          <p>
            De broncode voor Amsterdam op de Kaart is beschikbaar op <a href='https://github.com/bertspaan/amsterdam-op-de-kaart'>GitHub</a>.
          </p>

          <h2>Sneltoetsen</h2>
          <KeyboardTable>
            <thead>
              <tr>
                <th>Toets</th>
                <th>Omschrijving</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <kbd>←</kbd> <kbd>↑</kbd> <kbd>→</kbd> <kbd>↓</kbd>
                </td>
                <td>
                  Move map east, north, west and south &mdash; hold <kbd>Shift</kbd> for a larger
                  distance
                </td>
              </tr>
              <tr>
                <td>
                  <kbd>+</kbd> <kbd>-</kbd>
                </td>
                <td>
                  Zoom map in and out
                </td>
              </tr>
              <tr>
                <td>
                  <kbd>[</kbd> <kbd>]</kbd>
                </td>
                <td>
                  Go to previous decade, go to next decade
                </td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>
                  Select maps
                </td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>
                  Deselect maps, go back one level
                </td>
              </tr>
            </tbody>
          </KeyboardTable>
        </Article>
      </Page>
    )
  }
}

export default connect(createSelector(
  selectGroupBounds(),
  selectMapCount(),
  (groupBounds, mapCount) => ({
    groupBounds, mapCount
  })
))(AboutPage)
