import React from 'react'
import { Link } from 'react-router'

function ScreenReaderInfo (props) {
  return (
    <span className='only-screen-reader'>
      Bekijk de <Link to='/list'>lijstweergave</Link> om de kaarten op een niet-visuele manier te doorzoeken.
    </span>
  )
}

export default ScreenReaderInfo
