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
    return response.json();
}

export const searchNotifications = async (params) => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const notificationUrl = `${baseUrl}${NOTIFICATIONS_URL}`;
    const queryUrl = getQueryUrl(params, notificationUrl);
    const response = await fetch(queryUrl);
    return response.json();
}

export const getNotifications = async () => {

    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const response = await fetch(`${baseUrl}${NOTIFICATIONS_URL}`);
    return response.json();
}

export const getUserList = async () => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const response = await fetch(`${baseUrl}${USERS_URL}`);
    return response.json();
}

export const clearNotifications = async (notifications) => {
    const baseUrl = ENV[process.env.REACT_APP_DEV_ENV].BASE_URL;
    const responses = [];
    notifications.forEach(async function (notificaton) {
        console.log(notificaton.id)
        const response = await fetch(`${baseUrl}${NOTIFICATIONS_URL}/${notificaton.id}`, { method: 'DELETE' });
        responses.push(response.json());
    })
    return responses;
}
