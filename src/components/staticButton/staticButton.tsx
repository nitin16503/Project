// Button.tsx
import { height } from '@mui/system';
import Image from 'next/image';
import React, { FC } from 'react';

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  bgColor?: string
  height?: string,
  color?: string;
  width?: string; // Added width property
  borderColor?: string; // Added border color property
  logo?: string; // Added logo property for including a logo
}

const StaticButton: FC<ButtonProps> = ({
  label,
  onClick,
  bgColor,
  disabled=false,
  color = 'blue',
  width = 'auto',
  borderColor = 'transparent',
  logo,
  height= '56px'
}) => {
    
  const buttonStyle: React.CSSProperties = {
    backgroundColor:  disabled ? bgColor : '#f0a400' ,
    color: color,
    padding: '10px 15px',
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: width,
    border: '1px solid',
    borderColor: borderColor,
    display: 'flex',
    alignItems: 'center',
    height: height,
    justifyContent: 'center',
  };

  const logoStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    marginRight: '9px', // Adjust the margin as needed
  };

  return (
    <button style={buttonStyle} onClick={onClick} type='button' disabled={disabled}>
      {logo &&    <Image
                    src={logo}
                    alt={`Image`}
                    width={36} // Set the desired width
                    height={36} // Set the desired height
                />}
      {label}
    </button>
  );
};

export default StaticButton;
