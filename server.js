const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const OpenAI = require('openai');

console.log("Groq Key Loaded:", !!process.env.GROQ_API_KEY);

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
const User = require('./models/User');
const History = require('./models/History');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '.')));

// Setup Multer for memory storage (for disease image upload)
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB size limit


// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_crop_advisor')
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch(err => {
    console.error('MongoDB connection error. Please make sure MongoDB is running:', err);
  });

// Redirect root to welcome page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'start.html'));
});

/* ================= AUTHENTICATION ENDPOINTS ================= */

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, farmLocation } = req.body;
    if (!fullName || !email || !password || !farmLocation) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      farmLocation
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        farmLocation: savedUser.farmLocation
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        farmLocation: user.farmLocation
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/* ================= AGRICULTURAL & GEMINI ENDPOINTS ================= */

// Generate Crop Recommendation
app.post('/api/farming/recommendation', async (req, res) => {
  try {
    const { crop, soil, season } = req.body;

    const prompt = `
You are an agricultural expert.

Crop: ${crop}
Soil Type: ${soil}
Season: ${season}

Provide:
1. Crop suitability
2. Land preparation
3. Seed recommendation
4. Fertilizer schedule
5. Irrigation schedule
6. Pest management
7. Harvesting period
8. Expected yield

Format the response clearly with headings.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert agricultural advisor."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const recommendation =
      completion.choices[0].message.content;

    res.json({
      success: true,
      recommendation
    });

  } catch (error) {
    console.error("Groq Error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to generate recommendation"
    });
  }
});
// Predict Crop Disease
app.post('/api/farming/predict-disease', upload.single('image'), async (req, res) => {
  try {

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'Please upload an image'
      });
    }

    const imageBase64 = file.buffer.toString('base64');

    const response = await fetch(
      'https://crop.kindwise.com/api/v1/identification',
      {
        method: 'POST',
        headers: {
          'Api-Key': process.env.KINDWISE_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          images: [imageBase64]
        })
      }
    );

    const data = await response.json();

    res.json({
      prediction: JSON.stringify(data, null, 2)
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

// Retrieve User History
app.get('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5); // Return the 5 most recent activities

    res.json(history);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ error: 'Error fetching history logs' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Smart Crop Advisor backend server running at http://localhost:${PORT}`);
});
