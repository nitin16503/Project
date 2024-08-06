import React, { FC } from 'react'
import StaticButton from '../staticButton/staticButton'
import './signUpBottom.css'

interface propsTypes  {
    handleSubmit: ()=> void
}

const SignUpBottom: FC<propsTypes>= ({handleSubmit}) => {
  return (
    <>
        <div className="horizontalLineContainer">
            <div className="horizontalLine"></div>
            <div className="orText">OR</div>
            <div className="horizontalLine"></div>
        </div>
        <div className="signUpWithGoogle">
            <StaticButton
              label="Login with Google"
              onClick={handleSubmit}
              color="#00a7b3"
              bgColor="#fff"
              width="100%"
              borderColor="#00a7b3"
              logo='./images/google_logo.svg'
            />
        </div>
    </>
  )
}

export default SignUpBottom;
