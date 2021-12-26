import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@mui/icons-material/Send';

export default function NewNotification({ socket, currentUserId }) {
    const [open, setOpen] = React.useState(false);

    const titleRef = useRef('');
    const contentRef = useRef('');
    const impactAreaRef = useRef('');
    const impactLocationRef = useRef('');

    const sendValue = () => {
        setOpen(false);
        const data = {
            title: titleRef.current.value,
            content: contentRef.current.value,
            creator_id: currentUserId,
            impactArea: impactAreaRef.current.value,
            impactLocation: impactLocationRef.current.value,
        }
        socket.emit('new-notification', data);
        handleClose();
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen} sx={{ marginTop: "10px", height: "20px", color: "white", borderColor: 'transparent' }}>
                Send Notification
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Notify Users</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Notification Details
                    </DialogContentText>
                    <TextField
                        autoFocus
                        id='outlined-textarea'
                        label='Subject'
                        placeholder='Placeholder'
                        variant='outlined'
                        rows={1}
                        inputRef={titleRef}
                        fullWidth
                    />
                    <TextField
                        id='outlined-textarea'
                        label='Message'
                        placeholder='Placeholder'
                        multiline
                        variant='outlined'
                        rows={10}
                        inputRef={contentRef}
                        fullWidth
                    />
                    <TextField
                        id='outlined-textarea'
                        label='Impact Location'
                        placeholder='Placeholder'
                        multiline
                        variant='outlined'
                        rows={1}
                        inputRef={impactLocationRef}
                        fullWidth
                    />
                    <TextField
                        id='outlined-textarea'
                        label='Impact Area'
                        placeholder='Placeholder'
                        multiline
                        variant='outlined'
                        rows={1}
                        inputRef={impactAreaRef}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        endIcon={<SendIcon />}
                        onClick={sendValue}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}