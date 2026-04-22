// Check database state
// Run this with: node checkDatabase.js

const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Count users
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`👥 Total users: ${userCount}`);

    // List all users
    const users = await mongoose.connection.db.collection('users')
      .find({}, { projection: { name: 1, email: 1, skillsOffered: 1, skillsWanted: 1 } })
      .toArray();
    
    console.log('\n📋 Users:');
    users.forEach((user, i) => {
      console.log(`\n${i + 1}. ${user.name} (${user.email})`);
      console.log(`   Skills Offered: ${user.skillsOffered?.join(', ') || 'None'}`);
      console.log(`   Skills Wanted: ${user.skillsWanted?.join(', ') || 'None'}`);
    });

    // Count matches
    const matchCount = await mongoose.connection.db.collection('matches').countDocuments();
    console.log(`\n🤝 Total matches: ${matchCount}`);

    if (matchCount > 0) {
      const matches = await mongoose.connection.db.collection('matches')
        .find({}, { projection: { userA: 1, userB: 1, status: 1 } })
        .toArray();
      
      console.log('\n📊 Matches:');
      for (const match of matches) {
        const userA = await mongoose.connection.db.collection('users')
          .findOne({ _id: match.userA }, { projection: { email: 1 } });
        const userB = await mongoose.connection.db.collection('users')
          .findOne({ _id: match.userB }, { projection: { email: 1 } });
        
        console.log(`   ${userA?.email} ↔ ${userB?.email} (${match.status})`);
      }
    }

    // Count sessions
    const sessionCount = await mongoose.connection.db.collection('sessions').countDocuments();
    console.log(`\n📅 Total sessions: ${sessionCount}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkDatabase();
