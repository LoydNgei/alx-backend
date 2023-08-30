import redis from 'redis'

const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (error) => {
    console.error(`Redis client not connected to the server: ${error.message}`)
});

client.subscribe('holberton', (err, reply) => {
    if (err) {
        console.error('Error subscribing:', err);
    }
    console.log(`Subscribed to ${reply} channel(s)`);
});

client.on('message', (channel, message) => {
    console.log(`Message received on channel ${channel}: ${message}`);
    if (message === 'KILL_SERVER') {
      client.unsubscribe();
      client.quit();
    }    
})