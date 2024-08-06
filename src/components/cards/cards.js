// Card.js

import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';


const Card = ({ title, count, colorIcon, mainIcon }) => {
  return (  
    <div className="card flex justify-start items-center">
      <div className="cardText">
        <p className="cardTitle">{title}</p>
        <p className="countText">{count}</p>
      </div>
      <div className="colorImageContainer">
        <Image src={colorIcon} alt={`Color Icon`} className="cardColorImage" />
        <Image src={mainIcon} alt={`Main Icon`} className="cardIcon" />
      </div>
    </div>
  );
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    colorIcon: PropTypes.object.isRequired, // Use PropTypes.object for StaticImageData
    mainIcon: PropTypes.object.isRequired,  // Use PropTypes.object for StaticImageData
  };
export default Card;
