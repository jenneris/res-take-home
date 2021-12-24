import React, { useEffect, useState } from 'react';
import './App.css';
import Notification from './components/Notification'
import NewNotification from './components/NewNotification'
import User from './components/User'
import Grid from '@mui/material/Grid';

function App() {

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(`http://${window.location.hostname}:3001`);
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    return (
        <div className="App">
            <header className="App-header">
                <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={'auto'}>
                        <User/>
                    </Grid>

                    { socket ? (
                    <Grid item xs={'auto'}>
                     <Notification socket={socket} />
                     <NewNotification socket={socket} />
                    </Grid>
                        ) : (
                    <div>Not Connected</div>
                        )}

                </Grid>     
            </header>
        </div>
      );
    }
    
export default App;