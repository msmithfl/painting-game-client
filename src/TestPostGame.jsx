import React, { useEffect, useState } from 'react';

function PostGame({ }) {
  

  return (
    <div>
      <div className='m-1'>
        <h3 className='font-bold text-left'>Playing as: Quirkily_Buff_Michelangelo_1530</h3>
      </div>
      <div className='flex flex-col items-center'>
        <div>
          <h2 className='text-xl mt-5'>Postgame: Nearly_Dreamy_Tate_545</h2>
          <p className='text-center'>Countdown: 20 seconds</p>
        </div>
        <div className='flex'>
          <ul className='sm:grid sm:grid-cols-2 gap-7 mt-5'>
            <li className='text-center'>
              <p>Quirkily_Buff_Michelangelo_1530</p>
              <p>123</p>
            </li>
            <li className='text-center'>
              <p>Zestily_Buff_Michelangelo_2332</p>
              <p>456</p>
            </li>
            <li className='text-center'>
              <p>Wackily_Bizarre_Picasso_4523</p>
              <p>789</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PostGame;
