
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const notify = require('./SocketService');


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
    try {
        response = await prisma.notification.create({
            data,
        });
        console.log(`Added New Notification ${JSON.stringify(response)}`);
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
}

async function updateNotification(id) {
    try {
        response = await prisma.notification.update({
            where: {
                id: parseInt(id),
            },
            data: { has_read: true },
        })
        console.log(`Updated Notification ${JSON.stringify(response)}`);
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
}

async function getAllUsers() {
    try {
        const response = await prisma.user.findMany();
        console.log(`Got All Users ${JSON.stringify(response)}`);
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
}

async function createUser(data) {
    try {
        response = await prisma.user.create({
            data,
        });
        console.log(`Created User: ${JSON.stringify(response)}`);
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
}

async function getNotificationsNotByUser(id) {
    try {
        const response = await prisma.notification.findMany({
            where: {
                creator_id: {
                    not: parseInt(id),
                },
            },
        })
        console.log(`This Users Notifications: ${JSON.stringify(response)}`);
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
    }
}

async function deleteNotification(id) {
    try {
        const response = await prisma.notification.delete({
            where: {
                id: parseInt(id),
            },
        })
        console.log(`Deleted Notification: ${JSON.stringify(response)}`);
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
}

async function getNotification(id) {
    try {
        response = await prisma.notification.findUnique({
            where: {
                id: parseInt(id),
            },
        })
        console.log(`Deleted Notification: ${JSON.stringify(response)}`);
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
}


async function searchNotifications(searchString) {
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
        console.log(`Deleted Notification: ${JSON.stringify(response)}`);
        return response;
    }
    catch (e) {
        console.log(e.message);
    }
}

module.exports = { saveNotification, updateNotification, getAllUsers, createUser, getNotificationsNotByUser, deleteNotification, getNotification, searchNotifications };