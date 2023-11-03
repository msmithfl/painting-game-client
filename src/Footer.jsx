import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <div className='sticky top-[100vh] mb-2'>
        <p><FontAwesomeIcon icon={faCopyright} /> 2023 Pérez Art Museum Miami </p>
    </div>
  )
}

export default Footer