import React from 'react'
import { Link } from 'react-router'

import { Buttons } from './styles'

export default function Menu (props) {
  const listSelected = props.path === 'lijst'
  const aboutSelected = props.path === 'over'
  const mapSelected = !listSelected && !aboutSelected
  return (
    <div>
      <Buttons>
        <Link className={mapSelected ? 'selected' : ''} to='/'>Kaart</Link>
        <Link className={listSelected ? 'selected' : ''} to='/lijst'>Lijst</Link>
        <Link className={aboutSelected ? 'selected' : ''} to='/over'>Over</Link>
      </Buttons>
    </div>
  )
}
