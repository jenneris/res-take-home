
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const notify = require('./Connector');


async function saveNotification(notification) {
    console.log(`received notification.... ${notification}`);
    let data;
    if (!notification.creatorEmail) {
        data = {
            title: notification.title,
            content: ` ${notification.content}`,
            has_read: false,
            creator_id: parseInt(notification.creator_id) || 1,
            impact_area: notification.impactArea,
            impact_location: notification.impactLocation,
        }
    }
    else {
        data = {
            title: notification.title,
            content: ` ${notification.content}`,
            has_read: false,
            creator: { connect: { email: notification.creatorEmail } },
            impact_area: notification.impactArea,
            impact_location: notification.impactLocation,
        }
    }
    let response;
    try {
        response = await prisma.notification.create({
            data,
        });
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`Added New Notification ${JSON.stringify(response)}`);

    }
}

async function updateNotification(id) {
    let response;
    try {
        response = await prisma.notification.update({
            where: {
              id: parseInt(id),
            },
            data: { has_read: true },
          })
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`Updated Notification ${JSON.stringify(response)}`);
    }
}

async function getAllUsers() {
    let response;
    try {
        response = await prisma.user.findMany();

        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`Got All Users ${JSON.stringify(response)}`);
    }
}

async function createUser() {
    let response;
    try {
        response = await prisma.user.create({
            data,
          });

        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`Created User: ${JSON.stringify(response)}`);
    }
}

async function getNotificationsNotByUser(id) {
    let response;
    try {
        const response = await prisma.notification.findMany({
            where: {
              creator_id: {
                not: parseInt(id),
              },
            },
          })

        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`This Users Notifications: ${JSON.stringify(response)}`);
    }
}

async function deleteNotification(id) {
    let response;
    try {
        const response = await prisma.notification.delete({
            where: {
              id: parseInt(id),
            },
          })

        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`Deleted Notification: ${JSON.stringify(response)}`);
    }
}

async function getNotification(id) {
    let response;
    try {
        const response = await prisma.notification.findUnique({
            where: {
              id: parseInt(id),
            },
          })

        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`Deleted Notification: ${JSON.stringify(response)}`);
    }
}


async function searchNotifications(searchString) {
    let response;
    try {
        const response = await prisma.notification.findMany({
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

        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`Deleted Notification: ${JSON.stringify(response)}`);
    }
}

module.exports = { saveNotification, updateNotification, getAllUsers, createUser, getNotificationsNotByUser, deleteNotification, getNotification, searchNotifications };