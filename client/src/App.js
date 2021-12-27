import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Notification from './components/Notification'
import NewNotification from './components/NewNotification'
import User from './components/User'
import Grid from '@mui/material/Grid';
import { ENV } from './services/constants';

export default function App() {

    const [socket, setSocket] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const userHandler = (userSelected) => {
        setCurrentUserId(userSelected);
    };

    useEffect(() => {
        const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].SOCKET_URL;
        const newSocket = io(baseUrl);
        setSocket(newSocket);
        setCurrentUserId(currentUserId || "1");
        return () => newSocket.close();
    }, [setSocket, setCurrentUserId]);

    return (
        <div className="App">
            <header className="App-header">
                <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs="auto">
                        <User userHandler={userHandler} currentUserId={currentUserId} />
                    </Grid>

                    {socket ? (

                        <Grid item xs="auto">
                            <Notification currentUserId={currentUserId} socket={socket} />
                            <NewNotification currentUserId={currentUserId} socket={socket} />
                        </Grid>

                    ) : (
                        <div>Not Connected</div>
                    )}
                </Grid>
            </header>
        </div>
    );
}