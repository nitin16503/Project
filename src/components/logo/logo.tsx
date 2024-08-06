"use client"
import React, { FC } from 'react'
import './logo.css'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '../../assets/images/logo.png';
import { checkAuthentication } from '@/src/utils/helper';
import { Typography } from "@mui/material"

const Logo: FC<{ subTitle?: string, width: number, height: number, loggedIn?: boolean }> = ({ subTitle, width, height, loggedIn = false }) => {

  const router = useRouter();
  const handleClick = () => {
    const isAuthenticated = checkAuthentication();
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
    // Your onClick logic here
    console.log('Image clicked!');
  };

  return (
    <>
      <div onClick={handleClick} className='logo'>
        <Image
          src={logo}
          alt={`Image`}
          width={width} //-30
          height={height}
          className="image"
        />
      </div>
      {
        ! loggedIn && 
          <div className="subTittlea" style={{ color:'white' }} >
          {subTitle}
        </div>
      }
    </>
  );
}

export default Logo;
