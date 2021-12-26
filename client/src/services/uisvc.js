// import {ENV, NOTIFICATIONS_URL, USERS_URL} from '../constants.js';
import { ENV, USERS_URL, NOTIFICATIONS_URL } from './constants.js';

const getQueryUrl = (params, initialUrl) => {


    const query = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');

    const queryUrl = `${initialUrl}${query}`;
    console.log(`constructed query url: ${queryUrl}`)
    return queryUrl;
}

export const getUserNotifications = async (id) => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const notificationUrl = `${baseUrl}${NOTIFICATIONS_URL}`;
    const response = await fetch(`${notificationUrl}/user/${id}`);
    const data = await response.json();
    return data;
}

export const searchNotifications = async (params) => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const notificationUrl = `${baseUrl}${NOTIFICATIONS_URL}`;
    const queryUrl = getQueryUrl(params, notificationUrl);
    const response = await fetch(queryUrl);
    const data = await response.json();
    return data;
}

export const getNotifications = async () => {

    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const response = await fetch(`${baseUrl}${NOTIFICATIONS_URL}`);
    const data = await response.json();
    return data;
}

export const getUserList = async () => {
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
