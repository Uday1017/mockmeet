// Reset all matches for testing
// Run this with: node resetMatches.js

const mongoose = require('mongoose');
require('dotenv').config();

const resetMatches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete all matches
    const result = await mongoose.connection.db.collection('matches').deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} matches`);

    // Count users
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    // List all users
    const users = await mongoose.connection.db.collection('users')
      .find({}, { projection: { name: 1, email: 1 } })
      .toArray();
    
    console.log('\n👥 Users:');
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} (${user.email})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done! All matches cleared.');
    console.log('Now logout and login again to see all users in Discover tab.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetMatches();
