// import {ENV, NOTIFICATIONS_URL, USERS_URL} from '../constants.js';
import CONSTANTS from '../constants.mjs';

export const getNotifications = async (user) => {
    const baseUrl = CONSTANTS.ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const response = await fetch(`${baseUrl}${CONSTANTS.NOTIFICATIONS_URL}`);
    const data = await response.json();
    return data;
}

export const getUsers = async (user) => {
    const baseUrl = CONSTANTS.ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const response = await fetch(`${baseUrl}${CONSTANTS.USERS_URL}`);
    const data = await response.json();
    return data;
}

export const clearNotifications = async (notifications) => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const responses = [];
    notifications.forEach(async function (notificaton) {
    console.log(notificaton.id)
    const response = await fetch('http://localhost:3001/api/notification?id=21', { method: 'DELETE' });
    const data = await response.json();
    responses.push(data);
    })
    return responses;
}
