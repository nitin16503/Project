'use client'

import React, { useEffect, useState } from 'react';
import './verify.css';
import Image from 'next/image';
import StaticButton from '../staticButton/staticButton';
import verifiedImage from '../../assets/images/verified.svg';
import { VerifyProps } from '@/src/utils/types';
import { Clear } from '@mui/icons-material'

const Verify: React.FC<VerifyProps> = ({ showCustom = false, isSuccess = true, style, message, label, handleClick }) => {

  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  const containerStyle: React.CSSProperties = {
    height: containerHeight && containerHeight > 597 ? '100%' : 'auto',
  };

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setContainerHeight(height);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set the initial height

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {
        showCustom ?
          <div id="verifyContainer" className="custom w-full" style={{ ...containerStyle, ...style }}>

            <div className="created w-full flex justify-center flex-col items-center h-full">
              {
                isSuccess ?
                  <Image
                    src={verifiedImage}
                    alt="Verified Image"
                    width={100}
                    height={100}
                    className="verifiedImage"
                  />
                  :
                  <Clear sx={{ color: 'red', fontSize: 100 }} />
              }
              <div className="message px-5 flex content-center flex-col items-center">
                <p className="customSuccess">{message}</p>
              </div>
              <div className="w-full">
                <div 
                className="customButton w-full py-3  flex justify-center items-center" 
                onClick={handleClick}
                style={{
                  backgroundColor: isSuccess ? '#67DF87' : 'red',
                  cursor: 'pointer',
                }}
                >
                  {label}
                </div>
              </div>
            </div>
          </div>
          :
          <div id="verifyContainer" className="verify w-full" style={{ ...containerStyle, ...style }}>

            <div className="created w-full flex justify-center flex-col items-center h-full">
              {
                isSuccess ?
                  <Image
                    src={verifiedImage}
                    alt="Verified Image"
                    width={180}
                    height={180}
                    className="verifiedImage"
                  />
                  :
                  <Clear sx={{ color: 'red', fontSize: 100 }} />
              }
              <div className="message flex content-center flex-col items-center">
                <p className="success">{message}</p>
              </div>
              <div className="w-full">
                <StaticButton
                  label={label}
                  onClick={handleClick}
                  color="#fff"
                  bgColor="#F0A400"
                  width="100%"
                />
              </div>
            </div>
          </div>

      }

    </>
  );
};

export default Verify;
