class Connector {
    constructor(io, socket, prisma) {
      this.socket = socket;
      this.io = io;
      this.prisma = prisma;
  
      socket.on('getMessages', () => this.getMessages());
      socket.on('message', (value) => this.handleMessage(value));
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
    
    sendMessage(message) {
          // create a random notification to test with
          let title = `title ${Math.floor(Math.random())}`;
          let content = `content ${Math.floor(Math.random())}`;
          let data = {
            title,
            content,
            has_read: false,
            creator: { connect: { email: "jenn@test.com" } },
          }
          await prisma.notification.create({
            data,
          });
          console.log('Added New Notification');
      this.io.sockets.emit('new-notification', data);
    }
    
    getMessages() {
      messages.forEach((message) => this.sendMessage(message));
    }
  }