// connectToMongoDB.js
const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb+srv://snehrathi223:sneh119100@cluster0.4cxzdc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function connectToMongoDB() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Load existing models
        require('./models/usermodel'); // Assuming you have userModel.js

        // Load new models
        require('./models/note-schema');

        require('./models/tag');

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectToMongoDB;
