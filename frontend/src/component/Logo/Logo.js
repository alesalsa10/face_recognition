import React from 'react';
import styled from './Logo.module.css';
import Tilt from 'react-tilt';
import brain from './brain.png';

export default function Logo() {
  return (
    <div className={styled.logo}>
      <Tilt
        className={styled.Tilt}
        options={{ max: 25 }}
        style={{ height: 200, width: 200 }}
      >
        <div className='Tilt-inner'> <img className={styled.img} src={brain} alt="brain"/> </div>
      </Tilt>
    </div>
  );
}
