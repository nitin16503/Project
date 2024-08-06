'use client'

import React, { useEffect, useState } from 'react';
import Testimonials from '@/src/components/testimonials/testimonials';
import LogIn from '@/src/components/logIn/logIn';

export default function Signin() {

  const [parentContainerHeight, setParentContainerHeight] = useState('auto');
  
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
        if(windowHeight > 700){
          setParentContainerHeight('100%');
        }
        else{
          setParentContainerHeight('auto');
        }
    };

    // Initial call to set the height
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="loginParentContainer" style={{ height: parentContainerHeight }}>
      <div className='loginContainer'>
        <div className='sideScreen'>
          <Testimonials/>
        </div>
        <div className='flex-1'>
          <LogIn />
        </div>
      </div>
    </div>
  );
}
