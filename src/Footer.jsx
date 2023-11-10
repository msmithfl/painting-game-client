import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <div className='sticky top-[100vh] my-3 text-center'>
        <small><FontAwesomeIcon icon={faCopyright} /> 2023 Pérez Art Museum Miami </small>
    </div>
  );
};

export default Footer;