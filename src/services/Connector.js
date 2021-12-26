const uuidv4 = require('uuid').v4;

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

class Connector {
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;
        this.prisma = prisma;

        socket.on('getNotifications', () => this.getNotifications());
        socket.on('new-notification', (value) => this.handleNotification(value));
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

    async saveNotification(notification) {
        console.log("received notification....");
        let data = {
            title: notification.title,
            content: ` content: ${notification.content}`,
            has_read: false,
            creator_id: notification.creator_id,
            impact_area: notification.impactArea,
            impact_location: notification.impactLocation,
            // creator: { connect: { email: "jenn@test.com" } },
        }
        const response = await prisma.notification.create({
            data,
        });
        console.log(`1Added New Notification ${JSON.stringify(response)}`);
        return response;
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
        const response = await this.saveNotification(notification);
        console.log(`Added New Notification ${JSON.stringify(response)}`);
        notification.id = response.id;
        this.sendNotification(notification);

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
        new Connector(io, socket);
    });
};

module.exports = notify;