const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define a basic schema and model
const userSchema = new mongoose.Schema({
  name: String,
  threads: {
    type: Map,
    of: [
      {
        input: String,
        ai: String,
      },
    ],
  },
});

const User = mongoose.model('User', userSchema);

// Define routes
app.post('/', async (req, res) => {
  const { input, ai, name, id } = req.body;

  try {
    let user = await User.findOne({ name });

    if (!user) {
      user = new User({ name, threads: new Map() });
    }

    if (user.threads.has(id)) {
      user.threads.get(id).push({ input, ai });
    } else {
      user.threads.set(id, [{ input, ai }]);
    }

    await user.save();
    res.status(200).send(user.threads);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving data');
  }
});

app.post('/threads', async (req, res) => {
  const { name } = req.body;
  try {
    let user = await User.findOne({ name });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).send(user.threads);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error retrieving data');
  }
});

app.post('/update', async (req, res) => {
  const { id, index, input } = req.body;

  try {
    let user = await User.findOne({ name: "Hello" });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    if (user.threads.has(id)) {
      user.threads.get(id)[index].input = input;
      user.threads.get(id).splice(index + 1);
    }

    await user.save();
    res.status(200).send(user.threads.get(id));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating data');
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
