import React from 'react';
import './App.css';
import Notification from './components/Notification'
import User from './components/User'
import Grid from '@mui/material/Grid';

function App() {

    return (
        <div className="App">
            <header className="App-header">
                <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={'auto'}>
                        <User/>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Notification/>
                    </Grid>
                </Grid>     
            </header>
        </div>
      );
    }
    
export default App;