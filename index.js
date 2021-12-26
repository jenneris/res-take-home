const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const socketio = require('socket.io');
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

const { notify } = require('./Connector');
const { saveNotification } = require('./server');

const PORT = process.env.PORT || 3001

// const CLIENT_ADDR = "https://jenn-test-app.herokuapp.com";
// const CLIENT_ADDR = "http://localhost:3000";

// jsonifying
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE',
  );

  // cache control
  res.setHeader('Cache-Control', 'no-cache');

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Acc' +
    'ess-Control-Request-Method, Access-Control-Request-Headers',
  );
  next();
});

app.use(express.static('build'));

app.get(`/api`, async (req, res) => {
  res.json({ up: true })
})

app.post(`/api/notification/push`, async (req, res) => {
  res.json({ up: true })
})

app.get(`/api/user`, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
})

app.post(`/api/user`, async (req, res) => {
  const user = await prisma.user.create({
    data: {
      ...req.body,
    },
  })
  res.json(user)
})

app.post(`/api/notification`, async (req, res) => {
  const { title, content, creatorEmail, impact_area, impact_location } = req.body
  const data = {
    title,
    content,
    has_read: false,
    creatorEmail,
    impactArea: impact_area,
    impactLocation: impact_location,
  };
  saveNotification(data);


  // const notifications = await prisma.notification.create({
  //   data: {
  //     title,
  //     content,
  //     has_read: false,
  //     creator: { connect: { email: creatorEmail } },
  //     impact_area,
  //     impact_location,
  //   },
  // })
  // res.json(notifications)
})

app.put('/api/notification/:id', async (req, res) => {
  const { id } = req.params
  const notifications = await prisma.notification.update({
    where: {
      id: parseInt(id),
    },
    data: { has_read: false },
  })
  res.json(notifications)
})

app.delete(`/api/notification/:id`, cors(), async (req, res) => {
  const { id } = req.params
  const notifications = await prisma.notification.delete({
    where: {
      id: parseInt(id),
    },
  })
  res.json(notifications)
})

app.get(`/api/notification/:id`, async (req, res) => {
  const { id } = req.params
  const notifications = await prisma.notification.findUnique({
    where: {
      id: parseInt(id),
    },
  })
  res.json(notifications)
})

app.get('/api/notification', async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { has_read: false },
    include: { creator: true },
  })
  res.json(notifications)
})

app.get('/api/notification', async (req, res) => {
  const { searchString } = req.query
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchString,
          },
        },
        {
          content: {
            contains: searchString,
          },
        },
      ],
    },
  })
  res.json(notifications)
})

app.get('/api/notification/user/:id', async (req, res) => {
  const { id } = req.params
  const notifications = await prisma.notification.findMany({
    where: {
      creator_id: {
        not: parseInt(id),
      },
    },
  })
  res.json(notifications)
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

notify(io);


