const kue = require('kue');

// Object containing the Job Data
const jobData = {
    phoneNumber: '0113456789',
    message: 'Hello',
}

// Queue created
const push_notification_code = kue.createQueue();

// Job created with object(jobData)
const push_notification_job = push_notification_code.create('Push_notification', jobData);

push_notification_job.on('enqueue', () => {
    console.log(`Notification job created: ${push_notification_job.id}`);
});


push_notification_job.on('complete', () => {
    console.log('Notification job completed');
});

push_notification_job.on('failed', (error) => {
    console.error('Notification job failed', (error));
});

// Save the job to queue

push_notification_job.save()