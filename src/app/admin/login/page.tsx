'use client'
import SignInComponent from '@/src/components/admin/signIn/signIn';
import Testimonials from '@/src/components/testimonials/testimonials';
import React, { useEffect, useState } from 'react'

export default function Login() {

    const [parentContainerHeight, setParentContainerHeight] = useState('auto');

    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            if (windowHeight > 700) {
                setParentContainerHeight('100%');
            }
            else {
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
                    <Testimonials />
                </div>
                <div className='flex-1'>
                <SignInComponent/>
                </div>
            </div>
        </div>
    )
}
