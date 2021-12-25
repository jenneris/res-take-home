import React, { useState } from 'react';

const NewNotification = ({ socket }) => {
    const [value, setValue] = useState('');
    const submitForm = (e) => {
        e.preventDefault();
        const data = {
            title: "message from form",
            content: value
        }
        socket.emit('new-notification', data);
        setValue('');
    };

    return (
        <form onSubmit={submitForm}>
            <input
                autoFocus
                value={value}
                placeholder="Type your message"
                onChange={(e) => {
                    setValue(e.currentTarget.value);
                }}
            />
        </form>
    );
};

export default NewNotification;