import React, { FC } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface ButtonProps {
  customStyle?:React.CSSProperties;
}

const Loader: FC<ButtonProps> = ({customStyle}) =>{
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginTop: '20px'
  };
  const mergedStyle = customStyle ? { ...containerStyle, ...customStyle } : containerStyle;
  return (
    <div style={mergedStyle}>
      <CircularProgress />
    </div>
  );
};

export default Loader;
