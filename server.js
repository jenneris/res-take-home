
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})


async function saveNotification(notification) {
    console.log(`received notification.... ${notification}`);
    let data = {
        title: notification.title,
        content: ` ${notification.content}`,
        has_read: false,
        creator_id: parseInt(notification.creator_id) || 1,
        creator: { connect: { email: notification.creatorEmail } },
        impact_area: notification.impactArea,
        impact_location: notification.impactLocation,
    }
    let response;
    try {
        response = await prisma.notification.create({
            data,
        });
    }
    catch (e) {
        console.log(e.message);
    }
    finally {
        console.log(`1Added New Notification ${JSON.stringify(response)}`);
        return response;
    }
}

module.exports = saveNotification;