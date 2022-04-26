import React from 'react';
import styled from './FaceDetection.module.css';

export default function FaceDetection({
  url,
  boxes,
  recognitionError,
  message,
}) {
  return (
    <div className={styled.imgDiv}>
      <div className={styled.imgSubDiv}>
        <img id='inputImage' className={styled.img} alt='' src={url} />

        <div className={styled.noFacesMessage}>{message}</div>

        {boxes.map((box, i) => {
          return (
            <div
              key={i}
              className={styled.boundingBox}
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
            ></div>
          );
        })}
      </div>
      <div className={styled.error}>{recognitionError}</div>
    </div>
  );
}
