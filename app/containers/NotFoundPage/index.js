import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'

import CenteredItemPage from 'components/CenteredItemPage'

const Container = styled.div`
  text-align: center;
`

export default class NotFound extends React.Component {

  render () {
    return (
      <CenteredItemPage>
        <Container>
          <p>Niet gevonden!</p>
          <Link to='/'>Terug naar begin</Link>
        </Container>
      </CenteredItemPage>
    )
  }
}
