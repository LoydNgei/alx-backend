const express = require('express');
const { promisify } = require('util');
const redis = require('redis');
const kue = require('kue');
const { Kue } = require('kue/lib/queue');

const app = express();
const queue = kue.createQueue();
const client = redis.createClient();

const reserveSeat = async (number) => {
  const setAsync = promisify(client.set).bind(client);
  await setAsync('available_seats', number.toString());
};

const getCurrentAvailableSeats = async () => {
  const getAsync = promisify(client.get).bind(client);
  const availableSeats = await getAsync('available_seats');
  return parseInt(availableSeats) || 0;
};

app.use(express.json());

app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }

  const job = queue.create('reserve_seat', {}).save((err) => {
    if (err) {
      res.json({ status: 'Reservation failed' });
    } else {
      res.json({ status: 'Reservation in process' });
    }
  });
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentAvailableSeats = await getCurrentAvailableSeats();
    if (currentAvailableSeats <= 0) {
      reservationEnabled = false;
      done(new Error('Not enough seats available'));
      return;
    }

    await reserveSeat(currentAvailableSeats - 1);
    if (currentAvailableSeats - 1 === 0) {
      reservationEnabled = false;
    }
    done();
  });
});

// Initialize the number of available seats and reservationEnabled
let reservationEnabled = true;
reserveSeat(50);

app.listen(1245, () => {
  console.log('Server is listening on port 1245');
});
