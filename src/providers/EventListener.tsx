'use client';

import { useState, createContext, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL, SOCKET_TOKEN } from "../utils/config";
import { getUserInfo } from "../utils/helper";
import { useDispatch } from 'react-redux';
import { enableNotificationAlert, updateCount } from '../store/notification';
import { checkAuthentication } from "../utils/helper";

export interface SocketContextType {
    isSocketConnected: boolean;
    setIsSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
    initialiseSocket: () => void;
    disconnectSocket: () => void; // Add disconnectSocket function
}
export const SocketContext = createContext<SocketContextType>({
    isSocketConnected: false,
    setIsSocketConnected: () => { },
    initialiseSocket: () => { },
    disconnectSocket: () => { } // Initialize disconnectSocket as an empty function
});

export default function EventListener({
    children,
}: {
    children: React.ReactNode;
}) {

    const dispatch = useDispatch();
    const socketRef = useRef<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const disconnectSocket = () => { // Define disconnectSocket function
        if (socketRef.current?.connected) {
            let userID: string = getUserInfo('userId') || '';
            // Emit a custom event "userDisconnected" with the user ID
            socketRef.current.emit("userDisconnected", { userId: userID });
            // Disconnect the socketimport useSocket from "../hooks/useSocket";

            socketRef.current.disconnect();
        }
    };

    const initialiseSocket = () => {
        // Check if the socket is already connected
        if (socketRef.current && socketRef.current.connected) {
            console.log("Socket is already connected");
            setIsSocketConnected(true);
            return;
        }

        const token = `${SOCKET_TOKEN}`;
        const url = `${SOCKET_URL}`;
        const options = { transports: ["websocket"], upgrade: false, query: { token } };
        socketRef.current = io(`${url}`, options);
        let userID: string = getUserInfo('userId') || '';

        socketRef.current.on("connect", () => {
            setIsSocketConnected(true);
            socketRef.current?.emit("userConnected", { userId: userID });
            console.log("connect");
        });

        socketRef.current.on("notification", (type, data) => {
            //handle notification
            switch (type) {
                case 'high_priority_scanTest':
                    dispatch(enableNotificationAlert(data))
                    break;
                case 'update_notification_count':
                    dispatch(updateCount())
                    break;
                default:
                    console.log(data, "notification ------ default");
            }
        });

        socketRef.current.on("connect_error", (error) => {
            console.log(error, "connect_error");
        });

        socketRef.current.on("error", (error) => {
            console.log(error, "error");
        });

        socketRef.current.on("disconnect", (reason) => {
            console.log("disconnectSocket", reason);
            setIsSocketConnected(false);
            if (reason === "io client disconnect" || reason === "transport close") {
                // The socket was intentionally disconnected, no need to reconnect
            } else {
                // A network error occurred, attempt to reconnect
                console.log("Attempting to reconnect...");
                initialiseSocket();
            }
        });
    };

    useEffect(() => {
        const isAuthenticated = checkAuthentication();
        if (isAuthenticated) {
            initialiseSocket();
        }
        return () => {
            disconnectSocket();
        };
    }, []);

    const contextValue: SocketContextType = {
        isSocketConnected,
        setIsSocketConnected,
        initialiseSocket,
        disconnectSocket // Add disconnectSocket to the context value
    };

    return <>
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    </>;
}
