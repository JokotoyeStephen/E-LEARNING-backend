const mongoose = require('mongoose')
require('dotenv').config(); // Make sure this is at the top

module.exports = async () => {
  try {
    // Log the URI (hide password for security)
    const uri = process.env.MONGO_URI;
    console.log(uri);
    
    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    console.log('Attempting to connect to MongoDB...');
    
    const c = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ MongoDB Connected: ${c.connection.host}`)
    console.log(`📚 Database: ${c.connection.name}`)
  } catch (e) {
    console.error('❌ MongoDB error:', e.message)
    
    console.error('Please check your MONGO_URI in .env file')
    process.exit(1)
  }
}