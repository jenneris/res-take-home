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

const messageExpirationTimeMS = 5*60 * 1000;

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
    
    async saveNotification(notification){
        console.log("received notification....");
        let data = {
        title: notification.title,
        content: ` content: ${notification.content}`,
        has_read: false,
        creator: { connect: { email: "jenn@test.com" } },
        }
        await prisma.notification.create({
        data,
        });
        console.log('Added New Notification');
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
    handleNotification(value) {
        const message = {
          user: users.get(this.socket) || defaultUser,
          title: value.title,
          content: value.content
        };
    
        notifications.add(message);
        this.sendNotification(message);
        this.saveNotification(message);
    
        // setTimeout(
        //   () => {
        //     notifications.delete(message);
        //     this.io.sockets.emit('deleteMessage', message.id);
        //   },
        //   messageExpirationTimeMS,
        // );
      }
  }

  function notify(io) {
    io.on('connection', (socket) => {
      new Connector(io, socket);   
    });
  };
  
  module.exports = notify;