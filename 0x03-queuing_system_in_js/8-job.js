const kue = require('kue');

function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData);

    job.on('enqueue', () => {
      console.log(`Notification job created: ${job.id}`);
    });

    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on('failed', (error) => {
      console.log(`Notification job ${job.id} failed: ${error}`);
    });

    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });

    job.save();
  });
}

// try {
//     createPushNotificationsJobs(jobs, queue);
//     console.log('Jobs creation process is complete.');
//   } catch (error) {
//     console.error('Error:', error.message);
//   }