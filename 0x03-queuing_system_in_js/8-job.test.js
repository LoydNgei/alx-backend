const chai = require('chai');
const sinon = require('sinon');
const kue = require('kue');
const createPushNotificationsJobs = require('./8-job');
const createPushNotificationsJobs = require('./8-job');


const { expect } = chai;

describe('createPushNotificationsJobs function', function () {
  let queue;

  before(function () {
    // Set up the Kue queue in test mode
    queue = kue.createQueue({ testMode: true });
  });

  after(function () {
    // Clear the queue and exit test mode
    queue.testMode.exit();
  });

  it('should throw an error if jobs is not an array', function () {
    expect(() => createPushNotificationsJobs(null, queue)).to.throw('Jobs is not an array');
  });

  it('should create jobs in the queue and handle events', function () {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      }
      // ... (other job objects)
    ];

    createPushNotificationsJobs(jobs, queue);

    // Validate jobs in the queue
    expect(queue.testMode.jobs.length).to.equal(jobs.length);

    // Test job creation and event handling
    jobs.forEach((jobData, index) => {
      const job = queue.testMode.jobs[index];

      // Validate enqueue event
      expect(job).to.have.property('event', 'enqueue');

      // Validate job data
      expect(job.data).to.deep.equal(jobData);

      // Emit complete event and validate
      job.emit('complete');
      expect(job).to.have.property('event', 'complete');

      // Emit failed event with error and validate
      const errorMsg = 'Test error';
      job.emit('failed', new Error(errorMsg));
      expect(job).to.have.property('event', 'failed');
      expect(job).to.have.property('error', errorMsg);

      // Emit progress event and validate
      const progressValue = 50;
      job.emit('progress', progressValue);
      expect(job).to.have.property('event', 'progress');
      expect(job).to.have.property('progress', progressValue);
    });
  });
});
