// SignUpHeader.js
import React from 'react';
import { useRouter } from 'next/navigation';
import './signUpHeader.css';
import { sendGTMEvent } from '@next/third-parties/google'

export default function SignUpHeader() {
  const router = useRouter();

  const handleLoginClick = () => {
    // Navigate to the login route
    sendGTMEvent({ event: 'textLink', value: 'goToLogin Text clicked' })
    router.push('/login');
  };

  return (
    <div className="signUpHeader w-full">
      <div className="title flex flex-col items-start justify-center">
        Sign Up
        <p className="subTitle">
          Already have an account?{' '}
          <span className="register" onClick={handleLoginClick}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
