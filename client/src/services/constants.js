export const ENV = {
    "LOCAL":{
        'BASE_URL':'http://localhost:3001/api/',
        'SOCKET_URL':'http://localhost:3001',

    }, 
    "DEV":{
        'BASE_URL':'https://jenn-test-app.herokuapp.com:3001/api/',
        'SOCKET_URL':'https://jenn-test-app.herokuapp.com',
    },
    "STAGING":{
        'BASE_URL':'https://platform-notification-service.herokuapp.com/api/',
        'SOCKET_URL':'https://platform-notification-service.herokuapp.com',
    }
};
export const NOTIFICATIONS_URL = "notification";
export const USERS_URL = "user";