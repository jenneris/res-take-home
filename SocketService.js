const users = new Map();
const defaultUser = {
    id: 'default',
    name: 'anon',
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})
const notifications = new Set();

const notificationExpirationTimeMS = 5 * 2 * 1000;

const  { saveNotification } = require('./serverUtils');

class SocketService {
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;
        this.prisma = prisma;

        socket.on('getNotifications', () => this.getNotifications());
        socket.on('new-notification', (value) => this.handleNotification(value));
        socket.on('deleteMessage', (notificationId) => deleteMessageListener(notificationId));
        socket.on('connection', (socket) => {
            console.log('Connected');
        });
        socket.on('disconnect', () => {
            this.disconnect();
            console.log("disconnected");
        });
        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }

    deleteMessageListener(notificationId){
        setMessages((prevNotifications) => {
          const newMessages = {...prevNotifications};
          delete newMessages[notificationId];
          return newMessages;
        });
      }

    async sendNotification(notification) {

        this.io.sockets.emit('new-notification', notification);
    }

    getNotifications() {
        notifications.forEach((notification) => this.sendNotification(notification));
    }
    disconnect() {
        users.delete(this.socket);
    }
    async handleNotification(value) {
        const notification = {
            creator_id: value.creator_id || defaultUser,
            title: value.title,
            content: value.content,
            impactArea: value.impactArea,
            impactLocation: value.impactLocation,
        };

        notifications.add(notification);
        // since we set the id when the record is saved we save the record and then send out push notification
        // could use uuid to avaoid or maybe we wouldn't want to send out a push unless we know it is a successfully saved record
        const response = await saveNotification(notification);
        notification.id = response.id;
        this.sendNotification(notification);
        console.log(`Added New Notification ${JSON.stringify(response)}`);
        // notifications.delete(notification);
        // this.io.sockets.emit('deleteNotification', notification.id);

        // setTimeout(
        //   () => {
        //     notifications.delete(notification);
        //     this.io.sockets.emit('deleteNotification', notification.id);
        //   },
        //   notificationExpirationTimeMS,
        // );
    }
}



function notify(io) {
    io.on('connection', (socket) => {
        new SocketService(io, socket);
    });
};

module.exports = notify;