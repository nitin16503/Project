// Button.tsx
import Image from 'next/image';
import React, { FC } from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  logo?: string; // Added logo property for including a logo
  type: "button" | "submit" | "reset";
  btnStyle:React.CSSProperties;
}

const Button: FC<ButtonProps> = ({
  type,
  label,
  onClick,
  disabled,
  logo,
  btnStyle,
}) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#f0a400' ,
    color: 'blue',
    padding: '10px 15px',
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: 'auto',
    minWidth: '221px',
    border: '1px solid',
    borderColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    height: '56px',
    justifyContent: 'center',
  };

  const logoStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    marginRight: '9px', // Adjust the margin as needed
  };
  const mergedStyle = btnStyle ? { ...buttonStyle, ...btnStyle, ...(disabled && {backgroundColor:'#CCC'}) } : buttonStyle;
  return (
    <button type={type} style={mergedStyle} onClick={onClick} disabled={disabled}>
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

export default Button;
