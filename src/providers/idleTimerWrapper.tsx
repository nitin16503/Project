"use client";
import React, { useEffect, useRef } from 'react';
import { useIdleTimer } from 'react-idle-timer'
import dayjs from 'dayjs';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { refreshTokenMutation, logoutMutation } from '../api/user';
import { checkAuthentication } from '../utils/helper';
import { getUserInfo } from '../utils/helper';
import { decodeJwtWithoutVerification } from '../utils/helper';

interface IdleTimerWrapperProps {
    children: React.ReactNode;
}

const IdleTimerWrapper: React.FC<IdleTimerWrapperProps> = ({ children }) => {

    const time = 120000 // 2 minutes in milliseconds
    const { logout } = logoutMutation()
    const { refreshAccessToken } = refreshTokenMutation()
    const isAuthenticated = checkAuthentication();
    const [isIdle, setIsIdle] = React.useState(false);
    const [stillActive, _setStillActive] = React.useState(false);
    const stillActiveRef = useRef(stillActive);
    const setStillActive = (data: boolean) => {
        stillActiveRef.current = data;
        _setStillActive(data);
    };

    const { pause } = useIdleTimer({
        timeout: time,
        onIdle: () => setIsIdle(true),
        onAction: () => setStillActive(true),
        onActive: () => setIsIdle(false),
    });

    const checkIsSessionLive = () => {
        console.log("check token alive", stillActiveRef.current)
        if (stillActiveRef.current) {
            refreshAccessToken();
            setStillActive(false)
        }
    }

    useEffect(() => {
        const startSessionCheck = () => {
         //   console.log("startSessionCheck  111")
            const recursiveTimer = setInterval(() => {
                checkIsSessionLive();
            }, 600000); // every 10 minute
            return recursiveTimer;
        };

        if (isAuthenticated) {
            const timerId = startSessionCheck();

            return () => {
                clearInterval(timerId);
            };
        }
    }, [isAuthenticated]);

    return (
        <>
            {/* {isAuthenticated && <TimerAlert
                isIdle={isIdle}
                logout={logout}
                refreshAccessToken={refreshAccessToken}
            />} */}
            {children}
        </>
    );
};


const TimerAlert = ({
    isIdle,
    logout,
    refreshAccessToken,
}: any) => {

    const token = getUserInfo('token')
    const tokenPayload = decodeJwtWithoutVerification(token)
    const expirationTime = tokenPayload?.exp // in seconds
    const warningThreshold = 120; // 2mins in seconds
    const currentTime = dayjs().unix(); // in second
    const timeUntilExpiration = expirationTime ? expirationTime - currentTime : 0;
    const [remainingTime, setRemainingTime] = React.useState<number>(120); // 2mins timer
    const [showPopup, setShowPopup] = React.useState<boolean>(false);

    const handleLogout = () => {
        logout()
        setShowPopup(false)
    }

    const handleRefresh = () => {
        refreshAccessToken()
        setShowPopup(false)
    }

    const handleOnIdle = async () => {
        if (timeUntilExpiration < warningThreshold) {
            setShowPopup(true);
            setRemainingTime(timeUntilExpiration)
        } else {
            setShowPopup(false);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} : ${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [setShowPopup]);

    useEffect(()=>{
        handleOnIdle()
    },[isIdle])

    return (
        <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
            <DialogTitle>Session Timeout</DialogTitle>
            <DialogContent>
                <p>Your session is about to expire due to inactivity. You will be automatically signed out in</p>
                <h2 className="margin-top: 0">
                    <span className="logout-counter-span">{formatTime(remainingTime)}</span>
                </h2>
                <p>
                    To continue your session, select <strong>Stay Signed In</strong>.
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleLogout} color="primary">Sign out</Button>
                <Button onClick={handleRefresh} color="primary">Stay Signed In</Button>
            </DialogActions>
        </Dialog>
    )
}

export default IdleTimerWrapper;



