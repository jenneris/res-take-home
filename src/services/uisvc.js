// import {ENV, NOTIFICATIONS_URL, USERS_URL} from '../constants.js';
import { ENV, USERS_URL, NOTIFICATIONS_URL } from '../constants.js';

export const getNotifications = async (user) => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const response = await fetch(`${baseUrl}${NOTIFICATIONS_URL}`);
    const data = await response.json();
    return data;
}

export const getUserList = async (user) => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const response = await fetch(`${baseUrl}${USERS_URL}`);
    const data = await response.json();
    return data;
}

export const clearNotifications = async (notifications) => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const responses = [];
    notifications.forEach(async function (notificaton) {
        console.log(notificaton.id)
        const response = await fetch(`${baseUrl}${NOTIFICATIONS_URL}/${notificaton.id}`, { method: 'DELETE' });
        const data = await response.json();
        responses.push(data);
    })
    return responses;
}
