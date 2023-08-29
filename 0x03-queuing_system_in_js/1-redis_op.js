import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});

function setNewSchool(schoolName, value) {
    client.set(schoolName, value, (err, reply) => {
        if (err) {
            console.error('Error setting the value:', err);
            return;
        } else {
            console.log('Reply:', reply);
        }
    });
}

function displaySchoolValue(schoolName) {
    client.get(schoolName, (err, value) => {
        if (err) {
            console.log('Error getting value:', err);
            return;
        } else {
        console.log(value);
        }
    });
}

// Call the functions

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
