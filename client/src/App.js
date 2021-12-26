import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Notification from './components/Notification'
import NewNotification from './components/NewNotification'
import User from './components/User'
import Grid from '@mui/material/Grid';

export default function App() {

    const [socket, setSocket] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const userHandler = (userSelected) => {
        setCurrentUserId(userSelected);
    };

    useEffect(() => {
        // const newSocket = io(`http://${window.location.hostname}:3001`);
        const newSocket = io(`http://${window.location.hostname}`);
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