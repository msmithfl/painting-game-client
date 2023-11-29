import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
//sticky top-[100vh], add to className to stick footer to bottom

function Footer() {
  return (
    <div className='my-3 text-center'>
        <small><FontAwesomeIcon icon={faCopyright} /> 2023 Pérez Art Museum Miami </small>
    </div>
  );
};

export default Footer;