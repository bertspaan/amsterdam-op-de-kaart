import React from 'react'
import { Link } from 'react-router'

import Menu from 'components/Menu'

import { StyledHeader } from './styles'

export default function Header (props) {
  return (
    <StyledHeader className='align-center'>
      <div className='align-center'>
        <h1>
          <Link to='/'>
            <strong>Amsterdam</strong> op de Kaart
          </Link>
        </h1>
      </div>
      <Menu path={props.path} />
    </StyledHeader>
  )
}
