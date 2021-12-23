const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
const app = express();

const CLIENT_ADDR = "http://localhost:3000";

// options are needed for complex requests like delete
// enable pre-flight request for DELETE request
app.options('/api/notification/:id', cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_ADDR);
  next();
});

app.use(bodyParser.json());
app.use(express.static('public'));

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
  const result = await prisma.notifications.create({
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
  res.header('Access-Control-Allow-Origin', CLIENT_ADDR);
  const { id } = req.params
  const post = await prisma.notifications.update({
    where: {
      id: parseInt(id),
    },
    data: { has_read: false},
  })
  res.json(post)
})

app.delete(`/api/notification/:id`, cors(), async (req, res) => {
  // res.header('Access-Control-Allow-Origin', CLIENT_ADDR);

  const { id } = req.params
  const post = await prisma.notifications.delete({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})

app.get(`/api/notification/:id`, async (req, res) => {
  res.header('Access-Control-Allow-Origin', CLIENT_ADDR);
  const { id } = req.params
  const post = await prisma.notifications.findUnique({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})

app.get('/api/notification', async (req, res) => {
  const notifications = await prisma.notifications.findMany({
    where: { has_read: false },
    include: { creator: true },
  })
  res.json(notifications)
})

app.get('/api/filterPosts', async (req, res) => {
  const { searchString } = req.query
  const draftPosts = await prisma.notifications.findMany({
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

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () =>
  console.log(
    `🚀 Server ready at: http://localhost:${PORT}\n⭐️`,
  ),
)
