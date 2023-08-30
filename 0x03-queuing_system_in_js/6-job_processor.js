const kue = require('kue');


// Create a queue named push_notification_code
const queue = kue.createQueue();

function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber} with message: ${message}`)
}

queue.process('Push_notification', (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message);
    done();
});

console.log('Job processor is running...')
