import React from 'react'
import './signUp3.css'
import Image from 'next/image'
import StaticButton from '../staticButton/staticButton'
import { useRouter } from 'next/navigation'
export default function SignUp3() {
    const verifiedImage: string = './images/verified.svg'
    const router = useRouter();
    const handleLogin = ()=>{
        router.push('/login');
    }
  return (
    <>
        <div className="signUp3">
            <div className="created w-full flex justify-center flex-col items-center h-full">
                <Image
                    src={verifiedImage}
                    alt={`Image`}
                    width={180} //-30
                    height={180} 
                    className="verifiedImage" 
                />
                <div className="message flex content-center flex-col items-center">
                    <p className="success">
                        Successfully
                    </p>
                    <p className="verifyMessage">
                        Sign Up done
                    </p>
                </div>
                <div className="goToLogin w-full">
                        <StaticButton
                        label="Login"
                        onClick={handleLogin}
                        color="#fff"
                        bgColor="#F0A400"
                        width="100%"
                    />
                </div>
            </div>
        </div>
    </>
  )
}
