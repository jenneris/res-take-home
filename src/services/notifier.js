const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,   {cors: {
  origin: "*",
  methods: ["GET", "POST", "PUT"]
}});
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

const PORT = process.env.PORT || 3001

// const CLIENT_ADDR = "https://jenn-test-app.herokuapp.com";
// const CLIENT_ADDR = "http://localhost:3000";
// const HEROKU_ADDR = "https://jenn-test-app.herokuapp.com";

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

app.get(`/api/user`, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
})

app.post(`/api/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: {
      ...req.body,
    },
  })
  res.json(result)
})

app.post(`/api/notification`, async (req, res) => {
  const { title, content, creatorEmail } = req.body
  const result = await prisma.notification.create({
    data: {
      title,
      content,
      has_read: false,
      creator: { connect: { email: creatorEmail } },
    },
  })
  res.json(result)
})

app.put('/api/notification/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.notification.update({
    where: {
      id: parseInt(id),
    },
    data: { has_read: false},
  })
  res.json(post)
})

app.delete(`/api/notification/:id`, cors(), async (req, res) => {
  const { id } = req.params
  const post = await prisma.notification.delete({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})

app.get(`/api/notification/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.notification.findUnique({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})

app.get('/api/notification', async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { has_read: false },
    include: { creator: true },
  })
  res.json(notifications)
})

app.get('/api/filterPosts', async (req, res) => {
  const { searchString } = req.query
  const draftPosts = await prisma.notification.findMany({
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
  res.json(draftPosts)
})
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket config
io.on('connection', (socket) => {
  console.log('Connected');

  // On connection start pushing notifications to database
  const notificationsPush = setInterval(async() => {
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
    socket.emit('new-notification', data);
  }, 3000 + Math.floor(Math.random() * 4000));

  socket.on('disconnect', () => {
    clearInterval(notificationsPush);
    console.log('Disconnected');
  });
});
