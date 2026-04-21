const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/edunest');
  console.log('Connected to MongoDB');
  const result = await mongoose.connection.collection('students').updateMany(
    { status: 'Pending' },
    { $set: { status: 'Active' } }
  );
  console.log(`Updated ${result.modifiedCount} students to Active`);
  await mongoose.disconnect();
}

run();
