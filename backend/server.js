const express = require('express');
const cors = require('cors');
const connectToMongoDB = require('./db');
const User = require('./models/usermodel');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');


const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Connect to MongoDB
connectToMongoDB().then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.get('/', async (req, res) => {
  console.log("Request from frontend");

  try {
    await connectToMongoDB();
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error connecting to MongoDB or fetching data:', error);
    res.status(500).send('Error connecting to MongoDB or fetching data');
  }
});

// New route to fetch user by username
app.get('/user/:username', async (req, res) => {
  const username = req.params.username;

  try {
    await connectToMongoDB();
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB or fetching data:', error);
    res.status(500).send('Error connecting to MongoDB or fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
